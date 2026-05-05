# Current Sprint — Trisilar Task Hub
**Phase 7 · OKR / Portfolio Layer**
**Started:** 2026-05-05 · **Status:** ⬜ In Progress

> **วิธีใช้ไฟล์นี้:**
> - Dev / QA / PM อ้างอิงไฟล์นี้เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)
> - PM อัปเดต DEVELOPMENT_PLAN.md progress tracker เมื่อ Phase เสร็จสมบูรณ์เท่านั้น

---

## Sprint Goal
ทำให้ระบบรองรับแผนบริหาร Trello แบบ Project Boards + Dashboard กลาง โดย map งานจาก project/initiative boards กลับหา OKR Board, category, priority, owner และ AI agent support

---

## Completed This Sprint
*(PM check ✅ เมื่อ QA pass แล้ว)*

| Task | Status | Commit |
|---|---|---|
| P7-1 Trello metadata ingestion | ✅ Done | c833189 |
| P7-2 Portfolio filters | ✅ Done | 9d89034 |
| P7-3 OKR Progress View | ✅ Done | 9d89034 |
| P7-4 Board convention validator | ⬜ Not started | — |
| P7-5 Weekly Focus view | ⬜ Not started | — |

---

## Active Tasks

### P7-1 · Trello Metadata Ingestion
**Priority:** 🔴 High (ทุก task ต่อจากนี้ depend on ข้อมูลนี้)
**Files:** `trello.js`, `server.js`, `public/app.js`

**What to do:**
- ขยาย Trello card fetch ให้ดึง labels, member ids, checklist progress และ custom field data ถ้ามี
- Normalize metadata ใน `/api/all-cards` และ `/api/boards/cards` ให้ทุก view ใช้ shape เดียวกัน

**AC:**
- [ ] Card object ใน `/api/all-cards` มี field: `labels[]`, `members[]`, `checklistProgress` (done/total)
- [ ] Custom fields ถ้ามี — expose เป็น `customFields: { [name]: value }`
- [ ] `/api/boards/cards` ใช้ shape เดียวกัน
- [ ] ไม่มี regression ใน existing views (Today, All Tasks, Kanban, Calendar)

---

### P7-2 · Portfolio Filters
**Priority:** 🔴 High
**Files:** `public/app.js`, `public/style.css`

**What to do:**
- เพิ่ม filter chips ใน All Tasks view: Category / OKR / Priority / Owner / Agent
- Filter ใช้ labels และ member ids จาก P7-1 metadata
- Group by selector เพิ่ม option: "By Label" / "By Member"

**AC:**
- [ ] Filter chip "Label" → กรอง cards ที่มี label ที่เลือก
- [ ] Filter chip "Owner" → กรอง cards ที่ assigned member ตรง
- [ ] Group by "By Label" → แสดง cards จัดกลุ่มตาม label
- [ ] ไม่กระทบ existing filter chips (All, Today, Overdue, etc.)

---

### P7-3 · OKR Progress View
**Priority:** 🟡 Medium
**Files:** `public/app.js`, `public/style.css`, `public/index.html`

**What to do:**
- สร้าง view ใหม่ "OKR" ใน sidebar
- ดึง cards จาก board ที่ชื่อหรือ label match "OKR" / "Objective"
- แสดง Objectives/KRs จาก OKR board และ link ไปยัง Project Boards ที่เกี่ยวข้องผ่าน labels/naming convention
- คำนวณ progress จาก card completion, checklist completion, overdue count

**AC:**
- [ ] เห็น Objective 1–N จาก OKR board พร้อม KR summary
- [ ] แต่ละ KR แสดง linked project cards/boards, progress %, overdue, next due
- [ ] คลิก KR → drill down ไป task list ที่เกี่ยวข้องได้
- [ ] ถ้าไม่มี OKR board → แสดง empty state แนะนำให้ตั้งค่า

---

### P7-4 · Project Board Convention Validator
**Priority:** 🟡 Medium
**Files:** `server.js`, `public/app.js`

**What to do:**
- ตรวจ list names ของแต่ละ board ว่าตรง convention หรือไม่ (เช่น มี "Done"/"Backlog"/"In Progress")
- แสดง warning badge ใน Boards Monitor ถ้า board ไม่ครบ convention
- API endpoint: `GET /api/boards/:id/health`

**AC:**
- [ ] Board ที่ขาด required list names → แสดง ⚠ badge ใน Boards Monitor
- [ ] `GET /api/boards/:id/health` คืน `{ ok: bool, missing: string[] }`
- [ ] Board ที่ครบ convention → ไม่มี badge

---

### P7-5 · Weekly Focus View
**Priority:** ⚪ Low (MVP placeholder)
**Files:** `public/app.js`, `public/style.css`, `public/index.html`

**What to do:**
- สร้าง view "Weekly Focus" ใน sidebar — operating view สำหรับทีม 2 คน + AI Agent
- แสดง: tasks ที่กำหนดให้ตัวเอง (by owner filter) + upcoming 7 days + pending review count
- Quick-assign: drag task ไปหา owner slot

**AC:**
- [ ] แสดง tasks ของ owner ที่เลือกใน 7 วันข้างหน้า
- [ ] Pending review count badge ในหน้า
- [ ] Empty state ถ้าไม่มี tasks assigned ใน 7 วัน

---

## QA Log
*(PM บันทึกผล QA แต่ละรอบ)*

| Date | Round | Result | Notes |
|---|---|---|---|
| 2026-05-05 | QA Pass 1 (P7-1) | 🟡 1 Missing | P7-1 AC 4/5 ผ่าน — B5: customFields keyed by idCustomField ไม่ใช่ name |
| 2026-05-05 | QA Pass 2 (B5 + P7-2) | 🟡 1 Missing | B5 ✅, P7-1 ✅ ครบ, P7-2 AC 3/4 — M6: Label/Owner ใช้ `<select>` แทน filter chip ตาม AC spec |
| 2026-05-05 | QA Pass 3 (M6 + P7-3) | 🔴 1 Bug | M6 ✅, P7-3 ✅ ครบ 4/4 — B6: `renderDetail()` ไม่ `esc()` boardName/listName (`app.js:2281`) |

## Bug Fixes This Sprint
*(PM เพิ่มที่นี่เมื่อ QA พบ bug ใน code ที่ implement แล้ว)*

| ID | Bug | File:Line | Status |
|---|---|---|---|
| B5 | `customFields` keyed by `idCustomField` (hex string) แทน field name — AC ระบุ `{ [name]: value }` — ต้องการ `GET /boards/:id/customFields` per board เพื่อ resolve names | `server.js:76` | ✅ Fixed (c833189) |
| M6 | P7-2 AC ระบุ "Filter chip 'Label'" และ "Filter chip 'Owner'" — implementation ใช้ `<select class="at-select">` dropdown แทน pill chip — ฟังก์ชันกรองถูกต้องแต่ UI ไม่ตรง spec | `app.js:2136–2143` | ✅ Fixed (9d89034) |
| B6 | `renderDetail()` header ไม่ใช้ `esc()` กับ `krCard.boardName` และ `krCard.listName` — XSS risk ถ้า board/list name มี `<`, `>`, `&` | `app.js:2281` | ⬜ Pending |

---

## ⚡ Next Action — Dev ต้องทำ

**Dev: แก้ B6 ก่อน (one-liner) แล้วจึง implement P7-4**

### B6 · เพิ่ม `esc()` ใน `renderDetail()` header
**File:** `app.js:2281`

**วิธีแก้:**
```js
// บรรทัดนี้:
${krCard.boardName} · ${krCard.listName}
// แก้เป็น:
${esc(krCard.boardName)} · ${esc(krCard.listName)}
```

### P7-4 · Project Board Convention Validator (ทำหลัง B6 เสร็จ)
**Files:** `server.js`, `public/app.js`

- ตรวจ list names ของแต่ละ board ว่ามี "Done" / "Backlog" / "In Progress" ครบหรือไม่
- แสดง ⚠ badge ใน Boards Monitor ถ้า board ไม่ครบ convention
- API endpoint: `GET /api/boards/:id/health` → `{ ok: bool, missing: string[] }`
- ดู AC ใน Active Tasks § P7-4 ด้านบน

เมื่อเสร็จแต่ละกลุ่ม: `git commit + git push`

---

## Key File Map
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | คำสั่ง |
|---|---|
| Trello card fetch shape | `Grep("getCards\|fields=", "trello.js")` |
| `/api/all-cards` endpoint | `Grep("all-cards", "server.js")` |
| `/api/boards/cards` endpoint | `Grep("boards/cards", "server.js")` |
| All Tasks render / filter chips | `Grep("renderAllTasks\|filter-chip", "public/app.js")` |
| Sidebar nav items | `Grep("nav-item\|navigateTo", "public/index.html")` |
| Boards Monitor render | `Grep("renderBoardsMonitor", "public/app.js")` |

---

## Session Prompts (copy-paste ready)

### 🔨 Dev Session
```
คุณ Dev — อ้างอิง CURRENT_SPRINT.md เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)

ทำ P7-1 ให้เสร็จตาม AC ใน CURRENT_SPRINT.md
ดู ⚡ Next Action สำหรับลำดับและ key notes

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
| P6 Hardening & Polish | ✅ Done (2026-05-05) |
| **P7 OKR / Portfolio Layer** | **⬜ Current** |

*รายละเอียด P7 tasks เต็ม: ดู DEVELOPMENT_PLAN.md § PHASE 7*
