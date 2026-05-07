// Implemented by: Codex Dev (2026-05-07)

// ── OKR Progress View (P7-3) ──────────────────────────────────────────────────
async function showOKRPage() {
  S.mode = "okr";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "OKR Progress";
  $("board-subtitle").textContent = "";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading OKR data…</div>';
  try {
    if (!S.allCardsCache) S.allCardsCache = await api.get("/api/all-cards");
    renderOKRPage(getAllowedCards(), S.boards || []);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">⚠ ${e.message}</p></div>`;
  }
}

function renderOKRPage(allCards, boards) {
  const content = $("board-content");

  // Detect OKR board(s): name contains "OKR" or "Objective" (case-insensitive)
  const OKR_RE = /okr|objective/i;
  const okrBoards = boards.filter(b => OKR_RE.test(b.name));

  if (!okrBoards.length) {
    content.innerHTML = `
      <div class="empty-state okr-setup-guide">
        <div class="empty-icon">🎯</div>
        <h3>ยังไม่มี OKR Board</h3>
        <p>ทำตาม 4 ขั้นตอนนี้เพื่อเริ่มใช้ OKR ใน Trisilar Task Hub</p>
        <div class="okr-guide-steps">

          <details class="okr-guide-step" open>
            <summary><span class="okr-step-num">1</span>สร้าง Trello Board ชื่อ "OKR Board"</summary>
            <div class="okr-step-body">
              <p>สร้าง board ใหม่ใน Trello ตั้งชื่อให้มีคำว่า <code>OKR</code> หรือ <code>Objective</code> เพื่อให้ระบบตรวจพบอัตโนมัติ</p>
              <a href="https://trello.com" target="_blank" rel="noopener" class="okr-guide-link">เปิด Trello ↗</a>
            </div>
          </details>

          <details class="okr-guide-step">
            <summary><span class="okr-step-num">2</span>สร้าง Lists สำหรับแต่ละ Objective</summary>
            <div class="okr-step-body">
              <p>ใน OKR Board สร้าง lists ตั้งชื่อเป็นชื่อ Objective เช่น <code>Objective 1 — เพิ่มรายได้</code>, <code>Objective 2 — ลด cost</code> แต่ละ list แทน 1 Objective</p>
            </div>
          </details>

          <details class="okr-guide-step">
            <summary><span class="okr-step-num">3</span>สร้าง Cards สำหรับ Key Results</summary>
            <div class="okr-step-body">
              <p>ใต้แต่ละ Objective list สร้าง cards ชื่อ <code>KR1.1</code>, <code>KR1.2</code> พร้อมกำหนด due date และเพิ่ม checklist เพื่อ track progress</p>
            </div>
          </details>

          <details class="okr-guide-step">
            <summary><span class="okr-step-num">4</span>Link กับ Project Boards ด้วย Labels</summary>
            <div class="okr-step-body">
              <p>ใส่ label ชื่อเดียวกันกับ project boards บน KR cards เพื่อให้ Trisilar เชื่อม KR กับ tasks ที่เกี่ยวข้อง</p>
              <a href="https://trello.com" target="_blank" rel="noopener" class="okr-guide-link">ไปที่ Trello ↗</a>
            </div>
          </details>

        </div>
        <button class="btn btn-primary btn-sm okr-refresh-btn" onclick="showOKRPage()">↻ Refresh — ตรวจสอบอีกครั้ง</button>
      </div>`;
    return;
  }

  // Collect OKR cards (cards on OKR boards)
  const okrBoardIds = new Set(okrBoards.map(b => b.id));
  const okrCards = allCards.filter(c => okrBoardIds.has(c.boardId));

  // Non-OKR cards (project cards) — used for linking via label name matching
  const projectCards = allCards.filter(c => !okrBoardIds.has(c.boardId));

  let labelFilter = "";
  let memberFilter = "";

  const allLabels = [];
  const allMembers = [];
  const seenLabels = new Set();
  const seenMembers = new Set();
  projectCards.forEach(c => {
    (c.labels || []).forEach(l => {
      if (l.name && !seenLabels.has(l.name)) {
        seenLabels.add(l.name);
        allLabels.push(l);
      }
    });
    (c.members || []).forEach(m => {
      if (m.id && !seenMembers.has(m.id)) {
        seenMembers.add(m.id);
        allMembers.push(m);
      }
    });
  });

  // Group OKR cards by listName (each list = one Objective group)
  const objectiveMap = new Map(); // listName → cards[]
  okrCards.forEach(c => {
    if (!objectiveMap.has(c.listName)) objectiveMap.set(c.listName, []);
    objectiveMap.get(c.listName).push(c);
  });

  // Helper: compute progress % for a KR card
  function krProgress(card) {
    const { done, total } = card.checklistProgress || {};
    if (total > 0) return Math.round((done / total) * 100);
    if (card.dueComplete) return 100;
    return 0;
  }

  function applyPortfolioFilters(cards) {
    return cards.filter(c => {
      if (labelFilter && !(c.labels || []).some(l => l.name === labelFilter)) return false;
      if (memberFilter && !(c.members || []).some(m => m.id === memberFilter)) return false;
      return true;
    });
  }

  function filterBarHtml() {
    const labelChips = allLabels.map(l => {
      const active = labelFilter === l.name;
      const color = labelColor(l.color);
      return `<button class="filter-chip okr-label-filter${active ? " active" : ""}" data-label="${esc(l.name)}" style="${active ? `background:${color};border-color:${color};color:#fff` : ""}">${esc(l.name)}</button>`;
    }).join("");
    const memberChips = allMembers.map(m =>
      `<button class="filter-chip okr-member-filter${memberFilter === m.id ? " active" : ""}" data-member-id="${esc(m.id)}">${esc(m.fullName || m.username || m.id)}</button>`
    ).join("");
    if (!labelChips && !memberChips) return "";
    return `
      <div class="filters filters-row2" style="margin-bottom:12px">
        ${labelChips ? `<span class="at-chip-label">Label:</span>${labelChips}` : ""}
        ${labelChips && memberChips ? `<span class="at-chip-divider"></span>` : ""}
        ${memberChips ? `<span class="at-chip-label">Owner:</span>${memberChips}` : ""}
      </div>`;
  }

  function bindPortfolioFilters() {
    content.querySelectorAll(".okr-label-filter").forEach(btn => {
      btn.onclick = () => {
        labelFilter = labelFilter === btn.dataset.label ? "" : btn.dataset.label;
        drillCard = null;
        renderOverview();
      };
    });
    content.querySelectorAll(".okr-member-filter").forEach(btn => {
      btn.onclick = () => {
        memberFilter = memberFilter === btn.dataset.memberId ? "" : btn.dataset.memberId;
        drillCard = null;
        renderOverview();
      };
    });
  }

  // Helper: find project cards linked to a KR by label name match
  function linkedCards(krCard) {
    const krLabels = new Set((krCard.labels || []).map(l => l.name).filter(Boolean));
    if (!krLabels.size) return [];
    return applyPortfolioFilters(projectCards).filter(c =>
      (c.labels || []).some(l => krLabels.has(l.name))
    );
  }

  function krProgressLabel(card) {
    const { done, total } = card.checklistProgress || {};
    if (total > 0) return `${done}/${total} checklist`;
    if (card.dueComplete) return "Due complete";
    return "No checklist";
  }

  function linkedStats(cards) {
    const now = new Date();
    const overdue = cards.filter(c => c.due && new Date(c.due) < now && !c.dueComplete);
    const done = cards.filter(c => c.dueComplete);
    const upcoming = cards.filter(c => c.due && new Date(c.due) >= now && !c.dueComplete)
      .sort((a, b) => new Date(a.due) - new Date(b.due));
    return { overdue, done, upcoming, nextDue: upcoming[0] || null };
  }

  function visibleKrsFor(krCards) {
    return labelFilter || memberFilter
      ? krCards.filter(card => linkedCards(card).length > 0)
      : krCards;
  }

  function averageProgress(krCards) {
    if (!krCards.length) return 0;
    const total = krCards.reduce((sum, card) => sum + krProgress(card), 0);
    return Math.round(total / krCards.length);
  }

  // OKR drill-down state: null = overview, cardId = KR detail
  let drillCard = null;

  function renderDetail(krCard) {
    const linked = linkedCards(krCard);
    const { overdue, upcoming, done } = linkedStats(linked);
    const filterHint = labelFilter || memberFilter
      ? "The current label/member filter may hide linked project cards."
      : "Add labels to this KR card that match labels on project board cards.";

    content.innerHTML = `
      <div class="okr-detail">
        <button class="btn btn-ghost btn-xs okr-back-btn">← Back to OKR Overview</button>
        <div class="okr-detail-header">
          <div class="okr-detail-title">${esc(krCard.name)}</div>
          <div class="okr-detail-meta">
            ${esc(krCard.boardName)} · ${esc(krCard.listName)}
            ${krCard.due ? ` · Due ${formatThaiDateTime(krCard.due, false)}` : ""}
          </div>
        </div>
        <div class="okr-detail-stats">
          <div class="okr-stat"><span class="okr-stat-num">${linked.length}</span><span class="okr-stat-label">Linked Tasks</span></div>
          <div class="okr-stat"><span class="okr-stat-num" style="color:var(--danger)">${overdue.length}</span><span class="okr-stat-label">Overdue</span></div>
          <div class="okr-stat"><span class="okr-stat-num" style="color:var(--success)">${done.length}</span><span class="okr-stat-label">Done</span></div>
          <div class="okr-stat"><span class="okr-stat-num">${upcoming.length}</span><span class="okr-stat-label">Upcoming</span></div>
        </div>
        ${linked.length ? `
        <div class="okr-linked-table">
          <div class="task-table-head" style="grid-template-columns:1fr 130px 110px 90px"><div>TASK</div><div>BOARD</div><div>DUE</div><div>STATUS</div></div>
          <div class="task-table-body">
            ${linked.map(c => `
              <div class="task-row" style="grid-template-columns:1fr 130px 110px 90px">
                <div class="task-title">
                  ${esc(c.name)}
                  ${(c.labels || []).filter(l => l.name).map(l => `<span class="task-label-chip" style="background:${labelColor(l.color)}">${esc(l.name)}</span>`).join("")}
                </div>
                <div class="task-board">${esc(c.boardName)}</div>
                <div>${c.due ? buildDueBadge(c.due, c.dueComplete) : '<span style="color:#bbb">—</span>'}</div>
                <div>${c.dueComplete ? '<span class="due-badge due-complete">Done</span>' : '<span style="color:#aaa;font-size:12px">Active</span>'}</div>
              </div>`).join("")}
          </div>
        </div>` : `<div class="empty-state okr-empty-state"><h3>No linked project cards</h3><p>${filterHint}</p></div>`}
      </div>`;

    content.querySelector(".okr-back-btn").onclick = () => { drillCard = null; renderOverview(); };
  }

  function renderOverview() {
    const filtersActive = Boolean(labelFilter || memberFilter);
    const visibleObjectives = [...objectiveMap.entries()]
      .map(([objName, krCards]) => ({ objName, krCards: visibleKrsFor(krCards) }))
      .filter(obj => obj.krCards.length > 0);
    const visibleKrs = visibleObjectives.flatMap(obj => obj.krCards);
    const visibleLinked = visibleKrs.flatMap(card => linkedCards(card));
    const visibleLinkedIds = new Set(visibleLinked.map(c => c.id));
    const uniqueLinked = [...visibleLinkedIds].map(id => visibleLinked.find(c => c.id === id));
    const summaryStats = linkedStats(uniqueLinked);
    const overallProgress = averageProgress(visibleKrs);

    const objectivesHtml = visibleObjectives.map(({ objName, krCards: visibleKrs }) => {
      const avgProg = averageProgress(visibleKrs);
      const objectiveLinked = visibleKrs.flatMap(card => linkedCards(card));
      const objectiveLinkedIds = new Set(objectiveLinked.map(c => c.id));
      const objectiveUniqueLinked = [...objectiveLinkedIds].map(id => objectiveLinked.find(c => c.id === id));
      const objectiveStats = linkedStats(objectiveUniqueLinked);

      const krsHtml = visibleKrs.map(card => {
        const prog = krProgress(card);
        const linked = linkedCards(card);
        const stats = linkedStats(linked);

        return `
          <div class="okr-kr-row" data-card-id="${card.id}">
            <div class="okr-kr-main">
              <div class="okr-kr-name">${esc(card.name)}</div>
              <div class="okr-kr-submeta">${esc(krProgressLabel(card))}</div>
            </div>
            <div class="okr-kr-progress">
              <div class="okr-progress-bar"><div class="okr-progress-fill" style="width:${prog}%"></div></div>
              <span class="okr-progress-pct">${prog}%</span>
            </div>
            <div class="okr-kr-meta">
              ${linked.length ? `<span class="okr-meta-tag">${linked.length} task${linked.length !== 1 ? "s" : ""}</span>` : ""}
              ${stats.done.length ? `<span class="okr-meta-tag okr-meta-done">${stats.done.length} done</span>` : ""}
              ${stats.overdue.length ? `<span class="okr-meta-tag okr-meta-overdue">${stats.overdue.length} overdue</span>` : ""}
              ${stats.nextDue ? `<span class="okr-meta-tag">Next: ${formatThaiDateTime(stats.nextDue.due)}</span>` : ""}
              ${!linked.length ? `<span class="okr-meta-tag" style="color:var(--text-faint)">No linked tasks</span>` : ""}
            </div>
          </div>`;
      }).join("");

      return `
        <div class="okr-objective">
          <div class="okr-objective-header">
            <div class="okr-objective-name">${esc(objName)}</div>
            <div class="okr-objective-stats">
              <span>${visibleKrs.length} KR${visibleKrs.length !== 1 ? "s" : ""}</span>
              <span>${objectiveUniqueLinked.length} linked task${objectiveUniqueLinked.length !== 1 ? "s" : ""}</span>
              ${objectiveStats.overdue.length ? `<span class="okr-stat-danger">${objectiveStats.overdue.length} overdue</span>` : ""}
            </div>
            <div class="okr-objective-progress">
              <div class="okr-progress-bar okr-progress-bar--lg"><div class="okr-progress-fill" style="width:${avgProg}%"></div></div>
              <span class="okr-progress-pct">${avgProg}%</span>
            </div>
          </div>
          <div class="okr-kr-list">${krsHtml}</div>
        </div>`;
    }).join("");

    content.innerHTML = `
      <div class="okr-overview">
        <div class="okr-board-label">Source: ${okrBoards.map(b => esc(b.name)).join(", ")}</div>
        ${filterBarHtml()}
        ${visibleKrs.length ? `
          <div class="okr-summary-grid">
            <div class="okr-summary-card"><span class="okr-summary-num">${visibleObjectives.length}</span><span class="okr-summary-label">Objectives</span></div>
            <div class="okr-summary-card"><span class="okr-summary-num">${visibleKrs.length}</span><span class="okr-summary-label">Key Results</span></div>
            <div class="okr-summary-card"><span class="okr-summary-num">${overallProgress}%</span><span class="okr-summary-label">Avg Progress</span></div>
            <div class="okr-summary-card"><span class="okr-summary-num">${uniqueLinked.length}</span><span class="okr-summary-label">Linked Tasks</span></div>
            <div class="okr-summary-card"><span class="okr-summary-num" style="color:var(--danger)">${summaryStats.overdue.length}</span><span class="okr-summary-label">Overdue</span></div>
          </div>` : ""}
        ${objectivesHtml || `<div class="empty-state okr-empty-state"><h3>${filtersActive ? "No OKRs match this filter" : "No OKR cards yet"}</h3><p>${filtersActive ? "Try clearing the active label/member filter or link matching project cards to the KR labels." : "Create Key Result cards in the OKR board to populate this progress view."}</p></div>`}
      </div>`;

    bindPortfolioFilters();
    content.querySelectorAll(".okr-kr-row").forEach(row => {
      row.onclick = () => {
        drillCard = okrCards.find(c => c.id === row.dataset.cardId);
        if (drillCard) renderDetail(drillCard);
      };
    });
  }

  renderOverview();
}
