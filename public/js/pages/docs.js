// V0.2-W3-02a - Paperclip Docs Viewer Foundation.
// V0.2-W3-02c - Paperclip Docs usability hardening.
// V0.2-W3-02d - Paperclip Docs-to-Review workflow.
// V0.2-W3-02e - Paperclip Docs traceability polish.
// Implemented by: Codex Dev.
async function showDocsPage() {
  S.mode = "docs";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Docs";
  $("board-subtitle").textContent = "Paperclip mock artifacts";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading Paperclip docs...</div>';

  try {
    const [payload, reviewSessions] = await Promise.all([
      api.get("/api/integrations/paperclip/mock/docs"),
      api.get("/api/reviews").catch(() => []),
    ]);
    S.docsPayload = payload;
    S.docsReviewSessions = Array.isArray(reviewSessions) ? reviewSessions : [];
    renderDocsPage(payload, S.docsReviewSessions);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">${icon("alert")}</div><h3>Failed to load Docs</h3><p>${esc(e.message)}</p></div>`;
  }
}

function renderDocsPage(payload, reviewSessions = []) {
  const documents = Array.isArray(payload.documents) ? payload.documents : [];
  const filters = normalizeDocsFilters(S.docsFilters);
  S.docsFilters = filters;
  const visibleDocuments = applyDocsFiltersAndSort(documents, filters);
  const selected = selectDocsArtifact(visibleDocuments, documents);
  const content = $("board-content");

  const page = document.createElement("div");
  page.className = "docs-page";
  page.innerHTML = `
    <section class="docs-command-panel">
      <div>
        <div class="docs-kicker">${icon("layout")} Paperclip docs</div>
        <h1 class="docs-title">Agent Documents</h1>
        <p class="docs-subtitle">Local mock artifacts normalized through the Paperclip docs contract. Live Paperclip remains blocked.</p>
      </div>
      <div class="docs-source-card">
        <span>Mode</span>
        <strong>${esc(payload.mode || "mock")}</strong>
        <small>${esc(payload.source?.workspaceId || "local fixture")}</small>
      </div>
    </section>
    <section class="docs-toolbar" aria-label="Docs controls">
      <label class="docs-search">
        ${icon("search")}
        <input id="docs-search-input" type="search" value="${esc(filters.query)}" placeholder="Search docs, tags, agents, tasks"
          oninput="updateDocsFilter('query', this.value)">
      </label>
      <select id="docs-filter-status" class="docs-select" onchange="updateDocsFilter('status', this.value)" title="Filter by status">
        ${renderDocsOption("all", "All statuses", filters.status)}
        ${getUniqueDocsValues(documents, "status").map(status => renderDocsOption(status, formatDocsLabel(status), filters.status)).join("")}
      </select>
      <select id="docs-filter-type" class="docs-select" onchange="updateDocsFilter('type', this.value)" title="Filter by type">
        ${renderDocsOption("all", "All types", filters.type)}
        ${getUniqueDocsValues(documents, "artifactType").map(type => renderDocsOption(type, formatDocsLabel(type), filters.type)).join("")}
      </select>
      <select id="docs-filter-linked" class="docs-select" onchange="updateDocsFilter('linkedState', this.value)" title="Filter by link state">
        ${renderDocsOption("all", "All links", filters.linkedState)}
        ${renderDocsOption("linked", "Linked", filters.linkedState)}
        ${renderDocsOption("unlinked", "Unlinked", filters.linkedState)}
      </select>
      <select id="docs-sort-select" class="docs-select" onchange="updateDocsFilter('sort', this.value)" title="Sort docs">
        ${renderDocsOption("generated_desc", "Newest first", filters.sort)}
        ${renderDocsOption("generated_asc", "Oldest first", filters.sort)}
        ${renderDocsOption("title_asc", "Title A-Z", filters.sort)}
        ${renderDocsOption("status_asc", "Status", filters.sort)}
        ${renderDocsOption("agent_asc", "Agent", filters.sort)}
      </select>
      <span class="docs-result-count">${visibleDocuments.length} / ${documents.length}</span>
    </section>
    <section class="docs-grid">
      <div class="docs-list" id="docs-list"></div>
      <article class="docs-viewer" id="docs-viewer"></article>
    </section>
  `;

  content.innerHTML = "";
  content.appendChild(page);

  const list = $("docs-list");
  if (!documents.length) {
    list.innerHTML = '<div class="docs-empty">No mock document artifacts available.</div>';
    $("docs-viewer").innerHTML = '<div class="docs-empty">Select a document to preview it.</div>';
    return;
  }
  if (!visibleDocuments.length) {
    list.innerHTML = '<div class="docs-empty">No documents match the current filters.</div>';
    $("docs-viewer").innerHTML = '<div class="docs-empty">Adjust search or filters to preview a document.</div>';
    return;
  }

  visibleDocuments.forEach(doc => {
    const relatedStatuses = buildDocsRelatedTaskStatus(doc, reviewSessions);
    const item = document.createElement("button");
    item.type = "button";
    item.className = `docs-list-item${doc.artifactId === selected.artifactId ? " active" : ""}`;
    item.onclick = () => {
      S.docsSelectedArtifactId = doc.artifactId;
      renderDocsPage(payload, reviewSessions);
    };
    item.innerHTML = `
      <span class="docs-item-title">${esc(doc.title)}</span>
      <span class="docs-item-meta">${esc(doc.artifactType)} - ${esc(doc.agent?.agentName || "Paperclip agent")}</span>
      ${(doc.linkedTasks || []).length ? `<span class="docs-item-linked">${(doc.linkedTasks || []).length} linked task${doc.linkedTasks.length === 1 ? "" : "s"}</span>` : ""}
      ${relatedStatuses.length ? `<span class="docs-item-status">${relatedStatuses.map(item => esc(item.status || "unknown")).join(", ")}</span>` : ""}
      <span class="docs-item-tags">${(doc.tags || []).slice(0, 3).map(tag => `<em>${esc(tag)}</em>`).join("")}</span>
    `;
    list.appendChild(item);
  });

  renderDocsViewer(selected, payload.source, reviewSessions);
}

function normalizeDocsFilters(filters = {}) {
  return {
    query: typeof filters.query === "string" ? filters.query : "",
    status: filters.status || "all",
    type: filters.type || "all",
    linkedState: filters.linkedState || "all",
    sort: filters.sort || "generated_desc",
  };
}

function updateDocsFilter(field, value) {
  S.docsFilters = normalizeDocsFilters({ ...(S.docsFilters || {}), [field]: value });
  if (field !== "sort") S.docsSelectedArtifactId = null;
  renderDocsPage(S.docsPayload || { documents: [] }, S.docsReviewSessions || []);
}

function applyDocsFiltersAndSort(documents, filters = {}) {
  const normalized = normalizeDocsFilters(filters);
  const query = normalized.query.trim().toLowerCase();
  const visible = (Array.isArray(documents) ? documents : []).filter(doc => {
    const linkedTasks = Array.isArray(doc.linkedTasks) ? doc.linkedTasks : [];
    if (normalized.status !== "all" && (doc.status || "ready") !== normalized.status) return false;
    if (normalized.type !== "all" && (doc.artifactType || "document") !== normalized.type) return false;
    if (normalized.linkedState === "linked" && linkedTasks.length === 0) return false;
    if (normalized.linkedState === "unlinked" && linkedTasks.length > 0) return false;
    if (!query) return true;
    return getDocsSearchText(doc).includes(query);
  });

  return visible.slice().sort((a, b) => compareDocsForSort(a, b, normalized.sort));
}

function getDocsSearchText(doc) {
  const tags = Array.isArray(doc.tags) ? doc.tags : [];
  const linkedTasks = Array.isArray(doc.linkedTasks) ? doc.linkedTasks : [];
  return [
    doc.artifactId,
    doc.title,
    doc.artifactType,
    doc.status,
    doc.summary,
    doc.agent?.agentId,
    doc.agent?.agentName,
    doc.agent?.agentRole,
    doc.agent?.runId,
    doc.agent?.parentRunId,
    ...tags,
    ...linkedTasks.flatMap(task => [
      task.requestId,
      task.externalTaskId,
      task.title,
      task.relationship,
      task.anchorText,
    ]),
  ].filter(Boolean).join(" ").toLowerCase();
}

function compareDocsForSort(a, b, sort) {
  if (sort === "generated_asc") return compareDocsDate(a, b, 1);
  if (sort === "title_asc") return compareDocsText(a.title, b.title);
  if (sort === "status_asc") return compareDocsText(a.status, b.status) || compareDocsText(a.title, b.title);
  if (sort === "agent_asc") return compareDocsText(a.agent?.agentName, b.agent?.agentName) || compareDocsText(a.title, b.title);
  return compareDocsDate(a, b, -1);
}

function compareDocsDate(a, b, direction) {
  const aTime = Date.parse(a.generatedAt || "") || 0;
  const bTime = Date.parse(b.generatedAt || "") || 0;
  if (aTime === bTime) return compareDocsText(a.title, b.title);
  return direction * (aTime - bTime);
}

function compareDocsText(a, b) {
  return String(a || "").localeCompare(String(b || ""), undefined, { sensitivity: "base" });
}

function buildDocsRelatedTaskStatus(doc, reviewSessions = []) {
  const linkedTasks = Array.isArray(doc?.linkedTasks) ? doc.linkedTasks : [];
  return linkedTasks.map(link => {
    const session = (Array.isArray(reviewSessions) ? reviewSessions : []).find(item => item.requestId === link.requestId);
    const task = (session?.tasks || []).find(item => item.externalTaskId === link.externalTaskId);
    return {
      ...link,
      found: Boolean(session && task),
      sessionId: session?.id || "",
      sessionTitle: session?.title || "",
      taskId: task?.id || "",
      status: task?.status || "not_found",
      owner: task?.owner || "",
      deadline: task?.deadline || null,
      priority: task?.priority || "",
    };
  });
}

function selectDocsArtifact(visibleDocuments, allDocuments = visibleDocuments) {
  if (!visibleDocuments.length) return null;
  const selected = visibleDocuments.find(doc => doc.artifactId === S.docsSelectedArtifactId);
  if (selected) return selected;
  const existing = (allDocuments || []).find(doc => doc.artifactId === S.docsSelectedArtifactId);
  return visibleDocuments.includes(existing) ? existing : visibleDocuments[0];
}

function getUniqueDocsValues(documents, field) {
  return [...new Set((documents || []).map(doc => doc[field]).filter(Boolean))].sort(compareDocsText);
}

function renderDocsOption(value, label, selected) {
  return `<option value="${esc(value)}" ${value === selected ? "selected" : ""}>${esc(label)}</option>`;
}

function formatDocsLabel(value) {
  return String(value || "").replace(/[_-]+/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function renderDocsViewer(doc, source, reviewSessions = []) {
  const viewer = $("docs-viewer");
  if (!viewer || !doc) return;
  const generated = doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp";
  const relatedStatuses = buildDocsRelatedTaskStatus(doc, reviewSessions);
  viewer.innerHTML = `
    <div class="docs-viewer-header">
      <div>
        <div class="docs-doc-meta">
          <span class="chip chip-source">${esc(doc.status || "ready")}</span>
          <span>${esc(generated)}</span>
        </div>
        <h2>${esc(doc.title)}</h2>
        <p>${esc(doc.summary || "")}</p>
      </div>
    </div>
    ${renderDocsMetadataPanel(doc, source, relatedStatuses)}
    ${renderDocsRelatedTaskStatus(relatedStatuses)}
    ${renderDocsLinkedTasks(doc, relatedStatuses)}
    ${renderDocsTracePanel(doc, relatedStatuses)}
    ${renderDocsWorkflowPanel(doc, reviewSessions)}
    <div class="docs-content">${renderDocsMarkdown(doc.content?.text || "")}</div>
    ${renderDocsEvidence(doc.sourceEvidence || [])}
  `;
}

function renderDocsMetadataPanel(doc, source, relatedStatuses = []) {
  const generated = doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp";
  const rows = [
    ["Source", `${source?.system || "paperclip"} / ${source?.environment || "mock"}`],
    ["Workspace", source?.workspaceId || "local fixture"],
    ["Thread", source?.threadId || ""],
    ["Artifact", doc.artifactId || ""],
    ["Agent", doc.agent?.agentName || ""],
    ["Run", doc.agent?.runId || ""],
    ["Parent run", doc.agent?.parentRunId || "None"],
    ["Generated", generated],
    ["Evidence", String((doc.sourceEvidence || []).length)],
    ["Linked tasks", String(relatedStatuses.length)],
  ];
  return `
    <div class="docs-metadata-panel">
      ${rows.map(([label, value]) => `
        <div>
          <span>${esc(label)}</span>
          <strong>${esc(value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDocsRelatedTaskStatus(relatedStatuses) {
  if (!relatedStatuses.length) return "";
  return `
    <div class="docs-related-status">
      <h3>Related Review Queue Status</h3>
      ${relatedStatuses.map(task => `
        <div class="docs-related-status-row${task.found ? "" : " docs-related-status-missing"}">
          <div>
            <strong>${esc(task.title || task.externalTaskId)}</strong>
            <small>${task.found ? esc(task.sessionTitle) : "Review task is not in this local store"}</small>
          </div>
          <span class="chip ${docsTaskStatusClass(task.status)}">${esc(docsReviewStatusLabel(task.status))}</span>
          <small>${esc(task.owner || "Unassigned")}</small>
          <small>${task.deadline ? esc(formatThaiDateTime(task.deadline)) : "No due date"}</small>
          ${task.found ? "" : '<small class="docs-related-missing-note">Mock link is preserved; create or attach a local Review Queue task to resolve it.</small>'}
        </div>
      `).join("")}
    </div>
  `;
}

function docsTaskStatusClass(status) {
  if (status === "approved") return "chip-done";
  if (status === "rejected") return "chip-muted";
  if (status === "pending") return "chip-review";
  return "chip-source";
}

function docsReviewStatusLabel(status) {
  const map = {
    pending: "Pending human review",
    approved: "Approved",
    rejected: "Rejected",
    not_found: "Missing locally",
  };
  return map[status] || formatDocsLabel(status);
}

function docsRelationshipLabel(relationship) {
  const map = {
    supports: "Supports task",
    audit_context: "Audit context",
    manual_reference: "Manually attached",
    created_from_doc: "Created from this doc",
  };
  return map[relationship] || formatDocsLabel(relationship || "linked");
}

function renderDocsLinkedTasks(doc, relatedStatuses) {
  if (!relatedStatuses.length) return "";
  return `
    <div class="docs-linked-tasks">
      <h3>Linked Review Queue Tasks</h3>
      ${relatedStatuses.map(task => `
        <div class="docs-linked-task-row">
          <button type="button" class="docs-linked-task" onclick='openLinkedReviewTask(${JSON.stringify(task).replace(/'/g, "&apos;")})'>
            <span>${esc(task.title || task.externalTaskId)}</span>
            <small>${esc(docsRelationshipLabel(task.relationship))} - ${esc(docsReviewStatusLabel(task.status))}</small>
            <small class="docs-linked-task-id">${esc(task.externalTaskId || task.requestId)}</small>
          </button>
          <div class="docs-linked-task-actions">
            <button type="button" class="docs-mini-action" onclick='copyDocsTraceValue("requestId", ${JSON.stringify(task.requestId || "").replace(/'/g, "&apos;")})'>Copy request</button>
            <button type="button" class="docs-mini-action" onclick='copyDocsTraceValue("externalTaskId", ${JSON.stringify(task.externalTaskId || "").replace(/'/g, "&apos;")})'>Copy task id</button>
            ${task.found ? `<button type="button" class="docs-mini-action" onclick='openDocsTraceTarget("review", ${JSON.stringify(task).replace(/'/g, "&apos;")})'>Open review</button>` : ""}
            <button type="button" class="btn btn-ghost btn-sm" onclick='detachDocsTaskLink(${JSON.stringify(doc.artifactId)}, ${JSON.stringify(task).replace(/'/g, "&apos;")})'>Detach</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDocsTracePanel(doc, relatedStatuses = []) {
  const runId = doc.agent?.runId || "";
  const parentRunId = doc.agent?.parentRunId || "";
  const primaryTask = relatedStatuses.find(task => task.found) || relatedStatuses[0] || {};
  const traceRows = [
    { label: "Artifact ID", value: doc.artifactId, action: "Open document", target: { type: "document", payload: doc.artifactId } },
    { label: "Agent run ID", value: runId, action: "Filter run", target: { type: "run", payload: runId } },
    { label: "Parent run", value: parentRunId || "None", action: parentRunId ? "Filter parent" : "", target: { type: "run", payload: parentRunId } },
    { label: "Request ID", value: primaryTask.requestId || "No linked request", action: primaryTask.found ? "Open review" : "", target: { type: "review", payload: primaryTask } },
    { label: "External task ID", value: primaryTask.externalTaskId || "No linked task", action: primaryTask.found ? "Open review" : "", target: { type: "review", payload: primaryTask } },
  ];
  const events = buildDocsTraceEvents(doc, relatedStatuses);
  return `
    <div class="docs-trace-panel">
      <div class="docs-trace-head">
        <h3>Trace & Audit</h3>
        <span>${events.length} event${events.length === 1 ? "" : "s"}</span>
      </div>
      <div class="docs-trace-grid">
        ${traceRows.map(row => renderDocsTraceRow(row)).join("")}
      </div>
      <div class="docs-trace-timeline">
        ${events.map(event => `
          <div class="docs-trace-event">
            <span>${esc(event.label)}</span>
            <strong>${esc(event.detail)}</strong>
            <small>${esc(event.time)}</small>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderDocsTraceRow(row) {
  const value = row.value || "";
  const target = row.target || {};
  return `
    <div class="docs-trace-row">
      <span>${esc(row.label)}</span>
      <strong>${esc(value)}</strong>
      <div>
        <button type="button" class="docs-mini-action" onclick='copyDocsTraceValue(${JSON.stringify(row.label)}, ${JSON.stringify(value).replace(/'/g, "&apos;")})'>Copy</button>
        ${row.action ? `<button type="button" class="docs-mini-action" onclick='openDocsTraceTarget(${JSON.stringify(target.type)}, ${JSON.stringify(target.payload).replace(/'/g, "&apos;")})'>${esc(row.action)}</button>` : ""}
      </div>
    </div>
  `;
}

function buildDocsTraceEvents(doc, relatedStatuses = []) {
  const events = [
    {
      label: "Document normalized",
      detail: `${doc.artifactType || "document"} from ${doc.agent?.agentName || "Paperclip agent"}`,
      time: doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp",
    },
    {
      label: "Document review status",
      detail: docsReviewStatusLabel(doc.reviewStatus || "new"),
      time: "Local state",
    },
  ];
  relatedStatuses.forEach(task => {
    events.push({
      label: task.relationship === "created_from_doc" ? "Created Review Queue task" : "Linked Review Queue task",
      detail: `${task.title || task.externalTaskId} - ${docsRelationshipLabel(task.relationship)} - ${docsReviewStatusLabel(task.status)}`,
      time: task.found ? (task.deadline ? `Due ${formatThaiDateTime(task.deadline)}` : "Available locally") : "Missing locally",
    });
  });
  (doc.workflowAuditTrail || []).slice(-4).forEach(event => {
    events.push({
      label: docsTraceEventLabel(event.type),
      detail: [event.relationship, event.reviewStatus, event.externalTaskId].filter(Boolean).join(" - ") || "Local audit event",
      time: event.at ? formatThaiDateTime(event.at) : "Local state",
    });
  });
  return events.slice(-6);
}

function docsTraceEventLabel(type) {
  const map = {
    paperclip_doc_link_attached: "Attached document link",
    paperclip_doc_link_detached: "Detached document link",
    paperclip_doc_status_changed: "Updated document status",
    paperclip_doc_review_session_created: "Created Review Queue session",
    paperclip_doc_review_task_created: "Created Review Queue task",
  };
  return map[type] || formatDocsLabel(type || "Trace event");
}

function renderDocsWorkflowPanel(doc, reviewSessions = []) {
  const excerpt = doc.summary || (doc.content?.text || "").slice(0, 420);
  const statusOptions = ["new", "reviewed", "needs_follow_up", "archived"]
    .map(status => renderDocsOption(status, formatDocsLabel(status), doc.reviewStatus || "new"))
    .join("");
  const taskOptions = getDocsReviewTaskOptions(reviewSessions)
    .map(option => `<option value="${esc(encodeURIComponent(JSON.stringify(option)))}">${esc(option.label)}</option>`)
    .join("");
  return `
    <div class="docs-workflow-panel">
      <div class="docs-workflow-head">
        <h3>Docs-to-Review Workflow</h3>
        <label>
          <span>Status</span>
          <select class="docs-select" onchange="updateDocsReviewStatus('${esc(doc.artifactId)}', this.value)">
            ${statusOptions}
          </select>
        </label>
      </div>
      <div class="docs-workflow-grid">
        <div class="docs-workflow-box">
          <label class="docs-workflow-label" for="docs-review-title-${esc(doc.artifactId)}">Create pending Review Queue task</label>
          <input id="docs-review-title-${esc(doc.artifactId)}" class="docs-workflow-input" type="text" value="${esc(`Review ${doc.title}`)}">
          <textarea id="docs-review-excerpt-${esc(doc.artifactId)}" class="docs-workflow-textarea">${esc(excerpt)}</textarea>
          <button type="button" class="btn btn-primary btn-sm" onclick="createDocsReviewTask('${esc(doc.artifactId)}')">${icon("plus")} Create pending task</button>
        </div>
        <div class="docs-workflow-box">
          <label class="docs-workflow-label" for="docs-attach-select-${esc(doc.artifactId)}">Attach existing Review Queue task</label>
          <select id="docs-attach-select-${esc(doc.artifactId)}" class="docs-workflow-select">
            <option value="">Select local Review Queue task</option>
            ${taskOptions}
          </select>
          <input id="docs-attach-anchor-${esc(doc.artifactId)}" class="docs-workflow-input" type="text" value="${esc(doc.title)}" placeholder="Anchor text">
          <button type="button" class="btn btn-ghost btn-sm" onclick="attachDocsTaskLink('${esc(doc.artifactId)}')">${icon("gitMerge")} Attach task</button>
        </div>
      </div>
    </div>
  `;
}

function getDocsReviewTaskOptions(reviewSessions = []) {
  return (Array.isArray(reviewSessions) ? reviewSessions : []).flatMap(session =>
    (session.tasks || []).map(task => ({
      requestId: session.requestId || "",
      externalTaskId: task.externalTaskId || "",
      title: task.title || task.externalTaskId || "Review task",
      relationship: "manual_reference",
      sessionTitle: session.title || "",
      label: `${session.title || "Review session"} / ${task.title || task.externalTaskId || "Task"}`,
    })).filter(option => option.requestId && option.externalTaskId)
  );
}

async function refreshDocsPage() {
  const [payload, reviewSessions] = await Promise.all([
    api.get("/api/integrations/paperclip/mock/docs"),
    api.get("/api/reviews").catch(() => []),
  ]);
  S.docsPayload = payload;
  S.docsReviewSessions = Array.isArray(reviewSessions) ? reviewSessions : [];
  renderDocsPage(payload, S.docsReviewSessions);
}

async function createDocsReviewTask(artifactId) {
  const title = $(`docs-review-title-${artifactId}`)?.value || "";
  const excerpt = $(`docs-review-excerpt-${artifactId}`)?.value || "";
  try {
    const session = await api.post("/api/integrations/paperclip/mock/docs/review-task", {
      artifactId,
      title,
      excerpt,
    });
    const task = (session.tasks || [])[0];
    if (task) {
      S.pendingReviewTaskLink = {
        requestId: session.requestId || "",
        externalTaskId: task.externalTaskId || "",
      };
    }
    toast("Pending Review Queue task created");
    await refreshDocsPage();
  } catch (error) {
    toast("Failed to create Review Queue task: " + error.message, true);
  }
}

async function attachDocsTaskLink(artifactId) {
  const selected = $(`docs-attach-select-${artifactId}`)?.value || "";
  if (!selected) {
    toast("Select a Review Queue task to attach", true);
    return;
  }
  try {
    const link = JSON.parse(decodeURIComponent(selected));
    link.anchorText = $(`docs-attach-anchor-${artifactId}`)?.value || link.title || "";
    await api.post(`/api/integrations/paperclip/mock/docs/${artifactId}/attachments`, link);
    toast("Document link attached");
    await refreshDocsPage();
  } catch (error) {
    toast("Failed to attach document link: " + error.message, true);
  }
}

async function detachDocsTaskLink(artifactId, link) {
  if (!artifactId || !link?.requestId || !link?.externalTaskId) return;
  const ok = window.confirm(`Confirm detach "${link.title || link.externalTaskId}" from this Paperclip document?`);
  if (!ok) return;
  try {
    await api.req("DELETE", `/api/integrations/paperclip/mock/docs/${artifactId}/attachments`, {
      requestId: link.requestId,
      externalTaskId: link.externalTaskId,
    });
    toast("Document link detached");
    await refreshDocsPage();
  } catch (error) {
    toast("Failed to detach document link: " + error.message, true);
  }
}

async function updateDocsReviewStatus(artifactId, reviewStatus) {
  try {
    await api.post(`/api/integrations/paperclip/mock/docs/${artifactId}/status`, { reviewStatus });
    toast("Document status updated");
    await refreshDocsPage();
  } catch (error) {
    toast("Failed to update document status: " + error.message, true);
  }
}

function openLinkedReviewTask(link) {
  S.pendingReviewTaskLink = {
    requestId: link?.requestId || "",
    externalTaskId: link?.externalTaskId || "",
  };
  navigateTo("review");
}

async function copyDocsTraceValue(label, value) {
  const text = String(value || "");
  if (!text || text === "None" || text.startsWith("No linked")) {
    toast(`No ${label} to copy`, true);
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    toast(`${label} copied`);
  } catch (error) {
    toast(`Failed to copy ${label}: ${error.message}`, true);
  }
}

function openDocsTraceTarget(type, payload) {
  if (type === "review") {
    openLinkedReviewTask(payload || {});
    return;
  }
  if (type === "run") {
    const runId = String(payload || "");
    if (!runId) return;
    updateDocsFilter("query", runId);
    toast("Filtered Docs by agent run");
    return;
  }
  if (type === "document") {
    S.docsSelectedArtifactId = String(payload || "");
    renderDocsPage(S.docsPayload || { documents: [] }, S.docsReviewSessions || []);
    toast("Document selected");
  }
}

function renderDocsMarkdown(text) {
  if (!text) return '<div class="docs-empty">Document content is empty.</div>';
  return text.split(/\n{2,}/).map(block => {
    const trimmed = block.trim();
    if (trimmed.startsWith("# ")) return `<h3>${esc(trimmed.slice(2))}</h3>`;
    if (trimmed.startsWith("## ")) return `<h4>${esc(trimmed.slice(3))}</h4>`;
    if (/^[-*] /.test(trimmed)) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^[-*] /, "").trim()).filter(Boolean);
      return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
    }
    if (/^\d+\. /.test(trimmed)) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^\d+\. /, "").trim()).filter(Boolean);
      return `<ol>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ol>`;
    }
    return `<p>${esc(trimmed)}</p>`;
  }).join("");
}

function renderDocsEvidence(evidence) {
  if (!evidence.length) return "";
  return `
    <div class="docs-evidence">
      <h3>Evidence</h3>
      ${evidence.map(item => `
        <div class="docs-evidence-row">
          <span>${esc(item.type || "source")}</span>
          <p>${esc(item.text || "")}</p>
        </div>
      `).join("")}
    </div>
  `;
}
