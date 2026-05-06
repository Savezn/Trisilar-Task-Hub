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

// ── Toast ─────────────────────────────────────────────────────────────────────
let _tt;
function toast(msg, isError = false) {
  const el = $("toast");
  el.textContent = msg;
  el.style.background = isError ? "#b91c1c" : "#1e293b";
  el.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove("show"), 3000);
}
