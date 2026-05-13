const express = require("express");

// Helpers stay in server.js until Ph3
module.exports = function googleTasksRoutes({ getTasksClient, todayBangkok, friendlyError }) {
  const router = express.Router();

  function hasGoogleTasksEnv() {
    return !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    );
  }

  function googleTasksAuthStatus(e) {
    const msg = String(e?.message || e || "").toLowerCase();
    const status = e?.code || e?.response?.status;
    const reason = String(e?.errors?.[0]?.reason || e?.response?.data?.error || "").toLowerCase();

    if (
      status === 401 ||
      status === 403 ||
      reason.includes("invalid_client") ||
      reason.includes("invalid_grant") ||
      reason.includes("insufficient") ||
      msg.includes("invalid_client") ||
      msg.includes("invalid grant") ||
      msg.includes("insufficient authentication scopes") ||
      msg.includes("unauthorized") ||
      msg.includes("not authorized")
    ) {
      return {
        status: status === 403 || msg.includes("insufficient") || reason.includes("insufficient") ? 403 : 401,
        message: "Google Tasks not connected. Reconnect Google with Tasks scope.",
      };
    }

    return null;
  }

  router.get("/google-tasks/status", async (req, res) => {
    if (!hasGoogleTasksEnv()) {
      return res.json({ connected: false, configured: false });
    }

    try {
      const tasks = getTasksClient();
      await tasks.tasks.list({
        tasklist: "@default",
        showCompleted: false,
        maxResults: 1,
      });
      res.json({ connected: true, configured: true });
    } catch (e) {
      const authError = googleTasksAuthStatus(e);
      if (authError) {
        return res.json({
          connected: false,
          configured: true,
          error: authError.message,
          requiresReconnect: true,
        });
      }
      res.json({
        connected: false,
        configured: true,
        error: friendlyError(e),
      });
    }
  });

  // Returns incomplete tasks due today or overdue (Bangkok timezone)
  router.get("/google-tasks/today", async (req, res) => {
    try {
      const tasks = getTasksClient();
      const today = todayBangkok();
      const r = await tasks.tasks.list({
        tasklist: "@default",
        showCompleted: false,
        maxResults: 100,
      });
      // Include tasks with no due date OR due date <= today (overdue + today)
      const items = (r.data.items || []).filter(t =>
        !t.due || t.due.slice(0, 10) <= today
      );
      res.json(items);
    } catch (e) {
      const authError = googleTasksAuthStatus(e);
      if (authError) return res.status(authError.status).json({ error: authError.message, connected: false });
      res.status(500).json({ error: friendlyError(e) });
    }
  });

  // Create a new task due today
  router.post("/google-tasks", async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: "title is required" });
      const tasks = getTasksClient();
      const today = todayBangkok();
      const r = await tasks.tasks.insert({
        tasklist: "@default",
        resource: { title, due: today + "T00:00:00.000Z" },
      });
      res.json(r.data);
    } catch (e) {
      const authError = googleTasksAuthStatus(e);
      if (authError) return res.status(authError.status).json({ error: authError.message, connected: false });
      res.status(500).json({ error: friendlyError(e) });
    }
  });

  // Update a task: mark complete or update title
  router.put("/google-tasks/:id", async (req, res) => {
    try {
      const tasks = getTasksClient();
      const patch = {};
      if (req.body.complete) patch.status = "completed";
      if (req.body.title)    patch.title  = req.body.title;
      const r = await tasks.tasks.patch({
        tasklist: "@default",
        task: req.params.id,
        resource: patch,
      });
      res.json(r.data);
    } catch (e) {
      const authError = googleTasksAuthStatus(e);
      if (authError) return res.status(authError.status).json({ error: authError.message, connected: false });
      res.status(500).json({ error: friendlyError(e) });
    }
  });

  return router;
};
