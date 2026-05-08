const express = require("express");
const {
  toReviewSessionInput,
  validatePaperclipPayload,
} = require("../integrations/paperclip/contract");

module.exports = function paperclipRoutes({ store, friendlyError }) {
  const router = express.Router();

  router.post("/integrations/paperclip/mock/review-session", (req, res) => {
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

      return res.status(201).json(store.createSession(toReviewSessionInput(req.body)));
    } catch (e) {
      return res.status(500).json({ error: friendlyError(e) });
    }
  });

  return router;
};
