// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(page) {
  try {
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
