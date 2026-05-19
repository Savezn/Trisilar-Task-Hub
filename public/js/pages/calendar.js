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
  viewMode: "month",
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
    if (S.mode !== "calendar") return;

    if (!CAL.status?.connected) {
      await renderCalendar();
      return;
      $("board-content").innerHTML = `
        <div class="calendar-view calendar-disconnected">
          ${uiRouteBar({
            title: "Calendar",
            sub: "<span>Google Calendar disconnected</span><span>Trello deadlines and Review Queue commitments remain visible in source routes</span>",
            actions: `<button class="btn primary" type="button" onclick="openCalSetup()">${icon("calendar")} Connect Calendar</button>`,
          })}
          ${uiStatStrip([
            { label: "Google events", value: "Off", detail: "connect in Settings" },
            { label: "Trello deadlines", value: "Source", detail: "Today / Tasks / Planner", tone: "warn" },
            { label: "Review items", value: "Gate", detail: "human approval", tone: "ai" },
            { label: "Owner action", value: "Settings", detail: "safe setup copy" },
          ])}
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
          <div class="calendar-source-summary cal-legend panel" aria-label="Calendar source availability">
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
          <div class="cal-connect-state state-card panel">
            <div class="empty-icon">${icon("calendar")}</div>
            <h3>Connect Google Calendar</h3>
            <p>Calendar Owner action: connect Google Calendar in Settings. This route will show product-safe setup guidance only.</p>
            <button class="btn btn-primary" type="button" onclick="openCalSetup()">Connect Google Calendar</button>
          </div>
        </div>`;
      return;
    }
    await renderCalendar();
  } catch (e) {
    if (S.mode !== "calendar") return;
    console.error("[Calendar Error]", e);
    $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">!</div><h3>Calendar unavailable</h3><p>Calendar data could not be loaded. Calendar Owner should check the Settings connection and retry.</p></div>`;
  }
}

async function renderCalendar() {
  const content = $("board-content");
  if (S.mode !== "calendar") return;
  try {
      content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading events...</div>';

    if (CAL.selectedBoardIds === null) {
      const scopedBoards = typeof getVisibleBoardsForScope === "function"
        ? getVisibleBoardsForScope()
        : S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
      CAL.selectedBoardIds = scopedBoards
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
      if (S.mode !== "calendar") return;
      console.error("[Calendar Source Error]", e);
      content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">Calendar sources could not be loaded. Calendar Owner should check connection state and retry.</p></div>`;
      return;
    }
    if (S.mode !== "calendar") return;

    const monthPrefix = `${y}-${String(m + 1).padStart(2, "0")}`;
    const monthLabel = `${monthNames[m]} ${y}`;
    const trelloDueThisMonth = CAL.trelloCards.filter(c => c.due?.startsWith(monthPrefix));
    const reviewItems = buildReviewCalendarItems(CAL.reviewSessions, y, m);
    const calendarAction = CAL.status?.connected
      ? `<button class="btn primary cal-add-btn" type="button" id="cal-add" aria-label="Create Google Calendar event draft" title="Open an event draft. No Google Calendar write happens until you choose Save.">${icon("plus")} New event draft</button>`
      : `<button class="btn primary cal-connect-btn" type="button" onclick="openCalSetup()" data-uiv2="calendar-disconnected">${icon("calendar")} Connect Google Calendar</button>`;
    const viewMode = ["day", "week", "month"].includes(CAL.viewMode) ? CAL.viewMode : "month";
    const activeScopeLabel = typeof scopeLabel === "function" ? scopeLabel() : "All BUs";
    const routeSub = CAL.status?.connected
      ? `<span>Trello deadlines + Google Calendar + Review-derived events</span><span>&middot;</span><span>scope ${esc(activeScopeLabel)}</span><span>&middot;</span>${uiKV("gcal", "ops@trisilar")}`
      : `<span>Google Calendar is disconnected</span><span>&middot;</span><span>Trello deadlines and Review Queue items remain visible</span><span>&middot;</span><span>scope ${esc(activeScopeLabel)}</span><span>&middot;</span>${uiKV("gcal", "off")}`;
    if (typeof setTopbarRouteActions === "function") {
      setTopbarRouteActions(`
        <div class="seg cal-view-seg" aria-label="Calendar view mode">
          <button type="button" class="${viewMode === "day" ? "on" : ""}" aria-pressed="${viewMode === "day"}" title="Show day agenda" onclick="setCalendarViewMode('day')">Day</button>
          <button type="button" class="${viewMode === "week" ? "on" : ""}" aria-pressed="${viewMode === "week"}" title="Show week agenda" onclick="setCalendarViewMode('week')">Week</button>
          <button type="button" class="${viewMode === "month" ? "on" : ""}" aria-pressed="${viewMode === "month"}" title="Show month grid and agenda" onclick="setCalendarViewMode('month')">Month</button>
        </div>
        ${calendarAction}
      `);
    }

    content.innerHTML = "";
    const view = document.createElement("div");
    view.className = "calendar-view";

    const header = document.createElement("div");
    header.className = "calendar-command-panel";
    header.innerHTML = `
      ${uiRouteBar({
        title: monthLabel,
        sub: routeSub,
        actions: `
          <div class="row calendar-month-nav" style="gap:4px">
            <button class="iconbtn" type="button" id="cal-prev" title="Previous month">${icon("chevron", 'style="transform:rotate(180deg)"')}</button>
            <button class="btn sm" type="button" id="cal-go-today">Today</button>
            <button class="iconbtn" type="button" id="cal-next" title="Next month">${icon("chevron")}</button>
          </div>`,
      })}
    `;
    view.appendChild(header);

    const legend = document.createElement("div");
    legend.className = "calendar-source-legend cal-legend";
    legend.setAttribute("data-uiv2", "calendar-legend");
    legend.setAttribute("aria-label", "Calendar sources");
    legend.innerHTML = `
        <span><i class="source-dot is-google"></i>Google Calendar</span>
        <span><i class="source-dot is-trello"></i>Trello deadline</span>
        <span><i class="source-dot is-review"></i>AI-proposed (post-approval)</span>
        <span><i class="source-dot is-overdue"></i>Overdue</span>
    `;
    view.appendChild(legend);

    if (CAL.status?.connected) {
      const actionNote = document.createElement("div");
      actionNote.className = "calendar-action-note";
      actionNote.setAttribute("role", "note");
      actionNote.innerHTML = `${icon("lock")} Calendar edits open as drafts first; Google Calendar changes happen only after an explicit Save through the existing connector.`;
      view.appendChild(actionNote);
    }

    const agendaItems = buildCalendarAgendaItems(CAL.events, CAL.trelloCards, y, m, reviewItems);
    const scheduleLayout = document.createElement("div");
    scheduleLayout.className = "calendar-schedule-layout";
    if (viewMode === "month") {
      const gridWrap = document.createElement("div");
      gridWrap.className = "cal-grid-wrap panel";
      gridWrap.appendChild(buildCalGrid(y, m, CAL.events, CAL.trelloCards, reviewItems));
      scheduleLayout.appendChild(gridWrap);
      scheduleLayout.appendChild(buildCalendarAgenda(agendaItems.slice(0, 10)));
    } else {
      scheduleLayout.classList.add("is-focused");
      scheduleLayout.appendChild(buildCalendarFocusedAgenda(agendaItems, y, m, viewMode));
    }
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
    if (typeof ensureButtonTypes === "function") ensureButtonTypes(view);

    $("cal-prev").onclick = () => { if (CAL.currentMonth === 0) { CAL.currentMonth = 11; CAL.currentYear--; } else CAL.currentMonth--; renderCalendar(); };
    $("cal-next").onclick = () => { if (CAL.currentMonth === 11) { CAL.currentMonth = 0; CAL.currentYear++; } else CAL.currentMonth++; renderCalendar(); };
    $("cal-go-today").onclick = () => { CAL.currentYear = new Date().getFullYear(); CAL.currentMonth = new Date().getMonth(); renderCalendar(); };
    const addBtn = $("cal-add");
    if (addBtn) addBtn.onclick = () => openCalCreate();
  } catch (e) {
    if (S.mode !== "calendar") return;
    console.error("[Calendar Render Error]", e);
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">!</div><h3>Calendar unavailable</h3><p>Calendar could not render safely. Calendar Owner should check the source connection and retry.</p></div>`;
    toast("Calendar could not render safely. Check the source connection and retry.", true);
  }
}

function setCalendarViewMode(mode) {
  const nextMode = ["day", "week", "month"].includes(mode) ? mode : "month";
  const changed = CAL.viewMode !== nextMode;
  CAL.viewMode = nextMode;
  renderCalendar();
  if (changed) toast(`Calendar ${nextMode} view active`);
}

function buildCalendarSourceSummary({ googleEvents, trelloDue, reviewItems, reviewPending, visibleBoards, hiddenBoards }) {
  const summary = document.createElement("div");
  summary.className = "calendar-source-summary cal-legend panel";
  summary.setAttribute("aria-label", "Calendar source summary");
  const googleConnected = Boolean(CAL.status?.connected);
  summary.innerHTML = `
    <div class="calendar-source-card${googleConnected ? "" : " is-muted"}">
      <span><i class="source-dot is-google"></i>Google Calendar</span>
      <strong>${googleConnected ? `${googleEvents} event${googleEvents === 1 ? "" : "s"}` : "Needs connection"}</strong>
      <p>${googleConnected ? "Connected source for scheduled meetings and calendar blocks." : "Connect in Settings to show and manage Google events."}</p>
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
      actionKind: "gcal",
      actionId: ev.id,
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
      actionKind: "trello",
      actionId: card.id,
    });
  });

  reviewItems.forEach(item => items.push(item));

  return items.sort((a, b) => a.date.localeCompare(b.date));
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
            <strong class="calendar-agenda-title uiv2-decision-text uiv2-text-reveal" title="${esc(item.title)}">${esc(item.title)}</strong>
            <span class="calendar-agenda-meta uiv2-meta-text uiv2-text-reveal" title="${esc(item.meta)}">${esc(item.meta)}</span>
          </div>
          ${calendarAgendaActionButton(item)}
        </div>
      `).join("")}
    </div>
  `;
  wireCalendarAgendaActions(panel);
  return panel;
}

function calendarAgendaActionButton(item) {
  const kind = item.actionKind || (item.type?.startsWith("review") ? "review" : "");
  if (!kind) return `<em>${esc(item.actionLabel || "")}</em>`;
  const label = item.actionLabel || "Open";
  return `<button class="calendar-agenda-action" type="button" data-cal-action="${esc(kind)}" data-cal-id="${esc(item.actionId || "")}" aria-label="${esc(`${label}: ${item.title}`)}">${esc(label)}</button>`;
}

function wireCalendarAgendaActions(root) {
  root.querySelectorAll("[data-cal-action]").forEach(button => {
    button.onclick = () => handleCalendarAgendaAction(button.dataset.calAction, button.dataset.calId);
  });
  if (typeof ensureButtonTypes === "function") ensureButtonTypes(root);
}

function handleCalendarAgendaAction(kind, id) {
  if (kind === "gcal") {
    const ev = CAL.events.find(item => String(item.id) === String(id));
    if (ev) openCalEdit(ev);
    else toast("Calendar event is no longer available. Refresh Calendar and try again.", true);
    return;
  }
  if (kind === "trello") {
    const card = CAL.trelloCards.find(item => String(item.id) === String(id));
    if (card) openEditAllTasks(card);
    else toast("Trello card is no longer available. Refresh Calendar and try again.", true);
    return;
  }
  if (kind === "review") {
    showReviewPage();
  }
}

function calendarDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function calendarFocusDate(year, month) {
  const today = new Date();
  if (today.getFullYear() === year && today.getMonth() === month) {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  return new Date(year, month, 1);
}

function calendarWeekRange(date) {
  const start = new Date(date);
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function formatCalendarFocusLabel(start, end, mode) {
  if (mode === "day") {
    return start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function buildCalendarFocusedAgenda(items, year, month, mode) {
  const focus = calendarFocusDate(year, month);
  const range = mode === "day"
    ? { start: focus, end: focus }
    : calendarWeekRange(focus);
  const startKey = calendarDateKey(range.start);
  const endKey = calendarDateKey(range.end);
  const filtered = items.filter(item => item.date >= startKey && item.date <= endKey);
  const panel = document.createElement("section");
  panel.className = "calendar-agenda-panel calendar-focused-panel";
  panel.setAttribute("data-uiv2", `calendar-${mode}-view`);
  panel.innerHTML = `
    <div class="calendar-agenda-head">
      <span>${mode === "day" ? "Day view" : "Week view"}</span>
      <strong>${filtered.length}</strong>
    </div>
    <div class="calendar-focused-range">${esc(formatCalendarFocusLabel(range.start, range.end, mode))}</div>
    ${filtered.length ? `
      <div class="calendar-agenda-list">
        ${filtered.map(item => `
          <div class="calendar-agenda-item is-${esc(item.type)}">
            <div class="calendar-agenda-date">${esc(item.date.slice(5))}</div>
            <div class="calendar-agenda-copy">
              <span class="calendar-agenda-source">${esc(item.sourceLabel || item.type)}</span>
              <strong class="calendar-agenda-title uiv2-decision-text uiv2-text-reveal" title="${esc(item.title)}">${esc(item.title)}</strong>
              <span class="calendar-agenda-meta uiv2-meta-text uiv2-text-reveal" title="${esc(item.meta)}">${esc(item.meta)}</span>
            </div>
            ${calendarAgendaActionButton(item)}
          </div>
        `).join("")}
      </div>
    ` : `<div class="calendar-agenda-empty">No Google events, Trello deadlines, or Review Queue due items in this ${mode}.</div>`}
  `;
  wireCalendarAgendaActions(panel);
  return panel;
}

function setCalendarChipAction(chip, label, handler) {
  chip.title = label;
  chip.classList.add("uiv2-decision-text", "uiv2-text-reveal");
  chip.dataset.uiv2Reveal = "calendar-event";
  chip.setAttribute("role", "button");
  chip.setAttribute("tabindex", "0");
  chip.setAttribute("aria-label", label);
  chip.onclick = e => {
    e.stopPropagation();
    handler();
  };
  chip.onkeydown = e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    handler();
  };
}

function buildCalGrid(year, month, events, trelloCards = [], reviewItems = []) {
  const grid = document.createElement("div");
  grid.className = "cal-grid";

  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  DAYS.forEach((d, i) => {
    const h = document.createElement("div");
    h.className = "cal-dow" + (i >= 5 ? " weekend" : "");
    h.textContent = d;
    grid.appendChild(h);
  });

  const today = new Date();
  const firstDay    = (new Date(year, month, 1).getDay() + 6) % 7;
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
    cell.className = "cal-cell cal-day";

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
    if (dow >= 5) cell.classList.add("weekend");
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
        chip.className = "cal-event-chip cal-evt gcal" + (ev.start?.date ? " all-day" : "");
        const timeStr = ev.start?.dateTime
          ? new Date(ev.start.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " "
          : "";
        chip.textContent = timeStr + (ev.summary || "(No title)");
        setCalendarChipAction(chip, `Google Calendar event: ${timeStr}${ev.summary || "(No title)"}`, () => openCalEdit(ev));

      } else if (item.type === "trello-due") {
        const card = item.data;
        const color = boardColorMap[card.boardId] || "#6366f1";
        chip.className = "cal-event-chip cal-evt trello-due";
        chip.style.setProperty("--trello-color", color);
        const overdue = !card.dueComplete && new Date(card.due) < today;
        if (overdue) chip.classList.add("trello-overdue");
        if (card.dueComplete) chip.classList.add("trello-done");
        chip.textContent = card.name;
        setCalendarChipAction(chip, `Trello deadline: [${card.boardName || card.boardId}] ${card.name}`, () => openEditAllTasks(card));

      } else if (item.type === "trello-start") {
        const card = item.data;
        const color = boardColorMap[card.boardId] || "#6366f1";
        chip.className = "cal-event-chip cal-evt trello-start";
        chip.style.setProperty("--trello-color", color);
        chip.textContent = card.name;
        setCalendarChipAction(chip, `Trello start: [${card.boardName || card.boardId}] ${card.name}`, () => openEditAllTasks(card));
      } else if (item.type === "review-pending" || item.type === "review-approved") {
        const reviewItem = item.data;
        chip.className = "cal-event-chip cal-evt " + item.type;
        chip.textContent = reviewItem.title;
        setCalendarChipAction(chip, `${reviewItem.sourceLabel || "Review Queue"}: ${reviewItem.title}`, () => showReviewPage());
      }

      cell.appendChild(chip);
    });

    if (dayItems.length > maxShow) {
      const more = document.createElement("span");
      more.className = "cal-event-more";
      more.textContent = `+${dayItems.length - maxShow} more`;
      more.title = "Open event draft for this date. No Google Calendar write happens until Save.";
      more.onclick = e => { e.stopPropagation(); openCalCreate(dateStr); };
      cell.appendChild(more);
    }

    cell.onclick = CAL.status?.connected ? () => openCalCreate(dateStr) : null;
    cell.title = CAL.status?.connected
      ? "Open event draft for this date. Save is required before any Google Calendar change."
      : "Google Calendar is disconnected. Trello and Review Queue items remain visible.";
    grid.appendChild(cell);
  }

  return grid;
}

// ── Calendar Setup (OAuth) ────────────────────────────────────────────────────
function openCalSetup()  {
  const redirectEl = $("setup-redirect-uri");
  if (redirectEl) redirectEl.textContent = CAL.status?.redirectUri || `${window.location.origin}/auth/callback`;
  if (typeof openSurface === "function") openSurface($("cal-setup-modal"), "#setup-client-id");
  else $("cal-setup-modal").classList.remove("hidden");
}
function closeCalSetup() {
  if (typeof closeSurface === "function") closeSurface($("cal-setup-modal"), ".cal-connect-btn, .cal-add-btn");
  else $("cal-setup-modal").classList.add("hidden");
}

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
    toast("Google Calendar connection was not completed. Check Settings connection values and retry.", true);
  }
}

// ── Calendar Event Modal ──────────────────────────────────────────────────────
function openCalCreate(dateStr) {
  CAL.editingEventId = null;
  $("cal-modal-title").textContent = "New Event Draft";
  setCalendarModalBoundary("Draft first. No Google Calendar change happens until you choose Save to Calendar.");
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
  if (typeof openSurface === "function") openSurface($("cal-event-modal"));
  else $("cal-event-modal").classList.remove("hidden");
  toast("Calendar draft opened. No Google Calendar change happens until Save.");
  setTimeout(() => $("cal-title").focus(), 50);
}

function openCalEdit(ev) {
  CAL.editingEventId = ev.id;
  $("cal-modal-title").textContent = "Edit Calendar Event";
  setCalendarModalBoundary("Connected source. Save to Calendar updates this event through the existing Google Calendar connector.");
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
  if (typeof openSurface === "function") openSurface($("cal-event-modal"));
  else $("cal-event-modal").classList.remove("hidden");
  setTimeout(() => $("cal-title").focus(), 50);
}

function setCalendarModalBoundary(message) {
  const note = $("cal-boundary-note");
  if (note) note.textContent = message;
}

function closeCalModal() {
  if (typeof closeSurface === "function") closeSurface($("cal-event-modal"), ".cal-add-btn");
  else $("cal-event-modal").classList.add("hidden");
}

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
  finally { btn.textContent = "Save to Calendar"; btn.disabled = false; }
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
