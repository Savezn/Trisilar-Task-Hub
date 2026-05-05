# Current Sprint — Trisilar Task Hub
**Phase 6 · Hardening & Polish**
**Started:** 2026-05-05 · **Status:** ⬜ In Progress

> **วิธีใช้ไฟล์นี้:**
> - Dev / QA / PM อ้างอิงไฟล์นี้เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)
> - PM อัปเดต DEVELOPMENT_PLAN.md progress tracker เมื่อ Phase เสร็จสมบูรณ์เท่านั้น

---

## Sprint Goal
ทำให้ระบบ reliable ก่อน production use: error handling, loading/empty states, review badge, cache strategy, OAuth fix, task-diff hygiene

---

## Completed This Sprint
*(PM check ✅ เมื่อ QA pass แล้ว)*

| Task | Status | Commit |
|---|---|---|
| P6-1 Error handling | ⬜ Not started | — |
| P6-2 Loading/Empty/Error states | ⬜ Not started | — |
| P6-3 Review badge in sidebar | ⬜ Not started | — |
| P6-4 Cache & refresh strategy | ⬜ Not started | — |
| P6-5 OAuth postMessage origin fix | ⬜ Not started | — |
| P6-6 Task diff skip Done lists | ⬜ Not started | — |
| P6-7 matchReason cleanup | ⬜ Not started | — |
| P6-8 matchReason in processed view | ⬜ Not started | — |

---

## Active Tasks

### P6-1 · Error Handling: ไม่ Expose Raw Trello Errors
**File:** `server.js`

**What to do:**
- Wrap ทุก Trello/GCal API call ใน try-catch
- Response error ส่งแค่ `{ error: "friendly message" }` ไม่ส่ง raw response
- Log full error ไว้ใน server console เท่านั้น

**AC:**
- [ ] Trello API key หมดอายุ → client เห็น "Trello connection failed. Check API key in .env"
- [ ] GCal token expire → client เห็น "Google Calendar session expired. Please reconnect."
- [ ] ไม่มี stack trace หรือ internal URL ใน response

---

### P6-2 · Loading / Empty / Error States ครบทุกหน้า
**File:** `public/app.js`, `public/style.css`

**AC:**
- [ ] Today: loading spinner → empty state → error state
- [ ] Review Queue: empty state แนะนำให้ upload transcript
- [ ] All Tasks: empty per-filter state
- [ ] Boards Monitor: empty state ถ้าไม่มี visible boards
- [ ] Calendar: empty state ถ้าไม่มี events
- [ ] Planner: empty state แยก Google Tasks vs Trello

---

### P6-3 · nav-badge: Review Queue Count ใน Sidebar
**File:** `public/app.js`, `public/index.html`

**What to do:**
- `id="review-badge"` มีแล้วใน HTML แต่ยัง hardcode `display:none`
- หลัง init: ดึง pending task count จาก `GET /api/reviews` → แสดง badge
- Refresh badge หลัง approve/reject

**AC:**
- [ ] มี pending tasks → badge โชว์ตัวเลขสีม่วง
- [ ] ไม่มี pending → badge hidden
- [ ] หลัง approve ทุก task → badge หายทันที

---

### P6-4 · Performance: Cache & Refresh Strategy
**File:** `public/app.js`, `task-diff.js`

**What to do:**
- topbar refresh button (`topbarRefresh()`) ทำงานได้ทุกหน้า
- `task-diff.js`: cache board cards keyed by `targetBoardId` ภายใน single request — ลด Trello API calls จาก N×(1+M) เป็น 1×(1+M)

**AC:**
- [ ] กด ↻ บน topbar ทุกหน้า → refetch ข้อมูลใหม่ + re-render
- [ ] Create/update card ใน modal → `S.allCardsCache = null` → Today/Tasks แสดงข้อมูลใหม่
- [ ] Session ที่มี 5 tasks บน board เดียวกัน → Trello `getLists` ถูกเรียกแค่ 1 ครั้ง

---

### P6-5 · Fix: OAuth Callback postMessage Origin
**Priority:** ⚪ Low  
**File:** `server.js`

**What to do:**
- เปลี่ยน `postMessage('cal_connected', '*')` → `postMessage('cal_connected', 'http://localhost:3000')`

**AC:**
- [ ] `postMessage` ระบุ target origin ที่ถูกต้องแทน `'*'`
- [ ] GCal connect flow ยังทำงานได้ปกติหลังแก้

---

### P6-6 · Fix: Task Diff ข้ามบัตรในลิสต์ "Done" / "Completed"
**Priority:** ⚪ Low  
**File:** `task-diff.js`

**What to do:**
- เพิ่ม option skip lists ที่ชื่อ match pattern "done", "completed", "archive" (case-insensitive)

**AC:**
- [ ] Card ในลิสต์ชื่อ "Done" หรือ "Completed" ไม่ถูกนับเป็น match candidate
- [ ] Lists ปกติยังถูก compare ตามเดิม

---

### P6-7 · Data Hygiene: `matchReason` ใน `create_new` tasks
**Priority:** ⚪ Low  
**File:** `task-diff.js`

**What to do:**
- ให้ `matchReason = ""` เมื่อ `diffStatus === "create_new"`

**AC:**
- [ ] Tasks ที่ `diffStatus: "create_new"` มี `matchReason: ""` ใน JSON
- [ ] Tasks ที่ `diffStatus: "update_existing"` หรือ `"possible_duplicate"` ยังมี `matchReason` ปกติ

---

### P6-8 · UX: แสดง `matchReason` ใน Processed Task View
**Priority:** ⚪ Low  
**File:** `public/app.js`

**What to do:**
- `buildProcessedTaskHTML()`: เพิ่ม `matchReason` เป็น tooltip หรือ small text ข้างล่าง สำหรับ task ที่เคยเป็น `update_existing` หรือ `possible_duplicate`

**AC:**
- [ ] Processed task ที่เคยเป็น update/duplicate แสดง matchReason เป็น muted text ใต้ title
- [ ] Processed task ที่เป็น create_new ไม่แสดง matchReason (empty)

---

## QA Log
*(PM บันทึกผล QA แต่ละรอบ)*

| Date | Round | Result | Notes |
|---|---|---|---|
| 2026-05-05 | QA Pass 1 (pre-impl) | ⚠ Not started | P6-1 ถึง P6-8 ยังไม่มีโค้ด |

## Bug Fixes This Sprint
*(PM เพิ่มที่นี่เมื่อ QA พบ bug ใน code ที่ implement แล้ว)*

*ยังไม่มี*

---

## ⚡ Next Action — Dev ต้องทำ

**Dev: implement P6-1 → P6-3 → P6-5 → P6-4 → P6-6 → P6-7 → P6-8 → P6-2 ตามลำดับ priority**

ลำดับที่แนะนำ:
1. **P6-1** — server.js เท่านั้น, เพิ่ม try-catch รอบ Trello/GCal calls, friendly error messages
2. **P6-3** — sidebar badge: Grep `review-badge` ใน index.html + app.js, wiring count จาก /api/reviews
3. **P6-5** — server.js 1 บรรทัด: `'*'` → `'http://localhost:3000'`
4. **P6-4** — topbarRefresh ทุกหน้า + task-diff.js board cache
5. **P6-6** — task-diff.js: skip list name filter
6. **P6-7** — task-diff.js: matchReason = "" สำหรับ create_new
7. **P6-8** — app.js: buildProcessedTaskHTML เพิ่ม matchReason
8. **P6-2** — app.js + style.css: empty/error states ครบทุกหน้า (ทิ้งไว้สุดท้ายเพราะกระทบหลายไฟล์)

**จุดที่ต้องระวัง:**
- P6-1: อย่า expose `err.message` จาก Trello/GCal ไป client โดยตรง — ใช้ friendly string แทน
- P6-3: badge ต้อง refresh ทุกครั้งที่ approve/reject — หา event hook ที่มีอยู่แล้ว
- P6-5: อย่าลืมตรวจว่า postMessage ใน server.js มี `'*'` กี่ที่
- P6-4: topbarRefresh ต้องเรียก `refreshCurrentView()` หรือ show function ของ page ปัจจุบัน

---

## Key File Map
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | คำสั่ง |
|---|---|
| Trello/GCal try-catch ใน server.js | `Grep("trello\|gcal\|catch", "server.js")` |
| `review-badge` ใน HTML/JS | `Grep("review-badge", "public/index.html")` + `Grep("review-badge", "public/app.js")` |
| `postMessage` wildcard | `Grep("postMessage", "server.js")` |
| `topbarRefresh` function | `Grep("topbarRefresh", "public/app.js")` |
| `buildProcessedTaskHTML` | `Grep("buildProcessedTaskHTML", "public/app.js")` |
| `diffStatus.*create_new` ใน task-diff.js | `Grep("create_new\|matchReason", "task-diff.js")` |

---

## Session Prompts (copy-paste ready)

### 🔨 Dev Session
```
คุณ Dev — อ้างอิง CURRENT_SPRINT.md เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)

ทำ P6-1, P6-3, P6-5 ให้เสร็จตาม Acceptance Criteria (เริ่มจาก 3 tasks ที่ impact สูงสุดก่อน)
ดู ⚡ Next Action ใน CURRENT_SPRINT.md สำหรับลำดับและ key notes

กฎการอ่านไฟล์:
- ใช้ Grep หา function/line ที่ต้องแก้ก่อน
- Read ด้วย offset+limit เฉพาะส่วนที่ต้องการ (ไม่อ่านทั้งไฟล์)
- อย่าอ่าน DEVELOPMENT_PLAN.md

เมื่อเสร็จ: git commit + git push อธิบายสิ่งที่ทำ
```

### 🔍 QA Session
```
คุณ QA Tester — อ้างอิง CURRENT_SPRINT.md เท่านั้น

ตรวจสอบ task ที่ Dev เพิ่งทำ (ดู git log --oneline -3)
เปรียบเทียบกับ AC ใน CURRENT_SPRINT.md

กฎ:
- อย่าอ่าน DEVELOPMENT_PLAN.md
- ใช้ Grep หาจุดที่ต้องตรวจ ไม่อ่านไฟล์ทั้งหมด
- อย่าแก้ code — รายงานอย่างเดียว

Output format:
✅ AC ที่ผ่าน (ข้อ...)
🔴 Bug: [อธิบาย + file:line]
🟡 Missing: [อธิบาย]
🔵 Edge case: [อธิบาย + ระดับ priority]
```

### 📋 PM Session
```
คุณ PM — อ้างอิง QA output จาก session ก่อน + CURRENT_SPRINT.md

งาน:
1. ถ้า QA พบ bug → เพิ่ม Fix task ใน "Bug Fixes This Sprint" ของ CURRENT_SPRINT.md
2. ถ้า QA clean → tick ✅ ใน "Completed This Sprint" ของ CURRENT_SPRINT.md
3. ถ้า Phase ทั้งหมดเสร็จ → sync DEVELOPMENT_PLAN.md progress tracker แล้วสร้าง CURRENT_SPRINT.md ใหม่สำหรับ Phase ถัดไป

กฎ:
- อย่าอ่าน DEVELOPMENT_PLAN.md เว้นแต่ต้อง sync tracker เท่านั้น
- อย่าแก้ code
- ระบุชัดเจนว่า Dev ต้องทำอะไรต่อ
```

---

## Phase Context (ย่อ)
| Phase | Status |
|---|---|
| P0 Bug Fixes | ✅ Done |
| P1 Review Queue Data | ✅ Done |
| P2 Review Queue UI | ✅ Done |
| P3 Task Diff Engine | ✅ Done |
| P4 Google Tasks Planner | ✅ Done (2026-05-05) |
| P5 Today Enhanced | ✅ Done (2026-05-05) |
| **P6 Hardening & Polish** | **⬜ Current** |
| P7 OKR / Portfolio Layer | ⬜ Post-MVP |

*รายละเอียด P7 tasks: ดู DEVELOPMENT_PLAN.md § PHASE 7*
