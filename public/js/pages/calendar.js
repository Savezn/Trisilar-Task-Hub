// Calendar page module
// Implemented by: Codex Dev (2026-05-07)
// V0.2-W2-05 Calendar redesign implemented by Codex Dev.

const CAL = {
  status: null,
  events: [],
  trelloCards: [],
  reviewSessions: [],
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  editingEventId: null,
  selectedBoardIds: null,
};

// ── Show calendar view ────────────────────────────────────────────────────────
async function showCalendar() {
  try {
    S.mode = "calendar";
    S.currentBoardId = null; S.currentGroupId = null;
    $("board-title").textContent = "Calendar";
    $("board-subtitle").textContent = "Trisilar";
    $("add-list-btn").classList.add("hidden");

    CAL.status = await api.get("/api/calendar/status").catch(() => null);

    if (!CAL.status?.connected) {
      $("board-content").innerHTML = `
        <div class="calendar-view calendar-disconnected">
          <div class="calendar-command-panel">
            <div class="calendar-command-copy">
              <div class="calendar-kicker">${icon("calendar")} Calendar view</div>
              <h1 class="calendar-title">Calendar</h1>
              <p class="calendar-subtitle">Google Calendar is disconnected. Trello deadlines and Review Queue commitments remain available in their source routes.</p>
            </div>
            <div class="calendar-command-stats" aria-label="Calendar connection state">
              <div class="calendar-stat-card is-muted"><span>Calendar</span><strong>Disconnected</strong></div>
              <div class="calendar-stat-card"><span>Owner action</span><strong>Settings</strong></div>
            </div>
          </div>
          <div class="calendar-source-summary" aria-label="Calendar source availability">
            <div class="calendar-source-card is-muted">
              <span><i class="source-dot is-google"></i>Google Calendar</span>
              <strong>Needs connection</strong>
              <p>Connect in Settings to show and manage Google events.</p>
            </div>
            <div class="calendar-source-card">
              <span><i class="source-dot is-trello"></i>Trello deadlines</span>
              <strong>Source preserved</strong>
              <p>Deadline context stays in Today, All Tasks, and Planner.</p>
            </div>
            <div class="calendar-source-card">
              <span><i class="source-dot is-review"></i>Review Queue</span>
              <strong>Human gate intact</strong>
              <p>Review-derived work remains pending or approved in Review Queue.</p>
            </div>
          </div>
          <div class="cal-connect-state">
            <div class="empty-icon">${icon("calendar")}</div>
            <h3>Connect Google Calendar</h3>
            <p>Calendar Owner action: connect Google Calendar in Settings. This route will show product-safe setup guidance only.</p>
            <button class="btn btn-primary" onclick="openCalSetup()">Connect Google Calendar</button>
          </div>
        </div>`;
      return;
    }
    await renderCalendar();
  } catch (e) {
    console.error("[Calendar Error]", e);
    $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">!</div><h3>Calendar unavailable</h3><p>Calendar data could not be loaded. Calendar Owner should check the Settings connection and retry.</p></div>`;
  }
}

async function renderCalendar() {
  const content = $("board-content");
  try {
      content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading events...</div>';

    if (CAL.selectedBoardIds === null) {
      CAL.selectedBoardIds = S.boards
        .filter(b => !S.config.hiddenBoards.includes(b.id))
        .map(b => b.id);
    }

    const { currentYear: y, currentMonth: m } = CAL;
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const start = new Date(y, m, 1).toISOString();
    const end   = new Date(y, m + 1, 0, 23, 59, 59).toISOString();

    try {
      const [gcalEvents, trelloData, reviewSessions] = await Promise.all([
        CAL.status?.connected
          ? api.get(`/api/calendar/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`).catch(() => [])
          : Promise.resolve([]),
        isTrelloVerified() && CAL.selectedBoardIds.length
          ? api.post("/api/boards/cards", { boardIds: CAL.selectedBoardIds })
          : Promise.resolve([]),
        api.get("/api/reviews").catch(() => []),
      ]);
      CAL.events      = gcalEvents;
      CAL.trelloCards = trelloData;
      CAL.reviewSessions = reviewSessions;
    } catch (e) {
      console.error("[Calendar Source Error]", e);
      content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">Calendar sources could not be loaded. Calendar Owner should check connection state and retry.</p></div>`;
      return;
    }

    const monthPrefix = `${y}-${String(m + 1).padStart(2, "0")}`;
    const monthLabel = `${monthNames[m]} ${y}`;
    const now = new Date();
    const trelloDueThisMonth = CAL.trelloCards.filter(c => c.due?.startsWith(monthPrefix));
    const trelloOverdue = trelloDueThisMonth.filter(c => !c.dueComplete && new Date(c.due) < now);
    const reviewItems = buildReviewCalendarItems(CAL.reviewSessions, y, m);
    const reviewPendingThisMonth = reviewItems.filter(item => item.type === "review-pending");
    const hiddenBoardCount = Array.isArray(S.config.hiddenBoards) ? S.config.hiddenBoards.length : 0;
    const agendaItems = buildCalendarAgendaItems(CAL.events, CAL.trelloCards, y, m, reviewItems);

    content.innerHTML = "";
    const view = document.createElement("div");
    view.className = "calendar-view";

    const header = document.createElement("div");
    header.className = "calendar-command-panel";
    header.innerHTML = `
      <div class="calendar-command-copy">
        <div class="calendar-kicker">${icon("calendar")} Calendar view</div>
        <h1 class="calendar-title">${monthLabel}</h1>
        <p class="calendar-subtitle">Google events, Trello deadlines, and Review Queue due items are shown together while keeping their source and action paths separate.</p>
      </div>
      <div class="calendar-command-stats" aria-label="Calendar summary">
        <div class="calendar-stat-card"><span>Google events</span><strong>${CAL.events.length}</strong></div>
        <div class="calendar-stat-card is-warning"><span>Trello deadlines</span><strong>${trelloDueThisMonth.length}</strong></div>
        <div class="calendar-stat-card is-muted"><span>Review items</span><strong>${reviewItems.length}</strong></div>
        <div class="calendar-stat-card is-danger"><span>Overdue</span><strong>${trelloOverdue.length}</strong></div>
      </div>
    `;
    view.appendChild(header);

    view.appendChild(buildCalendarSourceSummary({
      googleEvents: CAL.events.length,
      trelloDue: trelloDueThisMonth.length,
      reviewItems: reviewItems.length,
      reviewPending: reviewPendingThisMonth.length,
      visibleBoards: CAL.selectedBoardIds.length,
      hiddenBoards: hiddenBoardCount,
    }));

    const topbar = document.createElement("div");
    topbar.className = "cal-topbar calendar-toolbar";
    topbar.innerHTML = `
      <div class="cal-nav-group">
        <button class="cal-nav-btn" id="cal-prev" title="Previous month">&lt;</button>
        <span class="cal-month-label">${monthLabel}</span>
        <button class="cal-nav-btn" id="cal-next" title="Next month">&gt;</button>
        <button class="cal-today-btn" id="cal-go-today">Today</button>
      </div>
      <div class="calendar-source-legend" aria-label="Calendar sources">
        <span><i class="source-dot is-google"></i>Google Calendar</span>
        <span><i class="source-dot is-trello"></i>Trello deadline</span>
        <span><i class="source-dot is-review"></i>Review Queue</span>
        <span><i class="source-dot is-overdue"></i>Overdue</span>
      </div>
      <button class="btn btn-primary cal-add-btn" id="cal-add">${icon("plus")} New event</button>
    `;
    view.appendChild(topbar);

    const visibleBoards = S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
    const selectorRow = document.createElement("div");
    selectorRow.className = "cal-board-selector calendar-source-strip";
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

    const scheduleLayout = document.createElement("div");
    scheduleLayout.className = "calendar-schedule-layout";

    const gridWrap = document.createElement("div");
    gridWrap.className = "cal-grid-wrap";
    gridWrap.appendChild(buildCalGrid(y, m, CAL.events, CAL.trelloCards, reviewItems));
    scheduleLayout.appendChild(gridWrap);
    scheduleLayout.appendChild(buildCalendarAgenda(agendaItems));
    view.appendChild(scheduleLayout);

    // P6-2: empty state banner when no events for this month
    const hasTrelloThisMonth = CAL.trelloCards.some(c => c.due?.startsWith(monthPrefix));
    if (!CAL.events.length && !hasTrelloThisMonth && !reviewItems.length) {
      const calEmpty = document.createElement("div");
      calEmpty.className = "cal-empty-notice";
      calEmpty.innerHTML = CAL.status?.connected
        ? "No Google events, Trello deadlines, or Review Queue due items this month."
        : `No Trello deadlines this month · <a href="#" onclick="openCalSetup();return false" style="color:var(--primary)">Connect Google Calendar</a> to see more`;
      view.appendChild(calEmpty);
    }

    content.appendChild(view);

    $("cal-prev").onclick = () => { if (CAL.currentMonth === 0) { CAL.currentMonth = 11; CAL.currentYear--; } else CAL.currentMonth--; renderCalendar(); };
    $("cal-next").onclick = () => { if (CAL.currentMonth === 11) { CAL.currentMonth = 0; CAL.currentYear++; } else CAL.currentMonth++; renderCalendar(); };
    $("cal-go-today").onclick = () => { CAL.currentYear = new Date().getFullYear(); CAL.currentMonth = new Date().getMonth(); renderCalendar(); };
    $("cal-add").onclick = () => openCalCreate();
  } catch (e) {
    console.error("[Calendar Render Error]", e);
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">!</div><h3>Calendar unavailable</h3><p>Calendar could not render safely. Calendar Owner should check the source connection and retry.</p></div>`;
    toast("Calendar could not render safely. Check the source connection and retry.", true);
  }
}

function buildCalendarSourceSummary({ googleEvents, trelloDue, reviewItems, reviewPending, visibleBoards, hiddenBoards }) {
  const summary = document.createElement("div");
  summary.className = "calendar-source-summary";
  summary.setAttribute("aria-label", "Calendar source summary");
  summary.innerHTML = `
    <div class="calendar-source-card">
      <span><i class="source-dot is-google"></i>Google Calendar</span>
      <strong>${googleEvents} event${googleEvents === 1 ? "" : "s"}</strong>
      <p>Connected source for scheduled meetings and calendar blocks.</p>
    </div>
    <div class="calendar-source-card is-warning">
      <span><i class="source-dot is-trello"></i>Trello deadlines</span>
      <strong>${trelloDue} due this month</strong>
      <p>${visibleBoards} board${visibleBoards === 1 ? "" : "s"} shown${hiddenBoards ? `, ${hiddenBoards} hidden by workspace settings` : ""}.</p>
    </div>
    <div class="calendar-source-card is-review">
      <span><i class="source-dot is-review"></i>Review Queue</span>
      <strong>${reviewItems} due item${reviewItems === 1 ? "" : "s"}</strong>
      <p>${reviewPending} pending review item${reviewPending === 1 ? "" : "s"} still require human approval.</p>
    </div>
  `;
  return summary;
}

function readCalendarDate(value) {
  if (!value) return "";
  const text = String(value);
  const match = text.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function getTaskReviewDeadline(task) {
  return readCalendarDate(task.deadline || task.due || task.dueDate || task.dueAt || task.target?.due || task.proposed?.due);
}

function buildReviewCalendarItems(reviewSessions, year, month) {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const items = [];
  (reviewSessions || []).forEach(session => {
    (session.tasks || []).forEach(task => {
      const dateStr = getTaskReviewDeadline(task);
      if (!dateStr || !dateStr.startsWith(monthPrefix)) return;
      if (task.status && !["pending", "approved"].includes(task.status)) return;
      const status = task.status === "approved" ? "approved" : "pending";
      items.push({
        date: dateStr,
        type: status === "approved" ? "review-approved" : "review-pending",
        title: task.title || session.title || "Review Queue item",
        meta: `${session.title || "Review Queue"} / ${status}`,
        actionLabel: status === "approved" ? "Approved item" : "Needs review",
        sourceLabel: status === "approved" ? "Review Queue approved" : "Review Queue pending",
      });
    });
  });
  return items;
}

function buildCalendarAgendaItems(events, trelloCards, year, month, reviewItems = []) {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const items = [];

  events.forEach(ev => {
    const dateStr = ev.start?.date || ev.start?.dateTime?.slice(0, 10);
    if (!dateStr || !dateStr.startsWith(monthPrefix)) return;
    items.push({
      date: dateStr,
      type: "google",
      title: ev.summary || "(No title)",
      meta: ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "All day",
      actionLabel: "Edit event",
      sourceLabel: "Google Calendar",
    });
  });

  trelloCards.forEach(card => {
    if (!card.due?.startsWith(monthPrefix)) return;
    const overdue = !card.dueComplete && new Date(card.due) < new Date();
    items.push({
      date: card.due.slice(0, 10),
      type: overdue ? "overdue" : "trello",
      title: card.name,
      meta: `${card.boardName || card.boardId || "Board"} / ${card.listName || "List"}`,
      actionLabel: "Open card",
      sourceLabel: overdue ? "Trello overdue" : "Trello deadline",
    });
  });

  reviewItems.forEach(item => items.push(item));

  return items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10);
}

function buildCalendarAgenda(items) {
  const panel = document.createElement("aside");
  panel.className = "calendar-agenda-panel";
  if (!items.length) {
    panel.innerHTML = `
      <div class="calendar-agenda-head">
        <span>Agenda</span>
        <strong>0</strong>
      </div>
      <div class="calendar-agenda-empty">No Google events, Trello deadlines, or Review Queue due items in this month.</div>
    `;
    return panel;
  }

  panel.innerHTML = `
    <div class="calendar-agenda-head">
      <span>Agenda</span>
      <strong>${items.length}</strong>
    </div>
    <div class="calendar-agenda-list">
      ${items.map(item => `
        <div class="calendar-agenda-item is-${esc(item.type)}">
          <div class="calendar-agenda-date">${esc(item.date.slice(5))}</div>
          <div class="calendar-agenda-copy">
            <span class="calendar-agenda-source">${esc(item.sourceLabel || item.type)}</span>
            <strong>${esc(item.title)}</strong>
            <span>${esc(item.meta)}</span>
          </div>
          <em>${esc(item.actionLabel)}</em>
        </div>
      `).join("")}
    </div>
  `;
  return panel;
}

function buildCalGrid(year, month, events, trelloCards = [], reviewItems = []) {
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

  reviewItems.forEach(item => {
    if (!eventMap[item.date]) eventMap[item.date] = [];
    eventMap[item.date].push({ type: item.type, data: item });
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
        chip.className = "cal-event-chip gcal" + (ev.start?.date ? " all-day" : "");
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
        chip.textContent = "Due " + card.name;
        chip.title = `[${card.boardName || card.boardId}] ${card.name}`;
        chip.onclick = e => { e.stopPropagation(); openEditAllTasks(card); };

      } else if (item.type === "trello-start") {
        const card = item.data;
        const color = boardColorMap[card.boardId] || "#6366f1";
        chip.className = "cal-event-chip trello-start";
        chip.style.setProperty("--trello-color", color);
        chip.textContent = "Start " + card.name;
        chip.title = `Start: [${card.boardName || card.boardId}] ${card.name}`;
        chip.onclick = e => { e.stopPropagation(); openEditAllTasks(card); };
      } else if (item.type === "review-pending" || item.type === "review-approved") {
        const reviewItem = item.data;
        chip.className = "cal-event-chip " + item.type;
        chip.textContent = (item.type === "review-approved" ? "Approved " : "Review ") + reviewItem.title;
        chip.title = reviewItem.sourceLabel || "Review Queue";
        chip.onclick = e => { e.stopPropagation(); showReviewPage(); };
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

    cell.onclick = CAL.status?.connected ? () => openCalCreate(dateStr) : null;
    grid.appendChild(cell);
  }

  return grid;
}

// ── Calendar Setup (OAuth) ────────────────────────────────────────────────────
function openCalSetup()  {
  const redirectEl = $("setup-redirect-uri");
  if (redirectEl) redirectEl.textContent = CAL.status?.redirectUri || `${window.location.origin}/auth/callback`;
  $("cal-setup-modal").classList.remove("hidden");
}
function closeCalSetup() { $("cal-setup-modal").classList.add("hidden"); }

async function startGoogleAuth() {
  const clientId     = $("setup-client-id").value.trim();
  const clientSecret = $("setup-client-secret").value.trim();
  if (!clientId || !clientSecret) { toast("Enter the Google Calendar client ID and client secret.", true); return; }
  try {
    // POST credentials in body — never in URL — to avoid browser history / server log exposure
    const data = await api.post("/auth/google", { clientId, clientSecret });
    const popup = window.open(data.url, "_blank", "width=500,height=650");
    if (!popup) { toast("Allow popups to continue Google Calendar connection.", true); return; }
    closeCalSetup();
  } catch (e) {
    console.error("[Calendar Connect Error]", e);
    toast("Google Calendar connection was not completed. Check Settings credentials and retry.", true);
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

  if (!payload.start) { toast("Enter a start date before saving the event.", true); return; }

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
  } catch (e) {
    console.error("[Calendar Save Error]", e);
    toast("Calendar event could not be saved. Check the Calendar connection and retry.", true);
  }
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
  } catch (e) {
    console.error("[Calendar Delete Error]", e);
    toast("Calendar event could not be deleted. Check the Calendar connection and retry.", true);
  }
}
