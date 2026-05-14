const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const SECRET = "paperclip-ops-secret-0001";

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

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch (_error) {
    json = { rawBody: text };
  }
  return { status: res.status, json, text };
}

async function postJson(url, body) {
  return requestJson(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function paperclipSessionInput({ requestId, agentRunId, title, role = "interop_test" }) {
  return {
    title,
    source: "paperclip_webhook",
    summary: "Seeded local Paperclip operations verification session.",
    transcript: "No live webhook was sent by this verification.",
    requestId,
    payloadHash: `${requestId}-payload-hash`,
    externalSource: {
      system: "paperclip",
      environment: "dev",
      workspaceId: "paperclip_workspace_ops",
      threadId: "paperclip_thread_ops",
      sourceUrl: `https://paperclip.trisila.online/runs/${agentRunId}`,
      sourceCreatedAt: "2026-05-14T00:00:00.000Z",
    },
    agent: {
      agentId: "agent_ops_01",
      agentName: "Paperclip Ops Test Agent",
      agentRole: role,
      runId: agentRunId,
      parentRunId: null,
    },
    auditTrail: [
      {
        type: "paperclip_payload_received",
        actor: "system",
        at: "2026-05-14T00:00:00.000Z",
        requestId,
        sourceId: "paperclip-do-dev",
        agentRunId,
        payloadHash: `${requestId}-payload-hash`,
      },
      {
        type: "review_session_created",
        actor: "system",
        at: "2026-05-14T00:00:01.000Z",
        sessionId: "seeded-by-ops-verification",
        sourceEnvironment: "dev",
        taskCount: 1,
      },
      {
        type: "paperclip_duplicate_payload_ignored",
        actor: "system",
        at: "2026-05-14T00:00:02.000Z",
        requestId,
        payloadHash: `${requestId}-payload-hash`,
      },
      {
        type: "paperclip_duplicate_payload_rejected",
        actor: "system",
        at: "2026-05-14T00:00:03.000Z",
        requestId,
        payloadHash: `${requestId}-changed-payload-hash`,
        existingPayloadHash: `${requestId}-payload-hash`,
      },
    ],
    tasks: [
      {
        externalTaskId: `${requestId}_task_001`,
        title,
        description: "Pending until a human reviewer approves or rejects it.",
        priority: "medium",
        projectReference: "W3 operations hardening",
        targetBoardId: "",
        targetListId: "",
        confidence: 0.8,
        syncCalendar: true,
        syncGoogleTasks: true,
        agentRationale: "Verify Paperclip operations status summarizes existing runtime state.",
        sourceEvidence: [
          {
            type: "ops_verification",
            text: "Short bounded operations evidence.",
            sourceOffset: 0,
          },
        ],
        createdByAgent: {
          agentId: "agent_ops_01",
          agentName: "Paperclip Ops Test Agent",
          runId: agentRunId,
        },
        auditTrail: [
          {
            type: "task_diff_resolved",
            actor: "system",
            at: "2026-05-14T00:00:00.000Z",
            externalTaskId: `${requestId}_task_001`,
            diffStatus: "create_new",
          },
        ],
      },
    ],
  };
}

function pass(label) {
  console.log(`PASS ${label}`);
}

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-operations-"));
  const storeFile = path.join(tempDir, "review-sessions.json");
  const port = 4240 + Math.floor(Math.random() * 300);
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      APP_DATA_DIR: tempDir,
      REVIEW_STORE_FILE: storeFile,
      APP_BASE_URL: "https://taskhub-dev.example.test",
      PAPERCLIP_WEBHOOK_ENABLED: "true",
      PAPERCLIP_ALLOWED_SOURCE_ID: "paperclip-do-dev",
      PAPERCLIP_ALLOWED_ENVIRONMENT: "dev",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child);
    pass("server started with isolated runtime data");

    const connect = await postJson(`${baseUrl}/api/integrations/paperclip/connection/connect`, {
      workspaceId: "paperclip_workspace_ops",
      label: "Ops Verification",
      sharedSecret: SECRET,
    });
    assert.strictEqual(connect.status, 200);
    assert.strictEqual(connect.json.connected, true);
    assert.strictEqual(connect.json.hasSecret, true);
    assert(!JSON.stringify(connect.json).includes(SECRET), "connection response leaked signing secret");
    pass("Paperclip Settings is connected without returning secret");

    const pending = await postJson(`${baseUrl}/api/reviews`, paperclipSessionInput({
      requestId: "pc_standing_ops_pending_001",
      agentRunId: "run_ops_pending_001",
      title: "Paperclip standing ops pending test",
    }));
    assert.strictEqual(pending.status, 200);

    const cleanupSeed = await postJson(`${baseUrl}/api/reviews`, paperclipSessionInput({
      requestId: "pc_live_interop_ops_cleanup_001",
      agentRunId: "run_ops_cleanup_001",
      title: "Paperclip live interop cleanup ops test",
    }));
    assert.strictEqual(cleanupSeed.status, 200);

    const cleanup = await postJson(`${baseUrl}/api/reviews/${cleanupSeed.json.id}/paperclip-test-cleanup`, {
      reason: "Ops verification cleanup",
    });
    assert.strictEqual(cleanup.status, 200);
    assert.strictEqual(cleanup.json.paperclipCleanup.status, "cleaned");
    pass("seeded pending and cleaned Paperclip sessions without sending a webhook");

    const before = await requestJson(`${baseUrl}/api/reviews`);
    assert.strictEqual(before.status, 200);
    const operations = await requestJson(`${baseUrl}/api/integrations/paperclip/operations/status`);
    assert.strictEqual(operations.status, 200);
    const bodyText = JSON.stringify(operations.json);
    assert(!bodyText.includes(SECRET), "operations status leaked signing secret");
    assert.strictEqual(operations.json.liveWebhook.enabled, true);
    assert.strictEqual(operations.json.liveWebhook.allowedSourceId, "paperclip-do-dev");
    assert.strictEqual(operations.json.liveWebhook.allowedEnvironment, "dev");
    assert.strictEqual(operations.json.connection.connected, true);
    assert.strictEqual(operations.json.connection.hasSecret, true);
    assert.strictEqual(operations.json.reviewQueue.paperclipSessions, 2);
    assert.strictEqual(operations.json.reviewQueue.paperclipTasks, 2);
    assert.strictEqual(operations.json.reviewQueue.pending, 1);
    assert.strictEqual(operations.json.reviewQueue.approved, 0);
    assert.strictEqual(operations.json.reviewQueue.rejected, 1);
    assert.strictEqual(operations.json.reviewQueue.cleanedSessions, 1);
    assert.strictEqual(operations.json.reviewQueue.trelloLinked, 0);
    assert.strictEqual(operations.json.audit.accepted.paperclip_payload_received, 2);
    assert.strictEqual(operations.json.audit.accepted.review_session_created, 2);
    assert.strictEqual(operations.json.audit.replay.paperclip_duplicate_payload_ignored, 2);
    assert.strictEqual(operations.json.audit.rejected.paperclip_duplicate_payload_rejected, 2);
    assert(operations.json.warnings.some(warning => warning.code === "standing_dev_demo_enabled"));
    pass("operations status summarizes live gate, connection, counts, cleanup, and audit categories");

    const after = await requestJson(`${baseUrl}/api/reviews`);
    assert.deepStrictEqual(after.json, before.json);
    pass("operations status is read-only and does not create canaries or Review Queue mutations");

    console.log("Paperclip operations verification passed.");
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
