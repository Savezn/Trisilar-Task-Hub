// All Tasks / Tasks Inbox
// Implemented by Codex Dev: V0.2-W2-03 Tasks Inbox + cross-board rows.
async function showAllTasks() {
  S.mode = "all";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Tasks";
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
    renderAllTasks(getAllowedCards());
  } catch (e) {
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
  let groupBy = S.atGroupBy || "due";

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
    return `
      <span class="task-source-pill">${taskSourceLabel(card)}</span>
      <span class="task-context-label">${esc(taskDecisionContext(card))}</span>
      <span class="task-next-action">${esc(taskNextActionLabel(card))}</span>
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

  function buildCardRow(card) {
    const chips = labelChips(card);
    const done = card.dueComplete;
    return `
      <div class="task-row task-inbox-row ${done ? "is-complete" : ""}" data-card-id="${esc(card.id)}">
        <button class="task-check-button" type="button" title="${done ? "Completed" : "Mark done"}" data-action="done">
          ${done ? icon("check") : ""}
        </button>
        <div class="task-title">
          <div class="task-title-text">${esc(card.name || "Untitled task")}</div>
          <div class="task-row-meta">
            ${chips ? `<span class="task-label-chips">${chips}</span>` : ""}
            ${checklistMeta(card)}
            ${card.desc ? `<span class="task-row-mini">${icon("inbox")}Description</span>` : ""}
            ${taskDecisionMeta(card)}
          </div>
        </div>
        <div class="task-board-cell">
          ${boardChip(card)}
          <span class="task-list-line">${esc(card.listName || "No list")}</span>
        </div>
        <div class="task-owner">${ownerAvatars(card)}</div>
        <div>${dueCell(card)}</div>
        <div class="task-row-status">
          <span class="task-status-pill ${statusClass(card)}">${esc(statusLabel(card))}</span>
          <button class="btn btn-ghost btn-xs task-open-btn" type="button" data-action="open" title="Open task">${icon("external")}</button>
        </div>
      </div>`;
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
        <div class="tasks-empty-state">
          <div class="tasks-empty-icon">${icon(search || labelFilter || ownerFilter || filter !== "all" ? "search" : "checkSquare")}</div>
          <h3>${allCards.length ? "No tasks match this view" : "No tasks found"}</h3>
          <p>${allCards.length ? "Adjust search, filters, labels, owners, or grouping to widen the inbox." : "Connected boards did not return any visible tasks."}</p>
        </div>`;
    }
    return groupRows(rows).map(group => `
      ${group.label ? `<div class="task-group-header"><span>${esc(group.label)}</span><span class="task-group-count">${group.cards.length}</span></div>` : ""}
      ${group.cards.map(buildCardRow).join("")}
    `).join("");
  }

  function persistViewState() {
    S.atFilter = filter;
    S.atSearch = search;
    S.atLabelFilter = labelFilter;
    S.atOwnerFilter = ownerFilter;
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
    window._filteredCards = rows;

    const labelChipHtml = allLabels.map(label =>
      `<button class="filter-chip at-label-chip${labelFilter === label.name ? " active" : ""}" data-l="${esc(label.name)}" style="${labelFilter === label.name ? `--chip-bg:${labelColor(label.color)}` : ""}">${esc(label.name)}</button>`
    ).join("");
    const ownerChipHtml = allMembers.map(member =>
      `<button class="filter-chip at-owner-chip${ownerFilter === member.id ? " active" : ""}" data-mid="${esc(member.id)}">${esc(member.fullName || member.username || member.id)}</button>`
    ).join("");

    content.innerHTML = `
      <div class="all-tasks-content tasks-inbox-page">
        <div class="tasks-command-header">
          <div>
            <div class="tasks-kicker">${icon("inbox")} Cross-board inbox</div>
            <h1 class="tasks-title">Tasks</h1>
            <p class="tasks-subtitle">${rows.length} of ${allCards.length} tasks visible across ${boardsCount} board${boardsCount === 1 ? "" : "s"}. Use source, owner, due state, and next action to choose work.</p>
          </div>
          <button class="btn btn-ghost btn-sm at-export-btn" id="at-export-btn" title="Export filtered tasks as CSV">${icon("upload")} Export CSV</button>
        </div>

        <div class="tasks-toolbar">
          <label class="tasks-search" for="tasks-search-input">
            ${icon("search")}
            <input id="tasks-search-input" type="search" value="${esc(search)}" placeholder="Search tasks, boards, labels, owners..." autocomplete="off">
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
    content.querySelectorAll(".at-label-chip").forEach(btn => {
      btn.onclick = () => { labelFilter = labelFilter === btn.dataset.l ? "" : btn.dataset.l; render(); };
    });
    content.querySelectorAll(".at-owner-chip").forEach(btn => {
      btn.onclick = () => { ownerFilter = ownerFilter === btn.dataset.mid ? "" : btn.dataset.mid; render(); };
    });
    const groupSel = $("at-group-sel");
    if (groupSel) groupSel.onchange = () => { groupBy = groupSel.value; render(); };

    const exportBtn = $("at-export-btn");
    if (exportBtn) exportBtn.onclick = exportTasksCSV;

    const taskRows = content.querySelector("#task-rows");
    taskRows?.addEventListener("click", e => {
      const row = e.target.closest(".task-row");
      if (!row) return;
      const card = allCards.find(item => item.id === row.dataset.cardId);
      if (!card) return;
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "done") return markDone(card, e.target.closest("[data-action]"));
      if (e.target.closest(".task-title")) return;
      openEditAllTasks(card);
    });

    taskRows?.addEventListener("dblclick", e => {
      const titleEl = e.target.closest(".task-title");
      if (!titleEl) return;
      const row = titleEl.closest(".task-row");
      const card = allCards.find(item => item.id === row?.dataset.cardId);
      if (card) startTaskInboxInlineRename(titleEl, card);
    });
  }

  render();
}
