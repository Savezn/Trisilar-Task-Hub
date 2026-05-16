// Today Page
// Implemented by Codex Dev: W2 shell-compatible Today redesign.
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
    if (!isTrelloVerified()) {
      content.innerHTML = trelloRouteUnavailableHtml("Today");
      return;
    }
    const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const [sessions, calEvents, googleTasksStatus, paperclipOps] = await Promise.all([
      api.get("/api/reviews").catch(() => []),
      CAL.status?.connected
        ? api.get(`/api/calendar/events?start=${encodeURIComponent(todayStart)}&end=${encodeURIComponent(tomorrowStart)}`).catch(() => [])
        : Promise.resolve(null),
      api.get("/api/google-tasks/status").catch(() => null),
      api.get("/api/integrations/paperclip/operations/status").catch(() => null),
    ]);

    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    renderTodayPage(getAllowedCards(), dateStr, sessions, calEvents, {
      trello: trelloConnectionSummary(),
      calendar: CAL.status,
      googleTasks: googleTasksStatus,
      paperclip: paperclipOps,
    });
  } catch (e) {
    content.innerHTML = trelloRouteUnavailableHtml("Today");
  }
}

function relativeDue(isoString) {
  if (!isoString) return "No due date";
  const due = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const days = Math.round((dueDay - today) / 86400000);
  const time = due.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

  if (days === 0) return `Today ${time}`;
  if (days === 1) return `Tomorrow ${time}`;
  if (days === -1) return `Yesterday ${time}`;
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days <= 7) return `In ${days}d ${time}`;
  return formatThaiDateTime(isoString);
}

function todayContextLabel(card) {
  return [card.boardName || "Trello", card.listName || "No list"].filter(Boolean).join(" / ");
}

function todayNextActionLabel(card, state) {
  if (state === "overdue") return "Next action: reschedule or mark done";
  if (state === "today") return "Next action: do today or mark done";
  if (state === "upcoming") return "Next action: plan next";
  return card.dueComplete ? "Next action: reopen if needed" : "Next action: open task";
}

function todayOwnerLabel(card) {
  const members = Array.isArray(card.members) ? card.members : [];
  const names = members.map(m => m.fullName || m.username || m.name).filter(Boolean);
  return names.length ? names.slice(0, 2).join(", ") + (names.length > 2 ? ` +${names.length - 2}` : "") : "Unassigned";
}

function buildTodayDecisionCue(card, state) {
  return `
    <span class="today-decision-chip">Source: Trello</span>
    <span class="today-decision-chip">Context: ${esc(todayContextLabel(card))}</span>
    <span class="today-decision-chip">Owner: ${esc(todayOwnerLabel(card))}</span>
    <span class="today-decision-chip today-next-action">${esc(todayNextActionLabel(card, state))}</span>
  `;
}

function renderTodayPage(allCards, dateStr, sessions = [], calEvents = null, integrations = {}) {
  const content = $("board-content");
  const now = new Date();
  const todayStr = now.toDateString();
  const cards = allCards;
  const byDue = (a, b) => new Date(a.due || 0) - new Date(b.due || 0);

  const overdue = cards
    .filter(c => c.due && new Date(c.due) < now && !c.dueComplete)
    .sort(byDue);
  const dueToday = cards
    .filter(c => c.due && !c.dueComplete && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now)
    .sort(byDue);
  const upcoming = cards
    .filter(c => {
      if (!c.due || c.dueComplete) return false;
      const d = new Date(c.due);
      const diff = d - now;
      return d.toDateString() !== todayStr && diff > 0 && diff < 7 * 86400000;
    })
    .sort(byDue);

  const pendingTasks = (sessions || []).flatMap(s =>
    (s.tasks || []).filter(t => t.status === "pending").map(t => ({ ...t, _sessionId: s.id, _sessionTitle: s.title }))
  );
  const pendingCount = pendingTasks.length;
  const activeReviewSessions = (sessions || []).filter(s => (s.tasks || []).some(t => t.status === "pending")).length;

  const upcomingByDate = {};
  upcoming.forEach(c => {
    const key = new Date(c.due).toDateString();
    if (!upcomingByDate[key]) upcomingByDate[key] = [];
    upcomingByDate[key].push(c);
  });

  const totalAttention = overdue.length + dueToday.length + pendingCount;
  const activeBoards = new Set([...overdue, ...dueToday].map(c => c.boardId || c.boardName).filter(Boolean)).size;
  const hero = dueToday[0] || overdue[0] || upcoming[0] || null;

  const page = document.createElement("div");
  page.className = "today-page";
  page.innerHTML = `
    <div class="today-command-header">
      <div>
        <div class="today-kicker">${esc(dateStr)}</div>
        <div class="today-title">Daily command center</div>
        <div class="today-subtitle">Start here: ${totalAttention} items need attention across Trello and Review Queue: ${overdue.length} overdue, ${dueToday.length} due today, ${pendingCount} pending review.</div>
      </div>
      <div class="today-header-actions">
        <button class="btn btn-primary btn-sm" type="button" data-today-action="focus-quick-add">${typeof icon === "function" ? icon("plus") : ""}Quick add</button>
      </div>
    </div>
  `;

  page.appendChild(buildTodayPriorityLane({ hero, overdue, dueToday, pendingTasks, activeReviewSessions, sessions }));

  const statsRow = document.createElement("div");
  statsRow.className = "today-stats-row";
  statsRow.innerHTML = `
    <div class="today-stat-card stat-overdue">
      <div class="today-stat-head"><span class="today-stat-icon">${typeof icon === "function" ? icon("alert") : ""}</span>Overdue</div>
      <div class="today-stat-num">${overdue.length}</div>
      <div class="today-stat-label">${overdue.length ? "Oldest " + relativeDue(overdue[0].due) : "All caught up"}</div>
    </div>
    <div class="today-stat-card stat-today">
      <div class="today-stat-head"><span class="today-stat-icon">${typeof icon === "function" ? icon("today") : ""}</span>Due Today</div>
      <div class="today-stat-num">${dueToday.length}</div>
      <div class="today-stat-label">${dueToday.length ? "Across " + activeBoards + " boards" : "Open day"}</div>
    </div>
    <div class="today-stat-card stat-upcoming">
      <div class="today-stat-head"><span class="today-stat-icon">${typeof icon === "function" ? icon("clock") : ""}</span>Next 7 Days</div>
      <div class="today-stat-num">${upcoming.length}</div>
      <div class="today-stat-label">Plan ahead without losing today</div>
    </div>
    <button class="today-stat-card stat-review" type="button" data-today-action="review" title="Go to Review Queue">
      <div class="today-stat-head"><span class="today-stat-icon">${typeof icon === "function" ? icon("sparkles") : ""}</span>Pending Review</div>
      <div class="today-stat-num">${pendingCount}</div>
      <div class="today-stat-label">From ${activeReviewSessions} meeting${activeReviewSessions === 1 ? "" : "s"}</div>
    </button>
  `;
  page.appendChild(statsRow);

  page.appendChild(buildTodayIntegrationStrip(integrations, pendingCount));

  const grid = document.createElement("div");
  grid.className = "today-grid";
  const left = document.createElement("div");
  left.className = "today-left";
  const right = document.createElement("div");
  right.className = "today-right";

  function buildSection(title, iconName, sectionClass, chipClass, chipLabel, taskList, emptyMsg) {
    const sec = document.createElement("div");
    sec.className = `today-section ${sectionClass}`;
    const header = document.createElement("div");
    header.className = "today-section-header";
    header.innerHTML = `
      <span class="today-section-title">${typeof icon === "function" ? icon(iconName) : ""}${title}</span>
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

  if (overdue.length) {
    left.appendChild(buildSection("Overdue", "alert", "section-overdue", "chip-overdue", "Overdue", overdue, "No overdue tasks."));
  }
  left.appendChild(buildSection("Due Today", "today", "section-today", "chip-today", "Today", dueToday, "Nothing due today yet."));

  const upcomingSec = document.createElement("div");
  upcomingSec.className = "today-section section-upcoming";
  upcomingSec.innerHTML = `
    <div class="today-section-header">
      <span class="today-section-title">${typeof icon === "function" ? icon("clock") : ""}Upcoming · next 7 days</span>
      <span class="today-section-count">${upcoming.length}</span>
    </div>
  `;
  if (!upcoming.length) {
    const empty = document.createElement("div");
    empty.className = "today-section-empty";
    empty.textContent = "No upcoming tasks in the next 7 days.";
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
  left.appendChild(upcomingSec);

  right.appendChild(buildQuickAddWidget());
  right.appendChild(buildCalendarWidget(calEvents));

  grid.appendChild(left);
  grid.appendChild(right);
  page.appendChild(grid);

  content.innerHTML = "";
  content.appendChild(page);
  wireTodayActions(page, cards);
}

function buildTodayPriorityLane({ hero, overdue, dueToday, pendingTasks, activeReviewSessions, sessions }) {
  const lane = document.createElement("div");
  lane.className = "today-priority-lane";

  const focusCard = document.createElement("div");
  focusCard.className = "today-priority-card";
  if (hero) {
    const isHeroOverdue = overdue.some(c => c.id === hero.id);
    const heroState = isHeroOverdue ? "overdue" : dueToday.some(c => c.id === hero.id) ? "today" : "upcoming";
    focusCard.innerHTML = `
      <div class="today-priority-eyebrow">${typeof icon === "function" ? icon(isHeroOverdue ? "alert" : "target") : ""}Top priority - ${isHeroOverdue ? "Most overdue" : "Next up"}</div>
      <div class="today-priority-time">${esc(relativeDue(hero.due))}</div>
      <div class="today-priority-title">${esc(hero.name)}</div>
      <div class="today-priority-meta">
        <span>Source: Trello</span>
        <span>Owner: ${esc(todayOwnerLabel(hero))}</span>
        <span>Context: ${esc(todayContextLabel(hero))}</span>
        <span>${esc(todayNextActionLabel(hero, heroState))}</span>
      </div>
      <div class="today-priority-actions">
        <button class="btn btn-primary btn-sm" type="button" data-today-card-open="${esc(hero.id)}">Open task</button>
        <button class="btn btn-ghost btn-sm" type="button" data-today-card-done="${esc(hero.id)}">${typeof icon === "function" ? icon("check") : ""}Mark done</button>
      </div>
    `;
  } else {
    focusCard.classList.add("is-empty");
    focusCard.innerHTML = `
      <div class="today-priority-eyebrow">${typeof icon === "function" ? icon("check") : ""}No priority due work</div>
      <div class="today-priority-title">Today is clear from Trello due work.</div>
      <div class="today-priority-meta"><span>Check Review Queue or use Quick add if new work came in.</span></div>
    `;
  }
  lane.appendChild(focusCard);

  const pendingCount = pendingTasks.length;
  const firstSession = (sessions || []).find(s => (s.tasks || []).some(t => t.status === "pending"));
  const firstTask = pendingTasks[0];
  const reviewCard = document.createElement("button");
  reviewCard.type = "button";
  reviewCard.className = `today-review-pressure${pendingCount ? "" : " is-clear"}`;
  reviewCard.dataset.todayAction = "review";
  reviewCard.innerHTML = `
    <div class="today-review-pressure-head">
      <span>${typeof icon === "function" ? icon("sparkles") : ""}Review Queue pressure</span>
      <strong>${pendingCount}</strong>
    </div>
    <div class="today-review-pressure-kicker">Needs human approval</div>
    <div class="today-review-pressure-title">${esc(firstTask?.title || firstSession?.title || "No pending review work")}</div>
    <div class="today-review-pressure-copy">
      ${pendingCount
        ? `${activeReviewSessions} active session${activeReviewSessions === 1 ? "" : "s"}. Pending items are not active Trello work until approved.`
        : "Human gate is clear. Paperclip/AI work still requires review before external side effects."}
    </div>
    <div class="today-review-pressure-link">Open Review Queue</div>
  `;
  lane.appendChild(reviewCard);

  return lane;
}

function buildTodayIntegrationStrip(integrations = {}, pendingCount = 0) {
  const strip = document.createElement("div");
  strip.className = "today-integration-strip";

  const calendarConnected = Boolean(integrations.calendar?.connected);
  const googleTasksConnected = Boolean(integrations.googleTasks?.connected);
  const googleTasksConfigured = Boolean(integrations.googleTasks?.configured);
  const paperclipConnection = integrations.paperclip?.connection || {};
  const paperclipConnected = Boolean(paperclipConnection.connected || paperclipConnection.status === "connected");

  const items = [
    {
      label: "Trello",
      state: integrations.trello?.label || "Verified",
      tone: "ok",
      detail: "Execution source",
    },
    {
      label: "Calendar",
      state: calendarConnected ? "Connected" : "Off",
      tone: calendarConnected ? "ok" : "muted",
      detail: "Schedule context",
    },
    {
      label: "Google Tasks",
      state: googleTasksConnected ? "Connected" : googleTasksConfigured ? "Needs reconnect" : "Not configured",
      tone: googleTasksConnected ? "ok" : googleTasksConfigured ? "warn" : "muted",
      detail: "Planner source",
    },
    {
      label: "Paperclip",
      state: paperclipConnected ? "Connected" : pendingCount ? "Review pending" : "No live status",
      tone: paperclipConnected || pendingCount ? "ai" : "muted",
      detail: "Controlled intake",
    },
  ];

  strip.innerHTML = items.map(item => `
    <div class="today-integration-item is-${item.tone}">
      <span class="today-integration-dot"></span>
      <span class="today-integration-copy">
        <strong>${esc(item.label)}</strong>
        <span>${esc(item.state)} - ${esc(item.detail)}</span>
      </span>
    </div>
  `).join("");

  return strip;
}

function buildQuickAddWidget() {
  const quickAdd = document.createElement("div");
  quickAdd.className = "today-widget";
  quickAdd.innerHTML = `
    <div class="today-widget-header">
      <span class="today-widget-title">${typeof icon === "function" ? icon("plus") : ""}Quick add</span>
    </div>
    <div class="today-widget-body">
      <div class="today-quick-add">
        <div class="today-qa-input-row">
          <input type="text" placeholder="+ Add a task for today..." id="today-quick-input"
            onkeydown="if(event.key==='Enter')showTodayQuickSelector()">
          <button class="btn btn-primary btn-sm" onclick="showTodayQuickSelector()">Add</button>
        </div>
        <div id="today-qa-selector" class="today-qa-selector hidden">
          <select id="today-qa-board" class="today-qa-select" onchange="loadTodayQALists()">
            <option value="">Board</option>
            ${S.boards.map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("")}
          </select>
          <select id="today-qa-list" class="today-qa-select" disabled>
            <option value="">List</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="confirmTodayQuickAdd(this)">${typeof icon === "function" ? icon("check") : ""}Add</button>
          <button class="btn btn-ghost btn-sm" onclick="hideTodayQuickSelector()">Cancel</button>
        </div>
      </div>
    </div>
  `;
  return quickAdd;
}

function buildCalendarWidget(calEvents) {
  const calWidget = document.createElement("div");
  calWidget.className = "today-widget section-calendar";
  const calCount = Array.isArray(calEvents) ? calEvents.length : 0;
  calWidget.innerHTML = `
    <div class="today-widget-header">
      <span class="today-widget-title">${typeof icon === "function" ? icon("calendar") : ""}Today's Schedule</span>
      <span class="today-section-count">${calEvents === null ? "Off" : calCount}</span>
    </div>
    <div class="today-widget-body"></div>
  `;
  const calBody = calWidget.querySelector(".today-widget-body");
  if (calEvents === null) {
    calBody.innerHTML = '<div class="today-section-empty">Google Calendar is not connected.</div>';
  } else if (!calEvents.length) {
    calBody.innerHTML = '<div class="today-section-empty">No calendar events today.</div>';
  } else {
    const list = document.createElement("div");
    list.className = "today-calendar-list";
    calEvents.forEach(evt => {
      const fmt = dt => new Date(dt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
      const timeStr = evt.start?.dateTime
        ? `${fmt(evt.start.dateTime)} - ${fmt(evt.end?.dateTime || evt.start.dateTime)}`
        : "All day";
      const row = document.createElement("button");
      row.type = "button";
      row.className = "today-calendar-row";
      row.innerHTML = `
        <span class="today-cal-time">${esc(timeStr)}</span>
        <span>
          <span class="today-cal-title">${esc(evt.summary || "(no title)")}</span>
          <span class="today-cal-source">Google Calendar</span>
        </span>
      `;
      row.onclick = () => navigateTo("calendar");
      list.appendChild(row);
    });
    calBody.appendChild(list);
  }
  return calWidget;
}

function wireTodayActions(page, cards) {
  page.querySelectorAll("[data-today-action='review']").forEach(el => {
    el.addEventListener("click", () => navigateTo("review"));
  });
  page.querySelector("[data-today-action='focus-quick-add']")?.addEventListener("click", () => {
    $("today-quick-input")?.focus();
  });
  page.querySelectorAll("[data-today-card-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = cards.find(c => c.id === btn.dataset.todayCardOpen);
      if (card) openEditAllTasks(card);
    });
  });
  page.querySelectorAll("[data-today-card-done]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const card = cards.find(c => c.id === btn.dataset.todayCardDone);
      if (!card) return;
      btn.disabled = true;
      try {
        await api.put(`/api/cards/${card.id}`, { dueComplete: true });
        S.allCardsCache = null;
        toast("Marked as done ✓");
        showTodayPage();
      } catch (err) {
        btn.disabled = false;
        toast("Error: " + err.message, true);
      }
    });
  });
}

// P5-3 helpers
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
  if (!boardId) {
    listSel.disabled = true;
    listSel.innerHTML = '<option value="">List</option>';
    return;
  }
  listSel.innerHTML = '<option value="">Loading...</option>';
  listSel.disabled = true;
  try {
    const lists = await api.get(`/api/boards/${boardId}/lists`);
    listSel.innerHTML = '<option value="">List</option>' +
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
  if (!title) return;
  if (!listId) {
    toast("Please choose a list first.", true);
    return;
  }

  btn.disabled = true;
  btn.textContent = "...";
  try {
    const due = new Date();
    due.setHours(23, 59, 0, 0);
    await api.post("/api/cards", { listId, name: title, due: due.toISOString() });
    input.value = "";
    hideTodayQuickSelector();
    S.allCardsCache = null;
    toast("Card added ✓");
    await showTodayPage();
  } catch (e) {
    toast("Error: " + e.message, true);
    btn.disabled = false;
    btn.textContent = "Add";
  }
}

function hideTodayQuickSelector() {
  $("today-qa-selector")?.classList.add("hidden");
}

function buildTodayRow(card, chipClass, chipLabel) {
  const row = document.createElement("div");
  row.className = "today-task-row";

  const dueText = card.due ? relativeDue(card.due) : "";
  const dueDateVal = card.due ? card.due.slice(0, 10) : "";
  const isOverdue = chipClass === "chip-overdue";
  const state = chipClass === "chip-overdue" ? "overdue" : chipClass === "chip-today" ? "today" : "upcoming";

  row.innerHTML = `
    <div class="today-task-main">
      <span class="chip ${chipClass}">${chipLabel}</span>
      <span class="today-task-copy">
        <span class="today-task-name">${esc(card.name)}</span>
        <span class="today-task-meta-line">
          <span class="today-task-board">${esc(card.boardName || "")}</span>
          ${card.listName ? `<span>${esc(card.listName)}</span>` : ""}
          ${isOverdue
            ? `<input type="date" class="today-date-picker" value="${dueDateVal}" title="Reschedule">`
            : `<span class="today-task-due">${esc(dueText)}</span>`}
        </span>
        <span class="today-decision-line">${buildTodayDecisionCue(card, state)}</span>
      </span>
    </div>
    <div class="today-task-actions">
      <button class="btn btn-success btn-xs" type="button" title="Mark done" data-action="done">${typeof icon === "function" ? icon("check") : "Done"}</button>
      <button class="btn btn-ghost btn-xs" type="button" title="Open card" data-action="open">${typeof icon === "function" ? icon("external") : "Open"}</button>
    </div>
  `;

  const datePicker = row.querySelector(".today-date-picker");
  if (datePicker) {
    datePicker.addEventListener("click", e => e.stopPropagation());
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

  row.addEventListener("click", e => {
    if (e.target.closest(".today-task-actions") || e.target.closest(".today-date-picker")) return;
    openEditAllTasks(card);
  });

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
