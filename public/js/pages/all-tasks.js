// All Tasks / Tasks Inbox
// Implemented by Codex Dev: V0.2-W2-03 Tasks Inbox + cross-board rows.
async function showAllTasks() {
  S.mode = "all";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "All Tasks";
  $("board-subtitle").textContent = "Cross-board inbox";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading all tasks...</div>';
  try {
    if (!isTrelloVerified()) {
      content.innerHTML = trelloRouteUnavailableHtml("Tasks");
      return;
    }
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    if (S.mode !== "all") return;
    renderAllTasks(getAllowedCards());
  } catch (e) {
    if (S.mode !== "all") return;
    content.innerHTML = trelloRouteUnavailableHtml("Tasks");
  }
}

function renderAllTasks(cards) {
  const content = $("board-content");
  const allCards = Array.isArray(cards) ? cards : [];
  window._allCards = allCards;

  const now = new Date();
  let filter = S.atFilter || "all";
  let search = S.atSearch || "";
  let labelFilter = S.atLabelFilter || "";
  let ownerFilter = S.atOwnerFilter || "";
  let viewMode = ["table", "list", "board", "owner"].includes(S.atViewMode) ? S.atViewMode : "table";
  let groupBy = viewMode === "board" ? "board" : viewMode === "owner" ? "owner" : "none";

  const allLabels = [];
  const allMembers = [];
  const seenLabels = new Set();
  const seenMembers = new Set();
  allCards.forEach(card => {
    (card.labels || []).forEach(label => {
      if (label.name && !seenLabels.has(label.name)) {
        seenLabels.add(label.name);
        allLabels.push(label);
      }
    });
    (card.members || []).forEach(member => {
      if (member.id && !seenMembers.has(member.id)) {
        seenMembers.add(member.id);
        allMembers.push(member);
      }
    });
  });

  function isToday(card) {
    return card.due && !card.dueComplete && new Date(card.due).toDateString() === now.toDateString();
  }

  function isOverdue(card) {
    return card.due && !card.dueComplete && new Date(card.due) < now;
  }

  function isUpcoming(card) {
    if (!card.due || card.dueComplete) return false;
    const due = new Date(card.due);
    const diff = due - now;
    return due > now && due.toDateString() !== now.toDateString() && diff <= 7 * 86400000;
  }

  function statusLabel(card) {
    if (card.dueComplete) return "Done";
    if (isOverdue(card)) return "Overdue";
    if (isToday(card)) return "Today";
    if (isUpcoming(card)) return "Upcoming";
    if (!card.due) return "No due";
    return "Active";
  }

  function statusClass(card) {
    return card.dueComplete ? "is-done"
      : isOverdue(card) ? "is-overdue"
      : isToday(card) ? "is-today"
      : isUpcoming(card) ? "is-upcoming"
      : "is-active";
  }

  function statusTone(card) {
    if (card.dueComplete) return "ok";
    if (isOverdue(card)) return "over";
    if (isToday(card)) return "warn";
    if (isUpcoming(card)) return "info";
    return "muted";
  }

  function taskSourceLabel() {
    return "Source: Trello";
  }

  function taskDecisionContext(card) {
    return `Context: ${[card.boardName || "No board", card.listName || "No list"].filter(Boolean).join(" / ")}`;
  }

  function taskNextActionLabel(card) {
    if (card.dueComplete) return "Next action: reopen if needed";
    if (isOverdue(card)) return "Next action: reschedule or finish";
    if (isToday(card)) return "Next action: do today";
    if (isUpcoming(card)) return "Next action: plan next";
    if (!card.due) return "Next action: prioritize or schedule";
    return "Next action: open task";
  }

  function taskDecisionMeta(card) {
    const nextAction = taskNextActionLabel(card);
    return `
      <span class="task-source-pill">${taskSourceLabel(card)}</span>
      <span class="task-context-label uiv2-meta-text uiv2-text-reveal" title="${esc(taskDecisionContext(card))}">${esc(taskDecisionContext(card))}</span>
      <span class="task-owner-context">Owner: ${esc(ownerText(card) || "Unassigned")}</span>
      <span class="task-next-action uiv2-decision-text uiv2-text-reveal" title="${esc(nextAction)}">${esc(nextAction)}</span>
    `;
  }

  function counts() {
    return {
      all: allCards.length,
      overdue: allCards.filter(isOverdue).length,
      today: allCards.filter(isToday).length,
      upcoming: allCards.filter(isUpcoming).length,
      nodue: allCards.filter(card => !card.due).length,
      done: allCards.filter(card => card.dueComplete).length,
    };
  }

  function getFiltered() {
    const q = search.trim().toLowerCase();
    let result = allCards;
    if (filter === "overdue") result = result.filter(isOverdue);
    else if (filter === "today") result = result.filter(isToday);
    else if (filter === "upcoming") result = result.filter(isUpcoming);
    else if (filter === "nodue") result = result.filter(card => !card.due);
    else if (filter === "done") result = result.filter(card => card.dueComplete);
    if (q) {
      result = result.filter(card => [
        card.name,
        card.boardName,
        card.listName,
        card.desc,
        ...(card.labels || []).map(label => label.name),
        ...(card.members || []).map(member => member.fullName || member.username || member.id),
      ].filter(Boolean).some(value => String(value).toLowerCase().includes(q)));
    }
    if (labelFilter) result = result.filter(card => (card.labels || []).some(label => label.name === labelFilter));
    if (ownerFilter) result = result.filter(card => (card.members || []).some(member => member.id === ownerFilter));
    return result;
  }

  function getSorted(rows) {
    const field = S.atSortField || "due";
    const order = S.atSortOrder || "asc";
    return [...rows].sort((a, b) => {
      let valA, valB;
      if (field === "name") {
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
      } else if (field === "board") {
        valA = (a.boardName || "").toLowerCase();
        valB = (b.boardName || "").toLowerCase();
      } else if (field === "list") {
        valA = (a.listName || "").toLowerCase();
        valB = (b.listName || "").toLowerCase();
      } else if (field === "owner") {
        valA = ownerText(a).toLowerCase();
        valB = ownerText(b).toLowerCase();
      } else if (field === "status") {
        valA = statusLabel(a);
        valB = statusLabel(b);
      } else {
        valA = a.due ? new Date(a.due).getTime() : Infinity;
        valB = b.due ? new Date(b.due).getTime() : Infinity;
      }
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  function ownerText(card) {
    return (card.members || []).map(member => member.fullName || member.username || member.id).join(", ");
  }

  function ownerAvatars(card) {
    const members = card.members || [];
    if (!members.length) return '<span class="task-owner-empty">Unassigned</span>';
    return `<span class="task-avatar-stack" title="${esc(ownerText(card))}">${members.slice(0, 3).map(member => {
      const name = member.fullName || member.username || member.id || "?";
      const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
      return `<span class="task-avatar">${esc(initials || "?")}</span>`;
    }).join("")}${members.length > 3 ? `<span class="task-avatar-more">+${members.length - 3}</span>` : ""}</span>`;
  }

  function labelChips(card) {
    return (card.labels || []).filter(label => label.name).map(label =>
      `<span class="task-label-chip" style="--label-color:${labelColor(label.color)}">${esc(label.name)}</span>`
    ).join("");
  }

  function dueCell(card) {
    if (!card.due) return '<span class="task-due-chip is-empty">No due</span>';
    return `<span class="task-due-chip ${statusClass(card)}">${card.dueComplete ? icon("check") : icon("clock")}${esc(formatThaiDateTime(card.due, false))}</span>`;
  }

  function checklistMeta(card) {
    const checklists = card.checklists || [];
    const total = checklists.reduce((sum, list) => sum + (list.checkItems || []).length, 0);
    if (!total) return "";
    const done = checklists.reduce((sum, list) => sum + (list.checkItems || []).filter(item => item.state === "complete").length, 0);
    return `<span class="task-row-mini">${icon("checkSquare")}${done}/${total}</span>`;
  }

  function boardChip(card) {
    return `<span class="task-board-chip" title="${esc(card.boardName || "No board")}">${esc(card.boardName || "No board")}</span>`;
  }

  function sortGlyph(field) {
    if (S.atSortField !== field) return "";
    return S.atSortOrder === "asc" ? " ↑" : " ↓";
  }

  function sortAria(field) {
    if (S.atSortField !== field) return "none";
    return S.atSortOrder === "asc" ? "ascending" : "descending";
  }

  function sortButtonLabel(field, label) {
    if (S.atSortField !== field) return `Sort by ${label}`;
    const next = S.atSortOrder === "asc" ? "descending" : "ascending";
    return `${label} sorted ${sortAria(field)}. Activate to sort ${next}.`;
  }

  function sortHeader(field, visibleLabel, ariaLabel = visibleLabel) {
    return `<th aria-sort="${sortAria(field)}"><button class="sortable-header" type="button" data-sort="${field}" aria-label="${esc(sortButtonLabel(field, ariaLabel))}">${visibleLabel}${sortGlyph(field)}</button></th>`;
  }

  function buildCardRow(card) {
    const chips = labelChips(card);
    const done = card.dueComplete;
    const checklist = checklistMeta(card).replace(/<[^>]*>/g, "").trim() || "-";
    const title = card.name || "Untitled task";
    const nextAction = taskNextActionLabel(card);
    const boardName = card.boardName || "No board";
    const listName = card.listName || "No list";
    const boardListTitle = `${boardName} - ${listName}`;
    return `
      <tr class="task-row task-inbox-row ${done ? "is-complete" : ""}" data-card-id="${esc(card.id)}" title="${esc(`${title} - ${boardListTitle}`)}">
        <td class="ck">
          <button class="task-check-button tck" type="button" title="${done ? "Mark active" : "Mark done"}" aria-label="${esc(done ? `Mark active: ${title}` : `Mark done: ${title}`)}" data-action="done">
            ${done ? icon("check") : ""}
          </button>
        </td>
        <td class="task-title">
          <div class="task-title-text uiv2-decision-text uiv2-text-reveal" title="${esc(title)}">${esc(title)}</div>
          <div class="task-row-meta">
            ${chips ? `<span class="task-label-chips">${chips}</span>` : ""}
            <span class="task-next-action uiv2-decision-text uiv2-text-reveal" title="${esc(nextAction)}">${esc(nextAction)}</span>
            <button class="task-row-edit-btn" type="button" data-action="edit" aria-label="Edit card: ${esc(title)}" title="Edit card: ${esc(title)}">${icon("edit")} <span>Edit</span></button>
          </div>
        </td>
        <td title="${esc(boardListTitle)}">
          ${uiBoardTag(boardName, boardColorForName(boardName))}
          <span class="task-list-line uiv2-meta-text uiv2-text-reveal" title="${esc(listName)}">&middot; ${esc(listName)}</span>
        </td>
        <td data-uiv2="task-owner">${uiAvatarStack(card.members || [])}<span class="task-owner-name">${esc(ownerText(card))}</span></td>
        <td>${uiDue(card.due ? formatThaiDateTime(card.due, false) : "No due", dueStateFromCard(card))}</td>
        <td>${uiChip(statusTone(card), statusLabel(card), { sm: true })}</td>
        <td data-uiv2="task-source">${uiChip("muted", "Trello", { sm: true })}</td>
        <td class="num mono">${esc(checklist)}</td>
      </tr>`;
  }

  function dueBucket(card) {
    if (!card.due) return "No due date";
    if (card.dueComplete) return "Done";
    if (isOverdue(card)) return "Overdue";
    if (isToday(card)) return "Today";
    if (isUpcoming(card)) return "Next 7 days";
    return "Later";
  }

  function groupRows(rows) {
    const add = (map, key, card) => {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(card);
    };
    const map = new Map();
    if (groupBy === "none") return [{ label: "", cards: rows }];
    if (groupBy === "due") {
      ["Overdue", "Today", "Next 7 days", "Later", "No due date", "Done"].forEach(label => map.set(label, []));
      rows.forEach(card => add(map, dueBucket(card), card));
    } else if (groupBy === "board") {
      rows.forEach(card => add(map, card.boardName || "No board", card));
    } else if (groupBy === "owner" || groupBy === "member") {
      rows.forEach(card => {
        const members = card.members || [];
        if (!members.length) add(map, "Unassigned", card);
        else members.forEach(member => add(map, member.fullName || member.username || member.id, card));
      });
    } else if (groupBy === "label") {
      rows.forEach(card => {
        const labels = (card.labels || []).filter(label => label.name);
        if (!labels.length) add(map, "No label", card);
        else labels.forEach(label => add(map, label.name, card));
      });
    } else if (groupBy === "type") {
      rows.forEach(card => add(map, /okr|inspiration/i.test(card.boardName || "") ? "OKR & Planning" : "Projects", card));
    }
    return [...map.entries()].filter(([, groupCards]) => groupCards.length).map(([label, groupCards]) => ({ label, cards: groupCards }));
  }

  function buildGroupedRows(rows) {
    if (!rows.length) {
      return `
        <tr class="task-empty-row">
          <td colspan="8">
            ${uiStateCard({
              kind: allCards.length ? "empty" : "disconnected",
              iconName: search || labelFilter || ownerFilter || filter !== "all" ? "search" : "checkSquare",
              title: allCards.length ? "No tasks match this view" : "No tasks found",
              desc: allCards.length ? "Adjust search, filters, labels, owners, or grouping to widen the inbox." : "Connected boards did not return any visible tasks.",
              actions: allCards.length ? '<button class="btn primary sm" type="button" data-action="clear-filters">Clear filters</button>' : "",
            })}
          </td>
        </tr>`;
    }
    return groupRows(rows).map(group => `
      ${group.label ? `<tr class="task-group-header-row"><td colspan="8"><span>${esc(group.label)}</span><span class="task-group-count">${group.cards.length}</span></td></tr>` : ""}
      ${group.cards.map(buildCardRow).join("")}
    `).join("");
  }

  function buildListCard(card) {
    const title = card.name || "Untitled task";
    const boardName = card.boardName || "No board";
    const listName = card.listName || "No list";
    const nextAction = taskNextActionLabel(card);
    const done = card.dueComplete;
    return `
      <div class="task-list-card task-row ${done ? "is-complete" : ""}" data-card-id="${esc(card.id)}" title="${esc(`${title} - ${boardName} / ${listName}`)}">
        <button class="task-check-button tck" type="button" title="${done ? "Mark active" : "Mark done"}" aria-label="${esc(done ? `Mark active: ${title}` : `Mark done: ${title}`)}" data-action="done">${done ? icon("check") : ""}</button>
        <div class="task-list-card-main">
          <div class="task-title-text uiv2-decision-text uiv2-text-reveal" title="${esc(title)}">${esc(title)}</div>
          <div class="task-row-meta">
            ${uiBoardTag(boardName, boardColorForName(boardName))}
            <span class="task-list-line uiv2-meta-text uiv2-text-reveal" title="${esc(listName)}">&middot; ${esc(listName)}</span>
            <span>${uiChip(statusTone(card), statusLabel(card), { sm: true })}</span>
            <span class="task-next-action uiv2-decision-text uiv2-text-reveal" title="${esc(nextAction)}">${esc(nextAction)}</span>
          </div>
        </div>
        <div class="task-list-card-side">
          <span data-uiv2="task-owner">${uiAvatarStack(card.members || [])}<span class="task-owner-name">${esc(ownerText(card) || "Unassigned")}</span></span>
          ${uiDue(card.due ? formatThaiDateTime(card.due, false) : "No due", dueStateFromCard(card))}
          <button class="btn sm ghost" type="button" data-action="edit" aria-label="Edit card: ${esc(title)}" title="Edit card: ${esc(title)}">${icon("edit")} Edit</button>
        </div>
      </div>`;
  }

  function buildGroupedListRows(rows) {
    if (!rows.length) {
      return uiStateCard({
        kind: allCards.length ? "empty" : "disconnected",
        iconName: search || labelFilter || ownerFilter || filter !== "all" ? "search" : "checkSquare",
        title: allCards.length ? "No tasks match this view" : "No tasks found",
        desc: allCards.length ? "Adjust search, filters, labels, owners, or grouping to widen the inbox." : "Connected boards did not return any visible tasks.",
        actions: allCards.length ? '<button class="btn primary sm" type="button" data-action="clear-filters">Clear filters</button>' : "",
      });
    }
    return groupRows(rows).map(group => `
      ${group.label ? `<div class="task-group-header-row task-list-group-header"><span>${esc(group.label)}</span><span class="task-group-count">${group.cards.length}</span></div>` : ""}
      ${group.cards.map(buildListCard).join("")}
    `).join("");
  }

  function persistViewState() {
    S.atFilter = filter;
    S.atSearch = search;
    S.atLabelFilter = labelFilter;
    S.atOwnerFilter = ownerFilter;
    S.atViewMode = viewMode;
    S.atGroupBy = groupBy;
  }

  async function markDone(card, btn) {
    btn.disabled = true;
    try {
      await api.put(`/api/cards/${card.id}`, { dueComplete: !card.dueComplete });
      S.allCardsCache = null;
      toast(card.dueComplete ? "Marked active" : "Marked done");
      await showAllTasks();
    } catch (err) {
      btn.disabled = false;
      toast("Error: " + err.message, true);
    }
  }

  function restoreTaskTitle(input, title) {
    const textEl = document.createElement("div");
    textEl.className = "task-title-text";
    textEl.textContent = title || "Untitled task";
    input.replaceWith(textEl);
  }

  function startTaskInboxInlineRename(titleEl, card) {
    const titleText = titleEl.querySelector(".task-title-text");
    if (!titleText || titleEl.querySelector(".inline-edit-input")) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "inline-edit-input";
    input.value = card.name || "";
    titleText.replaceWith(input);
    input.focus();
    input.select();

    let committed = false;
    async function commit() {
      if (committed) return;
      committed = true;
      const newName = input.value.trim();
      if (!newName || newName === card.name) {
        restoreTaskTitle(input, card.name);
        return;
      }

      try {
        await api.put(`/api/cards/${card.id}`, { name: newName });
        S.allCardsCache = null;
        toast("Renamed");
        await showAllTasks();
      } catch (err) {
        restoreTaskTitle(input, card.name);
        toast("Error: " + err.message, true);
      }
    }

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      }
      if (e.key === "Escape") {
        committed = true;
        restoreTaskTitle(input, card.name);
      }
    });
    input.addEventListener("blur", () => { if (!committed) commit(); });
  }

  function render() {
    persistViewState();
    const c = counts();
    const filtered = getFiltered();
    const rows = getSorted(filtered);
    const boardsCount = new Set(allCards.map(card => card.boardId || card.boardName).filter(Boolean)).size;
    const hiddenBoardCount = (S.config.hiddenBoards || []).length;
    const activeScopeLabel = typeof scopeLabel === "function" ? scopeLabel() : "All BUs";
    const unassignedCount = allCards.filter(card => !(card.members || []).length).length;
    const activeFilterCount = [filter !== "all", search.trim(), labelFilter, ownerFilter].filter(Boolean).length;
    window._filteredCards = rows;

    if (typeof setTopbarRouteActions === "function") {
      setTopbarRouteActions(`
        <button class="btn" type="button" id="tasks-topbar-open">${icon("external")} Open in Trello</button>
        <button class="btn primary" type="button" id="tasks-topbar-new">${icon("plus")} New task</button>
      `);
    }

    const labelChipHtml = allLabels.map(label =>
      `<button class="filter-chip at-label-chip${labelFilter === label.name ? " active" : ""}" type="button" data-l="${esc(label.name)}" style="${labelFilter === label.name ? `--chip-bg:${labelColor(label.color)}` : ""}">${esc(label.name)}</button>`
    ).join("");
    const ownerChipHtml = allMembers.map(member =>
      `<button class="filter-chip at-owner-chip${ownerFilter === member.id ? " active" : ""}" type="button" data-mid="${esc(member.id)}">${esc(member.fullName || member.username || member.id)}</button>`
    ).join("");
    const viewLabels = { table: "Table", list: "List", board: "Group by board", owner: "Group by owner" };
    const sortLabels = { name: "Task", board: "Board", owner: "Owner", due: "Due", status: "Status" };
    const ownerName = ownerFilter
      ? (allMembers.find(member => member.id === ownerFilter)?.fullName || allMembers.find(member => member.id === ownerFilter)?.username || ownerFilter)
      : "";
    const localFilterParts = [
      filter !== "all" ? `status:${filter}` : "",
      search.trim() ? `search:${search.trim()}` : "",
      labelFilter ? `label:${labelFilter}` : "",
      ownerFilter ? `owner:${ownerName}` : "",
    ].filter(Boolean);
    const currentViewLabel = viewLabels[viewMode] || "Table";
    const currentSortLabel = `${sortLabels[S.atSortField] || "Due"} ${S.atSortOrder === "desc" ? "desc" : "asc"}`;
    const currentFilterLabel = localFilterParts.length ? localFilterParts.join(" / ") : "none";
    const contextChips = [
      `<span class="tasks-context-chip" aria-label="View: ${esc(currentViewLabel)}"><span>view</span><strong>${esc(currentViewLabel)}</strong></span>`,
      `<span class="tasks-context-chip" aria-label="Sort: ${esc(currentSortLabel)}"><span>sort</span><strong>${esc(currentSortLabel)}</strong></span>`,
      `<span class="tasks-context-chip" aria-label="Scope: ${esc(activeScopeLabel)}"><span>scope</span><strong>${esc(activeScopeLabel)}</strong></span>`,
      `<span class="tasks-context-chip" aria-label="Filters: ${esc(currentFilterLabel)}"><span>filters</span><strong>${esc(currentFilterLabel)}</strong></span>`,
    ].join("");

    const useV2Tasks = true;
    if (useV2Tasks) {
      content.innerHTML = `
        <div class="all-tasks-content tasks-inbox-page is-${esc(viewMode)}-view">
          ${uiRouteBar({
            title: "Cross-board task inbox",
            sub: `<span>${rows.length} tasks visible</span><span>&middot;</span><span>Trello execution source</span><span>&middot;</span><span>${boardsCount} boards &middot; hidden ${hiddenBoardCount}</span><span>&middot;</span><span>scope: ${esc(activeScopeLabel)}</span>`,
            actions: `<div class="seg" role="group" aria-label="Task view mode">
              <button class="${viewMode === "table" ? "on" : ""}" type="button" aria-pressed="${viewMode === "table"}" data-at-view="table" title="Show dense table view">Table</button>
              <button class="${viewMode === "list" ? "on" : ""}" type="button" aria-pressed="${viewMode === "list"}" data-at-view="list" title="Show scannable list view">List</button>
              <button class="${viewMode === "board" ? "on" : ""}" type="button" aria-pressed="${viewMode === "board"}" data-at-view="board" title="Group visible tasks by board">Group &middot; board</button>
              <button class="${viewMode === "owner" ? "on" : ""}" type="button" aria-pressed="${viewMode === "owner"}" data-at-view="owner" title="Group visible tasks by owner">Group &middot; owner</button>
            </div>`,
          })}

          <div class="filterbar tasks-primary-filterbar">
            <span class="search-sm">${icon("search")}<input id="tasks-search-input" type="search" value="${esc(search)}" placeholder="Search tasks..." aria-label="Search tasks by title, board, label, or owner" autocomplete="off"></span>
            <button class="filter-chip on" data-f="all" type="button"><span class="k">status:</span>open ${filter !== "all" ? icon("x") : ""}</button>
            <button class="filter-chip is-readonly" type="button" disabled title="The due window is represented by the status chips and Due column in this V0.6 slice."><span class="k">due:</span>next 14d</button>
            <button class="filter-chip${activeScopeLabel !== "All BUs" ? " on" : ""}" id="tasks-scope-filter-btn" type="button" title="Scope is controlled from the topbar and sidebar."><span class="k">board:</span>${activeScopeLabel === "All BUs" ? "any" : esc(activeScopeLabel)}</button>
            <button class="filter-chip${ownerFilter ? " active" : " is-readonly"}" id="tasks-owner-filter-clear" type="button" ${ownerFilter ? "" : "disabled"} title="${ownerFilter ? "Clear owner filter" : "Choose an owner from the Owner chips below."}"><span class="k">owner:</span>${ownerFilter ? "filtered" : "any"}</button>
            <button class="filter-chip is-readonly" type="button" disabled title="All visible tasks come from Trello in this V0.6 slice."><span class="k">source:</span>any</button>
            <button class="filter-chip${labelFilter ? " active" : " is-readonly"}" id="tasks-label-filter-clear" type="button" ${labelFilter ? "" : "disabled"} title="${labelFilter ? "Clear label filter" : "Choose a label from the Label chips below."}"><span class="k">label:</span>${labelFilter ? esc(labelFilter) : "any"}</button>
            <button class="filter-chip is-disabled" type="button" id="tasks-add-filter-btn" disabled title="Additional filter builder is planned for the next UI V2 slice">${icon("plus")} Add filter</button>
            <span class="tasks-filter-actions">
              <button class="btn sm is-disabled" type="button" disabled title="Saved views are not wired yet">Saved: <strong>Risky open · 14d</strong>${icon("down")}</button>
              <button class="btn sm ghost" type="button" onclick="topbarRefresh()" aria-label="Refresh task inbox" title="Refresh task inbox">${icon("refresh")}</button>
            </span>
          </div>

          <div class="tasks-context-strip" aria-live="polite" aria-label="All Tasks current view, sort, scope, and filters">
            <div class="tasks-context-main">
              ${contextChips}
              <span class="tasks-context-count">${rows.length} of ${allCards.length} visible</span>
            </div>
            <div class="tasks-context-actions">
              <button class="btn sm ghost" type="button" id="tasks-clear-local-filters-btn" ${localFilterParts.length ? "" : "disabled"} title="${localFilterParts.length ? "Clear local All Tasks filters. Scope remains unchanged." : "No local filters to clear."}">Clear filters</button>
              <button class="btn sm" type="button" id="tasks-reset-view-btn" title="Reset All Tasks to table view, Due ascending sort, and no local filters. Scope remains unchanged.">Reset view</button>
            </div>
          </div>

          ${hiddenBoardCount ? `<div class="panel-foot tasks-hidden-notice">${icon("alert")} ${hiddenBoardCount} hidden board${hiddenBoardCount === 1 ? "" : "s"} excluded from this inbox. Manage visibility in Settings.</div>` : ""}

          ${viewMode === "list" ? `
          <div class="panel tasks-inbox-list" id="task-rows">
            ${buildGroupedListRows(rows)}
            <div class="panel-foot">
              <span>${rows.length} of ${allCards.length}</span>
              <span style="margin-left:auto">List view keeps decision metadata visible for desktop scanning.</span>
            </div>
          </div>` : `
          <div class="panel tasks-inbox-table">
            <table class="tbl">
              <colgroup>
                <col class="tasks-col-check">
                <col class="tasks-col-title">
                <col class="tasks-col-board">
                <col class="tasks-col-owner">
                <col class="tasks-col-due">
                <col class="tasks-col-status">
                <col class="tasks-col-source">
                <col class="tasks-col-progress">
              </colgroup>
              <thead>
                <tr>
                  <th class="ck"><input type="checkbox" aria-label="Select all visible tasks" disabled></th>
                  ${sortHeader("name", "Task")}
                  ${sortHeader("board", "Board &middot; List", "Board and list")}
                  ${sortHeader("owner", "Owner")}
                  ${sortHeader("due", "Due")}
                  ${sortHeader("status", "Status")}
                  <th>Source</th>
                  <th class="num" title="Progress">&Delta;</th>
                </tr>
              </thead>
              <tbody id="task-rows">${buildGroupedRows(rows)}</tbody>
            </table>
            <div class="panel-foot">
              <span>${rows.length} of ${allCards.length}</span>
              <span style="margin-left:auto;display:flex;gap:6px">
                <button class="btn sm" type="button" disabled>Prev</button>
                <button class="btn sm" type="button" disabled>Next</button>
                <button class="btn sm ghost" id="at-export-btn" type="button" title="Export filtered tasks" aria-label="Export filtered tasks">Export</button>
              </span>
            </div>
          </div>`}
        </div>`;
    } else {
    content.innerHTML = `
      <div class="all-tasks-content tasks-inbox-page">
        <div class="tasks-command-header">
          <div>
            <div class="tasks-kicker">${icon("inbox")} Cross-board inbox</div>
            <h1 class="tasks-title">Tasks</h1>
            <p class="tasks-subtitle">${rows.length} of ${allCards.length} tasks visible across ${boardsCount} board${boardsCount === 1 ? "" : "s"}. Use source, owner, due state, and next action to choose work.</p>
          </div>
          <button class="btn btn-ghost btn-sm at-export-btn" type="button" id="at-export-btn" title="Export filtered tasks as CSV">${icon("upload")} Export CSV</button>
        </div>

        <div class="tasks-scan-strip" aria-label="Task inbox summary">
          <div class="tasks-scan-cell is-visible">
            <span>Visible</span>
            <strong>${rows.length}</strong>
            <em>${allCards.length} total</em>
          </div>
          <div class="tasks-scan-cell is-urgent">
            <span>Overdue</span>
            <strong>${c.overdue}</strong>
            <em>needs triage</em>
          </div>
          <div class="tasks-scan-cell">
            <span>Due today</span>
            <strong>${c.today}</strong>
            <em>daily focus</em>
          </div>
          <div class="tasks-scan-cell ${unassignedCount ? "is-warning" : ""}">
            <span>Unassigned</span>
            <strong>${unassignedCount}</strong>
            <em>owner clarity</em>
          </div>
        </div>

        <div class="tasks-toolbar">
          <label class="tasks-search" for="tasks-search-input">
            ${icon("search")}
            <input id="tasks-search-input" type="search" value="${esc(search)}" placeholder="Search tasks, boards, labels, owners..." aria-label="Search tasks by title, board, label, or owner" autocomplete="off">
          </label>
          <div class="tasks-filter-strip" role="group" aria-label="Status filter">
            ${[
              ["all", "All", c.all],
              ["overdue", "Overdue", c.overdue],
              ["today", "Today", c.today],
              ["upcoming", "Upcoming", c.upcoming],
              ["nodue", "No due", c.nodue],
              ["done", "Done", c.done],
            ].map(([key, label, count]) => `<button class="filter-chip${filter === key ? " active" : ""}" data-f="${key}" type="button">${label}<span>${count}</span></button>`).join("")}
          </div>
        </div>

        <div class="tasks-meta-toolbar">
          <span class="tasks-saved-view">Saved view: Current filters${activeFilterCount ? ` (${activeFilterCount} active)` : ""}</span>
          ${labelChipHtml ? `<span class="at-chip-label">Label</span><div class="tasks-chip-scroll">${labelChipHtml}</div>` : ""}
          ${ownerChipHtml ? `<span class="at-chip-label">Owner</span><div class="tasks-chip-scroll">${ownerChipHtml}</div>` : ""}
          <label class="tasks-group-select">
            <span>Group by</span>
            <select class="at-select" id="at-group-sel">
              <option value="due"${groupBy === "due" ? " selected" : ""}>Due</option>
              <option value="board"${groupBy === "board" ? " selected" : ""}>Board</option>
              <option value="owner"${groupBy === "owner" ? " selected" : ""}>Owner</option>
              <option value="type"${groupBy === "type" ? " selected" : ""}>Type</option>
              ${allLabels.length ? `<option value="label"${groupBy === "label" ? " selected" : ""}>Label</option>` : ""}
              ${allMembers.length ? `<option value="member"${groupBy === "member" ? " selected" : ""}>Member</option>` : ""}
              <option value="none"${groupBy === "none" ? " selected" : ""}>None</option>
            </select>
          </label>
        </div>

        ${hiddenBoardCount ? `<div class="tasks-hidden-notice">${icon("alert")} ${hiddenBoardCount} hidden board${hiddenBoardCount === 1 ? "" : "s"} excluded from this inbox. Manage visibility in Settings.</div>` : ""}

        <div class="task-table tasks-inbox-table">
          <div class="task-table-head">
            <div></div>
            <button class="sortable-header" type="button" data-sort="name">Task${sortGlyph("name")}</button>
            <button class="sortable-header" type="button" data-sort="board">Board / List${sortGlyph("board")}</button>
            <button class="sortable-header" type="button" data-sort="owner">Owner${sortGlyph("owner")}</button>
            <button class="sortable-header" type="button" data-sort="due">Due${sortGlyph("due")}</button>
            <button class="sortable-header" type="button" data-sort="status">Status${sortGlyph("status")}</button>
          </div>
          <div id="task-rows">${buildGroupedRows(rows)}</div>
        </div>
      </div>`;
    }

    if (typeof ensureButtonTypes === "function") ensureButtonTypes(content);

    const searchInput = $("tasks-search-input");
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      searchInput.oninput = e => {
        search = e.target.value;
        render();
      };
    }

    content.querySelectorAll(".sortable-header").forEach(hdr => {
      hdr.onclick = () => {
        const field = hdr.dataset.sort;
        if (S.atSortField === field) S.atSortOrder = S.atSortOrder === "asc" ? "desc" : "asc";
        else {
          S.atSortField = field;
          S.atSortOrder = "asc";
        }
        render();
      };
    });

    content.querySelectorAll(".filter-chip[data-f]").forEach(btn => {
      btn.onclick = () => { filter = btn.dataset.f; render(); };
    });
    content.querySelectorAll("[data-at-view]").forEach(btn => {
      btn.onclick = () => {
        viewMode = btn.dataset.atView || "table";
        groupBy = viewMode === "board" ? "board" : viewMode === "owner" ? "owner" : "none";
        toast(viewMode === "board" ? "Grouped by board" : viewMode === "owner" ? "Grouped by owner" : viewMode === "list" ? "List view selected" : "Table view selected");
        render();
      };
    });
    content.querySelectorAll(".at-label-chip").forEach(btn => {
      btn.onclick = () => { labelFilter = labelFilter === btn.dataset.l ? "" : btn.dataset.l; render(); };
    });
    content.querySelectorAll(".at-owner-chip").forEach(btn => {
      btn.onclick = () => { ownerFilter = ownerFilter === btn.dataset.mid ? "" : btn.dataset.mid; render(); };
    });
    content.querySelector("#tasks-scope-filter-btn")?.addEventListener("click", () => {
      document.querySelector(".topbar .scope-pick")?.focus();
      toast("Board scope is controlled from the topbar scope picker and sidebar Scope list.");
    });
    content.querySelector("#tasks-owner-filter-clear")?.addEventListener("click", () => {
      ownerFilter = "";
      render();
    });
    content.querySelector("#tasks-label-filter-clear")?.addEventListener("click", () => {
      labelFilter = "";
      render();
    });
    content.querySelector("#tasks-clear-local-filters-btn")?.addEventListener("click", () => {
      filter = "all";
      search = "";
      labelFilter = "";
      ownerFilter = "";
      toast("All Tasks filters cleared. Scope is unchanged.");
      render();
    });
    content.querySelector("#tasks-reset-view-btn")?.addEventListener("click", () => {
      filter = "all";
      search = "";
      labelFilter = "";
      ownerFilter = "";
      viewMode = "table";
      groupBy = "none";
      S.atSortField = "due";
      S.atSortOrder = "asc";
      toast("All Tasks view reset. Scope is unchanged.");
      render();
    });
    const groupSel = $("at-group-sel");
    if (groupSel) groupSel.onchange = () => { groupBy = groupSel.value; render(); };

    const exportBtn = $("at-export-btn");
    if (exportBtn) exportBtn.onclick = exportTasksCSV;
    $("tasks-topbar-open")?.addEventListener("click", () => {
      window.open("https://trello.com", "_blank", "noopener");
      toast("Opening Trello in a new tab. Task Hub remains the command and review layer.");
    });
    $("tasks-topbar-new")?.addEventListener("click", () => {
      toast("Opening Today quick add. New Trello card behavior is unchanged.");
      navigateTo("today");
      setTimeout(() => $("today-topbar-quick-add")?.click(), 80);
    });

    const taskRows = content.querySelector("#task-rows");
    content.querySelector("[data-action='clear-filters']")?.addEventListener("click", () => {
      filter = "all";
      search = "";
      labelFilter = "";
      ownerFilter = "";
      toast("Task filters cleared");
      render();
    });

    taskRows?.addEventListener("click", e => {
      const row = e.target.closest(".task-row");
      if (!row) return;
      const card = allCards.find(item => item.id === row.dataset.cardId);
      if (!card) return;
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "done") return markDone(card, e.target.closest("[data-action]"));
      if (action === "edit") return openEditAllTasks(card);
      if (e.target.closest(".task-title")) return;
      openEditAllTasks(card);
    });

    taskRows?.addEventListener("dblclick", e => {
      if (e.target.closest("[data-action]")) return;
      const titleEl = e.target.closest(".task-title");
      if (!titleEl) return;
      const row = titleEl.closest(".task-row");
      const card = allCards.find(item => item.id === row?.dataset.cardId);
      if (card) startTaskInboxInlineRename(titleEl, card);
    });
  }

  render();
}
