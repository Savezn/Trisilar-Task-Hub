const crypto = require("crypto");

const WEBHOOK_DISABLED_MESSAGE = "Paperclip live webhook is disabled";
const DEFAULT_MAX_SKEW_SECONDS = 300;

class PaperclipWebhookAuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "PaperclipWebhookAuthError";
    this.statusCode = statusCode;
  }
}

function enabledFromEnv() {
  return process.env.PAPERCLIP_WEBHOOK_ENABLED === "true";
}

function maxSkewMs() {
  const configured = Number(process.env.PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS);
  const seconds = Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_MAX_SKEW_SECONDS;
  return seconds * 1000;
}

function normalizeSignature(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/^sha256=/, "");
}

function timingSafeEqualHex(actual, expected) {
  const actualHex = normalizeSignature(actual);
  const expectedHex = normalizeSignature(expected);
  if (!/^[a-f0-9]{64}$/.test(actualHex) || !/^[a-f0-9]{64}$/.test(expectedHex)) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(actualHex, "hex"), Buffer.from(expectedHex, "hex"));
}

function canonicalWebhookString({ method, path, timestamp, requestId, rawBody }) {
  return [
    String(method || "").toUpperCase(),
    path,
    timestamp,
    requestId,
    rawBody || "",
  ].join("\n");
}

function payloadHash(rawBody) {
  return crypto.createHash("sha256").update(rawBody || "").digest("hex");
}

function signCanonical({ secret, method, path, timestamp, requestId, rawBody }) {
  return crypto
    .createHmac("sha256", secret)
    .update(canonicalWebhookString({ method, path, timestamp, requestId, rawBody }))
    .digest("hex");
}

function requireHeader(req, name) {
  const value = req.get(name);
  if (!value || !value.trim()) {
    throw new PaperclipWebhookAuthError(`${name} header is required`, 400);
  }
  return value.trim();
}

function assertTimestampWithinSkew(timestamp) {
  const parsed = Date.parse(timestamp);
  if (!Number.isFinite(parsed)) {
    throw new PaperclipWebhookAuthError("X-TaskHub-Timestamp must be a valid ISO 8601 timestamp", 400);
  }
  if (Math.abs(Date.now() - parsed) > maxSkewMs()) {
    throw new PaperclipWebhookAuthError("X-TaskHub-Timestamp is outside the allowed skew window", 401);
  }
}

function assertExpectedSource(source) {
  const expected = process.env.PAPERCLIP_ALLOWED_SOURCE_ID;
  if (!expected || !expected.trim()) {
    throw new PaperclipWebhookAuthError("PAPERCLIP_ALLOWED_SOURCE_ID must be configured", 503);
  }
  if (expected && source !== expected) {
    throw new PaperclipWebhookAuthError("X-Paperclip-Source is not allowed", 403);
  }
}

function assertBodyMatchesHeaders({ body, requestId, agentRunId }) {
  if (body?.requestId !== requestId) {
    throw new PaperclipWebhookAuthError("X-TaskHub-Request-Id must match payload requestId", 400);
  }
  if (body?.agent?.runId !== agentRunId) {
    throw new PaperclipWebhookAuthError("X-Paperclip-Agent-Run-Id must match payload agent.runId", 400);
  }
}

function assertPaperclipWebhookRequest(req, { secret }) {
  if (!enabledFromEnv()) {
    throw new PaperclipWebhookAuthError(WEBHOOK_DISABLED_MESSAGE, 403);
  }
  if (typeof secret !== "string" || secret.trim().length < 16) {
    throw new PaperclipWebhookAuthError("Paperclip connection must be connected with a runtime signing secret", 403);
  }

  const rawBody = typeof req.rawBody === "string" ? req.rawBody : "";
  const requestId = requireHeader(req, "X-TaskHub-Request-Id");
  const timestamp = requireHeader(req, "X-TaskHub-Timestamp");
  const signature = requireHeader(req, "X-TaskHub-Signature");
  const source = requireHeader(req, "X-Paperclip-Source");
  const agentRunId = requireHeader(req, "X-Paperclip-Agent-Run-Id");

  assertTimestampWithinSkew(timestamp);
  assertExpectedSource(source);
  assertBodyMatchesHeaders({ body: req.body, requestId, agentRunId });

  const expectedSignature = signCanonical({
    secret: secret.trim(),
    method: req.method,
    path: req.originalUrl.split("?")[0],
    timestamp,
    requestId,
    rawBody,
  });
  if (!timingSafeEqualHex(signature, expectedSignature)) {
    throw new PaperclipWebhookAuthError("X-TaskHub-Signature is invalid", 401);
  }

  return {
    requestId,
    timestamp,
    source,
    agentRunId,
    payloadHash: payloadHash(rawBody),
  };
}

module.exports = {
  PaperclipWebhookAuthError,
  assertPaperclipWebhookRequest,
  canonicalWebhookString,
  payloadHash,
  signCanonical,
};
