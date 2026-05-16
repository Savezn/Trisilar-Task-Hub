# Claude Design UI V2 Guidelines - Trisilar Task Hub

**Doc Role:** Prompt-ready UI/UX guideline for Claude Design
**Status:** Superseded as active prompt; retained as design guardrail because Claude output has been received
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex UX Owner / Frontend Design
**Related Docs:** `README.md`, `UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `UI_V2_ROUTE_SCREEN_SPECS.md`, `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md`, `../../plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md`, `../ui-design-v1-0/README.md`, `../../reference/ORGANIZATION_OPERATING_MODEL.md`, `../../logs/V0_3_RUX_FINDINGS.md`

---

## Copy This Brief Into Claude Design

Design UI Web Design Version 2 for Trisilar Task Hub.

This is an internal operations command center, not a marketing website. Build the actual application experience as the first screen. Do not create a landing page, hero section, sales page, or decorative product site.

Claude Design output has already been received and imported under `prototype/`. Use `UI_V2_CLAUDE_OUTPUT_REVIEW.md` as the current review summary, `UI_V2_DESIGN_SYSTEM_HANDOFF.md` as the design-system handoff, and `UI_V2_ROUTE_SCREEN_SPECS.md` to check each route/state. `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md` is retained as historical/reference prompt material only. These artifacts are still design-only and do not authorize production code changes.

---

## Product Model

```text
Trello = execution surface
Task Hub = command center and review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
```

The UI must help a small team understand what matters today, inspect AI-originated work, and decide what is safe to approve before it reaches Trello, Google Calendar, or Google Tasks.

---

## Design Goal

Create a calmer, sharper, more durable UI V2 concept that keeps the app useful for daily work and production Paperclip intake.

The design should feel:

- operational, not decorative
- dense but readable
- calm but clear about risk
- fast to scan
- trustworthy for AI review
- usable on desktop and mobile
- realistic to implement later in a static web app

---

## Primary Users

| User | Needs |
|---|---|
| PM / Operations Lead | See today's work, blockers, overdue items, Review Queue pressure, and cross-board health quickly |
| Project Owner | Find and update tasks without remembering which Trello board/list owns them |
| Meeting / AI Reviewer | Inspect proposed AI tasks, source, confidence, risk, target board/list, and approve/reject safely |
| Runtime / Access Owner | See connection/access state, warning states, and safe rollback-oriented messaging |
| Teammate / Non-developer | Use Today, Tasks, Boards, Review Queue, and Settings without repo/runtime knowledge |

---

## Core Screens To Design

Design desktop and mobile variants for every core screen.

| Screen | Purpose | V2 focus |
|---|---|---|
| Today | Daily command center | Top priorities, due/overdue work, pending review, next action clarity |
| Review Queue | Human gate for AI-originated work | Source/context/trace, task diff, approve/reject/edit, safe side-effect clarity |
| All Tasks | Cross-board task inbox | Dense table/list, filters, source/board/list/owner/due/status, bulk scanning |
| Boards Monitor | Board and team health | Board mode, team mode, metadata health, convention warnings, open-card flow |
| Calendar | Schedule context | Distinguish Google events from Trello deadlines and Review-derived tasks |
| Planner | Daily Google Tasks + Trello due work | Add/complete tasks, source separation, disconnected state |
| OKR / Portfolio | Objective and project visibility | Objective progress, KR/project links, filters, status confidence |
| Weekly Focus | Current-week planning lanes | Priority lanes, owner filters, Review Queue handoff |
| Settings | Operational control center | Integrations, workspace visibility, hidden boards, BU groups, Paperclip status |
| Docs / AI Trace | Paperclip/AI audit context | Source, run id, linked task status, missing-link explanation, evidence trail |

---

## Information Architecture

Use a stable app shell with persistent navigation. Users should not lose route context when opening details, filters, drawers, or modals.

Recommended primary navigation order:

1. Today
2. Review Queue
3. All Tasks
4. Boards Monitor
5. Calendar
6. Planner
7. OKR / Portfolio
8. Weekly Focus
9. Docs / AI Trace
10. Settings

Navigation should support recognition over recall. Use clear route names, consistent icons, active states, and compact labels.

---

## Layout Direction

Prefer an operations cockpit layout:

- persistent sidebar or navigation rail on desktop
- compact topbar with route title, scope, refresh/status, and primary page action
- page content organized as full-width work surfaces, not nested decorative cards
- tables, rows, panels, drawers, tabs, segmented controls, filters, and status chips
- right-side detail drawer for task/review/card inspection where it preserves context
- mobile bottom/nav drawer pattern that keeps all routes reachable

Do not overuse cards. Cards are acceptable for repeated items, modals, and genuinely framed tools. Avoid placing cards inside cards.

---

## Visual Direction

Use a restrained professional palette. Avoid a UI that reads as only purple/blue gradient, dark slate, beige/tan, or decorative SaaS marketing.

Suggested palette model:

- neutral application canvas
- strong but narrow brand accent
- semantic status colors for overdue, due today, upcoming, blocked, pending review, approved, rejected, warning, connected, disconnected
- quiet borders and subtle elevation
- no gradient orbs, bokeh, decorative blobs, or hero imagery

Typography should prioritize scanning. Use compact headings inside panels and reserve large type for route-level titles only.

---

## Component System Requirements

Design these as reusable components:

- app shell navigation
- route header / command bar
- task row
- task detail drawer
- Review Queue session row
- Review task diff card
- source/context/trace chip set
- status chip and warning badge
- filter bar with saved filter state
- segmented controls for view modes
- empty state
- loading skeleton
- disconnected state
- error state
- integration status row
- audit timeline
- confirmation modal for external side effects
- settings control group

Use icons for repeated actions such as edit, approve, reject, open Trello, sync calendar, refresh, filter, search, copy link, inspect trace, and rollback/status. Pair icons with labels when the action is risky or unfamiliar.

---

## Review Queue And AI Trace Rules

Review Queue is the safety-critical screen.

The design must show:

- source system
- source environment
- request id or safe shortened reference
- agent name/role
- agent run id as a copyable trace value
- proposed task title, owner, due date, board/list, and source context
- diff status: create new, update existing, possible duplicate, or missing context
- confidence/risk label if available
- clear approve, reject, hold, and edit paths
- whether external side effects will occur after approval

Never imply that Paperclip can directly create Trello, Calendar, or Google Tasks side effects without human approval.

---

## Runtime And Access States

Design calm but explicit states for:

- Trello connected
- Trello configured but invalid
- Trello disconnected
- Calendar disconnected
- Google Tasks disconnected
- Paperclip disabled
- Paperclip staged
- Paperclip permanent
- Cloudflare Access blocked/required
- production live intake not approved
- Settings signing-secret connection missing

Do not display secrets, raw auth headers, token values, signing material, or production data exports.

---

## Empty, Error, Loading, And Disconnected States

Every route needs designed states, not placeholder text.

Use these patterns:

- Empty state explains what would normally appear and the most useful next action.
- Filter no-results state explains how to clear or adjust filters.
- Disconnected state names the integration and owner/action without developer-only `.env` wording.
- Error state uses plain language, gives the next safe step, and avoids exposing raw API errors.
- Loading state preserves layout dimensions so content does not jump.

External design guardrails:

- IBM Carbon treats empty states as moments that keep users informed and on a productive path.
- Atlassian describes empty states as appearing when there is no data and explaining what the user can do next.

---

## Accessibility And Interaction Baseline

Design to WCAG 2.2 AA where practical:

- normal text contrast at least 4.5:1
- large text contrast at least 3:1
- pointer targets at least 24 by 24 CSS pixels, with larger touch targets preferred on mobile
- keyboard focus must be visible and not obscured by sticky headers/drawers
- repeated navigation should stay in the same relative order
- form labels and visible text should match accessible names
- data-changing submissions should allow review/confirmation or correction

Design drag/drop features with non-drag alternatives.

---

## Responsive Requirements

Design at least these viewport families:

- desktop large: `1440x900`
- laptop: `1366x768`
- tablet: `1024x768`
- mobile tall: `390x844`
- mobile small: `375x667`

Responsive rules:

- no page-level horizontal overflow
- route title and actions wrap/collapse predictably
- filters remain tappable
- tables collapse into rows/cards or contained scroll regions only when intentional
- drawers and modals keep primary actions reachable
- Review Queue approval actions remain safe on mobile
- mobile navigation must expose all core routes

---

## Data Density

Task Hub should not become sparse. Dense work surfaces are appropriate because users scan many operational signals.

Use density in layers:

- default: compact readable rows
- focused: detail drawer or side panel
- expanded: audit trace, checklist, raw source, or integration evidence

Do not hide critical source, due date, owner, status, or next action behind hover-only interactions.

---

## Sample Content For Mockups

Use realistic but non-secret sample data.

Example Today items:

- `Prepare Paperclip staged canary checklist`
- `Review Q2 content workflow board`
- `Confirm Trello connection state after refresh`
- `Update Weekly Focus owner lanes`

Example Review Queue proposal:

```text
Source: Paperclip
Environment: production
Agent: PM Assistant
Run: pc-run-20260515-001
Diff: Create new Trello card
Risk: Missing owner
Proposed action: Create pending Trello task after human approval
Human action required: Add owner, confirm board/list, approve or hold
```

Example status labels:

- Overdue
- Due today
- Pending review
- Needs owner
- Blocked
- Connected
- Disconnected
- Staged
- Permanent
- Read-only

---

## Claude Output Requested

Produce:

1. High-fidelity UI V2 concept screens for desktop and mobile.
2. A design token table for color, typography, spacing, radius, elevation, and status colors.
3. A component inventory with reusable states.
4. Route-by-route notes for Today, Review Queue, All Tasks, Boards, Calendar, Planner, OKR, Weekly Focus, Docs / AI Trace, and Settings.
5. Empty/loading/error/disconnected state examples.
6. A mobile navigation pattern.
7. A short implementation handoff for future Frontend Dev.

Do not produce production code unless explicitly asked later. If code is produced as a visual prototype, keep it separate from the production app and label it as design artifact only.

---

## Hard Constraints

- Trello remains the execution source of truth.
- Task Hub remains command/review/control layer.
- Review Queue remains mandatory before AI-originated external side effects.
- No production secrets or token-like values.
- No live Paperclip calls.
- No automatic Trello, Calendar, or Google Tasks writes.
- No landing page.
- No decorative hero section.
- No full framework migration proposal unless separated as a future technical option.
- No removal of accepted routes because the design tool omits them.

---

## PM Review Checklist For Claude Output

- Does the first screen show actual Task Hub work, not marketing copy?
- Can a user identify today's top priority within 10 seconds?
- Can a reviewer understand source, risk, target, and side effect before approving?
- Are disconnected and error states understandable to non-developers?
- Does mobile preserve the same workflows as desktop?
- Are dense lists readable without becoming noisy?
- Are all core routes represented?
- Are secrets and runtime values absent?
- Is the design implementable later without forcing an immediate framework rewrite?
