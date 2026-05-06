const express = require("express");

// Helpers (readConfig, writeConfig, friendlyError) live in server.js until Ph3
module.exports = function configRoutes({ readConfig, writeConfig, friendlyError }) {
  const router = express.Router();

  router.get("/config", (req, res) => res.json(readConfig()));

  router.post("/config", (req, res) => {
    try { writeConfig(req.body); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  return router;
};
