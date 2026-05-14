const fs = require("fs");
const { getDataFilePath } = require("../../utils/runtime");

const DOCS_WORKFLOW_FILE = "paperclip-docs-workflow.json";
const MAX_DOC_EXCERPT_LENGTH = 1000;
const ALLOWED_DOC_REVIEW_STATUSES = new Set(["new", "reviewed", "needs_follow_up", "archived"]);

function getWorkflowFile() {
  return getDataFilePath(DOCS_WORKFLOW_FILE);
}

function readWorkflowState() {
  try {
    return normalizeWorkflowState(JSON.parse(fs.readFileSync(getWorkflowFile(), "utf8")));
  } catch (error) {
    if (error.code === "ENOENT") return { documents: {} };
    console.error("[paperclip-docs-workflow] corrupt data file:", error.message);
    return { documents: {} };
  }
}

function writeWorkflowState(state) {
  fs.writeFileSync(getWorkflowFile(), JSON.stringify(normalizeWorkflowState(state), null, 2));
}

function normalizeWorkflowState(state) {
  const input = state && typeof state === "object" ? state : {};
  const documents = input.documents && typeof input.documents === "object" ? input.documents : {};
  return { documents };
}

function getDocumentState(state, artifactId) {
  if (!state.documents[artifactId]) {
    state.documents[artifactId] = {
      reviewStatus: "new",
      linkedTasks: [],
      detachedLinks: [],
      auditTrail: [],
    };
  }
  const docState = state.documents[artifactId];
  if (!ALLOWED_DOC_REVIEW_STATUSES.has(docState.reviewStatus)) docState.reviewStatus = "new";
  if (!Array.isArray(docState.linkedTasks)) docState.linkedTasks = [];
  if (!Array.isArray(docState.detachedLinks)) docState.detachedLinks = [];
  if (!Array.isArray(docState.auditTrail)) docState.auditTrail = [];
  return docState;
}

function auditEvent(type, fields = {}) {
  return { type, actor: "system", at: new Date().toISOString(), ...fields };
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function cleanText(value, fallback = "") {
  return hasText(value) ? value.trim() : fallback;
}

function boundedText(value, maxLength = MAX_DOC_EXCERPT_LENGTH) {
  const text = cleanText(value);
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function linkKey(link) {
  return `${link.requestId || ""}::${link.externalTaskId || ""}`;
}

function normalizeLink(input) {
  const link = input && typeof input === "object" ? input : {};
  const requestId = cleanText(link.requestId);
  const externalTaskId = cleanText(link.externalTaskId);
  if (!requestId || !externalTaskId) {
    const error = new Error("requestId and externalTaskId are required");
    error.statusCode = 400;
    throw error;
  }
  return {
    requestId,
    externalTaskId,
    title: cleanText(link.title, externalTaskId),
    relationship: cleanText(link.relationship, "manual_reference"),
    anchorText: cleanText(link.anchorText),
    manual: true,
  };
}

function mergeDocsWorkflowState(payload) {
  const state = readWorkflowState();
  return {
    ...payload,
    documents: (payload.documents || []).map(doc => {
      const docState = getDocumentState(state, doc.artifactId);
      const detached = new Set(docState.detachedLinks);
      const localByKey = new Map(docState.linkedTasks.map(link => [linkKey(link), link]));
      const fixtureLinks = (doc.linkedTasks || []).filter(link =>
        !detached.has(linkKey(link)) && !localByKey.has(linkKey(link))
      );
      const merged = [...fixtureLinks, ...docState.linkedTasks];
      return {
        ...doc,
        reviewStatus: docState.reviewStatus,
        linkedTasks: merged,
        workflowAuditTrail: docState.auditTrail,
      };
    }),
  };
}

function attachDocumentTask(artifactId, linkInput) {
  const state = readWorkflowState();
  const docState = getDocumentState(state, artifactId);
  const link = normalizeLink(linkInput);
  const key = linkKey(link);
  docState.detachedLinks = docState.detachedLinks.filter(item => item !== key);
  const existing = docState.linkedTasks.find(item => linkKey(item) === key);
  if (existing) Object.assign(existing, link);
  else docState.linkedTasks.push(link);
  docState.auditTrail.push(auditEvent("paperclip_doc_link_attached", {
    requestId: link.requestId,
    externalTaskId: link.externalTaskId,
    relationship: link.relationship,
  }));
  writeWorkflowState(state);
  return docState;
}

function detachDocumentTask(artifactId, linkInput) {
  const state = readWorkflowState();
  const docState = getDocumentState(state, artifactId);
  const link = normalizeLink({ ...linkInput, title: linkInput?.title || "Detached link" });
  const key = linkKey(link);
  docState.linkedTasks = docState.linkedTasks.filter(item => linkKey(item) !== key);
  if (!docState.detachedLinks.includes(key)) docState.detachedLinks.push(key);
  docState.auditTrail.push(auditEvent("paperclip_doc_link_detached", {
    requestId: link.requestId,
    externalTaskId: link.externalTaskId,
  }));
  writeWorkflowState(state);
  return docState;
}

function setDocumentReviewStatus(artifactId, reviewStatus) {
  if (!ALLOWED_DOC_REVIEW_STATUSES.has(reviewStatus)) {
    const error = new Error("Invalid document review status");
    error.statusCode = 400;
    throw error;
  }
  const state = readWorkflowState();
  const docState = getDocumentState(state, artifactId);
  const previousStatus = docState.reviewStatus;
  docState.reviewStatus = reviewStatus;
  docState.auditTrail.push(auditEvent("paperclip_doc_status_changed", {
    previousStatus,
    reviewStatus,
  }));
  writeWorkflowState(state);
  return docState;
}

function buildDocsReviewSessionInput({ doc, source, body }) {
  const excerpt = boundedText(body.excerpt || doc.summary || doc.content?.text || "");
  if (!excerpt) {
    const error = new Error("excerpt is required");
    error.statusCode = 400;
    throw error;
  }
  const now = Date.now();
  const requestId = `pc_doc_req_${doc.artifactId}_${now}`;
  const externalTaskId = `pc_doc_task_${doc.artifactId}_${now}`;
  return {
    title: `Paperclip doc review - ${doc.title}`,
    source: "paperclip_docs_mock",
    requestId,
    summary: `Pending review task created from mock Paperclip document ${doc.artifactId}.`,
    transcript: excerpt,
    externalSource: {
      system: "paperclip",
      environment: source?.environment || "mock",
      workspaceId: source?.workspaceId || "",
      threadId: source?.threadId || "",
      artifactId: doc.artifactId,
      sourceUrl: doc.sourceUrl || "",
    },
    agent: doc.agent,
    auditTrail: [
      auditEvent("paperclip_doc_review_session_created", {
        artifactId: doc.artifactId,
        agentRunId: doc.agent?.runId || "",
      }),
    ],
    tasks: [
      {
        externalTaskId,
        title: cleanText(body.title, `Review ${doc.title}`),
        description: excerpt,
        owner: cleanText(body.owner),
        priority: cleanText(body.priority, "medium"),
        projectReference: doc.artifactId,
        targetBoardId: "",
        targetListId: "",
        confidence: 1,
        syncCalendar: false,
        syncGoogleTasks: false,
        sourceEvidence: [
          {
            type: "paperclip_document_excerpt",
            text: excerpt,
            sourceOffset: null,
          },
        ],
        createdByAgent: {
          agentId: doc.agent?.agentId || "",
          agentName: doc.agent?.agentName || "",
          agentRole: doc.agent?.agentRole || "",
          runId: doc.agent?.runId || "",
          parentRunId: doc.agent?.parentRunId || null,
        },
        paperclipDocument: {
          artifactId: doc.artifactId,
          title: doc.title,
          artifactType: doc.artifactType,
          sourceUrl: doc.sourceUrl || "",
          requestId,
          externalTaskId,
          agentRunId: doc.agent?.runId || "",
          parentRunId: doc.agent?.parentRunId || null,
        },
        auditTrail: [
          auditEvent("paperclip_doc_review_task_created", {
            artifactId: doc.artifactId,
            agentRunId: doc.agent?.runId || "",
            excerptLength: excerpt.length,
          }),
        ],
      },
    ],
  };
}

module.exports = {
  ALLOWED_DOC_REVIEW_STATUSES,
  MAX_DOC_EXCERPT_LENGTH,
  attachDocumentTask,
  buildDocsReviewSessionInput,
  detachDocumentTask,
  mergeDocsWorkflowState,
  setDocumentReviewStatus,
};
