// ── Review Queue Page ─────────────────────────────────────────────────────────
async function showReviewPage() {
  S.mode = "review";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Review Queue";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading sessions...</div>';

  try {
    const sessions = await api.get("/api/reviews");
    renderReviewPage(sessions);
    updateReviewBadge().catch(() => {});
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><h3>Failed to load</h3><p>${esc(e.message)}</p></div>`;
  }
}

function renderReviewPage(sessions) {
  const content = $("board-content");
  const page = document.createElement("div");
  page.className = "review-page";
  page.id = "review-page-root";

  const pendingCount = sessions.reduce((n, s) => n + s.tasks.filter(t => t.status === "pending").length, 0);
  const hdr = document.createElement("div");
  hdr.className = "review-page-header";
  hdr.innerHTML = `
    <span class="review-page-count">${sessions.length} session${sessions.length !== 1 ? "s" : ""} · <span class="review-page-pending">${pendingCount} pending</span></span>
    <button class="btn btn-primary btn-sm" onclick="openTranscriptModal()">+ New Session</button>
  `;
  page.appendChild(hdr);

  if (!sessions.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <div class="empty-icon">📋</div>
      <h3>No review sessions yet</h3>
      <p>Upload a meeting transcript to extract tasks automatically, or add a session manually.</p>
      <button class="btn btn-primary" style="margin-top:12px" onclick="openTranscriptModal()">+ Upload Transcript</button>
    `;
    page.appendChild(empty);
    content.innerHTML = "";
    content.appendChild(page);
    return;
  }

  const bulkBar = document.createElement("div");
  bulkBar.className = "review-bulk-bar hidden";
  bulkBar.id = "review-bulk-bar";
  bulkBar.innerHTML = `
    <span id="review-bulk-count">0 selected</span>
    <div style="display:flex;gap:8px">
      <button class="btn btn-success btn-sm" onclick="bulkApproveReview()">✓ Approve All</button>
      <button class="btn btn-danger btn-sm" onclick="bulkRejectReview()">✕ Reject All</button>
    </div>
  `;
  page.appendChild(bulkBar);

  sessions.forEach(s => page.appendChild(buildSessionCard(s)));

  content.innerHTML = "";
  content.appendChild(page);
}

function buildSessionCard(session) {
  const pendingTasks  = session.tasks.filter(t => t.status === "pending");
  const approvedTasks = session.tasks.filter(t => t.status === "approved");
  const rejectedTasks = session.tasks.filter(t => t.status === "rejected");
  const allProcessed  = session.tasks.length > 0 && pendingTasks.length === 0;
  const expanded      = S.reviewExpanded.has(session.id);

  const dateStr = formatThaiDateTime(session.createdAt, false);

  const card = document.createElement("div");
  card.className = "review-session-card";
  card.id = `session-${session.id}`;

  const hdr = document.createElement("div");
  hdr.className = "review-session-header";
  hdr.innerHTML = `
    <input type="checkbox" class="review-task-checkbox" title="Select all pending"
      onchange="toggleSelectAllSession('${session.id}', this.checked)">
    <div style="flex:1;min-width:0">
      <div class="review-session-title">${esc(session.title)}</div>
      <div class="review-session-meta">${dateStr} · <span class="chip chip-source">${esc(session.source)}</span></div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap">
      ${pendingTasks.length  ? `<span class="chip chip-review">${pendingTasks.length} pending</span>` : ""}
      ${approvedTasks.length ? `<span class="chip chip-done">${approvedTasks.length} approved</span>` : ""}
      ${rejectedTasks.length ? `<span class="chip chip-muted">${rejectedTasks.length} rejected</span>` : ""}
      <button class="btn btn-ghost btn-sm review-expand-btn"
        onclick="toggleReviewSession('${session.id}')">
        ${expanded ? "▲ Collapse" : "▼ Review"}
      </button>
      ${allProcessed
        ? `<button class="btn btn-ghost btn-sm" style="color:var(--text-muted)"
             onclick="dismissReviewSession('${session.id}')">✕ Dismiss</button>`
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
  taskListEl.innerHTML = '<div class="loading-box" style="padding:12px 18px"><span class="spinner"></span></div>';
  try {
    const session = await api.get(`/api/reviews/${sessionId}`);
    taskListEl.innerHTML = "";
    if (!session.tasks.length) {
      taskListEl.innerHTML = '<div style="padding:14px 18px;color:var(--text-muted);font-size:13px">No tasks in this session.</div>';
    } else {
      session.tasks.forEach(t => taskListEl.appendChild(buildTaskCard(session, t)));
    }
    taskListEl.dataset.loaded = "1";
  } catch (e) {
    taskListEl.innerHTML = `<div style="padding:14px 18px;color:var(--danger);font-size:13px">Failed to load: ${esc(e.message)}</div>`;
  }
}

function buildTaskCard(session, task) {
  const el = document.createElement("div");
  el.id = `task-${task.id}`;

  if (task.status !== "pending") {
    el.className = "review-task-card task-processed";
    el.innerHTML = buildProcessedTaskHTML(task);
    return el;
  }

  el.className = "review-task-card";
  const selectedSet = S.reviewSelected.get(session.id) || new Set();
  const isSelected  = selectedSet.has(task.id);

  const diffClass = task.diffStatus === "create_new"       ? "diff-create"
                  : task.diffStatus === "update_existing"  ? "diff-update" : "diff-duplicate";
  const diffLabel = task.diffStatus === "create_new"       ? "CREATE NEW"
                  : task.diffStatus === "update_existing"  ? "UPDATE" : "DUPLICATE";

  const confPct    = Math.round((task.confidence ?? 1) * 100);
  const confClass  = confPct >= 80 ? "conf-high" : confPct >= 50 ? "conf-mid" : "conf-low";
  const matchHint  = task.diffStatus !== "create_new" && task.matchReason
    ? `<div class="review-match-reason">${esc(task.matchReason)}</div>` : "";
  const deadline   = formatThaiDateTime(task.deadline);

  const boardOptions = [
    `<option value="">-- Board --</option>`,
    ...S.boards.map(b => `<option value="${b.id}" ${b.id === task.targetBoardId ? "selected" : ""}>${esc(b.name)}</option>`),
  ].join("");

  const priorityOptions = ["low","medium","high"].map(p =>
    `<option value="${p}" ${p === (task.priority||"medium") ? "selected" : ""}>${p[0].toUpperCase()+p.slice(1)}</option>`
  ).join("");

  el.innerHTML = `
    <div class="review-task-header">
      <input type="checkbox" class="review-task-checkbox" ${isSelected ? "checked" : ""}
        onchange="toggleReviewTaskSelect('${session.id}','${task.id}',this.checked)">
      <div style="flex:1">
        <div class="review-task-badges">
          <span class="review-diff-badge ${diffClass}">${diffLabel}</span>
          <div class="review-conf-bar">
            <div class="review-conf-track">
              <div class="review-conf-fill ${confClass}" style="width:${confPct}%"></div>
            </div>
            <span>${confPct}%</span>
          </div>
        </div>
        ${matchHint}
      </div>
    </div>
    <div class="review-task-fields">
      <div class="review-field-row">
        <div class="review-field review-field-grow">
          <label class="review-field-label">Title</label>
          <input type="text" class="review-field-input" value="${esc(task.title)}"
            onchange="updateReviewField('${session.id}','${task.id}','title',this.value)">
        </div>
        <div class="review-field">
          <label class="review-field-label">Owner</label>
          <input type="text" class="review-field-input" value="${esc(task.owner)}" placeholder="—"
            onchange="updateReviewField('${session.id}','${task.id}','owner',this.value)">
        </div>
      </div>
      <div class="review-field-row">
        <div class="review-field">
          <label class="review-field-label">Deadline</label>
          <input type="datetime-local" class="review-field-input" value="${deadline}"
            onchange="updateReviewField('${session.id}','${task.id}','deadline',this.value?new Date(this.value).toISOString():null)">
        </div>
        <div class="review-field">
          <label class="review-field-label">Priority</label>
          <select class="review-field-select"
            onchange="updateReviewField('${session.id}','${task.id}','priority',this.value)">
            ${priorityOptions}
          </select>
        </div>
      </div>
      <div class="review-field-row">
        <div class="review-field">
          <label class="review-field-label">Board</label>
          <select class="review-field-select" id="board-sel-${task.id}"
            onchange="onReviewBoardChange('${session.id}','${task.id}',this.value)">
            ${boardOptions}
          </select>
        </div>
        <div class="review-field">
          <label class="review-field-label">List</label>
          <select class="review-field-select" id="list-sel-${task.id}"
            onchange="updateReviewField('${session.id}','${task.id}','targetListId',this.value)">
            <option value="">${task.targetBoardId ? "Loading..." : "— Select Board first —"}</option>
          </select>
        </div>
      </div>
      <div class="review-field-row review-toggles-row">
        <label class="review-toggle-label">
          <input type="checkbox" ${task.syncCalendar ? "checked" : ""}
            onchange="updateReviewField('${session.id}','${task.id}','syncCalendar',this.checked)">
          📅 Sync Calendar
        </label>
        <label class="review-toggle-label">
          <input type="checkbox" ${task.syncGoogleTasks ? "checked" : ""}
            onchange="updateReviewField('${session.id}','${task.id}','syncGoogleTasks',this.checked)">
          ✓ Sync Google Tasks
        </label>
      </div>
    </div>
    <div class="review-task-actions">
      <button class="btn btn-success btn-sm rq-approve-btn"
        onclick="approveReviewTask('${session.id}','${task.id}')">✓ Approve</button>
      <button class="btn btn-danger btn-sm"
        onclick="rejectReviewTask('${session.id}','${task.id}')">✕ Reject</button>
    </div>
  `;

  // Lazy-load lists if board already set
  if (task.targetBoardId) {
    const listSel = el.querySelector(`#list-sel-${task.id}`);
    api.get(`/api/boards/${task.targetBoardId}/lists`).then(lists => {
      listSel.innerHTML = `<option value="">— Select List —</option>` +
        lists.map(l => `<option value="${l.id}" ${l.id === task.targetListId ? "selected" : ""}>${esc(l.name)}</option>`).join("");
    }).catch(() => { listSel.innerHTML = `<option value="">Failed to load</option>`; });
  }

  return el;
}

function buildProcessedTaskHTML(task) {
  const approved  = task.status === "approved";
  const icon      = approved ? "✓" : "✕";
  const color     = approved ? "var(--success)" : "var(--text-faint)";
  const label     = approved ? "Approved" : "Rejected";
  const trelloTip = approved && task.trelloCardId
    ? `<span style="font-size:11px;color:var(--text-muted)">→ Trello card synced</span>` : "";
  // P6-8: show matchReason as audit trail for update/duplicate tasks
  const showReason = task.matchReason &&
    (task.diffStatus === "update_existing" || task.diffStatus === "possible_duplicate");
  const reasonTip = showReason
    ? `<div style="font-size:10px;color:var(--text-faint);margin-top:1px">${esc(task.matchReason)}</div>` : "";
  return `
    <div style="display:flex;align-items:center;gap:10px;padding:2px 0">
      <span style="color:${color};font-weight:700;font-size:15px;flex-shrink:0">${icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(task.title)}</div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:2px">
          <span style="font-size:11px;color:${color};font-weight:600">${label}</span>
          ${task.owner ? `<span style="font-size:11px;color:var(--text-muted)">${esc(task.owner)}</span>` : ""}
          ${trelloTip}
        </div>
        ${reasonTip}
      </div>
    </div>
  `;
}

// ── Review: session expand/collapse ───────────────────────────────────────────
function toggleReviewSession(sessionId) {
  const taskList = $(`task-list-${sessionId}`);
  if (!taskList) return;
  const card = $(`session-${sessionId}`);
  const btn  = card?.querySelector(".review-expand-btn");
  const isOpen = taskList.style.display !== "none";

  if (isOpen) {
    S.reviewExpanded.delete(sessionId);
    taskList.style.display = "none";
    if (btn) btn.textContent = "▼ Review";
  } else {
    S.reviewExpanded.add(sessionId);
    taskList.style.display = "";
    if (btn) btn.textContent = "▲ Collapse";
    if (!taskList.dataset.loaded) loadSessionTasks(sessionId, taskList);
  }
}

// ── Review: field update (auto-save on change) ────────────────────────────────
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
  if (!boardId) { listSel.innerHTML = `<option value="">— Select Board first —</option>`; return; }
  listSel.innerHTML = `<option value="">Loading...</option>`;
  try {
    const lists = await api.get(`/api/boards/${boardId}/lists`);
    listSel.innerHTML = `<option value="">— Select List —</option>` +
      lists.map(l => `<option value="${l.id}">${esc(l.name)}</option>`).join("");
  } catch { listSel.innerHTML = `<option value="">Failed to load</option>`; }
}

// ── Review: single approve / reject ──────────────────────────────────────────
async function approveReviewTask(sessionId, taskId) {
  const taskEl = $(`task-${taskId}`);
  if (!taskEl) return;
  const appBtn = taskEl.querySelector(".rq-approve-btn");
  if (appBtn) { appBtn.textContent = "Approving…"; appBtn.disabled = true; }
  try {
    const result = await api.post(`/api/reviews/${sessionId}/tasks/${taskId}/approve`);
    taskEl.className = "review-task-card task-processed";
    taskEl.innerHTML = buildProcessedTaskHTML(result);
    _cleanupAfterAction(sessionId, taskId);
    const msg = result.trello?.ok       ? "Approved & pushed to Trello ✓"
              : result.trello?.skipped  ? "Approved (no board/list set)"
              : `Approved${result.trello?.error ? " (Trello: "+result.trello.error+")" : ""}`;
    toast(msg, !!result.trello?.error);
  } catch (e) {
    toast("Error: " + e.message, true);
    if (appBtn) { appBtn.textContent = "✓ Approve"; appBtn.disabled = false; }
  }
}

async function rejectReviewTask(sessionId, taskId) {
  const taskEl = $(`task-${taskId}`);
  if (!taskEl) return;
  const rejBtn = taskEl.querySelector(".btn-danger");
  if (rejBtn) { rejBtn.textContent = "Rejecting…"; rejBtn.disabled = true; }
  try {
    const result = await api.post(`/api/reviews/${sessionId}/tasks/${taskId}/reject`);
    taskEl.className = "review-task-card task-processed";
    taskEl.innerHTML = buildProcessedTaskHTML(result);
    _cleanupAfterAction(sessionId, taskId);
    toast("Task rejected");
  } catch (e) {
    toast("Error: " + e.message, true);
    if (rejBtn) { rejBtn.textContent = "✕ Reject"; rejBtn.disabled = false; }
  }
}

function _cleanupAfterAction(sessionId, taskId) {
  const sel = S.reviewSelected.get(sessionId);
  if (sel) sel.delete(taskId);
  updateBulkBar();
  refreshSessionHeader(sessionId);
  updateReviewBadge().catch(() => {});
}

// ── Review: bulk selection ────────────────────────────────────────────────────
function toggleReviewTaskSelect(sessionId, taskId, checked) {
  if (!S.reviewSelected.has(sessionId)) S.reviewSelected.set(sessionId, new Set());
  const sel = S.reviewSelected.get(sessionId);
  checked ? sel.add(taskId) : sel.delete(taskId);
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
  if (bar) { bar.querySelector(".btn-success").textContent = "Approving…"; bar.querySelector(".btn-success").disabled = true; }
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
        const title = el.querySelector(".review-field-input")?.value || "";
        el.className = "review-task-card task-processed";
        el.innerHTML = buildProcessedTaskHTML({ title, status: "approved", trelloCardId: r.trelloCardId });
      });
      refreshSessionHeader(sessionId);
    });
    S.reviewSelected.clear();
    updateBulkBar();
    updateReviewBadge().catch(() => {});
    toast("Bulk approve complete ✓");
  } catch (e) {
    toast("Bulk approve failed: " + e.message, true);
    if (bar) { bar.querySelector(".btn-success").textContent = "✓ Approve All"; bar.querySelector(".btn-success").disabled = false; }
  }
}

async function bulkRejectReview() {
  const bar = $("review-bulk-bar");
  if (bar) { bar.querySelector(".btn-danger").textContent = "Rejecting…"; bar.querySelector(".btn-danger").disabled = true; }
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
        const title = el.querySelector(".review-field-input")?.value || "";
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
    if (bar) { bar.querySelector(".btn-danger").textContent = "✕ Reject All"; bar.querySelector(".btn-danger").disabled = false; }
  }
}

// ── Review: session header refresh + dismiss ──────────────────────────────────
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

// ── Review: sidebar badge ─────────────────────────────────────────────────────
async function updateReviewBadge() {
  const sessions = await api.get("/api/reviews");
  const count = sessions.reduce((n, s) => n + s.tasks.filter(t => t.status === "pending").length, 0);
  const badge = $("review-badge");
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "" : "none"; }
  // focus-pending-badge is updated only when Weekly Focus page is opened (showWeeklyFocusPage)
}

// ── Review: transcript upload modal (P2-4) ────────────────────────────────────
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
  btn.textContent = "Creating…"; btn.disabled = true;

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
    toast("Session created ✓");
    await showReviewPage();
  } catch (e) {
    toast("Error: " + e.message, true);
  } finally {
    btn.textContent = "Create Session"; btn.disabled = false;
  }
}

