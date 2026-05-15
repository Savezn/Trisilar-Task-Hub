const assert = require("node:assert/strict");
const test = require("node:test");

const {
  validateConfigContract,
  validateNormalizedTrelloCardContract,
  validatePaperclipOperationsStatusContract,
  validatePaperclipPublicConnectionContract,
  validateReviewSessionContract,
} = require("../src/contracts/app-contracts");

function errorPaths(result) {
  return result.errors.map(error => error.path);
}

test("review session contract accepts app-owned pending task shape", () => {
  const result = validateReviewSessionContract({
    id: "session-1",
    title: "Foundation contract session",
    source: "manual_upload",
    summary: "",
    transcript: "",
    createdAt: "2026-05-15T00:00:00.000Z",
    tasks: [{
      id: "task-1",
      meetingId: "session-1",
      title: "Lock contract",
      description: "",
      owner: "",
      deadline: null,
      priority: "medium",
      projectReference: "",
      targetBoardId: "",
      targetListId: "",
      diffStatus: "create_new",
      matchedCardId: null,
      confidence: 1,
      matchReason: "",
      syncCalendar: false,
      syncGoogleTasks: false,
      status: "pending",
      trelloCardId: null,
    }],
  });

  assert.deepEqual(result, { ok: true, errors: [] });
});

test("review session contract rejects missing task status and unsupported statuses", () => {
  const result = validateReviewSessionContract({
    id: "session-1",
    title: "Bad session",
    source: "manual_upload",
    createdAt: "2026-05-15T00:00:00.000Z",
    tasks: [
      { id: "task-1", title: "Missing status" },
      { id: "task-2", title: "Wrong status", status: "done" },
    ],
  });

  assert.equal(result.ok, false);
  assert.deepEqual(errorPaths(result), [
    "tasks[0].status",
    "tasks[1].status",
  ]);
});

test("config contract locks app-owned workspace visibility arrays", () => {
  const result = validateConfigContract({
    groups: [],
    hiddenBoards: ["board-hidden"],
    allowedWorkspaceIds: ["org-a"],
  });

  assert.deepEqual(result, { ok: true, errors: [] });

  const invalid = validateConfigContract({
    groups: {},
    hiddenBoards: "board-hidden",
    allowedWorkspaceIds: null,
  });
  assert.equal(invalid.ok, false);
  assert.deepEqual(errorPaths(invalid), [
    "groups",
    "hiddenBoards",
    "allowedWorkspaceIds",
  ]);
});

test("Paperclip public connection contract permits public secret indicators but rejects raw secrets", () => {
  const result = validatePaperclipPublicConnectionContract({
    status: "connected",
    connected: true,
    hasSecret: true,
    secretPreview: "configured",
    workspaceId: "workspace-1",
    label: "Dev Paperclip",
    webhookPath: "/api/integrations/paperclip/webhook",
    webhookUrl: "https://taskhub.example.test/api/integrations/paperclip/webhook",
    connectedAt: "2026-05-15T00:00:00.000Z",
    disabledAt: null,
    secretUpdatedAt: "2026-05-15T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
  });
  assert.deepEqual(result, { ok: true, errors: [] });

  const invalid = validatePaperclipPublicConnectionContract({
    status: "connected",
    connected: true,
    hasSecret: true,
    secretPreview: "configured",
    secret: "do-not-leak",
  });
  assert.equal(invalid.ok, false);
  assert(errorPaths(invalid).includes("secret"));
});

test("Paperclip operations contract validates read-only status shape and blocks nested raw secrets", () => {
  const valid = validatePaperclipOperationsStatusContract({
    generatedAt: "2026-05-15T00:00:00.000Z",
    mode: "read_only",
    runtime: {
      profile: "dev-demo",
      isProduction: false,
      liveMode: "disabled",
      liveModeConfigured: false,
      liveModeValid: true,
      appBaseUrl: "https://taskhub.example.test",
      productionHostname: "https://taskhub-prod.trisila.online",
      expectedProductionSourceId: "paperclip-do-prod",
      dataDirConfigured: true,
    },
    liveWebhook: {
      enabled: false,
      enabledByDefault: false,
      allowedSourceId: "",
      allowedEnvironment: "",
      webhookPath: "/api/integrations/paperclip/webhook",
    },
    connection: {
      status: "not_connected",
      connected: false,
      hasSecret: false,
      secretPreview: "",
      workspaceId: "",
      label: "",
      webhookPath: "/api/integrations/paperclip/webhook",
      webhookUrl: "",
      connectedAt: null,
      disabledAt: null,
      secretUpdatedAt: null,
      updatedAt: null,
    },
    reviewQueue: {
      paperclipSessions: 0,
      paperclipTasks: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cleanedSessions: 0,
      cleanedTasks: 0,
      trelloLinked: 0,
    },
    audit: {
      accepted: {},
      rejected: {},
      replay: {},
      cleanup: {},
      sideEffects: {},
      other: {},
      recentEvents: [],
    },
    warnings: [],
  });
  assert.deepEqual(valid, { ok: true, errors: [] });

  const invalid = validatePaperclipOperationsStatusContract({
    mode: "read_write",
    connection: { secret: "do-not-leak" },
  });
  assert.equal(invalid.ok, false);
  assert(errorPaths(invalid).includes("mode"));
  assert(errorPaths(invalid).includes("connection.secret"));
});

test("normalized Trello card contract validates card metadata arrays and checklist progress", () => {
  const result = validateNormalizedTrelloCardContract({
    id: "card-1",
    name: "Contract card",
    desc: "",
    due: null,
    dueComplete: false,
    start: null,
    dueReminder: -1,
    url: "",
    idList: "list-1",
    labels: [{ id: "label-1", name: "P0", color: "red" }],
    members: [{ id: "member-1", username: "codex", fullName: "Codex" }],
    checklistProgress: { done: 1, total: 2 },
    customFields: { Priority: "High" },
  });
  assert.deepEqual(result, { ok: true, errors: [] });

  const invalid = validateNormalizedTrelloCardContract({
    id: "card-1",
    name: "Bad card",
    labels: {},
    members: null,
    checklistProgress: { done: "1", total: 2 },
  });
  assert.equal(invalid.ok, false);
  assert.deepEqual(errorPaths(invalid), [
    "desc",
    "due",
    "dueComplete",
    "start",
    "dueReminder",
    "url",
    "idList",
    "labels",
    "members",
    "checklistProgress.done",
    "customFields",
  ]);
});
