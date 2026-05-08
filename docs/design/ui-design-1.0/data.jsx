// ── Mock data for Trisilar Task Hub redesign ─────────────────────────────────
// Based on the real PRD: BU groups, Trello boards, review queue, calendar sync.

const todayISO = (() => {
  const d = new Date();
  return d.toISOString();
})();

function daysFromNow(days, hour = 17, min = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

const MOCK_BU_GROUPS = [
  { id: "bu-mkt", name: "Marketing", color: "#6366f1", boards: ["b-mkt-camp", "b-mkt-content"] },
  { id: "bu-prod", name: "Product", color: "#10b981", boards: ["b-prod-roadmap", "b-prod-bugs"] },
  { id: "bu-ops", name: "Operations", color: "#f59e0b", boards: ["b-ops-hr", "b-ops-finance"] },
  { id: "bu-okr", name: "OKR", color: "#8b5cf6", boards: ["b-okr-q2"] },
];

const MOCK_BOARDS = [
  { id: "b-mkt-camp", name: "Q2 Campaigns", bu: "bu-mkt", color: "#818cf8" },
  { id: "b-mkt-content", name: "Content Calendar", bu: "bu-mkt", color: "#a78bfa" },
  { id: "b-prod-roadmap", name: "Product Roadmap", bu: "bu-prod", color: "#34d399" },
  { id: "b-prod-bugs", name: "Bug Triage", bu: "bu-prod", color: "#f87171" },
  { id: "b-ops-hr", name: "HR & Hiring", bu: "bu-ops", color: "#fbbf24" },
  { id: "b-ops-finance", name: "Finance Ops", bu: "bu-ops", color: "#fb923c" },
  { id: "b-okr-q2", name: "OKR Q2 2026", bu: "bu-okr", color: "#c084fc" },
];

const MEMBERS = [
  { id: "m-pim", name: "Pim Suriya", initials: "PS", color: "#6366f1" },
  { id: "m-tan", name: "Tan Wong", initials: "TW", color: "#10b981" },
  { id: "m-may", name: "May Lertluk", initials: "ML", color: "#f59e0b" },
  { id: "m-ek", name: "Ek Phong", initials: "EP", color: "#ef4444" },
  { id: "m-nan", name: "Nan Aroon", initials: "NA", color: "#8b5cf6" },
  { id: "m-jib", name: "Jib Kanya", initials: "JK", color: "#ec4899" },
];

const LABELS = {
  urgent:    { name: "Urgent",    color: "#fecaca", text: "#991b1b", border: "#fca5a5" },
  campaign:  { name: "Campaign",  color: "#e0e7ff", text: "#3730a3", border: "#c7d2fe" },
  research:  { name: "Research",  color: "#cffafe", text: "#155e75", border: "#a5f3fc" },
  internal:  { name: "Internal",  color: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" },
  qbr:       { name: "QBR",       color: "#fef3c7", text: "#92400e", border: "#fde68a" },
  bug:       { name: "Bug",       color: "#fee2e2", text: "#991b1b", border: "#fecaca" },
  okr:       { name: "OKR",       color: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
};

const MOCK_TASKS = [
  // OVERDUE
  { id: "t-1", title: "ส่ง brief campaign Songkran ให้ทีม creative", board: "b-mkt-camp", list: "Doing",
    due: daysFromNow(-2, 17, 0), members: ["m-pim"], labels: ["campaign", "urgent"],
    checklist: { done: 3, total: 5 }, gcal: true, desc: "ทีม creative รอ brief เพื่อเริ่ม visual direction" },
  { id: "t-2", title: "Review API contract สำหรับ payment v2", board: "b-prod-roadmap", list: "In Review",
    due: daysFromNow(-1, 14, 30), members: ["m-tan", "m-ek"], labels: ["urgent"],
    checklist: { done: 2, total: 4 }, gcal: false },

  // TODAY
  { id: "t-3", title: "Weekly Marketing Sync · ห้องประชุม 3", board: "b-mkt-camp", list: "Doing",
    due: daysFromNow(0, 10, 0), members: ["m-pim", "m-may"], labels: ["internal"],
    checklist: { done: 0, total: 3 }, gcal: true },
  { id: "t-4", title: "Approve onboarding email copy v3", board: "b-mkt-content", list: "Review",
    due: daysFromNow(0, 15, 0), members: ["m-may"], labels: ["campaign"],
    checklist: { done: 4, total: 4 }, gcal: true },
  { id: "t-5", title: "Triage 8 bugs จาก beta release", board: "b-prod-bugs", list: "Backlog",
    due: daysFromNow(0, 18, 0), members: ["m-tan"], labels: ["bug"],
    checklist: { done: 1, total: 8 }, gcal: false },
  { id: "t-6", title: "Interview · Senior Designer (round 2)", board: "b-ops-hr", list: "Scheduled",
    due: daysFromNow(0, 14, 0), members: ["m-nan"], labels: [],
    checklist: { done: 2, total: 2 }, gcal: true },

  // UPCOMING (next 7 days)
  { id: "t-7", title: "OKR check-in Q2 mid-quarter", board: "b-okr-q2", list: "This Week",
    due: daysFromNow(2, 14, 0), members: ["m-pim", "m-tan", "m-nan"], labels: ["okr", "qbr"],
    checklist: { done: 0, total: 5 }, gcal: true },
  { id: "t-8", title: "Vendor contract — Cloud infra renewal", board: "b-ops-finance", list: "In Progress",
    due: daysFromNow(3, 17, 0), members: ["m-ek"], labels: [],
    checklist: { done: 0, total: 0 }, gcal: false },
  { id: "t-9", title: "Content shoot · Songkran lifestyle", board: "b-mkt-content", list: "Planning",
    due: daysFromNow(4, 9, 0), members: ["m-may", "m-jib"], labels: ["campaign"],
    checklist: { done: 1, total: 6 }, gcal: true },
  { id: "t-10", title: "Roadmap planning Q3", board: "b-prod-roadmap", list: "Planning",
    due: daysFromNow(5, 13, 0), members: ["m-tan", "m-pim"], labels: ["okr"],
    checklist: { done: 0, total: 3 }, gcal: false },
  { id: "t-11", title: "Budget close — April", board: "b-ops-finance", list: "In Progress",
    due: daysFromNow(6, 17, 0), members: ["m-ek"], labels: [],
    checklist: { done: 2, total: 4 }, gcal: false },

  // No due / inbox
  { id: "t-12", title: "Research: competitor pricing 2026", board: "b-mkt-camp", list: "Backlog",
    due: null, members: ["m-jib"], labels: ["research"],
    checklist: { done: 0, total: 0 }, gcal: false },
  { id: "t-13", title: "Cleanup Trello labels ทั้งหมด", board: "b-prod-roadmap", list: "Someday",
    due: null, members: [], labels: ["internal"],
    checklist: { done: 0, total: 0 }, gcal: false },
  { id: "t-14", title: "Update employee handbook", board: "b-ops-hr", list: "Someday",
    due: null, members: ["m-nan"], labels: ["internal"],
    checklist: { done: 0, total: 0 }, gcal: false },

  // Done
  { id: "t-15", title: "Launch landing page v4", board: "b-mkt-content", list: "Done",
    due: daysFromNow(-3, 12, 0), dueComplete: true, members: ["m-may"], labels: ["campaign"],
    checklist: { done: 5, total: 5 }, gcal: true },
];

// ── Review queue: tasks AI extracted from a meeting ──────────────────────────
const MOCK_REVIEW_SESSIONS = [
  {
    id: "rs-1",
    title: "Weekly Marketing Sync",
    source: "discord",
    createdAt: daysFromNow(0, 9, 30),
    summary: "ทีม Marketing สรุปงาน Q2 — campaign Songkran, content calendar, และ blocker เรื่อง vendor.",
    transcript: "Pim: เราต้องส่ง brief Songkran ภายในวันศุกร์...\nMay: ฉันจะคุยกับ creative ก่อนนะ\nTan: API ฝั่ง payment ยังต้อง review อีก...",
    tasks: [
      {
        id: "rt-1",
        title: "ส่ง brief campaign Songkran ให้ทีม creative",
        owner: "m-pim",
        deadline: daysFromNow(2, 17, 0),
        priority: "high",
        targetBoard: "b-mkt-camp",
        targetList: "Doing",
        diffStatus: "update_existing",
        matchedTaskId: "t-1",
        confidence: 0.91,
        syncCalendar: true,
        syncTasks: false,
        status: "pending",
        reasoning: "พบ card เดิมชื่อใกล้เคียง 'ส่ง brief campaign Songkran' (similarity 0.91)",
      },
      {
        id: "rt-2",
        title: "Review API contract สำหรับ payment v2",
        owner: "m-tan",
        deadline: daysFromNow(1, 14, 30),
        priority: "high",
        targetBoard: "b-prod-roadmap",
        targetList: "In Review",
        diffStatus: "possible_duplicate",
        matchedTaskId: "t-2",
        confidence: 0.78,
        syncCalendar: false,
        syncTasks: true,
        status: "pending",
        reasoning: "อาจซ้ำกับ card 'Review API contract' — ต้องยืนยัน",
      },
      {
        id: "rt-3",
        title: "นัด vendor cloud infra ดู renewal terms",
        owner: "m-ek",
        deadline: daysFromNow(3, 14, 0),
        priority: "medium",
        targetBoard: "b-ops-finance",
        targetList: "In Progress",
        diffStatus: "create_new",
        confidence: 0.96,
        syncCalendar: true,
        syncTasks: false,
        status: "pending",
        reasoning: "ไม่พบ card คล้ายกันใน board ที่เลือก",
      },
      {
        id: "rt-4",
        title: "อัปเดต employee handbook section WFH",
        owner: "m-nan",
        deadline: null,
        priority: "low",
        targetBoard: "b-ops-hr",
        targetList: "Someday",
        diffStatus: "create_new",
        confidence: 0.88,
        syncCalendar: false,
        syncTasks: false,
        status: "pending",
        reasoning: "งานใหม่ — ไม่มี deadline ชัดเจน",
      },
    ],
  },
  {
    id: "rs-2",
    title: "Product Roadmap Review",
    source: "manual_upload",
    createdAt: daysFromNow(-1, 15, 0),
    summary: "Review roadmap Q3 และ priorities หลังจาก beta feedback",
    transcript: "...",
    tasks: [
      {
        id: "rt-5",
        title: "เขียน RFC สำหรับ feature flag system",
        owner: "m-tan",
        deadline: daysFromNow(7, 17, 0),
        priority: "medium",
        targetBoard: "b-prod-roadmap",
        targetList: "Planning",
        diffStatus: "create_new",
        confidence: 0.94,
        syncCalendar: false,
        syncTasks: true,
        status: "approved",
      },
      {
        id: "rt-6",
        title: "ปิด bugs P1 ทั้งหมดก่อน release",
        owner: "m-ek",
        deadline: daysFromNow(4, 17, 0),
        priority: "high",
        targetBoard: "b-prod-bugs",
        targetList: "Backlog",
        diffStatus: "update_existing",
        matchedTaskId: "t-5",
        confidence: 0.86,
        syncCalendar: false,
        syncTasks: false,
        status: "pending",
      },
    ],
  },
];

Object.assign(window, {
  MOCK_BU_GROUPS, MOCK_BOARDS, MEMBERS, LABELS, MOCK_TASKS, MOCK_REVIEW_SESSIONS,
  daysFromNow,
});
