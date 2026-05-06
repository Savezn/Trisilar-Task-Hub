const express = require("express");

// Helpers stay in server.js until Ph3
module.exports = function calendarRoutes({ getCalendarClient, getCalendarId, getOAuth2Client, updateEnvKey, friendlyError }) {
  const router = express.Router();

  router.post("/auth/google", (req, res) => {
    const { clientId, clientSecret } = req.body;
    if (!clientId || !clientSecret) return res.status(400).json({ error: "clientId and clientSecret are required" });
    updateEnvKey("GOOGLE_CLIENT_ID", clientId);
    updateEnvKey("GOOGLE_CLIENT_SECRET", clientSecret);
    const auth = getOAuth2Client();
    const url = auth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
      ],
    });
    res.json({ url });
  });

  router.get("/auth/callback", async (req, res) => {
    try {
      const auth = getOAuth2Client();
      const { tokens } = await auth.getToken(req.query.code);
      if (tokens.refresh_token) updateEnvKey("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);
      res.send(`<script>window.opener?.postMessage('cal_connected','http://localhost:3000');window.close();</script><p>✓ Connected! You can close this window.</p>`);
    } catch (e) {
      res.send(`<p style="color:red">Error: ${friendlyError(e)}</p>`);
    }
  });

  router.get("/api/calendar/status", (req, res) => {
    res.json({
      hasClientId:      !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret:  !!process.env.GOOGLE_CLIENT_SECRET,
      hasRefreshToken:  !!process.env.GOOGLE_REFRESH_TOKEN,
      calendarId:       getCalendarId(),
      connected: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN),
    });
  });

  router.get("/api/calendar/events", async (req, res) => {
    try {
      if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === "test") {
        return res.json([]);
      }
      const cal = getCalendarClient();
      const { start, end } = req.query;
      const r = await cal.events.list({
        calendarId: getCalendarId(),
        timeMin: start || new Date().toISOString(),
        timeMax: end,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
      });
      res.json(r.data.items || []);
    } catch (e) {
      console.error("[GCal List Error]", e.message);
      res.json([]); // Return empty array instead of 500 to keep UI stable
    }
  });

  router.post("/api/calendar/events", async (req, res) => {
    try {
      const cal = getCalendarClient();
      const { summary, description, start, end, allDay, reminderMinutes } = req.body;
      const event = {
        summary,
        description,
        start: allDay ? { date: start } : { dateTime: start, timeZone: "Asia/Bangkok" },
        end:   allDay ? { date: end }   : { dateTime: end,   timeZone: "Asia/Bangkok" },
        reminders: {
          useDefault: false,
          overrides: reminderMinutes != null ? [{ method: "popup", minutes: parseInt(reminderMinutes) }] : [],
        },
      };
      const r = await cal.events.insert({ calendarId: getCalendarId(), resource: event });
      res.json(r.data);
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.put("/api/calendar/events/:id", async (req, res) => {
    try {
      const cal = getCalendarClient();
      const { summary, description, start, end, allDay, reminderMinutes } = req.body;
      const event = {
        summary,
        description,
        start: allDay ? { date: start } : { dateTime: start, timeZone: "Asia/Bangkok" },
        end:   allDay ? { date: end }   : { dateTime: end,   timeZone: "Asia/Bangkok" },
        reminders: {
          useDefault: false,
          overrides: reminderMinutes != null ? [{ method: "popup", minutes: parseInt(reminderMinutes) }] : [],
        },
      };
      const r = await cal.events.update({ calendarId: getCalendarId(), eventId: req.params.id, resource: event });
      res.json(r.data);
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  router.delete("/api/calendar/events/:id", async (req, res) => {
    try {
      const cal = getCalendarClient();
      await cal.events.delete({ calendarId: getCalendarId(), eventId: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: friendlyError(e) }); }
  });

  return router;
};
