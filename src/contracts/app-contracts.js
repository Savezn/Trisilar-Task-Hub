const REVIEW_TASK_STATUSES = new Set(["pending", "approved", "rejected"]);
const PAPERCLIP_CONNECTION_STATUSES = new Set(["not_connected", "connected", "disabled"]);
const PAPERCLIP_LIVE_MODES = new Set(["disabled", "staged", "permanent"]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function ok(errors) {
  return { ok: errors.length === 0, errors };
}

function add(errors, path, message) {
  errors.push({ path, message });
}

function has(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function requireString(errors, value, path) {
  if (typeof value !== "string") add(errors, path, "must be a string");
}

function requireBoolean(errors, value, path) {
  if (typeof value !== "boolean") add(errors, path, "must be a boolean");
}

function requireNumber(errors, value, path) {
  if (typeof value !== "number" || Number.isNaN(value)) add(errors, path, "must be a number");
}

function requireObject(errors, value, path) {
  if (!isPlainObject(value)) add(errors, path, "must be an object");
}

function requireArray(errors, value, path) {
  if (!Array.isArray(value)) add(errors, path, "must be an array");
}

function requireNullableString(errors, value, path) {
  if (value !== null && typeof value !== "string") add(errors, path, "must be a string or null");
}

function requireStatus(errors, value, path, allowed) {
  if (typeof value !== "string" || !allowed.has(value)) {
    add(errors, path, `must be one of: ${Array.from(allowed).join(", ")}`);
  }
}

function rejectRawSecretFields(value, errors, path = "") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => rejectRawSecretFields(item, errors, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;

  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    if (key === "secret" || key === "sharedSecret") {
      add(errors, childPath, "must not be present in public app-owned contracts");
    }
    rejectRawSecretFields(child, errors, childPath);
  }
}

function validateReviewSessionContract(session) {
  const errors = [];
  if (!isPlainObject(session)) {
    add(errors, "", "must be an object");
    return ok(errors);
  }

  requireString(errors, session.id, "id");
  requireString(errors, session.title, "title");
  requireString(errors, session.source, "source");
  requireString(errors, session.createdAt, "createdAt");
  requireArray(errors, session.tasks, "tasks");

  if (Array.isArray(session.tasks)) {
    session.tasks.forEach((task, index) => {
      const prefix = `tasks[${index}]`;
      if (!isPlainObject(task)) {
        add(errors, prefix, "must be an object");
        return;
      }
      requireString(errors, task.id, `${prefix}.id`);
      requireString(errors, task.title, `${prefix}.title`);
      requireStatus(errors, task.status, `${prefix}.status`, REVIEW_TASK_STATUSES);
    });
  }

  return ok(errors);
}

function validateConfigContract(config) {
  const errors = [];
  if (!isPlainObject(config)) {
    add(errors, "", "must be an object");
    return ok(errors);
  }

  requireArray(errors, config.groups, "groups");
  requireArray(errors, config.hiddenBoards, "hiddenBoards");
  requireArray(errors, config.allowedWorkspaceIds, "allowedWorkspaceIds");
  return ok(errors);
}

function validatePaperclipPublicConnectionContract(connection) {
  const errors = [];
  if (!isPlainObject(connection)) {
    add(errors, "", "must be an object");
    return ok(errors);
  }

  rejectRawSecretFields(connection, errors);
  requireStatus(errors, connection.status, "status", PAPERCLIP_CONNECTION_STATUSES);
  requireBoolean(errors, connection.connected, "connected");
  requireBoolean(errors, connection.hasSecret, "hasSecret");
  requireString(errors, connection.secretPreview, "secretPreview");
  requireString(errors, connection.workspaceId, "workspaceId");
  requireString(errors, connection.label, "label");
  requireString(errors, connection.webhookPath, "webhookPath");
  requireString(errors, connection.webhookUrl, "webhookUrl");
  requireNullableString(errors, connection.connectedAt, "connectedAt");
  requireNullableString(errors, connection.disabledAt, "disabledAt");
  requireNullableString(errors, connection.secretUpdatedAt, "secretUpdatedAt");
  requireNullableString(errors, connection.updatedAt, "updatedAt");
  return ok(errors);
}

function validatePaperclipOperationsStatusContract(status) {
  const errors = [];
  if (!isPlainObject(status)) {
    add(errors, "", "must be an object");
    return ok(errors);
  }

  rejectRawSecretFields(status, errors);
  requireString(errors, status.generatedAt, "generatedAt");
  if (status.mode !== "read_only") add(errors, "mode", "must be read_only");

  validateRuntime(status.runtime, errors);
  validateLiveWebhook(status.liveWebhook, errors);

  if (!isPlainObject(status.connection)) add(errors, "connection", "must be an object");
  else {
    const connectionErrors = validatePaperclipPublicConnectionContract(status.connection).errors;
    connectionErrors.forEach(error => add(errors, `connection.${error.path}`.replace(/\.$/, ""), error.message));
  }

  validateReviewQueueSummary(status.reviewQueue, errors);
  validateAuditSummary(status.audit, errors);
  requireArray(errors, status.warnings, "warnings");
  return ok(errors);
}

function validateRuntime(runtime, errors) {
  if (!isPlainObject(runtime)) {
    add(errors, "runtime", "must be an object");
    return;
  }
  requireString(errors, runtime.profile, "runtime.profile");
  requireBoolean(errors, runtime.isProduction, "runtime.isProduction");
  requireStatus(errors, runtime.liveMode, "runtime.liveMode", PAPERCLIP_LIVE_MODES);
  requireBoolean(errors, runtime.liveModeConfigured, "runtime.liveModeConfigured");
  requireBoolean(errors, runtime.liveModeValid, "runtime.liveModeValid");
  requireString(errors, runtime.appBaseUrl, "runtime.appBaseUrl");
  requireString(errors, runtime.productionHostname, "runtime.productionHostname");
  requireString(errors, runtime.expectedProductionSourceId, "runtime.expectedProductionSourceId");
  requireBoolean(errors, runtime.dataDirConfigured, "runtime.dataDirConfigured");
}

function validateLiveWebhook(liveWebhook, errors) {
  if (!isPlainObject(liveWebhook)) {
    add(errors, "liveWebhook", "must be an object");
    return;
  }
  requireBoolean(errors, liveWebhook.enabled, "liveWebhook.enabled");
  requireBoolean(errors, liveWebhook.enabledByDefault, "liveWebhook.enabledByDefault");
  requireString(errors, liveWebhook.allowedSourceId, "liveWebhook.allowedSourceId");
  requireString(errors, liveWebhook.allowedEnvironment, "liveWebhook.allowedEnvironment");
  requireString(errors, liveWebhook.webhookPath, "liveWebhook.webhookPath");
}

function validateReviewQueueSummary(reviewQueue, errors) {
  if (!isPlainObject(reviewQueue)) {
    add(errors, "reviewQueue", "must be an object");
    return;
  }
  [
    "paperclipSessions",
    "paperclipTasks",
    "pending",
    "approved",
    "rejected",
    "cleanedSessions",
    "cleanedTasks",
    "trelloLinked",
  ].forEach(key => requireNumber(errors, reviewQueue[key], `reviewQueue.${key}`));
}

function validateAuditSummary(audit, errors) {
  if (!isPlainObject(audit)) {
    add(errors, "audit", "must be an object");
    return;
  }
  ["accepted", "rejected", "replay", "cleanup", "sideEffects", "other"].forEach(key => {
    requireObject(errors, audit[key], `audit.${key}`);
  });
  requireArray(errors, audit.recentEvents, "audit.recentEvents");
}

function validateNormalizedTrelloCardContract(card) {
  const errors = [];
  if (!isPlainObject(card)) {
    add(errors, "", "must be an object");
    return ok(errors);
  }

  requireString(errors, card.id, "id");
  requireString(errors, card.name, "name");
  requireString(errors, card.desc, "desc");
  if (!has(card, "due") || (card.due !== null && typeof card.due !== "string")) {
    add(errors, "due", "must be a string or null");
  }
  requireBoolean(errors, card.dueComplete, "dueComplete");
  if (!has(card, "start") || (card.start !== null && typeof card.start !== "string")) {
    add(errors, "start", "must be a string or null");
  }
  requireNumber(errors, card.dueReminder, "dueReminder");
  requireString(errors, card.url, "url");
  requireString(errors, card.idList, "idList");
  validateLabels(card.labels, errors);
  validateMembers(card.members, errors);
  validateChecklistProgress(card.checklistProgress, errors);
  requireObject(errors, card.customFields, "customFields");
  return ok(errors);
}

function validateLabels(labels, errors) {
  if (!Array.isArray(labels)) {
    add(errors, "labels", "must be an array");
    return;
  }
  labels.forEach((label, index) => {
    const prefix = `labels[${index}]`;
    if (!isPlainObject(label)) {
      add(errors, prefix, "must be an object");
      return;
    }
    requireString(errors, label.id, `${prefix}.id`);
    requireString(errors, label.name, `${prefix}.name`);
    requireString(errors, label.color, `${prefix}.color`);
  });
}

function validateMembers(members, errors) {
  if (!Array.isArray(members)) {
    add(errors, "members", "must be an array");
    return;
  }
  members.forEach((member, index) => {
    const prefix = `members[${index}]`;
    if (!isPlainObject(member)) {
      add(errors, prefix, "must be an object");
      return;
    }
    requireString(errors, member.id, `${prefix}.id`);
    requireString(errors, member.username, `${prefix}.username`);
    requireString(errors, member.fullName, `${prefix}.fullName`);
  });
}

function validateChecklistProgress(progress, errors) {
  if (!isPlainObject(progress)) {
    add(errors, "checklistProgress", "must be an object");
    return;
  }
  requireNumber(errors, progress.done, "checklistProgress.done");
  requireNumber(errors, progress.total, "checklistProgress.total");
}

module.exports = {
  validateConfigContract,
  validateNormalizedTrelloCardContract,
  validatePaperclipOperationsStatusContract,
  validatePaperclipPublicConnectionContract,
  validateReviewSessionContract,
};
