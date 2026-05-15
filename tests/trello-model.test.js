const assert = require("node:assert/strict");
const test = require("node:test");

const { buildCfNames, normalizeCard } = require("../src/models/trello.model");

test("normalizeCard preserves the public normalized Trello card shape", () => {
  const normalized = normalizeCard({
    id: "card-1",
    name: "Ship baseline",
    desc: "Make npm test useful",
    due: "2026-05-20T10:00:00.000Z",
    dueComplete: true,
    start: "2026-05-18T10:00:00.000Z",
    dueReminder: 1440,
    url: "https://trello.example/card-1",
    idList: "list-1",
    labels: [{ id: "label-1", name: "P0", color: "red" }],
    members: [{ id: "member-1", username: "codex", fullName: "" }],
    checklists: [{
      checkItems: [
        { state: "complete" },
        { state: "incomplete" },
      ],
    }],
    customFieldItems: [
      { idCustomField: "cf-priority", value: { text: "High" } },
      { idCustomField: "cf-status", idValue: "opt-ready" },
      { idCustomField: "cf-risk", value: { checked: "true" } },
    ],
  }, {
    nameMap: new Map([
      ["cf-priority", "Priority"],
      ["cf-status", "Status"],
      ["cf-risk", "Risk accepted"],
    ]),
    optionMap: new Map([["opt-ready", "Ready"]]),
  });

  assert.deepEqual(normalized, {
    id: "card-1",
    name: "Ship baseline",
    desc: "Make npm test useful",
    due: "2026-05-20T10:00:00.000Z",
    dueComplete: true,
    start: "2026-05-18T10:00:00.000Z",
    dueReminder: 1440,
    url: "https://trello.example/card-1",
    idList: "list-1",
    labels: [{ id: "label-1", name: "P0", color: "red" }],
    members: [{ id: "member-1", username: "codex", fullName: "codex" }],
    checklistProgress: { done: 1, total: 2 },
    customFields: {
      Priority: "High",
      Status: "Ready",
      "Risk accepted": "true",
    },
  });
});

test("normalizeCard supplies stable defaults for sparse Trello cards", () => {
  const normalized = normalizeCard({
    id: "card-2",
    name: "Sparse card",
    idList: "list-2",
  });

  assert.deepEqual(normalized, {
    id: "card-2",
    name: "Sparse card",
    desc: "",
    due: null,
    dueComplete: false,
    start: null,
    dueReminder: -1,
    url: "",
    idList: "list-2",
    labels: [],
    members: [],
    checklistProgress: { done: 0, total: 0 },
    customFields: {},
  });
});

test("buildCfNames builds and reuses custom-field name and option maps", async () => {
  const cache = new Map();
  const first = await buildCfNames("board-1", cache, [{
    id: "cf-status",
    name: "Status",
    options: [
      { id: "opt-ready", value: { text: "Ready" } },
      { id: "opt-empty", value: {} },
    ],
  }]);

  assert.equal(first.nameMap.get("cf-status"), "Status");
  assert.equal(first.optionMap.get("opt-ready"), "Ready");
  assert.equal(first.optionMap.has("opt-empty"), false);

  const second = await buildCfNames("board-1", cache, {
    getBoardCustomFields: async () => {
      throw new Error("cached board should not refetch custom fields");
    },
  });
  assert.equal(second, first);
});
