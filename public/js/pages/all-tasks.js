// ── All Tasks ─────────────────────────────────────────────────────────────────
async function showAllTasks() {
  S.mode = "all";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "All Tasks";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading all tasks...</div>';
  try {
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    renderAllTasks(getAllowedCards());
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderAllTasks(cards) {
  const content = $("board-content");
  if (!cards.length) {
    content.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><h3>No tasks found</h3></div>';
    return;
  }
  window._allCards = cards;
  const now = new Date();
  let filter = "all";
  let labelFilter = "";   // P7-2: "" = all labels
  let ownerFilter = "";   // P7-2: "" = all owners (member id)
  let groupBy = "none";   // P7-2: "none" | "label" | "member"

  // Collect unique labels and members from ALL cards for selectors
  const allLabels = [];
  const allMembers = [];
  const seenLabels = new Set(), seenMembers = new Set();
  cards.forEach(c => {
    (c.labels || []).forEach(l => { if (l.name && !seenLabels.has(l.name)) { seenLabels.add(l.name); allLabels.push(l); } });
    (c.members || []).forEach(m => { if (m.id && !seenMembers.has(m.id)) { seenMembers.add(m.id); allMembers.push(m); } });
  });

  function getFiltered() {
    let result = cards;
    if (filter === "overdue") result = result.filter(c => c.due && new Date(c.due) < now && !c.dueComplete);
    else if (filter === "today") result = result.filter(c => c.due && !c.dueComplete && new Date(c.due).toDateString() === now.toDateString());
    else if (filter === "nodue")  result = result.filter(c => !c.due);
    else if (filter === "done")   result = result.filter(c => c.dueComplete);
    if (labelFilter) result = result.filter(c => (c.labels || []).some(l => l.name === labelFilter));
    if (ownerFilter) result = result.filter(c => (c.members || []).some(m => m.id === ownerFilter));
    return result;
  }

  function getSorted(rows) {
    const field = S.atSortField || "due";
    const order = S.atSortOrder || "asc";
    const sorted = [...rows].sort((a, b) => {
      let valA, valB;
      if (field === "name") { 
        valA = (a.name || "").toLowerCase(); 
        valB = (b.name || "").toLowerCase(); 
      }
      else if (field === "board") { 
        valA = (a.boardName || "").toLowerCase(); 
        valB = (b.boardName || "").toLowerCase(); 
      }
      else if (field === "list")  { 
        valA = (a.listName || "").toLowerCase(); 
        valB = (b.listName || "").toLowerCase(); 
      }
      else if (field === "owner") { 
        valA = (a.members || []).map(m => m.fullName || m.username || m.id).join(", ").toLowerCase();
        valB = (b.members || []).map(m => m.fullName || m.username || m.id).join(", ").toLowerCase();
      }
      else if (field === "due") {
        valA = a.due ? new Date(a.due).getTime() : Infinity;
        valB = b.due ? new Date(b.due).getTime() : Infinity;
      }
      else if (field === "status") {
        valA = a.dueComplete ? 2 : (a.due && new Date(a.due) < now ? 0 : 1);
        valB = b.dueComplete ? 2 : (b.due && new Date(b.due) < now ? 0 : 1);
      }
      
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  function counts() {
    return {
      all:     cards.length,
      overdue: cards.filter(c => c.due && new Date(c.due) < now && !c.dueComplete).length,
      today:   cards.filter(c => c.due && !c.dueComplete && new Date(c.due).toDateString() === now.toDateString()).length,
      nodue:   cards.filter(c => !c.due).length,
      done:    cards.filter(c => c.dueComplete).length,
    };
  }

  function buildCardRow(card) {
    const labelChips = (card.labels || []).filter(l => l.name).map(l =>
      `<span class="task-label-chip" style="background:${labelColor(l.color)}">${esc(l.name)}</span>`
    ).join("");
    const memberText = (card.members || []).map(m => esc(m.fullName || m.username || m.id)).join(", ");
    return `
      <div class="task-row" data-card-id="${card.id}">
        <div class="task-title">
          ${esc(card.name)}
          ${labelChips ? `<div class="task-label-chips">${labelChips}</div>` : ""}
        </div>
        <div class="task-board">${esc(card.boardName)}</div>
        <div class="task-list">${esc(card.listName)}</div>
        <div class="task-owner">${memberText || '<span style="color:#bbb">—</span>'}</div>
        <div>${card.due ? buildDueBadge(card.due, card.dueComplete) : '<span style="color:#bbb">—</span>'}</div>
        <div>${card.dueComplete ? '<span class="due-badge due-complete">Done</span>' : '<span style="color:#aaa;font-size:12px">Active</span>'}</div>
      </div>`;
  }

  function buildGroupedRows(rows) {
    if (groupBy === "label") {
      if (!rows.length) return '<div class="no-results">No tasks match this filter</div>';
      const groups = new Map();
      rows.forEach(c => {
        const lbls = (c.labels || []).filter(l => l.name);
        if (!lbls.length) {
          if (!groups.has("__none__")) groups.set("__none__", []);
          groups.get("__none__").push(c);
        } else {
          lbls.forEach(l => {
            if (!groups.has(l.name)) groups.set(l.name, []);
            groups.get(l.name).push(c);
          });
        }
      });
      return [...groups.entries()].map(([name, grpCards]) => `
        <div class="task-group-header">${name === "__none__" ? "No Label" : esc(name)} <span class="task-group-count">${grpCards.length}</span></div>
        ${grpCards.map(buildCardRow).join("")}
      `).join("");
    }
    if (groupBy === "member") {
      if (!rows.length) return '<div class="no-results">No tasks match this filter</div>';
      const groups = new Map();
      rows.forEach(c => {
        const members = c.members || [];
        if (!members.length) {
          if (!groups.has("__unassigned__")) groups.set("__unassigned__", []);
          groups.get("__unassigned__").push(c);
        } else {
          members.forEach(m => {
            const key = m.id;
            if (!groups.has(key)) groups.set(key, { label: m.fullName || m.username || m.id, cards: [] });
            groups.get(key).cards.push(c);
          });
        }
      });
      return [...groups.entries()].map(([key, val]) => {
        const label = key === "__unassigned__" ? "Unassigned" : (typeof val === "object" && val.label ? val.label : key);
        const grpCards = key === "__unassigned__" ? val : val.cards;
        return `
          <div class="task-group-header">${esc(label)} <span class="task-group-count">${grpCards.length}</span></div>
          ${grpCards.map(buildCardRow).join("")}
        `;
      }).join("");
    }
    if (groupBy === "type") {
      if (!rows.length) return '<div class="no-results">No tasks match this filter</div>';
      const OKR_RE = /okr|inspiration/i;
      const okrCards = [], projectCards = [];
      rows.forEach(c => {
        (OKR_RE.test(c.boardName || "") ? okrCards : projectCards).push(c);
      });
      return [
        { label: "OKR & Planning", cards: okrCards },
        { label: "Projects",       cards: projectCards },
      ].map(({ label, cards: grpCards }) => `
        <div class="task-type-section">
          <div class="task-group-header task-type-header" onclick="this.closest('.task-type-section').classList.toggle('collapsed')" style="cursor:pointer">
            <span class="task-type-toggle">▾</span>
            ${esc(label)}
            <span class="task-group-count">${grpCards.length}</span>
          </div>
          <div class="task-type-body">
            ${grpCards.length ? grpCards.map(buildCardRow).join("") : '<div class="no-results" style="padding:8px 16px;font-size:13px;color:var(--text-muted)">No tasks</div>'}
          </div>
        </div>
      `).join("");
    }
    return rows.length ? rows.map(buildCardRow).join("") : '<div class="no-results">No tasks match this filter</div>';
  }

  function render() {
    const c = counts(), filtered = getFiltered();
    const rows = getSorted(filtered);
    window._filteredCards = rows; // P8-3: expose for CSV export
    // M6: label/owner as pill chips (toggle); group-by stays as <select>
    const labelChipHtml = allLabels.length
      ? allLabels.map(l =>
          `<button class="filter-chip at-label-chip${labelFilter===l.name?" active":""}" data-l="${esc(l.name)}" style="${labelFilter===l.name?`background:${labelColor(l.color)};border-color:${labelColor(l.color)};color:#fff`:""}">${esc(l.name)}</button>`
        ).join("")
      : "";
    const ownerChipHtml = allMembers.length
      ? allMembers.map(m =>
          `<button class="filter-chip at-owner-chip${ownerFilter===m.id?" active":""}" data-mid="${esc(m.id)}">${esc(m.fullName||m.username||m.id)}</button>`
        ).join("")
      : "";
    content.innerHTML = `
      <div class="all-tasks-content">
        <div class="filters">
          ${[["all","All"],["overdue","Overdue"],["today","Due Today"],["nodue","No Due"],["done","Done"]]
            .map(([f,label]) => `<button class="filter-chip${filter===f?" active":""}" data-f="${f}">${label} (${c[f]})</button>`)
            .join("")}
          <button class="btn btn-ghost btn-xs at-export-btn" id="at-export-btn" title="Export filtered tasks as CSV">⬇ Export CSV</button>
        </div>
        <div class="filters filters-row2">
          ${labelChipHtml ? `<span class="at-chip-label">Label:</span>${labelChipHtml}` : ""}
          ${labelChipHtml && ownerChipHtml ? `<span class="at-chip-divider"></span>` : ""}
          ${ownerChipHtml ? `<span class="at-chip-label">Owner:</span>${ownerChipHtml}` : ""}
          ${labelChipHtml || ownerChipHtml ? `<span class="at-chip-divider"></span>` : ""}
          <select class="at-select" id="at-group-sel">
            <option value="none"${groupBy==="none"?" selected":""}>No Grouping</option>
            <option value="type"${groupBy==="type"?" selected":""}>Type (OKR / Project)</option>
            ${allLabels.length ? `<option value="label"${groupBy==="label"?" selected":""}>Group by Label</option>` : ""}
            ${allMembers.length ? `<option value="member"${groupBy==="member"?" selected":""}>Group by Owner</option>` : ""}
          </select>
        </div>
        <div class="task-table">
          <div class="task-table-head">
            <div class="sortable-header" data-sort="name">TASK ${S.atSortField === "name" ? (S.atSortOrder === "asc" ? "▴" : "▾") : ""}</div>
            <div class="sortable-header" data-sort="board">BOARD ${S.atSortField === "board" ? (S.atSortOrder === "asc" ? "▴" : "▾") : ""}</div>
            <div class="sortable-header" data-sort="list">LIST ${S.atSortField === "list" ? (S.atSortOrder === "asc" ? "▴" : "▾") : ""}</div>
            <div class="sortable-header" data-sort="owner">OWNER ${S.atSortField === "owner" ? (S.atSortOrder === "asc" ? "▴" : "▾") : ""}</div>
            <div class="sortable-header" data-sort="due">DUE ${S.atSortField === "due" ? (S.atSortOrder === "asc" ? "▴" : "▾") : ""}</div>
            <div class="sortable-header" data-sort="status">STATUS ${S.atSortField === "status" ? (S.atSortOrder === "asc" ? "▴" : "▾") : ""}</div>
          </div>
          <div id="task-rows">${buildGroupedRows(rows)}</div>
        </div>
      </div>`;

    content.querySelectorAll(".sortable-header").forEach(hdr => {
      hdr.onclick = () => {
        const field = hdr.dataset.sort;
        if (S.atSortField === field) {
          S.atSortOrder = S.atSortOrder === "asc" ? "desc" : "asc";
        } else {
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
      if (e.target.closest(".task-title")) return; // single-click on title reserved for dblclick rename
      const row = e.target.closest(".task-row");
      if (!row) return;
      const card = (window._allCards || []).find(c => c.id === row.dataset.cardId);
      if (card) openEditAllTasks(card);
    });
    // P8-2: double-click on task title → inline rename
    taskRows?.addEventListener("dblclick", e => {
      const titleEl = e.target.closest(".task-title");
      if (!titleEl) return;
      const row = titleEl.closest(".task-row");
      if (!row) return;
      const card = (window._allCards || []).find(c => c.id === row.dataset.cardId);
      if (card) startInlineRename(titleEl, card);
    });
  }
  render();
}
