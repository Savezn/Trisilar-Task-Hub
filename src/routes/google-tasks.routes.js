const express = require("express");

// Helpers stay in server.js until Ph3
module.exports = function googleTasksRoutes({ getTasksClient, todayBangkok, friendlyError }) {
  const router = express.Router();

  router.get("/google-tasks/status", (req, res) => {
    res.json({
      connected: !!(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_REFRESH_TOKEN
      ),
    });
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
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
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
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
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
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  return router;
};
