# Version 0.1 Plan - Trisilar Task Hub

**Doc Role:** Archived version plan
**Status:** Archived - V0.1 Release Acceptance passed on 2026-05-08
**Version:** V0.1
**Planning Stage:** Completed / archived
**Owner:** PM
**Created:** 2026-05-06
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
**Related Docs:** `../reference/ARCHITECTURE_ANALYSIS.md`, `../../CURRENT_SPRINT.md`, `../../DEVELOPMENT_PLAN.md`
**Theme:** Keep the app local-first and useful, but split the monolith into clear modules so future features can be added without breaking existing workflows.

---

## How to Use This Document

- Use as historical reference for V0.1 modularization decisions.
- Do not use this as the active prompt source; use `../../CURRENT_SPRINT.md` for active work.
- Preserve completed planning history; update only when correcting references or archival metadata.

---

## Planning Summary

แปลง working monolith ให้เป็น **modular local-first app** โดยไม่ rewrite และไม่ทำให้ functionality เดิมพัง

---

## Scope / Non-Goals

**ห้ามทำใน V0.1:**
- ❌ Rewrite ทั้ง frontend หรือ backend
- ❌ Framework migration (React, Vue, etc.)
- ❌ Production deployment / SaaS infrastructure
- ❌ Multi-user auth
- ❌ Full test coverage

---

## Dependency / Workflow Model

### Prerequisites - แก้ก่อน (P9 Bugs)

| ID | Bug | Priority | Status |
|---|---|---|---|
| B19 | Cold start rate limit — ⚠ Trello rate limit ทุกครั้งที่ server เพิ่ง start | 🔴 High | ⬜ Pending |

→ **B19 ต้องแก้ก่อน Version 0.1 เริ่ม** เพราะถ้า app ใช้ไม่ได้ตั้งแต่เปิดมา การ refactor ทำได้ยาก

---

## Workstream / Phase Map

| Phase | Name | Priority | Status |
|---|---|---|---|
| V0.1-Ph1 | Foundation Scripts & Smoke Test | 🔴 P0 | ⬜ |
| V0.1-Ph2 | Backend Route Split | 🔴 P0 | ⬜ |
| V0.1-Ph3 | Backend Service Split | 🔴 P0 | ⬜ |
| V0.1-Ph4 | Frontend Core Split (api / state / router / utils) | 🔴 P0 | ⬜ |
| V0.1-Ph5 | Frontend Page Split | 🟡 P1 | ⬜ |
| V0.1-Ph6 | Code Quality (mojibake + config validation) | 🟡 P1 | ⬜ |
| V0.1-Ph7 | SQLite Migration | ⚪ P2 | ⬜ |

---

## Workstream / Phase Details

---

### V0.1-Ph1 · Foundation Scripts & Smoke Test
**Priority:** 🔴 P0 — ทำก่อนทุก phase  
**Files:** `package.json`, `scripts/smoke-test.js`

**Why:**
- Dev และ AI agents ต้องมี standard commands (`npm start`, `npm run smoke`)
- Smoke test เป็น safety net ก่อนแต่ละ refactor phase

**Tasks:**

**Ph1-1 — Update `package.json` scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "smoke": "node scripts/smoke-test.js"
  }
}
```

**Ph1-2 — สร้าง `scripts/smoke-test.js`:**
- `GET /` → 200
- `GET /api/config` → 200 + JSON
- `GET /api/calendar/status` → 200
- `GET /api/reviews` → 200

ไม่ต้องมี assertions ซับซ้อน — แค่ "server ตอบกลับและไม่ crash"

**AC:**
- [ ] `npm start` รัน server ได้
- [ ] `npm run smoke` รันได้และ print PASS/FAIL ต่อแต่ละ endpoint
- [ ] ถ้า endpoint ใด fail → exit code 1

---

### V0.1-Ph2 · Backend Route Split
**Priority:** 🔴 P0  
**Files:** `server.js` → `src/routes/*.routes.js`

**Target structure:**
```
src/routes/
  config.routes.js        ← GET/POST /api/config, workspace, board visibility
  trello.routes.js        ← GET /api/boards, /api/all-cards, cards CRUD, move
  calendar.routes.js      ← /api/calendar/*, /api/sync-calendar
  google-tasks.routes.js  ← /api/google-tasks/*
  review.routes.js        ← /api/reviews/*, /api/task-diff
```

**Rules:**
- ย้ายเฉพาะ route handlers — ไม่เปลี่ยน URL หรือ response shape
- Cache logic (`cacheGet/cacheSet/cacheInvalidate`) ยังอยู่ใน `server.js` ชั่วคราว (ย้ายใน Ph3)
- `server.js` กลายเป็น thin entry point: `app.use("/api", trelloRoutes); ...`

**AC:**
- [ ] Endpoint URLs เหมือนเดิมทุกตัว
- [ ] `npm run smoke` pass หลัง split
- [ ] `node server.js` ยังรันได้

**Extract order (ทำทีละ route file, commit ทีละตัว):**
1. `config.routes.js`
2. `review.routes.js`
3. `calendar.routes.js`
4. `google-tasks.routes.js`
5. `trello.routes.js` (ใหญ่สุด — ทำสุดท้าย)

---

### V0.1-Ph3 · Backend Service Split
**Priority:** 🔴 P0  
**Files:** `src/routes/*.routes.js` → `src/services/*.service.js`, `src/domain/`

**Target structure:**
```
src/services/
  cache.service.js        ← _cache, cacheGet, cacheSet, cacheInvalidate
  config.service.js       ← read/write bu-config.json
  calendar.service.js     ← Google Calendar operations
  google-tasks.service.js ← Google Tasks operations

src/domain/
  normalize-card.js       ← normalizeCard() จาก server.js
  task-diff.js            ← ย้ายจาก root (ถ้าเหมาะ)
```

**AC:**
- [ ] Routes ไม่มี file I/O logic โดยตรง — เรียกผ่าน service
- [ ] `npm run smoke` pass
- [ ] `node server.js` ยังรันได้

---

### V0.1-Ph4 · Frontend Core Split
**Priority:** 🔴 P0  
**Files:** `public/app.js` → `public/js/api.js`, `state.js`, `router.js`, `utils.js`

**Why first:** API client และ state เป็น foundation ที่ page modules อื่นจะ depend on

**Target structure:**
```
public/js/
  api.js      ← api object (get/post/put/delete helpers)
  state.js    ← S global state object + helpers
  router.js   ← showPage(), nav click handlers, URL hash routing
  utils.js    ← esc(), $(), debounce(), formatDate(), etc.
```

**Rules:**
- `public/index.html` ต้อง load ไฟล์ใหม่เหล่านี้ก่อน `app.js`
- `app.js` ยังมี page renderers ทั้งหมดชั่วคราว (ย้ายใน Ph5)
- ไม่ใช้ bundler — ใช้ `<script src="...">` ธรรมดา

**AC:**
- [ ] Navigation ยังทำงานได้ครบ
- [ ] Today, All Tasks, Settings โหลดได้
- [ ] Create/edit card ยังทำงานได้
- [ ] Manual browser check หลัง split

---

### V0.1-Ph5 · Frontend Page Split
**Priority:** 🟡 P1  
**Files:** `public/app.js` → `public/js/pages/*.js`

**Extract order (ทีละ page, commit ทีละตัว):**

| Page | File | Size estimate |
|---|---|---|
| Today | `pages/today.js` | Medium |
| All Tasks | `pages/all-tasks.js` | Large |
| Boards | `pages/boards.js` | Large |
| Review Queue | `pages/review.js` | Large |
| Calendar | `pages/calendar.js` | Medium |
| OKR | `pages/okr.js` | Medium |
| Weekly Focus | `pages/weekly-focus.js` | Medium |
| Planner | `pages/planner.js` | Small |
| Settings | `pages/settings.js` | Small |

**Rules:**
- ย้ายทีละ 1 page ต่อ Dev session
- Manual browser check หลังแต่ละ page
- `app.js` ลดขนาดลงเรื่อยๆ จนเหลือแค่ bootstrap logic

**AC per page:**
- [ ] Page โหลดและแสดงข้อมูลได้
- [ ] Interactions ทำงานได้ (click, filter, edit)
- [ ] ไม่มี console errors ใหม่

---

### V0.1-Ph6 · Code Quality
**Priority:** 🟡 P1  
**Files:** touched files เท่านั้น

**Tasks:**

**Ph6-1 — Clean mojibake encoding:**
- แก้ Thai text ที่ corrupted ใน comments ของไฟล์ที่ถูกแตะใน Ph1-Ph5
- ไม่แก้ไฟล์ที่ไม่ได้แตะ (avoid churn)

**Ph6-2 — Config validation layer:**
- เพิ่ม validation ใน `config.service.js` สำหรับ `bu-config.json`
- Log warning ถ้า config field ขาดหายไป — ไม่ crash

**AC:**
- [ ] ไม่มี mojibake ในไฟล์ที่แตะ
- [ ] Server start ด้วย invalid/empty config → log warning แต่ไม่ crash

---

### V0.1-Ph7 · SQLite Migration
**Priority:** ⚪ P2 — ทำเมื่อ Ph1-Ph4 เสร็จแล้ว

**Scope:**
- ย้าย `bu-config.json`, `review-sessions.json`, `card-events.json` เข้า SQLite
- Startup migration: ถ้าไม่มี DB → import จาก JSON อัตโนมัติ
- เก็บ JSON backup ไว้

**Tables:**
```
app_config
review_sessions
review_tasks
card_calendar_events
```

**AC:**
- [ ] ทุก API endpoint ยังทำงานเหมือนเดิม
- [ ] Data จาก JSON ถูก migrate ครบเมื่อ start ครั้งแรก
- [ ] JSON backup files ยังอยู่
- [ ] `npm run smoke` pass

---

## Delivery Rules

1. **One file per session** — ย้ายทีละไฟล์ ไม่ทำ big bang
2. **Smoke test กัน regression** — รัน `npm run smoke` หลังทุก phase
3. **Manual browser check** — โดยเฉพาะหลัง frontend splits
4. **Keep Trello as source of truth** — ไม่ duplicate card data ลง local DB
5. **No bundler** — ยังใช้ plain `<script>` tags ไปก่อน (เพิ่มใน V0.2 ถ้าจำเป็น)
6. **Commit per extraction** — ไม่รวม multiple splits ใน 1 commit

---

## Session Estimate

| Phase | Dev Sessions | Notes |
|---|---|---|
| B19 fix | 1 | แก้ก่อน V0.1 |
| Ph1 | 1 | Scripts + smoke test |
| Ph2 | 5 | 1 route file per session |
| Ph3 | 1-2 | Services + domain |
| Ph4 | 1 | Frontend core split |
| Ph5 | 9 | 1 page per session |
| Ph6 | 1 | Quality pass |
| Ph7 | 2-3 | SQLite migration |
| **Total** | **~21-23 sessions** | |

---

## Next Recommended Session

Historical prompt templates from the V0.1 modularization plan are retained below for traceability.

### Dev: Backend Route Split (ใช้ซ้ำต่อแต่ละ route)

```
คุณ Dev — อ่าน docs/reference/ARCHITECTURE_ANALYSIS.md และ docs/archive/VERSION_0_1_PLAN.md ก่อน

Task: แยก [config/review/calendar/google-tasks/trello] routes ออกจาก server.js
Target: src/routes/[name].routes.js

Rules:
- ไม่เปลี่ยน URL หรือ response shape
- ไม่ย้าย cache helpers ออกจาก server.js ยัง
- รัน node server.js verify ว่าไม่ crash
- Commit: "V0.1-Ph2: extract [name] routes"
```

### Dev: Frontend Page Split (ใช้ซ้ำต่อแต่ละ page)

```
คุณ Dev — อ่าน docs/reference/ARCHITECTURE_ANALYSIS.md และ docs/archive/VERSION_0_1_PLAN.md ก่อน

Task: แยก [page name] page renderer ออกจาก app.js
Target: public/js/pages/[page].js

Rules:
- page ต้อง depend on public/js/api.js, state.js, utils.js (load แล้วใน index.html)
- เพิ่ม <script> tag ใน index.html
- ไม่ย้าย page อื่นในการ session นี้
- Commit: "V0.1-Ph5: extract [page] page module"
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-06 | Created V0.1 modularization plan | PM |
| 2026-05-08 | Archived after V0.1 Release Acceptance pass | Codex PM |
| 2026-05-08 | Standardized plan document format | Codex PM |

*แผนนี้ใช้ร่วมกับ docs/reference/ARCHITECTURE_ANALYSIS.md — อ่านทั้งคู่ก่อนเริ่ม phase ใหม่ทุกครั้ง*
