// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(page) {
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
}
