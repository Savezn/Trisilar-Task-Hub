# Trisilar Task Hub - Development History
**Doc Role:** Archived roadmap and historical progress tracker
**Status:** Archived reference; use `../plans/` and `../../TODO.md` for active planning
**Purpose:** Preserve completed milestones and older phase context
**Based on:** `MVP_PRD.md`
**Last Updated:** 2026-05-08 - Moved by Codex PM during documentation consolidation

---

## Archive Notice

This file is retained for historical traceability. Do not use it as the active roadmap or next-action source.

Use these files for active work:

- `../../CURRENT_SPRINT.md`
- `../../TODO.md`
- `../plans/VERSION_0_2_PLAN.md`
- `../logs/QA_LOG.md`
- `../logs/DECISION_LOG.md`

---

## How to Use This Document

1. **ก่อนเริ่ม session** — เปิดไฟล์นี้ บอก Claude Code ว่า Phase และ Task ไหนที่ต้องทำ
2. **ระหว่าง session** — ติ๊ก ✅ หน้า task ที่เสร็จ พร้อมบันทึก notes ถ้ามี deviation
3. **สิ้นสุด session** — อัปเดต status ใน Progress Tracker ด้านล่าง
4. **Claude Code prompt pattern** แนะนำ:
   > "อ้างอิง DEVELOPMENT_HISTORY.md — ทำ Phase X, Task Y: [ชื่อ task] ให้เสร็จตาม Acceptance Criteria ที่ระบุ"

---

## Current State Baseline (วันที่วางแผน)

| Feature | Status |
|---|---|
| Sidebar + Navigation | ✅ Done |
| Today Dashboard (basic) | ✅ Done |
| Kanban Board View | ✅ Done |
| BU Group View | ✅ Done |
| All Tasks View | ✅ Done |
| Card CRUD + Checklist | ✅ Done |
| Drag & Drop | ✅ Done |
| Calendar View + OAuth | ✅ Done |
| Boards Monitor Page | ✅ Done |
| Settings Page | ✅ Done |
| Review Queue (Data Layer) | ✅ Done (Phase 1) |
| Task Diff Engine | ✅ Done (Phase 3) |
| Google Tasks Planner | ✅ Done (Phase 4) |
| Bug Fixes (PRD §12) | ✅ Done |

---

## Phase Overview

```
Phase 0 — Bug Fixes & Foundations          ✅ COMPLETE  (2026-05-04, QA clean)
Phase 1 — Review Queue: Data Layer         ✅ COMPLETE  (2026-05-04, QA fixes done)
Phase 2 — Review Queue: UI & Actions       ✅ COMPLETE  (2026-05-04)
Phase 3 — Task Diff Engine                 ✅ COMPLETE  (2026-05-04, QA clean)
Phase 4 — Google Tasks Daily Planner       ✅ COMPLETE  (2026-05-05)
Phase 5 — Today Dashboard: Enhanced        ✅ COMPLETE  (2026-05-05)
Phase 6 — Hardening & Polish               ✅ COMPLETE  (2026-05-07)
Phase 7 — OKR / Portfolio Layer            ✅ COMPLETE  (2026-05-08)
Phase 8 — Post-MVP Enhancements            ✅ COMPLETE  (2026-05-06, P8-4 deferred per spec)
```

**Critical path:** Phase 0 → 1 → 2 → 3 (ต้องทำตามลำดับ)  
**Parallel after Phase 0:** Phase 4 ทำคู่ Phase 1–2 ได้  
**Post-MVP path:** Phase 7 เริ่มหลัง Phase 5–6 เพื่อยกระดับ Task Hub จาก daily dashboard เป็น portfolio command center สำหรับ Project Boards + OKR Board

---

## PHASE 0 — Bug Fixes & Foundations ✅ COMPLETE
**Goal:** แก้ bug ที่ระบุใน PRD §12 ทั้งหมดก่อนเริ่ม feature ใหม่  
**Completed:** 2026-05-04 · QA pass 1: 2026-05-04 · QA pass 2: 2026-05-04 ✓ Clean  
**Session prompt:** `"ทำ Phase 0 ใน DEVELOPMENT_HISTORY.md ให้ครบ"`

### P0-1 · Fix: Clear Due/Start Date on Edit ✅
**Priority:** 🔴 High  
**Files:** `server.js`, `public/app.js`  
**Problem:** เมื่อ user ล้าง due/start date แล้ว save — frontend ไม่ส่ง field ว่างไป API ทำให้ date เดิมยังค้างอยู่  

**What to do:**
- Frontend: เมื่อ `card-due` หรือ `card-start` ว่าง ให้ส่ง `due: null` / `start: null` ใน payload เเสมอ
- Backend: รับ `null` แล้ว clear field ใน Trello API call

**Acceptance Criteria:**
- [x] Edit card ที่มี due date → ลบ due date ออก → Save → due date หายจริง
- [x] Edit card ที่มี start date → ลบออก → Save → start date หายจริง
- [x] ถ้ายังมี due date อยู่ ต้องไม่กระทบ

---

### P0-2 · Fix: All Tasks / Today ต้อง Honor Hidden Boards ✅
**Priority:** 🔴 High  
**Files:** `public/app.js` (functions: `showAllTasks`, `renderAllTasks`, `showTodayPage`)  
**Problem:** `/api/all-cards` ดึงทุก board รวม hidden boards ด้วย — `renderAllTasks` กรองบางส่วน แต่ `showAllTasks` filter cache ไม่ครบ

**What to do:**
- ใน `renderAllTasks`: กรอง `S.config.hiddenBoards` ก่อน render เสมอ
- ใน `renderTodayPage`: ยืนยันว่า filter hidden boards ทำงานถูกต้อง (มีแล้วบางส่วน แต่ตรวจสอบ)
- Backend `GET /api/all-cards`: รับ query param `?exclude=boardId1,boardId2` เพื่อให้ server กรองด้วย (optional แต่ดีกว่า)

**Acceptance Criteria:**
- [x] Hidden board ที่ตั้งใน Settings ไม่โชว์ใน Today
- [x] Hidden board ไม่โชว์ใน All Tasks ทุก filter
- [x] Hidden board ไม่โชว์ใน Boards Monitor

---

### P0-3 · Fix: Calendar Sync ต้องเป็น Explicit User Choice ✅
**Priority:** 🔴 High  
**Files:** `server.js`, `public/app.js`  
**Problem:** ตอนนี้ถ้าสร้าง/แก้ card ที่มี due date + GCal connected → sync อัตโนมัติ โดยไม่มี user confirm

**What to do:**
- Backend `POST /api/cards` และ `PUT /api/cards/:id`: อย่า auto-push to calendar — ต้องรอ explicit flag `syncCalendar: true` ใน request body
- Frontend `saveCard()`: ส่ง `syncCalendar: true/false` จาก checkbox `gcal-sync-check`
- แสดง checkbox `gcal-sync-check` เสมอเมื่อ GCal connected (ไม่ใช่แค่เมื่อ create)

**Acceptance Criteria:**
- [x] สร้าง card + due date → GCal event ไม่ถูกสร้างถ้า checkbox ไม่ได้ติ๊ก
- [x] แก้ card → checkbox แสดงสถานะ sync ปัจจุบัน
- [x] ติ๊ก checkbox + save → sync เกิดขึ้น
- [x] ไม่ติ๊ก + save → ไม่มี sync

> **QA Fix (2026-05-04):** พบว่า `PUT /api/cards/:id` ส่ง `syncCalendar` field ไปยัง Trello API ด้วย เพราะ `trello.updateCard()` รับ `req.body` ทั้งก้อน — แก้แล้วโดย destructure ออกก่อน: `const { syncCalendar, ...trelloFields } = req.body`

---

### P0-4 · Fix: Google Credential Security ✅
**Priority:** 🔴 High  
**Files:** `server.js`  
**Problem:** รับ GCal credentials ผ่าน query params ใน URL → ปรากฏใน browser history และ server logs

**What to do:**
- เปลี่ยน endpoint รับ credentials จาก GET query params เป็น POST body
- Frontend `startGoogleAuth()` ใน `app.js`: ส่งผ่าน fetch POST แทน redirect URL params
- ตรวจ server log ว่า secret ไม่ถูก log

**Acceptance Criteria:**
- [x] Client ID / Secret ไม่ปรากฏใน URL
- [x] Browser history ไม่มี credentials
- [x] GCal connect flow ยังทำงานได้ปกติ

> **QA Fix (2026-05-04):** `closeCalSetup()` เดิมถูกเรียกก่อนตรวจสอบ popup — ถ้า browser block popup modal ปิดไปแล้วก่อน user จะกด retry ได้ แก้แล้วโดยย้าย `closeCalSetup()` มาหลัง popup check

---

### P0-5 · Fix: allCardsCache ไม่ Honor allowedWorkspaceIds ✅
**Priority:** 🟡 Medium  
**Found by:** QA Pass 2026-05-04  
**Files:** `public/app.js`  
**Problem:** `S.boards` (จาก `GET /api/boards`) กรอง `allowedWorkspaceIds` แล้วที่ backend แต่ `S.allCardsCache` (จาก `GET /api/all-cards`) ดึงทุก board โดยไม่สนใจ workspace filter ทำให้ Today, All Tasks, และ Boards Monitor ยังแสดง cards จาก workspace ที่ไม่ได้ allow

**Root cause:** `/api/all-cards` loop ผ่าน `trello.getBoards()` ทั้งหมด ไม่ผ่าน `/api/boards` ที่มี filter แล้ว

**What to do:**
- ใน `showAllTasks()`, `renderTodayPage()`, `showBoardsMonitor()`: กรอง `allCardsCache` ให้เหลือเฉพาะ cards ที่ `boardId` อยู่ใน `S.boards` (ซึ่ง honor `allowedWorkspaceIds` แล้ว)
- วิธีที่สะอาดที่สุด: สร้าง helper `getAllowedCards()` คืน filtered array เพื่อไม่ให้ duplicate logic

```javascript
function getAllowedCards() {
  if (!S.allCardsCache) return [];
  const allowedIds = new Set(S.boards.map(b => b.id));
  return S.allCardsCache.filter(c =>
    allowedIds.has(c.boardId) && !S.config.hiddenBoards.includes(c.boardId)
  );
}
```

แล้วแทน `S.allCardsCache.filter(c => !S.config.hiddenBoards.includes(c.boardId))` ทุกจุดด้วย `getAllowedCards()`

**Acceptance Criteria:**
- [x] ตั้ง `allowedWorkspaceIds` ใน Settings → cards จาก workspace อื่นหายจาก Today
- [x] cards จาก workspace อื่นหายจาก All Tasks ทุก filter
- [x] Boards Monitor แสดงเฉพาะ boards ใน allowed workspace
- [x] ถ้า `allowedWorkspaceIds` ว่าง (ไม่ได้ตั้ง) → แสดงทุก board เหมือนเดิม

---

### P0-6 · ~~Fix: Card Move URL~~ — RETRACTED (False Positive)
**Status:** ❌ Retracted — QA pass 2 verified URL is correct  
**Root cause of false positive:** Line numbers shifted +12 after `getAllowedCards()` helper was inserted; QA was reading a stale grep context from before the insertion. Actual file uses `/api/cards/${id}/move` (forward slashes) throughout.

---

## PHASE 1 — Review Queue: Data Layer ✅ COMPLETE
**Goal:** สร้าง backend data model และ API สำหรับ Review Queue  
**Implemented:** 2026-05-04 · **QA:** 2026-05-04 · **QA Fixes:** 2026-05-04 ✓ Clean  
**Session prompt:** `"ทำ Phase 1 ใน DEVELOPMENT_HISTORY.md — สร้าง backend Review Queue APIs"`

### P1-1 · Data Storage: Review Sessions ✅
**Files:** `server.js`, `review-store.js` (new)  

**Acceptance Criteria:**
- [x] `review-sessions.json` ถูกสร้างอัตโนมัติถ้ายังไม่มี
- [x] Write operation ไม่ corrupt file เมื่อ concurrent (sync fs ops — inherently safe in Node.js single-threaded model)
- [x] Data persist ข้าม server restart

---

### P1-2 · API: Review Session CRUD ✅
**Files:** `server.js`  

**Acceptance Criteria:**
- [x] `POST /api/reviews` รับ session data สร้างใน store ได้
- [x] `PUT .../tasks/:taskId` update fields เฉพาะ task นั้น
- [x] `POST .../approve` เปลี่ยน task status เป็น `approved`
- [x] Error response มี message ที่อ่านออก (ไม่ expose raw Trello error)

---

### P1-3 · API: Approve → Push to Trello ✅
**Files:** `server.js`  

**Acceptance Criteria:**
- [x] Approve task ที่ `diffStatus: "create_new"` → Trello card ใหม่ถูกสร้าง
- [x] Approve task ที่ `diffStatus: "update_existing"` → Trello card ที่ match ถูก update
- [x] Task ที่ reject ไม่ถูก push ไป Trello เด็ดขาด
- [x] Response บอก success/fail ต่อแต่ละ task ใน bulk

---

### P1-4 · Fix: `read()` กลืน corrupt JSON เงียบ ✅
**Priority:** 🟡 Medium  
**Found by:** QA Pass 2026-05-04  
**Files:** `review-store.js`  
**Problem:** `catch { return []; }` จับทั้ง `ENOENT` (ไฟล์ไม่มี — expected) และ `SyntaxError` (JSON เสีย — critical) รวมกัน ทำให้ถ้า `review-sessions.json` เสียหาย sessions ทั้งหมดหายเงียบโดยไม่มี error

```javascript
// ปัจจุบัน — อันตราย
function read() {
  try { return JSON.parse(fs.readFileSync(STORE_FILE, "utf8")); }
  catch { return []; }  // ← กลืน JSON parse error ด้วย
}
```

**What to do:**
- แยก error type: `ENOENT` → return `[]` (ปกติ, ไฟล์ยังไม่ถูกสร้าง)
- `SyntaxError` หรือ error อื่น → `console.error` + throw หรือ return `[]` พร้อม log ที่ชัดเจน

```javascript
function read() {
  try { return JSON.parse(fs.readFileSync(STORE_FILE, "utf8")); }
  catch (e) {
    if (e.code === "ENOENT") return [];
    console.error("[review-store] corrupt JSON:", e.message);
    return [];  // หรือ throw แล้วแต่ policy
  }
}
```

**Acceptance Criteria:**
- [x] ไฟล์ไม่มี (`ENOENT`) → return `[]` ตามปกติ ไม่มี error log
- [x] ไฟล์มีแต่ JSON เสีย → console.error พร้อม message ที่อ่านออก
- [x] ไม่ silent data loss — ต้องมี log เมื่อ JSON invalid

---

### P1-5 · Fix: `approveTask` ไม่ป้องกัน double-approve ✅
**Priority:** 🟡 Medium  
**Found by:** QA Pass 2026-05-04  
**Files:** `review-store.js`  
**Problem:** `_setStatus` ไม่ตรวจ status ปัจจุบันก่อน set → approve ซ้ำได้ → `pushTaskToTrello()` รันซ้ำ → Trello card duplicate

```javascript
// ปัจจุบัน — ไม่มี guard
function _setStatus(sessionId, taskId, status) {
  // ...
  task.status = status;  // ← ไม่สนว่าเดิมเป็นอะไร
```

**What to do:**
- เพิ่ม guard ใน `approveTask`: ถ้า `task.status === "approved"` ให้ throw

```javascript
function approveTask(sessionId, taskId) {
  const sessions = read();
  const session  = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const task = session.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (task.status === "approved") throw new Error("Task already approved");
  task.status = "approved";
  write(sessions);
  return task;
}
```

- `rejectTask` ควรมี guard คล้ายกัน: ถ้า `task.status !== "pending"` → throw

**Acceptance Criteria:**
- [x] `approveTask` บน task ที่ approved แล้ว → throw `"Task already approved"`
- [x] Server approve endpoint รับ error → คืน 409 Conflict (ไม่ใช่ 500)
- [x] ไม่มี Trello card ถูกสร้างซ้ำจาก double-approve

---

### P1-6 · Fix: `updateTask` แก้ task ที่ approved/rejected ได้ ✅
**Priority:** 🟡 Medium  
**Found by:** QA Pass 2026-05-04  
**Files:** `review-store.js`  
**Problem:** `updateTask` ไม่ตรวจ `task.status` → แก้ task ที่ push ไป Trello แล้วได้ → store desync กับ Trello

**What to do:**
- เพิ่ม status guard ก่อน update:

```javascript
function updateTask(sessionId, taskId, updates) {
  // ...
  if (task.status !== "pending") throw new Error("Cannot edit processed task");
  EDITABLE_FIELDS.forEach(k => { if (k in updates) task[k] = updates[k]; });
```

**Acceptance Criteria:**
- [x] `PUT .../tasks/:taskId` บน task ที่ approved → คืน 409 + message `"Cannot edit processed task"`
- [x] Task ที่ pending → แก้ได้ตามปกติ
- [x] Task ที่ rejected → แก้ไม่ได้ (ต้อง dismiss session แล้วสร้างใหม่)

---

### P1-7 · Fix: `dismissSession` ไม่มี guard pending tasks ✅
**Priority:** ⚪ Low  
**Found by:** QA Pass 2026-05-04  
**Files:** `review-store.js`  
**Problem:** PRD §8 Flow B: "Rejected tasks remain auditable until dismissed" — แต่ dismiss ได้แม้ task บางอัน pending อยู่ → งานหายโดยไม่ตั้งใจ

**What to do:**
- ตรวจก่อน dismiss ว่าไม่มี task ที่ `status === "pending"` เหลืออยู่

```javascript
function dismissSession(id) {
  const sessions = read();
  const session  = sessions.find(s => s.id === id);
  if (!session) throw new Error("Session not found");
  const hasPending = session.tasks.some(t => t.status === "pending");
  if (hasPending) throw new Error("Session has unprocessed tasks");
  // ... splice and write
```

**Acceptance Criteria:**
- [x] Dismiss session ที่มี pending tasks → คืน 409 + message `"Session has unprocessed tasks"`
- [x] Dismiss session ที่ทุก task approved/rejected แล้ว → ลบได้ตามปกติ
- [ ] UI ควรซ่อน Dismiss button ถ้ายังมี pending tasks (UI fix รวมใน P2-1)

---

### P1-8 · Fix: `approve` response คืน stale `trelloCardId` ✅
**Priority:** ⚪ Low  
**Found by:** QA Pass 2026-05-04  
**Files:** `server.js`  
**Problem:** `res.json({ ...task, trello: result })` — `task` object ถูก spread ก่อน `setTaskTrelloCardId` รัน → `task.trelloCardId` ใน response เป็น `null` ทั้งที่ set แล้ว

**What to do:**
- ดึง task object ใหม่จาก store หลัง `setTaskTrelloCardId` แล้วค่อย spread

```javascript
// เดิม
store.setTaskTrelloCardId(sessionId, task.id, card.id);
// ...
res.json({ ...task, trello: result });  // ← task.trelloCardId ยัง null

// แก้: refresh task snapshot ก่อน respond
const updatedTask = store.getSession(sessionId).tasks.find(t => t.id === taskId);
res.json({ ...updatedTask, trello: result });
```

**Acceptance Criteria:**
- [x] Approve response มี `trelloCardId` เป็น card ID จริง (ไม่ใช่ null)
- [x] Bulk approve response ต่อแต่ละ task ก็คืน `trelloCardId` ที่ถูก set แล้ว

---

## PHASE 2 — Review Queue: UI ✅ COMPLETE
**Goal:** สร้าง UI หน้า Review Queue ให้ใช้งานได้จริง  
**Completed:** 2026-05-04  
**Session prompt:** `"ทำ Phase 2 ใน DEVELOPMENT_HISTORY.md — สร้าง Review Queue UI"`

### P2-1 · Review Queue: Session List View ✅
**Files:** `public/app.js`, `public/style.css`  
**Function to create:** `showReviewPage()` (แทน placeholder เดิม)

**Acceptance Criteria:**
- [x] แสดง list sessions จาก `GET /api/reviews`
- [x] Session ที่ทุก task processed แล้วแสดง "Dismiss" button
- [x] Empty state: "No pending meeting reviews"
- [x] Loading / Error states

---

### P2-2 · Review Queue: Task Detail Panel ✅
**Files:** `public/app.js`, `public/style.css`  

**Acceptance Criteria:**
- [x] Diff badge แสดงสีถูกต้อง: CREATE (green), UPDATE (amber), DUPLICATE (red)
- [x] Confidence bar แสดง % เป็น progress bar
- [x] Edit title/owner/deadline ทำงาน inline (auto-save onchange)
- [x] Board dropdown load จาก `S.boards` / list dropdown load เมื่อเลือก board
- [x] Approve button → call API → task card แสดง "Approved ✓"
- [x] Reject button → call API → task card แสดง "Rejected"

---

### P2-3 · Review Queue: Bulk Actions ✅
**Files:** `public/app.js`, `public/style.css`

**Acceptance Criteria:**
- [x] เลือก task หลายอัน → bulk action bar โผล่
- [x] Approve All → call `POST /api/reviews/:id/approve-bulk` → tasks update พร้อมกัน
- [x] Reject All → เหมือนกัน
- [x] หลัง bulk action → task cards update status ใน UI ทันที (ไม่ต้อง reload)

---

### P2-4 · Review Queue: Manual Session Creator (for Testing) ✅
**Files:** `public/app.js`, `public/index.html`

**Acceptance Criteria:**
- [x] User paste ข้อความ + กรอก title → สร้าง session ได้
- [x] Session ใหม่โผล่ใน list ทันที
- [x] Tasks ถูก generate ด้วย status `pending` และ `diffStatus: "create_new"` as default

---

## PHASE 3 — Task Diff Engine ✅ COMPLETE
**Goal:** ระบบเปรียบเทียบ review task กับ Trello cards ที่มีอยู่เพื่อ detect duplicates/updates  
**Implemented:** 2026-05-04 · **QA Pass 1:** 2026-05-04 · **QA Pass 2:** 2026-05-04 · **QA Fixes:** 2026-05-04 ✓ Clean  
**Files:** `task-diff.js` (new), `server.js`, `review-store.js`, `public/app.js`, `public/style.css`

### P3-1 · API: Task Diff Endpoint ✅
**Files:** `server.js`, `task-diff.js` (new)

**Endpoint:** `POST /api/task-diff`  
**Input:** `{ title, description, targetBoardId, deadline }`  
**Output:**
```json
{
  "diffStatus": "create_new | update_existing | possible_duplicate",
  "matchedCardId": "...",
  "confidence": 0.85,
  "matchReason": "Title similarity 91%, same board"
}
```

**Matching logic (simple MVP):**
1. หา cards ใน targetBoard ที่ title คล้ายกัน (string similarity > 80%)
2. ถ้าเจอ 1 card → `update_existing`, confidence สูง
3. ถ้าเจอ > 1 card → `possible_duplicate`, confidence ต่ำ
4. ถ้าไม่เจอ → `create_new`

**Acceptance Criteria:**
- [x] Title เหมือนกัน 100% → `update_existing`, confidence ≥ 0.95
- [x] Title ต่างกันมาก → `create_new`
- [x] ไม่ crash ถ้า targetBoardId ไม่มีอยู่

---

### P3-2 · Wire Diff Engine to Review Session ✅
**Files:** `server.js`

**What to do:**
- เมื่อ `POST /api/reviews` สร้าง session พร้อม tasks → เรียก `task-diff` ต่อแต่ละ task อัตโนมัติ
- เก็บ `diffStatus`, `confidence`, `matchedCardId` ใน task record
- ถ้า diff fail → default เป็น `create_new`

**Acceptance Criteria:**
- [x] สร้าง session ใหม่ → tasks มี diffStatus ติดมาด้วยทันที
- [x] Task ที่ชื่อซ้ำกับ Trello card ที่มีอยู่ → ได้ `update_existing`

---

### P3-3 · Fix: `matchReason` Data Loss + Thai Title Support ✅
**Priority:** 🔴 High (Blocking — แก้ก่อน Phase 4)  
**Found by:** QA Pass 2026-05-04  
**Files:** `review-store.js`, `task-diff.js`

**Bug 1 — `matchReason` ถูก silently dropped:**  
`review-store.js` `createSession()` ใช้ explicit field mapping — `matchReason` ไม่อยู่ใน mapping จึงหายทุกครั้งที่ persist แม้ diff engine คำนวณมาแล้ว

**Bug 2 — Thai/Unicode titles ใช้งานไม่ได้:**  
`normalize()` ใช้ `[^a-z0-9\s]` ตัด non-ASCII ออกหมด — title ภาษาไทย เช่น `"ตรวจสอบรายงาน"` กลายเป็น `""` → similarity = 0 → `create_new` เสมอ

**What to do:**
- `review-store.js`: เพิ่ม `matchReason: t.matchReason || ""` ใน task schema mapping ของ `createSession()`
- `task-diff.js`: เปลี่ยน `normalize()` regex จาก `[^a-z0-9\s]` เป็น `[^\p{L}\p{N}\s]/gu` (Unicode property escapes) เพื่อ keep ภาษาไทยและ Unicode letters ไว้

```javascript
// เดิม — ตัด Thai ออก
const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

// แก้ — Unicode-aware
const normalize = s => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();
```

**Acceptance Criteria:**
- [x] `matchReason` ถูก persist ใน `review-sessions.json` — `GET /api/reviews/:id` คืน field นี้ครบ
- [x] Task ชื่อภาษาไทย (เช่น `"ตรวจสอบรายงาน Q2"`) match กับ Trello card ชื่อเดียวกัน → ได้ `update_existing`
- [x] Task ชื่อ mix ไทย-อังกฤษ (เช่น `"OKR review ทีม"`) match ได้ถูกต้อง
- [x] Task ภาษาอังกฤษ behavior ไม่เปลี่ยน (regression test)

---

### P3-4 · Fix: UI แสดง `matchReason` + Validate `targetBoardId` ✅
**Priority:** 🟡 Medium  
**Found by:** QA Pass 2026-05-04  
**Files:** `public/app.js`, `server.js`

**Missing 1 — UI ไม่แสดง matchReason:**  
`buildTaskCard()` แสดง diff badge + confidence % แต่ไม่มี human-readable reason → user เห็น "UPDATE 85%" แต่ไม่รู้ว่า match กับ Trello card ชื่ออะไร

**Missing 2 — `POST /api/task-diff` ไม่ validate `targetBoardId`:**  
Request ที่ไม่มี `targetBoardId` ได้ `create_new` กลับมาเงียบๆ — caller เข้าใจผิดได้ว่าผล diff มาจากการ compare จริง

**What to do:**
- `app.js` `buildTaskCard()`: แสดง `task.matchReason` เป็น small text ใต้ confidence bar เมื่อ `task.diffStatus !== "create_new"` และ `task.matchReason` มีค่า
- `server.js` `POST /api/task-diff`: เพิ่ม validation — ถ้าไม่มี `targetBoardId` → return `400 { error: "targetBoardId is required" }`

**Acceptance Criteria:**
- [x] UI แสดง matchReason (เช่น `"Title similarity 91%"`) ใต้ confidence bar เมื่อ diffStatus เป็น `update_existing` หรือ `possible_duplicate`
- [x] `POST /api/task-diff` ที่ไม่มี `targetBoardId` → คืน `400` + error message ที่ชัดเจน (ไม่ใช่ `create_new` เงียบๆ)
- [x] `POST /api/task-diff` ที่มีทั้ง `title` + `targetBoardId` → ทำงานเหมือนเดิม

> **QA Pass 2 (2026-05-04):** AC ข้อแรกยังไม่ผ่านจริง — `matchHint` ถูกวางไว้ **ใน** `.review-task-badges` ซึ่งเป็น `display:flex` ทำให้ render ข้างขวาของ conf-bar ไม่ใช่ใต้ → แก้ใน P3-5

---

### P3-5 · Fix: `matchHint` render ผิดตำแหน่ง (ใน flex row) ✅
**Priority:** 🔴 High (Blocking — AC P3-4 ยังไม่ผ่านจริง)  
**Found by:** QA Pass 2 · 2026-05-04  
**Files:** `public/app.js`

**Problem:** `${matchHint}` ถูกวางภายใน `<div class="review-task-badges">` ซึ่ง CSS กำหนดเป็น `display: flex; align-items: center` — ทำให้ matchReason แสดงเป็นคอลัมน์ที่ 3 ในแถวเดียวกับ diff badge และ confidence bar แทนที่จะอยู่ใต้ทั้งหมด

```html
<!-- ปัจจุบัน — ผิด -->
<div class="review-task-badges">       ← flex row
  <span class="review-diff-badge">UPDATE</span>
  <div class="review-conf-bar">...</div>
  ${matchHint}                         ← อยู่ในแถวเดียวกัน (ขวาสุด)
</div>

<!-- ที่ถูกต้อง -->
<div style="flex:1">
  <div class="review-task-badges">
    <span class="review-diff-badge">UPDATE</span>
    <div class="review-conf-bar">...</div>
  </div>
  ${matchHint}                         ← นอก flex row = ขึ้นบรรทัดใหม่ด้านล่าง
</div>
```

**What to do:**
- `app.js`: ย้าย `${matchHint}` ออกจากภายใน `<div class="review-task-badges">` ไปอยู่หลัง closing tag `</div>` ของ `.review-task-badges` แต่ยังอยู่ภายใน `<div style="flex:1">`

**Acceptance Criteria:**
- [x] `matchReason` แสดงเป็นบรรทัดใหม่ **ใต้** แถว badge + confidence bar (ไม่ใช่ขวาสุดในแถวเดียวกัน)
- [x] Layout ของ badge + conf-bar ไม่เปลี่ยน
- [x] `matchReason` ยังคงซ่อนเมื่อ `diffStatus === "create_new"`

---

## PHASE 4 — Google Tasks Daily Planner ✅ COMPLETE
**Goal:** สร้าง Planner page ที่ใช้ได้จริง (ไม่ใช่ "Coming Soon")  
**Depends on:** Phase 0 complete (สามารถทำ parallel กับ Phase 1–2 ได้)  
**Session prompt:** `"ทำ Phase 4 ใน DEVELOPMENT_HISTORY.md — Google Tasks Planner"`

### P4-1 · Google Tasks OAuth Integration ✅
**Files:** `server.js`

**What to do:**
- เพิ่ม Google Tasks API scope ใน OAuth flow (เพิ่มจาก Calendar)
- Endpoint: `GET /api/google-tasks/status` → `{ connected: bool }`
- Endpoint: `GET /api/google-tasks/today` → tasks ที่ due วันนี้ จาก Google Tasks default list
- Endpoint: `POST /api/google-tasks` → สร้าง task ใหม่
- Endpoint: `PUT /api/google-tasks/:id` → mark complete / update title

**Acceptance Criteria:**
- [x] OAuth flow เพิ่ม Tasks scope โดยไม่ break Calendar
- [x] `GET /api/google-tasks/today` คืน task list
- [x] `PUT .../complete` → task หายจาก list

---

### P4-2 · Planner UI ✅
**Files:** `public/app.js`, `public/style.css`  
**Function:** `showPlannerPage()` (แทน placeholder)

**Layout:**
```
[วันที่ Today]

── Google Tasks Today ──────────────────
[ ] Task A                    [delete]
[ ] Task B                    [delete]
[+ Add task for today...]

── Trello Due Today / Tomorrow ─────────
[card chip] Project X · Board: OKR · Due: Today
[card chip] Project Y · Board: OKR · Due: Tomorrow
```

**Acceptance Criteria:**
- [x] Google Tasks connected → แสดง tasks จริง
- [x] Google Tasks ไม่ connected → แสดงปุ่ม "Connect Google Tasks" → เปิด OAuth
- [x] Checkbox ✓ → call PUT mark complete → task หายจาก list
- [x] Trello cards due today/tomorrow ดึงจาก `S.allCardsCache`
- [x] Quick add → สร้าง Google Task ใหม่

---

## PHASE 5 — Today Dashboard: Enhanced ✅ COMPLETE
**Goal:** เพิ่ม sections ที่ยังขาดใน Today page + wiring จริงกับ Review Queue  
**Depends on:** Phase 2 complete  
**Session prompt:** `"ทำ Phase 5 ใน DEVELOPMENT_HISTORY.md — Today Dashboard enhanced"`

### P5-1 · Wire Pending Review Count to Today ✅
**Files:** `public/app.js`

**What to do:**
- Today page section "Pending Review" ดึงจาก `GET /api/reviews` แทน hardcode 0
- Stat card "Pending Review" แสดงจำนวน tasks ที่ status = `pending` จริง
- คลิก stat card → navigate ไป Review Queue

**Acceptance Criteria:**
- [x] มี pending review tasks → stat card แสดงตัวเลขจริง
- [x] Section "Pending Review" แสดง task cards (title, meeting source, diff badge)
- [x] คลิก task → navigate ไป Review Queue และ expand session นั้น

---

### P5-2 · Today: Calendar Conflicts Section ✅
**Files:** `public/app.js`

**What to do:**
- ถ้า GCal connected: ดึง events วันนี้จาก `GET /api/calendar/events`
- แสดง section "Today's Calendar" แบบ compact timeline
- แสดง conflicts: Trello deadline ตรงกับ GCal busy time

**Acceptance Criteria:**
- [x] GCal connected → แสดง events วันนี้
- [x] GCal ไม่ connected → section hidden
- [x] Event แสดง: title, time range, ปุ่ม Open in Calendar

---

### P5-3 · Today: Quick Add wires ไป Trello จริง ✅
**Files:** `public/app.js`

**What to do:**
- Quick add bar ตอนนี้เรียก `openNewCard()` ซึ่งอาจ fail ถ้าไม่มี list
- ให้แสดง mini-select: board → list → confirm ก่อน create
- หรือให้สร้างไปที่ default board/list ที่ตั้งใน Settings

**Acceptance Criteria:**
- [x] Type task name + Enter → modal/popup ให้เลือก board/list โผล่
- [x] เลือก board/list → create card → Today page refresh
- [x] Card ใหม่โชว์ใน section ที่ถูกต้อง (due today / no due)

---

## PHASE 6 — Hardening & Polish ✅ COMPLETE
**Goal:** ทำให้ระบบ reliable ก่อน production use  
**Depends on:** Phase 1–4 complete  
**Session prompt:** `"ทำ Phase 6 ใน DEVELOPMENT_HISTORY.md — Hardening & Polish"`

### P6-1 · Error Handling: ไม่ Expose Raw Trello Errors ✅
**Files:** `server.js`

**What to do:**
- Wrap ทุก Trello/GCal API call ใน try-catch
- Response error ส่งแค่ `{ error: "friendly message" }` ไม่ส่ง raw response
- Log full error ไว้ใน server console แต่ไม่ส่งไป client

**Acceptance Criteria:**
- [x] Trello API key หมดอายุ → client เห็น "Trello connection failed. Check API key in .env"
- [x] GCal token expire → client เห็น "Google Calendar session expired. Please reconnect."
- [x] ไม่มี stack trace หรือ internal URL ใน response

---

### P6-2 · Loading / Empty / Error States ครบทุกหน้า ✅
**Files:** `public/app.js`, `public/style.css`

**Checklist ต่อหน้า:**
- [x] Today: loading spinner → empty state → error state
- [x] Review Queue: empty state แนะนำให้ upload transcript
- [x] All Tasks: empty per-filter state
- [x] Boards Monitor: empty state ถ้าไม่มี visible boards
- [x] Calendar: empty state ถ้าไม่มี events
- [x] Planner: empty state แยก Google Tasks vs Trello

---

### P6-3 · nav-badge: Review Queue Count ใน Sidebar ✅
**Files:** `public/app.js`, `public/index.html`

**What to do:**
- `id="review-badge"` มีแล้วใน HTML แต่ยัง hardcode `display:none`
- หลัง init: ดึง pending task count จาก `GET /api/reviews` → แสดง badge
- Refresh badge หลัง approve/reject

**Acceptance Criteria:**
- [x] มี pending tasks → badge โชว์ตัวเลขสีม่วง
- [x] ไม่มี pending → badge hidden
- [x] หลัง approve ทุก task → badge หายทันที

---

### P6-5 · Fix: OAuth Callback postMessage Origin ✅
**Priority:** ⚪ Low (localhost-only risk)  
**Found by:** QA Pass 2026-05-04  
**Files:** `server.js`  
**Problem:** OAuth callback ส่ง `postMessage` ด้วย wildcard origin `'*'` ซึ่งเป็น best-practice violation — ถ้า app เคยถูก embed หรือ deploy จริง อาจถูก intercept ได้

```javascript
// server.js line ~272
window.opener?.postMessage('cal_connected', '*')  // ← ควรระบุ origin จริง
```

**What to do:**
- เปลี่ยนเป็น origin เฉพาะ:
```javascript
window.opener?.postMessage('cal_connected', 'http://localhost:3000')
```
- หรือถ้าต้องการรองรับ port ต่างๆ ให้รับ `origin` จาก query param แล้ว validate ก่อนใช้

**Acceptance Criteria:**
- [x] `postMessage` ระบุ target origin ที่ถูกต้องแทน `'*'`
- [x] GCal connect flow ยังทำงานได้ปกติหลังแก้

---

### P6-4 · Performance: Cache & Refresh Strategy ✅
**Files:** `public/app.js`, `task-diff.js`

**What to do:**
- `S.allCardsCache` invalidate ให้ถูกต้อง — ตอนนี้บางที stale
- เพิ่ม topbar refresh button (`topbarRefresh()`) ทำงานได้ทุกหน้า
- Board Monitor: refresh cards โดยไม่ reload ทั้งหน้า
- `task-diff.js`: cache board cards keyed by `targetBoardId` ภายใน single `POST /api/reviews` request — ลด Trello API calls จาก N×(1+M) เป็น 1×(1+M) เมื่อหลาย tasks ชี้ไป board เดียวกัน

**Acceptance Criteria:**
- [x] กด ↻ บน topbar ทุกหน้า → refetch ข้อมูลใหม่ + re-render
- [x] Create/update card ใน modal → `S.allCardsCache = null` → Today/Tasks แสดงข้อมูลใหม่
- [x] Session ที่มี 5 tasks บน board เดียวกัน → Trello `getLists` ถูกเรียกแค่ 1 ครั้ง (ไม่ใช่ 5 ครั้ง)

---

### P6-6 · Fix: Task Diff ข้ามบัตรในลิสต์ "Done" / "Completed" ✅
**Priority:** ⚪ Low (defer to Phase 6)  
**Found by:** QA Pass 2026-05-04  
**Files:** `task-diff.js`

**Problem:** `diffTask()` เปรียบเทียบกับ cards ทุก list รวมถึง "Done", "Completed" — task ที่จบแล้วอาจ trigger `update_existing` ทั้งที่งานนั้น complete แล้ว

**What to do:**
- เพิ่ม option ให้ skip lists ที่ชื่อ match กับ pattern เช่น "done", "completed", "archive" (case-insensitive)
- หรือ accept `excludeListNames: string[]` ใน `diffTask()` params

**Acceptance Criteria:**
- [x] Card ในลิสต์ชื่อ "Done" หรือ "Completed" ไม่ถูกนับเป็น match candidate
- [x] Lists ปกติยังถูก compare ตามเดิม

---

### P6-7 · Data Hygiene: `matchReason` ใน `create_new` tasks ✅
**Priority:** ⚪ Low (defer to Phase 6)  
**Found by:** QA Pass 2 · 2026-05-04  
**Files:** `task-diff.js`

**Problem:** `diffTask()` เก็บ internal dev messages ใน `matchReason` สำหรับ `create_new` paths เช่น `"No board or title — defaulting to create_new"`, `"No similar cards found"` — ค่าเหล่านี้ถูก persist ใน `review-sessions.json` และ expose ผ่าน API แม้ UI จะซ่อนไว้

**What to do:**
- ให้ `matchReason = ""` เมื่อ `diffStatus === "create_new"` — internal reason ไม่ควรโผล่ใน data store

**Acceptance Criteria:**
- [x] Tasks ที่ `diffStatus: "create_new"` มี `matchReason: ""` ใน JSON (ไม่ใช่ internal message)
- [x] Tasks ที่ `diffStatus: "update_existing"` หรือ `"possible_duplicate"` ยังมี `matchReason` ปกติ

---

### P6-8 · UX: แสดง `matchReason` ใน Processed Task View ✅
**Priority:** ⚪ Low (defer to Phase 6)  
**Found by:** QA Pass 2 · 2026-05-04  
**Files:** `public/app.js`

**Problem:** หลัง Approve/Reject task แล้ว card เปลี่ยนไปใช้ `buildProcessedTaskHTML()` ซึ่งเป็น compact view — `matchReason` หายไปจาก UI แม้ข้อมูลยังอยู่ใน store ทำให้ไม่มี audit trail ว่า "ทำไมถึง approve task นี้"

**What to do:**
- `buildProcessedTaskHTML()`: เพิ่ม `matchReason` เป็น tooltip หรือ small text ข้างล่าง ถ้า task เคยเป็น `update_existing` หรือ `possible_duplicate`

**Acceptance Criteria:**
- [x] Processed task ที่เคยเป็น `update_existing` → แสดง matchReason เล็กๆ ใต้ status label
- [x] Processed task ที่เป็น `create_new` → ไม่แสดงอะไรเพิ่ม (เหมือนเดิม)

---

## PHASE 7 — OKR / Portfolio Layer
**Goal:** ทำให้ Trisilar Task Hub รองรับแผนบริหาร Trello แบบ Project Boards + Dashboard กลาง โดย map งานจาก project/initiative boards กลับไปหา OKR Board, category, priority, owner และ AI agent support ได้  
**Depends on:** Phase 5–6 complete  
**Session prompt:** `"ทำ Phase 7 ใน DEVELOPMENT_HISTORY.md — OKR / Portfolio Layer ให้ครบตาม Acceptance Criteria"`

### P7-1 · Trello Metadata Ingestion: labels, members, checklist progress, custom fields
**Files:** `trello.js`, `server.js`, `public/app.js`

**What to do:**
- ขยาย Trello card fetch ให้ดึง labels, member ids, checklist progress และ custom field data ถ้ามี
- Normalize metadata ใน `/api/all-cards` และ `/api/boards/cards` ให้ทุก view ใช้ shape เดียวกัน
- เพิ่ม fallback convention: ถ้ายังไม่มี custom fields ให้ใช้ Trello labels เช่น `Revenue`, `SaaS`, `O1`, `KR1.1`, `P0`, `AI Agent`

**Acceptance Criteria:**
- [ ] All Tasks / Today / Boards Monitor ได้ card object ที่มี `labels`, `members`, `checklistProgress`, `okrRefs`, `category`, `priority`, `agent`
- [ ] Board ที่ไม่มี labels/custom fields ยัง render ได้เหมือนเดิม
- [ ] Hidden boards และ allowed workspaces ยังถูกกรองเหมือนเดิม

---

### P7-2 · Portfolio Filters: category / OKR / priority / owner / agent
**Files:** `public/app.js`, `public/style.css`

**What to do:**
- เพิ่ม filter chips หรือ compact filter bar ใน All Tasks และ Boards Monitor
- Filter ต้องรองรับ category, OKR objective/KR, priority, owner และ AI agent/source
- เพิ่ม group-by ที่จำเป็นสำหรับทีม 2 คน: by board, category, OKR, priority, owner

**Acceptance Criteria:**
- [ ] All Tasks filter ตาม category/OKR/priority/owner/agent ได้
- [ ] Boards Monitor แสดง board stats แบบ filter-aware
- [ ] Filter state ไม่ทำให้ Today/Planner เสีย behavior เดิม

---

### P7-3 · OKR Progress View
**Files:** `public/index.html`, `public/app.js`, `public/style.css`, `server.js`

**What to do:**
- เพิ่มหน้า `OKR` หรือ `Portfolio` ใน sidebar
- แสดง Objectives/KRs จาก OKR board และ link ไปยัง Project Boards ที่เกี่ยวข้องผ่าน labels/custom fields/naming convention
- คำนวณ progress จาก card completion, checklist completion, overdue count และ due timeline

**Acceptance Criteria:**
- [ ] เห็น Objective 1–4 จาก OKR board พร้อม KR summary
- [ ] แต่ละ KR แสดง linked project cards/boards, progress %, overdue, next due
- [ ] คลิก KR แล้ว drill down ไป task list ที่เกี่ยวข้องได้

---

### P7-4 · Project Board Convention Validator
**Files:** `server.js`, `public/app.js`

**What to do:**
- ตรวจแต่ละ Project Board ว่ามี list names มาตรฐาน เช่น Backlog, Ready, Doing, Review/QA, Done หรือ mapping ที่ตั้งค่าได้
- ตรวจ required metadata: category, OKR/KR reference, priority, owner/agent, due date สำหรับงาน execution
- แสดง warnings ใน Boards Monitor หรือ Portfolio page

**Acceptance Criteria:**
- [ ] Board ที่ขาด list สำคัญถูก flag พร้อมคำแนะนำแก้
- [ ] Card ที่ขาด OKR/category/priority/owner/due ถูกนับเป็น hygiene issue
- [ ] User สามารถ open board/card เพื่อแก้ใน Trello/Task Hub ได้

---

### P7-5 · Weekly Focus View for 2-person + AI Agent Team
**Files:** `public/app.js`, `public/style.css`, `server.js`

**What to do:**
- เพิ่มมุมมอง Weekly Focus ที่ดึง P0/P1, due this week, blocked, pending review และ AI-agent tasks จากทุก Project Board
- สรุปเป็น action queue สำหรับคน 2 คน: `Do Now`, `Review AI`, `Waiting/Blocked`, `Schedule`, `Done This Week`
- ใช้ข้อมูลเดียวกับ Today/Planner โดยไม่สร้าง Team Board ซ้ำใน Trello

**Acceptance Criteria:**
- [ ] User เห็น weekly focus จากทุก Project Board ในหน้าเดียว
- [ ] Pending Review และ AI Agent tasks ถูกยกขึ้นมาให้ตรวจง่าย
- [ ] งานที่ done this week แสดงเพื่อใช้ทำ weekly review ได้

---

## Progress Tracker

อัปเดตหลังแต่ละ session:

| Phase | Task | Status | Date | Notes |
|---|---|---|---|---|
| **P0** | **P0-1** Clear due/start date | ✅ Done | 2026-05-04 | Payload always sends `due/start: null`; server uses `in` check |
| **P0** | **P0-2** Hidden boards filter | ✅ Done | 2026-05-04 | `showAllTasks()` now filters hiddenBoards |
| **P0** | **P0-3** Explicit calendar sync | ✅ Done | 2026-05-04 | syncCalendar flag required; fixed leak to Trello API via destructure |
| **P0** | **P0-4** Credential security | ✅ Done | 2026-05-04 | POST body instead of URL; closeCalSetup after popup check |
| **P0** | **P0-5** allowedWorkspaceIds filter | ✅ Done | 2026-05-04 | `getAllowedCards()` helper unifies workspace + hidden filter |
| **P0** | QA Pass 1 + 2 | ✅ Clean | 2026-05-04 | Pass 1: found & fixed syncCalendar leak + popup UX. Pass 2: all clean (P0-6 was false positive) |
| **P1** | **P1-1** Review data store | ✅ Done | 2026-05-04 | `review-store.js` — sync JSON ops, full schema per PRD §9 |
| **P1** | **P1-2** Review CRUD APIs | ✅ Done | 2026-05-04 | 9 endpoints in server.js, smoke tested via browser eval |
| **P1** | **P1-3** Approve → push Trello | ✅ Done | 2026-05-04 | `pushTaskToTrello()` — create_new/update_existing + GCal sync |
| **P1** | QA Pass | ✅ Clean | 2026-05-04 | พบ 3 medium + 2 low — ทั้งหมดแก้แล้วใน P1-4–P1-8 |
| **P1** | **P1-4** Fix corrupt JSON read | ✅ Done | 2026-05-04 | review-store.js: แยก ENOENT → `[]`, SyntaxError → log |
| **P1** | **P1-5** Fix double-approve guard | ✅ Done | 2026-05-04 | approveTask: throw "already approved"; rejectTask: throw "already processed" |
| **P1** | **P1-6** Fix updateTask no status guard | ✅ Done | 2026-05-04 | updateTask: throw "Cannot edit processed task" ถ้า status ≠ pending |
| **P1** | **P1-7** Fix dismissSession pending guard | ✅ Done | 2026-05-04 | dismissSession: throw "unprocessed tasks" ถ้า pending ค้าง |
| **P1** | **P1-8** Fix stale trelloCardId in response | ✅ Done | 2026-05-04 | server.js: refresh snapshot + notFound คืน 409 สำหรับ conflicts |
| **P2** | **P2-1** Session list UI | ✅ Done | 2026-05-04 | showReviewPage() fully replaced; loading/empty/error states; Dismiss conditional on all-processed |
| **P2** | **P2-2** Task detail panel | ✅ Done | 2026-05-04 | Inline editing, board→list chain, diff badges, confidence bar, approve/reject in-place |
| **P2** | **P2-3** Bulk actions | ✅ Done | 2026-05-04 | Per-task checkbox, select-all, bulk bar, approve-bulk/reject-bulk APIs |
| **P2** | **P2-4** Manual session creator | ✅ Done | 2026-05-04 | #transcript-modal in index.html; openTranscriptModal/submitTranscript functions |
| **P3** | **P3-1** Task diff API | ✅ Done | 2026-05-04 | task-diff.js: Dice similarity, threshold 80%, POST /api/task-diff endpoint |
| **P3** | **P3-2** Wire diff to session | ✅ Done | 2026-05-04 | POST /api/reviews now async; runs diffTask per task before createSession |
| **P3** | QA Pass 1 | ✅ Clean | 2026-05-04 | พบ 🔴×2 + 🟡×2 → แก้แล้วใน P3-3, P3-4 |
| **P3** | **P3-3** Fix matchReason + Thai support | ✅ Done | 2026-05-04 | review-store.js: เพิ่ม matchReason field; task-diff.js: Unicode regex `/gu` |
| **P3** | **P3-4** Fix UI matchReason + boardId validate | ✅ Done | 2026-05-04 | app.js: matchHint ใน badge row; server.js: targetBoardId → 400 |
| **P3** | QA Pass 2 | ✅ Clean | 2026-05-04 | พบ 🔴×1 matchHint layout → แก้แล้วใน P3-5; 🟡×1 + 🔵×1 defer ไป P6-7, P6-8 |
| **P3** | **P3-5** Fix matchHint layout (flex → block) | ✅ Done | 2026-05-04 | app.js: ย้าย matchHint ออกนอก .review-task-badges → render ใต้ badges |
| **P3** | QA Pass 3 | ✅ Clean | 2026-05-04 | ไม่มีข้อบกพร่องใหม่ — Phase 3 QA ผ่านสมบูรณ์ |
| **P4** | **P4-1** Google Tasks OAuth | ✅ Done | 2026-05-05 | server.js: getTasksClient, todayBangkok, 4 endpoints, Tasks scope added to OAuth |
| **P4** | **P4-2** Planner UI | ✅ Done | 2026-05-05 | app.js: showPlannerPage async, GTasks + Trello sections, quick-add, complete task |
| **P5** | **P5-1** Wire review count | ✅ Done | 2026-05-05 | app.js: live pendingCount from /api/reviews, stat card onclick, review section with diff badges + click→expand |
| **P5** | **P5-2** Calendar events section | ✅ Done | 2026-05-05 | app.js: fetch /api/calendar/events when GCal connected, compact list with time range + Open ↗ |
| **P5** | **P5-3** Quick add → Trello | ✅ Done | 2026-05-05 | app.js: inline board/list selector, confirmTodayQuickAdd clears input after success, cache invalidation |
| **P5** | QA Pass 3 | ✅ Clean | 2026-05-05 | 11/11 AC ผ่าน, B1 chip class fixed (5e47a0b), E1 loop var rename, 0 regression |
| **P6** | **P6-1** Error handling | ✅ Done | 2026-05-05 | friendlyError() helper; all 33 raw e.message → friendly strings |
| **P6** | **P6-2** Empty/Error states | ✅ Done | 2026-05-05 | All 6 pages: loading+empty+error; Review upload transcript CTA; Calendar empty notice |
| **P6** | **P6-3** Review badge | ✅ Done | 2026-05-05 | updateReviewBadge() wired at init + approve/reject/dismiss; purple badge |
| **P6** | **P6-4** Cache strategy | ✅ Done | 2026-05-05 | boardCardsCache Map in POST /api/reviews; refreshCurrentView all 8 modes incl. review/planner/settings |
| **P6** | **P6-5** OAuth postMessage origin | ✅ Done | 2026-05-05 | postMessage('cal_connected','http://localhost:3000'); origin check in client |
| **P6** | **P6-6** Task diff skip Done/Completed lists | ✅ Done | 2026-05-05 | DONE_LIST_PATTERN regex; filter before card fetch |
| **P6** | **P6-7** matchReason cleanup for create_new | ✅ Done | 2026-05-05 | All 3 create_new return paths: matchReason: "" |
| **P6** | **P6-8** Processed task matchReason display | ✅ Done | 2026-05-05 | buildProcessedTaskHTML: reasonTip muted text for update/duplicate |
| **P7** | **P7-1** Trello metadata ingestion | ✅ Done | 2026-05-07 | labels, members, checklist progress, custom fields normalized — commit 980b5f0 |
| **P7** | **P7-2** Portfolio filters | ✅ Done | 2026-05-07 | OKR overview filters by label/member with explicit empty state — commit 387d43b |
| **P7** | **P7-3** OKR Progress View | ✅ Done | 2026-05-07 | overview summary, KR metadata, linked project task detail — commit 422b91b |
| **P7** | **P7-4** Project Board Convention Validator | ✅ Done | 2026-05-08 | list group aliases, metadata hygiene counts, board/card open paths — commit b345e65 |
| **P7** | **P7-5** Weekly Focus View | ✅ Done | 2026-05-08 | Do Now, Review AI, Waiting/Blocked, Schedule, Done This Week lanes — commit 5be2ea6 |
| **P8** | **P8-1** Notification & Alert System | ✅ Done | 2026-05-06 | tab title (N) + once-per-session overdue alert banner, dismiss ✕/click-away — commit d9ce8b1 |
| **P8** | **P8-2** Card Quick-Edit Inline | ✅ Done | 2026-05-06 | dblclick rename All Tasks + inline date picker overdue Today, B9 fix — commit e8e4b75 |
| **P8** | **P8-3** Export / Report CSV | ✅ Done | 2026-05-06 | Export CSV button filtered tasks, 7 columns, BOM UTF-8, filename YYYY-MM-DD — commit 8068e38 |
| **P8** | **P8-4** Performance Virtual Scroll | ➡ Deferred | — | cards ~102 < 200 threshold, defer until scale requires it |
| **P8** | **P8-5** OKR Board Setup Guide | ✅ Done | 2026-05-06 | 4-step accordion guide, native details/summary, Refresh button — commit 1c0fa33 |
| **P9** | **P9-4** Monitor Label Filter | ✅ Done | 2026-05-06 | Label Chips Filter in Boards Monitor — commit 7926b80 |
| **P9** | **P9-5** Tasks Group by Type | ✅ Done | 2026-05-06 | OKR vs Projects grouping — commit b328c8f |
| **P10** | **P10-1** Dynamic Team Grouping | ✅ Done | 2026-05-06 | Aggregate stats by team labels managed via Settings — commit 2a4c426 |
| **P10** | **P10-2** Team Monitor: Board View | ✅ Done | 2026-05-06 | Kanban layout (Backlog/Progress/Done) for teams — commit 4625180 |
| **P10** | **P10-3** Task Detail Integration | ✅ Done | 2026-05-06 | Click cards in Monitor to open Edit Modal — commit 4625180 |
| **P10** | **P10-4** Interactive Table Sorting | ✅ Done | 2026-05-06 | Click headers in All Tasks to sort — commit e79ff3b |
| **B20** | **Bug** Thai Localization | ✅ Done | 2026-05-06 | Standardized dd/mm/yyyy 24hr UTC+7 across all views — commit a7088fb |
| **STB** | **Stability** Trello API Overhaul | ✅ Done | 2026-05-06 | Implemented Batch Fetching to reduce API calls by 90% — commit 632fab4 |
| **V0.1-P1** | Scripts & Smoke | ✅ Done | 2026-05-06 | Foundation for modularization — commit 5c7ad14 |
| **V0.1-P2** | Route Extraction | ✅ Done | 2026-05-06 | 5 modular route files extracted from server.js — commit 25a31b7 |
| **V0.1-P3** | Helper Extraction | ✅ Done | 2026-05-06 | Moving logic (cache, errors, models, google) to src/utils and src/models — commit d06d388 |
| **V0.1-P4** | Server Hardening | ✅ Done | 2026-05-06 | Final cleanup of server.js (~52 lines) and config modularization — commit f6b5ab6 |
| **V0.1-P5** | Frontend Modularization | ✅ Done | 2026-05-07 | Split app.js into page-based modules (today, review, all-tasks, boards, calendar, okr) |
| **V0.1-P6** | Code Quality & Hardening | ✅ Done | 2026-05-07 | Error boundaries, load-order audit, and consolidated verification scripts |
| **V0.1-Release** | Release Acceptance | ✅ Done | 2026-05-08 | check:all, direct routes, sidebar navigation, back/forward, Phase 7 surfaces, console errors 0 |

**Status legend:** ⬜ Todo · 🔄 In Progress · ✅ Done · 🛑 Blocked · ➡ Deferred

---

## 🏆 Milestone: Version 0.1 Release Acceptance Complete

Version 0.1 has transformed the monolithic app into a maintainable modular local-first system and passed release acceptance:
- **Routes:** 5 dedicated files in `src/routes/`
- **Models:** Trello data logic in `src/models/`
- **Utils:** Centralized logic for cache, errors, date, google, and config in `src/utils/`
- **Frontend:** page modules split under `public/js/pages/`
- **Router:** URL path sync and direct route fallback are in place.
- **Verification:** `check:all` and browser release acceptance passed.

---

## Milestone: Version 0.2 W2 Full UI Redesign Phase Ladder

**Status:** Active planning update (2026-05-08)
**Detailed plan:** `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`
**Updated by:** Codex PM

W2 follows the existing project phase-ladder pattern: each phase has a dependency, scoped tasks, acceptance criteria, QA evidence, and PM acceptance before the next full-redesign phase is treated as done.

| Phase | Status | Scope | Gate |
|---|---|---|---|
| W2a | Accepted `b5f67fb` | Shell foundation, mobile nav baseline, Today redesign | Accepted as foundation only |
| W2b | Planned next | Review Queue redesign and shared task drawer foundation | Review workflows + desktop/mobile visual QA |
| W2c | Planned | Tasks inbox and cross-board rows | Search/filter/group/export + visual QA |
| W2d | Planned | Boards monitor and team board views | Board/team modes + metadata health QA |
| W2e | Planned | Calendar and Planner redesign | Calendar/Planner source distinction + mobile QA |
| W2f | Planned | Settings, OKR, and Weekly Focus polish | All production routes visually aligned |

W2 Full UI Redesign is not complete until W2f passes QA and PM acceptance.

---

## Open Questions (จาก PRD §15)

Revisit these before V0.2 workstream planning:

| # | Question | Answer | Decided by |
|---|---|---|---|
| Q1 | Owner field: Trello member ID หรือ text? | — | |
| Q2 | Transcript input: Discord / paste / file upload? | — | |
| Q3 | Google Tasks: two-way sync หรือ push-only ก่อน? | — | |
| Q4 | OKR board naming convention ตายตัวแล้วหรือยัง? | — | |
| Q5 | Single-user หรือ multi-user? | — | |
| Q6 | ใช้ Trello labels หรือ custom fields เป็น source of truth สำหรับ category/OKR/priority/owner/agent? | — | |
| Q7 | OKR Board จะ map กับ Project Boards ผ่าน label (`O1`, `KR1.1`) หรือ card links/checklists? | — | |
| Q8 | Weekly Focus ควรใช้ due date, priority label, list position หรือ manual pin เป็นเกณฑ์หลัก? | — | |

---

## Dependency Map

```
P0 (Bugs) ──────┬─→ P1 (Data) ──→ P2 (UI) ──→ P5 (Today+) ──→ P6 (Polish) ──→ P7 (OKR/Portfolio)
                │                  │
                │                  └─→ P3 (Diff)
                │
                └─→ P4 (Planner)   ──────────────→ P6 (Polish)
```

---

## Next Session Prompt (copy-paste ready)

**V0.2 Parallel Workstream Planning (Next):**
```
Role: PM
Task: V0.2 Parallel Workstream Plan + Branch Strategy

Context:
V0.1 Release Acceptance passed. Before opening parallel Dev sessions, define branch/environment rules and split V0.2 into independent workstreams.

Goals:
1. Define branch model: main = production, dev = integration/dev environment, feature/* PRs into dev, dev PRs into main after QA.
2. Define V0.2 workstreams:
   - W0 Branch / Environment / CI Setup
   - W1 Company Access + Deployment
   - W2 Full UI Redesign
   - W3 Paperclip Multi-Agent Integration
3. Add PR/QA rules and agent attribution requirements.
4. Replace CURRENT_SPRINT.md Next Action with W0 Dev prompt.
5. Commit and push docs.
```

---

*Document owner: Project Manager reference only. Update Progress Tracker after each Claude Code session.*
