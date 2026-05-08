// ── Utils ─────────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

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
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  checkSquare: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="m5.5 4-3 8v6a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-6l-3-8Z"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.6 6.1"/><path d="M3 12A9 9 0 0 1 18.6 5.9"/><path d="M3 18v-6h6"/><path d="M21 6v6h-6"/>',
  settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1A1.6 1.6 0 0 0 4.8 15a1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7.1 4.3l.1.1A1.6 1.6 0 0 0 9 4.7a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1.1Z"/>',
  sparkles: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z"/><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  today: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 14h5"/>'
};

function icon(name, attrs = "") {
  const body = ICON_PATHS[name] || ICON_PATHS.today;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${attrs}>${body}</svg>`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let _tt;
function toast(msg, isError = false) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.background = isError ? "#b91c1c" : "#1e293b";
  el.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove("show"), 3000);
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
