require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const trello = require("./trello");
const store  = require("./review-store");
const diff   = require("./task-diff");
const makeConfigRoutes  = require("./src/routes/config.routes");
const makeReviewRoutes   = require("./src/routes/review.routes");
const makeCalendarRoutes = require("./src/routes/calendar.routes");

// ── Google Calendar helpers ───────────────────────────────────────────────────
const getCalendarId = () => process.env.GOOGLE_CALENDAR_ID || "";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

function getCalendarClient() {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth });
}

function getTasksClient() {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.tasks({ version: "v1", auth });
}

// Returns today's date string (YYYY-MM-DD) in Asia/Bangkok (UTC+7)
function todayBangkok() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

// ── In-memory cache (prevents Trello rate-limit on rapid nav switching) ───────
const _cache = {};
function cacheGet(key) {
  const e = _cache[key];
  return e && Date.now() < e.exp ? e.data : null;
}
function cacheSet(key, data, ttlMs) {
  _cache[key] = { data, exp: Date.now() + ttlMs };
}
function cacheInvalidate(prefix) {
  Object.keys(_cache).filter(k => k.startsWith(prefix)).forEach(k => delete _cache[k]);
}

// ── P6-1: Friendly error mapper ───────────────────────────────────────────────
// Logs full error to console, returns safe message to client
function friendlyError(e) {
  const msg = String(e?.message || e || "").toLowerCase();
  console.error("[Server Error Detail]", e); // Log full error object for debugging
  if (
    msg.includes("invalid key") || msg.includes("invalid token") ||
    msg.includes("unauthorized")  || msg.includes("401") ||
    msg.includes("not authorized")
  ) {
    return "Trello connection failed. Check API key in .env";
  }
  if (
    msg.includes("invalid_grant") || msg.includes("invalid grant") ||
    msg.includes("token has been expired") || msg.includes("token expired") ||
    msg.includes("invalid credentials")
  ) {
    return "Google Calendar session expired. Please reconnect.";
  }
  if (msg.includes("invalid_client") || msg.includes("invalid client")) {
    return "Google Calendar not connected. Check credentials in .env";
  }
  if (msg.includes("429") || msg.includes("rate limit") || msg.includes("api_token_limit")) {
    return "Trello rate limit reached. Wait a moment and refresh.";
  }
  return "Internal server error";
}

// ── P7-1: Normalize raw Trello card → consistent shape for all-cards / boards/cards ──
// cfNames: Map<idCustomField, fieldName> — built per-board to resolve human-readable keys (B5)
function normalizeCard(card, cfNames = new Map()) {
  // Checklist progress from embedded checkItems
  let clDone = 0, clTotal = 0;
  (card.checklists || []).forEach(cl => {
    (cl.checkItems || []).forEach(ci => {
      clTotal++;
      if (ci.state === "complete") clDone++;
    });
  });

  // Custom fields keyed by name (fallback to idCustomField if name not resolved)
  const customFields = {};
  (card.customFieldItems || []).forEach(cf => {
    const val = cf.value || {};
    const key = cfNames.get(cf.idCustomField) || cf.idCustomField;
    customFields[key] = val.text ?? val.number ?? val.date ?? val.checked ?? null;
  });

  return {
    id:                card.id,
    name:              card.name,
    desc:              card.desc || "",
    due:               card.due   || null,
    dueComplete:       card.dueComplete || false,
    start:             card.start  || null,
    dueReminder:       card.dueReminder ?? -1,
    url:               card.url || "",
    idList:            card.idList,
    labels:            (card.labels || []).map(l => ({ id: l.id, name: l.name || "", color: l.color || "" })),
    members:           (card.members || []).map(m => ({ id: m.id, username: m.username || "", fullName: m.fullName || m.username || "" })),
    checklistProgress: { done: clDone, total: clTotal },
    customFields,
  };
}

// Build cfNames Map for a board — per-request cache (Map passed in by caller)
async function buildCfNames(boardId, cfCache) {
  if (cfCache.has(boardId)) return cfCache.get(boardId);
  try {
    const fields = await trello.getBoardCustomFields(boardId);
    const map = new Map((fields || []).map(f => [f.id, f.name]));
    cfCache.set(boardId, map);
    return map;
  } catch {
    // Board has no custom fields or API unsupported — return empty map (safe fallback)
    cfCache.set(boardId, new Map());
    return new Map();
  }
}

function updateEnvKey(key, value) {
  const envPath = path.join(__dirname, ".env");
  let content = fs.readFileSync(envPath, "utf8");
  const re = new RegExp(`^${key}=.*$`, "m");
  content = re.test(content)
    ? content.replace(re, `${key}=${value}`)
    : content + `\n${key}=${value}`;
  fs.writeFileSync(envPath, content);
  process.env[key] = value;
}

const CONFIG_FILE = path.join(__dirname, "bu-config.json");
const DEFAULT_CONFIG = { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] };

function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")); }
  catch { return { ...DEFAULT_CONFIG }; }
}
function writeConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", makeConfigRoutes({ readConfig, writeConfig, friendlyError }));
app.use("/api", makeReviewRoutes({ store, diff, trello, friendlyError, cacheInvalidate, autoSyncToGCal }));
app.use(makeCalendarRoutes({ getCalendarClient, getCalendarId, getOAuth2Client, updateEnvKey, friendlyError }));

// ── Workspaces ────────────────────────────────────────────────────────────────

app.get("/api/workspaces", async (req, res) => {
  try { res.json(await trello.getWorkspaces()); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Boards ────────────────────────────────────────────────────────────────────

app.get("/api/boards", async (req, res) => {
  try {
    const boards = await trello.getBoards();
    const config = readConfig();
    // If allowedWorkspaceIds is set, filter boards by workspace
    if (config.allowedWorkspaceIds && config.allowedWorkspaceIds.length > 0) {
      return res.json(boards.filter(b =>
        !b.idOrganization || config.allowedWorkspaceIds.includes(b.idOrganization)
      ));
    }
    res.json(boards);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Lists ─────────────────────────────────────────────────────────────────────

app.get("/api/boards/:id/lists", async (req, res) => {
  try { res.json(await trello.getLists(req.params.id)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/boards/:id/lists", async (req, res) => {
  try { res.json(await trello.createList(req.params.id, req.body.name)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// P7-4: Board convention health check
const REQUIRED_LISTS = ["Backlog", "In Progress", "Done"];

app.get("/api/boards/:id/health", async (req, res) => {
  try {
    const hKey = `health:${req.params.id}`;
    const hit = cacheGet(hKey);
    if (hit) return res.json(hit);

    const lists = await trello.getLists(req.params.id);
    const names = lists.map(l => l.name.trim());
    const missing = REQUIRED_LISTS.filter(r => !names.some(n => n.toLowerCase() === r.toLowerCase()));
    const result = { ok: missing.length === 0, missing };
    cacheSet(hKey, result, 5 * 60_000); // 5 min TTL (lists rarely change)
    res.json(result);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Card ↔ GCal event mapping ─────────────────────────────────────────────────

const CARD_EVENTS_FILE = path.join(__dirname, "card-events.json");
function readCardEvents() {
  try { return JSON.parse(fs.readFileSync(CARD_EVENTS_FILE, "utf8")); }
  catch { return {}; }
}
function writeCardEvents(data) {
  fs.writeFileSync(CARD_EVENTS_FILE, JSON.stringify(data, null, 2));
}

// ── GCal auto-sync helper ─────────────────────────────────────────────────────

async function autoSyncToGCal(cardId, { name, desc, due, start }) {
  if (!due || !process.env.GOOGLE_REFRESH_TOKEN) return;
  try {
    const cardEvents = readCardEvents();
    const cal = getCalendarClient();
    const startDT = start
      ? new Date(start).toISOString()
      : new Date(new Date(due).getTime() - 3600000).toISOString();
    const event = {
      summary: name,
      description: desc ? `${desc}\n\n[Trello]` : "[Trello]",
      start: { dateTime: startDT, timeZone: "Asia/Bangkok" },
      end:   { dateTime: new Date(due).toISOString(), timeZone: "Asia/Bangkok" },
    };
    let result;
    if (cardEvents[cardId]) {
      try {
        result = await cal.events.update({ calendarId: getCalendarId(), eventId: cardEvents[cardId], resource: event });
      } catch {
        result = await cal.events.insert({ calendarId: getCalendarId(), resource: event });
        cardEvents[cardId] = result.data.id;
        writeCardEvents(cardEvents);
      }
    } else {
      result = await cal.events.insert({ calendarId: getCalendarId(), resource: event });
      cardEvents[cardId] = result.data.id;
      writeCardEvents(cardEvents);
    }
  } catch (e) {
    console.error("[GCal sync]", cardId, e.message);
  }
}

async function autoDeleteFromGCal(cardId) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) return;
  try {
    const cardEvents = readCardEvents();
    if (!cardEvents[cardId]) return;
    const cal = getCalendarClient();
    await cal.events.delete({ calendarId: getCalendarId(), eventId: cardEvents[cardId] });
    delete cardEvents[cardId];
    writeCardEvents(cardEvents);
  } catch (e) {
    console.error("[GCal delete]", cardId, e.message);
  }
}

// ── Cards ─────────────────────────────────────────────────────────────────────

app.get("/api/lists/:id/cards", async (req, res) => {
  try { res.json(await trello.getCards(req.params.id)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/cards", async (req, res) => {
  try {
    const { listId, name, desc, due, start, dueReminder, syncCalendar } = req.body;
    const card = await trello.createCard(listId, name, desc, due, start, dueReminder);
    cacheInvalidate("all-cards");
    res.json(card);
    if (syncCalendar) autoSyncToGCal(card.id, { name, desc, due, start });
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.put("/api/cards/:id", async (req, res) => {
  try {
    const { syncCalendar, ...trelloFields } = req.body;
    const card = await trello.updateCard(req.params.id, trelloFields);
    cacheInvalidate("all-cards");
    res.json(card);
    if (syncCalendar) {
      // Use explicit null check so clearing a due date doesn't fall back to old value
      const syncDue   = "due"   in req.body ? req.body.due   : card.due;
      const syncStart = "start" in req.body ? req.body.start : card.start;
      autoSyncToGCal(req.params.id, {
        name:  req.body.name || card.name,
        desc:  req.body.desc || card.desc,
        due:   syncDue,
        start: syncStart,
      });
    }
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.put("/api/cards/:id/move", async (req, res) => {
  try {
    const card = await trello.moveCard(req.params.id, req.body.listId);
    cacheInvalidate("all-cards");
    res.json(card);
  }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.delete("/api/cards/:id", async (req, res) => {
  try {
    await trello.deleteCard(req.params.id);
    cacheInvalidate("all-cards");
    res.json({ ok: true });
    autoDeleteFromGCal(req.params.id); // fire-and-forget
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── All cards across all boards ───────────────────────────────────────────────

app.get("/api/all-cards", async (req, res) => {
  try {
    const hit = cacheGet("all-cards");
    if (hit) return res.json(hit);

    // B5: Fetch EVERYTHING in batch (1 request for boards/lists/cf + 1 per board for cards)
    const boards = await trello.getBoardsFull();
    const result = [];
    const cfCache = new Map();

    await Promise.all(boards.map(async (board) => {
      // Use preloaded cf data from full boards fetch
      const cfNames = await buildCfNames(board.id, cfCache, board.customFields);
      const listMap = Object.fromEntries((board.lists || []).map(l => [l.id, l.name]));
      
      // Fetch cards per board (NOT per list) - much more efficient
      const cards = await trello.getBoardCards(board.id);
      cards.forEach((card) => result.push({
        ...normalizeCard(card, cfNames),
        listName: listMap[card.idList] || "Unknown",
        boardName: board.name,
        boardId: board.id,
      }));
    }));

    cacheSet("all-cards", result, 300_000); // 5 min TTL
    res.json(result);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Cache control (B16: topbar manual refresh bypasses TTL) ──────────────────
app.post("/api/cache/clear", (req, res) => {
  cacheInvalidate("all-cards");
  res.json({ ok: true });
});

// ── Cards across specific boards (BU view) ────────────────────────────────────

app.post("/api/boards/cards", async (req, res) => {
  try {
    const { boardIds } = req.body;
    const cacheKey = `boards-cards:${boardIds.join(",")}`;
    const hit = cacheGet(cacheKey);
    if (hit) return res.json(hit);

    const boards = await trello.getBoardsFull();
    const filteredBoards = boards.filter(b => boardIds.includes(b.id));
    const result = [];
    const cfCache = new Map();

    await Promise.all(filteredBoards.map(async (board) => {
      const cfNames = await buildCfNames(board.id, cfCache, board.customFields);
      const listMap = Object.fromEntries((board.lists || []).map(l => [l.id, l.name]));
      
      const cards = await trello.getBoardCards(board.id);
      cards.forEach(card => result.push({
        ...normalizeCard(card, cfNames),
        listName: listMap[card.idList] || "Unknown",
        boardId: board.id,
        boardName: board.name,
      }));
    }));
    cacheSet(cacheKey, result, 300_000); // 5 min TTL
    res.json(result);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Checklists ────────────────────────────────────────────────────────────────

app.get("/api/cards/:id/checklists", async (req, res) => {
  try { res.json(await trello.getCardChecklists(req.params.id)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/cards/:id/checklists", async (req, res) => {
  try { res.json(await trello.addChecklist(req.params.id, req.body.name)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/checklists/:id/checkitems", async (req, res) => {
  try { res.json(await trello.addCheckItem(req.params.id, req.body.name)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.put("/api/cards/:cardId/checklists/:clId/checkitems/:itemId", async (req, res) => {
  try { res.json(await trello.updateCheckItem(req.params.cardId, req.params.clId, req.params.itemId, req.body.state)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.delete("/api/checklists/:id/checkitems/:itemId", async (req, res) => {
  try { await trello.deleteCheckItem(req.params.id, req.params.itemId); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.delete("/api/checklists/:id", async (req, res) => {
  try { await trello.deleteChecklist(req.params.id); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});


// ── Review Queue ──────────────────────────────────────────────────────────────

// ── Google Tasks ──────────────────────────────────────────────────────────────

app.get("/api/google-tasks/status", (req, res) => {
  res.json({
    connected: !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    ),
  });
});

// Returns incomplete tasks due today or overdue (Bangkok timezone)
app.get("/api/google-tasks/today", async (req, res) => {
  try {
    const tasks = getTasksClient();
    const today = todayBangkok();
    const r = await tasks.tasks.list({
      tasklist: "@default",
      showCompleted: false,
      maxResults: 100,
    });
    // Include tasks with no due date OR due date <= today (overdue + today)
    const items = (r.data.items || []).filter(t =>
      !t.due || t.due.slice(0, 10) <= today
    );
    res.json(items);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// Create a new task due today
app.post("/api/google-tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });
    const tasks = getTasksClient();
    const today = todayBangkok();
    const r = await tasks.tasks.insert({
      tasklist: "@default",
      resource: { title, due: today + "T00:00:00.000Z" },
    });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// Update a task: mark complete or update title
app.put("/api/google-tasks/:id", async (req, res) => {
  try {
    const tasks = getTasksClient();
    const patch = {};
    if (req.body.complete) patch.status = "completed";
    if (req.body.title)    patch.title  = req.body.title;
    const r = await tasks.tasks.patch({
      tasklist: "@default",
      task: req.params.id,
      resource: patch,
    });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Labels ────────────────────────────────────────────────────────────────────

app.get("/api/boards/:id/labels", async (req, res) => {
  try { res.json(await trello.getLabels(req.params.id)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
