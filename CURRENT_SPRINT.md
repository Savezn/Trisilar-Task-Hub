# Current Sprint — Trisilar Task Hub
**Phase 8 · Post-MVP Enhancements**
**Started:** 2026-05-05 · **Status:** 🟡 In Progress

> **วิธีใช้ไฟล์นี้:**
> - Dev / QA / PM อ้างอิงไฟล์นี้เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)
> - PM อัปเดต DEVELOPMENT_PLAN.md progress tracker เมื่อ Phase เสร็จสมบูรณ์เท่านั้น

---

## 🎉 MVP Roadmap Complete

Phase 7 เสร็จสมบูรณ์ (2026-05-05) — MVP roadmap ทุก Phase ผ่าน QA แล้ว:

| Phase | Completed |
|---|---|
| P0 Bug Fixes | ✅ 2026-05-04 |
| P1 Review Queue Data | ✅ 2026-05-04 |
| P2 Review Queue UI | ✅ 2026-05-04 |
| P3 Task Diff Engine | ✅ 2026-05-04 |
| P4 Google Tasks Planner | ✅ 2026-05-05 |
| P5 Today Enhanced | ✅ 2026-05-05 |
| P6 Hardening & Polish | ✅ 2026-05-05 |
| P7 OKR / Portfolio Layer | ✅ 2026-05-05 |

---

## Sprint Goal
ยกระดับระบบหลัง MVP — เพิ่มความเสถียร, UX improvements, และ features ที่ถูก defer ระหว่าง Phase 1–7

---

## Completed This Sprint
*(PM check ✅ เมื่อ QA pass แล้ว)*

| Task | Status | Commit |
|---|---|---|
| B7 — Restart server (P7-4 health route) | ✅ Done | ops — no commit |
| B8 — Calendar graceful degradation `.catch(()=>[])` | ✅ Done | `d9ce8b1` |
| P8-1 — Notification & Alert System | ✅ Done | `d9ce8b1` |

---

## Active Tasks

### P8-1 · Notification & Alert System
**Priority:** 🟡 Medium
**Files:** `server.js`, `public/app.js`, `public/style.css`

**What to do:**
- เพิ่ม toast/alert สำหรับ card ที่ overdue เกิน 3 วัน — แสดง once per session
- Badge count บน browser tab title: `(N) Trisilar Task Hub` เมื่อมี overdue > 0
- Optional: desktop notification permission prompt (Web Notifications API)

**AC:**
- [x] Tab title อัปเดตเป็น `(N) Trisilar Task Hub` เมื่อ overdue cards > 0
- [x] Toast แสดงครั้งเดียวต่อ session เมื่อ overdue cards > 3
- [x] Toast dismiss ได้ด้วย ✕ หรือ click away

---

### P8-2 · Card Quick-Edit Inline
**Priority:** 🟡 Medium
**Files:** `public/app.js`, `public/style.css`

**What to do:**
- ใน All Tasks view — ดับเบิลคลิกที่ชื่อ task เพื่อ edit inline (rename)
- ใน Today view — inline date picker สำหรับ overdue tasks (reschedule)
- Save on Enter / blur; Cancel on Escape

**AC:**
- [ ] Double-click card name ใน All Tasks → editable input แทนที่
- [ ] Enter → save ชื่อใหม่ผ่าน Trello API → refresh view
- [ ] Escape → ยกเลิก ไม่เปลี่ยนแปลงอะไร
- [ ] Inline date picker สำหรับ overdue cards ใน Today view

---

### P8-3 · Export / Report
**Priority:** ⚪ Low
**Files:** `server.js`, `public/app.js`

**What to do:**
- เพิ่ม button "Export CSV" ใน All Tasks view — export cards ที่กรองอยู่เป็น CSV
- Field: Title, Board, List, Owner, Due Date, Labels, Status

**AC:**
- [ ] "Export CSV" button ใน All Tasks header
- [ ] CSV มี columns: Title, Board, List, Owner, Due Date, Labels, Status
- [ ] Export เฉพาะ cards ที่กรองอยู่ (ตาม filter chips + group by ที่ active)
- [ ] Filename: `trisilar-tasks-YYYY-MM-DD.csv`

---

### P8-4 · Performance — Virtual Scroll
**Priority:** ⚪ Low (defer ถ้า board count < 10)
**Files:** `public/app.js`, `public/style.css`

**What to do:**
- All Tasks view: ถ้า cards > 200 ให้ใช้ windowed render (แสดง 50 ต่อหน้า + pagination)
- Boards Monitor: lazy-fetch health เฉพาะ boards ที่ visible ใน viewport

**AC:**
- [ ] All Tasks แสดง pagination เมื่อ cards > 200
- [ ] Page size 50, navigation next/prev + page number
- [ ] Boards Monitor health fetch เฉพาะ boards ที่อยู่ใน viewport (IntersectionObserver)

---

### P8-5 · OKR Board Setup Guide
**Priority:** ⚪ Low
**Files:** `public/app.js`, `public/style.css`

**What to do:**
- ขยาย OKR empty state — เพิ่ม step-by-step guide แบบ interactive
- Step 1: สร้าง Trello board ชื่อ "OKR Board"
- Step 2: สร้าง lists ชื่อ Objective 1, Objective 2, …
- Step 3: สร้าง cards ชื่อ KR1.1, KR1.2 ใต้ objective
- Step 4: ใส่ label เดียวกันกับ project boards เพื่อ link

**AC:**
- [ ] Empty state มี accordion steps guide
- [ ] แต่ละ step มี icon + description + link ไป Trello (ถ้ามี)
- [ ] "Refresh" button เพื่อ re-check หลัง user ตั้งค่าเสร็จ

---

## QA Log
*(PM บันทึกผล QA แต่ละรอบ)*

| Date | Round | Result | Notes |
|---|---|---|---|
| 2026-05-05 | E2E Full MVP Test (P0–P7) | 🟡 2 Bugs | ทุก view โหลดได้ · Trello data ถูกต้อง · พบ B7 (health endpoint 404 — server ไม่ restart) + B8 (Calendar blank เมื่อ GCal fail) · GCal/GTasks "invalid_client" เป็น env credentials issue ไม่ใช่ code bug |

## Bug Fixes This Sprint
*(PM เพิ่มที่นี่เมื่อ QA พบ bug ใน code ที่ implement แล้ว)*

| ID | Bug | File:Line | Status |
|---|---|---|---|
| B7 | `GET /api/boards/:id/health` คืน 404 — server process (PID 33628) start ก่อน P7-4 commit `a84312e` (09:13 vs 15:35) → route ไม่ได้ register → convention badges ไม่แสดงเลย · frontend `.catch(()=>({ok:true}))` ซ่อน error ไว้ | `server.js:177` (code ถูก — ต้อง restart server เท่านั้น) | ✅ Done (2026-05-06) |
| B8 | Calendar view ว่างสนิทเมื่อ GCal API fail — `Promise.all([gcalEvents, trelloData])` ไม่มี `.catch()` บน gcalEvents → reject ทั้งคู่ → Trello deadlines หายไปด้วยทั้งที่ไม่เกี่ยวกับ GCal | `app.js:3130` — เพิ่ม `.catch(()=>[])` | ✅ Done `d9ce8b1` |

---

## ⚡ Next Action — Dev ต้องทำ

**B7 ✅ · B8 ✅ · P8-1 ✅ — เริ่ม P8-2 ได้เลย**

---

### 🟡 P8-2 · Card Quick-Edit Inline

ดู Active Tasks § P8-2 สำหรับ AC ครบถ้วน

**จุดระวัง:**
- All Tasks view: `renderAllTasks()` สร้าง card rows — ต้องเพิ่ม `ondblclick` บนชื่อ card
- Double-click → แทนที่ text node ด้วย `<input>` ที่ focus ทันที
- Enter / blur → call `api.put("/api/cards/:id", { name })` → `refreshCurrentView()`
- Escape → คืน original text ไม่ call API
- Today view inline date picker: หา overdue cards ใน `showTodayPage()` → เพิ่ม date input ใต้ card name
- Date change → call `api.put("/api/cards/:id", { due: newDate })` → refresh

**Grep เริ่มต้น:**
```
Grep("renderAllTasks", "public/app.js")       → หา function หลัก
Grep("due-border-overdue\|overdue.*card", "public/app.js") → หา overdue cards ใน Today
```

เมื่อเสร็จ: `git commit + git push`

---

## Key File Map
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | คำสั่ง |
|---|---|
| showToast function | `Grep("showToast", "public/app.js")` |
| renderAllTasks function | `Grep("renderAllTasks", "public/app.js")` |
| refreshCurrentView | `Grep("refreshCurrentView", "public/app.js")` |
| Today view render | `Grep("renderToday\|showToday", "public/app.js")` |
| S global state object | `Grep("const S =\|^const S", "public/app.js")` |

---

## Session Prompts (copy-paste ready)

### 🔨 Dev Session
```
คุณ Dev — อ้างอิง CURRENT_SPRINT.md เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)

ทำ P8-1 (หรือ P8-2) ให้เสร็จตาม AC ใน CURRENT_SPRINT.md
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
| P7 OKR / Portfolio Layer | ✅ Done (2026-05-05) |
| **P8 Post-MVP Enhancements** | **⬜ Current** |

*รายละเอียด: ดู Active Tasks ด้านบน*
