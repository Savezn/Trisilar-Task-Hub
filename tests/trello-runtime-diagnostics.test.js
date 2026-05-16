const assert = require("node:assert/strict");
const test = require("node:test");

const {
  classifyTrelloStatus,
  buildTrelloStatusReport,
} = require("../src/utils/trello-runtime-diagnostics");

test("classifies disconnected Trello status as missing runtime credentials", () => {
  const result = classifyTrelloStatus({
    configured: false,
    verified: false,
    state: "disconnected",
    error: "Trello credentials need Runtime setup before board and task data can load.",
  });

  assert.equal(result.code, "missing_credentials");
  assert.equal(result.ok, false);
  assert.match(result.nextAction, /TRELLO_API_KEY/);
  assert.match(result.nextAction, /TRELLO_TOKEN/);
});

test("classifies verified Trello status as ready", () => {
  const result = classifyTrelloStatus({
    configured: true,
    verified: true,
    state: "verified",
  });

  assert.deepEqual(result, {
    ok: true,
    code: "verified",
    summary: "Trello runtime is verified.",
    nextAction: "No Trello credential action required.",
  });
});

test("builds a redacted operator report without secret values", () => {
  const report = buildTrelloStatusReport({
    status: {
      configured: true,
      verified: false,
      state: "invalid",
      error: "401 invalid token sk_test_should_not_print",
    },
    endpoint: "http://127.0.0.1:3301/api/trello/status",
  });

  assert.match(report, /Trello runtime diagnostic/);
  assert.match(report, /invalid_credentials/);
  assert.match(report, /http:\/\/127\.0\.0\.1:3301\/api\/trello\/status/);
  assert.doesNotMatch(report, /sk_test_should_not_print/);
});
