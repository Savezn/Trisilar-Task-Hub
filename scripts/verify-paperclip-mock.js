const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const FIXTURE_DIR = path.join(__dirname, "..", "src", "integrations", "paperclip", "fixtures");
const ROUTE = "/api/integrations/paperclip/mock/review-session";

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
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

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, json };
}

function pass(label) {
  console.log(`PASS ${label}`);
}

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-"));
  const storeFile = path.join(tempDir, "review-sessions.json");
  const port = 3197 + Math.floor(Math.random() * 200);
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      REVIEW_STORE_FILE: storeFile,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child);
    pass("server started with isolated review store");

    const valid = readFixture("valid-paperclip-review-session.json");
    const created = await postJson(`${baseUrl}${ROUTE}`, valid);
    assert.strictEqual(created.status, 201);
    assert(created.json.id);
    assert.strictEqual(created.json.source, "paperclip_mock");
    assert.strictEqual(created.json.requestId, valid.requestId);
    assert.strictEqual(created.json.externalSource.system, "paperclip");
    assert.strictEqual(created.json.externalSource.environment, "mock");
    assert.strictEqual(created.json.agent.runId, valid.agent.runId);
    assert.strictEqual(created.json.tasks.length, 1);
    assert.strictEqual(created.json.tasks[0].externalTaskId, valid.tasks[0].externalTaskId);
    assert.strictEqual(created.json.tasks[0].createdByAgent.agentId, valid.agent.agentId);
    assert.strictEqual(created.json.tasks[0].status, "pending");
    assert(created.json.auditTrail.some(event => event.type === "paperclip_payload_received"));
    assert(created.json.auditTrail.some(event => event.type === "review_session_created"));
    assert(created.json.tasks[0].auditTrail.some(event => event.type === "task_diff_resolved"));
    pass("valid mock payload creates persisted review session");

    const fetched = await fetch(`${baseUrl}/api/reviews/${created.json.id}`);
    assert.strictEqual(fetched.status, 200);
    const persisted = await fetched.json();
    assert.strictEqual(persisted.requestId, valid.requestId);
    assert.strictEqual(persisted.tasks[0].sourceEvidence[0].type, "transcript_excerpt");
    assert.strictEqual(persisted.tasks[0].trelloCardId, null);
    pass("created session can be fetched through existing review API");

    const duplicate = await postJson(`${baseUrl}${ROUTE}`, readFixture("duplicate-request-id.json"));
    assert.strictEqual(duplicate.status, 409);
    assert.strictEqual(duplicate.json.existingSessionId, created.json.id);
    pass("duplicate requestId is rejected without creating another session");

    const invalid = await postJson(`${baseUrl}${ROUTE}`, readFixture("missing-required-fields.json"));
    assert.strictEqual(invalid.status, 400);
    assert(invalid.json.errors.some(error => error.path === "requestId"));
    assert(invalid.json.errors.some(error => error.path === "tasks[0].title"));
    pass("invalid mock payload returns field-level validation errors");

    const sessions = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    assert.strictEqual(sessions.length, 1);
    assert.strictEqual(sessions[0].requestId, valid.requestId);
    pass("isolated store contains only one idempotent Paperclip session");

    console.log("Paperclip mock route verification passed.");
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

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
