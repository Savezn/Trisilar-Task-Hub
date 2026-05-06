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
        label.textContent = formatThaiDateTime(dateKey, false);
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
    ? formatThaiDateTime(card.due)
    : "";

  const dueDateVal = card.due ? card.due.slice(0, 10) : "";
  const isOverdue  = chipClass === "chip-overdue";

  row.innerHTML = `
    <span class="chip ${chipClass}" style="flex-shrink:0">${chipLabel}</span>
    <span class="today-task-name">${esc(card.name)}</span>
    <span class="today-task-board">${esc(card.boardName || "")}</span>
    ${isOverdue
      ? `<input type="date" class="today-date-picker" value="${dueDateVal}" title="Reschedule">`
      : `<span class="today-task-due">${dueText}</span>`}
    <div class="today-task-actions">
      <button class="btn btn-success btn-xs" title="Mark done" data-action="done">✓</button>
      <button class="btn btn-ghost btn-xs" title="Open card" data-action="open">↗</button>
    </div>
  `;

  // Inline date picker — reschedule overdue card
  const datePicker = row.querySelector(".today-date-picker");
  if (datePicker) {
    datePicker.addEventListener("click",  e => e.stopPropagation());
    datePicker.addEventListener("change", async e => {
      e.stopPropagation();
      const val = e.target.value;
      if (!val) return;
      try {
        await api.put(`/api/cards/${card.id}`, { due: new Date(val).toISOString() });
        S.allCardsCache = null;
        toast("Rescheduled ✓");
        showTodayPage();
      } catch (err) {
        toast("Error: " + err.message, true);
      }
    });
  }

  // Click row → open card
  row.addEventListener("click", e => {
    if (e.target.closest(".today-task-actions") || e.target.closest(".today-date-picker")) return;
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
