const express = require("express");

// Deps stay in server.js until Ph3; autoSyncToGCal shared with card routes
module.exports = function reviewRoutes({ store, diff, trello, friendlyError, cacheInvalidate, autoSyncToGCal }) {
  const router = express.Router();

  function notFound(e) {
    if (e.message.toLowerCase().includes("not found")) return 404;
    if (e.message.includes("already approved") || e.message.includes("already processed") ||
        e.message.includes("Cannot edit")       || e.message.includes("unprocessed tasks")) return 409;
    return 500;
  }

  function auditEvent(type, fields = {}) {
    return { type, actor: "system", at: new Date().toISOString(), ...fields };
  }

  function classifyPaperclipReviewSession(session) {
    const source = String(session?.source || "").toLowerCase();
    const externalSystem = String(session?.externalSource?.system || "").toLowerCase();
    const requestId = String(session?.requestId || "").toLowerCase();
    const agentRole = String(session?.agent?.agentRole || "").toLowerCase();
    const title = String(session?.title || "").toLowerCase();
    const auditTypes = (session?.auditTrail || []).map(event => String(event.type || "").toLowerCase());
    const isPaperclip = source.startsWith("paperclip_")
      || externalSystem === "paperclip"
      || requestId.startsWith("pc_")
      || auditTypes.some(type => type.startsWith("paperclip_"));
    const testRequestPattern = /^(pc_live_interop_|pc_interop_|pc_canary_|pc_live_canary_|pc_daily_monitor_|pc_monitor_|pc_standing_|pc_true_external_|pc_w3_03_|pc_cleanup_)/;
    const testRolePattern = /^(interop_test|canary|daily_monitor|monitor|live_canary)$/;
    const testTitlePattern = /(live interop|interop test|canary|daily monitor|monitor canary|standing observation)/;
    const isTestOrCanary = testRequestPattern.test(requestId)
      || testRolePattern.test(agentRole)
      || testTitlePattern.test(title);
    return {
      isPaperclip,
      isTestOrCanary,
      label: isTestOrCanary ? "Paperclip test/canary" : "Paperclip live work",
    };
  }

  async function pushTaskToTrello(sessionId, task) {
    if (!task.targetListId) {
      store.appendTaskAuditEvent?.(
        sessionId,
        task.id,
        auditEvent("trello_push_failed", {
          reason: "No targetListId",
          retryable: false,
        })
      );
      return { skipped: true, reason: "No targetListId" };
    }
    try {
      let card;
      store.appendTaskAuditEvent?.(
        sessionId,
        task.id,
        auditEvent("trello_push_attempted", {
          mode: task.diffStatus === "update_existing" && task.matchedCardId ? "update" : "create",
          targetListId: task.targetListId,
          matchedCardId: task.matchedCardId || null,
        })
      );
      if (task.diffStatus === "update_existing" && task.matchedCardId) {
        card = await trello.updateCard(task.matchedCardId, {
          name: task.title,
          desc: task.description,
          due:  task.deadline || null,
        });
      } else {
        card = await trello.createCard(
          task.targetListId,
          task.title,
          task.description,
          task.deadline || null,
          null, null
        );
      }
      cacheInvalidate("all-cards"); // card created/updated via review approve
      store.setTaskTrelloCardId(sessionId, task.id, card.id);
      if (task.syncCalendar && task.deadline) {
        autoSyncToGCal(card.id, { name: task.title, desc: task.description, due: task.deadline, start: null });
      }
      return { ok: true, cardId: card.id };
    } catch (e) {
      console.error("[Trello push]", task.id, e.message);
      store.appendTaskAuditEvent?.(
        sessionId,
        task.id,
        auditEvent("trello_push_failed", {
          error: friendlyError(e),
          retryable: true,
        })
      );
      return { ok: false, error: friendlyError(e) };
    }
  }

  router.get("/reviews", (req, res) => {
    try { res.json(store.getAllSessions()); }
    catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.post("/task-diff", async (req, res) => {
    try {
      const { title, targetBoardId } = req.body;
      if (!title)         return res.status(400).json({ error: "title is required" });
      if (!targetBoardId) return res.status(400).json({ error: "targetBoardId is required" });
      res.json(await diff.diffTask({ title, targetBoardId }));
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.post("/reviews", async (req, res) => {
    try {
      const data = { ...req.body };
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        const boardCardsCache = new Map();
        const resolved = [];
        for (const task of data.tasks) {
          if (task.targetBoardId) {
            const result = await diff.diffTask({ title: task.title, targetBoardId: task.targetBoardId, boardCardsCache });
            resolved.push({ ...task, ...result });
          } else {
            resolved.push(task);
          }
        }
        data.tasks = resolved;
      }
      res.json(store.createSession(data));
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.get("/reviews/:id", (req, res) => {
    try {
      const session = store.getSession(req.params.id);
      if (!session) return res.status(404).json({ error: "Session not found" });
      res.json(session);
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.post("/reviews/:id/paperclip-test-cleanup", (req, res) => {
    try {
      const session = store.getSession(req.params.id);
      if (!session) return res.status(404).json({ error: "Session not found" });
      const classification = classifyPaperclipReviewSession(session);
      if (!classification.isPaperclip) {
        return res.status(409).json({ error: "Session is not Paperclip-originated" });
      }
      if (!classification.isTestOrCanary) {
        return res.status(409).json({ error: "Session is not a Paperclip test or canary session" });
      }
      if (typeof store.cleanupPaperclipTestSession !== "function") {
        return res.status(500).json({ error: "Paperclip cleanup store method unavailable" });
      }

      const reason = String(req.body?.reason || "Paperclip test/canary cleanup").slice(0, 500);
      const updated = store.cleanupPaperclipTestSession(req.params.id, {
        reason,
        classification,
      });
      res.json(updated);
    } catch (e) { res.status(notFound(e)).json({ error: e.message }); }
  });

  router.put("/reviews/:id/tasks/:taskId", (req, res) => {
    try { res.json(store.updateTask(req.params.id, req.params.taskId, req.body)); }
    catch (e) { res.status(notFound(e)).json({ error: e.message }); }
  });

  router.post("/reviews/:id/tasks/:taskId/approve", async (req, res) => {
    try {
      const task    = store.approveTask(req.params.id, req.params.taskId);
      const result  = await pushTaskToTrello(req.params.id, task);
      const updated = store.getSession(req.params.id)?.tasks.find(t => t.id === req.params.taskId) || task;
      res.json({ ...updated, trello: result });
    } catch (e) { res.status(notFound(e)).json({ error: e.message }); }
  });

  router.post("/reviews/:id/tasks/:taskId/reject", (req, res) => {
    try { res.json(store.rejectTask(req.params.id, req.params.taskId)); }
    catch (e) { res.status(notFound(e)).json({ error: e.message }); }
  });

  router.post("/reviews/:id/approve-bulk", async (req, res) => {
    try {
      const { taskIds = [] } = req.body;
      const results = await Promise.all(taskIds.map(async taskId => {
        try {
          const task    = store.approveTask(req.params.id, taskId);
          const result  = await pushTaskToTrello(req.params.id, task);
          const updated = store.getSession(req.params.id)?.tasks.find(t => t.id === taskId) || task;
          return { taskId, ok: true, trelloCardId: updated.trelloCardId, trello: result };
        } catch (e) { return { taskId, ok: false, error: friendlyError(e) }; }
      }));
      res.json(results);
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.post("/reviews/:id/reject-bulk", (req, res) => {
    try {
      const { taskIds = [] } = req.body;
      const results = taskIds.map(taskId => {
        try { return { taskId, ok: true, task: store.rejectTask(req.params.id, taskId) }; }
        catch (e) { return { taskId, ok: false, error: e.message }; }
      });
      res.json(results);
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.delete("/reviews/:id", (req, res) => {
    try { res.json(store.dismissSession(req.params.id)); }
    catch (e) { res.status(notFound(e)).json({ error: e.message }); }
  });

  return router;
};
