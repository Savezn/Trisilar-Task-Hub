const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const {
  DOCS_CONTRACT_VERSION,
  normalizePaperclipDocsPayload,
} = require("../src/integrations/paperclip/documents-contract");

const FIXTURE = path.join(
  __dirname,
  "..",
  "src",
  "integrations",
  "paperclip",
  "fixtures",
  "document-artifacts.json"
);
const REVIEW_FIXTURE = path.join(
  __dirname,
  "..",
  "src",
  "integrations",
  "paperclip",
  "fixtures",
  "valid-paperclip-review-session.json"
);

function readFixture() {
  return JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, child) {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (child.exitCode !== null) throw new Error(`Server exited early with code ${child.exitCode}`);
    try {
      const res = await fetch(`${baseUrl}/healthz`);
      if (res.ok) return;
    } catch (_error) {
      // Poll until the local server is ready.
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
  const fixture = readFixture();
  const normalized = normalizePaperclipDocsPayload(fixture);
  assert.strictEqual(normalized.contractVersion, DOCS_CONTRACT_VERSION);
  assert.strictEqual(normalized.source.system, "paperclip");
  assert.strictEqual(normalized.source.environment, "mock");
  assert.strictEqual(normalized.documents.length, 2);
  assert.strictEqual(normalized.documents[0].artifactId, "doc_weekly_marketing_sync");
  assert.strictEqual(normalized.documents[0].content.format, "markdown");
  assert(normalized.documents[0].content.text.includes("Weekly Marketing Sync"));
  assert.strictEqual(normalized.documents[0].agent.runId, fixture.agent.runId);
  assert.strictEqual(normalized.documents[0].linkedTasks.length, 1);
  assert.deepStrictEqual(normalized.documents[0].linkedTasks[0], {
    requestId: "pc_req_20260508_001",
    externalTaskId: "pc_task_001",
    title: "Prepare campaign brief",
    relationship: "supports",
    anchorText: "Prepare campaign brief draft",
  });
  pass("document fixture normalizes through contract");

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-docs-"));
  const port = 3400 + Math.floor(Math.random() * 200);
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      APP_DATA_DIR: tempDir,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child);
    const res = await fetch(`${baseUrl}/api/integrations/paperclip/mock/docs`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.source.environment, "mock");
    assert.strictEqual(body.mode, "mock");
    assert.strictEqual(body.documents.length, 2);
    assert.strictEqual(body.documents[1].artifactId, "doc_child_agent_execution_notes");
    assert.strictEqual(body.documents[0].linkedTasks[0].externalTaskId, "pc_task_001");
    assert(!JSON.stringify(body).includes("PAPERCLIP_WEBHOOK_SIGNING_SECRET"));
    pass("mock docs endpoint returns local contract data only");

    const reviewFixture = JSON.parse(fs.readFileSync(REVIEW_FIXTURE, "utf8"));
    const created = await postJson(`${baseUrl}/api/integrations/paperclip/mock/review-session`, reviewFixture);
    assert.strictEqual(created.status, 201);
    const linkedDoc = body.documents.find(doc => (doc.linkedTasks || []).some(link =>
      link.requestId === created.json.requestId &&
      link.externalTaskId === created.json.tasks[0].externalTaskId
    ));
    assert(linkedDoc);
    assert.strictEqual(linkedDoc.artifactId, "doc_weekly_marketing_sync");
    const fetchedReview = await fetch(`${baseUrl}/api/reviews/${created.json.id}`);
    assert.strictEqual(fetchedReview.status, 200);
    const persistedReview = await fetchedReview.json();
    assert.strictEqual(persistedReview.tasks[0].externalTaskId, "pc_task_001");
    pass("mock document artifact links to persisted Review Queue task");

    const html = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
    assert(html.includes('data-page="docs"'));
    assert(html.includes('js/pages/docs.js'));
    pass("Docs page is wired into static shell");

    const router = fs.readFileSync(path.join(__dirname, "..", "public", "js", "router.js"), "utf8");
    assert(router.includes('docs: "/docs"'));
    assert(router.includes("showDocsPage"));
    pass("Docs page route is registered");

    const docsPage = fs.readFileSync(path.join(__dirname, "..", "public", "js", "pages", "docs.js"), "utf8");
    assert(docsPage.includes("renderDocsLinkedTasks"));
    assert(docsPage.includes("openLinkedReviewTask"));
    pass("Docs page renders linked task affordances");

    const reviewPage = fs.readFileSync(path.join(__dirname, "..", "public", "js", "pages", "review.js"), "utf8");
    assert(reviewPage.includes("loadPaperclipDocsIndex"));
    assert(reviewPage.includes("renderLinkedPaperclipDocs"));
    pass("Review Queue renders linked Paperclip docs without changing approvals");

    console.log("Paperclip docs viewer verification passed.");
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
