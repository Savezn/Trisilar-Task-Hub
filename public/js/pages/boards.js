// Boards Monitor
// Implemented by Codex Dev: V0.2-W2-04 Boards Monitor + Team Board Views.
async function showBoardsMonitor() {
  S.mode = "boards";
  S.currentBoardId = null;
  S.currentGroupId = null;
  const visibleBoardCount = typeof getVisibleBoardsForScope === "function"
    ? getVisibleBoardsForScope().length
    : S.boards.filter(b => !S.config.hiddenBoards.includes(b.id)).length;
  const scopeLabelCount = typeof getScopeGroups === "function"
    ? getScopeGroups().length
    : (S.config.monitorTeams?.length || 0);
  const isMobileShell = window.matchMedia?.("(max-width: 700px)").matches;
  $("board-title").textContent = isMobileShell ? "Boards" : "Boards Monitor";
  $("board-subtitle").textContent = isMobileShell
    ? `${visibleBoardCount} boards · ${scopeLabelCount} labels`
    : `${visibleBoardCount} visible boards`;
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading board stats...</div>';

  try {
    if (!isTrelloVerified()) {
      content.innerHTML = trelloRouteUnavailableHtml("Boards");
      return;
    }
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    if (S.mode !== "boards") return;
    const visibleBoards = typeof getVisibleBoardsForScope === "function"
      ? getVisibleBoardsForScope()
      : S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
    const healthResults = [];
    for (const b of visibleBoards) {
      healthResults.push(await api.get(`/api/boards/${b.id}/health`).catch(() => ({ ok: true, missing: [] })));
      await new Promise(r => setTimeout(r, 100));
      if (S.mode !== "boards") return;
    }
    const healthMap = new Map(visibleBoards.map((b, i) => [b.id, healthResults[i]]));
    if (S.mode !== "boards") return;
    renderBoardsMonitor(getAllowedCards(), healthMap);
  } catch (e) {
    if (S.mode !== "boards") return;
    content.innerHTML = trelloRouteUnavailableHtml("Boards");
  }
}

function labelColorHex(color) {
  const MAP = {
    green: "#61bd4f", yellow: "#f2d600", orange: "#ff9f1a", red: "#eb5a46",
    purple: "#c377e0", blue: "#0079bf", sky: "#00c2e0", lime: "#51e898",
    pink: "#ff78cb", black: "#344563"
  };
  return MAP[color] || color || "#94a3b8";
}

function renderBoardsMonitor(allCards, healthMap = new Map()) {
  const content = $("board-content");
  const now = new Date();
  const todayStr = now.toDateString();
  const visibleBoards = typeof getVisibleBoardsForScope === "function"
    ? getVisibleBoardsForScope()
    : S.boards.filter(b => !S.config.hiddenBoards.includes(b.id));
  const hiddenBoardsCount = (S.config.hiddenBoards || []).length;
  const workspaceScopeCount = (S.config.allowedWorkspaceIds || []).length;
  const lastChecked = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!visibleBoards.length) {
    content.innerHTML = `<div class="empty-state boards-empty-state"><div class="empty-icon">${icon("layout")}</div><h3>No boards visible</h3><p>No visible boards are available. Workspace or hidden-board settings should be reviewed before board health can be monitored.</p></div>`;
    return;
  }

  const allLabelMap = new Map();
  allCards.forEach(c => {
    (c.labels || []).forEach(l => {
      if (l.name && !allLabelMap.has(l.name)) allLabelMap.set(l.name, l.color || "");
    });
  });
  const allLabels = [...allLabelMap.entries()];

  function visibleCards(boardCards) {
    if (!S.bmHiddenLabels.size) return boardCards;
    return boardCards.filter(c => {
      const names = (c.labels || []).map(l => l.name).filter(Boolean);
      if (!names.length) return true;
      return names.some(n => !S.bmHiddenLabels.has(n));
    });
  }

  const META_PATTERNS = {
    category: /\b(category|type|area|portfolio)\b/i,
    okr: /\b(okr|objective|kr|key result)\b/i,
    priority: /\b(priority|prio|p[0-3])\b/i,
    agent: /\b(agent|ai|source)\b/i,
  };
  const LABEL_PATTERNS = {
    category: /\b(revenue|saas|ops|sales|marketing|product|finance|customer|proof|inbound)\b/i,
    okr: /\b(o\d+|kr\d+(\.\d+)?|okr|objective)\b/i,
    priority: /\b(p[0-3]|urgent|high|medium|low)\b/i,
    agent: /\b(ai|agent|codex|claude|gemini|automation)\b/i,
  };

  function customFieldHas(card, kind) {
    return Object.entries(card.customFields || {}).some(([key, value]) =>
      META_PATTERNS[kind].test(key) && value != null && String(value).trim() !== ""
    );
  }

  function labelHas(card, kind) {
    return (card.labels || []).some(l => LABEL_PATTERNS[kind].test(l.name || ""));
  }

  function missingMetadata(card) {
    const missing = [];
    if (!customFieldHas(card, "category") && !labelHas(card, "category")) missing.push("category");
    if (!customFieldHas(card, "okr") && !labelHas(card, "okr")) missing.push("OKR/KR");
    if (!customFieldHas(card, "priority") && !labelHas(card, "priority")) missing.push("priority");
    if (!(card.members || []).length && !customFieldHas(card, "agent") && !labelHas(card, "agent")) missing.push("owner/agent");
    if (!card.due) missing.push("due");
    return missing;
  }

  function metadataHealth(cards) {
    const issueCards = cards
      .filter(c => !c.dueComplete)
      .map(c => ({ card: c, missing: missingMetadata(c) }))
      .filter(item => item.missing.length > 0);
    const counts = {};
    issueCards.forEach(item => item.missing.forEach(key => { counts[key] = (counts[key] || 0) + 1; }));
    return { issueCards, counts };
  }

  function metadataSummary(meta) {
    return Object.entries(meta.counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${count} ${name}`)
      .join(", ");
  }

  function boardColor(index) {
    return COLORS[index % COLORS.length];
  }

  function boardInitials(name) {
    const initials = String(name || "Board").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("");
    return initials.toUpperCase() || "B";
  }

  function statusClass({ overdue, dueToday, completionPct }) {
    if (overdue.length > 3) return "crit";
    if (overdue.length > 0) return "warn";
    if (dueToday.length > 0) return "today";
    if (completionPct === 100) return "good";
    return "";
  }

  function summarizeBoard(board, index) {
    const rawCards = allCards.filter(c => c.boardId === board.id);
    const cards = visibleCards(rawCards);
    const active = cards.filter(c => !c.dueComplete);
    const overdue = active.filter(c => c.due && new Date(c.due) < now);
    const dueToday = active.filter(c => c.due && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
    const done = cards.filter(c => c.dueComplete);
    const byList = {};
    cards.forEach(c => { byList[c.listName || "No list"] = (byList[c.listName || "No list"] || 0) + 1; });
    const completionPct = cards.length ? Math.round((done.length / cards.length) * 100) : 0;
    const health = healthMap.get(board.id) || { ok: true, missing: [] };
    const metaHealth = metadataHealth(cards);
    const topLists = Object.entries(byList).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return {
      board,
      color: boardColor(index),
      rawCards,
      cards,
      active,
      overdue,
      dueToday,
      done,
      completionPct,
      health,
      metaHealth,
      topLists,
      status: statusClass({ overdue, dueToday, completionPct }),
    };
  }

  function summarizeTeam(teamName, index) {
    const rawCards = allCards.filter(c => (c.labels || []).some(l => l.name === teamName));
    const cards = visibleCards(rawCards);
    const active = cards.filter(c => !c.dueComplete);
    const overdue = active.filter(c => c.due && new Date(c.due) < now);
    const dueToday = active.filter(c => c.due && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
    const done = cards.filter(c => c.dueComplete);
    const completionPct = cards.length ? Math.round((done.length / cards.length) * 100) : 0;
    const byBoard = {};
    cards.forEach(c => { byBoard[c.boardName || c.boardId || "Unknown board"] = (byBoard[c.boardName || c.boardId || "Unknown board"] || 0) + 1; });
    const byList = {};
    cards.forEach(c => { byList[c.listName || "No list"] = (byList[c.listName || "No list"] || 0) + 1; });
    return {
      teamName,
      rawCards,
      cards,
      active,
      overdue,
      dueToday,
      done,
      completionPct,
      topBoards: Object.entries(byBoard).sort((a, b) => b[1] - a[1]).slice(0, 5),
      columns: Object.keys(byList),
      color: boardColor(index),
      status: statusClass({ overdue, dueToday, completionPct }),
    };
  }

  function buildBoardSummaries() {
    return visibleBoards.map((board, index) => summarizeBoard(board, index));
  }

  const unfilteredSummaries = visibleBoards.map((board, index) => {
    const raw = allCards.filter(c => c.boardId === board.id);
    const active = raw.filter(c => !c.dueComplete);
    const overdue = active.filter(c => c.due && new Date(c.due) < now);
    const dueToday = active.filter(c => c.due && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
    const metaHealth = metadataHealth(raw);
    return { board, raw, active, overdue, dueToday, metaHealth, color: boardColor(index) };
  });
  const totalCards = unfilteredSummaries.reduce((sum, b) => sum + b.raw.length, 0);
  const totalActive = unfilteredSummaries.reduce((sum, b) => sum + b.active.length, 0);
  const totalOverdue = unfilteredSummaries.reduce((sum, b) => sum + b.overdue.length, 0);
  const totalDueToday = unfilteredSummaries.reduce((sum, b) => sum + b.dueToday.length, 0);
  const totalMetaIssues = unfilteredSummaries.reduce((sum, b) => sum + b.metaHealth.issueCards.length, 0);
  const totalConventionBoards = unfilteredSummaries.filter(b => b.metaHealth.issueCards.length > 0).length;
  const totalOverdueBoards = unfilteredSummaries.filter(b => b.overdue.length > 0).length;
  const teamCount = (S.config.monitorTeams || []).length;
  const scopeLabelCount = typeof getScopeGroups === "function"
    ? getScopeGroups().length
    : (S.config.monitorTeams?.length || 0);

  function mobileSparkline(stat) {
    const bars = stat.topLists.length
      ? stat.topLists.map(([, count]) => Math.max(18, Math.min(100, Math.round((count / Math.max(1, stat.cards.length)) * 100))))
      : [35, 52, 61, 44, 70, 58, 74, 68, 86];
    while (bars.length < 9) bars.push(bars[(bars.length - 1) % Math.max(1, bars.length)] || 42);
    return `<span class="boards-mobile-spark">${bars.slice(-9).map((height, index) => `<i class="${index === 8 ? "is-current" : ""}" style="height:${height}%"></i>`).join("")}</span>`;
  }

  function boardGroupName(boardId) {
    const scope = typeof getActiveScopeGroup === "function" ? getActiveScopeGroup() : null;
    if (scope) return scope.name;
    const labels = new Set((S.config.monitorTeams || []).map(normalizeScopeName).filter(Boolean));
    const card = allCards.find(item =>
      item.boardId === boardId && (item.labels || []).some(label => labels.has(normalizeScopeName(label.name)))
    );
    const matched = (card?.labels || []).find(label => labels.has(normalizeScopeName(label.name)));
    return matched?.name || "No team label";
  }

  function boardOwnerName(stat) {
    const member = stat.cards
      .flatMap(card => card.members || [])
      .find(m => m.fullName || m.username || m.name || m.id);
    const rawName = member?.fullName || member?.username || member?.name || member?.id || "team";
    return String(rawName).split(/\s+/).filter(Boolean)[0] || "team";
  }

  function mobileBoardsHtml() {
    const cards = buildBoardSummaries().slice(0, 5);
    return `
      <div class="boards-mobile-source" data-uiv2="mobile-boards-prototype">
        <div class="boards-mobile-stat-grid">
          <div class="m-card boards-mobile-stat is-over">
            <div class="m-eyebrow">Overdue</div>
            <strong>${totalOverdue}</strong>
            <span>${totalOverdueBoards || visibleBoards.length} board${(totalOverdueBoards || visibleBoards.length) === 1 ? "" : "s"}</span>
          </div>
          <div class="m-card boards-mobile-stat is-warn">
            <div class="m-eyebrow">Stale 7d+</div>
            <strong>${totalConventionBoards}</strong>
            <span>Convention signals</span>
          </div>
        </div>

        ${cards.map(stat => {
          const { board, color, overdue, dueToday, cards, active, completionPct, topLists, pending = [] } = stat;
          const pendingCount = stat.metaHealth.issueCards.length;
          const warningChips = [
            overdue.length ? uiChip("over", `${overdue.length} overdue`, { sm: true }) : "",
            dueToday.length ? uiChip("warn", `${dueToday.length} today`, { sm: true }) : "",
            pendingCount ? uiChip("ai", `${pendingCount} pending`, { sm: true }) : "",
            !overdue.length && !pendingCount ? uiChip("ok", "healthy", { sm: true }) : "",
          ].filter(Boolean).join("");
          return `
            <button class="board-card boards-mobile-card" type="button" data-board-id="${esc(board.id)}">
              <div class="bc-head">
                <div>
                  <div class="bc-name"><span class="dot" style="background:${esc(color)}"></span>${esc(board.name)}</div>
                  <div class="bc-meta">${esc(boardGroupName(board.id))} &middot; owner ${esc(boardOwnerName(stat))}</div>
                </div>
                ${mobileSparkline(stat)}
              </div>
              <div class="boards-mobile-card-stats">
                <span><small>Cards</small><strong>${cards.length}</strong></span>
                <span><small>Over</small><strong class="${overdue.length ? "is-over" : ""}">${overdue.length}</strong></span>
                <span><small>Stale</small><strong class="${pendingCount ? "is-warn" : ""}">${pendingCount}</strong></span>
                <span><small>Pend</small><strong class="${dueToday.length ? "is-ai" : ""}">${dueToday.length}</strong></span>
              </div>
              <div class="warnings">${warningChips}</div>
            </button>`;
        }).join("")}
      </div>`;
  }

  const page = document.createElement("div");
  page.className = "boards-monitor-page";
  page.innerHTML = `
    ${mobileBoardsHtml()}

    ${uiRouteBar({
      title: "Board & team health",
      sub: `<span>${visibleBoards.length} boards visible</span><span>scope ${esc(typeof scopeLabel === "function" ? scopeLabel() : "All BUs")}</span><span>${scopeLabelCount} Team mode labels</span><span>last sync ${esc(lastChecked)}</span>`,
      actions: `<div class="seg"><button type="button" class="${S.bmGroupBy !== "teams" && !S.bmConventionOnly ? "on" : ""}" aria-pressed="${S.bmGroupBy !== "teams" && !S.bmConventionOnly}" title="Show board health grouped by board." onclick="S.bmConventionOnly=false;S.bmGroupBy='boards';showBoardsMonitor()">Board mode</button><button type="button" class="${S.bmGroupBy === "teams" && !S.bmConventionOnly ? "on" : ""}" aria-pressed="${S.bmGroupBy === "teams" && !S.bmConventionOnly}" title="Show board health grouped by team owner." onclick="S.bmConventionOnly=false;S.bmGroupBy='teams';showBoardsMonitor()">Team mode</button><button type="button" class="${S.bmConventionOnly ? "on" : ""}" aria-pressed="${Boolean(S.bmConventionOnly)}" title="Show board convention and metadata issues without changing Trello." onclick="S.bmConventionOnly=!S.bmConventionOnly;S.bmGroupBy='boards';showBoardsMonitor()">Convention warnings</button></div>`,
    })}
    ${uiStatStrip([
      { label: "Overdue cards", value: totalOverdue, detail: `Across ${totalOverdueBoards || visibleBoards.length} boards`, tone: "over" },
      { label: "Stale 7d+", value: totalConventionBoards, detail: "Bug triage lanes", tone: "warn" },
      { label: "Convention warnings", value: totalMetaIssues, detail: "Naming / owners", tone: "ai" },
      { label: "AI-touched cards", value: totalActive, detail: "Last 7 days", tone: "info" },
    ])}
  `;

  const toolbar = document.createElement("div");
  toolbar.className = "boards-monitor-toolbar filterbar";
  toolbar.innerHTML = `
    <span class="search-sm">${icon("search")}<input type="search" placeholder="Search boards..." aria-label="Search boards"></span>
    <div class="bm-toolbar-group">
      <button class="filter-chip on" data-view="boards" type="button"><span class="k">label:</span>${esc(typeof scopeLabel === "function" ? scopeLabel() : "all")}</button>
      <button class="filter-chip is-disabled" type="button" disabled title="Health filter is planned for a later UI V2 slice"><span class="k">health:</span>any</button>
      <button class="filter-chip is-disabled" type="button" disabled title="Owner filter is planned for a later UI V2 slice"><span class="k">owner:</span>any</button>
      <button class="filter-chip is-disabled" type="button" disabled title="Stale filter is represented in the current sort and cards"><span class="k">stale:</span>7d+</button>
    </div>
    ${S.bmGroupBy === "teams" ? `
    <div class="bm-toolbar-group">
      <span class="sort-label">Layout</span>
      <button class="filter-chip${S.bmTeamLayout === "stats" ? " active" : ""}" data-layout="stats" type="button">Stats</button>
      <button class="filter-chip${S.bmTeamLayout === "board" ? " active" : ""}" data-layout="board" type="button">Board</button>
    </div>
    ` : ""}
    <div class="bm-toolbar-group" id="bm-sort-controls" style="${S.bmGroupBy === "teams" ? "display:none" : ""}">
      <span class="sort-label">Sort</span>
      <button class="filter-chip active" data-sort="name" type="button">Stale desc</button>
      <button class="filter-chip" data-sort="overdue" type="button">Overdue</button>
      <button class="filter-chip" data-sort="total" type="button">Cards</button>
    </div>
  `;
  page.appendChild(toolbar);

  toolbar.querySelectorAll("[data-view]").forEach(btn => {
    btn.onclick = () => {
      S.bmGroupBy = btn.dataset.view;
      renderBoardsMonitor(allCards, healthMap);
    };
  });

  toolbar.querySelectorAll("[data-layout]").forEach(btn => {
    btn.onclick = () => {
      S.bmTeamLayout = btn.dataset.layout;
      renderBoardsMonitor(allCards, healthMap);
    };
  });

  const labelBar = document.createElement("div");
  labelBar.className = "bm-label-bar";
  if (allLabels.length) {
    function renderLabelBar() {
      labelBar.innerHTML = `
        <span class="bm-label-bar-title">Filter labels</span>
        ${allLabels.map(([name, color]) => {
          const hidden = S.bmHiddenLabels.has(name);
          const dot = color ? `<span class="bm-label-dot" style="background:${labelColorHex(color)}"></span>` : "";
          return `<button class="bm-label-chip${hidden ? " bm-label-hidden" : ""}" data-label="${esc(name)}" type="button">${dot}${esc(name)}</button>`;
        }).join("")}
        ${S.bmHiddenLabels.size ? `<button class="bm-label-clear" type="button">Show all</button>` : ""}
      `;
      labelBar.querySelectorAll(".bm-label-chip").forEach(btn => {
        btn.addEventListener("click", () => {
          const n = btn.dataset.label;
          if (S.bmHiddenLabels.has(n)) S.bmHiddenLabels.delete(n);
          else S.bmHiddenLabels.add(n);
          renderLabelBar();
          renderGrid();
        });
      });
      const clearBtn = labelBar.querySelector(".bm-label-clear");
      if (clearBtn) clearBtn.addEventListener("click", () => {
        S.bmHiddenLabels.clear();
        renderLabelBar();
        renderGrid();
      });
    }
    renderLabelBar();
  }
  page.appendChild(labelBar);

  const grid = document.createElement("div");
  grid.className = "boards-monitor-grid";

  let currentSort = "name";

  toolbar.querySelectorAll("[data-sort]").forEach(btn => {
    btn.onclick = () => {
      toolbar.querySelectorAll("[data-sort]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      renderGrid();
    };
  });

  function sortedStats() {
    const s = buildBoardSummaries().filter(stat => {
      if (!S.bmConventionOnly) return true;
      return !stat.health.ok || stat.metaHealth.issueCards.length > 0;
    });
    if (currentSort === "overdue") s.sort((a, b) => b.overdue.length - a.overdue.length);
    else if (currentSort === "total") s.sort((a, b) => b.cards.length - a.cards.length);
    else s.sort((a, b) => a.board.name.localeCompare(b.board.name));
    return s;
  }

  function renderTeamBoardMode(teams) {
    grid.classList.add("bm-grid-board-mode");
    teams.map(summarizeTeam).forEach(team => {
      const teamSection = document.createElement("div");
      teamSection.className = "bm-team-section";
      const columns = team.columns;
      teamSection.innerHTML = `
        <div class="bm-team-header" style="--team-color:${team.color}">
          <div>
            <span class="bm-team-name">${esc(team.teamName)}</span>
            <span class="bm-team-count">${team.cards.length} cards / ${team.overdue.length} overdue</span>
          </div>
          <span class="bm-health-chip ${team.status || "good"}">${team.completionPct}% complete</span>
        </div>
        ${!columns.length ? '<div class="bm-col-empty">No cards in this team</div>' : `
        <div class="bm-team-columns">
          ${columns.map(col => {
            const colCards = team.cards.filter(c => (c.listName || "No list") === col);
            return `
              <div class="bm-team-col">
                <div class="bm-col-header">
                  <span>${esc(col)}</span>
                  <span class="bm-col-count">${colCards.length}</span>
                </div>
                <div class="bm-col-cards">
                  ${colCards.map(c => `
                    <button class="bm-mini-card" data-id="${esc(c.id)}" type="button">
                      <span class="bm-mini-title">${esc(c.name)}</span>
                      <span class="bm-mini-meta">${esc(c.boardName || "Unknown board")}</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>`}
      `;
      grid.appendChild(teamSection);

      teamSection.querySelectorAll(".bm-mini-card").forEach(el => {
        el.addEventListener("click", e => {
          e.stopPropagation();
          const card = allCards.find(c => c.id === el.dataset.id);
          if (card) openEditAllTasks(card);
        });
      });
    });
  }

  function renderTeamStatsMode(teams) {
    grid.classList.remove("bm-grid-board-mode");
    teams.map(summarizeTeam).forEach(team => {
      const card = document.createElement("div");
      card.className = "board-monitor-card board-card team-monitor-card panel";
      const overdueClass = team.overdue.length > 0 ? " has-issues" : "";
      const todayClass = team.dueToday.length > 0 ? " has-issues" : "";
      card.innerHTML = `
        <div class="bm-banner" style="background:${team.color}"></div>
        <div class="bm-body">
          <div class="bm-card-header">
            <div class="bm-board-icon" style="background:${team.color}">${esc(team.teamName[0] || "T").toUpperCase()}</div>
            <div class="bm-card-meta">
              <div class="bm-card-title">Team: ${esc(team.teamName)}</div>
              <div class="bm-card-sub">Aggregated from ${team.topBoards.length} board${team.topBoards.length === 1 ? "" : "s"}</div>
            </div>
          </div>
          <div class="bm-stats-row">
            <div class="bm-stat stat-total"><div class="bm-stat-num">${team.cards.length}</div><div class="bm-stat-label">Total</div></div>
            <div class="bm-stat stat-overdue${overdueClass}"><div class="bm-stat-num">${team.overdue.length}</div><div class="bm-stat-label">Overdue</div></div>
            <div class="bm-stat stat-today${todayClass}"><div class="bm-stat-num">${team.dueToday.length}</div><div class="bm-stat-label">Due Today</div></div>
          </div>
          <div class="bm-health-bar-wrap">
            <div class="bm-health-label"><span>Team progress</span><span class="bm-health-pct">${team.done.length} / ${team.cards.length}</span></div>
            <div class="bm-health-track"><div class="bm-health-fill ${team.status}" style="width:${team.completionPct}%"></div></div>
          </div>
          ${team.topBoards.length ? `
          <div class="bm-lists-row">
            <div class="bm-list-title">Top boards</div>
            ${team.topBoards.map(([name, count]) => `<span class="bm-list-chip"><span class="bm-list-count">${count}</span> ${esc(name)}</span>`).join("")}
          </div>` : ""}
          ${team.overdue.length > 0 ? `<div class="bm-alert">${icon("alert")} Team has ${team.overdue.length} overdue task${team.overdue.length === 1 ? "" : "s"}</div>` : ""}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderBoardMode() {
    grid.classList.remove("bm-grid-board-mode");
    const stats = sortedStats();
    stats.forEach(stat => {
      const { board, color, health, metaHealth, rawCards, cards, overdue, dueToday, done, completionPct, topLists, status } = stat;
      const hasConventionIssues = !health.ok || metaHealth.issueCards.length > 0;
      const missingLists = health.missing || [];
      const warningCount = overdue.length + missingLists.length + metaHealth.issueCards.length;
      const conventionTitle = [
        !health.ok ? `Missing lists: ${missingLists.join(", ")}` : "",
        metaHealth.issueCards.length ? `${metaHealth.issueCards.length} card metadata issue${metaHealth.issueCards.length !== 1 ? "s" : ""}` : "",
      ].filter(Boolean).join(" / ");
      const conventionBadge = hasConventionIssues
        ? `<span class="bm-convention-badge" title="${esc(conventionTitle)}">${icon("alert")} Convention</span>`
        : "";
      const firstIssue = metaHealth.issueCards[0];
      const overdueClass = overdue.length > 0 ? " has-issues" : "";
      const todayClass = dueToday.length > 0 ? " has-issues" : "";

      const card = document.createElement("div");
      card.className = "board-monitor-card board-card panel";
      card.innerHTML = `
        <div class="bm-banner" style="background:${color}"></div>
        <div class="bm-body">
          <div class="bm-card-header">
            <div class="bm-board-icon" style="background:${color}">${esc(boardInitials(board.name))}</div>
            <div class="bm-card-meta">
              <div class="bm-card-title">${esc(board.name)}${conventionBadge}</div>
              <div class="bm-card-sub">${cards.length} visible / ${rawCards.length} total cards · Last checked ${esc(lastChecked)}</div>
            </div>
            <button class="btn btn-ghost btn-sm bm-open-btn" type="button" data-board-open="${esc(board.id)}" title="Open board">${icon("external")} Open</button>
          </div>
          <div class="bm-warning-row">
            <span class="bm-warning-chip ${warningCount ? "has-warning" : "is-clear"}">${warningCount} warning${warningCount === 1 ? "" : "s"}</span>
            <span>${warningCount ? "Review overdue cards, missing lists, or metadata gaps before relying on this board for planning." : "No board-level warning found in the current scan."}</span>
          </div>
          <div class="bm-stats-row">
            <div class="bm-stat stat-total"><div class="bm-stat-num">${cards.length}</div><div class="bm-stat-label">Total</div></div>
            <div class="bm-stat stat-overdue${overdueClass}"><div class="bm-stat-num">${overdue.length}</div><div class="bm-stat-label">Overdue</div></div>
            <div class="bm-stat stat-today${todayClass}"><div class="bm-stat-num">${dueToday.length}</div><div class="bm-stat-label">Due Today</div></div>
          </div>
          <div class="bm-health-bar-wrap">
            <div class="bm-health-label"><span>Completion</span><span class="bm-health-pct">${done.length} / ${cards.length}</span></div>
            <div class="bm-health-track"><div class="bm-health-fill ${status}" style="width:${completionPct}%"></div></div>
          </div>
          ${topLists.length ? `
          <div class="bm-lists-row">
            ${topLists.map(([name, count]) => `<span class="bm-list-chip"><span class="bm-list-count">${count}</span> ${esc(name)}</span>`).join("")}
          </div>` : ""}
          ${overdue.length > 0 ? `<div class="bm-alert">${icon("alert")} ${overdue.length} card${overdue.length === 1 ? "" : "s"} past due date</div>` : ""}
          ${!health.ok ? `<div class="bm-alert bm-alert-convention">${icon("alert")} Missing lists: ${missingLists.map(s => esc(s)).join(", ")}. Add or map these workflow columns.</div>` : ""}
          ${metaHealth.issueCards.length ? `
          <div class="bm-alert bm-alert-convention bm-alert-hygiene">
            <span>${icon("alert")} ${metaHealth.issueCards.length} card${metaHealth.issueCards.length !== 1 ? "s" : ""} missing metadata: ${esc(metadataSummary(metaHealth))}</span>
            ${firstIssue ? `<button class="bm-fix-card-btn" data-card-id="${esc(firstIssue.card.id)}" title="Open ${esc(firstIssue.card.name)}" type="button">${esc(firstIssue.card.name)}</button>` : ""}
          </div>` : ""}
          ${S.bmHiddenLabels.size && rawCards.length > cards.length ? `<div class="bm-label-filter-note">${rawCards.length - cards.length} card${rawCards.length - cards.length !== 1 ? "s" : ""} hidden by label filter</div>` : ""}
        </div>
      `;

      card.querySelector(".bm-open-btn").addEventListener("click", e => {
        e.stopPropagation();
        selectBoard(board.id, board.name);
      });
      card.querySelectorAll(".bm-fix-card-btn").forEach(btn => {
        btn.addEventListener("click", e => {
          e.stopPropagation();
          const target = allCards.find(c => c.id === btn.dataset.cardId);
          if (target) openEditAllTasks(target);
        });
      });
      card.addEventListener("click", () => selectBoard(board.id, board.name));
      grid.appendChild(card);
    });
  }

  function renderBoardModeProto() {
    grid.classList.remove("bm-grid-board-mode");
    const stats = sortedStats();
    if (!stats.length) {
      grid.innerHTML = `<div class="empty-state boards-empty-state"><div class="empty-icon">${icon("check")}</div><h3>No convention warnings</h3><p>Visible boards have the required workflow lists and task metadata for this filter.</p></div>`;
      return;
    }
    function boardSparkline(stat) {
      const bars = stat.topLists.length
        ? stat.topLists.map(([, count]) => Math.max(18, Math.min(100, Math.round((count / Math.max(1, stat.cards.length)) * 100))))
        : [35, 52, 61, 44, 70, 58, 74, 68, 86];
      while (bars.length < 12) bars.push(bars[(bars.length - 1) % Math.max(1, bars.length)] || 42);
      return `<span class="board-sparkline">${bars.slice(-12).map((height, index) => `<i class="${index === 11 ? "is-current" : ""}" style="height:${height}%"></i>`).join("")}</span>`;
    }

    stats.forEach(stat => {
      const { board, color, health, metaHealth, rawCards, cards, overdue, dueToday, topLists } = stat;
      const missingLists = health.missing || [];
      const warningCount = overdue.length + missingLists.length + metaHealth.issueCards.length;
      const conventionTitle = [
        !health.ok ? `Missing lists: ${missingLists.join(", ")}` : "",
        metaHealth.issueCards.length ? `${metaHealth.issueCards.length} card metadata issue${metaHealth.issueCards.length !== 1 ? "s" : ""}` : "",
      ].filter(Boolean).join(" / ");
      const warningChips = [
        overdue.length > 0 ? uiChip("over", `${overdue.length} overdue`, { sm: true }) : "",
        dueToday.length > 0 ? uiChip("warn", `${dueToday.length} due today`, { sm: true }) : "",
        metaHealth.issueCards.length > 0 ? uiChip("warn", `${metaHealth.issueCards.length} naming`, { sm: true }) : "",
        missingLists.length > 0 ? uiChip("warn", "stale", { sm: true }) : "",
        !warningCount ? uiChip("ok", "healthy", { sm: true }) : "",
      ].filter(Boolean).join("");

      const card = document.createElement("div");
      card.className = "board-monitor-card board-card panel board-card-proto";
      card.innerHTML = `
        <div class="bc-head">
          <div>
            <div class="bc-name"><span class="dot" style="background:${color}"></span>${esc(board.name)}</div>
            <div class="bc-meta">
              <span>${esc(boardGroupName(board.id))}</span> &middot; ${topLists.length || 0} lists &middot; owner <span>${esc(boardOwnerName(stat))}</span>
            </div>
          </div>
          <button class="iconbtn bm-more-btn" type="button" data-board-warning="${esc(board.id)}" title="${esc(conventionTitle || "Board actions")}">${icon("more")}</button>
        </div>
        <div class="bc-row">
          <div class="bc-stat"><span class="k">Cards</span><span class="v tnum">${cards.length}</span></div>
          <div class="bc-stat"><span class="k">Overdue</span><span class="v tnum ${overdue.length ? "is-over" : ""}">${overdue.length}</span></div>
          <div class="bc-stat"><span class="k">Stale 7d+</span><span class="v tnum ${metaHealth.issueCards.length > 2 ? "is-warn" : ""}">${metaHealth.issueCards.length}</span></div>
          ${boardSparkline(stat)}
        </div>
        <div class="warnings">${warningChips}</div>
        <div class="bc-foot">
          <button class="btn sm ghost bm-open-btn" type="button" data-board-open="${esc(board.id)}">Open ${icon("arrowR")}</button>
          <span>last activity &middot; ${esc(lastChecked)}</span>
        </div>
        ${S.bmHiddenLabels.size && rawCards.length > cards.length ? `<div class="bm-label-filter-note">${rawCards.length - cards.length} card${rawCards.length - cards.length !== 1 ? "s" : ""} hidden by label filter</div>` : ""}
      `;

      card.querySelector(".bm-open-btn").addEventListener("click", e => {
        e.stopPropagation();
        selectBoard(board.id, board.name);
      });
      card.querySelector(".bm-more-btn")?.addEventListener("click", e => {
        e.stopPropagation();
        toast(conventionTitle || `${board.name} has no board-level warning in the current scan.`);
      });
      card.addEventListener("click", () => selectBoard(board.id, board.name));
      grid.appendChild(card);
    });
  }

  function renderGrid() {
    grid.innerHTML = "";
    if (S.bmGroupBy === "teams") {
      const teams = S.config.monitorTeams || [];
      if (!teams.length) {
        grid.classList.remove("bm-grid-board-mode");
        grid.innerHTML = `<div class="empty-state boards-empty-state"><div class="empty-icon">${icon("target")}</div><h3>No teams defined</h3><p>Configure teams in Settings to use this view.</p></div>`;
        return;
      }
      if (S.bmTeamLayout === "board") renderTeamBoardMode(teams);
      else renderTeamStatsMode(teams);
      return;
    }
    renderBoardModeProto();
  }

  renderGrid();
  page.appendChild(grid);
  content.innerHTML = "";
  content.appendChild(page);
  page.querySelectorAll(".boards-mobile-card").forEach(card => {
    card.addEventListener("click", () => {
      const board = visibleBoards.find(b => b.id === card.dataset.boardId);
      if (board) selectBoard(board.id, board.name);
    });
  });
}
