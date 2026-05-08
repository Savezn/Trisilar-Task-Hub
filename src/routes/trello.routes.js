const express = require("express");

/**
 * Factory for Trello routes
 * @param {object} deps - { trello, normalizeCard, buildCfNames, cacheGet, cacheSet, cacheInvalidate, friendlyError, autoSyncToGCal, autoDeleteFromGCal, readConfig }
 */
function makeTrelloRoutes({ trello, normalizeCard, buildCfNames, cacheGet, cacheSet, cacheInvalidate, friendlyError, autoSyncToGCal, autoDeleteFromGCal, readConfig }) {
  const router = express.Router();

  function trelloErrorStatus(e) {
    const msg = String(e?.message || e || "").toLowerCase();
    if (msg.includes("429") || msg.includes("rate limit") || msg.includes("too many requests")) return 429;
    if (msg.includes("401") || msg.includes("unauthorized") || msg.includes("invalid key") || msg.includes("invalid token")) return 401;
    return 500;
  }

  function sendTrelloError(res, e) {
    const status = trelloErrorStatus(e);
    if (status === 429) res.set("Retry-After", "60");
    res.status(status).json({ error: friendlyError(e) });
  }

  // ── Workspaces ────────────────────────────────────────────────────────────────

  router.get("/workspaces", async (req, res) => {
    try {
      const hit = cacheGet("workspaces");
      if (hit) return res.json(hit);
      const workspaces = await trello.getWorkspaces();
      cacheSet("workspaces", workspaces, 300_000);
      res.json(workspaces);
    } catch (e) { sendTrelloError(res, e); }
  });

  // ── Boards ────────────────────────────────────────────────────────────────────

  router.get("/boards", async (req, res) => {
    try {
      const hit = cacheGet("boards");
      const boards = hit || await trello.getBoards();
      if (!hit) cacheSet("boards", boards, 300_000);
      const config = readConfig();
      // If allowedWorkspaceIds is set, filter boards by workspace
      if (config.allowedWorkspaceIds && config.allowedWorkspaceIds.length > 0) {
        return res.json(boards.filter(b =>
          !b.idOrganization || config.allowedWorkspaceIds.includes(b.idOrganization)
        ));
      }
      res.json(boards);
    } catch (e) { sendTrelloError(res, e); }
  });

  // ── Lists ─────────────────────────────────────────────────────────────────────

  router.get("/boards/:id/lists", async (req, res) => {
    try { res.json(await trello.getLists(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.post("/boards/:id/lists", async (req, res) => {
    try { res.json(await trello.createList(req.params.id, req.body.name)); }
    catch (e) { sendTrelloError(res, e); }
  });

  // P7-4: Board convention health check
  const REQUIRED_LIST_GROUPS = [
    { name: "Backlog", aliases: ["backlog", "inbox", "ideas"] },
    { name: "Ready", aliases: ["ready", "todo", "to do", "next", "planned"] },
    { name: "Doing", aliases: ["doing", "in progress", "progress", "active", "wip"] },
    { name: "Review/QA", aliases: ["review", "qa", "review/qa", "testing", "verify"] },
    { name: "Done", aliases: ["done", "complete", "completed", "closed"] },
  ];

  router.get("/boards/:id/health", async (req, res) => {
    try {
      const hKey = `health:${req.params.id}`;
      const hit = cacheGet(hKey);
      if (hit) return res.json(hit);

      const lists = await trello.getLists(req.params.id);
      const names = lists.map(l => l.name.trim().toLowerCase());
      const missing = REQUIRED_LIST_GROUPS
        .filter(group => !names.some(n => group.aliases.some(alias => n === alias || n.includes(alias))))
        .map(group => group.name);
      const result = { ok: missing.length === 0, missing };
      cacheSet(hKey, result, 5 * 60_000); // 5 min TTL (lists rarely change)
      res.json(result);
    } catch (e) { sendTrelloError(res, e); }
  });

  // ── Cards ─────────────────────────────────────────────────────────────────────

  router.get("/lists/:id/cards", async (req, res) => {
    try { res.json(await trello.getCards(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.get("/boards/:id/cards", async (req, res) => {
    try {
      const boardId = req.params.id;
      const [lists, cards] = await Promise.all([
        trello.getLists(boardId).catch(() => []),
        trello.getBoardCards(boardId),
      ]);
      const cfData = await buildCfNames(boardId, new Map(), trello);
      const listMap = Object.fromEntries((lists || []).map(l => [l.id, l.name]));
      res.json(cards.map(card => ({
        ...normalizeCard(card, cfData),
        listName: listMap[card.idList] || "Unknown",
        boardId,
      })));
    } catch (e) { sendTrelloError(res, e); }
  });

  router.post("/cards", async (req, res) => {
    try {
      const { listId, name, desc, due, start, dueReminder, syncCalendar } = req.body;
      const card = await trello.createCard(listId, name, desc, due, start, dueReminder);
      cacheInvalidate("all-cards");
      res.json(card);
      if (syncCalendar) autoSyncToGCal(card.id, { name, desc, due, start });
    } catch (e) { sendTrelloError(res, e); }
  });

  router.put("/cards/:id", async (req, res) => {
    try {
      const { syncCalendar, ...trelloFields } = req.body;
      const card = await trello.updateCard(req.params.id, trelloFields);
      cacheInvalidate("all-cards");
      res.json(card);
      if (syncCalendar) {
        const syncDue   = "due"   in req.body ? req.body.due   : card.due;
        const syncStart = "start" in req.body ? req.body.start : card.start;
        autoSyncToGCal(req.params.id, {
          name:  req.body.name || card.name,
          desc:  req.body.desc || card.desc,
          due:   syncDue,
          start: syncStart,
        });
      }
    } catch (e) { sendTrelloError(res, e); }
  });

  router.put("/cards/:id/move", async (req, res) => {
    try {
      const card = await trello.moveCard(req.params.id, req.body.listId);
      cacheInvalidate("all-cards");
      res.json(card);
    }
    catch (e) { sendTrelloError(res, e); }
  });

  router.delete("/cards/:id", async (req, res) => {
    try {
      await trello.deleteCard(req.params.id);
      cacheInvalidate("all-cards");
      res.json({ ok: true });
      await autoDeleteFromGCal(req.params.id);
    } catch (e) { sendTrelloError(res, e); }
  });

  // ── All cards across all boards ───────────────────────────────────────────────

  router.get("/all-cards", async (req, res) => {
    try {
      const hit = cacheGet("all-cards");
      if (hit) return res.json(hit);

      const boards = await trello.getBoardsFull();
      const result = [];
      const cfCache = new Map();

      await Promise.all(boards.map(async (board) => {
        const cfData = await buildCfNames(board.id, cfCache, board.customFields);
        const listMap = Object.fromEntries((board.lists || []).map(l => [l.id, l.name]));
        
        const cards = await trello.getBoardCards(board.id);
        cards.forEach((card) => result.push({
          ...normalizeCard(card, cfData),
          listName: listMap[card.idList] || "Unknown",
          boardName: board.name,
          boardId: board.id,
        }));
      }));

      cacheSet("all-cards", result, 300_000); // 5 min TTL
      res.json(result);
    } catch (e) { sendTrelloError(res, e); }
  });

  router.post("/cache/clear", (req, res) => {
    cacheInvalidate("all-cards");
    cacheInvalidate("boards");
    cacheInvalidate("workspaces");
    res.json({ ok: true });
  });

  // ── Cards across specific boards (BU view) ────────────────────────────────────

  router.post("/boards/cards", async (req, res) => {
    try {
      const { boardIds } = req.body;
      const cacheKey = `boards-cards:${boardIds.join(",")}`;
      const hit = cacheGet(cacheKey);
      if (hit) return res.json(hit);

      const boards = await trello.getBoardsFull();
      const filteredBoards = boards.filter(b => boardIds.includes(b.id));
      const result = [];
      const cfCache = new Map();

      await Promise.all(filteredBoards.map(async (board) => {
        const cfData = await buildCfNames(board.id, cfCache, board.customFields);
        const listMap = Object.fromEntries((board.lists || []).map(l => [l.id, l.name]));
        
        const cards = await trello.getBoardCards(board.id);
        cards.forEach(card => result.push({
          ...normalizeCard(card, cfData),
          listName: listMap[card.idList] || "Unknown",
          boardId: board.id,
          boardName: board.name,
        }));
      }));
      cacheSet(cacheKey, result, 300_000); // 5 min TTL
      res.json(result);
    } catch (e) { sendTrelloError(res, e); }
  });

  // ── Checklists ────────────────────────────────────────────────────────────────

  router.get("/cards/:id/checklists", async (req, res) => {
    try { res.json(await trello.getCardChecklists(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.post("/cards/:id/checklists", async (req, res) => {
    try { res.json(await trello.addChecklist(req.params.id, req.body.name)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.post("/checklists/:id/checkitems", async (req, res) => {
    try { res.json(await trello.addCheckItem(req.params.id, req.body.name)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.put("/cards/:cardId/checklists/:clId/checkitems/:itemId", async (req, res) => {
    try { res.json(await trello.updateCheckItem(req.params.cardId, req.params.clId, req.params.itemId, req.body.state)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.delete("/checklists/:id/checkitems/:itemId", async (req, res) => {
    try { await trello.deleteCheckItem(req.params.id, req.params.itemId); res.json({ ok: true }); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.delete("/checklists/:id", async (req, res) => {
    try { await trello.deleteChecklist(req.params.id); res.json({ ok: true }); }
    catch (e) { sendTrelloError(res, e); }
  });

  // ── Labels ────────────────────────────────────────────────────────────────────

  router.get("/boards/:id/labels", async (req, res) => {
    try { res.json(await trello.getLabels(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.get("/boards/:id/members", async (req, res) => {
    try { res.json(await trello.getBoardMembers(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.get("/boards/:id/customFields", async (req, res) => {
    try { res.json(await trello.getBoardCustomFields(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  // ── Comments ──────────────────────────────────────────────────────────────────

  router.get("/cards/:id/comments", async (req, res) => {
    try { res.json(await trello.getComments(req.params.id)); }
    catch (e) { sendTrelloError(res, e); }
  });

  router.post("/cards/:id/comments", async (req, res) => {
    try { res.json(await trello.addComment(req.params.id, req.body.text)); }
    catch (e) { sendTrelloError(res, e); }
  });

  return router;
}

module.exports = makeTrelloRoutes;
