// ── Utils ─────────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function ensureButtonTypes(root = document) {
  root?.querySelectorAll?.("button:not([type])").forEach(btn => btn.setAttribute("type", "button"));
  wireUiActionFeedback(root);
}

function feedbackMessageForControl(el) {
  if (!el) return "";
  return el.dataset.uiFeedback
    || el.getAttribute("title")
    || el.getAttribute("aria-label")
    || el.textContent?.trim()
    || "";
}

function wireUiActionFeedback(root = document) {
  root?.querySelectorAll?.("[data-ui-feedback], button[aria-disabled='true']:not([disabled])").forEach(control => {
    if (control.dataset.uiFeedbackReady === "true") return;
    control.dataset.uiFeedbackReady = "true";
    control.addEventListener("click", event => {
      const disabled = control.getAttribute("aria-disabled") === "true";
      if (!disabled && !control.dataset.uiFeedback) return;
      const message = feedbackMessageForControl(control);
      if (!message) return;
      event.preventDefault();
      if (disabled) event.stopPropagation();
      toast(message);
    });
  });
}

function restoreFocus(target, fallbackSelector = null) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  const fallback = fallbackSelector ? document.querySelector(fallbackSelector) : null;
  const next = (el && el.isConnected && !el.disabled) ? el : fallback;
  if (next && typeof next.focus === "function") {
    next.focus({ preventScroll: true });
    next.classList?.add("uiv2-focus-restored");
    setTimeout(() => next.classList?.remove("uiv2-focus-restored"), 900);
  }
}

function setInteractiveHidden(el, hidden = true) {
  if (!el) return;
  el.setAttribute("aria-hidden", String(Boolean(hidden)));
  if ("inert" in el) el.inert = Boolean(hidden);
  el.toggleAttribute("inert", Boolean(hidden));
  el.querySelectorAll("a[href], button, input, select, textarea, [tabindex]").forEach(node => {
    if (hidden) {
      if (!node.dataset.prevTabindex) {
        node.dataset.prevTabindex = node.hasAttribute("tabindex") ? node.getAttribute("tabindex") : "__none";
      }
      node.setAttribute("tabindex", "-1");
      return;
    }
    if (!node.dataset.prevTabindex) return;
    if (node.dataset.prevTabindex === "__none") node.removeAttribute("tabindex");
    else node.setAttribute("tabindex", node.dataset.prevTabindex);
    delete node.dataset.prevTabindex;
  });
}

function openSurface(el, focusSelector = null) {
  if (!el) return;
  el.classList.remove("hidden");
  setInteractiveHidden(el, false);
  ensureButtonTypes(el);
  if (focusSelector) setTimeout(() => restoreFocus(el.querySelector(focusSelector)), 0);
}

function closeSurface(el, focusTarget = null) {
  if (!el) return;
  const wasHidden = el.classList.contains("hidden")
    || el.getAttribute("aria-hidden") === "true"
    || getComputedStyle(el).display === "none";
  el.classList.add("hidden");
  setInteractiveHidden(el, true);
  if (focusTarget && !wasHidden) restoreFocus(focusTarget);
}

function syncClosedSurfaces() {
  document.querySelectorAll(".modal-overlay").forEach(el => {
    setInteractiveHidden(el, el.classList.contains("hidden"));
  });
  const sidebarBoards = $("sidebar-boards-section");
  if (sidebarBoards) {
    const hidden = sidebarBoards.style.display === "none" || getComputedStyle(sidebarBoards).display === "none";
    setInteractiveHidden(sidebarBoards, hidden);
  }
}

// B20: Format date/time to dd/mm/yyyy HH:mm in Thai Time (UTC+7)
function formatThaiDateTime(isoString, includeTime = true) {
  if (!isoString) return "";
  const d = new Date(isoString);
  // Manual offset for BKK (+7)
  const bkk = new Date(d.getTime() + (7 * 60 * 60 * 1000));

  const dd = String(bkk.getUTCDate()).padStart(2, '0');
  const mm = String(bkk.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = bkk.getUTCFullYear();
  const HH = String(bkk.getUTCHours()).padStart(2, '0');
  const MM = String(bkk.getUTCMinutes()).padStart(2, '0');

  let res = `${dd}/${mm}/${yyyy}`;
  if (includeTime) res += ` ${HH}:${MM}`;
  return res;
}

// B20: Helper to format ISO string for <input type="datetime-local"> in BKK time
function formatISOForInput(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const bkk = new Date(d.getTime() + (7 * 60 * 60 * 1000));

  const yyyy = bkk.getUTCFullYear();
  const mm = String(bkk.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(bkk.getUTCDate()).padStart(2, '0');
  const HH = String(bkk.getUTCHours()).padStart(2, '0');
  const MM = String(bkk.getUTCMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
}

// B20: Helper to parse datetime-local input value as BKK time and return UTC ISO string
function parseInputToUTC(val) {
  if (!val) return null;
  // val is "YYYY-MM-DDTHH:mm"
  // Split into parts to avoid browser timezone interference
  const [datePart, timePart] = val.split('T');
  const [y, m, d] = datePart.split('-');
  const [hh, mm] = timePart.split(':');

  // Create a string that Date can parse as UTC, then adjust by 7 hours
  const utcEquivalent = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(utcEquivalent.getTime() - (7 * 60 * 60 * 1000)).toISOString();
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// Shared SVG icon primitive. Implemented by Codex Dev.
const ICON_PATHS = {
  alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
  arrowR: '<path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  calendar: '<path d="M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  checkSquare: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.7 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-3.1 4.1"/><path d="M6.1 6.1C3.5 7.8 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 4.7-1.1"/><path d="M9.9 9.9A3 3 0 0 0 14.1 14.1"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  flag: '<path d="M4 22V4"/><path d="M4 5h12l-1 4 1 4H4"/>',
  gitMerge: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M9 6h3a6 6 0 0 1 6 6v3"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M2 12V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"/>',
  layout: '<path d="M4 4h6v16H4z"/><path d="M14 4h6v9h-6z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  more: '<path d="M12 5h.01"/><path d="M12 12h.01"/><path d="M12 19h.01"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.3"/><path d="M21 8V3h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3"/><path d="M3 16v5h5"/>',
  search: '<path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M21 21l-4.3-4.3"/>',
  filter: '<path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/>',
  settings: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8L4.2 6a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V2a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  sparkles: '<path d="M12 3l2.39 5.16L20 9l-4 3.9.94 5.6L12 16l-4.94 2.5L8 12.9 4 9l5.61-.84L12 3z"/>',
  target: '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/><path d="M12 12h0"/>',
  today: '<path d="M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>',
  tasks: '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
  building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10"/><path d="M8 7h4"/><path d="M8 11h4"/><path d="M8 15h4"/><path d="M3 21h18"/>',
  boards: '<path d="M4 4h6v16H4z"/><path d="M14 4h6v9h-6z"/>',
  planner: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  focus: '<path d="M3 4h6"/><path d="M3 12h6"/><path d="M3 20h6"/><path d="M14 4l7 7-7 7"/>',
  trace: '<path d="M4 6h10"/><path d="M4 12h10"/><path d="M4 18h6"/><path d="M19 8l-3 3 3 3"/>',
  upload: '<path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

function icon(name, attrs = "") {
  const body = ICON_PATHS[name] || ICON_PATHS.today;
  const sizedAttrs = /\b(width|height)=/.test(attrs)
    ? attrs
    : `width="16" height="16" ${attrs}`;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${sizedAttrs}>${body}</svg>`;
}

const DEFAULT_TRELLO_STATUS = {
  configured: false,
  verified: false,
  connected: false,
  state: "unknown",
  error: "Trello connection has not been verified yet.",
};

function trelloConnection() {
  return (typeof S !== "undefined" && S.trelloStatus) || DEFAULT_TRELLO_STATUS;
}

function isTrelloVerified() {
  const status = trelloConnection();
  return Boolean(status.verified || status.connected || status.state === "verified");
}

function trelloConnectionSummary() {
  const status = trelloConnection();
  const state = status.state || "unknown";
  if (state === "verified") {
    return {
      label: "Verified",
      chipClass: "is-connected",
      statClass: "is-ok",
      dotClass: "dot-green",
      description: "Trello connection is verified and board data can load.",
    };
  }
  if (state === "invalid") {
    return {
      label: "Needs verification",
      chipClass: "is-warning",
      statClass: "is-warning",
      dotClass: "dot-red",
      description: status.error || "Runtime needs to review Trello private connection values before board data can load.",
    };
  }
  if (state === "disconnected") {
    return {
      label: "Disconnected",
      chipClass: "",
      statClass: "is-muted",
      dotClass: "dot-gray",
      description: status.error || "Runtime needs to configure Trello private connection values before board data can load.",
    };
  }
  if (state === "rate_limited") {
    return {
      label: "Retry later",
      chipClass: "is-warning",
      statClass: "is-warning",
      dotClass: "dot-gray",
      description: status.error || "Trello is rate limited. Wait a moment, then refresh.",
    };
  }
  return {
    label: "Unavailable",
    chipClass: "",
    statClass: "is-muted",
    dotClass: "dot-gray",
    description: status.error || "Trello connection could not be verified. Ask Runtime to check private connection values and connectivity.",
  };
}

function trelloRouteUnavailableHtml(routeName) {
  const summary = trelloConnectionSummary();
  return routeStateHtml({
    tone: "warning",
    iconName: "alert",
    title: `${routeName} needs Trello verification`,
    body: summary.description,
    meta: "Runtime owns Trello connection verification. You can continue using non-Trello routes while this is checked.",
  });
}

function updateTrelloSidebarStatus() {
  updateSidebarConnectionSummary();
  updateIntegrationStatusbar();
}

function trelloConnectionShortState() {
  const state = trelloConnection().state || "unknown";
  if (state === "verified" || isTrelloVerified()) return "ok";
  if (state === "invalid" || state === "rate_limited") return "check";
  return "off";
}

function updateGcalSidebarStatus(connected = Boolean(typeof CAL !== "undefined" && CAL.status?.connected)) {
  updateSidebarConnectionSummary(connected);
}

function sidebarConnectionItems(gcalConnected = Boolean(typeof CAL !== "undefined" && CAL.status?.connected)) {
  const trelloState = trelloConnectionShortState();
  return [
    {
      id: "trello",
      label: "trello",
      state: trelloState,
      tone: trelloState === "ok" ? "ok" : trelloState === "check" ? "warn" : "off",
    },
    {
      id: "gcal",
      label: "gcal",
      state: gcalConnected ? "ok" : "off",
      tone: gcalConnected ? "ok" : "off",
    },
    {
      id: "paperclip",
      label: "paperclip",
      state: "staged",
      tone: "warn",
    },
    {
      id: "gtasks",
      label: "gtasks",
      state: "off",
      tone: "off",
    },
  ];
}

function updateSidebarConnectionSummary(gcalConnected = Boolean(typeof CAL !== "undefined" && CAL.status?.connected)) {
  const summary = $("sidebar-connection-summary");
  const dot = $("sidebar-connection-summary-dot");
  const text = $("sidebar-connection-summary-text");
  const detail = $("sidebar-connection-summary-detail");
  const exceptions = $("sidebar-connection-exceptions");
  if (!summary && !exceptions) return;

  const items = sidebarConnectionItems(gcalConnected);
  const okCount = items.filter(item => item.tone === "ok").length;
  const stagedCount = items.filter(item => item.state === "staged").length;
  const offCount = items.filter(item => item.tone === "off").length;
  const checkCount = items.filter(item => item.tone === "warn" && item.state !== "staged").length;
  const exceptionItems = items.filter(item => item.tone !== "ok");
  const summaryParts = [`${okCount} ok`];
  if (stagedCount) summaryParts.push(`${stagedCount} staged`);
  if (offCount) summaryParts.push(`${offCount} off`);
  if (checkCount) summaryParts.push(`${checkCount} check`);

  if (dot) {
    const dotClass = checkCount ? "dot-red" : exceptionItems.length ? "dot-orange" : "dot-green";
    dot.className = `status-dot ${dotClass}`;
  }
  if (text) text.textContent = "Connections";
  if (detail) {
    detail.textContent = summaryParts.join(" \u00b7 ");
  }
  if (summary) {
    summary.setAttribute(
      "aria-label",
      `Connection summary. ${summaryParts.join(", ")}. Open Settings for connector details.`
    );
    summary.title = "Open Settings for connector details";
  }
  if (exceptions) {
    exceptions.innerHTML = exceptionItems.length
      ? exceptionItems.map(item => `
          <span class="conn-exception-chip is-${esc(item.tone)}">
            <span class="status-dot ${item.tone === "warn" ? "dot-orange" : item.tone === "off" ? "dot-gray" : "dot-red"}"></span>
            ${esc(item.label)} \u00b7 ${esc(item.state)}
          </span>
        `).join("")
      : '<span class="conn-exception-chip is-ok"><span class="status-dot dot-green"></span>ready</span>';
  }
}

function setTopbarRouteActions(html = "") {
  const slot = $("topbar-route-actions");
  if (!slot) return;
  slot.innerHTML = html || "";
  ensureButtonTypes(slot);
  slot.hidden = !html;
}

function updateIntegrationStatusbar() {
  const trello = trelloConnectionSummary();
  const trelloState = trelloConnectionShortState();
  const trelloText = $("statusbar-trello");
  const trelloDot = $("statusbar-trello-dot");
  if (trelloText) trelloText.textContent = `trello \u00b7 ${trelloState}`;
  if (trelloDot) trelloDot.className = `status-dot ${trello.dotClass}`;

  const gcalConnected = Boolean(typeof CAL !== "undefined" && CAL.status?.connected);
  const gcalText = $("statusbar-gcal");
  const gcalDot = $("statusbar-gcal-dot");
  if (gcalText) gcalText.textContent = `gcal \u00b7 ${gcalConnected ? "ok" : "off"}`;
  if (gcalDot) gcalDot.className = `status-dot ${gcalConnected ? "dot-green" : "dot-gray"}`;
  updateGcalSidebarStatus(gcalConnected);

  const syncText = $("statusbar-sync");
  if (syncText) {
    const now = new Date();
    syncText.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }
  updateStatusbarDescriptions();
}

function getStatusbarItem(key) {
  const byKey = document.querySelector(`.shell-status-strip [data-statusbar-item="${key}"]`);
  if (byKey) return byKey;
  const groups = [...document.querySelectorAll(".shell-status-strip .statusbar-group")];
  return groups.find(group => (group.textContent || "").trim().toLowerCase().startsWith(key)) || null;
}

function setStatusbarDescription(key, title, body) {
  const item = getStatusbarItem(key);
  if (!item) return;
  item.classList.add("has-status-help");
  item.dataset.statusbarItem = key;
  item.dataset.statusTitle = title;
  item.dataset.statusDesc = body;
  item.setAttribute("role", "note");
  item.setAttribute("aria-label", `${title}. ${body}`);
  item.setAttribute("title", `${title}: ${body}`);
  item.removeAttribute("tabindex");
}

function statusbarSafeTrelloDescription() {
  const state = typeof trelloConnectionShortState === "function" ? trelloConnectionShortState() : "off";
  if (state === "ok") {
    return "Trello is verified. Trello remains the execution surface while Task Hub stays the command and review layer.";
  }
  if (state === "check") {
    return "Trello needs an operator check. Keep Review Queue as the gate and ask Runtime to verify connector health.";
  }
  return "Trello is not verified in this browser state. Non-Trello review and planning surfaces can still be inspected safely.";
}

function statusbarSafeCalendarDescription() {
  const connected = Boolean(typeof CAL !== "undefined" && CAL.status?.connected);
  return connected
    ? "Google Calendar is connected. Calendar context can be shown, while writes stay behind explicit review approval."
    : "Google Calendar is off or disconnected. Calendar can still show Trello and review-derived work without exposing private values.";
}

function updateStatusbarDescriptions() {
  const envValue = document.querySelector('[data-statusbar-item="env"] .status-value')?.textContent?.trim() || "dev";
  const buildValue = document.querySelector('[data-statusbar-item="build"] .status-value')?.textContent?.trim() || "ui-v2";
  const workspaceValue = document.querySelector('[data-statusbar-item="workspace"] .status-value')?.textContent?.trim() || "trisilar";
  const syncValue = $("statusbar-sync")?.textContent?.trim() || "checking";
  setStatusbarDescription("env", `env ${envValue}`, "Current app environment label for this preview. It is display-only and does not expose runtime values.");
  setStatusbarDescription("build", `build ${buildValue}`, "UI V2 shell and component system is active in this preview build.");
  setStatusbarDescription("workspace", `workspace ${workspaceValue}`, "Current workspace context. Production data still comes from the existing app APIs and stores.");
  setStatusbarDescription("trello", $("statusbar-trello")?.textContent?.trim() || "trello", statusbarSafeTrelloDescription());
  setStatusbarDescription("gcal", $("statusbar-gcal")?.textContent?.trim() || "gcal", statusbarSafeCalendarDescription());
  setStatusbarDescription("paperclip", "paperclip staged", "Paperclip intake is staged and gated. Proposed work must pass Review Queue before any Trello, Calendar, or Google Tasks side effect.");
  setStatusbarDescription("gtasks", "gtasks off", "Google Tasks is off in this status strip. Planner keeps Trello deadline planning visible while Workspace Admin handles connection setup.");
  setStatusbarDescription("sync", `last sync ${syncValue}`, "Last browser-side status refresh time for the current shell. Use Refresh to pull route data again.");
  updateStatusbarDetailsControl();
}

function updateStatusbarDetailsControl() {
  const button = $("statusbar-details");
  if (!button) return;
  const groups = [...document.querySelectorAll(".shell-status-strip .statusbar-group.has-status-help")];
  const summary = groups
    .map(item => `${item.dataset.statusTitle || item.textContent.trim()}: ${item.dataset.statusDesc || ""}`)
    .filter(Boolean)
    .join(" ");
  button.classList.add("has-status-help");
  button.dataset.statusTitle = "Status details";
  button.dataset.statusDesc = summary || "Current environment, workspace, connector, and sync status for this UI V2 preview.";
  button.setAttribute("aria-label", `Status details. ${button.dataset.statusDesc}`);
  button.setAttribute("title", "Status details");
}

function ensureStatusbarTooltip() {
  let tooltip = $("statusbar-tooltip");
  if (tooltip) return tooltip;
  tooltip = document.createElement("div");
  tooltip.id = "statusbar-tooltip";
  tooltip.className = "statusbar-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.innerHTML = '<strong></strong><span></span>';
  document.body.appendChild(tooltip);
  return tooltip;
}

function hideStatusbarTooltip() {
  const tooltip = $("statusbar-tooltip");
  if (!tooltip) return;
  tooltip.classList.remove("is-visible");
  tooltip.setAttribute("aria-hidden", "true");
}

function showStatusbarTooltip(target) {
  if (!target?.dataset?.statusDesc) return;
  const tooltip = ensureStatusbarTooltip();
  tooltip.querySelector("strong").textContent = target.dataset.statusTitle || target.textContent.trim();
  tooltip.querySelector("span").textContent = target.dataset.statusDesc;
  tooltip.classList.add("is-visible");
  tooltip.setAttribute("aria-hidden", "false");

  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const left = Math.min(
    Math.max(8, targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)),
    Math.max(8, window.innerWidth - tooltipRect.width - 8)
  );
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${targetRect.bottom + 8}px`;
}

function setupStatusbarDescriptions() {
  const strip = document.querySelector(".shell-status-strip");
  if (!strip) return;
  updateStatusbarDescriptions();
  if (strip.dataset.statusbarHelpReady === "true") return;
  strip.dataset.statusbarHelpReady = "true";

  strip.addEventListener("pointerover", event => {
    const target = event.target.closest(".statusbar-group.has-status-help, .statusbar-details-btn.has-status-help");
    if (!target || !strip.contains(target)) return;
    showStatusbarTooltip(target);
  });
  strip.addEventListener("pointerout", event => {
    const target = event.target.closest(".statusbar-group.has-status-help, .statusbar-details-btn.has-status-help");
    if (!target || target.contains(event.relatedTarget)) return;
    hideStatusbarTooltip();
  });
  strip.addEventListener("focusin", event => {
    const target = event.target.closest(".statusbar-group.has-status-help, .statusbar-details-btn.has-status-help");
    if (target) showStatusbarTooltip(target);
  });
  strip.addEventListener("focusout", hideStatusbarTooltip);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") hideStatusbarTooltip();
  });
  window.addEventListener("resize", hideStatusbarTooltip);
}

function routeStateHtml({ tone = "neutral", iconName = "alert", title = "", body = "", meta = "", actionHtml = "" } = {}) {
  const safeTone = ["neutral", "info", "warning", "danger", "success", "ai"].includes(tone) ? tone : "neutral";
  return `
    <div class="empty-state route-state-card is-${safeTone}">
      <div class="empty-icon route-state-icon">${icon(iconName)}</div>
      <h3>${esc(title)}</h3>
      ${body ? `<p>${esc(body)}</p>` : ""}
      ${meta ? `<p class="route-state-meta">${esc(meta)}</p>` : ""}
      ${actionHtml ? `<div class="route-state-actions">${actionHtml}</div>` : ""}
    </div>`;
}

// UI V2 component-primitives for production routes.
function uiRouteBar({ title = "", sub = "", actions = "" } = {}) {
  return `
    <div class="route-bar">
      <div>
        <div class="rb-title">${title}</div>
        ${sub ? `<div class="rb-sub">${sub}</div>` : ""}
      </div>
      ${actions ? `<div class="rb-actions">${actions}</div>` : ""}
    </div>`;
}

function uiPanel({ title = "", eyebrow = "", actions = "", body = "", tight = false, foot = "" } = {}) {
  return `
    <section class="panel">
      ${(title || eyebrow || actions) ? `
        <header class="panel-head">
          <div>
            ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
            ${title ? `<div class="pt">${title}</div>` : ""}
          </div>
          ${actions ? `<div class="pa">${actions}</div>` : ""}
        </header>` : ""}
      <div class="panel-body${tight ? " tight" : ""}">${body}</div>
      ${foot ? `<footer class="panel-foot">${foot}</footer>` : ""}
    </section>`;
}

function uiStatStrip(cells = []) {
  return `
    <div class="stat-strip">
      ${cells.map(cell => `
        <div class="stat-cell ${esc(cell.tone || "")}">
          <span class="k">${esc(cell.label || "")}</span>
          <span class="v">${esc(cell.value ?? "")}</span>
          <span class="d">${esc(cell.detail || "")}</span>
        </div>
      `).join("")}
    </div>`;
}

function uiChip(tone = "muted", text = "", { sm = false, dot = false } = {}) {
  const safeTone = String(tone || "muted").replace(/[^a-z0-9_-]/gi, "");
  return `<span class="chip ${safeTone}${sm ? " sm" : ""}">${dot ? '<span class="dot"></span>' : ""}${esc(text)}</span>`;
}

function uiKV(k, v, tone = "") {
  const safeTone = String(tone || "").replace(/[^a-z0-9_-]/gi, "");
  return `<span class="kv"><span class="k">${esc(k)}</span><span class="v ${safeTone}">${esc(v)}</span></span>`;
}

function uiDue(text, state = "none") {
  const safeState = String(state || "none").replace(/[^a-z0-9_-]/gi, "");
  return `<span class="due ${safeState}"><span class="due-mark"></span>${esc(text || "No due")}</span>`;
}

function uiBoardTag(name, color = "") {
  const label = name || "No board";
  return `<span class="board-tag" title="${esc(label)}"><span class="dot" style="background:${esc(color || "var(--brand)")};"></span>${esc(label)}</span>`;
}

function uiAvatarStack(members = []) {
  const people = Array.isArray(members) ? members : [];
  if (!people.length) return '<span class="av ghost sm">-</span>';
  const shown = people.slice(0, 3).map(member => {
    const name = member.fullName || member.username || member.name || member.id || "?";
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";
    return `<span class="av sm" title="${esc(name)}">${esc(initials)}</span>`;
  }).join("");
  const more = people.length > 3 ? `<span class="av sm">+${people.length - 3}</span>` : "";
  return `<span class="av-stack">${shown}${more}</span>`;
}

function uiRisk(level = "low") {
  const safeLevel = ["low", "med", "high"].includes(level) ? level : "low";
  const on = safeLevel === "high" ? 5 : safeLevel === "med" ? 3 : 1;
  return `
    <span class="risk ${safeLevel}">
      <span class="risk-segs">${[0,1,2,3,4].map(i => `<i class="${i < on ? "on" : ""}"></i>`).join("")}</span>
      <span class="risk-label">${safeLevel.toUpperCase()}</span>
    </span>`;
}

function uiConfidence(value = 0, level = "med") {
  const pct = Math.max(0, Math.min(100, Math.round(Number(value || 0) * 100)));
  const safeLevel = ["low", "med", "high"].includes(level) ? level : "med";
  return `
    <span class="conf ${safeLevel}">
      <span class="bar"><i style="width:${pct}%"></i></span>
      <span>${pct}%</span>
    </span>`;
}

function uiDiffBadge(kind = "create") {
  const normalized = String(kind || "").replace("_new", "").replace("_existing", "");
  const map = {
    create: { cls: "create", glyph: "+", label: "Create new" },
    update: { cls: "update", glyph: "D", label: "Update existing" },
    duplicate: { cls: "duplicate", glyph: "~", label: "Possible duplicate" },
    possible_duplicate: { cls: "duplicate", glyph: "~", label: "Possible duplicate" },
    missing: { cls: "missing", glyph: "!", label: "Missing context" },
  };
  const cfg = map[normalized] || map[String(kind)] || map.create;
  return `<span class="diff ${cfg.cls}"><span class="glyph">${cfg.glyph}</span><span>${cfg.label}</span></span>`;
}

function uiStateCard({ kind = "empty", iconName = "inbox", title = "", desc = "", actions = "" } = {}) {
  return `
    <div class="state-card ${esc(kind)}">
      <div class="state-glyph">${icon(iconName)}</div>
      <div class="st-title">${esc(title)}</div>
      ${desc ? `<div class="st-desc">${esc(desc)}</div>` : ""}
      ${actions ? `<div class="st-act">${actions}</div>` : ""}
    </div>`;
}

function uiTaskRow(card, { selected = false, done = false, dueState = "", dueText = "", statusText = "", sourceText = "Trello" } = {}) {
  const title = card.name || card.title || "Untitled task";
  const boardName = card.boardName || card.board || "No board";
  const listName = card.listName || card.list || "No list";
  const labels = (card.labels || []).filter(label => label.name).slice(0, 3)
    .map(label => uiChip(labelTone(label.color), label.name, { sm: true }))
    .join("");
  return `
    <div class="trow ${selected ? "selected" : ""} ${done || card.dueComplete ? "done" : ""}" data-card-id="${esc(card.id || "")}">
      <span class="tck">${done || card.dueComplete ? icon("check") : ""}</span>
      <div class="tmain">
        <div class="ttitle">${esc(title)}</div>
        <div class="tmeta">
          ${uiBoardTag(boardName, boardColorForName(boardName))}
          <span class="sep">/</span>
          <span>${esc(listName)}</span>
          <span class="sep">/</span>
          <span>${esc(sourceText)}</span>
        </div>
      </div>
      <div class="tlabels">${labels}</div>
      <div class="tmem">${uiAvatarStack(card.members || [])}</div>
      <div class="tdue">${uiDue(dueText || (card.due ? formatThaiDateTime(card.due, false) : "No due"), dueState || dueStateFromCard(card))}</div>
      ${statusText ? `<div class="tstatus">${uiChip(dueToneFromState(dueState || dueStateFromCard(card)), statusText, { sm: true })}</div>` : ""}
    </div>`;
}

function labelTone(color) {
  if (["red"].includes(color)) return "over";
  if (["yellow", "orange"].includes(color)) return "warn";
  if (["green", "lime"].includes(color)) return "ok";
  if (["purple"].includes(color)) return "ai";
  if (["blue", "sky"].includes(color)) return "brand";
  return "muted";
}

function dueStateFromCard(card) {
  if (card.dueComplete) return "done";
  if (!card.due) return "none";
  const now = new Date();
  const due = new Date(card.due);
  if (due < now) return "over";
  if (due.toDateString() === now.toDateString()) return "warn";
  return "upcoming";
}

function dueToneFromState(state) {
  if (state === "over" || state === "overdue") return "over";
  if (state === "warn" || state === "today") return "warn";
  if (state === "done") return "ok";
  return "muted";
}

function boardColorForName(name) {
  const colors = typeof COLORS !== "undefined" ? COLORS : ["#1e58e6", "#137e52", "#b86a05", "#7c3aed"];
  let hash = 0;
  String(name || "").split("").forEach(ch => { hash = (hash * 31 + ch.charCodeAt(0)) >>> 0; });
  return colors[hash % colors.length] || "var(--brand)";
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let _tt;
function toast(msg, isError = false) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.setAttribute("aria-hidden", "false");
  el.style.background = isError ? "#b91c1c" : "#1e293b";
  el.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(() => {
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
    el.textContent = "";
  }, 3000);
}

// ── Global Error Handling ─────────────────────────────────────────────────────
window.onerror = function(msg, url, line, col, error) {
  console.error("[Global Error]", msg, error);
  toast(`Unexpected error: ${msg}`, true);
  return false;
};

window.onunhandledrejection = function(event) {
  console.error("[Unhandled Rejection]", event.reason);
  toast(`Promise rejected: ${event.reason?.message || event.reason}`, true);
};
