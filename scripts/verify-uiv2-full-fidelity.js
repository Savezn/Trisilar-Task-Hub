const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const PROTOTYPE_DIR = process.env.UIV2_PROTOTYPE_DIR
  ? path.resolve(process.env.UIV2_PROTOTYPE_DIR)
  : path.resolve(ROOT, "..", "trisilar-task-hub-v06-s0-ui-foundation", "docs", "design", "ui-design-v2", "prototype");
const OUTPUT_DIR = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-full-fidelity");
const AUDIT_PATH = path.join(ROOT, "docs", "logs", "UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md");
const COMPONENT_AUDIT_PATH = path.join(ROOT, "docs", "design", "ui-design-v2", "UI_V2_COMPONENT_PARITY_AUDIT.md");

const componentRequirements = {
  common: [
    ["route landmark", "main#app-main[aria-labelledby='board-title']"],
    ["route bar", ".route-bar"],
    ["panel primitive", ".panel"],
  ],
  today: [
    ["stat strip", ".stat-strip"],
    ["next-up block", ".next-up"],
    ["today grid", ".today-grid"],
    ["task rows", ".trow, .m-trow"],
    ["review handoff", "[data-uiv2='review-handoff']"],
    ["calendar peek", "[data-uiv2='calendar-peek']"],
  ],
  review: [
    ["session/proposal layout", ".review-layout, .rq-layout"],
    ["proposal card/row", ".review-task-card, .rq-task, .m-trow"],
    ["inspection rail", ".review-inspection-panel, .drawer"],
    ["diff treatment", ".diff, .review-diff-pill, .review-diff-badge"],
    ["risk treatment", ".risk, .review-risk, .review-risk-pill"],
    ["confidence treatment", ".conf, .review-confidence, .review-conf-bar"],
  ],
  all: [
    ["filter bar", ".filterbar"],
    ["dense task table/list", ".tbl, .trow"],
    ["source metadata", "[data-uiv2='task-source']"],
    ["owner metadata", "[data-uiv2='task-owner']"],
  ],
  boards: [
    ["stat strip", ".stat-strip"],
    ["segmented modes", ".seg, .bm-mode-tabs"],
    ["board health cards", ".board-card, .bm-card, .board-monitor-card"],
    ["warning chips", ".chip.warn, .bm-warning, .bm-warning-chip"],
  ],
  calendar: [
    ["source legend", ".cal-legend, .calendar-source-legend, [data-uiv2='calendar-legend']"],
    ["calendar composition", ".cal-grid, .calendar-grid, [data-uiv2='calendar-grid']"],
    ["schedule/event rows", ".cal-event, .cal-event-chip, .cal-evt, .calendar-event, [data-uiv2='event-row']"],
    ["disconnected state", ".state-card, .calendar-connect-state, .calendar-source-card.is-muted, .cal-connect-btn, [data-uiv2='calendar-disconnected']"],
  ],
  planner: [
    ["source cards", ".planner-cols, .planner-source-card, [data-uiv2='planner-source']"],
    ["Google Tasks state", "[data-uiv2='google-tasks-state'], #planner-gtasks-body"],
    ["Trello due list", "[data-uiv2='trello-deadline-list'], #planner-trello-body"],
  ],
  okr: [
    ["stat strip", ".stat-strip"],
    ["objective rows", ".okr-objective, .okr-obj, [data-uiv2='objective-row']"],
    ["progress treatment", ".progress, .okr-progress, .okr-progress-bar, [data-uiv2='okr-progress']"],
    ["confidence/status chips", ".chip, .conf, .okr-status-chip, .okr-confidence-chip"],
  ],
  focus: [
    ["stat strip", ".stat-strip"],
    ["lane layout", ".lanes, .focus-task-list"],
    ["Review AI lane", "[data-uiv2='review-ai-lane'], .focus-review-chip"],
    ["blocked lane", "[data-uiv2='blocked-lane'], .focus-status-chip.is-blocked"],
  ],
  docs: [
    ["filter bar", ".filterbar"],
    ["trace table/rows", ".trace-row, .docs-trace-row, .tbl, [data-uiv2='trace-row']"],
    ["evidence card", ".evidence-card, .docs-evidence, [data-uiv2='evidence-card']"],
    ["audit timeline", ".audit-timeline, .docs-trace-timeline, [data-uiv2='audit-timeline']"],
  ],
  settings: [
    ["settings grid", ".set-grid"],
    ["settings side nav", ".set-side"],
    ["integration rows", ".intg-row"],
    ["mobile More cards", ".m-more .m-card, .settings-mobile-more .m-card"],
  ],
};

const desktopRoutes = [
  { key: "today", label: "Today", path: "/today", artboard: "d-today", state: "populated; calendar disconnected; review handoff populated" },
  { key: "review", label: "Review Queue", path: "/review", artboard: "d-review", state: "populated; missing-owner safety proposal; side-effect disclosure" },
  { key: "all", label: "All Tasks", path: "/all", artboard: "d-tasks", state: "populated; hidden-board filtering; overdue/today metadata" },
  { key: "boards", label: "Boards Monitor", path: "/boards", artboard: "d-boards", state: "populated; board warnings; hidden-board count" },
  { key: "calendar", label: "Calendar", path: "/calendar", artboard: "d-cal", state: "disconnected Calendar plus Trello/review-derived schedule" },
  { key: "planner", label: "Planner", path: "/planner", artboard: "d-planner", state: "Google Tasks disconnected; Trello deadlines remain visible" },
  { key: "okr", label: "OKR / Portfolio", path: "/okr", artboard: "d-okr", state: "populated objective/KR rows from Trello metadata" },
  { key: "focus", label: "Weekly Focus", path: "/focus", artboard: "d-focus", state: "four lanes; Review AI lane; blocked lane; schedule lane" },
  { key: "docs", label: "Docs / AI Trace", path: "/docs", artboard: "d-trace", state: "linked and orphan evidence docs; audit timeline" },
  { key: "settings", label: "Settings", path: "/settings", artboard: "d-settings", state: "integration controls; no-secret display; workspace controls" },
];

const mobileTabs = [
  { key: "m-today", label: "Today", path: "/today", artboard: "m-today" },
  { key: "m-review", label: "Review", path: "/review", artboard: "m-review" },
  { key: "m-tasks", label: "Tasks", path: "/all", artboard: "m-tasks" },
  { key: "m-boards", label: "Boards", path: "/boards", artboard: "m-boards" },
  { key: "m-more", label: "More", path: "/settings", artboard: "m-more" },
];

const responsiveViewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-small", width: 375, height: 667 },
];
const appPaneViewport = { name: "app-pane", width: 747, height: 910 };

const expectedSidebarIconPaths = {
  today: "M3 10h18",
  review: "M12 3l2.39",
  all: "M3 6h18",
  boards: "M4 4h6v16H4z",
  calendar: "M3 10h18",
  planner: "M9 11l3",
  okr: "M12 12m-9",
  focus: "M3 4h6",
  docs: "M4 6h10",
  settings: "M12 15a3",
};

const approvedDeviations = {
  review: "Logged: safety controls retained beyond prototype density.",
  all: "Logged: hidden-board disclosure can appear above mobile task rows when workspace visibility excludes a board.",
  calendar: "Logged: controlled QA can show disconnected Calendar state instead of populated prototype fixture.",
  planner: "Logged: controlled QA can show disconnected Google Tasks state instead of populated prototype fixture.",
  settings: "Logged: Paperclip runtime controls stay collapsed by default for no-secret operational safety.",
};

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
  "b-revenue": [
    { id: "l-rev-backlog", name: "Backlog" },
    { id: "l-rev-doing", name: "Doing" },
  ],
  "b-product": [
    { id: "l-prod-backlog", name: "Backlog" },
    { id: "l-prod-review", name: "Review AI" },
  ],
  "b-pipeline": [
    { id: "l-pipe-next", name: "Next" },
    { id: "l-pipe-waiting", name: "Waiting" },
  ],
  "b-okr": [
    { id: "l-okr-active", name: "Objective 1 - Product reliability" },
    { id: "l-okr-arr", name: "Reach $1.4M ARR by end of Q2" },
    { id: "l-okr-canary", name: "Ship Paperclip staged canary" },
    { id: "l-okr-brand", name: "Marketing org reaches 10 brand activations" },
  ],
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
    checklistProgress: { done: 1, total: 3 },
    checklists: [{ checkItems: [{ state: "complete" }, { state: "incomplete" }, { state: "incomplete" }] }],
    customFields: { Priority: "P1", Category: "Product", OKR: "KR1.1" },
  },
  {
    id: "c-okr-arr-1",
    name: "KR1.1 40 new logos",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-arr",
    listName: "Reach $1.4M ARR by end of Q2",
    due: isoAt(8, 17),
    dueComplete: false,
    labels: [{ name: "Revenue", color: "green" }, { name: "OKR", color: "blue" }],
    members: [{ id: "u-pim", fullName: "Pim Revenue" }],
    desc: "ARR growth KR.",
    checklistProgress: { done: 7, total: 10 },
    checklists: [],
    customFields: { Priority: "P0", Category: "Revenue", OKR: "KR1.1" },
  },
  {
    id: "c-okr-arr-2",
    name: "KR1.2 Expansion revenue +18%",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-arr",
    listName: "Reach $1.4M ARR by end of Q2",
    due: isoAt(15, 17),
    dueComplete: false,
    labels: [{ name: "Revenue", color: "green" }, { name: "Pipeline", color: "orange" }],
    members: [{ id: "u-pim", fullName: "Pim Revenue" }],
    desc: "Expansion revenue KR.",
    checklistProgress: { done: 5, total: 9 },
    checklists: [],
    customFields: { Priority: "P1", Category: "Revenue", OKR: "KR1.2" },
  },
  {
    id: "c-okr-arr-3",
    name: "KR1.3 Churn under 2.4%",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-arr",
    listName: "Reach $1.4M ARR by end of Q2",
    due: isoAt(18, 17),
    dueComplete: false,
    labels: [{ name: "Revenue", color: "green" }],
    members: [{ id: "u-pim", fullName: "Pim Revenue" }],
    desc: "Retention KR.",
    checklistProgress: { done: 4, total: 10 },
    checklists: [],
    customFields: { Priority: "P1", Category: "Revenue", OKR: "KR1.3" },
  },
  {
    id: "c-okr-canary-1",
    name: "KR2.1 Runtime delivery reflects 85%",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-canary",
    listName: "Ship Paperclip staged canary",
    due: isoAt(4, 17),
    dueComplete: false,
    labels: [{ name: "Product", color: "sky" }, { name: "Release", color: "blue" }],
    members: [{ id: "u-tan", fullName: "Tan Product" }],
    desc: "Canary readiness KR.",
    checklistProgress: { done: 2, total: 6 },
    checklists: [],
    customFields: { Priority: "P1", Category: "Product", OKR: "KR2.1" },
  },
  {
    id: "c-okr-canary-2",
    name: "KR2.2 Staged rollout to 3 BUs",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-canary",
    listName: "Ship Paperclip staged canary",
    due: isoAt(10, 17),
    dueComplete: false,
    labels: [{ name: "Product", color: "sky" }, { name: "Education W2", color: "orange" }],
    members: [{ id: "u-tan", fullName: "Tan Product" }],
    desc: "Rollout KR.",
    checklistProgress: { done: 1, total: 3 },
    checklists: [],
    customFields: { Priority: "P1", Category: "Product", OKR: "KR2.2" },
  },
  {
    id: "c-okr-canary-3",
    name: "KR2.3 Webhook auth coverage 100%",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-canary",
    listName: "Ship Paperclip staged canary",
    due: isoAt(12, 17),
    dueComplete: false,
    labels: [{ name: "Product", color: "sky" }, { name: "QA", color: "yellow" }],
    members: [{ id: "u-qa", fullName: "QA Lead" }],
    desc: "Webhook auth coverage KR.",
    checklistProgress: { done: 3, total: 5 },
    checklists: [],
    customFields: { Priority: "P0", Category: "Product", OKR: "KR2.3" },
  },
  {
    id: "c-okr-brand-1",
    name: "KR3.1 Four brand campaigns shipped",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-brand",
    listName: "Marketing org reaches 10 brand activations",
    due: isoAt(14, 17),
    dueComplete: false,
    labels: [{ name: "Marketing", color: "purple" }, { name: "Q2 Campaigns", color: "blue" }],
    members: [{ id: "u-may", fullName: "May Marketing" }],
    desc: "Brand campaigns KR.",
    checklistProgress: { done: 3, total: 4 },
    checklists: [],
    customFields: { Priority: "P1", Category: "Marketing", OKR: "KR3.1" },
  },
  {
    id: "c-okr-brand-2",
    name: "KR3.2 Content velocity +25%",
    boardId: "b-okr",
    boardName: "OKR Board",
    listId: "l-okr-brand",
    listName: "Marketing org reaches 10 brand activations",
    due: isoAt(20, 17),
    dueComplete: false,
    labels: [{ name: "Marketing", color: "purple" }],
    members: [{ id: "u-may", fullName: "May Marketing" }],
    desc: "Content velocity KR.",
    checklistProgress: { done: 4, total: 5 },
    checklists: [],
    customFields: { Priority: "P1", Category: "Marketing", OKR: "KR3.2" },
  },
  {
    id: "c-hidden",
    name: "Hidden board task should stay filtered",
    boardId: "b-hidden",
    boardName: "Hidden Archive",
    listId: "l-hidden",
    listName: "Archive",
    due: isoAt(0, 12),
    dueComplete: false,
    labels: [],
    members: [],
    desc: "",
    checklists: [],
    customFields: {},
  },
];

const sessions = [
  {
    id: "pc-run-20260515-001",
    title: "Weekly Marketing Sync",
    source: "paperclip_webhook",
    sourceEnv: "controlled-qa",
    requestId: "pc-live-work-20260515-001",
    createdAt: new Date().toISOString(),
    externalSource: {
      system: "paperclip",
      environment: "controlled-qa",
      requestId: "pc-live-work-20260515-001",
      runId: "run-uiv2-001",
    },
    agent: { name: "PM Assistant", runId: "run-uiv2-001" },
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
      {
        id: "rt-archive",
        title: "Archive completed launch checklist notes",
        status: "approved",
        owner: "Nora PM",
        targetBoardId: "b-product",
        targetListId: "l-prod-backlog",
        deadline: isoAt(-1, 15),
        diffStatus: "create_new",
        confidence: 0.88,
      },
    ],
  },
];

const docsPayload = {
  mode: "mock",
  source: {
    system: "paperclip",
    environment: "controlled-qa",
    workspaceId: "ui-v2-fixture",
    threadId: "weekly-marketing-sync",
  },
  documents: [
    {
      artifactId: "doc-uiv2-brief",
      title: "Weekly Marketing Sync Summary",
      status: "ready",
      artifactType: "meeting-summary",
      generatedAt: new Date().toISOString(),
      agent: { agentId: "pm-assistant", agentName: "PM Assistant", agentRole: "PM", runId: "run-uiv2-001", parentRunId: "run-uiv2-parent" },
      summary: "Controlled document linked to Review Queue proposals.",
      content: { text: "# Weekly Marketing Sync\n\nDecision notes and task proposals for UI V2 controlled QA." },
      tags: ["paperclip", "review", "ui-v2"],
      linkedTasks: [
        { sessionId: "pc-run-20260515-001", taskId: "rt-brief", title: "Send Songkran campaign brief to design" },
        { sessionId: "pc-run-20260515-001", taskId: "rt-contract", title: "Review API contract before V0.6 implementation" },
      ],
      sourceEvidence: [{ type: "transcript", label: "Paperclip transcript", value: "pc-live-work-20260515-001" }],
      workflowAuditTrail: [{ type: "generated", at: new Date().toISOString(), note: "Created by controlled UI V2 audit fixture." }],
    },
    {
      artifactId: "doc-uiv2-orphan",
      title: "Orphan Trace Check",
      status: "needs-link",
      artifactType: "audit-note",
      generatedAt: isoAt(-1, 14),
      agent: { agentId: "codex-qa", agentName: "Codex QA", agentRole: "QA", runId: "run-uiv2-orphan" },
      summary: "Document without a matching Review task to exercise missing-link state.",
      content: { text: "# Orphan Trace Check\n\nThis artifact intentionally has no linked task." },
      tags: ["orphan", "audit"],
      linkedTasks: [{ sessionId: "missing-session", taskId: "missing-task", title: "Missing linked review task" }],
      sourceEvidence: [{ type: "fixture", label: "Controlled QA", value: "missing-link-state" }],
      workflowAuditTrail: [{ type: "checked", at: isoAt(-1, 15), note: "Missing-link state kept safe." }],
    },
  ],
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function waitForHealth(baseUrl, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const retry = () => {
      if (Date.now() > deadline) return reject(new Error(`Server did not become healthy at ${baseUrl}`));
      setTimeout(attempt, 250);
    };
    const attempt = () => {
      const req = http.get(`${baseUrl}/healthz`, res => {
        res.resume();
        if (res.statusCode === 200) return resolve();
        retry();
      });
      req.on("error", retry);
      req.setTimeout(1500, () => {
        req.destroy();
        retry();
      });
    };
    attempt();
  });
}

function serveStatic(root, port) {
  const server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    const cleanPath = requestPath === "/" ? "/Trisilar Task Hub UI V2.html" : requestPath;
    const filePath = path.normalize(path.join(root, cleanPath));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = ext === ".css" ? "text/css"
        : ext === ".jsx" || ext === ".js" ? "text/javascript"
          : ext === ".html" ? "text/html"
            : "application/octet-stream";
      res.writeHead(200, { "content-type": `${type}; charset=utf-8` });
      res.end(data);
    });
  });
  return new Promise(resolve => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function fulfillJson(route, body, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installControlledApi(page) {
  await page.route("**/api/**", route => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (req.method() !== "GET") {
      if (pathname === "/api/boards/cards") return fulfillJson(route, cards.filter(card => card.boardId !== "b-hidden"));
      if (pathname.includes("/approve")) return fulfillJson(route, { ok: true, task: sessions[0].tasks[0] });
      if (pathname.includes("/reject")) return fulfillJson(route, { ok: true, task: sessions[0].tasks[0] });
      if (pathname === "/api/reviews") return fulfillJson(route, sessions[0]);
      return fulfillJson(route, { ok: true, id: "fixture-created" });
    }

    if (pathname === "/api/trello/status") {
      return fulfillJson(route, { configured: true, verified: true, connected: true, state: "verified" });
    }
    if (pathname === "/api/config") {
      return fulfillJson(route, {
        groups: [
          { id: "g-revenue", name: "Revenue Ops", color: "#2563eb", boardIds: ["b-revenue", "b-pipeline"] },
          { id: "g-product", name: "Product", color: "#137e52", boardIds: ["b-product", "b-okr"] },
        ],
        hiddenBoards: ["b-hidden"],
        allowedWorkspaceIds: ["w-main"],
        monitorTeams: ["Revenue", "Product", "QA"],
      });
    }
    if (pathname === "/api/calendar/status") return fulfillJson(route, { connected: false });
    if (pathname === "/api/calendar/events") {
      return fulfillJson(route, [
        { id: "evt-1", summary: "PM/UX fidelity review", start: { dateTime: isoAt(0, 13) }, end: { dateTime: isoAt(0, 14) } },
      ]);
    }
    if (pathname === "/api/google-tasks/status") return fulfillJson(route, { connected: false, error: "Google Tasks connection is not active in this controlled run." });
    if (pathname === "/api/google-tasks/today") return fulfillJson(route, []);
    if (pathname === "/api/boards") return fulfillJson(route, boards);
    if (pathname === "/api/all-cards") return fulfillJson(route, cards);
    if (pathname === "/api/reviews") return fulfillJson(route, sessions);
    if (pathname === "/api/reviews/pc-run-20260515-001") return fulfillJson(route, sessions[0]);
    if (pathname === "/api/integrations/paperclip/mock/docs") return fulfillJson(route, docsPayload);
    if (pathname === "/api/integrations/paperclip/connection") {
      return fulfillJson(route, {
        status: "disabled",
        enabled: false,
        hasSecret: false,
        workspaceId: "",
        label: "Controlled QA",
        webhookPath: "/api/integrations/paperclip/webhook",
      });
    }
    if (pathname === "/api/integrations/paperclip/operations/status") {
      return fulfillJson(route, {
        liveWebhook: { enabled: false, allowedSourceId: "paperclip", allowedEnvironment: "controlled-qa" },
        reviewQueue: { pending: 3, rejected: 0, cleanedSessions: 0, trelloLinked: 2 },
        warnings: [{ level: "warning", code: "HUMAN_GATE", message: "Review Queue approval remains required before external writes." }],
        audit: { accepted: { task: 1 }, rejected: {}, replay: {}, cleanup: {} },
      });
    }
    if (pathname === "/api/workspaces") return fulfillJson(route, [{ id: "w-main", name: "Trisilar Main Workspace" }]);
    if (/^\/api\/boards\/[^/]+\/health$/.test(pathname)) return fulfillJson(route, { ok: true, missing: [] });
    if (/^\/api\/boards\/[^/]+\/lists$/.test(pathname)) {
      const boardId = pathname.split("/")[3];
      return fulfillJson(route, listsByBoard[boardId] || [{ id: "l-default", name: "Backlog" }]);
    }
    if (/^\/api\/lists\/[^/]+\/cards$/.test(pathname)) {
      const listId = pathname.split("/")[3];
      return fulfillJson(route, cards.filter(card => card.listId === listId));
    }
    if (/^\/api\/cards\/[^/]+\/checklists$/.test(pathname)) return fulfillJson(route, []);
    return fulfillJson(route, { ok: true });
  });
}

async function resolveAppBase() {
  if (process.env.UIV2_APP_BASE_URL) {
    const baseUrl = process.env.UIV2_APP_BASE_URL.replace(/\/+$/, "");
    await waitForHealth(baseUrl, 5000);
    return { baseUrl, process: null };
  }

  const preferredPort = Number(process.env.PORT || 3030);
  const preferredBase = `http://127.0.0.1:${preferredPort}`;
  try {
    await waitForHealth(preferredBase, 2500);
    return { baseUrl: preferredBase, process: null };
  } catch (_) {
    const port = preferredPort || await getFreePort();
    const appProcess = spawn(process.execPath, ["server.js"], {
      cwd: ROOT,
      env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
      stdio: "ignore",
    });
    const baseUrl = `http://127.0.0.1:${port}`;
    await waitForHealth(baseUrl, 15000);
    return { baseUrl, process: appProcess };
  }
}

async function capturePrototype(page, baseUrl, artboard, fileName) {
  await page.goto(`${baseUrl}/Trisilar%20Task%20Hub%20UI%20V2.html`, { waitUntil: "networkidle", timeout: 90000 });
  const locator = page.locator(`[data-dc-slot="${artboard}"] .dc-card`);
  await locator.waitFor({ state: "visible", timeout: 90000 });
  const filePath = path.join(OUTPUT_DIR, fileName);
  await locator.screenshot({ path: filePath });
  return filePath;
}

async function captureProduction(context, baseUrl, route, viewport, fileName) {
  const errors = [];
  const page = await context.newPage();
  await installControlledApi(page);
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", err => errors.push(err.message));

  await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.locator("#board-content").waitFor({ state: "visible", timeout: 30000 });
  if (route.path === "/review") {
    await page.locator(".review-task-card, .review-empty-panel").first().waitFor({ state: "visible", timeout: 30000 });
  }
  await page.waitForTimeout(350);
  const filePath = path.join(OUTPUT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });

  const metrics = await page.evaluate(async ({ routeKey, requirements, expectedSidebarIconPaths }) => {
    const bodyText = document.body.innerText || "";
    const labels = [...document.querySelectorAll(".mobile-route-item .nav-label")].map(el => el.textContent.trim());
    const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    const viewportBottom = window.innerHeight;
    function visibleInFirstViewport(selector, text) {
      const nodes = [...document.querySelectorAll(selector)];
      const match = nodes.find(node => !text || (node.textContent || "").includes(text));
      if (!match) return false;
      const rect = match.getBoundingClientRect();
      return rect.top >= 0 && rect.top < viewportBottom && rect.bottom > 0;
    }
    const settleUi = () => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    const pressEscapeAndSettle = async target => {
      const node = target || document.activeElement || document;
      node.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: true,
        cancelable: true,
      }));
      await settleUi();
    };
    const clickOutsideAndSettle = async () => {
      document.body.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }));
      await settleUi();
    };
    const unsafePatterns = [
      ".env",
      "TRELLO_KEY",
      "TRELLO_TOKEN",
      "GOOGLE_CLIENT_SECRET",
      "PAPERCLIP_SHARED_SECRET",
      "Authorization:",
      "Bearer ",
      "invalid_client",
      "OAuth client not found",
    ];
    const sidebarIconChecks = Object.entries(expectedSidebarIconPaths).map(([page, expectedPathStart]) => {
      const svg = document.querySelector(`.sidebar-nav .nav-item[data-page="${page}"] .nav-icon svg`);
      const firstPath = svg?.querySelector("path")?.getAttribute("d") || "";
      return {
        label: `prototype sidebar icon: ${page}`,
        selector: `.sidebar-nav .nav-item[data-page="${page}"] .nav-icon svg`,
        ok: Boolean(svg) && firstPath.startsWith(expectedPathStart),
      };
    });
    const sidebarNav = document.querySelector(".sidebar-nav");
    const navChildren = [...(sidebarNav?.children || [])];
    const settingsIndex = navChildren.findIndex(el => el.matches?.('.nav-item[data-page="settings"]'));
    const scopeIndex = navChildren.findIndex(el => el.matches?.(".scope-heading"));
    const settingsBeforeScope = settingsIndex >= 0 && scopeIndex >= 0 && settingsIndex < scopeIndex;
    const footerSummary = document.querySelector("#sidebar-connection-summary");
    const footerSummaryText = (document.querySelector("#sidebar-connection-summary-text")?.textContent || "").trim().toLowerCase();
    const footerExceptionText = (document.querySelector("#sidebar-connection-exceptions")?.textContent || "").trim().toLowerCase();
    const legacyFooterLabels = [...document.querySelectorAll(".sidebar-footer .sidebar-status .status-label")]
      .map(el => (el.textContent || "").trim().toLowerCase());
    const footerConnectorChecks = [
      {
        label: "sidebar footer uses connection summary, not mirrored header rows",
        selector: "#sidebar-connection-summary",
        ok: Boolean(footerSummary) && footerSummaryText.startsWith("connections") && legacyFooterLabels.length === 0,
      },
      {
        label: "sidebar footer exposes only connector exceptions",
        selector: "#sidebar-connection-exceptions",
        ok: Boolean(footerExceptionText) && /paperclip|gtasks|ready|check|off|staged/.test(footerExceptionText),
      },
      {
        label: "sidebar footer remains a Settings handoff",
        selector: "#sidebar-connection-summary[onclick]",
        ok: Boolean(footerSummary?.getAttribute("onclick")?.includes("settings")),
      },
    ];
    const isAppPaneViewport = window.innerWidth > 700 && window.innerWidth <= 820;
    const isCompactDesktopShellViewport = window.innerWidth > 700;
    const isDesktopViewport = window.innerWidth > 820;
    const isMobileShellViewport = window.innerWidth <= 700;
    const visibleElement = selector => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };
    const parseRgb = value => {
      const match = String(value || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?/i);
      if (!match) return null;
      const alpha = match[4] === undefined ? 1 : Number(match[4]);
      return alpha === 0 ? null : match.slice(1, 4).map(Number);
    };
    const relLuminance = rgb => {
      const channel = value => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    };
    const contrastRatio = (fg, bg) => {
      const l1 = relLuminance(fg);
      const l2 = relLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const labelContrastOk = selector => {
      const nodes = [...document.querySelectorAll(selector)].filter(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      }).slice(0, 16);
      if (nodes.length < 1) return false;
      return nodes.every(el => {
        const style = getComputedStyle(el);
        const fg = parseRgb(style.color);
        const bg = parseRgb(style.backgroundColor)
          || parseRgb(getComputedStyle(el.closest(".panel, .docs-trace-table, .tasks-inbox-table, .uiv2-settings-page") || document.body).backgroundColor)
          || [255, 255, 255];
        return Boolean(fg) && contrastRatio(fg, bg) >= 4.5;
      });
    };
    const smallLabelContrastChecks = isDesktopViewport && ["docs", "all", "settings"].includes(routeKey) ? [
      {
        label: "UI V2 small labels meet readable muted-label contrast",
        selector: routeKey === "docs"
          ? ".docs-trace-table .trace-head .eyebrow, .docs-inspection-summary .eyebrow"
          : routeKey === "all"
            ? ".tasks-inbox-table .tbl thead th"
            : ".uiv2-settings-page .eyebrow",
        ok: labelContrastOk(routeKey === "docs"
          ? ".docs-trace-table .trace-head .eyebrow, .docs-inspection-summary .eyebrow"
          : routeKey === "all"
            ? ".tasks-inbox-table .tbl thead th"
            : ".uiv2-settings-page .eyebrow"),
      },
    ] : [];
    const desktopTopbarChecks = isCompactDesktopShellViewport ? [
      {
        label: "prototype desktop topbar hides route subtitle",
        selector: ".topbar .board-subtitle",
        ok: (() => {
          const subtitle = document.querySelector(".topbar .board-subtitle");
          return !subtitle || getComputedStyle(subtitle).display === "none";
        })(),
      },
      {
        label: "prototype topbar Refresh uses SVG icon",
        selector: "#topbar-refresh-btn svg",
        ok: Boolean(document.querySelector("#topbar-refresh-btn svg")),
      },
      {
        label: "prototype topbar Bell uses SVG icon",
        selector: "#topbar-notifications-btn svg",
        ok: Boolean(document.querySelector("#topbar-notifications-btn svg")),
      },
      {
        label: "prototype topbar Bell opens notification surface",
        selector: "#topbar-notifications-btn[aria-haspopup='dialog']",
        ok: (() => {
          const btn = document.querySelector("#topbar-notifications-btn");
          return Boolean(btn)
            && btn.getAttribute("aria-haspopup") === "dialog"
            && typeof btn.onclick === "function";
        })(),
      },
      {
        label: "prototype topbar scope picker has chevron",
        selector: ".topbar .scope-pick svg",
        ok: Boolean(document.querySelector(".topbar .scope-pick .scope-dot"))
          && Boolean(document.querySelector(".topbar .scope-pick svg")),
      },
      {
        label: "prototype topbar scope picker is native button interactive",
        selector: ".topbar button.scope-pick .scope-pick-label",
        ok: (() => {
          const pick = document.querySelector(".topbar .scope-pick");
          return Boolean(pick)
            && pick.tagName === "BUTTON"
            && pick.getAttribute("type") === "button"
            && !pick.hasAttribute("role")
            && pick.getAttribute("aria-haspopup") === "listbox"
            && pick.getAttribute("aria-controls") === "topbar-scope-popover"
            && pick.getAttribute("aria-expanded") === "false"
            && Boolean(pick.querySelector(".scope-pick-label"));
        })(),
      },
    ] : [];
    const desktopStatusbarChecks = isCompactDesktopShellViewport ? [
      {
        label: "status strip items expose hover descriptions without individual tab stops",
        selector: ".shell-status-strip .statusbar-group.has-status-help[data-status-desc]",
        ok: (() => {
          const items = [...document.querySelectorAll(".shell-status-strip .statusbar-group")];
          const described = items.filter(item => item.classList.contains("has-status-help")
            && item.dataset.statusDesc
            && item.dataset.statusDesc.length >= 32
            && item.getAttribute("role") === "note");
          return described.length >= 8
            && described.every(item => item.getAttribute("tabindex") !== "0");
        })(),
      },
      {
        label: "status strip uses one grouped keyboard details control",
        selector: "#statusbar-details.has-status-help",
        ok: (() => {
          const details = document.querySelector("#statusbar-details");
          const focusableGroups = [...document.querySelectorAll(".shell-status-strip .statusbar-group[tabindex='0']")];
          return Boolean(details)
            && details.tagName === "BUTTON"
            && details.getAttribute("type") === "button"
            && (details.dataset.statusDesc || "").length >= 120
            && focusableGroups.length === 0;
        })(),
      },
      {
        label: "status strip descriptions stay product-safe",
        selector: ".shell-status-strip [data-status-desc]",
        ok: [...document.querySelectorAll(".shell-status-strip [data-status-desc]")]
          .every(item => !/(\.env|token|secret|Authorization:|Bearer |invalid_client|OAuth client not found)/i.test(item.dataset.statusDesc || "")),
      },
    ] : [];
    const topbarFocusChecks = isCompactDesktopShellViewport ? await (async () => {
      const checks = [];
      const scopePick = document.querySelector(".topbar .scope-pick");
      if (scopePick) {
        scopePick.focus({ preventScroll: true });
        scopePick.click();
        await settleUi();
        const opened = Boolean(document.querySelector("#topbar-scope-popover"))
          && scopePick.getAttribute("aria-expanded") === "true";
        await pressEscapeAndSettle(document.activeElement);
        const focusStyles = getComputedStyle(scopePick);
        checks.push({
          label: "topbar Scope Escape returns focus to trigger",
          selector: ".topbar .scope-pick",
          ok: opened
            && !document.querySelector("#topbar-scope-popover")
            && document.activeElement === scopePick
            && scopePick.getAttribute("aria-expanded") === "false"
            && focusStyles.boxShadow !== "none",
        });

        scopePick.click();
        await settleUi();
        const openedOutside = Boolean(document.querySelector("#topbar-scope-popover"))
          && scopePick.getAttribute("aria-expanded") === "true";
        await clickOutsideAndSettle();
        checks.push({
          label: "topbar Scope outside click returns focus to trigger",
          selector: ".topbar .scope-pick",
          ok: openedOutside
            && !document.querySelector("#topbar-scope-popover")
            && document.activeElement === scopePick
            && scopePick.getAttribute("aria-expanded") === "false",
        });
      }

      const bellButton = document.querySelector("#topbar-notifications-btn");
      if (bellButton) {
        bellButton.focus({ preventScroll: true });
        bellButton.click();
        await settleUi();
        const opened = Boolean(document.querySelector("#topbar-notification-popover"))
          && bellButton.getAttribute("aria-expanded") === "true";
        await pressEscapeAndSettle(document.activeElement);
        checks.push({
          label: "topbar Bell Escape returns focus to trigger",
          selector: "#topbar-notifications-btn",
          ok: opened
            && !document.querySelector("#topbar-notification-popover")
            && document.activeElement === bellButton
            && bellButton.getAttribute("aria-expanded") === "false",
        });

        bellButton.click();
        await settleUi();
        const openedOutside = Boolean(document.querySelector("#topbar-notification-popover"))
          && bellButton.getAttribute("aria-expanded") === "true";
        await clickOutsideAndSettle();
        checks.push({
          label: "topbar Bell outside click returns focus to trigger",
          selector: "#topbar-notifications-btn",
          ok: openedOutside
            && !document.querySelector("#topbar-notification-popover")
            && document.activeElement === bellButton
            && bellButton.getAttribute("aria-expanded") === "false",
        });
      }

      if (routeKey === "docs") {
        const docsFilter = document.querySelector("#docs-topbar-filter");
        if (docsFilter) {
          docsFilter.focus({ preventScroll: true });
          docsFilter.click();
          await settleUi();
          const opened = Boolean(document.querySelector("#docs-filter-popover"))
            && docsFilter.getAttribute("aria-expanded") === "true";
          await pressEscapeAndSettle(document.activeElement);
          checks.push({
            label: "Docs topbar Filter Escape returns focus to trigger",
            selector: "#docs-topbar-filter",
            ok: opened
              && !document.querySelector("#docs-filter-popover")
              && document.activeElement === docsFilter
              && docsFilter.getAttribute("aria-expanded") === "false",
          });

          docsFilter.click();
          await settleUi();
          const openedOutside = Boolean(document.querySelector("#docs-filter-popover"))
            && docsFilter.getAttribute("aria-expanded") === "true";
          await clickOutsideAndSettle();
          checks.push({
            label: "Docs topbar Filter outside click returns focus to trigger",
            selector: "#docs-topbar-filter",
            ok: openedOutside
              && !document.querySelector("#docs-filter-popover")
              && document.activeElement === docsFilter
              && docsFilter.getAttribute("aria-expanded") === "false",
          });
        }
      }

      return checks;
    })() : [];
    const sidebarPrimitiveChecks = isCompactDesktopShellViewport ? [
      {
        label: "prototype sidebar shell class",
        selector: ".sidebar.side",
        ok: Boolean(document.querySelector(".sidebar.side")),
      },
      {
        label: "prototype sidebar header primitive classes",
        selector: ".sidebar .side-head .side-logo + .side-title",
        ok: Boolean(document.querySelector(".sidebar .side-head .side-logo + .side-title")),
      },
      {
        label: "prototype sidebar nav icon/label classes",
        selector: ".sidebar-nav .nav-item .ico svg + .lbl",
        ok: [...document.querySelectorAll(".sidebar-nav .nav-item[data-page]")]
          .every(item => Boolean(item.querySelector(".ico svg")) && Boolean(item.querySelector(".lbl"))),
      },
      {
        label: "prototype sidebar label pill rhythm",
        selector: ".sidebar-nav .nav-item .lbl",
        ok: [...document.querySelectorAll(".sidebar-nav .nav-item[data-page] .lbl")]
          .every(label => {
            const styles = getComputedStyle(label);
            const rect = label.getBoundingClientRect();
            return styles.textTransform === "uppercase"
              && styles.display.includes("flex")
              && Math.round(rect.height) >= 13
              && Math.round(rect.height) <= 16
              && !["rgba(0, 0, 0, 0)", "transparent"].includes(styles.backgroundColor);
          }),
      },
      {
        label: "prototype sidebar Scope dots stay small",
        selector: ".scope-list .scope-item .scope-dot",
        ok: [...document.querySelectorAll(".scope-list .scope-item .scope-dot")]
          .every(dot => {
            const before = getComputedStyle(dot, "::before");
            return Math.round(parseFloat(before.width)) === 6
              && Math.round(parseFloat(before.height)) === 6;
          }),
      },
      {
        label: "prototype sidebar Scope rows are interactive buttons",
        selector: ".scope-list .scope-item[data-scope-id]",
        ok: (() => {
          const rows = [...document.querySelectorAll(".scope-list .scope-item[data-scope-id]")];
          return rows.length >= 1 && rows.every(row => row.tagName === "BUTTON" && row.type === "button");
        })(),
      },
      {
        label: "prototype Planner off badge",
        selector: '.sidebar-nav .nav-item[data-page="planner"] .badge.muted',
        ok: ((document.querySelector('.sidebar-nav .nav-item[data-page="planner"] .badge.muted')?.textContent || "").trim().toLowerCase() === "off"),
      },
    ] : [];
    const appPaneRouteActionGroups = {
      today: [["#today-topbar-filter"], ["#today-topbar-quick-add"]],
      review: [["#review-topbar-filter"]],
      all: [["#tasks-topbar-open"], ["#tasks-topbar-new"]],
      calendar: [[".cal-view-seg"], ["#cal-add", ".cal-connect-btn"]],
      docs: [["#docs-topbar-filter"], ["#docs-topbar-export"]],
    };
    const appPaneRouteActionChecks = isAppPaneViewport ? [
      {
        label: "app-pane uses compact desktop shell",
        selector: ".shell-status-strip, .sidebar, .topbar-route-actions",
        ok: visibleElement(".shell-status-strip")
          && visibleElement(".sidebar")
          && !visibleElement(".mobile-route-bar"),
      },
      ...(appPaneRouteActionGroups[routeKey] ? [{
        label: "app-pane route actions remain reachable",
        selector: "#topbar-route-actions",
        ok: (() => {
          const slot = document.querySelector("#topbar-route-actions");
          return Boolean(slot)
            && !slot.hidden
            && visibleElement("#topbar-route-actions")
            && appPaneRouteActionGroups[routeKey].every(group => group.some(selector => visibleElement(selector)));
        })(),
      }] : []),
    ] : [];
    const textPolicyRoutes = new Set(["today", "all", "calendar", "planner", "okr"]);
    const sharedTextRevealChecks = textPolicyRoutes.has(routeKey) ? [
      {
        label: "shared decision text uses two-line reveal policy",
        selector: ".uiv2-decision-text",
        ok: (() => {
          const items = [...document.querySelectorAll(".uiv2-decision-text")].filter(el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
          });
          if (!items.length) return !isDesktopViewport;
          return items.every(el => {
            const style = getComputedStyle(el);
            const text = (el.textContent || "").replace(/\s+/g, " ").trim();
            const title = (el.getAttribute("title") || el.getAttribute("aria-label") || "").trim();
            const hasRevealText = Boolean(title) && title.length >= Math.min(8, text.length || 8);
            return Boolean(title)
              && hasRevealText
              && style.whiteSpace !== "nowrap"
              && (style.webkitLineClamp === "2" || style.display.includes("box"));
          });
        })(),
      },
      {
        label: "shared metadata text keeps native reveal fallback",
        selector: ".uiv2-meta-text",
        ok: (() => {
          const items = [...document.querySelectorAll(".uiv2-meta-text")].filter(el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
          });
          if (!items.length) return true;
          return items.every(el => Boolean((el.getAttribute("title") || "").trim()));
        })(),
      },
      ...(routeKey === "calendar" ? [{
        label: "Calendar event chips expose full-title reveal",
        selector: ".cal-event-chip[data-uiv2-reveal='calendar-event']",
        ok: (() => {
          const chips = [...document.querySelectorAll(".cal-event-chip[data-uiv2-reveal='calendar-event']")];
          return chips.length >= 1 && chips.every(chip => {
            const style = getComputedStyle(chip);
            return Boolean(chip.getAttribute("title"))
              && Boolean(chip.getAttribute("aria-label"))
              && chip.getAttribute("tabindex") === "0"
              && (style.webkitLineClamp === "2" || style.display.includes("box"));
          });
        })(),
      }] : []),
    ] : [];
    const mobileShellChecks = isMobileShellViewport ? [
      {
        label: "prototype mobile status row visible",
        selector: ".mobile-status-row",
        ok: (() => {
          const status = document.querySelector(".mobile-status-row");
          return Boolean(status) && getComputedStyle(status).display !== "none";
        })(),
      },
      {
        label: "prototype mobile hides desktop sidebar/status strip",
        selector: ".sidebar + .shell-status-strip",
        ok: (() => {
          const sidebar = document.querySelector(".sidebar");
          const status = document.querySelector(".shell-status-strip");
          return (!sidebar || getComputedStyle(sidebar).display === "none") &&
            (!status || getComputedStyle(status).display === "none");
        })(),
      },
      {
        label: "prototype mobile tabbar full-width",
        selector: ".mobile-route-bar",
        ok: (() => {
          const bar = document.querySelector(".mobile-route-bar");
          if (!bar) return false;
          const styles = getComputedStyle(bar);
          const rect = bar.getBoundingClientRect();
          return styles.display === "grid" && styles.position === "fixed" &&
            Math.round(rect.left) === 0 && Math.abs(Math.round(rect.right) - window.innerWidth) <= 1 &&
            styles.borderRadius === "0px";
        })(),
      },
      {
        label: "prototype mobile active tab is text/icon only",
        selector: ".mobile-route-item.active",
        ok: (() => {
          const active = document.querySelector(".mobile-route-item.active");
          if (!active) return false;
          const styles = getComputedStyle(active);
          return ["rgba(0, 0, 0, 0)", "transparent"].includes(styles.backgroundColor);
        })(),
      },
      {
        label: "prototype mobile tab icon slot",
        selector: ".mobile-route-item .nav-icon svg",
        ok: [...document.querySelectorAll(".mobile-route-item .nav-icon")].every(slot => {
          const rect = slot.getBoundingClientRect();
          const svg = slot.querySelector("svg");
          const svgRect = svg?.getBoundingClientRect();
          return Math.round(rect.width) >= 22 && Math.round(rect.height) >= 22 &&
            svg && Math.round(svgRect.width) >= 18 && Math.round(svgRect.height) >= 18;
        }),
      },
      {
        label: "prototype mobile tabs are keyboard buttons",
        selector: ".mobile-route-item",
        ok: (() => {
          const items = [...document.querySelectorAll(".mobile-route-item")];
          return items.length === 5 && items.every(item =>
            item.tagName === "BUTTON" &&
            item.getAttribute("type") === "button" &&
            item.tabIndex === 0 &&
            Boolean(item.getAttribute("aria-label"))
          );
        })(),
      },
    ] : [];
    const todayDesktopChecks = routeKey === "today" && isDesktopViewport ? [
      {
        label: "Today actions live in topbar",
        selector: "#topbar-route-actions #today-topbar-quick-add",
        ok: Boolean(document.querySelector("#topbar-route-actions #today-topbar-quick-add")),
      },
      {
        label: "Today routebar has no action controls",
        selector: ".today-page > .route-bar .rb-actions",
        ok: !document.querySelector(".today-page > .route-bar .rb-actions"),
      },
      {
        label: "Today Quick add panel starts collapsed",
        selector: "#today-quick-panel[hidden]",
        ok: Boolean(document.querySelector("#today-quick-panel[hidden]")),
      },
      {
        label: "Today Next up includes Reschedule affordance",
        selector: ".next-up [data-today-card-reschedule]",
        ok: Boolean(document.querySelector(".next-up [data-today-card-reschedule]")),
      },
      {
        label: "Today Next up eyebrow uses prototype time order",
        selector: ".next-up .eyebrow, .today-mobile-next .m-eyebrow",
        ok: (() => {
          const eyebrow = document.querySelector(".next-up .eyebrow, .today-mobile-next .m-eyebrow");
          const text = eyebrow?.textContent || "";
          return !/\b(Today|Tomorrow|Yesterday)\s+\d{1,2}:\d{2}\b/.test(text);
        })(),
      },
      {
        label: "Today task row status column hidden",
        selector: ".today-work-row .tstatus",
        ok: !document.querySelector(".today-work-row .tstatus") || getComputedStyle(document.querySelector(".today-work-row .tstatus")).display === "none",
      },
      {
        label: "Today task rows use prototype dot metadata",
        selector: ".today-work-row .tmeta",
        ok: [...document.querySelectorAll(".today-work-row .tmeta .sep")]
          .every(sep => (sep.textContent || "").trim() === "\u00b7"),
      },
      {
        label: "Today task rows do not synthesize No label fallback",
        selector: ".today-work-row .tlabels",
        ok: !((document.querySelector(".today-work-row .tlabels")?.textContent || "").includes("No label")),
      },
      {
        label: "Today task rows expose long-text reveal titles",
        selector: ".today-work-row",
        ok: (() => {
          const rows = [...document.querySelectorAll(".today-work-row")].slice(0, 8);
          if (rows.length < 1) return false;
          return rows.every(row => {
            const title = row.querySelector(".ttitle");
            const board = row.querySelector(".board-tag");
            const list = row.querySelector(".today-list-name");
            return Boolean(row.getAttribute("title"))
              && Boolean(title?.getAttribute("title"))
              && Boolean(board?.getAttribute("title"))
              && Boolean(list?.getAttribute("title"));
          });
        })(),
      },
      {
        label: "Today task rows expose visible Open affordances",
        selector: ".today-work-row .today-row-open",
        ok: (() => {
          const rows = [...document.querySelectorAll(".today-work-row")].slice(0, 8);
          if (rows.length < 1) return false;
          return rows.every(row => {
            const action = row.querySelector(".today-row-open");
            if (!action) return false;
            const rect = action.getBoundingClientRect();
            return action.tagName === "BUTTON"
              && action.getAttribute("type") === "button"
              && Boolean(action.getAttribute("aria-label"))
              && Boolean(action.getAttribute("title"))
              && rect.width >= 44
              && rect.height >= 24;
          });
        })(),
      },
    ] : [];
    const reviewDesktopChecks = routeKey === "review" && isDesktopViewport ? [
      {
        label: "Review topbar does not duplicate the global Refresh control",
        selector: "#topbar-route-actions #review-topbar-refresh, #topbar-refresh-btn",
        ok: Boolean(document.querySelector("#topbar-refresh-btn"))
          && !document.querySelector("#topbar-route-actions #review-topbar-refresh")
          && [...document.querySelectorAll(".topbar-actions button")]
            .filter(btn => /refresh/i.test(`${btn.id || ""} ${btn.textContent || ""} ${btn.getAttribute("aria-label") || ""}`))
            .length === 1,
      },
      {
        label: "Review topbar includes Filter",
        selector: "#topbar-route-actions #review-topbar-filter",
        ok: Boolean(document.querySelector("#topbar-route-actions #review-topbar-filter")),
      },
      {
        label: "Review routebar carries Open audit log",
        selector: ".review-page .route-bar #review-route-audit",
        ok: Boolean(document.querySelector(".review-page .route-bar #review-route-audit")),
      },
      {
        label: "Review routebar carries Intake policy instead of fake block action",
        selector: ".review-page .route-bar #review-route-policy",
        ok: Boolean(document.querySelector(".review-page .route-bar #review-route-policy"))
          && !((document.querySelector(".review-page .route-bar")?.textContent || "").includes("Block intake")),
      },
      {
        label: "Review filterbar exposes actionable status and risk chips",
        selector: "#review-filterbar",
        ok: (() => {
          const bar = document.querySelector("#review-filterbar");
          const text = bar?.textContent || "";
          return Boolean(bar)
            && ["status: any", "status: pending", "status: approved", "status: rejected", "risk: blocked", "risk: ready"].every(label => text.includes(label));
        })(),
      },
      {
        label: "Review routebar excludes New session",
        selector: ".review-page .route-bar",
        ok: !((document.querySelector(".review-page .route-bar")?.textContent || "").includes("New session")),
      },
      {
        label: "Review bulkbar uses prototype neutral actions",
        selector: ".review-page .review-bulk-bar",
        ok: Boolean(document.querySelector(".review-page .review-bulk-bar"))
          && !document.querySelector(".review-page .review-bulk-bar .btn-success")
          && !document.querySelector(".review-page .review-bulk-bar .btn-danger"),
      },
      {
        label: "Review inspection drawer keeps prototype rail width",
        selector: ".review-page .review-inspection-panel",
        ok: (() => {
          const rail = document.querySelector(".review-page .review-inspection-panel");
          return Boolean(rail) && rail.getBoundingClientRect().width >= 390;
        })(),
      },
      {
        label: "Review inspection footer exposes edit/hold/reject/approve",
        selector: ".review-page .review-inspection-foot button",
        ok: (() => {
          const buttons = [...document.querySelectorAll(".review-page .review-inspection-foot button")];
          const labels = buttons.map(button => (button.textContent || "").trim());
          return labels.some(text => text.includes("Edit"))
            && labels.some(text => text.includes("Hold"))
            && labels.some(text => text.includes("Reject"))
            && labels.some(text => text.includes("Approve"));
        })(),
      },
    ] : [];
    const allTasksDesktopChecks = routeKey === "all" && isDesktopViewport ? [
      {
        label: "All Tasks topbar includes Open in Trello",
        selector: "#topbar-route-actions #tasks-topbar-open",
        ok: Boolean(document.querySelector("#topbar-route-actions #tasks-topbar-open")),
      },
      {
        label: "All Tasks topbar includes New task",
        selector: "#topbar-route-actions #tasks-topbar-new",
        ok: Boolean(document.querySelector("#topbar-route-actions #tasks-topbar-new")),
      },
      {
        label: "All Tasks filterbar does not carry Export",
        selector: ".tasks-primary-filterbar #at-export-btn",
        ok: !document.querySelector(".tasks-primary-filterbar #at-export-btn"),
      },
      {
        label: "All Tasks footer carries Export",
        selector: ".tasks-inbox-table .panel-foot #at-export-btn",
        ok: Boolean(document.querySelector(".tasks-inbox-table .panel-foot #at-export-btn")),
      },
      {
        label: "All Tasks footer carries pagination cluster",
        selector: ".tasks-inbox-table .panel-foot",
        ok: ((document.querySelector(".tasks-inbox-table .panel-foot")?.textContent || "").includes("Prev")
          && (document.querySelector(".tasks-inbox-table .panel-foot")?.textContent || "").includes("Next")
          && (document.querySelector(".tasks-inbox-table .panel-foot")?.textContent || "").includes("Export")),
      },
      {
        label: "All Tasks routebar keeps prototype group labels",
        selector: ".tasks-inbox-page .route-bar .seg",
        ok: ((document.querySelector(".tasks-inbox-page .route-bar .seg")?.textContent || "").includes("Group \u00b7 board")
          && (document.querySelector(".tasks-inbox-page .route-bar .seg")?.textContent || "").includes("Group \u00b7 owner")),
      },
      {
        label: "All Tasks table stays inside panel",
        selector: ".tasks-inbox-table",
        ok: (() => {
          const panel = document.querySelector(".tasks-inbox-table");
          return Boolean(panel) && panel.scrollWidth <= panel.clientWidth + 2;
        })(),
      },
      {
        label: "All Tasks search input exposes accessible name",
        selector: "#tasks-search-input[aria-label]",
        ok: /search tasks/i.test(document.querySelector("#tasks-search-input")?.getAttribute("aria-label") || ""),
      },
      {
        label: "All Tasks header uses Board middle-dot List",
        selector: ".tasks-inbox-table thead",
        ok: ((document.querySelector(".tasks-inbox-table thead")?.textContent || "").includes("Board \u00b7 List")),
      },
      {
        label: "All Tasks row completion labels include task context",
        selector: ".tasks-inbox-table .task-check-button.tck",
        ok: (() => {
          const buttons = [...document.querySelectorAll(".tasks-inbox-table .task-check-button.tck")].slice(0, 12);
          const labels = buttons.map(button => button.getAttribute("aria-label") || "");
          return buttons.length >= 1
            && labels.every(label => /Mark (done|active): .+/i.test(label))
            && new Set(labels).size === labels.length;
        })(),
      },
      {
        label: "All Tasks rows expose visible Edit Card affordance",
        selector: ".tasks-inbox-table .task-row-edit-btn",
        ok: (() => {
          const buttons = [...document.querySelectorAll(".tasks-inbox-table .task-row-edit-btn")].slice(0, 8);
          return buttons.length >= 1 && buttons.every(button => {
            const rect = button.getBoundingClientRect();
            const label = button.getAttribute("aria-label") || "";
            return rect.width >= 32
              && rect.height >= 24
              && /^Edit card: .+/i.test(label)
            && button.type === "button";
          });
        })(),
      },
      {
        label: "All Tasks dense rows expose long-text reveal titles",
        selector: ".tasks-inbox-table .task-inbox-row",
        ok: (() => {
          const rows = [...document.querySelectorAll(".tasks-inbox-table .task-inbox-row")].slice(0, 8);
          if (rows.length < 1) return false;
          return rows.every(row => {
            const title = row.querySelector(".task-title-text");
            const action = row.querySelector(".task-next-action");
            const list = row.querySelector(".task-list-line");
            const boardCell = list?.closest("td");
            return Boolean(row.getAttribute("title"))
              && Boolean(title?.getAttribute("title"))
              && Boolean(action?.getAttribute("title"))
              && Boolean(boardCell?.getAttribute("title"))
              && Boolean(list?.getAttribute("title"));
          });
        })(),
      },
      {
        label: "All Tasks table controls expose usable desktop hit areas",
        selector: ".tasks-inbox-table .sortable-header, .tasks-inbox-table .task-check-button.tck",
        ok: (() => {
          const sortButtons = [...document.querySelectorAll(".tasks-inbox-table .sortable-header")];
          const checkButtons = [...document.querySelectorAll(".tasks-inbox-table .task-check-button.tck")].slice(0, 8);
          const rectOk = button => {
            const rect = button.getBoundingClientRect();
            return rect.width >= 24 && rect.height >= 28;
          };
          const headerStyleOk = button => {
            const style = getComputedStyle(button);
            return parseFloat(style.fontSize) >= 11
              && Number.parseInt(style.fontWeight, 10) >= 700
              && style.color !== "rgb(138, 144, 156)";
          };
          return sortButtons.length >= 4
            && checkButtons.length >= 1
            && sortButtons.every(rectOk)
            && sortButtons.every(headerStyleOk)
            && checkButtons.every(rectOk);
        })(),
      },
    ] : [];
    const boardsDesktopChecks = routeKey === "boards" && isDesktopViewport ? [
      {
        label: "Boards owner metadata is static text, not fake filter controls",
        selector: ".boards-monitor-page .bc-meta",
        ok: (() => {
          const metas = [...document.querySelectorAll(".boards-monitor-page .bc-meta")].slice(0, 8);
          if (metas.length < 1) return false;
          return metas.every(meta => /owner/i.test(meta.textContent || ""))
            && !document.querySelector(".boards-monitor-page .bc-meta button, .boards-monitor-page .bc-meta .filter-chip");
        })(),
      },
      {
        label: "Boards disabled toolbar chips explain readonly state",
        selector: ".boards-monitor-toolbar .filter-chip.is-disabled:disabled",
        ok: (() => {
          const chips = [...document.querySelectorAll(".boards-monitor-toolbar .filter-chip.is-disabled:disabled")];
          return chips.length >= 2 && chips.every(chip => Boolean(chip.title));
        })(),
      },
      {
        label: "Boards mode segment exposes selected state",
        selector: ".boards-monitor-page .seg button[aria-pressed]",
        ok: (() => {
          const buttons = [...document.querySelectorAll(".boards-monitor-page .seg button")];
          const labels = buttons.map(button => (button.textContent || "").replace(/\s+/g, " ").trim());
          const states = buttons.map(button => button.getAttribute("aria-pressed"));
          return labels.join("|") === "Board mode|Team mode|Convention warnings"
            && states.every(state => state === "true" || state === "false")
            && states.filter(state => state === "true").length === 1
            && buttons.every(button => Boolean(button.getAttribute("title")));
        })(),
      },
    ] : [];
    const plannerDesktopChecks = routeKey === "planner" && isDesktopViewport ? [
      {
        label: "Planner Settings CTAs have source-specific accessible names",
        selector: ".planner-page button",
        ok: (() => {
          const visible = el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
          };
          const sourceButtons = [...document.querySelectorAll(".planner-page button")]
            .filter(visible)
            .filter(button => /settings|connection/i.test(button.textContent || ""));
          return sourceButtons.length >= 1 && sourceButtons.every(button => {
            const name = (button.getAttribute("aria-label") || button.title || button.textContent || "").trim();
            return !["Open Settings", "Connection settings"].includes(name)
            && /(Planner|Google Tasks|Google connection|workspace settings)/i.test(name);
          });
        })(),
      },
      {
        label: "Planner Trello deadline rows expose long-text reveal titles",
        selector: ".planner-trello-row",
        ok: (() => {
          const rows = [...document.querySelectorAll(".planner-trello-row")].slice(0, 8);
          if (rows.length < 1) return false;
          return rows.every(row => {
            const title = row.querySelector(".planner-trello-title");
            const meta = row.querySelector(".planner-trello-meta");
            return Boolean(row.getAttribute("title"))
              && Boolean(title?.getAttribute("title"))
            && Boolean(meta?.getAttribute("title"));
          });
        })(),
      },
      {
        label: "Planner disconnected Google Tasks does not expose add-task controls",
        selector: "#planner-gtasks-body",
        ok: (() => {
          const body = document.querySelector("#planner-gtasks-body");
          const state = (document.querySelector("#planner-gtasks-state")?.textContent || "").trim().toLowerCase();
          const text = body?.textContent || "";
          const disconnected = state.includes("disconnected") || /connect google tasks/i.test(text);
          if (!disconnected) return true;
          return Boolean(body)
            && !body.querySelector(".planner-add-row, #planner-add-input, .planner-add-btn")
            && Boolean(body.querySelector(".planner-connect-card"))
            && /connect google tasks/i.test(text)
            && /no tasks are written|read-only|until connected/i.test(text);
        })(),
      },
    ] : [];
    const okrDesktopChecks = routeKey === "okr" && isDesktopViewport ? [
      {
        label: "OKR KR detail buttons have KR-specific labels",
        selector: ".okr-kr-row [data-action='open-kr-detail']",
        ok: (() => {
          const buttons = [...document.querySelectorAll(".okr-kr-row [data-action='open-kr-detail']")].slice(0, 12);
          const labels = buttons.map(button => button.getAttribute("aria-label") || "");
          return buttons.length >= 1
            && labels.every(label => /^Open KR detail: .+/i.test(label))
            && new Set(labels).size === labels.length
            && buttons.every(button => button.tabIndex >= 0);
        })(),
      },
      {
        label: "OKR KR rows expose long-text reveal titles",
        selector: ".okr-kr-row",
        ok: (() => {
          const rows = [...document.querySelectorAll(".okr-kr-row")].slice(0, 12);
          if (rows.length < 1) return false;
          return rows.every(row => {
            const krName = row.querySelector(".kr-name");
            const board = row.querySelector(".board-tag");
            return Boolean(row.getAttribute("title"))
              && Boolean(krName?.getAttribute("title"))
            && Boolean(board?.getAttribute("title"));
          });
        })(),
      },
      {
        label: "OKR owner metadata is not styled as a filter control",
        selector: ".okr-obj-meta .kv",
        ok: (() => {
          const metas = [...document.querySelectorAll(".okr-obj-meta")].slice(0, 8);
          if (metas.length < 1) return false;
          return metas.every(meta => /owner/i.test(meta.textContent || ""))
            && !document.querySelector(".okr-obj-meta button, .okr-obj-meta .filter-chip");
        })(),
      },
    ] : [];
    const calendarDesktopChecks = routeKey === "calendar" && isDesktopViewport ? [
      {
        label: "Calendar view segment buttons are actionable",
        selector: "#topbar-route-actions .cal-view-seg button",
        ok: (() => {
          const buttons = [...document.querySelectorAll("#topbar-route-actions .cal-view-seg button")];
          return buttons.length === 3
            && buttons.map(btn => (btn.textContent || "").trim()).join("|") === "Day|Week|Month"
            && buttons.every(btn => (btn.getAttribute("onclick") || "").includes("setCalendarViewMode"));
        })(),
      },
      {
        label: "Calendar view segment buttons expose pointer and focus affordance",
        selector: "#topbar-route-actions .cal-view-seg button",
        ok: (() => {
          const buttons = [...document.querySelectorAll("#topbar-route-actions .cal-view-seg button")];
          return buttons.length === 3 && buttons.every(btn => {
            const styles = getComputedStyle(btn);
            btn.focus({ preventScroll: true });
            const focused = document.activeElement === btn;
            btn.blur();
            return styles.cursor === "pointer" && focused;
          });
        })(),
      },
      {
        label: "Calendar month view includes schedule layout and agenda",
        selector: ".calendar-schedule-layout .calendar-agenda-panel",
        ok: Boolean(document.querySelector(".calendar-schedule-layout .calendar-agenda-panel")),
      },
      {
        label: "Calendar write action exposes draft/save boundary",
        selector: ".cal-add-btn, .calendar-action-note, #cal-boundary-note",
        ok: (() => {
          const add = document.querySelector(".cal-add-btn");
          const note = document.querySelector(".calendar-action-note");
          const modalNote = document.querySelector("#cal-boundary-note");
          if (!add) return Boolean(modalNote);
          const text = `${add.textContent || ""} ${add.getAttribute("title") || ""} ${note?.textContent || ""} ${modalNote?.textContent || ""}`;
          return /draft/i.test(text) && /save/i.test(text) && /Google Calendar/i.test(text);
        })(),
      },
      {
        label: "Calendar agenda exposes readable titles and real actions",
        selector: ".calendar-agenda-title, .calendar-agenda-action",
        ok: (() => {
          const titles = [...document.querySelectorAll(".calendar-agenda-title")];
          const actions = [...document.querySelectorAll(".calendar-agenda-action")];
          return titles.every(title => title.getAttribute("title"))
            && actions.every(action => action.getAttribute("type") === "button" && action.getAttribute("aria-label"));
        })(),
      },
    ] : [];
    const focusDesktopChecks = routeKey === "focus" && isDesktopViewport ? [
      {
        label: "Weekly Focus topbar carries prototype week segment",
        selector: "#topbar-route-actions .seg",
        ok: (() => {
          const text = document.querySelector("#topbar-route-actions .seg")?.textContent || "";
          const buttons = [...document.querySelectorAll("#topbar-route-actions .seg button")];
          return text.includes("Last week") && text.includes("This week") && text.includes("Next week")
            && buttons.length === 3
            && buttons.every(btn => (btn.getAttribute("onclick") || "").includes("setWeeklyFocusWeekOffset"))
            && buttons.every(btn => ["true", "false"].includes(btn.getAttribute("aria-pressed")))
            && buttons.every(btn => Boolean(btn.getAttribute("title")))
            && buttons.filter(btn => btn.getAttribute("aria-pressed") === "true").length === 1;
        })(),
      },
      {
        label: "Weekly Focus owner action explains filter fallback",
        selector: ".focus-page [data-action='owner-filter']",
        ok: (() => {
          const owner = document.querySelector(".focus-page [data-action='owner-filter']");
          const select = document.querySelector("#focus-owner-sel");
          const help = `${owner?.getAttribute("aria-label") || ""} ${owner?.getAttribute("title") || ""}`;
          return Boolean(owner)
            && /owner filter/i.test(help)
            && /explain/i.test(help)
            && (!select || /owner/i.test(select.getAttribute("aria-label") || ""));
        })(),
      },
      {
        label: "Weekly Focus keeps four prototype lanes",
        selector: ".focus-task-list .focus-day-group",
        ok: document.querySelectorAll(".focus-task-list.lanes .lane").length === 4,
      },
      {
        label: "Weekly Focus lanes use prototype lane body primitives",
        selector: ".focus-task-list.lanes .lane .lane-head .lane-name .pip",
        ok: [...document.querySelectorAll(".focus-task-list.lanes .lane")]
          .every(lane => Boolean(lane.querySelector(".lane-head .lane-name .pip")) && Boolean(lane.querySelector(".lane-body"))),
      },
      {
        label: "Weekly Focus lane visible card count capped",
        selector: ".focus-task-list.lanes .lane .focus-task-row",
        ok: [...document.querySelectorAll(".focus-task-list.lanes .lane")]
          .every(lane => lane.querySelectorAll(".focus-task-row").length <= 3),
      },
      {
        label: "Weekly Focus lane items stay compact",
        selector: ".focus-task-list.lanes .lane-item",
        ok: [...document.querySelectorAll(".focus-task-list.lanes .lane-item")]
          .every(item => item.getBoundingClientRect().height <= 120),
      },
      {
        label: "Weekly Focus Review AI does not reuse Trello card chips",
        selector: ".focus-task-list.lanes .is-review-ai",
        ok: (() => {
          const lane = document.querySelector(".focus-task-list.lanes .is-review-ai");
          if (!lane) return false;
          return !lane.querySelector(".focus-source-chip, .focus-status-chip, .focus-review-chip")
            && Boolean(lane.querySelector(".focus-review-row, .focus-lane-empty"));
        })(),
      },
      {
        label: "Weekly Focus Review AI explains human-gate workflow",
        selector: "[data-uiv2='review-ai-explainer']",
        ok: (() => {
          const explainer = document.querySelector("[data-uiv2='review-ai-explainer']");
          const text = explainer?.textContent || "";
          const rect = explainer?.getBoundingClientRect();
          return /Review Queue/i.test(text)
            && /approve/i.test(text)
            && /reject/i.test(text)
            && /hold/i.test(text)
            && rect
            && rect.height > 20
            && rect.height <= 90;
        })(),
      },
    ] : [];
    const docsDesktopChecks = routeKey === "docs" && isDesktopViewport ? [
      {
        label: "Docs trace table uses normal row flow",
        selector: ".docs-trace-table",
        ok: (() => {
          const table = document.querySelector(".docs-trace-table");
          const rows = [...document.querySelectorAll(".docs-trace-table .trace-row")];
          if (!table || rows.length < 2) return false;
          const styles = getComputedStyle(table);
          const tableRect = table.getBoundingClientRect();
          const lastRowRect = rows[rows.length - 1].getBoundingClientRect();
          return parseFloat(styles.paddingBottom) <= 2
            && lastRowRect.bottom <= tableRect.bottom + 2;
        })(),
      },
      {
        label: "Docs route excludes legacy document detail surface",
        selector: ".docs-detail-disclosure, .docs-secondary-viewer, #docs-viewer",
        ok: !document.querySelector(".docs-detail-disclosure, .docs-secondary-viewer, #docs-viewer"),
      },
      {
        label: "Docs rows expose detail reader trigger without legacy disclosure",
        selector: "#docs-reader-host, [data-doc-reader-trigger='true']",
        ok: Boolean(document.querySelector("#docs-reader-host.hidden"))
          && document.querySelectorAll("[data-doc-reader-trigger='true']").length >= 1
          && !document.querySelector(".docs-detail-disclosure, .docs-secondary-viewer, #docs-viewer"),
      },
      {
        label: "Docs detail reader opens without clipped side cards",
        selector: ".docs-reader-panel, .docs-reader-card",
        ok: (() => {
          const row = document.querySelector("[data-doc-reader-trigger='true']");
          if (!row || typeof window.openDocsDetailDrawer !== "function") return false;
          window.openDocsDetailDrawer(row.getAttribute("data-doc-artifact"));
          const panel = document.querySelector(".docs-reader-panel");
          const side = document.querySelector(".docs-reader-side");
          const cards = [...document.querySelectorAll(".docs-reader-card")];
          const actionText = (document.querySelector("[data-docs-reader-open-review]")?.textContent || "").replace(/\s+/g, " ").trim();
          const ok = Boolean(panel)
            && panel.getBoundingClientRect().width >= Math.min(window.innerWidth - 40, 720)
            && Boolean(side)
            && getComputedStyle(side).overflowY !== "hidden"
            && cards.length >= 3
            && cards.every(card => card.scrollHeight <= card.clientHeight + 2)
            && /Open Review( Queue)?/.test(actionText);
          if (typeof window.closeDocsDetailDrawer === "function") window.closeDocsDetailDrawer({ restore: false });
          return ok;
        })(),
      },
      {
        label: "Docs filterbar matches ScreenTrace chip contract",
        selector: ".docs-toolbar .filter-chip",
        ok: (() => {
          const chips = [...document.querySelectorAll(".docs-toolbar .filter-chip")]
            .map(chip => (chip.textContent || "").replace(/\s+/g, " ").trim());
          const expected = ["env: production", "env: staged", "status: any", "agent: any", "window: 14d"];
          return expected.every((text, index) => chips[index]?.includes(text));
        })(),
      },
      {
        label: "Docs search input exposes accessible name",
        selector: "#docs-search-input[aria-label]",
        ok: /docs|trace/i.test(document.querySelector("#docs-search-input")?.getAttribute("aria-label") || ""),
      },
      {
        label: "Docs topbar Filter opens a real filter menu",
        selector: "#docs-topbar-filter[aria-haspopup='dialog']",
        ok: (() => {
          const btn = document.querySelector("#docs-topbar-filter");
          return Boolean(btn)
            && btn.getAttribute("aria-haspopup") === "dialog"
            && (btn.getAttribute("aria-controls") || "").includes("docs-filter-popover")
            && btn.getAttribute("aria-expanded") === "false"
            && typeof btn.onclick === "function";
        })(),
      },
      {
        label: "Docs run ids use Trace capsule primitive",
        selector: ".docs-trace-table .trace",
        ok: document.querySelectorAll(".docs-trace-table .trace .pre").length >= 1
          && document.querySelectorAll(".docs-trace-table .trace .copy svg").length >= 1,
      },
      {
        label: "Docs desktop trace identity remains readable",
        selector: ".docs-trace-table .docs-trace-table-row",
        ok: (() => {
          const rows = [...document.querySelectorAll(".docs-trace-table .docs-trace-table-row")].slice(0, 3);
          if (rows.length < 1) return false;
          return rows.every(row => {
            const run = row.querySelector(".docs-trace-run-cell .trace .mono");
            const agent = row.querySelector(".docs-trace-agent-cell .ttitle");
            const runStyle = run ? getComputedStyle(run) : null;
            return Boolean(run)
              && Boolean(agent)
              && Boolean(row.querySelector(".docs-trace-copy-btn"))
              && run.scrollWidth <= run.clientWidth + 2
              && agent.scrollWidth <= agent.clientWidth + 2
              && runStyle.whiteSpace === "normal"
              && Boolean(agent.getAttribute("title"));
          });
        })(),
      },
      {
        label: "Docs evidence card keeps visible source trace copy",
        selector: ".evidence-card .fkv",
        ok: (() => {
          const text = document.querySelector(".evidence-card")?.textContent || "";
          return text.includes("Source system") && text.includes("Source mode");
        })(),
      },
      {
        label: "Docs route separates trace summary from full document reader",
        selector: ".docs-inspection-summary [data-docs-open-reader]",
        ok: (() => {
          const card = document.querySelector(".docs-inspection-summary");
          const text = (card?.textContent || "").replace(/\s+/g, " ").trim();
          return Boolean(card)
            && Boolean(card.querySelector("[data-docs-open-reader]"))
            && text.includes("Trace summary")
            && text.includes("Audit preview")
            && text.includes("Reader holds full detail")
            && !text.includes("Full document content");
        })(),
      },
      {
        label: "Docs export and rollback actions provide safe local feedback",
        selector: "#docs-topbar-export[data-docs-export-trace], [data-docs-rollback-hint]",
        ok: (() => {
          const exportBtn = document.querySelector("#docs-topbar-export[data-docs-export-trace]");
          const copyBtn = document.querySelector(".docs-inspection-summary [data-docs-copy-audit-report]");
          const rollbackBtn = document.querySelector(".docs-inspection-summary [data-docs-rollback-hint]");
          if (!exportBtn || !copyBtn || !rollbackBtn || typeof window.exportDocsTraceCSV !== "function") return false;

          const originalClick = HTMLAnchorElement.prototype.click;
          let downloadName = "";
          HTMLAnchorElement.prototype.click = function patchedAnchorClick() {
            downloadName = this.download || this.getAttribute("download") || "";
          };
          try {
            window.exportDocsTraceCSV();
          } catch (error) {
            return false;
          } finally {
            HTMLAnchorElement.prototype.click = originalClick;
          }

          const exportToast = (document.querySelector("#toast")?.textContent || "").replace(/\s+/g, " ").trim();
          rollbackBtn.click();
          const rollbackToast = (document.querySelector("#toast")?.textContent || "").replace(/\s+/g, " ").trim();
          const exportHelp = `${exportBtn.getAttribute("aria-label") || ""} ${exportBtn.getAttribute("title") || ""}`;
          const copyHelp = `${copyBtn.getAttribute("aria-label") || ""} ${copyBtn.getAttribute("title") || ""}`;
          const rollbackHelp = `${rollbackBtn.getAttribute("aria-label") || ""} ${rollbackBtn.getAttribute("title") || ""}`;

          return /^trisilar-docs-trace-\d{4}-\d{2}-\d{2}\.csv$/.test(downloadName)
            && /Exported \d+ Docs \/ AI Trace row/.test(exportToast)
            && /local CSV/i.test(exportHelp)
            && /No external system is changed/i.test(exportHelp)
            && /audit report/i.test(copyHelp)
            && /No external system is changed/i.test(copyHelp)
            && /Review Queue as the human gate/i.test(rollbackToast)
            && /does not run a live rollback/i.test(rollbackHelp);
        })(),
      },
      {
        label: "Docs trace rows select only and do not auto-open reader",
        selector: ".docs-trace-table-row[data-doc-reader-trigger='true']",
        ok: (() => {
          if (typeof window.closeDocsDetailDrawer === "function") window.closeDocsDetailDrawer({ restore: false });
          const rows = [...document.querySelectorAll(".docs-trace-table-row[data-doc-reader-trigger='true']")];
          if (rows.length < 2) return false;
          const target = rows[1];
          const title = (target.querySelector(".ttitle")?.textContent || "").trim();
          target.click();
          const cardText = (document.querySelector(".docs-inspection-summary")?.textContent || "").replace(/\s+/g, " ").trim();
          return target.classList.contains("active")
            && target.getAttribute("aria-pressed") === "true"
            && !document.querySelector(".docs-reader-panel")
            && cardText.includes(title)
            && !/Open document reader/.test(target.getAttribute("aria-label") || "");
        })(),
      },
    ] : [];
    const docsResponsiveChecks = routeKey === "docs" && !isDesktopViewport ? [
      {
        label: "Docs mobile filterbar reserves normal flow before trace rows",
        selector: "#docs-filterbar, .docs-trace-table",
        ok: (() => {
          const filterbar = document.querySelector("#docs-filterbar");
          const firstRow = document.querySelector(".docs-trace-table .docs-trace-table-row");
          if (!filterbar || !firstRow) return false;
          const filterRect = filterbar.getBoundingClientRect();
          const rowRect = firstRow.getBoundingClientRect();
          return filterRect.height >= 48
            && filterRect.bottom <= rowRect.top + 2
            && filterbar.scrollWidth <= filterbar.clientWidth + 2;
        })(),
      },
      {
        label: "Docs mobile trace rows use stacked audit cards",
        selector: ".docs-trace-table .docs-trace-table-row",
        ok: (() => {
          const head = document.querySelector(".docs-trace-table .trace-head");
          const row = document.querySelector(".docs-trace-table .docs-trace-table-row");
          if (!row) return false;
          const rowStyle = getComputedStyle(row);
          const headHidden = !head || getComputedStyle(head).display === "none";
          return headHidden
            && row.getAttribute("role") === "button"
            && rowStyle.gridTemplateColumns.split(" ").length <= 2
            && row.scrollWidth <= row.clientWidth + 2;
        })(),
      },
      {
        label: "Docs mobile trace identity has copy affordance",
        selector: ".docs-trace-copy-btn, .docs-trace-run-cell .trace",
        ok: (() => {
          const copyButtons = [...document.querySelectorAll(".docs-trace-copy-btn")];
          const traceCapsules = [...document.querySelectorAll(".docs-trace-run-cell .trace")];
          return copyButtons.length >= 1
            && traceCapsules.length >= 1
            && copyButtons.every(btn => btn.getAttribute("type") === "button" && btn.getAttribute("aria-label"));
        })(),
      },
      {
        label: "Docs readonly source chips are static notes",
        selector: "#docs-filterbar .docs-status-chip",
        ok: document.querySelectorAll("#docs-filterbar button.is-readonly:disabled").length === 0
          && document.querySelectorAll("#docs-filterbar .docs-status-chip[role='note']").length >= 3,
      },
    ] : [];
    const settingsDesktopChecks = routeKey === "settings" && isDesktopViewport ? [
      {
        label: "Settings exposes integration edit surface",
        selector: ".settings-integration-editor",
        ok: Boolean(document.querySelector(".settings-integration-editor")),
      },
      {
        label: "Settings integration rows are actionable",
        selector: "#settings-integrations [data-settings-integration]",
        ok: document.querySelectorAll("#settings-integrations [data-settings-integration]").length >= 5,
      },
      {
        label: "Settings integration rows expose active pressed state",
        selector: "#settings-integrations [data-settings-integration][aria-pressed]",
        ok: (() => {
          const buttons = [...document.querySelectorAll("#settings-integrations [data-settings-integration]")];
          return buttons.length >= 5
            && buttons.every(btn => btn.hasAttribute("aria-pressed"))
            && buttons.some(btn => btn.getAttribute("aria-pressed") === "true" && btn.classList.contains("active"));
        })(),
      },
      {
        label: "Settings integration editor keeps private values write-only",
        selector: ".settings-integration-editor input[type=\"password\"]",
        ok: (() => {
          const fields = [...document.querySelectorAll(".settings-integration-editor input[type=\"password\"]")];
          return fields.length >= 1
            && fields.every(field => !field.value
              && /write-only handoff/i.test(field.getAttribute("aria-label") || "")
              && /Runtime Owner|session-only|stored private values/i.test(document.querySelector(".settings-integration-editor")?.textContent || ""));
        })(),
      },
      {
        label: "Settings integration editor explains session-only boundary",
        selector: ".settings-credential-boundary",
        ok: (() => {
          const text = document.querySelector(".settings-credential-boundary")?.textContent || "";
          return /Session-only draft/i.test(text)
            && /does not change live connectors/i.test(text)
            && /stored private values/i.test(text);
        })(),
      },
      {
        label: "Settings Paperclip intake controls are session-only",
        selector: "#settings-paperclip .settings-session-control",
        ok: (() => {
          const control = document.querySelector("#settings-paperclip .settings-session-control");
          const text = control?.textContent || "";
          const buttons = [...document.querySelectorAll("[data-settings-paperclip-mode]")];
          return Boolean(control)
            && /Session-only draft/i.test(text)
            && /Live Paperclip intake is unchanged/i.test(text)
            && buttons.length >= 2
            && buttons.every(btn => (btn.title || "").includes("live mode is unchanged"));
        })(),
      },
      {
        label: "Settings repeated actions have contextual accessible names",
        selector: "#settings-integrations [data-settings-integration], .uiv2-settings-page .vis-toggle",
        ok: (() => {
          const visible = el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
          };
          const name = button => (button.getAttribute("aria-label") || button.title || button.textContent || "").trim();
          const generic = new Set(["Manage", "Visible", "Hidden", "Policy", "Connect"]);
          return [...document.querySelectorAll("#settings-integrations [data-settings-integration], .uiv2-settings-page .vis-toggle, .uiv2-settings-page .group-del-btn")]
            .filter(visible)
            .every(button => name(button) && !generic.has(name(button)));
        })(),
      },
      {
        label: "Settings visible form controls are programmatically labelled",
        selector: ".uiv2-settings-page input",
        ok: (() => {
          const visible = el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
          };
          const hasLabel = input => {
            if (input.getAttribute("aria-label")) return true;
            if (input.id && document.querySelector(`label[for="${CSS.escape(input.id)}"]`)) return true;
            return Boolean(input.closest("label"));
          };
          return [...document.querySelectorAll(".uiv2-settings-page input, .uiv2-settings-page select, .uiv2-settings-page textarea")]
            .filter(input => input.type !== "hidden" && visible(input))
            .every(hasLabel);
        })(),
      },
      {
        label: "Settings visible copy avoids raw credential wording",
        selector: ".uiv2-settings-page",
        ok: (() => {
          const text = document.querySelector(".uiv2-settings-page")?.innerText || "";
          return !/API key|OAuth client not found|\bOAuth\b|\.env|Authorization:|Bearer |\bToken\b|\bsecret\b|\bcredential(s)?\b/i.test(text);
        })(),
      },
      {
        label: "Settings section order matches prototype side navigation",
        selector: ".uiv2-settings-page .set-block > section",
        ok: (() => {
          const expected = [
            "settings-integrations",
            "settings-workspaces",
            "settings-visibility",
            "settings-groups",
            "settings-paperclip",
            "settings-teams",
            "settings-audit",
            "settings-notifications",
            "settings-display",
          ];
          const actual = [...document.querySelectorAll(".uiv2-settings-page .set-block > section")]
            .map(section => section.id);
          return expected.every((id, index) => actual[index] === id);
        })(),
      },
      {
        label: "Settings side nav targets unique sections",
        selector: ".uiv2-settings-page .set-side .sl[data-target]",
        ok: (() => {
          const targets = [...document.querySelectorAll(".uiv2-settings-page .set-side .sl[data-target]")]
            .map(item => item.dataset.target);
          return targets.length >= 9
            && new Set(targets).size === targets.length
            && targets.every(target => Boolean(document.getElementById(target)));
        })(),
      },
      {
        label: "Settings Audit / retention section present",
        selector: "#settings-audit .settings-audit-retention",
        ok: Boolean(document.querySelector("#settings-audit .settings-audit-retention")),
      },
      {
        label: "Settings trace window controls expose selected state",
        selector: "#settings-audit [data-settings-trace-window]",
        ok: (() => {
          const buttons = [...document.querySelectorAll("#settings-audit [data-settings-trace-window]")];
          const openTrace = document.querySelector("#settings-audit button[aria-label*='Docs']");
          return buttons.map(button => button.dataset.settingsTraceWindow).join("|") === "7d|14d|30d"
            && buttons.every(button => ["true", "false"].includes(button.getAttribute("aria-pressed")))
            && buttons.every(button => Boolean(button.getAttribute("title")))
            && buttons.filter(button => button.getAttribute("aria-pressed") === "true").length === 1
            && Boolean(openTrace?.getAttribute("title"));
        })(),
      },
      {
        label: "Settings Notifications section has toggle controls",
        selector: "#settings-notifications [data-settings-notification]",
        ok: document.querySelectorAll("#settings-notifications [data-settings-notification]").length >= 3,
      },
      {
        label: "Settings notification toggles update session draft labels",
        selector: "#settings-notifications [data-settings-notification]",
        ok: (() => {
          const input = document.querySelector("#settings-notifications [data-settings-notification='weeklyDigest']");
          const row = input?.closest(".settings-notification-row");
          const value = row?.querySelector(".sv");
          if (!input || !value) return false;
          const before = input.checked;
          input.click();
          const changed = input.checked !== before;
          const expected = input.checked ? value.dataset.on : value.dataset.off;
          const labelMatches = value.textContent.trim() === expected;
          input.click();
          return changed
            && labelMatches
            && input.checked === before
            && /session|Runtime delivery needs a separate implementation scope|In-app only/i.test(document.querySelector("#settings-notifications")?.textContent || "");
        })(),
      },
      {
        label: "Settings static status chips are not fake buttons",
        selector: ".uiv2-settings-page .chip",
        ok: (() => {
          const staticStatusChips = [...document.querySelectorAll(".uiv2-settings-page .chip")]
            .filter(chip => /disabled|connected|not connected|verified|enforced|gated/i.test(chip.textContent || ""));
          return staticStatusChips.length >= 1
            && staticStatusChips.every(chip => chip.tagName !== "BUTTON")
            && [...document.querySelectorAll(".uiv2-settings-page .seg button")]
              .every(button => button.hasAttribute("aria-pressed") || button.disabled);
        })(),
      },
    ] : [];
    const settingsMobileChecks = routeKey === "settings" && window.innerWidth <= 430 ? [
      {
        label: "Mobile More integration helper copy can wrap and reveal full text",
        selector: ".settings-mobile-integration-copy small",
        ok: (() => {
          const helpers = [...document.querySelectorAll(".settings-mobile-integration-copy small")];
          return helpers.length >= 5
            && helpers.every(helper => {
              const style = getComputedStyle(helper);
              const title = helper.getAttribute("title") || "";
              return style.whiteSpace !== "nowrap"
                && style.fontFamily.toLowerCase().includes("onest")
                && (style.webkitLineClamp === "2" || Number.parseFloat(style.lineHeight) >= 13)
                && title.trim() === helper.textContent.trim();
            });
        })(),
      },
    ] : [];
    const componentChecks = [
      ...(requirements.common || []).map(([label, selector]) => ({
        label,
        selector,
        ok: Boolean(document.querySelector(selector)),
      })),
      ...sidebarIconChecks,
      ...sidebarPrimitiveChecks,
      ...desktopTopbarChecks,
      ...topbarFocusChecks,
      ...desktopStatusbarChecks,
      ...appPaneRouteActionChecks,
      ...sharedTextRevealChecks,
      ...smallLabelContrastChecks,
      ...mobileShellChecks,
      {
        label: "prototype sidebar Settings placement",
        selector: '.sidebar-nav .nav-item[data-page="settings"] before .scope-heading',
        ok: settingsBeforeScope,
      },
      {
        label: "readonly aria-disabled controls expose feedback",
        selector: "button[aria-disabled='true']:not(:disabled)",
        ok: (() => {
          const visible = el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
          };
          return [...document.querySelectorAll("button[aria-disabled='true']:not(:disabled)")]
            .filter(visible)
            .every(button => button.dataset.uiFeedbackReady === "true"
              && Boolean(button.dataset.uiFeedback || button.title || button.getAttribute("aria-label") || button.textContent.trim()));
        })(),
      },
      ...footerConnectorChecks,
      ...todayDesktopChecks,
      ...reviewDesktopChecks,
      ...allTasksDesktopChecks,
      ...boardsDesktopChecks,
      ...plannerDesktopChecks,
      ...okrDesktopChecks,
      ...calendarDesktopChecks,
      ...focusDesktopChecks,
      ...docsDesktopChecks,
      ...docsResponsiveChecks,
      ...settingsDesktopChecks,
      ...settingsMobileChecks,
      ...(requirements[routeKey] || []).map(([label, selector]) => ({
      label,
      selector,
      ok: Boolean(document.querySelector(selector)),
      })),
    ];
    return {
      overflow,
      mobileLabels: labels,
      hasStatusStrip: Boolean(document.querySelector(".shell-status-strip")),
      hasSidebar: Boolean(document.querySelector(".sidebar")),
      hasTopbar: Boolean(document.querySelector(".topbar")),
      hasMobileMore: Boolean(document.querySelector(".settings-mobile-more")),
      boardTitle: document.querySelector("#board-title")?.textContent?.trim() || "",
      bodyText,
      unsafeCopyHits: unsafePatterns.filter(pattern => bodyText.includes(pattern)),
      todayPriorityVisible: visibleInFirstViewport(".next-up, .today-priority-card", null),
      reviewApprovalVisible: visibleInFirstViewport(".review-mobile-actions button, .review-task-card .review-task-actions button, .review-inspection-foot button, .m-actions button", "Approve"),
      reviewRejectVisible: visibleInFirstViewport(".review-mobile-actions button, .review-task-card .review-task-actions button, .review-inspection-foot button, .m-actions button", "Reject"),
      weeklyFocusVerticalTitleRisk: [...document.querySelectorAll(".focus-task-title,.focus-task-name,.focus-lane-title")].some(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.width < 28 && (el.textContent || "").trim().length > 6;
      }),
      componentChecks,
    };
  }, { routeKey: route.key, requirements: componentRequirements, expectedSidebarIconPaths });

  await page.close();
  return { filePath, errors, metrics, viewport };
}

async function writeComparePage(context, title, leftPath, rightPath, outputName) {
  const page = await context.newPage();
  const left = fs.readFileSync(leftPath).toString("base64");
  const right = fs.readFileSync(rightPath).toString("base64");
  await page.setViewportSize({ width: 1500, height: 900 });
  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <style>
          body { margin:0; background:#f0eee9; font-family:Arial, sans-serif; color:#111827; }
          .wrap { padding:16px; }
          h1 { font-size:16px; margin:0 0 12px; }
          .pair { display:grid; grid-template-columns:1fr 1fr; gap:12px; align-items:start; }
          figure { margin:0; background:white; border:1px solid #d8dce5; border-radius:8px; overflow:hidden; }
          figcaption { padding:8px 10px; font-size:12px; font-weight:700; border-bottom:1px solid #e5e7eb; }
          img { display:block; width:100%; height:auto; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>${title}</h1>
          <div class="pair">
            <figure><figcaption>Prototype</figcaption><img src="data:image/png;base64,${left}"></figure>
            <figure><figcaption>Production</figcaption><img src="data:image/png;base64,${right}"></figure>
          </div>
        </div>
      </body>
    </html>
  `, { waitUntil: "load" });
  const outputPath = path.join(OUTPUT_DIR, outputName);
  await page.screenshot({ path: outputPath, fullPage: true });
  await page.close();
  return outputPath;
}

function rel(filePath) {
  return relFrom(AUDIT_PATH, filePath);
}

function relFrom(basePath, filePath) {
  return path.relative(path.dirname(basePath), filePath).replace(/\\/g, "/");
}

function passFail(ok) {
  return ok ? "PASS" : "FAIL";
}

function statusFromResult(result, routeKey) {
  const noOverflow = result.metrics.overflow <= 2;
  const noErrors = result.errors.length === 0;
  const noUnsafeCopy = result.metrics.unsafeCopyHits.length === 0;
  const focusOk = routeKey !== "focus" || !result.metrics.weeklyFocusVerticalTitleRisk;
  return noOverflow && noErrors && noUnsafeCopy && focusOk;
}

function componentMissing(result) {
  return (result.metrics.componentChecks || [])
    .filter(check => !check.ok)
    .map(check => check.label);
}

function componentStatusFromResult(result) {
  return componentMissing(result).length === 0;
}

function buildAuditMarkdown({ baseUrl, prototypeBase, rows, generatedAt }) {
  const header = [
    "# UI V2 Full-Route Fidelity Audit Matrix",
    "",
    `Generated: ${generatedAt}`,
    `Production base: ${baseUrl}`,
    `Prototype base: ${prototypeBase}`,
    "",
    "Scope: frontend/design-system visual QA only. API responses were controlled in-browser fixtures; no runtime, Cloudflare, secrets, live Paperclip behavior, webhook auth, or AI harness behavior was changed.",
    "",
    "Coverage / no-overflow is measured separately from component parity. A route only qualifies for full-fidelity acceptance when both are PASS or an approved deviation is logged.",
    "",
    "| Route | Prototype artboard | Production route | Coverage / no-overflow | Component parity | State coverage | Deviation | Action / evidence |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  const lines = rows.map(row => [
    row.label,
    row.artboard,
    row.path,
    row.coverageStatus,
    row.componentStatus,
    row.state,
    row.deviation,
    row.evidence,
  ].map(cell => String(cell).replace(/\|/g, "\\|")).join(" | "));
  return [...header, ...lines.map(line => `| ${line} |`), "", "## Responsive Viewports", "", "- Desktop route pairs: 1440x900.", "- Production responsive screenshots: 1366x768, 1024x768, app-pane 747x910, 390x844, and 375x667.", "- Mobile tab pairs: Today, Review, Tasks, Boards, More at 390x844.", "- Horizontal overflow tolerance: <= 2px.", "- Console/page errors: zero required unless explicitly recorded in the row action.", ""].join("\n");
}

function buildComponentAuditMarkdown({ rows, generatedAt }) {
  const header = [
    "# UI V2 Component Parity Audit",
    "",
    `Generated: ${generatedAt}`,
    "**Status:** Generated by `npm.cmd run verify:uiv2-full-fidelity`",
    "",
    "Component parity checks verify route primitives and route-specific component presence separately from no-overflow/browser-health coverage.",
    "",
    "| Route | Component parity | Missing prototype primitives | Evidence |",
    "| --- | --- | --- | --- |",
  ];
  const lines = rows.map(row => [
    row.label,
    row.componentStatus,
    row.componentMissing || "None",
    row.componentEvidence || row.evidence,
  ].map(cell => String(cell).replace(/\|/g, "\\|")).join(" | "));
  return [
    ...header,
    ...lines.map(line => `| ${line} |`),
    "",
    "## Manual PM/UX Follow-Up Checks",
    "",
    "- Topbar dropdown/action UX: Scope picker must open a listbox-style BU menu, Docs / AI Trace Filter must open a compact filter dialog with visible active count, and Bell/Scope/Filter popovers must dismiss each other instead of stacking invisible state.",
    "- Settings button/chip primitive consistency: Integrations action buttons, Board Visibility toggles, BU group Delete/board chips, Monitor label chips, and manage-modal controls use the UI V2 compact button/chip rhythm with Onest typography, restrained color surfaces, 6px radius, and SVG icons where helpful.",
    "- Automated component parity remains evidence only. PM/UX visual review is still required for final acceptance when live preview shows drift that selector checks cannot express.",
    "",
    "## Safety Boundary",
    "",
    "- Existing APIs/stores remain the source of production data.",
    "- Prototype fixtures are layout reference only.",
    "- No runtime, Cloudflare, secrets, live Paperclip behavior, webhook auth, AI harness, or Full Rewrite scope is included.",
    "",
  ].join("\n");
}

async function main() {
  ensureDir(OUTPUT_DIR);
  if (!fs.existsSync(PROTOTYPE_DIR)) {
    throw new Error(`Prototype directory not found: ${PROTOTYPE_DIR}`);
  }

  const { baseUrl, process: appProcess } = await resolveAppBase();
  const protoPort = await getFreePort();
  const protoServer = await serveStatic(PROTOTYPE_DIR, protoPort);
  const prototypeBase = `http://127.0.0.1:${protoPort}`;
  const browser = await chromium.launch({ headless: true });
  const protoContext = await browser.newContext({ viewport: { width: 1700, height: 1200 } });
  const prodContext = await browser.newContext();
  const compareContext = await browser.newContext();
  const rows = [];
  const generatedAt = new Date().toISOString();

  try {
    const protoPage = await protoContext.newPage();
    for (const route of desktopRoutes) {
      const protoShot = await capturePrototype(protoPage, prototypeBase, route.artboard, `prototype-${route.key}-desktop-1440x900.png`);
      const desktop = await captureProduction(prodContext, baseUrl, route, responsiveViewports[0], `production-${route.key}-desktop-1440x900.png`);
      const compare = await writeComparePage(compareContext, `${route.label} desktop`, protoShot, desktop.filePath, `compare-${route.key}-desktop-1440x900.png`);

      const laptop = await captureProduction(prodContext, baseUrl, route, responsiveViewports[1], `production-${route.key}-laptop-1366x768.png`);
      const tablet = await captureProduction(prodContext, baseUrl, route, responsiveViewports[2], `production-${route.key}-tablet-1024x768.png`);
      const appPane = await captureProduction(prodContext, baseUrl, route, appPaneViewport, `production-${route.key}-app-pane-747x910.png`);
      const mobile = await captureProduction(prodContext, baseUrl, route, responsiveViewports[3], `production-${route.key}-mobile-390x844.png`);
      const mobileSmall = await captureProduction(prodContext, baseUrl, route, responsiveViewports[4], `production-${route.key}-mobile-small-375x667.png`);
      const responsiveResults = [laptop, tablet, appPane, mobile, mobileSmall];

      const desktopOk = statusFromResult(desktop, route.key);
      const mobileOk = responsiveResults.every(result => statusFromResult(result, route.key));
      const desktopComponentOk = componentStatusFromResult(desktop);
      const mobileComponentOk = responsiveResults.every(componentStatusFromResult);
      const missingComponents = [...new Set([desktop, ...responsiveResults].flatMap(componentMissing))];
      const extraChecks = [];
      if (route.key === "today") extraChecks.push({ label: "first viewport priority", ok: mobile.metrics.todayPriorityVisible || desktop.metrics.todayPriorityVisible });
      if (route.key === "review") extraChecks.push({ label: "mobile approve/reject", ok: mobile.metrics.reviewApprovalVisible && mobile.metrics.reviewRejectVisible && mobileSmall.metrics.reviewApprovalVisible && mobileSmall.metrics.reviewRejectVisible });
      if (route.key === "settings") extraChecks.push({ label: "mobile More", ok: mobile.metrics.hasMobileMore && mobileSmall.metrics.hasMobileMore && mobile.metrics.boardTitle === "More" && mobileSmall.metrics.boardTitle === "More" });
      if (route.key === "focus") extraChecks.push({ label: "no vertical wrap", ok: !mobile.metrics.weeklyFocusVerticalTitleRisk && !mobileSmall.metrics.weeklyFocusVerticalTitleRisk });
      const allErrors = [desktop, ...responsiveResults].flatMap(result => result.errors);
      const allUnsafe = [desktop, ...responsiveResults].flatMap(result => result.metrics.unsafeCopyHits);
      const extraChecksOk = extraChecks.every(check => check.ok);
      rows.push({
        label: route.label,
        artboard: route.artboard,
        path: route.path,
        coverageStatus: desktopOk && mobileOk && extraChecksOk
          ? `PASS${extraChecks.length ? " - " + extraChecks.map(check => `${check.label} ${passFail(check.ok)}`).join("; ") : ""}`
          : `FAIL (desktop ${Math.round(desktop.metrics.overflow)}px overflow / responsive ${responsiveResults.map(r => `${r.viewport.name}:${Math.round(r.metrics.overflow)}px`).join("/")} overflow / ${allErrors.length} errors${extraChecks.length ? ` / ${extraChecks.map(check => `${check.label} ${passFail(check.ok)}`).join("; ")}` : ""})`,
        componentStatus: desktopComponentOk && mobileComponentOk ? "PASS" : `FAIL (${missingComponents.join(", ")})`,
        componentMissing: missingComponents.length ? missingComponents.join(", ") : "None",
        state: route.state,
        deviation: approvedDeviations[route.key] || "None",
        evidence: `[compare](${rel(compare)})${allErrors.length ? `; console errors: ${allErrors.slice(0, 2).join(" / ")}` : ""}${allUnsafe.length ? `; unsafe copy: ${[...new Set(allUnsafe)].join(", ")}` : ""}`,
        componentEvidence: `[compare](${relFrom(COMPONENT_AUDIT_PATH, compare)})`,
      });
    }
    await protoPage.close();

    const protoMobilePage = await protoContext.newPage();
    for (const tab of mobileTabs) {
      const protoShot = await capturePrototype(protoMobilePage, prototypeBase, tab.artboard, `prototype-${tab.key}-mobile-390x844.png`);
      const prodShot = await captureProduction(prodContext, baseUrl, tab, responsiveViewports[3], `production-${tab.key}-mobile-390x844.png`);
      await writeComparePage(compareContext, `${tab.label} mobile`, protoShot, prodShot.filePath, `compare-${tab.key}-mobile-390x844.png`);
    }
    await protoMobilePage.close();

    const navCheck = await captureProduction(prodContext, baseUrl, { path: "/settings", key: "settings-nav" }, responsiveViewports[3], "production-mobile-nav-label-check.png");
    const navLabels = navCheck.metrics.mobileLabels.join(" / ");
    if (navLabels !== "Today / Review / Tasks / Boards / More") {
      throw new Error(`Mobile nav labels mismatch: ${navLabels}`);
    }

    const audit = buildAuditMarkdown({ baseUrl, prototypeBase, rows, generatedAt });
    fs.writeFileSync(AUDIT_PATH, audit, "utf8");
    const componentAudit = buildComponentAuditMarkdown({ rows, generatedAt });
    fs.writeFileSync(COMPONENT_AUDIT_PATH, componentAudit, "utf8");

    const failures = rows.filter(row => row.coverageStatus.startsWith("FAIL") || row.componentStatus.startsWith("FAIL"));
    if (failures.length) {
      console.error(`UI V2 full-fidelity audit found ${failures.length} failing rows.`);
      console.error(failures.map(row => `${row.label}: ${row.coverageStatus} / ${row.componentStatus}`).join("\n"));
      process.exitCode = 1;
    } else {
      console.log(`UI V2 full-fidelity audit passed for ${rows.length} desktop routes and ${mobileTabs.length} mobile tabs.`);
      console.log(`Audit: ${AUDIT_PATH}`);
      console.log(`Component audit: ${COMPONENT_AUDIT_PATH}`);
      console.log(`Screenshots: ${OUTPUT_DIR}`);
    }
  } finally {
    await compareContext.close().catch(() => {});
    await prodContext.close().catch(() => {});
    await protoContext.close().catch(() => {});
    await browser.close().catch(() => {});
    protoServer.close();
    if (appProcess) appProcess.kill();
  }
}

main().catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});
