const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const FIRST_SECRET = "paperclip-test-secret-0001";
const ROTATED_SECRET = "paperclip-test-secret-0002";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, child) {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with code ${child.exitCode}`);
    }

    try {
      const res = await fetch(`${baseUrl}/api/config`);
      if (res.ok) return;
    } catch (_error) {
      // Keep polling until the local server is ready.
    }

    await delay(250);
  }

  throw new Error("Server did not become ready");
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  const json = await res.json();
  return { status: res.status, json };
}

function postJson(url, body) {
  return requestJson(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function assertNoSecretLeak(json, secret) {
  assert(!JSON.stringify(json).includes(secret), "API response leaked the shared secret");
}

function pass(label) {
  console.log(`PASS ${label}`);
}

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "task-hub-paperclip-connection-"));
  const port = 3377 + Math.floor(Math.random() * 200);
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      APP_DATA_DIR: tempDir,
      APP_BASE_URL: "https://taskhub-dev.example.test",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk.toString(); });
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child);
    pass("server started with isolated runtime config");

    const initial = await requestJson(`${baseUrl}/api/integrations/paperclip/connection`);
    assert.strictEqual(initial.status, 200);
    assert.strictEqual(initial.json.status, "not_connected");
    assert.strictEqual(initial.json.connected, false);
    assert.strictEqual(initial.json.hasSecret, false);
    assert.strictEqual(initial.json.webhookUrl, "https://taskhub-dev.example.test/api/integrations/paperclip/webhook");
    pass("initial status is not connected and uses APP_BASE_URL");

    const connected = await postJson(`${baseUrl}/api/integrations/paperclip/connection/connect`, {
      workspaceId: "paperclip_workspace_test",
      label: "Dev Paperclip",
      sharedSecret: FIRST_SECRET,
    });
    assert.strictEqual(connected.status, 200);
    assert.strictEqual(connected.json.status, "connected");
    assert.strictEqual(connected.json.connected, true);
    assert.strictEqual(connected.json.hasSecret, true);
    assert.strictEqual(connected.json.secretPreview, "configured");
    assertNoSecretLeak(connected.json, FIRST_SECRET);
    pass("connect persists connection state without returning secret");

    const config = await requestJson(`${baseUrl}/api/config`);
    assert.strictEqual(config.status, 200);
    assertNoSecretLeak(config.json, FIRST_SECRET);
    pass("generic config endpoint does not expose Paperclip secret");

    const connectionFile = path.join(tempDir, "paperclip-connection.json");
    const storedAfterConnect = JSON.parse(fs.readFileSync(connectionFile, "utf8"));
    assert.strictEqual(storedAfterConnect.status, "connected");
    assert.strictEqual(storedAfterConnect.secret, FIRST_SECRET);
    pass("runtime connection file stores secret under APP_DATA_DIR");

    const rotated = await postJson(`${baseUrl}/api/integrations/paperclip/connection/rotate-secret`, {
      sharedSecret: ROTATED_SECRET,
    });
    assert.strictEqual(rotated.status, 200);
    assert.strictEqual(rotated.json.status, "connected");
    assert.strictEqual(rotated.json.secretPreview, "configured");
    assertNoSecretLeak(rotated.json, ROTATED_SECRET);
    const storedAfterRotate = JSON.parse(fs.readFileSync(connectionFile, "utf8"));
    assert.strictEqual(storedAfterRotate.secret, ROTATED_SECRET);
    pass("rotate updates runtime secret without returning secret");

    const disconnected = await postJson(`${baseUrl}/api/integrations/paperclip/connection/disconnect`, {});
    assert.strictEqual(disconnected.status, 200);
    assert.strictEqual(disconnected.json.status, "disabled");
    assert.strictEqual(disconnected.json.connected, false);
    assert.strictEqual(disconnected.json.hasSecret, false);
    assertNoSecretLeak(disconnected.json, ROTATED_SECRET);
    const storedAfterDisconnect = JSON.parse(fs.readFileSync(connectionFile, "utf8"));
    assert.strictEqual(storedAfterDisconnect.status, "disabled");
    assert.strictEqual(storedAfterDisconnect.secret, "");
    pass("disconnect disables future live webhook gate and removes runtime secret");

    console.log("Paperclip connection settings verification passed.");
  } catch (error) {
    console.error(stdout);
    console.error(stderr);
    throw error;
  } finally {
    child.kill();
    await delay(100);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
