const fs = require("fs");
const http = require("http");
const net = require("net");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");

function isoAt(dayOffset, hour) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hour, 30, 0, 0);
  return date.toISOString();
}

const boards = [
  { id: "b-revenue", name: "Revenue Board", idOrganization: "w-main" },
  { id: "b-ops", name: "Operations Board", idOrganization: "w-main" },
  { id: "b-okr", name: "OKR Board", idOrganization: "w-main" },
  { id: "b-hidden", name: "Hidden Archive", idOrganization: "w-main" },
];

const cards = [
  {
    id: "c-overdue",
    name: "Follow up on delayed onboarding",
    boardId: "b-revenue",
    boardName: "Revenue Board",
    listName: "Customer Success",
    due: isoAt(-2, 9),
    dueComplete: false,
    labels: [{ name: "P0", color: "red" }],
    members: [{ id: "u-pm", fullName: "Nora PM" }],
    desc: "Priority follow-up for a blocked onboarding.",
    checklists: [{ checkItems: [{ state: "complete" }, { state: "incomplete" }] }],
  },
  {
    id: "c-today",
    name: "Prepare release checklist",
    boardId: "b-ops",
    boardName: "Operations Board",
    listName: "Release",
    due: isoAt(0, 23),
    dueComplete: false,
    labels: [{ name: "Release", color: "blue" }],
    members: [{ id: "u-qa", fullName: "QA Lead" }],
    checklists: [],
  },
  {
    id: "c-ai",
    name: "Review AI browser regression notes",
    boardId: "b-ops",
    boardName: "Operations Board",
    listName: "Review AI",
    due: isoAt(1, 10),
    dueComplete: false,
    labels: [{ name: "AI", color: "purple" }],
    members: [{ id: "u-qa", fullName: "QA Lead" }],
    checklists: [],
  },
  {
    id: "c-blocked",
    name: "Blocked credential rotation follow-up",
    boardId: "b-revenue",
    boardName: "Revenue Board",
    listName: "Waiting",
    due: isoAt(3, 11),
    dueComplete: false,
    labels: [{ name: "Blocked", color: "orange" }],
    members: [],
    checklists: [],
  },
  {
    id: "c-okr",
    name: "KR1.1 Stabilize Task Hub regression gate",
    boardId: "b-okr",
    boardName: "OKR Board",
    listName: "Objective 1 - Product reliability",
    due: isoAt(5, 17),
    dueComplete: false,
    labels: [{ name: "Reliability", color: "green" }],
    members: [{ id: "u-pm", fullName: "Nora PM" }],
    checklists: [{ checkItems: [{ state: "complete" }, { state: "incomplete" }, { state: "incomplete" }] }],
  },
  {
    id: "c-hidden",
    name: "Hidden board task should stay filtered",
    boardId: "b-hidden",
    boardName: "Hidden Archive",
    listName: "Archive",
    due: isoAt(0, 12),
    dueComplete: false,
    labels: [],
    members: [],
    checklists: [],
  },
];

const sessions = [
  {
    id: "rux05-session",
    title: "RUX-05 fixture session",
    source: "browser-regression",
    createdAt: new Date().toISOString(),
    tasks: [
      { id: "rt-1", title: "Confirm browser regression gate", status: "pending", source: "meeting" },
      { id: "rt-2", title: "Archived note", status: "rejected", source: "meeting" },
    ],
  },
];

const docsPayload = {
  mode: "mock",
  source: { system: "paperclip", environment: "mock", workspaceId: "rux05-fixture", threadId: "rux05-thread" },
  documents: [
    {
      artifactId: "doc-rux05",
      title: "RUX-05 QA Fixture",
      status: "ready",
      artifactType: "qa-note",
      generatedAt: new Date().toISOString(),
      agent: { agentId: "codex-qa", agentName: "Codex QA", agentRole: "QA", runId: "rux05-run", parentRunId: "rux04-run" },
      summary: "Controlled Paperclip document for browser regression.",
      content: { text: "# RUX-05 QA Fixture\n\nControlled document for browser regression." },
      tags: ["rux05", "browser-regression"],
      linkedTasks: [{ sessionId: "rux05-session", taskId: "rt-1", title: "Confirm browser regression gate" }],
      sourceEvidence: [{ type: "fixture", label: "Controlled QA", value: "route-stub" }],
      workflowAuditTrail: [{ type: "generated", at: new Date().toISOString(), note: "Created by browser regression fixture." }],
    },
  ],
};

const routeMatrix = [
  { path: "/today", texts: ["Daily command center", "Start here", "Source: Trello", "Next action:", "Needs human approval"] },
  { path: "/review", texts: ["Review Queue", "awaiting approval", "RUX-05 fixture session"] },
  { path: "/all", texts: ["Tasks", "Source: Trello", "Next action:", "Nora PM"] },
  { path: "/boards", texts: ["Boards", "Revenue Board"] },
  { path: "/calendar", texts: ["Calendar", "Connect Google Calendar", "Google Calendar is disconnected"] },
  { path: "/planner", texts: ["Daily Planner", "Google Tasks is disconnected", "Trello deadlines"] },
  { path: "/okr", texts: ["OKR Progress", "KR1.1 Stabilize Task Hub regression gate"] },
  { path: "/focus", texts: ["Weekly Focus", "Open Review Queue", "Do Now"] },
  { path: "/settings", texts: ["Settings", "Trello", "Paperclip"] },
  { path: "/docs", texts: ["Agent Documents", "RUX-05 QA Fixture", "Source system", "Source mode"] },
];

const viewports = [
  { name: "desktop", viewport: { width: 1440, height: 960 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
];

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
    const retry = () => {
      if (Date.now() > deadline) return reject(new Error(`Server did not become healthy at ${baseUrl}`));
      setTimeout(attempt, 250);
    };
    attempt();
  });
}

function fulfillJson(route, body, status = 200) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installControlledApi(page, { trelloVerified = true } = {}) {
  await page.route("**/api/**", route => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (req.method() !== "GET") {
      if (pathname === "/api/boards/cards") return fulfillJson(route, cards.filter(card => card.boardId !== "b-hidden"));
      return fulfillJson(route, { ok: true });
    }

    if (pathname === "/api/trello/status") {
      return fulfillJson(route, trelloVerified
        ? { configured: true, verified: true, connected: true, state: "verified" }
        : { configured: false, verified: false, connected: false, state: "disconnected", error: "Runtime needs to configure Trello credentials before board data can load." });
    }
    if (pathname === "/api/config") {
      return fulfillJson(route, {
        groups: [],
        hiddenBoards: ["b-hidden"],
        allowedWorkspaceIds: ["w-main"],
        monitorTeams: [],
        businessUnits: [],
      });
    }
    if (pathname === "/api/calendar/status") return fulfillJson(route, { connected: false });
    if (pathname === "/api/google-tasks/status") {
      return fulfillJson(route, { connected: false, error: "Google Tasks is disconnected for this controlled regression run." });
    }
    if (pathname === "/api/google-tasks/today") return fulfillJson(route, []);
    if (pathname === "/api/boards") return fulfillJson(route, trelloVerified ? boards : []);
    if (pathname === "/api/all-cards") return fulfillJson(route, cards);
    if (pathname === "/api/reviews") return fulfillJson(route, sessions);
    if (pathname === "/api/reviews/rux05-session") return fulfillJson(route, sessions[0]);
    if (pathname === "/api/integrations/paperclip/mock/docs") return fulfillJson(route, docsPayload);
    if (pathname === "/api/integrations/paperclip/connection") {
      return fulfillJson(route, { status: "disabled", enabled: false, hasSecret: false });
    }
    if (pathname === "/api/workspaces") return fulfillJson(route, [{ id: "w-main", name: "Main Workspace" }]);
    if (/^\/api\/boards\/[^/]+\/health$/.test(pathname)) return fulfillJson(route, { ok: true, missing: [] });
    if (/^\/api\/boards\/[^/]+\/lists$/.test(pathname)) {
      return fulfillJson(route, [{ id: "list-1", name: "Backlog" }, { id: "list-2", name: "Done" }]);
    }
    if (/^\/api\/lists\/[^/]+\/cards$/.test(pathname)) return fulfillJson(route, cards.filter(card => card.boardId !== "b-hidden"));
    if (/^\/api\/cards\/[^/]+\/checklists$/.test(pathname)) return fulfillJson(route, []);
    return fulfillJson(route, { ok: true });
  });
}

async function waitForVisibleText(page, text) {
  try {
    await page.waitForFunction(
      needle => [...document.body.querySelectorAll("*")].some(el => {
        if (!el.textContent || !el.textContent.includes(needle)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      }),
      text,
      { timeout: 10000 }
    );
  } catch (err) {
    throw new Error(`Missing visible text "${text}" on ${page.url()}`);
  }
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    docClient: document.documentElement.clientWidth,
    docScroll: document.documentElement.scrollWidth,
    bodyClient: document.body?.clientWidth || 0,
    bodyScroll: document.body?.scrollWidth || 0,
  }));
  const overflow = Math.max(metrics.docScroll - metrics.docClient, metrics.bodyScroll - metrics.bodyClient);
  if (overflow > 2) {
    throw new Error(`${label} horizontal overflow ${overflow}px (${JSON.stringify(metrics)})`);
  }
}

async function visibleTextCount(page, text) {
  return page.evaluate(needle => [...document.body.querySelectorAll("*")].filter(el => {
    if (!el.textContent || !el.textContent.includes(needle)) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
  }).length, text);
}

async function checkRoute(page, baseUrl, routePath, texts, label) {
  await page.goto(`${baseUrl}${routePath}`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  for (const text of texts) await waitForVisibleText(page, text);
  await assertNoHorizontalOverflow(page, label);
  const hiddenVisible = await visibleTextCount(page, "Hidden board task should stay filtered");
  if (hiddenVisible > 0) throw new Error(`${label} exposed hidden board task text`);
}

async function checkDisconnectedToday(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await installControlledApi(page, { trelloVerified: false });
  await page.goto(`${baseUrl}/today`, { waitUntil: "domcontentloaded" });
  await waitForVisibleText(page, "Today needs Trello verification");
  await waitForVisibleText(page, "Runtime owns Trello credential verification");
  const envCopy = await visibleTextCount(page, ".env");
  const apiKeyCopy = await visibleTextCount(page, "API key");
  await assertNoHorizontalOverflow(page, "mobile disconnected /today");
  await context.close();
  if (envCopy || apiKeyCopy) throw new Error("Disconnected Today exposed developer-facing credential copy");
}

async function runBrowserMatrix(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  const browserErrors = [];
  try {
    for (const viewportSpec of viewports) {
      const context = await browser.newContext({ viewport: viewportSpec.viewport });
      const page = await context.newPage();
      page.on("console", msg => {
        if (msg.type() === "error") browserErrors.push(`${viewportSpec.name} console: ${msg.text()}`);
      });
      page.on("pageerror", err => browserErrors.push(`${viewportSpec.name} pageerror: ${err.message}`));
      await installControlledApi(page);

      for (const route of routeMatrix) {
        await checkRoute(page, baseUrl, route.path, route.texts, `${viewportSpec.name} ${route.path}`);
      }
      await context.close();
    }

    await checkDisconnectedToday(browser, baseUrl);
  } finally {
    await browser.close();
  }

  if (browserErrors.length) {
    throw new Error(`Browser errors captured:\n${browserErrors.join("\n")}`);
  }
}

async function main() {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "trisilar-rux-browser-"));
  const server = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(port),
      APP_DATA_DIR: dataDir,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverLog = "";
  server.stdout.on("data", chunk => { serverLog += chunk.toString(); });
  server.stderr.on("data", chunk => { serverLog += chunk.toString(); });

  const cleanup = () => {
    if (!server.killed) server.kill();
    fs.rmSync(dataDir, { recursive: true, force: true });
  };
  process.on("exit", cleanup);

  try {
    await waitForHealth(baseUrl);
    await runBrowserMatrix(baseUrl);
    console.log("RUX browser regression passed.");
    console.log(`Routes: ${routeMatrix.map(route => route.path).join(", ")}`);
    console.log(`Viewports: ${viewports.map(v => `${v.name} ${v.viewport.width}x${v.viewport.height}`).join(", ")}`);
    console.log("Controlled API fixtures used; no production secrets required.");
  } catch (err) {
    console.error(err.message);
    if (serverLog.trim()) console.error(`\nServer output:\n${serverLog.trim()}`);
    process.exitCode = 1;
  } finally {
    cleanup();
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
