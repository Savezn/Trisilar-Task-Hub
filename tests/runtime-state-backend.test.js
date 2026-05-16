const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const Database = require("better-sqlite3");

function tempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "taskhub-runtime-state-"));
}

function resetModule(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
}

function withEnv(t, values) {
  const previous = {};
  for (const [key, value] of Object.entries(values)) {
    previous[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

function readSqliteRows(databaseFile) {
  const db = new Database(databaseFile, { readonly: true });
  try {
    return db.prepare("SELECT name, filename, payload_json FROM app_state ORDER BY name").all();
  } finally {
    db.close();
  }
}

test("runtime state defaults to JSON files when SQLite backend flag is absent", t => {
  const dataDir = tempDataDir();
  t.after(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  withEnv(t, {
    APP_DATA_DIR: dataDir,
    TASKHUB_STATE_BACKEND: undefined,
  });

  const { readRuntimeState, writeRuntimeState } = resetModule("../src/persistence/runtime-state");
  writeRuntimeState({
    name: "config",
    filename: "bu-config.json",
    value: { groups: [], hiddenBoards: [], allowedWorkspaceIds: ["org-json"] },
  });

  assert.deepEqual(readRuntimeState({
    name: "config",
    filename: "bu-config.json",
    defaultValue: { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] },
  }), { groups: [], hiddenBoards: [], allowedWorkspaceIds: ["org-json"] });
  assert.equal(fs.existsSync(path.join(dataDir, "bu-config.json")), true);
  assert.equal(fs.existsSync(path.join(dataDir, "taskhub-state.sqlite")), false);
});

test("runtime state uses SQLite when TASKHUB_STATE_BACKEND=sqlite and falls back to existing JSON before first write", t => {
  const dataDir = tempDataDir();
  t.after(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  withEnv(t, {
    APP_DATA_DIR: dataDir,
    TASKHUB_STATE_BACKEND: "sqlite",
  });
  fs.writeFileSync(
    path.join(dataDir, "bu-config.json"),
    JSON.stringify({ groups: [], hiddenBoards: [], allowedWorkspaceIds: ["org-fallback"] }, null, 2)
  );

  const { readRuntimeState, writeRuntimeState } = resetModule("../src/persistence/runtime-state");
  assert.deepEqual(readRuntimeState({
    name: "config",
    filename: "bu-config.json",
    defaultValue: { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] },
  }), { groups: [], hiddenBoards: [], allowedWorkspaceIds: ["org-fallback"] });

  writeRuntimeState({
    name: "config",
    filename: "bu-config.json",
    value: { groups: [], hiddenBoards: [], allowedWorkspaceIds: ["org-sqlite"] },
  });

  const rows = readSqliteRows(path.join(dataDir, "taskhub-state.sqlite"));
  assert.deepEqual(rows.map(row => row.name), ["config"]);
  assert.deepEqual(JSON.parse(rows[0].payload_json), {
    groups: [],
    hiddenBoards: [],
    allowedWorkspaceIds: ["org-sqlite"],
  });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dataDir, "bu-config.json"), "utf8")), {
    groups: [],
    hiddenBoards: [],
    allowedWorkspaceIds: ["org-fallback"],
  });
});

test("runtime state creates APP_DATA_DIR before first SQLite write", t => {
  const parentDir = tempDataDir();
  const dataDir = path.join(parentDir, "new-data-dir");
  t.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));
  withEnv(t, {
    APP_DATA_DIR: dataDir,
    TASKHUB_STATE_BACKEND: "sqlite",
  });

  const { writeRuntimeState } = resetModule("../src/persistence/runtime-state");
  writeRuntimeState({
    name: "config",
    filename: "bu-config.json",
    value: { groups: [], hiddenBoards: [], allowedWorkspaceIds: ["org-created"] },
  });

  assert.equal(fs.existsSync(path.join(dataDir, "taskhub-state.sqlite")), true);
});

test("config utils preserve response shape through SQLite runtime backend", t => {
  const dataDir = tempDataDir();
  t.after(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  withEnv(t, {
    APP_DATA_DIR: dataDir,
    TASKHUB_STATE_BACKEND: "sqlite",
  });

  const { readConfig, writeConfig } = resetModule("../src/utils/config");
  writeConfig({ groups: [], hiddenBoards: ["board-a"], allowedWorkspaceIds: ["org-a"] });

  assert.deepEqual(readConfig(), {
    groups: [],
    hiddenBoards: ["board-a"],
    allowedWorkspaceIds: ["org-a"],
  });
  assert.equal(fs.existsSync(path.join(dataDir, "bu-config.json")), false);
});

test("review-store persists Review Queue sessions through SQLite runtime backend", t => {
  const dataDir = tempDataDir();
  t.after(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  withEnv(t, {
    APP_DATA_DIR: dataDir,
    TASKHUB_STATE_BACKEND: "sqlite",
    REVIEW_STORE_FILE: undefined,
  });

  const store = resetModule("../review-store");
  const session = store.createSession({
    title: "SQLite backed review",
    tasks: [{ title: "Keep pending" }],
  });

  assert.equal(store.getAllSessions().length, 1);
  assert.equal(store.getSession(session.id).tasks[0].status, "pending");
  assert.equal(fs.existsSync(path.join(dataDir, "review-sessions.json")), false);
});

test("Paperclip connection persists through SQLite runtime backend without exposing raw secret", t => {
  const dataDir = tempDataDir();
  t.after(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  withEnv(t, {
    APP_DATA_DIR: dataDir,
    APP_BASE_URL: "https://taskhub.example.test",
    TASKHUB_STATE_BACKEND: "sqlite",
  });

  const {
    connectPaperclipConnection,
    publicPaperclipConnection,
    readPaperclipConnectionRaw,
  } = resetModule("../src/integrations/paperclip/connection-config");
  const publicState = connectPaperclipConnection({
    workspaceId: "workspace-1",
    label: "SQLite Paperclip",
    sharedSecret: "sqlite-paperclip-secret-0001",
  });

  assert.equal(Object.hasOwn(publicState, "secret"), false);
  assert.equal(publicState.hasSecret, true);
  assert.equal(publicPaperclipConnection().webhookUrl, "https://taskhub.example.test/api/integrations/paperclip/webhook");
  assert.equal(readPaperclipConnectionRaw().secret, "sqlite-paperclip-secret-0001");
  assert.equal(fs.existsSync(path.join(dataDir, "paperclip-connection.json")), false);
});
