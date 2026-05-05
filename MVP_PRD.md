# Trisilar Task Hub MVP PRD

เอกสารนี้สรุป Product Requirement สำหรับ MVP ของ Trisilar Task Hub โดยอ้างอิงจากโค้ดปัจจุบันในโปรเจ็คและเอกสารแนวคิด `TRISILAR AUTOMATION SYSTEM - System Architecture & Design Overview v1.0`

## 1. Product Vision

Trisilar Task Hub คือศูนย์กลางจัดการงานของทีมที่ช่วยเปลี่ยนข้อมูลจาก Trello, Google Calendar, Google Tasks และผลลัพธ์จาก AI ให้กลายเป็นหน้าทำงานประจำวันที่เข้าใจง่าย ตรวจสอบได้ และลดงานซ้ำของทีม

เป้าหมายของ MVP ไม่ใช่การสร้างระบบ automation เต็มรูปแบบทันที แต่คือการสร้าง dashboard ที่ทีมใช้ได้จริงทุกวัน พร้อมพื้นที่ Human Review สำหรับตรวจ task ก่อนส่งต่อไปยัง Trello, Calendar และ Tasks

## 2. MVP Objective

สร้างประสบการณ์ใช้งานที่ช่วยให้ผู้ใช้:

- เห็นงานสำคัญของวันนี้และงานที่ค้างอยู่ทันทีเมื่อเปิดระบบ
- จัดการ Trello cards แบบข้าม board ได้ง่าย โดยไม่ต้องจำว่า task อยู่ board ไหน
- ตรวจสอบและแก้ไข task ที่ AI สกัดจาก meeting transcript ก่อน approve
- ซิงก์ deadline สำคัญไป Google Calendar อย่างควบคุมได้
- เตรียมโครง UI ให้ต่อยอด Google Tasks Daily Planner และ OKR Progress View ได้ในเฟสถัดไป

## 3. Current Codebase Snapshot

สถานะของโปรเจ็คปัจจุบัน:

- Backend เป็น Node.js + Express ใน `server.js`
- Trello integration อยู่ใน `trello.js`
- AI CLI assistant อยู่ใน `index.js` โดยใช้ Gemini function calling กับ Trello tools
- Frontend เป็น static HTML/CSS/JavaScript ใน `public/`
- Config เก็บเป็น JSON local file เช่น `bu-config.json` และ `card-events.json`
- ฟีเจอร์ที่มีแล้ว: board view, BU group view, all tasks view, card CRUD, checklist, drag and drop, Google Calendar OAuth, Calendar view, Trello-to-Calendar sync
- ฟีเจอร์ที่ยังไม่มีตามเอกสาร architecture: Human Review UI สำหรับ AI Meeting Engine, Task Diff, Google Tasks Daily Planner, OKR Advisor AI, OKR Progress Feedback Loop, Daily/Weekly Digest automation

## 4. MVP Scope

### In Scope

- Dashboard home ที่สรุปงานวันนี้, overdue, upcoming และ quick actions
- Kanban board view ที่ปรับให้ใช้ง่ายขึ้นและลด visual noise
- All Tasks view ที่เป็น task inbox ข้าม board พร้อม filter/sort/search
- Human Review Queue สำหรับ meeting tasks ที่ AI extract มา
- Task Diff state: create new, update existing, possible duplicate
- Review actions: approve, edit, reject, approve all selected
- Trello card create/update หลังผ่าน approval
- Google Calendar push แบบผู้ใช้ควบคุมได้ต่อ task
- Google Tasks Daily Planner โครง MVP สำหรับดูและเพิ่ม daily task
- Settings สำหรับ workspace, visible boards, BU groups และ integration status
- Empty/loading/error states ที่อ่านง่ายและแนะนำ action ถัดไป

### Out of Scope for MVP

- Discord Whisper Bot แบบ production
- AI transcript processing แบบสมบูรณ์ end-to-end
- OKR Advisor AI ที่สร้าง project board อัตโนมัติเต็มระบบ
- Progress feedback loop จาก sub-task ไป OKR card
- Weekly digest automation แบบ scheduled production
- Multi-user permission, role-based access control, audit log
- Database layer แยกจาก Trello

## 5. Primary Users

### Operations Lead

ต้องการเห็นภาพรวมงานทุกโปรเจ็ค, overdue, owner, deadline และความเสี่ยง เพื่อจัดลำดับงานรายวัน

### Project Owner

ต้องการดู board ของโปรเจ็คตัวเอง, อัปเดต card, checklist, deadline และ sync calendar โดยไม่หลุดจาก workflow เดิมใน Trello

### Meeting Reviewer

ต้องการตรวจ task ที่ AI สกัดจาก meeting transcript อย่างรวดเร็ว แก้ owner/deadline/project ก่อนส่งไป Trello

## 6. UX Principles for Redesign

- Start from daily decision: หน้าแรกต้องตอบว่า “วันนี้ต้องทำอะไร” ก่อนแสดงโครงสร้าง board
- Review before automation: งานจาก AI ต้องอยู่ใน review queue ก่อน push ไป integration
- One task, one clear next action: แต่ละ card/task ต้องมี action ที่ชัด เช่น review, schedule, mark done, open in Trello
- Reduce board hunting: ผู้ใช้ไม่ควรต้องจำว่า task อยู่ board/list ไหน
- Show confidence and risk: งานที่ AI สร้างควรมี confidence, duplicate warning, missing owner/deadline
- Make integrations visible but calm: สถานะ Trello/Calendar/Tasks ควรเห็นง่าย แต่ไม่แย่ง attention จากงาน
- Prefer progressive disclosure: รายละเอียด card, checklist, raw transcript และ diff เปิดดูเมื่อจำเป็น

## 7. Proposed MVP Navigation

### 1. Today

หน้าแรกของระบบ แสดง:

- Today focus: งาน due วันนี้
- Overdue: งานที่เลยกำหนด
- Upcoming: งาน 7 วันถัดไป
- Pending Review: task จาก meeting ที่ยังไม่ approve
- Calendar conflicts หรือ deadline สำคัญ
- Quick add daily task

### 2. Review Queue

หน้าตรวจงานจาก AI Meeting Engine:

- Meeting summary
- Extracted tasks list
- Task diff badge: Create New, Update Existing, Possible Duplicate
- Editable fields: title, description, owner, deadline, board, list, priority, calendar sync, Google Tasks sync
- Bulk approve/reject
- Raw transcript side panel

### 3. Tasks

Inbox รวมงานข้าม board:

- Search by title/project/owner
- Filters: Today, Overdue, Upcoming, No Due, Done, Pending Review
- Group by: due date, board, BU, owner, status
- Table/list layout optimized for scanning
- Inline actions: mark done, edit due, open details

### 4. Boards

Kanban view:

- Sidebar board/BU selection
- Compact list columns
- Card preview with due, checklist progress, source, calendar status
- Drag and drop
- Add/edit card modal

### 5. Calendar

Calendar view:

- Google Calendar events + Trello due/start dates
- Board filters
- Create/edit event
- Open linked Trello card
- Clear distinction between calendar events and Trello deadlines

### 6. Planner

Google Tasks Daily Planner MVP:

- Today tasks from Google Tasks
- Trello tasks due today/tomorrow
- Manual daily task input
- Mark complete and sync back

### 7. Settings

Configuration:

- Trello workspace visibility
- BU groups
- Hidden boards
- Google Calendar connection
- Google Tasks connection placeholder
- AI provider/config placeholder

## 8. Core User Flows

### Flow A: Daily Work Start

1. User opens Trisilar Task Hub
2. Today page shows overdue, today, upcoming, and pending review
3. User marks quick tasks done, opens important card, or schedules calendar event
4. User moves to Review Queue if AI tasks are waiting

Acceptance criteria:

- User can understand top priorities within 10 seconds
- Overdue and today tasks are visible without selecting a board
- Empty state explains what to connect or configure next

### Flow B: Review AI Meeting Tasks

1. System receives meeting summary and extracted tasks
2. Review Queue displays extracted tasks with diff status
3. User edits task details if needed
4. User approves selected tasks
5. Approved tasks create/update Trello cards and optionally push to Calendar/Tasks

Acceptance criteria:

- No AI task is pushed without approval
- Create/update/duplicate state is visible before approval
- User can edit owner, deadline, project/board/list before approve
- Rejected tasks remain auditable in the review session until dismissed

### Flow C: Create or Edit Manual Task

1. User clicks add task/card
2. User enters title, description, start date, due date, reminder, target board/list
3. User chooses whether to sync to Calendar
4. System creates/updates Trello card

Acceptance criteria:

- User can clear due/start dates on edit
- Calendar sync is explicit, not surprising
- Validation explains missing required fields clearly

### Flow D: Use Calendar as Planning View

1. User opens Calendar
2. System shows Google Calendar events and Trello due/start cards
3. User filters by board
4. User opens card/event details from calendar item

Acceptance criteria:

- Trello deadlines and Google events are visually distinct
- Calendar does not show hidden boards by default
- Clicking an item opens the right editor

## 9. Data Model for MVP

### Review Task

```json
{
  "id": "review_task_id",
  "meetingId": "meeting_id",
  "title": "Prepare campaign brief",
  "description": "Context from meeting",
  "owner": "Name or Trello member ID",
  "deadline": "2026-05-06T10:00:00.000Z",
  "priority": "high",
  "projectReference": "Project/Card reference",
  "targetBoardId": "trello_board_id",
  "targetListId": "trello_list_id",
  "diffStatus": "create_new | update_existing | possible_duplicate",
  "matchedCardId": "trello_card_id",
  "confidence": 0.82,
  "syncCalendar": true,
  "syncGoogleTasks": false,
  "status": "pending | approved | rejected"
}
```

### Meeting Review Session

```json
{
  "id": "meeting_id",
  "title": "Weekly Marketing Sync",
  "source": "discord | manual_upload",
  "summary": "Meeting summary",
  "transcript": "Raw transcript",
  "createdAt": "2026-05-01T09:00:00.000Z",
  "tasks": []
}
```

## 10. API Requirements

### Existing APIs to Keep

- `GET /api/workspaces`
- `GET /api/boards`
- `GET /api/boards/:id/lists`
- `GET /api/lists/:id/cards`
- `POST /api/cards`
- `PUT /api/cards/:id`
- `PUT /api/cards/:id/move`
- `DELETE /api/cards/:id`
- `GET /api/all-cards`
- `GET /api/calendar/status`
- `GET /api/calendar/events`
- `POST /api/calendar/events`

### New MVP APIs

- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/reviews/:id`
- `PUT /api/reviews/:id/tasks/:taskId`
- `POST /api/reviews/:id/approve`
- `POST /api/reviews/:id/reject`
- `POST /api/task-diff`
- `GET /api/today`
- `GET /api/google-tasks/status`
- `GET /api/google-tasks/today`
- `POST /api/google-tasks`
- `PUT /api/google-tasks/:id`

## 11. UI Design Brief for Claude Design

Design a user-friendly productivity dashboard for Trisilar Task Hub.

The product is an internal operations tool, not a marketing site. It should feel calm, fast, trustworthy, and built for daily use. Prioritize clarity, scanability, and confidence when approving AI-generated tasks.

Required screens:

- Today dashboard
- Review Queue
- Task Inbox
- Board/Kanban view
- Calendar view
- Daily Planner
- Settings

Visual direction:

- Clean workspace UI with restrained colors
- Avoid decorative hero sections
- Use compact but readable information density
- Use clear status chips for overdue, due today, upcoming, pending review, approved, rejected
- Use icons for repeated actions such as edit, approve, reject, calendar, open Trello, sync
- Make primary actions obvious and secondary actions quieter
- Design modals/drawers for editing task details without losing context
- Make mobile/tablet layout usable for checking today tasks and approving simple items

Important UX details:

- Today page is the first screen
- Pending Review should be prominent but not alarming
- Review Queue must show why AI thinks a task should create or update a Trello card
- Calendar sync must be visible as a per-task option
- Hidden boards should stay hidden across Today, Tasks, and Calendar
- Loading/error/empty states must be designed, not left as plain text

## 12. Code Review Findings to Address Before/With MVP

### High Priority

- Editing a card cannot clear due/start dates because the frontend only sends `due` and `start` when the fields have values. This makes deadline cleanup unreliable.
- `All Tasks` currently fetches all Trello boards directly and does not honor hidden boards or allowed workspaces. This can surface irrelevant or intentionally hidden work.
- Calendar sync is automatic after card create/update when a due date exists, while the UI shows a Calendar sync concept but does not actually let the user control it.
- Google credentials are accepted through query parameters and written to `.env`, which is risky even for local MVP because secrets can appear in browser history or logs.

### Medium Priority

- Frontend is a single large `app.js`, which makes future Review Queue, Planner, and OKR UI harder to maintain.
- Config and card-event mappings are local JSON files without concurrency protection or validation.
- API responses expose raw Trello/Google errors directly to the UI.
- There is no automated test script; `npm test` currently exits with an error placeholder.
- `node_modules` is present in the project folder and should be excluded from source review/version control.

## 13. Success Metrics

- User can identify today’s top work within 10 seconds
- User can approve or reject a meeting-extracted task in under 30 seconds
- At least 90 percent of approved AI tasks contain board/list/deadline before push
- Hidden boards do not appear in Today, Tasks, or Calendar by default
- Manual card create/edit flow has no surprise Calendar sync
- Calendar and Trello views show consistent deadlines

## 14. Recommended MVP Build Order

1. Fix existing task/card reliability issues: clear due/start, hidden-board filtering, explicit Calendar sync
2. Add Today dashboard backed by Trello data
3. Add Review Queue data model and static/manual review session creation
4. Add Task Diff logic against Trello cards
5. Add approve/reject flow that creates/updates Trello cards
6. Add Google Tasks Daily Planner
7. Refactor frontend into modules once Review Queue and Today page are introduced
8. Add OKR Progress View as post-MVP module

## 15. Open Questions

- จะใช้ Trello member ID เป็น owner หลัก หรือใช้ชื่อ text ก่อนใน MVP?
- Meeting transcript จะเข้าระบบผ่าน Discord bot, manual paste, หรือ file upload ใน MVP แรก?
- Google Tasks ต้องเป็น two-way sync ตั้งแต่ MVP หรือเริ่มจาก push/read-only ก่อน?
- OKR board มี naming convention ของ lists/cards ที่แน่นอนแล้วหรือยัง?
- ต้องการให้ระบบรองรับผู้ใช้หลายคนในเครื่องเดียวกันหรือยังเป็น local/internal single-user tool?
