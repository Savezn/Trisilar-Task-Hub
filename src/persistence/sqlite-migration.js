const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { getDataDir } = require("../utils/runtime");

const DEFAULT_DATABASE_FILENAME = "taskhub-state.sqlite";
const STATE_FILES = [
  { name: "reviewSessions", filename: "review-sessions.json", secretBearing: false },
  { name: "config", filename: "bu-config.json", secretBearing: false },
  { name: "cardEvents", filename: "card-events.json", secretBearing: false },
  { name: "paperclipConnection", filename: "paperclip-connection.json", secretBearing: true },
  { name: "paperclipDocsWorkflow", filename: "paperclip-docs-workflow.json", secretBearing: false },
];

function resolveDataDir(dataDir = getDataDir()) {
  const resolved = path.resolve(dataDir);
  fs.mkdirSync(resolved, { recursive: true });
  return resolved;
}

function safeTimestamp(timestamp = new Date().toISOString()) {
  return String(timestamp).replace(/[^0-9A-Za-z_-]/g, "");
}

function defaultDatabaseFile(dataDir) {
  return path.join(dataDir, DEFAULT_DATABASE_FILENAME);
}

function openDatabase(databaseFile) {
  const db = new Database(databaseFile);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_state (
      name TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      imported_at TEXT NOT NULL,
      secret_bearing INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS migration_manifest (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      created_at TEXT NOT NULL,
      payload_json TEXT NOT NULL
    );
  `);
  return db;
}

function openExistingDatabase(databaseFile) {
  if (!fs.existsSync(databaseFile)) {
    throw new Error(`SQLite state database not found: ${databaseFile}`);
  }
  return new Database(databaseFile, { readonly: true });
}

function readJsonFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    error.message = `Failed to read JSON state ${file}: ${error.message}`;
    throw error;
  }
}

function writeJsonFile(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function backupFile(file, timestamp) {
  const backupFile = `${file}.bak-${timestamp}`;
  fs.copyFileSync(file, backupFile);
  return backupFile;
}

function writeManifest(dataDir, kind, timestamp, manifest) {
  const manifestFile = path.join(dataDir, `${kind}-${timestamp}.json`);
  writeJsonFile(manifestFile, manifest);
  return manifestFile;
}

function migrateJsonStateToSqlite(options = {}) {
  const dataDir = resolveDataDir(options.dataDir);
  const timestamp = safeTimestamp(options.timestamp);
  const databaseFile = path.resolve(options.databaseFile || defaultDatabaseFile(dataDir));
  const imported = [];
  const skipped = [];
  const backups = [];
  let secretBearing = false;

  const db = openDatabase(databaseFile);
  const upsert = db.prepare(`
    INSERT INTO app_state (name, filename, payload_json, imported_at, secret_bearing)
    VALUES (@name, @filename, @payloadJson, @importedAt, @secretBearing)
    ON CONFLICT(name) DO UPDATE SET
      filename = excluded.filename,
      payload_json = excluded.payload_json,
      imported_at = excluded.imported_at,
      secret_bearing = excluded.secret_bearing
  `);

  const transaction = db.transaction(() => {
    for (const stateFile of STATE_FILES) {
      const sourceFile = path.join(dataDir, stateFile.filename);
      if (!fs.existsSync(sourceFile)) {
        skipped.push({ name: stateFile.name, filename: stateFile.filename, reason: "missing" });
        continue;
      }

      const payload = readJsonFile(sourceFile);
      const backup = backupFile(sourceFile, timestamp);
      backups.push({ name: stateFile.name, sourceFile, backupFile: backup });
      upsert.run({
        name: stateFile.name,
        filename: stateFile.filename,
        payloadJson: JSON.stringify(payload),
        importedAt: timestamp,
        secretBearing: stateFile.secretBearing ? 1 : 0,
      });
      imported.push({
        name: stateFile.name,
        filename: stateFile.filename,
        sourceFile,
        secretBearing: stateFile.secretBearing,
      });
      if (stateFile.secretBearing) secretBearing = true;
    }
  });

  try {
    transaction();
    const manifest = {
      kind: "sqlite-migration",
      timestamp,
      dataDir,
      databaseFile,
      secretBearing,
      imported,
      skipped,
      backups,
      rollback: {
        exportCommand: "npm.cmd run migrate:sqlite:export",
        note: "Backups are retained beside their original JSON files. Treat SQLite databases and backups as secret-bearing if paperclipConnection was imported.",
      },
    };
    const manifestFile = writeManifest(dataDir, "sqlite-migration-manifest", timestamp, manifest);
    db.prepare(`
      INSERT OR REPLACE INTO migration_manifest (id, kind, created_at, payload_json)
      VALUES (@id, @kind, @createdAt, @payloadJson)
    `).run({
      id: `sqlite-migration-${timestamp}`,
      kind: manifest.kind,
      createdAt: timestamp,
      payloadJson: JSON.stringify({ ...manifest, manifestFile }),
    });
    return { ...manifest, manifestFile };
  } finally {
    db.close();
  }
}

function readSqliteState(options = {}) {
  const dataDir = resolveDataDir(options.dataDir);
  const databaseFile = path.resolve(options.databaseFile || defaultDatabaseFile(dataDir));
  const db = openDatabase(databaseFile);
  try {
    const rows = db.prepare("SELECT name, payload_json FROM app_state ORDER BY rowid").all();
    return Object.fromEntries(rows.map(row => [row.name, JSON.parse(row.payload_json)]));
  } finally {
    db.close();
  }
}

function exportSqliteStateToJson(options = {}) {
  const dataDir = resolveDataDir(options.dataDir);
  const timestamp = safeTimestamp(options.timestamp);
  const databaseFile = path.resolve(options.databaseFile || defaultDatabaseFile(dataDir));
  const db = openExistingDatabase(databaseFile);
  const exported = [];
  const backups = [];

  try {
    const rows = db.prepare("SELECT name, filename, payload_json, secret_bearing FROM app_state ORDER BY rowid").all();
    if (rows.length === 0) {
      throw new Error(`SQLite state database has no app_state rows: ${databaseFile}`);
    }
    for (const row of rows) {
      const targetFile = path.join(dataDir, row.filename);
      if (fs.existsSync(targetFile)) {
        backups.push({ name: row.name, sourceFile: targetFile, backupFile: backupFile(targetFile, timestamp) });
      }
      writeJsonFile(targetFile, JSON.parse(row.payload_json));
      exported.push({
        name: row.name,
        filename: row.filename,
        targetFile,
        secretBearing: Boolean(row.secret_bearing),
      });
    }

    const secretBearing = exported.some(item => item.secretBearing);
    const manifest = {
      kind: "sqlite-export",
      timestamp,
      dataDir,
      databaseFile,
      secretBearing,
      exported,
      backups,
      rollback: {
        note: "SQLite database was not deleted. Existing JSON files were backed up before overwrite when present.",
      },
    };
    const manifestFile = writeManifest(dataDir, "sqlite-export-manifest", timestamp, manifest);
    return { ...manifest, manifestFile };
  } finally {
    db.close();
  }
}

module.exports = {
  DEFAULT_DATABASE_FILENAME,
  STATE_FILES,
  exportSqliteStateToJson,
  migrateJsonStateToSqlite,
  readSqliteState,
};
