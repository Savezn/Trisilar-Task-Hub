const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");

const makeConfigRoutes = require("../src/routes/config.routes");
const makeReviewRoutes = require("../src/routes/review.routes");
const makeTrelloRoutes = require("../src/routes/trello.routes");
const { buildCfNames, normalizeCard } = require("../src/models/trello.model");
const { requestJson, withTestServer } = require("./helpers/test-server");

function appWithJson() {
  const app = express();
  app.use(express.json());
  return app;
}

function friendlyError(error) {
  return error.message || String(error);
}

test("config routes return and persist the injected config payload", async () => {
  let config = {
    allowedWorkspaceIds: ["org-a"],
    workspaceVisibility: "limited",
  };
  const app = appWithJson();
  app.use("/api", makeConfigRoutes({
    readConfig: () => config,
    writeConfig: next => {
      config = next;
    },
    friendlyError,
  }));

  await withTestServer(app, async baseUrl => {
    const first = await requestJson(baseUrl, "/api/config");
    assert.equal(first.response.status, 200);
    assert.deepEqual(first.body, {
      allowedWorkspaceIds: ["org-a"],
      workspaceVisibility: "limited",
    });

    const saved = await requestJson(baseUrl, "/api/config", {
      method: "POST",
      body: { allowedWorkspaceIds: ["org-b"], workspaceVisibility: "all" },
    });
    assert.equal(saved.response.status, 200);
    assert.deepEqual(saved.body, { ok: true });

    const second = await requestJson(baseUrl, "/api/config");
    assert.deepEqual(second.body, {
      allowedWorkspaceIds: ["org-b"],
      workspaceVisibility: "all",
    });
  });
});

test("trello status reports disconnected without live credentials or Trello calls", async t => {
  const previousKey = process.env.TRELLO_API_KEY;
  const previousToken = process.env.TRELLO_TOKEN;
  delete process.env.TRELLO_API_KEY;
  delete process.env.TRELLO_TOKEN;
  t.after(() => {
    if (previousKey === undefined) delete process.env.TRELLO_API_KEY;
    else process.env.TRELLO_API_KEY = previousKey;
    if (previousToken === undefined) delete process.env.TRELLO_TOKEN;
    else process.env.TRELLO_TOKEN = previousToken;
  });

  let getBoardsCalled = false;
  const app = appWithJson();
  app.use("/api", makeTrelloRoutes({
    trello: {
      getBoards: async () => {
        getBoardsCalled = true;
        throw new Error("live Trello should not be called");
      },
    },
    normalizeCard,
    buildCfNames,
    cacheGet: () => null,
    cacheSet: () => {},
    cacheInvalidate: () => {},
    friendlyError,
    autoSyncToGCal: () => {},
    autoDeleteFromGCal: () => {},
    readConfig: () => ({}),
  }));

  await withTestServer(app, async baseUrl => {
    const result = await requestJson(baseUrl, "/api/trello/status");
    assert.equal(result.response.status, 200);
    assert.equal(getBoardsCalled, false);
    assert.deepEqual(result.body, {
      configured: false,
      verified: false,
      connected: false,
      state: "disconnected",
      error: "Trello credentials need Runtime setup before board and task data can load.",
    });
  });
});

test("boards route filters by configured workspace without external services", async () => {
  const app = appWithJson();
  app.use("/api", makeTrelloRoutes({
    trello: {
      getBoards: async () => [
        { id: "board-a", name: "Allowed", idOrganization: "org-a" },
        { id: "board-b", name: "Blocked", idOrganization: "org-b" },
        { id: "board-c", name: "Personal", idOrganization: null },
      ],
    },
    normalizeCard,
    buildCfNames,
    cacheGet: () => null,
    cacheSet: () => {},
    cacheInvalidate: () => {},
    friendlyError,
    autoSyncToGCal: () => {},
    autoDeleteFromGCal: () => {},
    readConfig: () => ({ allowedWorkspaceIds: ["org-a"] }),
  }));

  await withTestServer(app, async baseUrl => {
    const result = await requestJson(baseUrl, "/api/boards");
    assert.equal(result.response.status, 200);
    assert.deepEqual(result.body.map(board => board.id), ["board-a", "board-c"]);
  });
});

test("review route creates a pending session through injected store and diff only", async () => {
  const sessions = [];
  const store = {
    createSession: data => {
      const session = {
        id: "session-1",
        title: data.title,
        source: data.source || "manual_upload",
        tasks: data.tasks.map((task, index) => ({
          id: `task-${index + 1}`,
          title: task.title,
          targetBoardId: task.targetBoardId,
          diffStatus: task.diffStatus,
          matchedCardId: task.matchedCardId,
          confidence: task.confidence,
          status: "pending",
          trelloCardId: null,
        })),
      };
      sessions.push(session);
      return session;
    },
    getAllSessions: () => sessions,
  };
  const app = appWithJson();
  app.use("/api", makeReviewRoutes({
    store,
    diff: {
      diffTask: async ({ title, targetBoardId }) => ({
        diffStatus: "create_new",
        matchedCardId: null,
        confidence: 0.93,
        matchReason: `No existing card for ${title} on ${targetBoardId}`,
      }),
    },
    trello: {},
    friendlyError,
    cacheInvalidate: () => {},
    autoSyncToGCal: () => {},
  }));

  await withTestServer(app, async baseUrl => {
    const created = await requestJson(baseUrl, "/api/reviews", {
      method: "POST",
      body: {
        title: "Deterministic baseline",
        tasks: [{ title: "Write tests", targetBoardId: "board-a" }],
      },
    });
    assert.equal(created.response.status, 200);
    assert.equal(created.body.tasks[0].status, "pending");
    assert.equal(created.body.tasks[0].diffStatus, "create_new");
    assert.equal(created.body.tasks[0].trelloCardId, null);

    const listed = await requestJson(baseUrl, "/api/reviews");
    assert.equal(listed.response.status, 200);
    assert.equal(listed.body.length, 1);
    assert.equal(listed.body[0].id, "session-1");
  });
});
