const assert = require("node:assert/strict");
const test = require("node:test");

const {
  publicPaperclipConnection,
} = require("../src/integrations/paperclip/connection-config");

test("publicPaperclipConnection exposes status shape without leaking the shared secret", t => {
  const previousBaseUrl = process.env.APP_BASE_URL;
  process.env.APP_BASE_URL = "https://taskhub.example.test/";
  t.after(() => {
    if (previousBaseUrl === undefined) delete process.env.APP_BASE_URL;
    else process.env.APP_BASE_URL = previousBaseUrl;
  });

  const publicConnection = publicPaperclipConnection({
    status: "connected",
    workspaceId: "paperclip-workspace",
    label: "Dev Paperclip",
    connectedAt: "2026-05-15T00:00:00.000Z",
    disabledAt: null,
    secretUpdatedAt: "2026-05-15T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
    secret: "super-secret-value-that-stays-private",
  });

  assert.equal(Object.hasOwn(publicConnection, "secret"), false);
  assert.deepEqual(publicConnection, {
    status: "connected",
    connected: true,
    hasSecret: true,
    secretPreview: "configured",
    workspaceId: "paperclip-workspace",
    label: "Dev Paperclip",
    webhookPath: "/api/integrations/paperclip/webhook",
    webhookUrl: "https://taskhub.example.test/api/integrations/paperclip/webhook",
    connectedAt: "2026-05-15T00:00:00.000Z",
    disabledAt: null,
    secretUpdatedAt: "2026-05-15T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
  });
});
