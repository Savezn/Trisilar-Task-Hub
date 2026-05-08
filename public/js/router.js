// ── Navigation ────────────────────────────────────────────────────────────────
// Implemented by: Codex Dev (2026-05-07) - Router-1 URL path sync.
const PAGE_PATHS = {
  today: "/today",
  review: "/review",
  all: "/all",
  boards: "/boards",
  calendar: "/calendar",
  planner: "/planner",
  okr: "/okr",
  focus: "/focus",
  settings: "/settings",
};

const PATH_PAGES = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([page, path]) => [path, page])
);

function getPageFromPath(pathname = window.location.pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return "today";
  return PATH_PAGES[normalized] || "today";
}

function syncPagePath(page, { replace = false } = {}) {
  const path = PAGE_PATHS[page];
  if (!path || window.location.pathname === path) return;
  if (page === "today" && replace && window.location.pathname === "/") return;
  const nextUrl = `${path}${window.location.search}${window.location.hash}`;
  const state = { page };
  if (replace) window.history.replaceState(state, "", nextUrl);
  else window.history.pushState(state, "", nextUrl);
}

function navigateTo(page, options = {}) {
  try {
    if (typeof closeMobileNav === "function") closeMobileNav();

    if (PAGE_PATHS[page] && options.updateUrl !== false) {
      syncPagePath(page, { replace: Boolean(options.replace) });
    }

    // Update active nav items
    document.querySelectorAll(".nav-item").forEach(el => {
      el.classList.toggle("active", el.dataset.page === page);
    });

    // Show/hide boards section in sidebar
    const boardsSection = $("sidebar-boards-section");
    const showBoards = page === "board" || page === "group";
    if (boardsSection) boardsSection.style.display = showBoards ? "" : "none";

    switch (page) {
      case "today":    showTodayPage();       break;
      case "review":   showReviewPage();      break;
      case "all":      showAllTasks();        break;
      case "boards":   showBoardsMonitor();   break;
      case "calendar": showCalendar();        break;
      case "planner":  showPlannerPage();     break;
      case "okr":      showOKRPage();         break;
      case "focus":    showWeeklyFocusPage(); break;
      case "settings": showSettingsPage();    break;
      default:
        // board / group navigation handled by selectBoard / selectGroup
        break;
    }
  } catch (e) {
    console.error("[Navigation Error]", e);
    const content = $("board-content");
    if (content) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠</div>
          <h3>Failed to load page</h3>
          <p style="color:var(--danger)">${esc(e.message)}</p>
          <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="location.reload()">Reload Application</button>
        </div>`;
    }
    toast(`Page load error: ${e.message}`, true);
  }
}

window.addEventListener("popstate", () => {
  navigateTo(getPageFromPath(), { updateUrl: false });
});
