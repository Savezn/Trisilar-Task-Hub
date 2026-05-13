const DOCS_CONTRACT_VERSION = "paperclip.docs.v0.2";
const MAX_DOCUMENT_TEXT_LENGTH = 24000;
const MAX_DOCUMENT_SUMMARY_LENGTH = 1200;
const MAX_DOCUMENT_EVIDENCE_LENGTH = 1000;

class PaperclipDocsContractError extends Error {
  constructor(errors) {
    super("Invalid Paperclip docs contract payload");
    this.name = "PaperclipDocsContractError";
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

function normalizeTextArray(value, path, errors) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Must be an array" });
    return [];
  }
  return value.filter(hasText).map(item => item.trim());
}

function normalizeEvidence(value, path, errors) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Must be an array" });
    return [];
  }

  return value.map((item, index) => {
    const itemPath = `${path}[${index}]`;
    const input = requireObject(item, itemPath, errors);
    return {
      type: optionalText(input.type, "source_excerpt"),
      text: boundedText(input.text, MAX_DOCUMENT_EVIDENCE_LENGTH),
      sourceOffset: Number.isInteger(input.sourceOffset) && input.sourceOffset >= 0 ? input.sourceOffset : null,
    };
  });
}

function normalizeLinkedTasks(value, path, errors) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Must be an array" });
    return [];
  }

  return value.map((item, index) => {
    const itemPath = `${path}[${index}]`;
    const input = requireObject(item, itemPath, errors);
    return {
      requestId: requireText(input.requestId, `${itemPath}.requestId`, errors),
      externalTaskId: requireText(input.externalTaskId, `${itemPath}.externalTaskId`, errors),
      title: requireText(input.title, `${itemPath}.title`, errors),
      relationship: optionalText(input.relationship, "supports"),
      anchorText: optionalText(input.anchorText),
    };
  });
}

function normalizeDocument(document, index, sharedAgent, errors) {
  const path = `documents[${index}]`;
  const input = requireObject(document, path, errors);
  const content = requireObject(input.content, `${path}.content`, errors);
  const agentInput = isPlainObject(input.agent) ? input.agent : sharedAgent;

  return {
    artifactId: requireText(input.artifactId, `${path}.artifactId`, errors),
    title: requireText(input.title, `${path}.title`, errors),
    artifactType: optionalText(input.artifactType, "document"),
    status: optionalText(input.status, "ready").toLowerCase(),
    summary: boundedText(input.summary, MAX_DOCUMENT_SUMMARY_LENGTH),
    generatedAt: normalizeIsoDate(input.generatedAt, `${path}.generatedAt`, errors),
    sourceUrl: optionalText(input.sourceUrl),
    tags: normalizeTextArray(input.tags, `${path}.tags`, errors),
    agent: {
      agentId: requireText(agentInput.agentId, `${path}.agent.agentId`, errors),
      agentName: requireText(agentInput.agentName, `${path}.agent.agentName`, errors),
      agentRole: optionalText(agentInput.agentRole),
      runId: requireText(agentInput.runId, `${path}.agent.runId`, errors),
      parentRunId: nullableText(agentInput.parentRunId),
    },
    content: {
      format: optionalText(content.format, "markdown").toLowerCase(),
      text: boundedText(requireText(content.text, `${path}.content.text`, errors), MAX_DOCUMENT_TEXT_LENGTH),
    },
    sourceEvidence: normalizeEvidence(input.sourceEvidence, `${path}.sourceEvidence`, errors),
    linkedTasks: normalizeLinkedTasks(input.linkedTasks, `${path}.linkedTasks`, errors),
  };
}

function normalizePaperclipDocsPayload(payload) {
  const errors = [];
  const input = requireObject(payload, "payload", errors);
  const source = requireObject(input.source, "source", errors);
  const agentInput = requireObject(input.agent, "agent", errors);

  const contractVersion = requireText(input.contractVersion, "contractVersion", errors);
  if (contractVersion && contractVersion !== DOCS_CONTRACT_VERSION) {
    errors.push({ path: "contractVersion", message: `Must be ${DOCS_CONTRACT_VERSION}` });
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
  if (normalizedSource.environment && normalizedSource.environment !== "mock") {
    errors.push({ path: "source.environment", message: "Must be mock until live connector work is approved" });
  }

  const sharedAgent = {
    agentId: requireText(agentInput.agentId, "agent.agentId", errors),
    agentName: requireText(agentInput.agentName, "agent.agentName", errors),
    agentRole: optionalText(agentInput.agentRole),
    runId: requireText(agentInput.runId, "agent.runId", errors),
    parentRunId: nullableText(agentInput.parentRunId),
  };

  if (!Array.isArray(input.documents)) {
    errors.push({ path: "documents", message: "Must be an array" });
  }

  const documents = Array.isArray(input.documents)
    ? input.documents.map((document, index) => normalizeDocument(document, index, sharedAgent, errors))
    : [];

  if (errors.length > 0) {
    throw new PaperclipDocsContractError(errors);
  }

  return {
    contractVersion: DOCS_CONTRACT_VERSION,
    mode: "mock",
    source: normalizedSource,
    agent: sharedAgent,
    documents,
  };
}

function validatePaperclipDocsPayload(payload) {
  try {
    return { ok: true, value: normalizePaperclipDocsPayload(payload), errors: [] };
  } catch (error) {
    if (error instanceof PaperclipDocsContractError) {
      return { ok: false, value: null, errors: error.errors };
    }
    throw error;
  }
}

module.exports = {
  DOCS_CONTRACT_VERSION,
  MAX_DOCUMENT_EVIDENCE_LENGTH,
  MAX_DOCUMENT_SUMMARY_LENGTH,
  MAX_DOCUMENT_TEXT_LENGTH,
  PaperclipDocsContractError,
  normalizePaperclipDocsPayload,
  validatePaperclipDocsPayload,
};
