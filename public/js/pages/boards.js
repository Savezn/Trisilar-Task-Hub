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
    const healthResults = [];
    for (const b of visibleBoards) {
      healthResults.push(await api.get(`/api/boards/${b.id}/health`).catch(() => ({ ok: true, missing: [] })));
      await new Promise(r => setTimeout(r, 100)); // 100ms delay between requests
    }
    const healthMap = new Map(visibleBoards.map((b, i) => [b.id, healthResults[i]]));
    renderBoardsMonitor(getAllowedCards(), healthMap);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

// P9-4: map Trello label color name → hex for label dots
function labelColorHex(color) {
  const MAP = {
    green:"#61bd4f", yellow:"#f2d600", orange:"#ff9f1a", red:"#eb5a46",
    purple:"#c377e0", blue:"#0079bf", sky:"#00c2e0", lime:"#51e898",
    pink:"#ff78cb", black:"#344563"
  };
  return MAP[color] || color || "#94a3b8";
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

  // P9-4: collect all unique labels from visible cards
  const allLabelMap = new Map(); // name → color
  allCards.forEach(c => {
    (c.labels || []).forEach(l => {
      if (l.name && !allLabelMap.has(l.name)) allLabelMap.set(l.name, l.color || "");
    });
  });
  const allLabels = [...allLabelMap.entries()]; // [[name, color], ...]

  // P9-4: helper — filter a board's cards by hidden labels
  function visibleCards(boardCards) {
    if (!S.bmHiddenLabels.size) return boardCards;
    return boardCards.filter(c => {
      const names = (c.labels || []).map(l => l.name).filter(Boolean);
      if (!names.length) return true; // no-label cards always shown
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

  const page = document.createElement("div");
  page.className = "boards-monitor-page";

  // Toolbar with sort and group-by
  const toolbar = document.createElement("div");
  toolbar.className = "boards-monitor-toolbar";
  toolbar.innerHTML = `
    <div class="bm-toolbar-group">
      <span class="sort-label">View</span>
      <button class="filter-chip${S.bmGroupBy === "boards" ? " active" : ""}" data-view="boards">Boards</button>
      <button class="filter-chip${S.bmGroupBy === "teams" ? " active" : ""}" data-view="teams">Teams</button>
    </div>
    ${S.bmGroupBy === "teams" ? `
    <div class="bm-toolbar-group">
      <span class="sort-label">Layout</span>
      <button class="filter-chip${S.bmTeamLayout === "stats" ? " active" : ""}" data-layout="stats">Stats</button>
      <button class="filter-chip${S.bmTeamLayout === "board" ? " active" : ""}" data-layout="board">Board</button>
    </div>
    ` : ""}
    <div class="bm-toolbar-group" id="bm-sort-controls" style="${S.bmGroupBy === "teams" ? "display:none" : ""}">
      <span class="sort-label">Sort by</span>
      <button class="filter-chip active" data-sort="name">Name</button>
      <button class="filter-chip" data-sort="overdue">Most Overdue</button>
      <button class="filter-chip" data-sort="total">Most Cards</button>
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

  toolbar.querySelectorAll("[data-sort]").forEach(btn => {
    btn.onclick = () => {
      const controls = $("bm-sort-controls");
      if (!controls) return;
      controls.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      renderGrid();
    };
  });

  // P9-4: label filter row (only render if there are labels)
  const labelBar = document.createElement("div");
  labelBar.className = "bm-label-bar";
  if (allLabels.length) {
    function renderLabelBar() {
      labelBar.innerHTML = `
        <span class="bm-label-bar-title">Labels</span>
        ${allLabels.map(([name, color]) => {
          const hidden = S.bmHiddenLabels.has(name);
          const dot = color ? `<span class="bm-label-dot" style="background:${labelColorHex(color)}"></span>` : "";
          return `<button class="bm-label-chip${hidden ? " bm-label-hidden" : ""}" data-label="${esc(name)}">${dot}${esc(name)}</button>`;
        }).join("")}
        ${S.bmHiddenLabels.size ? `<button class="bm-label-clear">Show all</button>` : ""}
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

  function sortedStats() {
    const s = [...boardStats];
    if (currentSort === "overdue") s.sort((a, b) => b.overdue.length - a.overdue.length);
    else if (currentSort === "total") s.sort((a, b) => b.cards.length - a.cards.length);
    else s.sort((a, b) => a.board.name.localeCompare(b.board.name));
    return s;
  }

  function renderGrid() {
    grid.innerHTML = "";
    
    if (S.bmGroupBy === "teams") {
      const teams = S.config.monitorTeams || [];
      if (!teams.length) {
        grid.innerHTML = '<div class="empty-state"><h3>No teams defined</h3><p>Configure teams in Settings to use this view.</p></div>';
        return;
      }

      if (S.bmTeamLayout === "board") {
        grid.classList.add("bm-grid-board-mode");

        teams.forEach((teamName, i) => {
          const rawCards = allCards.filter(c => (c.labels || []).some(l => l.name === teamName));
          const cards = visibleCards(rawCards);
          const color = COLORS[i % COLORS.length];

          // B22: derive columns from actual list names of this team's cards
          const columnSet = new Set();
          cards.forEach(c => { if (c.listName) columnSet.add(c.listName); });
          const columns = [...columnSet];

          const teamSection = document.createElement("div");
          teamSection.className = "bm-team-section";
          teamSection.innerHTML = `
            <div class="bm-team-header" style="border-left-color:${color}">
              <span class="bm-team-name">${esc(teamName)}</span>
              <span class="bm-team-count">${cards.length} cards</span>
            </div>
            ${!columns.length ? '<div class="bm-col-empty" style="padding:12px 16px">No cards in this team</div>' : `
            <div class="bm-team-columns">
              ${columns.map(col => {
                const colCards = cards.filter(c => c.listName === col);
                return `
                  <div class="bm-team-col">
                    <div class="bm-col-header">
                      ${esc(col)} <span class="bm-col-count">${colCards.length}</span>
                    </div>
                    <div class="bm-col-cards">
                      ${colCards.map(c => `
                        <div class="bm-mini-card" data-id="${c.id}">
                          <div class="bm-mini-title">${esc(c.name)}</div>
                          <div class="bm-mini-meta">${esc(c.boardName)}</div>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>`}
          `;
          grid.appendChild(teamSection);

          teamSection.querySelectorAll(".bm-mini-card").forEach(el => {
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              const cardId = el.dataset.id;
              // Find the card in the full cards list to ensure we have all metadata
              const card = allCards.find(c => c.id === cardId);
              if (card) {
                openEditAllTasks(card);
              }
            });
          });
        });
        return;
      }

      grid.classList.remove("bm-grid-board-mode");
      teams.forEach((teamName, i) => {
        // Aggregated stats for this team (label) across all boards
        const rawCards = allCards.filter(c => (c.labels || []).some(l => l.name === teamName));
        const cards    = visibleCards(rawCards);
        const active   = cards.filter(c => !c.dueComplete);
        const overdue  = active.filter(c => c.due && new Date(c.due) < now);
        const dueToday = active.filter(c => c.due && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
        const done     = cards.filter(c => c.dueComplete);
        const completionPct = cards.length ? Math.round((done.length / cards.length) * 100) : 0;
        
        const byBoard = {};
        cards.forEach(c => { byBoard[c.boardName] = (byBoard[c.boardName] || 0) + 1; });
        const topBoards = Object.entries(byBoard).sort((a,b) => b[1]-a[1]).slice(0, 5);

        const color = COLORS[i % COLORS.length];
        const card = document.createElement("div");
        card.className = "board-monitor-card team-monitor-card";
        
        const healthClass = completionPct === 0 ? "zero" : overdue.length > 3 ? "crit" : overdue.length > 0 ? "warn" : "";
        const overdueClass = overdue.length > 0 ? " has-issues" : "";
        const todayClass   = dueToday.length > 0 ? " has-issues" : "";

        card.innerHTML = `
          <div class="bm-banner" style="background:${color}"></div>
          <div class="bm-body">
            <div class="bm-card-header">
              <div class="bm-board-icon" style="background:${color}">${teamName[0].toUpperCase()}</div>
              <div class="bm-card-meta">
                <div class="bm-card-title">Team: ${esc(teamName)}</div>
                <div class="bm-card-sub">Aggregated from ${Object.keys(byBoard).length} boards</div>
              </div>
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
                <span>Team Progress</span>
                <span class="bm-health-pct">${done.length} / ${cards.length}</span>
              </div>
              <div class="bm-health-track">
                <div class="bm-health-fill ${healthClass}" style="width:${completionPct}%"></div>
              </div>
            </div>

            ${topBoards.length ? `
            <div class="bm-lists-row">
              <div style="font-size:10px;color:var(--text-faint);margin-bottom:4px;width:100%">TOP BOARDS</div>
              ${topBoards.map(([name, count]) => 
                `<span class="bm-list-chip"><span class="bm-list-count">${count}</span> ${esc(name)}</span>`
              ).join("")}
            </div>` : ""}

            ${overdue.length > 0 ? `
            <div class="bm-alert">⚠ Team has ${overdue.length} overdue tasks</div>
            ` : ""}
          </div>
        `;
        grid.appendChild(card);
      });
      return;
    }

    sortedStats().forEach(({ board, color, health }) => {
      // P9-4: apply label filter before computing stats
      const rawCards = allCards.filter(c => c.boardId === board.id);
      const cards    = visibleCards(rawCards);
      const metaHealth = metadataHealth(cards);
      const active   = cards.filter(c => !c.dueComplete);
      const overdue  = active.filter(c => c.due && new Date(c.due) < now);
      const dueToday = active.filter(c => c.due && new Date(c.due).toDateString() === todayStr && new Date(c.due) >= now);
      const done     = cards.filter(c => c.dueComplete);
      const completionPct = cards.length ? Math.round((done.length / cards.length) * 100) : 0;
      const byList = {};
      cards.forEach(c => { byList[c.listName] = (byList[c.listName] || 0) + 1; });

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
      const hasConventionIssues = !health.ok || metaHealth.issueCards.length > 0;
      const conventionTitle = [
        !health.ok ? `Missing lists: ${health.missing.join(", ")}` : "",
        metaHealth.issueCards.length ? `${metaHealth.issueCards.length} card metadata issue${metaHealth.issueCards.length !== 1 ? "s" : ""}` : "",
      ].filter(Boolean).join(" · ");
      const conventionBadge = hasConventionIssues
        ? `<span class="bm-convention-badge" title="${esc(conventionTitle)}">⚠ Convention</span>`
        : "";
      const firstIssue = metaHealth.issueCards[0];

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
          <div class="bm-alert bm-alert-convention">⚠ Missing lists: ${health.missing.map(s => esc(s)).join(", ")}. Add or map these workflow columns.</div>
          ` : ""}
          ${metaHealth.issueCards.length ? `
          <div class="bm-alert bm-alert-convention bm-alert-hygiene">
            <span>⚠ ${metaHealth.issueCards.length} card${metaHealth.issueCards.length !== 1 ? "s" : ""} missing metadata: ${esc(metadataSummary(metaHealth))}</span>
            ${firstIssue ? `<button class="bm-fix-card-btn" data-card-id="${firstIssue.card.id}" title="Open ${esc(firstIssue.card.name)}">${esc(firstIssue.card.name)}</button>` : ""}
          </div>
          ` : ""}
          ${S.bmHiddenLabels.size && rawCards.length > cards.length ? `
          <div class="bm-label-filter-note">⚗ Filtered · ${rawCards.length - cards.length} card${rawCards.length - cards.length !== 1 ? "s" : ""} hidden by label</div>
          ` : ""}
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
