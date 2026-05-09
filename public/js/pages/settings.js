// Implemented by: Codex Dev (2026-05-07)
// V0.2-W2-06 Settings polish implemented by Codex Dev.

// Settings Page
function showSettingsPage() {
  try {
    S.mode = "settings";
    S.currentBoardId = null;
    S.currentGroupId = null;
    $("board-title").textContent = "Settings";
    $("board-subtitle").textContent = "Connections and workspace controls";
    $("add-list-btn").classList.add("hidden");

    const calConnected = CAL.status?.connected;
    const config = S.config || {};
    const hiddenCount = (config.hiddenBoards || []).length;
    const workspaceCount = (config.allowedWorkspaceIds || []).length;
    const boardCount = S.boards?.length || 0;

    const page = document.createElement("div");
    page.className = "settings-page";
    page.innerHTML = `
      <section class="settings-command-panel" aria-labelledby="settings-title">
        <div class="settings-command-copy">
          <div class="settings-kicker">Workspace controls</div>
          <h2 id="settings-title" class="settings-title">Settings</h2>
          <p class="settings-subtitle">Manage connected services, visible workspaces, board scope, monitor labels, and business-unit grouping.</p>
        </div>
        <div class="settings-command-stats" aria-label="Settings summary">
          <div class="settings-stat-card is-ok">
            <span class="settings-stat-label">Trello</span>
            <strong>${boardCount ? "Connected" : "Ready"}</strong>
          </div>
          <div class="settings-stat-card ${calConnected ? "is-ok" : "is-muted"}">
            <span class="settings-stat-label">Calendar</span>
            <strong>${calConnected ? "Connected" : "Offline"}</strong>
          </div>
          <div class="settings-stat-card">
            <span class="settings-stat-label">Workspaces</span>
            <strong>${workspaceCount || "All"}</strong>
          </div>
          <div class="settings-stat-card ${hiddenCount ? "is-warning" : ""}">
            <span class="settings-stat-label">Hidden boards</span>
            <strong>${hiddenCount}</strong>
          </div>
        </div>
      </section>

      <div class="settings-layout">
        <aside class="settings-nav-panel" aria-label="Settings sections">
          <button type="button" class="settings-nav-button" data-target="settings-integrations">${icon("gitMerge")} Integrations</button>
          <button type="button" class="settings-nav-button" data-target="settings-workspaces">${icon("layout")} Workspaces</button>
          <button type="button" class="settings-nav-button" data-target="settings-visibility">${icon("checkSquare")} Board Visibility</button>
          <button type="button" class="settings-nav-button" data-target="settings-teams">${icon("target")} Monitor Teams</button>
          <button type="button" class="settings-nav-button" data-target="settings-groups">${icon("settings")} Business Units</button>
        </aside>

        <div class="settings-stack">
          <section class="settings-section" id="settings-integrations">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Connections</div>
                <h3 class="settings-section-title">Integrations</h3>
                <p class="settings-section-desc">Connection state only. Approval and sync behavior remains unchanged.</p>
              </div>
            </div>
            <div class="settings-section-body">
              <div class="integration-row">
                <span class="settings-integration-icon">${icon("layout")}</span>
                <div class="integration-info">
                  <div class="integration-name">Trello</div>
                  <div class="integration-desc">Connected via configured API credentials.</div>
                </div>
                <span class="settings-status-chip is-connected">Connected</span>
              </div>
              <div class="integration-row">
                <span class="settings-integration-icon">${icon("calendar")}</span>
                <div class="integration-info">
                  <div class="integration-name">Google Calendar</div>
                  <div class="integration-desc">${calConnected ? "OAuth connected." : "Connect OAuth before selecting calendar sync paths."}</div>
                </div>
                ${calConnected
                  ? '<span class="settings-status-chip is-connected">Connected</span>'
                  : '<button type="button" class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect</button>'}
              </div>
              <div class="integration-row">
                <span class="settings-integration-icon">${icon("checkSquare")}</span>
                <div class="integration-info">
                  <div class="integration-name">Google Tasks</div>
                  <div class="integration-desc">${calConnected ? "Uses the Google Calendar OAuth connection." : "Requires Google Calendar connection first."}</div>
                </div>
                ${calConnected
                  ? '<span class="settings-status-chip is-shared">Shared OAuth</span>'
                  : '<button type="button" class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect Calendar</button>'}
              </div>
            </div>
          </section>

          <section class="settings-section" id="settings-workspaces">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Scope</div>
                <h3 class="settings-section-title">Workspaces</h3>
                <p class="settings-section-desc">Choose which Trello workspaces are included in the app shell.</p>
              </div>
            </div>
            <div class="settings-section-body" id="settings-ws-body">
              <div class="loading-box"><span class="spinner"></span> Loading workspaces...</div>
            </div>
          </section>

          <section class="settings-section" id="settings-visibility">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Boards</div>
                <h3 class="settings-section-title">Board Visibility</h3>
                <p class="settings-section-desc">Hide noisy boards without changing Trello data.</p>
              </div>
            </div>
            <div class="settings-section-body" id="settings-vis-body"></div>
          </section>

          <section class="settings-section" id="settings-teams">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Labels</div>
                <h3 class="settings-section-title">Monitor Teams</h3>
                <p class="settings-section-desc">Define labels that should be treated as team filters in Monitor.</p>
              </div>
            </div>
            <div class="settings-section-body" id="settings-teams-body"></div>
          </section>

          <section class="settings-section" id="settings-groups">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Navigation</div>
                <h3 class="settings-section-title">Business Unit Groups</h3>
                <p class="settings-section-desc">Group boards for the sidebar while preserving the underlying Trello board structure.</p>
              </div>
              <button type="button" class="btn btn-primary btn-sm settings-section-action" id="settings-add-group-btn">New Group</button>
            </div>
            <div class="settings-section-body" id="settings-groups-body"></div>
          </section>
        </div>
      </div>
    `;

    const content = $("board-content");
    content.innerHTML = "";
    content.appendChild(page);

    S.draftConfig = JSON.parse(JSON.stringify(S.config || {}));
    if (!Array.isArray(S.draftConfig.groups)) S.draftConfig.groups = [];
    if (!Array.isArray(S.draftConfig.hiddenBoards)) S.draftConfig.hiddenBoards = [];
    if (!Array.isArray(S.draftConfig.allowedWorkspaceIds)) S.draftConfig.allowedWorkspaceIds = [];
    if (!Array.isArray(S.draftConfig.monitorTeams)) S.draftConfig.monitorTeams = [];

    renderSettingsVisibility();
    renderSettingsTeams();
    renderSettingsGroups();
    loadSettingsWorkspaces();

    page.querySelectorAll(".settings-nav-button").forEach(btn => {
      btn.onclick = () => $(btn.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("settings-add-group-btn").onclick = () => {
      S.draftConfig.groups.push({
        id: "g_" + Date.now(),
        name: "New Group",
        color: COLORS[S.draftConfig.groups.length % COLORS.length],
        boardIds: [],
      });
      renderSettingsGroups();
      setTimeout(() => {
        const inputs = $("settings-groups-body").querySelectorAll(".group-edit-name");
        inputs[inputs.length - 1]?.focus();
        inputs[inputs.length - 1]?.select();
      }, 50);
    };
  } catch (e) {
    console.error("[Settings Error]", e);
    $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">${icon("alert")}</div><h3>Settings error</h3><p>${esc(e.message)}</p></div>`;
  }
}

function renderSettingsVisibility() {
  const container = $("settings-vis-body");
  if (!container) return;
  container.innerHTML = "";
  const hidden = new Set(S.draftConfig.hiddenBoards || []);

  if (!S.boards.length) {
    container.innerHTML = '<div class="settings-empty-inline">No boards loaded yet.</div>';
    return;
  }

  S.boards.forEach((board, i) => {
    const isHidden = hidden.has(board.id);
    const row = document.createElement("div");
    row.className = "vis-row";
    row.innerHTML = `
      <span class="vis-dot" style="background:${COLORS[i % COLORS.length]}"></span>
      <span class="vis-name" title="${esc(board.name)}">${esc(board.name)}</span>
      <button type="button" class="vis-toggle${isHidden ? " hidden-toggle" : ""}" data-bid="${board.id}">
        ${isHidden ? "Hidden" : "Visible"}
      </button>
    `;
    row.querySelector(".vis-toggle").onclick = async function() {
      const bid = this.dataset.bid;
      const idx = S.draftConfig.hiddenBoards.indexOf(bid);
      if (idx === -1) {
        S.draftConfig.hiddenBoards.push(bid);
        this.textContent = "Hidden";
        this.classList.add("hidden-toggle");
        S.draftConfig.groups.forEach(g => {
          const bi = g.boardIds.indexOf(bid);
          if (bi !== -1) g.boardIds.splice(bi, 1);
        });
      } else {
        S.draftConfig.hiddenBoards.splice(idx, 1);
        this.textContent = "Visible";
        this.classList.remove("hidden-toggle");
      }
      await saveSettingsConfig();
      renderSettingsGroups();
    };
    container.appendChild(row);
  });
}

function renderSettingsTeams() {
  const container = $("settings-teams-body");
  if (!container) return;
  if (!Array.isArray(S.draftConfig.monitorTeams)) S.draftConfig.monitorTeams = [];

  container.innerHTML = `
    <p class="settings-section-note">Team labels are saved immediately and reused by the Monitor view.</p>
    <div class="teams-editor-wrap">
      <div class="teams-chips-list">
        ${S.draftConfig.monitorTeams.length ? S.draftConfig.monitorTeams.map((team, idx) => `
          <span class="team-manage-chip">
            ${esc(team)}
            <button type="button" class="team-del-btn" data-idx="${idx}" aria-label="Remove ${esc(team)}">x</button>
          </span>
        `).join("") : '<div class="settings-empty-inline">No monitor team labels yet.</div>'}
      </div>
      <div class="settings-inline-editor">
        <input type="text" id="new-team-input" class="form-control" placeholder="Add team label, e.g. Design">
        <button type="button" class="btn btn-primary btn-sm" id="add-team-btn">Add Team</button>
      </div>
    </div>
  `;

  container.querySelectorAll(".team-del-btn").forEach(btn => {
    btn.onclick = async () => {
      const idx = parseInt(btn.dataset.idx, 10);
      S.draftConfig.monitorTeams.splice(idx, 1);
      renderSettingsTeams();
      await saveSettingsConfig();
    };
  });

  const addFn = async () => {
    const input = $("new-team-input");
    const val = input.value.trim();
    if (val && !S.draftConfig.monitorTeams.includes(val)) {
      S.draftConfig.monitorTeams.push(val);
      renderSettingsTeams();
      await saveSettingsConfig();
    }
    input.value = "";
    input.focus();
  };

  $("add-team-btn").onclick = addFn;
  $("new-team-input").onkeydown = e => { if (e.key === "Enter") addFn(); };
}

function renderSettingsGroups() {
  const container = $("settings-groups-body");
  if (!container) return;
  container.innerHTML = "";

  if (!S.draftConfig.groups.length) {
    container.innerHTML = '<div class="settings-empty-inline">No groups yet. Create a group to cluster boards in the sidebar.</div>';
    return;
  }

  S.draftConfig.groups.forEach((group, gi) => {
    const row = document.createElement("div");
    row.className = "group-edit-row";
    const assignedBoards = new Set(group.boardIds || []);
    row.innerHTML = `
      <div class="group-edit-header">
        <input type="color" class="group-color-picker" value="${group.color || "#6366f1"}" data-gi="${gi}" aria-label="Group color">
        <input type="text" class="group-edit-name" value="${esc(group.name)}" placeholder="Group name" data-gi="${gi}">
        <button type="button" class="group-del-btn" data-gi="${gi}" title="Delete group">Delete</button>
      </div>
      <div class="group-boards-selector" data-gi="${gi}">
        ${S.boards.filter(b => !(S.draftConfig.hiddenBoards || []).includes(b.id)).map(b => `
          <button type="button" class="board-chip${assignedBoards.has(b.id) ? " selected" : ""}" data-bid="${b.id}" data-gi="${gi}">${esc(b.name)}</button>
        `).join("") || '<div class="settings-empty-inline">No visible boards available for this group.</div>'}
      </div>
    `;

    row.querySelector(".group-color-picker").oninput = e => {
      S.draftConfig.groups[gi].color = e.target.value;
    };
    row.querySelector(".group-edit-name").oninput = e => {
      S.draftConfig.groups[gi].name = e.target.value;
    };
    row.querySelector(".group-edit-name").onblur = () => saveSettingsConfig();
    row.querySelector(".group-color-picker").onchange = () => saveSettingsConfig();
    row.querySelector(".group-del-btn").onclick = async () => {
      S.draftConfig.groups.splice(gi, 1);
      renderSettingsGroups();
      await saveSettingsConfig();
    };
    row.querySelectorAll(".board-chip").forEach(chip => {
      chip.onclick = async () => {
        const bid = chip.dataset.bid;
        if (!Array.isArray(S.draftConfig.groups[gi].boardIds)) S.draftConfig.groups[gi].boardIds = [];
        const idx = S.draftConfig.groups[gi].boardIds.indexOf(bid);
        if (idx === -1) S.draftConfig.groups[gi].boardIds.push(bid);
        else S.draftConfig.groups[gi].boardIds.splice(idx, 1);
        chip.classList.toggle("selected");
        await saveSettingsConfig();
      };
    });

    container.appendChild(row);
  });
}

async function loadSettingsWorkspaces() {
  const container = $("settings-ws-body");
  if (!container) return;
  try {
    const workspaces = await api.get("/api/workspaces");
    if (!workspaces.length) {
      container.innerHTML = '<div class="settings-empty-inline">No Trello workspaces were returned for this account.</div>';
      return;
    }
    if (S.draftConfig.allowedWorkspaceIds.length === 0) {
      S.draftConfig.allowedWorkspaceIds = workspaces.map(ws => ws.id);
    }
    container.innerHTML = `
      <p class="settings-section-note">${S.draftConfig.allowedWorkspaceIds.length === workspaces.length ? "All workspaces are visible." : `${S.draftConfig.allowedWorkspaceIds.length} of ${workspaces.length} workspaces visible.`}</p>
    `;
    workspaces.forEach(ws => {
      const isChecked = S.draftConfig.allowedWorkspaceIds.includes(ws.id);
      const row = document.createElement("div");
      row.className = "ws-row";
      row.innerHTML = `
        <label class="ws-label">
          <input type="checkbox" class="ws-check" data-wsid="${ws.id}" ${isChecked ? "checked" : ""}>
          <span>${esc(ws.displayName || ws.name)}</span>
        </label>
        <span class="ws-slug">${esc(ws.name)}</span>
      `;
      row.querySelector(".ws-check").onchange = async function() {
        const wsId = this.dataset.wsid;
        if (this.checked) {
          if (!S.draftConfig.allowedWorkspaceIds.includes(wsId)) S.draftConfig.allowedWorkspaceIds.push(wsId);
        } else {
          S.draftConfig.allowedWorkspaceIds = S.draftConfig.allowedWorkspaceIds.filter(id => id !== wsId);
        }
        await saveSettingsConfig();
      };
      container.appendChild(row);
    });
  } catch (e) {
    container.innerHTML = `<div class="settings-empty-inline is-error">${esc(e.message)}</div>`;
  }
}

async function saveSettingsConfig() {
  if (!S.draftConfig) return;
  try {
    await api.post("/api/config", S.draftConfig);
    S.config = JSON.parse(JSON.stringify(S.draftConfig));
    const boards = await api.get("/api/boards").catch(() => S.boards);
    S.boards = boards;
    S.allCardsCache = null;
    renderSidebar();
    toast("Saved");
  } catch (e) {
    toast("Save failed: " + e.message, true);
  }
}
