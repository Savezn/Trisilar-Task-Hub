require("dotenv").config();
const express = require("express");
const path = require("path");

// ── Models & Utils ───────────────────────────────────────────────────────────
const trello = require("./trello");
const store  = require("./review-store");
const diff   = require("./task-diff");
const { normalizeCard, buildCfNames } = require("./src/models/trello.model");
const { cacheGet, cacheSet, cacheInvalidate } = require("./src/utils/cache");
const { friendlyError } = require("./src/utils/errors");
const { todayBangkok } = require("./src/utils/date");
const { readConfig, writeConfig } = require("./src/utils/config");
const { 
  getAppBaseUrl,
  getCalendarId, 
  getGoogleRedirectUri,
  getOAuth2Client, 
  getCalendarClient, 
  getTasksClient, 
  autoSyncToGCal,
  autoDeleteFromGCal,
  updateEnvKey
} = require("./src/utils/google");

// ── Routes ───────────────────────────────────────────────────────────────────
const makeConfigRoutes      = require("./src/routes/config.routes");
const makeReviewRoutes      = require("./src/routes/review.routes");
const makePaperclipRoutes   = require("./src/routes/paperclip.routes");
const makeCalendarRoutes    = require("./src/routes/calendar.routes");
const makeGoogleTasksRoutes = require("./src/routes/google-tasks.routes");
const makeTrelloRoutes      = require("./src/routes/trello.routes");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── API Mount ─────────────────────────────────────────────────────────────────
app.use("/api", makeConfigRoutes({ readConfig, writeConfig, friendlyError }));
app.use("/api", makeReviewRoutes({ store, diff, trello, friendlyError, cacheInvalidate, autoSyncToGCal }));
app.use("/api", makePaperclipRoutes({ store, diff, friendlyError }));
app.use("/api", makeGoogleTasksRoutes({ getTasksClient, todayBangkok, friendlyError }));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

// Root-level mounts (auth, etc)
app.use(makeCalendarRoutes({ getAppBaseUrl, getCalendarClient, getCalendarId, getGoogleRedirectUri, getOAuth2Client, updateEnvKey, friendlyError }));

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
  autoDeleteFromGCal,
  readConfig 
}));

// ── Start ─────────────────────────────────────────────────────────────────────
// Page route fallback for browser history navigation.
app.get([
  "/today",
  "/review",
  "/all",
  "/boards",
  "/calendar",
  "/planner",
  "/okr",
  "/focus",
  "/settings",
], (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
