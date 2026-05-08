const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { getAppBaseUrl, getDataFilePath, getGoogleRedirectUri } = require("./runtime");

// ── Constants ─────────────────────────────────────────────────────────────────
const CARD_EVENTS_FILE = getDataFilePath("card-events.json");

// ── Internal Helpers ──────────────────────────────────────────────────────────

/**
 * Read card-events mapping from file
 */
function readCardEvents() {
  try { return JSON.parse(fs.readFileSync(CARD_EVENTS_FILE, "utf8")); }
  catch { return {}; }
}

/**
 * Write card-events mapping to file
 */
function writeCardEvents(data) {
  fs.writeFileSync(CARD_EVENTS_FILE, JSON.stringify(data, null, 2));
}

// ── Public Helpers ────────────────────────────────────────────────────────────

/**
 * Returns the Google Calendar ID from environment variables
 */
const getCalendarId = () => process.env.GOOGLE_CALENDAR_ID || "";

/**
 * Returns an OAuth2 client with credentials from environment variables
 */
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getGoogleRedirectUri()
  );
}

/**
 * Returns a Google Calendar API client
 */
function getCalendarClient() {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth });
}

/**
 * Returns a Google Tasks API client
 */
function getTasksClient() {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.tasks({ version: "v1", auth });
}

/**
 * Syncs a Trello card to Google Calendar
 */
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

/**
 * Deletes a Trello card's corresponding event from Google Calendar
 */
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

/**
 * Updates a key in the .env file
 */
function updateEnvKey(key, value) {
  const envPath = path.join(__dirname, "../../.env");
  let content = fs.readFileSync(envPath, "utf8");
  const re = new RegExp(`^${key}=.*$`, "m");
  content = re.test(content)
    ? content.replace(re, `${key}=${value}`)
    : content + `\n${key}=${value}`;
  fs.writeFileSync(envPath, content);
  process.env[key] = value;
}

module.exports = {
  getAppBaseUrl,
  getCalendarId,
  getGoogleRedirectUri,
  getOAuth2Client,
  getCalendarClient,
  getTasksClient,
  autoSyncToGCal,
  autoDeleteFromGCal,
  updateEnvKey
};
