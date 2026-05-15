const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const FIXTURE_DIR = path.join(__dirname, "..", "src", "integrations", "paperclip", "fixtures");
const ROUTE = "/api/integrations/paperclip/webhook";
const PROD_HOSTNAME = "https://taskhub-prod.trisila.online";
const SECRET = "paperclip-production-webhook-test-secret-0001";
const SOURCE_ID = "paperclip-do-prod";
const ENVIRONMENT = "production";

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
}

function productionPayload(overrides = {}) {
  const payload = readFixture("valid-paperclip-review-session.json");
  payload.requestId = overrides.requestId || "pc_prod_req_20260515_001";
  payload.source.environment = overrides.environment || ENVIRONMENT;
  payload.source.workspaceId = overrides.workspaceId || "paperclip_workspace_prod";
  payload.source.threadId = overrides.threadId || "paperclip_thread_prod";
  payload.agent.runId = overrides.agentRunId || "run_prod_20260515_001";
  payload.reviewSession.sourceUrl = "https://paperclip.trisila.online/runs/run_prod_20260515_001";
  payload.tasks[0].externalTaskId = overrides.externalTaskId || "pc_prod_task_001";
  payload.tasks[0].syncCalendar = false;
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

function signWebhook({ timestamp, requestId, rawBody, secret = SECRET }) {
  const canonical = ["POST", ROUTE, timestamp, requestId, rawBody].join("\n");
  return `sha256=${crypto.createHmac("sha256", secret).update(canonical).digest("hex")}`;
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

function signedOptions(payload, overrides = {}) {
  const rawBody = JSON.stringify(payload);
  const timestamp = overrides.timestamp || new Date().toISOString();
  const requestId = overrides.requestId || payload.requestId;
  const agentRunId = overrides.agentRunId || payload.agent.runId;
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-TaskHub-Request-Id": requestId,
      "X-TaskHub-Timestamp": timestamp,
      "X-TaskHub-Signature": overrides.signature || signWebhook({
        timestamp,
        requestId,
        rawBody,
        secret: overrides.secret || SECRET,
      }),
      "X-Paperclip-Source": overrides.source || SOURCE_ID,
      "X-Paperclip-Agent-Run-Id": agentRunId,
      ...(overrides.headers || {}),
    },
    body: rawBody,
  };
}

async function connectPaperclip(baseUrl) {
  const connected = await requestJson(`${baseUrl}/api/integrations/paperclip/connection/connect`, {
    method: "POST",
    body: JSON.stringify({
      workspaceId: "paperclip_workspace_prod",
      label: "Production Paperclip",
      sharedSecret: SECRET,
    }),
  });
  assert.strictEqual(connected.status, 200);
  assert.strictEqual(connected.json.connected, true);
  assert(!JSON.stringify(connected.json).includes(SECRET), "connection response leaked signing secret");
  return connected.json;
}

function warningCodes(status) {
  return (status.warnings || []).map(warning => warning.code);
}

function dangerCodes(status) {
  return (status.warnings || [])
    .filter(warning => warning.level === "danger")
    .map(warning => warning.code);
}

function pass(label) {
  console.log(`PASS ${label}`);
}

async function withServer(env, run) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-prod-"));
  const storeFile = path.join(tempDir, "review-sessions.json");
  const port = 4077 + Math.floor(Math.random() * 300);
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      APP_BASE_URL: PROD_HOSTNAME,
      APP_DATA_DIR: tempDir,
      REVIEW_STORE_FILE: storeFile,
      TASKHUB_RUNTIME_PROFILE: "production",
      TASKHUB_PRODUCTION_HOSTNAME: PROD_HOSTNAME,
      PAPERCLIP_ALLOWED_SOURCE_ID: SOURCE_ID,
      PAPERCLIP_ALLOWED_ENVIRONMENT: ENVIRONMENT,
      PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS: "300",
      ...env,
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

async function assertOperationsStatus(baseUrl, expected) {
  const status = await requestJson(`${baseUrl}/api/integrations/paperclip/operations/status`);
  assert.strictEqual(status.status, 200);
  assert.strictEqual(status.json.mode, "read_only");
  assert.strictEqual(status.json.runtime.profile, "production");
  assert.strictEqual(status.json.runtime.liveMode, expected.liveMode);
  assert.strictEqual(status.json.runtime.productionHostname, PROD_HOSTNAME);
  assert.strictEqual(status.json.runtime.appBaseUrl, PROD_HOSTNAME);
  assert.strictEqual(status.json.runtime.dataDirConfigured, true);
  assert.strictEqual(status.json.liveWebhook.enabled, expected.webhookEnabled);
  assert(!warningCodes(status.json).includes("standing_dev_demo_enabled"));
  assert.deepStrictEqual(dangerCodes(status.json), []);
  return status.json;
}

async function main() {
  await withServer({
    PAPERCLIP_WEBHOOK_ENABLED: "false",
    PAPERCLIP_LIVE_MODE: "disabled",
  }, async ({ baseUrl }) => {
    await assertOperationsStatus(baseUrl, {
      liveMode: "disabled",
      webhookEnabled: false,
    });
    pass("production disabled mode reports production runtime without danger warnings");

    const disabled = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(productionPayload({
      requestId: "pc_prod_disabled_001",
    })));
    assert.strictEqual(disabled.status, 403);
    assert.match(disabled.json.error, /disabled/i);
    pass("production webhook rejects signed payload while hard gate is disabled");
  });

  await withServer({
    PAPERCLIP_WEBHOOK_ENABLED: "true",
    PAPERCLIP_LIVE_MODE: "staged",
  }, async ({ baseUrl }) => {
    await connectPaperclip(baseUrl);
    const initialStatus = await assertOperationsStatus(baseUrl, {
      liveMode: "staged",
      webhookEnabled: true,
    });
    assert(warningCodes(initialStatus).includes("production_staged_live_enabled"));
    pass("production staged mode reports production-specific live warning");

    const payload = productionPayload();
    const created = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(payload));
    assert.strictEqual(created.status, 201);
    assert.strictEqual(created.json.source, "paperclip_webhook");
    assert.strictEqual(created.json.externalSource.environment, ENVIRONMENT);
    assert.strictEqual(created.json.tasks[0].status, "pending");
    assert(!created.json.tasks[0].trelloCardId);
    pass("production signed payload creates a pending review session without Trello link");

    const duplicateSame = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(payload));
    assert.strictEqual(duplicateSame.status, 200);
    assert.strictEqual(duplicateSame.json.idempotent, true);
    pass("production duplicate requestId with same payload is idempotent");

    const duplicateDifferent = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(productionPayload({
      title: "Changed production title",
    })));
    assert.strictEqual(duplicateDifferent.status, 409);
    pass("production duplicate requestId with different payload is rejected");

    const badSignature = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(productionPayload({
      requestId: "pc_prod_bad_sig_001",
    }), {
      signature: "sha256=0000000000000000000000000000000000000000000000000000000000000000",
    }));
    assert.strictEqual(badSignature.status, 401);
    pass("production invalid signature is rejected");

    const wrongSource = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(productionPayload({
      requestId: "pc_prod_wrong_source_001",
    }), {
      source: "paperclip-do-dev",
    }));
    assert.strictEqual(wrongSource.status, 403);
    pass("production invalid source is rejected");

    const wrongEnvironment = await requestJson(`${baseUrl}${ROUTE}`, signedOptions(productionPayload({
      requestId: "pc_prod_wrong_env_001",
      environment: "dev",
    })));
    assert.strictEqual(wrongEnvironment.status, 400);
    assert(wrongEnvironment.json.errors.some(error => error.path === "source.environment"));
    pass("production invalid environment is rejected");

    const finalStatus = await assertOperationsStatus(baseUrl, {
      liveMode: "staged",
      webhookEnabled: true,
    });
    assert.strictEqual(finalStatus.reviewQueue.pending, 1);
    assert.strictEqual(finalStatus.reviewQueue.trelloLinked, 0);
    pass("production operations status keeps read-only review queue evidence");
  });

  console.log("Paperclip production readiness verification passed.");
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
