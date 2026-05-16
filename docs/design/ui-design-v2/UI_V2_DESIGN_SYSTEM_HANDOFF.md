# UI V2 Design System Handoff - Trisilar Task Hub

**Doc Role:** Design-only UI V2 artifact packet for Claude Design and future Frontend Dev handoff
**Status:** Accepted design-system handoff; V0.6 planning open docs-only; not approved for product implementation
**Owner:** UX Owner / Frontend Design
**Created:** 2026-05-15
**Updated by:** Codex UX Owner / Frontend Design
**Related Docs:** `README.md`, `UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `UI_V2_V0_6_PLANNING_ARTIFACTS.md`, `prototype/Trisilar Task Hub UI V2.html`, `CLAUDE_DESIGN_UI_V2_GUIDELINES.md`, `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md`, `UI_V2_ROUTE_SCREEN_SPECS.md`, `../../plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md`, `../../plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md`, `../../logs/V0_3_RUX_FINDINGS.md`, `../../plans/PROJECT_LADDER.md`

---

## Scope Boundary

This artifact is design-only. It turns the UI V2 guideline into concrete route concepts, tokens, component inventory, responsive behavior, and future implementation notes.

Do not use this document as approval for runtime, production, Cloudflare, Paperclip live behavior, Team OS product scope, or Full Rewrite work. V0.5 Foundation Hardening is accepted on current `origin/dev`, so V0.6 UI implementation planning may proceed route-by-route from this handoff after PM approves a scoped first-slice plan.

Preserved product model:

```text
Trello = execution surface
Task Hub = command/review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
```

Input note: the requested `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` was not present in this worktree on 2026-05-15. Current V0.5 context was therefore taken from `docs/plans/PROJECT_LADDER.md`, where V0.5 is the future Team Operating System layer.

---

## Design Artifact Summary

UI V2 should feel like an operations command center built for repeated use, not a new product surface or marketing redesign. The first screen should expose real work, review pressure, connection state, and next actions.

Design intent:

- Calm operational canvas with dense but readable rows.
- Strong Review Queue and AI trace visibility without alarming the user.
- Clear source separation between Trello, Review Queue, Calendar, Google Tasks, and Paperclip.
- Route-level empty, loading, error, and disconnected states that give non-developers a safe next action.
- Mobile parity for the same review and daily decision workflows.

Design output expected from Claude Design:

- High-fidelity desktop concept screens for the core route set.
- Mobile concepts for Today, Review Queue, All Tasks, Settings, and Docs / AI Trace.
- Token table, component inventory, and responsive behavior notes.
- Implementation handoff notes only; no production app code.

Claude Design output has now been received and imported under `prototype/`. Use `UI_V2_CLAUDE_OUTPUT_REVIEW.md` as the current coverage and gap summary. Use `UI_V2_ROUTE_SCREEN_SPECS.md` to verify per-route coverage. `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md` is now historical/reference prompt material only.

---

## Route Concept Coverage

| Route | Concept screen requirement | Primary surface | Critical states |
|---|---|---|---|
| Today | Desktop and mobile | Daily command center with priority stack, due/overdue work, Review Queue pressure, and connection summary | Empty day, overdue, pending review, Trello disconnected |
| Review Queue | Desktop and mobile | Human approval gate with source, diff, risk, target board/list, and approve/reject/hold/edit actions | Empty queue, missing owner, possible duplicate, side-effect confirmation |
| All Tasks | Desktop and mobile | Dense cross-board inbox with filters, saved views, source/board/list/owner/due/status/next action | No results, hidden board filtered, Trello invalid, bulk scan |
| Boards Monitor | Desktop plus tablet | Board/team health with metadata warnings, convention gaps, and open-card paths | No configured boards, stale board, metadata missing |
| Calendar | Desktop plus mobile summary | Schedule context separating Google events from Trello deadlines and Review-derived tasks | Calendar disconnected, no events, load failure |
| Planner | Desktop plus mobile summary | Google Tasks plus Trello due work, with source separation and completion clarity | Google Tasks disconnected, add failure, task complete |
| OKR / Portfolio | Desktop | Objective progress, linked projects, status confidence, and owner filters | No objectives, stale status, missing KR link |
| Weekly Focus | Desktop plus mobile summary | Current-week lanes by priority/owner/source with Review handoff | Empty lane, overloaded owner, blocked item |
| Settings | Desktop and mobile | Operational control center for integrations, workspace visibility, hidden boards, BU groups, and Paperclip status | Configured-invalid, disconnected, Paperclip disabled/staged/permanent, signing-secret missing |
| Docs / AI Trace | Desktop and mobile | Evidence trail for Paperclip/AI-originated work, linked review task status, source/run references | Missing local Review Queue task, trace unavailable, no docs |

Minimum V2 concept package should include five fully composed screens: Today desktop, Review Queue desktop, All Tasks desktop, Settings desktop, and one mobile navigation/system screen. Secondary route concepts may be lower fidelity but must include component/state annotations.

---

## Concept Screen Direction

### App Shell

- Desktop uses a persistent left navigation rail with compact labels and route icons.
- Top command bar contains route title, scope selector, refresh/status indicator, and one primary route action where needed.
- Page content uses work surfaces, rows, tables, drawers, and segmented views rather than decorative card stacks.
- Right detail drawer preserves route context for task, review session, board health, or trace inspection.
- Mobile uses bottom navigation for the highest-frequency routes and a menu drawer for the full route list.

### Today

The first viewport should answer: what matters now, what is blocked, what needs review, and whether data is trustworthy.

Required regions:

- Priority lane with 3 to 5 highest-action items.
- Review Queue pressure strip with pending count and oldest pending item.
- Due/overdue work rows with source, owner, board/list, due status, and next action.
- Integration state summary for Trello, Calendar, Google Tasks, and Paperclip.

### Review Queue

Review Queue is safety-critical and should read like a decision desk.

Required regions:

- Session list with source system, environment, risk, age, and target route.
- Diff panel showing proposed create/update/duplicate/missing-context outcome.
- Human action area with approve, reject, hold, and edit paths.
- Side-effect warning that approval is the point where Trello/Calendar/Google Tasks writes may happen.
- Trace panel with safe shortened request/run identifiers and copy controls.

### All Tasks

All Tasks should stay dense and scan-friendly.

Required regions:

- Saved filter bar with route-relevant chips: source, owner, due window, status, board/list, hidden board state.
- Table/list rows with stable columns on desktop.
- Mobile task rows that preserve source, due, owner, status, board/list, and next action without hover-only detail.
- Detail drawer for edit/review/open Trello actions.

### Settings

Settings should be an operational control center, not a developer configuration dump.

Required regions:

- Integration status rows with state, owner, last checked, and safe next action.
- Workspace and hidden-board controls.
- BU group management.
- Paperclip operations status with disabled/staged/permanent state, signing-secret connection state, and no secret values.
- Safe wording for Cloudflare Access required/blocked states.

### Docs / AI Trace

Docs / AI Trace should make traceability legible when something is missing.

Required regions:

- Trace list with type, source mode, agent, run id, linked review status, and age.
- Viewer panel with source context, evidence summary, linked task state, and missing-link explanation.
- Review Queue backlink where a review session exists.
- Empty and missing-link states that avoid `Not_found` style system text.

---

## Design Tokens

### Color Tokens

| Token | Intended use | Suggested value |
|---|---|---|
| `--bg` | App background | `#f6f7f9` |
| `--surface` | Primary panels and drawers | `#ffffff` |
| `--surface-2` | Table heads and inset panels | `#fbfcfd` |
| `--surface-3` | Hover fills and tag chips | `#eef0f4` |
| `--line` | Hairline borders and dividers | `#e2e5eb` |
| `--ink` | Primary text | `#0b0d12` |
| `--ink-3` | Secondary labels | `#555b67` |
| `--brand` | Cobalt primary action and active route | `#1e58e6` |
| `--brand-soft` | Selection fill | `#e6edfd` |
| `--ai` | Paperclip / agent-originated surfaces | `#7c3aed` |
| `--ai-soft` | AI evidence background | `#f3eefe` |
| `--over` | Overdue / reject | `#c8312b` |
| `--warn` | Due today / needs attention / staged | `#b86a05` |
| `--ok` | Connected / approved | `#137e52` |
| `--info` | Google Calendar / upcoming / neutral info | `#0a6fb3` |

Palette guardrail: keep neutral surfaces dominant. Use cobalt for actions the user takes and violet for proposals or evidence an agent produced. Semantic color must always pair with text, never color alone.

### Typography Tokens

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `--t-display` | `28px / 1.15` | 600 | Route-level display only |
| `--t-h1` | `22px / 1.2` | 600 | Section and route major heads |
| `--t-h2` | `17px / 1.25` | 600 | Panels and topbar |
| `--t-h3` | `14px / 1.3` | 600 | Subsection titles |
| `--t-body` | `13px / 1.5` | 400 | Default readable UI text |
| `--t-meta` | `12px / 1.4` | 500 | Supporting copy |
| `--t-eyebrow` | `11px / 1.3` | 600 | Labels and section heads |
| `--t-mono` | `12px / 1.4` | 500 | Run ids, env, telemetry |

Typography guardrail: use Onest for product UI and JetBrains Mono for system-emitted text. Do not scale fonts by viewport width. Keep route titles compact and reserve large type for route-level hierarchy only.

### Spacing, Radius, Elevation, Motion

| Token | Value | Use |
|---|---|---|
| `--s-1` | `4px` | Tight icon/text gaps |
| `--s-2` | `8px` | Row internal spacing |
| `--s-3` | `12px` | Control groups |
| `--s-4` | `16px` | Surface padding |
| `--s-6` | `24px` | Section gaps |
| `--s-7` | `32px` | Page rhythm |
| `--r` | `6px` | Buttons, inputs, chips |
| `--r-md` | `8px` | Panels, drawers, repeated items |
| `--sh-md` | `0 8px 24px rgba(15, 17, 24, 0.10)` | Drawer/modals only |
| `--focus-ring` | brand ring with white halo | Keyboard focus |

Elevation guardrail: use borders first. Reserve shadows for overlays, drawers, and modals.

---

## Component Inventory

| Component | Variants / states | Notes |
|---|---|---|
| App shell | Desktop sidebar, tablet rail, mobile bottom nav + menu drawer | All routes reachable; active route always visible |
| Route command bar | Default, with scope selector, with primary action, read-only status | Avoid crowding on laptop widths |
| Filter bar | Saved view, source, owner, due, status, board/list, clear filters | Must wrap/collapse without horizontal overflow |
| Task row | Default, overdue, due today, blocked, pending review, hidden-board source | Must show source, owner, due, board/list, status, next action |
| Task detail drawer | Read-only, editable, review-linked, Trello-linked | Preserve route context and keyboard escape/close path |
| Review session row | Pending, held, approved, rejected, risky, duplicate | Source/environment/run metadata must remain scannable |
| Review diff panel | Create, update, duplicate, missing context | Show proposed side effects only after human approval |
| Trace chip set | Source, environment, agent, run, request id, linked status | Use safe shortened values; no raw secrets |
| Status chip | Neutral, info, warning, danger, success, AI | Semantic color plus text; color alone is insufficient |
| Integration status row | Connected, configured-invalid, disconnected, disabled, staged, permanent | Names owner/action without `.env` wording |
| Empty state | Route empty, filter no-results, no docs, no queue | Explains what normally appears and the next useful action |
| Loading skeleton | Table/list, drawer, status row | Preserves dimensions to avoid layout jump |
| Error state | Recoverable, access required, invalid integration, load failed | Plain language; no raw API dumps |
| Confirmation modal | Approve side effect, reject, rollback/status action | Risky actions use icon + label + confirmation copy |
| Audit timeline | Review events, trace events, link events, missing-link event | Makes Paperclip/AI flow understandable without repo knowledge |
| Settings control group | Integration, workspace, hidden boards, BU group, Paperclip | Calm grouped controls, no nested cards |

---

## Responsive Notes

| Viewport | Navigation | Content behavior | Required checks |
|---|---|---|---|
| `1440x900` desktop | Full sidebar | Multi-column work surfaces and right drawer | First viewport shows Today priorities plus review pressure |
| `1366x768` laptop | Full or compact sidebar | Reduce secondary summaries before shrinking rows | No route header/action overlap |
| `1024x768` tablet | Icon rail or compact sidebar | Two-column where useful; drawer can become overlay | Filters remain tappable |
| `390x844` mobile tall | Bottom nav + menu drawer | Single-column rows, bottom-safe primary actions | Review approval path remains safe |
| `375x667` mobile small | Bottom nav + compact command bar | Prioritize route title, selected scope, primary action, rows | No page-level horizontal overflow |

Mobile hierarchy:

1. Route title and current scope.
2. Highest-risk or highest-action item.
3. Review Queue pressure or integration warning.
4. Primary row list.
5. Secondary summaries behind tabs, disclosure, or route-local sections.

Mobile must not hide source, risk, owner, due, status, or next action behind hover-only interactions.

---

## Implementation Handoff Notes For V0.6

Future Frontend Dev should treat this as a design spec candidate, not a build instruction, until PM opens V0.6.

Recommended V0.6 implementation order:

1. Confirm the current V0.5 acceptance evidence and PM approval for the first V0.6 UI slice.
2. Freeze accepted Claude Design concepts and this token/component inventory as the implementation baseline.
3. Create a dedicated V0.6 branch/worktree from the PM-approved integration branch.
4. Implement shared tokens and app shell first.
5. Implement Today, Review Queue, and All Tasks before secondary routes.
6. Add Settings and Docs / AI Trace before any optional polish because they preserve runtime and AI governance clarity.
7. Run existing browser regression checks and add V0.6-specific visual/responsive checks before PM review.

Future implementation must preserve:

- Trello as execution source of truth.
- Task Hub as command/review/control layer.
- Review Queue as the human approval gate before external side effects.
- No secret display, token values, raw auth headers, or production data exports.
- No live Paperclip calls as part of UI visual work.
- No automatic Trello, Calendar, or Google Tasks writes.

---

## V0.6 Gaps After V0.5 Acceptance

These are not blockers for this design handoff. They are implementation gaps for the future V0.6 route after V0.5 is accepted or PM explicitly reorders the roadmap.

| Gap | Why it matters | V0.6 owner |
|---|---|---|
| Route slice map is drafted for planning, not implementation | Future implementation still needs PM to open V0.6 and Frontend Dev to map current module ownership | PM / UX Owner |
| V0.5 gate is confirmed but not accepted | `PROJECT_LADDER.md` L7 keeps V0.5 as Future with team pilot feedback and operational adoption as the release gate | PM |
| Token migration map is drafted for planning, not production CSS | Prototype tokens are accepted directionally, but Frontend Dev still needs production stylesheet ownership after V0.6 opens | UX Owner / Frontend Dev |
| Component build sequence is drafted for planning | Prototype inventory is complete enough for planning, but PM must approve a future implementation branch/scope first | PM / UX Owner |
| Current production CSS/component ownership is not mapped here | Implementation must inspect existing `src/` and `public/` only after V0.6 is opened | Frontend Dev |
| Browser visual regression for UI V2 does not exist yet | V0.6 needs checks beyond current RUX route assertions | QA / Frontend Dev |
| Mobile navigation needs final route-priority decision | Design proposes bottom nav plus menu, but PM must approve route priority | PM / UX Owner |

---

## Design Review Checklist

- Does Today show actual work and review pressure in the first viewport?
- Can a reviewer understand source, risk, target, and side effect before approval?
- Does every route include empty, loading, error, and disconnected states?
- Do Settings and Docs / AI Trace avoid secrets and raw runtime values?
- Does mobile preserve the same review and daily decision workflow as desktop?
- Are Trello, Calendar, Google Tasks, Review Queue, and Paperclip visually distinguishable without becoming noisy?
- Is the design practical to implement in the current Task Hub app after V0.5 acceptance?
