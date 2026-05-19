// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  setupShellPrimitives();

  const [trelloStatus, config, calStatus] = await Promise.all([
    api.get("/api/trello/status").catch(() => ({
      configured: false,
      verified: false,
      connected: false,
      state: "unavailable",
      error: "Trello connection could not be verified. Ask Runtime to check private connection values and connectivity.",
    })),
    api.get("/api/config").catch(() => ({ groups: [], hiddenBoards: [], allowedWorkspaceIds: [] })),
    api.get("/api/calendar/status").catch(() => null),
  ]);
  S.trelloStatus = trelloStatus || S.trelloStatus;
  const boards = isTrelloVerified() ? await api.get("/api/boards").catch(() => []) : [];
  S.boards = boards;
  S.config = config;
  if (!S.config.groups) S.config.groups = [];
  if (!S.config.hiddenBoards) S.config.hiddenBoards = [];
  if (!S.config.allowedWorkspaceIds) S.config.allowedWorkspaceIds = [];
  if (!Array.isArray(S.config.monitorTeams)) S.config.monitorTeams = [];
  if (S.scopeGroupId && !getScopeGroups().some(group => group.id === S.scopeGroupId)) S.scopeGroupId = "";
  CAL.status = calStatus;

  if (typeof updateGcalSidebarStatus === "function") updateGcalSidebarStatus(Boolean(calStatus?.connected));
  if (typeof updateIntegrationStatusbar === "function") updateIntegrationStatusbar();

  setupShellPrimitives();
  renderSidebar();
  updateTrelloSidebarStatus();
  navigateTo(getPageFromPath(), { replace: true });
  updateReviewBadge().catch(() => {});
}

// ── Card filter helper ────────────────────────────────────────────────────────
// Returns allCardsCache filtered to only boards that are in S.boards (which
// already excludes non-allowed workspaces via /api/boards backend filter)
// and not in hiddenBoards.
function getAllowedCards() {
  if (!S.allCardsCache) return [];
  const allowedIds = new Set(S.boards.map(b => b.id));
  let cards = S.allCardsCache.filter(c =>
    allowedIds.has(c.boardId) && !S.config.hiddenBoards.includes(c.boardId)
  );
  const activeScope = getActiveScopeGroup();
  if (activeScope) cards = cards.filter(card => cardMatchesScope(card, activeScope));
  return cards;
}

function normalizeScopeName(name = "") {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getScopeGroups() {
  const scopePalette = ["#2563eb", "#0ea5e9", "#137e52", "#b86a05", "#7c3aed", "#db2777"];
  const seen = new Set();
  return (S.config?.monitorTeams || [])
    .map(label => String(label || "").trim())
    .filter(Boolean)
    .filter(label => {
      const key = normalizeScopeName(label);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((label, index) => ({
      id: `team:${normalizeScopeName(label)}`,
      name: label,
      color: scopePalette[index % scopePalette.length],
      source: "team-label",
    }));
}

function getActiveScopeGroup() {
  return getScopeGroups().find(group => group.id === S.scopeGroupId) || null;
}

function getScopeBoardIds() {
  return null;
}

function cardMatchesScope(card, scope = getActiveScopeGroup()) {
  if (!scope) return true;
  const target = normalizeScopeName(scope.name);
  return (card.labels || []).some(label => normalizeScopeName(label.name) === target);
}

function scopeLabel() {
  return getActiveScopeGroup()?.name || "All BUs";
}

function getScopeColor(group = getActiveScopeGroup()) {
  return group?.color || "#2563eb";
}

function getVisibleBoardsForScope() {
  const hidden = new Set(S.config.hiddenBoards || []);
  let boards = (S.boards || []).filter(board => !hidden.has(board.id));
  const activeScope = getActiveScopeGroup();
  if (activeScope && S.allCardsCache) {
    const matchingBoardIds = new Set(getAllowedCards().map(card => card.boardId));
    boards = boards.filter(board => matchingBoardIds.has(board.id));
  }
  return boards;
}

function selectScope(groupId = "") {
  const groups = getScopeGroups();
  const validId = groups.some(group => group.id === groupId) ? groupId : "";
  const nextId = validId && validId === S.scopeGroupId ? "" : validId;
  S.scopeGroupId = nextId;
  S.currentBoardId = null;
  S.currentGroupId = null;
  if (typeof CAL !== "undefined") CAL.selectedBoardIds = null;
  updateScopeShell();
  renderScopeList();
  const page = typeof getPageFromPath === "function" ? getPageFromPath() : S.mode || "today";
  if (typeof navigateTo === "function") navigateTo(page, { updateUrl: false, replace: true });
}

function positionTopbarPopover(panel, anchor) {
  if (!panel || !anchor) return;
  const rect = anchor.getBoundingClientRect();
  const width = panel.offsetWidth || 300;
  const maxLeft = Math.max(8, window.innerWidth - width - 8);
  const left = Math.min(Math.max(8, rect.right - width), maxLeft);
  panel.style.left = `${left}px`;
  panel.style.top = `${Math.round(rect.bottom + 8)}px`;
}

function closeTopbarScopeMenu({ restore = false, focusTarget = ".topbar .scope-pick" } = {}) {
  const panel = $("topbar-scope-popover");
  if (panel) panel.remove();
  document.querySelectorAll(".topbar .scope-pick").forEach(pick => pick.setAttribute("aria-expanded", "false"));
  if (restore && typeof restoreFocus === "function") restoreFocus(focusTarget);
}

function renderTopbarScopeRow({ id = "", label, color = "#2563eb", active = false, disabled = false, meta = "" }) {
  return `
    <button class="topbar-scope-row${active ? " is-active" : ""}" type="button"
      data-scope-menu-id="${esc(id)}" ${disabled ? "disabled aria-disabled=\"true\"" : ""}
      role="option" aria-selected="${active}">
      <span class="scope-dot" style="--scope-color:${esc(color)}"></span>
      <span class="topbar-scope-row-copy">
        <strong>${esc(label)}</strong>
        ${meta ? `<small>${esc(meta)}</small>` : ""}
      </span>
      ${active ? `<span class="topbar-scope-check">${icon("check")}</span>` : ""}
    </button>
  `;
}

function toggleTopbarScopeMenu(event) {
  event?.stopPropagation?.();
  const anchor = event?.currentTarget || document.querySelector(".topbar .scope-pick");
  const existing = $("topbar-scope-popover");
  if (existing) {
    closeTopbarScopeMenu({ restore: true, focusTarget: anchor });
    return;
  }
  closeTopbarNotifications();

  const groups = getScopeGroups();
  const active = getActiveScopeGroup();
  const panel = document.createElement("div");
  panel.id = "topbar-scope-popover";
  panel.className = "topbar-control-popover topbar-scope-popover";
  panel.setAttribute("role", "listbox");
  panel.setAttribute("aria-label", "Business unit scope");
  panel.innerHTML = `
    <div class="topbar-popover-head">
      <span class="eyebrow">Scope</span>
      <button class="iconbtn" type="button" aria-label="Close scope menu" data-close-scope-menu>${icon("x")}</button>
    </div>
    <div class="topbar-popover-note">${active ? `Filtering this route by the ${esc(active.name)} Team mode label.` : "Showing all configured Team mode labels."}</div>
    <div class="topbar-scope-list">
      ${renderTopbarScopeRow({ label: "All BUs", active: !active, meta: "Show every visible label" })}
      ${groups.length ? groups.map(group => renderTopbarScopeRow({
        id: group.id,
        label: group.name,
        color: group.color || "#2563eb",
        active: active?.id === group.id,
        meta: "Team mode label",
      })).join("") : `
        <button class="topbar-scope-row" type="button" data-scope-settings>
          <span class="scope-dot" style="--scope-color:#6b7280"></span>
          <span class="topbar-scope-row-copy"><strong>Configure labels</strong><small>Add Team mode labels in Settings</small></span>
          ${icon("chevron")}
        </button>
      `}
    </div>
  `;
  document.body.appendChild(panel);
  anchor?.setAttribute("aria-expanded", "true");
  positionTopbarPopover(panel, anchor);

  panel.querySelector("[data-close-scope-menu]")?.addEventListener("click", () => closeTopbarScopeMenu({ restore: true, focusTarget: anchor }));
  panel.querySelector("[data-scope-settings]")?.addEventListener("click", () => {
    closeTopbarScopeMenu();
    navigateTo("settings");
  });
  panel.querySelectorAll("[data-scope-menu-id]:not([disabled])").forEach(row => {
    row.addEventListener("click", () => {
      selectScope(row.getAttribute("data-scope-menu-id") || "");
      closeTopbarScopeMenu();
    });
  });
}

function onScopeKeydown(event, groupId = "") {
  if (event.key === "Escape") {
    closeTopbarScopeMenu({ restore: true });
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  if (event.currentTarget?.classList?.contains("scope-pick")) {
    toggleTopbarScopeMenu(event);
  } else {
    selectScope(groupId);
  }
}

function updateScopeShell() {
  const active = getActiveScopeGroup();
  document.querySelectorAll(".topbar .scope-pick").forEach(pick => {
    let label = pick.querySelector(".scope-pick-label");
    if (!label) {
      const dot = pick.querySelector(".scope-dot");
      const text = [...pick.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      label = document.createElement("span");
      label.className = "scope-pick-label";
      label.textContent = (text?.textContent || "All BUs").trim();
      if (text) text.remove();
      if (dot) dot.insertAdjacentElement("afterend", label);
      else pick.prepend(label);
    }
    label.textContent = scopeLabel();
    pick.classList.toggle("is-filtered", Boolean(active));
    pick.style.setProperty("--scope-color", getScopeColor(active));
    pick.removeAttribute("role");
    pick.removeAttribute("tabindex");
    if (pick.tagName === "BUTTON") pick.type = "button";
    pick.dataset.action = "open-scope-menu";
    pick.setAttribute("aria-haspopup", "listbox");
    pick.setAttribute("aria-controls", "topbar-scope-popover");
    pick.setAttribute("aria-expanded", String(Boolean($("topbar-scope-popover"))));
    pick.setAttribute("title", active ? `Scope: ${active.name}. Open scope menu.` : "Scope: All BUs. Open scope menu.");
    pick.setAttribute("aria-label", active ? `Scope filter ${active.name}. Open scope menu.` : "Scope filter All BUs. Open scope menu.");
    pick.onclick = toggleTopbarScopeMenu;
    pick.onkeydown = null;
  });
}

function renderScopeList() {
  const list = document.querySelector(".scope-list");
  if (!list) return;
  const scopePalette = ["#2563eb", "#0ea5e9", "#137e52", "#b86a05"];
  const groups = getScopeGroups();
  if (S.scopeGroupId && !groups.some(group => group.id === S.scopeGroupId)) S.scopeGroupId = "";
  if (!groups.length) {
    list.innerHTML = `
      <button class="nav-item scope-item scope-configure" type="button" data-scope-configure style="--scope-color:#6b7280" title="Configure Team mode labels in Settings">
        <span class="ico scope-dot"></span>
        <span class="lbl">Configure Labels</span>
      </button>
    `;
    list.querySelector("[data-scope-configure]")?.addEventListener("click", () => navigateTo("settings"));
    updateScopeShell();
    return;
  }

  list.innerHTML = groups.map((group, index) => {
    const color = group.color || scopePalette[index % scopePalette.length];
    const active = group.id === S.scopeGroupId;
    const title = active ? `Clear ${group.name} scope filter` : `Filter visible work by ${group.name} label`;
    return `
      <button class="nav-item scope-item${active ? " active" : ""}" type="button"
        data-scope-id="${esc(group.id)}" style="--scope-color:${esc(color)}"
        aria-pressed="${active}"
        aria-label="${esc(active ? `Clear ${group.name} scope filter` : `Filter visible work by ${group.name} label`)}"
        title="${esc(title)}">
        <span class="ico scope-dot"></span>
        <span class="lbl">${esc(group.name)}</span>
      </button>
    `;
  }).join("");
  list.querySelectorAll(".scope-item:not([disabled])").forEach(item => {
    item.addEventListener("click", () => selectScope(item.dataset.scopeId || ""));
    item.addEventListener("keydown", event => onScopeKeydown(event, item.dataset.scopeId || ""));
  });
  updateScopeShell();
}


// ── Planner Page ──────────────────────────────────────────────────────────────
function getPlannerWindow() {
  return ["today", "tomorrow", "week"].includes(S.plannerWindow) ? S.plannerWindow : "today";
}

function plannerWindowLabel(mode = getPlannerWindow()) {
  if (mode === "tomorrow") return "Tomorrow";
  if (mode === "week") return "This week";
  return "Today";
}

function plannerWindowRange(mode = getPlannerWindow()) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(todayStart);
  const end = new Date(todayStart);
  if (mode === "tomorrow") {
    start.setDate(todayStart.getDate() + 1);
    end.setDate(todayStart.getDate() + 2);
  } else if (mode === "week") {
    end.setDate(todayStart.getDate() + 7);
  } else {
    end.setDate(todayStart.getDate() + 1);
  }
  return { start, end, label: plannerWindowLabel(mode) };
}

function setPlannerWindow(mode) {
  S.plannerWindow = ["today", "tomorrow", "week"].includes(mode) ? mode : "today";
  showPlannerPage();
}

// V0.2-W2-05 Planner redesign implemented by Codex Dev.
async function showPlannerPage() {
  S.mode = "planner";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Planner";
  $("board-subtitle").textContent = "Read-only";
  $("add-list-btn").classList.add("hidden");

  const dateStr = formatThaiDateTime(new Date().toISOString(), false);
  const plannerWindow = getPlannerWindow();
  const plannerLabel = plannerWindowLabel(plannerWindow);
  const plannerSeg = `
    <div class="seg" aria-label="Planner window">
      <button type="button" class="${plannerWindow === "today" ? "on" : ""}" aria-pressed="${plannerWindow === "today"}" onclick="setPlannerWindow('today')">Today</button>
      <button type="button" class="${plannerWindow === "tomorrow" ? "on" : ""}" aria-pressed="${plannerWindow === "tomorrow"}" onclick="setPlannerWindow('tomorrow')">Tomorrow</button>
      <button type="button" class="${plannerWindow === "week" ? "on" : ""}" aria-pressed="${plannerWindow === "week"}" onclick="setPlannerWindow('week')">This week</button>
    </div>
  `;

  $("board-content").innerHTML = `
    <div class="planner-page">
      ${uiRouteBar({
        title: `${plannerLabel} plan`,
        sub: `<span>Daily Planner</span><span>&middot;</span><span>window ${esc(plannerLabel.toLowerCase())}</span><span>&middot;</span><span>gtasks off</span><span>&middot;</span><span>trello connected</span><span>&middot;</span><span>${dateStr}</span>`,
        actions: plannerSeg,
      })}

      <div class="planner-disconnect-banner planner-source-card" data-uiv2="planner-source" aria-label="Planner source summary">
        ${icon("alert")}
        <div>
          <strong>Google Tasks is disconnected</strong>
          <p>Planner is showing Trello deadlines only. Connect Google Tasks in Settings to add and complete personal tasks.</p>
        </div>
        <button class="btn sm" type="button" onclick="navigateTo('settings')" aria-label="Open Planner connection settings for Google Tasks" title="Open Planner connection settings for Google Tasks">Open Settings</button>
      </div>

      <div class="planner-grid planner-cols">
        <section class="planner-section planner-panel-google panel">
          <div class="planner-section-title">
            <span>${icon("checkSquare")} Google Tasks</span>
            <em id="planner-gtasks-state">Loading</em>
          </div>
          <div id="planner-gtasks-body"><div class="planner-loading">Loading Google Tasks...</div></div>
        </section>

        <section class="planner-section planner-panel-trello panel">
          <div class="planner-section-title">
            <span>${icon("calendar")} Trello deadlines</span>
            <em>${esc(plannerLabel)}</em>
          </div>
          <div id="planner-trello-body"><div class="planner-loading">Loading Trello deadlines...</div></div>
        </section>
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
      if ($("planner-gtasks-count")) $("planner-gtasks-count").textContent = "Off";
      if ($("planner-gtasks-state")) $("planner-gtasks-state").textContent = "Disconnected";
      setPlannerSourceCard("google", "Disconnected", "Owner action: connect Google Tasks in Settings. Trello deadlines remain visible below.");
      body.innerHTML = `
        <div class="planner-connect-state planner-connect-card">
          <div class="empty-icon">${icon("checkSquare")}</div>
          <h3>Connect Google Tasks</h3>
          <p>Once connected, your personal day plan from Google Tasks shows up here next to Trello deadlines. No tasks are written until you approve a connection.</p>
          <div class="planner-connect-actions">
            <button class="btn primary sm" type="button" onclick="openCalSetup()" aria-label="Open Google Tasks connection setup" title="Open Google Tasks connection setup">Open Settings</button>
            <button class="btn sm" type="button" onclick="toast('Google Tasks stays read-only until connected in Settings')">Why this exists</button>
          </div>
        </div>`;
      return;
    }
    const plannerWindow = getPlannerWindow();
    if (plannerWindow !== "today") {
      const label = plannerWindowLabel(plannerWindow);
      if ($("planner-gtasks-count")) $("planner-gtasks-count").textContent = "Today only";
      if ($("planner-gtasks-state")) $("planner-gtasks-state").textContent = "Connected";
      setPlannerSourceCard("google", "Today only", `Google Tasks personal task list stays on Today while the Trello deadline window is set to ${label}.`);
      body.innerHTML = `
        <div class="planner-connect-state planner-connect-card">
          <div class="empty-icon">${icon("checkSquare")}</div>
          <h3>Google Tasks stays on Today</h3>
          <p>The ${esc(label)} window updates Trello deadlines below. Google Tasks remains the connected Today list in this frontend slice.</p>
          <div class="planner-connect-actions">
            <button class="btn primary sm" type="button" onclick="setPlannerWindow('today')">Show Today</button>
            <button class="btn sm" type="button" onclick="navigateTo('settings')" aria-label="Open Google Tasks connection settings">Connection settings</button>
          </div>
        </div>`;
      return;
    }
    const tasks = await api.get("/api/google-tasks/today");
    if ($("planner-gtasks-count")) $("planner-gtasks-count").textContent = tasks.length;
    if ($("planner-gtasks-state")) $("planner-gtasks-state").textContent = "Connected";
    setPlannerSourceCard("google", `${tasks.length} task${tasks.length === 1 ? "" : "s"}`, "Connected source for personal tasks due today or overdue.");
    renderPlannerGTasks(tasks);
  } catch (e) {
    console.error("[Planner Google Tasks Error]", e);
    if ($("planner-gtasks-count")) $("planner-gtasks-count").textContent = "!";
    if ($("planner-gtasks-state")) $("planner-gtasks-state").textContent = "Error";
    setPlannerSourceCard("google", "Needs attention", "Owner action: check Google Tasks connection in Settings.");
    body.innerHTML = `<div class="planner-error">Google Tasks could not be loaded. Owner action: check the Settings connection and retry.</div>`;
  }
}

function setPlannerSourceCard(source, state, copy) {
  const stateEl = $(`planner-${source}-source-state`);
  const copyEl = $(`planner-${source}-source-copy`);
  if (stateEl) stateEl.textContent = state;
  if (copyEl) copyEl.textContent = copy;
}

function renderPlannerGTasks(tasks) {
  const body = $("planner-gtasks-body");
  if (!body) return;

  let listHtml = "";
  if (tasks.length === 0) {
    listHtml = `<div class="planner-empty">No Google Tasks due today.</div>`;
  } else {
    listHtml = `<div class="planner-task-list">` +
      tasks.map(t => `
        <div class="planner-task-row" data-task-id="${esc(t.id)}" title="${esc(t.title || "Untitled Google Task")}">
          <input type="checkbox" class="planner-checkbox"
            onchange="plannerCompleteTask('${esc(t.id)}',this)">
          <span class="planner-task-title uiv2-decision-text uiv2-text-reveal" title="${esc(t.title || "Untitled Google Task")}">${esc(t.title)}</span>
          <span class="planner-source-pill is-google">Google Tasks</span>
        </div>`).join("") +
    `</div>`;
  }

  body.innerHTML = listHtml + `
    <div class="planner-add-row">
      <input type="text" id="planner-add-input" class="planner-add-input"
        placeholder="Add a Google Task for today..."
        onkeydown="if(event.key==='Enter')plannerAddTask()">
      <button class="btn btn-sm planner-add-btn" type="button" onclick="plannerAddTask()">${icon("plus")} Add</button>
    </div>`;
}

async function plannerCompleteTask(taskId, checkbox) {
  checkbox.disabled = true;
  try {
    await api.put(`/api/google-tasks/${taskId}`, { complete: true });
    const row = checkbox.closest(".planner-task-row");
    if (row) {
      row.classList.add("is-complete");
      row.insertAdjacentHTML("beforeend", `<span class="planner-complete-note">Completed</span>`);
      row.style.opacity = "0.35";
      setTimeout(() => {
        row.remove();
        const list = $("planner-gtasks-body")?.querySelector(".planner-task-list");
        if (list && !list.querySelector(".planner-task-row")) {
          list.innerHTML = `<div class="planner-empty">No Google Tasks due today.</div>`;
        }
        if ($("planner-gtasks-count")) {
          const remaining = $("planner-gtasks-body")?.querySelectorAll(".planner-task-row").length ?? 0;
          $("planner-gtasks-count").textContent = remaining;
          setPlannerSourceCard("google", `${remaining} task${remaining === 1 ? "" : "s"}`, "Connected source for personal tasks due today or overdue.");
        }
      }, 350);
    }
  } catch (e) {
    console.error("[Planner Complete Error]", e);
    checkbox.checked = false;
    checkbox.disabled = false;
    toast("Google Task could not be completed. Check the Google Tasks connection and retry.", true);
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
        <span class="planner-task-title uiv2-decision-text uiv2-text-reveal" title="${esc(task.title || "Untitled Google Task")}">${esc(task.title)}</span>
        <span class="planner-source-pill is-google">Google Tasks</span>`;
      row.title = task.title || "Untitled Google Task";
      list.appendChild(row);
      if ($("planner-gtasks-count")) $("planner-gtasks-count").textContent = list.querySelectorAll(".planner-task-row").length;
      setPlannerSourceCard("google", `${list.querySelectorAll(".planner-task-row").length} tasks`, "Connected source for personal tasks due today or overdue.");
    } else {
      await loadPlannerGTasks();
    }
    toast("Google Task added");
  } catch (e) {
    console.error("[Planner Add Error]", e);
    toast("Google Task could not be added. Check the Google Tasks connection and retry.", true);
  } finally {
    input.disabled = false;
    input?.focus();
  }
}

async function loadPlannerTrello() {
  const body = $("planner-trello-body");
  if (!body) return;

  if (!isTrelloVerified()) {
    if ($("planner-today-count")) $("planner-today-count").textContent = "Off";
    if ($("planner-tomorrow-count")) $("planner-tomorrow-count").textContent = "Off";
    setPlannerSourceCard("trello", "Disconnected", "Owner action: check Trello in Settings. Google Tasks remain separate.");
    body.innerHTML = `<div class="planner-error">Trello deadlines are unavailable. Owner action: check Trello connection in Settings.</div>`;
    return;
  }

  if (!S.allCardsCache) {
    try {
      S.allCardsCache = await api.get("/api/all-cards");
    } catch (e) {
      if ($("planner-today-count")) $("planner-today-count").textContent = "!";
      if ($("planner-tomorrow-count")) $("planner-tomorrow-count").textContent = "!";
      setPlannerSourceCard("trello", "Needs attention", "Owner action: check Trello connection and workspace visibility.");
      body.innerHTML = `<div class="planner-error">Unable to load Trello cards.</div>`;
      return;
    }
  }

  const cards = getAllowedCards();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const dayAfterStart = new Date(tomorrowStart); dayAfterStart.setDate(dayAfterStart.getDate() + 1);
  const { start, end, label } = plannerWindowRange();

  const windowCards = cards.filter(c => c.due && new Date(c.due) >= start && new Date(c.due) < end);
  const todayCards = windowCards.filter(c => c.due && new Date(c.due) >= todayStart && new Date(c.due) < tomorrowStart);
  const tomorrowCards = windowCards.filter(c => c.due && new Date(c.due) >= tomorrowStart && new Date(c.due) < dayAfterStart);
  const laterCards = windowCards.filter(c => !todayCards.includes(c) && !tomorrowCards.includes(c));
  if ($("planner-today-count")) $("planner-today-count").textContent = todayCards.length;
  if ($("planner-tomorrow-count")) $("planner-tomorrow-count").textContent = tomorrowCards.length;
  setPlannerSourceCard("trello", `${windowCards.length} due item${windowCards.length === 1 ? "" : "s"}`, `${label} Trello deadline window from execution boards.`);

  if (!windowCards.length) {
    body.innerHTML = `<div class="planner-empty">No Trello cards due in ${esc(label.toLowerCase())}.</div>`;
    return;
  }

  const cardRow = (c, label, cls) => {
    const taskTitle = c.name || "Untitled Trello card";
    const sourceMeta = `${c.boardName || "No board"} / ${c.listName || "No list"}`;
    return `
    <div class="planner-trello-row" title="${esc(`${taskTitle} - ${sourceMeta}`)}">
      <span class="planner-source-pill is-trello ${cls}">${label}</span>
      <span class="planner-trello-title uiv2-decision-text uiv2-text-reveal" title="${esc(taskTitle)}">${esc(taskTitle)}</span>
      <span class="planner-trello-meta uiv2-meta-text uiv2-text-reveal" title="${esc(sourceMeta)}">${esc(sourceMeta)}</span>
    </div>`;
  };

  let html = "";
  if (todayCards.length) {
    html += `<div class="planner-sub-label">Today</div>`;
    html += todayCards.map(c => cardRow(c, "Today", "chip-danger")).join("");
  }
  if (tomorrowCards.length) {
    html += `<div class="planner-sub-label">Tomorrow</div>`;
    html += tomorrowCards.map(c => cardRow(c, "Tomorrow", "chip-warning")).join("");
  }
  if (laterCards.length) {
    html += `<div class="planner-sub-label">Later this week</div>`;
    html += laterCards.map(c => cardRow(c, "This week", "chip-info")).join("");
  }
  body.innerHTML = html;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function setupShellPrimitives() {
  // Implemented by Codex Dev: code-native icons and mobile nav shell.
  if (typeof ensureButtonTypes === "function") ensureButtonTypes(document);
  if (typeof syncClosedSurfaces === "function") syncClosedSurfaces();
  if (typeof setupStatusbarDescriptions === "function") setupStatusbarDescriptions();
  const navIcons = {
    today: "today",
    review: "sparkles",
    all: "tasks",
    boards: "boards",
    calendar: "calendar",
    planner: "planner",
    okr: "target",
    focus: "focus",
    docs: "trace",
    settings: "settings",
  };
  document.querySelectorAll(".logo").forEach(el => { el.textContent = "T"; });
  document.querySelectorAll(".sidebar-header h1 span").forEach(el => { el.textContent = "Task Hub · v2"; });
  document.querySelectorAll(".side-search-kbd").forEach(el => { el.innerHTML = "&#8984;K"; });
  const sidebarNav = document.querySelector(".sidebar-nav");
  const scopeHeading = sidebarNav?.querySelector(".scope-heading");
  if (sidebarNav && scopeHeading) {
    ["today", "review", "all", "boards", "calendar", "planner", "okr", "focus", "docs", "settings"].forEach(page => {
      const item = sidebarNav.querySelector(`.nav-item[data-page="${page}"]`);
      if (item) sidebarNav.insertBefore(item, scopeHeading);
    });
  }
  document.querySelectorAll(".nav-item[data-page]").forEach(item => {
    const slot = item.querySelector(".nav-icon");
    if (slot && typeof icon === "function") {
      slot.innerHTML = icon(navIcons[item.dataset.page] || "today");
    }
  });
  document.querySelectorAll(".mobile-route-item[data-page='settings'] .nav-icon").forEach(slot => {
    if (typeof icon === "function") slot.innerHTML = icon("more");
  });
  document.querySelectorAll(".side-search-icon").forEach(slot => {
    if (typeof icon === "function") slot.innerHTML = icon("search");
  });
  document.querySelectorAll(".modal-close").forEach(btn => {
    if (typeof icon === "function") {
      btn.innerHTML = icon("x");
      if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Close");
    }
  });
  document.querySelectorAll(".topbar .scope-pick").forEach(pick => {
    if (typeof icon === "function" && !pick.querySelector("svg")) {
      pick.insertAdjacentHTML("beforeend", icon("down", 'width="11" height="11"'));
    }
  });
  updateScopeShell();
  const refreshBtn = $("topbar-refresh-btn");
  if (refreshBtn && typeof icon === "function") {
    refreshBtn.innerHTML = icon("refresh");
    refreshBtn.setAttribute("aria-label", "Refresh current view");
  }
  const notificationsBtn = $("topbar-notifications-btn");
  if (notificationsBtn && typeof icon === "function") {
    notificationsBtn.innerHTML = icon("bell");
    notificationsBtn.setAttribute("aria-haspopup", "dialog");
    notificationsBtn.setAttribute("aria-expanded", "false");
    notificationsBtn.onclick = event => {
      event.stopPropagation();
      toggleTopbarNotifications();
    };
  }
  const manageBtn = $("manage-btn");
  if (manageBtn && typeof icon === "function") {
    manageBtn.innerHTML = icon("settings");
    manageBtn.setAttribute("aria-label", "Manage groups and visibility");
  }
  const sidebarRefreshBtn = $("refresh-btn");
  if (sidebarRefreshBtn && typeof icon === "function") {
    sidebarRefreshBtn.innerHTML = icon("refresh");
    sidebarRefreshBtn.setAttribute("aria-label", "Refresh boards");
  }
  const hiddenToggleBtn = $("toggle-hidden-btn");
  if (hiddenToggleBtn && typeof icon === "function") {
    const count = $("hidden-count")?.textContent || "0";
    hiddenToggleBtn.innerHTML = `${icon("eye")} Show hidden boards (<span id="hidden-count">${esc(count)}</span>)`;
  }
  if (typeof ensureButtonTypes === "function") ensureButtonTypes(document);
  if (typeof syncClosedSurfaces === "function") syncClosedSurfaces();
  setupMobileNavigation();
  bindTopbarControlDismissals();
}

function bindTopbarControlDismissals() {
  if (window.__topbarControlsBound) return;
  window.__topbarControlsBound = true;
  document.addEventListener("click", event => {
    if (!event.target.closest("#topbar-scope-popover") && !event.target.closest(".topbar .scope-pick")) {
      closeTopbarScopeMenu({ restore: Boolean($("topbar-scope-popover")) });
    }
    if (!event.target.closest("#topbar-notification-popover") && !event.target.closest("#topbar-notifications-btn")) {
      closeTopbarNotifications({ restore: Boolean($("topbar-notification-popover")) });
    }
    if (!event.target.closest("#docs-filter-popover") && !event.target.closest("#docs-topbar-filter")) {
      if (typeof closeDocsFilterMenu === "function") closeDocsFilterMenu({ restore: Boolean($("docs-filter-popover")) });
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    closeTopbarScopeMenu({ restore: Boolean($("topbar-scope-popover")) });
    closeTopbarNotifications({ restore: Boolean($("topbar-notification-popover")) });
    if (typeof closeDocsFilterMenu === "function") closeDocsFilterMenu({ restore: Boolean($("docs-filter-popover")) });
  });
  window.addEventListener("resize", () => {
    closeTopbarScopeMenu();
    closeTopbarNotifications();
    if (typeof closeDocsFilterMenu === "function") closeDocsFilterMenu();
  });
}

function closeTopbarNotifications({ restore = false, focusTarget = "#topbar-notifications-btn" } = {}) {
  const panel = $("topbar-notification-popover");
  if (panel) panel.remove();
  $("topbar-notifications-btn")?.setAttribute("aria-expanded", "false");
  if (restore && typeof restoreFocus === "function") restoreFocus(focusTarget);
}

function topbarNotificationStatus(label, value, tone = "") {
  return `
    <div class="topbar-notification-row ${tone ? `is-${tone}` : ""}">
      <span>${esc(label)}</span>
      <strong>${esc(value)}</strong>
    </div>
  `;
}

function toggleTopbarNotifications() {
  const existing = $("topbar-notification-popover");
  if (existing) {
    closeTopbarNotifications({ restore: true });
    return;
  }
  closeTopbarScopeMenu();
  if (typeof closeDocsFilterMenu === "function") closeDocsFilterMenu();

  const anchor = $("topbar-notifications-btn");
  const host = document.querySelector(".topbar-actions");
  if (!anchor || !host) return;

  const reviewBadgeText = document.querySelector(".nav-item[data-page='review'] .badge")?.textContent?.trim();
  const reviewPending = reviewBadgeText || "0";
  const trelloState = S.trelloStatus?.verified ? "connected" : S.trelloStatus?.configured ? "needs retry" : "setup needed";
  const calendarState = CAL?.status?.connected ? "connected" : "settings action";
  const docsCount = Array.isArray(S.paperclipDocsIndex?.documents) ? S.paperclipDocsIndex.documents.length : 0;
  const routeTitle = $("board-title")?.textContent?.trim() || "Current route";

  const panel = document.createElement("div");
  panel.id = "topbar-notification-popover";
  panel.className = "topbar-notification-popover";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Route notifications");
  panel.innerHTML = `
    <div class="topbar-notification-head">
      <span class="eyebrow">Notifications</span>
      <button class="iconbtn" type="button" aria-label="Close notifications" data-close-topbar-notifications>${icon("x")}</button>
    </div>
    <div class="topbar-notification-body">
      ${topbarNotificationStatus("Current route", routeTitle, "route")}
      ${topbarNotificationStatus("Review Queue", `${reviewPending} pending`, Number(reviewPending) ? "review" : "ok")}
      ${topbarNotificationStatus("Trello", trelloState, S.trelloStatus?.verified ? "ok" : "warn")}
      ${topbarNotificationStatus("Google Calendar", calendarState, CAL?.status?.connected ? "ok" : "warn")}
      ${topbarNotificationStatus("Docs / AI Trace", `${docsCount} trace${docsCount === 1 ? "" : "s"}`, "trace")}
    </div>
    <div class="topbar-notification-actions">
      <button class="btn sm" type="button" data-notification-route="review">Open Review</button>
      <button class="btn sm" type="button" data-notification-route="settings">Connections</button>
      <button class="btn sm ghost" type="button" data-notification-route="docs">Trace</button>
    </div>
  `;
  host.appendChild(panel);
  anchor.setAttribute("aria-expanded", "true");
  positionTopbarPopover(panel, anchor);
  panel.querySelector("[data-close-topbar-notifications]")?.focus({ preventScroll: true });

  panel.querySelector("[data-close-topbar-notifications]")?.addEventListener("click", () => closeTopbarNotifications({ restore: true }));
  panel.querySelectorAll("[data-notification-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-notification-route");
      closeTopbarNotifications();
      navigateTo(route);
    });
  });

  bindTopbarControlDismissals();
}

function setupMobileNavigation() {
  if (window.__taskHubMobileNavReady) return;
  window.__taskHubMobileNavReady = true;
  const btn = $("mobile-nav-btn");
  const overlay = $("mobile-nav-overlay");
  if (!btn || !overlay) return;

  btn.onclick = () => {
    const open = !document.body.classList.contains("mobile-nav-open");
    document.body.classList.toggle("mobile-nav-open", open);
    btn.setAttribute("aria-expanded", String(open));
  };
  overlay.onclick = closeMobileNav;
  document.querySelectorAll(".sidebar .nav-item").forEach(item => {
    item.addEventListener("click", closeMobileNav);
  });
}

function closeMobileNav() {
  document.body.classList.remove("mobile-nav-open");
  $("mobile-nav-btn")?.setAttribute("aria-expanded", "false");
}

function renderSidebar() {
  updateTrelloSidebarStatus();
  renderScopeList();
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

  const visible = typeof getVisibleBoardsForScope === "function"
    ? getVisibleBoardsForScope()
    : S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
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
  document.querySelectorAll(".nav-item[data-page]").forEach(el => el.classList.remove("active"));
  const boardsSection = $("sidebar-boards-section");
  if (boardsSection) {
    boardsSection.style.display = "";
    if (typeof setInteractiveHidden === "function") setInteractiveHidden(boardsSection, false);
  }

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
    content.innerHTML = trelloRouteUnavailableHtml("Board");
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
  document.querySelectorAll(".nav-item[data-page]").forEach(el => el.classList.remove("active"));
  const boardsSection = $("sidebar-boards-section");
  if (boardsSection) {
    boardsSection.style.display = "";
    if (typeof setInteractiveHidden === "function") setInteractiveHidden(boardsSection, false);
  }

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
        <button class="collapse-btn" type="button">▲ Collapse</button>
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
    content.innerHTML = trelloRouteUnavailableHtml("Business Unit");
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
  if (card.start) meta += `<span class="start-badge">▶ ${formatThaiDateTime(card.start)}</span>`;
  if (card.due)   meta += buildDueBadge(card.due, card.dueComplete);
  if (card.dueReminder != null && card.dueReminder !== -1) meta += `<span class="reminder-icon" title="Reminder set">${icon("bell")}</span>`;
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
            <span class="card-cl-name">${icon("checkSquare")} ${esc(cl.name)}</span>
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
  return `<span class="due-badge ${cls}">${prefix}${formatThaiDateTime(due)}</span>`;
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

// ── P8-3: Export CSV ──────────────────────────────────────────────────────────
function exportTasksCSV() {
  const rows = window._filteredCards || [];
  if (!rows.length) { toast("No tasks to export", true); return; }

  function csvCell(val) {
    const s = String(val ?? "");
    return (s.includes(",") || s.includes('"') || s.includes("\n"))
      ? `"${s.replace(/"/g, '""')}"` : s;
  }

  const headers = ["Title", "Board", "List", "Owner", "Due Date", "Labels", "Status"];
  const now = new Date();
  const dataRows = rows.map(c => {
    const owner   = (c.members || []).map(m => m.fullName || m.username || m.id).join("; ");
    const dueDate = c.due ? formatThaiDateTime(c.due) : "";
    const labels  = (c.labels  || []).filter(l => l.name).map(l => l.name).join("; ");
    const status  = c.dueComplete ? "Done"
                  : (c.due && new Date(c.due) < now) ? "Overdue" : "Active";
    return [c.name, c.boardName, c.listName, owner, dueDate, labels, status].map(csvCell).join(",");
  });

  const csv      = [headers.join(","), ...dataRows].join("\n");
  const filename = `trisilar-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
  const blob     = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast(`Exported ${rows.length} tasks ✓`);
}

// ── P8-2: Inline rename helper ────────────────────────────────────────────────
function startInlineRename(titleEl, card) {
  if (titleEl.querySelector(".inline-edit-input")) return; // already editing

  // Preserve label chips HTML
  const labelChipsEl  = titleEl.querySelector(".task-label-chips");
  const labelChipsHTML = labelChipsEl ? labelChipsEl.outerHTML : "";

  const input = document.createElement("input");
  input.type      = "text";
  input.className = "inline-edit-input";
  input.value     = card.name;

  titleEl.innerHTML = "";
  titleEl.appendChild(input);
  if (labelChipsHTML) titleEl.insertAdjacentHTML("beforeend", labelChipsHTML);
  input.focus();
  input.select();

  let committed = false;

  function restore() { titleEl.innerHTML = esc(card.name) + labelChipsHTML; }

  async function commit() {
    if (committed) return;
    committed = true;
    const newName = input.value.trim();
    if (!newName || newName === card.name) { restore(); return; }
    try {
      await api.put(`/api/cards/${card.id}`, { name: newName });
      S.allCardsCache = null;
      toast("Renamed ✓");
      await refreshCurrentView();
    } catch (err) {
      toast("Error: " + err.message, true);
      restore();
    }
  }

  input.addEventListener("keydown", e => {
    if (e.key === "Enter")  { e.preventDefault(); commit(); }
    if (e.key === "Escape") { committed = true; restore(); }
  });
  input.addEventListener("blur", () => { if (!committed) commit(); });
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

// V0.2-W2-06 Weekly Focus polish implemented by Codex Dev.
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
    if (!isTrelloVerified()) {
      content.innerHTML = trelloRouteUnavailableHtml("Weekly Focus");
      return;
    }
    const [sessions] = await Promise.all([
      api.get("/api/reviews").catch(() => []),
    ]);
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    if (S.mode !== "focus") return;
    const pendingCount = sessions.reduce((n, s) => n + (s.tasks || []).filter(t => t.status === "pending").length, 0);

    // Update sidebar badge
    const badge = $("focus-pending-badge");
    if (badge) {
      badge.textContent = pendingCount || "";
      badge.style.display = pendingCount ? "" : "none";
    }

    renderWeeklyFocusPage(getAllowedCards(), sessions);
  } catch (e) {
    if (S.mode !== "focus") return;
    content.innerHTML = trelloRouteUnavailableHtml("Weekly Focus");
  }
}

function renderWeeklyFocusPage(allCards, reviewSessions = []) {
  const content = $("board-content");
  const reviewProposals = normalizeFocusReviewProposals(reviewSessions);
  const pendingCount = reviewProposals.length;
  const now = new Date();
  const weekOffset = Number(S.focusWeekOffset || 0);
  const weekAnchor = new Date(now);
  weekAnchor.setDate(weekAnchor.getDate() + weekOffset * 7);
  const weekStart = new Date(weekAnchor);
  const daysSinceMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - daysSinceMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const focusMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Collect unique members
  const allMembers = [];
  const seenMembers = new Set();
  allCards.forEach(c => {
    (c.members || []).forEach(m => {
      if (m.id && !seenMembers.has(m.id)) { seenMembers.add(m.id); allMembers.push(m); }
    });
  });
  let focusSource = "all";
  let focusStatus = "all";

  function labelText(card) {
    return (card.labels || []).map(l => l.name || "").join(" ");
  }

  function customFieldText(card) {
    return Object.entries(card.customFields || {}).map(([k, v]) => `${k} ${v ?? ""}`).join(" ");
  }

  function cardText(card) {
    return `${card.name || ""} ${card.desc || ""} ${card.listName || ""} ${labelText(card)} ${customFieldText(card)}`;
  }

  function hasSignal(card, re) {
    return re.test(cardText(card));
  }

  function dueTs(card) {
    return card.due ? new Date(card.due).getTime() : Infinity;
  }

  function isDueSoon(card) {
    if (!card.due) return false;
    const due = new Date(card.due);
    const soon = new Date(now);
    soon.setDate(soon.getDate() + 2);
    return due <= soon;
  }

  function isPriority(card) {
    return hasSignal(card, /\b(p0|p1|urgent|high|critical|priority)\b/i);
  }

  function isAiWork(card) {
    return hasSignal(card, /\b(ai|agent|codex|claude|gemini|automation|pending review)\b/i);
  }

  function isBlocked(card) {
    return hasSignal(card, /\b(blocked|blocking|waiting|wait|hold|stuck)\b/i);
  }

  function filterOwner(cards) {
    if (!S.focusOwner) return cards;
    return cards.filter(c => (c.members || []).some(m => m.id === S.focusOwner));
  }

  function sourceKind(card) {
    return isAiWork(card) ? "ai" : "trello";
  }

  function sourceLabel(card) {
    return sourceKind(card) === "ai" ? "AI / agent" : "Trello";
  }

  function statusKind(card) {
    if (card.dueComplete) return "done";
    if (isBlocked(card)) return "blocked";
    if (isAiWork(card)) return "review-ai";
    if (isPriority(card) || isDueSoon(card)) return "do-now";
    if (card.due) return "schedule";
    return "unscheduled";
  }

  function statusLabel(card) {
    const labels = {
      "do-now": "Do Now",
      "review-ai": "Review handoff",
      blocked: "Blocked",
      schedule: "Scheduled",
      done: "Done",
      unscheduled: "Unscheduled",
    };
    return labels[statusKind(card)] || "Active";
  }

  function normalizeFocusReviewProposals(sessions = []) {
    return (Array.isArray(sessions) ? sessions : []).flatMap(session =>
      (session.tasks || [])
        .filter(task => task.status === "pending")
        .map((task, index) => ({
          id: `review-${session.id || "session"}-${task.id || task.externalTaskId || index}`,
          kind: "review",
          name: task.title || task.name || "Untitled proposal",
          diffStatus: task.diffStatus || task.diff || "create_new",
          confidence: Number(task.confidence ?? task.confidenceScore ?? 0.86),
          risk: task.risk || task.riskLevel || task.sideEffectRisk || "low",
          target: [task.targetBoardName || task.boardName, task.targetListName || task.listName].filter(Boolean).join(" · ") || "Review Queue",
          sessionTitle: session.title || session.id || "AI review session",
        }))
    );
  }

  function filterReviewProposals(items) {
    if (focusSource === "trello") return [];
    if (!["all", "review-ai"].includes(focusStatus)) return [];
    return items;
  }

  function applyFocusFilters(cards) {
    let result = filterOwner(cards);
    if (focusSource !== "all") result = result.filter(c => sourceKind(c) === focusSource);
    if (focusStatus !== "all") result = result.filter(c => statusKind(c) === focusStatus);
    return result;
  }

  function sortFocus(cards) {
    return [...cards].sort((a, b) => {
      const pa = isPriority(a) ? 0 : 1;
      const pb = isPriority(b) ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return dueTs(a) - dueTs(b);
    });
  }

  function buildLanes(cards) {
    const active = applyFocusFilters(cards.filter(c => !c.dueComplete));
    const blocked = active.filter(isBlocked);
    const blockedIds = new Set(blocked.map(card => card.id));
    const reviewAi = filterReviewProposals(reviewProposals);
    const doNow = active.filter(c =>
      !blockedIds.has(c.id) &&
      (isPriority(c) || isDueSoon(c))
    );
    const doNowIds = new Set(doNow.map(card => card.id));
    const schedule = active.filter(c =>
      c.due &&
      new Date(c.due) > now &&
      new Date(c.due) <= weekEnd &&
      !doNowIds.has(c.id) &&
      !blockedIds.has(c.id)
    );
    return [
      { key: "do-now", label: "Do Now", hint: "P0/P1, urgent, overdue, or due in 48h", cards: sortFocus(doNow) },
      { key: "review-ai", label: "Review AI", hint: "Pending Review Queue proposals", cards: sortFocus(reviewAi), showReviewAction: true },
      { key: "waiting", label: "Waiting / Blocked", hint: "Blocked, waiting, held, or stuck work", cards: sortFocus(blocked) },
      { key: "schedule", label: "Schedule", hint: "Active work due in the next 7 days", cards: sortFocus(schedule) },
    ];
  }

  function cardMeta(card) {
    const bits = [`<span class="focus-task-board">${esc(card.boardName)}</span>`];
    if (card.listName) bits.push(`<span class="focus-meta-dot">&middot;</span><span>${esc(card.listName)}</span>`);
    bits.push('<span class="focus-meta-dot">&middot;</span>');
    if (card.due) bits.push(focusDuePill(card.due, card.dueComplete));
    else bits.push('<span class="focus-muted">No due</span>');
    return bits.join("");
  }

  function focusDuePill(due, complete) {
    const d = new Date(due);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const days = Math.round((dueDay - today) / 86400000);
    const time = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    const tone = complete ? "done" : days < 0 ? "over" : days <= 1 ? "soon" : "ok";
    const text = complete ? `Done ${time}`
      : days === 0 ? `${time} today`
        : days === 1 ? `${time} tomorrow`
          : days < 0 ? `${Math.abs(days)}d overdue`
            : days <= 7 ? `in ${days}d`
              : formatThaiDateTime(due, false);
    return `<span class="focus-due is-${tone}">${esc(text)}</span>`;
  }

  function labelDots(card, limit = 4) {
    const labels = (card.labels || []).filter(l => l.name);
    const visible = labels.slice(0, limit);
    const hidden = Math.max(0, labels.length - visible.length);
    return [
      ...visible.map(l => `<span class="focus-label-dot" title="${esc(l.name)}" style="background:${labelColor(l.color)}"></span>`),
      hidden ? `<span class="focus-label-more">+${hidden}</span>` : "",
    ].join("");
  }

  function renderFocusLaneCard(card) {
    const labels = labelDots(card);
    return `
      <div class="focus-task-row lane-item" data-card-id="${esc(card.id)}">
        <div class="focus-task-name lt">${esc(card.name)}</div>
        <div class="focus-task-meta lm">${cardMeta(card)}</div>
        ${labels ? `<div class="focus-task-meta lm focus-label-row">${labels}</div>` : ""}
      </div>
    `;
  }

  function reviewDiffLabel(kind) {
    const labels = {
      create_new: "Create new",
      update_existing: "Update",
      move_card: "Move",
      no_change: "No change",
    };
    return labels[kind] || String(kind || "Proposal").replace(/[_-]+/g, " ");
  }

  function reviewRiskLabel(level) {
    return String(level || "low").replace(/_/g, " ").toUpperCase();
  }

  function renderFocusReviewCard(item) {
    const confidence = Math.max(0, Math.min(100, Math.round((item.confidence || 0) * 100)));
    return `
      <div class="focus-review-row lane-item" data-review-proposal="${esc(item.id)}">
        <div class="focus-task-name lt">${esc(item.name)}</div>
        <div class="focus-task-meta lm">
          <span class="focus-diff-badge">${esc(reviewDiffLabel(item.diffStatus))}</span>
        </div>
        <div class="focus-task-meta lm">
          <span class="focus-confidence">Conf ${confidence}%</span>
          <span class="focus-risk is-${esc(String(item.risk || "low").toLowerCase())}">${esc(reviewRiskLabel(item.risk))}</span>
        </div>
      </div>
    `;
  }

  function ownerLoadStats(cards) {
    const counts = new Map();
    cards.filter(c => !c.dueComplete).forEach(card => {
      (card.members || []).forEach(member => {
        if (!member.id) return;
        const current = counts.get(member.id) || { member, count: 0, blocked: 0 };
        current.count += 1;
        if (isBlocked(card)) current.blocked += 1;
        counts.set(member.id, current);
      });
    });
    const overloaded = [...counts.values()].filter(item => item.count >= 4 || item.blocked >= 2);
    return { counts, overloaded };
  }

  function filterButtonHtml(type, value, label, active) {
    return `<button type="button" class="filter-chip focus-filter-chip ${active ? "active" : ""}" data-filter-type="${type}" data-filter-value="${value}">${label}</button>`;
  }

  function focusSourceLabel() {
    if (focusSource === "trello") return "Trello";
    if (focusSource === "ai") return "AI / agent";
    return "All sources";
  }

  function focusStatusLabel() {
    const labels = {
      all: "All status",
      "do-now": "Do Now",
      "review-ai": "Review",
      blocked: "Blocked",
      schedule: "Scheduled",
      done: "Done",
    };
    return labels[focusStatus] || "All status";
  }

  function render() {
    const lanes = buildLanes(allCards);
    const activeCards = applyFocusFilters(allCards.filter(c => !c.dueComplete));
    const doNowCount = lanes.find(l => l.key === "do-now")?.cards.length || 0;
    const reviewAiCount = lanes.find(l => l.key === "review-ai")?.cards.length || 0;
    const blockedCount = lanes.find(l => l.key === "waiting")?.cards.length || 0;
    const doneCount = applyFocusFilters(allCards.filter(c =>
      c.dueComplete &&
      c.due &&
      new Date(c.due) >= weekStart &&
      new Date(c.due) <= weekEnd
    )).length;
    const { counts: ownerCounts, overloaded } = ownerLoadStats(allCards);

    const ownerOpts = allMembers.map(m =>
      `<option value="${esc(m.id)}"${S.focusOwner === m.id ? " selected" : ""}>${esc(m.fullName || m.username || m.id)}</option>`
    ).join("");

    const weekRange = `Week of ${weekStart.getDate()} - ${weekEnd.getDate()} ${focusMonthNames[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;
    const selectedOwner = S.focusOwner
      ? allMembers.find(m => m.id === S.focusOwner)
      : null;
    const ownerLabel = selectedOwner
      ? selectedOwner.fullName || selectedOwner.username || selectedOwner.id
      : "Everyone";
    const selectedOwnerLoad = S.focusOwner ? ownerCounts.get(S.focusOwner) : null;
    const pendingBadgeHtml = pendingCount
      ? `<span class="focus-pending-badge">${pendingCount} pending review</span>`
      : "";
    const sourceFilters = [
      ["all", "All sources"],
      ["trello", "Trello"],
      ["ai", "AI / agent"],
    ].map(([value, label]) => filterButtonHtml("source", value, label, focusSource === value)).join("");
    const statusFilters = [
      ["all", "All status"],
      ["do-now", "Do Now"],
      ["review-ai", "Review"],
      ["blocked", "Blocked"],
      ["schedule", "Scheduled"],
    ].map(([value, label]) => filterButtonHtml("status", value, label, focusStatus === value)).join("");

    const laneHtml = lanes.map(({ key, label, hint, cards, showReviewAction }) => {
      const visibleCards = cards.slice(0, 3);
      const hiddenCount = Math.max(0, cards.length - visibleCards.length);
      const laneTone = key === "do-now" ? "do"
        : key === "review-ai" ? "review"
          : key === "waiting" ? "blocked"
            : "schedule";
      return `
        <div class="focus-day-group panel lane is-${key}" ${key === "review-ai" ? 'data-uiv2="review-ai-lane"' : key === "waiting" ? 'data-uiv2="blocked-lane"' : ""}>
          <div class="focus-day-header lane-head">
            <span class="focus-day-label lane-name ${laneTone}"><span class="pip"></span>${esc(label)}</span>
            <span class="focus-day-count lane-count">${cards.length}</span>
          </div>
          <div class="focus-lane-hint">${esc(hint)}</div>
          <div class="lane-body">
            ${key === "review-ai" ? `
              <div class="focus-review-explainer" data-uiv2="review-ai-explainer">
                <strong>Review Queue only.</strong>
                <span>Use this lane to plan AI-originated proposals; approve, reject, hold, or edit in Review Queue before any Trello execution.</span>
              </div>` : ""}
            ${visibleCards.map(c => c.kind === "review" ? renderFocusReviewCard(c) : renderFocusLaneCard(c)).join("")}
            ${showReviewAction ? `<button class="focus-review-action btn sm ghost" type="button" data-action="review">Open queue ${icon("arrowR", "width=\"11\" height=\"11\"")}</button>` : ""}
            ${hiddenCount ? `<div class="focus-lane-more">+${hiddenCount} more in this lane</div>` : ""}
            ${!cards.length ? `<div class="focus-lane-empty">${key === "review-ai" ? "No pending Review Queue proposals." : "No matching work. Adjust owner, source, or status filters if this lane should contain work."}</div>` : ""}
          </div>
        </div>`;
    }).join("");

    const emptyHtml = !activeCards.length && !doneCount && !pendingCount
      ? `<div class="empty-state" style="padding:48px">
          <div class="empty-icon">${icon("calendar")}</div>
          <h3>No weekly focus work</h3>
          <p>${S.focusOwner || focusSource !== "all" || focusStatus !== "all" ? "No work matches the current owner, source, or status filters." : "No active work or pending review items found."}</p>
        </div>`
      : "";

    content.innerHTML = `
      <div class="focus-wrap focus-page">
        ${uiRouteBar({
          title: esc(weekRange),
          sub: `<span>Prioritized from due dates, labels, review status, and blocked signals.</span><span>&middot;</span><span>owner: ${esc(ownerLabel)}</span>`,
          actions: `<button class="btn sm" type="button" data-action="owner-filter" aria-label="Focus Weekly Focus owner filter" title="Focus the owner filter, or explain when no owner filter is available.">${icon("filter")} Owner</button><button class="btn ai sm" type="button" data-action="review" aria-label="Open Review Queue from Weekly Focus" title="Open Review Queue for pending AI or review work.">Open Review Queue &middot; ${pendingCount}${icon("arrowR")}</button>`,
        })}
        ${uiStatStrip([
          { label: "Do Now", value: doNowCount, detail: "due / overdue", tone: "warn" },
          { label: "Review AI", value: reviewAiCount, detail: `${pendingCount} pending`, tone: "ai" },
          { label: "Blocked", value: blockedCount, detail: "needs owner action", tone: "over" },
          { label: "Done", value: doneCount, detail: "this week", tone: "ok" },
        ])}
        <section class="focus-command-panel">
          <div class="focus-command-copy">
            <div class="focus-kicker">Weekly operating view</div>
            <h2 class="focus-command-title">Weekly Focus</h2>
            <p class="focus-command-subtitle">${esc(weekRange)}. Prioritized from due dates, labels, review status, and blocked signals.</p>
          </div>
          <div class="focus-command-stats">
            <div class="focus-stat"><span class="focus-stat-num">${doNowCount}</span><span class="focus-stat-label">Do Now</span></div>
            <div class="focus-stat"><span class="focus-stat-num" style="color:var(--warning)">${reviewAiCount}</span><span class="focus-stat-label">AI / Agent</span></div>
            <div class="focus-stat"><span class="focus-stat-num" style="color:var(--purple,#8b5cf6)">${pendingCount}</span><span class="focus-stat-label">Pending review</span></div>
            <div class="focus-stat"><span class="focus-stat-num" style="color:var(--danger)">${blockedCount}</span><span class="focus-stat-label">Blocked</span></div>
            <div class="focus-stat"><span class="focus-stat-num" style="color:var(--success)">${doneCount}</span><span class="focus-stat-label">Done this week</span></div>
          </div>
        </section>
        <div class="focus-signal-strip" aria-label="Weekly focus safety signals">
          <div class="focus-signal-card ${overloaded.length ? "is-warning" : "is-ok"}">
            <span>Owner load</span>
            <strong>${S.focusOwner && selectedOwnerLoad ? `${selectedOwnerLoad.count} active / ${selectedOwnerLoad.blocked} blocked` : `${overloaded.length} overloaded owner${overloaded.length === 1 ? "" : "s"}`}</strong>
            <p>${overloaded.length ? "Safe next action: rebalance or unblock before adding more work." : "No overload signal from visible assignments."}</p>
          </div>
          <div class="focus-signal-card ${pendingCount ? "is-review" : "is-ok"}">
            <span>Review Queue handoff</span>
            <strong>${pendingCount} pending review</strong>
            <p>${pendingCount ? "AI-originated work must pass Review Queue before execution." : "No pending Review Queue handoff right now."}</p>
          </div>
          <div class="focus-signal-card">
            <span>Filters</span>
            <strong>${focusSourceLabel()} / ${focusStatusLabel()}</strong>
            <p>Owner, source, and status filters keep this weekly view from becoming resource planning.</p>
          </div>
        </div>
        <div class="focus-toolbar">
          ${allMembers.length ? `
            <span class="at-chip-label">Owner:</span>
            <select class="at-select" id="focus-owner-sel" aria-label="Filter Weekly Focus by owner">
              <option value="">Everyone</option>${ownerOpts}
            </select>` : ""}
          <span class="at-chip-label">Source:</span>
          <div class="focus-filter-group">${sourceFilters}</div>
          <span class="at-chip-label">Status:</span>
          <div class="focus-filter-group">${statusFilters}</div>
          <span class="focus-owner-summary">Showing ${esc(ownerLabel)}</span>
          ${pendingBadgeHtml}
        </div>
        <div class="focus-task-list lanes">
          ${laneHtml}${emptyHtml}
        </div>
      </div>`;

    if (typeof setTopbarRouteActions === "function") {
      setTopbarRouteActions(`
        <div class="seg" aria-label="Weekly Focus week range">
          <button type="button" class="${weekOffset === -1 ? "on" : ""}" aria-pressed="${weekOffset === -1}" title="Show the previous weekly focus range." onclick="setWeeklyFocusWeekOffset(-1)">Last week</button>
          <button type="button" class="${weekOffset === 0 ? "on" : ""}" aria-pressed="${weekOffset === 0}" title="Return to the current weekly focus range." onclick="setWeeklyFocusWeekOffset(0)">This week</button>
          <button type="button" class="${weekOffset === 1 ? "on" : ""}" aria-pressed="${weekOffset === 1}" title="Preview next week's focus range." onclick="setWeeklyFocusWeekOffset(1)">Next week</button>
        </div>
      `);
    }

    const sel = $("focus-owner-sel");
    if (sel) sel.onchange = () => { S.focusOwner = sel.value; render(); };
    content.querySelectorAll(".focus-filter-chip").forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.filterType === "source") focusSource = btn.dataset.filterValue || "all";
        if (btn.dataset.filterType === "status") focusStatus = btn.dataset.filterValue || "all";
        render();
      };
    });
    content.querySelectorAll("[data-action='review']").forEach(btn => {
      btn.onclick = () => navigateTo("review");
    });
    content.querySelectorAll("[data-action='owner-filter']").forEach(btn => {
      btn.onclick = () => {
        const ownerSelect = $("focus-owner-sel");
        if (!ownerSelect) {
          toast("No owner filter is available for the current visible work.");
          return;
        }
        ownerSelect.scrollIntoView({ behavior: "smooth", block: "center" });
        ownerSelect.focus();
      };
    });

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
function setWeeklyFocusWeekOffset(offset) {
  S.focusWeekOffset = Number(offset) || 0;
  showWeeklyFocusPage();
}

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
  $("card-start").value = formatISOForInput(card.start);
  $("card-due").value   = formatISOForInput(card.due);
  $("card-reminder").value = card.dueReminder != null ? String(card.dueReminder) : "-1";
  $("delete-card-btn").classList.remove("hidden");
  populateListSelect(listId, lists || S.currentLists);
  $("list-select-group").classList.remove("hidden");
  $("checklist-section").style.display = "";
  $("checklists-container").innerHTML = '<div class="cl-loading">Loading checklist...</div>';
  setupGCalSyncRow(!!card.due);
  showModal();
  loadChecklists(card.id);
}

function openEditAllTasks(card) {
  S.editing = { cardId: card.id, listId: card.idList, boardId: card.boardId, lists: [] };
  $("modal-title").textContent = "Edit Card";
  $("card-name").value = card.name;
  $("card-desc").value = card.desc || "";
  $("card-start").value = formatISOForInput(card.start);
  $("card-due").value   = formatISOForInput(card.due);
  $("card-reminder").value = card.dueReminder != null ? String(card.dueReminder) : "-1";
  $("delete-card-btn").classList.remove("hidden");
  $("list-select-group").classList.add("hidden");
  $("checklist-section").style.display = "";
  $("checklists-container").innerHTML = '<div class="cl-loading">Loading checklist...</div>';
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
  const due = parseInputToUTC(dueInput);
  const listVisible = !$("list-select-group").classList.contains("hidden");
  const targetListId = listVisible ? $("card-list").value : S.editing.listId;

  const btn = $("save-btn");
  btn.textContent = "Saving..."; btn.disabled = true;

  const startInput = $("card-start").value;
  const start = parseInputToUTC(startInput);
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
  else if (S.mode === "calendar") await renderCalendar();
  else if (S.mode === "today")    await showTodayPage();
  else if (S.mode === "review")   await showReviewPage();
  else if (S.mode === "docs")     await showDocsPage();
  else if (S.mode === "planner")  await showPlannerPage();
  else if (S.mode === "okr")      await showOKRPage();
  else if (S.mode === "focus")    await showWeeklyFocusPage();
  else if (S.mode === "settings") showSettingsPage();
  updateOverdueAlerts(); // P8-1: update tab title + session overdue alert
}

function currentRouteFeedbackLabel() {
  const labels = {
    today: "Today",
    review: "Review Queue",
    all: "All Tasks",
    boards: "Boards Monitor",
    calendar: "Calendar",
    planner: "Planner",
    okr: "OKR / Portfolio",
    focus: "Weekly Focus",
    docs: "Docs / AI Trace",
    settings: "Settings",
    board: "Board",
    group: "Group",
  };
  return labels[S.mode] || "Current view";
}

function confirmDelete() {
  S.pendingDeleteId = S.editing.cardId;
  if (typeof openSurface === "function") openSurface($("confirm-modal"));
  else $("confirm-modal").classList.remove("hidden");
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

function showModal() {
  if (typeof openSurface === "function") openSurface($("card-modal"));
  else $("card-modal").classList.remove("hidden");
}
function closeModal() {
  if (typeof closeSurface === "function") closeSurface($("card-modal"), "#topbar-refresh-btn");
  else $("card-modal").classList.add("hidden");
}
function closeConfirm() {
  if (typeof closeSurface === "function") closeSurface($("confirm-modal"), "#delete-card-btn");
  else $("confirm-modal").classList.add("hidden");
}

// ── Checklists ────────────────────────────────────────────────────────────────
async function loadChecklists(cardId) {
  const container = $("checklists-container");
  try {
    const checklists = await api.get(`/api/cards/${cardId}/checklists`);
    renderChecklists(cardId, checklists);
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);font-size:12px">${icon("alert")} ${esc(e.message)}</p>`;
  }
}

function renderChecklists(cardId, checklists) {
  const container = $("checklists-container");
  container.innerHTML = "";
  if (!checklists.length) {
    container.innerHTML = '<div class="cl-empty">No checklists</div>';
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
        <span class="cl-name" title="${esc(cl.name)}">${icon("checkSquare")} <span>${esc(cl.name)}</span></span>
        <span class="cl-progress-text" aria-label="${done} of ${total} checklist items complete">${done}/${total}</span>
        <button class="cl-del-btn" type="button" title="Delete checklist" aria-label="Delete checklist: ${esc(cl.name)}" data-clid="${cl.id}">${icon("trash")}</button>
      </div>
      <div class="cl-progress-bar"><div class="cl-progress-fill" style="width:${pct}%"></div></div>
      <ul class="cl-items">
        ${cl.checkItems.sort((a,b) => a.pos - b.pos).map(item => `
          <li class="cl-item${item.state === "complete" ? " done" : ""}" data-itemid="${item.id}" data-clid="${cl.id}">
            <label class="cl-checkline">
              <input type="checkbox" class="cl-checkbox" ${item.state === "complete" ? "checked" : ""}
                aria-label="${item.state === "complete" ? "Mark incomplete" : "Mark complete"}: ${esc(item.name)}"
                data-cardid="${cardId}" data-clid="${cl.id}" data-itemid="${item.id}">
              <span class="cl-item-name">${esc(item.name)}</span>
            </label>
            <button class="cl-item-del" type="button" title="Delete checklist item" aria-label="Delete checklist item: ${esc(item.name)}" data-clid="${cl.id}" data-itemid="${item.id}">${icon("x")}</button>
          </li>
        `).join("")}
      </ul>
      <div class="cl-add-item">
        <input type="text" class="cl-add-input form-input" placeholder="Add an item..." aria-label="Add checklist item to ${esc(cl.name)}" data-clid="${cl.id}">
        <button class="btn btn-ghost btn-sm cl-add-btn" type="button" data-clid="${cl.id}" data-cardid="${cardId}">Add</button>
      </div>
    `;
    if (typeof ensureButtonTypes === "function") ensureButtonTypes(section);

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
  if (typeof openSurface === "function") openSurface($("manage-modal"));
  else $("manage-modal").classList.remove("hidden");
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
            <span class="ws-name">${icon("building")} ${esc(ws.displayName || ws.name)}</span>
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
      allBtn.type = "button";
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
    container.innerHTML = `<p style="color:var(--danger)">${icon("alert")} ${esc(e.message)}</p>`;
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

function closeManage() {
  if (typeof closeSurface === "function") closeSurface($("manage-modal"), "#topbar-refresh-btn");
  else $("manage-modal").classList.add("hidden");
  S.draftConfig = null;
}

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
        <button class="group-del-btn" type="button" data-gi="${gi}" title="Delete group">${icon("trash")}</button>
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
      <button class="vis-toggle${isHidden ? " hidden-toggle" : ""}" type="button" data-bid="${board.id}">
        ${isHidden ? `${icon("eyeOff")} Hidden` : `${icon("eye")} Visible`}
      </button>
    `;
    row.querySelector(".vis-toggle").onclick = function() {
      const bid = this.dataset.bid;
      const idx = S.draftConfig.hiddenBoards.indexOf(bid);
      if (idx === -1) {
        S.draftConfig.hiddenBoards.push(bid);
        this.innerHTML = `${icon("eyeOff")} Hidden`;
        this.classList.add("hidden-toggle");
        S.draftConfig.groups.forEach(g => {
          const bi = g.boardIds.indexOf(bid);
          if (bi !== -1) g.boardIds.splice(bi, 1);
        });
      } else {
        S.draftConfig.hiddenBoards.splice(idx, 1);
        this.innerHTML = `${icon("eye")} Visible`;
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
  const btn = $("topbar-refresh-btn");
  const routeLabel = currentRouteFeedbackLabel();
  const scopeName = typeof scopeLabel === "function" ? scopeLabel() : "All BUs";
  if (btn) {
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.setAttribute("aria-label", `Refreshing ${routeLabel}`);
    btn.setAttribute("title", `Refreshing ${routeLabel}`);
  }
  try {
    S.allCardsCache = null;
    await api.post("/api/cache/clear").catch(() => {}); // B16: bypass server TTL on manual refresh
    const [boards] = await Promise.all([api.get("/api/boards").catch(() => S.boards)]);
    S.boards = boards;
    renderSidebar();
    await refreshCurrentView();
    if (typeof updateIntegrationStatusbar === "function") updateIntegrationStatusbar();
    const syncText = $("statusbar-sync")?.textContent?.trim();
    toast(`${routeLabel} refreshed · Scope: ${scopeName}${syncText ? ` · last sync ${syncText}` : ""}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("is-loading");
      btn.setAttribute("aria-label", "Refresh current view");
      btn.setAttribute("title", "Refresh current view");
    }
  }
}

// ── Toggle hidden boards ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = $("toggle-hidden-btn");
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      const ul = $("hidden-boards-list");
      const visible = ul.style.display !== "none";
      ul.style.display = visible ? "none" : "block";
      toggleBtn.innerHTML = `${visible ? icon("eye") : icon("eyeOff")} ${visible ? "Show" : "Hide"} hidden boards (<span id="hidden-count">${$("hidden-count").textContent}</span>)`;
    };
  }
});

// ── P8-1: Overdue alert & tab title ──────────────────────────────────────────
function updateOverdueAlerts() {
  const now = new Date();
  const cards = getAllowedCards();
  if (!cards.length) return;
  const overdueCount = cards.filter(c => c.due && new Date(c.due) < now && !c.dueComplete).length;
  // Update tab title
  document.title = overdueCount > 0 ? `(${overdueCount}) Trisilar Task Hub` : "Trisilar Task Hub";
  // Show once-per-session alert when overdue > 3
  if (overdueCount > 3 && !S.overdueToastShown) {
    S.overdueToastShown = true;
    showOverdueAlert(overdueCount);
  }
}

function showOverdueAlert(count) {
  const el = $("overdue-alert");
  el.innerHTML = `
    <span class="overdue-alert-icon">${icon("alert")}</span>
    <div class="overdue-alert-body">
      <div class="overdue-alert-title">${count} tasks overdue</div>
      <div class="overdue-alert-msg">มี tasks ที่เกินกำหนดเกิน 3 วัน</div>
    </div>
    <button class="overdue-alert-close" type="button" onclick="dismissOverdueAlert()" title="Close" aria-label="Close overdue alert">${icon("x")}</button>
  `;
  el.classList.remove("hidden");
  // click away (outside the alert) also dismisses
  setTimeout(() => document.addEventListener("click", _overdueClickAway), 120);
}

function _overdueClickAway(e) {
  if (!$("overdue-alert").contains(e.target)) dismissOverdueAlert();
}

function dismissOverdueAlert() {
  $("overdue-alert").classList.add("hidden");
  document.removeEventListener("click", _overdueClickAway);
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
  if (e.key === "Escape") {
    closeModal();
    closeConfirm();
    closeManage();
    closeCalSetup();
    closeCalModal();
    if (typeof closeReviewTaskDrawer === "function") closeReviewTaskDrawer();
    if (typeof closeDocsDetailDrawer === "function") closeDocsDetailDrawer();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (!$("card-modal").classList.contains("hidden"))      saveCard();
    if (!$("cal-event-modal").classList.contains("hidden")) saveCalEvent();
  }
});

window.addEventListener("message", e => {
  if (e.origin !== window.location.origin) return;
  if (e.data === "cal_connected") {
    CAL.status = { connected: true };
    if (typeof updateGcalSidebarStatus === "function") updateGcalSidebarStatus(true);
    toast("Google Calendar connected ✓");
    if (typeof updateIntegrationStatusbar === "function") updateIntegrationStatusbar();
    navigateTo("calendar");
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
init();
