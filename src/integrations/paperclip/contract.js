const CONTRACT_VERSION = "paperclip.taskhub.v0.2";
const MAX_TRANSCRIPT_LENGTH = 12000;
const MAX_EVIDENCE_TEXT_LENGTH = 1000;

class PaperclipContractError extends Error {
  constructor(errors) {
    super("Invalid Paperclip contract payload");
    this.name = "PaperclipContractError";
    this.errors = errors;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalText(value, fallback = "") {
  return hasText(value) ? value.trim() : fallback;
}

function nullableText(value) {
  return hasText(value) ? value.trim() : null;
}

function boundedText(value, maxLength) {
  if (!hasText(value)) return "";
  const text = value.trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function requireObject(value, path, errors) {
  if (!isPlainObject(value)) {
    errors.push({ path, message: "Must be an object" });
    return {};
  }
  return value;
}

function requireText(value, path, errors) {
  if (!hasText(value)) {
    errors.push({ path, message: "Required string is missing" });
    return "";
  }
  return value.trim();
}

function normalizeIsoDate(value, path, errors) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    errors.push({ path, message: "Must be an ISO 8601 string or null" });
    return null;
  }

  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed) || !/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    errors.push({ path, message: "Must be a valid ISO 8601 datetime string" });
    return null;
  }

  return new Date(parsed).toISOString();
}

function normalizeBoolean(value, path, errors) {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return value;
  errors.push({ path, message: "Must be a boolean" });
  return false;
}

function normalizeConfidence(value, path, errors) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "number" || value < 0 || value > 1) {
    errors.push({ path, message: "Must be a number between 0 and 1" });
    return null;
  }
  return Math.round(value * 100) / 100;
}

function normalizePriority(value, path, errors) {
  if (value === undefined || value === null || value === "") return "medium";
  if (typeof value !== "string") {
    errors.push({ path, message: "Must be low, medium, or high" });
    return "medium";
  }

  const normalized = value.trim().toLowerCase();
  const aliases = {
    low: "low",
    later: "low",
    medium: "medium",
    med: "medium",
    normal: "medium",
    high: "high",
    urgent: "high",
    p0: "high",
    p1: "high",
  };

  if (!aliases[normalized]) {
    errors.push({ path, message: "Must be low, medium, or high" });
    return "medium";
  }

  return aliases[normalized];
}

function normalizeSourceEvidence(sourceEvidence, taskPath, errors) {
  if (sourceEvidence === undefined || sourceEvidence === null) return [];
  if (!Array.isArray(sourceEvidence)) {
    errors.push({ path: `${taskPath}.sourceEvidence`, message: "Must be an array" });
    return [];
  }

  return sourceEvidence
    .filter(item => item !== null && item !== undefined)
    .map((item, index) => {
      const path = `${taskPath}.sourceEvidence[${index}]`;
      if (!isPlainObject(item)) {
        errors.push({ path, message: "Must be an object" });
        return { type: "unknown", text: "", sourceOffset: null };
      }

      const sourceOffset = item.sourceOffset === undefined || item.sourceOffset === null
        ? null
        : item.sourceOffset;
      if (sourceOffset !== null && (!Number.isInteger(sourceOffset) || sourceOffset < 0)) {
        errors.push({ path: `${path}.sourceOffset`, message: "Must be a non-negative integer or null" });
      }

      return {
        type: optionalText(item.type, "unknown"),
        text: boundedText(item.text, MAX_EVIDENCE_TEXT_LENGTH),
        sourceOffset: Number.isInteger(sourceOffset) && sourceOffset >= 0 ? sourceOffset : null,
      };
    });
}

function normalizeTask(task, index, agent, errors) {
  const path = `tasks[${index}]`;
  const input = requireObject(task, path, errors);
  const confidence = normalizeConfidence(input.confidence, `${path}.confidence`, errors);

  return {
    externalTaskId: nullableText(input.externalTaskId),
    title: requireText(input.title, `${path}.title`, errors),
    description: optionalText(input.description),
    owner: optionalText(input.owner),
    deadline: normalizeIsoDate(input.deadline, `${path}.deadline`, errors),
    priority: normalizePriority(input.priority, `${path}.priority`, errors),
    projectReference: optionalText(input.projectReference),
    targetBoardId: optionalText(input.targetBoardId),
    targetListId: optionalText(input.targetListId),
    confidence,
    syncCalendar: normalizeBoolean(input.syncCalendar, `${path}.syncCalendar`, errors),
    syncGoogleTasks: normalizeBoolean(input.syncGoogleTasks, `${path}.syncGoogleTasks`, errors),
    agentRationale: optionalText(input.agentRationale),
    sourceEvidence: normalizeSourceEvidence(input.sourceEvidence, path, errors),
    createdByAgent: {
      agentId: agent.agentId,
      agentName: agent.agentName,
      runId: agent.runId,
    },
  };
}

function normalizeOptions(options = {}) {
  const allowedEnvironments = Array.isArray(options.allowedEnvironments) && options.allowedEnvironments.length > 0
    ? options.allowedEnvironments.map(value => String(value).trim()).filter(Boolean)
    : ["mock"];
  return {
    allowedEnvironments,
    source: hasText(options.source) ? options.source.trim() : "paperclip_mock",
  };
}

function normalizePaperclipPayload(payload, options = {}) {
  const normalizedOptions = normalizeOptions(options);
  const errors = [];
  const input = requireObject(payload, "payload", errors);
  const source = requireObject(input.source, "source", errors);
  const agentInput = requireObject(input.agent, "agent", errors);
  const reviewSessionInput = requireObject(input.reviewSession, "reviewSession", errors);

  const contractVersion = requireText(input.contractVersion, "contractVersion", errors);
  const requestId = requireText(input.requestId, "requestId", errors);
  if (contractVersion && contractVersion !== CONTRACT_VERSION) {
    errors.push({ path: "contractVersion", message: `Must be ${CONTRACT_VERSION}` });
  }

  const normalizedSource = {
    system: requireText(source.system, "source.system", errors),
    environment: requireText(source.environment, "source.environment", errors),
    workspaceId: optionalText(source.workspaceId),
    threadId: optionalText(source.threadId),
  };
  if (normalizedSource.system && normalizedSource.system !== "paperclip") {
    errors.push({ path: "source.system", message: "Must be paperclip" });
  }
  if (
    normalizedSource.environment
    && !normalizedOptions.allowedEnvironments.includes(normalizedSource.environment)
  ) {
    errors.push({
      path: "source.environment",
      message: `Must be one of: ${normalizedOptions.allowedEnvironments.join(", ")}`,
    });
  }

  const agent = {
    agentId: requireText(agentInput.agentId, "agent.agentId", errors),
    agentName: requireText(agentInput.agentName, "agent.agentName", errors),
    agentRole: optionalText(agentInput.agentRole),
    runId: requireText(agentInput.runId, "agent.runId", errors),
    parentRunId: nullableText(agentInput.parentRunId),
  };

  const reviewSession = {
    title: requireText(reviewSessionInput.title, "reviewSession.title", errors),
    summary: optionalText(reviewSessionInput.summary),
    transcript: boundedText(reviewSessionInput.transcript, MAX_TRANSCRIPT_LENGTH),
    sourceUrl: optionalText(reviewSessionInput.sourceUrl),
    sourceCreatedAt: normalizeIsoDate(reviewSessionInput.sourceCreatedAt, "reviewSession.sourceCreatedAt", errors),
  };

  if (!Array.isArray(input.tasks) || input.tasks.length === 0) {
    errors.push({ path: "tasks", message: "At least one task is required" });
  }

  const tasks = Array.isArray(input.tasks)
    ? input.tasks.map((task, index) => normalizeTask(task, index, agent, errors))
    : [];

  if (errors.length > 0) {
    throw new PaperclipContractError(errors);
  }

  return {
    contractVersion: CONTRACT_VERSION,
    requestId,
    source: normalizedSource,
    agent,
    reviewSession,
    tasks,
  };
}

function validatePaperclipPayload(payload, options = {}) {
  try {
    return { ok: true, value: normalizePaperclipPayload(payload, options), errors: [] };
  } catch (error) {
    if (error instanceof PaperclipContractError) {
      return { ok: false, value: null, errors: error.errors };
    }
    throw error;
  }
}

function toReviewSessionInput(payload, options = {}) {
  const normalizedOptions = normalizeOptions(options);
  const normalized = normalizePaperclipPayload(payload, options);

  return {
    title: normalized.reviewSession.title,
    source: normalizedOptions.source,
    summary: normalized.reviewSession.summary,
    transcript: normalized.reviewSession.transcript,
    requestId: normalized.requestId,
    externalSource: {
      ...normalized.source,
      sourceUrl: normalized.reviewSession.sourceUrl,
      sourceCreatedAt: normalized.reviewSession.sourceCreatedAt,
    },
    agent: normalized.agent,
    auditTrail: [],
    tasks: normalized.tasks.map(task => ({
      externalTaskId: task.externalTaskId,
      title: task.title,
      description: task.description,
      owner: task.owner,
      deadline: task.deadline,
      priority: task.priority,
      projectReference: task.projectReference,
      targetBoardId: task.targetBoardId,
      targetListId: task.targetListId,
      confidence: task.confidence ?? 1.0,
      syncCalendar: task.syncCalendar,
      syncGoogleTasks: task.syncGoogleTasks,
      agentRationale: task.agentRationale,
      sourceEvidence: task.sourceEvidence,
      createdByAgent: task.createdByAgent,
      auditTrail: [],
    })),
  };
}

module.exports = {
  CONTRACT_VERSION,
  MAX_EVIDENCE_TEXT_LENGTH,
  MAX_TRANSCRIPT_LENGTH,
  PaperclipContractError,
  normalizePaperclipPayload,
  validatePaperclipPayload,
  toReviewSessionInput,
};
