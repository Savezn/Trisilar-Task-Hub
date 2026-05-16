// Review Queue Page
// V0.2-W2-02 - Implemented by Codex Dev.
async function showReviewPage() {
  S.mode = "review";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Review Queue";
  $("board-subtitle").textContent = "AI-extracted tasks waiting for approval";
  $("add-list-btn").classList.add("hidden");

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
  if (!S.reviewExpanded.size && sessions.length) {
    const firstActionable = sessions.find(s => (s.tasks || []).some(t => t.status === "pending")) || sessions[0];
    if (firstActionable) S.reviewExpanded.add(firstActionable.id);
  }

  page.appendChild(buildReviewHeader(counts));
  page.appendChild(buildReviewSummary(counts));

  if (!sessions.length) {
    page.appendChild(buildReviewEmptyState());
    content.innerHTML = "";
    content.appendChild(page);
    ensureReviewDrawerHost();
    return;
  }

  page.appendChild(buildBulkBar());

  const sessionsWrap = document.createElement("div");
  sessionsWrap.className = "review-sessions";
  sessions.forEach(session => sessionsWrap.appendChild(buildSessionCard(session)));
  page.appendChild(sessionsWrap);

  content.innerHTML = "";
  content.appendChild(page);
  ensureReviewDrawerHost();
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

function buildReviewHeader(counts) {
  const hdr = document.createElement("div");
  hdr.className = "review-command-header";
  hdr.innerHTML = `
    <div class="review-command-copy">
      <div class="review-kicker">${icon("sparkles")} AI review queue</div>
      <h1 class="review-title">Review Queue</h1>
      <p class="review-subtitle">${counts.pending} task${counts.pending !== 1 ? "s" : ""} awaiting approval across ${counts.sessions} session${counts.sessions !== 1 ? "s" : ""}</p>
    </div>
    <div class="review-header-actions">
      <button class="btn btn-primary" onclick="openTranscriptModal()">${icon("upload")} New session</button>
    </div>
  `;
  return hdr;
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

function buildReviewEmptyState() {
  const empty = document.createElement("div");
  empty.className = "empty-state review-empty-state";
  empty.innerHTML = `
    <div class="empty-icon">${icon("sparkles")}</div>
    <h3>No review sessions yet</h3>
    <p>Upload a meeting transcript to extract tasks automatically, or add a session manually.</p>
    <button class="btn btn-primary" style="margin-top:12px" onclick="openTranscriptModal()">${icon("upload")} Upload transcript</button>
  `;
  return empty;
}

function buildBulkBar() {
  const bulkBar = document.createElement("div");
  bulkBar.className = "review-bulk-bar hidden";
  bulkBar.id = "review-bulk-bar";
  bulkBar.innerHTML = `
    <span id="review-bulk-count">0 selected</span>
    <div class="review-bulk-actions">
      <button class="btn btn-success btn-sm" onclick="bulkApproveReview()">${icon("check")} Approve selected</button>
      <button class="btn btn-danger btn-sm" onclick="bulkRejectReview()">${icon("x")} Reject selected</button>
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
  const sourceIcon = paperclipMeta.isPaperclip ? icon("gitMerge") : icon("upload");
  const paperclipBadge = paperclipMeta.isPaperclip
    ? `<span class="chip ${paperclipMeta.isTestOrCanary ? "chip-paperclip-test" : "chip-paperclip-live"}">${esc(paperclipMeta.label)}</span>`
    : "";
  const cleanupBadge = session.paperclipCleanup?.status === "cleaned"
    ? `<span class="chip chip-cleanup">Cleanup archived</span>`
    : "";
  const dismissLocked = isPaperclipCleanupLocked(session);
  const cleanupButton = paperclipMeta.isCleanupEligible && pendingTasks.length
    ? `<button class="btn btn-danger btn-sm" onclick="cleanupPaperclipTestSession('${session.id}')">${icon("x")} Cleanup test</button>`
    : "";

  const card = document.createElement("div");
  card.className = `review-session-card${expanded ? " active" : ""}`;
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
    </div>
    <div class="review-session-controls">
      ${pendingTasks.length  ? `<span class="chip chip-review">${pendingTasks.length} pending</span>` : ""}
      ${approvedTasks.length ? `<span class="chip chip-done">${approvedTasks.length} approved</span>` : ""}
      ${rejectedTasks.length ? `<span class="chip chip-muted">${rejectedTasks.length} rejected</span>` : ""}
      <button class="btn btn-ghost btn-sm review-expand-btn" onclick="toggleReviewSession('${session.id}')">
        ${expanded ? "Collapse" : "Review"}
      </button>
      ${cleanupButton}
      ${allProcessed && !dismissLocked
        ? `<button class="btn btn-ghost btn-sm" style="color:var(--text-muted)" onclick="dismissReviewSession('${session.id}')">${icon("x")} Dismiss</button>`
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
    el.className = "review-task-card task-processed";
    el.innerHTML = buildProcessedTaskHTML(task, linkedDocs);
    return el;
  }

  const selectedSet = S.reviewSelected.get(session.id) || new Set();
  const isSelected  = selectedSet.has(task.id);
  el.className = `review-task-card${isSelected ? " selected" : ""}`;

  const diffMeta = reviewDiffMeta(task.diffStatus);
  const confPct = Math.round((task.confidence ?? 1) * 100);
  const confClass = confPct >= 80 ? "conf-high" : confPct >= 50 ? "conf-mid" : "conf-low";
  const matchHint = task.diffStatus !== "create_new" && task.matchReason
    ? `<div class="review-match-reason">${esc(task.matchReason)}</div>` : "";
  const reasoning = task.reasoning || task.description || task.sourceText || "";
  const boardLabel = reviewBoardName(task.targetBoardId);
  const dueLabel = task.deadline ? formatThaiDateTime(task.deadline) : "No due date";
  const paperclipContext = renderPaperclipReviewContext(session);

  el.innerHTML = `
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
      <button class="btn btn-ghost btn-sm" onclick="openReviewTaskDrawer('${session.id}','${task.id}')">${icon("edit")} Edit</button>
      <button class="btn btn-danger btn-sm" onclick="rejectReviewTask('${session.id}','${task.id}')">${icon("x")} Reject</button>
      <button class="btn btn-success btn-sm rq-approve-btn" onclick="approveReviewTask('${session.id}','${task.id}')">${icon("check")} Approve</button>
    </div>
  `;

  return el;
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
        <button class="btn btn-icon" onclick="closeReviewTaskDrawer()" title="Close">${icon("x")}</button>
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
        <button class="btn btn-danger" onclick="rejectReviewTask('${sessionId}','${taskId}')">${icon("x")} Reject</button>
        <div class="review-actions-spacer"></div>
        <button class="btn btn-ghost" onclick="closeReviewTaskDrawer()">Close</button>
        <button class="btn btn-success" onclick="approveReviewTask('${sessionId}','${taskId}')">${icon("check")} Approve</button>
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
    const cb = el.querySelector(".review-task-checkbox");
    if (cb) cb.checked = checked;
  });
  updateBulkBar();
}

function updateBulkBar() {
  let total = 0;
  S.reviewSelected.forEach(sel => { total += sel.size; });
  const bar = $("review-bulk-bar");
  if (!bar) return;
  if (total === 0) { bar.classList.add("hidden"); return; }
  bar.classList.remove("hidden");
  const countEl = $("review-bulk-count");
  if (countEl) countEl.textContent = `${total} selected`;
}

async function bulkApproveReview() {
  const bar = $("review-bulk-bar");
  if (bar) {
    const btn = bar.querySelector(".btn-success");
    if (btn) { btn.textContent = "Approving..."; btn.disabled = true; }
  }
  try {
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
      const btn = bar.querySelector(".btn-success");
      if (btn) { btn.innerHTML = `${icon("check")} Approve selected`; btn.disabled = false; }
    }
  }
}

async function bulkRejectReview() {
  const bar = $("review-bulk-bar");
  if (bar) {
    const btn = bar.querySelector(".btn-danger");
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
      const btn = bar.querySelector(".btn-danger");
      if (btn) { btn.innerHTML = `${icon("x")} Reject selected`; btn.disabled = false; }
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
  $("transcript-modal").classList.remove("hidden");
  $("transcript-title").focus();
}

function closeTranscriptModal() {
  $("transcript-modal").classList.add("hidden");
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
