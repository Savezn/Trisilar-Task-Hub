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
const makeCalendarRoutes      = require("./src/routes/calendar.routes");
const makeGoogleTasksRoutes   = require("./src/routes/google-tasks.routes");
const makeTrelloRoutes        = require("./src/routes/trello.routes");

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

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", makeConfigRoutes({ readConfig, writeConfig, friendlyError }));
app.use("/api", makeReviewRoutes({ store, diff, trello, friendlyError, cacheInvalidate, autoSyncToGCal }));
app.use(makeCalendarRoutes({ getCalendarClient, getCalendarId, getOAuth2Client, updateEnvKey, friendlyError }));
app.use("/api", makeGoogleTasksRoutes({ getTasksClient, todayBangkok, friendlyError }));
app.use("/api", makeTrelloRoutes({ trello, normalizeCard, buildCfNames, cacheGet, cacheSet, cacheInvalidate, friendlyError, autoSyncToGCal, readConfig }));

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
