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
| B19 — Cold start Trello rate limit (batch fetch) | ✅ QA Pass | `5b35bc2`, `632fab4` |
| B20 — Due date UTC+7 + dd/mm/yyyy format | ✅ QA Pass | `d8114bd` |
| B21 — All Tasks sorting logic wired to render | ✅ QA Pass | `e79ff3b` |
| P10-1 — Boards Monitor: Dynamic Team Grouping (Label-based) | ✅ QA Pass | `2a4c426` |
| P10-2 — Team Monitor: Unified Board View (Kanban) | ✅ QA Pass | `4625180`, `314d176` |
| B22 — Team Monitor Board view: dynamic columns | ✅ QA Pass | `5384ab8` |
| V0.1-Ph1 — Foundation Scripts & Smoke Test | ✅ QA Pass | `5c7ad14` |
| V0.1-Ph2 Ph2-1 — Extract config routes | ✅ QA Pass | `ac699f1` |
| V0.1-Ph2 Ph2-2 — Extract review routes | ✅ QA Pass | `bdfbadb` |

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
- [x] Multi-select label filter แสดงที่ header
- [x] ทุก Teams แสดงผลเริ่มต้น, toggle hide/show per label group
- [x] Filter state persist ตลอด session (ไม่ reset เมื่อ refresh view)

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
| 2026-05-06 | R5 | ✅ Pass | Phase 10 (B19/B20/B21/P10-1/P10-2) pass — B22 found (P10-2 hardcoded columns) |
| 2026-05-06 | R6 | ✅ Pass | B22 (Team Monitor dynamic columns) pass ทุก 3 AC |
| 2026-05-06 | R7 | ✅ Pass | V0.1-Ph1 (Foundation Scripts & Smoke Test) pass ทุก 3 AC |
| 2026-05-06 | R8 | ✅ Pass | V0.1-Ph2 Ph2-1 (config routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R9 | ✅ Pass | V0.1-Ph2 Ph2-2 (review routes extraction) pass ทุก 3 AC |

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
| B19 | Cold start rate limit — ⚠ Trello rate limit ทุกครั้งที่ server restart | `server.js`, `trello.js` | ✅ Fixed `5b35bc2`,`632fab4` |
| B20 | Due date display: UTC+7 and dd/mm/yyyy format | `app.js` | ✅ Fixed `d8114bd` |
| B21 | All Tasks sorting logic not called in render | `app.js` | ✅ Fixed `e79ff3b` |
| B22 | Team Monitor Board view: hardcoded columns — cards ใน lists อื่นหายไป | `app.js:2118` | ✅ Fixed `5384ab8` |


---

## ⚡ Next Action — Dev ต้องทำ

---

### V0.1-Ph2 · Ph2-3 — Extract calendar routes 🔴

**Context:**  
Ph2-2 (review routes) เสร็จแล้ว ✅  
Ph2-3: ย้าย Google Calendar + OAuth endpoints ออกจาก `server.js` → `src/routes/calendar.routes.js`

**Endpoints ที่ต้องย้าย** (server.js ~lines 401–520):
| Method | URL | Notes |
|---|---|---|
| POST | `/auth/google` | OAuth setup |
| GET | `/auth/callback` | OAuth callback |
| GET | `/api/calendar/status` | connection check |
| GET | `/api/calendar/events` | list events |
| POST | `/api/calendar/events` | create event |
| PUT | `/api/calendar/events/:id` | update event |
| DELETE | `/api/calendar/events/:id` | delete event |

**Dependencies ที่ต้องส่งผ่าน factory:**
- `getCalendarClient` — Google Calendar API client
- `getCalendarId` — returns calendar ID from env
- `getOAuth2Client` — OAuth2 client factory
- `updateEnvKey` — write env variable to .env (ใช้ใน `/auth/google`)
- `readCardEvents` / `writeCardEvents` — card→event mapping (ใช้ใน delete)
- `friendlyError`

**Rules:**
- `/auth/google` และ `/auth/callback` เป็น OAuth routes — mount ที่ root (`app.use("/", calendarRoutes)`) ไม่ใช่ `/api`  
  หรือ mount ทั้ง block ด้วย `app.use(calendarRoutes)` แล้ว router define paths เต็ม (`/auth/google`, `/api/calendar/...`)
- ไม่เปลี่ยน URL หรือ response shape
- helpers (`getCalendarClient`, `autoSyncToGCal` ฯลฯ) ยังอยู่ใน `server.js` ชั่วคราว (ย้ายใน Ph3)
- หลัง split: `node server.js` รันได้ + `npm run smoke` pass

**AC:**
- [ ] ทุก 7 endpoints ยังทำงานได้ (URL/shape เหมือนเดิม)
- [ ] `server.js` ไม่มี calendar + auth handlers เหลืออยู่
- [ ] `npm run smoke` pass หลัง split

**Commit:**
```
git add server.js src/routes/calendar.routes.js
git commit -m "V0.1-Ph2: extract calendar routes to src/routes/calendar.routes.js"
```

**Copy-paste prompt สำหรับ Dev session:**
```
คุณ Dev — อ่าน VERSION_0.1_PLAN.md ส่วน V0.1-Ph2 ก่อน

Task: V0.1-Ph2 Ph2-3 — แยก calendar + OAuth routes ออกจาก server.js

1. Grep หา calendar/auth route handlers ใน server.js:
   Grep("auth/google|auth/callback|api/calendar", "server.js") → note line range

2. อ่าน section นั้นด้วย Read(offset, limit) เพื่อดู handlers และ dependencies ทั้งหมด

3. สร้าง src/routes/calendar.routes.js:
   - factory function รับ { getCalendarClient, getCalendarId, getOAuth2Client, updateEnvKey, readCardEvents, writeCardEvents, friendlyError }
   - ย้าย handlers ทั้ง 7 ตัวเข้า router
   - /auth/google และ /auth/callback ใช้ path เต็ม (ไม่มี prefix)
   - /api/calendar/* ใช้ path เต็ม (ไม่มี prefix)
   - mount ใน server.js ด้วย app.use(makeCalendarRoutes({ ... })) (ไม่มี prefix)

4. อัปเดต server.js:
   - require calendar.routes.js
   - app.use(makeCalendarRoutes({ ... }))
   - ลบ handlers เดิมออก

5. ตรวจ: node server.js ไม่ crash + npm run smoke pass

Rules:
- ไม่เปลี่ยน URL หรือ response shape
- ไม่ย้าย helper functions ออกจาก server.js ยัง (ย้ายใน Ph3)

Commit: "V0.1-Ph2: extract calendar routes to src/routes/calendar.routes.js"
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
