# Claude Design UI V2 Prompt Packet - Trisilar Task Hub

**Doc Role:** Copy-ready prompt packet for producing UI V2 concept screens
**Status:** Historical/reference prompt packet; Claude output already received
**Owner:** UX Owner / Frontend Design
**Created:** 2026-05-15
**Updated by:** Codex UX Owner / Frontend Design
**Related Docs:** `UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `CLAUDE_DESIGN_UI_V2_GUIDELINES.md`, `UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `UI_V2_ROUTE_SCREEN_SPECS.md`

---

## Use This Prompt In Claude Design

This prompt packet is retained for traceability only. The UI V2 Claude Design output has already been received and imported under `prototype/`; do not treat this file as the next action unless PM explicitly requests another Claude Design iteration.

Design UI Web Design Version 2 for Trisilar Task Hub as an internal operations command center.

This is design-only. Do not produce production code. If a prototype is generated, label it as a design artifact only and keep it separate from the product app.

Task Hub is not a marketing site. Do not create a landing page, sales page, decorative hero, SaaS promo page, or product expansion. The first screen must be the actual application experience.

---

## Product Model To Preserve

```text
Trello = execution surface
Task Hub = command/review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
```

The UI must help a small team see what matters today, inspect AI-originated work, and decide what is safe to approve before it reaches Trello, Google Calendar, or Google Tasks.

Never imply that Paperclip or any AI agent can directly create external side effects without Review Queue human approval.

---

## Concept Screens Required

Create high-fidelity concepts for:

1. Today desktop at `1440x900`.
2. Review Queue desktop at `1440x900`.
3. All Tasks desktop at `1440x900`.
4. Settings desktop at `1440x900`.
5. Docs / AI Trace desktop at `1440x900`.
6. Mobile system view at `390x844`, showing mobile navigation plus Today or Review Queue.
7. One responsive small-mobile stress state at `375x667` for Review Queue approval safety.

Also include annotated lower-fidelity route notes for:

- Boards Monitor
- Calendar
- Planner
- OKR / Portfolio
- Weekly Focus

---

## Visual Direction

Use a restrained professional operations palette:

- neutral application canvas
- white and quiet-gray work surfaces
- narrow teal primary accent
- clear semantic colors for danger, warning, success, info, and AI/Paperclip source
- visible focus states
- no gradient orbs, bokeh, decorative blobs, or hero imagery

The UI should feel:

- operational, not decorative
- dense but readable
- calm but clear about risk
- fast to scan
- trustworthy for AI review
- realistic for future static web app implementation

Avoid a design that reads as all purple/blue gradient, dark slate, beige/tan, or decorative SaaS marketing.

---

## Layout Direction

Use an operations cockpit layout:

- desktop persistent sidebar or navigation rail
- compact top command bar with route title, scope, refresh/status, and primary action
- full-width work surfaces, tables, rows, drawers, and segmented controls
- right-side detail drawer where it preserves route context
- mobile bottom navigation plus a full route menu/drawer

Avoid nested cards. Cards are allowed only for repeated items, modals, and genuinely framed tools. Do not put cards inside cards.

---

## Core Data And Sample Content

Use realistic non-secret sample data.

Today items:

- `Prepare Paperclip staged canary checklist`
- `Review Q2 content workflow board`
- `Confirm Trello connection state after refresh`
- `Update Weekly Focus owner lanes`
- `Resolve missing owner on Paperclip proposal`

Review Queue proposal:

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

Status labels:

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
- Missing local Review Queue task

---

## Required Route Details

### Today

Show:

- priority lane with 3 to 5 highest-action items
- Review Queue pressure strip
- due/overdue rows with source, owner, board/list, due status, and next action
- integration summary for Trello, Calendar, Google Tasks, and Paperclip
- disconnected Trello state that gives a safe non-developer next action

### Review Queue

Show:

- session list with source, environment, risk, age, and target board/list
- diff panel for create/update/duplicate/missing-context
- source/context/trace chips
- approve, reject, hold, and edit actions
- side-effect warning that approval is the external-write gate
- confirmation state for approval on mobile

### All Tasks

Show:

- saved filter bar
- dense desktop table/list
- source, board/list, owner, due, status, and next action
- hidden-board filtered state
- mobile row pattern that keeps key metadata visible

### Settings

Show:

- integration status rows
- workspace visibility controls
- hidden board management
- BU group controls
- Paperclip disabled/staged/permanent status
- signing-secret missing state with no secret values
- Cloudflare Access required/blocked wording without token exposure

### Docs / AI Trace

Show:

- trace list with type, source mode, agent, run id, linked review status, and age
- viewer panel with evidence summary and source context
- missing local Review Queue task explanation
- backlink to Review Queue when available
- no `Not_found` style system wording

---

## Components To Define

Include component examples or annotations for:

- app shell navigation
- route command bar
- filter bar
- task row
- task detail drawer
- Review Queue session row
- Review task diff panel
- source/context/trace chip set
- status chip and warning badge
- integration status row
- empty state
- loading skeleton
- disconnected state
- error state
- confirmation modal
- audit timeline
- settings control group

Use icons for repeated actions such as edit, approve, reject, open Trello, sync calendar, refresh, filter, search, copy link, inspect trace, and rollback/status. Pair icon and label for risky or unfamiliar actions.

---

## Accessibility And Responsive Requirements

Design for WCAG 2.2 AA where practical:

- normal text contrast at least 4.5:1
- large text contrast at least 3:1
- pointer targets at least 24 by 24 CSS pixels, with larger touch targets on mobile
- visible keyboard focus
- stable repeated navigation order
- form labels and visible text matching accessible names
- review/confirmation before data-changing submissions

Responsive requirements:

- no page-level horizontal overflow
- route title and actions wrap or collapse predictably
- filters remain tappable
- drawers and modals keep primary actions reachable
- Review Queue approval actions remain safe on mobile
- mobile navigation exposes all core routes

---

## Output Format Requested

Return:

1. High-fidelity concept screens for the required desktop and mobile views.
2. A design token table for colors, typography, spacing, radius, elevation, and status colors.
3. Component inventory with variants and states.
4. Route-by-route notes for all 10 core routes.
5. Empty, loading, error, disconnected, and confirmation-state examples.
6. Mobile navigation pattern.
7. Implementation handoff notes for a future V0.6 Frontend Dev.

Keep the final response structured so PM can review what screens were produced, what routes are covered, and what gaps remain before V0.6.

---

## Hard Constraints

- Design only until PM explicitly opens V0.6 implementation.
- Do not modify production code.
- Do not propose a full rewrite as the immediate next step.
- Do not change runtime, Cloudflare, secrets, Paperclip live behavior, or V0.5 foundation files.
- Preserve Trello as execution surface.
- Preserve Task Hub as command/review/control layer.
- Preserve Review Queue as human gate.
- Do not include secrets, runtime tokens, raw auth headers, signing material, or production data exports.
- Do not create or imply automatic Trello, Calendar, or Google Tasks writes.
