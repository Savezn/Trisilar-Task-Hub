# UI V2 Route Screen Specs - Trisilar Task Hub

**Doc Role:** Route-by-route screen and state specification for UI V2 concept work
**Status:** Draft design-only route specs
**Owner:** UX Owner / Frontend Design
**Created:** 2026-05-15
**Updated by:** Codex UX Owner / Frontend Design
**Related Docs:** `UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `CLAUDE_DESIGN_UI_V2_GUIDELINES.md`, `UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md`

---

## Scope

This document defines what each UI V2 concept screen must show. It is not a production implementation plan and does not authorize code changes.

Use this file to check route/component coverage after Claude Design produces concepts.

---

## Global Screen Contract

Every route concept should include:

- persistent app shell navigation
- route title and current scope
- refresh or status timestamp when route data can stale
- at least one meaningful empty state
- at least one disconnected or error state when the route depends on an integration
- stable mobile behavior
- visible source, owner, due/status, and next action where task decisions are involved

No route should expose secrets, raw auth headers, signing material, token values, private production data exports, or developer-only `.env` instructions.

---

## Route Matrix

| Route | Desktop concept | Mobile concept | State detail required | Priority |
|---|---:|---:|---:|---|
| Today | Required | Required | Required | P0 |
| Review Queue | Required | Required | Required | P0 |
| All Tasks | Required | Required | Required | P0 |
| Settings | Required | Required | Required | P0 |
| Docs / AI Trace | Required | Recommended | Required | P1 |
| Boards Monitor | Recommended | Optional summary | Required | P1 |
| Calendar | Recommended | Optional summary | Required | P1 |
| Planner | Recommended | Optional summary | Required | P1 |
| OKR / Portfolio | Recommended | Optional summary | Recommended | P2 |
| Weekly Focus | Recommended | Optional summary | Recommended | P2 |

---

## Today

### User Question

What matters today, what needs review, what is overdue, and can I trust the connected data?

### Required Regions

- Priority lane with 3 to 5 highest-action items.
- Review Queue pressure strip with pending count, oldest pending item, and action link.
- Due/overdue work list with source, owner, board/list, due status, and next action.
- Integration summary for Trello, Calendar, Google Tasks, and Paperclip.
- Optional weekly/context strip only if it does not push priority work below the first viewport.

### Primary Components

- App shell
- Route command bar
- Priority row
- Task row
- Review pressure strip
- Integration status row
- Empty state
- Disconnected state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Priority work appears first; each item shows source, owner, due/status, and next action. |
| Empty day | Explain that no due or priority work is visible and offer review/planning next action. |
| Trello disconnected | Name Trello as unavailable, preserve route context, and route to Runtime/Settings without `.env` wording. |
| Pending review | Show pending Review Queue pressure without implying automatic side effects. |
| Overdue | Use danger signal plus text; do not rely on red alone. |

### Acceptance Checks

- User can identify the top priority within 10 seconds.
- Pending Review Queue work is visible before secondary summaries.
- Disconnected Trello state does not claim the app is connected.

---

## Review Queue

### User Question

What did an AI or intake source propose, what will happen if I approve it, and what decision is safest?

### Required Regions

- Session list with source, environment, age, risk, and target.
- Selected session detail with proposed task title, owner, due date, board/list, source context, and diff type.
- Trace chips for source system, source environment, request id, agent, and run id.
- Decision actions: approve, reject, hold, edit.
- Side-effect explanation before approval.
- Confirmation modal or inline confirmation for approval when external writes may happen.

### Primary Components

- Review session row
- Review diff panel
- Trace chip set
- Audit timeline
- Confirmation modal
- Task detail drawer
- Empty state
- Warning badge

### State Specs

| State | Design requirement |
|---|---|
| Pending normal | Show proposed action, risk, target board/list, and human action required. |
| Missing owner | Highlight owner gap and make edit or hold the safest next action. |
| Possible duplicate | Show duplicate warning and compare target/existing task summary. |
| Approval confirmation | Explain that approval may create or update external Trello/Calendar/Google Tasks records. |
| Empty queue | Explain that no AI-originated work is waiting and point to Docs / AI Trace for history. |
| Missing context | Show what is missing and prevent confident approval styling. |

### Acceptance Checks

- Approval is visibly human-gated.
- Risk and missing data are visible before action buttons.
- Mobile keeps approve/reject/hold/edit reachable without accidental taps.

---

## All Tasks

### User Question

Where is the task, what is its status, and what should happen next?

### Required Regions

- Saved filter bar.
- Dense task list/table.
- Source, board/list, owner, due date, status, and next action columns.
- Detail drawer for selected task.
- Hidden-board filtered notice.

### Primary Components

- Filter bar
- Task row
- Status chip
- Task detail drawer
- Empty state
- No-results state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Desktop uses stable columns; mobile collapses into readable rows with metadata still visible. |
| No results | Explain active filters and provide clear-filter action. |
| Hidden board filtered | Show hidden board source was excluded without exposing private board details. |
| Trello invalid | Explain that task data may be stale or unavailable and route to Settings/Runtime owner. |
| Bulk scan | Row density stays compact but readable; hover-only metadata is not required for decisions. |

### Acceptance Checks

- Source and board/list are visible in dense scan mode.
- Mobile does not hide due/status/owner behind hover-only behavior.
- Filters wrap or collapse without horizontal overflow.

---

## Boards Monitor

### User Question

Are boards healthy, visible, and following the conventions the team depends on?

### Required Regions

- Board health list.
- Team/group view switch.
- Metadata/convention warning area.
- Open-card or inspect-board path.
- Hidden-board and workspace visibility cues.

### Primary Components

- Segmented control
- Board health row
- Warning badge
- Integration status row
- Empty state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Board status, card count, warning count, and last checked are visible. |
| Metadata missing | Explain which convention is missing in product language. |
| No configured boards | Explain expected board setup and safe next action. |
| Trello disconnected | Preserve board context and avoid developer-only error wording. |

---

## Calendar

### User Question

What scheduled commitments affect today's work, and which items come from Google Calendar versus Trello or Review Queue?

### Required Regions

- Day/week schedule view.
- Source labels for Google events, Trello deadlines, and Review-derived items.
- Disconnected Calendar state.
- Link from relevant event/task to detail drawer.

### Primary Components

- Calendar event row/block
- Source chip
- Empty state
- Disconnected state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Source separation is visible at a glance. |
| No events | Explain that no calendar events are visible and preserve Trello deadline context if present. |
| Calendar disconnected | Route to Settings/owner; do not show raw OAuth or `.env` wording. |
| Review-derived item | Mark as pending/approved depending on Review Queue state. |

---

## Planner

### User Question

What can I plan or complete today, and which work came from Google Tasks versus Trello?

### Required Regions

- Google Tasks list.
- Trello due-work list or blended lane with source separation.
- Add task control.
- Complete task state.
- Disconnected Google Tasks state.

### Primary Components

- Task row
- Source chip
- Add task control
- Completion control
- Disconnected state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Google Tasks and Trello work are visually distinct. |
| Add task | Primary action is visible but not over-prominent. |
| Complete task | Completion feedback is clear and reversible if supported later. |
| Google Tasks disconnected | Explain owner/action without exposing raw credential guidance. |

---

## OKR / Portfolio

### User Question

Which objectives and projects are on track, blocked, or unclear?

### Required Regions

- Objective list with progress/status confidence.
- Linked KR/project/task summaries.
- Owner/status filters.
- Stale or missing-link warning.

### Primary Components

- Objective row
- Progress/status chip
- Filter bar
- Warning badge
- Empty state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Objective, KR, project, owner, status, and confidence are visible. |
| No objectives | Explain expected setup and route to PM/Planning next action. |
| Missing KR link | Show missing link as a quality signal, not a fatal error. |
| Stale status | Show last updated and safe next action. |

---

## Weekly Focus

### User Question

What should the team focus on this week, who owns it, and what needs review before execution?

### Required Regions

- Current-week lanes by priority or owner.
- Source and Review Queue handoff markers.
- Blocked/overloaded owner signal.
- Filters for owner/source/status.

### Primary Components

- Lane
- Task row
- Filter bar
- Review handoff chip
- Warning badge
- Empty state

### State Specs

| State | Design requirement |
|---|---|
| Normal | Weekly lanes remain compact and scannable. |
| Empty lane | Explain why the lane is empty and how to plan or review work. |
| Overloaded owner | Show workload warning without turning into a heavy resource planner. |
| Pending review | Mark AI-originated work as requiring human approval before execution. |

---

## Settings

### User Question

What is connected, what is unsafe or missing, and who should act next?

### Required Regions

- Integration status rows: Trello, Calendar, Google Tasks, Paperclip.
- Workspace visibility and hidden boards.
- BU groups.
- Paperclip status: disabled, staged, permanent, read-only observation.
- Signing-secret missing state without values.
- Cloudflare Access required/blocked state without tokens.

### Primary Components

- Integration status row
- Settings control group
- Toggle or checkbox
- Segmented control
- Warning badge
- Error/disconnected state

### State Specs

| State | Design requirement |
|---|---|
| Connected | Show verified status and last checked time. |
| Configured invalid | Distinguish configured-but-invalid from disconnected. |
| Paperclip disabled | Calm explanation that live intake is off. |
| Paperclip staged | Show staged window status and review gate reminder. |
| Signing secret missing | Say connection is incomplete; never show raw secret fields or values in mockup. |
| Cloudflare Access blocked | Explain access requirement without exposing token names or header values. |

### Acceptance Checks

- Non-developers can understand owner/action.
- No secret-like value appears in UI copy.
- Production live intake is not implied to be approved unless explicitly marked by PM later.

---

## Docs / AI Trace

### User Question

Where did this AI-originated work come from, what evidence exists, and why is a linked task missing or present?

### Required Regions

- Trace list.
- Viewer panel.
- Source/context metadata.
- Linked Review Queue task state.
- Missing-link explanation.
- Audit timeline.

### Primary Components

- Trace row
- Trace chip set
- Audit timeline
- Empty state
- Missing-link state
- Review Queue backlink

### State Specs

| State | Design requirement |
|---|---|
| Normal | Type, source mode, agent, run id, linked status, and age are visible. |
| Missing local Review Queue task | Explain that local review task is missing/unavailable in human language. |
| Trace unavailable | Show retry/owner action without raw stack or API text. |
| No docs | Explain what appears here after AI-originated work or review activity exists. |

### Acceptance Checks

- No `Not_found` style system text appears.
- Source and type chips do not visually run together.
- Linked Review Queue status is understandable without repo knowledge.

---

## State Coverage Checklist

| State family | Must appear in concepts |
|---|---|
| Empty | Today, Review Queue, All Tasks, Docs / AI Trace |
| Loading | Today, All Tasks, Settings |
| Error | Trello-dependent route and Docs / AI Trace |
| Disconnected | Trello, Calendar, Google Tasks |
| Configured invalid | Trello and Paperclip-related Settings |
| Pending review | Today, Review Queue, Weekly Focus |
| Side-effect confirmation | Review Queue |
| Missing link/context | Review Queue and Docs / AI Trace |
| Mobile safe action | Review Queue approval flow |

---

## Future V0.6 Implementation Notes

When V0.6 is opened later, Frontend Dev should map these route specs to existing route modules and current automated RUX checks. Do not infer implementation ownership from this design doc before PM opens the implementation phase.
