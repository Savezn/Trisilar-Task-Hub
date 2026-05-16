/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Mock Data
// All values are synthetic. No production secrets, real run-ids, or tokens.
// Run-ids prefixed `pc-` for Paperclip, `pm-` for PM Assistant agent.
// ─────────────────────────────────────────────────────────────────────────

const BU_GROUPS = [
  { id: "bu-rev", name: "Revenue Ops",    color: "#1e58e6" },
  { id: "bu-mkt", name: "Marketing",      color: "#0a6fb3" },
  { id: "bu-prod", name: "Product",       color: "#137e52" },
  { id: "bu-edu", name: "Education",      color: "#b86a05" },
  { id: "bu-ops", name: "Internal Ops",   color: "#7c3aed" },
];

const BOARDS = [
  { id: "b-rev-q2",   name: "Revenue Q2 2026",   bu: "bu-rev",  color: "#1e58e6", lists: 6, cards: 42, stale: 3 },
  { id: "b-rev-pipe", name: "Pipeline",          bu: "bu-rev",  color: "#3b6df7", lists: 5, cards: 28, stale: 1 },
  { id: "b-mkt-camp", name: "Q2 Campaigns",      bu: "bu-mkt",  color: "#0a6fb3", lists: 4, cards: 31, stale: 0 },
  { id: "b-mkt-cnt",  name: "Content Calendar",  bu: "bu-mkt",  color: "#56a1d4", lists: 5, cards: 24, stale: 2 },
  { id: "b-prod-rd",  name: "Product Roadmap",   bu: "bu-prod", color: "#137e52", lists: 6, cards: 38, stale: 0 },
  { id: "b-prod-bug", name: "Bug Triage",        bu: "bu-prod", color: "#56a87a", lists: 4, cards: 17, stale: 4 },
  { id: "b-edu-w2",   name: "Education W2",      bu: "bu-edu",  color: "#b86a05", lists: 3, cards: 9,  stale: 0 },
  { id: "b-ops-hr",   name: "HR & Hiring",       bu: "bu-ops",  color: "#7c3aed", lists: 4, cards: 11, stale: 1 },
  { id: "b-okr-q2",   name: "OKR Q2 2026",       bu: "bu-ops",  color: "#9061f5", lists: 3, cards: 14, stale: 0 },
];

const MEMBERS = [
  { id: "m-pim", name: "Pim Suriya",   initials: "PS", color: "#1e58e6" },
  { id: "m-tan", name: "Tan Wong",     initials: "TW", color: "#137e52" },
  { id: "m-may", name: "May Lertluk",  initials: "ML", color: "#b86a05" },
  { id: "m-ek",  name: "Ek Phong",     initials: "EP", color: "#c8312b" },
  { id: "m-nan", name: "Nan Aroon",    initials: "NA", color: "#7c3aed" },
  { id: "m-jib", name: "Jib Kanya",    initials: "JK", color: "#0a6fb3" },
];

const LABELS = {
  p0:        { name: "P0",        v: "over" },
  p1:        { name: "P1",        v: "warn" },
  revenue:   { name: "Revenue",   v: "brand" },
  campaign:  { name: "Campaign",  v: "info" },
  okr:       { name: "OKR",       v: "ai" },
  bug:       { name: "Bug",       v: "over" },
  internal:  { name: "Internal",  v: "muted" },
  blocked:   { name: "Blocked",   v: "warn" },
  staged:    { name: "Staged",    v: "info" },
};

// ── Today: 8 tasks, mixed status ────────────────────────────────────────
const TODAY_TASKS = [
  { id: "t-1", title: "P0 Revenue dashboard follow-up", board: "b-rev-q2", list: "Next",
    due: "Today · 16:00", dueState: "warn", members: ["m-pim"], labels: ["revenue", "p0"],
    checklist: [3, 5], gcal: true },
  { id: "t-2", title: "Confirm Trello connection state after refresh", board: "b-ops-hr", list: "Doing",
    due: "2d overdue", dueState: "over", members: ["m-ek"], labels: ["p1"], checklist: [1, 4] },
  { id: "t-3", title: "Prepare Paperclip staged canary checklist", board: "b-edu-w2", list: "Review",
    due: "Today · 18:00", dueState: "warn", members: ["m-tan", "m-pim"], labels: ["staged"],
    checklist: [4, 6], gcal: true, ai: true },
  { id: "t-4", title: "Review Q2 content workflow board", board: "b-mkt-cnt", list: "Doing",
    due: "Tomorrow · 10:00", dueState: "upcoming", members: ["m-may"], labels: ["campaign"], checklist: [2, 3] },
  { id: "t-5", title: "Triage 8 bugs from beta release", board: "b-prod-bug", list: "Backlog",
    due: "Today · 17:00", dueState: "warn", members: ["m-tan"], labels: ["bug"], checklist: [1, 8] },
  { id: "t-6", title: "Update Weekly Focus owner lanes", board: "b-okr-q2", list: "Planning",
    due: "Fri · 17:00", dueState: "upcoming", members: ["m-nan"], labels: ["internal"] },
  { id: "t-7", title: "Vendor contract — Cloud infra renewal", board: "b-rev-pipe", list: "In Progress",
    due: "+3d · 17:00", dueState: "upcoming", members: ["m-ek"] },
  { id: "t-8", title: "Interview · Senior Designer (round 2)", board: "b-ops-hr", list: "Scheduled",
    due: "+1d · 14:00", dueState: "upcoming", members: ["m-nan"], gcal: true },
];

// ── Review Queue: AI-extracted task proposals ──────────────────────────
const REVIEW_SESSIONS = [
  {
    id: "rs-1",
    title: "Weekly Marketing Sync — 15 May 2026",
    source: "paperclip",
    sourceEnv: "production",
    sourceRef: "req-26-05-15-0091",
    agent: { name: "PM Assistant", role: "agent" },
    runId: "pc-run-20260515-001",
    receivedAt: "Today · 09:32",
    summary: "Weekly Marketing review extracted from synced transcript. 4 proposed tasks across 2 boards.",
    proposals: [
      {
        id: "rt-1",
        title: "Send Songkran campaign brief to creative team",
        owner: "m-pim", ownerOk: true,
        deadline: "Fri 17:00",
        targetBoard: "b-mkt-camp", targetList: "Doing",
        diff: "update", matchedTitle: "Send brief — Songkran",
        confidence: 0.91, confLevel: "high",
        risk: "low", riskNote: "Owner present, board valid, due date plausible",
        sideEffects: ["Trello: update card", "GCal: update event"],
      },
      {
        id: "rt-2",
        title: "Review API contract for payment v2",
        owner: "m-tan", ownerOk: true,
        deadline: "Tomorrow 14:30",
        targetBoard: "b-prod-rd", targetList: "In Review",
        diff: "duplicate", matchedTitle: "Review API contract (payment v2)",
        confidence: 0.78, confLevel: "med",
        risk: "med", riskNote: "Possible duplicate — 0.78 similarity",
        sideEffects: ["Trello: link to existing card"],
      },
      {
        id: "rt-3",
        title: "Schedule vendor call for cloud infra renewal terms",
        owner: null, ownerOk: false,
        deadline: "+3d 14:00",
        targetBoard: "b-rev-pipe", targetList: "In Progress",
        diff: "missing", matchedTitle: null,
        confidence: 0.66, confLevel: "med",
        risk: "high", riskNote: "Missing owner",
        sideEffects: ["Trello: create card", "GCal: create event"],
      },
      {
        id: "rt-4",
        title: "Update employee handbook · WFH section",
        owner: "m-nan", ownerOk: true,
        deadline: null,
        targetBoard: "b-ops-hr", targetList: "Someday",
        diff: "create", matchedTitle: null,
        confidence: 0.96, confLevel: "high",
        risk: "low", riskNote: "Clean create — no duplicates found",
        sideEffects: ["Trello: create card"],
      },
    ],
  },
  {
    id: "rs-2",
    title: "Product Roadmap Review — 14 May 2026",
    source: "paperclip",
    sourceEnv: "staged",
    sourceRef: "req-26-05-14-0044",
    agent: { name: "PM Assistant", role: "agent" },
    runId: "pc-run-20260514-022",
    receivedAt: "Yesterday · 15:11",
    summary: "Roadmap Q3 review. 2 proposed tasks. Source environment: staged.",
    proposals: [
      {
        id: "rt-5",
        title: "Draft RFC for feature flag system",
        owner: "m-tan", ownerOk: true,
        deadline: "+7d 17:00",
        targetBoard: "b-prod-rd", targetList: "Planning",
        diff: "create",
        confidence: 0.94, confLevel: "high",
        risk: "low", riskNote: "Clean create — explicit owner",
        sideEffects: ["Trello: create card", "Google Tasks: add"],
      },
      {
        id: "rt-6",
        title: "Close all P1 bugs before release",
        owner: "m-ek", ownerOk: true,
        deadline: "+4d 17:00",
        targetBoard: "b-prod-bug", targetList: "Backlog",
        diff: "update",
        confidence: 0.86, confLevel: "high",
        risk: "low", riskNote: "Updates an existing tracked card",
        sideEffects: ["Trello: update card"],
      },
    ],
  },
];

// ── Boards Monitor ──────────────────────────────────────────────────────
const BOARD_HEALTH = [
  { id: "b-rev-q2",   cards: 42, overdue: 4, dueToday: 2, pending: 1, conv: 2, stale: 3, owner: "m-pim", spark: [3,5,4,6,7,5,8,9,7,6,8,9,11] },
  { id: "b-rev-pipe", cards: 28, overdue: 1, dueToday: 0, pending: 0, conv: 0, stale: 1, owner: "m-pim", spark: [4,5,4,3,5,6,5,4,5,6,5,5,4] },
  { id: "b-mkt-camp", cards: 31, overdue: 0, dueToday: 1, pending: 2, conv: 1, stale: 0, owner: "m-may", spark: [2,4,3,5,4,6,5,7,6,8,7,9,8] },
  { id: "b-mkt-cnt",  cards: 24, overdue: 2, dueToday: 0, pending: 0, conv: 0, stale: 2, owner: "m-may", spark: [3,4,3,2,4,5,4,3,4,5,4,5,4] },
  { id: "b-prod-rd",  cards: 38, overdue: 0, dueToday: 1, pending: 1, conv: 0, stale: 0, owner: "m-tan", spark: [5,6,7,6,8,7,9,10,9,11,10,12,13] },
  { id: "b-prod-bug", cards: 17, overdue: 3, dueToday: 0, pending: 0, conv: 0, stale: 4, owner: "m-ek",  spark: [8,6,7,5,4,3,5,4,6,5,3,4,5] },
];

// ── OKR / Portfolio ─────────────────────────────────────────────────────
const OBJECTIVES = [
  { id: "o-1", name: "Reach $1.4M ARR by end of Q2",     owner: "m-pim", progress: 0.62, status: "on",     krs: [
      { name: "KR1.1 · 40 new logos",                  pct: 0.7,  link: "b-rev-q2" },
      { name: "KR1.2 · Expansion revenue +18%",        pct: 0.55, link: "b-rev-pipe" },
      { name: "KR1.3 · Churn under 2.4%",              pct: 0.4,  link: "b-rev-q2" },
  ]},
  { id: "o-2", name: "Ship Paperclip staged canary",    owner: "m-tan", progress: 0.45, status: "risk",   krs: [
      { name: "KR2.1 · Reduce delivery defects 35%",   pct: 0.5,  link: "b-prod-rd" },
      { name: "KR2.2 · Staged rollout to 3 BUs",       pct: 0.33, link: "b-edu-w2" },
      { name: "KR2.3 · Webhook auth coverage 100%",    pct: 0.6,  link: "b-prod-rd" },
  ]},
  { id: "o-3", name: "Marketing org reaches 10 brand activations", owner: "m-may", progress: 0.78, status: "on", krs: [
      { name: "KR3.1 · 4 brand campaigns shipped",     pct: 0.75, link: "b-mkt-camp" },
      { name: "KR3.2 · Content velocity +25%",         pct: 0.82, link: "b-mkt-cnt" },
  ]},
  { id: "o-4", name: "Hiring · Close 3 senior roles",   owner: "m-nan", progress: 0.22, status: "behind", krs: [
      { name: "KR4.1 · Senior Designer offer",         pct: 0.5,  link: "b-ops-hr" },
      { name: "KR4.2 · Backend Lead pipeline · 5 cand",pct: 0.2,  link: "b-ops-hr" },
      { name: "KR4.3 · PM hire shortlist",             pct: 0.0,  link: "b-ops-hr" },
  ]},
];

// ── Integrations / runtime states ───────────────────────────────────────
const INTEGRATIONS = [
  { id: "trello",  name: "Trello",          status: "ok",   meta: "workspace · trisilar · 9 boards · last sync 2m ago", action: "Disconnect" },
  { id: "gcal",    name: "Google Calendar", status: "ok",   meta: "ops@trisilar · 2 calendars · last sync 1m ago",       action: "Disconnect" },
  { id: "gtasks",  name: "Google Tasks",    status: "off",  meta: "Not connected. Read-only Planner until enabled.",     action: "Connect" },
  { id: "paperclip", name: "Paperclip",     status: "warn", meta: "Mode · staged · last review 32m ago",                 action: "Manage" },
  { id: "access",  name: "Cloudflare Access", status: "ok", meta: "Required · enforced on review/* and settings",        action: "Policy" },
];

// ── Trace runs (Docs / AI Trace) ────────────────────────────────────────
const TRACE_RUNS = [
  { id: "pc-run-20260515-001", agent: "PM Assistant", env: "production", src: "paperclip",
    received: "Today 09:32", session: "rs-1", tasks: 4, status: "review",   linkTitle: "Weekly Marketing Sync — 15 May 2026" },
  { id: "pc-run-20260514-022", agent: "PM Assistant", env: "staged",     src: "paperclip",
    received: "14 May 15:11", session: "rs-2", tasks: 2, status: "approved", linkTitle: "Product Roadmap Review — 14 May 2026" },
  { id: "pc-run-20260513-009", agent: "Doc Aide",      env: "staged",     src: "paperclip",
    received: "13 May 11:04", session: null,   tasks: 1, status: "rejected", linkTitle: null,
    rejectReason: "Missing required field: owner" },
  { id: "pc-run-20260512-051", agent: "PM Assistant", env: "production", src: "paperclip",
    received: "12 May 17:50", session: "rs-x", tasks: 3, status: "approved", linkTitle: "Product Roadmap Review — 12 May" },
  { id: "pm-run-20260512-002", agent: "Manual Upload", env: "production", src: "manual",
    received: "12 May 14:21", session: "rs-y", tasks: 2, status: "approved", linkTitle: "Ops handover notes" },
  { id: "pc-run-20260510-077", agent: "PM Assistant", env: "staged",     src: "paperclip",
    received: "10 May 09:00", session: null,   tasks: 0, status: "missing",  linkTitle: null,
    rejectReason: "No matching review session — orphan run" },
];

// ── Calendar — current month grid ───────────────────────────────────────
const CAL_EVENTS = {
  // key: "row-col" (0-indexed)
  "1-2": [{ t: "Weekly Marketing Sync", k: "gcal" }],
  "1-4": [{ t: "P0 Revenue follow-up", k: "over" }],
  "1-5": [{ t: "Songkran brief due", k: "trello" }],
  "2-0": [{ t: "Interview · Sr Designer", k: "gcal" }, { t: "Triage bugs", k: "trello" }],
  "2-1": [{ t: "Paperclip canary check", k: "ai" }],
  "2-3": [{ t: "OKR check-in Q2", k: "ai" }],
  "2-4": [{ t: "Vendor renewal call", k: "gcal" }],
  "3-2": [{ t: "Roadmap planning Q3", k: "trello" }],
  "3-5": [{ t: "Budget close · April", k: "trello" }],
  "4-1": [{ t: "Brand campaign launch", k: "gcal" }, { t: "RFC due", k: "trello" }],
};

Object.assign(window, {
  BU_GROUPS, BOARDS, MEMBERS, LABELS,
  TODAY_TASKS, REVIEW_SESSIONS, BOARD_HEALTH, OBJECTIVES,
  INTEGRATIONS, TRACE_RUNS, CAL_EVENTS,
});
