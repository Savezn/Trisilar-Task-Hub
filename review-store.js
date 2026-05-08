const fs   = require("fs");
const { randomUUID } = require("crypto");
const { getDataFilePath } = require("./src/utils/runtime");

const STORE_FILE = getDataFilePath("review-sessions.json");

// All file operations are synchronous, so Node's single-threaded event loop
// guarantees read-modify-write cycles are never interleaved. No external lock needed.

function read() {
  try { return JSON.parse(fs.readFileSync(STORE_FILE, "utf8")); }
  catch (e) {
    if (e.code === "ENOENT") return [];
    console.error("[review-store] corrupt data file:", e.message);
    return [];
  }
}

function write(sessions) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(sessions, null, 2));
}

// ── Public API ────────────────────────────────────────────────────────────────

function getAllSessions() {
  return read();
}

function getSession(id) {
  return read().find(s => s.id === id) || null;
}

function createSession(data) {
  const sessions = read();
  const session = {
    id: randomUUID(),
    title:      data.title      || "Untitled Session",
    source:     data.source     || "manual_upload",
    summary:    data.summary    || "",
    transcript: data.transcript || "",
    createdAt:  new Date().toISOString(),
    tasks: [],
  };
  session.tasks = (data.tasks || []).map(t => ({
    id:               randomUUID(),
    meetingId:        session.id,
    title:            t.title            || "",
    description:      t.description      || "",
    owner:            t.owner            || "",
    deadline:         t.deadline         || null,
    priority:         t.priority         || "medium",
    projectReference: t.projectReference || "",
    targetBoardId:    t.targetBoardId    || "",
    targetListId:     t.targetListId     || "",
    diffStatus:       t.diffStatus       || "create_new",
    matchedCardId:    t.matchedCardId    || null,
    confidence:       t.confidence       ?? 1.0,
    matchReason:      t.matchReason      || "",
    syncCalendar:     t.syncCalendar     || false,
    syncGoogleTasks:  t.syncGoogleTasks  || false,
    status:           "pending",
    trelloCardId:     null,
  }));
  sessions.push(session);
  write(sessions);
  return session;
}

// Allowed editable fields for a task (status, trelloCardId are managed separately)
const EDITABLE_FIELDS = [
  "title", "description", "owner", "deadline", "priority",
  "projectReference", "targetBoardId", "targetListId",
  "syncCalendar", "syncGoogleTasks",
];

function updateTask(sessionId, taskId, updates) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const task = session.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "pending") throw new Error("Cannot edit processed task");
  EDITABLE_FIELDS.forEach(k => { if (k in updates) task[k] = updates[k]; });
  write(sessions);
  return task;
}

function approveTask(sessionId, taskId) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const task = session.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (task.status === "approved") throw new Error("Task already approved");
  task.status = "approved";
  write(sessions);
  return task;
}

function rejectTask(sessionId, taskId) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const task = session.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "pending") throw new Error("Task already processed");
  task.status = "rejected";
  write(sessions);
  return task;
}

function setTaskTrelloCardId(sessionId, taskId, trelloCardId) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const task = session.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  task.trelloCardId = trelloCardId;
  write(sessions);
  return task;
}

function dismissSession(id) {
  const sessions = read();
  const idx = sessions.findIndex(s => s.id === id);
  if (idx === -1) throw new Error("Session not found");
  if (sessions[idx].tasks.some(t => t.status === "pending"))
    throw new Error("Session has unprocessed tasks");
  sessions.splice(idx, 1);
  write(sessions);
  return { ok: true };
}

module.exports = {
  getAllSessions,
  getSession,
  createSession,
  updateTask,
  approveTask,
  rejectTask,
  setTaskTrelloCardId,
  dismissSession,
};
