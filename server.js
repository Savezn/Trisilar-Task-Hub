require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const trello = require("./trello");
const store  = require("./review-store");
const diff   = require("./task-diff");

// ── Models & Utils ───────────────────────────────────────────────────────────
const { normalizeCard, buildCfNames } = require("./src/models/trello.model");
const { cacheGet, cacheSet, cacheInvalidate } = require("./src/utils/cache");
const { friendlyError } = require("./src/utils/errors");
const { todayBangkok } = require("./src/utils/date");

// ── Routes ───────────────────────────────────────────────────────────────────
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

// Wrap buildCfNames to inject trello dependency automatically for routes
const buildCfNamesInjected = (boardId, cfCache) => buildCfNames(boardId, cfCache, trello);

app.use("/api", makeTrelloRoutes({ 
  trello, 
  normalizeCard, 
  buildCfNames: buildCfNamesInjected, 
  cacheGet, 
  cacheSet, 
  cacheInvalidate, 
  friendlyError, 
  autoSyncToGCal, 
  readConfig 
}));

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
