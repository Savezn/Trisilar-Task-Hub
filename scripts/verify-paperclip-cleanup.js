const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

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
  return { status: res.status, json };
}

async function postReviewSession(baseUrl, body) {
  return requestJson(`${baseUrl}/api/reviews`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function paperclipTestSessionInput(overrides = {}) {
  const requestId = overrides.requestId || "pc_live_interop_cleanup_001";
  const agentRunId = overrides.agentRunId || "run_live_interop_cleanup_001";
  return {
    title: overrides.title || "Paperclip live interop cleanup test",
    source: overrides.source || "paperclip_webhook",
    summary: "Seeded local cleanup verification session.",
    transcript: "No live webhook was sent by this verification.",
    requestId,
    payloadHash: "cleanup-test-payload-hash",
    externalSource: {
      system: "paperclip",
      environment: "dev",
      workspaceId: "paperclip_workspace_live",
      threadId: "paperclip_thread_live",
      sourceUrl: `https://paperclip.trisila.online/runs/${agentRunId}`,
      sourceCreatedAt: "2026-05-14T00:00:00.000Z",
    },
    agent: {
      agentId: "agent_cleanup_01",
      agentName: "Paperclip Cleanup Test Agent",
      agentRole: overrides.agentRole || "interop_test",
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
        payloadHash: "cleanup-test-payload-hash",
      },
    ],
    tasks: [
      {
        externalTaskId: "pc_live_cleanup_task_001",
        title: "Cleanup Paperclip live interop artifact",
        description: "This task should be safely rejected by the cleanup action.",
        priority: "medium",
        projectReference: "W3 live cleanup",
        targetBoardId: "",
        targetListId: "",
        confidence: 0.8,
        syncCalendar: true,
        syncGoogleTasks: true,
        agentRationale: "Verify cleanup preserves traceability and avoids external side effects.",
        sourceEvidence: [
          {
            type: "interop_test",
            text: "Short bounded cleanup evidence.",
            sourceOffset: 0,
          },
        ],
        createdByAgent: {
          agentId: "agent_cleanup_01",
          agentName: "Paperclip Cleanup Test Agent",
          runId: agentRunId,
        },
        auditTrail: [
          {
            type: "task_diff_resolved",
            actor: "system",
            at: "2026-05-14T00:00:00.000Z",
            externalTaskId: "pc_live_cleanup_task_001",
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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-cleanup-"));
  const storeFile = path.join(tempDir, "review-sessions.json");
  const port = 3940 + Math.floor(Math.random() * 300);
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      APP_DATA_DIR: tempDir,
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

    const seeded = await postReviewSession(baseUrl, paperclipTestSessionInput());
    assert.strictEqual(seeded.status, 200);
    assert.strictEqual(seeded.json.source, "paperclip_webhook");
    assert.strictEqual(seeded.json.tasks[0].status, "pending");
    assert.strictEqual(seeded.json.tasks[0].syncCalendar, true);
    assert.strictEqual(seeded.json.tasks[0].syncGoogleTasks, true);
    pass("seeded local Paperclip test session without sending a webhook");

    const rejectedReal = await postReviewSession(baseUrl, paperclipTestSessionInput({
      requestId: "pc_real_customer_work_001",
      title: "Paperclip real customer work",
      agentRunId: "run_real_customer_work_001",
      agentRole: "task_agent",
    }));
    assert.strictEqual(rejectedReal.status, 200);
    const blocked = await requestJson(`${baseUrl}/api/reviews/${rejectedReal.json.id}/paperclip-test-cleanup`, {
      method: "POST",
      body: JSON.stringify({ reason: "Should not clean real Paperclip work" }),
    });
    assert.strictEqual(blocked.status, 409);
    assert.match(blocked.json.error, /not a Paperclip test/i);
    pass("cleanup refuses Paperclip sessions that are not classified as test or canary");

    const cleanup = await requestJson(`${baseUrl}/api/reviews/${seeded.json.id}/paperclip-test-cleanup`, {
      method: "POST",
      body: JSON.stringify({ reason: "Remove W3 live interop artifacts from pending queue" }),
    });
    assert.strictEqual(cleanup.status, 200);
    assert.strictEqual(cleanup.json.id, seeded.json.id);
    assert.strictEqual(cleanup.json.paperclipCleanup.status, "cleaned");
    assert.strictEqual(cleanup.json.paperclipCleanup.cleanedTaskCount, 1);
    assert.strictEqual(cleanup.json.paperclipCleanup.skippedTaskCount, 0);
    assert.strictEqual(cleanup.json.requestId, "pc_live_interop_cleanup_001");
    assert.strictEqual(cleanup.json.agent.runId, "run_live_interop_cleanup_001");
    assert.strictEqual(cleanup.json.externalSource.environment, "dev");
    assert.strictEqual(cleanup.json.tasks[0].status, "rejected");
    assert.strictEqual(cleanup.json.tasks[0].trelloCardId, null);
    assert.strictEqual(cleanup.json.tasks[0].externalTaskId, "pc_live_cleanup_task_001");
    assert(cleanup.json.auditTrail.some(event => event.type === "paperclip_test_cleanup_applied"));
    assert(cleanup.json.tasks[0].auditTrail.some(event => event.type === "paperclip_test_task_cleanup_rejected"));
    pass("cleanup rejects pending Paperclip test tasks and preserves traceability");

    const dismissCleaned = await requestJson(`${baseUrl}/api/reviews/${seeded.json.id}`, {
      method: "DELETE",
    });
    assert.strictEqual(dismissCleaned.status, 409);
    assert.match(dismissCleaned.json.error, /audit trace/i);
    pass("cleaned Paperclip sessions cannot be dismissed because audit trace must be retained");

    const sessions = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    const cleaned = sessions.find(session => session.id === seeded.json.id);
    assert(cleaned, "cleaned session was removed instead of retained");
    assert.strictEqual(cleaned.tasks[0].status, "rejected");
    assert.strictEqual(cleaned.tasks[0].trelloCardId, null);
    assert.strictEqual(cleaned.tasks[0].syncCalendar, true);
    assert.strictEqual(cleaned.tasks[0].syncGoogleTasks, true);
    const counts = sessions.reduce((acc, session) => {
      for (const task of session.tasks || []) {
        acc[task.status] = (acc[task.status] || 0) + 1;
        if (task.trelloCardId) acc.trelloLinked += 1;
      }
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, trelloLinked: 0 });
    assert.strictEqual(counts.pending, 1);
    assert.strictEqual(counts.approved, 0);
    assert.strictEqual(counts.rejected, 1);
    assert.strictEqual(counts.trelloLinked, 0);
    pass("cleanup before/after counts avoid approval and external side effects");

    const reviewJs = fs.readFileSync(path.join(__dirname, "..", "public", "js", "pages", "review.js"), "utf8");
    assert(reviewJs.includes("isPaperclipCleanupLocked"));
    assert(reviewJs.includes("allProcessed && !dismissLocked"));
    pass("Review Queue UI hides dismiss affordance for cleaned Paperclip audit sessions");

    console.log("Paperclip cleanup verification passed.");
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
