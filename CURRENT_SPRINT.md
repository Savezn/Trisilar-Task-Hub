# Current Sprint — Trisilar Task Hub
**Phase 9 · Maintenance & Iteration**
**Started:** 2026-05-06 · **Status:** 🟢 Active

> **วิธีใช้ไฟล์นี้:**
> - Dev / QA / PM อ้างอิงไฟล์นี้เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)
> - PM อัปเดต DEVELOPMENT_PLAN.md progress tracker เมื่อ Phase เสร็จสมบูรณ์เท่านั้น

---

## 🎉 Phase 8 Complete

Phase 8 เสร็จสมบูรณ์ (2026-05-06) — Post-MVP Enhancements ทุกข้อผ่าน QA:

| Task | Completed |
|---|---|
| B7 — Server restart (health route) | ✅ 2026-05-06 |
| B8 — Calendar graceful degradation | ✅ 2026-05-06 |
| B9 — dblclick/click modal conflict | ✅ 2026-05-06 |
| P8-1 Notification & Alert System | ✅ 2026-05-06 |
| P8-2 Card Quick-Edit Inline | ✅ 2026-05-06 |
| P8-3 Export / Report CSV | ✅ 2026-05-06 |
| P8-4 Virtual Scroll | ➡ Deferred (cards < 200 threshold) |
| P8-5 OKR Board Setup Guide | ✅ 2026-05-06 |

---

## Sprint Goal
รักษาเสถียรภาพของระบบ · แก้ bugs ที่พบจากการใช้งานจริง · iterate features ตาม user feedback

---

## Completed This Sprint
*(PM check ✅ เมื่อ QA pass แล้ว)*

| Task | Status | Commit |
|---|---|---|
| B10 — Tasks label group scroll | ✅ QA Pass | `ac48125` |
| B11 — Pending Review badge ซ้ำ | ✅ QA Pass | `8c73b7d` |
| B12 — OKR page clip (overview + detail) | ✅ QA Pass | `ac48125`, `f5b3773` |
| B13 — Google Tasks "Connected" label | ✅ QA Pass | `f5b3773` |
| B14 — Trello API cache (60s / 5min) | ✅ QA Pass | `5ab0f76` |
| B15 — move card ไม่ invalidate cache | ✅ QA Pass | `f5b3773` |
| B16 — topbarRefresh bypass server TTL | ✅ QA Pass | `c6a09fd` |
| B17 — approve review task invalidate cache | ✅ QA Pass | `c6a09fd` |
| P9-4 — Boards Monitor Label Filter | ✅ QA Pass | `7926b80` |
| P9-5 — Tasks View: Group by Type (OKR / Project) | ✅ QA Pass | `b328c8f` |
| P10-1 — Boards Monitor: Dynamic Team Grouping (Label-based) | ✅ QA Pass | `2a4c426` |
| P10-2 — Team Monitor: Unified Board View (Kanban) | ✅ QA Pass | `pending` |

---

## Active Tasks

### P9-1 · Bug Fixes from Real Usage
**Priority:** 🔴 High (เมื่อมี bug จาก production)
**Files:** ตามที่ bug ชี้

**What to do:**
- แก้ bug ที่พบจากการใช้งานจริง (user report หรือ self-discovered)
- ทุก bug ต้องผ่าน QA ก่อน mark Done

**AC:**
- [ ] Bug ที่รายงานได้รับการแก้ไขและผ่าน QA

---

### P9-2 · P8-4 Virtual Scroll (เมื่อ cards > 200)
**Priority:** ⚪ Low (defer จนกว่า cards จะเกิน 200)
**Files:** `public/app.js`, `public/style.css`

**What to do:**
- All Tasks view: pagination เมื่อ cards > 200 (page size 50)
- Boards Monitor: IntersectionObserver สำหรับ health fetch

**AC:**
- [ ] All Tasks แสดง pagination เมื่อ cards > 200
- [ ] Page size 50, navigation next/prev + page number
- [ ] Boards Monitor health fetch เฉพาะ boards ใน viewport

---

### P9-3 · UX Polish & Feedback Items
**Priority:** ⚪ Low
**Files:** ตาม feedback

**What to do:**
- รวบรวม feedback จากการใช้งานจริง
- เพิ่ม/ปรับ UX ตาม priority ที่ PM กำหนด

**AC:**
- [ ] OKR page UI — รอ screenshot / คำอธิบายจาก user (แปลกตรงไหน?)

---

### P9-4 · Boards Monitor: Label Filter
**Priority:** 🟡 Medium (feature request)
**Files:** `public/app.js`, `public/style.css`

**Spec (confirmed):**
- Trello card labels (multi-select)
- แสดงทุก Team แต่มี Hide/Show per team (accordion style)

**What to do:**
- เพิ่ม label filter multi-select ที่ header ของ Boards Monitor
- แต่ละ label group มี toggle hide/show (คล้าย label group ใน All Tasks)
- Filter กระทบ cards ภายใน column (ไม่ hide column ทั้งหมด)

**AC:**
- [ ] Multi-select label filter แสดงที่ header
- [ ] ทุก Teams แสดงผลเริ่มต้น, toggle hide/show per label group
- [ ] Filter state persist ตลอด session (ไม่ reset เมื่อ refresh view)

---

### P9-5 · Tasks View: แยก OKR/Planning จาก Project Tasks
**Priority:** 🟡 Medium (feature request)
**Files:** `public/app.js`, `public/style.css`

**Spec (PM decision):**
- แยกโดย source board (board name) ไม่ใช่แค่ label
- Group "OKR & Planning" = cards จาก OKR Board + Inspiration Board
- Group "Projects" = cards จาก Project boards อื่นๆ
- Label ไตรมาส (เช่น "Q3 2026") ใช้เป็น sub-filter เสริมได้

**What to do:**
- เพิ่ม Group By option: "Type (OKR / Project)"
- OKR/Inspiration boards ระบุได้จาก board name หรือ config

**AC:**
- [x] Group by Type แสดง 2 sections: "OKR & Planning" และ "Projects"
- [x] แต่ละ section collapsible
- [x] OKR board source ระบุได้จาก board name ที่ settings หรือ hardcode config

---

## QA Log
*(PM บันทึกผล QA แต่ละรอบ)*

| Date | Round | Result | Notes |
|---|---|---|---|
| 2026-05-06 | R1 | ✅ Pass | B10–B15 pass ทุกข้อ |
| 2026-05-06 | R2 | ✅ Pass | B16, B17 pass; B18 found & fixed ใน P9-4 session |
| 2026-05-06 | R3 | ✅ Pass | P9-4 (Boards Monitor Label Filter) pass ทุกข้อ |
| 2026-05-06 | R4 | ✅ Pass | P9-5 (Tasks Group by Type) pass ทุก 6 AC |

## Bug Fixes This Sprint
*(PM เพิ่มที่นี่เมื่อ QA พบ bug ใน code ที่ implement แล้ว)*

| ID | Bug | File:Line | Status |
|---|---|---|---|
| B10 | Tasks page: label group list ไม่ scroll ได้ | `style.css:1047` | ✅ Fixed `ac48125` |
| B11 | Sidebar: Pending Review badge แสดงซ้ำ 2 nav items | `app.js:982` | ✅ Fixed `8c73b7d` |
| B12 | OKR page: task container clip (overview + detail) | `style.css:1187,1303` | ✅ Fixed `ac48125`,`f5b3773` |
| B13 | Google Tasks แสดง "Connected" แต่ API ไม่ทำงาน | `app.js:1257` | ✅ Fixed `f5b3773` |
| B14 | Trello Rate Limit จาก nav switching | `server.js:40-50,326,349` | ✅ Fixed `5ab0f76` |
| B15 | move card ไม่ invalidate cache | `server.js:308` | ✅ Fixed `f5b3773` |
| B16 | topbarRefresh ไม่ bypass server TTL | `server.js`,`app.js` | ✅ Fixed `c6a09fd` |
| B17 | approve task ไม่ invalidate cache | `server.js:556` | ✅ Fixed `c6a09fd` |
| B18 | bm-label-filter-note แสดง "0 cards" บน boards ไม่มี label นั้น | `app.js:2088` | ✅ Fixed `7926b80` |
| B19 | Cold start rate limit — ⚠ Trello rate limit ทุกครั้งที่ server restart | `server.js` | ⬜ Pending |
| B20 | Due date display: UTC+7 and dd/mm/yyyy format | `app.js` | ✅ Fixed `784ba95` |

---

## ⚡ Next Action — Dev ต้องทำ

---

### 1. B19 — Cold Start Trello Rate Limit 🔴 (แก้ก่อน V0.1 เริ่ม)

**Root cause (PM verified):**
เมื่อ server restart → cache ว่างเปล่า → `/api/all-cards` fan-out หลายสิบ Trello API calls พร้อมกันทันที
→ Trello 429 rate limit ก่อนที่ cache จะมีโอกาส populate
→ error response ไม่ถูก cache → refresh ครั้งต่อไปก็ error ซ้ำ (loop ไม่หาย)

**Root cause เพิ่มเติม (cache stampede):**
ถ้า client ส่ง request หลายตัวพร้อมกันก่อน cache populate → แต่ละ request fan-out ไปยัง Trello ซ้ำซ้อน

**Fix ใน `server.js` — 2 ส่วน:**

**ส่วนที่ 1 — Request coalescing (กัน stampede):**

เพิ่ม in-flight map ข้าง `_cache`:
```js
const _inFlight = {};
```

ใน `/api/all-cards` route แทรกหลัง cacheGet check:
```js
const hit = cacheGet("all-cards");
if (hit) return res.json(hit);

// coalesce: ถ้า fan-out กำลังรันอยู่ → รอผลเดียวกัน
if (_inFlight["all-cards"]) {
  try {
    const data = await _inFlight["all-cards"];
    return res.json(data);
  } catch (e) {
    return res.status(503).json({ error: trelloError(e) });
  }
}

// เริ่ม fan-out ครั้งเดียว
let resolve, reject;
_inFlight["all-cards"] = new Promise((res, rej) => { resolve = res; reject = rej; });

try {
  // ... existing fan-out logic ...
  cacheSet("all-cards", result, 60_000);
  resolve(result);
  res.json(result);
} catch (e) {
  reject(e);
  res.status(503).json({ error: trelloError(e) });
} finally {
  delete _inFlight["all-cards"];
}
```

**ส่วนที่ 2 — Warm cache on startup:**

หลัง server listen เพิ่ม:
```js
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // warm cache silently — ไม่ block startup
  setTimeout(() => {
    fetch(`http://localhost:${PORT}/api/all-cards`)
      .then(() => console.log("[cache] warmed all-cards"))
      .catch(() => {}); // ถ้า Trello fail → ไม่ crash server
  }, 500);
});
```

> ⚠️ Grep หา `server.listen` หรือ `app.listen` ก่อน: `Grep("\.listen\(PORT", "server.js")`

**AC:**
- [ ] เปิดแอปทันทีหลัง server start → ไม่แสดง rate limit error
- [ ] refresh ซ้ำภายใน 60s → ไม่ error (ใช้ cache)
- [ ] ถ้า Trello ช้าจริง → แสดง loading state ไม่ใช่ error

---

**หลัง B19 เสร็จ → เริ่ม Version 0.1**
ดู `VERSION_0.1_PLAN.md` สำหรับแผน phases ทั้งหมด
เริ่มที่ **V0.1-Ph1** (Foundation Scripts & Smoke Test)

---

**Commit B19:**
```
git add server.js
git commit -m "Phase 9 — B19: fix cold start rate limit (coalesce + warm cache)"
git push
```

---

## Key File Map
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | คำสั่ง |
|---|---|
| showToast / toast function | `Grep("^function toast", "public/app.js")` |
| renderAllTasks function | `Grep("^function renderAllTasks", "public/app.js")` |
| refreshCurrentView | `Grep("^async function refreshCurrentView", "public/app.js")` |
| Today view render | `Grep("^function renderTodayPage", "public/app.js")` |
| S global state object | `Grep("^const S =", "public/app.js")` |
| OKR page render | `Grep("^function renderOKRPage", "public/app.js")` |
| exportTasksCSV | `Grep("^function exportTasksCSV", "public/app.js")` |
| startInlineRename | `Grep("^function startInlineRename", "public/app.js")` |

---

## Phase Context (ย่อ)
| Phase | Status |
|---|---|
| P0 Bug Fixes | ✅ Done (2026-05-04) |
| P1 Review Queue Data | ✅ Done (2026-05-04) |
| P2 Review Queue UI | ✅ Done (2026-05-04) |
| P3 Task Diff Engine | ✅ Done (2026-05-04) |
| P4 Google Tasks Planner | ✅ Done (2026-05-05) |
| P5 Today Enhanced | ✅ Done (2026-05-05) |
| P6 Hardening & Polish | ✅ Done (2026-05-05) |
| P7 OKR / Portfolio Layer | ✅ Done (2026-05-05) |
| P8 Post-MVP Enhancements | ✅ Done (2026-05-06) |
| **P9 Maintenance & Iteration** | **⬜ Current** |
