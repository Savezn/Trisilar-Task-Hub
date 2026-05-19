# Version 0.6 UI V2 PM Dev Task Backlog

**Doc Role:** PM-owned backlog for selecting UI V2 defect fixes and UX improvements  
**Status:** Ready for PM/UX triage; repo backlog first, no Trello cards created  
**Owner:** PM / UX Owner  
**Updated:** 2026-05-19  
**Branch / Worktree:** `codex/v06-uiv2-full-fidelity` / `trisilar-task-hub-v06-uiv2-qa`

This backlog turns the UI V2 micro-QC ledger and user-friendly opportunity ledger into Dev-ready task candidates. It is the repo source of truth before any Trello execution card is created.

Generated PASS remains evidence only. For this release batch, PM/UX accepted the implemented P1/P2 scope with logged deferrals on 2026-05-19; future P1/P2 rows still require PM/UX visual review, explicit deferral, or a logged deviation before acceptance.

## Source Inputs

- `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md`
- `docs/design/ui-design-v2/UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`
- `docs/design/ui-design-v2/UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md`
- `docs/design/ui-design-v2/UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md`
- `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md`
- `docs/design/ui-design-v2/UI_V2_PM_UX_REVIEW_DECISION_PACKET.md`
- `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`

## Task Status Rules

| Status | Meaning | Dev permission |
|---|---|---|
| Ready for Dev | Source rows and acceptance are clear; no PM policy decision is needed. | Dev may start a narrow source-led slice. |
| PM/UX Review Pending | Dev patch and QA evidence are available; visual/product acceptance still needs PM/UX review. | Dev should hold except for PM/UX-requested follow-up fixes. |
| Decision Needed | PM/UX must choose a product, density, responsive, or copy policy first. | Dev must wait for the decision. |
| Opportunity Backlog | User-friendly improvement, not an acceptance blocker. | Dev must wait until PM promotes one row. |
| Hold | Requires runtime/API/schema/secrets/external side effects or larger product scope. | Not allowed in V0.6 UI-only work. |

## Execution Rules

- Work blockers first: P1/P2 interaction, accessibility, focus, visibility, and decision-readability risks before optional UX improvements.
- Open one task at a time, or one tightly related shared-primitive batch.
- Before code, name the prototype/source contract and trace the selected `QC-*`, `FD-*`, and `UF-*` rows.
- Patch narrowly in frontend UI files only. Do not change runtime, public API, schema, secrets, Cloudflare, Paperclip live behavior, AI harness, Trello writes, Calendar writes, Google Tasks writes, Team OS scope, or Full Rewrite scope.
- Regenerate evidence for the affected route/component and update the relevant UI V2 review/audit docs.

## Blocker-First Dev Backlog

| Task ID | Priority | Type | Source rows | Owner | Scope | Implementation target | Acceptance | Evidence required | Status |
|---|---|---|---|---|---|---|---|---|---|
| UIV2-FIX-001 | P1 | Accessibility / interaction hazard | `QC-063`, `QC-076`, `QC-087`, `FD-001` | Frontend Dev / QA | Global shell, legacy surfaces, All Tasks responsive rows | Remove or inert legacy invisible controls and zero-size responsive row controls. | No focusable zero-size visible-tree controls remain for global shell or All Tasks responsive layouts. | Focusable/hidden-control scan plus desktop/app-pane/mobile screenshots for affected routes. | PM/UX Review Pending |
| UIV2-FIX-002 | P1 | Keyboard / focus recovery | `QC-078`, `QC-090`, `FD-002`, `FD-004` | Frontend Dev / QA | Topbar popovers, disabled/readonly controls, modal close paths | Add a shared focus-return contract for Escape, outside click, disabled-click, and close paths. | Focus returns to the trigger or next safe control and never lands on `BODY` after close/edge interactions. | Keyboard interaction probe for Scope, Docs Filter, Bell, readonly chips, and Edit Card close. | PM/UX Review Pending |
| UIV2-FIX-003 | P2 | Semantics / control hygiene | `QC-007`, `QC-016`, `QC-079`, `QC-081`, `QC-082`, `FD-003`, `FD-005`, `FD-006` | Frontend Dev / QA | Global controls, Scope picker, All Tasks dense table | Add accessible names, native button semantics, explicit button types, and sort state semantics. | Icon-only controls have names/tooltips, non-submit buttons declare `type="button"`, Scope trigger uses native semantics, and All Tasks sort exposes state. | DOM/accessibility scan plus All Tasks sort interaction proof. | PM/UX Review Pending |
| UIV2-FIX-004 | P2 | Interaction affordance | `QC-083`, `QC-084`, `QC-091`, `UF-011`, `UF-012`, `FD-007` | Frontend Dev / UX Owner / QA | Buttons, chips, segments, table controls | Normalize hover, focus, cursor, and effective target sizing while preserving UI V2 density. | Real controls show pointer/hover/focus feedback; compact controls get safe effective hit areas after PM density policy is confirmed. | Hover/focus screenshot matrix and target-size scan. | PM/UX Review Pending |
| UIV2-FIX-005 | P2 | Data readability | `QC-071`, `QC-074`, `QC-085`, `QC-086`, `UF-013`, `FD-009` | UX Owner / Frontend Dev / QA | Docs, All Tasks, Calendar, Planner, OKR, Today | Define and apply shared text reveal policy for long Thai/English production data. | Decision-critical text has two-line clamp, tooltip, copy affordance, or detail reveal; low-risk metadata may ellipsize. | Long-data screenshots across Docs, All Tasks, Calendar, Planner, OKR, and Today. | PM/UX Review Pending |
| UIV2-FIX-006 | P1 | Route readability | `QC-029`, `QC-041`, `QC-059`, `QC-071`, `QC-080`, `UF-050`, `FD-010` | Frontend Dev / QA | Docs / AI Trace mobile and app-pane | Repair mobile filterbar, trace rows, run IDs, evidence card, and readonly chip behavior. | No mobile trace overlap or clipping hides audit-critical run identity, agent, source, link, risk, or status. | Mobile-small/app-pane Docs screenshots and trace row DOM geometry proof. | PM/UX Review Pending |
| UIV2-FIX-007 | P1 | Calendar UX / action honesty | `QC-021`, `QC-042`, `QC-047`, `QC-086`, `UF-038`, `FD-011` | PM / UX Owner / Frontend Dev / QA | Calendar desktop, app-pane, mobile | Improve event readability and make `New event` action honest about current write boundary. | Event titles are readable enough for planning; create actions do not imply live external writes. | Calendar Day/Week/Month screenshots plus copy/action-state proof. | PM/UX Review Pending |
| UIV2-FIX-008 | P2 | Settings accessibility / safety copy | `QC-008`, `QC-032`, `QC-033`, `QC-054`, `QC-066`, `UF-054` | UX Owner / Frontend Dev / QA | Settings integrations, workspace, hidden boards, BU groups | Label fields/checks, contextualize repeated actions, and polish credential health copy. | Settings fields/checks are programmatically labeled, repeated actions name their target, and no raw secret/OAuth/token values are displayed. | Settings accessibility scan, copy review, and desktop/mobile screenshots. | PM/UX Review Pending |
| UIV2-FIX-009 | P2 | States / action feedback | `QC-003`, `QC-005`, `QC-006`, `QC-093`, `UF-004`, `UF-010`, `UF-015` | UX Owner / Frontend Dev / QA | Global route states and feedback surfaces | Standardize loading, empty, disconnected, no-results, readonly, draft-only, and action feedback copy. | Every visible route action gives feedback or honest disabled/draft-only copy; duplicated route actions are removed or explicitly justified. | Forced state screenshots and route-action feedback checks. | PM/UX Review Pending |
| UIV2-QA-001 | P2 | Evidence / verifier expansion | `QC-005`, `QC-075`, `QC-077`, `QC-089`, `QC-092`, `FD-014` | QA Owner / Frontend Dev | Browser QA scripts and evidence pack | Add state fixture proof and hover/focus/active/disabled screenshot matrix. | Evidence covers state permutations and micro-interactions without treating automated PASS as PM/UX acceptance. | Updated screenshot pack, scanner summary, and verifier notes. | PM/UX Review Pending |

## PM Decision Backlog

| Task ID | Priority | Type | Source rows | Owner | Scope | Decision target | Acceptance | Evidence required | Status |
|---|---|---|---|---|---|---|---|---|---|
| UIV2-DEC-001 | P1 | Responsive policy | `QC-001`, `UF-005` | PM / UX Owner | App-pane `747px` | Confirm app-pane behaves as compact desktop with visible overflow actions. | Route actions remain reachable at app-pane width without forcing true mobile behavior. | R171 app-pane screenshots for Today, Docs, Calendar, All Tasks, and Review. | PM/UX Review Pending |
| UIV2-DEC-002 | P2 | Mobile navigation policy | `QC-002` | PM / UX Owner | Mobile shell | Choose whether bottom nav is enough or hamburger remains for secondary access. | Mobile navigation exposes Today / Review / Tasks / Boards / More with no confusing duplicate route model. | Mobile Today/Review/More screenshots. | Decision Needed |
| UIV2-DEC-003 | P2 | Telemetry help policy | `QC-061`, `QC-088`, `UF-003` | PM / UX Owner | Status strip | Choose individual focusable status atoms vs grouped `Status details`. | Telemetry remains understandable without excessive keyboard tab cost. | Keyboard focus sequence and tooltip/detail screenshot. | PM/UX Review Pending |
| UIV2-DEC-004 | P2 | Calendar responsive policy | `QC-042`, `QC-086`, `UF-038` | PM / UX Owner | Calendar mobile/app-pane | Choose month-grid-first or agenda-first behavior for readable planning. | Calendar mobile/app-pane supports practical schedule reading. | Month vs agenda comparison screenshots. | Decision Needed |
| UIV2-DEC-005 | P2 | Density vs ergonomics policy | `QC-084`, `QC-091`, `UF-012` | PM / UX Owner | Shared controls | Confirm minimum effective hit areas while preserving compact prototype look. | Target sizing policy can be implemented consistently across chips, segments, icon buttons, and dense tables. | Target-size matrix and prototype comparison. | PM/UX Review Pending |

## Opportunity Backlog

| Task ID | Priority | Type | Source rows | Owner | Scope | Implementation target | Acceptance | Evidence required | Status |
|---|---|---|---|---|---|---|---|---|---|
| UIV2-UF-001 | P2 | User-friendly improvement bundle | `UF-002`, `UF-004`, `UF-010`, `UF-023`, `UF-025`, `UF-030`, `UF-034`, `UF-041`, `UF-049`, `UF-050`, `UF-054` | PM / UX Owner | Do-soon UX opportunities | Promote one row at a time after blocker fixes are assigned. | Each promoted row has a source-led scope, acceptance note, and evidence plan before Dev starts. | PM-selected row, updated visual parity row, and targeted screenshots. | Opportunity Backlog |
| UIV2-UF-002 | P3 | Larger product UX bundle | `UF-001`, `UF-006`, `UF-019`, `UF-031`, `UF-039`, `UF-043`, `UF-053` | PM / Product Owner | Larger UX/product opportunities | Hold command palette, saved views, detail rail, task drawer, event drafts, timeboxing, and connection wizards until PM opens larger scope. | No work starts inside V0.6 UI-only scope unless PM records a separate product/runtime decision. | Decision note and separate plan if promoted. | Hold |

## Recommended First PM Selection

1. Start from `docs/design/ui-design-v2/UI_V2_PM_UX_REVIEW_DECISION_PACKET.md` for the current accept-candidate list and decision recommendation.
2. PM/UX should visually re-review `UIV2-FIX-001`, `UIV2-FIX-002`, `UIV2-FIX-003`, `UIV2-FIX-004A`, `UIV2-FIX-005`, `UIV2-FIX-006`, `UIV2-FIX-007`, `UIV2-FIX-008`, `UIV2-FIX-009`, `UIV2-QA-001`, the targeted Edit Card modal follow-up, and the Today row action follow-up on desktop routes first; Dev has completed these blocker/polish slices.
3. `UIV2-DEC-005` and `UIV2-DEC-003` were applied through `UIV2-FIX-004A` after PM/UX proceeded; PM/UX should now accept, iterate, or defer the implemented interaction-affordance pass.
4. Use Docs / AI Trace mobile/app-pane screenshots from `UIV2-FIX-006` as evidence, keep `QC-030` available for future PM/UX decisions on filter-state modeling, and treat the desktop long-ID readability portion of `QC-071` as closed in R142 pending PM/UX re-review.
5. `UIV2-DEC-001`, `UIV2-DEC-003`, `UIV2-DEC-005`, the conservative `UIV2-FIX-005` text reveal policy, and the R174 `QC-069` muted-label contrast polish have all been applied as narrow UI-only slices; PM/UX should now re-review the visual behavior instead of treating them as open decisions.
6. R175 desktop re-review passed across all 10 desktop routes; PM/UX should now decide accept, iterate, or hold the desktop V0.6 UI V2 batch.
7. R176 applies the PM/UX sidebar Scope iterate: `Scope` is treated as BU quick-filter inventory, not workspace context. Workspace-placeholder groups such as `Trisilar` are hidden from the sidebar/topbar BU filter model; if no meaningful BU groups exist, the sidebar shows `Configure BUs` and Boards Monitor reports `0 BU groups`.
8. R177 applies the PM/UX Settings BU group wording iterate: `Edit groups` no longer creates a new group under a misleading label. The action is now `Add BU group`, while existing group edits remain inline in the Settings panel.
9. R178 supersedes the board-based Scope model after PM/UX clarification: sidebar/topbar Scope is now sourced from Team mode labels (`monitorTeams`) and filters work by matching Trello labels. BU groups remain available in Settings for board organization, but they no longer drive the global Scope filter.
10. R179 applies the Scope clear interaction iterate: clicking the active sidebar Scope label now toggles it off and restores `All BUs`, so users are not trapped in one selected label.
11. R180 applies the desktop route segment and OKR context iterate: All Tasks view segments and Today work segments are now real controls, and OKR / Portfolio is split into `Objective Scorecard` plus `Quarter Execution Plan` with per-objective cycle labels.
12. R181 promotes and implements the `UF-034` All Tasks filter/sort summary slice: the route now exposes current view, sort, scope, local filters, row count, and clear/reset controls without changing global Scope or runtime behavior.
13. R182 was PM/UX rejected and rolled back: the proposed Today selected-scope summary duplicated the topbar/sidebar Scope model and added unnecessary visual weight before the work grid. Keep `UF-023` deferred unless PM/UX asks for a lighter alternative, such as a small helper in the existing topbar Scope menu.
14. R183 promotes and implements the `UF-049` Weekly Focus Review AI explainer slice: the Review AI lane now explains that AI-originated proposals are planning-only in Weekly Focus and must be approved/rejected/held/edited in Review Queue before Trello execution.
15. R184 promotes and implements a low-noise `UF-004` route action feedback slice: global refresh now announces route-specific refreshing state, updates last sync, and shows route/scope completion feedback without adding another persistent context strip.
16. R185 completes the time-boxed main-readiness hardening sweep: tests, check:all, RUX regression, full-fidelity, state fixtures, and refreshed interaction matrix all pass on `3035`; `docs/plans/VERSION_0_6_UI_V2_MAIN_READINESS_PACKET.md` is the current merge-readiness summary.
17. R186 records PM/UX accept-with-deferrals for the current V0.6 UI V2 batch and routes release work to a draft PR against `dev`.
18. Keep the rest of `UIV2-UF-001` parked until PM selects a post-release improvement row.

## Implementation Evidence - First Desktop Blocker Batch

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Tasks:** `UIV2-FIX-001`, `UIV2-FIX-002`, `UIV2-FIX-003`  
**Priority:** Desktop first, with no runtime/API/schema change

Changes applied:

- Hidden modal and legacy sidebar surfaces now use shared `aria-hidden` / `inert` / child-tabindex handling through `openSurface`, `closeSurface`, and `syncClosedSurfaces`.
- Topbar Scope is a native `<button type="button">` with listbox semantics instead of a custom `div role=button`.
- Scope, Bell, Docs Filter, and modal close paths now return focus to the trigger or a safe topbar control.
- All source-visible `<button>` elements in `public/index.html`, `public/app.js`, and `public/js/pages/*.js` declare `type="button"`.
- All Tasks sort headers expose `aria-sort`, and task completion controls include task-specific accessible labels.

Verification:

- `node --check public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js` passed.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed, including smoke checks against the current preview.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/today`, `3032/docs`, and `3032/all` confirmed: Scope Escape returns focus to Scope, Bell Escape returns focus to Bell, Docs Filter Escape returns focus to Docs Filter, All Tasks sort exposes `aria-sort`, hidden focusable count is `0`, zero-size visible-tree focusable count is `0`, and live button missing-type count is `0`.
- R133 follow-up expanded `verify:uiv2-full-fidelity` with direct desktop topbar focus-return checks and confirmed on `3032/docs` that Docs Filter, Bell, and Scope Escape close paths restore focus to the trigger; Scope now shows a visible UI V2 restored-focus ring. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/topbar-focus-recovery-docs-2026-05-18.png`.
- R134 follow-up closed `QC-043` for desktop All Tasks table hit areas: dense sort headers now expose 28px-tall targets, row completion controls expose 28x28 targets while keeping 14px visual checkboxes, and Due sort still updates `aria-sort`. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/all-tasks-hit-area-repair-2026-05-18.png`.
- R135 follow-up closed `QC-062` for desktop route search accessibility: All Tasks and Docs search inputs now expose accessible names, and compact search shells share the UI V2 focus ring. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/search-focus-accessibility-2026-05-18.png`.
- R136 follow-up closed `QC-065` through `QC-068`: All Tasks completion labels are verifier-guarded as task-specific, Settings repeated actions retain contextual accessible names, OKR KR detail buttons now have KR-specific labels/titles and are keyboard-focusable, and Planner Settings CTAs identify the Google Tasks / Planner connection context. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/okr-contextual-kr-detail-labels-2026-05-18.png` and `docs/logs/screenshots/v06-uiv2-full-fidelity/planner-contextual-settings-ctas-2026-05-18.png`.
- R138 reconciliation verified the first blocker batch with an ancestor-aware `/all` scan across desktop `1440x900`, app-pane `747x910`, and mobile-small `375x667`: active zero-size focusables `0`, missing visible button type count `0`, horizontal overflow `0`, closed modals and legacy sidebar board controls hidden by `aria-hidden=true` / `inert`, and responsive task-check controls inactive under hidden/inert ancestors. `QC-063`, `QC-076`, `QC-081`, `QC-082`, and `QC-087` are PM/UX review pending rather than open blockers.
- R139 closed `QC-055`: the idle toast shell is hidden/empty with `aria-hidden=true`, populated toasts become visible only while feedback is active, and mobile toast placement now sits above the bottom route bar instead of overlapping it. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/toast-empty-hidden-mobile-small-2026-05-18.png`, `toast-visible-mobile-small-2026-05-18.png`, `toast-empty-hidden-mobile-2026-05-18.png`, and `toast-visible-mobile-2026-05-18.png`.
- R140 reconciliation verified the remaining semantics rows with a fresh desktop DOM audit on `/all`, `/settings`, and `/docs`: unnamed visible icon-only buttons `0`, visible unnamed editable fields `0`, native Scope picker button semantics present, and overflow `0`. `QC-007`, `QC-016`, `QC-033`, and `QC-079` are PM/UX review pending rather than open blockers.
- R141 closed `QC-072`: All Tasks sortable table headers now use a clearer 11px / 700 header treatment, darker text, 28px full-width hit surfaces, cobalt hover/focus feedback, and verifier coverage while preserving compact UI V2 density. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/all-tasks-header-affordance-2026-05-18.png`.
- R142 closed `QC-071`: Docs / AI Trace desktop trace rows now keep run IDs and agent names readable with wrapped Trace capsules, retained copy affordance, two-line title/agent treatment, and verifier coverage. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-trace-desktop-identity-readability-2026-05-18.png`.
- R143 closed `QC-085` with a conservative reveal path: dense All Tasks rows keep compact layout while row/task title, next action, board/list, and list-name surfaces expose native title fallback for long live data. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/all-tasks-long-text-reveal-2026-05-18.png`.
- R144 closed `QC-070`: the route shell now exposes `main#app-main[aria-labelledby='board-title']`, preserving the UI V2 visual hierarchy while making the current route title the labelled main landmark. Browser QA on `/today` confirmed the route label `Today`, overflow `0`, and console warnings/errors `0`; `verify:uiv2-full-fidelity` now guards the contract.
- R145 closed `QC-050`, `QC-051`, and `QC-052` with conservative long-text reveal coverage for Today, Planner, and OKR: task rows, Trello/Google task rows, shared board tags, Planner source metadata, and KR rows expose native `title` fallback while preserving compact UI V2 density.
- R146 reconciled `QC-006`, `QC-019`, and `QC-025`: source-led review plus verifier guards now separate static owner/status metadata from real filter chips in Boards, OKR, and Settings. `verify:uiv2-full-fidelity` requires static metadata not to contain fake buttons/filter chips, disabled planned-filter chips to carry explanatory titles, and Settings static status chips to remain non-button elements.
- R147 reconciled `QC-023`: the controlled Planner disconnected-state guard now fails if Google Tasks add controls appear while disconnected, and requires the connect card plus safe no-write/read-only copy. Evidence is in the regenerated Planner full-fidelity screenshots.
- R148 closed `QC-031`: Docs / AI Trace Export now declares local CSV/no-external-system behavior, Copy audit report declares local no-write behavior, and Rollback hint declares guidance-only behavior. `verify:uiv2-full-fidelity` now guards safe visible feedback for export/rollback/copy, while live Browser QA confirmed row click remains select-only and no reader auto-opens.
- R149 closed `QC-020`: Boards Monitor warning mode now has before/after screenshot evidence, and the Board mode / Team mode / Convention warnings segment exposes `aria-pressed` plus safe titles. `verify:uiv2-full-fidelity` guards the selected-state contract.
- R150 closed `QC-028`: Weekly Focus Last/This/Next controls now have title help and verifier-guarded selected states, and Owner action feedback is guarded for the no-owner-filter fallback. Evidence screenshots cover This week and Last week desktop states.
- R151 closed `QC-035` and `QC-036`: Settings Audit / retention now has section-anchor evidence plus trace-window selected-state guards, and Notifications now has a targeted toggle matrix proving session-only label/feedback behavior with state restored after QA.
- R152 closed `QC-003`: topbar Scope, Bell, and Docs Filter now have verifier and live-browser proof for Escape and outside-click dismissal with focus returned to the trigger.
- R153 closed `QC-093`: Review Queue no longer duplicates Refresh in route actions; the global topbar refresh icon is the single canonical refresh affordance, while Review route actions keep `Filter` only. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/review-topbar-refresh-dedup-2026-05-18.png`.
- `git diff --check` produced only existing CRLF warnings; conflict-marker scan found no matches.

## Implementation Evidence - Edit Card Modal Follow-up

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Trigger:** PM/UX live `/all` visual review found the Edit Card modal still needed UI/UX polish.  
**Scope:** Targeted desktop modal polish; no runtime/API/schema change.

Changes applied:

- The card modal close button now uses only the shared UI V2 SVG icon layer; the old pseudo-element X was disabled for this modal.
- Edit Card form labels now connect to their fields, and checklist controls use contextual accessible names.
- Modal body density, description height, checklist row rhythm, add-item row, and sticky footer spacing were tightened so key edit/checklist content is visible in the first desktop viewport.
- Delete, Cancel, Save, checklist delete, checklist item delete, checkbox, and add-item controls keep existing behavior while matching the shared compact UI V2 modal style.
- R137 follow-up closed `QC-064`: All Tasks dense rows now expose a compact visible `Edit` button with task-specific accessible labels, and the trigger opens the existing Edit Card modal without changing API/runtime/Trello behavior.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/all` confirmed: modal width `780`, horizontal overflow `0`, close SVG count `1`, old close pseudo content `none`, checklist content visible in the first viewport, close focus returns to `topbar-refresh-btn`, and console warnings/errors `0`.
- Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/edit-card-modal-desktop-2026-05-18.png`.
- R137 Browser QA confirmed 120 visible All Tasks row edit buttons, first button size around `52x24`, task-specific label, modal open on click, overflow `0`, and console warnings/errors `0`. Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/all-tasks-visible-edit-affordance-2026-05-18.png`.
- `git diff --check` produced only existing CRLF warnings; conflict-marker scan found no matches.

## Implementation Evidence - Settings Accessibility And Credential Copy

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** `UIV2-FIX-008`  
**Source rows:** `QC-008`, `QC-032`, `QC-033`, `QC-054`, `QC-066`, `UF-054`  
**Scope:** Desktop-first Settings accessibility/copy polish; no runtime/API/schema change.

Changes applied:

- Integration row controls keep compact visible labels while exposing contextual accessible names such as `Manage Trello connection draft`, `Manage Paperclip intake draft`, and `Review Cloudflare Access policy handoff`.
- Visible/Hidden board controls, workspace checkboxes, BU group controls, notification switches, and Paperclip controls now include target-specific programmatic labels.
- The connection editor now shows a `Session-only draft` boundary note and states that saving does not change live connectors, runtime credentials, or external side effects.
- Credential copy was softened from raw technical terms to private-value / write-only handoff language while preserving no-value/no-secret safety.
- Mobile More integration helper copy now uses the shared UI text font, wraps/clamps to two lines, and preserves full helper text in `title` so Trello / Cloudflare Access connection explanations do not disappear on mobile-small.
- `verify:uiv2-full-fidelity` now fails if Settings loses the session-only boundary note, contextual repeated-action labels, visible input labels, or no-raw-credential visible-copy rule.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/settings` confirmed: generic repeated action names `[]`, unnamed visible inputs `[]`, visible `API key` / `Token` / `.env` / raw OAuth error hits all false, Save draft feedback says runtime values are unchanged, horizontal overflow `0`, and console warnings/errors `0`.
- R170 targeted Playwright proof at `375x667` confirmed `.settings-mobile-more` visible, `5` integration helper rows, helper copy in Onest, non-`nowrap` wrapping, two-line clamp, matching `title` reveal text, horizontal overflow `0`, and console/page errors `0`. Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-mobile-more-helper-wrap-2026-05-18.png`.
- R173 polished the Settings copy-tone decision rows `QC-008`, `QC-032`, and `QC-053`: visible Settings copy now uses private-value/session-only language instead of alarming credential/OAuth/secret/token wording, Trello private inputs are labelled `Private connection value A/B`, and Paperclip intake mode explains that the draft is session-only and live mode is unchanged. Browser QA found unsafe visible-copy hits `0`, Paperclip Disabled pressed state plus live-mode-unchanged toast, overflow `0`, and console/page errors `0`. Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-copy-tone-session-boundary-2026-05-18.png`.
- R174 closed `QC-069` as a conservative muted-label contrast polish: production now defines the prototype `--t-eyebrow`, `--t-mono`, and `--t-mono-sm` aliases, adds scoped `--muted-label`, and guards Docs / All Tasks / Settings small-label contrast in `verify:uiv2-full-fidelity`. Browser QA on `/docs` found trace headers at contrast `6.82:1`, selected-trace eyebrow at `5.78:1`, overflow `0`, and console/page errors `0`; targeted Settings labels also measured `6.82:1`. Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/small-label-contrast-docs-2026-05-19.png`, `small-label-contrast-all-tasks-2026-05-19.png`, and `small-label-contrast-settings-2026-05-19.png`.
- R171 applied `UIV2-DEC-001` after PM/UX proceeded with desktop-first app-pane behavior. The `701-820px` range now uses compact desktop shell: status strip and sidebar stay visible, mobile bottom nav stays hidden, and route actions remain reachable. Targeted Playwright proof at `747x910` passed for `/today`, `/docs`, `/calendar`, `/all`, and `/review` with overflow `0` and console/page errors `0`; screenshots: `app-pane-route-actions-today-2026-05-18.png`, `app-pane-route-actions-docs-2026-05-18.png`, `app-pane-route-actions-calendar-2026-05-18.png`, `app-pane-route-actions-all-2026-05-18.png`, and `app-pane-route-actions-review-2026-05-18.png`.
- R172 applied `UIV2-FIX-005` after PM/UX proceeded with the conservative shared text reveal policy. Shared primitives now separate decision-critical text (`.uiv2-decision-text`: two-line clamp plus native reveal) from lower-risk metadata (`.uiv2-meta-text`: one-line ellipsis plus native reveal). Targeted Playwright proof passed for `/today`, `/all`, `/calendar`, `/planner`, and `/okr` with missing reveal count `0`, overflow `0`, and console/page errors `0`; screenshots: `text-reveal-today-2026-05-18.png`, `text-reveal-all-tasks-2026-05-18.png`, `text-reveal-calendar-2026-05-18.png`, `text-reveal-planner-2026-05-18.png`, and `text-reveal-okr-2026-05-18.png`. Calendar true-mobile agenda-first behavior remains a separate `UIV2-DEC-004` decision.
- Screenshot evidence regenerated under `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-settings-desktop-1440x900.png` and `production-settings-*.png`.
- `git diff --check` produced only existing CRLF warnings; conflict-marker scan found no matches.

## Implementation Evidence - Settings Side Navigation Anchor Feedback

**Implemented:** 2026-05-18 by Codex Frontend Dev / QA  
**Task:** Follow-up under `UIV2-FIX-008`  
**Source rows:** `QC-058`  
**Scope:** Settings desktop side-nav interaction polish only; no runtime/API/schema change.

Changes applied:

- Settings side-nav buttons now expose `aria-controls` and maintain `aria-current` for the active destination.
- Intentional side-nav clicks temporarily lock the active item during smooth scroll so the scroll observer does not jump back to an earlier section while the page is still moving.
- Target sections now use a status/topbar-aware `scroll-margin-top`, receive focus after navigation, and show a restrained UI V2 focus ring on the destination panel.

Verification:

- `node --check public/js/pages/settings.js` passed.
- Live in-app Browser targeted QA on `3032/settings` confirmed initial active section `Integrations`, `Audit / retention` and `Display` clicks set the clicked item active immediately, settled target top was about `90px`, focused section ids were `settings-audit` and `settings-display`, horizontal overflow was `0`, and console warnings/errors were `0`.
- Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-side-nav-display-anchor-2026-05-18.png`.
- R159 reconciled `QC-034` with targeted Settings board visibility evidence: visible board actions are true `button[type=button]` controls with contextual labels/titles, Onest typography, compact UI V2 geometry, and clean desktop overflow. Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-board-visibility-controls-2026-05-18.png`.
- R160 closed `QC-009` evidence organization by adding `docs/logs/screenshots/v06-uiv2-full-fidelity/SCREENSHOT_MANIFEST.md`, which separates baseline route compare screenshots, targeted desktop fix evidence, forced state fixtures, interaction-matrix captures, and whole-system QC outputs for PM/UX review.
- R161 reconciled `QC-004` with a desktop control-help audit at `docs/logs/screenshots/v06-uiv2-full-fidelity/CONTROL_HELP_AUDIT_2026-05-18.md`; visible icon/status-like/compact controls across 10 desktop routes had missing help candidates `0` under the current UI V2 `title`/`aria-label`/custom-help contract.
- R162 reconciled `QC-037` and `QC-057`: the current full-fidelity verifier uses `.mobile-route-item .nav-label`, enforces exact mobile nav labels, and keeps the Mobile More `.settings-mobile-more` route exposure check, so the older mobile-nav detector false negative is no longer a blocker.
- R163 reconciled `QC-060`: the interaction-matrix script now relies on stable ids/classes/data selectors for high-risk controls, so broad text-regex locator ambiguity is treated as closed for this evidence path.
- R164 closed the actionable portion of `QC-073`: mobile bottom nav items are now semantic `button[type=button]` controls with route-specific labels and verifier coverage. This improves keyboard access to Today / Review / Tasks / Boards / More without changing route URLs, APIs, or workflow behavior. Residual full-cycle `BODY` wrap remains logged as a broader keyboard-navigation policy risk, not a silent blocker.
- R165 expanded `QC-039` interaction evidence: the matrix now covers 19 high-risk controls and 75 default/hover/focus/click/open screenshots across global topbar/status controls and desktop route actions. The run had selector misses `0`, console/page errors `0`, overflow `0`, missing button types `0`, and enabled controls with default cursor `0`; live Browser `/docs` filter popover also passed. Residual Manual Upload Escape/focus behavior remains a focus-recovery policy follow-up, not a hidden pass.
- R166 classified `QC-077` hidden/focusable scanner output: `scripts/classify-uiv2-hidden-focusables.js` turns the fourth-pass raw total into confirmed risk, modal/drawer review, responsive review, legacy/superseded shell review, likely false/inert, and tooling-only categories. This keeps `UIV2-QA-001` evidence useful without treating every raw scanner signal as an equal blocker.
- R167 classified `QC-089` absolute/fixed scanner output: `scripts/classify-uiv2-absolute-elements.js` shows all 41 fourth-pass positioned signals are expected shell primitives, with high-z unclassified fixed surfaces `0` and unclassified positioned surfaces `0`. Future fixed/absolute findings should be escalated only with overlap/clipping/z-index evidence.
- R168 classified `QC-075` contrast/focus scanner output: `scripts/classify-uiv2-contrast-focus-heuristics.js` turns third-pass low-contrast, small-target, and generic-control heuristics into component-aware categories. Low-contrast unclassified count is `0`; generic-control unclassified count is `0`; remaining target signals are evidence prompts for density/token review rather than automatic blocker failures.
- R169 closed `QC-038` as a tooling contract row: `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-selector-contract.md` now records the stable selector rule for future sweeps and links it to the current verifier and interaction-matrix selector patterns. Broad text-regex matches must include a direct-selector follow-up before product bug escalation.
- R170 closed `QC-054` as Settings/Mobile More polish: helper copy no longer clips on mobile-small because integration helper text wraps/clamps to two lines and preserves a full-text title reveal; the full-fidelity verifier now includes this mobile Settings guard.

## Implementation Evidence - State And Action Feedback

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** `UIV2-FIX-009`  
**Source rows:** `QC-003`, `QC-005`, `QC-006`, `UF-004`, `UF-010`, `UF-015`  
**Scope:** Shared frontend feedback and selected desktop route actions; no runtime/API/schema change.

Changes applied:

- `ensureButtonTypes()` now also wires read-only `aria-disabled` controls with product-safe feedback so focusable/clickable read-only controls do not fail silently.
- Today receives the shared feedback wiring after render.
- All Tasks now gives feedback for opening Trello, moving to Today quick add, clearing filters, and the read-only Table state.
- Docs filter `Show bar` now explains that the filter surface is active and route-only.
- Calendar Day/Week/Month switches now include titles and show active-view feedback after mode changes.
- `verify:uiv2-full-fidelity` now fails if visible read-only `aria-disabled` buttons lose feedback wiring or explanatory copy.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA confirmed: All Tasks read-only Table toast `Showing table view`, Calendar week-view toast `Calendar week view active`, Docs filter-bar feedback, horizontal overflow `0`, and console warnings/errors `0`.
- Screenshot evidence regenerated under `docs/logs/screenshots/v06-uiv2-full-fidelity/`.
- `git diff --check` produced only existing CRLF warnings; conflict-marker scan found no matches.

## Implementation Evidence - Planner Source-Column Separation

**Implemented:** 2026-05-18 by Codex QA  
**Task:** Evidence follow-up under `UIV2-FIX-009` / `UIV2-QA-001`  
**Source rows:** `QC-024`  
**Scope:** Planner desktop evidence only; no runtime/API/schema change.

Evidence added:

- Live in-app Browser targeted QA on `3032/planner` confirmed the route title `Planner`, `Daily Planner` content, Google Tasks disconnected surface, Trello Deadlines source panel, horizontal overflow `0`, and console warnings/errors `0`.
- Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/planner-source-columns-desktop-2026-05-18.png`.
- This closes the stale targeted-evidence gap; broader tablet/mobile Planner source-column evidence can be added only if PM/UX requests responsive proof beyond desktop priority.

## Implementation Evidence - Calendar Readability And Action Honesty

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** `UIV2-FIX-007`  
**Source rows:** `QC-021`, `QC-042`, `QC-047`, `QC-086`, `UF-038`, `FD-011`  
**Scope:** Calendar frontend UI/action-copy/readability only; no runtime/API/schema change.

Changes applied:

- Connected Calendar create action now reads `New event draft` and explains that no Google Calendar change happens until Save.
- Calendar route and event modal include draft/save boundary copy while preserving the existing Calendar connector/API path.
- Calendar event modal labels now point to their controls, and the primary modal CTA reads `Save to Calendar`.
- Agenda rows now expose real action buttons with contextual accessible names instead of static action text.
- Month-grid event chips now expose title/aria labels, keyboard activation, focus-visible styling, and two-line readable clamps.
- `verify:uiv2-full-fidelity` now fails if Calendar loses write-boundary copy or agenda action readability.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/calendar` confirmed: `New event draft` button, route boundary note, modal boundary note, `Save to Calendar` CTA, draft-open toast, agenda action labels, chip aria/title coverage, horizontal overflow `0`, and console warnings/errors `0`.
- No save/delete action was clicked during QA, so no Trello, Calendar, Google Tasks, or Paperclip side effect was triggered by verification.

## Implementation Evidence - Docs / AI Trace Mobile Readability

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** `UIV2-FIX-006`  
**Source rows:** `QC-029`, `QC-041`, `QC-059`, `QC-071`, `QC-080`, `UF-050`, `FD-010`  
**Scope:** Docs / AI Trace mobile and app-pane readability; no runtime/API/schema change.

Changes applied:

- Docs inline source chips are now static `role=note` status chips instead of disabled buttons, avoiding body-focus dumps for readonly display-only metadata.
- Trace rows are focusable audit rows with `role="button"` / `tabindex="0"` and keep keyboard selection behavior for inspecting evidence.
- Run IDs now include a compact copy affordance, title text, and readable wrapping support so audit-critical identity remains available.
- Mobile/app-pane trace rows become stacked audit cards with run capsule, title/session, agent/env, received time, and status separated instead of compressed into the desktop table columns.
- The Docs mobile filterbar was split from the shrinking flex primitive into a non-shrinking grid layout, so search/chips reserve normal flow before the first trace card.
- `verify:uiv2-full-fidelity` now fails if Docs responsive filterbar geometry, stacked trace rows, copy affordances, or readonly chip semantics regress.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Targeted Playwright geometry at `390x844` confirmed Docs filterbar height `158`, first trace row top `426`, stacked row scroll width within client width, and horizontal overflow `0`.
- Live in-app Browser targeted QA on `3032/docs` confirmed: `2` copy buttons, `4` static status chips, disabled readonly buttons `0`, first trace row `role="button"` / `tabindex="0"`, and horizontal overflow `0`.
- Clipboard writes may be denied by the embedded browser permission model during automation, so QA did not treat clipboard mutation as a product-side effect.
- `git diff --check` produced only existing CRLF warnings; conflict-marker scan found no matches.

## Implementation Evidence - Docs Detail Reader Panel

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** Promoted `UF-050` under `UIV2-UF-001`  
**Source rows:** `UF-050`, `QC-029`, `QC-071`, `UIV2-FIX-006`  
**Scope:** Docs / AI Trace desktop-first reader drawer; no runtime/API/schema change.

Changes applied:

- Trace rows now open a right-side Docs reader drawer instead of restoring the old inline `Full document detail` disclosure.
- The drawer keeps the route table/evidence first-viewport shape intact, then shows full Markdown content, linked Review Queue task context, source evidence, source trace metadata, and audit timeline in one panel.
- `Open Review` is always an honest route action: it opens the linked Review context when a local link exists, or opens Review Queue for human-gate context when the local task is missing.
- Escape and Close return focus to the selected trace row.
- `verify:uiv2-full-fidelity` now checks that Docs rows expose reader triggers while the legacy disclosure / `#docs-viewer` surface stays absent from the route.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/docs` confirmed Markdown, linked task, evidence, audit timeline, Open Review navigation, Escape focus return, horizontal overflow `0`, and console warnings/errors `0`.
- Targeted screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-reader-detail-desktop-app-pane.png`.

## Implementation Evidence - Docs Reader Panel Polish

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** `UIV2-UF-050A` under promoted `UF-050`  
**Source rows:** `UF-050`, `QC-071`, PM/UX live visual review  
**Scope:** Docs reader drawer polish and action honesty; no runtime/API/schema change.

Changes applied:

- Reader width now behaves like a document surface instead of a narrow utility drawer, while still preserving the dimmed route context behind it.
- The metadata strip is split into labelled chips for Run, Status, Received, and Agent instead of unlabeled dense inline text.
- A reader-only safety note clarifies that the panel does not run Trello, Calendar, Google Tasks, or Paperclip live side effects.
- Side rail cards no longer flex-shrink and clip content; the rail scrolls as a column when linked task, evidence, and audit timeline exceed the viewport.
- The close icon button now uses the global compact button affordance with clearer hover/focus treatment.
- The primary Review action becomes `Open Review Queue` when the linked Review task is missing locally, avoiding the misleading impression that a missing local task will open directly.
- `verify:uiv2-full-fidelity` now opens the Docs reader and checks reader trigger, unclipped side cards, side rail overflow policy, and action copy.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/docs` confirmed side-card clipped count `0`, four metadata chips, visible safety note, `Open Review Queue` action copy for missing local task, Escape focus return, Review Queue navigation, horizontal overflow `0`, and console warnings/errors `0`.
- Targeted screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-reader-panel-polish-desktop-app-pane.png`.

## Implementation Evidence - Docs Trace Summary / Reader Separation

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** Follow-up under promoted `UF-050` and `UIV2-FIX-006`  
**Source rows:** `UF-050`, `QC-029`, `QC-071`, PM/UX overlap review  
**Scope:** Docs / AI Trace summary-vs-reader information architecture; no runtime/API/schema change.

Changes applied:

- The main route evidence card is now a compact `Selected trace` surface with `Trace summary`, source metadata, and a two-event `Audit preview`.
- The document drawer is the single full-detail surface for Markdown, linked Review task context, source evidence, and complete audit timeline.
- The route card includes an explicit `Open reader` CTA so users can move from selected trace preview to full document review without guessing.
- `verify:uiv2-full-fidelity` now fails if the route summary loses the Open reader CTA, if the summary-vs-reader labels disappear, or if `Full document content` leaks into the route summary card.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/docs` confirmed the summary card shows `Trace summary`, `Audit preview`, and `Reader holds full detail`; the summary does not contain `Full document content`; `Open reader` opens the full reader drawer; clipped side-card count `0`, horizontal overflow `0`, and console warnings/errors `0`.
- Targeted screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-trace-summary-separated-2026-05-18.png` and `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-summary-reader-separation-2026-05-18.png`.

## Implementation Evidence - Docs Reader Content Craft And Select-First Rows

**Implemented:** 2026-05-18 by Codex Dev / QA  
**Task:** Follow-up under promoted `UF-050` and `UIV2-FIX-006`  
**Source rows:** `UF-050`, `QC-029`, `QC-071`, PM/UX live reader review  
**Scope:** Docs / AI Trace reader content presentation and trace-row interaction model; no runtime/API/schema change.

Changes applied:

- Trace rows are now select-first controls: click/Enter/Space updates the selected trace and summary card without opening the reader.
- The `Open reader` CTA is the only control that opens the full document drawer from the route surface.
- Trace rows now expose `aria-pressed` selection state and labels that say `Select trace... Use Open reader...` instead of implying direct reader opening.
- The reader content area now uses a dedicated document surface, subtle reader-only safety callout, bordered Markdown card, improved heading/list spacing, and a separate evidence card.
- `verify:uiv2-full-fidelity` now fails if clicking a trace row opens the reader or if row selection fails to update the selected summary first.

Verification:

- Full JS syntax sweep passed for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js`.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- Live in-app Browser targeted QA on `3032/docs` confirmed selecting the second trace row keeps the reader closed, updates the summary to `Weekly Marketing Sync Summary`, exposes `Open reader`, then opens the reader for that selected trace only. The document surface, Markdown card, safety callout, and evidence card are visible; clipped side-card count `0`, horizontal overflow `0`, and console warnings/errors `0`.
- Targeted screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-reader-professional-polish-weekly-2026-05-18.png`.

## Implementation Evidence - Interaction Matrix Expansion

**Implemented:** 2026-05-18 by Codex QA / Frontend Dev  
**Task:** `UIV2-QA-001`  
**Source rows:** `QC-005`, `QC-075`, `QC-077`, `QC-089`, `QC-092`, `FD-014`  
**Scope:** Desktop-first browser evidence expansion; no product behavior change.

Evidence added:

- Added `scripts/capture-uiv2-interaction-matrix.js` to capture a repeatable desktop interaction matrix against the current preview.
- Captured default, hover, focus, open, clicked, readonly-feedback, and modal-open states for Scope, Docs Filter, All Tasks Due sort, Calendar Week segment, Calendar event draft, Settings integration Manage, and All Tasks readonly Table state.
- Wrote `docs/logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-results.json` and `interaction-matrix-summary.md`.
- Added 28 targeted screenshots under `docs/logs/screenshots/v06-uiv2-interaction-matrix/`.
- Linked state fixture proof back to `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`, including Review missing-owner safety, Calendar disconnected fixture, Planner Google Tasks disconnected fixture, Docs linked/orphan evidence, and Settings no-secret state.
- Added `scripts/capture-uiv2-state-fixtures.js` and package script `verify:uiv2-state-fixtures` in R154 to capture controlled desktop loading, empty, no-match, and disconnected state evidence.
- Captured Today loading, Review Queue empty, Review Queue filtered no-match, Review Queue missing-context approval guard, All Tasks filtered no-match, Docs / AI Trace filtered no-match, Calendar disconnected, and Planner disconnected screenshots under `docs/logs/screenshots/v06-uiv2-state-fixtures/`, with `uiv2-state-fixture-results.json` and `uiv2-state-fixture-summary.md`.

Verification / findings:

- `node --check scripts/capture-uiv2-interaction-matrix.js` passed.
- Running the script against `http://127.0.0.1:3032` produced console warning/error count `0`, page error count `0`, final horizontal overflow `0`, and missing button type count `0`.
- The first matrix found real evidence for later PM/UX decisions. After `UIV2-FIX-004A`, the rerun reports Calendar Week segment `cursor=pointer`, statusbar focusable groups `0`, grouped status details ready `true`, enabled controls with default cursor `{}`, and Settings integration active state `trello`.
- `node --check scripts/capture-uiv2-state-fixtures.js` passed.
- `npm.cmd run verify:uiv2-state-fixtures` passed for all 8 forced desktop states after correcting QA-script issues in the Calendar disconnected mock response shape and Review missing-context visible selector; this changed only the evidence script, not runtime/API behavior.
- R155 closeout verification passed `npm.cmd test` 28/28, `$env:PORT='3032'; npm.cmd run check:all`, `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression`, and `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity`. Live Browser `/docs` confirmed one `Open reader` CTA, reader drawer opening/closing, overflow `0`, and console warning/error count `0`. Evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/docs-live-r154-reader-qa-2026-05-18.png`.
- The matrix is evidence only. Automated PASS and screenshot presence do not equal PM/UX visual acceptance.

## PM/UX Decision Packet

**Created:** 2026-05-18 by Codex PM / UX Owner  
**Artifact:** `docs/design/ui-design-v2/UI_V2_PM_UX_REVIEW_DECISION_PACKET.md`  
**Status:** Superseded by implemented `UIV2-FIX-004A`; PM/UX visual re-review pending

The packet consolidates the completed review-pending fixes, interaction-matrix evidence, and remaining decision rows into one short PM/UX review surface. It recommends:

- Accepting or iterating the completed review-pending fixes: `UIV2-FIX-001`, `UIV2-FIX-002`, `UIV2-FIX-003`, `UIV2-FIX-006`, `UIV2-FIX-007`, `UIV2-FIX-008`, `UIV2-FIX-009`, `UIV2-QA-001`, and the Edit Card modal follow-up.
- Approving `UIV2-DEC-005` with compact visuals plus larger effective hit areas before opening interaction-affordance work.
- Approving `UIV2-DEC-003` with one grouped keyboard-focusable `Status details` control plus pointer hover/focus descriptions for individual atoms.
- Opening `UIV2-FIX-004A - Global Interaction Affordance Token Pass` after those PM/UX decisions are explicit. This is now implemented and awaiting PM/UX visual re-review.

`UIV2-FIX-004A` was opened and implemented after PM/UX proceeded with the recommended decisions. Dev should now hold broad UI changes until PM/UX accepts, iterates, or selects the next specific backlog row.

## Implementation Evidence - Global Interaction Affordance Token Pass

**Implemented:** 2026-05-18 by Codex Frontend Dev / QA  
**Task:** `UIV2-FIX-004A` under `UIV2-FIX-004`  
**Decision rows applied:** `UIV2-DEC-003`, `UIV2-DEC-005`  
**Source rows:** `QC-083`, `QC-084`, `QC-088`, `QC-091`, `QC-092`, `UF-003`, `UF-011`, `UF-012`, `FD-007`  
**Scope:** Shared frontend interaction tokens and status-strip help model; no runtime/API/schema change.

Changes applied:

- Status strip now keeps pointer hover descriptions on telemetry atoms but removes individual keyboard tab stops.
- Added one grouped keyboard-focusable `Status details` button with a combined safe description for env, build, workspace, Trello, Google Calendar, Paperclip, Google Tasks, and last sync.
- Added shared pointer/hover/focus/active styling for enabled buttons, icon buttons, filter chips, segmented controls, sortable headers, Calendar agenda/event controls, and role-button primitives.
- Added compact effective-hit-area tokens: `32px` desktop target and `40px` touch target where feasible without changing the visible UI V2 density.
- Settings integration buttons now keep one visible active state with `aria-pressed=true`.
- `verify:uiv2-full-fidelity` now checks the grouped status details model, Calendar segment cursor/focusability, and Settings integration pressed state.
- `capture-uiv2-interaction-matrix.js` now records statusbar focusable group count, status details readiness, and enabled controls with default cursor.

Verification:

- `node --check public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, `scripts/verify-uiv2-full-fidelity.js`, and `scripts/capture-uiv2-interaction-matrix.js` passed.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; node scripts\capture-uiv2-interaction-matrix.js` passed with console warning/error count `0`, page error count `0`, final horizontal overflow `0`, missing button type count `0`, statusbar focusable groups `0`, status details ready `true`, and enabled controls with default cursor `{}`.
- In-app Browser spot-check on `3032/today`, `/calendar`, and `/settings` confirmed status details type `button`, cursor `help`, description length `964`, Escape focus return to `statusbar-details`, Calendar Week cursor `pointer`, Calendar Week active toast `Calendar week view active`, Settings Trello integration active with `aria-pressed=true`, horizontal overflow `0`, and console warnings/errors `0`.
- `git diff --check` produced only Windows CRLF warnings; conflict-marker scan found no matches.

Status:

- PM/UX Review Pending. Automated PASS is evidence only; PM/UX still decides accept / iterate / defer.

## Implementation Evidence - Today Row Action Discoverability

**Implemented:** 2026-05-18 by Codex Frontend Dev / QA  
**Task:** Follow-up under `UIV2-QA-001` and `UIV2-FIX-004`  
**Source rows:** `QC-011`, related future decision row `QC-017`  
**Scope:** Today desktop task-row affordance only; no runtime/API/schema change.

Changes applied:

- Today work rows now include a compact visible `Open` action with task-specific accessible names and titles.
- Row focus-within state now shows a restrained UI V2 background and cobalt inset cue, while preserving compact row density.
- The `Open` row action uses the existing Edit Card modal path and does not change Trello writes, APIs, stores, or row data flow.
- `verify:uiv2-full-fidelity` now checks that populated Today task rows expose visible button affordances with labels, titles, and usable dimensions.

Verification:

- `node --check public/js/pages/today.js` passed.
- `node --check scripts/verify-uiv2-full-fidelity.js` passed.
- Full JS syntax sweep for `public/app.js`, `public/js/router.js`, `public/js/utils.js`, `public/js/pages/*.js`, and `scripts/verify-uiv2-full-fidelity.js` passed.
- `npm.cmd test` passed 28/28.
- `$env:PORT='3032'; npm.cmd run check:all` passed.
- `$env:PORT='3032'; npm.cmd run verify:rux-browser-regression` passed.
- `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3032'; npm.cmd run verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs after scoping the Today row-action guard to desktop viewports.
- `git diff --check` produced only Windows CRLF warnings; conflict-marker scan found no matches.
- In-app Browser QA on `http://127.0.0.1:3032/today` confirmed 8 visible row actions, first action `68x28`, task-specific label/title, focus state opacity `1`, row focus cue active, `Open` opens the selected task in Edit Card, modal close returns to the route, overflow `0`, and console warnings/errors `0`.
- Screenshot evidence: `docs/logs/screenshots/v06-uiv2-full-fidelity/today-row-focus-open-action-2026-05-18.png` and `docs/logs/screenshots/v06-uiv2-full-fidelity/today-row-hover-actions-2026-05-18.png`.

Status:

- PM/UX Review Pending. This closes `QC-011`; broader modal-vs-drawer policy remains under `QC-017`.

## Verification Commands

Docs/task creation checks:

```powershell
rg "UIV2-(FIX|DEC|QA|UF)-" docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md
rg "QC-|FD-|UF-" docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md
rg "^(<<<<<<<|=======|>>>>>>>)" CURRENT_SPRINT.md docs/design/ui-design-v2 docs/logs docs/plans
git diff --check
```

Required for later selected Dev fixes:

```powershell
node --check public/app.js
node --check public/js/router.js
node --check public/js/utils.js
node --check public/js/pages/*.js
npm.cmd test
$env:PORT='3030'; npm.cmd run check:all
$env:PORT='3030'; npm.cmd run verify:rux-browser-regression
$env:PORT='3030'; npm.cmd run verify:uiv2-full-fidelity
```

## Boundary

This backlog does not create Trello cards and does not authorize runtime/API/schema/secrets/Cloudflare/Paperclip live behavior/AI harness/Trello/Calendar/Google Tasks side effects/Team OS product scope/Full Rewrite work. It is a PM-controlled repo backlog for choosing the next UI V2 frontend/design-system slice.
