// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  boards: [],
  config: { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] },
  trelloStatus: {
    configured: false,
    verified: false,
    connected: false,
    state: "unknown",
    error: "Trello connection has not been verified yet.",
  },
  draftConfig: null,
  currentBoardId: null,
  currentGroupId: null,
  scopeGroupId: "",
  currentLists: [],
  mode: "today",   // "today" | "review" | "all" | "board" | "group" | "calendar" | "docs" | "planner" | "okr" | "focus" | "settings"
  docsSelectedArtifactId: null,
  paperclipDocsIndex: null,
  pendingReviewTaskLink: null,
  focusOwner: "",  // P7-5: selected owner id in Weekly Focus (persists across re-renders)
  allCardsCache: null,
  editing: null,
  pendingDeleteId: null,
  dragCardId: null,
  dragSourceListId: null,
  reviewExpanded: new Set(),   // Set<sessionId> — which sessions are expanded
  reviewSelected: new Map(),   // Map<sessionId, Set<taskId>> — bulk selection
  overdueToastShown: false,    // P8-1: show overdue alert only once per session
  bmHiddenLabels: new Set(),   // P9-4: label names hidden in Boards Monitor (persists in session)
  bmGroupBy: "boards",        // P10-1: grouping mode in Boards Monitor ('boards' | 'teams')
  bmTeamLayout: "stats",       // P10-2: layout mode in Team Monitor ('stats' | 'board')
  bmConventionOnly: false,      // UI V2: routebar convention-warning mode
  focusWeekOffset: 0,           // UI V2: Weekly Focus topbar week segment
  atSortField: "due",          // P10-4: sort field for All Tasks table
  atSortOrder: "asc",          // P10-4: sort order ('asc' | 'desc')
  atViewMode: "table",         // UI V2: All Tasks view mode ('table' | 'list' | 'board' | 'owner')
  todayWorkFilter: "all",      // UI V2: Today work filter ('all' | 'mine' | 'risky')
};

const COLORS = ["#6366f1","#d29034","#519839","#b04632","#89609e","#cd5a91","#00aecc","#4bbf6b","#e44","#f90"];
