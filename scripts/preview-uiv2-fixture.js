const express = require("express");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const app = express();
app.use(express.json());

function isoAt(dayOffset, hour, minute = 30) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hour, minute, 0, 0).toISOString();
}

const boards = [
  { id: "b-revenue", name: "Q2 Campaigns", idOrganization: "w-main" },
  { id: "b-product", name: "Product Roadmap", idOrganization: "w-main" },
  { id: "b-pipeline", name: "Pipeline", idOrganization: "w-main" },
  { id: "b-okr", name: "OKR Board", idOrganization: "w-main" },
  { id: "b-hidden", name: "Hidden Archive", idOrganization: "w-main" },
];

const listsByBoard = {
  "b-revenue": [{ id: "l-rev-backlog", name: "Backlog" }, { id: "l-rev-doing", name: "Doing" }],
  "b-product": [{ id: "l-prod-backlog", name: "Backlog" }, { id: "l-prod-review", name: "Review AI" }],
  "b-pipeline": [{ id: "l-pipe-next", name: "Next" }, { id: "l-pipe-waiting", name: "Waiting" }],
  "b-okr": [{ id: "l-okr-active", name: "Objective 1 - Product reliability" }],
};

const cards = [
  {
    id: "c-overdue",
    name: "Follow up on delayed onboarding",
    boardId: "b-revenue",
    boardName: "Q2 Campaigns",
    listId: "l-rev-doing",
    listName: "Doing",
    due: isoAt(-2, 9),
    dueComplete: false,
    labels: [{ name: "P0", color: "red" }, { name: "Revenue", color: "green" }],
    members: [{ id: "u-pim", fullName: "Pim Revenue" }],
    desc: "Priority follow-up for a blocked onboarding.",
    checklists: [{ checkItems: [{ state: "complete" }, { state: "incomplete" }] }],
    customFields: { Priority: "P0", Category: "Revenue", OKR: "KR1" },
  },
  {
    id: "c-today",
    name: "Prepare release checklist",
    boardId: "b-product",
    boardName: "Product Roadmap",
    listId: "l-prod-backlog",
    listName: "Backlog",
    due: isoAt(0, 15),
    dueComplete: false,
    labels: [{ name: "Release", color: "blue" }, { name: "Product", color: "sky" }],
    members: [{ id: "u-tan", fullName: "Tan Product" }],
    desc: "Release readiness checklist.",
    checklists: [],
    customFields: { Priority: "P1", Category: "Product", OKR: "KR1.1" },
  },
  {
    id: "c-ai",
    name: "Review AI browser regression notes",
    boardId: "b-product",
    boardName: "Product Roadmap",
    listId: "l-prod-review",
    listName: "Review AI",
    due: isoAt(1, 10),
    dueComplete: false,
    labels: [{ name: "AI", color: "purple" }, { name: "QA", color: "yellow" }],
    members: [{ id: "u-qa", fullName: "QA Lead" }],
    desc: "Check UI V2 route screenshots.",
    checklists: [],
    customFields: { Priority: "P1", Category: "Product", Agent: "Codex" },
  },
  {
    id: "c-blocked",
    name: "Blocked credential rotation follow-up",
    boardId: "b-pipeline",
    boardName: "Pipeline",
    listId: "l-pipe-waiting",
    listName: "Waiting",
    due: isoAt(3, 11),
    dueComplete: false,
    labels: [{ name: "Blocked", color: "orange" }],
    members: [],
    desc: "Waiting on Runtime Owner.",
    checklists: [],
    customFields: { Priority: "P2", Category: "Ops" },
  },
  {
    id: "c-okr",
    name: "KR1.1 Stabilize Task Hub regression gate",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-active",
    listName: "Objective 1 - Product reliability",
    due: isoAt(5, 17),
    dueComplete: false,
    labels: [{ name: "Reliability", color: "green" }, { name: "OKR", color: "blue" }],
    members: [{ id: "u-pm", fullName: "Nora PM" }],
    desc: "Keep route regression evidence attached to V0.6.",
    checklists: [{ checkItems: [{ state: "complete" }, { state: "incomplete" }, { state: "incomplete" }] }],
    customFields: { Priority: "P1", Category: "Product", OKR: "KR1.1" },
  },
];

const session = {
  id: "pc-run-20260515-001",
  title: "Weekly Marketing Sync",
  source: "paperclip_webhook",
  sourceEnv: "controlled-preview",
  requestId: "pc-live-work-20260515-001",
  createdAt: new Date().toISOString(),
  externalSource: {
    system: "paperclip",
    environment: "controlled-preview",
    requestId: "pc-live-work-20260515-001",
    runId: "run-uiv2-preview",
  },
  agent: { name: "PM Assistant", runId: "run-uiv2-preview" },
  tasks: [
    {
      id: "rt-brief",
      title: "Send Songkran campaign brief to design",
      status: "pending",
      owner: "Pim Revenue",
      targetBoardId: "b-revenue",
      targetListId: "l-rev-doing",
      targetBoardName: "Q2 Campaigns",
      targetListName: "Doing",
      deadline: isoAt(0, 16),
      diffStatus: "update_existing",
      confidence: 0.91,
      matchReason: "Matches existing campaign card",
      reasoning: "Meeting owner confirmed the design handoff is ready.",
      sideEffects: ["Create or update Trello card", "Attach Paperclip source trace"],
    },
    {
      id: "rt-contract",
      title: "Review API contract before V0.6 implementation",
      status: "pending",
      owner: "Tan Product",
      targetBoardId: "b-product",
      targetListId: "l-prod-review",
      targetBoardName: "Product Roadmap",
      targetListName: "Review AI",
      deadline: isoAt(1, 10),
      diffStatus: "possible_duplicate",
      confidence: 0.78,
      matchReason: "Similar to release checklist task",
      reasoning: "Needs a human check before changing the execution board.",
      sideEffects: ["Create Trello task after approval"],
    },
    {
      id: "rt-vendor",
      title: "Schedule vendor call for blocked pipeline item",
      status: "pending",
      owner: "",
      targetBoardId: "b-pipeline",
      targetListId: "l-pipe-next",
      targetBoardName: "Pipeline",
      targetListName: "Next",
      deadline: isoAt(2, 11),
      diffStatus: "create_new",
      confidence: 0.68,
      reasoning: "Owner missing; approval must remain blocked.",
      syncCalendar: true,
      sideEffects: ["Create Trello card", "Create Google Calendar event if connected"],
    },
  ],
};

const docsPayload = {
  mode: "mock",
  source: { system: "paperclip", environment: "controlled-preview", workspaceId: "ui-v2-fixture" },
  documents: [
    {
      artifactId: "doc-uiv2-brief",
      title: "Weekly Marketing Sync Summary",
      status: "ready",
      artifactType: "meeting-summary",
      generatedAt: new Date().toISOString(),
      agent: { agentName: "PM Assistant", agentRole: "PM", runId: "run-uiv2-preview", parentRunId: "run-uiv2-parent" },
      summary: "Controlled document linked to Review Queue proposals.",
      content: { text: "# Weekly Marketing Sync\n\nDecision notes and task proposals for UI V2 controlled preview." },
      tags: ["paperclip", "review", "ui-v2"],
      linkedTasks: [{ sessionId: session.id, taskId: "rt-brief", title: "Send Songkran campaign brief to design" }],
      sourceEvidence: [{ type: "transcript", label: "Paperclip transcript", value: "pc-live-work-20260515-001" }],
      workflowAuditTrail: [{ type: "generated", at: new Date().toISOString(), note: "Created by controlled UI V2 preview fixture." }],
    },
  ],
};

app.use(express.static(path.join(ROOT, "public")));

app.get("/healthz", (_req, res) => res.json({ ok: true, preview: "ui-v2-fixture" }));
app.get("/api/trello/status", (_req, res) => res.json({ configured: true, verified: true, connected: true, state: "verified" }));
app.get("/api/config", (_req, res) => res.json({
  groups: [
    { id: "g-revenue", name: "Revenue Ops", color: "#2563eb", boardIds: ["b-revenue", "b-pipeline"] },
    { id: "g-product", name: "Product", color: "#137e52", boardIds: ["b-product", "b-okr"] },
  ],
  hiddenBoards: ["b-hidden"],
  allowedWorkspaceIds: ["w-main"],
  monitorTeams: ["Revenue", "Product", "QA"],
}));
app.post("/api/config", (_req, res) => res.json({ ok: true }));
app.get("/api/calendar/status", (_req, res) => res.json({ connected: false }));
app.get("/api/calendar/events", (_req, res) => res.json([{ id: "evt-1", summary: "PM/UX fidelity review", start: { dateTime: isoAt(0, 13) }, end: { dateTime: isoAt(0, 14) } }]));
app.get("/api/google-tasks/status", (_req, res) => res.json({ connected: false }));
app.get("/api/google-tasks/today", (_req, res) => res.json([]));
app.get("/api/boards", (_req, res) => res.json(boards));
app.get("/api/all-cards", (_req, res) => res.json(cards));
app.post("/api/boards/cards", (_req, res) => res.json(cards));
app.get("/api/boards/:boardId/health", (_req, res) => res.json({ ok: true, missing: [] }));
app.get("/api/boards/:boardId/lists", (req, res) => res.json(listsByBoard[req.params.boardId] || [{ id: "l-default", name: "Backlog" }]));
app.get("/api/lists/:listId/cards", (req, res) => res.json(cards.filter(card => card.listId === req.params.listId)));
app.get("/api/cards/:cardId/checklists", (_req, res) => res.json([]));
app.get("/api/reviews", (_req, res) => res.json([session]));
app.get("/api/reviews/:sessionId", (_req, res) => res.json(session));
app.get("/api/integrations/paperclip/mock/docs", (_req, res) => res.json(docsPayload));
app.get("/api/integrations/paperclip/connection", (_req, res) => res.json({ status: "disabled", enabled: false, hasSecret: false, label: "Controlled preview" }));
app.get("/api/integrations/paperclip/operations/status", (_req, res) => res.json({
  liveWebhook: { enabled: false, allowedSourceId: "paperclip", allowedEnvironment: "controlled-preview" },
  reviewQueue: { pending: 3, rejected: 0, cleanedSessions: 0, trelloLinked: 2 },
  warnings: [{ level: "warning", code: "HUMAN_GATE", message: "Review Queue approval remains required before external writes." }],
  audit: { accepted: { task: 1 }, rejected: {}, replay: {}, cleanup: {} },
}));
app.get("/api/workspaces", (_req, res) => res.json([{ id: "w-main", name: "Trisilar Main Workspace" }]));
app.use("/api", (_req, res) => res.json({ ok: true }));

app.get(["/today", "/review", "/all", "/boards", "/calendar", "/docs", "/planner", "/okr", "/focus", "/settings"], (_req, res) => {
  res.sendFile(path.join(ROOT, "public", "index.html"));
});

const PORT = process.env.PORT || 3031;
const HOST = process.env.HOST || "127.0.0.1";
app.listen(PORT, HOST, () => {
  console.log(`UI V2 fixture preview: http://${HOST}:${PORT}/today`);
});
