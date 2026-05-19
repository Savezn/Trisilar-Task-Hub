// Implemented by: Codex Dev (2026-05-07)
// V0.2-W2-06 Settings polish implemented by Codex Dev.

// Settings Page
function showSettingsPage() {
  try {
    S.mode = "settings";
    S.currentBoardId = null;
    S.currentGroupId = null;
    updateSettingsShellTitle();
    $("add-list-btn").classList.add("hidden");

    const calConnected = CAL.status?.connected;
    const config = S.config || {};
    const trelloConnection = trelloConnectionSummary();
    const hiddenCount = (config.hiddenBoards || []).length;
    const workspaceCount = (config.allowedWorkspaceIds || []).length;
    const trelloOwnerAction = trelloConnection.label === "Verified"
      ? "Runtime verified; board data can load."
      : "Owner action: review Trello private connection values.";

    renderSettingsV2Page({
      calConnected,
      trelloConnection,
      workspaceCount,
      hiddenCount,
      trelloOwnerAction,
    });
    return;

    const page = document.createElement("div");
    page.className = "settings-page";
    page.innerHTML = `
      ${renderSettingsMobileMore({
        calConnected,
        trelloConnection,
        workspaceCount,
        hiddenCount,
      })}

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
          <small>${calConnected ? "Google authorization ready for schedule context." : "Connect Google before calendar sync."}</small>
        </div>
        <div class="settings-readiness-item ${calConnected ? "is-ok" : "is-muted"}">
          <span>Google Tasks</span>
          <strong>${calConnected ? "Shared Google auth" : "Blocked"}</strong>
          <small>${calConnected ? "Uses the Calendar connection." : "Connect Calendar first."}</small>
        </div>
        <div class="settings-readiness-item is-warning">
          <span>Paperclip</span>
          <strong>Guarded controls</strong>
          <small>Private value is write-only; rotation and disconnect require confirmation.</small>
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
                <div class="integration-desc">${calConnected ? "Google authorization ready." : "Connect Google before selecting calendar sync paths."}</div>
                </div>
                ${calConnected
                  ? '<span class="settings-status-chip is-connected">Connected</span>'
                  : '<button type="button" class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect</button>'}
              </div>
              <div class="integration-row">
                <span class="settings-integration-icon">${icon("checkSquare")}</span>
                <div class="integration-info">
                  <div class="integration-name">Google Tasks</div>
                  <div class="integration-desc">${calConnected ? "Uses the Google Calendar authorization." : "Requires Google Calendar connection first."}</div>
                </div>
                ${calConnected
                  ? '<span class="settings-status-chip is-shared">Shared Google auth</span>'
                  : '<button type="button" class="btn btn-primary btn-sm" onclick="openCalSetup()">Connect Calendar</button>'}
              </div>
            </div>
          </section>

          <section class="settings-section" id="settings-paperclip">
            <div class="settings-section-header">
              <div>
                <div class="settings-section-kicker">Agent connector</div>
                <h3 class="settings-section-title">Paperclip Integration</h3>
                <p class="settings-section-desc">Manage connection state, private value handoff, and live webhook readiness.</p>
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
              <button type="button" class="btn btn-primary btn-sm settings-section-action" id="settings-add-group-btn">${icon("plus")} Add BU group</button>
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

    $("settings-add-group-btn").onclick = addSettingsBuGroup;
  } catch (e) {
    console.error("[Settings Error]", e);
    $("board-content").innerHTML = `<div class="empty-state"><div class="empty-icon">${icon("alert")}</div><h3>Settings unavailable</h3><p>Settings could not load. Runtime Owner should check the connection health before changing integration controls.</p></div>`;
  }
}

function renderSettingsV2Page({ calConnected, trelloConnection, workspaceCount, hiddenCount, trelloOwnerAction }) {
  const page = document.createElement("div");
  page.className = "settings-page uiv2-settings-page";
  const paperclipDraftMode = ["disabled", "staged"].includes(S.settingsPaperclipIntakeMode)
    ? S.settingsPaperclipIntakeMode
    : "staged";
  S.settingsPaperclipIntakeMode = paperclipDraftMode;
  const paperclipModeLabel = paperclipDraftMode === "disabled" ? "Disabled" : "Staged";
  const paperclipModeTone = paperclipDraftMode === "disabled" ? "muted" : "warn";

  const integrationRows = settingsIntegrationDefinitions({ calConnected, trelloConnection }).map(item => {
    const actionIcon = item.action === "Policy" ? "lock" : item.action === "Connect" ? "external" : "settings";
    const actionLabel = item.actionLabel || `${item.action} ${item.name}`;
    return `
      <div class="intg-row">
        <div class="ic">${icon(item.icon)}</div>
        <div class="nm">${esc(item.name)}<small>${esc(item.meta)}</small></div>
        ${uiChip(item.tone, item.status, { sm: true, dot: true })}
        <button type="button" class="btn sm ${item.tone === "ai" ? "ai" : ""}" data-settings-integration="${esc(item.id)}" aria-label="${esc(actionLabel)}" title="${esc(actionLabel)}">${icon(actionIcon)} ${esc(item.action)}</button>
      </div>
    `;
  }).join("");

  page.innerHTML = `
    ${renderSettingsMobileMore({ calConnected, trelloConnection, workspaceCount, hiddenCount })}
    ${uiRouteBar({
      title: "Operational control",
      sub: "<span>Integrations / workspace visibility / BU groups / Paperclip mode / access / audit / notifications</span>",
      actions: '<button class="btn" type="button" onclick="navigateTo(\'docs\')">' + icon("external") + " Operations runbook</button>",
    })}
    <div class="set-grid">
      <aside class="set-side" aria-label="Settings sections">
        <button type="button" class="sl on" data-target="settings-integrations" aria-controls="settings-integrations">Integrations</button>
        <button type="button" class="sl" data-target="settings-workspaces" aria-controls="settings-workspaces">Workspace visibility</button>
        <button type="button" class="sl" data-target="settings-visibility" aria-controls="settings-visibility">Hidden boards</button>
        <button type="button" class="sl" data-target="settings-groups" aria-controls="settings-groups">BU groups</button>
        <button type="button" class="sl" data-target="settings-paperclip" aria-controls="settings-paperclip">Paperclip / AI intake</button>
        <button type="button" class="sl" data-target="settings-teams" aria-controls="settings-teams">Access & policy</button>
        <button type="button" class="sl" data-target="settings-audit" aria-controls="settings-audit">Audit / retention</button>
        <button type="button" class="sl" data-target="settings-notifications" aria-controls="settings-notifications">Notifications</button>
        <button type="button" class="sl" data-target="settings-display" aria-controls="settings-display">Display</button>
      </aside>
      <div class="set-block">
        <section id="settings-integrations">
          ${uiPanel({
            title: "Integrations",
            eyebrow: "Connections",
            tight: true,
            body: `${integrationRows}<div class="settings-integration-editor" id="settings-integration-editor"></div>`,
          })}
        </section>
        <section id="settings-workspaces">
          ${uiPanel({
            title: "Visible workspaces",
            eyebrow: "Workspace",
            actions: `<span class="sv">${workspaceCount || "all"} active</span>`,
            body: `<div id="settings-ws-body"><div class="loading-box"><span class="spinner"></span> Loading workspaces...</div></div>`,
          })}
        </section>
        <section id="settings-visibility">
          ${uiPanel({
            title: "Hidden boards",
            eyebrow: "Board visibility",
            actions: `<span class="sv mono">${hiddenCount} hidden</span>`,
            body: `<div id="settings-vis-body"></div>`,
          })}
        </section>
        <section id="settings-groups">
          ${uiPanel({
            title: "Visible boards / BU groups",
            eyebrow: "Workspace",
            actions: `<button type="button" class="btn sm primary" id="settings-add-group-btn" aria-label="Add a new BU group" title="Create a new BU group. Existing groups can be edited inline below.">${icon("plus")} Add BU group</button>`,
            body: `
              <p class="settings-section-note">Edit existing BU names, colors, and board assignments inline below. Use Add BU group only when creating a new scope filter.</p>
              <div class="set-row" style="grid-template-columns:180px 1fr auto">
                <div class="sk"><div class="nm">Connection readiness</div><div class="ds">${esc(trelloOwnerAction)}</div></div>
                <div class="sv">${esc(trelloConnection.description)}</div>
                ${uiChip(trelloConnection.label === "Verified" ? "ok" : "warn", trelloConnection.label, { sm: true })}
              </div>
              <div id="settings-groups-body"></div>
            `,
          })}
        </section>
        <section id="settings-paperclip">
          ${uiPanel({
            title: `Intake mode ${uiChip(paperclipModeTone, paperclipModeLabel, { sm: true })}`,
            eyebrow: "Paperclip / AI intake",
            actions: `<button class="btn warn-outline sm" type="button" id="settings-paperclip-pause-btn">${icon("settings")} ${paperclipDraftMode === "disabled" ? "Resume staged" : "Pause intake"}</button>`,
            tight: true,
            body: `
              <div class="stack">
                <div class="set-row">
                  <div class="sk"><div class="nm">Intake mode</div><div class="ds">Session draft only. Runtime Owner approval is required before any live intake mode changes.</div></div>
                  <div class="settings-session-control">
                    <div class="seg" aria-label="Paperclip intake draft mode">
                      <button type="button" class="${paperclipDraftMode === "disabled" ? "on" : ""}" aria-pressed="${paperclipDraftMode === "disabled"}" data-settings-paperclip-mode="disabled" title="Set this screen's intake draft to disabled; live mode is unchanged.">Disabled</button>
                      <button type="button" class="${paperclipDraftMode === "staged" ? "on" : ""}" aria-pressed="${paperclipDraftMode === "staged"}" data-settings-paperclip-mode="staged" title="Set this screen's intake draft to staged; live mode is unchanged.">Staged</button>
                      <button type="button" disabled style="opacity:.5" title="Permanent intake requires Runtime Owner and PM approval">Permanent</button>
                    </div>
                    <small>Session-only draft. Live Paperclip intake is unchanged.</small>
                  </div>
                  <button class="btn sm" type="button" onclick="navigateTo('docs')">Audit</button>
                </div>
                <div class="set-row">
                  <div class="sk"><div class="nm">Production intake</div><div class="ds">Live agent traffic is not promoted by UI V2 work. Review Queue remains the human gate.</div></div>
                  <div>${uiChip("warn", "Not approved")}</div>
                  <button class="btn sm" type="button" disabled style="opacity:.6" title="Production intake requests require PM and Runtime Owner approval outside V0.6 UI scope." aria-label="Production intake request unavailable in V0.6 UI scope">Request</button>
                </div>
                <div class="set-row">
                  <div class="sk"><div class="nm">Private signing value</div><div class="ds">Webhook verification value. Status only; the stored value is never displayed.</div></div>
                  <div class="sv">${icon("settings")} write-only / no value exposed</div>
                  <button class="btn sm" type="button" id="settings-paperclip-load-marker" aria-label="Load Paperclip private value controls" title="Load Paperclip private value controls">Load controls</button>
                </div>
                <div class="set-row">
                  <div class="sk"><div class="nm">Side-effect policy</div><div class="ds">Trello, Calendar, and Google Tasks writes stay gated by Review Queue approval.</div></div>
                  <div class="sv">Locked / always human-gated</div>
                  ${uiChip("ok", "Enforced", { sm: true })}
                </div>
                <div id="settings-paperclip-body">
                  <div class="loading-box"><span class="spinner"></span> Loading Paperclip connection...</div>
                </div>
              </div>
            `,
          })}
        </section>
        <section id="settings-teams">
          ${uiPanel({
            title: "Access & policy",
            eyebrow: "Policy",
            body: `<div id="settings-teams-body"></div>`,
          })}
        </section>
        <section id="settings-audit">
          ${uiPanel({
            title: "Audit / retention",
            eyebrow: "Governance",
            actions: `<button class="btn sm" type="button" onclick="navigateTo('docs')">${icon("external")} View trace</button>`,
            body: renderSettingsAuditRetention(),
          })}
        </section>
        <section id="settings-notifications">
          ${uiPanel({
            title: "Notifications",
            eyebrow: "Routing",
            actions: `<span class="sv mono">session draft</span>`,
            body: renderSettingsNotifications(),
          })}
        </section>
        <section id="settings-display">
          ${uiPanel({
            title: "Display",
            eyebrow: "UI V2",
            body: renderSettingsDisplay(),
          })}
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
  page.querySelectorAll("[data-settings-integration]").forEach(btn => {
    btn.onclick = () => openSettingsIntegrationEditor(btn.dataset.settingsIntegration || "trello");
  });
  renderSettingsIntegrationEditor(S.settingsActiveIntegration || "trello");
  page.querySelectorAll("[data-settings-notification]").forEach(input => {
    input.onchange = () => updateSettingsNotificationDraft(input);
  });
  page.querySelectorAll("[data-settings-trace-window]").forEach(btn => {
    btn.onclick = () => updateSettingsSegmentDraft(btn, "settingsTraceWindow", "settings-trace-window-value", "Trace export window");
  });
  page.querySelectorAll("[data-settings-density]").forEach(btn => {
    btn.onclick = () => updateSettingsSegmentDraft(btn, "settingsDisplayDensity", "settings-density-value", "Display density");
  });
  page.querySelectorAll("[data-settings-paperclip-mode]").forEach(btn => {
    btn.onclick = () => {
      S.settingsPaperclipIntakeMode = btn.dataset.settingsPaperclipMode || "staged";
      toast(`Paperclip intake draft set to ${S.settingsPaperclipIntakeMode}. Live mode is unchanged.`);
      renderSettingsV2Page({ calConnected, trelloConnection, workspaceCount, hiddenCount, trelloOwnerAction });
    };
  });
  const paperclipPauseBtn = $("settings-paperclip-pause-btn");
  if (paperclipPauseBtn) {
    paperclipPauseBtn.onclick = () => {
      S.settingsPaperclipIntakeMode = S.settingsPaperclipIntakeMode === "disabled" ? "staged" : "disabled";
      toast(`Paperclip intake draft set to ${S.settingsPaperclipIntakeMode}. Live mode is unchanged.`);
      renderSettingsV2Page({ calConnected, trelloConnection, workspaceCount, hiddenCount, trelloOwnerAction });
    };
  }
  const paperclipLoad = $("settings-paperclip-load-marker");
  if (paperclipLoad) {
    paperclipLoad.onclick = () => {
      const body = $("settings-paperclip-body");
      if (!body) return;
      body.classList.toggle("is-open");
      const isOpen = body.classList.contains("is-open");
      const details = body.querySelector("details");
      if (details) details.open = isOpen;
      paperclipLoad.textContent = isOpen ? "Hide controls" : "Load controls";
    };
  }

  installSettingsSectionNavigation(page);

  $("settings-add-group-btn").onclick = addSettingsBuGroup;
}

function addSettingsBuGroup() {
  if (!S.draftConfig) S.draftConfig = JSON.parse(JSON.stringify(S.config || {}));
  if (!Array.isArray(S.draftConfig.groups)) S.draftConfig.groups = [];
  S.draftConfig.groups.push({
    id: "g_" + Date.now(),
    name: "New BU group",
    color: COLORS[S.draftConfig.groups.length % COLORS.length],
    boardIds: [],
  });
  renderSettingsGroups();
  toast("New BU group added. Edit the name and board assignment inline.");
  setTimeout(() => {
    const inputs = $("settings-groups-body")?.querySelectorAll(".group-edit-name") || [];
    inputs[inputs.length - 1]?.focus();
    inputs[inputs.length - 1]?.select();
  }, 50);
}

function installSettingsSectionNavigation(page) {
  const navButtons = [...page.querySelectorAll(".set-side .sl")];
  const sections = [...page.querySelectorAll(".set-block > section[id]")];
  if (!navButtons.length || !sections.length) return;

  const syncNav = (targetId, { focusSection = false } = {}) => {
    S.settingsActiveSection = targetId || "settings-integrations";
    navButtons.forEach(item => {
      const active = item.dataset.target === S.settingsActiveSection;
      item.classList.toggle("on", active);
      item.setAttribute("aria-current", active ? "true" : "false");
    });
    if (focusSection) {
      const section = document.getElementById(S.settingsActiveSection);
      if (section) {
        section.setAttribute("tabindex", "-1");
        section.classList.add("settings-section-focused");
        setTimeout(() => {
          section.focus({ preventScroll: true });
          section.classList.remove("settings-section-focused");
        }, 260);
      }
    }
  };

  navButtons.forEach(btn => {
    btn.onclick = () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      S.settingsSectionNavLockUntil = Date.now() + 900;
      syncNav(btn.dataset.target);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        if (S.settingsActiveSection === btn.dataset.target) syncNav(btn.dataset.target, { focusSection: true });
      }, 560);
    };
  });

  syncNav(S.settingsActiveSection || "settings-integrations");

  if (S.settingsSectionObserver) {
    S.settingsSectionObserver.disconnect();
    S.settingsSectionObserver = null;
  }
  if ("IntersectionObserver" in window) {
    S.settingsSectionObserver = new IntersectionObserver(entries => {
      if (Date.now() < (S.settingsSectionNavLockUntil || 0)) return;
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (visible?.target?.id) syncNav(visible.target.id);
    }, {
      root: null,
      rootMargin: "-96px 0px -68% 0px",
      threshold: [0, 0.1, 0.3],
    });
    sections.forEach(section => S.settingsSectionObserver.observe(section));
  }
}

function syncSettingsIntegrationButtons(activeId = S.settingsActiveIntegration || "trello") {
  document.querySelectorAll("[data-settings-integration]").forEach(btn => {
    const isActive = (btn.dataset.settingsIntegration || "trello") === activeId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function updateSettingsShellTitle() {
  const mobileMore = typeof window !== "undefined"
    && window.matchMedia
    && window.matchMedia("(max-width: 700px)").matches;
  $("board-title").textContent = mobileMore ? "More" : "Settings";
  $("board-subtitle").textContent = mobileMore
    ? "Routes · integrations · settings"
    : "Connections and workspace controls";
}

function updateSettingsSegmentDraft(button, stateKey, valueId, label) {
  const value = button.dataset.settingsTraceWindow || button.dataset.settingsDensity || "";
  if (!value) return;
  S[stateKey] = value;
  const row = button.closest(".set-row");
  row?.querySelectorAll("[data-settings-trace-window], [data-settings-density]").forEach(btn => {
    const sameValue = (btn.dataset.settingsTraceWindow || btn.dataset.settingsDensity || "") === value;
    btn.classList.toggle("on", sameValue);
    btn.setAttribute("aria-pressed", String(sameValue));
  });
  const valueEl = valueId ? $(valueId) : null;
  if (valueEl) valueEl.textContent = value;
  toast(`${label} set to ${value} for this session.`);
}

function renderSettingsAuditRetention() {
  const traceWindow = ["7d", "14d", "30d"].includes(S.settingsTraceWindow)
    ? S.settingsTraceWindow
    : "14d";
  return `
    <div class="stack settings-governance-stack settings-audit-retention">
      <div class="set-row">
        <div class="sk"><div class="nm">Agent run traces</div><div class="ds">Evidence, proposal diffs, and run IDs used by Docs / AI Trace.</div></div>
        <div class="sv">90 days / run traces</div>
        ${uiChip("ok", "Tracked", { sm: true })}
      </div>
      <div class="set-row">
        <div class="sk"><div class="nm">Approved task audit</div><div class="ds">Human-gated approvals and rejected/held Review Queue decisions.</div></div>
        <div class="sv">365 days / approved tasks</div>
        ${uiChip("ai", "Review gate", { sm: true })}
      </div>
      <div class="set-row">
        <div class="sk"><div class="nm">Private value display policy</div><div class="ds">Settings may prepare write-only updates, but stored private values are never rendered.</div></div>
        <div class="sv">Private values never displayed</div>
        ${uiChip("ok", "Enforced", { sm: true })}
      </div>
      <div class="set-row">
        <div class="sk"><div class="nm">Trace export window</div><div class="ds">Operator evidence bundle uses the current review/audit window.</div></div>
        <div class="seg" aria-label="Trace export window">
          <button type="button" class="${traceWindow === "7d" ? "on" : ""}" aria-pressed="${traceWindow === "7d"}" data-settings-trace-window="7d" title="Use a 7-day trace export window for operator evidence.">7d</button>
          <button type="button" class="${traceWindow === "14d" ? "on" : ""}" aria-pressed="${traceWindow === "14d"}" data-settings-trace-window="14d" title="Use a 14-day trace export window for operator evidence.">14d</button>
          <button type="button" class="${traceWindow === "30d" ? "on" : ""}" aria-pressed="${traceWindow === "30d"}" data-settings-trace-window="30d" title="Use a 30-day trace export window for operator evidence.">30d</button>
        </div>
        <button class="btn sm" type="button" aria-label="Open Docs and AI Trace for the selected trace window" title="Open Docs / AI Trace. This does not change retention policy." onclick="navigateTo('docs')">Open trace <span class="mono" id="settings-trace-window-value">${esc(traceWindow)}</span></button>
      </div>
    </div>
  `;
}

function renderSettingsNotifications() {
  const drafts = S.notificationDrafts || {};
  const rows = [
    {
      id: "reviewApproval",
      name: "Review approvals",
      desc: "Notify when a proposal needs approve, reject, hold, or edit.",
      onLabel: "Bell + route badge",
      offLabel: "Muted for this session",
      checked: true,
    },
    {
      id: "connectorHealth",
      name: "Connector health",
      desc: "Surface Trello, Calendar, Google Tasks, Paperclip, and Access changes.",
      onLabel: "Status strip + Settings",
      offLabel: "Settings only",
      checked: true,
    },
    {
      id: "weeklyDigest",
      name: "Weekly focus digest",
      desc: "Summarize Do Now, Review AI, Blocked, and Schedule lanes.",
      onLabel: "Monday 09:00",
      offLabel: "Off for this session",
      checked: false,
    },
  ];
  return `
    <div class="stack settings-notifications">
      ${rows.map(row => {
        const checked = drafts[row.id] ?? row.checked;
        return `
          <div class="set-row settings-notification-row">
            <div class="sk"><div class="nm">${esc(row.name)}</div><div class="ds">${esc(row.desc)}</div></div>
            <div class="sv" data-on="${esc(row.onLabel)}" data-off="${esc(row.offLabel)}">${esc(checked ? row.onLabel : row.offLabel)}</div>
            <label class="settings-switch" title="${esc(row.name)}">
              <input type="checkbox" data-settings-notification="${esc(row.id)}" aria-label="${esc(row.name)} notification preference" ${checked ? "checked" : ""}>
              <span></span>
            </label>
          </div>
        `;
      }).join("")}
      <div class="set-row">
        <div class="sk"><div class="nm">Notification delivery</div><div class="ds">UI V2 only prepares preferences. Runtime delivery needs a separate implementation scope.</div></div>
        <div class="sv">In-app only / no external send</div>
        ${uiChip("warn", "UI draft", { sm: true })}
      </div>
    </div>
  `;
}

function renderSettingsDisplay() {
  const density = ["comfort", "compact"].includes(S.settingsDisplayDensity)
    ? S.settingsDisplayDensity
    : "compact";
  return `
    <div class="stack settings-display">
      <div class="set-row">
        <div class="sk"><div class="nm">Desktop density</div><div class="ds">Matches the UI V2 operational dashboard rhythm.</div></div>
        <div class="seg" aria-label="Desktop density">
          <button type="button" class="${density === "comfort" ? "on" : ""}" aria-pressed="${density === "comfort"}" data-settings-density="comfort">Comfort</button>
          <button type="button" class="${density === "compact" ? "on" : ""}" aria-pressed="${density === "compact"}" data-settings-density="compact">Compact</button>
        </div>
        <span class="sv mono" id="settings-density-value">${esc(density)}</span>
      </div>
      <div class="set-row">
        <div class="sk"><div class="nm">Route chrome</div><div class="ds">Black status strip, 220px sidebar, 48px topbar, and compact routebar.</div></div>
        <div class="sv">Prototype shell</div>
        ${uiChip("ok", "Locked", { sm: true })}
      </div>
      <div class="set-row">
        <div class="sk"><div class="nm">Mobile navigation</div><div class="ds">Mobile keeps Today, Review, Tasks, Boards, More in the bottom nav.</div></div>
        <div class="sv">5 tabs / More routes</div>
        ${uiChip("ok", "Aligned", { sm: true })}
      </div>
    </div>
  `;
}

function updateSettingsNotificationDraft(input) {
  S.notificationDrafts = S.notificationDrafts || {};
  S.notificationDrafts[input.dataset.settingsNotification] = Boolean(input.checked);
  const row = input.closest(".settings-notification-row");
  const value = row?.querySelector(".sv");
  if (value) value.textContent = input.checked ? value.dataset.on : value.dataset.off;
  toast("Notification draft updated for this session");
}

function settingsIntegrationDefinitions({ calConnected = false, trelloConnection = null } = {}) {
  const trello = trelloConnection || trelloConnectionSummary();
  return [
    {
      id: "trello",
      icon: "layout",
      name: "Trello",
      meta: trello.description,
      status: trello.label,
      tone: trello.label === "Verified" ? "ok" : "warn",
      action: "Manage",
      actionLabel: "Manage Trello connection draft",
      owner: "Runtime Owner",
      apply: "Owner applies offline",
    },
    {
      id: "gcal",
      icon: "calendar",
      name: "Google Calendar",
      meta: calConnected ? "Calendar authorization is ready for schedule context." : "Owner action needed before calendar sync.",
      status: calConnected ? "Connected" : "Needs owner",
      tone: calConnected ? "ok" : "muted",
      action: calConnected ? "Manage" : "Connect",
      actionLabel: calConnected ? "Manage Google Calendar connection draft" : "Open Google Calendar connection handoff",
      owner: "Workspace Admin",
      apply: calConnected ? "Session draft only" : "Owner connection needed",
    },
    {
      id: "gtasks",
      icon: "checkSquare",
      name: "Google Tasks",
      meta: calConnected ? "Uses the Calendar authorization for personal planning tasks." : "Requires Calendar connection first.",
      status: calConnected ? "Shared auth" : "Off",
      tone: calConnected ? "ok" : "muted",
      action: "Manage",
      actionLabel: "Manage Google Tasks shared connection draft",
      owner: "Workspace Admin",
      apply: "Shared Google auth",
    },
    {
      id: "paperclip",
      icon: "sparkles",
      name: "Paperclip",
      meta: "Gated by Review Queue; proposals require approval before side effects.",
      status: "Gated",
      tone: "ai",
      action: "Manage",
      actionLabel: "Manage Paperclip intake draft",
      owner: "Runtime / Paperclip Owner",
      apply: "Write-only handoff",
    },
    {
      id: "access",
      icon: "lock",
      name: "Cloudflare Access",
      meta: "Required access boundary for protected review and operations routes.",
      status: "Enforced",
      tone: "ok",
      action: "Policy",
      actionLabel: "Review Cloudflare Access policy handoff",
      owner: "Runtime Owner",
      apply: "External policy console",
    },
  ];
}

function settingsIntegrationEditorConfig(id) {
  const configs = {
    trello: {
      eyebrow: "Connection editor",
      title: "Trello",
      fields: [
        { id: "workspaceAlias", label: "Workspace alias", value: "trisilar" },
        { id: "defaultScope", label: "Default board scope", value: "All visible boards" },
      ],
      secrets: ["Private connection value A", "Private connection value B"],
      note: "Session-only draft. Runtime Owner applies private values outside UI V2; Task Hub never displays stored private values.",
    },
    gcal: {
      eyebrow: "Connection editor",
      title: "Google Calendar",
      fields: [
        { id: "calendarLabel", label: "Calendar label", value: "ops@trisilar" },
        { id: "syncWindow", label: "Sync window", value: "14 days" },
      ],
      secrets: [],
      note: "Connection changes are handoff-only until a dedicated Settings API is opened.",
      primaryAction: "Open connection setup",
      primaryClick: "openCalSetup()",
    },
    gtasks: {
      eyebrow: "Shared auth editor",
      title: "Google Tasks",
      fields: [
        { id: "taskList", label: "Task list", value: "Primary" },
        { id: "plannerMode", label: "Planner mode", value: "Read-only until connected" },
      ],
      secrets: [],
      note: "Google Tasks uses the Google connection boundary. Personal task writes stay separate from Trello execution.",
    },
    paperclip: {
      eyebrow: "Agent intake editor",
      title: "Paperclip",
      fields: [
        { id: "workspaceId", label: "Workspace ID", value: "" },
        { id: "label", label: "Internal label", value: "Paperclip" },
      ],
      secrets: ["Paperclip signing value"],
      note: "The private signing value is write-only. Review Queue remains the human gate before Trello, Calendar, or Google Tasks writes.",
      primaryAction: "Open runtime controls",
      primaryClick: "openSettingsPaperclipRuntimeControls()",
    },
    access: {
      eyebrow: "Access policy",
      title: "Cloudflare Access",
      fields: [
        { id: "policyName", label: "Policy label", value: "Task Hub protected routes" },
        { id: "protectedRoutes", label: "Protected routes", value: "/review, /settings" },
      ],
      secrets: [],
      note: "Policy changes stay outside UI V2. This panel records the handoff shape without exposing private service values.",
    },
  };
  return configs[id] || configs.trello;
}

function openSettingsIntegrationEditor(id) {
  S.settingsActiveIntegration = id || "trello";
  renderSettingsIntegrationEditor(S.settingsActiveIntegration);
  syncSettingsIntegrationButtons(S.settingsActiveIntegration);
  $("settings-integration-editor")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderSettingsIntegrationEditor(id = "trello") {
  const container = $("settings-integration-editor");
  if (!container) return;
  S.settingsActiveIntegration = id || "trello";
  syncSettingsIntegrationButtons(S.settingsActiveIntegration);
  const calConnected = Boolean(CAL.status?.connected);
  const item = settingsIntegrationDefinitions({ calConnected, trelloConnection: trelloConnectionSummary() })
    .find(integration => integration.id === id) || settingsIntegrationDefinitions({ calConnected })[0];
  const config = settingsIntegrationEditorConfig(item.id);
  const drafts = S.integrationDrafts || {};
  const draft = drafts[item.id] || {};
  const fields = config.fields.map(field => {
    const value = draft[field.id] ?? field.value ?? "";
    const fieldDomId = `integration-field-${item.id}-${field.id}`;
    return `
      <label class="integration-edit-field" for="${esc(fieldDomId)}">
        <span>${esc(field.label)}</span>
        <input class="form-input" id="${esc(fieldDomId)}" data-integration-field="${esc(field.id)}" type="text" value="${esc(value)}">
      </label>
    `;
  }).join("");
  const secrets = (config.secrets || []).map((label, index) => {
    const secretDomId = `integration-secret-${item.id}-${index}`;
    return `
      <label class="integration-edit-field" for="${esc(secretDomId)}">
        <span>${esc(label)} <small>write-only handoff</small></span>
        <input class="form-input" id="${esc(secretDomId)}" data-integration-secret="${index}" type="password" value="" placeholder="Paste only when owner is ready" autocomplete="off" aria-label="${esc(label)} write-only handoff">
      </label>
    `;
  }).join("");
  container.innerHTML = `
    <div class="integration-editor-head">
      <div>
        <div class="eyebrow">${esc(config.eyebrow)}</div>
        <h4>${esc(config.title)}</h4>
        <p>${esc(config.note)}</p>
      </div>
      <div class="integration-editor-status">
        ${uiChip(item.tone, item.status, { sm: true, dot: true })}
        <span class="sv">${esc(item.apply)}</span>
      </div>
    </div>
    <div class="settings-credential-boundary" role="note">
      <strong>Session-only draft</strong>
      <span>Saving here updates this screen only. It does not change live connectors, stored private values, or external side effects.</span>
    </div>
    <div class="integration-editor-grid">
      ${fields}
      ${secrets}
      <div class="integration-edit-field">
        <span>Owner</span>
        <strong>${esc(item.owner)}</strong>
      </div>
    </div>
    <div class="integration-editor-actions">
      ${config.primaryAction ? `<button type="button" class="btn sm" onclick="${config.primaryClick}" aria-label="${esc(config.primaryAction)} for ${esc(item.name)}">${esc(config.primaryAction)}</button>` : ""}
      <button type="button" class="btn primary sm" onclick="saveSettingsIntegrationDraft('${esc(item.id)}')" aria-label="Save ${esc(item.name)} connection draft for this session">Save draft</button>
      <button type="button" class="btn sm" onclick="renderSettingsIntegrationEditor('${esc(item.id)}')" aria-label="Reset ${esc(item.name)} connection draft">Reset</button>
    </div>
    <div class="settings-confirmation-region" id="integration-editor-feedback" aria-live="polite"></div>
  `;
}

function saveSettingsIntegrationDraft(id) {
  const container = $("settings-integration-editor");
  if (!container) return;
  S.integrationDrafts = S.integrationDrafts || {};
  const draft = {};
  container.querySelectorAll("[data-integration-field]").forEach(input => {
    draft[input.dataset.integrationField] = input.value;
  });
  const secretInputs = [...container.querySelectorAll("[data-integration-secret]")];
  const hasSecretDraft = secretInputs.some(input => input.value.trim());
  if (hasSecretDraft) draft.secretUpdatePrepared = true;
  secretInputs.forEach(input => { input.value = ""; });
  S.integrationDrafts[id] = draft;
  const feedback = $("integration-editor-feedback");
  if (feedback) {
    feedback.innerHTML = `
      <div class="settings-confirmation-card">
        <strong>Draft saved in this session</strong>
        <p>${hasSecretDraft ? "A private value handoff was prepared and the input was cleared. Stored values are unchanged." : "Safe connection fields were saved as a UI draft. Stored values are unchanged."}</p>
      </div>
    `;
  }
  toast("Integration draft saved for this session");
}

function openSettingsPaperclipRuntimeControls() {
  const target = $("settings-paperclip");
  const body = $("settings-paperclip-body");
  const marker = $("settings-paperclip-load-marker");
  if (body && marker && !body.classList.contains("is-open")) marker.click();
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSettingsMobileMore({ calConnected, trelloConnection, workspaceCount, hiddenCount }) {
  const routes = [
    { page: "calendar", label: "Calendar", meta: "Google, Trello, and review-derived schedule context", icon: "calendar", badge: "", tone: "muted" },
    { page: "planner", label: "Planner", meta: "Google Tasks plus Trello deadline planning", icon: "checkSquare", badge: calConnected ? "" : "off", tone: "muted" },
    { page: "okr", label: "OKR / Portfolio", meta: "Objectives, key results, owners, and confidence", icon: "target", badge: "", tone: "muted" },
    { page: "focus", label: "Weekly Focus", meta: "Do Now, Review AI, Blocked, and Schedule lanes", icon: "calendar", badge: "", tone: "muted" },
    { page: "docs", label: "Docs / AI Trace", meta: "Evidence, run IDs, proposal links, and audit timeline", icon: "gitMerge", badge: "", tone: "muted" },
    { page: "settings", label: "Settings", meta: "Operational controls, integrations, workspace visibility, and policy", icon: "settings", badge: "", tone: "muted" },
  ];

  const integrations = [
    { label: "Trello", meta: trelloConnection.description || "Execution source", badge: trelloConnection.statClass === "is-ok" ? "ok" : "off", tone: trelloConnection.statClass === "is-ok" ? "ok" : "warn" },
    { label: "Google Calendar", meta: calConnected ? "Calendar auth ready" : "Owner action needed", badge: calConnected ? "ok" : "off", tone: calConnected ? "ok" : "muted" },
    { label: "Google Tasks", meta: calConnected ? "Shared Calendar auth" : "Needs Calendar first", badge: calConnected ? "shared" : "off", tone: calConnected ? "ok" : "muted" },
    { label: "Paperclip", meta: "Gated by Review Queue", badge: "gated", tone: "ai" },
    { label: "Cloudflare Access", meta: "Required on protected review and operations routes", badge: "ok", tone: "ok" },
  ];

  return `
    <section class="settings-mobile-more m-more" aria-labelledby="settings-mobile-more-title">
      <div class="settings-mobile-route-list m-card" aria-label="Additional mobile routes">
        ${routes.map(route => `
          <button type="button" class="settings-mobile-route" onclick="navigateTo('${route.page}')">
            <span class="settings-mobile-route-icon">${icon(route.icon)}</span>
            <span class="settings-mobile-route-copy">
              <strong>${esc(route.label)}</strong>
            </span>
            ${route.badge ? uiChip(route.tone, route.badge, { sm: true }) : ""}
            <span class="settings-mobile-chevron" aria-hidden="true">&gt;</span>
          </button>
        `).join("")}
      </div>

      <div class="settings-mobile-section-label eyebrow">Integrations</div>
      <div class="settings-mobile-integration-list m-card" aria-label="Mobile integration status">
        ${integrations.map(item => `
          <div class="settings-mobile-integration">
            <span class="settings-mobile-integration-icon">${icon("settings")}</span>
            <span class="settings-mobile-integration-copy">
              <strong>${esc(item.label)}</strong>
              <small title="${esc(item.meta)}">${esc(item.meta)}</small>
            </span>
            ${uiChip(item.tone, item.badge, { sm: true })}
          </div>
        `).join("")}
      </div>

      <div class="settings-mobile-section-label eyebrow">Status</div>
      <div class="settings-mobile-status-card m-card" aria-label="Mobile operational status">
        <span>env / dev</span>
        <span>build / ui-v2</span>
        <span>last sync / live app context</span>
      </div>
    </section>
  `;
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
        Paperclip status is unavailable. Runtime/Paperclip Owner should check connector health; no private value is exposed here.
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
    ? "Connected. Private signing value is configured but never shown; Review Queue remains the human gate."
    : connection.status === "disabled"
      ? "Disconnected. Live Paperclip intake must stay blocked until Runtime/Paperclip Owner reconnects it."
      : "Connection incomplete. Runtime/Paperclip Owner must configure a write-only private signing value; value is never shown.";
  const secretPlaceholder = connected ? "Paste new signing value" : "Paste Paperclip signing value";

  container.innerHTML = `
    <details class="paperclip-live-panel paperclip-runtime-details">
      <summary class="paperclip-runtime-summary">
        <span class="ic">PC</span>
        <span class="nm">Runtime controls<small>${esc(statusText)}</small></span>
        ${uiChip(connected ? "ok" : connection.status === "disabled" ? "muted" : "warn", connected ? "Connected" : connection.status === "disabled" ? "Disabled" : "Not connected", { sm: true, dot: true })}
        <span class="paperclip-runtime-open">Open controls</span>
      </summary>
      <div class="paperclip-runtime-body">
      <div class="set-row">
        <div class="sk">
          <div class="nm">Workspace and label</div>
          <div class="ds">Optional routing metadata from Paperclip. These do not change Review Queue gating.</div>
        </div>
        <div class="paperclip-inline-controls">
          <label>
            <span>Workspace ID</span>
            <input id="paperclip-workspace-id" class="form-input" type="text" value="${esc(connection.workspaceId || "")}" placeholder="Paperclip workspace id">
          </label>
          <label>
            <span>Label</span>
            <input id="paperclip-label" class="form-input" type="text" value="${esc(connection.label || "")}" placeholder="Internal label">
          </label>
        </div>
        <span class="sv">optional</span>
      </div>
      <div class="set-row">
        <div class="sk">
          <div class="nm">Private signing value</div>
          <div class="ds">Write-only signing material. The stored value is never displayed in Task Hub.</div>
        </div>
        <div>
          <input id="paperclip-shared-secret" class="form-input" type="password" placeholder="${esc(secretPlaceholder)}" autocomplete="off" aria-label="Paperclip private signing value write-only input" aria-describedby="paperclip-secret-note">
          <p class="settings-secret-note" id="paperclip-secret-note">${connected ? "Leave blank unless rotating. Rotation unlocks only after a new value is typed." : "The private value is write-only and must not appear in screenshots, logs, or page copy."}</p>
        </div>
        ${uiChip("warn", connected ? "write-only" : "required to connect", { sm: true })}
      </div>
      <div class="set-row">
        <div class="sk">
          <div class="nm">Webhook URL</div>
          <div class="ds">Read-only destination for Paperclip signed requests.</div>
        </div>
        <input class="form-input mono" type="text" value="${esc(connection.webhookUrl || connection.webhookPath || "")}" readonly>
        ${uiChip(live.enabled ? "warn" : "muted", live.enabled ? "Webhook enabled" : "Webhook disabled", { sm: true })}
      </div>
      <div class="paperclip-ops-panel" aria-label="Paperclip operations status">
        <div class="paperclip-ops-header">
          <div>
            <div class="eyebrow">Live operations</div>
            <h4>Read-only status</h4>
          </div>
          ${uiChip(live.enabled ? "warn" : "muted", live.enabled ? "Webhook enabled" : "Webhook disabled", { sm: true })}
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
        <button class="btn btn-primary btn-sm" type="button" id="paperclip-connect-btn" aria-label="${connected ? "Update Paperclip connection draft" : "Connect Paperclip connection"}">${connected ? "Update Connection" : "Connect Paperclip"}</button>
        <button class="btn btn-sm" type="button" id="paperclip-rotate-btn" ${connected ? "disabled" : "disabled"} title="${connected ? "Enter a new signing value to enable rotation" : "Connect Paperclip before rotating"}" aria-label="Rotate Paperclip private signing value">Rotate value</button>
        <button class="btn btn-danger btn-sm" type="button" id="paperclip-disconnect-btn" ${connected ? "" : "disabled"} aria-label="Disconnect Paperclip connection">Disconnect</button>
      </div>
      <div class="settings-confirmation-region" id="paperclip-confirmation-region" aria-live="polite"></div>
      </div>
    </details>
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
        ? "Enter a new signing value to enable rotation"
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
    toast("Enter a new signing value before rotating.", true);
    return;
  }
  showPaperclipConfirmation({
    title: "Confirm private value rotation",
    body: "This replaces the stored Paperclip signing value. Continue only after Paperclip is ready to send with the new value.",
    confirmText: "Confirm rotation",
    danger: true,
    onConfirm: rotatePaperclipSecret,
  });
}

async function rotatePaperclipSecret() {
  try {
    await api.post("/api/integrations/paperclip/connection/rotate-secret", {
      sharedSecret: $("paperclip-shared-secret")?.value || "",
    });
    toast("Paperclip private value rotated");
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
    const toggleLabel = isHidden ? `Set ${board.name} board visible` : `Hide ${board.name} board`;
    const row = document.createElement("div");
    row.className = "vis-row";
    row.innerHTML = `
      <span class="vis-dot" style="background:${COLORS[i % COLORS.length]}"></span>
      <span class="vis-name" title="${esc(board.name)}">${esc(board.name)}</span>
      <button type="button" class="vis-toggle${isHidden ? " hidden-toggle" : ""}" data-bid="${board.id}" aria-label="${esc(toggleLabel)}" title="${esc(toggleLabel)}">
        ${icon(isHidden ? "eyeOff" : "eye")} <span>${isHidden ? "Hidden" : "Visible"}</span>
      </button>
    `;
    row.querySelector(".vis-toggle").onclick = async function() {
      const bid = this.dataset.bid;
      const idx = S.draftConfig.hiddenBoards.indexOf(bid);
      if (idx === -1) {
        S.draftConfig.hiddenBoards.push(bid);
        this.innerHTML = `${icon("eyeOff")} <span>Hidden</span>`;
        this.classList.add("hidden-toggle");
        this.setAttribute("aria-label", `Set ${board.name} board visible`);
        this.title = `Set ${board.name} board visible`;
        S.draftConfig.groups.forEach(g => {
          const bi = g.boardIds.indexOf(bid);
          if (bi !== -1) g.boardIds.splice(bi, 1);
        });
      } else {
        S.draftConfig.hiddenBoards.splice(idx, 1);
        this.innerHTML = `${icon("eye")} <span>Visible</span>`;
        this.classList.remove("hidden-toggle");
        this.setAttribute("aria-label", `Hide ${board.name} board`);
        this.title = `Hide ${board.name} board`;
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
    <div class="stack settings-policy-stack">
      <div class="set-row">
        <div class="sk"><div class="nm">Cloudflare Access</div><div class="ds">Protected review and operations routes stay behind the configured access boundary.</div></div>
        <div class="sv">/review, /settings, /docs</div>
        ${uiChip("ok", "Enforced", { sm: true })}
      </div>
      <div class="set-row">
        <div class="sk"><div class="nm">Role boundary</div><div class="ds">Review Queue stays the human approval gate for external side effects.</div></div>
        <div class="sv">PM / UX / Runtime Owner</div>
        ${uiChip("ai", "Human gate", { sm: true })}
      </div>
      <div class="set-row settings-policy-label-row">
        <div class="sk"><div class="nm">Monitor labels</div><div class="ds">Saved immediately and reused by Boards Monitor.</div></div>
        <div class="teams-chips-list">
          ${S.draftConfig.monitorTeams.length ? S.draftConfig.monitorTeams.map((team, idx) => `
            <span class="team-manage-chip">
              ${esc(team)}
              <button type="button" class="team-del-btn" data-idx="${idx}" aria-label="Remove ${esc(team)}">${icon("x")}</button>
            </span>
          `).join("") : '<div class="settings-empty-inline">No monitor team labels yet.</div>'}
        </div>
        ${uiChip("muted", `${S.draftConfig.monitorTeams.length} labels`, { sm: true })}
      </div>
      <div class="settings-inline-editor settings-policy-editor">
        <input type="text" id="new-team-input" class="form-input" placeholder="Add monitor label, e.g. Design" aria-label="Add monitor label">
        <button type="button" class="btn primary sm" id="add-team-btn">Add label</button>
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
    const groupName = group.name || `Group ${gi + 1}`;
    row.innerHTML = `
      <div class="group-edit-header">
        <input type="color" class="group-color-picker" value="${group.color || "#6366f1"}" data-gi="${gi}" aria-label="Color for ${esc(groupName)}">
        <input type="text" class="group-edit-name" value="${esc(group.name)}" placeholder="Group name" data-gi="${gi}" aria-label="Name for ${esc(groupName)}">
        <button type="button" class="group-del-btn" data-gi="${gi}" title="Delete ${esc(groupName)} group" aria-label="Delete ${esc(groupName)} group">${icon("trash")} Delete</button>
      </div>
      <div class="group-boards-selector" data-gi="${gi}">
        ${S.boards.filter(b => !(S.draftConfig.hiddenBoards || []).includes(b.id)).map(b => `
          <button type="button" class="board-chip${assignedBoards.has(b.id) ? " selected" : ""}" data-bid="${b.id}" data-gi="${gi}" aria-pressed="${assignedBoards.has(b.id)}" aria-label="${assignedBoards.has(b.id) ? "Remove" : "Add"} ${esc(b.name)} ${assignedBoards.has(b.id) ? "from" : "to"} ${esc(groupName)} group" title="${assignedBoards.has(b.id) ? "Remove" : "Add"} ${esc(b.name)} ${assignedBoards.has(b.id) ? "from" : "to"} ${esc(groupName)} group">${esc(b.name)}</button>
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
        const selected = idx === -1;
        const boardName = chip.textContent.trim();
        const nextGroupName = S.draftConfig.groups[gi].name || `Group ${gi + 1}`;
        chip.classList.toggle("selected", selected);
        chip.setAttribute("aria-pressed", String(selected));
        chip.setAttribute("aria-label", `${selected ? "Remove" : "Add"} ${boardName} ${selected ? "from" : "to"} ${nextGroupName} group`);
        chip.title = `${selected ? "Remove" : "Add"} ${boardName} ${selected ? "from" : "to"} ${nextGroupName} group`;
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
      const wsLabel = ws.displayName || ws.name || "workspace";
      const wsInputId = `settings-workspace-${String(ws.id).replace(/[^a-z0-9_-]/gi, "-")}`;
      const row = document.createElement("div");
      row.className = "ws-row";
      row.innerHTML = `
        <label class="ws-label" for="${esc(wsInputId)}">
          <input type="checkbox" class="ws-check" id="${esc(wsInputId)}" data-wsid="${esc(ws.id)}" aria-label="Show ${esc(wsLabel)} workspace in Task Hub" ${isChecked ? "checked" : ""}>
          <span>${esc(wsLabel)}</span>
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
