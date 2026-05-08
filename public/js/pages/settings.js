// Implemented by: Codex Dev (2026-05-07)

// ── Settings Page ─────────────────────────────────────────────────────────────
function showSettingsPage() {
  try {
    S.mode = "settings";
    S.currentBoardId = null;
    S.currentGroupId = null;
    $("board-title").textContent = "Settings";
    $("board-subtitle").textContent = "";
    $("add-list-btn").classList.add("hidden");

    const calConnected = CAL.status?.connected;

    const page = document.createElement("div");
    page.className = "settings-page";


  // ── 1. Integrations ──
  const intSection = document.createElement("div");
  intSection.className = "settings-section";
  intSection.innerHTML = `
    <div class="settings-section-header">Integrations</div>
    <div class="settings-section-body">
      <div class="integration-row">
        <span class="integration-icon">🔷</span>
        <div class="integration-info">
          <div class="integration-name">Trello</div>
          <div class="integration-desc">Connected via API Key</div>
        </div>
        <div class="integration-status-dot dot-green"></div>
        <span class="chip chip-done">Connected</span>
      </div>
      <div class="integration-row">
        <span class="integration-icon">📅</span>
        <div class="integration-info">
          <div class="integration-name">Google Calendar</div>
          <div class="integration-desc">${calConnected ? "OAuth connected" : "Not connected"}</div>
        </div>
        <div class="integration-status-dot ${calConnected ? "dot-green" : "dot-gray"}"></div>
        ${calConnected
          ? '<span class="chip chip-done">Connected</span>'
          : '<button class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect</button>'
        }
      </div>
      <div class="integration-row">
        <span class="integration-icon">${calConnected ? "📋" : "📋"}</span>
        <div class="integration-info">
          <div class="integration-name">Google Tasks</div>
          <div class="integration-desc">${calConnected
            ? "Uses Google Calendar OAuth"
            : "Requires Google Calendar connection"}</div>
        </div>
        <div class="integration-status-dot ${calConnected ? "dot-green" : "dot-gray"}"></div>
        ${calConnected
          ? '<span class="chip" style="background:#e0f2fe;color:#0369a1;border-color:#bae6fd">Shared with Calendar</span>'
          : '<button class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect Calendar</button>'
        }
      </div>
    </div>
  `;
  page.appendChild(intSection);

  const paperclipSection = document.createElement("div");
  paperclipSection.className = "settings-section";
  paperclipSection.innerHTML = `
    <div class="settings-section-header">Paperclip Integration</div>
    <div class="settings-section-body" id="settings-paperclip-body">
      <div class="loading-box" style="height:60px"><span class="spinner"></span> Loading...</div>
    </div>
  `;
  page.appendChild(paperclipSection);

  // ── 2. Workspaces ──
  const wsSection = document.createElement("div");
  wsSection.className = "settings-section";
  wsSection.innerHTML = `
    <div class="settings-section-header">
      <span>Workspaces</span>
    </div>
    <div class="settings-section-body" id="settings-ws-body">
      <div class="loading-box" style="height:60px"><span class="spinner"></span> Loading...</div>
    </div>
  `;
  page.appendChild(wsSection);

  // ── 3. Board Visibility ──
  const visSection = document.createElement("div");
  visSection.className = "settings-section";
  visSection.innerHTML = `
    <div class="settings-section-header">Board Visibility</div>
    <div class="settings-section-body" id="settings-vis-body"></div>
  `;
  page.appendChild(visSection);

  // ── 4. Monitor Teams ──
  const teamSection = document.createElement("div");
  teamSection.className = "settings-section";
  teamSection.innerHTML = `
    <div class="settings-section-header">Monitor Teams (Labels)</div>
    <div class="settings-section-body" id="settings-teams-body"></div>
  `;
  page.appendChild(teamSection);

  // ── 5. BU Groups ──
  const groupSection = document.createElement("div");
  groupSection.className = "settings-section";
  groupSection.innerHTML = `
    <div class="settings-section-header">
      <span>Business Unit Groups</span>
      <button class="btn btn-primary btn-sm" id="settings-add-group-btn">+ New Group</button>
    </div>
    <div class="settings-section-body" id="settings-groups-body"></div>
  `;
  page.appendChild(groupSection);

  const content = $("board-content");
  content.innerHTML = "";
  content.appendChild(page);

  // Initialize draft config for inline editing
  S.draftConfig = JSON.parse(JSON.stringify(S.config));
  if (!S.draftConfig.allowedWorkspaceIds) S.draftConfig.allowedWorkspaceIds = [];

  // Render visibility editor inline
  renderSettingsVisibility();
  renderSettingsTeams();
  renderSettingsGroups();
  loadPaperclipConnection();
  loadSettingsWorkspaces();

  // Add group button
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
  loadSettingsWorkspaces();
} catch (e) {
  console.error("[Settings Error]", e);
  $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><h3>Settings error</h3><p>${esc(e.message)}</p></div>`;
}
}

function paperclipStatusChip(status) {
  if (status === "connected") return '<span class="chip chip-done">Connected</span>';
  if (status === "disabled") return '<span class="chip chip-soon">Disabled</span>';
  return '<span class="chip chip-soon">Not connected</span>';
}

async function loadPaperclipConnection() {
  const container = $("settings-paperclip-body");
  if (!container) return;
  try {
    const connection = await api.get("/api/integrations/paperclip/connection");
    renderPaperclipConnection(connection);
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger)">Connection status failed: ${esc(e.message)}</p>`;
  }
}

function renderPaperclipConnection(connection) {
  const container = $("settings-paperclip-body");
  if (!container) return;
  const connected = connection.status === "connected";
  const statusText = connected
    ? "Ready for future live webhook validation. Shared secret is configured."
    : connection.status === "disabled"
      ? "Disconnected. Future live webhook requests must be rejected."
      : "Paste a shared secret to enable future live webhook validation.";

  container.innerHTML = `
    <div class="integration-row" style="padding-top:0">
      <span class="integration-icon">PC</span>
      <div class="integration-info">
        <div class="integration-name">Paperclip</div>
        <div class="integration-desc">${esc(statusText)}</div>
      </div>
      <div class="integration-status-dot ${connected ? "dot-green" : "dot-gray"}"></div>
      ${paperclipStatusChip(connection.status)}
    </div>
    <div class="form-row" style="margin-top:14px">
      <div class="form-group">
        <label for="paperclip-workspace-id">Workspace ID <span class="label-hint">optional</span></label>
        <input id="paperclip-workspace-id" class="form-input" type="text" value="${esc(connection.workspaceId || "")}" placeholder="Paperclip workspace id">
      </div>
      <div class="form-group">
        <label for="paperclip-label">Label <span class="label-hint">optional</span></label>
        <input id="paperclip-label" class="form-input" type="text" value="${esc(connection.label || "")}" placeholder="Internal label">
      </div>
    </div>
    <div class="form-group">
      <label for="paperclip-shared-secret">Shared secret <span class="label-hint">write-only, not returned after save</span></label>
      <input id="paperclip-shared-secret" class="form-input" type="password" placeholder="${connected ? "Enter a new secret to rotate" : "Enter shared secret from Paperclip"}" autocomplete="off">
    </div>
    <div class="form-group">
      <label>Future webhook URL</label>
      <input class="form-input" type="text" value="${esc(connection.webhookUrl || connection.webhookPath || "")}" readonly>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" id="paperclip-connect-btn">${connected ? "Update Connection" : "Connect Paperclip"}</button>
      <button class="btn btn-sm" id="paperclip-rotate-btn" ${connected ? "" : "disabled"}>Rotate Secret</button>
      <button class="btn btn-danger btn-sm" id="paperclip-disconnect-btn" ${connected ? "" : "disabled"}>Disconnect</button>
    </div>
  `;

  $("paperclip-connect-btn").onclick = connectPaperclip;
  $("paperclip-rotate-btn").onclick = rotatePaperclipSecret;
  $("paperclip-disconnect-btn").onclick = disconnectPaperclip;
}

function paperclipConnectionPayload() {
  return {
    workspaceId: $("paperclip-workspace-id")?.value || "",
    label: $("paperclip-label")?.value || "",
    sharedSecret: $("paperclip-shared-secret")?.value || "",
  };
}

async function connectPaperclip() {
  try {
    await api.post("/api/integrations/paperclip/connection/connect", paperclipConnectionPayload());
    toast("Paperclip connected");
    await loadPaperclipConnection();
  } catch (e) {
    toast("Paperclip connect failed: " + e.message, true);
  }
}

async function rotatePaperclipSecret() {
  try {
    await api.post("/api/integrations/paperclip/connection/rotate-secret", {
      sharedSecret: $("paperclip-shared-secret")?.value || "",
    });
    toast("Paperclip secret rotated");
    await loadPaperclipConnection();
  } catch (e) {
    toast("Paperclip rotate failed: " + e.message, true);
  }
}

async function disconnectPaperclip() {
  try {
    await api.post("/api/integrations/paperclip/connection/disconnect", {});
    toast("Paperclip disconnected");
    await loadPaperclipConnection();
  } catch (e) {
    toast("Paperclip disconnect failed: " + e.message, true);
  }
}

function renderSettingsVisibility() {
  const container = $("settings-vis-body");
  if (!container) return;
  container.innerHTML = "";
  const hidden = new Set(S.draftConfig.hiddenBoards);

  if (!S.boards.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No boards loaded</p>';
    return;
  }

  S.boards.forEach((board, i) => {
    const isHidden = hidden.has(board.id);
    const row = document.createElement("div");
    row.className = "vis-row";
    row.innerHTML = `
      <span class="vis-dot" style="background:${COLORS[i % COLORS.length]}"></span>
      <span class="vis-name" title="${esc(board.name)}">${esc(board.name)}</span>
      <button class="vis-toggle${isHidden ? " hidden-toggle" : ""}" data-bid="${board.id}">
        ${isHidden ? "🙈 Hidden" : "👁 Visible"}
      </button>
    `;
    row.querySelector(".vis-toggle").onclick = async function() {
      const bid = this.dataset.bid;
      const idx = S.draftConfig.hiddenBoards.indexOf(bid);
      if (idx === -1) {
        S.draftConfig.hiddenBoards.push(bid);
        this.textContent = "🙈 Hidden";
        this.classList.add("hidden-toggle");
        S.draftConfig.groups.forEach(g => {
          const bi = g.boardIds.indexOf(bid);
          if (bi !== -1) g.boardIds.splice(bi, 1);
        });
      } else {
        S.draftConfig.hiddenBoards.splice(idx, 1);
        this.textContent = "👁 Visible";
        this.classList.remove("hidden-toggle");
      }
      await saveSettingsConfig();
    };
    container.appendChild(row);
  });
}

function renderSettingsTeams() {
  const container = $("settings-teams-body");
  if (!container) return;
  if (!S.draftConfig.monitorTeams) S.draftConfig.monitorTeams = [];

  container.innerHTML = `
    <p style="color:var(--text-muted);font-size:12px;margin-bottom:12px">Define labels that represent teams for the Monitor view. You can add or remove them as needed.</p>
    <div class="teams-editor-wrap">
      <div class="teams-chips-list">
        ${S.draftConfig.monitorTeams.map((team, idx) => `
          <span class="team-manage-chip">
            ${esc(team)}
            <button class="team-del-btn" data-idx="${idx}">×</button>
          </span>
        `).join("")}
      </div>
      <div class="team-add-row" style="margin-top:12px;display:flex;gap:8px">
        <input type="text" id="new-team-input" class="form-control" style="flex:1" placeholder="Add new team label (e.g. Design)...">
        <button class="btn btn-primary btn-sm" id="add-team-btn">Add Team</button>
      </div>
    </div>
  `;

  container.querySelectorAll(".team-del-btn").forEach(btn => {
    btn.onclick = async () => {
      const idx = parseInt(btn.dataset.idx);
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
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No groups yet. Click "+ New Group" to create one.</p>';
    return;
  }

  S.draftConfig.groups.forEach((group, gi) => {
    const row = document.createElement("div");
    row.className = "group-edit-row";
    const assignedBoards = new Set(group.boardIds);
    row.innerHTML = `
      <div class="group-edit-header">
        <input type="color" class="group-color-picker" value="${group.color || "#6366f1"}" data-gi="${gi}">
        <input type="text" class="group-edit-name" value="${esc(group.name)}" placeholder="Group name..." data-gi="${gi}">
        <button class="group-del-btn" data-gi="${gi}" title="Delete group">🗑</button>
      </div>
      <div class="group-boards-selector" data-gi="${gi}">
        ${S.boards.filter(b => !S.config.hiddenBoards.includes(b.id)).map(b => `
          <span class="board-chip${assignedBoards.has(b.id) ? " selected" : ""}" data-bid="${b.id}" data-gi="${gi}">${esc(b.name)}</span>
        `).join("")}
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
      container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">ไม่พบ Workspace ใน Trello account นี้</p>';
      return;
    }
    if (S.draftConfig.allowedWorkspaceIds.length === 0) {
      S.draftConfig.allowedWorkspaceIds = workspaces.map(ws => ws.id);
    }
    container.innerHTML = "";
    workspaces.forEach(ws => {
      const isChecked = S.draftConfig.allowedWorkspaceIds.includes(ws.id);
      const row = document.createElement("div");
      row.className = "ws-row";
      row.innerHTML = `
        <label class="ws-label">
          <input type="checkbox" class="ws-check" data-wsid="${ws.id}" ${isChecked ? "checked" : ""}>
          <span>🏢 ${esc(ws.displayName || ws.name)}</span>
        </label>
        <span style="font-size:11px;color:var(--text-muted)">${esc(ws.name)}</span>
      `;
      row.querySelector(".ws-check").onchange = async function() {
        const wsId = this.dataset.wsid;
        if (this.checked) {
          if (!S.draftConfig.allowedWorkspaceIds.includes(wsId))
            S.draftConfig.allowedWorkspaceIds.push(wsId);
        } else {
          S.draftConfig.allowedWorkspaceIds = S.draftConfig.allowedWorkspaceIds.filter(id => id !== wsId);
        }
        await saveSettingsConfig();
      };
      container.appendChild(row);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger)">⚠ ${e.message}</p>`;
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
    toast("Saved ✓");
  } catch (e) {
    toast("Save failed: " + e.message, true);
  }
}
