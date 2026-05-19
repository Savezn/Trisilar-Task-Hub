// V0.2-W3-02a - Paperclip Docs Viewer Foundation.
// V0.2-W3-02c - Paperclip Docs usability hardening.
// V0.2-W3-02d - Paperclip Docs-to-Review workflow.
// V0.2-W3-02e - Paperclip Docs traceability polish.
// Implemented by: Codex Dev.
async function showDocsPage() {
  S.mode = "docs";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Docs / AI Trace";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");
  renderDocsTopbarActions();

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
    content.innerHTML = `
      <div class="empty-state docs-trace-unavailable">
        <div class="empty-icon">${icon("alert")}</div>
        <h3>Docs trace is unavailable</h3>
        <p>Task Hub could not load the local Docs / AI Trace surface. Check the Paperclip docs connector or try again; no external action ran.</p>
      </div>`;
  }
}

function renderDocsPageLegacy(payload, reviewSessions = []) {
  const documents = Array.isArray(payload.documents) ? payload.documents : [];
  const filters = normalizeDocsFilters(S.docsFilters);
  S.docsFilters = filters;
  const visibleDocuments = applyDocsFiltersAndSort(documents, filters);
  const selected = selectDocsArtifact(visibleDocuments, documents);
  const content = $("board-content");
  const summary = buildDocsTraceSummary(documents, reviewSessions);

  const page = document.createElement("div");
  page.className = "docs-page";
  page.innerHTML = `
    ${uiRouteBar({
      title: "Paperclip & agent run history",
      sub: `<span>Agent Documents</span><span>auth webhook · enforced</span><span>${documents.length} docs</span><span>${summary.linked} approved tasks</span><span>${summary.missing} orphan</span>`,
    })}
    <section class="docs-toolbar filterbar" aria-label="Docs controls">
      <label class="docs-search">
        ${icon("search")}
        <input id="docs-search-input" type="search" value="${esc(filters.query)}" placeholder="Search docs, tags, agents, tasks" aria-label="Search Docs and AI Trace runs"
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
    <section class="docs-grid panel">
      <div class="docs-list" id="docs-list"></div>
      <article class="docs-viewer" id="docs-viewer"></article>
    </section>
  `;

  content.innerHTML = "";
  content.appendChild(page);

  const list = $("docs-list");
  if (!documents.length) {
    list.innerHTML = '<div class="docs-empty">No agent documents yet.</div>';
    $("docs-viewer").innerHTML = '<div class="docs-empty">AI/Paperclip evidence and linked Review Queue trace will appear here after document artifacts are available.</div>';
    return;
  }
  if (!visibleDocuments.length) {
    list.innerHTML = '<div class="docs-empty">No documents match the current filters.</div>';
    $("docs-viewer").innerHTML = '<div class="docs-empty">Clear search or filters to restore the trace list.</div>';
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
      ${renderDocsListTraceChips(doc, relatedStatuses)}
      ${renderDocsListLinkedState(doc, relatedStatuses)}
      ${renderDocsTagChips(doc.tags || [])}
    `;
    list.appendChild(item);
  });

  renderDocsViewer(selected, payload.source, reviewSessions);
}

// UI V2 source-led trace layout. Kept after the legacy renderer so the active
// binding follows the prototype table-first composition while preserving the
// existing lower detail/workflow behavior.
function renderDocsPage(payload, reviewSessions = []) {
  const documents = Array.isArray(payload.documents) ? payload.documents : [];
  const filters = normalizeDocsFilters(S.docsFilters);
  S.docsFilters = filters;
  const visibleDocuments = applyDocsFiltersAndSort(documents, filters);
  const selected = selectDocsArtifact(visibleDocuments, documents);
  const content = $("board-content");
  const statusCounts = buildDocsRunStatusCounts(visibleDocuments, reviewSessions);
  const summary = buildDocsTraceSummary(documents, reviewSessions);
  const source = payload.source || {};

  const page = document.createElement("div");
  page.className = "docs-page";
  page.innerHTML = `
    ${uiRouteBar({
      title: "Paperclip & agent run history",
      sub: `<span>Agent Documents</span><span>&middot;</span>${uiKV("auth", "webhook · enforced")}${uiKV("retention", "90 days · runs · 365 days · approved tasks")}<span>&middot;</span><span>${documents.length} runs visible · ${summary.linked} approved · ${summary.missing} orphan</span>`,
    })}
    <section class="docs-toolbar filterbar" aria-label="Docs controls">
      <label class="docs-search search-sm">
        ${icon("search")}
        <input id="docs-search-input" type="search" value="${esc(filters.query)}" placeholder="Search run id, agent, title..." aria-label="Search Docs and AI Trace runs"
          oninput="updateDocsFilter('query', this.value)">
      </label>
      <button class="filter-chip${filters.status === "all" ? " on" : ""}" type="button" onclick="updateDocsFilter('status','all')"><span class="k">status:</span> any</button>
      <button class="filter-chip${filters.status === "approved" ? " on" : ""}" type="button" onclick="updateDocsFilter('status','approved')"><span class="k">status:</span> approved</button>
      <button class="filter-chip${filters.linkedState === "unlinked" ? " on" : ""}" type="button" onclick="updateDocsFilter('linkedState','unlinked')"><span class="k">link:</span> orphan</button>
      <span class="filter-chip"><span class="k">agent:</span> any</span>
      <span class="filter-chip"><span class="k">env:</span> ${esc(source.environment || "production")}</span>
      <button class="btn sm" type="button" onclick="updateDocsFilter('sort', '${filters.sort === "generated_desc" ? "generated_asc" : "generated_desc"}')">${filters.sort === "generated_desc" ? "Newest first" : "Oldest first"} ${icon("down")}</button>
    </section>
    <section class="panel docs-trace-table" aria-label="Paperclip trace table" style="--docs-trace-rows:${visibleDocuments.length}">
      <div class="trace-row trace-head">
        <span class="eyebrow">Run id</span>
        <span class="eyebrow">Title · session</span>
        <span class="eyebrow">Agent · env</span>
        <span class="eyebrow">Received</span>
        <span class="eyebrow">Status</span>
      </div>
      <div class="docs-trace-list" id="docs-list"></div>
    </section>
    <div class="docs-evidence-shell" id="docs-evidence-shell"></div>
    <div class="docs-reader-host hidden" id="docs-reader-host" aria-hidden="true" inert></div>
    <details class="docs-detail-disclosure" id="docs-detail-disclosure">
      <summary>
        <span>Full document detail</span>
        <span class="mono">source copy · linked workflow</span>
      </summary>
      <article class="docs-viewer docs-secondary-viewer" id="docs-viewer"></article>
    </details>
  `;

  content.innerHTML = "";
  content.appendChild(page);
  const routeSub = page.querySelector(".rb-sub");
  if (routeSub) {
    routeSub.innerHTML = `${uiKV("auth", "webhook \u00b7 enforced")}${uiKV("retention", "90 days \u00b7 runs \u00b7 365 days \u00b7 approved tasks")}<span>&middot;</span><span>${visibleDocuments.length} runs visible &middot; ${statusCounts.approved} approved &middot; ${statusCounts.review} in review &middot; ${statusCounts.orphan} orphan</span>`;
  }
  const filterbar = page.querySelector(".docs-toolbar");
  if (filterbar) {
    filterbar.id = "docs-filterbar";
    filterbar.innerHTML = `
      <label class="docs-search search-sm">
        ${icon("search")}
        <input id="docs-search-input" type="search" value="${esc(filters.query)}" placeholder="Search run id, agent, title..." aria-label="Search Docs and AI Trace runs"
          oninput="updateDocsFilter('query', this.value)">
      </label>
      <span class="filter-chip on is-readonly docs-status-chip" role="note" data-docs-prototype-filter="env-production" title="Environment is fixed by the current safe trace source."><span class="k">env:</span> production</span>
      <span class="filter-chip is-readonly docs-status-chip" role="note" data-docs-prototype-filter="env-staged" title="Staged traces are not mixed into this route state."><span class="k">env:</span> staged</span>
      <button class="filter-chip${filters.status === "all" ? " on" : ""}" type="button" data-docs-prototype-filter="status-any" onclick="updateDocsFilter('status','all')"><span class="k">status:</span> any</button>
      <span class="filter-chip is-readonly docs-status-chip" role="note" title="Agent filtering needs normalized agent ids from the trace source."><span class="k">agent:</span> any</span>
      <span class="filter-chip is-readonly docs-status-chip" role="note" title="Trace window is read-only in this frontend-only slice."><span class="k">window:</span> 14d</span>
    `;
  }
  renderDocsTopbarActions();
  page.querySelector(".docs-detail-disclosure")?.remove();

  const list = $("docs-list");
  if (!documents.length) {
    list.innerHTML = '<div class="docs-empty">No agent runs yet.</div>';
    $("docs-evidence-shell").innerHTML = '<div class="docs-empty docs-empty-panel">AI/Paperclip evidence and linked Review Queue trace will appear here after document artifacts are available.</div>';
    return;
  }
  if (!visibleDocuments.length) {
    list.innerHTML = '<div class="docs-empty">No documents match the current filters.</div>';
    $("docs-evidence-shell").innerHTML = '<div class="docs-empty docs-empty-panel">Clear search to restore the trace list.</div>';
    return;
  }

  visibleDocuments.forEach(doc => {
    list.insertAdjacentHTML("beforeend", renderDocsTraceTableRow(doc, source, reviewSessions, doc.artifactId === selected.artifactId));
  });
  list.querySelectorAll("[data-doc-copy-run]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      copyDocsTraceValue("run id", button.getAttribute("data-doc-copy-run"));
    });
  });
  list.querySelectorAll("[data-doc-artifact]").forEach(row => {
    row.addEventListener("click", event => {
      if (event.target.closest("[data-doc-copy-run]")) return;
      selectDocsTraceArtifact(row.getAttribute("data-doc-artifact"));
    });
    row.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("[data-doc-copy-run]")) return;
      event.preventDefault();
      selectDocsTraceArtifact(row.getAttribute("data-doc-artifact"));
    });
  });

  $("docs-evidence-shell").innerHTML = renderDocsEvidenceCard(selected, source, reviewSessions);
}

function renderDocsTraceTableRow(doc, source = {}, reviewSessions = [], selected = false) {
  const relatedStatuses = buildDocsRelatedTaskStatus(doc, reviewSessions);
  const linkedText = relatedStatuses.length
    ? relatedStatuses.map(task => task.found ? `session · ${task.sessionTitle || task.sessionId || "linked"}` : `no session linked · ${task.externalTaskId || "missing"}`).join(" · ")
    : "no session linked · orphan";
  const runId = doc.agent?.runId || doc.artifactId || "run-unlinked";
  const status = docsPrimaryStatus(doc, relatedStatuses);
  const linkedCount = (doc.linkedTasks || []).length;
  return `
    <div role="button" tabindex="0" class="trace-row docs-trace-table-row${selected ? " active" : ""}" data-doc-artifact="${esc(doc.artifactId)}" data-doc-reader-trigger="true" aria-pressed="${selected ? "true" : "false"}" aria-label="${esc(`Select trace ${runId}: ${doc.title || "Untitled run"}. Use Open reader to inspect the full document.`)}">
      <span class="docs-trace-run-cell">${renderDocsTraceBadge(runId)}<button class="docs-trace-copy-btn" type="button" data-doc-copy-run="${esc(runId)}" aria-label="${esc(`Copy run id ${runId}`)}">${icon("copy")}</button></span>
      <span class="docs-trace-title-cell">
        <span class="ttitle" title="${esc(doc.title || "Untitled run")}">${esc(doc.title || "Untitled run")}</span>
        <span class="tdesc"><span class="tlink ${relatedStatuses.some(task => !task.found) || !relatedStatuses.length ? "missing" : ""}">${esc(linkedText)}</span> · ${esc(linkedCount)} task${linkedCount === 1 ? "" : "s"}</span>
      </span>
      <span class="docs-trace-agent-cell">
        <span class="ttitle" title="${esc(doc.agent?.agentName || "PM Assistant")}">${esc(doc.agent?.agentName || "PM Assistant")}</span>
        ${uiKV("env", source.environment || "production", source.environment === "staged" ? "env-stage" : "env-prod")}
      </span>
      <span class="mono docs-trace-date">${esc(doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp")}</span>
      <span class="docs-trace-status-cell">${uiChip(docsStatusTone(status), docsStatusLabel(status), { sm: true })}</span>
    </div>
  `;
}

function findDocsArtifact(artifactId) {
  const documents = Array.isArray(S.docsPayload?.documents) ? S.docsPayload.documents : [];
  return documents.find(doc => doc.artifactId === artifactId) || null;
}

function docsArtifactSelector(artifactId) {
  const safe = typeof CSS !== "undefined" && CSS.escape
    ? CSS.escape(String(artifactId || ""))
    : String(artifactId || "").replace(/"/g, '\\"');
  return `[data-doc-artifact="${safe}"]`;
}

function docsInlineString(value) {
  return JSON.stringify(String(value || ""))
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/'/g, "\\u0027");
}

function selectDocsTraceArtifact(artifactId) {
  const doc = findDocsArtifact(artifactId);
  if (!doc) {
    toast("Document trace is not available in this local store", true);
    return null;
  }
  S.docsSelectedArtifactId = artifactId;
  S.docsReaderRestoreArtifactId = artifactId;
  document.querySelectorAll("[data-doc-artifact]").forEach(row => {
    const selected = row.getAttribute("data-doc-artifact") === artifactId;
    row.classList.toggle("active", selected);
    row.setAttribute("aria-pressed", selected ? "true" : "false");
  });

  const source = S.docsPayload?.source || {};
  const reviewSessions = Array.isArray(S.docsReviewSessions) ? S.docsReviewSessions : [];
  const evidenceShell = $("docs-evidence-shell");
  if (evidenceShell) evidenceShell.innerHTML = renderDocsEvidenceCard(doc, source, reviewSessions);
  return doc;
}

function openDocsDetailDrawer(artifactId) {
  const doc = selectDocsTraceArtifact(artifactId);
  if (!doc) return;

  const source = S.docsPayload?.source || {};
  const reviewSessions = Array.isArray(S.docsReviewSessions) ? S.docsReviewSessions : [];

  const host = ensureDocsReaderHost();
  host.innerHTML = renderDocsReaderDrawer(doc, source, reviewSessions);
  wireDocsReaderDrawer(host, artifactId);
  openSurface(host, "[data-docs-reader-close]");
}

function ensureDocsReaderHost() {
  let host = $("docs-reader-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "docs-reader-host";
    host.className = "docs-reader-host hidden";
    host.setAttribute("aria-hidden", "true");
    host.setAttribute("inert", "");
    document.body.appendChild(host);
  }
  return host;
}

function closeDocsDetailDrawer({ restore = true } = {}) {
  const host = $("docs-reader-host");
  if (!host) return;
  const focusTarget = restore
    ? docsArtifactSelector(S.docsReaderRestoreArtifactId || S.docsSelectedArtifactId)
    : null;
  closeSurface(host, focusTarget);
  host.innerHTML = "";
}

function wireDocsReaderDrawer(host, artifactId) {
  host.querySelector("[data-docs-reader-backdrop]")?.addEventListener("click", event => {
    if (event.target === event.currentTarget) closeDocsDetailDrawer();
  });
  host.querySelectorAll("[data-docs-reader-close]").forEach(btn => {
    btn.addEventListener("click", () => closeDocsDetailDrawer());
  });
  host.querySelector("[data-docs-reader-open-review]")?.addEventListener("click", () => {
    openDocsReaderReview(artifactId);
  });
  host.querySelector("[data-docs-reader-copy-report]")?.addEventListener("click", () => {
    copyDocsReaderReport(artifactId);
  });
}

function renderDocsReaderDrawer(doc, source = {}, reviewSessions = []) {
  const relatedStatuses = buildDocsRelatedTaskStatus(doc, reviewSessions);
  const primaryTask = relatedStatuses.find(task => task.found) || relatedStatuses[0] || {};
  const status = docsPrimaryStatus(doc, relatedStatuses);
  const runId = doc.agent?.runId || doc.artifactId || "run-unlinked";
  const generated = doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp";
  const events = buildDocsTraceEvents(doc, relatedStatuses);
  const hasLinkedReviewTask = relatedStatuses.some(task => task.found);
  const reviewActionLabel = hasLinkedReviewTask ? "Open Review" : "Open Review Queue";
  const reviewActionTitle = hasLinkedReviewTask
    ? "Open the linked Review Queue task"
    : "Linked task is missing locally. Open Review Queue for human-gate context.";
  return `
    <div class="docs-reader-backdrop" data-docs-reader-backdrop>
      <aside class="docs-reader-panel" role="dialog" aria-modal="true" aria-labelledby="docs-reader-title">
        <header class="docs-reader-head">
          <div>
            <div class="docs-reader-kicker">Document reader</div>
            <h2 id="docs-reader-title">${esc(doc.title || "Untitled document")}</h2>
            <p>${esc(doc.summary || "Full Markdown content, linked Review Queue context, evidence, and audit trail for the selected trace.")}</p>
          </div>
          <button class="btn iconbtn" type="button" data-docs-reader-close aria-label="Close document reader">${icon("x")}</button>
        </header>
        <div class="docs-reader-strip" aria-label="Document trace metadata">
          <span class="docs-reader-meta-chip is-run"><span>Run</span>${renderDocsTraceBadge(runId)}</span>
          <span class="docs-reader-meta-chip"><span>Status</span>${uiChip(docsStatusTone(status), docsStatusLabel(status), { sm: true })}</span>
          <span class="docs-reader-meta-chip"><span>Received</span><strong class="mono">${esc(generated)}</strong></span>
          <span class="docs-reader-meta-chip"><span>Agent</span><strong>${esc(doc.agent?.agentName || "PM Assistant")}</strong></span>
        </div>
        <div class="docs-reader-body">
          <section class="docs-reader-main" aria-label="Markdown document content">
            <div class="docs-reader-section-head">
              <div>
                <span class="eyebrow">Markdown</span>
                <strong>Full document content</strong>
              </div>
              <button class="btn sm" type="button" data-docs-reader-copy-report
                aria-label="${esc(`Copy audit report for ${doc.title || "selected document"}`)}"
                title="Copy a local audit report summary. No external system is changed.">${icon("copy")} Copy audit report</button>
            </div>
            <div class="docs-reader-document">
              <div class="docs-reader-safety-note">
                <strong>Reader only.</strong>
                <span>No Trello, Calendar, Google Tasks, or Paperclip live action runs from this panel. Review Queue remains the human gate.</span>
              </div>
              <article class="docs-reader-markdown docs-content">
                ${renderDocsMarkdown(doc.content?.text || doc.summary || "")}
              </article>
              ${renderDocsEvidence(doc.sourceEvidence || []) || '<div class="docs-reader-empty">No source evidence is attached to this document.</div>'}
            </div>
          </section>
          <aside class="docs-reader-side" aria-label="Linked task and audit details">
            ${renderDocsReaderLinkedTasks(doc, relatedStatuses)}
            <section class="docs-reader-card">
              <div class="docs-reader-card-head">
                <span class="eyebrow">Evidence</span>
                <strong>Source trace</strong>
              </div>
              <dl class="fkv docs-reader-kv">
                <dt>source</dt><dd>${esc(source.system || "paperclip")}</dd>
                <dt>mode</dt><dd>${esc(source.environment || "mock")}</dd>
                <dt>artifact</dt><dd class="mono">${esc(doc.artifactId || "missing")}</dd>
                <dt>request</dt><dd class="mono">${esc(primaryTask.requestId || "no linked request")}</dd>
                <dt>side effects</dt><dd>None from Docs view. Review Queue remains human-gated.</dd>
              </dl>
            </section>
            <section class="docs-reader-card">
              <div class="docs-reader-card-head">
                <span class="eyebrow">Audit timeline</span>
                <strong>${events.length} event${events.length === 1 ? "" : "s"}</strong>
              </div>
              <div class="timeline docs-reader-timeline" data-uiv2="docs-reader-audit-timeline">
                ${events.map((event, index) => `
                  <div class="tl-row ${docsTimelineTone(event, index)}">
                    <div class="tl-when">${esc(event.time || "Local state")}</div>
                    <div class="tl-what">${esc(event.label || "Trace event")}</div>
                    <div class="tl-extra">${esc(event.detail || "")}</div>
                  </div>
                `).join("")}
              </div>
            </section>
          </aside>
        </div>
        <footer class="docs-reader-foot">
          <button class="btn" type="button" data-docs-reader-close>Close</button>
          <button class="btn ai" type="button" data-docs-reader-open-review title="${esc(reviewActionTitle)}">${icon("external")} ${esc(reviewActionLabel)}</button>
        </footer>
      </aside>
    </div>
  `;
}

function renderDocsReaderLinkedTasks(doc, relatedStatuses = []) {
  if (!relatedStatuses.length) {
    return `
      <section class="docs-reader-card docs-reader-linked">
        <div class="docs-reader-card-head">
          <span class="eyebrow">Linked task</span>
          <strong>Orphan trace</strong>
        </div>
        <p class="docs-reader-muted">No local Review Queue task is attached. Keep this as audit evidence until PM/UX links or accepts it as a known orphan.</p>
      </section>
    `;
  }
  return `
    <section class="docs-reader-card docs-reader-linked">
      <div class="docs-reader-card-head">
        <span class="eyebrow">Linked task</span>
        <strong>${relatedStatuses.length} Review Queue link${relatedStatuses.length === 1 ? "" : "s"}</strong>
      </div>
      <div class="docs-reader-task-list">
        ${relatedStatuses.map(task => `
          <div class="docs-reader-task${task.found ? "" : " is-missing"}">
            <div>
              <strong>${esc(task.title || task.externalTaskId || "Review task")}</strong>
              <span>${esc(docsRelationshipLabel(task.relationship))} / ${esc(docsLinkedTaskStateLabel(task))}</span>
              <code>${esc(task.externalTaskId || task.requestId || "no task id")}</code>
            </div>
            ${task.found
              ? `<button class="btn sm ghost" type="button" onclick='openDocsTraceTarget("review", ${JSON.stringify(task).replace(/'/g, "&apos;")})'>Open Review</button>`
              : `<button class="btn sm ghost" type="button" onclick="closeDocsDetailDrawer({ restore: false }); navigateTo('review'); toast('Linked task is missing locally; opened Review Queue for context.')">Open Queue</button>`}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function openDocsReaderReview(artifactId) {
  const doc = findDocsArtifact(artifactId);
  const relatedStatuses = buildDocsRelatedTaskStatus(doc, S.docsReviewSessions || []);
  const task = relatedStatuses.find(item => item.found) || relatedStatuses[0];
  if (!task) {
    closeDocsDetailDrawer({ restore: false });
    navigateTo("review");
    toast("No linked Review Queue task is attached; opened Review Queue for context.");
    return;
  }
  if (!task.found) {
    closeDocsDetailDrawer({ restore: false });
    navigateTo("review");
    toast("Linked Review Queue task is missing locally; opened Review Queue for context.");
    return;
  }
  closeDocsDetailDrawer({ restore: false });
  openLinkedReviewTask(task);
}

async function copyDocsReaderReport(artifactId) {
  const doc = findDocsArtifact(artifactId);
  if (!doc) {
    toast("Document trace is not available in this local store", true);
    return;
  }
  const relatedStatuses = buildDocsRelatedTaskStatus(doc, S.docsReviewSessions || []);
  const status = docsStatusLabel(docsPrimaryStatus(doc, relatedStatuses));
  const runId = doc.agent?.runId || doc.artifactId || "run-unlinked";
  const related = relatedStatuses.length
    ? relatedStatuses.map(task => `- ${task.title || task.externalTaskId || "Review task"} / ${docsLinkedTaskStateLabel(task)}`).join("\n")
    : "- No linked Review Queue task";
  const report = [
    `# ${doc.title || "Docs / AI Trace document"}`,
    "",
    `Run: ${runId}`,
    `Status: ${status}`,
    `Agent: ${doc.agent?.agentName || "PM Assistant"}`,
    `Generated: ${doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp"}`,
    "Side effects: None from Docs view. Review Queue remains human-gated.",
    "",
    "Linked tasks:",
    related,
    "",
    "Summary:",
    doc.summary || "",
  ].join("\n");
  await copyDocsTraceValue("audit report", report);
}

function renderDocsTraceBadge(runId) {
  const safeId = runId || "run-unlinked";
  return `
    <span class="trace" title="${esc(safeId)}">
      <span class="pre">run</span>
      <span class="mono">${esc(safeId)}</span>
      <span class="copy">${icon("copy")}</span>
    </span>
  `;
}

function renderDocsEvidenceCard(doc, source = {}, reviewSessions = []) {
  if (!doc) return "";
  const relatedStatuses = buildDocsRelatedTaskStatus(doc, reviewSessions);
  const primaryTask = relatedStatuses.find(task => task.found) || relatedStatuses[0] || {};
  const status = docsPrimaryStatus(doc, relatedStatuses);
  const events = buildDocsTraceEvents(doc, relatedStatuses);
  const previewEvents = events.slice(0, 2);
  const runId = doc.agent?.runId || doc.artifactId || "run-unlinked";
  const linkedCount = relatedStatuses.length;
  const linkedSummary = linkedCount
    ? `${relatedStatuses.filter(task => task.found).length}/${linkedCount} linked locally`
    : "No linked Review task";
  return `
    <div class="evidence-card docs-inspection-summary" data-uiv2="evidence-card">
      <div class="ec-head">
        <span class="eyebrow">Selected trace</span>
        ${renderDocsTraceBadge(runId)}
        ${uiChip(docsStatusTone(status), docsStatusLabel(status), { sm: true })}
        <span class="docs-evidence-actions">
          <button class="btn sm ai" type="button" data-docs-open-reader
            aria-label="${esc(`Open full document reader for ${doc.title || "selected trace"}`)}"
            title="Open the full document reader for Markdown, evidence, linked task, and audit timeline."
            onclick='openDocsDetailDrawer(${docsInlineString(doc.artifactId || "")})'>${icon("external")} Open reader</button>
          <button class="btn sm" type="button" data-docs-copy-audit-report
            aria-label="${esc(`Copy audit report for ${doc.title || "selected trace"}`)}"
            title="Copy a local audit report summary. No external system is changed."
            onclick='copyDocsReaderReport(${docsInlineString(doc.artifactId || "")})'>${icon("copy")} Copy audit report</button>
          <button class="btn sm warn-outline" type="button" data-docs-rollback-hint
            aria-label="Explain rollback boundary for Docs and Review Queue"
            title="Show safe rollback guidance. This does not run a live rollback."
            onclick="toast('Rollback hint: keep Review Queue as the human gate and use Settings / Paperclip controls for owner-approved changes.')">${icon("lock")} Rollback hint</button>
        </span>
      </div>
      <div class="ec-body docs-inspection-body">
        <div class="docs-inspection-copy">
          <div class="dr-label">Trace summary</div>
          <strong>${esc(doc.title || "Untitled document")}</strong>
          <p>${esc(doc.summary || "Open reader for the full Markdown document, source evidence, linked task, and audit trail.")}</p>
          <span class="docs-inspection-note"><strong>Reader holds full detail.</strong> This route card stays compact so table selection and full-document review do not compete.</span>
        </div>
        <dl class="fkv docs-evidence-kv docs-inspection-kv">
          <dt>agent</dt><dd>${esc(doc.agent?.agentName || "PM Assistant")} &middot; ${esc(doc.agent?.agentRole || "agent")}</dd>
          <dt>request</dt><dd class="mono">${esc(primaryTask.requestId || doc.agent?.runId || "no linked request")}</dd>
          <dt>environment</dt><dd>${esc(source.environment || "production")}</dd>
          <dt>Source system</dt><dd>${esc(source.system || "paperclip")}</dd>
          <dt>Source mode</dt><dd>${esc(source.environment || "mock")}</dd>
          <dt>received</dt><dd>${esc(doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp")}</dd>
          <dt>Review link</dt><dd>${esc(linkedSummary)}</dd>
          <dt>side effects</dt><dd>None from Docs view &middot; Review Queue remains human-gated</dd>
        </dl>
        <div class="docs-inspection-preview" aria-label="Audit preview">
          <div class="dr-label">Audit preview</div>
          <div class="timeline is-preview" data-uiv2="audit-timeline">
            ${previewEvents.map((event, index) => `
              <div class="tl-row ${docsTimelineTone(event, index)}">
                <div class="tl-when">${esc(event.time || "Local state")}</div>
                <div class="tl-what">${esc(event.label || "Trace event")}</div>
                <div class="tl-extra">${esc(event.detail || "")}</div>
              </div>
            `).join("")}
          </div>
          <div class="docs-inspection-hint">Open reader for full Markdown, evidence, linked task, and complete timeline.</div>
        </div>
      </div>
    </div>
  `;
}

function docsPrimaryStatus(doc, relatedStatuses = []) {
  if (relatedStatuses.some(task => !task.found)) return "missing";
  if (relatedStatuses.some(task => task.status === "pending")) return "review";
  if (relatedStatuses.some(task => task.status === "approved")) return "approved";
  if ((doc.status || "").includes("reject")) return "rejected";
  return doc.status || doc.reviewStatus || "ready";
}

function docsStatusTone(status) {
  if (status === "approved" || status === "ready") return "ok";
  if (status === "review" || status === "new") return "ai";
  if (status === "missing" || status === "orphan") return "warn";
  if (status === "rejected") return "over";
  return "muted";
}

function docsStatusLabel(status) {
  const labels = {
    approved: "Approved",
    review: "In review",
    missing: "Orphan",
    rejected: "Rejected",
    ready: "Ready",
    new: "New",
  };
  return labels[status] || formatDocsLabel(status);
}

function buildDocsRunStatusCounts(documents = [], reviewSessions = []) {
  const counts = { approved: 0, review: 0, orphan: 0 };
  documents.forEach(doc => {
    const status = docsPrimaryStatus(doc, buildDocsRelatedTaskStatus(doc, reviewSessions));
    if (status === "approved" || status === "ready") counts.approved += 1;
    else if (status === "review" || status === "new") counts.review += 1;
    else if (status === "missing" || status === "orphan") counts.orphan += 1;
  });
  return counts;
}

function docsTimelineTone(event, index) {
  const text = `${event.label || ""} ${event.detail || ""}`.toLowerCase();
  if (text.includes("missing") || text.includes("failed") || text.includes("rejected")) return "over";
  if (text.includes("created") || text.includes("approved")) return "ok";
  if (text.includes("attached") || text.includes("paperclip")) return "ai";
  return index === 0 ? "ai" : "";
}

function buildDocsTraceSummary(documents = [], reviewSessions = []) {
  const related = documents.flatMap(doc => buildDocsRelatedTaskStatus(doc, reviewSessions));
  return {
    total: documents.length,
    linked: related.filter(task => task.found).length,
    missing: related.filter(task => !task.found).length,
    evidence: documents.reduce((sum, doc) => sum + (doc.sourceEvidence || []).length, 0),
  };
}

function renderDocsTraceSummary(summary) {
  return `
    <section class="docs-trace-summary" aria-label="Docs trace summary">
      <div class="docs-trace-summary-card">
        <span>Documents</span>
        <strong>${summary.total}</strong>
        <small>trace list</small>
      </div>
      <div class="docs-trace-summary-card ${summary.linked ? "is-linked" : ""}">
        <span>Linked reviews</span>
        <strong>${summary.linked}</strong>
        <small>local tasks found</small>
      </div>
      <div class="docs-trace-summary-card ${summary.missing ? "is-missing" : ""}">
        <span>Missing links</span>
        <strong>${summary.missing}</strong>
        <small>needs human context</small>
      </div>
      <div class="docs-trace-summary-card">
        <span>Evidence</span>
        <strong>${summary.evidence}</strong>
        <small>source records</small>
      </div>
    </section>
  `;
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

function docsActiveFilterCount(filters = normalizeDocsFilters(S.docsFilters)) {
  return [
    filters.query.trim(),
    filters.status !== "all",
    filters.type !== "all",
    filters.linkedState !== "all",
    filters.sort !== "generated_desc",
  ].filter(Boolean).length;
}

function renderDocsTopbarActions() {
  if (typeof setTopbarRouteActions !== "function") return;
  const count = docsActiveFilterCount();
  setTopbarRouteActions(`
    <button class="btn${count ? " is-filtered" : ""}" type="button" id="docs-topbar-filter"
      aria-haspopup="dialog" aria-controls="docs-filter-popover docs-filterbar" aria-expanded="false"
      onclick="toggleDocsFilterMenu(event)">
      ${icon("filter")} <span>Filter</span>${count ? `<span class="btn-count">${count}</span>` : ""}
    </button>
    <button class="btn" type="button" id="docs-topbar-export" data-docs-export-trace
      aria-label="Export current Docs and AI Trace rows as a local CSV"
      title="Export the current Docs / AI Trace rows as a local CSV. No external system is changed."
      onclick="exportDocsTraceCSV()">${icon("external")} Export</button>
  `);
}

function closeDocsFilterMenu({ restore = false, focusTarget = "#docs-topbar-filter" } = {}) {
  const panel = $("docs-filter-popover");
  if (panel) panel.remove();
  $("docs-topbar-filter")?.setAttribute("aria-expanded", "false");
  if (restore && typeof restoreFocus === "function") {
    setTimeout(() => restoreFocus(focusTarget), 0);
  }
}

function applyDocsFilterFromMenu(field, value, { keepOpen = false } = {}) {
  updateDocsFilter(field, value);
  if (!keepOpen) closeDocsFilterMenu({ restore: true });
}

function clearDocsFiltersFromMenu() {
  S.docsFilters = normalizeDocsFilters({});
  S.docsSelectedArtifactId = null;
  renderDocsPage(S.docsPayload || { documents: [] }, S.docsReviewSessions || []);
  closeDocsFilterMenu({ restore: true });
  toast("Docs filters cleared");
}

function toggleDocsFilterMenu(event) {
  event?.stopPropagation?.();
  const anchor = $("docs-topbar-filter");
  const existing = $("docs-filter-popover");
  if (existing) {
    closeDocsFilterMenu({ restore: true });
    return;
  }
  if (typeof closeTopbarScopeMenu === "function") closeTopbarScopeMenu();
  if (typeof closeTopbarNotifications === "function") closeTopbarNotifications();

  const filters = normalizeDocsFilters(S.docsFilters);
  const count = docsActiveFilterCount(filters);
  const panel = document.createElement("div");
  panel.id = "docs-filter-popover";
  panel.className = "topbar-control-popover docs-filter-popover";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Docs filters");
  panel.innerHTML = `
    <div class="topbar-popover-head">
      <span class="eyebrow">Docs filters</span>
      <button class="iconbtn" type="button" aria-label="Close Docs filters" data-close-docs-filter>${icon("x")}</button>
    </div>
    <label class="topbar-filter-search">
      ${icon("search")}
      <input id="docs-filter-menu-query" type="search" value="${esc(filters.query)}" placeholder="Search run id, agent, title">
    </label>
    <div class="topbar-filter-group" aria-label="Status filters">
      <span class="topbar-filter-label">Status</span>
      <button class="filter-chip${filters.status === "all" ? " on" : ""}" type="button" data-docs-filter-field="status" data-docs-filter-value="all"><span class="k">status:</span> any</button>
      <button class="filter-chip${filters.status === "approved" ? " on" : ""}" type="button" data-docs-filter-field="status" data-docs-filter-value="approved"><span class="k">status:</span> approved</button>
    </div>
    <div class="topbar-filter-group" aria-label="Link filters">
      <span class="topbar-filter-label">Link</span>
      <button class="filter-chip${filters.linkedState === "all" ? " on" : ""}" type="button" data-docs-filter-field="linkedState" data-docs-filter-value="all"><span class="k">link:</span> any</button>
      <button class="filter-chip${filters.linkedState === "unlinked" ? " on" : ""}" type="button" data-docs-filter-field="linkedState" data-docs-filter-value="unlinked"><span class="k">link:</span> orphan</button>
    </div>
    <div class="topbar-filter-group" aria-label="Sort">
      <span class="topbar-filter-label">Sort</span>
      <button class="filter-chip${filters.sort === "generated_desc" ? " on" : ""}" type="button" data-docs-filter-field="sort" data-docs-filter-value="generated_desc">Newest first</button>
      <button class="filter-chip${filters.sort === "generated_asc" ? " on" : ""}" type="button" data-docs-filter-field="sort" data-docs-filter-value="generated_asc">Oldest first</button>
    </div>
    <div class="topbar-popover-actions">
      <button class="btn sm primary" type="button" data-docs-apply-search>${icon("check")} Apply search</button>
      <button class="btn sm ghost" type="button" data-docs-focus-filterbar>${icon("filter")} Show bar</button>
      <button class="btn sm" type="button" ${count ? "" : "disabled"} data-docs-clear-filters>${icon("x")} Clear</button>
    </div>
  `;
  document.body.appendChild(panel);
  anchor?.setAttribute("aria-expanded", "true");
  if (typeof positionTopbarPopover === "function") positionTopbarPopover(panel, anchor);

  const queryInput = $("docs-filter-menu-query");
  queryInput?.focus({ preventScroll: true });
  queryInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") applyDocsFilterFromMenu("query", queryInput.value);
    if (e.key === "Escape") closeDocsFilterMenu({ restore: true });
  });
  panel.querySelector("[data-close-docs-filter]")?.addEventListener("click", () => closeDocsFilterMenu({ restore: true }));
  panel.querySelector("[data-docs-apply-search]")?.addEventListener("click", () => applyDocsFilterFromMenu("query", queryInput?.value || ""));
  panel.querySelector("[data-docs-clear-filters]")?.addEventListener("click", clearDocsFiltersFromMenu);
  panel.querySelector("[data-docs-focus-filterbar]")?.addEventListener("click", () => {
    const filterbar = $("docs-filterbar");
    filterbar?.scrollIntoView({ block: "center", behavior: "smooth" });
    filterbar?.classList.add("uiv2-control-highlight");
    $("docs-search-input")?.focus({ preventScroll: true });
    toast("Docs filter bar is active. Search, status, link, and sort filters update this route only.");
    setTimeout(() => filterbar?.classList.remove("uiv2-control-highlight"), 900);
  });
  panel.querySelectorAll("[data-docs-filter-field]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyDocsFilterFromMenu(btn.getAttribute("data-docs-filter-field"), btn.getAttribute("data-docs-filter-value"));
    });
  });
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

function renderDocsListTraceChips(doc, relatedStatuses = []) {
  const linkedState = relatedStatuses.length
    ? relatedStatuses.map(task => docsLinkedTaskStateLabel(task)).join(", ")
    : "No linked Review Queue task";
  return `
    <span class="docs-item-meta">
      ${docsTraceChip("Type", formatDocsLabel(doc.artifactType || "document"))}
      ${docsTraceChip("Agent", doc.agent?.agentName || "Paperclip agent")}
      ${docsTraceChip("Status", formatDocsLabel(doc.status || "ready"))}
      ${docsTraceChip("Link", linkedState)}
    </span>
  `;
}

function renderDocsListLinkedState(doc, relatedStatuses = []) {
  if (!relatedStatuses.length) {
    return '<span class="docs-item-linked docs-item-unlinked">No linked Review Queue task</span>';
  }
  const count = Array.isArray(doc.linkedTasks) ? doc.linkedTasks.length : relatedStatuses.length;
  const states = relatedStatuses.map(task => docsLinkedTaskStateLabel(task)).join(" | ");
  return `<span class="docs-item-linked">${count} linked task${count === 1 ? "" : "s"} - ${esc(states)}</span>`;
}

function renderDocsTagChips(tags = []) {
  if (!tags.length) return "";
  return `
    <span class="docs-item-tags" aria-label="Document tags">
      ${tags.slice(0, 3).map(tag => `<em><span>Tag</span>${esc(formatDocsLabel(tag))}</em>`).join("")}
    </span>
  `;
}

function docsTraceChip(label, value, className = "") {
  return `
    <span class="docs-trace-chip ${esc(className)}">
      <span class="docs-trace-chip-label">${esc(label)}</span>
      <strong>${esc(value || "None")}</strong>
    </span>
  `;
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
          ${docsTraceChip("Status", formatDocsLabel(doc.status || "ready"), "chip-source")}
          ${docsTraceChip("Type", formatDocsLabel(doc.artifactType || "document"))}
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
    ["Source system", source?.system || "paperclip"],
    ["Source mode", source?.environment || "mock"],
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
            <small>${task.found ? esc(task.sessionTitle) : "Missing local Review Queue task"}</small>
          </div>
          <span class="chip ${docsTaskStatusClass(task.status)}">${esc(docsReviewStatusLabel(task.status))}</span>
          <small>${esc(task.owner || "Unassigned")}</small>
          <small>${task.deadline ? esc(formatThaiDateTime(task.deadline)) : "No due date"}</small>
          ${task.found ? "" : '<small class="docs-related-missing-note">The document keeps this trace link, but this local Task Hub store cannot find the Review Queue task. Attach or create a local review task to resolve it.</small>'}
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
    not_found: "Missing local Review Queue task",
  };
  return map[status] || formatDocsLabel(status);
}

function docsLinkedTaskStateLabel(task) {
  if (!task) return "No linked Review Queue task";
  if (!task.found) return "Missing local Review Queue task";
  const status = docsReviewStatusLabel(task.status || "pending");
  if (task.relationship === "manual_reference") return `Manually attached - ${status}`;
  if (task.relationship === "created_from_doc") return `Created from doc - ${status}`;
  return status;
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
            <small>${esc(docsRelationshipLabel(task.relationship))} - ${esc(docsLinkedTaskStateLabel(task))}</small>
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

function exportDocsTraceCSV() {
  const payload = S.docsPayload || {};
  const documents = Array.isArray(payload.documents) ? payload.documents : [];
  const filters = normalizeDocsFilters(S.docsFilters);
  const visibleDocuments = applyDocsFiltersAndSort(documents, filters);
  if (!visibleDocuments.length) {
    toast("No Docs / AI Trace rows to export", true);
    return;
  }
  const source = payload.source || {};
  const reviewSessions = S.docsReviewSessions || [];
  const csvCell = value => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const rows = visibleDocuments.map(doc => {
    const related = buildDocsRelatedTaskStatus(doc, reviewSessions);
    const status = docsStatusLabel(docsPrimaryStatus(doc, related));
    const runId = doc.agent?.runId || doc.artifactId || "";
    const linkedTasks = related.map(task => task.externalTaskId || task.sessionTitle || task.status || "linked").filter(Boolean).join("; ");
    return [
      runId,
      doc.title || "",
      doc.agent?.agentName || "PM Assistant",
      source.environment || "production",
      doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "",
      status,
      linkedTasks || "orphan",
    ].map(csvCell).join(",");
  });
  const headers = ["Run ID", "Title", "Agent", "Environment", "Received", "Status", "Linked tasks"];
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trisilar-docs-trace-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`Exported ${visibleDocuments.length} Docs / AI Trace row${visibleDocuments.length === 1 ? "" : "s"}`);
}

async function copyDocsTraceValue(label, value) {
  const text = String(value || "");
  if (!text || text === "None" || text.startsWith("No linked")) {
    toast(`No ${label} to copy`, true);
    return;
  }
  try {
    await copyDocsTextToClipboard(text);
    toast(`${label} copied`);
  } catch (error) {
    toast(`Failed to copy ${label}: ${error.message}`, true);
  }
}

async function copyDocsTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // Browser automation and embedded previews can reject Clipboard API when
      // the document is not focused; keep the visible copy affordance useful.
    }
  }
  const previousFocus = document.activeElement;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "-9999px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  restoreFocus(previousFocus);
  if (!copied) throw new Error("clipboard permission was denied");
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
