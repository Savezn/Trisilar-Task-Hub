const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { getDataDir, getDataFilePath } = require("../utils/runtime");

const DEFAULT_DATABASE_FILENAME = "taskhub-state.sqlite";
const SQLITE_BACKEND = "sqlite";

function stateBackend() {
  return String(process.env.TASKHUB_STATE_BACKEND || "").trim().toLowerCase();
}

function sqliteEnabled() {
  return stateBackend() === SQLITE_BACKEND;
}

function dataFile(filename) {
  return getDataFilePath(filename);
}

function databaseFile() {
  return path.join(getDataDir(), DEFAULT_DATABASE_FILENAME);
}

function openDatabase() {
  fs.mkdirSync(getDataDir(), { recursive: true });
  const db = new Database(databaseFile());
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_state (
      name TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      imported_at TEXT NOT NULL,
      secret_bearing INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}

function cloneDefault(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseJson(text) {
  return JSON.parse(String(text).replace(/^\uFEFF/, ""));
}

function readJsonFile(filename, defaultValue, options = {}) {
  try {
    return parseJson(fs.readFileSync(dataFile(filename), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return cloneDefault(defaultValue);
    if (options.throwOnCorrupt) throw error;
    if (options.logLabel) console.error(`[${options.logLabel}] corrupt data file:`, error.message);
    return cloneDefault(defaultValue);
  }
}

function writeJsonFile(filename, value) {
  fs.writeFileSync(dataFile(filename), JSON.stringify(value, null, 2));
}

function readSqliteRow(name) {
  const file = databaseFile();
  if (!fs.existsSync(file)) return null;
  const db = new Database(file, { readonly: true });
  try {
    const row = db.prepare("SELECT payload_json FROM app_state WHERE name = ?").get(name);
    return row ? parseJson(row.payload_json) : null;
  } finally {
    db.close();
  }
}

function writeSqliteRow({ name, filename, value, secretBearing = false }) {
  const db = openDatabase();
  try {
    db.prepare(`
      INSERT INTO app_state (name, filename, payload_json, imported_at, secret_bearing)
      VALUES (@name, @filename, @payloadJson, @importedAt, @secretBearing)
      ON CONFLICT(name) DO UPDATE SET
        filename = excluded.filename,
        payload_json = excluded.payload_json,
        imported_at = excluded.imported_at,
        secret_bearing = excluded.secret_bearing
    `).run({
      name,
      filename,
      payloadJson: JSON.stringify(value),
      importedAt: new Date().toISOString(),
      secretBearing: secretBearing ? 1 : 0,
    });
  } finally {
    db.close();
  }
}

function readRuntimeState({ name, filename, defaultValue, throwOnCorrupt = false, logLabel = "" }) {
  if (sqliteEnabled()) {
    const sqliteValue = readSqliteRow(name);
    if (sqliteValue !== null) return sqliteValue;
  }
  return readJsonFile(filename, defaultValue, { throwOnCorrupt, logLabel });
}

function writeRuntimeState({ name, filename, value, secretBearing = false }) {
  if (sqliteEnabled()) {
    writeSqliteRow({ name, filename, value, secretBearing });
    return;
  }
  writeJsonFile(filename, value);
}

module.exports = {
  DEFAULT_DATABASE_FILENAME,
  readRuntimeState,
  sqliteEnabled,
  writeRuntimeState,
};
