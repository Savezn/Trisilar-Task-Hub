// ── Navigation ────────────────────────────────────────────────────────────────
// Implemented by: Codex Dev (2026-05-07) - Router-1 URL path sync.
const PAGE_PATHS = {
  today: "/today",
  review: "/review",
  all: "/all",
  boards: "/boards",
  calendar: "/calendar",
  docs: "/docs",
  planner: "/planner",
  okr: "/okr",
  focus: "/focus",
  settings: "/settings",
};

const PATH_PAGES = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([page, path]) => [path, page])
);

const ROUTE_META = {
  today: { label: "Today", tone: "work" },
  review: { label: "Review Queue", tone: "review" },
  all: { label: "All Tasks", tone: "work" },
  boards: { label: "Boards Monitor", tone: "ops" },
  calendar: { label: "Calendar", tone: "info" },
  docs: { label: "Docs / AI Trace", tone: "ai" },
  planner: { label: "Planner", tone: "work" },
  okr: { label: "OKR / Portfolio", tone: "ops" },
  focus: { label: "Weekly Focus", tone: "work" },
  settings: { label: "Settings", tone: "ops" },
};

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

function updateShellRouteState(page) {
  const meta = ROUTE_META[page] || ROUTE_META.today;
  document.body.dataset.route = page;
  document.body.dataset.routeTone = meta.tone;

  const routePill = $("shell-route-pill");
  if (routePill) {
    routePill.textContent = meta.label;
    routePill.className = "crumb-now";
  }
  if (typeof setTopbarRouteActions === "function") setTopbarRouteActions("");
  if (typeof updateScopeShell === "function") updateScopeShell();
}

function navigateTo(page, options = {}) {
  try {
    if (typeof closeMobileNav === "function") closeMobileNav();

    if (PAGE_PATHS[page] && options.updateUrl !== false) {
      syncPagePath(page, { replace: Boolean(options.replace) });
    }

    updateShellRouteState(page);

    // Update active nav items. Mobile keeps non-tab routes under More, matching UI V2 MTabBar.
    const mobileActivePage = ["today", "review", "all", "boards"].includes(page) ? page : "settings";
    document.querySelectorAll(".nav-item[data-page]").forEach(el => {
      const targetPage = el.classList.contains("mobile-route-item") ? mobileActivePage : page;
      el.classList.toggle("active", el.dataset.page === targetPage);
    });
    if (typeof renderScopeList === "function") renderScopeList();

    // Show/hide boards section in sidebar
    const boardsSection = $("sidebar-boards-section");
    const showBoards = page === "board" || page === "group";
    if (boardsSection) {
      boardsSection.style.display = showBoards ? "" : "none";
      if (typeof setInteractiveHidden === "function") setInteractiveHidden(boardsSection, !showBoards);
    }

    switch (page) {
      case "today":    showTodayPage();       break;
      case "review":   showReviewPage();      break;
      case "all":      showAllTasks();        break;
      case "boards":   showBoardsMonitor();   break;
      case "calendar": showCalendar();        break;
      case "docs":     showDocsPage();        break;
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
          <div class="empty-icon">${icon("alert")}</div>
          <h3>Failed to load page</h3>
          <p style="color:var(--danger)">${esc(e.message)}</p>
          <button class="btn btn-primary btn-sm" type="button" style="margin-top:12px" onclick="location.reload()">Reload Application</button>
        </div>`;
    }
    toast(`Page load error: ${e.message}`, true);
  }
}

window.addEventListener("popstate", () => {
  navigateTo(getPageFromPath(), { updateUrl: false });
});
