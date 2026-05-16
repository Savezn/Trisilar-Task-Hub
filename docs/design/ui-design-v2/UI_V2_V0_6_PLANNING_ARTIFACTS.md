# UI V2 V0.6 Planning Artifacts - Trisilar Task Hub

**Doc Role:** PM/UX planning artifact packet for V0.6 UI V2 implementation
**Status:** PM/UX accepted for planning; V0.6 implementation route opened after V0.5 acceptance
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex PM / UX Owner
**Related Docs:** `README.md`, `UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `UI_V2_ROUTE_SCREEN_SPECS.md`, `../../plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md`, `../../logs/V0_3_RUX_FINDINGS.md`

---

## Decision Boundary

These artifacts translate the accepted UI V2 prototype into planning material for V0.6 implementation. The scoped first slice is now tracked in `../../plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`.

Current PM/UX decision:

- UI V2 prototype is accepted as the design-system baseline.
- V0.6 planning is accepted as the implementation baseline.
- V0.6 implementation planning is open after V0.5 acceptance on current `origin/dev`.
- V0.6 first implementation branch/worktree is `codex/v06-ui-v2-implementation` / `trisilar-task-hub-v06-ui-v2`.
- No production code, runtime, Cloudflare, secrets, Paperclip live behavior, or Full Rewrite work is in scope.

Preserved operating model:

```text
Trello = execution surface
Task Hub = command/review layer
Review Queue = human approval gate
Paperclip / AI = controlled intake sources
```

---

## Artifact Summary

| Artifact | Status | Use |
|---|---|---|
| Route slice map | Accepted | Defines incremental UI V2 implementation sequence |
| Token migration map | Accepted | Converts prototype tokens into production token intent |
| Component build sequence | Accepted | Groups reusable components by dependency and route impact |
| Responsive QA matrix | Accepted | Defines browser/visual evidence expectations |
| Review Queue safety spec | Accepted | Locks the human-gate rules that UI V2 must preserve |

---

## PM / UX Review Decision

Decision: **Accept V0.6 UI V2 planning artifacts as the implementation-planning baseline.**

This acceptance means the planning packet is complete enough to preserve as the V0.6 UI V2 baseline. Implementation is opened only through scoped slices, starting with S0.

| Review item | Decision | Notes |
|---|---|---|
| Route slice map | Accept | Sequence separates foundation, daily work, human gate, operations, and planning routes. |
| Token migration map | Accept | Cobalt user action and violet AI/Paperclip separation are preserved. |
| Component build sequence | Accept | Shared shell, controls, status primitives, task rows, review surfaces, trace, settings, planning surfaces, and states are ordered by dependency. |
| Responsive QA matrix | Accept | Extends V0.3 RUX browser regression with viewport and screenshot expectations. |
| Review Queue safety spec | Accept | Human approval gate, side-effect disclosure, missing-context handling, and mobile safety are explicit. |
| Product boundary | Accept | Trello remains execution surface; Task Hub remains command/review layer; Review Queue remains human gate. |
| Implementation readiness | Open for planning | V0.5 acceptance opens the V0.6 route; first code work still needs a scoped implementation plan. |

PM/UX conclusion:

- Keep this artifact as the V0.6 planning baseline.
- Use the named V0.6 branch/worktree for implementation: `codex/v06-ui-v2-implementation` / `trisilar-task-hub-v06-ui-v2`.
- Use `../../plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md` before code work.
- Keep first implementation scope to S0 until UX/QA evidence is reviewed.

---

## 1. Route Slice Map

The V0.6 route order should reduce risk by separating shared shell work, safety-critical review work, daily work, and secondary planning routes. Dev must work slice-by-slice and start with the scoped S0 plan.

| Slice | Route / surface | Prototype source | Primary value | Dependencies | Future acceptance evidence |
|---|---|---|---|---|---|
| S0 | App shell, route bar, status strip, shared drawer frame | Foundations, component inventory, implementation handoff | Establish the UI V2 frame without changing product behavior | V0.5 accepted; target branch named; S0 plan accepted | Desktop/laptop/mobile shell screenshots; no route regression |
| S1 | Today | `d-today`, `m-today` | Daily command center with top priority, Review Queue pressure, integration confidence | S0 tokens/shell, task row primitives | Top work identifiable, Review Queue pressure first-viewport, no disconnected-state confusion |
| S2 | All Tasks | `d-tasks`, `m-tasks` | Dense task inbox preserving source, owner, due, board/list, status, next action | S0, task row, filter bar, drawer | Desktop table and mobile rows preserve decision cues without overflow |
| S3 | Review Queue | `d-review`, `m-review` | Human approval desk for AI/Paperclip proposals | S0, trace chips, side-effect notice, drawer/confirmation | Approve/reject/hold/edit visible; side effects disclosed before approval |
| S4 | Docs / AI Trace | `d-trace`, mobile More entry | Traceability for Paperclip/AI work and linked review state | S3 trace model, audit timeline, state cards | Missing-link and trace-unavailable states use human-readable copy |
| S5 | Settings | `d-settings`, mobile More entry | Operational control center for integrations, workspace, Paperclip state | S0, integration status row, setting row | No secrets exposed; disconnected/configured-invalid states name owner/action |
| S6 | Boards Monitor | `d-boards`, `m-boards` | Board health, convention warnings, hidden-board visibility | S0, board card, warning chip | Board health scan works on desktop; mobile summary remains reachable |
| S7 | Calendar | `d-cal` | Schedule context with Google Calendar, Trello deadlines, Review-derived items | S0, source chip, event row | Source separation visible; disconnected Calendar state safe |
| S8 | Planner | `d-planner` | Google Tasks and Trello due-work planning with source separation | S0, task row, source chip | Google Tasks disconnected state does not use developer wording |
| S9 | OKR / Portfolio | `d-okr` | Objective progress, KR links, status/risk confidence | S0, stat strip, progress surfaces | KR links and stale status are legible |
| S10 | Weekly Focus | `d-focus` | Current-week priority lanes and Review Queue handoff | S0, lane, task row, filter controls | Overloaded owner and blocked-item signals are clear without becoming resource planning |

PM/UX recommended grouping for the V0.6 implementation plan:

| Future V0.6 milestone | Includes | Reason |
|---|---|---|
| V0.6-A Foundation | S0 | Keeps visual system and responsive shell isolated before route changes |
| V0.6-B Daily Work | S1, S2 | Preserves the main daily command flow and dense task scanning |
| V0.6-C Human Gate | S3, S4 | Keeps Review Queue and AI trace safety together |
| V0.6-D Operations | S5, S6 | Makes integration and board health states clear before secondary planning routes |
| V0.6-E Planning Routes | S7, S8, S9, S10 | Adds lower-risk planning/portfolio surfaces after core decisions are stable |

---

## 2. Token Migration Map

Use the prototype token names as the planning baseline. Dev should map these into production CSS only inside scoped V0.6 slices.

| Token family | Prototype tokens | Future production intent | Rule |
|---|---|---|---|
| App surfaces | `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--surface-sunk`, `--hover`, `--selected` | Shared page canvas, panels, table heads, inset/telemetry areas, hover/selection states | Neutral surfaces remain dominant; avoid decorative one-hue layouts |
| Ink | `--ink`, `--ink-2`, `--ink-3`, `--ink-4`, `--ink-5`, `--ink-6` | Text hierarchy from primary decisions to disabled/meta text | Keep contrast readable; do not rely on low-contrast metadata for decisions |
| Lines | `--line`, `--line-2`, `--line-strong`, `--line-dotted` | Borders, dividers, rows, separators, telemetry/link boundaries | Prefer borders over heavy shadows |
| User action / route focus | `--brand`, `--brand-2`, `--brand-soft`, `--brand-mid`, `--brand-ink`, `--brand-tint` | Cobalt primary actions, active route, focus, selected route state | Brand means user action or current route, not AI output |
| AI / Paperclip | `--ai`, `--ai-2`, `--ai-soft`, `--ai-mid`, `--ai-ink`, `--ai-tint` | Agent-originated proposals, evidence, trace chips, Paperclip surfaces | Violet always signals agent-originated or AI/Paperclip context |
| Danger / overdue | `--over`, `--over-soft`, `--over-mid`, `--over-ink` | Overdue, reject, invalid, dangerous side-effect warnings | Pair color with text and icon |
| Warning / staged | `--warn`, `--warn-soft`, `--warn-mid`, `--warn-ink` | Due today, needs attention, staged window, partial data | Warning must show owner/next action when actionable |
| Success / connected | `--ok`, `--ok-soft`, `--ok-mid`, `--ok-ink` | Connected, approved, complete, verified | Never use success for merely configured-but-unverified integrations |
| Info / scheduled | `--info`, `--info-soft`, `--info-mid`, `--info-ink` | Calendar, schedule, informational state | Avoid blending info with approval/success |
| Geometry | `--r-xs`, `--r-sm`, `--r`, `--r-md`, `--r-lg`, `--r-pill` | Controls, chips, panels, drawers | Default UI radius stays compact; cards/panels should not become rounded decorative blocks |
| Spacing | `--s-1` through `--s-9` | 4px scale for controls, rows, surfaces, route rhythm | Preserve dense operational rhythm |
| Typography | `--font-sans`, `--font-mono`, `--t-display`, `--t-h1`, `--t-h2`, `--t-h3`, `--t-body`, `--t-meta`, `--t-eyebrow`, `--t-mono`, `--t-mono-sm` | Onest for product UI, JetBrains Mono for IDs/telemetry | No viewport-scaled type; mono only for system-emitted data |
| Elevation | `--sh-xs`, `--sh-sm`, `--sh`, `--sh-md`, `--sh-lg` | Overlays, drawers, modals, rare raised surfaces | Do not use shadow to create decorative card stacks |
| Focus | `--focus-ring` | Keyboard focus and active control safety | Must be visible on buttons, rows, filters, drawers, mobile actions |

Token migration stages for future Dev:

| Stage | Action | Output |
|---|---|---|
| T0 | Freeze accepted prototype token values in planning docs | Token baseline approved by PM/UX |
| T1 | Map prototype tokens to existing production stylesheet ownership | CSS ownership table; no product behavior change |
| T2 | Add token aliases behind current UI where safe | Route-neutral token layer |
| T3 | Apply route slices using tokens | Route-by-route visual migration |
| T4 | Run visual/responsive QA and contrast checks | Evidence pack before PM acceptance |

---

## 3. Component Build Sequence

Future implementation should build shared primitives before route-specific surfaces. This keeps routes consistent and reduces rework.

| Order | Component group | Components | Primary route users | Acceptance focus |
|---|---|---|---|---|
| C0 | Layout foundation | `AppShell`, route bar, status strip, mobile shell, drawer frame | All routes | Stable dimensions, no mobile overflow, all routes reachable |
| C1 | Basic controls | Buttons, icon buttons, segmented control, search, filter chips, toggles, selects | All routes | Keyboard focus, wrapping, disabled/loading states |
| C2 | Tokens and status primitives | `Chip`, `DueChip`, `BoardTag`, `SourceChip`, `StatusChip`, `RiskMeter`, `Confidence` | Today, All Tasks, Review Queue, Calendar, Docs | Color plus text; source/status never ambiguous |
| C3 | Task surfaces | `TaskRow`, `TaskTable`, `TaskDetailDrawer`, priority row, next-action label | Today, All Tasks, Weekly Focus | Source, owner, due, board/list, status, next action visible |
| C4 | Review Queue surfaces | `SessionCard`, `ProposalRow`, `DiffBadge`, `InspectionDrawer`, `BulkBar`, approval confirmation | Review Queue | Human gate obvious; side effects disclosed; unsafe states cannot look approved |
| C5 | Trace and audit | `TraceChip`, `EvidenceBlock`, `AuditTimeline`, linked-review status | Docs / AI Trace, Review Queue | Request/run/source references safe and readable |
| C6 | Operational status | `IntegrationRow`, `SettingRow`, connection-state notice, Paperclip status row | Settings, Today, Boards Monitor | No secret display; configured-invalid differs from connected |
| C7 | Board and planning surfaces | `BoardCard`, `Lane`, calendar event row, objective progress, stat strip | Boards, Weekly Focus, Calendar, OKR | Secondary routes inherit decisions from core components |
| C8 | States | `StateCard`, skeleton, inline notice, access required, disconnected, no-results, missing context | All routes | Product language, no raw `.env` or API dumps |

Component guardrails:

- Build repeated row/table/list components before route polish.
- Avoid nested cards and decorative containers.
- Keep route-specific components thin; shared source/status/decision primitives should carry the system language.
- Do not add hidden behavior that only appears on hover for mobile-critical data.
- Do not encode live Paperclip/runtime behavior into visual components.

---

## 4. Responsive QA Matrix

Future V0.6 QA must extend the existing V0.3 RUX browser regression rather than replace it.

| Viewport | Target | Routes to check | Required evidence |
|---|---:|---|---|
| Desktop | `1440x900` | Today, Review Queue, All Tasks, Settings, Docs / AI Trace, Boards Monitor | Full-route screenshots, no page overflow, visible first-viewport priorities |
| Laptop | `1366x768` | Today, Review Queue, All Tasks, Settings | Header/action no overlap, drawer behavior verified |
| Tablet | `1024x768` | Today, Review Queue, All Tasks, Boards Monitor | Compact nav or rail works; filters remain tappable |
| Mobile tall | `390x844` | Today, Review Queue, All Tasks, More/Settings | Bottom nav safe; approval actions reachable; no horizontal overflow |
| Mobile small | `375x667` | Today, Review Queue, All Tasks | Critical metadata visible without hover; no clipped buttons |

Route-specific checks:

| Route | Responsive pass criteria |
|---|---|
| Today | Priority item, Review Queue pressure, and integration warning are visible before secondary summaries |
| Review Queue | Source/risk/target/side-effect and approve/reject/hold/edit stay reachable on mobile |
| All Tasks | Source, owner, due, board/list, status, and next action remain visible in desktop and mobile density |
| Settings | Integration states wrap cleanly; no secret/raw token values are visible |
| Docs / AI Trace | Trace chips remain separated; missing local review task state is readable |
| Boards Monitor | Warning badges and board health do not collapse into unlabeled color-only signals |
| Calendar | Google Calendar, Trello deadline, and Review-derived sources remain distinguishable |
| Planner | Google Tasks disconnected/read-only states give a safe next action |
| OKR / Portfolio | KR links, status confidence, and stale-status warnings stay legible |
| Weekly Focus | Owner/source filters and Review Queue handoff markers remain readable |

Minimum V0.6 QA evidence:

- Existing controlled browser regression still passes.
- New UI V2 screenshot pack covers desktop and mobile for S0 through the current route slice.
- Console/page errors are captured.
- Page-level horizontal overflow is `0` for checked routes.
- Visual comparison or screenshot review confirms no text overlap, clipped buttons, or hidden safety metadata.
- No production secrets, live tokens, service-token headers, signing secrets, or private runtime values appear in screenshots or DOM text.

---

## 5. Review Queue Safety Spec

Review Queue is the highest-risk UI V2 surface because it is where AI/Paperclip-originated work can become external side effects after human approval.

### Required Visible Metadata

Every pending proposal must show:

- source system
- source environment
- request id or safe shortened request reference
- agent / run id when available
- proposed action type: create, update, duplicate, missing context, or no-op
- target board/list or destination
- owner and due date, or explicit missing-field state
- confidence/risk signal with explanatory text
- side-effect summary before approval
- linked trace or evidence path

### Decision States

| State | UI requirement | Safe default |
|---|---|---|
| Pending normal | Show proposed action, target, side effect, and approval controls | Human decides |
| Missing owner / board / list | Highlight missing field and make edit/hold more visually natural than approve | Hold or edit |
| Possible duplicate | Compare proposal with likely existing task and show duplicate risk | Hold or reject |
| Low confidence | Explain confidence reason and expose evidence path | Hold |
| Invalid source/environment | Show blocked/invalid state without approval styling | Reject / blocked |
| Approved | Show audit result and external-write status if any | Read-only history |
| Rejected | Show reject reason and retained audit link | Read-only history |
| Held | Keep review item visible with reason and owner/action | Await owner |

### Approval Guard

Approval must never be a visually casual action. Future UI V2 must require:

- visible side-effect disclosure before approval
- target board/list/owner/due confirmation
- clear difference between approving a Review Queue item and opening/inspecting it
- confirmation when approval can create or update Trello, Calendar, or Google Tasks
- audit event after the decision

Approval must not:

- run automatically from list selection
- be hidden in a bulk action without selected-item disclosure
- look like a simple navigation button
- bypass missing owner/board/list warnings
- imply Paperclip or AI can write externally without a human decision

### Mobile Safety

Mobile Review Queue must preserve:

- source/risk/target in the session card
- sticky or reachable decision actions
- spacing that avoids accidental approve/reject taps
- confirmation copy that fits without clipping
- no hover-only metadata

### Forbidden UI Outcomes

Future V0.6 UI must hold if any of these appear:

- AI/Paperclip proposal looks already approved while pending.
- Side effects are shown only after the approve action.
- Missing owner/board/list still presents approve as a primary safe action.
- Raw secrets, auth headers, signing material, or Cloudflare token values appear.
- Error copy tells non-developer users to edit `.env`.
- Review Queue no longer looks like the human gate.

---

## V0.6 Dev-Ready / Hold Recommendation

Recommendation: **Use this packet to prepare the first scoped V0.6 implementation slice.**

The design artifacts are sufficient for PM/UX baseline and V0.6 implementation planning. Before S0 code work starts, V0.6 uses:

- a dedicated V0.6 branch/worktree from latest `origin/dev`
- `../../plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`
- route order and first slice scope
- file/write ownership for touched production UI files
- regression targets and screenshot evidence expectations
- rollback boundary
- confirmation that runtime, production, Cloudflare, Paperclip live behavior, webhook auth, Team OS product scope, and Full Rewrite remain out of scope

Next PM/UX action:

```text
Role: PM / UX Owner
Task: Review and execute the first scoped V0.6-S0 implementation plan.

Decision options:
- Execute S0 shell/navigation/token/state foundation.
- Iterate S0 plan before code if UX/QA finds an ownership or rollback gap.
- Hold V0.6 if the first slice crosses runtime, production, Team OS, or Full Rewrite boundaries.

Recommended decision:
- Start with S0 only: shell/navigation, token layer, and route states.
```
