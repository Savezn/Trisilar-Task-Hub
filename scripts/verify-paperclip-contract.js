const assert = require("assert");
const fs = require("fs");
const path = require("path");

const {
  CONTRACT_VERSION,
  MAX_EVIDENCE_TEXT_LENGTH,
  normalizePaperclipPayload,
  validatePaperclipPayload,
  toReviewSessionInput,
} = require("../src/integrations/paperclip/contract");

const FIXTURE_DIR = path.join(__dirname, "..", "src", "integrations", "paperclip", "fixtures");

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
}

function errorPaths(result) {
  return result.errors.map(error => error.path);
}

function pass(label) {
  console.log(`PASS ${label}`);
}

const valid = readFixture("valid-paperclip-review-session.json");
const normalized = normalizePaperclipPayload(valid);
assert.strictEqual(normalized.contractVersion, CONTRACT_VERSION);
assert.strictEqual(normalized.source.environment, "mock");
assert.strictEqual(normalized.tasks.length, 1);
assert.strictEqual(normalized.tasks[0].priority, "high");
assert.strictEqual(normalized.tasks[0].deadline, "2026-05-12T10:00:00.000Z");
pass("valid fixture normalizes");

const reviewSessionInput = toReviewSessionInput(valid);
assert.strictEqual(reviewSessionInput.source, "paperclip_mock");
assert.strictEqual(reviewSessionInput.requestId, valid.requestId);
assert.strictEqual(reviewSessionInput.tasks[0].createdByAgent.agentId, valid.agent.agentId);
assert.deepStrictEqual(reviewSessionInput.auditTrail, []);
pass("valid fixture maps to review session input without side effects");

const duplicate = normalizePaperclipPayload(readFixture("duplicate-request-id.json"));
assert.strictEqual(duplicate.requestId, normalized.requestId);
pass("duplicate request fixture preserves idempotency key");

const missing = validatePaperclipPayload(readFixture("missing-required-fields.json"));
assert.strictEqual(missing.ok, false);
assert(errorPaths(missing).includes("requestId"));
assert(errorPaths(missing).includes("agent.agentId"));
assert(errorPaths(missing).includes("agent.runId"));
assert(errorPaths(missing).includes("reviewSession.title"));
assert(errorPaths(missing).includes("tasks[0].title"));
pass("missing required fields are rejected");

const invalidDates = validatePaperclipPayload(readFixture("invalid-task-dates.json"));
assert.strictEqual(invalidDates.ok, false);
assert(errorPaths(invalidDates).includes("reviewSession.sourceCreatedAt"));
assert(errorPaths(invalidDates).includes("tasks[0].deadline"));
pass("invalid dates are rejected");

const largeEvidence = normalizePaperclipPayload(readFixture("large-evidence-truncated.json"));
assert.strictEqual(largeEvidence.tasks[0].priority, "medium");
assert(largeEvidence.tasks[0].sourceEvidence[0].text.length <= MAX_EVIDENCE_TEXT_LENGTH);
pass("large evidence is bounded and priority aliases normalize");

const multiAgent = normalizePaperclipPayload(readFixture("multi-agent-parent-child-run.json"));
assert.strictEqual(multiAgent.agent.parentRunId, "run_parent_20260508_001");
assert.strictEqual(multiAgent.tasks[0].createdByAgent.runId, "run_child_20260508_002");
assert.strictEqual(multiAgent.tasks[0].priority, "medium");
pass("multi-agent parent child trace normalizes");

console.log("Paperclip contract verification passed.");
