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
    const trelloConnection = trelloConnectionSummary();
    const hiddenCount = (config.hiddenBoards || []).length;
    const workspaceCount = (config.allowedWorkspaceIds || []).length;
    const trelloOwnerAction = trelloConnection.label === "Verified"
      ? "Runtime verified; board data can load."
      : "Runtime Owner action: verify or rotate Trello credentials.";

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
          <div class="settings-stat-card ${trelloConnection.statClass}">
            <span class="settings-stat-label">Trello</span>
            <strong>${esc(trelloConnection.label)}</strong>
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

      <section class="settings-readiness-strip" aria-label="Operational readiness">
        <div class="settings-readiness-item ${trelloConnection.statClass}">
          <span>Trello</span>
          <strong>${esc(trelloConnection.label)}</strong>
          <small>${esc(trelloOwnerAction)}</small>
        </div>
        <div class="settings-readiness-item ${calConnected ? "is-ok" : "is-muted"}">
          <span>Calendar</span>
          <strong>${calConnected ? "Connected" : "Owner action"}</strong>
          <small>${calConnected ? "OAuth connected for schedule context." : "Connect OAuth before calendar sync."}</small>
        </div>
        <div class="settings-readiness-item ${calConnected ? "is-ok" : "is-muted"}">
          <span>Google Tasks</span>
          <strong>${calConnected ? "Shared OAuth" : "Blocked"}</strong>
          <small>${calConnected ? "Uses the Calendar connection." : "Connect Calendar first."}</small>
        </div>
        <div class="settings-readiness-item is-warning">
          <span>Paperclip</span>
          <strong>Guarded controls</strong>
          <small>Secret is write-only; rotation and disconnect require confirmation.</small>
        </div>
        <div class="settings-readiness-item is-ok">
          <span>Review Queue</span>
          <strong>Human gate</strong>
          <small>External writes still require approval before execution.</small>
        </div>
      </section>

      <div class="settings-layout">
        <aside class="settings-nav-panel" aria-label="Settings sections">
          <button type="button" class="settings-nav-button" data-target="settings-integrations">${icon("gitMerge")} Integrations</button>
          <button type="button" class="settings-nav-button" data-target="settings-paperclip">${icon("sparkles")} Paperclip</button>
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
                  <div class="integration-desc">${esc(trelloConnection.description)}</div>
                </div>
                <span class="settings-status-chip ${trelloConnection.chipClass}">${esc(trelloConnection.label)}</span>
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

          <section class="settings-section" id="settings-paperclip">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Agent connector</div>
                <h3 class="settings-section-title">Paperclip Integration</h3>
                <p class="settings-section-desc">Manage connection state, runtime secret rotation, and live webhook readiness.</p>
              </div>
            </div>
            <div class="settings-section-body" id="settings-paperclip-body">
              <div class="loading-box"><span class="spinner"></span> Loading Paperclip connection...</div>
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
    loadPaperclipConnection();
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
    $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">${icon("alert")}</div><h3>Settings unavailable</h3><p>Settings could not load. Runtime Owner should check the connection health before changing integration controls.</p></div>`;
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
    const [connection, operations] = await Promise.all([
      api.get("/api/integrations/paperclip/connection"),
      api.get("/api/integrations/paperclip/operations/status").catch(() => null),
    ]);
    renderPaperclipConnection(connection, operations);
  } catch (e) {
    container.innerHTML = `
      <div class="settings-empty-inline is-error">
        Paperclip status is unavailable. Runtime/Paperclip Owner should check connector health; no secret value is exposed here.
      </div>
    `;
  }
}

function renderPaperclipConnection(connection, operations = null) {
  const container = $("settings-paperclip-body");
  if (!container) return;
  const connected = connection.status === "connected";
  const ops = operations || {};
  const live = ops.liveWebhook || {};
  const counts = ops.reviewQueue || {};
  const warnings = Array.isArray(ops.warnings) ? ops.warnings : [];
  const statusText = connected
    ? "Connected. Shared secret is configured but never shown; Review Queue remains the human gate."
    : connection.status === "disabled"
      ? "Disconnected. Live Paperclip intake must stay blocked until Runtime/Paperclip Owner reconnects it."
      : "Connection incomplete. Runtime/Paperclip Owner must configure a write-only shared secret; value is never shown.";
  const secretPlaceholder = connected ? "Enter a new secret to rotate" : "Enter shared secret from Paperclip";

  container.innerHTML = `
    <div class="integration-row" style="padding-top:0">
      <span class="settings-integration-icon">PC</span>
      <div class="integration-info">
        <div class="integration-name">Paperclip</div>
        <div class="integration-desc">${esc(statusText)}</div>
        <div class="settings-owner-action">${connected ? "Runtime/Paperclip Owner action: rotate only when Paperclip changes the signing secret." : "Runtime/Paperclip Owner action: connect only after PM/Runtime confirms Paperclip readiness."}</div>
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
      <input id="paperclip-shared-secret" class="form-input" type="password" placeholder="${esc(secretPlaceholder)}" autocomplete="off" aria-describedby="paperclip-secret-note">
      <p class="settings-secret-note" id="paperclip-secret-note">${connected ? "Leave blank unless rotating. Rotate Secret unlocks only after a new value is typed." : "The value is write-only and must not appear in screenshots, logs, or page copy."}</p>
    </div>
    <div class="form-group">
      <label>Webhook URL</label>
      <input class="form-input" type="text" value="${esc(connection.webhookUrl || connection.webhookPath || "")}" readonly>
    </div>
    <div class="paperclip-ops-panel" aria-label="Paperclip operations status">
      <div class="paperclip-ops-header">
        <div>
          <div class="settings-section-kicker">Live operations</div>
          <h4>Read-only status</h4>
        </div>
        <span class="chip ${live.enabled ? "chip-warning" : "chip-soon"}">${live.enabled ? "Webhook enabled" : "Webhook disabled"}</span>
      </div>
      <div class="paperclip-ops-grid">
        <div><span>Source</span><strong>${esc(live.allowedSourceId || "Not configured")}</strong></div>
        <div><span>Environment</span><strong>${esc(live.allowedEnvironment || "Not configured")}</strong></div>
        <div><span>Pending</span><strong>${counts.pending ?? 0}</strong></div>
        <div><span>Rejected</span><strong>${counts.rejected ?? 0}</strong></div>
        <div><span>Cleaned test artifacts</span><strong>${counts.cleanedSessions ?? 0}</strong></div>
        <div><span>Trello-linked</span><strong>${counts.trelloLinked ?? 0}</strong></div>
      </div>
      ${renderPaperclipOpsAudit(ops.audit)}
      ${warnings.length ? `
        <div class="paperclip-ops-warnings">
          ${warnings.map(warning => `
            <div class="paperclip-ops-warning ${warning.level === "danger" ? "is-danger" : ""}">
              <strong>${esc(warning.code || "warning")}</strong>
              <span>${esc(warning.message || "")}</span>
            </div>
          `).join("")}
        </div>
      ` : '<div class="settings-empty-inline">No Paperclip stop-condition warning found.</div>'}
    </div>
    <div class="settings-control-actions" aria-label="Paperclip connection controls">
      <button class="btn btn-primary btn-sm" id="paperclip-connect-btn">${connected ? "Update Connection" : "Connect Paperclip"}</button>
      <button class="btn btn-sm" id="paperclip-rotate-btn" ${connected ? "disabled" : "disabled"} title="${connected ? "Enter a new shared secret to enable rotation" : "Connect Paperclip before rotating"}">Rotate Secret</button>
      <button class="btn btn-danger btn-sm" id="paperclip-disconnect-btn" ${connected ? "" : "disabled"}>Disconnect</button>
    </div>
    <div class="settings-confirmation-region" id="paperclip-confirmation-region" aria-live="polite"></div>
  `;

  $("paperclip-connect-btn").onclick = connectPaperclip;
  $("paperclip-rotate-btn").onclick = requestPaperclipSecretRotation;
  $("paperclip-disconnect-btn").onclick = requestPaperclipDisconnect;
  const secretInput = $("paperclip-shared-secret");
  const rotateButton = $("paperclip-rotate-btn");
  if (secretInput && rotateButton) {
    secretInput.oninput = () => {
      const hasSecret = Boolean(secretInput.value.trim());
      rotateButton.disabled = !connected || !hasSecret;
      rotateButton.title = connected && !hasSecret
        ? "Enter a new shared secret to enable rotation"
        : "";
      clearPaperclipConfirmation();
    };
  }
}

function renderPaperclipOpsAudit(audit = {}) {
  const accepted = audit.accepted || {};
  const rejected = audit.rejected || {};
  const replay = audit.replay || {};
  const cleanup = audit.cleanup || {};
  return `
    <div class="paperclip-audit-strip" aria-label="Paperclip audit summary">
      <span>Accepted ${Object.values(accepted).reduce((sum, value) => sum + Number(value || 0), 0)}</span>
      <span>Rejected ${Object.values(rejected).reduce((sum, value) => sum + Number(value || 0), 0)}</span>
      <span>Replay ${Object.values(replay).reduce((sum, value) => sum + Number(value || 0), 0)}</span>
      <span>Cleanup ${Object.values(cleanup).reduce((sum, value) => sum + Number(value || 0), 0)}</span>
    </div>
  `;
}

function paperclipConnectionPayload() {
  return {
    workspaceId: $("paperclip-workspace-id")?.value || "",
    label: $("paperclip-label")?.value || "",
    sharedSecret: $("paperclip-shared-secret")?.value || "",
  };
}

function clearPaperclipConfirmation() {
  const region = $("paperclip-confirmation-region");
  if (region) region.innerHTML = "";
}

function showPaperclipConfirmation({ title, body, confirmText, danger = false, onConfirm }) {
  const region = $("paperclip-confirmation-region");
  if (!region) return;
  region.innerHTML = `
    <div class="settings-confirmation-card ${danger ? "is-danger" : "is-warning"}">
      <div>
        <strong>${esc(title)}</strong>
        <p>${esc(body)}</p>
      </div>
      <div class="settings-confirmation-actions">
        <button type="button" class="btn ${danger ? "btn-danger" : "btn-primary"} btn-sm" id="paperclip-confirm-action">${esc(confirmText)}</button>
        <button type="button" class="btn btn-ghost btn-sm" id="paperclip-cancel-action">Cancel</button>
      </div>
    </div>
  `;
  $("paperclip-confirm-action").onclick = onConfirm;
  $("paperclip-cancel-action").onclick = clearPaperclipConfirmation;
}

async function connectPaperclip() {
  try {
    await api.post("/api/integrations/paperclip/connection/connect", paperclipConnectionPayload());
    toast("Paperclip connected");
    await loadPaperclipConnection();
  } catch (e) {
    toast("Paperclip connect failed. Runtime/Paperclip Owner should check the connection details.", true);
  }
}

function requestPaperclipSecretRotation() {
  const nextSecret = $("paperclip-shared-secret")?.value?.trim() || "";
  if (!nextSecret) {
    toast("Enter a new shared secret before rotating.", true);
    return;
  }
  showPaperclipConfirmation({
    title: "Confirm secret rotation",
    body: "This replaces the stored Paperclip signing secret. Continue only after Paperclip is ready to send with the new value.",
    confirmText: "Confirm Rotate",
    danger: true,
    onConfirm: rotatePaperclipSecret,
  });
}

async function rotatePaperclipSecret() {
  try {
    await api.post("/api/integrations/paperclip/connection/rotate-secret", {
      sharedSecret: $("paperclip-shared-secret")?.value || "",
    });
    toast("Paperclip secret rotated");
    await loadPaperclipConnection();
  } catch (e) {
    toast("Paperclip rotate failed. Runtime/Paperclip Owner should verify connector readiness.", true);
  }
}

function requestPaperclipDisconnect() {
  showPaperclipConfirmation({
    title: "Confirm Paperclip disconnect",
    body: "This disables the Task Hub Paperclip connection. Future live webhook requests should be rejected until it is reconnected.",
    confirmText: "Confirm Disconnect",
    danger: true,
    onConfirm: disconnectPaperclip,
  });
}

async function disconnectPaperclip() {
  try {
    await api.post("/api/integrations/paperclip/connection/disconnect", {});
    toast("Paperclip disconnected");
    await loadPaperclipConnection();
  } catch (e) {
    toast("Paperclip disconnect failed. Runtime/Paperclip Owner should check connector state.", true);
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
  if (!isTrelloVerified()) {
    const trelloConnection = trelloConnectionSummary();
    container.innerHTML = `<div class="settings-empty-inline">${esc(trelloConnection.description)}</div>`;
    return;
  }
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
    container.innerHTML = `<div class="settings-empty-inline is-error">Workspaces are unavailable. Runtime Owner should verify Trello connection health before changing workspace scope.</div>`;
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
