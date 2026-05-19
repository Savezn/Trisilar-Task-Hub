// Review Queue Page
// V0.2-W2-02 - Implemented by Codex Dev.
async function showReviewPage() {
  S.mode = "review";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Review Queue";
  $("board-subtitle").textContent = "AI-extracted tasks waiting for approval";
  $("add-list-btn").classList.add("hidden");
  if (typeof setTopbarRouteActions === "function") {
    setTopbarRouteActions(`
      <button class="btn" type="button" id="review-topbar-filter" onclick="focusReviewFilters()">${icon("filter")} Filter</button>
    `);
  }

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading sessions...</div>';

  try {
    const sessions = await api.get("/api/reviews");
    expandLinkedReviewSession(sessions);
    renderReviewPage(sessions);
    focusPendingReviewTaskLink(sessions);
    updateReviewBadge().catch(() => {});
  } catch (e) {
    content.innerHTML = `<div class="empty-state review-empty-state"><div class="empty-icon">${icon("alert")}</div><h3>Failed to load Review Queue</h3><p>${esc(e.message)}</p></div>`;
  }
}

function renderReviewPage(sessions) {
  const content = $("board-content");
  const page = document.createElement("div");
  page.className = "review-page";
  page.id = "review-page-root";

  const counts = getReviewCounts(sessions);
  const filters = getReviewFilterState();
  const filteredSessions = filterReviewSessions(sessions, filters);
  const filteredCounts = getReviewCounts(filteredSessions);
  $("board-subtitle").textContent = `${counts.pending} pending · paperclip`;
  if (!S.reviewExpanded.size && filteredSessions.length) {
    const firstActionable = filteredSessions.find(s => (s.tasks || []).some(t => t.status === "pending")) || filteredSessions[0];
    if (firstActionable) S.reviewExpanded.add(firstActionable.id);
  }

  page.appendChild(buildReviewHeader(counts, filteredCounts));

  if (!sessions.length) {
    page.appendChild(buildReviewEmptyState());
    content.innerHTML = "";
    content.appendChild(page);
    ensureReviewDrawerHost();
    return;
  }

  if (!filteredSessions.length) {
    page.appendChild(buildReviewNoMatches(filters));
    content.innerHTML = "";
    content.appendChild(page);
    ensureReviewDrawerHost();
    return;
  }

  const primarySelection = findPrimaryReviewTask(filteredSessions);

  page.appendChild(buildBulkBar());

  const reviewLayout = document.createElement("div");
  reviewLayout.className = "review-layout rq-layout";

  const sessionsWrap = document.createElement("div");
  sessionsWrap.className = "review-sessions";
  filteredSessions.forEach(session => sessionsWrap.appendChild(buildSessionCard(session)));
  reviewLayout.appendChild(sessionsWrap);
  if (primarySelection) {
    reviewLayout.appendChild(buildReviewInspectionPanel(primarySelection.session, primarySelection.task));
  }
  page.appendChild(reviewLayout);

  content.innerHTML = "";
  content.appendChild(page);
  ensureReviewDrawerHost();
  updateBulkBar();
}

function getReviewCounts(sessions) {
  return sessions.reduce((acc, session) => {
    const tasks = session.tasks || [];
    acc.sessions += 1;
    acc.total += tasks.length;
    acc.pending += tasks.filter(t => t.status === "pending").length;
    acc.approved += tasks.filter(t => t.status === "approved").length;
    acc.rejected += tasks.filter(t => t.status === "rejected").length;
    return acc;
  }, { sessions: 0, total: 0, pending: 0, approved: 0, rejected: 0 });
}

function getReviewFilterState() {
  const state = S.reviewFilters || {};
  const status = ["all", "pending", "approved", "rejected"].includes(state.status) ? state.status : "all";
  const risk = ["all", "blocked", "ready"].includes(state.risk) ? state.risk : "all";
  return { status, risk };
}

function setReviewFilter(type, value) {
  const current = getReviewFilterState();
  S.reviewFilters = { ...current, [type]: value };
  showReviewPage();
}

function clearReviewFilters() {
  S.reviewFilters = { status: "all", risk: "all" };
  showReviewPage();
}

function reviewTaskMatchesFilter(session, task, filters = getReviewFilterState()) {
  if (filters.status !== "all" && task.status !== filters.status) return false;
  if (filters.risk !== "all") {
    const confPct = Math.round((task.confidence ?? 1) * 100);
    const safety = reviewTaskSafety(session, task, confPct);
    const blocked = Boolean(safety.blockApproval || safety.warnings?.length);
    if (filters.risk === "blocked" && !blocked) return false;
    if (filters.risk === "ready" && blocked) return false;
  }
  return true;
}

function filterReviewSessions(sessions = [], filters = getReviewFilterState()) {
  const hasFilter = filters.status !== "all" || filters.risk !== "all";
  if (!hasFilter) return sessions;
  return sessions.map(session => ({
    ...session,
    tasks: (session.tasks || []).filter(task => reviewTaskMatchesFilter(session, task, filters)),
  })).filter(session => (session.tasks || []).length);
}

function focusReviewFilters() {
  const bar = document.querySelector("#review-filterbar");
  if (!bar) {
    toast("Review filters load with the Review Queue route.", true);
    return;
  }
  bar.scrollIntoView({ behavior: "smooth", block: "center" });
  bar.classList.add("uiv2-control-highlight");
  bar.querySelector("button:not([disabled])")?.focus();
  setTimeout(() => bar.classList.remove("uiv2-control-highlight"), 900);
}

function openReviewIntakePolicy() {
  navigateTo("settings");
  setTimeout(() => {
    document.getElementById("settings-paperclip")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Review intake policy is controlled in Settings. Runtime mode is unchanged.");
  }, 160);
}

function buildReviewHeader(counts, filteredCounts = counts) {
  const hdr = document.createElement("div");
  hdr.className = "review-command-header review-v2-header";
  const filters = getReviewFilterState();
  const activeFilterCount = [filters.status !== "all", filters.risk !== "all"].filter(Boolean).length;
  hdr.innerHTML = `
    ${uiRouteBar({
      title: "AI Review Queue",
      sub: `${uiKV("source", "paperclip", "ai")}${uiKV("env", "production", "env-prod")}${uiKV("auth", "webhook · signed")}<span>·</span><span style="color:var(--ink-2)">${counts.total} proposals · ${counts.pending} pending · ${counts.approved} approved · ${counts.rejected} rejected</span>`,
      actions: `<button class="btn" type="button" id="review-route-audit" onclick="navigateTo('docs')">${icon("external")} Open audit log</button><button class="btn warn-outline" type="button" id="review-route-policy" onclick="openReviewIntakePolicy()">${icon("lock")} Intake policy</button>`,
    })}
    <section class="review-filterbar filterbar" id="review-filterbar" aria-label="Review Queue filters">
      <button class="filter-chip${filters.status === "all" ? " on" : ""}" type="button" onclick="setReviewFilter('status','all')"><span class="k">status:</span> any</button>
      <button class="filter-chip${filters.status === "pending" ? " on" : ""}" type="button" onclick="setReviewFilter('status','pending')"><span class="k">status:</span> pending</button>
      <button class="filter-chip${filters.status === "approved" ? " on" : ""}" type="button" onclick="setReviewFilter('status','approved')"><span class="k">status:</span> approved</button>
      <button class="filter-chip${filters.status === "rejected" ? " on" : ""}" type="button" onclick="setReviewFilter('status','rejected')"><span class="k">status:</span> rejected</button>
      <button class="filter-chip${filters.risk === "blocked" ? " on" : ""}" type="button" onclick="setReviewFilter('risk','blocked')"><span class="k">risk:</span> blocked</button>
      <button class="filter-chip${filters.risk === "ready" ? " on" : ""}" type="button" onclick="setReviewFilter('risk','ready')"><span class="k">risk:</span> ready</button>
      <button class="filter-chip is-readonly" type="button" disabled title="Review Queue proposals are currently sourced from Paperclip / manual upload."><span class="k">source:</span> paperclip</button>
      <span class="filter-chip is-readonly" aria-disabled="true"><span class="k">visible:</span> ${filteredCounts.total}/${counts.total}</span>
      <button class="btn sm ghost" type="button" ${activeFilterCount ? "title=\"Clear active Review Queue filters\" aria-label=\"Clear active Review Queue filters\"" : "disabled title=\"No active Review Queue filters to clear\" aria-label=\"No active Review Queue filters to clear\""} onclick="clearReviewFilters()">${icon("x")} Clear</button>
    </section>
  `;
  return hdr;
}

function buildReviewNoMatches(filters = getReviewFilterState()) {
  const empty = document.createElement("div");
  empty.className = "review-empty-panel panel";
  empty.innerHTML = `
    ${uiStateCard({
      kind: "empty",
      iconName: "search",
      title: "No proposals match these filters",
      desc: `Current Review Queue filter is status ${filters.status} and risk ${filters.risk}. Clear filters to return to all proposals.`,
      actions: `<button class="btn primary" type="button" onclick="clearReviewFilters()">Clear filters</button><button class="btn" type="button" onclick="navigateTo('docs')">Open audit log</button>`,
    })}
  `;
  return empty;
}

function buildReviewSummary(counts) {
  const summary = document.createElement("div");
  summary.className = "review-summary-row";
  summary.innerHTML = `
    <div class="review-summary-card"><span>${counts.sessions}</span><small>Sessions</small></div>
    <div class="review-summary-card review-summary-pending"><span>${counts.pending}</span><small>Pending</small></div>
    <div class="review-summary-card review-summary-approved"><span>${counts.approved}</span><small>Approved</small></div>
    <div class="review-summary-card"><span>${counts.total}</span><small>Total tasks</small></div>
  `;
  return summary;
}

function findPrimaryReviewTask(sessions) {
  for (const session of sessions) {
    const task = (session.tasks || []).find(t => t.status === "pending");
    if (task) return { session, task };
  }
  for (const session of sessions) {
    const task = (session.tasks || [])[0];
    if (task) return { session, task };
  }
  return null;
}

function buildReviewInspectionPanel(session, task) {
  const panel = document.createElement("aside");
  panel.className = "review-inspection-panel drawer panel";
  panel.setAttribute("aria-label", "Selected proposal inspection");

  const diffMeta = reviewDiffMeta(task.diffStatus);
  const confPct = Math.round((task.confidence ?? 1) * 100);
  const confClass = confPct >= 80 ? "conf-high" : confPct >= 50 ? "conf-mid" : "conf-low";
  const safety = reviewTaskSafety(session, task, confPct);
  const paperclipMeta = getPaperclipReviewMeta(session);
  const sourceLabel = formatReviewSource(session.source);
  const envLabel = session.externalSource?.environment || session.sourceEnv || session.environment || "local";
  const requestRef = session.requestId || session.externalSource?.requestId || session.sourceRef;
  const runRef = session.agent?.runId || session.externalSource?.runId || session.runId;
  const boardLabel = reviewBoardName(task.targetBoardId);
  const listLabel = task.targetListId ? reviewListLabel(task) : "No list";
  const dueLabel = task.deadline ? formatThaiDateTime(task.deadline) : "No due date";
  const sideEffects = reviewApprovalSideEffects(task);
  const warningsHtml = safety.warnings.length
    ? safety.warnings.map(w => `<span class="review-risk-pill is-warning">${esc(w)}</span>`).join("")
    : '<span class="review-risk-pill is-ready">Ready for human approval</span>';

  panel.innerHTML = `
    <div class="review-inspection-head">
      <div class="review-kicker">${icon("sparkles")} AI proposal · review</div>
      <h3>${esc(task.title || "Untitled task")}</h3>
      <div class="review-inspection-badges">
        <span class="review-diff-badge ${diffMeta.className}">${diffMeta.icon}${diffMeta.label}</span>
        <div class="review-conf-bar" title="${confPct}% confidence">
          <div class="review-conf-track"><div class="review-conf-fill ${confClass}" style="width:${confPct}%"></div></div>
          <span>${confPct}%</span>
        </div>
      </div>
    </div>
    <div class="review-inspection-body">
      <section class="review-inspection-section">
        <div class="review-inspection-label">Source & trace</div>
        <dl class="review-inspection-kv">
          <dt>system</dt><dd>${paperclipMeta.isPaperclip ? "paperclip" : esc(sourceLabel)}</dd>
          <dt>environment</dt><dd>${esc(envLabel)}</dd>
          <dt>request</dt><dd class="mono">${esc(shortReviewRef(requestRef)) || "No request"}</dd>
          <dt>agent</dt><dd>${esc(session.agent?.name || "Task Hub")}</dd>
          <dt>run id</dt><dd class="mono">${esc(shortReviewRef(runRef)) || "No run"}</dd>
        </dl>
      </section>
      <section class="review-inspection-section">
        <div class="review-inspection-label">Proposed action · diff</div>
        <div class="review-inspection-diff">
          <div><span>title</span><strong>${esc(task.title || "Untitled task")}</strong></div>
          <div><span>owner</span><strong class="${task.owner ? "" : "is-missing"}">${esc(task.owner || "missing · required before approve")}</strong></div>
          <div><span>due</span><strong>${esc(dueLabel)}</strong></div>
          <div><span>target</span><strong>${esc(boardLabel)} · ${esc(listLabel)}</strong></div>
        </div>
      </section>
      <section class="review-inspection-section">
        <div class="review-inspection-label">Risk & approval gate</div>
        <div class="review-risk-list">${warningsHtml}</div>
      </section>
      <section class="review-inspection-section">
        <div class="review-inspection-label">External side effects on approve</div>
        <div class="review-side-effects">
          ${sideEffects.map(effect => `<span>${esc(effect)}</span>`).join("")}
        </div>
      </section>
      <section class="review-inspection-section">
        <div class="review-inspection-label">Audit timeline</div>
        <div class="review-audit-mini">
          <span><strong>received</strong>${esc(formatThaiDateTime(session.createdAt, false) || "No timestamp")}</span>
          <span><strong>validated</strong>${safety.blockApproval ? "waiting for required fields" : "ready for reviewer"}</span>
          <span><strong>gate</strong>Review Queue holds all external writes</span>
        </div>
      </section>
    </div>
    <div class="review-inspection-foot">
      <button class="btn btn-ghost btn-sm" type="button" onclick="openReviewTaskDrawer('${session.id}','${task.id}')">${icon("edit")} Edit before approve</button>
      <button class="btn btn-ghost btn-sm review-hold-btn" type="button" onclick="holdReviewTaskForEdit('${session.id}','${task.id}')">${icon("alert")} Hold</button>
      <button class="btn btn-danger btn-sm" type="button" onclick="rejectReviewTask('${session.id}','${task.id}')">${icon("x")} Reject</button>
      <button class="btn btn-success btn-sm" type="button" onclick="approveReviewTask('${session.id}','${task.id}')" ${safety.blockApproval ? 'disabled title="Resolve missing owner, board, or list before approval."' : ""}>${icon("check")} Approve</button>
    </div>
  `;

  return panel;
}

function buildReviewEmptyState() {
  const empty = document.createElement("div");
  empty.className = "review-empty-panel panel";
  empty.innerHTML = `
    <div class="panel-head">
      <div>
        <span class="eyebrow">Empty state · Review Queue</span>
        <h3>No proposals to review</h3>
      </div>
    </div>
    ${uiStateCard({
      kind: "empty",
      iconName: "inbox",
      title: "Review queue is empty",
      desc: "When Paperclip submits proposals from a meeting or workflow, they appear here for approval before anything reaches Trello or Calendar.",
      actions: `<button class="btn" type="button" onclick="navigateTo('docs')">Open audit log</button><button class="btn primary" type="button" id="review-topbar-upload" onclick="openTranscriptModal()">Manual upload</button>`,
    })}
  `;
  return empty;
}

function buildBulkBar() {
  const bulkBar = document.createElement("div");
  bulkBar.className = "review-bulk-bar bulkbar";
  bulkBar.id = "review-bulk-bar";
  bulkBar.innerHTML = `
    <span class="count" id="review-bulk-count">0</span>
    <span id="review-bulk-context">selected &middot; across Review Queue</span>
    <div class="b-actions review-bulk-actions">
      <button class="btn btn-sm review-bulk-approve" type="button" data-bulk-action="approve" onclick="bulkApproveReview()" disabled>${icon("check")} Approve&hellip;</button>
      <button class="btn btn-sm review-bulk-reject" type="button" data-bulk-action="reject" onclick="bulkRejectReview()" disabled>${icon("x")} Reject&hellip;</button>
      <button class="btn btn-sm" type="button" data-bulk-action="hold" disabled>${icon("chevron")} Hold</button>
    </div>
  `;
  return bulkBar;
}

function buildSessionCard(session) {
  const tasks = session.tasks || [];
  const pendingTasks  = tasks.filter(t => t.status === "pending");
  const approvedTasks = tasks.filter(t => t.status === "approved");
  const rejectedTasks = tasks.filter(t => t.status === "rejected");
  const allProcessed  = tasks.length > 0 && pendingTasks.length === 0;
  const expanded      = S.reviewExpanded.has(session.id);
  const selectedSet   = S.reviewSelected.get(session.id) || new Set();
  const allVisibleSelected = pendingTasks.length > 0 && pendingTasks.every(t => selectedSet.has(t.id));
  const dateStr = formatThaiDateTime(session.createdAt, false);
  const paperclipMeta = getPaperclipReviewMeta(session);
  const mobileRunRef = shortReviewRef(session.agent?.runId || session.externalSource?.runId || session.runId || session.requestId || session.id) || session.id;
  const mobileEnv = session.externalSource?.environment || session.sourceEnv || session.environment || "local";
  const mobileAgent = session.agent?.name || session.agent?.agentName || session.agent?.agentRole || "Task Hub";
  const mobileReceived = session.receivedAt || shortReviewRef(dateStr) || "received";
  const sourceIcon = paperclipMeta.isPaperclip ? icon("gitMerge") : icon("upload");
  const paperclipBadge = paperclipMeta.isPaperclip
    ? `<span class="chip ${paperclipMeta.isTestOrCanary ? "chip-paperclip-test" : "chip-paperclip-live"}">${esc(paperclipMeta.label)}</span>`
    : "";
  const cleanupBadge = session.paperclipCleanup?.status === "cleaned"
    ? `<span class="chip chip-cleanup">Cleanup archived</span>`
    : "";
  const dismissLocked = isPaperclipCleanupLocked(session);
  const cleanupButton = paperclipMeta.isCleanupEligible && pendingTasks.length
    ? `<button class="btn btn-danger btn-sm" type="button" onclick="cleanupPaperclipTestSession('${session.id}')">${icon("x")} Cleanup test</button>`
    : "";
  const sessionTrace = renderReviewSessionTrace(session, pendingTasks);

  const card = document.createElement("div");
  card.className = `review-session-card rq-session panel${expanded ? " active" : ""}`;
  card.id = `session-${session.id}`;

  const hdr = document.createElement("div");
  hdr.className = "review-session-header";
  hdr.innerHTML = `
    <div class="review-session-mark">${sourceIcon}</div>
    <input type="checkbox" class="review-task-checkbox" title="Select visible pending tasks"
      ${pendingTasks.length ? "" : "disabled"}
      ${allVisibleSelected ? "checked" : ""}
      onchange="toggleSelectAllSession('${session.id}', this.checked)">
    <div class="review-session-copy">
      <div class="review-mobile-session-kicker">Session - <span class="mono">${esc(mobileRunRef)}</span></div>
      <div class="review-session-title">${esc(session.title)}</div>
      <div class="review-session-meta">
        <span>${dateStr}</span>
        <span class="review-meta-dot">-</span>
        <span class="chip chip-source">${esc(formatReviewSource(session.source))}</span>
        ${paperclipBadge}
        ${cleanupBadge}
        <span class="review-meta-dot">-</span>
        <span>${tasks.length} tasks extracted</span>
      </div>
      <div class="review-mobile-session-meta">
        <span><b>env</b> ${esc(mobileEnv)}</span>
        <span><b>agent</b> ${esc(mobileAgent)}</span>
        <span><b>received</b> ${esc(mobileReceived)}</span>
      </div>
      ${sessionTrace}
    </div>
    <div class="review-session-controls">
      <button class="btn btn-ghost btn-sm" type="button" onclick="navigateTo('docs')">${icon("external")} Trace</button>
      <button class="btn btn-ghost btn-sm review-expand-btn" type="button" onclick="toggleReviewSession('${session.id}')">
        ${expanded ? "Collapse" : "Review"}
      </button>
      ${cleanupButton}
      ${allProcessed && !dismissLocked
        ? `<button class="btn btn-ghost btn-sm" type="button" style="color:var(--text-muted)" onclick="dismissReviewSession('${session.id}')">${icon("x")} Dismiss</button>`
        : ""}
    </div>
  `;
  card.appendChild(hdr);

  const taskList = document.createElement("div");
  taskList.className = "review-task-list";
  taskList.id = `task-list-${session.id}`;
  taskList.style.display = expanded ? "" : "none";
  if (expanded) loadSessionTasks(session.id, taskList);
  card.appendChild(taskList);

  return card;
}

async function loadSessionTasks(sessionId, taskListEl) {
  taskListEl.innerHTML = '<div class="loading-box review-inline-loading"><span class="spinner"></span></div>';
  try {
    const [session, paperclipDocsIndex] = await Promise.all([
      api.get(`/api/reviews/${sessionId}`),
      loadPaperclipDocsIndex(),
    ]);
    taskListEl.innerHTML = "";
    const tasks = session.tasks || [];
    if (!tasks.length) {
      taskListEl.innerHTML = '<div class="review-task-empty">No tasks in this session.</div>';
    } else {
      tasks.forEach(task => taskListEl.appendChild(buildTaskCard(session, task, paperclipDocsIndex)));
    }
    taskListEl.dataset.loaded = "1";
  } catch (e) {
    taskListEl.innerHTML = `<div class="review-task-error">Failed to load: ${esc(e.message)}</div>`;
  }
}

function buildTaskCard(session, task, paperclipDocsIndex = []) {
  const el = document.createElement("div");
  el.id = `task-${task.id}`;
  el.dataset.sessionId = session.id;
  const linkedDocs = getLinkedPaperclipDocs(session, task, paperclipDocsIndex);

  if (task.status !== "pending") {
    el.className = "review-task-card rq-task task-processed";
    el.innerHTML = buildProcessedTaskHTML(task, linkedDocs);
    return el;
  }

  const selectedSet = S.reviewSelected.get(session.id) || new Set();
  const isSelected  = selectedSet.has(task.id);
  el.className = `review-task-card rq-task${isSelected ? " selected" : ""}`;

  const diffMeta = reviewDiffMeta(task.diffStatus);
  const confPct = Math.round((task.confidence ?? 1) * 100);
  const confClass = confPct >= 80 ? "conf-high" : confPct >= 50 ? "conf-mid" : "conf-low";
  const matchHint = task.diffStatus !== "create_new" && task.matchReason
    ? `<div class="review-match-reason">${esc(task.matchReason)}</div>` : "";
  const reasoning = task.reasoning || task.description || task.sourceText || "";
  const boardLabel = reviewBoardName(task.targetBoardId);
  const dueLabel = task.deadline ? formatThaiDateTime(task.deadline) : "No due date";
  const paperclipContext = renderPaperclipReviewContext(session);
  const safety = reviewTaskSafety(session, task, confPct);
  const ownerHtml = task.owner
    ? `<span>${esc(task.owner)}</span>`
    : '<span class="review-owner-missing">No owner</span>';
  const riskLabel = safety.warnings.length ? safety.warnings[0] : "Ready";
  const riskLevel = safety.blockApproval ? "HIGH" : (task.diffStatus === "possible_duplicate" || confPct < 80 ? "MED" : "LOW");
  const mobileApproveLabel = safety.blockApproval ? "Resolve owner" : "Approve";
  const compactSub = [
    ownerHtml,
    `<span>${esc(dueLabel)}</span>`,
    task.matchReason ? `<span class="review-compact-muted">vs ${esc(task.matchReason)}</span>` : "",
  ].filter(Boolean).join('<span class="review-meta-dot">-</span>');
  if (safety.blockApproval) {
    el.classList.add("is-approval-blocked");
    el.dataset.approvalBlocked = "1";
  }

  el.innerHTML = `
    <div class="review-proposal-row">
      <input type="checkbox" class="review-task-checkbox" title="Select proposal" ${isSelected ? "checked" : ""}
        onchange="toggleReviewTaskSelect('${session.id}','${task.id}',this.checked)">
      <div class="review-proposal-main">
        <div class="review-task-title">${esc(task.title || "Untitled task")}</div>
        <div class="review-proposal-sub">${compactSub}</div>
      </div>
      <div class="review-proposal-diff">
        <span class="review-diff-badge ${diffMeta.className}">${diffMeta.icon}${diffMeta.label}</span>
        <span class="review-risk-pill ${safety.tone === "warning" ? "is-warning" : "is-ready"}">${esc(riskLabel)}</span>
      </div>
      <div class="review-proposal-target">
        ${esc(boardLabel)}
        <small>${task.targetListId ? esc(reviewListLabel(task)) : "No list"}</small>
      </div>
      <div class="review-conf-bar review-proposal-confidence" title="${confPct}% confidence">
        <div class="review-conf-track">
          <div class="review-conf-fill ${confClass}" style="width:${confPct}%"></div>
        </div>
        <span>${confPct}%</span>
      </div>
    </div>
    <div class="review-mobile-proposal">
      <div class="review-mobile-proposal-head">
        <div class="review-mobile-title">${esc(task.title || "Untitled task")}</div>
        <div class="review-mobile-diff"><span class="review-diff-badge ${diffMeta.className}">${diffMeta.icon}${diffMeta.label}</span></div>
      </div>
      <div class="review-mobile-proposal-grid">
        <div>
          <span>Owner</span>
          <strong>${task.owner ? esc(task.owner) : '<span class="review-owner-missing">none</span>'}</strong>
        </div>
        <div>
          <span>Target</span>
          <strong>${esc(boardLabel)}</strong>
        </div>
        <div>
          <span>Risk</span>
          ${renderReviewRiskMeter(riskLevel)}
        </div>
        <div>
          <span>Confidence</span>
          <div class="review-conf-bar review-mobile-confidence" title="${confPct}% confidence">
            <div class="review-conf-track"><div class="review-conf-fill ${confClass}" style="width:${confPct}%"></div></div>
            <strong>${confPct}%</strong>
          </div>
        </div>
      </div>
      <div class="review-mobile-actions">
        <button class="btn review-reject-btn" type="button" onclick="rejectReviewTask('${session.id}','${task.id}')">Reject</button>
        <button class="btn primary rq-approve-btn" type="button" onclick="approveReviewTask('${session.id}','${task.id}')" ${safety.blockApproval ? 'disabled title="Resolve missing owner, board, or list before approval."' : ""}>${esc(mobileApproveLabel)}</button>
      </div>
      <div class="review-mobile-safety-actions">
        <button class="btn btn-ghost btn-sm review-hold-btn" type="button" onclick="holdReviewTaskForEdit('${session.id}','${task.id}')">${icon("alert")} Hold / edit</button>
        <button class="btn btn-ghost btn-sm review-edit-btn" type="button" onclick="openReviewTaskDrawer('${session.id}','${task.id}')">${icon("edit")} Edit</button>
      </div>
    </div>
    <div class="review-task-expanded">
      <div class="review-task-header">
        <input type="checkbox" class="review-task-checkbox" ${isSelected ? "checked" : ""}
          onchange="toggleReviewTaskSelect('${session.id}','${task.id}',this.checked)">
        <div class="review-task-main">
          <div class="review-task-title">${esc(task.title || "Untitled task")}</div>
          <div class="review-task-badges">
            <span class="review-diff-badge ${diffMeta.className}">${diffMeta.icon}${diffMeta.label}</span>
            <div class="review-conf-bar" title="${confPct}% confidence">
              <div class="review-conf-track">
                <div class="review-conf-fill ${confClass}" style="width:${confPct}%"></div>
              </div>
              <span>${confPct}%</span>
            </div>
          </div>
          ${matchHint}
        </div>
      </div>
      ${paperclipContext}
      ${renderReviewTraceStrip(session)}
      ${renderReviewSafetyPanel(safety)}
      ${renderReviewApprovalGuard(task, safety)}
      <div class="review-task-meta-row">
        <span><span class="label">Owner</span>${esc(task.owner || "Unassigned")}</span>
        <span><span class="label">Due</span>${esc(dueLabel)}</span>
        <span><span class="label">Target</span>${esc(boardLabel)}${task.targetListId ? ` / ${esc(reviewListLabel(task))}` : ""}</span>
        <span><span class="label">Priority</span><span class="chip ${reviewPriorityClass(task.priority)}">${icon("flag")}${esc(task.priority || "medium")}</span></span>
      </div>
      ${reasoning ? `<div class="review-reasoning"><strong>AI:</strong> ${esc(reasoning)}</div>` : ""}
      ${renderLinkedPaperclipDocs(linkedDocs)}
      <div class="review-task-actions">
        <label class="review-toggle-label">
          <input type="checkbox" ${task.syncCalendar ? "checked" : ""}
            onchange="this.closest('label').querySelector('span').textContent=this.checked?'On':'Off';updateReviewField('${session.id}','${task.id}','syncCalendar',this.checked)">
          ${icon("calendar")} Calendar <span>${task.syncCalendar ? "On" : "Off"}</span>
        </label>
        <label class="review-toggle-label">
          <input type="checkbox" ${task.syncGoogleTasks ? "checked" : ""}
            onchange="this.closest('label').querySelector('span').textContent=this.checked?'On':'Off';updateReviewField('${session.id}','${task.id}','syncGoogleTasks',this.checked)">
          ${icon("inbox")} Google Tasks <span>${task.syncGoogleTasks ? "On" : "Off"}</span>
        </label>
        <div class="review-actions-spacer"></div>
        <button class="btn btn-ghost btn-sm review-hold-btn" type="button" onclick="holdReviewTaskForEdit('${session.id}','${task.id}')">${icon("alert")} Hold / edit</button>
        <button class="btn btn-ghost btn-sm review-edit-btn" type="button" onclick="openReviewTaskDrawer('${session.id}','${task.id}')">${icon("edit")} Edit</button>
        <button class="btn btn-danger btn-sm review-reject-btn" type="button" onclick="rejectReviewTask('${session.id}','${task.id}')">${icon("x")} Reject</button>
        <button class="btn btn-success btn-sm rq-approve-btn" type="button" onclick="approveReviewTask('${session.id}','${task.id}')" ${safety.blockApproval ? 'disabled title="Resolve missing owner, board, or list before approval."' : ""}>${icon("check")} Approve</button>
      </div>
    </div>
  `;

  return el;
}

function renderReviewRiskMeter(level) {
  const normalized = String(level || "LOW").toUpperCase();
  const active = normalized === "HIGH" ? 5 : normalized === "MED" ? 3 : 1;
  const bars = Array.from({ length: 5 }, (_, index) => `<i class="${index < active ? "is-on" : ""}"></i>`).join("");
  return `<div class="review-mobile-risk-meter is-${normalized.toLowerCase()}">${bars}<strong>${esc(normalized)}</strong></div>`;
}

function shortReviewRef(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.length > 24 ? `${text.slice(0, 10)}...${text.slice(-8)}` : text;
}

function reviewTaskSafety(session, task, confPct) {
  const missing = [];
  if (!String(task.owner || "").trim()) missing.push("owner");
  if (!task.targetBoardId) missing.push("board");
  if (!task.targetListId) missing.push("list");
  const duplicate = task.diffStatus === "possible_duplicate";
  const lowConfidence = confPct < 60;
  const paperclip = getPaperclipReviewMeta(session);
  const warnings = [];
  if (missing.length) warnings.push(`Missing ${missing.join(", ")}`);
  if (duplicate) warnings.push("Possible duplicate");
  if (lowConfidence) warnings.push(`Low confidence (${confPct}%)`);
  if (paperclip.isTestOrCanary) warnings.push("Paperclip test/canary");
  return {
    blockApproval: missing.length > 0,
    duplicate,
    lowConfidence,
    missing,
    paperclip,
    tone: missing.length || duplicate || lowConfidence || paperclip.isTestOrCanary ? "warning" : "ready",
    warnings,
  };
}

function reviewApprovalSideEffects(task) {
  const effects = [];
  if (task.targetBoardId && task.targetListId) {
    effects.push("Trello create/update");
  } else {
    effects.push("Trello write blocked until board/list is resolved");
  }
  if (task.syncCalendar) effects.push("Calendar sync if runtime is connected");
  if (task.syncGoogleTasks) effects.push("Google Tasks sync if runtime is connected");
  return effects;
}

function renderReviewSessionTrace(session, pendingTasks) {
  const source = formatReviewSource(session.source);
  const env = session.externalSource?.environment || "local";
  const request = shortReviewRef(session.requestId) || "No request";
  const run = shortReviewRef(session.agent?.runId) || "No run";
  const riskCount = (pendingTasks || []).filter(task => {
    const confPct = Math.round((task.confidence ?? 1) * 100);
    return reviewTaskSafety(session, task, confPct).tone === "warning";
  }).length;
  return `
    <div class="review-session-trace">
      <span>Source: ${esc(source)}</span>
      <span>Env: ${esc(env)}</span>
      <span>Request: ${esc(request)}</span>
      <span>Run: ${esc(run)}</span>
      <span class="${riskCount ? "is-warning" : "is-ready"}">Risk: ${riskCount ? `${riskCount} needs review` : "ready"}</span>
    </div>
  `;
}

function renderReviewTraceStrip(session) {
  const source = formatReviewSource(session.source);
  const env = session.externalSource?.environment || "local";
  const request = shortReviewRef(session.requestId) || "No request";
  const agent = session.agent?.agentName || session.agent?.agentRole || "No agent";
  const run = shortReviewRef(session.agent?.runId) || "No run";
  return `
    <div class="review-trace-strip" aria-label="Review trace metadata">
      <span>Source: ${esc(source)}</span>
      <span>Env: ${esc(env)}</span>
      <span>Request: ${esc(request)}</span>
      <span>Agent: ${esc(agent)}</span>
      <span>Run: ${esc(run)}</span>
    </div>
  `;
}

function renderReviewSafetyPanel(safety) {
  if (!safety.warnings.length) {
    return '<div class="review-safety-panel is-ready"><strong>Risk: ready for human decision</strong><span>Owner, board, and list are present. Confirm side effects before approval.</span></div>';
  }
  return `
    <div class="review-safety-panel is-warning">
      <strong>Risk: ${esc(safety.warnings.join(" / "))}</strong>
      <span>${safety.blockApproval ? "Resolve missing fields before approval. Hold or edit is the safe next action." : "Inspect the proposal before approval."}</span>
    </div>
  `;
}

function renderReviewApprovalGuard(task, safety) {
  const effects = reviewApprovalSideEffects(task);
  return `
    <div class="review-approval-guard ${safety.blockApproval ? "is-blocked" : ""}">
      <strong>Human approval required</strong>
      <span>${safety.blockApproval ? "human approval remains blocked until required target context is complete." : "External work runs only after human approval."}</span>
      <small>Side effects on approval: ${effects.map(esc).join("; ")}</small>
    </div>
  `;
}

function reviewDiffMeta(status) {
  if (status === "update_existing") return { className: "diff-update", label: "Update existing", icon: icon("gitMerge") };
  if (status === "possible_duplicate") return { className: "diff-duplicate", label: "Possible duplicate", icon: icon("alert") };
  return { className: "diff-create", label: "Create new", icon: icon("plus") };
}

function reviewPriorityClass(priority) {
  if (priority === "high") return "chip-high";
  if (priority === "low") return "chip-low";
  return "chip-med";
}

function formatReviewSource(source) {
  const map = {
    manual_upload: "Manual upload",
    discord: "Discord",
    paperclip_mock: "Paperclip mock",
    paperclip_webhook: "Paperclip live",
    paperclip_docs_mock: "Paperclip docs",
  };
  return map[source] || source || "Manual";
}

function getPaperclipReviewMeta(session) {
  const source = String(session?.source || "").toLowerCase();
  const externalSystem = String(session?.externalSource?.system || "").toLowerCase();
  const requestId = String(session?.requestId || "").toLowerCase();
  const agentRole = String(session?.agent?.agentRole || "").toLowerCase();
  const title = String(session?.title || "").toLowerCase();
  const auditTypes = (session?.auditTrail || []).map(event => String(event.type || "").toLowerCase());
  const isPaperclip = source.startsWith("paperclip_")
    || externalSystem === "paperclip"
    || requestId.startsWith("pc_")
    || auditTypes.some(type => type.startsWith("paperclip_"));
  const isTestOrCanary = /^(pc_live_interop_|pc_interop_|pc_canary_|pc_live_canary_|pc_daily_monitor_|pc_monitor_|pc_standing_|pc_true_external_|pc_w3_03_|pc_cleanup_)/.test(requestId)
    || /^(interop_test|canary|daily_monitor|monitor|live_canary)$/.test(agentRole)
    || /(live interop|interop test|canary|daily monitor|monitor canary|standing observation)/.test(title);
  return {
    isPaperclip,
    isTestOrCanary,
    isCleanupEligible: isPaperclip && isTestOrCanary && session?.paperclipCleanup?.status !== "cleaned",
    label: isTestOrCanary ? "Paperclip test/canary" : "Paperclip live work",
  };
}

function isPaperclipCleanupLocked(session) {
  return session?.paperclipCleanup?.status === "cleaned" && getPaperclipReviewMeta(session).isPaperclip;
}

function renderPaperclipReviewContext(session) {
  const meta = getPaperclipReviewMeta(session);
  if (!meta.isPaperclip) return "";
  const requestId = session.requestId || "No request ID";
  const agentRunId = session.agent?.runId || "No agent run ID";
  const env = session.externalSource?.environment || "unknown env";
  const helpText = meta.isTestOrCanary
    ? "This is test/canary Paperclip work. Use cleanup or reject, do not approve into external tools."
    : "This is real Paperclip work. Keep human approval before any Trello, Calendar, or Google Tasks side effect.";
  return `
    <div class="review-paperclip-context ${meta.isTestOrCanary ? "is-test" : "is-live"}">
      <strong>${esc(meta.label)}</strong>
      <span>${esc(helpText)}</span>
      <small>Request ${esc(requestId)} - Run ${esc(agentRunId)} - ${esc(env)}</small>
    </div>
  `;
}

function reviewBoardName(boardId) {
  if (!boardId) return "No board selected";
  return S.boards.find(b => b.id === boardId)?.name || "Selected board";
}

function reviewListLabel(task) {
  return task.targetListName || task.listName || "Selected list";
}

function buildProcessedTaskHTML(task, linkedDocs = []) {
  const approved  = task.status === "approved";
  const color     = approved ? "var(--success)" : "var(--text-faint)";
  const label     = approved ? "Approved" : "Rejected";
  const trelloTip = approved && task.trelloCardId
    ? `<span class="review-processed-sync">Trello card synced</span>` : "";
  const showReason = task.matchReason &&
    (task.diffStatus === "update_existing" || task.diffStatus === "possible_duplicate");
  const reasonTip = showReason
    ? `<div class="review-processed-reason">${esc(task.matchReason)}</div>` : "";
  return `
    <div class="review-processed-row">
      <span class="review-processed-icon" style="color:${color}">${approved ? icon("check") : icon("x")}</span>
      <div class="review-processed-copy">
        <div class="review-processed-title">${esc(task.title)}</div>
        <div class="review-processed-meta">
          <span style="color:${color};font-weight:700">${label}</span>
          ${task.owner ? `<span>${esc(task.owner)}</span>` : ""}
          ${trelloTip}
        </div>
        ${reasonTip}
        ${renderLinkedPaperclipDocs(linkedDocs)}
      </div>
    </div>
  `;
}

async function loadPaperclipDocsIndex() {
  if (Array.isArray(S.paperclipDocsIndex)) return S.paperclipDocsIndex;
  try {
    const payload = await api.get("/api/integrations/paperclip/mock/docs");
    S.paperclipDocsIndex = Array.isArray(payload.documents) ? payload.documents : [];
  } catch (_error) {
    S.paperclipDocsIndex = [];
  }
  return S.paperclipDocsIndex;
}

function getLinkedPaperclipDocs(session, task, docsIndex) {
  if (!session?.requestId || !task?.externalTaskId || !Array.isArray(docsIndex)) return [];
  return docsIndex
    .filter(doc => (doc.linkedTasks || []).some(link =>
      link.requestId === session.requestId && link.externalTaskId === task.externalTaskId
    ))
    .map(doc => ({
      artifactId: doc.artifactId,
      title: doc.title,
      status: doc.status,
      artifactType: doc.artifactType,
      agentName: doc.agent?.agentName,
      agentRunId: doc.agent?.runId,
      sourceSystem: "paperclip",
    }));
}

function renderLinkedPaperclipDocs(linkedDocs) {
  if (!linkedDocs.length) return "";
  return `
    <div class="review-linked-docs">
      <span class="review-linked-docs-label">${icon("layout")} Paperclip docs</span>
      ${linkedDocs.map(doc => `
        <button type="button" class="review-linked-doc" onclick="openLinkedPaperclipDoc('${esc(doc.artifactId)}')">
          <span>${esc(doc.title || doc.artifactId)}</span>
          <small class="review-linked-doc-meta">
            <span>Open in Docs</span>
            <span>Type: ${esc(formatDocsLabel(doc.artifactType || "document"))}</span>
            <span>Status: ${esc(formatDocsLabel(doc.status || "ready"))}</span>
            <span>Run: ${esc(doc.agentRunId || "No agent run")}</span>
            <span>Agent: ${esc(doc.agentName || "Paperclip agent")}</span>
          </small>
        </button>
      `).join("")}
    </div>
  `;
}

function openLinkedPaperclipDoc(artifactId) {
  S.docsSelectedArtifactId = artifactId;
  navigateTo("docs");
}

function expandLinkedReviewSession(sessions) {
  const link = S.pendingReviewTaskLink;
  if (!link?.requestId || !Array.isArray(sessions)) return;
  const session = sessions.find(item => item.requestId === link.requestId);
  if (session?.id) S.reviewExpanded.add(session.id);
}

function focusPendingReviewTaskLink(sessions) {
  const link = S.pendingReviewTaskLink;
  if (!link?.requestId || !link?.externalTaskId || !Array.isArray(sessions)) return;
  const session = sessions.find(item => item.requestId === link.requestId);
  if (!session?.id) {
    toast("Linked Review Queue task is not available in this local store", true);
    return;
  }

  setTimeout(async () => {
    const taskList = $(`task-list-${session.id}`);
    if (taskList && !taskList.dataset.loaded) await loadSessionTasks(session.id, taskList);
    const latest = await api.get(`/api/reviews/${session.id}`);
    const task = (latest.tasks || []).find(item => item.externalTaskId === link.externalTaskId);
    const taskEl = task ? $(`task-${task.id}`) : null;
    if (taskEl) {
      taskEl.scrollIntoView({ behavior: "smooth", block: "center" });
      taskEl.classList.add("review-task-linked-focus");
      setTimeout(() => taskEl.classList.remove("review-task-linked-focus"), 2400);
    }
    S.pendingReviewTaskLink = null;
  }, 120);
}

// Review drawer foundation shared by V0.2-W2-02 and later W2 task surfaces.
function ensureReviewDrawerHost() {
  if ($("review-drawer-host")) return;
  const host = document.createElement("div");
  host.id = "review-drawer-host";
  document.body.appendChild(host);
}

async function openReviewTaskDrawer(sessionId, taskId) {
  ensureReviewDrawerHost();
  try {
    const session = await api.get(`/api/reviews/${sessionId}`);
    const task = (session.tasks || []).find(t => t.id === taskId);
    if (!task) throw new Error("Task not found");
    S.reviewDrawer = { sessionId, taskId, task: { ...task } };
    renderReviewTaskDrawer();
  } catch (e) {
    toast("Failed to open task: " + e.message, true);
  }
}

function closeReviewTaskDrawer() {
  S.reviewDrawer = null;
  const host = $("review-drawer-host");
  if (host) host.innerHTML = "";
}

function renderReviewTaskDrawer() {
  const host = $("review-drawer-host");
  if (!host || !S.reviewDrawer?.task) return;
  const { sessionId, taskId, task } = S.reviewDrawer;
  const boardOptions = [
    `<option value="">No board selected</option>`,
    ...S.boards.map(b => `<option value="${b.id}" ${b.id === task.targetBoardId ? "selected" : ""}>${esc(b.name)}</option>`),
  ].join("");
  const priorityOptions = ["low","medium","high"].map(p =>
    `<option value="${p}" ${p === (task.priority || "medium") ? "selected" : ""}>${p[0].toUpperCase() + p.slice(1)}</option>`
  ).join("");

  host.innerHTML = `
    <div class="review-drawer-back show" onclick="if(event.target===this) closeReviewTaskDrawer()">
    <aside class="review-drawer show" role="dialog" aria-modal="true" aria-label="Edit review task" onclick="event.stopPropagation()">
      <div class="review-drawer-header">
        <div class="review-drawer-dot"></div>
        <h2>Edit review task</h2>
        <button class="btn btn-icon" type="button" onclick="closeReviewTaskDrawer()" title="Close">${icon("x")}</button>
      </div>
      <div class="review-drawer-body">
        <div class="review-field">
          <label class="review-field-label" for="review-drawer-title">Title</label>
          <input id="review-drawer-title" type="text" class="review-field-input" value="${esc(task.title)}"
            onchange="changeReviewDrawerField('title', this.value)">
        </div>
        <div class="review-field">
          <label class="review-field-label" for="review-drawer-owner">Owner</label>
          <input id="review-drawer-owner" type="text" class="review-field-input" value="${esc(task.owner || "")}" placeholder="Unassigned"
            onchange="changeReviewDrawerField('owner', this.value)">
        </div>
        <div class="review-field-row">
          <div class="review-field">
            <label class="review-field-label" for="review-drawer-deadline">Deadline</label>
            <input id="review-drawer-deadline" type="datetime-local" class="review-field-input" value="${formatISOForInput(task.deadline)}"
              onchange="changeReviewDrawerField('deadline', this.value ? parseInputToUTC(this.value) : null)">
          </div>
          <div class="review-field">
            <label class="review-field-label" for="review-drawer-priority">Priority</label>
            <select id="review-drawer-priority" class="review-field-select"
              onchange="changeReviewDrawerField('priority', this.value)">${priorityOptions}</select>
          </div>
        </div>
        <div class="review-field-row">
          <div class="review-field">
            <label class="review-field-label" for="review-drawer-board">Board</label>
            <select id="review-drawer-board" class="review-field-select"
              onchange="onReviewDrawerBoardChange(this.value)">${boardOptions}</select>
          </div>
          <div class="review-field">
            <label class="review-field-label" for="review-drawer-list">List</label>
            <select id="review-drawer-list" class="review-field-select"
              onchange="changeReviewDrawerField('targetListId', this.value)">
              <option value="">${task.targetBoardId ? "Loading lists..." : "Select board first"}</option>
            </select>
          </div>
        </div>
        <div class="review-drawer-sync">
          <label class="review-toggle-label">
            <input type="checkbox" ${task.syncCalendar ? "checked" : ""}
              onchange="changeReviewDrawerField('syncCalendar', this.checked)">
            ${icon("calendar")} Sync to Calendar
          </label>
          <label class="review-toggle-label">
            <input type="checkbox" ${task.syncGoogleTasks ? "checked" : ""}
              onchange="changeReviewDrawerField('syncGoogleTasks', this.checked)">
            ${icon("inbox")} Sync to Google Tasks
          </label>
        </div>
        ${task.matchReason ? `<div class="review-reasoning"><strong>Match:</strong> ${esc(task.matchReason)}</div>` : ""}
        ${(task.reasoning || task.description || task.sourceText) ? `<div class="review-reasoning"><strong>AI:</strong> ${esc(task.reasoning || task.description || task.sourceText)}</div>` : ""}
      </div>
      <div class="review-drawer-footer">
        <button class="btn btn-danger" type="button" onclick="rejectReviewTask('${sessionId}','${taskId}')">${icon("x")} Reject</button>
        <div class="review-actions-spacer"></div>
        <button class="btn btn-ghost" type="button" onclick="closeReviewTaskDrawer()">Close</button>
        <button class="btn btn-success" type="button" onclick="approveReviewTask('${sessionId}','${taskId}')">${icon("check")} Approve</button>
      </div>
    </aside>
    </div>
  `;

  if (task.targetBoardId) loadReviewDrawerLists(task.targetBoardId, task.targetListId);
  setTimeout(() => $("review-drawer-title")?.focus(), 40);
}

async function changeReviewDrawerField(field, value) {
  const drawer = S.reviewDrawer;
  if (!drawer) return;
  drawer.task[field] = value;
  await updateReviewField(drawer.sessionId, drawer.taskId, field, value);
  refreshReviewTaskCard(drawer.sessionId, drawer.taskId);
}

async function onReviewDrawerBoardChange(boardId) {
  const drawer = S.reviewDrawer;
  if (!drawer) return;
  drawer.task.targetBoardId = boardId;
  drawer.task.targetListId = "";
  await updateReviewField(drawer.sessionId, drawer.taskId, "targetBoardId", boardId);
  await updateReviewField(drawer.sessionId, drawer.taskId, "targetListId", "");
  const listSel = $("review-drawer-list");
  if (!listSel) return;
  if (!boardId) {
    listSel.innerHTML = '<option value="">Select board first</option>';
    refreshReviewTaskCard(drawer.sessionId, drawer.taskId);
    return;
  }
  await loadReviewDrawerLists(boardId, "");
  refreshReviewTaskCard(drawer.sessionId, drawer.taskId);
}

async function loadReviewDrawerLists(boardId, selectedListId) {
  const listSel = $("review-drawer-list");
  if (!listSel) return;
  listSel.innerHTML = '<option value="">Loading...</option>';
  try {
    const lists = await api.get(`/api/boards/${boardId}/lists`);
    listSel.innerHTML = '<option value="">No list selected</option>' +
      lists.map(l => `<option value="${l.id}" ${l.id === selectedListId ? "selected" : ""}>${esc(l.name)}</option>`).join("");
  } catch {
    listSel.innerHTML = '<option value="">Failed to load lists</option>';
  }
}

async function refreshReviewTaskCard(sessionId, taskId) {
  const taskEl = $(`task-${taskId}`);
  if (!taskEl) return;
  try {
    const session = await api.get(`/api/reviews/${sessionId}`);
    const task = (session.tasks || []).find(t => t.id === taskId);
    if (!task) return;
    const fresh = buildTaskCard(session, task);
    taskEl.replaceWith(fresh);
  } catch (_) {}
}

// Review: session expand/collapse
function toggleReviewSession(sessionId) {
  const taskList = $(`task-list-${sessionId}`);
  if (!taskList) return;
  const card = $(`session-${sessionId}`);
  const btn  = card?.querySelector(".review-expand-btn");
  const isOpen = taskList.style.display !== "none";

  if (isOpen) {
    S.reviewExpanded.delete(sessionId);
    taskList.style.display = "none";
    card?.classList.remove("active");
    if (btn) btn.textContent = "Review";
  } else {
    S.reviewExpanded.add(sessionId);
    taskList.style.display = "";
    card?.classList.add("active");
    if (btn) btn.textContent = "Collapse";
    if (!taskList.dataset.loaded) loadSessionTasks(sessionId, taskList);
  }
}

// Review: field update (auto-save on change)
async function updateReviewField(sessionId, taskId, field, value) {
  try {
    await api.put(`/api/reviews/${sessionId}/tasks/${taskId}`, { [field]: value });
  } catch (e) {
    toast("Save failed: " + e.message, true);
  }
}

async function onReviewBoardChange(sessionId, taskId, boardId) {
  updateReviewField(sessionId, taskId, "targetBoardId", boardId);
  updateReviewField(sessionId, taskId, "targetListId",  "");
  const listSel = $(`list-sel-${taskId}`);
  if (!listSel) return;
  if (!boardId) { listSel.innerHTML = '<option value="">Select board first</option>'; return; }
  listSel.innerHTML = '<option value="">Loading...</option>';
  try {
    const lists = await api.get(`/api/boards/${boardId}/lists`);
    listSel.innerHTML = '<option value="">Select List</option>' +
      lists.map(l => `<option value="${l.id}">${esc(l.name)}</option>`).join("");
  } catch { listSel.innerHTML = '<option value="">Failed to load</option>'; }
}

// Review: single approve / reject
async function approveReviewTask(sessionId, taskId) {
  const taskEl = $(`task-${taskId}`);
  if (!taskEl) return;
  if (taskEl.dataset.approvalBlocked === "1") {
    toast("Resolve missing owner, board, or list before approval. Use Hold / edit.", true);
    return;
  }
  const sideEffects = taskEl.querySelector(".review-approval-guard small")?.textContent
    || "Side effects on approval: Trello, Calendar, or Google Tasks may be updated when enabled.";
  if (!confirm(`Approve this Review Queue task?\n\n${sideEffects}\n\nA human approval is required before any external write runs.`)) return;
  const appBtn = taskEl.querySelector(".rq-approve-btn");
  if (appBtn) { appBtn.textContent = "Approving..."; appBtn.disabled = true; }
  try {
    const result = await api.post(`/api/reviews/${sessionId}/tasks/${taskId}/approve`);
    taskEl.className = "review-task-card task-processed";
    taskEl.innerHTML = buildProcessedTaskHTML(result);
    if (S.reviewDrawer?.taskId === taskId) closeReviewTaskDrawer();
    _cleanupAfterAction(sessionId, taskId);
    const msg = result.trello?.ok       ? "Approved and pushed to Trello"
              : result.trello?.skipped  ? "Approved (no board/list set)"
              : `Approved${result.trello?.error ? " (Trello: " + result.trello.error + ")" : ""}`;
    toast(msg, !!result.trello?.error);
  } catch (e) {
    toast("Error: " + e.message, true);
    if (appBtn) { appBtn.innerHTML = `${icon("check")} Approve`; appBtn.disabled = false; }
  }
}

function holdReviewTaskForEdit(sessionId, taskId) {
  toast("Held for reviewer edit. No external action ran.");
  openReviewTaskDrawer(sessionId, taskId);
}

async function rejectReviewTask(sessionId, taskId) {
  const taskEl = $(`task-${taskId}`);
  if (!taskEl) return;
  const rejBtn = taskEl.querySelector(".btn-danger");
  if (rejBtn) { rejBtn.textContent = "Rejecting..."; rejBtn.disabled = true; }
  try {
    const result = await api.post(`/api/reviews/${sessionId}/tasks/${taskId}/reject`);
    taskEl.className = "review-task-card task-processed";
    taskEl.innerHTML = buildProcessedTaskHTML(result);
    if (S.reviewDrawer?.taskId === taskId) closeReviewTaskDrawer();
    _cleanupAfterAction(sessionId, taskId);
    toast("Task rejected");
  } catch (e) {
    toast("Error: " + e.message, true);
    if (rejBtn) { rejBtn.innerHTML = `${icon("x")} Reject`; rejBtn.disabled = false; }
  }
}

async function cleanupPaperclipTestSession(sessionId) {
  const card = $(`session-${sessionId}`);
  const title = card?.querySelector(".review-session-title")?.textContent || "this Paperclip test session";
  if (!confirm(`Cleanup ${title}? Pending test tasks will be rejected and kept for audit. No Trello, Calendar, or Google Tasks actions will run.`)) return;
  const btn = card?.querySelector(".review-session-controls .btn-danger");
  if (btn) {
    btn.textContent = "Cleaning...";
    btn.disabled = true;
  }
  try {
    const result = await api.post(`/api/reviews/${sessionId}/paperclip-test-cleanup`, {
      reason: "Reviewer cleanup of Paperclip test/canary Review Queue artifacts",
    });
    S.reviewSelected.delete(sessionId);
    S.reviewExpanded.add(sessionId);
    toast(`Cleaned ${result.paperclipCleanup?.cleanedTaskCount || 0} Paperclip test task${result.paperclipCleanup?.cleanedTaskCount === 1 ? "" : "s"}`);
    await showReviewPage();
  } catch (e) {
    toast("Cleanup failed: " + e.message, true);
    if (btn) {
      btn.innerHTML = `${icon("x")} Cleanup test`;
      btn.disabled = false;
    }
  }
}

function _cleanupAfterAction(sessionId, taskId) {
  const sel = S.reviewSelected.get(sessionId);
  if (sel) sel.delete(taskId);
  updateBulkBar();
  refreshSessionHeader(sessionId);
  updateReviewBadge().catch(() => {});
}

// Review: bulk selection
function toggleReviewTaskSelect(sessionId, taskId, checked) {
  if (!S.reviewSelected.has(sessionId)) S.reviewSelected.set(sessionId, new Set());
  const sel = S.reviewSelected.get(sessionId);
  checked ? sel.add(taskId) : sel.delete(taskId);
  const taskEl = $(`task-${taskId}`);
  if (taskEl) taskEl.classList.toggle("selected", checked);
  taskEl?.querySelectorAll(".review-task-checkbox").forEach(cb => { cb.checked = checked; });
  updateBulkBar();
}

function toggleSelectAllSession(sessionId, checked) {
  const taskList = $(`task-list-${sessionId}`);
  if (!taskList) return;
  if (!S.reviewSelected.has(sessionId)) S.reviewSelected.set(sessionId, new Set());
  const sel = S.reviewSelected.get(sessionId);
  taskList.querySelectorAll(".review-task-card:not(.task-processed)").forEach(el => {
    const tid = el.id.replace("task-", "");
    checked ? sel.add(tid) : sel.delete(tid);
    el.classList.toggle("selected", checked);
    el.querySelectorAll(".review-task-checkbox").forEach(cb => { cb.checked = checked; });
  });
  updateBulkBar();
}

function updateBulkBar() {
  let total = 0;
  S.reviewSelected.forEach(sel => { total += sel.size; });
  const bar = $("review-bulk-bar");
  if (!bar) return;
  bar.classList.remove("hidden");
  const countEl = $("review-bulk-count");
  if (countEl) countEl.textContent = String(total);
  const activeSessions = [...S.reviewSelected.values()].filter(sel => sel.size).length;
  const contextEl = $("review-bulk-context");
  if (contextEl) contextEl.textContent = `selected \u00b7 across ${activeSessions || "Review Queue"}${activeSessions === 1 ? " session" : activeSessions > 1 ? " sessions" : ""}`;
  bar.querySelectorAll("[data-bulk-action]").forEach(btn => { btn.disabled = total === 0; });
}

async function bulkApproveReview() {
  const bar = $("review-bulk-bar");
  if (bar) {
    const btn = bar.querySelector("[data-bulk-action='approve']");
    if (btn) { btn.textContent = "Approving..."; btn.disabled = true; }
  }
  try {
    let selectedCount = 0;
    const blocked = [];
    S.reviewSelected.forEach(taskIds => {
      selectedCount += taskIds.size;
      taskIds.forEach(taskId => {
        const taskEl = $(`task-${taskId}`);
        if (taskEl?.dataset.approvalBlocked === "1") blocked.push(taskId);
      });
    });
    if (blocked.length) {
      toast(`Resolve missing fields before approving ${blocked.length} selected task${blocked.length === 1 ? "" : "s"}.`, true);
      if (bar) {
        const btn = bar.querySelector("[data-bulk-action='approve']");
        if (btn) { btn.innerHTML = `${icon("check")} Approve&hellip;`; btn.disabled = false; }
      }
      return;
    }
    if (!confirm(`Approve ${selectedCount} selected Review Queue task${selectedCount === 1 ? "" : "s"}?\n\nApproval can create or update Trello, Calendar, or Google Tasks records when each selected item has those side effects enabled.`)) {
      if (bar) {
        const btn = bar.querySelector("[data-bulk-action='approve']");
        if (btn) { btn.innerHTML = `${icon("check")} Approve&hellip;`; btn.disabled = false; }
      }
      return;
    }
    const ops = [];
    S.reviewSelected.forEach((taskIds, sessionId) => {
      if (taskIds.size) ops.push(
        api.post(`/api/reviews/${sessionId}/approve-bulk`, { taskIds: [...taskIds] })
           .then(results => ({ sessionId, results }))
      );
    });
    const allRes = await Promise.all(ops);
    allRes.forEach(({ sessionId, results }) => {
      results.forEach(r => {
        if (!r.ok) return;
        const el = $(`task-${r.taskId}`);
        if (!el) return;
        const title = el.querySelector(".review-task-title")?.textContent || "";
        el.className = "review-task-card task-processed";
        el.innerHTML = buildProcessedTaskHTML({ title, status: "approved", trelloCardId: r.trelloCardId });
      });
      refreshSessionHeader(sessionId);
    });
    S.reviewSelected.clear();
    updateBulkBar();
    updateReviewBadge().catch(() => {});
    toast("Bulk approve complete");
  } catch (e) {
    toast("Bulk approve failed: " + e.message, true);
    if (bar) {
      const btn = bar.querySelector("[data-bulk-action='approve']");
      if (btn) { btn.innerHTML = `${icon("check")} Approve&hellip;`; btn.disabled = false; }
    }
  }
}

async function bulkRejectReview() {
  const bar = $("review-bulk-bar");
  if (bar) {
    const btn = bar.querySelector("[data-bulk-action='reject']");
    if (btn) { btn.textContent = "Rejecting..."; btn.disabled = true; }
  }
  try {
    const ops = [];
    S.reviewSelected.forEach((taskIds, sessionId) => {
      if (taskIds.size) ops.push(
        api.post(`/api/reviews/${sessionId}/reject-bulk`, { taskIds: [...taskIds] })
           .then(results => ({ sessionId, results }))
      );
    });
    const allRes = await Promise.all(ops);
    allRes.forEach(({ sessionId, results }) => {
      results.forEach(r => {
        if (!r.ok) return;
        const el = $(`task-${r.taskId}`);
        if (!el) return;
        const title = el.querySelector(".review-task-title")?.textContent || "";
        el.className = "review-task-card task-processed";
        el.innerHTML = buildProcessedTaskHTML({ title, status: "rejected" });
      });
      refreshSessionHeader(sessionId);
    });
    S.reviewSelected.clear();
    updateBulkBar();
    updateReviewBadge().catch(() => {});
    toast("Bulk reject complete");
  } catch (e) {
    toast("Bulk reject failed: " + e.message, true);
    if (bar) {
      const btn = bar.querySelector("[data-bulk-action='reject']");
      if (btn) { btn.innerHTML = `${icon("x")} Reject&hellip;`; btn.disabled = false; }
    }
  }
}

// Review: session header refresh + dismiss
async function refreshSessionHeader(sessionId) {
  try {
    const session = await api.get(`/api/reviews/${sessionId}`);
    const card = $(`session-${sessionId}`);
    if (!card) return;
    const oldHdr = card.querySelector(".review-session-header");
    if (!oldHdr) return;
    const newCard = buildSessionCard(session);
    oldHdr.replaceWith(newCard.querySelector(".review-session-header"));
  } catch (_) {}
}

async function dismissReviewSession(sessionId) {
  if (!confirm("Dismiss this session? It will be removed from the queue.")) return;
  try {
    await api.del(`/api/reviews/${sessionId}`);
    const card = $(`session-${sessionId}`);
    if (card) card.remove();
    S.reviewExpanded.delete(sessionId);
    S.reviewSelected.delete(sessionId);
    updateReviewBadge().catch(() => {});
    toast("Session dismissed");
    const root = $("review-page-root");
    if (root && !root.querySelector(".review-session-card")) showReviewPage();
  } catch (e) { toast(e.message, true); }
}

// Review: sidebar badge
async function updateReviewBadge() {
  const sessions = await api.get("/api/reviews");
  const count = sessions.reduce((n, s) => n + (s.tasks || []).filter(t => t.status === "pending").length, 0);
  const badges = [
    $("review-badge"),
    ...document.querySelectorAll("[data-review-badge]"),
  ].filter(Boolean);
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "" : "none";
  });
}

// Review: transcript upload modal
function openTranscriptModal() {
  $("transcript-title").value = "";
  $("transcript-text").value = "";
  if (typeof openSurface === "function") openSurface($("transcript-modal"), "#transcript-title");
  else {
    $("transcript-modal").classList.remove("hidden");
    $("transcript-title").focus();
  }
}

function closeTranscriptModal() {
  if (typeof closeSurface === "function") closeSurface($("transcript-modal"), "#review-topbar-upload");
  else $("transcript-modal").classList.add("hidden");
}

async function submitTranscript() {
  const title      = $("transcript-title").value.trim();
  const transcript = $("transcript-text").value.trim();
  if (!title) { $("transcript-title").focus(); toast("Meeting title required", true); return; }

  const btn = $("transcript-submit-btn");
  btn.textContent = "Creating...";
  btn.disabled = true;

  try {
    await api.post("/api/reviews", {
      title,
      source:     "manual_upload",
      transcript,
      summary:    transcript.slice(0, 200),
      tasks: [
        { title: "Review and extract action items from meeting notes",
          description: transcript.slice(0, 300), priority: "high" },
        { title: "Follow up on discussed items",
          description: "", priority: "medium" },
        { title: "Schedule next meeting if needed",
          description: "", priority: "low" },
      ],
    });
    closeTranscriptModal();
    toast("Session created");
    await showReviewPage();
  } catch (e) {
    toast("Error: " + e.message, true);
  } finally {
    btn.textContent = "Create Session";
    btn.disabled = false;
  }
}
