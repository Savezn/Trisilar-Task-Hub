// ── API ───────────────────────────────────────────────────────────────────────
const api = {
  async req(method, url, body) {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  },
  get:  (url)        => api.req("GET",    url),
  post: (url, body)  => api.req("POST",   url, body),
  put:  (url, body)  => api.req("PUT",    url, body),
  del:  (url)        => api.req("DELETE", url),
};

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  boards: [],
  config: { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] },
  draftConfig: null,
  currentBoardId: null,
  currentGroupId: null,
  currentLists: [],
  mode: "today",   // "today" | "review" | "all" | "board" | "group" | "calendar" | "planner" | "okr" | "focus" | "settings"
  focusOwner: "",  // P7-5: selected owner id in Weekly Focus (persists across re-renders)
  allCardsCache: null,
  editing: null,
  pendingDeleteId: null,
  dragCardId: null,
  dragSourceListId: null,
  reviewExpanded: new Set(),   // Set<sessionId> — which sessions are expanded
  reviewSelected: new Map(),   // Map<sessionId, Set<taskId>> — bulk selection
};

const COLORS = ["#6366f1","#d29034","#519839","#b04632","#89609e","#cd5a91","#00aecc","#4bbf6b","#e44","#f90"];

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  const [boards, config, calStatus] = await Promise.all([
    api.get("/api/boards").catch(() => []),
    api.get("/api/config").catch(() => ({ groups: [], hiddenBoards: [], allowedWorkspaceIds: [] })),
    api.get("/api/calendar/status").catch(() => null),
  ]);
  S.boards = boards;
  S.config = config;
  if (!S.config.allowedWorkspaceIds) S.config.allowedWorkspaceIds = [];
  CAL.status = calStatus;

  // Update GCal sidebar status
  if (calStatus?.connected) {
    const gcalEl = $("sidebar-gcal-status");
    if (gcalEl) gcalEl.style.display = "";
  }

  renderSidebar();
  navigateTo("today");
  updateReviewBadge().catch(() => {});
}

// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(page) {
  // Update active nav items
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });

  // Show/hide boards section in sidebar
  const boardsSection = $("sidebar-boards-section");
  const showBoards = page === "board" || page === "group";
  if (boardsSection) boardsSection.style.display = showBoards ? "" : "none";

  switch (page) {
    case "today":    showTodayPage();       break;
    case "review":   showReviewPage();      break;
    case "all":      showAllTasks();        break;
    case "boards":   showBoardsMonitor();   break;
    case "calendar": showCalendar();        break;
    case "planner":  showPlannerPage();     break;
    case "okr":      showOKRPage();         break;
    case "focus":    showWeeklyFocusPage(); break;
    case "settings": showSettingsPage();    break;
    default:
      // board / group navigation handled by selectBoard / selectGroup
      break;
  }
}

// ── Card filter helper ────────────────────────────────────────────────────────
// Returns allCardsCache filtered to only boards that are in S.boards (which
// already excludes non-allowed workspaces via /api/boards backend filter)
// and not in hiddenBoards.
function getAllowedCards() {
  if (!S.allCardsCache) return [];
  const allowedIds = new Set(S.boards.map(b => b.id));
  return S.allCardsCache.filter(c =>
    allowedIds.has(c.boardId) && !S.config.hiddenBoards.includes(c.boardId)
  );
}

// ── Today Page ────────────────────────────────────────────────────────────────
async function showTodayPage() {
  S.mode = "today";
  S.currentBoardId = null;
  S.currentGroupId = null;

  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  $("board-title").textContent = "Today";
  $("board-subtitle").textContent = dateStr;
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading tasks...</div>';

  try {
    const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    // P5-1 + P5-2: fetch sessions and calendar events in parallel
    const [sessions, calEvents] = await Promise.all([
      api.get("/api/reviews").catch(() => []),
      CAL.status?.connected
        ? api.get(`/api/calendar/events?start=${encodeURIComponent(todayStart)}&end=${encodeURIComponent(tomorrowStart)}`).catch(() => [])
        : Promise.resolve(null),
    ]);

    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    renderTodayPage(getAllowedCards(), dateStr, sessions, calEvents);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderTodayPage(allCards, dateStr, sessions = [], calEvents = null) {
  const content = $("board-content");
  const now = new Date();
  const todayStr = now.toDateString();

  const cards = allCards;

  const overdue   = cards.filter(c => c.due && new Date(c.due) < now && !c.dueComplete);
  const dueToday  = cards.filter(c => c.due && !c.dueComplete && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
  const upcoming  = cards.filter(c => {
    if (!c.due || c.dueComplete) return false;
    const d = new Date(c.due);
    const diff = d - now;
    return d.toDateString() !== todayStr && diff > 0 && diff < 7 * 86400000;
  });

  // P5-1: compute pending review tasks from live sessions
  const pendingTasks = (sessions || []).flatMap(s =>
    (s.tasks || []).filter(t => t.status === "pending").map(t => ({ ...t, _sessionId: s.id, _sessionTitle: s.title }))
  );
  const pendingCount = pendingTasks.length;

  // Group upcoming by date
  const upcomingByDate = {};
  upcoming.forEach(c => {
    const key = new Date(c.due).toDateString();
    if (!upcomingByDate[key]) upcomingByDate[key] = [];
    upcomingByDate[key].push(c);
  });

  const page = document.createElement("div");
  page.className = "today-page";

  // ── Stats summary row ──────────────────────────────────────────────
  const statsRow = document.createElement("div");
  statsRow.className = "today-stats-row";
  statsRow.innerHTML = `
    <div class="today-stat-card stat-overdue">
      <div class="today-stat-num">${overdue.length}</div>
      <div class="today-stat-label">Overdue</div>
    </div>
    <div class="today-stat-card stat-today">
      <div class="today-stat-num">${dueToday.length}</div>
      <div class="today-stat-label">Due Today</div>
    </div>
    <div class="today-stat-card stat-upcoming">
      <div class="today-stat-num">${upcoming.length}</div>
      <div class="today-stat-label">Upcoming</div>
    </div>
    <div class="today-stat-card stat-review" style="cursor:pointer" onclick="navigateTo('review')" title="Go to Review Queue">
      <div class="today-stat-num">${pendingCount}</div>
      <div class="today-stat-label">Pending Review</div>
    </div>
  `;
  page.appendChild(statsRow);

  // ── Section builder ────────────────────────────────────────────────
  function buildSection(title, sectionClass, chipClass, chipLabel, taskList, emptyMsg) {
    const sec = document.createElement("div");
    sec.className = `today-section ${sectionClass}`;
    const header = document.createElement("div");
    header.className = "today-section-header";
    header.innerHTML = `
      <span class="today-section-title">${title}</span>
      <span class="today-section-count">${taskList.length}</span>
    `;
    sec.appendChild(header);
    if (!taskList.length) {
      const empty = document.createElement("div");
      empty.className = "today-section-empty";
      empty.textContent = emptyMsg;
      sec.appendChild(empty);
    } else {
      taskList.forEach(card => sec.appendChild(buildTodayRow(card, chipClass, chipLabel)));
    }
    return sec;
  }

  page.appendChild(buildSection(
    "⚠ Overdue", "section-overdue", "chip-overdue", "Overdue",
    overdue, "No overdue tasks — great work!"
  ));
  page.appendChild(buildSection(
    "◷ Due Today", "section-today", "chip-today", "Today",
    dueToday, "Nothing due today yet"
  ));

  // Upcoming (grouped by date)
  const upcomingSec = document.createElement("div");
  upcomingSec.className = "today-section section-upcoming";
  upcomingSec.innerHTML = `
    <div class="today-section-header">
      <span class="today-section-title">Upcoming — next 7 days</span>
      <span class="today-section-count">${upcoming.length}</span>
    </div>
  `;
  if (!upcoming.length) {
    const empty = document.createElement("div");
    empty.className = "today-section-empty";
    empty.textContent = "No upcoming tasks in the next 7 days";
    upcomingSec.appendChild(empty);
  } else {
    Object.entries(upcomingByDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .forEach(([dateKey, dateCards]) => {
        const label = document.createElement("div");
        label.className = "today-date-group";
        label.textContent = new Date(dateKey).toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
        upcomingSec.appendChild(label);
        dateCards.forEach(card => upcomingSec.appendChild(buildTodayRow(card, "chip-upcoming", "Upcoming")));
      });
  }
  page.appendChild(upcomingSec);

  // P5-1: Pending Review — live data from sessions
  const reviewSec = document.createElement("div");
  reviewSec.className = "today-section section-review";
  reviewSec.innerHTML = `
    <div class="today-section-header">
      <span class="today-section-title">⬡ Pending Review — AI Meeting Tasks</span>
      <span class="today-section-count">${pendingCount}</span>
    </div>
  `;
  if (!pendingCount) {
    const empty = document.createElement("div");
    empty.className = "today-section-empty";
    empty.textContent = "No meeting tasks waiting for review";
    reviewSec.appendChild(empty);
  } else {
    const diffLabels  = { create_new: "New", update_existing: "Update", possible_duplicate: "Duplicate" };
    const diffClasses = { create_new: "chip-done", update_existing: "chip-update", possible_duplicate: "chip-duplicate" };
    pendingTasks.forEach(task => {
      const row = document.createElement("div");
      row.className = "today-task-row";
      const diffStatus = task.diffStatus || "create_new";
      row.innerHTML = `
        <span class="chip ${diffClasses[diffStatus] || "chip-review"}" style="flex-shrink:0;font-size:10px">${diffLabels[diffStatus] || diffStatus}</span>
        <span class="today-task-name">${esc(task.title)}</span>
        <span class="today-task-board">${esc(task._sessionTitle || "")}</span>
        <span class="today-task-due" style="color:var(--purple)">Review →</span>
      `;
      row.addEventListener("click", () => {
        S.reviewExpanded.add(task._sessionId);
        navigateTo("review");
      });
      reviewSec.appendChild(row);
    });
  }
  page.appendChild(reviewSec);

  // P5-2: Today's Calendar — only if GCal connected and events exist
  if (calEvents && calEvents.length > 0) {
    const calSec = document.createElement("div");
    calSec.className = "today-section section-calendar";
    calSec.innerHTML = `
      <div class="today-section-header">
        <span class="today-section-title">📅 Today's Calendar</span>
        <span class="today-section-count">${calEvents.length}</span>
      </div>
    `;
    calEvents.forEach(evt => {
      const fmt = dt => new Date(dt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
      const timeStr = evt.start?.dateTime
        ? `${fmt(evt.start.dateTime)} – ${fmt(evt.end?.dateTime || evt.start.dateTime)}`
        : "All day";
      const row = document.createElement("div");
      row.className = "today-task-row";
      row.innerHTML = `
        <span class="today-cal-time">${esc(timeStr)}</span>
        <span class="today-task-name">${esc(evt.summary || "(no title)")}</span>
        <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();navigateTo('calendar')" title="Open Calendar">Open ↗</button>
      `;
      calSec.appendChild(row);
    });
    page.appendChild(calSec);
  }

  // P5-3: Quick-add bar with inline board/list selector
  const quickAdd = document.createElement("div");
  quickAdd.className = "today-quick-add";
  quickAdd.innerHTML = `
    <div class="today-qa-input-row">
      <input type="text" placeholder="+ Add a task for today..." id="today-quick-input"
        onkeydown="if(event.key==='Enter')showTodayQuickSelector()">
      <button class="btn btn-primary btn-sm" onclick="showTodayQuickSelector()">Add</button>
    </div>
    <div id="today-qa-selector" class="today-qa-selector hidden">
      <select id="today-qa-board" class="today-qa-select" onchange="loadTodayQALists()">
        <option value="">— Board —</option>
        ${S.boards.map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("")}
      </select>
      <select id="today-qa-list" class="today-qa-select" disabled>
        <option value="">— List —</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="confirmTodayQuickAdd(this)">✓ Add</button>
      <button class="btn btn-ghost btn-sm" onclick="hideTodayQuickSelector()">✕</button>
    </div>
  `;
  page.appendChild(quickAdd);

  content.innerHTML = "";
  content.appendChild(page);
}

// P5-3 helpers ────────────────────────────────────────────────────────────────
function showTodayQuickSelector() {
  const input = $("today-quick-input");
  if (!input || !input.value.trim()) return;
  $("today-qa-selector")?.classList.remove("hidden");
}

async function loadTodayQALists() {
  const boardSel = $("today-qa-board");
  const listSel  = $("today-qa-list");
  if (!boardSel || !listSel) return;
  const boardId = boardSel.value;
  if (!boardId) { listSel.disabled = true; return; }
  listSel.innerHTML = '<option value="">Loading…</option>';
  listSel.disabled = true;
  try {
    const lists = await api.get(`/api/boards/${boardId}/lists`);
    listSel.innerHTML = '<option value="">— List —</option>' +
      lists.map(l => `<option value="${esc(l.id)}">${esc(l.name)}</option>`).join("");
    listSel.disabled = false;
  } catch (e) {
    listSel.innerHTML = '<option value="">Error loading</option>';
  }
}

async function confirmTodayQuickAdd(btn) {
  const input   = $("today-quick-input");
  const listSel = $("today-qa-list");
  if (!input || !listSel) return;
  const title  = input.value.trim();
  const listId = listSel.value;
  if (!title)  return;
  if (!listId) { toast("กรุณาเลือก List ก่อน", true); return; }

  btn.disabled = true;
  btn.textContent = "…";
  try {
    const due = new Date();
    due.setHours(23, 59, 0, 0);
    await api.post("/api/cards", { listId, name: title, due: due.toISOString() });
    input.value = "";         // clear only after success
    hideTodayQuickSelector();
    S.allCardsCache = null;
    toast("เพิ่ม card แล้ว ✓");
    await showTodayPage();
  } catch (e) {
    toast("Error: " + e.message, true);
    btn.disabled = false;
    btn.textContent = "✓ Add";
  }
}

function hideTodayQuickSelector() {
  $("today-qa-selector")?.classList.add("hidden");
  // input.value intentionally preserved — AC: dismiss keeps typed text
}

function buildTodayRow(card, chipClass, chipLabel) {
  const row = document.createElement("div");
  row.className = "today-task-row";

  const dueText = card.due
    ? new Date(card.due).toLocaleDateString("en-US", { month:"short", day:"numeric" })
    : "";

  row.innerHTML = `
    <span class="chip ${chipClass}" style="flex-shrink:0">${chipLabel}</span>
    <span class="today-task-name">${esc(card.name)}</span>
    <span class="today-task-board">${esc(card.boardName || "")}</span>
    <span class="today-task-due">${dueText}</span>
    <div class="today-task-actions">
      <button class="btn btn-success btn-xs" title="Mark done" data-action="done">✓</button>
      <button class="btn btn-ghost btn-xs" title="Open card" data-action="open">↗</button>
    </div>
  `;

  // Click row → open card
  row.addEventListener("click", e => {
    if (e.target.closest(".today-task-actions")) return;
    openEditAllTasks(card);
  });

  // Action buttons
  row.querySelector('[data-action="open"]').addEventListener("click", e => {
    e.stopPropagation();
    openEditAllTasks(card);
  });

  row.querySelector('[data-action="done"]').addEventListener("click", async e => {
    e.stopPropagation();
    try {
      await api.put(`/api/cards/${card.id}`, { dueComplete: true });
      S.allCardsCache = null;
      toast("Marked as done ✓");
      showTodayPage();
    } catch (err) {
      toast("Error: " + err.message, true);
    }
  });

  return row;
}

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

  const dateStr = new Date(session.createdAt).toLocaleDateString("th-TH",
    { day: "numeric", month: "short", year: "numeric" });

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
  const deadline   = task.deadline ? task.deadline.slice(0, 16) : "";

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
  // P7-5: also update Weekly Focus sidebar badge
  const focusBadge = $("focus-pending-badge");
  if (focusBadge) { focusBadge.textContent = count || ""; focusBadge.style.display = count ? "" : "none"; }
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

// ── Planner Page ──────────────────────────────────────────────────────────────
async function showPlannerPage() {
  S.mode = "planner";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Daily Planner";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const dateStr = new Date().toLocaleDateString("th-TH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  $("board-content").innerHTML = `
    <div class="planner-wrap">
      <div class="planner-date">${dateStr}</div>

      <div class="planner-section">
        <div class="planner-section-title">📝 Google Tasks — วันนี้</div>
        <div id="planner-gtasks-body"><div class="planner-loading">กำลังโหลด…</div></div>
      </div>

      <div class="planner-section">
        <div class="planner-section-title">📋 Trello — Due Today &amp; Tomorrow</div>
        <div id="planner-trello-body"><div class="planner-loading">กำลังโหลด…</div></div>
      </div>
    </div>
  `;

  await Promise.all([loadPlannerGTasks(), loadPlannerTrello()]);
}

async function loadPlannerGTasks() {
  const body = $("planner-gtasks-body");
  if (!body) return;
  try {
    const status = await api.get("/api/google-tasks/status");
    if (!status.connected) {
      body.innerHTML = `
        <div class="planner-connect-state">
          <p>เชื่อมต่อ Google Tasks เพื่อดู to-do list ประจำวัน</p>
          <button class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect Google →</button>
        </div>`;
      return;
    }
    const tasks = await api.get("/api/google-tasks/today");
    renderPlannerGTasks(tasks);
  } catch (e) {
    body.innerHTML = `<div class="planner-error">Error: ${esc(e.message)}</div>`;
  }
}

function renderPlannerGTasks(tasks) {
  const body = $("planner-gtasks-body");
  if (!body) return;

  let listHtml = "";
  if (tasks.length === 0) {
    listHtml = `<div class="planner-empty">ไม่มี task วันนี้ 🎉</div>`;
  } else {
    listHtml = `<div class="planner-task-list">` +
      tasks.map(t => `
        <div class="planner-task-row" data-task-id="${esc(t.id)}">
          <input type="checkbox" class="planner-checkbox"
            onchange="plannerCompleteTask('${esc(t.id)}',this)">
          <span class="planner-task-title">${esc(t.title)}</span>
        </div>`).join("") +
    `</div>`;
  }

  body.innerHTML = listHtml + `
    <div class="planner-add-row">
      <input type="text" id="planner-add-input" class="planner-add-input"
        placeholder="+ เพิ่ม task สำหรับวันนี้..."
        onkeydown="if(event.key==='Enter')plannerAddTask()">
      <button class="btn btn-sm planner-add-btn" onclick="plannerAddTask()">Add</button>
    </div>`;
}

async function plannerCompleteTask(taskId, checkbox) {
  checkbox.disabled = true;
  try {
    await api.put(`/api/google-tasks/${taskId}`, { complete: true });
    const row = checkbox.closest(".planner-task-row");
    if (row) {
      row.style.opacity = "0.35";
      setTimeout(() => {
        row.remove();
        const list = $("planner-gtasks-body")?.querySelector(".planner-task-list");
        if (list && !list.querySelector(".planner-task-row")) {
          list.innerHTML = `<div class="planner-empty">ไม่มี task วันนี้ 🎉</div>`;
        }
      }, 350);
    }
  } catch (e) {
    checkbox.checked = false;
    checkbox.disabled = false;
    toast("ไม่สามารถ update task: " + e.message, true);
  }
}

async function plannerAddTask() {
  const input = $("planner-add-input");
  if (!input) return;
  const title = input.value.trim();
  if (!title) return;

  input.disabled = true;
  try {
    const task = await api.post("/api/google-tasks", { title });
    input.value = "";

    // Append to list (or re-render if no list yet)
    const list = $("planner-gtasks-body")?.querySelector(".planner-task-list");
    if (list) {
      list.querySelector(".planner-empty")?.remove();
      const row = document.createElement("div");
      row.className = "planner-task-row";
      row.dataset.taskId = task.id;
      row.innerHTML = `
        <input type="checkbox" class="planner-checkbox"
          onchange="plannerCompleteTask('${esc(task.id)}',this)">
        <span class="planner-task-title">${esc(task.title)}</span>`;
      list.appendChild(row);
    } else {
      await loadPlannerGTasks();
    }
    toast("เพิ่ม task แล้ว ✓");
  } catch (e) {
    toast("Error: " + e.message, true);
  } finally {
    input.disabled = false;
    input?.focus();
  }
}

async function loadPlannerTrello() {
  const body = $("planner-trello-body");
  if (!body) return;

  if (!S.allCardsCache) {
    try {
      S.allCardsCache = await api.get("/api/all-cards");
    } catch (e) {
      body.innerHTML = `<div class="planner-error">ไม่สามารถโหลด Trello cards ได้</div>`;
      return;
    }
  }

  const cards = getAllowedCards();
  const now = new Date();
  const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const dayAfterStart = new Date(tomorrowStart); dayAfterStart.setDate(dayAfterStart.getDate() + 1);

  const todayCards    = cards.filter(c => c.due && new Date(c.due) >= todayStart    && new Date(c.due) < tomorrowStart);
  const tomorrowCards = cards.filter(c => c.due && new Date(c.due) >= tomorrowStart && new Date(c.due) < dayAfterStart);

  if (!todayCards.length && !tomorrowCards.length) {
    body.innerHTML = `<div class="planner-empty">ไม่มี Trello card ที่ due วันนี้หรือพรุ่งนี้ 🎉</div>`;
    return;
  }

  const cardRow = (c, label, cls) => `
    <div class="planner-trello-row">
      <span class="chip ${cls}" style="font-size:10px;flex-shrink:0">${label}</span>
      <span class="planner-trello-title">${esc(c.name)}</span>
      <span class="planner-trello-meta">${esc(c.boardName)} · ${esc(c.listName)}</span>
    </div>`;

  let html = "";
  if (todayCards.length) {
    html += `<div class="planner-sub-label">วันนี้</div>`;
    html += todayCards.map(c => cardRow(c, "วันนี้", "chip-danger")).join("");
  }
  if (tomorrowCards.length) {
    html += `<div class="planner-sub-label">พรุ่งนี้</div>`;
    html += tomorrowCards.map(c => cardRow(c, "พรุ่งนี้", "chip-warning")).join("");
  }
  body.innerHTML = html;
}

// ── Settings Page ─────────────────────────────────────────────────────────────
function showSettingsPage() {
  S.mode = "settings";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Settings";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const calConnected = CAL.status?.connected;

  const page = document.createElement("div");
  page.className = "settings-page";

  // ── 1. Integrations ──
  const intSection = document.createElement("div");
  intSection.className = "settings-section";
  intSection.innerHTML = `
    <div class="settings-section-header">Integrations</div>
    <div class="settings-section-body">
      <div class="integration-row">
        <span class="integration-icon">🔷</span>
        <div class="integration-info">
          <div class="integration-name">Trello</div>
          <div class="integration-desc">Connected via API Key</div>
        </div>
        <div class="integration-status-dot dot-green"></div>
        <span class="chip chip-done">Connected</span>
      </div>
      <div class="integration-row">
        <span class="integration-icon">📅</span>
        <div class="integration-info">
          <div class="integration-name">Google Calendar</div>
          <div class="integration-desc">${calConnected ? "OAuth connected" : "Not connected"}</div>
        </div>
        <div class="integration-status-dot ${calConnected ? "dot-green" : "dot-gray"}"></div>
        ${calConnected
          ? '<span class="chip chip-done">Connected</span>'
          : '<button class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect</button>'
        }
      </div>
      <div class="integration-row">
        <span class="integration-icon">✅</span>
        <div class="integration-info">
          <div class="integration-name">Google Tasks</div>
          <div class="integration-desc">${calConnected ? "OAuth connected (shared with Calendar)" : "Not connected"}</div>
        </div>
        <div class="integration-status-dot ${calConnected ? "dot-green" : "dot-gray"}"></div>
        ${calConnected
          ? '<span class="chip chip-done">Connected</span>'
          : '<button class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect</button>'
        }
      </div>
    </div>
  `;
  page.appendChild(intSection);

  // ── 2. Workspaces ──
  const wsSection = document.createElement("div");
  wsSection.className = "settings-section";
  wsSection.innerHTML = `
    <div class="settings-section-header">
      <span>Workspaces</span>
    </div>
    <div class="settings-section-body" id="settings-ws-body">
      <div class="loading-box" style="height:60px"><span class="spinner"></span> Loading...</div>
    </div>
  `;
  page.appendChild(wsSection);

  // ── 3. Board Visibility ──
  const visSection = document.createElement("div");
  visSection.className = "settings-section";
  visSection.innerHTML = `
    <div class="settings-section-header">Board Visibility</div>
    <div class="settings-section-body" id="settings-vis-body"></div>
  `;
  page.appendChild(visSection);

  // ── 4. BU Groups ──
  const groupSection = document.createElement("div");
  groupSection.className = "settings-section";
  groupSection.innerHTML = `
    <div class="settings-section-header">
      <span>Business Unit Groups</span>
      <button class="btn btn-primary btn-sm" id="settings-add-group-btn">+ New Group</button>
    </div>
    <div class="settings-section-body" id="settings-groups-body"></div>
  `;
  page.appendChild(groupSection);

  const content = $("board-content");
  content.innerHTML = "";
  content.appendChild(page);

  // Initialize draft config for inline editing
  S.draftConfig = JSON.parse(JSON.stringify(S.config));
  if (!S.draftConfig.allowedWorkspaceIds) S.draftConfig.allowedWorkspaceIds = [];

  // Render visibility editor inline
  renderSettingsVisibility();
  renderSettingsGroups();
  loadSettingsWorkspaces();

  // Add group button
  $("settings-add-group-btn").onclick = () => {
    S.draftConfig.groups.push({
      id: "g_" + Date.now(),
      name: "New Group",
      color: COLORS[S.draftConfig.groups.length % COLORS.length],
      boardIds: [],
    });
    renderSettingsGroups();
    setTimeout(() => {
      const inputs = $("settings-groups-body").querySelectorAll(".group-edit-name");
      inputs[inputs.length - 1]?.focus();
      inputs[inputs.length - 1]?.select();
    }, 50);
  };
}

function renderSettingsVisibility() {
  const container = $("settings-vis-body");
  if (!container) return;
  container.innerHTML = "";
  const hidden = new Set(S.draftConfig.hiddenBoards);

  if (!S.boards.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No boards loaded</p>';
    return;
  }

  S.boards.forEach((board, i) => {
    const isHidden = hidden.has(board.id);
    const row = document.createElement("div");
    row.className = "vis-row";
    row.innerHTML = `
      <span class="vis-dot" style="background:${COLORS[i % COLORS.length]}"></span>
      <span class="vis-name" title="${esc(board.name)}">${esc(board.name)}</span>
      <button class="vis-toggle${isHidden ? " hidden-toggle" : ""}" data-bid="${board.id}">
        ${isHidden ? "🙈 Hidden" : "👁 Visible"}
      </button>
    `;
    row.querySelector(".vis-toggle").onclick = async function() {
      const bid = this.dataset.bid;
      const idx = S.draftConfig.hiddenBoards.indexOf(bid);
      if (idx === -1) {
        S.draftConfig.hiddenBoards.push(bid);
        this.textContent = "🙈 Hidden";
        this.classList.add("hidden-toggle");
        S.draftConfig.groups.forEach(g => {
          const bi = g.boardIds.indexOf(bid);
          if (bi !== -1) g.boardIds.splice(bi, 1);
        });
      } else {
        S.draftConfig.hiddenBoards.splice(idx, 1);
        this.textContent = "👁 Visible";
        this.classList.remove("hidden-toggle");
      }
      await saveSettingsConfig();
    };
    container.appendChild(row);
  });
}

function renderSettingsGroups() {
  const container = $("settings-groups-body");
  if (!container) return;
  container.innerHTML = "";

  if (!S.draftConfig.groups.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No groups yet. Click "+ New Group" to create one.</p>';
    return;
  }

  S.draftConfig.groups.forEach((group, gi) => {
    const row = document.createElement("div");
    row.className = "group-edit-row";
    const assignedBoards = new Set(group.boardIds);
    row.innerHTML = `
      <div class="group-edit-header">
        <input type="color" class="group-color-picker" value="${group.color || "#6366f1"}" data-gi="${gi}">
        <input type="text" class="group-edit-name" value="${esc(group.name)}" placeholder="Group name..." data-gi="${gi}">
        <button class="group-del-btn" data-gi="${gi}" title="Delete group">🗑</button>
      </div>
      <div class="group-boards-selector" data-gi="${gi}">
        ${S.boards.filter(b => !S.config.hiddenBoards.includes(b.id)).map(b => `
          <span class="board-chip${assignedBoards.has(b.id) ? " selected" : ""}" data-bid="${b.id}" data-gi="${gi}">${esc(b.name)}</span>
        `).join("")}
      </div>
    `;

    row.querySelector(".group-color-picker").oninput = e => {
      S.draftConfig.groups[gi].color = e.target.value;
    };
    row.querySelector(".group-edit-name").oninput = e => {
      S.draftConfig.groups[gi].name = e.target.value;
    };
    row.querySelector(".group-edit-name").onblur = () => saveSettingsConfig();
    row.querySelector(".group-color-picker").onchange = () => saveSettingsConfig();
    row.querySelector(".group-del-btn").onclick = async () => {
      S.draftConfig.groups.splice(gi, 1);
      renderSettingsGroups();
      await saveSettingsConfig();
    };
    row.querySelectorAll(".board-chip").forEach(chip => {
      chip.onclick = async () => {
        const bid = chip.dataset.bid;
        const idx = S.draftConfig.groups[gi].boardIds.indexOf(bid);
        if (idx === -1) S.draftConfig.groups[gi].boardIds.push(bid);
        else S.draftConfig.groups[gi].boardIds.splice(idx, 1);
        chip.classList.toggle("selected");
        await saveSettingsConfig();
      };
    });

    container.appendChild(row);
  });
}

async function loadSettingsWorkspaces() {
  const container = $("settings-ws-body");
  if (!container) return;
  try {
    const workspaces = await api.get("/api/workspaces");
    if (!workspaces.length) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">ไม่พบ Workspace ใน Trello account นี้</p>';
      return;
    }
    if (S.draftConfig.allowedWorkspaceIds.length === 0) {
      S.draftConfig.allowedWorkspaceIds = workspaces.map(ws => ws.id);
    }
    container.innerHTML = "";
    workspaces.forEach(ws => {
      const isChecked = S.draftConfig.allowedWorkspaceIds.includes(ws.id);
      const row = document.createElement("div");
      row.className = "ws-row";
      row.innerHTML = `
        <label class="ws-label">
          <input type="checkbox" class="ws-check" data-wsid="${ws.id}" ${isChecked ? "checked" : ""}>
          <span>🏢 ${esc(ws.displayName || ws.name)}</span>
        </label>
        <span style="font-size:11px;color:var(--text-muted)">${esc(ws.name)}</span>
      `;
      row.querySelector(".ws-check").onchange = async function() {
        const wsId = this.dataset.wsid;
        if (this.checked) {
          if (!S.draftConfig.allowedWorkspaceIds.includes(wsId))
            S.draftConfig.allowedWorkspaceIds.push(wsId);
        } else {
          S.draftConfig.allowedWorkspaceIds = S.draftConfig.allowedWorkspaceIds.filter(id => id !== wsId);
        }
        await saveSettingsConfig();
      };
      container.appendChild(row);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger)">⚠ ${e.message}</p>`;
  }
}

async function saveSettingsConfig() {
  if (!S.draftConfig) return;
  try {
    await api.post("/api/config", S.draftConfig);
    S.config = JSON.parse(JSON.stringify(S.draftConfig));
    const boards = await api.get("/api/boards").catch(() => S.boards);
    S.boards = boards;
    S.allCardsCache = null;
    renderSidebar();
    toast("Saved ✓");
  } catch (e) {
    toast("Save failed: " + e.message, true);
  }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function renderSidebar() {
  renderGroupsList();
  renderBoardsList();
}

function renderGroupsList() {
  const ul = $("groups-list");
  ul.innerHTML = "";
  if (!S.config.groups.length) {
    ul.innerHTML = '<li style="padding:4px 10px;font-size:11px;color:rgba(255,255,255,0.2);font-style:italic">No groups yet</li>';
    return;
  }
  S.config.groups.forEach(group => {
    const boardsInGroup = S.boards.filter(b => group.boardIds.includes(b.id));
    const li = document.createElement("li");
    li.className = "group-item";
    const isActive = S.currentGroupId === group.id && S.mode === "group";
    li.innerHTML = `
      <div class="group-header${isActive ? " active" : ""}" data-gid="${group.id}">
        <span class="group-arrow${isActive ? " open" : ""}">▶</span>
        <span class="group-color-dot" style="background:${group.color || "#6366f1"}"></span>
        <span class="group-name">${esc(group.name)}</span>
        <span class="group-badge">${boardsInGroup.length}</span>
      </div>
      <div class="group-boards${isActive ? " open" : ""}" data-gid="${group.id}">
        ${boardsInGroup.map(b => `
          <div class="group-board-item${S.currentBoardId === b.id ? " active" : ""}" data-bid="${b.id}" data-bname="${esc(b.name)}">
            ${esc(b.name)}
          </div>
        `).join("")}
      </div>
    `;

    li.querySelector(".group-header").onclick = (e) => {
      const arrow = li.querySelector(".group-arrow");
      const boardsEl = li.querySelector(".group-boards");
      const wasOpen = boardsEl.classList.contains("open");
      if (!wasOpen) {
        boardsEl.classList.add("open");
        arrow.classList.add("open");
        selectGroup(group.id, group.name);
      } else {
        boardsEl.classList.remove("open");
        arrow.classList.remove("open");
      }
    };

    li.querySelectorAll(".group-board-item").forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        selectBoard(el.dataset.bid, el.dataset.bname);
      };
    });

    ul.appendChild(li);
  });
}

function renderBoardsList() {
  const ul = $("boards-list");
  const hiddenUl = $("hidden-boards-list");
  ul.innerHTML = "";
  hiddenUl.innerHTML = "";

  const visible = S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
  const hidden  = S.boards.filter(b =>  S.config.hiddenBoards.includes(b.id));

  visible.forEach((board, i) => ul.appendChild(buildBoardLi(board, i)));

  $("hidden-section").style.display = hidden.length ? "" : "none";
  $("hidden-count").textContent = hidden.length;
  hidden.forEach((board, i) => hiddenUl.appendChild(buildBoardLi(board, i, true)));
}

function buildBoardLi(board, i, isHidden = false) {
  const li = document.createElement("li");
  if (board.id === S.currentBoardId) li.classList.add("active");
  li.innerHTML = `<span class="board-color-dot" style="background:${COLORS[i % COLORS.length]}"></span>${esc(board.name)}`;
  li.onclick = () => selectBoard(board.id, board.name);
  if (isHidden) li.style.opacity = ".55";
  return li;
}

// ── Select Board ──────────────────────────────────────────────────────────────
async function selectBoard(boardId, boardName) {
  S.currentBoardId = boardId;
  S.currentGroupId = null;
  S.mode = "board";
  S.allCardsCache = null;

  // Show boards section and set active nav
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const boardsSection = $("sidebar-boards-section");
  if (boardsSection) boardsSection.style.display = "";

  $("board-title").textContent = boardName;
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.remove("hidden");
  renderSidebar();
  await loadBoard(boardId);
}

async function loadBoard(boardId) {
  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading...</div>';
  try {
    const lists = await api.get(`/api/boards/${boardId}/lists`);
    S.currentLists = lists;
    const listsWithCards = await Promise.all(
      lists.map(async l => ({ ...l, cards: await api.get(`/api/lists/${l.id}/cards`) }))
    );
    content.innerHTML = "";
    const kanban = document.createElement("div");
    kanban.className = "kanban";
    listsWithCards.forEach(l => kanban.appendChild(buildListCol(l, false)));
    content.appendChild(kanban);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

// ── Select BU Group ───────────────────────────────────────────────────────────
async function selectGroup(groupId, groupName) {
  const group = S.config.groups.find(g => g.id === groupId);
  if (!group) return;

  S.currentGroupId = groupId;
  S.currentBoardId = null;
  S.mode = "group";
  S.allCardsCache = null;

  // Show boards section
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const boardsSection = $("sidebar-boards-section");
  if (boardsSection) boardsSection.style.display = "";

  const boardsInGroup = S.boards.filter(b => group.boardIds.includes(b.id));
  $("board-title").textContent = groupName;
  $("board-subtitle").textContent = `${boardsInGroup.length} boards`;
  $("add-list-btn").classList.add("hidden");
  renderSidebar();
  await loadGroupView(group, boardsInGroup);
}

async function loadGroupView(group, boards) {
  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading boards...</div>';

  try {
    const boardsData = await Promise.all(
      boards.map(async (board, i) => {
        const lists = await api.get(`/api/boards/${board.id}/lists`);
        const listsWithCards = await Promise.all(
          lists.map(async l => ({ ...l, cards: await api.get(`/api/lists/${l.id}/cards`) }))
        );
        return { ...board, lists: listsWithCards, color: COLORS[i % COLORS.length] };
      })
    );

    content.innerHTML = "";
    const buView = document.createElement("div");
    buView.className = "bu-view";

    boardsData.forEach(board => {
      const section = document.createElement("div");
      section.className = "bu-board-section";

      const header = document.createElement("div");
      header.className = "bu-board-header";
      header.innerHTML = `
        <span class="bu-board-color" style="background:${board.color}"></span>
        <h3>${esc(board.name)}</h3>
        <span style="font-size:11px;color:var(--text-muted)">${board.lists.reduce((n,l)=>n+l.cards.length,0)} cards</span>
        <button class="collapse-btn">▲ Collapse</button>
      `;

      const kanbanWrap = document.createElement("div");
      kanbanWrap.className = "bu-kanban-wrap";
      const kanban = document.createElement("div");
      kanban.className = "bu-kanban";

      board.lists.forEach(l => kanban.appendChild(buildListCol(l, true, board.id, board.lists)));
      kanbanWrap.appendChild(kanban);

      header.querySelector(".collapse-btn").onclick = (e) => {
        e.stopPropagation();
        const collapsed = kanban.classList.toggle("collapsed");
        e.target.textContent = collapsed ? "▼ Expand" : "▲ Collapse";
      };

      section.appendChild(header);
      section.appendChild(kanbanWrap);
      buView.appendChild(section);
    });

    content.appendChild(buView);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

// ── Kanban helpers ────────────────────────────────────────────────────────────
function buildListCol(list, isBU = false, boardId = null, boardLists = null) {
  const col = document.createElement("div");
  col.className = "list-col";

  const head = document.createElement("div");
  head.className = "list-head";
  head.innerHTML = `<span class="list-name">${esc(list.name)}</span><span class="list-badge">${list.cards.length}</span>`;

  const wrap = document.createElement("div");
  wrap.className = "cards-wrap";
  wrap.dataset.listId = list.id;

  const effectiveBoardId = boardId || S.currentBoardId;
  const effectiveLists   = boardLists || S.currentLists;

  list.cards.forEach(c => wrap.appendChild(buildCard(c, list.id, effectiveBoardId, effectiveLists)));
  setupDropZone(wrap, effectiveBoardId);

  const addBtn = document.createElement("button");
  addBtn.className = "add-card-btn";
  addBtn.textContent = "+ Add a card";
  addBtn.onclick = () => openCreate(list.id, effectiveLists);

  col.appendChild(head);
  col.appendChild(wrap);
  col.appendChild(addBtn);
  return col;
}

function buildCard(card, listId, boardId, lists) {
  const div = document.createElement("div");
  div.className = "card";
  div.draggable = true;
  div.dataset.cardId = card.id;

  // Left border color based on due status
  if (card.due && !card.dueComplete) {
    const now = new Date();
    const diff = new Date(card.due) - now;
    if (diff < 0) div.classList.add("due-border-overdue");
    else if (diff < 172800000) div.classList.add("due-border-soon");
    else div.classList.add("due-border-ok");
  }

  let meta = "";
  if (card.start) meta += `<span class="start-badge">▶ ${new Date(card.start).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>`;
  if (card.due)   meta += buildDueBadge(card.due, card.dueComplete);
  if (card.dueReminder != null && card.dueReminder !== -1) meta += `<span class="reminder-icon" title="Reminder set">🔔</span>`;
  if (card.desc)  meta += `<span class="desc-icon">≡</span>`;

  const checklists = card.checklists || [];
  let clHTML = "";
  if (checklists.length) {
    clHTML = '<div class="card-checklists">';
    checklists.forEach(cl => {
      const items = cl.checkItems || [];
      const done  = items.filter(i => i.state === "complete").length;
      const total = items.length;
      const pct   = total ? Math.round((done / total) * 100) : 0;
      const allDone = total > 0 && done === total;
      clHTML += `
        <div class="card-cl">
          <div class="card-cl-header">
            <span class="card-cl-name">☑ ${esc(cl.name)}</span>
            <span class="card-cl-count${allDone ? " done" : ""}">${done}/${total}</span>
          </div>
          <div class="card-cl-bar"><div class="card-cl-fill${allDone ? " done" : ""}" style="width:${pct}%"></div></div>
          <ul class="card-cl-items">
            ${items.sort((a,b) => a.pos - b.pos).map(item => `
              <li class="card-cl-item${item.state === "complete" ? " done" : ""}">
                <input type="checkbox" class="card-cl-check"
                  ${item.state === "complete" ? "checked" : ""}
                  data-cardid="${card.id}" data-clid="${cl.id}" data-itemid="${item.id}"
                  data-listid="${listId}" data-boardid="${boardId || ''}">
                <span>${esc(item.name)}</span>
              </li>
            `).join("")}
          </ul>
        </div>`;
    });
    clHTML += "</div>";
  }

  div.innerHTML = `
    <div class="card-title">${esc(card.name)}</div>
    ${meta ? `<div class="card-meta">${meta}</div>` : ""}
    ${clHTML}
  `;

  div.querySelectorAll(".card-cl-check").forEach(cb => {
    cb.onchange = async function(e) {
      e.stopPropagation();
      const state = this.checked ? "complete" : "incomplete";
      this.disabled = true;
      try {
        await api.put(`/api/cards/${this.dataset.cardid}/checklists/${this.dataset.clid}/checkitems/${this.dataset.itemid}`, { state });
        const li = this.closest(".card-cl-item");
        li?.classList.toggle("done", this.checked);
        const clDiv = this.closest(".card-cl");
        const checks = clDiv.querySelectorAll(".card-cl-check");
        const doneCount = [...checks].filter(c => c.checked).length;
        clDiv.querySelector(".card-cl-count").textContent = `${doneCount}/${checks.length}`;
        const fill = clDiv.querySelector(".card-cl-fill");
        const pct = checks.length ? Math.round((doneCount / checks.length) * 100) : 0;
        fill.style.width = pct + "%";
        const allDone = doneCount === checks.length && checks.length > 0;
        clDiv.querySelector(".card-cl-count").classList.toggle("done", allDone);
        fill.classList.toggle("done", allDone);
      } catch(err) {
        this.checked = !this.checked;
        toast("Update failed: " + err.message, true);
      } finally { this.disabled = false; }
    };
    cb.onclick = e => e.stopPropagation();
  });

  div.onclick = () => openEdit(card, listId, boardId, lists);
  setupDragSource(div, card.id, listId);
  return div;
}

function buildDueBadge(due, complete) {
  const d = new Date(due), now = new Date(), diff = d - now;
  let cls = "due-ok", prefix = "";
  if (complete)      { cls = "due-complete"; prefix = "✓ "; }
  else if (diff < 0) { cls = "due-overdue"; }
  else if (diff < 172800000) cls = "due-soon";
  return `<span class="due-badge ${cls}">${prefix}${d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>`;
}

// ── Drag & Drop ───────────────────────────────────────────────────────────────
function setupDragSource(el, cardId, listId) {
  el.addEventListener("dragstart", e => {
    S.dragCardId = cardId; S.dragSourceListId = listId;
    el.classList.add("dragging"); e.dataTransfer.effectAllowed = "move";
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    document.querySelectorAll(".cards-wrap").forEach(w => w.classList.remove("drag-over"));
  });
}

function setupDropZone(wrap, boardId) {
  wrap.addEventListener("dragover", e => { e.preventDefault(); wrap.classList.add("drag-over"); });
  wrap.addEventListener("dragleave", () => wrap.classList.remove("drag-over"));
  wrap.addEventListener("drop", async e => {
    e.preventDefault();
    wrap.classList.remove("drag-over");
    const targetListId = wrap.dataset.listId;
    if (!S.dragCardId || targetListId === S.dragSourceListId) return;
    try {
      await api.put(`/api/cards/${S.dragCardId}/move`, { listId: targetListId });
      toast("Card moved ✓");
      if (S.mode === "group") {
        const group = S.config.groups.find(g => g.id === S.currentGroupId);
        const boards = S.boards.filter(b => group.boardIds.includes(b.id));
        await loadGroupView(group, boards);
      } else {
        await loadBoard(boardId || S.currentBoardId);
      }
    } catch (err) { toast("Move failed: " + err.message, true); }
  });
}

// ── Boards Monitor ────────────────────────────────────────────────────────────
async function showBoardsMonitor() {
  S.mode = "boards";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Boards";
  $("board-subtitle").textContent = `${S.boards.filter(b => !S.config.hiddenBoards.includes(b.id)).length} boards`;
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading board stats...</div>';

  try {
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    // P7-4: fetch health for all visible boards (parallel, failures silently skipped)
    const visibleBoards = S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
    const healthResults = await Promise.all(
      visibleBoards.map(b => api.get(`/api/boards/${b.id}/health`).catch(() => ({ ok: true, missing: [] })))
    );
    const healthMap = new Map(visibleBoards.map((b, i) => [b.id, healthResults[i]]));
    renderBoardsMonitor(getAllowedCards(), healthMap);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderBoardsMonitor(allCards, healthMap = new Map()) {
  const content = $("board-content");
  const now = new Date();
  const todayStr = now.toDateString();

  const visibleBoards = S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
  if (!visibleBoards.length) {
    content.innerHTML = '<div class="empty-state"><div class="empty-icon">⊞</div><h3>No boards visible</h3><p>Unhide boards in Settings to monitor them here.</p></div>';
    return;
  }

  // Build per-board stats from allCards
  const boardStats = visibleBoards.map((board, i) => {
    const cards = allCards.filter(c => c.boardId === board.id);
    const active = cards.filter(c => !c.dueComplete);
    const overdue = active.filter(c => c.due && new Date(c.due) < now);
    const dueToday = active.filter(c => c.due && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
    const done = cards.filter(c => c.dueComplete);
    const completionPct = cards.length ? Math.round((done.length / cards.length) * 100) : 0;

    // Group by list name for the chips
    const byList = {};
    cards.forEach(c => {
      if (!byList[c.listName]) byList[c.listName] = 0;
      byList[c.listName]++;
    });

    // P7-4: health from pre-fetched map
    const health = healthMap.get(board.id) || { ok: true, missing: [] };

    return { board, color: COLORS[i % COLORS.length], cards, active, overdue, dueToday, done, completionPct, byList, health };
  });

  const page = document.createElement("div");
  page.className = "boards-monitor-page";

  // Toolbar with sort
  const toolbar = document.createElement("div");
  toolbar.className = "boards-monitor-toolbar";
  toolbar.innerHTML = `
    <span class="sort-label">Sort by</span>
    <button class="filter-chip active" data-sort="name">Name</button>
    <button class="filter-chip" data-sort="overdue">Most Overdue</button>
    <button class="filter-chip" data-sort="total">Most Cards</button>
  `;
  page.appendChild(toolbar);

  const grid = document.createElement("div");
  grid.className = "boards-monitor-grid";

  let currentSort = "name";

  function sortedStats() {
    const s = [...boardStats];
    if (currentSort === "overdue") s.sort((a, b) => b.overdue.length - a.overdue.length);
    else if (currentSort === "total") s.sort((a, b) => b.cards.length - a.cards.length);
    else s.sort((a, b) => a.board.name.localeCompare(b.board.name));
    return s;
  }

  function renderGrid() {
    grid.innerHTML = "";
    sortedStats().forEach(({ board, color, cards, overdue, dueToday, done, completionPct, byList, health }) => {
      const card = document.createElement("div");
      card.className = "board-monitor-card";

      const healthClass = completionPct === 0 ? "zero" : overdue.length > 3 ? "crit" : overdue.length > 0 ? "warn" : "";
      const initials = board.name.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();

      const topLists = Object.entries(byList)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const overdueClass = overdue.length > 0 ? " has-issues" : "";
      const todayClass   = dueToday.length > 0 ? " has-issues" : "";

      // P7-4: convention badge
      const conventionBadge = !health.ok
        ? `<span class="bm-convention-badge" title="Missing lists: ${health.missing.join(', ')}">⚠ Convention</span>`
        : "";

      card.innerHTML = `
        <div class="bm-banner" style="background:${color}"></div>
        <div class="bm-body">
          <div class="bm-card-header">
            <div class="bm-board-icon" style="background:${color}">${initials}</div>
            <div class="bm-card-meta">
              <div class="bm-card-title">${esc(board.name)}${conventionBadge}</div>
              <div class="bm-card-sub">${cards.length} cards total</div>
            </div>
            <button class="btn btn-ghost btn-sm bm-open-btn">Open ↗</button>
          </div>

          <div class="bm-stats-row">
            <div class="bm-stat stat-total">
              <div class="bm-stat-num">${cards.length}</div>
              <div class="bm-stat-label">Total</div>
            </div>
            <div class="bm-stat stat-overdue${overdueClass}">
              <div class="bm-stat-num">${overdue.length}</div>
              <div class="bm-stat-label">Overdue</div>
            </div>
            <div class="bm-stat stat-today${todayClass}">
              <div class="bm-stat-num">${dueToday.length}</div>
              <div class="bm-stat-label">Due Today</div>
            </div>
          </div>

          <div class="bm-health-bar-wrap">
            <div class="bm-health-label">
              <span>Completion</span>
              <span class="bm-health-pct">${done.length} / ${cards.length}</span>
            </div>
            <div class="bm-health-track">
              <div class="bm-health-fill ${healthClass}" style="width:${completionPct}%"></div>
            </div>
          </div>

          ${topLists.length ? `
          <div class="bm-lists-row">
            ${topLists.map(([name, count]) =>
              `<span class="bm-list-chip"><span class="bm-list-count">${count}</span> ${esc(name)}</span>`
            ).join("")}
          </div>` : ""}

          ${overdue.length > 0 ? `
          <div class="bm-alert">⚠ ${overdue.length} card${overdue.length > 1 ? "s" : ""} past due date</div>
          ` : ""}
          ${!health.ok ? `
          <div class="bm-alert bm-alert-convention">⚠ Missing lists: ${health.missing.map(s => esc(s)).join(", ")}</div>
          ` : ""}
        </div>
      `;

      card.querySelector(".bm-open-btn").addEventListener("click", e => {
        e.stopPropagation();
        selectBoard(board.id, board.name);
      });
      card.addEventListener("click", () => selectBoard(board.id, board.name));
      grid.appendChild(card);
    });
  }

  toolbar.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      toolbar.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      renderGrid();
    });
  });

  renderGrid();
  page.appendChild(grid);
  content.innerHTML = "";
  content.appendChild(page);
}

// ── All Tasks ─────────────────────────────────────────────────────────────────
async function showAllTasks() {
  S.mode = "all";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "All Tasks";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading all tasks...</div>';
  try {
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    renderAllTasks(getAllowedCards());
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderAllTasks(cards) {
  const content = $("board-content");
  if (!cards.length) {
    content.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><h3>No tasks found</h3></div>';
    return;
  }
  window._allCards = cards;
  const now = new Date();
  let filter = "all";
  let labelFilter = "";   // P7-2: "" = all labels
  let ownerFilter = "";   // P7-2: "" = all owners (member id)
  let groupBy = "none";   // P7-2: "none" | "label" | "member"

  // Collect unique labels and members from ALL cards for selectors
  const allLabels = [];
  const allMembers = [];
  const seenLabels = new Set(), seenMembers = new Set();
  cards.forEach(c => {
    (c.labels || []).forEach(l => { if (l.name && !seenLabels.has(l.name)) { seenLabels.add(l.name); allLabels.push(l); } });
    (c.members || []).forEach(m => { if (m.id && !seenMembers.has(m.id)) { seenMembers.add(m.id); allMembers.push(m); } });
  });

  function getFiltered() {
    let result = cards;
    if (filter === "overdue") result = result.filter(c => c.due && new Date(c.due) < now && !c.dueComplete);
    else if (filter === "today") result = result.filter(c => c.due && !c.dueComplete && new Date(c.due).toDateString() === now.toDateString());
    else if (filter === "nodue")  result = result.filter(c => !c.due);
    else if (filter === "done")   result = result.filter(c => c.dueComplete);
    if (labelFilter) result = result.filter(c => (c.labels || []).some(l => l.name === labelFilter));
    if (ownerFilter) result = result.filter(c => (c.members || []).some(m => m.id === ownerFilter));
    return result;
  }

  function counts() {
    return {
      all:     cards.length,
      overdue: cards.filter(c => c.due && new Date(c.due) < now && !c.dueComplete).length,
      today:   cards.filter(c => c.due && !c.dueComplete && new Date(c.due).toDateString() === now.toDateString()).length,
      nodue:   cards.filter(c => !c.due).length,
      done:    cards.filter(c => c.dueComplete).length,
    };
  }

  function buildCardRow(card) {
    const labelChips = (card.labels || []).filter(l => l.name).map(l =>
      `<span class="task-label-chip" style="background:${labelColor(l.color)}">${esc(l.name)}</span>`
    ).join("");
    const memberText = (card.members || []).map(m => esc(m.fullName || m.username || m.id)).join(", ");
    return `
      <div class="task-row" data-card-id="${card.id}">
        <div class="task-title">
          ${esc(card.name)}
          ${labelChips ? `<div class="task-label-chips">${labelChips}</div>` : ""}
        </div>
        <div class="task-board">${esc(card.boardName)}</div>
        <div class="task-list">${esc(card.listName)}</div>
        <div class="task-owner">${memberText || '<span style="color:#bbb">—</span>'}</div>
        <div>${card.due ? buildDueBadge(card.due, card.dueComplete) : '<span style="color:#bbb">—</span>'}</div>
        <div>${card.dueComplete ? '<span class="due-badge due-complete">Done</span>' : '<span style="color:#aaa;font-size:12px">Active</span>'}</div>
      </div>`;
  }

  function buildGroupedRows(rows) {
    if (groupBy === "label") {
      if (!rows.length) return '<div class="no-results">No tasks match this filter</div>';
      const groups = new Map();
      rows.forEach(c => {
        const lbls = (c.labels || []).filter(l => l.name);
        if (!lbls.length) {
          if (!groups.has("__none__")) groups.set("__none__", []);
          groups.get("__none__").push(c);
        } else {
          lbls.forEach(l => {
            if (!groups.has(l.name)) groups.set(l.name, []);
            groups.get(l.name).push(c);
          });
        }
      });
      return [...groups.entries()].map(([name, grpCards]) => `
        <div class="task-group-header">${name === "__none__" ? "No Label" : esc(name)} <span class="task-group-count">${grpCards.length}</span></div>
        ${grpCards.map(buildCardRow).join("")}
      `).join("");
    }
    if (groupBy === "member") {
      if (!rows.length) return '<div class="no-results">No tasks match this filter</div>';
      const groups = new Map();
      rows.forEach(c => {
        const members = c.members || [];
        if (!members.length) {
          if (!groups.has("__unassigned__")) groups.set("__unassigned__", []);
          groups.get("__unassigned__").push(c);
        } else {
          members.forEach(m => {
            const key = m.id;
            if (!groups.has(key)) groups.set(key, { label: m.fullName || m.username || m.id, cards: [] });
            groups.get(key).cards.push(c);
          });
        }
      });
      return [...groups.entries()].map(([key, val]) => {
        const label = key === "__unassigned__" ? "Unassigned" : (typeof val === "object" && val.label ? val.label : key);
        const grpCards = key === "__unassigned__" ? val : val.cards;
        return `
          <div class="task-group-header">${esc(label)} <span class="task-group-count">${grpCards.length}</span></div>
          ${grpCards.map(buildCardRow).join("")}
        `;
      }).join("");
    }
    return rows.length ? rows.map(buildCardRow).join("") : '<div class="no-results">No tasks match this filter</div>';
  }

  function render() {
    const c = counts(), rows = getFiltered();
    // M6: label/owner as pill chips (toggle); group-by stays as <select>
    const labelChipHtml = allLabels.length
      ? allLabels.map(l =>
          `<button class="filter-chip at-label-chip${labelFilter===l.name?" active":""}" data-l="${esc(l.name)}" style="${labelFilter===l.name?`background:${labelColor(l.color)};border-color:${labelColor(l.color)};color:#fff`:""}">${esc(l.name)}</button>`
        ).join("")
      : "";
    const ownerChipHtml = allMembers.length
      ? allMembers.map(m =>
          `<button class="filter-chip at-owner-chip${ownerFilter===m.id?" active":""}" data-mid="${esc(m.id)}">${esc(m.fullName||m.username||m.id)}</button>`
        ).join("")
      : "";
    content.innerHTML = `
      <div class="all-tasks-content">
        <div class="filters">
          ${[["all","All"],["overdue","Overdue"],["today","Due Today"],["nodue","No Due"],["done","Done"]]
            .map(([f,label]) => `<button class="filter-chip${filter===f?" active":""}" data-f="${f}">${label} (${c[f]})</button>`)
            .join("")}
        </div>
        ${labelChipHtml || ownerChipHtml ? `
        <div class="filters filters-row2">
          ${labelChipHtml ? `<span class="at-chip-label">Label:</span>${labelChipHtml}` : ""}
          ${labelChipHtml && ownerChipHtml ? `<span class="at-chip-divider"></span>` : ""}
          ${ownerChipHtml ? `<span class="at-chip-label">Owner:</span>${ownerChipHtml}` : ""}
          <span class="at-chip-divider"></span>
          <select class="at-select" id="at-group-sel">
            <option value="none"${groupBy==="none"?" selected":""}>No Grouping</option>
            ${allLabels.length ? `<option value="label"${groupBy==="label"?" selected":""}>Group by Label</option>` : ""}
            ${allMembers.length ? `<option value="member"${groupBy==="member"?" selected":""}>Group by Owner</option>` : ""}
          </select>
        </div>` : ""}
        <div class="task-table">
          <div class="task-table-head"><div>TASK</div><div>BOARD</div><div>LIST</div><div>OWNER</div><div>DUE</div><div>STATUS</div></div>
          <div id="task-rows">${buildGroupedRows(rows)}</div>
        </div>
      </div>`;

    content.querySelectorAll(".filter-chip[data-f]").forEach(btn => {
      btn.onclick = () => { filter = btn.dataset.f; render(); };
    });
    content.querySelectorAll(".at-label-chip").forEach(btn => {
      btn.onclick = () => { labelFilter = labelFilter === btn.dataset.l ? "" : btn.dataset.l; render(); };
    });
    content.querySelectorAll(".at-owner-chip").forEach(btn => {
      btn.onclick = () => { ownerFilter = ownerFilter === btn.dataset.mid ? "" : btn.dataset.mid; render(); };
    });
    const groupSel = $("at-group-sel");
    if (groupSel) groupSel.onchange = () => { groupBy = groupSel.value; render(); };

    const taskRows = content.querySelector("#task-rows");
    taskRows?.addEventListener("click", e => {
      const row = e.target.closest(".task-row");
      if (!row) return;
      const card = (window._allCards || []).find(c => c.id === row.dataset.cardId);
      if (card) openEditAllTasks(card);
    });
  }
  render();
}

// Map Trello label color name → CSS hex
function labelColor(color) {
  const MAP = {
    green: "#61bd4f", yellow: "#f2d600", orange: "#ff9f1a", red: "#eb5a46",
    purple: "#c377e0", blue: "#0079bf", sky: "#00c2e0", lime: "#51e898",
    pink: "#ff78cb", black: "#344563",
  };
  return MAP[color] || "#b3bac5";
}

// ── OKR Progress View (P7-3) ──────────────────────────────────────────────────
async function showOKRPage() {
  S.mode = "okr";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "OKR Progress";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading OKR data…</div>';
  try {
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    renderOKRPage(getAllowedCards(), S.boards || []);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderOKRPage(allCards, boards) {
  const content = $("board-content");

  // Detect OKR board(s): name contains "OKR" or "Objective" (case-insensitive)
  const OKR_RE = /okr|objective/i;
  const okrBoards = boards.filter(b => OKR_RE.test(b.name));

  if (!okrBoards.length) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>No OKR board found</h3>
        <p>Create a Trello board with "OKR" or "Objective" in the name, then add cards for each Objective and Key Result.</p>
        <p style="margin-top:8px;font-size:12px;color:var(--text-faint)">Convention: List names = Objective labels (e.g. "Q2 Growth"). Card names = KR descriptions.</p>
      </div>`;
    return;
  }

  // Collect OKR cards (cards on OKR boards)
  const okrBoardIds = new Set(okrBoards.map(b => b.id));
  const okrCards = allCards.filter(c => okrBoardIds.has(c.boardId));

  // Non-OKR cards (project cards) — used for linking via label name matching
  const projectCards = allCards.filter(c => !okrBoardIds.has(c.boardId));

  // Group OKR cards by listName (each list = one Objective group)
  const objectiveMap = new Map(); // listName → cards[]
  okrCards.forEach(c => {
    if (!objectiveMap.has(c.listName)) objectiveMap.set(c.listName, []);
    objectiveMap.get(c.listName).push(c);
  });

  // Helper: compute progress % for a KR card
  function krProgress(card) {
    const { done, total } = card.checklistProgress || {};
    if (total > 0) return Math.round((done / total) * 100);
    if (card.dueComplete) return 100;
    return 0;
  }

  // Helper: find project cards linked to a KR by label name match
  function linkedCards(krCard) {
    const krLabels = new Set((krCard.labels || []).map(l => l.name).filter(Boolean));
    if (!krLabels.size) return [];
    return projectCards.filter(c =>
      (c.labels || []).some(l => krLabels.has(l.name))
    );
  }

  // OKR drill-down state: null = overview, cardId = KR detail
  let drillCard = null;

  function renderDetail(krCard) {
    const linked = linkedCards(krCard);
    const now = new Date();
    const overdue = linked.filter(c => c.due && new Date(c.due) < now && !c.dueComplete);
    const upcoming = linked.filter(c => c.due && new Date(c.due) >= now && !c.dueComplete)
      .sort((a, b) => new Date(a.due) - new Date(b.due));
    const done = linked.filter(c => c.dueComplete);

    content.innerHTML = `
      <div class="okr-detail">
        <button class="btn btn-ghost btn-xs okr-back-btn">← Back to OKR Overview</button>
        <div class="okr-detail-header">
          <div class="okr-detail-title">${esc(krCard.name)}</div>
          <div class="okr-detail-meta">
            ${esc(krCard.boardName)} · ${esc(krCard.listName)}
            ${krCard.due ? ` · Due ${new Date(krCard.due).toLocaleDateString()}` : ""}
          </div>
        </div>
        <div class="okr-detail-stats">
          <div class="okr-stat"><span class="okr-stat-num">${linked.length}</span><span class="okr-stat-label">Linked Tasks</span></div>
          <div class="okr-stat"><span class="okr-stat-num" style="color:var(--danger)">${overdue.length}</span><span class="okr-stat-label">Overdue</span></div>
          <div class="okr-stat"><span class="okr-stat-num" style="color:var(--success)">${done.length}</span><span class="okr-stat-label">Done</span></div>
          <div class="okr-stat"><span class="okr-stat-num">${upcoming.length}</span><span class="okr-stat-label">Upcoming</span></div>
        </div>
        ${linked.length ? `
        <div class="okr-linked-table">
          <div class="task-table-head" style="grid-template-columns:1fr 130px 110px 90px"><div>TASK</div><div>BOARD</div><div>DUE</div><div>STATUS</div></div>
          <div class="task-table-body">
            ${linked.map(c => `
              <div class="task-row" style="grid-template-columns:1fr 130px 110px 90px">
                <div class="task-title">${esc(c.name)}</div>
                <div class="task-board">${esc(c.boardName)}</div>
                <div>${c.due ? buildDueBadge(c.due, c.dueComplete) : '<span style="color:#bbb">—</span>'}</div>
                <div>${c.dueComplete ? '<span class="due-badge due-complete">Done</span>' : '<span style="color:#aaa;font-size:12px">Active</span>'}</div>
              </div>`).join("")}
          </div>
        </div>` : `<div class="empty-state" style="padding:32px"><p>No linked project cards found.<br><span style="font-size:12px;color:var(--text-faint)">Add labels to this KR card that match labels on project board cards.</span></p></div>`}
      </div>`;

    content.querySelector(".okr-back-btn").onclick = () => { drillCard = null; renderOverview(); };
  }

  function renderOverview() {
    const now = new Date();

    const objectivesHtml = [...objectiveMap.entries()].map(([objName, krCards]) => {
      // Objective-level progress = avg of KR progresses
      const progresses = krCards.map(krProgress);
      const avgProg = krCards.length ? Math.round(progresses.reduce((a, b) => a + b, 0) / krCards.length) : 0;

      const krsHtml = krCards.map(card => {
        const prog = krProgress(card);
        const linked = linkedCards(card);
        const overdueCount = linked.filter(c => c.due && new Date(c.due) < now && !c.dueComplete).length;
        const nextDue = linked.filter(c => c.due && !c.dueComplete).sort((a, b) => new Date(a.due) - new Date(b.due))[0];

        return `
          <div class="okr-kr-row" data-card-id="${card.id}">
            <div class="okr-kr-name">${esc(card.name)}</div>
            <div class="okr-kr-progress">
              <div class="okr-progress-bar"><div class="okr-progress-fill" style="width:${prog}%"></div></div>
              <span class="okr-progress-pct">${prog}%</span>
            </div>
            <div class="okr-kr-meta">
              ${linked.length ? `<span class="okr-meta-tag">${linked.length} task${linked.length !== 1 ? "s" : ""}</span>` : ""}
              ${overdueCount ? `<span class="okr-meta-tag okr-meta-overdue">⚠ ${overdueCount} overdue</span>` : ""}
              ${nextDue ? `<span class="okr-meta-tag">Next: ${new Date(nextDue.due).toLocaleDateString()}</span>` : ""}
              ${!linked.length ? `<span class="okr-meta-tag" style="color:var(--text-faint)">No linked tasks</span>` : ""}
            </div>
          </div>`;
      }).join("");

      return `
        <div class="okr-objective">
          <div class="okr-objective-header">
            <div class="okr-objective-name">${esc(objName)}</div>
            <div class="okr-objective-progress">
              <div class="okr-progress-bar okr-progress-bar--lg"><div class="okr-progress-fill" style="width:${avgProg}%"></div></div>
              <span class="okr-progress-pct">${avgProg}%</span>
            </div>
          </div>
          <div class="okr-kr-list">${krsHtml}</div>
        </div>`;
    }).join("");

    content.innerHTML = `
      <div class="okr-overview">
        <div class="okr-board-label">Source: ${okrBoards.map(b => esc(b.name)).join(", ")}</div>
        ${objectivesHtml || '<div class="empty-state"><p>OKR board has no cards yet.</p></div>'}
      </div>`;

    content.querySelectorAll(".okr-kr-row").forEach(row => {
      row.onclick = () => {
        drillCard = okrCards.find(c => c.id === row.dataset.cardId);
        if (drillCard) renderDetail(drillCard);
      };
    });
  }

  renderOverview();
}

// ── Weekly Focus View (P7-5) ──────────────────────────────────────────────────
async function showWeeklyFocusPage() {
  S.mode = "focus";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Weekly Focus";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading…</div>';
  try {
    const [sessions] = await Promise.all([
      api.get("/api/reviews").catch(() => []),
    ]);
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    const pendingCount = sessions.reduce((n, s) => n + (s.tasks || []).filter(t => t.status === "pending").length, 0);

    // Update sidebar badge
    const badge = $("focus-pending-badge");
    if (badge) {
      badge.textContent = pendingCount || "";
      badge.style.display = pendingCount ? "" : "none";
    }

    renderWeeklyFocusPage(getAllowedCards(), pendingCount);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderWeeklyFocusPage(allCards, pendingCount) {
  const content = $("board-content");
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  weekEnd.setHours(23, 59, 59, 999);

  // Collect unique members
  const allMembers = [];
  const seenMembers = new Set();
  allCards.forEach(c => {
    (c.members || []).forEach(m => {
      if (m.id && !seenMembers.has(m.id)) { seenMembers.add(m.id); allMembers.push(m); }
    });
  });

  // Owner state (persisted on S so it survives re-render)
  if (!S.focusOwner) S.focusOwner = allMembers[0]?.id || "";

  function getWeekCards(ownerId) {
    let result = allCards.filter(c =>
      c.due && !c.dueComplete &&
      new Date(c.due) >= now &&
      new Date(c.due) <= weekEnd
    );
    if (ownerId) result = result.filter(c => (c.members || []).some(m => m.id === ownerId));
    return result.sort((a, b) => new Date(a.due) - new Date(b.due));
  }

  function groupByDay(cards) {
    const groups = new Map();
    cards.forEach(c => {
      const d = new Date(c.due);
      const key = d.toDateString();
      if (!groups.has(key)) groups.set(key, { label: formatDayLabel(d), cards: [] });
      groups.get(key).cards.push(c);
    });
    return groups;
  }

  function formatDayLabel(d) {
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function render() {
    const ownerCards = getWeekCards(S.focusOwner);
    const groups = groupByDay(ownerCards);

    const ownerOpts = allMembers.map(m =>
      `<option value="${esc(m.id)}"${S.focusOwner === m.id ? " selected" : ""}>${esc(m.fullName || m.username || m.id)}</option>`
    ).join("");

    const pendingBadgeHtml = pendingCount
      ? `<span class="focus-pending-badge">📋 ${pendingCount} pending review</span>`
      : "";

    const dayGroupsHtml = [...groups.entries()].map(([, { label, cards }]) => `
      <div class="focus-day-group">
        <div class="focus-day-header">
          <span class="focus-day-label">${esc(label)}</span>
          <span class="focus-day-count">${cards.length}</span>
        </div>
        ${cards.map(c => `
          <div class="focus-task-row" data-card-id="${c.id}">
            <div class="focus-task-name">${esc(c.name)}
              ${(c.labels || []).filter(l => l.name).map(l =>
                `<span class="task-label-chip" style="background:${labelColor(l.color)}">${esc(l.name)}</span>`
              ).join("")}
            </div>
            <div class="focus-task-meta">
              <span class="focus-task-board">${esc(c.boardName)}</span>
              ${buildDueBadge(c.due, c.dueComplete)}
            </div>
          </div>`).join("")}
      </div>`).join("");

    const emptyHtml = !ownerCards.length
      ? `<div class="empty-state" style="padding:48px">
          <div class="empty-icon">🗓</div>
          <h3>No tasks in the next 7 days</h3>
          <p>${S.focusOwner ? "No assigned tasks for this owner in the next 7 days." : "No tasks with due dates in the next 7 days."}</p>
        </div>`
      : "";

    content.innerHTML = `
      <div class="focus-wrap">
        <div class="focus-toolbar">
          ${allMembers.length ? `
            <span class="at-chip-label">Owner:</span>
            <select class="at-select" id="focus-owner-sel">
              <option value="">Everyone</option>${ownerOpts}
            </select>` : ""}
          ${pendingBadgeHtml}
        </div>
        <div class="focus-summary">
          <div class="focus-stat"><span class="focus-stat-num">${ownerCards.length}</span><span class="focus-stat-label">Tasks this week</span></div>
          <div class="focus-stat"><span class="focus-stat-num" style="color:var(--warning)">${ownerCards.filter(c => { const d = new Date(c.due); const t = new Date(); t.setDate(t.getDate()+1); return d.toDateString() === new Date().toDateString() || d.toDateString() === t.toDateString(); }).length}</span><span class="focus-stat-label">Due today/tomorrow</span></div>
          <div class="focus-stat"><span class="focus-stat-num" style="color:var(--purple,#8b5cf6)">${pendingCount}</span><span class="focus-stat-label">Pending review</span></div>
        </div>
        <div class="focus-task-list">
          ${dayGroupsHtml}${emptyHtml}
        </div>
      </div>`;

    const sel = $("focus-owner-sel");
    if (sel) sel.onchange = () => { S.focusOwner = sel.value; render(); };

    content.querySelectorAll(".focus-task-row").forEach(row => {
      row.onclick = () => {
        const card = (window._allCards || allCards).find(c => c.id === row.dataset.cardId);
        if (card) openEditAllTasks(card);
      };
    });
  }

  // Make allCards available for card modal
  window._allCards = allCards;
  render();
}

// ── Card Modal ────────────────────────────────────────────────────────────────
function openCreate(listId, lists) {
  S.editing = { cardId: null, listId, lists: lists || S.currentLists };
  $("modal-title").textContent = "New Card";
  $("card-name").value = ""; $("card-desc").value = "";
  $("card-start").value = ""; $("card-due").value = "";
  $("card-reminder").value = "-1";
  $("delete-card-btn").classList.add("hidden");
  $("checklist-section").style.display = "none";
  $("checklists-container").innerHTML = "";
  populateListSelect(listId, lists || S.currentLists);
  $("list-select-group").classList.remove("hidden");
  setupGCalSyncRow(false);
  showModal();
  setTimeout(() => $("card-name").focus(), 50);
}

function openEdit(card, listId, boardId, lists) {
  S.editing = { cardId: card.id, listId, boardId, lists: lists || S.currentLists };
  $("modal-title").textContent = "Edit Card";
  $("card-name").value = card.name;
  $("card-desc").value = card.desc || "";
  $("card-start").value = card.start ? card.start.slice(0, 16) : "";
  $("card-due").value   = card.due   ? card.due.slice(0, 16)   : "";
  $("card-reminder").value = card.dueReminder != null ? String(card.dueReminder) : "-1";
  $("delete-card-btn").classList.remove("hidden");
  populateListSelect(listId, lists || S.currentLists);
  $("list-select-group").classList.remove("hidden");
  $("checklist-section").style.display = "";
  $("checklists-container").innerHTML = '<div style="color:var(--text-muted);font-size:12px">Loading...</div>';
  setupGCalSyncRow(!!card.due);
  showModal();
  loadChecklists(card.id);
}

function openEditAllTasks(card) {
  S.editing = { cardId: card.id, listId: card.idList, boardId: card.boardId, lists: [] };
  $("modal-title").textContent = "Edit Card";
  $("card-name").value = card.name;
  $("card-desc").value = card.desc || "";
  $("card-start").value = card.start ? card.start.slice(0, 16) : "";
  $("card-due").value   = card.due   ? card.due.slice(0, 16)   : "";
  $("card-reminder").value = card.dueReminder != null ? String(card.dueReminder) : "-1";
  $("delete-card-btn").classList.remove("hidden");
  $("list-select-group").classList.add("hidden");
  $("checklist-section").style.display = "";
  $("checklists-container").innerHTML = '<div style="color:var(--text-muted);font-size:12px">Loading...</div>';
  setupGCalSyncRow(!!card.due);
  showModal();
  loadChecklists(card.id);
}

function setupGCalSyncRow(defaultChecked) {
  const group = $("gcal-sync-group");
  const checkbox = $("gcal-sync-check");
  if (!CAL.status?.connected) {
    group.style.display = "none";
    return;
  }
  group.style.display = "";
  checkbox.checked = defaultChecked;
}

function populateListSelect(currentListId, lists) {
  $("card-list").innerHTML = (lists || []).map(l =>
    `<option value="${l.id}" ${l.id === currentListId ? "selected" : ""}>${esc(l.name)}</option>`
  ).join("");
}

async function saveCard() {
  const name = $("card-name").value.trim();
  if (!name) { $("card-name").focus(); return; }

  const desc = $("card-desc").value.trim();
  const dueInput = $("card-due").value;
  const due = dueInput ? new Date(dueInput).toISOString() : null;
  const listVisible = !$("list-select-group").classList.contains("hidden");
  const targetListId = listVisible ? $("card-list").value : S.editing.listId;

  const btn = $("save-btn");
  btn.textContent = "Saving..."; btn.disabled = true;

  const startInput = $("card-start").value;
  const start = startInput ? new Date(startInput).toISOString() : null;
  const reminderVal = parseInt($("card-reminder").value ?? "-1");
  const syncCalendar = CAL.status?.connected && $("gcal-sync-check")?.checked === true;

  try {
    if (S.editing.cardId) {
      // Always include due/start in edit payload so clearing them sends null → Trello clears the field
      const payload = { name, desc, due, start, dueReminder: reminderVal, syncCalendar };
      await api.put(`/api/cards/${S.editing.cardId}`, payload);
      if (listVisible && targetListId !== S.editing.listId)
        await api.put(`/api/cards/${S.editing.cardId}/move`, { listId: targetListId });
      toast(syncCalendar ? "Card updated & synced to Calendar ✓" : "Card updated ✓");
    } else {
      await api.post("/api/cards", { listId: targetListId, name, desc, due: due || null, start: start || null, dueReminder: reminderVal, syncCalendar });
      toast(syncCalendar ? "Card created & synced to Calendar ✓" : "Card created ✓");
    }

    closeModal();
    S.allCardsCache = null;
    await refreshCurrentView();
  } catch (e) { toast("Error: " + e.message, true); }
  finally { btn.textContent = "Save"; btn.disabled = false; }
}

async function refreshCurrentView() {
  if      (S.mode === "board"    && S.currentBoardId)  await loadBoard(S.currentBoardId);
  else if (S.mode === "group"    && S.currentGroupId) {
    const group = S.config.groups.find(g => g.id === S.currentGroupId);
    const boards = S.boards.filter(b => group.boardIds.includes(b.id));
    await loadGroupView(group, boards);
  }
  else if (S.mode === "all")      await showAllTasks();
  else if (S.mode === "calendar") renderCalendar();
  else if (S.mode === "today")    await showTodayPage();
  else if (S.mode === "review")   await showReviewPage();
  else if (S.mode === "planner")  await showPlannerPage();
  else if (S.mode === "okr")      await showOKRPage();
  else if (S.mode === "focus")    await showWeeklyFocusPage();
  else if (S.mode === "settings") showSettingsPage();
}

function confirmDelete() {
  S.pendingDeleteId = S.editing.cardId;
  $("confirm-modal").classList.remove("hidden");
}
async function doDelete() {
  closeConfirm(); closeModal();
  try {
    await api.del(`/api/cards/${S.pendingDeleteId}`);
    toast("Card deleted");
    S.allCardsCache = null;
    await refreshCurrentView();
  } catch (e) { toast("Error: " + e.message, true); }
}

function showModal()    { $("card-modal").classList.remove("hidden"); }
function closeModal()   { $("card-modal").classList.add("hidden"); }
function closeConfirm() { $("confirm-modal").classList.add("hidden"); }

// ── Checklists ────────────────────────────────────────────────────────────────
async function loadChecklists(cardId) {
  const container = $("checklists-container");
  try {
    const checklists = await api.get(`/api/cards/${cardId}/checklists`);
    renderChecklists(cardId, checklists);
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);font-size:12px">⚠ ${e.message}</p>`;
  }
}

function renderChecklists(cardId, checklists) {
  const container = $("checklists-container");
  container.innerHTML = "";
  if (!checklists.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:12px;padding:4px 0">No checklists</p>';
    return;
  }
  checklists.forEach(cl => {
    const done    = cl.checkItems.filter(i => i.state === "complete").length;
    const total   = cl.checkItems.length;
    const pct     = total ? Math.round((done / total) * 100) : 0;

    const section = document.createElement("div");
    section.className = "cl-section";
    section.innerHTML = `
      <div class="cl-header">
        <span class="cl-name">☑ ${esc(cl.name)}</span>
        <span class="cl-progress-text">${done}/${total}</span>
        <button class="cl-del-btn" title="Delete checklist" data-clid="${cl.id}">🗑</button>
      </div>
      <div class="cl-progress-bar"><div class="cl-progress-fill" style="width:${pct}%"></div></div>
      <ul class="cl-items">
        ${cl.checkItems.sort((a,b) => a.pos - b.pos).map(item => `
          <li class="cl-item${item.state === "complete" ? " done" : ""}" data-itemid="${item.id}" data-clid="${cl.id}">
            <input type="checkbox" class="cl-checkbox" ${item.state === "complete" ? "checked" : ""}
              data-cardid="${cardId}" data-clid="${cl.id}" data-itemid="${item.id}">
            <span class="cl-item-name">${esc(item.name)}</span>
            <button class="cl-item-del" data-clid="${cl.id}" data-itemid="${item.id}">✕</button>
          </li>
        `).join("")}
      </ul>
      <div class="cl-add-item">
        <input type="text" class="cl-add-input form-input" placeholder="Add an item..." data-clid="${cl.id}">
        <button class="btn btn-ghost btn-sm cl-add-btn" data-clid="${cl.id}" data-cardid="${cardId}">Add</button>
      </div>
    `;

    section.querySelector(".cl-del-btn").onclick = async function() {
      if (!confirm(`Delete checklist "${cl.name}"?`)) return;
      await api.del(`/api/checklists/${this.dataset.clid}`);
      loadChecklists(cardId);
    };

    section.querySelectorAll(".cl-checkbox").forEach(cb => {
      cb.onchange = async function() {
        const state = this.checked ? "complete" : "incomplete";
        this.disabled = true;
        await api.put(`/api/cards/${this.dataset.cardid}/checklists/${this.dataset.clid}/checkitems/${this.dataset.itemid}`, { state });
        loadChecklists(cardId);
      };
    });

    section.querySelectorAll(".cl-item-del").forEach(btn => {
      btn.onclick = async function() {
        await api.del(`/api/checklists/${this.dataset.clid}/checkitems/${this.dataset.itemid}`);
        loadChecklists(cardId);
      };
    });

    section.querySelectorAll(".cl-add-btn").forEach(btn => {
      btn.onclick = async function() {
        const input = section.querySelector(`.cl-add-input[data-clid="${this.dataset.clid}"]`);
        const name = input.value.trim();
        if (!name) return;
        input.value = ""; btn.disabled = true;
        await api.post(`/api/checklists/${this.dataset.clid}/checkitems`, { name });
        loadChecklists(cardId);
      };
    });
    section.querySelectorAll(".cl-add-input").forEach(inp => {
      inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); inp.nextElementSibling?.click(); } };
    });

    container.appendChild(section);
  });
}

async function promptAddChecklist() {
  const cardId = S.editing?.cardId;
  if (!cardId) return;
  const name = prompt("Checklist name:", "Checklist");
  if (!name?.trim()) return;
  await api.post(`/api/cards/${cardId}/checklists`, { name: name.trim() });
  loadChecklists(cardId);
}

// ── Add List ──────────────────────────────────────────────────────────────────
async function addList() {
  if (!S.currentBoardId) return;
  const name = prompt("List name:");
  if (!name?.trim()) return;
  try {
    await api.post(`/api/boards/${S.currentBoardId}/lists`, { name: name.trim() });
    toast("List created ✓");
    await loadBoard(S.currentBoardId);
  } catch (e) { toast("Error: " + e.message, true); }
}

// ── Manage Groups Modal ───────────────────────────────────────────────────────
async function openManage() {
  S.draftConfig = JSON.parse(JSON.stringify(S.config));
  if (!S.draftConfig.allowedWorkspaceIds) S.draftConfig.allowedWorkspaceIds = [];
  renderGroupsEditor();
  renderVisibilityEditor();
  $("manage-modal").classList.remove("hidden");
  switchManageTab("groups");
  loadWorkspacesEditor();
}

function switchManageTab(tab) {
  document.querySelectorAll(".manage-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  document.querySelectorAll(".manage-tab-panel").forEach(p => p.style.display = "none");
  const panel = tab === "workspaces" ? $("tab-workspaces") : $("tab-groups");
  if (panel) panel.style.display = tab === "groups" ? "flex" : "block";
}

async function loadWorkspacesEditor() {
  const container = $("workspaces-editor");
  try {
    const workspaces = await api.get("/api/workspaces");
    if (!workspaces.length) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">ไม่พบ Workspace ใน Trello account นี้</p>';
      return;
    }
    if (S.draftConfig.allowedWorkspaceIds.length === 0) {
      S.draftConfig.allowedWorkspaceIds = workspaces.map(ws => ws.id);
    }
    const render = () => {
      container.innerHTML = "";
      workspaces.forEach(ws => {
        const isChecked = S.draftConfig.allowedWorkspaceIds.includes(ws.id);
        const row = document.createElement("div");
        row.className = "ws-row";
        row.innerHTML = `
          <label class="ws-label">
            <input type="checkbox" class="ws-check" data-wsid="${ws.id}" ${isChecked ? "checked" : ""}>
            <span class="ws-name">🏢 ${esc(ws.displayName || ws.name)}</span>
          </label>
          <span style="font-size:11px;color:var(--text-muted)">${esc(ws.name)}</span>
        `;
        row.querySelector(".ws-check").onchange = function() {
          const wsId = this.dataset.wsid;
          if (this.checked) {
            if (!S.draftConfig.allowedWorkspaceIds.includes(wsId))
              S.draftConfig.allowedWorkspaceIds.push(wsId);
          } else {
            S.draftConfig.allowedWorkspaceIds = S.draftConfig.allowedWorkspaceIds.filter(id => id !== wsId);
          }
          updateWsHint(workspaces);
        };
        container.appendChild(row);
      });
      const shortcuts = document.createElement("div");
      shortcuts.style.cssText = "display:flex;gap:8px;margin-top:10px";
      const allBtn = document.createElement("button");
      allBtn.className = "btn btn-ghost";
      allBtn.style.fontSize = "12px";
      allBtn.textContent = "เลือกทั้งหมด";
      allBtn.onclick = () => { S.draftConfig.allowedWorkspaceIds = workspaces.map(w => w.id); render(); };
      shortcuts.appendChild(allBtn);
      container.appendChild(shortcuts);
      updateWsHint(workspaces);
    };
    render();
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger)">⚠ ${e.message}</p>`;
  }
}

function updateWsHint(workspaces) {
  const allowed = S.draftConfig.allowedWorkspaceIds;
  let hint = $("ws-hint");
  if (!hint) {
    hint = document.createElement("p");
    hint.id = "ws-hint";
    hint.style.cssText = "font-size:12px;color:var(--text-muted);margin-top:12px;padding-top:12px;border-top:1px solid var(--border)";
    $("workspaces-editor").appendChild(hint);
  }
  if (allowed.length === 0) {
    hint.textContent = "✓ แสดงทุก Workspace (ไม่ได้กำหนด)";
  } else if (allowed.length === workspaces.length) {
    hint.textContent = `✓ อนุญาตทั้งหมด ${workspaces.length} Workspace`;
  } else {
    hint.textContent = `✓ อนุญาต ${allowed.length} จาก ${workspaces.length} Workspace`;
  }
}

function closeManage() { $("manage-modal").classList.add("hidden"); S.draftConfig = null; }

function renderGroupsEditor() {
  const container = $("groups-editor");
  container.innerHTML = "";
  S.draftConfig.groups.forEach((group, gi) => {
    const row = document.createElement("div");
    row.className = "group-edit-row";
    const assignedBoards = new Set(group.boardIds);
    row.innerHTML = `
      <div class="group-edit-header">
        <input type="color" class="group-color-picker" value="${group.color || "#6366f1"}" data-gi="${gi}">
        <input type="text" class="group-edit-name" value="${esc(group.name)}" placeholder="Group name..." data-gi="${gi}">
        <button class="group-del-btn" data-gi="${gi}" title="Delete group">🗑</button>
      </div>
      <div class="group-boards-selector" data-gi="${gi}">
        ${S.boards.filter(b => !S.config.hiddenBoards.includes(b.id)).map(b => `
          <span class="board-chip${assignedBoards.has(b.id) ? " selected" : ""}" data-bid="${b.id}" data-gi="${gi}">${esc(b.name)}</span>
        `).join("")}
      </div>
    `;
    row.querySelector(".group-color-picker").oninput = e => { S.draftConfig.groups[gi].color = e.target.value; };
    row.querySelector(".group-edit-name").oninput = e => { S.draftConfig.groups[gi].name = e.target.value; };
    row.querySelector(".group-del-btn").onclick = () => { S.draftConfig.groups.splice(gi, 1); renderGroupsEditor(); };
    row.querySelectorAll(".board-chip").forEach(chip => {
      chip.onclick = () => {
        const bid = chip.dataset.bid;
        const idx = S.draftConfig.groups[gi].boardIds.indexOf(bid);
        if (idx === -1) S.draftConfig.groups[gi].boardIds.push(bid);
        else S.draftConfig.groups[gi].boardIds.splice(idx, 1);
        chip.classList.toggle("selected");
      };
    });
    container.appendChild(row);
  });
  if (!S.draftConfig.groups.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:8px 0">No groups yet. Click "+ New Group" to create one.</p>';
  }
}

function renderVisibilityEditor() {
  const container = $("visibility-editor");
  container.innerHTML = "";
  const hidden = new Set(S.draftConfig.hiddenBoards);
  S.boards.forEach((board, i) => {
    const isHidden = hidden.has(board.id);
    const row = document.createElement("div");
    row.className = "vis-row";
    row.innerHTML = `
      <span class="vis-dot" style="background:${COLORS[i % COLORS.length]}"></span>
      <span class="vis-name" title="${esc(board.name)}">${esc(board.name)}</span>
      <button class="vis-toggle${isHidden ? " hidden-toggle" : ""}" data-bid="${board.id}">
        ${isHidden ? "🙈 Hidden" : "👁 Visible"}
      </button>
    `;
    row.querySelector(".vis-toggle").onclick = function() {
      const bid = this.dataset.bid;
      const idx = S.draftConfig.hiddenBoards.indexOf(bid);
      if (idx === -1) {
        S.draftConfig.hiddenBoards.push(bid);
        this.textContent = "🙈 Hidden";
        this.classList.add("hidden-toggle");
        S.draftConfig.groups.forEach(g => {
          const bi = g.boardIds.indexOf(bid);
          if (bi !== -1) g.boardIds.splice(bi, 1);
        });
      } else {
        S.draftConfig.hiddenBoards.splice(idx, 1);
        this.textContent = "👁 Visible";
        this.classList.remove("hidden-toggle");
      }
    };
    container.appendChild(row);
  });
}

function addGroup() {
  S.draftConfig.groups.push({
    id: "g_" + Date.now(),
    name: "New Group",
    color: COLORS[S.draftConfig.groups.length % COLORS.length],
    boardIds: [],
  });
  renderGroupsEditor();
  setTimeout(() => {
    const inputs = $("groups-editor").querySelectorAll(".group-edit-name");
    inputs[inputs.length - 1]?.focus();
    inputs[inputs.length - 1]?.select();
  }, 50);
}

async function saveConfig() {
  try {
    const workspaces = await api.get("/api/workspaces").catch(() => []);
    if (workspaces.length > 0 &&
        S.draftConfig.allowedWorkspaceIds.length === workspaces.length &&
        workspaces.every(ws => S.draftConfig.allowedWorkspaceIds.includes(ws.id))) {
      S.draftConfig.allowedWorkspaceIds = [];
    }
    await api.post("/api/config", S.draftConfig);
    S.config = S.draftConfig;
    S.draftConfig = null;
    closeManage();
    toast("Saved ✓ — กำลัง reload boards...");
    const boards = await api.get("/api/boards").catch(() => S.boards);
    S.boards = boards;
    CAL.selectedBoardIds = null;
    renderSidebar();
    await refreshCurrentView();
  } catch (e) { toast("Save failed: " + e.message, true); }
}

// ── Topbar Refresh ────────────────────────────────────────────────────────────
async function topbarRefresh() {
  S.allCardsCache = null;
  const [boards] = await Promise.all([api.get("/api/boards").catch(() => S.boards)]);
  S.boards = boards;
  renderSidebar();
  await refreshCurrentView();
}

// ── Toggle hidden boards ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = $("toggle-hidden-btn");
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      const ul = $("hidden-boards-list");
      const visible = ul.style.display !== "none";
      ul.style.display = visible ? "none" : "block";
      toggleBtn.textContent = `${visible ? "👁" : "🙈"} ${visible ? "Show" : "Hide"} hidden boards (${$("hidden-count").textContent})`;
    };
  }
});

// ── Toast ─────────────────────────────────────────────────────────────────────
let _tt;
function toast(msg, isError = false) {
  const el = $("toast");
  el.textContent = msg;
  el.style.background = isError ? "#b91c1c" : "#1e293b";
  el.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove("show"), 3000);
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Event listeners ───────────────────────────────────────────────────────────
$("add-list-btn").onclick = addList;

$("card-modal").addEventListener("click",      e => { if (e.target === $("card-modal"))      closeModal(); });
$("confirm-modal").addEventListener("click",   e => { if (e.target === $("confirm-modal"))   closeConfirm(); });
$("manage-modal").addEventListener("click",    e => { if (e.target === $("manage-modal"))    closeManage(); });
$("cal-setup-modal").addEventListener("click", e => { if (e.target === $("cal-setup-modal")) closeCalSetup(); });
$("cal-event-modal").addEventListener("click",    e => { if (e.target === $("cal-event-modal"))    closeCalModal(); });
$("transcript-modal").addEventListener("click",  e => { if (e.target === $("transcript-modal"))  closeTranscriptModal(); });

$("cal-allday").addEventListener("change", () => {
  const allDay = $("cal-allday").checked;
  $("cal-allday-dates").style.display = allDay ? "grid" : "none";
  const dateTimeRow = document.querySelector(".form-row:has(#cal-start)");
  if (dateTimeRow) dateTimeRow.style.display = allDay ? "none" : "grid";
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModal(); closeConfirm(); closeManage(); closeCalSetup(); closeCalModal(); }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (!$("card-modal").classList.contains("hidden"))      saveCard();
    if (!$("cal-event-modal").classList.contains("hidden")) saveCalEvent();
  }
});

window.addEventListener("message", e => {
  if (e.origin !== "http://localhost:3000") return;
  if (e.data === "cal_connected") {
    CAL.status = { connected: true };
    const gcalEl = $("sidebar-gcal-status");
    if (gcalEl) gcalEl.style.display = "";
    toast("Google Calendar connected ✓");
    navigateTo("calendar");
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
init();

// ══════════════════════════════════════════════════════════════════════════════
// GOOGLE CALENDAR
// ══════════════════════════════════════════════════════════════════════════════

const CAL = {
  status: null,
  events: [],
  trelloCards: [],
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  editingEventId: null,
  selectedBoardIds: null,
};

// ── Show calendar view ────────────────────────────────────────────────────────
async function showCalendar() {
  S.mode = "calendar";
  S.currentBoardId = null; S.currentGroupId = null;
  $("board-title").textContent = "Calendar";
  $("board-subtitle").textContent = "Trisilar";
  $("add-list-btn").classList.add("hidden");

  CAL.status = await api.get("/api/calendar/status").catch(() => null);

  if (!CAL.status?.connected) {
    $("board-content").innerHTML = `
      <div class="cal-connect-state">
        <div class="empty-icon">📅</div>
        <h3>Connect Google Calendar</h3>
        <p>เชื่อมต่อ Google Calendar เพื่อดูและจัดการ events ใน Trisilar calendar</p>
        <button class="btn btn-primary" onclick="openCalSetup()" style="margin-top:8px">Connect Google Calendar →</button>
      </div>`;
    return;
  }
  renderCalendar();
}

async function renderCalendar() {
  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading events...</div>';

  if (CAL.selectedBoardIds === null) {
    CAL.selectedBoardIds = S.boards
      .filter(b => !S.config.hiddenBoards.includes(b.id))
      .map(b => b.id);
  }

  const { currentYear: y, currentMonth: m } = CAL;
  const start = new Date(y, m, 1).toISOString();
  const end   = new Date(y, m + 1, 0, 23, 59, 59).toISOString();

  try {
    const [gcalEvents, trelloData] = await Promise.all([
      CAL.status?.connected
        ? api.get(`/api/calendar/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
        : Promise.resolve([]),
      CAL.selectedBoardIds.length
        ? api.post("/api/boards/cards", { boardIds: CAL.selectedBoardIds })
        : Promise.resolve([]),
    ]);
    CAL.events      = gcalEvents;
    CAL.trelloCards = trelloData;
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
    return;
  }

  content.innerHTML = "";
  const view = document.createElement("div");
  view.className = "calendar-view";

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const topbar = document.createElement("div");
  topbar.className = "cal-topbar";
  topbar.innerHTML = `
    <button class="cal-nav-btn" id="cal-prev">‹</button>
    <span class="cal-month-label">${monthNames[m]} ${y}</span>
    <button class="cal-nav-btn" id="cal-next">›</button>
    <button class="cal-today-btn" id="cal-go-today">Today</button>
    <button class="btn btn-primary cal-add-btn" id="cal-add">+ New Event</button>
  `;
  view.appendChild(topbar);

  const visibleBoards = S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
  const selectorRow = document.createElement("div");
  selectorRow.className = "cal-board-selector";
  const selectorLabel = document.createElement("span");
  selectorLabel.className = "cal-selector-label";
  selectorLabel.textContent = "Show boards:";
  selectorRow.appendChild(selectorLabel);

  visibleBoards.forEach((board, i) => {
    const chip = document.createElement("button");
    chip.className = "cal-board-chip" + (CAL.selectedBoardIds.includes(board.id) ? " active" : "");
    chip.style.setProperty("--chip-color", COLORS[i % COLORS.length]);
    chip.textContent = board.name;
    chip.title = board.name;
    chip.onclick = () => {
      const idx = CAL.selectedBoardIds.indexOf(board.id);
      if (idx === -1) CAL.selectedBoardIds.push(board.id);
      else CAL.selectedBoardIds.splice(idx, 1);
      renderCalendar();
    };
    selectorRow.appendChild(chip);
  });

  const allBtn = document.createElement("button");
  allBtn.className = "cal-selector-shortcut";
  allBtn.textContent = "All";
  allBtn.onclick = () => { CAL.selectedBoardIds = visibleBoards.map(b => b.id); renderCalendar(); };
  const noneBtn = document.createElement("button");
  noneBtn.className = "cal-selector-shortcut";
  noneBtn.textContent = "None";
  noneBtn.onclick = () => { CAL.selectedBoardIds = []; renderCalendar(); };
  selectorRow.appendChild(allBtn);
  selectorRow.appendChild(noneBtn);
  view.appendChild(selectorRow);

  const gridWrap = document.createElement("div");
  gridWrap.className = "cal-grid-wrap";
  gridWrap.appendChild(buildCalGrid(y, m, CAL.events, CAL.trelloCards));
  view.appendChild(gridWrap);

  // P6-2: empty state banner when no events for this month
  const monthPrefix = `${y}-${String(m + 1).padStart(2, "0")}`;
  const hasTrelloThisMonth = CAL.trelloCards.some(c => c.due?.startsWith(monthPrefix));
  if (!CAL.events.length && !hasTrelloThisMonth) {
    const calEmpty = document.createElement("div");
    calEmpty.className = "cal-empty-notice";
    calEmpty.innerHTML = CAL.status?.connected
      ? "No events or Trello deadlines this month"
      : `No Trello deadlines this month · <a href="#" onclick="openCalSetup();return false" style="color:var(--primary)">Connect Google Calendar</a> to see more`;
    view.appendChild(calEmpty);
  }

  content.appendChild(view);

  $("cal-prev").onclick = () => { if (CAL.currentMonth === 0) { CAL.currentMonth = 11; CAL.currentYear--; } else CAL.currentMonth--; renderCalendar(); };
  $("cal-next").onclick = () => { if (CAL.currentMonth === 11) { CAL.currentMonth = 0; CAL.currentYear++; } else CAL.currentMonth++; renderCalendar(); };
  $("cal-go-today").onclick = () => { CAL.currentYear = new Date().getFullYear(); CAL.currentMonth = new Date().getMonth(); renderCalendar(); };
  $("cal-add").onclick = () => openCalCreate();
}

function buildCalGrid(year, month, events, trelloCards = []) {
  const grid = document.createElement("div");
  grid.className = "cal-grid";

  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  DAYS.forEach((d, i) => {
    const h = document.createElement("div");
    h.className = "cal-dow" + (i === 0 || i === 6 ? " weekend" : "");
    h.textContent = d;
    grid.appendChild(h);
  });

  const today = new Date();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const eventMap = {};
  events.forEach(ev => {
    const dateStr = ev.start?.date || ev.start?.dateTime?.slice(0, 10);
    if (!dateStr) return;
    if (!eventMap[dateStr]) eventMap[dateStr] = [];
    eventMap[dateStr].push({ type: "gcal", data: ev });
  });

  const boardColorMap = {};
  S.boards.forEach((b, i) => { boardColorMap[b.id] = COLORS[i % COLORS.length]; });

  trelloCards.forEach(card => {
    if (card.due) {
      const dateStr = card.due.slice(0, 10);
      if (!eventMap[dateStr]) eventMap[dateStr] = [];
      eventMap[dateStr].push({ type: "trello-due", data: card });
    }
    if (card.start) {
      const startStr = card.start.slice(0, 10);
      const dueStr   = card.due?.slice(0, 10);
      if (startStr !== dueStr) {
        if (!eventMap[startStr]) eventMap[startStr] = [];
        eventMap[startStr].push({ type: "trello-start", data: card });
      }
    }
  });

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cal-cell";

    let day, dateStr, isCurrentMonth = true;

    if (i < firstDay) {
      day = daysInPrev - firstDay + i + 1;
      dateStr = month === 0
        ? `${year-1}-12-${String(day).padStart(2,"0")}`
        : `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      isCurrentMonth = false;
      cell.classList.add("other-month");
    } else if (i >= firstDay + daysInMonth) {
      day = i - firstDay - daysInMonth + 1;
      const nm = month + 1 > 11 ? 0 : month + 1;
      const ny = month + 1 > 11 ? year + 1 : year;
      dateStr = `${ny}-${String(nm + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      isCurrentMonth = false;
      cell.classList.add("other-month");
    } else {
      day = i - firstDay + 1;
      dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    }

    const dow = (i % 7);
    if (dow === 0 || dow === 6) cell.classList.add("weekend");
    if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day && isCurrentMonth)
      cell.classList.add("today");

    const numEl = document.createElement("span");
    numEl.className = "cal-day-num";
    numEl.textContent = day;
    cell.appendChild(numEl);

    const dayItems = eventMap[dateStr] || [];
    const maxShow  = 3;
    dayItems.slice(0, maxShow).forEach(item => {
      const chip = document.createElement("span");

      if (item.type === "gcal") {
        const ev = item.data;
        chip.className = "cal-event-chip" + (ev.start?.date ? " all-day" : "");
        const timeStr = ev.start?.dateTime
          ? new Date(ev.start.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " "
          : "";
        chip.textContent = timeStr + (ev.summary || "(No title)");
        chip.title = ev.summary || "";
        chip.onclick = e => { e.stopPropagation(); openCalEdit(ev); };

      } else if (item.type === "trello-due") {
        const card = item.data;
        const color = boardColorMap[card.boardId] || "#6366f1";
        chip.className = "cal-event-chip trello-due";
        chip.style.setProperty("--trello-color", color);
        const overdue = !card.dueComplete && new Date(card.due) < today;
        if (overdue) chip.classList.add("trello-overdue");
        if (card.dueComplete) chip.classList.add("trello-done");
        chip.textContent = "📌 " + card.name;
        chip.title = `[${card.boardName || card.boardId}] ${card.name}`;
        chip.onclick = e => { e.stopPropagation(); openEditAllTasks(card); };

      } else if (item.type === "trello-start") {
        const card = item.data;
        const color = boardColorMap[card.boardId] || "#6366f1";
        chip.className = "cal-event-chip trello-start";
        chip.style.setProperty("--trello-color", color);
        chip.textContent = "▶ " + card.name;
        chip.title = `Start: [${card.boardName || card.boardId}] ${card.name}`;
        chip.onclick = e => { e.stopPropagation(); openEditAllTasks(card); };
      }

      cell.appendChild(chip);
    });

    if (dayItems.length > maxShow) {
      const more = document.createElement("span");
      more.className = "cal-event-more";
      more.textContent = `+${dayItems.length - maxShow} more`;
      more.onclick = e => { e.stopPropagation(); openCalCreate(dateStr); };
      cell.appendChild(more);
    }

    cell.onclick = () => openCalCreate(dateStr);
    grid.appendChild(cell);
  }

  return grid;
}

// ── Calendar Setup (OAuth) ────────────────────────────────────────────────────
function openCalSetup()  { $("cal-setup-modal").classList.remove("hidden"); }
function closeCalSetup() { $("cal-setup-modal").classList.add("hidden"); }

async function startGoogleAuth() {
  const clientId     = $("setup-client-id").value.trim();
  const clientSecret = $("setup-client-secret").value.trim();
  if (!clientId || !clientSecret) { toast("กรุณากรอก Client ID และ Client Secret", true); return; }
  try {
    // POST credentials in body — never in URL — to avoid browser history / server log exposure
    const data = await api.post("/auth/google", { clientId, clientSecret });
    const popup = window.open(data.url, "_blank", "width=500,height=650");
    if (!popup) { toast("กรุณาอนุญาต popup เพื่อเชื่อมต่อ Google", true); return; }
    closeCalSetup();
  } catch (e) {
    toast("เชื่อมต่อ Google ไม่ได้: " + e.message, true);
  }
}

// ── Calendar Event Modal ──────────────────────────────────────────────────────
function openCalCreate(dateStr) {
  CAL.editingEventId = null;
  $("cal-modal-title").textContent = "New Event";
  $("cal-title").value = "";
  $("cal-desc").value = "";
  $("cal-reminder").value = "30";
  $("cal-allday").checked = false;
  $("cal-allday-dates").style.display = "none";
  const dateTimeRow = document.querySelector(".form-row:has(#cal-start)");
  if (dateTimeRow) dateTimeRow.style.display = "grid";

  if (dateStr) {
    const d = new Date(dateStr + "T09:00");
    const pad = n => String(n).padStart(2,"0");
    const local = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T09:00`;
    const localEnd = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T10:00`;
    $("cal-start").value = local;
    $("cal-end").value   = localEnd;
    $("cal-start-date").value = dateStr;
    $("cal-end-date").value   = dateStr;
  } else {
    $("cal-start").value = ""; $("cal-end").value = "";
    $("cal-start-date").value = ""; $("cal-end-date").value = "";
  }

  $("cal-delete-btn").classList.add("hidden");
  $("cal-event-modal").classList.remove("hidden");
  setTimeout(() => $("cal-title").focus(), 50);
}

function openCalEdit(ev) {
  CAL.editingEventId = ev.id;
  $("cal-modal-title").textContent = "Edit Event";
  $("cal-title").value = ev.summary || "";
  $("cal-desc").value  = ev.description || "";

  const allDay = !!ev.start?.date;
  $("cal-allday").checked = allDay;
  $("cal-allday-dates").style.display = allDay ? "grid" : "none";
  const dateTimeRow = document.querySelector(".form-row:has(#cal-start)");
  if (dateTimeRow) dateTimeRow.style.display = allDay ? "none" : "grid";

  if (allDay) {
    $("cal-start-date").value = ev.start.date;
    $("cal-end-date").value   = ev.end.date;
  } else {
    $("cal-start").value = ev.start.dateTime?.slice(0,16) || "";
    $("cal-end").value   = ev.end.dateTime?.slice(0,16)   || "";
  }

  const overrides = ev.reminders?.overrides || [];
  $("cal-reminder").value = overrides[0]?.minutes ?? "";

  $("cal-delete-btn").classList.remove("hidden");
  $("cal-event-modal").classList.remove("hidden");
}

function closeCalModal() { $("cal-event-modal").classList.add("hidden"); }

async function saveCalEvent() {
  const title = $("cal-title").value.trim();
  if (!title) { $("cal-title").focus(); return; }

  const allDay = $("cal-allday").checked;
  const reminderVal = $("cal-reminder").value;

  const payload = {
    summary:         title,
    description:     $("cal-desc").value.trim(),
    allDay,
    start:           allDay ? $("cal-start-date").value : $("cal-start").value,
    end:             allDay ? $("cal-end-date").value   : $("cal-end").value,
    reminderMinutes: reminderVal !== "" ? parseInt(reminderVal) : null,
  };

  if (!payload.start) { toast("กรุณาระบุ Start Date", true); return; }

  const btn = $("cal-save-btn");
  btn.textContent = "Saving..."; btn.disabled = true;

  try {
    if (CAL.editingEventId) {
      await api.put(`/api/calendar/events/${CAL.editingEventId}`, payload);
      toast("Event updated ✓");
    } else {
      await api.post("/api/calendar/events", payload);
      toast("Event created ✓");
    }
    closeCalModal();
    await renderCalendar();
  } catch (e) { toast("Error: " + e.message, true); }
  finally { btn.textContent = "Save"; btn.disabled = false; }
}

async function deleteCalEvent() {
  if (!CAL.editingEventId) return;
  if (!confirm("Delete this event?")) return;
  closeCalModal();
  try {
    await api.del(`/api/calendar/events/${CAL.editingEventId}`);
    toast("Event deleted");
    await renderCalendar();
  } catch (e) { toast("Error: " + e.message, true); }
}
