const express = require("express");
const {
  toReviewSessionInput,
  validatePaperclipPayload,
} = require("../integrations/paperclip/contract");
const {
  connectPaperclipConnection,
  disconnectPaperclipConnection,
  publicPaperclipConnection,
  rotatePaperclipSecret,
} = require("../integrations/paperclip/connection-config");

module.exports = function paperclipRoutes({ store, diff, friendlyError }) {
  const router = express.Router();

  function auditEvent(type, fields = {}) {
    return { type, actor: "system", at: new Date().toISOString(), ...fields };
  }

  function sendConnectionError(res, error) {
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    return res.status(status).json({ error: status === 500 ? friendlyError(error) : error.message });
  }

  async function resolveDiffs(sessionInput) {
    if (!diff || !Array.isArray(sessionInput.tasks)) return sessionInput;
    const boardCardsCache = new Map();
    const tasks = [];
    for (const task of sessionInput.tasks) {
      const result = task.targetBoardId
        ? await diff.diffTask({
            title: task.title,
            targetBoardId: task.targetBoardId,
            boardCardsCache,
          })
        : {
            diffStatus: "create_new",
            matchedCardId: null,
            confidence: task.confidence ?? 1.0,
            matchReason: "No targetBoardId supplied",
          };
      tasks.push({
        ...task,
        ...result,
        auditTrail: [
          ...(task.auditTrail || []),
          auditEvent("task_diff_resolved", {
            externalTaskId: task.externalTaskId,
            diffStatus: result.diffStatus,
            matchedCardId: result.matchedCardId,
            confidence: result.confidence,
            matchReason: result.matchReason || "",
          }),
        ],
      });
    }
    return { ...sessionInput, tasks };
  }

  router.post("/integrations/paperclip/mock/review-session", async (req, res) => {
    try {
      const validation = validatePaperclipPayload(req.body);
      if (!validation.ok) {
        return res.status(400).json({
          error: "Invalid Paperclip contract payload",
          errors: validation.errors,
        });
      }

      const existing = typeof store.getSessionByRequestId === "function"
        ? store.getSessionByRequestId(validation.value.requestId)
        : store.getAllSessions().find(session => session.requestId === validation.value.requestId);
      if (existing && existing.source === "paperclip_mock") {
        return res.status(409).json({
          error: "Duplicate Paperclip requestId",
          requestId: validation.value.requestId,
          existingSessionId: existing.id,
        });
      }

      const sessionInput = await resolveDiffs({
        ...toReviewSessionInput(req.body),
        auditTrail: [
          auditEvent("paperclip_payload_received", {
            requestId: validation.value.requestId,
            contractVersion: validation.value.contractVersion,
            agentRunId: validation.value.agent.runId,
          }),
        ],
      });
      const session = store.createSession(sessionInput);
      const updated = store.appendSessionAuditEvent?.(
        session.id,
        auditEvent("review_session_created", {
          sessionId: session.id,
          sourceEnvironment: session.externalSource?.environment || null,
          taskCount: session.tasks.length,
        })
      ) || session;
      return res.status(201).json(updated);
    } catch (e) {
      return res.status(500).json({ error: friendlyError(e) });
    }
  });

  router.get("/integrations/paperclip/connection", (_req, res) => {
    try {
      return res.json(publicPaperclipConnection());
    } catch (e) {
      return sendConnectionError(res, e);
    }
  });

  router.post("/integrations/paperclip/connection/connect", (req, res) => {
    try {
      return res.json(connectPaperclipConnection(req.body));
    } catch (e) {
      return sendConnectionError(res, e);
    }
  });

  router.post("/integrations/paperclip/connection/disconnect", (_req, res) => {
    try {
      return res.json(disconnectPaperclipConnection());
    } catch (e) {
      return sendConnectionError(res, e);
    }
  });

  router.post("/integrations/paperclip/connection/rotate-secret", (req, res) => {
    try {
      return res.json(rotatePaperclipSecret(req.body));
    } catch (e) {
      return sendConnectionError(res, e);
    }
  });

  return router;
};
