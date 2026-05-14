const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const FIXTURE_DIR = path.join(__dirname, "..", "src", "integrations", "paperclip", "fixtures");
const ROUTE = "/api/integrations/paperclip/webhook";
const SECRET = "paperclip-live-webhook-test-secret-0001";
const SOURCE_ID = "paperclip-do-dev";
const ENVIRONMENT = "dev";

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
}

function livePayload(overrides = {}) {
  const payload = readFixture("valid-paperclip-review-session.json");
  payload.requestId = overrides.requestId || "pc_live_req_20260514_001";
  payload.source.environment = overrides.environment || ENVIRONMENT;
  payload.source.workspaceId = overrides.workspaceId || "paperclip_workspace_live";
  payload.source.threadId = overrides.threadId || "paperclip_thread_live";
  payload.agent.runId = overrides.agentRunId || "run_live_20260514_001";
  payload.reviewSession.sourceUrl = "https://paperclip.trisila.online/runs/run_live_20260514_001";
  payload.tasks[0].externalTaskId = overrides.externalTaskId || "pc_live_task_001";
  if (overrides.title) payload.tasks[0].title = overrides.title;
  return payload;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, child) {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with code ${child.exitCode}`);
    }
    try {
      const res = await fetch(`${baseUrl}/api/config`);
      if (res.ok) return;
    } catch (_error) {
      // Keep polling until the local server is ready.
    }
    await delay(250);
  }
  throw new Error("Server did not become ready");
}

function canonicalWebhookString({ method = "POST", route = ROUTE, timestamp, requestId, rawBody }) {
  return [method.toUpperCase(), route, timestamp, requestId, rawBody].join("\n");
}

function signWebhook({ timestamp, requestId, rawBody, secret = SECRET }) {
  return `sha256=${crypto
    .createHmac("sha256", secret)
    .update(canonicalWebhookString({ timestamp, requestId, rawBody }))
    .digest("hex")}`;
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { status: res.status, json };
}

async function postConnection(baseUrl) {
  return requestJson(`${baseUrl}/api/integrations/paperclip/connection/connect`, {
    method: "POST",
    body: JSON.stringify({
      workspaceId: "paperclip_workspace_live",
      label: "Live Paperclip",
      sharedSecret: SECRET,
    }),
  });
}

function signedOptions(payload, overrides = {}) {
  const rawBody = JSON.stringify(payload);
  const timestamp = overrides.timestamp || new Date().toISOString();
  const requestId = overrides.requestId || payload.requestId;
  const agentRunId = overrides.agentRunId || payload.agent.runId;
  const source = overrides.source || SOURCE_ID;
  const signature = overrides.signature || signWebhook({
    timestamp,
    requestId,
    rawBody,
    secret: overrides.secret || SECRET,
  });
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-TaskHub-Request-Id": requestId,
      "X-TaskHub-Timestamp": timestamp,
      "X-TaskHub-Signature": signature,
      "X-Paperclip-Source": source,
      "X-Paperclip-Agent-Run-Id": agentRunId,
      ...(overrides.headers || {}),
    },
    body: rawBody,
  };
}

function pass(label) {
  console.log(`PASS ${label}`);
}

async function withServer(env, run) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-webhook-"));
  const storeFile = path.join(tempDir, "review-sessions.json");
  const port = 3577 + Math.floor(Math.random() * 300);
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      ...env,
      PORT: String(port),
      APP_DATA_DIR: tempDir,
      REVIEW_STORE_FILE: storeFile,
      APP_BASE_URL: baseUrl,
      PAPERCLIP_ALLOWED_SOURCE_ID: SOURCE_ID,
      PAPERCLIP_ALLOWED_ENVIRONMENT: ENVIRONMENT,
      PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS: "300",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child);
    await run({ baseUrl, storeFile, tempDir });
  } catch (error) {
    console.error(stdout);
    console.error(stderr);
    throw error;
  } finally {
    child.kill();
    await delay(100);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  await withServer({ PAPERCLIP_WEBHOOK_ENABLED: "false" }, async ({ baseUrl }) => {
    const payload = livePayload({ requestId: "pc_live_disabled_001" });
    const res = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(payload));
    assert.strictEqual(res.status, 403);
    assert.match(res.json.error, /disabled/i);
    pass("webhook is disabled unless PAPERCLIP_WEBHOOK_ENABLED=true");
  });

  await withServer({ PAPERCLIP_WEBHOOK_ENABLED: "true" }, async ({ baseUrl, storeFile }) => {
    const disconnectedPayload = livePayload({ requestId: "pc_live_disconnected_001" });
    const disconnected = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(disconnectedPayload));
    assert.strictEqual(disconnected.status, 403);
    assert.match(disconnected.json.error, /connected/i);
    pass("webhook requires Paperclip Settings connection to be enabled");

    const connected = await postConnection(baseUrl);
    assert.strictEqual(connected.status, 200);
    assert.strictEqual(connected.json.connected, true);
    assert(!JSON.stringify(connected.json).includes(SECRET), "connection response leaked signing secret");
    pass("Paperclip Settings connection provides runtime signing secret without returning it");

    const payload = livePayload();
    const created = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(payload));
    assert.strictEqual(created.status, 201);
    assert(created.json.id);
    assert.strictEqual(created.json.source, "paperclip_webhook");
    assert.strictEqual(created.json.requestId, payload.requestId);
    assert.strictEqual(created.json.externalSource.system, "paperclip");
    assert.strictEqual(created.json.externalSource.environment, ENVIRONMENT);
    assert.strictEqual(created.json.agent.runId, payload.agent.runId);
    assert.strictEqual(created.json.tasks[0].status, "pending");
    assert.strictEqual(created.json.tasks[0].externalTaskId, payload.tasks[0].externalTaskId);
    assert(created.json.payloadHash);
    assert(created.json.auditTrail.some(event => event.type === "paperclip_payload_received"));
    assert(created.json.auditTrail.some(event => event.type === "review_session_created"));
    pass("valid signed live payload creates a pending human-gated review session");

    const duplicateSame = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(payload));
    assert.strictEqual(duplicateSame.status, 200);
    assert.strictEqual(duplicateSame.json.id, created.json.id);
    assert.strictEqual(duplicateSame.json.idempotent, true);
    pass("duplicate requestId with same payload returns existing session without duplication");

    const duplicateDifferentPayload = livePayload({ title: "Changed live title" });
    const duplicateDifferent = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(duplicateDifferentPayload));
    assert.strictEqual(duplicateDifferent.status, 409);
    assert.match(duplicateDifferent.json.error, /different payload/i);
    pass("duplicate requestId with different payload is rejected");

    const badSignaturePayload = livePayload({ requestId: "pc_live_bad_sig_001" });
    const badSignature = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(badSignaturePayload, {
      signature: "sha256=0000000000000000000000000000000000000000000000000000000000000000",
    }));
    assert.strictEqual(badSignature.status, 401);
    assert.match(badSignature.json.error, /signature/i);
    pass("invalid signature is rejected");

    const oldPayload = livePayload({ requestId: "pc_live_old_ts_001" });
    const oldTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const oldTimestampRes = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(oldPayload, {
      timestamp: oldTimestamp,
    }));
    assert.strictEqual(oldTimestampRes.status, 401);
    assert.match(oldTimestampRes.json.error, /timestamp/i);
    pass("timestamp outside skew window is rejected");

    const wrongSourcePayload = livePayload({ requestId: "pc_live_wrong_source_001" });
    const wrongSource = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(wrongSourcePayload, {
      source: "unexpected-paperclip-source",
    }));
    assert.strictEqual(wrongSource.status, 403);
    assert.match(wrongSource.json.error, /source/i);
    pass("unexpected Paperclip source id is rejected");

    const wrongEnvironmentPayload = livePayload({
      requestId: "pc_live_wrong_env_001",
      environment: "mock",
    });
    const wrongEnvironment = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(wrongEnvironmentPayload));
    assert.strictEqual(wrongEnvironment.status, 400);
    assert(wrongEnvironment.json.errors.some(error => error.path === "source.environment"));
    pass("unexpected source environment is rejected by contract validation");

    const disconnectedAgain = await requestJson(`${baseUrl}/api/integrations/paperclip/connection/disconnect`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    assert.strictEqual(disconnectedAgain.status, 200);
    const afterDisconnectPayload = livePayload({ requestId: "pc_live_after_disconnect_001" });
    const afterDisconnect = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(afterDisconnectPayload));
    assert.strictEqual(afterDisconnect.status, 403);
    assert.match(afterDisconnect.json.error, /connected/i);
    pass("disconnect stops accepting new live Paperclip requests");

    const sessions = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    assert.strictEqual(sessions.length, 1);
    assert.strictEqual(sessions[0].requestId, payload.requestId);
    assert.strictEqual(sessions[0].source, "paperclip_webhook");
    pass("isolated store contains only one idempotent live Paperclip session");
  });

  console.log("Paperclip live webhook verification passed.");
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
