# Current Sprint — Trisilar Task Hub
**Phase 5 · Today Dashboard Enhanced**
**Started:** 2026-05-05 · **Status:** ⬜ In Progress

> **วิธีใช้ไฟล์นี้:**
> - Dev / QA / PM อ้างอิงไฟล์นี้เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)
> - PM อัปเดต DEVELOPMENT_PLAN.md progress tracker เมื่อ Phase เสร็จสมบูรณ์เท่านั้น

---

## Sprint Goal
เพิ่ม 3 section ใน Today Dashboard ให้ live: Pending Review count, Calendar events วันนี้, Quick Add → Trello จริง

---

## Completed This Sprint
*(PM check ✅ เมื่อ QA pass แล้ว)*

| Task | Status | Commit |
|---|---|---|
| P5-1 Wire review count | ⬜ Not started | — |
| P5-2 Calendar events section | ⬜ Not started | — |
| P5-3 Quick add → Trello | ⬜ Not started | — |

---

## Active Tasks

### P5-1 · Wire Pending Review Count to Today
**File:** `public/app.js`
**Functions to touch:** `showTodayPage()`, `renderTodayPage()`

**What to do:**
- Stat card "Pending Review" ดึงจาก `GET /api/reviews` แทน hardcode 0
- นับเฉพาะ tasks ที่ `status === "pending"`
- คลิก stat card → `navigateTo("review")`
- Section "Pending Review" ใน Today แสดง task cards (title, meeting source, diff badge)
- คลิก task card → navigate ไป review + expand session นั้น

**AC:**
- [ ] มี pending review tasks → stat card แสดงตัวเลขจริง (ไม่ใช่ 0)
- [ ] Section "Pending Review" แสดง task cards: title, meeting title, diff badge
- [ ] คลิก task card → นำไป Review Queue และ expand session นั้นอัตโนมัติ
- [ ] ไม่มี pending tasks → section ซ่อน (หรือแสดง empty state สั้นๆ)

---

### P5-2 · Today: Calendar Events Section
**File:** `public/app.js`
**Functions to touch:** `renderTodayPage()` หรือสร้าง helper ใหม่

**What to do:**
- ถ้า `CAL.status?.connected`: ดึง events วันนี้จาก `GET /api/calendar/events?start=<todayISO>&end=<tomorrowISO>`
- แสดง section "Today's Calendar" แบบ compact list (ไม่ใช่ full calendar)
- Format: `[เวลา]  ชื่อ event  [Open ↗]`
- ถ้า GCal ไม่ connected → section hidden ทั้งหมด

**AC:**
- [ ] GCal connected → section แสดง events วันนี้
- [ ] GCal ไม่ connected → section ไม่โชว์เลย
- [ ] แต่ละ event แสดง: time range, title, ปุ่ม Open ที่คลิกแล้ว scroll ไปที่ Calendar page

---

### P5-3 · Today: Quick Add → Trello
**File:** `public/app.js`
**Functions to touch:** quick-add input handler ใน `renderTodayPage()`

**What to do:**
- ปัจจุบัน quick-add เรียก `openNewCard()` โดยตรง ซึ่ง fail ถ้าไม่มี currentBoardId
- แก้: เมื่อ type + Enter → แสดง mini inline-select: board → list → [Add]
- เมื่อ confirm → สร้าง card + due = today → `S.allCardsCache = null` → re-render Today

**AC:**
- [ ] Quick add input + Enter → mini board/list selector โผล่ inline (ไม่ใช่ modal เต็ม)
- [ ] เลือก board → list dropdown อัปเดต → กด Add → card ถูกสร้าง
- [ ] หลัง create → Today page refresh แสดง card ใหม่ใน "Due Today"
- [ ] ถ้า dismiss selector โดยไม่ add → input ยังคงค่าเดิม

---

## QA Log
*(PM บันทึกผล QA แต่ละรอบ)*

| Date | Round | Result | Notes |
|---|---|---|---|
| 2026-05-05 | QA Pass 1 (pre-impl) | ⚠ Not started | P5-1,2,3 ยังไม่มีโค้ด — 8 missing implementations พบ, 0 regression bugs |

## Bug Fixes This Sprint
*(PM เพิ่มที่นี่เมื่อ QA พบ bug ใน code ที่ implement แล้ว)*

*ยังไม่มี — QA Pass 1 พบว่ายังไม่มีการ implement ใดๆ ใน Phase 5*

---

## ⚡ Next Action — Dev ต้องทำ

**Dev: implement P5-1 → P5-2 → P5-3 ตามลำดับ (1 session)**

ลำดับที่แนะนำ:
1. **P5-1 ก่อน** — เพราะไม่ต้องการ async ใหม่, แค่เพิ่ม `api.get("/api/reviews")` ใน `showTodayPage()` และแก้ stat card + section
2. **P5-2 ต่อ** — เพิ่ม calendar section ใน `renderTodayPage()` โดยรับ events เป็น param
3. **P5-3 สุดท้าย** — แทนที่ `handleQuickAdd()` ด้วย inline board/list selector

**จุดที่ต้องระวัง (จาก QA):**
- P5-1: `showTodayPage()` ต้อง async แล้ว (ตรวจสอบ — มีแล้ว ✓) เพิ่มแค่ `api.get("/api/reviews")` ข้างใน
- P5-1: stat card `stat-review` ต้องมี `onclick` → `navigateTo("review")`  
- P5-2: `renderTodayPage()` ต้องรับ `calEvents` เป็น param เพิ่ม — `showTodayPage()` fetch แล้วส่งเข้าไป
- P5-3: อย่าล้าง `input.value` ก่อน user confirm — ล้างหลัง card ถูกสร้างสำเร็จเท่านั้น
- P5-3: ต้อง `S.allCardsCache = null` หลัง create card แล้ว call `showTodayPage()`

---

## Key File Map
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | คำสั่ง |
|---|---|
| `showTodayPage` / `renderTodayPage` | `Grep("showTodayPage\|renderTodayPage", "public/app.js")` |
| Pending review section ปัจจุบัน | `Grep("pending.*review\|Pending Review", "public/app.js", -i)` |
| `CAL.status` usage | `Grep("CAL\.status", "public/app.js")` |
| Quick-add input handler | `Grep("quick-add\|quickAdd\|today-quick", "public/app.js")` |
| `GET /api/reviews` call ที่มีอยู่ | `Grep("/api/reviews", "public/app.js")` |

---

## Session Prompts (copy-paste ready)

### 🔨 Dev Session
```
คุณ Dev — อ้างอิง CURRENT_SPRINT.md เท่านั้น (ไม่ต้องอ่าน DEVELOPMENT_PLAN.md)

ทำ [P5-1 / P5-2 / P5-3] ให้เสร็จตาม Acceptance Criteria

กฎการอ่านไฟล์:
- ใช้ Grep หา function/line ที่ต้องแก้ก่อน
- Read ด้วย offset+limit เฉพาะส่วนที่ต้องการ (ไม่อ่านทั้งไฟล์)
- อย่าอ่าน DEVELOPMENT_PLAN.md

เมื่อเสร็จ: git commit + git push อธิบายสิ่งที่ทำ
```

### 🔍 QA Session
```
คุณ QA Tester — อ้างอิง CURRENT_SPRINT.md เท่านั้น

ตรวจสอบ task ที่ Dev เพิ่งทำ (ดู git log --oneline -3 เพื่อรู้ว่า commit ล่าสุดทำอะไร)
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
| **P5 Today Enhanced** | **⬜ Current** |
| P6 Hardening & Polish | ⬜ Next |
| P7 OKR / Portfolio Layer | ⬜ Post-MVP |

*รายละเอียด P6/P7 tasks: ดู DEVELOPMENT_PLAN.md § PHASE 6 และ § PHASE 7*
