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

function nextUpDuePhrase(isoString) {
  const label = relativeDue(isoString);
  const sameDay = label.match(/^(Today|Tomorrow|Yesterday)\s+(.+)$/);
  if (sameDay) return `${sameDay[2]} ${sameDay[1].toLowerCase()}`;
  return label;
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

  renderTodayV2({
    content,
    cards,
    dateStr,
    now,
    todayStr,
    overdue,
    dueToday,
    upcoming,
    totalAttention,
    activeBoards,
    hero,
    pendingTasks,
    pendingCount,
    activeReviewSessions,
    calEvents,
  });
  return;

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
  if (typeof ensureButtonTypes === "function") ensureButtonTypes(page);
  wireTodayActions(page, cards);
}

function renderTodayV2({
  content,
  cards,
  dateStr,
  now,
  todayStr,
  overdue,
  dueToday,
  upcoming,
  totalAttention,
  activeBoards,
  hero,
  pendingTasks,
  pendingCount,
  activeReviewSessions,
  calEvents,
}) {
  const todayWorkFilter = ["all", "mine", "risky"].includes(S.todayWorkFilter) ? S.todayWorkFilter : "all";
  const allTodayWork = [...overdue, ...dueToday, ...upcoming];
  const calendarCount = Array.isArray(calEvents) ? calEvents.length : 0;
  const missingOwnerCards = cards.filter(c => !Array.isArray(c.members) || c.members.length === 0).slice(0, 2);
  const blockedCards = cards.filter(c => (c.labels || []).some(l => /block|waiting/i.test(l.name || ""))).slice(0, 2);
  const staleCards = cards.filter(c => c.dateLastActivity && (now - new Date(c.dateLastActivity)) > 7 * 86400000).slice(0, 2);
  const quickAddBoards = typeof getVisibleBoardsForScope === "function" ? getVisibleBoardsForScope() : S.boards;

  function isRiskyWork(card) {
    return dueStateForToday(card) === "over"
      || !Array.isArray(card.members)
      || card.members.length === 0
      || (card.labels || []).some(l => /block|waiting|risk/i.test(l.name || ""))
      || (card.dateLastActivity && (now - new Date(card.dateLastActivity)) > 7 * 86400000);
  }

  function matchesTodayWorkFilter(card) {
    if (todayWorkFilter === "mine") return Array.isArray(card.members) && card.members.length > 0;
    if (todayWorkFilter === "risky") return isRiskyWork(card);
    return true;
  }

  const filteredTodayWork = allTodayWork.filter(matchesTodayWorkFilter);
  const todayWork = filteredTodayWork.slice(0, 8);

  function dueStateForToday(card) {
    if (card.dueComplete) return "done";
    if (!card.due) return "none";
    const due = new Date(card.due);
    if (due < now) return "over";
    if (due.toDateString() === todayStr) return "warn";
    return "upcoming";
  }

  function checklistProgress(card) {
    const checklists = Array.isArray(card.checklists) ? card.checklists : [];
    const total = checklists.reduce((sum, list) => sum + ((list.checkItems || []).length), 0);
    if (!total) return "";
    const done = checklists.reduce((sum, list) => sum + (list.checkItems || []).filter(item => item.state === "complete").length, 0);
    return `${done}/${total}`;
  }

  function workRow(card) {
    const dueState = dueStateForToday(card);
    const status = dueState === "over" ? "Overdue" : dueState === "warn" ? "Today" : dueState === "done" ? "Done" : "Upcoming";
    const checklist = checklistProgress(card);
    const taskTitle = card.name || "Untitled task";
    const boardName = card.boardName || "No board";
    const listName = card.listName || "No list";
    const rowTitle = `${taskTitle} - ${boardName} / ${listName}`;
    const labelHtml = (card.labels || []).filter(l => l.name).slice(0, 2)
      .map(l => uiChip(labelTone(l.color), l.name, { sm: true }))
      .join("");
    return `
      <div class="trow today-work-row" data-card-id="${esc(card.id)}" data-today-row-open="${esc(card.id)}" title="${esc(rowTitle)}">
        <span class="tck">${card.dueComplete ? icon("check") : ""}</span>
        <div class="tmain">
          <div class="ttitle uiv2-decision-text uiv2-text-reveal" title="${esc(taskTitle)}">${esc(taskTitle)}</div>
          <div class="tmeta">
            ${uiBoardTag(boardName, boardColorForName(card.boardName || ""))}
            <span class="sep">&middot;</span>
            <span class="today-list-name uiv2-meta-text uiv2-text-reveal" title="${esc(listName)}">${esc(listName)}</span>
            ${checklist ? `<span class="sep">&middot;</span><span class="mono">${esc(checklist)}</span>` : ""}
          </div>
        </div>
        <div class="tlabels">${labelHtml}</div>
        <div class="tmem" data-uiv2="task-owner">${uiAvatarStack(card.members || [])}</div>
        <div class="tdue">${uiDue(card.due ? relativeDue(card.due) : "No due", dueState)}</div>
        <div class="today-row-actions">
          <button class="btn ghost sm today-row-open" type="button" data-today-card-open="${esc(card.id)}" aria-label="Open ${esc(taskTitle)} edit card" title="Open edit card for ${esc(taskTitle)}">${icon("external")}Open</button>
        </div>
        <div class="tstatus">${uiChip(dueToneFromState(dueState), status, { sm: true })}</div>
      </div>`;
  }

  function calendarPeekHtml() {
    if (calEvents === null) {
      return uiStateCard({
        kind: "disconnected",
        iconName: "calendar",
        title: "Google Calendar is not connected",
        desc: "Today still shows Trello deadlines and Review Queue handoff. Connect Calendar from Settings when schedule context is ready.",
      });
    }
    if (!calEvents.length) {
      return uiStateCard({
        kind: "empty",
        iconName: "calendar",
        title: "No calendar events today",
        desc: "Trello due work and Review Queue items remain visible in the Today command center.",
      });
    }
    return `
      <div class="stack">
        ${calEvents.slice(0, 4).map(evt => {
          const fmt = dt => new Date(dt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
          const time = evt.start?.dateTime ? `${fmt(evt.start.dateTime)} - ${fmt(evt.end?.dateTime || evt.start.dateTime)}` : "All day";
          return `
            <button type="button" class="cal-peek-row" onclick="navigateTo('calendar')">
              <span class="mono">${esc(time)}</span>
              <span><strong>${esc(evt.summary || "(no title)")}</strong><small>Google Calendar</small></span>
            </button>`;
        }).join("")}
      </div>`;
  }

  function reviewHandoffHtml() {
    const firstTask = pendingTasks[0];
    const highRisk = pendingTasks.filter(t => {
      const conf = Number(t.confidence || 0);
      return !t.owner || conf < 0.72 || String(t.diffStatus || "").includes("duplicate");
    }).length;
    const diffKinds = [...new Set(pendingTasks.map(t => t.diffStatus || "create_new"))].slice(0, 4);
    return `
      <div class="stack" data-uiv2="review-handoff">
        <div class="row" style="justify-content:space-between">
          ${uiKV("source", firstTask?.externalSource?.system || "paperclip", "ai")}
          ${uiKV("env", firstTask?.externalSource?.environment || "review", "env-stage")}
          ${uiKV("pending", String(pendingCount))}
        </div>
        <div class="row" style="flex-wrap:wrap">
          ${diffKinds.length ? diffKinds.map(kind => uiDiffBadge(kind)).join("") : uiChip("ok", "Queue clear")}
        </div>
        <div class="today-review-brief">
          <strong>${esc(firstTask?.title || "No pending review work")}</strong>
          <span>${pendingCount ? `${activeReviewSessions} active session${activeReviewSessions === 1 ? "" : "s"} / ${highRisk} needs extra context.` : "Human gate is clear."}</span>
        </div>
      </div>`;
  }

  function signalsHtml() {
    const signals = [
      ...missingOwnerCards.map(c => ({ tone: "warn", label: "Missing owner", title: c.name, meta: c.boardName })),
      ...blockedCards.map(c => ({ tone: "over", label: "Blocked", title: c.name, meta: c.boardName })),
      ...staleCards.map(c => ({ tone: "info", label: "Stale", title: c.name, meta: c.boardName })),
    ].slice(0, 4);
    if (!signals.length) {
      return uiStateCard({
        kind: "empty",
        iconName: "check",
        title: "No cross-board warnings",
        desc: "Visible Trello work has enough metadata for today's operating view.",
      });
    }
    return `<div class="signal-list">${signals.map(signal => `
      <div class="signal-row">
        ${uiChip(signal.tone, signal.label, { sm: true })}
        <span><strong>${esc(signal.title)}</strong><small>${esc(signal.meta || "No board")}</small></span>
      </div>
    `).join("")}</div>`;
  }

  function mobileTodayHtml() {
    const heroState = hero ? dueStateForToday(hero) : "none";
    const firstTask = pendingTasks[0];
    const reviewTitle = pendingCount ? `${pendingCount} proposals await approval` : "Review Queue is clear";
    const reviewMeta = pendingCount
      ? `${firstTask?.externalSource?.system || "paperclip"} · ${firstTask?.externalSource?.environment || "review"} · ${activeReviewSessions} active`
      : "paperclip · human gate";
    const mobileWork = todayWork.slice(0, 5);
    const heroTitle = hero?.name || "Today is clear from Trello due work.";
    const heroMeta = hero ? `${todayContextLabel(hero)} - ${todayOwnerLabel(hero)}` : "Review Queue and Calendar remain available - No owner required";
    return `
      <div class="today-mobile-source" data-uiv2="mobile-today-prototype">
        <div class="m-card today-mobile-next">
        <div class="m-eyebrow">${hero ? `${heroState === "over" ? "Top priority" : "Next up"} · ${esc(nextUpDuePhrase(hero.due))}` : "No priority due work"}</div>
          <div class="m-title uiv2-decision-text uiv2-text-reveal" title="${esc(heroTitle)}">${esc(heroTitle)}</div>
          <div class="today-mobile-next-meta" title="${esc(heroMeta)}">${esc(hero ? todayContextLabel(hero) : "Review Queue and Calendar remain available")} · ${esc(hero ? todayOwnerLabel(hero) : "No owner required")}</div>
          <div class="today-mobile-next-actions">
            ${hero ? `<button class="btn primary" type="button" data-today-card-open="${esc(hero.id)}">${icon("external")} Open</button>` : `<button class="btn primary" type="button" data-today-action="review">${icon("sparkles")} Review</button>`}
            ${hero ? `<button class="btn" type="button" data-today-card-done="${esc(hero.id)}">${icon("check")} Done</button>` : ""}
          </div>
        </div>

        <div class="today-mobile-stat-grid">
          <div class="m-card today-mobile-stat is-over">
            <div class="m-eyebrow">Overdue</div>
            <strong>${overdue.length}</strong>
            <span>${overdue.length ? esc(relativeDue(overdue[0].due)) : "All caught up"}</span>
          </div>
          <div class="m-card today-mobile-stat is-warn">
            <div class="m-eyebrow">Due Today</div>
            <strong>${dueToday.length}</strong>
            <span>${dueToday.length ? `${activeBoards || 1} board${activeBoards === 1 ? "" : "s"}` : "Open day"}</span>
          </div>
        </div>

        <button class="m-card today-mobile-review" type="button" data-today-action="review">
          <span class="today-mobile-review-mark">AI</span>
          <span>
            <strong>${esc(reviewTitle)}</strong>
            <small>${esc(reviewMeta)}</small>
          </span>
          <span class="btn ai sm">Open ${icon("external")}</span>
        </button>

        <div class="today-mobile-work-label">Today's work · ${mobileWork.length}</div>
        ${mobileWork.length ? mobileWork.map(card => {
          const dueState = dueStateForToday(card);
          const taskTitle = card.name || "Untitled task";
          const boardName = card.boardName || "No board";
          const listName = card.listName || "No list";
          const rowTitle = `${taskTitle} - ${boardName} / ${listName}`;
          const labelHtml = (card.labels || []).filter(l => l.name).slice(0, 1)
            .map(l => uiChip(labelTone(l.color), l.name, { sm: true }))
            .join("");
          return `
            <div class="m-trow today-mobile-task" data-card-id="${esc(card.id)}" data-today-row-open="${esc(card.id)}" title="${esc(rowTitle)}">
              <div class="row1">
                <div class="ttitle uiv2-decision-text uiv2-text-reveal" title="${esc(taskTitle)}">${esc(taskTitle)}</div>
                ${uiDue(card.due ? relativeDue(card.due) : "No due", dueState)}
              </div>
              <div class="row2">
                ${uiBoardTag(boardName, boardColorForName(card.boardName || ""))}
                <span>·</span>
                <span class="today-list-name uiv2-meta-text uiv2-text-reveal" title="${esc(listName)}">${esc(listName)}</span>
                ${labelHtml}
                <span class="today-mobile-task-members">${uiAvatarStack(card.members || [])}</span>
              </div>
            </div>`;
        }).join("") : uiStateCard({ kind: "empty", iconName: "check", title: "No visible due work", desc: "Trello due work is clear for today." })}
      </div>`;
  }

  if (typeof setTopbarRouteActions === "function") {
    setTopbarRouteActions(`
      <button class="btn" type="button" id="today-topbar-filter">${icon("filter")} Filter</button>
      <button class="btn primary" type="button" id="today-topbar-quick-add" data-today-action="focus-quick-add">${icon("plus")} Quick add</button>
    `);
  }

  const page = document.createElement("div");
  page.className = "today-page";
  page.innerHTML = `
    ${mobileTodayHtml()}

    ${uiRouteBar({
      title: "Daily command center",
      sub: `<span>${esc(dateStr)}</span><span>${totalAttention} items need attention: ${overdue.length} overdue / ${dueToday.length} due today / ${pendingCount} pending review</span>`,
    })}

    ${uiStatStrip([
      { label: "Overdue", value: overdue.length, detail: overdue.length ? relativeDue(overdue[0].due) : "All caught up", tone: "over" },
      { label: "Due Today", value: dueToday.length, detail: dueToday.length ? `Across ${activeBoards} boards` : "Open day", tone: "warn" },
      { label: "Next 7 Days", value: upcoming.length, detail: "Plan ahead" },
      { label: "Pending Review", value: pendingCount, detail: `${activeReviewSessions} active session${activeReviewSessions === 1 ? "" : "s"}`, tone: "ai" },
    ])}

    <div id="today-quick-panel" class="today-quick-panel" hidden>
      ${uiPanel({
        title: "Quick add",
        eyebrow: "Trello",
        body: `
          <div class="today-quick-add compact">
            <div class="today-qa-input-row">
              <input type="text" placeholder="+ Add a task for today..." id="today-quick-input" onkeydown="if(event.key==='Enter')showTodayQuickSelector()">
              <button class="btn primary sm" type="button" onclick="showTodayQuickSelector()">Add</button>
            </div>
            <div id="today-qa-selector" class="today-qa-selector hidden">
              <select id="today-qa-board" class="today-qa-select" onchange="loadTodayQALists()">
                <option value="">Board</option>
                ${quickAddBoards.map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("")}
              </select>
              <select id="today-qa-list" class="today-qa-select" disabled>
                <option value="">List</option>
              </select>
              <button class="btn primary sm" type="button" onclick="confirmTodayQuickAdd(this)">${icon("check")} Add</button>
              <button class="btn ghost sm" type="button" onclick="hideTodayQuickSelector()">Cancel</button>
            </div>
          </div>`,
      })}
    </div>

    <div class="today-grid">
      <div class="stack">
        <div class="next-up">
          <div class="eyebrow">${hero ? `${hero.due && new Date(hero.due) < now ? "Top priority" : "Next up"} · ${esc(nextUpDuePhrase(hero.due))}` : "No priority due work"}</div>
          <div class="nu-title uiv2-decision-text uiv2-text-reveal" title="${esc(hero?.name || "Today is clear from Trello due work.")}">${esc(hero?.name || "Today is clear from Trello due work.")}</div>
          <div class="nu-meta">
            <span>${esc(hero ? todayContextLabel(hero) : "Review Queue and Calendar remain available")}</span>
            <span>${esc(hero ? todayOwnerLabel(hero) : "No due task selected")}</span>
            <span>${esc(hero ? relativeDue(hero.due) : "Use Quick add if new work came in")}</span>
          </div>
          <div class="nu-actions">
            ${hero ? `<button class="btn primary" type="button" data-today-card-open="${esc(hero.id)}">${icon("external")} Open in Trello</button>` : `<button class="btn primary" type="button" data-today-action="review">${icon("sparkles")} Check Review</button>`}
            ${hero ? `<button class="btn" type="button" data-today-card-done="${esc(hero.id)}">${icon("check")} Mark done</button>` : ""}
            ${hero ? `<button class="btn" type="button" data-today-card-reschedule="${esc(hero.id)}">${icon("chevron")} Reschedule</button>` : ""}
          </div>
        </div>

        ${uiPanel({
          title: "Today's work",
          actions: `<span class="eyebrow">${todayWork.length} / ${allTodayWork.length} items</span><div class="seg" role="group" aria-label="Today work filter">
            <button class="${todayWorkFilter === "all" ? "on" : ""}" type="button" aria-pressed="${todayWorkFilter === "all"}" data-today-work-filter="all" title="Show all due and upcoming work">All</button>
            <button class="${todayWorkFilter === "mine" ? "on" : ""}" type="button" aria-pressed="${todayWorkFilter === "mine"}" data-today-work-filter="mine" title="Show assigned work. Personal identity is not inferred in this UI-only slice.">Mine</button>
            <button class="${todayWorkFilter === "risky" ? "on" : ""}" type="button" aria-pressed="${todayWorkFilter === "risky"}" data-today-work-filter="risky" title="Show overdue, blocked, stale, or unassigned work">Risky</button>
          </div>`,
          tight: true,
          body: todayWork.length ? todayWork.map(workRow).join("") : uiStateCard({
            kind: "empty",
            iconName: todayWorkFilter === "risky" ? "alert" : "check",
            title: todayWorkFilter === "all" ? "No visible due work" : `No ${todayWorkFilter} work in this window`,
            desc: todayWorkFilter === "mine"
              ? "No due or upcoming task has a visible Trello member assignment in this workspace slice."
              : todayWorkFilter === "risky"
                ? "No overdue, blocked, stale, or unassigned work appears in today's visible work window."
                : "Trello due work is clear for today.",
          }),
        })}
      </div>

      <div class="stack">
        ${uiPanel({
          eyebrow: "AI Review Queue",
          title: `${pendingCount} tasks await approval ${pendingCount ? uiChip("ai", "human gate", { sm: true }) : ""}`,
          actions: `<button class="btn ai sm" type="button" data-today-action="review">Open queue ${icon("arrowR")}</button>`,
          body: reviewHandoffHtml(),
        })}

        ${uiPanel({
          title: "Today on calendar",
          actions: `<span class="eyebrow">${calEvents === null ? "off" : `${calendarCount} events`}</span>`,
          body: `<div data-uiv2="calendar-peek">${calendarPeekHtml()}</div>`,
          tight: calEvents !== null && calendarCount > 0,
        })}

        ${uiPanel({
          eyebrow: "Cross-board signals",
          title: `${missingOwnerCards.length + blockedCards.length + staleCards.length} metadata warnings`,
          actions: `<button class="btn sm ghost" type="button" onclick="navigateTo('boards')">Open Boards ${icon("arrowR")}</button>`,
          body: signalsHtml(),
        })}

      </div>
    </div>
  `;

  content.innerHTML = "";
  content.appendChild(page);
  if (typeof ensureButtonTypes === "function") ensureButtonTypes(page);
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
      <div class="today-priority-eyebrow">${typeof icon === "function" ? icon(isHeroOverdue ? "alert" : "target") : ""}${isHeroOverdue ? "Top priority" : "Next up"} · ${esc(nextUpDuePhrase(hero.due))}</div>
      <div class="today-priority-time">${esc(relativeDue(hero.due))}</div>
      <div class="today-priority-title">${esc(hero.name)}</div>
      <div class="today-priority-meta">
        <span>Source: Trello</span>
        <span>Owner: ${esc(todayOwnerLabel(hero))}</span>
        <span>Context: ${esc(todayContextLabel(hero))}</span>
        <span>${esc(todayNextActionLabel(hero, heroState))}</span>
      </div>
      <div class="today-priority-actions">
        <button class="btn btn-primary btn-sm" type="button" data-today-card-open="${esc(hero.id)}">Open in Trello</button>
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
          <button class="btn btn-primary btn-sm" type="button" onclick="showTodayQuickSelector()">Add</button>
        </div>
        <div id="today-qa-selector" class="today-qa-selector hidden">
          <select id="today-qa-board" class="today-qa-select" onchange="loadTodayQALists()">
            <option value="">Board</option>
            ${(typeof getVisibleBoardsForScope === "function" ? getVisibleBoardsForScope() : S.boards).map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("")}
          </select>
          <select id="today-qa-list" class="today-qa-select" disabled>
            <option value="">List</option>
          </select>
          <button class="btn btn-primary btn-sm" type="button" onclick="confirmTodayQuickAdd(this)">${typeof icon === "function" ? icon("check") : ""}Add</button>
          <button class="btn btn-ghost btn-sm" type="button" onclick="hideTodayQuickSelector()">Cancel</button>
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
  const revealQuickAdd = () => {
    const panel = $("today-quick-panel");
    if (panel) panel.hidden = false;
    $("today-quick-input")?.focus();
  };
  page.querySelector("[data-today-action='focus-quick-add']")?.addEventListener("click", revealQuickAdd);
  $("today-topbar-quick-add")?.addEventListener("click", revealQuickAdd);
  $("today-topbar-filter")?.addEventListener("click", () => {
    const target = page.querySelector(".today-grid .seg");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.classList.add("uiv2-control-highlight");
    target?.querySelector("button:not([disabled])")?.focus();
    toast("Today's work filters are ready: All, Mine, and Risky.");
    setTimeout(() => target?.classList.remove("uiv2-control-highlight"), 900);
  });
  page.querySelectorAll("[data-today-work-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      S.todayWorkFilter = btn.dataset.todayWorkFilter || "all";
      showTodayPage();
    });
  });
  page.querySelectorAll("[data-today-card-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = cards.find(c => c.id === btn.dataset.todayCardOpen);
      if (card) openEditAllTasks(card);
    });
  });
  page.querySelectorAll("[data-today-row-open]").forEach(row => {
    row.addEventListener("click", event => {
      if (event.target.closest("button,input,select,a")) return;
      const card = cards.find(c => c.id === row.dataset.todayRowOpen);
      if (card) openEditAllTasks(card);
    });
  });
  page.querySelectorAll("[data-today-card-reschedule]").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = cards.find(c => c.id === btn.dataset.todayCardReschedule);
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
