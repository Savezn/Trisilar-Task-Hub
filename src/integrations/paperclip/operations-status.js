const WEBHOOK_PATH = "/api/integrations/paperclip/webhook";

function asText(value) {
  return typeof value === "string" ? value : "";
}

function countType(bucket, type) {
  if (!type) return;
  bucket[type] = (bucket[type] || 0) + 1;
}

function isPaperclipSession(session) {
  const source = asText(session?.source).toLowerCase();
  const externalSystem = asText(session?.externalSource?.system).toLowerCase();
  const requestId = asText(session?.requestId).toLowerCase();
  const auditTypes = (session?.auditTrail || []).map(event => asText(event.type).toLowerCase());
  return source.startsWith("paperclip_")
    || externalSystem === "paperclip"
    || requestId.startsWith("pc_")
    || auditTypes.some(type => type.startsWith("paperclip_"));
}

function collectAuditEvents(session) {
  const sessionEvents = (session.auditTrail || []).map(event => ({
    scope: "session",
    sessionId: session.id,
    requestId: session.requestId || "",
    agentRunId: session.agent?.runId || "",
    sourceEnvironment: session.externalSource?.environment || "",
    ...event,
  }));
  const taskEvents = (session.tasks || []).flatMap(task => (task.auditTrail || []).map(event => ({
    scope: "task",
    sessionId: session.id,
    taskId: task.id,
    requestId: session.requestId || "",
    externalTaskId: task.externalTaskId || "",
    agentRunId: session.agent?.runId || task.createdByAgent?.runId || "",
    sourceEnvironment: session.externalSource?.environment || "",
    ...event,
  })));
  return [...sessionEvents, ...taskEvents];
}

function sanitizeRecentEvent(event) {
  return {
    type: event.type || "",
    scope: event.scope || "",
    at: event.at || "",
    sessionId: event.sessionId || "",
    taskId: event.taskId || "",
    requestId: event.requestId || "",
    externalTaskId: event.externalTaskId || "",
    agentRunId: event.agentRunId || "",
    sourceEnvironment: event.sourceEnvironment || "",
    sourceId: event.sourceId || "",
    status: event.status || "",
    reason: event.reason || "",
  };
}

function categorizeAuditEvent(type) {
  if (type === "paperclip_payload_received" || type === "review_session_created" || type === "task_diff_resolved") {
    return "accepted";
  }
  if (type === "paperclip_duplicate_payload_ignored") {
    return "replay";
  }
  if (type === "paperclip_duplicate_payload_rejected") {
    return "rejected";
  }
  if (type === "paperclip_test_cleanup_applied" || type === "paperclip_test_task_cleanup_rejected") {
    return "cleanup";
  }
  if (type.startsWith("trello_") || type.includes("calendar") || type.includes("google_tasks")) {
    return "sideEffects";
  }
  return "other";
}

function buildWarnings({ liveWebhook, connection, reviewQueue }) {
  const warnings = [];
  if (liveWebhook.enabled) {
    warnings.push({
      code: "standing_dev_demo_enabled",
      level: "warning",
      message: "Paperclip live webhook is enabled for dev/demo observation.",
    });
  }
  if (!connection.connected || !connection.hasSecret) {
    warnings.push({
      code: "paperclip_connection_not_ready",
      level: "warning",
      message: "Paperclip Settings is not connected with a runtime signing secret.",
    });
  }
  if (!liveWebhook.allowedSourceId || !liveWebhook.allowedEnvironment) {
    warnings.push({
      code: "paperclip_allowlist_incomplete",
      level: "danger",
      message: "Paperclip source/environment allowlist is not fully configured.",
    });
  }
  if (reviewQueue.trelloLinked > 0) {
    warnings.push({
      code: "paperclip_external_side_effect_present",
      level: "danger",
      message: "At least one Paperclip-created task has a Trello-linked side effect.",
    });
  }
  return warnings;
}

function buildPaperclipOperationsStatus({ sessions = [], connection = {}, env = process.env } = {}) {
  const paperclipSessions = sessions.filter(isPaperclipSession);
  const reviewQueue = {
    paperclipSessions: paperclipSessions.length,
    paperclipTasks: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cleanedSessions: 0,
    cleanedTasks: 0,
    trelloLinked: 0,
  };

  const audit = {
    accepted: {},
    rejected: {},
    replay: {},
    cleanup: {},
    sideEffects: {},
    other: {},
    recentEvents: [],
  };

  const allEvents = [];
  for (const session of paperclipSessions) {
    if (session.paperclipCleanup?.status === "cleaned") {
      reviewQueue.cleanedSessions += 1;
      reviewQueue.cleanedTasks += Number(session.paperclipCleanup.cleanedTaskCount || 0);
    }

    for (const task of session.tasks || []) {
      reviewQueue.paperclipTasks += 1;
      if (task.status === "pending") reviewQueue.pending += 1;
      if (task.status === "approved") reviewQueue.approved += 1;
      if (task.status === "rejected") reviewQueue.rejected += 1;
      const taskAuditTypes = (task.auditTrail || []).map(event => event.type);
      if (task.trelloCardId || taskAuditTypes.includes("trello_push_succeeded")) {
        reviewQueue.trelloLinked += 1;
      }
    }

    for (const event of collectAuditEvents(session)) {
      const type = asText(event.type);
      const bucket = categorizeAuditEvent(type);
      countType(audit[bucket], type);
      allEvents.push(event);
    }
  }

  audit.recentEvents = allEvents
    .filter(event => event.at)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
    .slice(0, 12)
    .map(sanitizeRecentEvent);

  const liveWebhook = {
    enabled: env.PAPERCLIP_WEBHOOK_ENABLED === "true",
    enabledByDefault: false,
    allowedSourceId: asText(env.PAPERCLIP_ALLOWED_SOURCE_ID),
    allowedEnvironment: asText(env.PAPERCLIP_ALLOWED_ENVIRONMENT),
    webhookPath: connection.webhookPath || WEBHOOK_PATH,
  };

  const publicConnection = {
    status: connection.status || "not_connected",
    connected: Boolean(connection.connected),
    hasSecret: Boolean(connection.hasSecret),
    secretPreview: connection.hasSecret ? "configured" : "",
    workspaceId: connection.workspaceId || "",
    label: connection.label || "",
    webhookPath: connection.webhookPath || WEBHOOK_PATH,
    webhookUrl: connection.webhookUrl || "",
    connectedAt: connection.connectedAt || null,
    disabledAt: connection.disabledAt || null,
    secretUpdatedAt: connection.secretUpdatedAt || null,
    updatedAt: connection.updatedAt || null,
  };

  return {
    generatedAt: new Date().toISOString(),
    mode: "read_only",
    liveWebhook,
    connection: publicConnection,
    reviewQueue,
    audit,
    warnings: buildWarnings({ liveWebhook, connection: publicConnection, reviewQueue }),
  };
}

module.exports = {
  buildPaperclipOperationsStatus,
  isPaperclipSession,
};
