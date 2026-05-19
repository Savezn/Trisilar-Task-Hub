# UI V2 PM/UX Review Decision Packet

**Status:** PM/UX accepted with logged visual deferrals for PR to `dev`; R185 main-readiness hardening is complete; R182 Today scope summary remains rejected/rolled back  
**Owner:** PM / UX Owner  
**Created:** 2026-05-18  
**Branch / Worktree:** `codex/v06-uiv2-full-fidelity` / `trisilar-task-hub-v06-uiv2-qa`

This packet converts the latest UI V2 evidence into review outcomes and decision-ready recommendations. It does not authorize broad restyling by itself. Generated PASS and screenshot evidence remain supporting proof; final acceptance still needs PM/UX visual review.

## Evidence Reviewed

- `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-summary.md`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-results.json`
- `docs/design/ui-design-v2/UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`
- `docs/design/ui-design-v2/UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md`
- `docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md`
- R170 `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-mobile-more-helper-wrap-2026-05-18.png`
- R171 `docs/logs/screenshots/v06-uiv2-full-fidelity/app-pane-route-actions-{today,docs,calendar,all,review}-2026-05-18.png`
- R172 `docs/logs/screenshots/v06-uiv2-full-fidelity/text-reveal-{today,all-tasks,calendar,planner,okr}-2026-05-18.png`
- R173 `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-copy-tone-session-boundary-2026-05-18.png`
- R174 `docs/logs/screenshots/v06-uiv2-full-fidelity/small-label-contrast-{docs,all-tasks,settings}-2026-05-19.png`
- R175 `docs/design/ui-design-v2/UI_V2_DESKTOP_PM_UX_REREVIEW_2026_05_19.md`
- R176 live PM/UX iterate on sidebar Scope intent: production now hides workspace-placeholder groups such as `Trisilar` from the sidebar/topbar BU filter model and shows a `Configure BUs` action when no meaningful BU groups exist.
- R177 live PM/UX iterate on Settings BU group action wording: the panel action now says `Add BU group` instead of `Edit groups`, while edit behavior remains inline in the group rows.
- R178 live PM/UX iterate on Scope source: sidebar/topbar Scope now derives from Team mode labels (`monitorTeams`) and filters cards by matching Trello labels, rather than deriving from board-based BU groups.
- R179 live PM/UX iterate on Scope clearing: clicking the active sidebar Scope label toggles it off and returns the shell to `All BUs`.
- R180 live PM/UX iterate on desktop segment controls and OKR context: All Tasks and Today route-local segments now change real UI state, and OKR / Portfolio is split into `Objective Scorecard` plus `Quarter Execution Plan` with dynamic cycle labels.
- R181 live PM/UX iterate on All Tasks filter/sort context: the route now shows current view, sort, scope, local filters, row count, and reset controls.
- R182 PM/UX rejected/rolled back: the proposed Today selected-scope summary duplicated topbar/sidebar Scope and should not be restored without a new PM/UX decision.
- R183 live PM/UX iterate on Weekly Focus Review AI: the Review AI lane now explains the human-gate workflow and keeps execution decisions in Review Queue.
- R184 live PM/UX iterate on route action feedback: global refresh now shows route-specific refreshing/completion feedback plus scope and last-sync context.
- R185 main-readiness hardening: tests, check:all, RUX regression, full-fidelity, state fixtures, and interaction matrix pass on `3035`; see `docs/plans/VERSION_0_6_UI_V2_MAIN_READINESS_PACKET.md`.
- PM/UX proceed signal on 2026-05-19 converts this packet from review-pending to accept-with-deferrals for a draft PR to `dev`.

## PM/UX Pre-Review Outcome

| Item | Evidence | Pre-review outcome | Rationale | Next action |
|---|---|---|---|---|
| `UIV2-FIX-001` Hidden/zero-size cleanup | R118, full-fidelity audit | Accept candidate | Hidden/legacy surfaces are inerted and scanner evidence no longer blocks core route use. | PM/UX visual spot-check, then accept or log a narrow follow-up. |
| `UIV2-FIX-002` Focus recovery | R118, interaction matrix | Accept candidate | Scope, Docs Filter, Calendar draft modal, and fixed readonly patterns return focus to useful controls. | PM/UX visual/keyboard spot-check. |
| `UIV2-FIX-003` Button/semantic hygiene | R118, All Tasks sort evidence | Accept candidate | Button types and `aria-sort` are now covered by DOM and interaction evidence. | Keep as regression guard. |
| Edit Card modal follow-up | R119 screenshot | Accept candidate | The modal is visually cleaner, the double close icon is gone, and checklist controls fit the desktop viewport better. | PM/UX visual spot-check on `/all`. |
| `UIV2-FIX-006` Docs mobile readability | R123, Docs mobile geometry | Accept candidate for mobile readability | Filterbar now reserves normal flow, trace rows stack as audit cards, and readonly chips are static notes. | Keep `QC-030` and `QC-071` separate for filter-state and desktop long-ID policy. |
| `UIV2-FIX-007` Calendar action honesty | R122, Calendar screenshots | Accept candidate for copy/safety | `New event draft` and boundary copy are honest without adding live writes. | Calendar mobile readability remains a separate decision under `UIV2-DEC-004`. |
| `UIV2-FIX-008` Settings accessibility/copy | R120, R170, R173, Settings screenshots | Accept candidate | Settings actions are contextual, labels are programmatic, visible copy now avoids raw/alarming sensitive terms, and Mobile More helper copy no longer clips at `375x667`. | PM/UX copy tone and mobile More spot-check. |
| `UIV2-FIX-009` State/action feedback | R121, interaction proof | Accept candidate | Readonly and draft-only actions now explain themselves with product-safe feedback. | Keep in regression. |
| `UIV2-QA-001` Interaction matrix | R124, 28 screenshots | Accept evidence pack | Matrix adds hover/focus/open/clicked proof and state fixture index. | Use as input to design-system decisions. |
| `UIV2-FIX-005` Shared text reveal | R172 targeted screenshots | Accept candidate | Decision-critical text now has a two-line clamp plus native reveal across Today, All Tasks, Calendar, Planner, and OKR; metadata gets one-line ellipsis plus reveal. | PM/UX visual spot-check desktop density and Calendar event-chip readability. |
| `QC-069` Muted small-label contrast | R174 targeted screenshots and verifier guard | Accept candidate | Docs trace headers, Settings section labels, and controlled All Tasks table headers now use readable muted-label treatment while preserving compact UI V2 restraint. | PM/UX visual spot-check whether label tone still feels sufficiently subtle. |
| Sidebar Scope intent | R176 PM/UX iterate on `/boards` | Iterate applied | Prototype Scope is a BU quick-filter surface, while workspace context already lives in the black status strip. A single `Trisilar` workspace placeholder under Scope was misleading and is now filtered out. | PM/UX visual spot-check sidebar Scope and Settings BU group setup path. |
| Settings BU action wording | R177 PM/UX iterate on `/settings` | Iterate applied | The previous `Edit groups` button actually created a new group, so the label was dishonest. It now reads `Add BU group`, with helper copy that existing groups are edited inline. | PM/UX visual spot-check the Settings BU group panel. |
| Scope source model | R178 PM/UX iterate on `/boards` | Iterate applied | PM/UX clarified Scope should be set from Team mode labels, not board groups. Scope now uses `monitorTeams`, filters card surfaces by matching Trello labels, and keeps BU groups as a separate board-organization Settings surface. | PM/UX visual spot-check Team mode labels in sidebar Scope and topbar Scope menu. |
| Scope clear interaction | R179 PM/UX iterate on `/all` | Iterate applied | Sidebar Scope was acting like a one-way radio selection. Active labels now toggle off on repeat click, returning to `All BUs`, with selected-state title/aria updated. | PM/UX spot-check repeat-click clear behavior on All Tasks and Boards Monitor. |
| All Tasks view segment | R180 PM/UX iterate on `/all` | Iterate applied | The prototype segment looked like a control but `List`, `Group by board`, and `Group by owner` were disabled. They now change active state and route layout/grouping. | PM/UX spot-check table/list/group density on desktop. |
| Today work segment | R180 PM/UX iterate on `/today` | Iterate applied | The `All / Mine / Risky` segment looked clickable but was disabled. It now filters today's visible due/upcoming work with honest empty states. | PM/UX spot-check whether `Mine` copy is acceptable while personal identity is not inferred. |
| OKR page information architecture | R180 PM/UX iterate on `/okr` | Iterate applied | The old `Q2 2026 - mid-quarter` hero read as hardcoded. The page title returns to `OKR / Portfolio`, the current quarter appears as route context, and route content is split into `Objective Scorecard` and `Quarter Execution Plan`. | PM/UX decide if these section names should be kept or renamed before final acceptance. |
| All Tasks filter/sort context | R181 PM/UX iterate on `/all` | Iterate applied | After enabling view modes, the route still needed a clear explanation of current view, sort, local filters, and recovery path. The new context strip makes the current table/list state visible and resettable. | PM/UX spot-check whether the strip density feels right above the table. |
| Today selected-scope summary | R182 PM/UX review on `/today` | Rejected / rolled back | The summary duplicated existing topbar/sidebar Scope controls and consumed first-viewport attention before the work grid. | Keep scope control in topbar/sidebar; only revisit if PM/UX requests a lighter helper inside the existing Scope menu. |
| Weekly Focus Review AI explainer | R183 PM/UX iterate on `/focus` | Iterate applied | Review AI lane was visually accurate but still conceptually terse. The new compact explainer clarifies that Weekly Focus is planning-only for AI proposals, while approve/reject/hold/edit stays in Review Queue before Trello execution. | PM/UX spot-check copy density inside the Review AI lane. |
| Global refresh feedback | R184 PM/UX iterate on `/all` | Iterate applied | Users need confirmation after refresh, but another persistent context strip would add noise. Refresh now gives transient route/scope/last-sync feedback and restores the icon button state after completion. | PM/UX spot-check toast wording and whether the transient pattern should be reused for export/filter actions. |
| Main-readiness hardening | R185 QA sweep | Accept candidate | Core test, route, state, and interaction evidence is green on the current QA port. The interaction matrix was updated to match current All Tasks filter chips and now has no selector misses. | PM/UX final visual accept or explicit deferral, then commit/PR/merge hygiene. |

## Decision Recommendations

| Decision | Recommended choice | Why | Converts into |
|---|---|---|---|
| `UIV2-DEC-005` Density vs ergonomics | Approve compact visuals with larger effective hit areas: `32px` desktop minimum, `40px` touch target where feasible. | This preserves UI V2 density while reducing fragile controls. Evidence shows segment buttons, check controls, and status/help items still feel too small or static. | Makes `UIV2-FIX-004` Ready for Dev. |
| `UIV2-DEC-003` Status strip help model | Use one grouped keyboard-focusable `Status details` control, while preserving hover/focus descriptions for pointer users on individual atoms. | Current status atoms are useful but create too many tiny tab stops before work controls. | Opens a narrow status-strip accessibility slice. |
| `UIV2-DEC-001` App-pane action model | Applied: treat `747px` app-pane as compact desktop, not true mobile. Keep high-priority route actions visible in the topbar action slot. | Desktop users often work split-screen; hiding route actions behind mobile-like behavior hurts productivity. | PM/UX visual re-review of the implemented compact-desktop shell. |
| `UIV2-DEC-004` Calendar mobile layout | Defer until desktop review closes; likely choose agenda-first for mobile/app-pane later. | Calendar event-chip readability remains real, but desktop is the current priority. | Later Calendar responsive slice. |
| `UIV2-DEC-002` Mobile hamburger policy | Defer; bottom nav + More should remain the default unless mobile review finds missing secondary access. | Mobile is lower priority than desktop for the current team workflow. | Later mobile shell cleanup. |

## Proposed Next Dev Slice After PM Decision

PM/UX proceeded with the recommended choices for `UIV2-DEC-005` and `UIV2-DEC-003`, so this slice is now implemented and ready for visual re-review:

**`UIV2-FIX-004A - Global Interaction Affordance Token Pass`**

Scope:

- Apply pointer cursor only to real enabled controls.
- Add visible hover/focus/active tokens to segments, filter chips, icon buttons, table controls, and route actions.
- Add invisible hit-area expansion where possible without changing visual density.
- Preserve fixed evidence point: Calendar Week segment now reports `cursor=pointer`.
- Keep readonly/disabled controls honest with `cursor: help`, `not-allowed`, or explanatory copy.

Acceptance:

- Calendar/Planner/OKR/Settings segments feel interactive and expose focus state.
- All Tasks sort and row controls keep compact UI but have safer effective hit areas.
- Status strip keyboard model follows the PM/UX decision, not eight required tiny tab stops.
- Interaction matrix rerun shows no `cursor=default` on enabled controls selected for the slice.
- No runtime/API/schema/secrets/external side effects.

## Implementation Update - 2026-05-18

`UIV2-FIX-004A` is implemented as a narrow global interaction-affordance token pass:

- Status strip now uses one grouped keyboard-focusable `Status details` button while individual telemetry atoms keep pointer hover descriptions.
- Enabled buttons, icon buttons, chips, segments, sortable headers, Calendar event chips, and route actions now share pointer/hover/focus/active treatment.
- Compact controls keep UI V2 visual density while gaining desktop/touch effective hit-area tokens.
- Calendar Week segment now reports pointer cursor and active `aria-pressed=true` after click.
- Settings integration buttons expose one active `aria-pressed=true` state.

Evidence:

- `docs/logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-summary.md`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-results.json`
- Browser spot-check on `3032/today`, `/calendar`, and `/settings`: overflow `0`, console warnings/errors `0`, statusbar focusable groups `0`, status details focus return preserved, Calendar Week active toast shown, Settings Trello integration active.

## Implementation Update - R171 App-Pane Compact Desktop

`UIV2-DEC-001` is implemented as a narrow responsive-shell policy:

- `701-820px` now behaves as compact desktop, not true mobile.
- Status strip and sidebar stay visible in the app pane.
- Mobile bottom nav and mobile drawer toggle stay hidden in the app pane.
- Topbar route actions remain reachable for Today, Review Queue, All Tasks, Calendar, and Docs / AI Trace.

Evidence:

- `docs/logs/screenshots/v06-uiv2-full-fidelity/app-pane-route-actions-today-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/app-pane-route-actions-docs-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/app-pane-route-actions-calendar-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/app-pane-route-actions-all-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/app-pane-route-actions-review-2026-05-18.png`
- `verify:uiv2-full-fidelity` now guards compact shell and route-action reachability at app-pane width.

## Implementation Update - R172 Shared Text Reveal Policy

`UIV2-FIX-005` is implemented as a conservative shared data-readability policy:

- Decision-critical titles use `.uiv2-decision-text`: two-line clamp, normal wrapping, and native `title` / accessible reveal.
- Low-risk metadata uses `.uiv2-meta-text`: one-line ellipsis plus native reveal.
- Today, All Tasks, Calendar, Planner, and OKR now use the shared classes for task titles, next actions, board/list metadata, event chips, Planner rows, and KR names.
- Calendar event chips keep month-grid composition but gain focusable/readable reveal through `data-uiv2-reveal='calendar-event'`, `title`, and `aria-label`.
- True-mobile Calendar agenda-first behavior remains deferred under `UIV2-DEC-004`.

Evidence:

- `docs/logs/screenshots/v06-uiv2-full-fidelity/text-reveal-today-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/text-reveal-all-tasks-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/text-reveal-calendar-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/text-reveal-planner-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/text-reveal-okr-2026-05-18.png`
- `verify:uiv2-full-fidelity` now guards the shared text reveal contract.

## Implementation Update - R173 Settings Copy Tone

`QC-008`, `QC-032`, and `QC-053` are implemented as a Settings copy-tone and session-boundary polish:

- Visible Settings copy now uses `private value`, `write-only handoff`, `stored private values`, and `session-only draft` instead of alarming credential/OAuth/secret/token wording.
- Trello editor private inputs are labelled as `Private connection value A/B` and remain empty/write-only.
- The integration editor states that Save draft updates the screen only and does not change live connectors, stored private values, or external side effects.
- Paperclip intake mode now has a visible `Session-only draft. Live Paperclip intake is unchanged.` note, larger scoped controls, and live-mode-unchanged toast feedback.

Evidence:

- `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-copy-tone-session-boundary-2026-05-18.png`
- Browser QA on `/settings` found unsafe visible-copy hits `0`, overflow `0`, and console/page errors `0`.
- `verify:uiv2-full-fidelity` now guards the Settings visible-copy and Paperclip session-only controls.

## Implementation Update - R174 Muted Small-Label Contrast

`QC-069` is implemented as a conservative design-system token polish:

- Production CSS now defines the prototype typography token aliases used across the UI: `--t-eyebrow`, `--t-mono`, and `--t-mono-sm`.
- Small operational labels use a scoped `--muted-label` tone instead of the too-light `--ink-4` treatment.
- Docs trace headers, Docs inspection eyebrows, All Tasks populated table headers, Settings section labels, stat labels, and modal field labels keep compact sizing but meet readable contrast on light panels.
- `verify:uiv2-full-fidelity` now guards readable small-label contrast for Docs, All Tasks, and Settings desktop states.

Evidence:

- `docs/logs/screenshots/v06-uiv2-full-fidelity/small-label-contrast-docs-2026-05-19.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/small-label-contrast-all-tasks-2026-05-19.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/small-label-contrast-settings-2026-05-19.png`
- Browser QA on `/docs` found Docs header label contrast `6.82:1`, selected-trace eyebrow contrast `5.78:1`, overflow `0`, and console/page errors `0`.
- Controlled `verify:uiv2-full-fidelity` passed for 10 desktop routes and 5 mobile tabs, including populated All Tasks header coverage.

## Hold / Do Not Start Yet

- Do not treat `UIV2-FIX-005` as PM/UX accepted yet; R172 implements the conservative policy and now needs visual re-review.
- Do not open Calendar mobile agenda-first changes until `UIV2-DEC-004` is accepted.
- Do not open command palette, saved views, task drawer, or connection wizards in V0.6 unless PM creates separate product scope.
- Do not mark PM/UX final acceptance solely from automated PASS.
- After R185, new optional UI improvements should stay frozen until after main unless PM/UX identifies a true blocker. Further Dev work should start only after PM/UX accepts/iterates a review-pending fix or chooses one of the remaining decision rows below.

## PM/UX Decision Needed

The next meaningful action is a PM/UX choice:

1. Review the R175 desktop re-review pack.
2. Accept, iterate, or hold the completed desktop review-pending batch.
3. If accepted, move toward merge-review readiness for the desktop V0.6 UI V2 batch.
4. Defer mobile-heavy decisions until after desktop route review closes, unless PM/UX explicitly promotes one.

### Current Decision Queue After R174

| Priority | Decision | Recommended PM/UX choice | Why now |
|---|---|---|---|
| 1 | Mobile hamburger policy: `UIV2-DEC-002`, `QC-002` | Defer until desktop gate closes; likely remove/hide hamburger only if More covers all secondary routes. | Mobile is secondary for this team, and removing navigation affordances needs a quick PM/UX route-access check. |
| 2 | Calendar mobile layout: `UIV2-DEC-004`, `QC-042`, `QC-086` | Defer desktop-first; likely agenda-first on true mobile later. | R172 fixed desktop/app-pane reveal affordance; true mobile route composition remains a separate decision. |
