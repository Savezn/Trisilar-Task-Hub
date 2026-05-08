const fs = require("fs");
const { getAppBaseUrl, getDataFilePath } = require("../../utils/runtime");

const CONNECTION_FILE = getDataFilePath("paperclip-connection.json");
const WEBHOOK_PATH = "/api/integrations/paperclip/webhook";
const VALID_STATUSES = new Set(["not_connected", "connected", "disabled"]);

class PaperclipConnectionError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "PaperclipConnectionError";
    this.statusCode = statusCode;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function defaultConnection() {
  return {
    status: "not_connected",
    workspaceId: "",
    label: "",
    connectedAt: null,
    disabledAt: null,
    secretUpdatedAt: null,
    updatedAt: null,
    secret: "",
  };
}

function normalizeConnection(value) {
  const base = defaultConnection();
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  const status = VALID_STATUSES.has(value.status) ? value.status : base.status;
  return {
    ...base,
    ...value,
    status,
    workspaceId: cleanText(value.workspaceId),
    label: cleanText(value.label),
    secret: typeof value.secret === "string" ? value.secret : "",
  };
}

function readPaperclipConnectionRaw() {
  try {
    return normalizeConnection(JSON.parse(fs.readFileSync(CONNECTION_FILE, "utf8")));
  } catch (error) {
    if (error.code === "ENOENT") return defaultConnection();
    throw error;
  }
}

function writePaperclipConnectionRaw(connection) {
  fs.writeFileSync(CONNECTION_FILE, JSON.stringify(normalizeConnection(connection), null, 2));
}

function secretPreview(secret) {
  if (!secret) return "";
  return "configured";
}

function publicPaperclipConnection(connection = readPaperclipConnectionRaw()) {
  const normalized = normalizeConnection(connection);
  return {
    status: normalized.status,
    connected: normalized.status === "connected",
    hasSecret: Boolean(normalized.secret),
    secretPreview: secretPreview(normalized.secret),
    workspaceId: normalized.workspaceId,
    label: normalized.label,
    webhookPath: WEBHOOK_PATH,
    webhookUrl: `${getAppBaseUrl()}${WEBHOOK_PATH}`,
    connectedAt: normalized.connectedAt,
    disabledAt: normalized.disabledAt,
    secretUpdatedAt: normalized.secretUpdatedAt,
    updatedAt: normalized.updatedAt,
  };
}

function requireSharedSecret(value) {
  const sharedSecret = cleanText(value);
  if (sharedSecret.length < 16) {
    throw new PaperclipConnectionError("sharedSecret must be at least 16 characters");
  }
  return sharedSecret;
}

function connectPaperclipConnection(input = {}) {
  const current = readPaperclipConnectionRaw();
  const at = nowIso();
  const next = {
    ...current,
    status: "connected",
    workspaceId: cleanText(input.workspaceId),
    label: cleanText(input.label),
    connectedAt: current.connectedAt || at,
    disabledAt: null,
    secret: requireSharedSecret(input.sharedSecret),
    secretUpdatedAt: at,
    updatedAt: at,
  };
  writePaperclipConnectionRaw(next);
  return publicPaperclipConnection(next);
}

function disconnectPaperclipConnection() {
  const current = readPaperclipConnectionRaw();
  const at = nowIso();
  const next = {
    ...current,
    status: "disabled",
    disabledAt: at,
    secret: "",
    updatedAt: at,
  };
  writePaperclipConnectionRaw(next);
  return publicPaperclipConnection(next);
}

function rotatePaperclipSecret(input = {}) {
  const current = readPaperclipConnectionRaw();
  if (current.status !== "connected") {
    throw new PaperclipConnectionError("Paperclip must be connected before rotating the secret", 409);
  }
  const at = nowIso();
  const next = {
    ...current,
    secret: requireSharedSecret(input.sharedSecret),
    secretUpdatedAt: at,
    updatedAt: at,
  };
  writePaperclipConnectionRaw(next);
  return publicPaperclipConnection(next);
}

module.exports = {
  WEBHOOK_PATH,
  PaperclipConnectionError,
  connectPaperclipConnection,
  disconnectPaperclipConnection,
  publicPaperclipConnection,
  readPaperclipConnectionRaw,
  rotatePaperclipSecret,
};
