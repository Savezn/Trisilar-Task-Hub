const fs   = require("fs");
const { randomUUID } = require("crypto");
const { getDataFilePath } = require("./src/utils/runtime");

function getStoreFile() {
  return process.env.REVIEW_STORE_FILE || getDataFilePath("review-sessions.json");
}

// All file operations are synchronous, so Node's single-threaded event loop
// guarantees read-modify-write cycles are never interleaved. No external lock needed.

function read() {
  try { return JSON.parse(fs.readFileSync(getStoreFile(), "utf8")); }
  catch (e) {
    if (e.code === "ENOENT") return [];
    console.error("[review-store] corrupt data file:", e.message);
    return [];
  }
}

function write(sessions) {
  fs.writeFileSync(getStoreFile(), JSON.stringify(sessions, null, 2));
}

function auditEvent(type, fields = {}) {
  return { type, actor: "system", at: new Date().toISOString(), ...fields };
}

function appendEvent(target, event) {
  if (!event) return;
  if (!Array.isArray(target.auditTrail)) target.auditTrail = [];
  target.auditTrail.push(event);
}

// ── Public API ────────────────────────────────────────────────────────────────

function getAllSessions() {
  return read();
}

function getSession(id) {
  return read().find(s => s.id === id) || null;
}

function getSessionByRequestId(requestId) {
  if (!requestId) return null;
  return read().find(s => s.requestId === requestId) || null;
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
  if ("requestId" in data) session.requestId = data.requestId;
  if ("payloadHash" in data) session.payloadHash = data.payloadHash;
  if ("externalSource" in data) session.externalSource = data.externalSource;
  if ("agent" in data) session.agent = data.agent;
  if ("auditTrail" in data) session.auditTrail = Array.isArray(data.auditTrail) ? data.auditTrail : [];

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
    ...("externalTaskId" in t ? { externalTaskId: t.externalTaskId } : {}),
    ...("agentRationale" in t ? { agentRationale: t.agentRationale } : {}),
    ...("sourceEvidence" in t ? { sourceEvidence: t.sourceEvidence } : {}),
    ...("createdByAgent" in t ? { createdByAgent: t.createdByAgent } : {}),
    ...("paperclipDocument" in t ? { paperclipDocument: t.paperclipDocument } : {}),
    ...("auditTrail" in t ? { auditTrail: Array.isArray(t.auditTrail) ? t.auditTrail : [] } : {}),
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
  const changedFields = [];
  EDITABLE_FIELDS.forEach(k => {
    if (k in updates) {
      task[k] = updates[k];
      changedFields.push(k);
    }
  });
  if (changedFields.length > 0) {
    appendEvent(task, auditEvent("task_field_updated", { fields: changedFields }));
  }
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
  appendEvent(task, auditEvent("task_approved"));
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
  appendEvent(task, auditEvent("task_rejected"));
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
  appendEvent(task, auditEvent("trello_push_succeeded", { trelloCardId }));
  write(sessions);
  return task;
}

function appendSessionAuditEvent(sessionId, event) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  appendEvent(session, event);
  write(sessions);
  return session;
}

function appendTaskAuditEvent(sessionId, taskId, event) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const task = session.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  appendEvent(task, event);
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
  getSessionByRequestId,
  createSession,
  updateTask,
  approveTask,
  rejectTask,
  setTaskTrelloCardId,
  appendSessionAuditEvent,
  appendTaskAuditEvent,
  dismissSession,
};
