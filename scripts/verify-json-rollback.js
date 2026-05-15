const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { getDataDir } = require("../src/utils/runtime");

const PORT = process.env.PORT || 3000;
const BASE_URL = (process.env.JSON_ROLLBACK_BASE_URL || process.env.APP_BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/+$/, "");
const REQUIRED_JSON_FILES = ["bu-config.json", "review-sessions.json"];
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

function checkBackendFlagRemoved() {
  const backend = String(process.env.TASKHUB_STATE_BACKEND || "").trim().toLowerCase();
  assert.notStrictEqual(
    backend,
    "sqlite",
    "TASKHUB_STATE_BACKEND must be removed or set away from sqlite for JSON rollback verification",
  );
  pass("TASKHUB_STATE_BACKEND is not sqlite in the rollback verification shell");
}

function checkJsonStateFiles() {
  const dataDir = getDataDir();
  for (const filename of REQUIRED_JSON_FILES) {
    const file = path.join(dataDir, filename);
    assert(fs.existsSync(file), `Required rollback JSON file not found: ${file}`);
    assert.doesNotThrow(
      () => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")),
      `Required rollback JSON file is invalid: ${file}`,
    );
  }
  pass("Required rollback JSON files exist and parse");
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
  checkBackendFlagRemoved();
  checkJsonStateFiles();
  await checkReadOnlyEndpoints();
  console.log("JSON rollback verification passed.");
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
