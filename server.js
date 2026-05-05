require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const trello = require("./trello");
const store  = require("./review-store");
const diff   = require("./task-diff");

// ── Google Calendar helpers ───────────────────────────────────────────────────
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "";
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

// ── P6-1: Friendly error mapper ───────────────────────────────────────────────
// Logs full error to console, returns safe message to client
function friendlyError(e) {
  const msg = String(e?.message || e || "").toLowerCase();
  console.error("[Server Error]", e?.message || e);
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
  return "Internal server error";
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
        result = await cal.events.update({ calendarId: CALENDAR_ID, eventId: cardEvents[cardId], resource: event });
      } catch {
        result = await cal.events.insert({ calendarId: CALENDAR_ID, resource: event });
        cardEvents[cardId] = result.data.id;
        writeCardEvents(cardEvents);
      }
    } else {
      result = await cal.events.insert({ calendarId: CALENDAR_ID, resource: event });
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
    await cal.events.delete({ calendarId: CALENDAR_ID, eventId: cardEvents[cardId] });
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
    res.json(card);
    if (syncCalendar) autoSyncToGCal(card.id, { name, desc, due, start });
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.put("/api/cards/:id", async (req, res) => {
  try {
    const { syncCalendar, ...trelloFields } = req.body;
    const card = await trello.updateCard(req.params.id, trelloFields);
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
  try { res.json(await trello.moveCard(req.params.id, req.body.listId)); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.delete("/api/cards/:id", async (req, res) => {
  try {
    await trello.deleteCard(req.params.id);
    res.json({ ok: true });
    autoDeleteFromGCal(req.params.id); // fire-and-forget
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── All cards across all boards ───────────────────────────────────────────────

app.get("/api/all-cards", async (req, res) => {
  try {
    const boards = await trello.getBoards();
    const result = [];

    await Promise.all(boards.map(async (board) => {
      const lists = await trello.getLists(board.id);
      await Promise.all(lists.map(async (list) => {
        const cards = await trello.getCards(list.id);
        cards.forEach((card) => result.push({
          ...card,
          listName: list.name,
          boardName: board.name,
          boardId: board.id,
        }));
      }));
    }));

    res.json(result);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── BU Config ─────────────────────────────────────────────────────────────────

app.get("/api/config", (req, res) => res.json(readConfig()));

app.post("/api/config", (req, res) => {
  try { writeConfig(req.body); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Cards across specific boards (BU view) ────────────────────────────────────

app.post("/api/boards/cards", async (req, res) => {
  try {
    const { boardIds } = req.body;
    const boards = await trello.getBoards();
    const boardMap = Object.fromEntries(boards.map(b => [b.id, b.name]));
    const result = [];
    await Promise.all(boardIds.map(async (boardId) => {
      const lists = await trello.getLists(boardId);
      await Promise.all(lists.map(async (list) => {
        const cards = await trello.getCards(list.id);
        cards.forEach(card => result.push({
          ...card,
          listName: list.name,
          boardId,
          boardName: boardMap[boardId] || boardId,
        }));
      }));
    }));
    res.json(result);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

// ── Google Calendar OAuth ─────────────────────────────────────────────────────

app.post("/auth/google", (req, res) => {
  const { clientId, clientSecret } = req.body;
  if (!clientId || !clientSecret) return res.status(400).json({ error: "clientId and clientSecret are required" });
  updateEnvKey("GOOGLE_CLIENT_ID", clientId);
  updateEnvKey("GOOGLE_CLIENT_SECRET", clientSecret);
  const auth = getOAuth2Client();
  const url = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/tasks",
    ],
  });
  res.json({ url });
});

app.get("/auth/callback", async (req, res) => {
  try {
    const auth = getOAuth2Client();
    const { tokens } = await auth.getToken(req.query.code);
    if (tokens.refresh_token) updateEnvKey("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);
    res.send(`<script>window.opener?.postMessage('cal_connected','http://localhost:3000');window.close();</script><p>✓ Connected! You can close this window.</p>`);
  } catch (e) {
    res.send(`<p style="color:red">Error: ${friendlyError(e)}</p>`);
  }
});

// ── Google Calendar status ─────────────────────────────────────────────────────

app.get("/api/calendar/status", (req, res) => {
  res.json({
    hasClientId:      !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret:  !!process.env.GOOGLE_CLIENT_SECRET,
    hasRefreshToken:  !!process.env.GOOGLE_REFRESH_TOKEN,
    calendarId:       CALENDAR_ID,
    connected: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN),
  });
});

// ── Google Calendar CRUD ──────────────────────────────────────────────────────

app.get("/api/calendar/events", async (req, res) => {
  try {
    const cal = getCalendarClient();
    const { start, end } = req.query;
    const r = await cal.events.list({
      calendarId: CALENDAR_ID,
      timeMin: start || new Date().toISOString(),
      timeMax: end,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });
    res.json(r.data.items || []);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/calendar/events", async (req, res) => {
  try {
    const cal = getCalendarClient();
    const { summary, description, start, end, allDay, reminderMinutes } = req.body;
    const event = {
      summary,
      description,
      start: allDay ? { date: start } : { dateTime: start, timeZone: "Asia/Bangkok" },
      end:   allDay ? { date: end }   : { dateTime: end,   timeZone: "Asia/Bangkok" },
      reminders: {
        useDefault: false,
        overrides: reminderMinutes != null ? [{ method: "popup", minutes: parseInt(reminderMinutes) }] : [],
      },
    };
    const r = await cal.events.insert({ calendarId: CALENDAR_ID, resource: event });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.put("/api/calendar/events/:id", async (req, res) => {
  try {
    const cal = getCalendarClient();
    const { summary, description, start, end, allDay, reminderMinutes } = req.body;
    const event = {
      summary,
      description,
      start: allDay ? { date: start } : { dateTime: start, timeZone: "Asia/Bangkok" },
      end:   allDay ? { date: end }   : { dateTime: end,   timeZone: "Asia/Bangkok" },
      reminders: {
        useDefault: false,
        overrides: reminderMinutes != null ? [{ method: "popup", minutes: parseInt(reminderMinutes) }] : [],
      },
    };
    const r = await cal.events.update({ calendarId: CALENDAR_ID, eventId: req.params.id, resource: event });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.delete("/api/calendar/events/:id", async (req, res) => {
  try {
    const cal = getCalendarClient();
    await cal.events.delete({ calendarId: CALENDAR_ID, eventId: req.params.id });
    res.json({ ok: true });
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

// Helper: push an approved task to Trello (and optionally GCal)
async function pushTaskToTrello(sessionId, task) {
  if (!task.targetListId) return { skipped: true, reason: "No targetListId" };
  try {
    let card;
    if (task.diffStatus === "update_existing" && task.matchedCardId) {
      card = await trello.updateCard(task.matchedCardId, {
        name: task.title,
        desc: task.description,
        due:  task.deadline || null,
      });
    } else {
      card = await trello.createCard(
        task.targetListId,
        task.title,
        task.description,
        task.deadline || null,
        null, null
      );
    }
    store.setTaskTrelloCardId(sessionId, task.id, card.id);
    if (task.syncCalendar && task.deadline) {
      autoSyncToGCal(card.id, { name: task.title, desc: task.description, due: task.deadline, start: null });
    }
    return { ok: true, cardId: card.id };
  } catch (e) {
    console.error("[Trello push]", task.id, e.message);
    return { ok: false, error: friendlyError(e) };
  }
}

function notFound(e) {
  if (e.message.toLowerCase().includes("not found")) return 404;
  if (e.message.includes("already approved") || e.message.includes("already processed") ||
      e.message.includes("Cannot edit")       || e.message.includes("unprocessed tasks")) return 409;
  return 500;
}

app.get("/api/reviews", (req, res) => {
  try { res.json(store.getAllSessions()); }
  catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/task-diff", async (req, res) => {
  try {
    const { title, targetBoardId } = req.body;
    if (!title)         return res.status(400).json({ error: "title is required" });
    if (!targetBoardId) return res.status(400).json({ error: "targetBoardId is required" });
    res.json(await diff.diffTask({ title, targetBoardId }));
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const data = { ...req.body };
    if (Array.isArray(data.tasks) && data.tasks.length > 0) {
      // P6-4: shared cache across all tasks in this session — getLists called once per board
      const boardCardsCache = new Map();
      const resolved = [];
      for (const task of data.tasks) {
        if (task.targetBoardId) {
          const result = await diff.diffTask({ title: task.title, targetBoardId: task.targetBoardId, boardCardsCache });
          resolved.push({ ...task, ...result });
        } else {
          resolved.push(task);
        }
      }
      data.tasks = resolved;
    }
    res.json(store.createSession(data));
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.get("/api/reviews/:id", (req, res) => {
  try {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.put("/api/reviews/:id/tasks/:taskId", (req, res) => {
  try { res.json(store.updateTask(req.params.id, req.params.taskId, req.body)); }
  catch (e) { res.status(notFound(e)).json({ error: e.message }); }
});

app.post("/api/reviews/:id/tasks/:taskId/approve", async (req, res) => {
  try {
    const task    = store.approveTask(req.params.id, req.params.taskId);
    const result  = await pushTaskToTrello(req.params.id, task);
    const updated = store.getSession(req.params.id)?.tasks.find(t => t.id === req.params.taskId) || task;
    res.json({ ...updated, trello: result });
  } catch (e) { res.status(notFound(e)).json({ error: e.message }); }
});

app.post("/api/reviews/:id/tasks/:taskId/reject", (req, res) => {
  try { res.json(store.rejectTask(req.params.id, req.params.taskId)); }
  catch (e) { res.status(notFound(e)).json({ error: e.message }); }
});

app.post("/api/reviews/:id/approve-bulk", async (req, res) => {
  try {
    const { taskIds = [] } = req.body;
    const results = await Promise.all(taskIds.map(async taskId => {
      try {
        const task    = store.approveTask(req.params.id, taskId);
        const result  = await pushTaskToTrello(req.params.id, task);
        const updated = store.getSession(req.params.id)?.tasks.find(t => t.id === taskId) || task;
        return { taskId, ok: true, trelloCardId: updated.trelloCardId, trello: result };
      } catch (e) { return { taskId, ok: false, error: friendlyError(e) }; }
    }));
    res.json(results);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.post("/api/reviews/:id/reject-bulk", (req, res) => {
  try {
    const { taskIds = [] } = req.body;
    const results = taskIds.map(taskId => {
      try { return { taskId, ok: true, task: store.rejectTask(req.params.id, taskId) }; }
      catch (e) { return { taskId, ok: false, error: e.message }; }
    });
    res.json(results);
  } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
});

app.delete("/api/reviews/:id", (req, res) => {
  try { res.json(store.dismissSession(req.params.id)); }
  catch (e) { res.status(notFound(e)).json({ error: e.message }); }
});

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
