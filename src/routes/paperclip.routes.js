const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  toReviewSessionInput,
  validatePaperclipPayload,
} = require("../integrations/paperclip/contract");
const {
  normalizePaperclipDocsPayload,
} = require("../integrations/paperclip/documents-contract");
const {
  attachDocumentTask,
  buildDocsReviewSessionInput,
  detachDocumentTask,
  mergeDocsWorkflowState,
  setDocumentReviewStatus,
} = require("../integrations/paperclip/docs-workflow");
const {
  connectPaperclipConnection,
  disconnectPaperclipConnection,
  publicPaperclipConnection,
  readPaperclipConnectionRaw,
  rotatePaperclipSecret,
} = require("../integrations/paperclip/connection-config");
const {
  buildPaperclipOperationsStatus,
} = require("../integrations/paperclip/operations-status");
const {
  assertPaperclipWebhookRequest,
  PaperclipWebhookAuthError,
} = require("../integrations/paperclip/webhook-auth");

module.exports = function paperclipRoutes({ store, diff, friendlyError }) {
  const router = express.Router();
  const docsFixturePath = path.join(__dirname, "..", "integrations", "paperclip", "fixtures", "document-artifacts.json");

  function auditEvent(type, fields = {}) {
    return { type, actor: "system", at: new Date().toISOString(), ...fields };
  }

  function sendConnectionError(res, error) {
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    return res.status(status).json({ error: status === 500 ? friendlyError(error) : error.message });
  }

  function sendWorkflowError(res, error) {
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    return res.status(status).json({ error: status === 500 ? friendlyError(error) : error.message });
  }

  function sendWebhookError(res, error) {
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    return res.status(status).json({ error: status === 500 ? friendlyError(error) : error.message });
  }

  function liveContractOptions() {
    const allowedEnvironment = process.env.PAPERCLIP_ALLOWED_ENVIRONMENT;
    if (!allowedEnvironment || !allowedEnvironment.trim()) {
      const error = new Error("PAPERCLIP_ALLOWED_ENVIRONMENT must be configured");
      error.statusCode = 503;
      throw error;
    }
    return {
      allowedEnvironments: [allowedEnvironment.trim()],
      source: "paperclip_webhook",
    };
  }

  function loadMockDocsPayload() {
    const fixture = JSON.parse(fs.readFileSync(docsFixturePath, "utf8"));
    return mergeDocsWorkflowState(normalizePaperclipDocsPayload(fixture));
  }

  function findMockDocOrThrow(artifactId) {
    const payload = loadMockDocsPayload();
    const doc = payload.documents.find(item => item.artifactId === artifactId);
    if (!doc) {
      const error = new Error("Document artifact not found");
      error.statusCode = 404;
      throw error;
    }
    return { payload, doc };
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

  router.post("/integrations/paperclip/webhook", async (req, res) => {
    try {
      const connection = readPaperclipConnectionRaw();
      const webhook = assertPaperclipWebhookRequest(req, { secret: connection.secret });
      if (connection.status !== "connected") {
        return res.status(403).json({ error: "Paperclip Settings connection must be connected" });
      }

      const options = liveContractOptions();
      const validation = validatePaperclipPayload(req.body, options);
      if (!validation.ok) {
        return res.status(400).json({
          error: "Invalid Paperclip contract payload",
          errors: validation.errors,
        });
      }

      const existing = typeof store.getSessionByRequestId === "function"
        ? store.getSessionByRequestId(validation.value.requestId)
        : store.getAllSessions().find(session => session.requestId === validation.value.requestId);
      if (existing) {
        if (
          existing.source === "paperclip_webhook"
          && existing.payloadHash
          && existing.payloadHash === webhook.payloadHash
        ) {
          const updated = store.appendSessionAuditEvent?.(
            existing.id,
            auditEvent("paperclip_duplicate_payload_ignored", {
              requestId: validation.value.requestId,
              payloadHash: webhook.payloadHash,
            })
          ) || existing;
          return res.status(200).json({ ...updated, idempotent: true });
        }

        store.appendSessionAuditEvent?.(
          existing.id,
          auditEvent("paperclip_duplicate_payload_rejected", {
            requestId: validation.value.requestId,
            payloadHash: webhook.payloadHash,
            existingPayloadHash: existing.payloadHash || null,
          })
        );
        return res.status(409).json({
          error: existing.source === "paperclip_webhook"
            ? "Duplicate Paperclip requestId with different payload"
            : "Duplicate Paperclip requestId already exists",
          requestId: validation.value.requestId,
          existingSessionId: existing.id,
        });
      }

      const sessionInput = await resolveDiffs({
        ...toReviewSessionInput(req.body, options),
        payloadHash: webhook.payloadHash,
        auditTrail: [
          auditEvent("paperclip_payload_received", {
            requestId: validation.value.requestId,
            contractVersion: validation.value.contractVersion,
            sourceId: webhook.source,
            agentRunId: validation.value.agent.runId,
            payloadHash: webhook.payloadHash,
            receivedTimestamp: webhook.timestamp,
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
      if (e instanceof PaperclipWebhookAuthError) {
        return sendWebhookError(res, e);
      }
      return sendWebhookError(res, e);
    }
  });

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

  router.get("/integrations/paperclip/mock/docs", (_req, res) => {
    try {
      return res.json(loadMockDocsPayload());
    } catch (e) {
      return res.status(500).json({ error: friendlyError(e) });
    }
  });

  router.post("/integrations/paperclip/mock/docs/review-task", (req, res) => {
    try {
      const { payload, doc } = findMockDocOrThrow(req.body?.artifactId);
      const sessionInput = buildDocsReviewSessionInput({
        doc,
        source: payload.source,
        body: req.body || {},
      });
      const session = store.createSession(sessionInput);
      const task = session.tasks[0];
      if (task) {
        attachDocumentTask(doc.artifactId, {
          requestId: session.requestId,
          externalTaskId: task.externalTaskId,
          title: task.title,
          relationship: "created_from_doc",
          anchorText: req.body?.excerpt || doc.summary || "",
        });
      }
      return res.status(201).json(session);
    } catch (e) {
      return sendWorkflowError(res, e);
    }
  });

  router.post("/integrations/paperclip/mock/docs/:artifactId/attachments", (req, res) => {
    try {
      findMockDocOrThrow(req.params.artifactId);
      attachDocumentTask(req.params.artifactId, req.body || {});
      const updated = findMockDocOrThrow(req.params.artifactId).doc;
      return res.json(updated);
    } catch (e) {
      return sendWorkflowError(res, e);
    }
  });

  router.delete("/integrations/paperclip/mock/docs/:artifactId/attachments", (req, res) => {
    try {
      findMockDocOrThrow(req.params.artifactId);
      detachDocumentTask(req.params.artifactId, req.body || {});
      const updated = findMockDocOrThrow(req.params.artifactId).doc;
      return res.json(updated);
    } catch (e) {
      return sendWorkflowError(res, e);
    }
  });

  router.post("/integrations/paperclip/mock/docs/:artifactId/status", (req, res) => {
    try {
      findMockDocOrThrow(req.params.artifactId);
      setDocumentReviewStatus(req.params.artifactId, req.body?.reviewStatus);
      const updated = findMockDocOrThrow(req.params.artifactId).doc;
      return res.json(updated);
    } catch (e) {
      return sendWorkflowError(res, e);
    }
  });

  router.get("/integrations/paperclip/connection", (_req, res) => {
    try {
      return res.json(publicPaperclipConnection());
    } catch (e) {
      return sendConnectionError(res, e);
    }
  });

  router.get("/integrations/paperclip/operations/status", (_req, res) => {
    try {
      return res.json(buildPaperclipOperationsStatus({
        sessions: store.getAllSessions(),
        connection: publicPaperclipConnection(),
        env: process.env,
      }));
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
