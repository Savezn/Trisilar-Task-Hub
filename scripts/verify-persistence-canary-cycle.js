const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const {
  exportSqliteStateToJson,
  migrateJsonStateToSqlite,
} = require("../src/persistence/sqlite-migration");

const REPO_ROOT = path.join(__dirname, "..");

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function seedJsonState(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  writeJson(path.join(dataDir, "bu-config.json"), {
    workspaceVisibility: ["workspace-demo"],
    workspaceNames: { "workspace-demo": "Demo Workspace" },
    workspaceSort: ["workspace-demo"],
  });
  writeJson(path.join(dataDir, "review-sessions.json"), []);
  writeJson(path.join(dataDir, "card-events.json"), []);
  writeJson(path.join(dataDir, "paperclip-docs-workflow.json"), {
    enabled: false,
    folderId: "",
  });
  writeJson(path.join(dataDir, "paperclip-connection.json"), {
    status: "connected",
    workspaceId: "paperclip_workspace_canary",
    label: "Local Canary Cycle",
    connectedAt: "2026-05-15T00:00:00.000Z",
    disabledAt: null,
    secretUpdatedAt: "2026-05-15T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
    secret: "local-canary-cycle-secret-0001",
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForHealthz(baseUrl, child) {
  const deadline = Date.now() + 10000;
  let lastError;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with code ${child.exitCode}`);
    }
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.ok) return;
      lastError = new Error(`/healthz returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }
  throw new Error(`Server did not become ready: ${lastError?.message || "timeout"}`);
}

function startServer({ dataDir, port, sqlite }) {
  const baseUrl = `http://127.0.0.1:${port}`;
  const env = {
    ...process.env,
    APP_DATA_DIR: dataDir,
    APP_BASE_URL: "https://taskhub-dev.example.test",
    PORT: String(port),
    TRELLO_API_KEY: "",
    TRELLO_TOKEN: "",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
  };
  if (sqlite) {
    env.TASKHUB_STATE_BACKEND = "sqlite";
    env.SQLITE_CANARY_BASE_URL = baseUrl;
  } else {
    delete env.TASKHUB_STATE_BACKEND;
    env.JSON_ROLLBACK_BASE_URL = baseUrl;
  }

  const child = spawn(process.execPath, ["server.js"], {
    cwd: REPO_ROOT,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk.toString(); });
  child.stderr.on("data", chunk => { output += chunk.toString(); });
  return { baseUrl, child, env, output: () => output };
}

async function stopServer(server) {
  if (!server || server.child.exitCode !== null) return;
  server.child.kill();
  await Promise.race([
    new Promise(resolve => server.child.once("exit", resolve)),
    delay(1000),
  ]);
}

function runVerifier(script, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: REPO_ROOT,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", chunk => { output += chunk.toString(); });
    child.stderr.on("data", chunk => { output += chunk.toString(); });
    child.on("exit", code => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`${script} exited ${code}\n${output}`));
      }
    });
  });
}

async function main() {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "taskhub-persistence-canary-cycle-"));
  let sqliteServer;
  let jsonServer;
  try {
    seedJsonState(dataDir);
    const imported = migrateJsonStateToSqlite({ dataDir, timestamp: "canary-cycle-import" });
    assert(imported.imported.some(item => item.name === "config"), "migration did not import config");
    assert(imported.imported.some(item => item.name === "reviewSessions"), "migration did not import reviewSessions");
    console.log("PASS imported JSON state to SQLite");

    sqliteServer = startServer({ dataDir, port: 3991, sqlite: true });
    await waitForHealthz(sqliteServer.baseUrl, sqliteServer.child);
    process.stdout.write(await runVerifier("scripts/verify-sqlite-canary.js", sqliteServer.env));

    const exported = exportSqliteStateToJson({ dataDir, timestamp: "canary-cycle-export" });
    assert(exported.exported.some(item => item.name === "config"), "export did not write config JSON");
    assert(exported.exported.some(item => item.name === "reviewSessions"), "export did not write Review Queue JSON");
    console.log("PASS exported SQLite state back to JSON");

    await stopServer(sqliteServer);
    sqliteServer = null;

    jsonServer = startServer({ dataDir, port: 3992, sqlite: false });
    await waitForHealthz(jsonServer.baseUrl, jsonServer.child);
    process.stdout.write(await runVerifier("scripts/verify-json-rollback.js", jsonServer.env));

    console.log("Persistence canary cycle verification passed.");
  } catch (error) {
    if (sqliteServer) console.error(sqliteServer.output());
    if (jsonServer) console.error(jsonServer.output());
    throw error;
  } finally {
    await stopServer(sqliteServer);
    await stopServer(jsonServer);
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
