require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const trello = require("./trello");
const store  = require("./review-store");
const diff   = require("./task-diff");

// ── Models & Utils ───────────────────────────────────────────────────────────
const { normalizeCard, buildCfNames } = require("./src/models/trello.model");
const { cacheGet, cacheSet, cacheInvalidate } = require("./src/utils/cache");
const { friendlyError } = require("./src/utils/errors");
const { todayBangkok } = require("./src/utils/date");
const { 
  getCalendarId, 
  getOAuth2Client, 
  getCalendarClient, 
  getTasksClient, 
  autoSyncToGCal, 
  autoDeleteFromGCal, 
  updateEnvKey 
} = require("./src/utils/google");

// ── Routes ───────────────────────────────────────────────────────────────────
const makeConfigRoutes  = require("./src/routes/config.routes");
const makeReviewRoutes   = require("./src/routes/review.routes");
const makeCalendarRoutes      = require("./src/routes/calendar.routes");
const makeGoogleTasksRoutes   = require("./src/routes/google-tasks.routes");
const makeTrelloRoutes        = require("./src/routes/trello.routes");

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
