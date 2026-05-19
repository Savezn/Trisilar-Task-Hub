const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require("net");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-state-fixtures");
const SUMMARY_PATH = path.join(OUTPUT_DIR, "uiv2-state-fixture-summary.md");
const JSON_PATH = path.join(OUTPUT_DIR, "uiv2-state-fixture-results.json");

const now = new Date("2026-05-18T09:00:00+07:00");
const isoAt = (days, hour) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const boards = [
  { id: "b-revenue", name: "Project - Revenue Workflow Sales & Niche Launch", idOrganization: "w-main", closed: false, lists: [{ id: "l-next", name: "Next" }] },
  { id: "b-product", name: "Project - Product Factory Automation", idOrganization: "w-main", closed: false, lists: [{ id: "l-build", name: "Build" }] },
];

const cards = [
  {
    id: "c-state-1",
    idBoard: "b-revenue",
    boardId: "b-revenue",
    boardName: boards[0].name,
    idList: "l-next",
    listId: "l-next",
    listName: "Next",
    name: "State fixture task for UI V2 no-results recovery",
    desc: "Controlled UI V2 state fixture.",
    due: isoAt(0, 16),
    dueComplete: false,
    labels: [{ name: "Revenue", color: "blue" }],
    members: [{ id: "m-pm", fullName: "PM Owner", username: "pm" }],
    checklists: [{ checkItems: [{ state: "complete" }, { state: "incomplete" }] }],
  },
  {
    id: "c-state-2",
    idBoard: "b-product",
    boardId: "b-product",
    boardName: boards[1].name,
    idList: "l-build",
    listId: "l-build",
    listName: "Build",
    name: "Prototype component parity review",
    desc: "Controlled UI V2 task.",
    due: isoAt(1, 11),
    dueComplete: false,
    labels: [{ name: "Product", color: "green" }],
    members: [],
    checklists: [],
  },
];

const sessions = [
  {
    id: "pc-run-state-001",
    requestId: "pc-req-state-001",
    source: "paperclip",
    sourceEnv: "mock",
    createdAt: isoAt(0, 12),
    title: "Controlled state fixture session",
    tasks: [
      {
        id: "pc-task-state-001",
        title: "Review Queue state fixture proposal",
        status: "pending",
        confidence: 0.86,
        diffStatus: "new",
        targetBoardId: "b-revenue",
        targetListId: "l-next",
        owner: "PM Owner",
        priority: "high",
        deadline: isoAt(0, 17),
        reasoning: "Controlled fixture for state coverage.",
      },
    ],
  },
];

const missingContextSessions = [
  {
    id: "pc-run-state-missing-001",
    requestId: "pc-req-state-missing-001",
    source: "paperclip",
    sourceEnv: "mock",
    createdAt: isoAt(0, 12),
    title: "Controlled missing-context review session",
    tasks: [
      {
        id: "pc-task-state-missing-001",
        title: "Review Queue missing context proposal",
        status: "pending",
        confidence: 0.77,
        diffStatus: "create_new",
        targetBoardId: "b-revenue",
        targetListId: "",
        owner: "",
        priority: "high",
        deadline: isoAt(0, 17),
        reasoning: "Controlled fixture for missing-context approval guard.",
      },
    ],
  },
];

const docsPayload = {
  mode: "mock",
  source: { system: "paperclip", mode: "mock", environment: "production" },
  documents: [
    {
      artifactId: "doc_state_fixture",
      title: "State Fixture Trace",
      status: "approved",
      artifactType: "meeting_summary",
      generatedAt: isoAt(0, 13),
      agent: { agentName: "Paperclip Docs Agent", runId: "run_state_fixture" },
      summary: "Controlled trace fixture.",
      content: { text: "# State Fixture Trace\n\nControlled UI V2 state fixture." },
      linkedTasks: [{ requestId: "pc-req-state-001", taskId: "pc-task-state-001", title: "Review Queue state fixture proposal" }],
      sourceEvidence: [{ type: "fixture", label: "Controlled QA", value: "state-fixture" }],
      workflowAuditTrail: [{ type: "checked", at: isoAt(0, 13), note: "State fixture generated." }],
    },
  ],
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForHealth(baseUrl, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      if (Date.now() > deadline) return reject(new Error(`Server did not become healthy at ${baseUrl}`));
      const req = http.get(`${baseUrl}/healthz`, res => {
        res.resume();
        if (res.statusCode === 200) return resolve();
        setTimeout(attempt, 250);
      });
      req.on("error", () => setTimeout(attempt, 250));
      req.setTimeout(1500, () => {
        req.destroy();
        setTimeout(attempt, 250);
      });
    };
    attempt();
  });
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

async function resolveAppBase() {
  if (process.env.UIV2_APP_BASE_URL) {
    const baseUrl = process.env.UIV2_APP_BASE_URL.replace(/\/+$/, "");
    await waitForHealth(baseUrl, 5000);
    return { baseUrl, process: null };
  }
  const preferredPort = Number(process.env.PORT || 3032);
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

function fulfillJson(route, body, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installStateApi(page, scenario) {
  const activeSessions = scenario.missingReviewContext ? missingContextSessions : sessions;
  await page.route("**/api/**", async route => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (scenario.delayApi && ["/api/config", "/api/boards", "/api/all-cards", "/api/reviews"].includes(pathname)) {
      await wait(1800);
    }

    if (req.method() !== "GET") {
      if (pathname === "/api/boards/cards") return fulfillJson(route, scenario.emptyCards ? [] : cards);
      if (pathname.includes("/approve") || pathname.includes("/reject")) {
        return fulfillJson(route, { ok: true, task: activeSessions[0].tasks[0] });
      }
      return fulfillJson(route, { ok: true, id: "state-fixture" });
    }

    if (pathname === "/api/config") {
      return fulfillJson(route, {
        groups: [
          { id: "g-revenue", name: "Revenue Ops", color: "#2563eb", boardIds: ["b-revenue"] },
          { id: "g-product", name: "Product", color: "#137e52", boardIds: ["b-product"] },
        ],
        hiddenBoards: [],
        allowedWorkspaceIds: ["w-main"],
        monitorTeams: ["Revenue", "Product"],
      });
    }
    if (pathname === "/api/trello/status") return fulfillJson(route, { configured: true, verified: true, connected: true, state: "verified" });
    if (pathname === "/api/calendar/status") return fulfillJson(route, { connected: false });
    if (pathname === "/api/calendar/events") return fulfillJson(route, scenario.emptyCalendar ? [] : [{ id: "evt-state-1", summary: "Controlled calendar fixture", start: { dateTime: isoAt(0, 15) }, end: { dateTime: isoAt(0, 16) } }]);
    if (pathname === "/api/google-tasks/status") return fulfillJson(route, { connected: false, error: "Google Tasks connection is not active in this controlled run." });
    if (pathname === "/api/google-tasks/today") return fulfillJson(route, []);
    if (pathname === "/api/boards") return fulfillJson(route, boards);
    if (pathname === "/api/all-cards") return fulfillJson(route, scenario.emptyCards ? [] : cards);
    if (pathname === "/api/reviews") return fulfillJson(route, scenario.emptyReviews ? [] : activeSessions);
    if (/^\/api\/reviews\/pc-run-state/.test(pathname)) return fulfillJson(route, activeSessions[0]);
    if (pathname === "/api/integrations/paperclip/mock/docs") return fulfillJson(route, scenario.emptyDocs ? { ...docsPayload, documents: [] } : docsPayload);
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
        reviewQueue: { pending: 0, rejected: 0, cleanedSessions: 0, trelloLinked: 0 },
        warnings: [],
        audit: { accepted: {}, rejected: {}, replay: {}, cleanup: {} },
      });
    }
    if (pathname === "/api/workspaces") return fulfillJson(route, [{ id: "w-main", name: "Trisilar Main Workspace" }]);
    if (/^\/api\/boards\/[^/]+\/health$/.test(pathname)) return fulfillJson(route, { ok: true, missing: [] });
    if (/^\/api\/boards\/[^/]+\/lists$/.test(pathname)) return fulfillJson(route, [{ id: "l-next", name: "Next" }, { id: "l-build", name: "Build" }]);
    if (/^\/api\/lists\/[^/]+\/cards$/.test(pathname)) {
      const listId = pathname.split("/")[3];
      return fulfillJson(route, (scenario.emptyCards ? [] : cards).filter(card => card.listId === listId));
    }
    if (/^\/api\/cards\/[^/]+\/checklists$/.test(pathname)) return fulfillJson(route, []);
    return fulfillJson(route, { ok: true });
  });
}

async function routeReady(page, scenario) {
  if (scenario.id === "today-loading") {
    await page.locator(".loading-box").first().waitFor({ state: "visible", timeout: 3000 });
    return;
  }
  await page.locator("#board-content").waitFor({ state: "visible", timeout: 30000 });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(250);
}

function assertText(bodyText, patterns) {
  return patterns.some(pattern => bodyText.toLowerCase().includes(pattern.toLowerCase()));
}

async function runScenario(context, baseUrl, scenario) {
  const page = await context.newPage();
  const errors = [];
  page.on("console", msg => {
    if (msg.type() === "error" || msg.type() === "warning") errors.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", err => errors.push(err.message));
  await installStateApi(page, scenario);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}${scenario.route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await routeReady(page, scenario);

  if (scenario.afterLoad) await scenario.afterLoad(page);

  const fileName = `${scenario.id}-desktop-1440x900.png`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  const metrics = await page.evaluate(() => ({
    title: document.querySelector("#board-title")?.textContent?.trim() || document.title,
    bodyText: document.body.innerText,
    overflowX: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  }));
  const okText = assertText(metrics.bodyText, scenario.expectedText);
  const ok = okText && metrics.overflowX <= 2 && errors.length === 0;
  await page.close();
  return {
    id: scenario.id,
    route: scenario.route,
    state: scenario.state,
    ok,
    expectedText: scenario.expectedText,
    title: metrics.title,
    overflowX: metrics.overflowX,
    consoleErrors: errors,
    screenshot: path.relative(ROOT, filePath).replace(/\\/g, "/"),
    reason: ok ? "pass" : [
      okText ? "" : "expected text missing",
      metrics.overflowX > 2 ? `overflow ${metrics.overflowX}` : "",
      errors.length ? `${errors.length} console/page errors` : "",
    ].filter(Boolean).join("; "),
  };
}

function writeSummary(results) {
  const lines = [
    "# UI V2 State Fixture Evidence",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This QC evidence exercises forced UI states that are not guaranteed by the normal populated full-fidelity pass. It uses controlled API fixtures only and does not contact Trello, Google Calendar, Google Tasks, Paperclip live runtime, Cloudflare, or secrets.",
    "",
    "| State | Route | Status | Evidence | Notes |",
    "|---|---|---|---|---|",
    ...results.map(result => `| ${result.state} | \`${result.route}\` | ${result.ok ? "PASS" : "FAIL"} | \`${result.screenshot}\` | ${result.reason || `title: ${result.title}; overflow ${result.overflowX}`} |`),
    "",
    "## Boundary",
    "",
    "- Controlled API fixtures only.",
    "- Frontend/UI evidence only.",
    "- No runtime/API/schema/secrets/Cloudflare/Paperclip live/Trello/Calendar/Google Tasks writes.",
  ];
  fs.writeFileSync(SUMMARY_PATH, `${lines.join("\n")}\n`, "utf8");
  fs.writeFileSync(JSON_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`, "utf8");
}

async function main() {
  ensureDir(OUTPUT_DIR);
  const { baseUrl, process: appProcess } = await resolveAppBase();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const scenarios = [
    {
      id: "today-loading",
      route: "/today",
      state: "loading",
      delayApi: true,
      expectedText: ["Loading Task Hub", "Loading"],
    },
    {
      id: "review-empty",
      route: "/review",
      state: "empty",
      emptyReviews: true,
      expectedText: ["Review queue is empty", "No proposals to review"],
    },
    {
      id: "review-filtered-no-match",
      route: "/review",
      state: "filtered no-match",
      expectedText: ["No proposals match these filters", "Clear filters"],
      afterLoad: async page => {
        await page.locator("#review-filterbar button").filter({ hasText: "status: approved" }).click();
        await page.waitForSelector(".review-empty-panel", { timeout: 10000 });
      },
    },
    {
      id: "review-missing-context-guard",
      route: "/review",
      state: "missing-context approval guard",
      missingReviewContext: true,
      expectedText: ["Missing owner, list", "Trello write blocked until board/list is resolved"],
      afterLoad: async page => {
        await page.waitForSelector(".review-inspection-panel", { timeout: 10000 });
        await page.waitForSelector(".review-inspection-foot .btn-success:disabled", { timeout: 10000 });
      },
    },
    {
      id: "all-tasks-filtered-no-match",
      route: "/all",
      state: "filtered no-match",
      expectedText: ["No tasks match this view", "Clear filters"],
      afterLoad: async page => {
        await page.locator("#tasks-search-input").fill("__NO_MATCH_STATE_FIXTURE__");
        await page.waitForSelector(".task-empty-row", { timeout: 10000 });
      },
    },
    {
      id: "docs-filtered-no-match",
      route: "/docs",
      state: "filtered no-match",
      expectedText: ["No documents match the current filters", "Clear search"],
      afterLoad: async page => {
        await page.locator("#docs-search-input").fill("__NO_MATCH_STATE_FIXTURE__");
        await page.waitForSelector(".docs-empty", { timeout: 10000 });
      },
    },
    {
      id: "calendar-disconnected",
      route: "/calendar",
      state: "disconnected",
      emptyCalendar: true,
      expectedText: ["Google Calendar is disconnected", "Connect Google Calendar"],
    },
    {
      id: "planner-disconnected",
      route: "/planner",
      state: "disconnected",
      expectedText: ["Google Tasks is disconnected", "Connect Google Tasks"],
    },
  ];

  try {
    const results = [];
    for (const scenario of scenarios) {
      results.push(await runScenario(context, baseUrl, scenario));
    }
    writeSummary(results);
    const failed = results.filter(result => !result.ok);
    if (failed.length) {
      console.error(`UI V2 state fixture evidence failed: ${failed.map(result => result.id).join(", ")}`);
      console.error(`Summary: ${SUMMARY_PATH}`);
      process.exitCode = 1;
      return;
    }
    console.log(`UI V2 state fixture evidence passed for ${results.length} forced states.`);
    console.log(`Summary: ${SUMMARY_PATH}`);
    console.log(`Screenshots: ${OUTPUT_DIR}`);
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    if (appProcess) appProcess.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
