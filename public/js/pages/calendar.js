// Calendar page module
// Implemented by: Codex Dev (2026-05-07)

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
  try {
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
    await renderCalendar();
  } catch (e) {
    console.error("[Calendar Error]", e);
    $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><h3>Calendar error</h3><p>${esc(e.message)}</p></div>`;
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
    const start = new Date(y, m, 1).toISOString();
    const end   = new Date(y, m + 1, 0, 23, 59, 59).toISOString();

    try {
      const [gcalEvents, trelloData] = await Promise.all([
        CAL.status?.connected
          ? api.get(`/api/calendar/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`).catch(() => [])
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
  } catch (e) {
    console.error("[Calendar Render Error]", e);
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">!</div><h3>Calendar render error</h3><p>${esc(e.message)}</p></div>`;
    toast("Calendar render error: " + e.message, true);
  }
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
