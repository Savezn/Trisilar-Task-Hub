# UI V2 User-Friendly Improvement Opportunity Ledger

**Status:** Opportunity backlog created; PM/UX prioritization required before implementation.
**Owner:** UX Owner / PM
**Created:** 2026-05-18
**Last updated:** 2026-05-18 by Codex UX Owner / QA

This document complements `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`. The QC ledger records issues, defects, and risks that may block acceptance. This opportunity ledger records ways to make Task Hub easier, faster, calmer, and more forgiving to use, including improvements that are larger, harder, or out of current V0.6 scope.

None of these rows authorize runtime, API/schema, Cloudflare, secrets, live Paperclip behavior, AI harness, Trello/Calendar/Google Tasks side effects, Team OS product expansion, or Full Rewrite work. Rows that would need those scopes are marked explicitly so PM can choose later.

## Opportunity Model

| Field | Meaning |
| --- | --- |
| Impact | `High` changes daily usability or safety; `Medium` reduces repeated friction; `Low` improves polish or confidence. |
| Effort | `S` small UI/design-system patch; `M` route/component slice; `L` multi-route workflow; `XL` product/runtime or architecture decision. |
| Scope | `UI-only`, `UI + local state`, `API/runtime needed`, or `PM policy decision`. |
| Timing | `Do soon`, `Next iteration`, `Later`, or `Decision only`. |
| Relation to QC | Links to existing QC rows when the opportunity would also fix a known problem. |

## Principles For User-Friendly Improvements

- Preserve Trello as the execution surface, Task Hub as the command/review layer, and Review Queue as the human gate.
- Keep desktop operators first, but do not leave mobile/app-pane flows hostile or confusing.
- Make every visible control honest: if it works, show state; if it is future/session-only, say so; if it is unavailable, explain owner/action.
- Prefer progressive disclosure over hiding important context. Dense UI is good only when the user can reveal the full title, reason, diff, or source quickly.
- Favor recoverability: Escape, undo, draft/safe mode, focus return, and no-surprise external side effects.
- Treat generated PASS as evidence only. PM/UX usability acceptance still needs visual and interaction review.

## Opportunity Ledger

| ID | Area | Current Friction / Opportunity | User-Friendly Improvement | Benefit | Impact | Effort | Scope | Timing | Relation to QC / Evidence | Decision Needed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UF-001 | Global shell | Users may need to navigate many routes and filters manually. | Add a command palette for routes, saved views, task search, Review Queue actions, Settings sections, and docs trace lookup. | Makes power use much faster and reduces sidebar/topbar hunting. | High | L | UI + local state | Later | QC-001, QC-062, QC-073 | Yes: command scope and shortcut model. |
| UF-002 | Global shell | Topbar actions can feel disconnected from route-local filters. | Add a persistent "active context" strip showing scope, active filters, source freshness, and quick reset. | Users always know what data they are looking at and can recover from filtered views. | High | M | UI-only | Do soon | QC-010, QC-030, QC-078 | Yes for exact placement. |
| UF-003 | Global shell | Status strip has useful data, but it can slow keyboard users. | Convert status help into one grouped `Status details` control with hover summary and optional detail popover. | Keeps telemetry discoverable without making every status atom a tab stop. | Medium | M | UI-only | Next iteration | QC-061, QC-088 | Yes: individual vs grouped focus. |
| UF-004 | Global shell | Users may not know what changed after refresh, filter, export, or mode switches. | Standardize route action feedback: subtle toast, changed-state label, and optional "what changed" link. | Makes interactions feel responsive and trustworthy. | High | M | UI-only | Promoted / PM-UX review pending | QC-003, QC-078, QC-090, R184 | No. |
| UF-005 | Global shell | App-pane users lose route actions when the layout crosses breakpoint. | Add an app-pane action overflow menu that keeps important route actions available at `747px`. | Improves split-screen desktop use without forcing mobile navigation. | High | M | UI-only | Do soon | QC-001 | Yes: app-pane is desktop or mobile priority. |
| UF-006 | Global shell | Frequent users may visit the same route/filter combinations repeatedly. | Add saved views and pinned route/filter shortcuts. | Reduces repeated setup for daily review, sales, education, or product work. | Medium | L | UI + local state; persistence later | Later | QC-005, QC-030 | Yes: storage/persistence boundary. |
| UF-007 | Global shell | Route changes can feel stateless. | Add route history/back behavior for in-app panels, selected rows, and details drawers. | Users can explore without losing place. | Medium | M | UI + local state | Next iteration | QC-073 | No. |
| UF-008 | Global shell | Dense operational screens can overwhelm during focused work. | Add Focus Mode: collapse sidebar status noise, keep top context, expand primary work surface. | Helps users process Review/Tasks/Focus without distraction. | Medium | L | UI-only | Later | QC-001, QC-061 | Yes. |
| UF-009 | Global states | Loading can be visually safe but not informative. | Add route-specific skeletons and progress copy such as "Loading Trello cards" or "Preparing trace rows". | Reduces anxiety during data load and clarifies source ownership. | Medium | M | UI-only | Next iteration | QC-005 | No. |
| UF-010 | Global states | Empty/disconnected states can be correct but not guiding enough. | Add actionable empty-state variants: first-run, no-results, disconnected, permission needed, and hidden-board filtered. | Users know what to do next instead of just seeing absence. | High | M | UI-only; runtime copy only | Do soon | QC-005, QC-022, QC-023 | No. |
| UF-011 | Global controls | Hover/focus styles and cursor behavior are inconsistent across compact controls. | Define a global interaction state matrix for default, hover, focus, active, selected, disabled, readonly, and loading. | Makes every route feel like one product. | High | M | UI-only | Do soon | QC-083, QC-084, QC-091, QC-092 | No. |
| UF-012 | Global controls | Small controls preserve density but can feel fragile. | Add invisible hit-area tokens for dense table, icon button, chip, segment, and mobile action controls. | Improves comfort without breaking prototype visual compactness. | High | M | UI-only | Do soon | QC-043, QC-084, QC-091 | Yes if strict prototype compactness wins. |
| UF-013 | Global data | Long Thai/English production titles exceed prototype fixture assumptions. | Define text reveal policy: two-line clamp for decision-critical text, tooltip/copy for IDs, ellipsis only for low-risk metadata. | Prevents hidden context without making rows bloated. | High | M | UI-only | Do soon | QC-050, QC-071, QC-074, QC-085, QC-086 | Yes for density trade-off. |
| UF-014 | Global help | Users may not understand statuses like staged, gated, orphan, missing context, or hidden boards. | Add an in-app glossary/help microcopy layer for status terms and safety boundaries. | Reduces interpretation mistakes and onboarding friction. | Medium | M | UI-only | Next iteration | QC-004, QC-008, QC-032 | No. |
| UF-015 | Global safety | External side-effect actions are deliberately constrained, but users may not see why. | Add a consistent "safe mode / session draft / human gate" label pattern near risky controls. | Builds trust and prevents confusion about what actually writes to Trello/Calendar/Tasks. | High | M | UI-only | Do soon | QC-021, QC-047, QC-053 | Yes for wording tone. |
| UF-016 | Global accessibility | Route identity is visually clear but less ideal for assistive tech. | Make each route title the main page landmark/title and announce route changes. | Improves non-visual navigation and command reliability. | Medium | S | UI-only | Do soon | QC-070 | No. |
| UF-017 | Global keyboard | Keyboard flow can land on body or stale controls. | Define a keyboard-first navigation contract: first focus, Escape return, modal trap, route change focus, disabled-control fallback. | Makes the app feel robust for keyboard users and power users. | High | M | UI-only | Do soon | QC-063, QC-073, QC-078, QC-090 | No. |
| UF-018 | Global notification | Bell popover can show status, but it could become a mini action center. | Turn Notifications into an actionable center for disconnected sources, failed sync, pending Review, and stale board data. | Users get one place to resolve operational blockers. | Medium | L | UI + possible API/runtime | Later | QC-078, QC-090 | Yes: runtime/status scope. |
| UF-019 | Global layout | Users may need to compare list + detail across routes. | Add a reusable right-side detail rail for selected task, trace, KR, board warning, or review proposal. | Reduces modal hopping and preserves context. | High | L | UI + local state | Later | QC-017, QC-064, QC-071 | Yes. |
| UF-020 | Global recoverability | Some actions change UI state with no quick undo. | Add undo/revert for UI-only changes such as filters, local drafts, collapsed sections, and Settings draft edits. | Makes exploration safer. | Medium | M | UI + local state | Next iteration | QC-004, QC-030, QC-032 | No external side effects. |
| UF-021 | Today | The route is useful but could guide the user through the day. | Add a "Start day" flow: review next-up, clear blockers, inspect pending Review, then plan focus tasks. | Turns Today into a guided command center instead of only a dashboard. | High | L | UI-only first; automation later | Later | QC-010, QC-012 | Yes. |
| UF-022 | Today | Next Up and work list can still require manual prioritization. | Add quick triage buttons: defer, mark waiting, open review, schedule draft, and copy task context. | Speeds daily work without leaving the route. | High | L | UI + Trello/API if persisted | Later | QC-011, QC-015 | Yes: external write boundary. |
| UF-023 | Today | Scope affects data but users may miss what changed. | Add selected-scope summary near Quick Add and work list, including eligible boards. | Makes BU filtering transparent. | Medium | S | UI-only | Rejected / deferred | QC-012, R182 | PM/UX rejected the separate summary row as redundant with topbar/sidebar Scope; revisit only as a lighter existing-Scope-menu helper. |
| UF-024 | Today | Cross-board signals can be informative but passive. | Add signal drilldowns that explain why a signal exists and which card/list caused it. | Helps users trust and act on signals. | Medium | M | UI-only if data already present | Next iteration | QC-011 | No. |
| UF-025 | Review Queue | Safety controls exist, but decision flow can still feel dense. | Add a guided approval checklist: source, diff, risk, confidence, side effects, missing context, final decision. | Makes human gate decisions clearer and safer. | High | M | UI-only | Do soon | QC-013, QC-015 | No. |
| UF-026 | Review Queue | Diff/risk/confidence are present but could explain "why". | Add expandable "why this risk/confidence" explanations with source evidence. | Users can judge AI proposals faster. | High | L | UI + source metadata | Later | QC-013, QC-015 | Yes: data availability. |
| UF-027 | Review Queue | Bulk actions can be efficient but risky. | Add batch review preview showing common side effects and outlier proposals before bulk approval/reject/hold. | Speeds review without weakening safety. | High | L | UI-only first | Later | Review safety deviation | Yes. |
| UF-028 | Review Queue | Missing-context proposals may block approval but require manual route hopping. | Add missing-context resolution panel with required fields, source links, and return-to-review action. | Reduces Review Queue stalls. | High | L | UI + maybe API/source data | Later | QC-015 | Yes. |
| UF-029 | Review Queue | Mobile first viewport is guarded, but desktop can still be cognitively heavy. | Add desktop split presets: "fast triage", "deep inspect", and "side effects". | Lets users choose density based on task. | Medium | M | UI-only | Next iteration | QC-013 | Yes. |
| UF-030 | All Tasks | Dense table is powerful but can be intimidating. | Add table presets: Review work, due soon, owner view, hidden boards, OKR-linked, stale tasks. | Makes the table approachable without removing power. | High | M | UI + local state | Do soon | QC-030, QC-085 | Yes for default presets. |
| UF-031 | All Tasks | Edit Card exists as modal but route context can be lost. | Add a task detail drawer with summary, checklist, labels, due dates, source, and Trello handoff. | Users can edit/inspect without leaving the list. | High | L | UI + existing APIs | Later | QC-017, QC-064 | Yes: modal vs drawer. |
| UF-032 | All Tasks | Repeated row actions lack context and can feel unsafe. | Add row action menu with contextual labels and grouped actions: inspect, edit draft, open Trello, mark done, schedule. | Reduces clutter while making actions clearer. | High | M | UI + existing APIs | Next iteration | QC-065, QC-085 | Yes for action set. |
| UF-033 | All Tasks | Long lists can be tiring on mobile and desktop. | Add pagination, virtual windowing, or "show more by section" for huge live lists. | Improves scan fatigue and performance. | Medium | L | UI + data strategy | Later | QC-049 | Yes. |
| UF-034 | All Tasks | Sorting/filtering state can be invisible after interaction. | Add filter/sort summary row with clear reset and saved-view option. | Users know why rows appear in current order. | Medium | S | UI-only | Promoted / PM-UX review pending | QC-030, QC-081, R181 | No. |
| UF-035 | Boards Monitor | Board cards show health but action path may be unclear. | Add board health drilldown with issue types, stale cards, label mismatches, and owner actions. | Converts monitoring into actionable cleanup. | High | L | UI + existing data; API later | Later | QC-019, QC-020 | Yes. |
| UF-036 | Boards Monitor | Convention warnings are useful but could feel abstract. | Add "fix suggestion" copy for each warning: rename label, assign owner, archive stale card, move list. | Gives users next steps without changing Trello automatically. | Medium | M | UI-only | Next iteration | QC-020 | No if suggestions only. |
| UF-037 | Boards Monitor | Labels/owners are hard to compare across many boards. | Add grouped board views by BU, owner, warning type, and stale count. | Helps PM see systemic issues faster. | Medium | M | UI-only | Next iteration | QC-019 | Yes for grouping defaults. |
| UF-038 | Calendar | Month grid is compact but event reading can suffer. | Add agenda-first mode for app-pane/mobile and readable selected-day details. | Makes schedule review more practical. | High | M | UI-only | Do soon | QC-042, QC-086 | Yes for mobile default. |
| UF-039 | Calendar | New event may imply live writes. | Add session-only event draft workflow with clear "copy/open Calendar" handoff until runtime scope opens. | Allows planning without unsafe external writes. | High | L | UI + local state; API later | Later | QC-021, QC-047 | Yes. |
| UF-040 | Calendar | Task due dates and events can conflict but are shown separately. | Add conflict indicators for due task vs calendar load, including overbooked days. | Helps choose realistic work. | Medium | L | UI + data logic | Later | Calendar route | Yes. |
| UF-041 | Planner | Planner mixes Trello deadlines and Google Tasks connection state. | Add source cards with clear "available / unavailable / draft-only" actions and setup next steps. | Reduces confusion around disconnected sources. | High | M | UI-only | Do soon | QC-023, QC-068 | No. |
| UF-042 | Planner | Users may need help turning due work into plan buckets. | Add "Plan day" buckets: Now, Next, Waiting, Schedule, Not today. | Makes planning more action-oriented. | High | L | UI + local state; API if persisted | Later | QC-023, QC-051 | Yes. |
| UF-043 | Planner | Timeboxing is manual. | Add optional timebox suggestions from due dates, task size labels, and calendar free windows. | Helps convert tasks into realistic blocks. | Medium | XL | API/runtime or algorithm needed | Later | Calendar/Planner | Yes: product scope. |
| UF-044 | OKR / Portfolio | KR rows can be dense and clipped. | Add objective detail rail showing KRs, linked tasks, risk, owner, and evidence. | Makes strategy execution more readable. | High | L | UI + existing data | Later | QC-052, QC-067 | Yes. |
| UF-045 | OKR / Portfolio | Users may struggle to see which tasks support which objective. | Add KR-to-task trace chips and "unlinked important work" warnings. | Improves portfolio clarity. | High | L | UI + mapping logic | Later | OKR route | Yes. |
| UF-046 | OKR / Portfolio | Risk may be hidden in detailed rows. | Add portfolio heatmap by BU/objective/status confidence. | PM can identify weak areas quickly. | Medium | L | UI + derived data | Later | OKR route | Yes. |
| UF-047 | Weekly Focus | Lanes are useful but cap/hide overflow. | Add lane expand/collapse and "show hidden cards" with clear count and filter retention. | Makes the lane board more navigable. | Medium | M | UI-only | Next iteration | QC-027, QC-048 | Yes. |
| UF-048 | Weekly Focus | Users may need help creating a weekly plan from live data. | Add "Build weekly focus" wizard: choose scope, review AI proposals, pick blockers, select schedule lane. | Turns Focus into a planning ritual. | High | L | UI + local state; persistence later | Later | QC-027, QC-048 | Yes. |
| UF-049 | Weekly Focus | Review AI lane can be conceptually unclear. | Add helper explainer: why a card is in Review AI, what is safe, what requires approval. | Reinforces human gate and reduces confusion. | Medium | S | UI-only | Promoted / PM-UX review pending | Review safety, R183 | No. |
| UF-050 | Docs / AI Trace | Trace table is accurate but audit review can feel technical. | Add trace detail drawer/card with plain-language summary, source, risk, side effects, and linked Review/Trello status. | Makes Docs useful to non-developers. | High | M | UI-only if data exists | Promoted / PM-UX review pending | QC-029, QC-071 | No. |
| UF-051 | Docs / AI Trace | Run IDs and evidence may need sharing. | Add "Copy audit report" and "Export selected trace" templates for PM/QA. | Speeds reporting and handoff. | Medium | M | UI-only | Next iteration | QC-031, QC-071 | No. |
| UF-052 | Docs / AI Trace | Orphan/missing-link state is visible but may not guide action. | Add resolution hints: link to Review task, mark as known orphan, or open source context. | Makes governance cleanup easier. | High | L | UI + data/action decision | Later | QC-029, QC-059 | Yes. |
| UF-053 | Settings | Integrations can be edited, but setup still requires understanding runtime boundaries. | Add step-by-step connection wizards for Trello, Google Calendar, Google Tasks, Paperclip, and Cloudflare Access. | Reduces setup mistakes. | High | XL | Runtime/secret owner needed for real save | Later | QC-032, QC-054 | Yes: runtime scope. |
| UF-054 | Settings | Credential safety copy can feel technical or alarming. | Add friendlier credential health cards: connected, needs owner, draft only, never displayed, safe next step. | Builds confidence without leaking secrets. | High | M | UI-only copy | Do soon | QC-008, QC-032 | Yes for copy tone. |
| UF-055 | Settings | Audit/retention/notification choices exist but may not show consequences. | Add policy preview panels that explain what each setting changes and what it does not change. | Users make safer configuration decisions. | Medium | M | UI-only | Next iteration | QC-053 | No. |
| UF-056 | Settings | Hidden boards/BU groups can grow long. | Add search/filter, bulk visibility review, and "why hidden" notes. | Easier workspace hygiene. | Medium | M | UI + local state | Next iteration | QC-066 | Yes. |
| UF-057 | Settings | Notification toggles may not show examples. | Add notification preview examples for review pending, sync failed, calendar disconnected, and weekly digest. | Clarifies user value before enabling. | Low | S | UI-only | Later | Settings route | No. |
| UF-058 | Mobile / More | More exposes routes, but route priority may vary per user. | Add editable favorites/order for More while keeping five fixed bottom tabs. | Reduces mobile navigation friction. | Low | M | UI + local state | Later | QC-002, QC-037 | Yes. |
| UF-059 | Mobile / app-pane | Critical actions can be too small or far below the fold. | Add mobile-first primary action placement for Review, Tasks, Calendar, and Weekly Focus. | Keeps important workflows reachable. | Medium | L | UI-only | Later | QC-048, QC-056, QC-084 | Yes: mobile priority. |
| UF-060 | QA / UX process | QC catches issues, but usability improvements need their own track. | Add recurring PM/UX opportunity review: choose do-now, next, later, decline. | Prevents good ideas from being lost while keeping Dev scope controlled. | High | S | Process/docs | Do soon | This document | No. |

## High-Value Opportunity Briefs

### Brief A - Global Command Palette

**Why it is promising:** Task Hub has many routes, filters, task IDs, run IDs, and operational states. A command palette would let desktop users jump directly to "Review high risk", "Open Settings / Integrations", "Find run id", "Filter All Tasks by Revenue", or "Open Weekly Focus".

**Risk:** It can become a product feature, not just UI polish, if it tries to mutate data or run external actions. Keep V0.6 version navigation/search-only or UI-state-only.

**Suggested first slice:** Route jump, Settings section jump, local task/run search, and saved filter recall. No external writes.

### Brief B - Task Detail Drawer Instead Of Modal-Only Editing

**Why it is promising:** All Tasks is a dense operational table. A right detail rail would let users inspect task context, checklist, labels, due date, source, and Trello handoff while keeping the row list visible.

**Risk:** Drawer editing can overlap with Trello execution ownership. Any write controls must preserve existing APIs and safe handoff copy.

**Suggested first slice:** Read-heavy drawer with Open in Trello, copy title, and existing Edit Card modal link. Add write controls only after PM decides.

### Brief C - Guided Review Queue Decision Flow

**Why it is promising:** Review Queue is the highest-stakes route. A guided checklist can make every approval feel deliberate: source, diff, risk, confidence, missing context, side effects, final action.

**Risk:** Over-guidance can slow expert users. Provide compact and guided modes.

**Suggested first slice:** Add a right-rail decision checklist that mirrors existing visible evidence without changing approve/reject behavior.

### Brief D - Text Reveal And Readability Policy

**Why it is promising:** Real Trello data has long Thai/English titles. A shared reveal policy fixes a large class of UX problems without redesigning each route.

**Risk:** Too many tooltips can feel noisy. Use two-line clamps for decision text and tooltips/copy affordances for IDs or metadata.

**Suggested first slice:** Apply to All Tasks board tags/next-action/title cells, Docs run IDs, Calendar event chips, OKR KR names, and Planner due titles.

### Brief E - App-Pane Desktop Mode

**Why it is promising:** The team likely works on desktop, but split-screen app panes can be around `747px`. Current mobile breakpoints can hide useful desktop route actions too early.

**Risk:** Supporting a third shell mode can add CSS complexity.

**Suggested first slice:** Add only one app-pane action overflow and keep primary route actions accessible. Avoid reworking the whole responsive system.

### Brief F - Connection And Credential Health Cards

**Why it is promising:** Settings has safety-sensitive integrations. Friendlier cards can explain "connected", "draft only", "owner needed", and "never displayed" without exposing secrets.

**Risk:** Real credential editing needs runtime/secret owner approval. Keep V0.6 copy/UI-only unless PM opens runtime scope.

**Suggested first slice:** Improve copy and state display only; add setup wizards later.

### Brief G - Agenda-First Calendar On Narrow Viewports

**Why it is promising:** Month grids are good for orientation but poor for reading long live event/task titles on mobile or app-pane.

**Risk:** It deviates from pure prototype month-grid presentation. Needs PM/UX decision.

**Suggested first slice:** Keep the month grid as navigator but show readable selected-day agenda above or beside it on narrow layouts.

### Brief H - Opportunity Review Process

**Why it is promising:** The user has repeatedly found small UX issues through live review. A structured opportunity review keeps future ideas from being lost and prevents broad uncontrolled Dev work.

**Risk:** Too much backlog can overwhelm prioritization.

**Suggested first slice:** Add a monthly or version-gate triage: `Do now`, `Next`, `Later`, `Decline`, `Needs prototype`.

## Suggested Prioritization Buckets

**Do Soon**

- UF-002 active context strip.
- UF-004 standardized action feedback.
- UF-010 actionable empty/disconnected states.
- UF-011 interaction state matrix.
- UF-012 hit-area tokens.
- UF-013 text reveal policy.
- UF-015 safe mode / session draft labels.
- UF-016 route heading semantics.
- UF-017 keyboard focus contract.
- UF-023 Today selected-scope summary.
- UF-025 Review Queue guided approval checklist.
- UF-030 All Tasks presets.
- UF-034 All Tasks filter/sort summary.
- UF-038 Calendar readable agenda view.
- UF-041 Planner source cards.
- UF-049 Weekly Focus Review AI explainer.
- UF-050 Docs trace detail summary.
- UF-054 Settings credential health copy.
- UF-060 recurring opportunity review.

**Next Iteration**

- UF-003 grouped status details.
- UF-007 route history/back behavior.
- UF-014 status glossary.
- UF-020 UI-only undo/revert.
- UF-024 Today signal drilldowns.
- UF-029 Review Queue layout presets.
- UF-032 All Tasks contextual action menu.
- UF-036 Board warning fix suggestions.
- UF-037 Boards grouping.
- UF-047 Weekly Focus lane expansion.
- UF-051 Docs audit report export.
- UF-055 Settings policy previews.
- UF-056 Settings board/group search.

**Later / Larger Decision**

- UF-001 command palette.
- UF-006 saved views.
- UF-008 Focus Mode.
- UF-018 notification action center.
- UF-019 reusable detail rail.
- UF-022 Today quick triage writes.
- UF-026 risk/confidence explanations.
- UF-027 Review batch preview.
- UF-028 missing-context resolution.
- UF-031 task detail drawer.
- UF-033 All Tasks virtualization/pagination.
- UF-035 board health drilldown.
- UF-039 event draft workflow.
- UF-040 calendar conflict detection.
- UF-042 day-planning buckets.
- UF-043 timeboxing suggestions.
- UF-044 OKR detail rail.
- UF-045 KR-to-task trace.
- UF-046 portfolio heatmap.
- UF-048 weekly focus wizard.
- UF-052 orphan trace resolution.
- UF-053 integration setup wizards.
- UF-058 mobile favorites.
- UF-059 mobile primary action placement.

## Boundary

This ledger is not a defect list and not an implementation approval. It is a PM/UX option bank for making UI V2 more user-friendly after or alongside acceptance work. Any selected row must still follow the source-led loop: log the chosen gap/opportunity, confirm scope, patch one route/component slice, regenerate evidence, and keep generated PASS separate from PM/UX acceptance.
