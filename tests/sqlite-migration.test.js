const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  exportSqliteStateToJson,
  migrateJsonStateToSqlite,
  readSqliteState,
} = require("../src/persistence/sqlite-migration");

function tempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "taskhub-sqlite-migration-"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

test("migrateJsonStateToSqlite imports app-owned JSON state and creates backups", () => {
  const dataDir = tempDataDir();
  try {
    const reviewSessions = [{
      id: "session-1",
      title: "SQLite migration",
      source: "manual_upload",
      createdAt: "2026-05-15T00:00:00.000Z",
      tasks: [{ id: "task-1", title: "Preserve me", status: "pending" }],
    }];
    const config = { groups: [], hiddenBoards: ["board-hidden"], allowedWorkspaceIds: ["org-a"] };
    const cardEvents = { "card-1": "event-1" };
    const paperclipConnection = {
      status: "connected",
      workspaceId: "workspace-1",
      label: "Dev",
      connectedAt: "2026-05-15T00:00:00.000Z",
      disabledAt: null,
      secretUpdatedAt: "2026-05-15T00:00:00.000Z",
      updatedAt: "2026-05-15T00:00:00.000Z",
      secret: "secret-stays-local",
    };
    const docsWorkflow = {
      documents: {
        "doc-1": { reviewStatus: "new", linkedTasks: [], detachedLinks: [], auditTrail: [] },
      },
    };

    writeJson(path.join(dataDir, "review-sessions.json"), reviewSessions);
    writeJson(path.join(dataDir, "bu-config.json"), config);
    writeJson(path.join(dataDir, "card-events.json"), cardEvents);
    writeJson(path.join(dataDir, "paperclip-connection.json"), paperclipConnection);
    writeJson(path.join(dataDir, "paperclip-docs-workflow.json"), docsWorkflow);

    const result = migrateJsonStateToSqlite({
      dataDir,
      timestamp: "20260515T010203Z",
    });

    assert.equal(result.databaseFile, path.join(dataDir, "taskhub-state.sqlite"));
    assert.deepEqual(result.imported.map(item => item.name), [
      "reviewSessions",
      "config",
      "cardEvents",
      "paperclipConnection",
      "paperclipDocsWorkflow",
    ]);
    assert.equal(result.skipped.length, 0);
    assert.equal(result.secretBearing, true);
    assert.equal(fs.existsSync(result.databaseFile), true);

    for (const backup of result.backups) {
      assert.equal(fs.existsSync(backup.backupFile), true);
      assert(backup.backupFile.includes(".bak-20260515T010203Z"));
    }

    const state = readSqliteState({ databaseFile: result.databaseFile });
    assert.deepEqual(state.reviewSessions, reviewSessions);
    assert.deepEqual(state.config, config);
    assert.deepEqual(state.cardEvents, cardEvents);
    assert.deepEqual(state.paperclipConnection, paperclipConnection);
    assert.deepEqual(state.paperclipDocsWorkflow, docsWorkflow);

    const manifest = JSON.parse(fs.readFileSync(result.manifestFile, "utf8"));
    assert.equal(manifest.secretBearing, true);
    assert.equal(manifest.databaseFile, result.databaseFile);
    assert.equal(manifest.imported.length, 5);
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});

test("migrateJsonStateToSqlite accepts UTF-8 BOM JSON files created by Windows tools", () => {
  const dataDir = tempDataDir();
  try {
    fs.writeFileSync(
      path.join(dataDir, "review-sessions.json"),
      `\uFEFF${JSON.stringify([{ id: "session-bom", title: "BOM", source: "manual_upload", createdAt: "2026-05-15T00:00:00.000Z", tasks: [] }])}`,
      "utf8"
    );

    const migration = migrateJsonStateToSqlite({
      dataDir,
      timestamp: "20260515T020304Z",
    });
    const state = readSqliteState({ databaseFile: migration.databaseFile });

    assert.equal(state.reviewSessions[0].id, "session-bom");
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});

test("exportSqliteStateToJson writes rollback JSON files without deleting the SQLite database", () => {
  const dataDir = tempDataDir();
  try {
    writeJson(path.join(dataDir, "review-sessions.json"), []);
    writeJson(path.join(dataDir, "bu-config.json"), { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] });

    const migration = migrateJsonStateToSqlite({
      dataDir,
      timestamp: "20260515T040506Z",
    });
    fs.rmSync(path.join(dataDir, "review-sessions.json"));
    fs.rmSync(path.join(dataDir, "bu-config.json"));

    const exported = exportSqliteStateToJson({
      databaseFile: migration.databaseFile,
      dataDir,
      timestamp: "20260515T070809Z",
    });

    assert.equal(fs.existsSync(migration.databaseFile), true);
    assert.deepEqual(exported.exported.map(item => item.filename), [
      "review-sessions.json",
      "bu-config.json",
    ]);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dataDir, "review-sessions.json"), "utf8")), []);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dataDir, "bu-config.json"), "utf8")), {
      groups: [],
      hiddenBoards: [],
      allowedWorkspaceIds: [],
    });
    assert.equal(fs.existsSync(exported.manifestFile), true);
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});

test("exportSqliteStateToJson fails loudly when the SQLite database is missing", () => {
  const dataDir = tempDataDir();
  try {
    const databaseFile = path.join(dataDir, "taskhub-state.sqlite");

    assert.throws(
      () => exportSqliteStateToJson({ databaseFile, dataDir }),
      /SQLite state database not found/
    );
    assert.equal(fs.existsSync(databaseFile), false);
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});

test("exportSqliteStateToJson fails loudly when app_state has no rows", () => {
  const dataDir = tempDataDir();
  try {
    const databaseFile = path.join(dataDir, "taskhub-state.sqlite");
    writeJson(path.join(dataDir, "review-sessions.json"), []);
    const migration = migrateJsonStateToSqlite({
      dataDir,
      databaseFile,
      timestamp: "20260515T101112Z",
    });

    const Database = require("better-sqlite3");
    const db = new Database(migration.databaseFile);
    try {
      db.prepare("DELETE FROM app_state").run();
    } finally {
      db.close();
    }

    assert.throws(
      () => exportSqliteStateToJson({ databaseFile, dataDir }),
      /SQLite state database has no app_state rows/
    );
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
