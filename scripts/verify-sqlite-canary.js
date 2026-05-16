const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { DEFAULT_DATABASE_FILENAME } = require("../src/persistence/sqlite-migration");
const { getDataDir } = require("../src/utils/runtime");

const PORT = process.env.PORT || 3000;
const BASE_URL = (process.env.SQLITE_CANARY_BASE_URL || process.env.APP_BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/+$/, "");
const REQUIRED_STATE_ROWS = ["config", "reviewSessions"];
const FORBIDDEN_SECRET_KEYS = new Set([
  "secret",
  "sharedSecret",
  "signingSecret",
  "token",
  "accessToken",
  "refreshToken",
  "clientSecret",
]);

function pass(label) {
  console.log(`PASS ${label}`);
}

function checkEnvFlag() {
  const backend = String(process.env.TASKHUB_STATE_BACKEND || "").trim().toLowerCase();
  assert.strictEqual(
    backend,
    "sqlite",
    "TASKHUB_STATE_BACKEND must be sqlite in the verification shell",
  );
  pass("TASKHUB_STATE_BACKEND=sqlite is set for canary verification");
}

function checkSqliteState() {
  const dataDir = getDataDir();
  const databaseFile = path.join(dataDir, DEFAULT_DATABASE_FILENAME);
  assert(fs.existsSync(databaseFile), `SQLite state database not found: ${databaseFile}`);

  const db = new Database(databaseFile, { readonly: true });
  try {
    const rows = db.prepare("SELECT name, payload_json FROM app_state ORDER BY name").all();
    assert(rows.length > 0, `SQLite app_state has no rows: ${databaseFile}`);
    const names = new Set(rows.map(row => row.name));
    for (const name of REQUIRED_STATE_ROWS) {
      assert(names.has(name), `SQLite app_state is missing required row: ${name}`);
    }
    for (const row of rows) {
      assert.doesNotThrow(() => JSON.parse(row.payload_json), `Invalid JSON payload in app_state row: ${row.name}`);
    }
  } finally {
    db.close();
  }

  pass("SQLite app_state exists with required rows and valid JSON payloads");
}

async function getJson(pathname) {
  const response = await fetch(`${BASE_URL}${pathname}`);
  const text = await response.text();
  assert(response.ok, `${pathname} returned ${response.status}: ${text.slice(0, 300)}`);
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`${pathname} did not return JSON: ${error.message}`);
  }
}

function assertNoForbiddenSecretKeys(value, pathParts = []) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoForbiddenSecretKeys(item, [...pathParts, String(index)]));
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    const currentPath = [...pathParts, key];
    assert(!FORBIDDEN_SECRET_KEYS.has(key), `Forbidden secret-bearing key in public response: ${currentPath.join(".")}`);
    assertNoForbiddenSecretKeys(nested, currentPath);
  }
}

async function checkReadOnlyEndpoints() {
  await getJson("/healthz");
  pass("/healthz returned 200 JSON");

  const config = await getJson("/api/config");
  assert(Array.isArray(config.workspaceVisibility), "/api/config lost workspaceVisibility array contract");
  assertNoForbiddenSecretKeys(config);
  pass("/api/config returned public config shape without forbidden secret keys");

  const reviews = await getJson("/api/reviews");
  assert(Array.isArray(reviews), "/api/reviews must return an array");
  pass("/api/reviews returned Review Queue array");

  const operations = await getJson("/api/integrations/paperclip/operations/status");
  assert.strictEqual(operations.mode, "read_only", "Paperclip operations status must remain read_only");
  assertNoForbiddenSecretKeys(operations);
  pass("Paperclip operations status is read-only and does not expose forbidden secret keys");
}

async function main() {
  checkEnvFlag();
  checkSqliteState();
  await checkReadOnlyEndpoints();
  console.log("SQLite canary verification passed.");
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
