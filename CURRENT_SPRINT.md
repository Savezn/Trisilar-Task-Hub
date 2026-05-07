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
| V0.1-Ph2 Ph2-3 — Extract calendar routes | ✅ QA Pass | `0f14d6f` |
| V0.1-Ph2 Ph2-4 — Extract google-tasks routes | ✅ QA Pass | `6a6e2ac` |
| V0.1-Ph2 Ph2-5 — Extract trello routes | ✅ QA Pass | `25a31b7` |
| V0.1-Ph3 Ph3-1 — Extract core helpers and models | ✅ QA Pass | `e3320d5` |
| V0.1-Ph3 Ph3-2 — Extract google helpers | ✅ QA Pass | `d06d388` |
| V0.1-Ph4 Ph4-1 — Server core hardening | ✅ QA Pass | `f6b5ab6` |
| V0.1-Ph4 Ph4-2 — Frontend Core Split (api/state/router/utils) | ✅ QA Pass | `50ffc72` |
| V0.1-Ph5 Ph5-1 — Extract Today page module | ✅ QA Pass | `296b48a` |
| V0.1-Ph5 Ph5-2 — Extract Review Queue page module | ✅ QA Pass | `fe450ed` |
| V0.1-Ph5 Ph5-3 — Extract All Tasks page module | ✅ QA Pass | `9c8c7bd` |
| V0.1-Ph5 Ph5-4 - Extract Boards/Kanban page module | QA Pass | `de9cd79` |
| V0.1-Ph5 Ph5-5 - Extract Calendar page module | QA Pass | `59e6d31` |

---

## Active Tasks

### 🔴 Bug Bucket (P9-1)
ไม่มี open bugs ปัจจุบัน — ถ้าพบ bug ใหม่ให้เปิด session Dev แก้ทันที

---

### V0.1 Modularization Progress
**Priority:** 🔴 High (in progress)
**Goal:** แยก monolith `server.js` + `app.js` → module files โดยไม่ break functionality

| Phase | Task | Status |
|---|---|---|
| Ph1 | Foundation Scripts & Smoke Test | ✅ Done `5c7ad14` |
| Ph2-1 | Extract config routes | ✅ Done `ac699f1` |
| Ph2-2 | Extract review routes | ✅ Done `bdfbadb` |
| Ph2-3 | Extract calendar routes | ✅ Done `0f14d6f` |
| Ph2-4 | Extract google-tasks routes | ✅ Done `6a6e2ac` |
| Ph2-5 | Extract trello routes | ✅ Done `25a31b7` |
| Ph3-1 | Extract core helpers & models | ✅ Done `e3320d5` |
| Ph3-2 | Extract google helpers | ✅ Done `d06d388` |
| Ph4-1 | Server core hardening | ✅ Done `f6b5ab6` |
| Ph4-2 | Frontend Core Split (api/state/router/utils) | ✅ Done `50ffc72` |
| Ph5-1 | Extract Today page module | ✅ Done `296b48a` |
| Ph5-2 | Extract Review Queue page | ✅ Done `fe450ed` |
| Ph5-3 | Extract All Tasks page | ✅ Done `9c8c7bd` |
| Ph5-4 | Extract Boards/Kanban page | Done `de9cd79` |
| Ph5-5 | Extract Calendar page | Done `59e6d31` |
| Ph5-6 | Extract OKR page | Next |
| Ph5-7 | Extract Settings page | ⬜ Queued |

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
| 2026-05-06 | R10 | ✅ Pass | V0.1-Ph2 Ph2-3 (calendar routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R11 | ✅ Pass | V0.1-Ph2 Ph2-4 (google-tasks routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R12 | ✅ Pass | V0.1-Ph2 Ph2-5 (trello routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R13 | ✅ Pass | V0.1-Ph3 Ph3-1 (core helpers extraction) pass ทุก 3 AC |
| 2026-05-06 | R14 | ✅ Pass | V0.1-Ph3 Ph3-2 (google helpers extraction) pass ทุก 3 AC |
| 2026-05-06 | R15 | ✅ Pass | V0.1-Ph4 Ph4-1 (server hardening) pass — Bug B23 found (autoDelete missing) |
| 2026-05-06 | R16 | ✅ Pass | B23 (missing autoDeleteFromGCal import in server.js) pass ทุก 2 AC |
| 2026-05-07 | R17 | ✅ Pass | V0.1-Ph4 Ph4-2 (Frontend Core Split) pass ทุก 4 AC |
| 2026-05-07 | R18 | ✅ Pass | V0.1-Ph5 Ph5-1 (Extract Today page module) pass ทุก 5 AC |
| 2026-05-07 | R19 | ✅ Pass | V0.1-Ph5 Ph5-2 (Extract Review Queue page module) pass ทุก 5 AC |
| 2026-05-07 | R20 | ✅ Pass | V0.1-Ph5 Ph5-3 (Extract All Tasks page module) pass ทุก 5 AC |
| 2026-05-07 | R21 | Pass | V0.1-Ph5 Ph5-4 (Boards/Kanban page module extraction) pass; browser desktop check limited by in-app mobile viewport; Reviewed by Codex QA |
| 2026-05-07 | R22 | Pass | V0.1-Ph5 Ph5-5 Calendar page module extraction pass; browser desktop check limited by in-app mobile viewport; Reviewed by Codex QA |

## Deferred (ยังไม่ทำ)

| Task | เหตุผลที่ defer |
|---|---|
| P9-2 · Virtual Scroll | cards < 200 ยังไม่จำเป็น — รอ threshold ก่อน |
| P9-3 · UX Polish (OKR UI) | รอ user ส่ง screenshot / คำอธิบายก่อน ถึงจะ scope ได้ |

---

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
| B23 | GCal autoDelete missing after trello routes extraction | `server.js:14-21` | ✅ Fixed `c70c681` |

---

## Next Action - Dev

---

### V0.1-Ph5 Ph5-6 - Extract OKR Page Module

**Context:**
Ph5-5 (Calendar page) is complete and passed QA. `public/js/pages/calendar.js` is now active.
Ph5-6 should extract the OKR page from `app.js` into `public/js/pages/okr.js`.

**Previous work:**
- Dev: Codex, commit `59e6d31`
- QA: Codex QA, R22 PASS
- PM update: Codex PM

**Target:**
```
public/js/pages/okr.js <- showOKRPage() + OKR-only helpers/renderers
```

**What to do:**
1. Grep `public/app.js` for `showOKRPage` or `renderOKRPage` and note the line number.
2. Read that block with offset/limit to identify OKR-only functions/state.
3. Check cross-page calls for every function before moving it.
4. Create `public/js/pages/okr.js` with Python splice/copy, UTF-8 safe.
5. Add `<script src="js/pages/okr.js"></script>` in `index.html` after `calendar.js` and before `app.js`.
6. Remove the OKR-only block from `app.js` with Python splice.
7. Verify `node --check public/js/pages/okr.js` and `public/app.js`.
8. Smoke test: GET / /api/config /api/calendar/status /api/reviews -> all endpoints 200.
9. If possible, browser verify `navigateTo('okr')` or click OKR and confirm it renders.

**Rules:**
- Move only OKR page functions.
- If a function is shared with another page, keep it in `app.js`.
- No bundler; plain `<script>` tag only.
- Grep first, then targeted reads only. Do not read all of `app.js`.
- Include attribution in handoff/notes: Implemented by Dev agent name.

**AC:**
- [ ] `public/js/pages/okr.js` has `showOKRPage` and OKR-only helpers/renderers.
- [ ] `public/app.js` no longer has `showOKRPage`.
- [ ] `index.html` load order is correct: `all-tasks` -> `boards` -> `calendar` -> `okr` -> `app`.
- [ ] `public/js/router.js` route `okr` still calls `showOKRPage()`.
- [ ] Smoke test 4/4 PASS.

**Commit:**
```
git add public/js/pages/okr.js public/app.js public/index.html
git commit -m "V0.1-Ph5 Ph5-6: extract OKR page module from app.js"
git push
```

**Copy-paste prompt for Dev session:**
```
Dev - Task: V0.1-Ph5 Ph5-6 - Extract OKR page module

Context:
Ph5-5 Calendar extraction passed QA (Dev commit `59e6d31`, Reviewed by Codex QA). Next, extract the OKR page from app.js into public/js/pages/okr.js.

Steps:
1. Grep public/app.js for "showOKRPage" or "renderOKRPage" and note the block line.
2. Read the block with offset/limit to identify OKR-only scope and helper functions.
3. Check cross-page calls for every function before moving it.
4. Create public/js/pages/okr.js with Python splice/copy, UTF-8 safe.
5. Add <script src="js/pages/okr.js"></script> in index.html after calendar.js and before app.js.
6. Remove the OKR-only block from app.js with Python splice.
7. Verify node --check public/js/pages/okr.js and public/app.js.
8. Smoke test: GET / /api/config /api/calendar/status /api/reviews -> all endpoints 200.
9. If possible, browser verify navigateTo('okr') or click OKR and confirm the page renders.

Rules:
- Move only OKR page functions.
- If a function is shared with another page, keep it in app.js.
- No bundler; plain script tag only.
- Grep first, then targeted reads only. Do not read all of app.js.
- Include attribution: Implemented by Dev agent name.

Commit:
git add public/js/pages/okr.js public/app.js public/index.html
git commit -m "V0.1-Ph5 Ph5-6: extract OKR page module from app.js"
git push
```

---

## Key File Map
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | ไฟล์ | คำสั่ง |
|---|---|---|
| `toast` / `esc` / format helpers | `public/js/utils.js` | อ่านทั้งไฟล์ (ok) |
| `api` object | `public/js/api.js` | อ่านทั้งไฟล์ (ok) |
| `S` global state / `COLORS` | `public/js/state.js` | อ่านทั้งไฟล์ (ok) |
| `navigateTo` | `public/js/router.js` | อ่านทั้งไฟล์ (ok) |
| Today page (showTodayPage, buildTodayRow) | `public/js/pages/today.js` | อ่านทั้งไฟล์ (ok) |
| Review Queue page (showReviewPage, buildSessionCard, updateReviewBadge) | `public/js/pages/review.js` | อ่านทั้งไฟล์ (ok) |
| `renderAllTasks` / All Tasks page | `public/app.js` | `Grep("renderAllTasks", "public/app.js")` |
| `refreshCurrentView` | `public/app.js` | `Grep("refreshCurrentView", "public/app.js")` |
| OKR page render | `public/app.js` | `Grep("renderOKRPage", "public/app.js")` |
| `exportTasksCSV` | `public/app.js` | `Grep("exportTasksCSV", "public/app.js")` |
| `openEditAllTasks` (shared modal) | `public/app.js` | `Grep("openEditAllTasks", "public/app.js")` |
| `getAllowedCards` | `public/app.js` | `Grep("getAllowedCards", "public/app.js")` |

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
| **P9 Maintenance & Iteration** | **⬜ Ongoing** |
| **V0.1 Modularization** | **🔄 In Progress (Ph5-3 next)** |
