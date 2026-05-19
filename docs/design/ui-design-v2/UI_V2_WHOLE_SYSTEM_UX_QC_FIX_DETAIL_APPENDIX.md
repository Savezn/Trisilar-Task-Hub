# UI V2 Whole-System UX QC Fix Detail Appendix

**Status:** Fourth-pass micro-detail appendix complete; use with `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`.
**Owner:** UX Owner / QA
**Created:** 2026-05-18
**Last updated:** 2026-05-18 by Codex UX Owner / QA

This appendix expands the micro-ledger into fix-level detail. It is intentionally more granular than the route/component parity audit: the goal is to explain what the user feels, why it matters, and exactly what a future UI fix should prove.

## Evidence Used

- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-fourth-pass-results.json`
- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-fourth-pass-summary.md`
- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc4-*.png`
- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc4-scope-enter-open-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc4-scope-space-open-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc4-docs-readonly-chip-click-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc3-hidden-modal-inspection.json`

## How To Read Fourth-Pass Signals

The fourth pass is deliberately sensitive. Some signals are heuristics, not automatic product failures.

| Signal | Treat as | Why |
| --- | --- | --- |
| `display:none` hidden controls | Tooling / low priority unless focusable in a real tab sequence | The element is normally removed from layout and accessibility tree, but the scanner records it because it has focusable markup. |
| `zeroRect_visibleTree` controls | Real UX/accessibility risk | The element is not visible, but CSS says it is visible, pointer-enabled, and focusable. This can create odd focus, hit testing, or assistive-tech behavior. |
| `opacityZero_visibleTree` controls | Real UX/accessibility risk | Invisible surfaces can remain active if not `aria-hidden`, `inert`, or unmounted. |
| Small target counts | UX risk, not always a blocker | Prototype density is compact, but repeated 14-24px interactive targets feel fragile in operational use. Add invisible hit area before enlarging visuals. |
| Clipping counts | Real readability risk when text is decision-critical | One-line metadata can clip; titles, run IDs, task intent, and KR names should have tooltip, copy, or two-line policy. |
| Duplicate accessible names | Accessibility and command-search risk | `Manage`, `Visible`, `Mark done`, and `Open KR detail` need target context even if the visual label stays short. |

## Micro-Fix Detail Cards

### FD-001 - Hidden/Zero-Size Controls

**Related rows:** QC-063, QC-076, QC-077, QC-087

**What the user may feel:** Keyboard focus can appear to vanish, shortcut/search interactions feel inconsistent, and screen-reader users may encounter controls that are not visually present.

**Evidence:** Fourth-pass categorization found `1,608` `zeroRect_visibleTree` candidates, `130` modal/modal-child zero-size candidates, and `6` opacity-zero visible-tree candidates. Repeated examples include `#manage-btn`, `#refresh-btn`, `#toggle-hidden-btn`, hidden modal close/save/delete controls, card fields, Google Calendar setup fields, and All Tasks row check controls in responsive states.

**Why it matters:** UI V2 currently looks clean in screenshots, but hidden active DOM can degrade keyboard/screen-reader reliability. It also makes automated QA noisy because the scanner cannot distinguish intentional hidden routes from stale interactive shells.

**Minimum fix:** For every closed modal/drawer/legacy global control, apply one of these states consistently: `hidden`, `aria-hidden="true"`, `inert`, `tabindex="-1"` for focusable children, and `pointer-events:none`; or unmount the body until opened.

**Better fix:** Create one shared `setSurfaceOpen(surface, open)` helper used by modal, drawer, popover, and legacy global controls. The helper should handle visual class, inert state, `aria-hidden`, focus trap activation, Escape close, and focus return.

**QA proof:** Tab through `/today`, `/all`, `/docs`, and `/settings` with modals closed. No 0x0 controls should receive focus. Scanner should show only expected `display:none` candidates or fewer than a small agreed threshold.

### FD-002 - Popover Focus Return

**Related rows:** QC-003, QC-045, QC-078, QC-090

**What the user may feel:** After closing Notifications or a disabled chip attempt, focus drops to the page body. Keyboard users lose their place and may need to start tabbing from the top of the app.

**Evidence:** Fourth-pass `notifications-escape-focus-return` opened the notification popover but Escape left active focus on `BODY`. `docs-readonly-chip-click` also left focus on `BODY` after a disabled chip click attempt.

**Why it matters:** The topbar is a command surface. Opening a menu and pressing Escape should return the user exactly to the trigger that opened it.

**Minimum fix:** On close, call a shared focus-return path for `#topbar-notifications-btn`, `#topbar-scope-picker`, `#docs-topbar-filter`, and any route-local popup trigger.

**Better fix:** Store `lastTrigger` when a popover opens. On Escape, outside click, route change, or mutual-dismiss, return focus to `lastTrigger` if it still exists and is enabled.

**QA proof:** For Scope, Docs Filter, Notifications, Calendar month controls, Settings editor menus, and any modal close button: open -> Escape -> `document.activeElement` is the trigger. Repeat with outside click.

### FD-003 - Scope Picker Semantics

**Related rows:** QC-079

**What the user may feel:** Scope now works with click, Enter, and Space, but it still behaves like a custom div. Keyboard support is there; semantic support is not as strong as it could be.

**Evidence:** Fourth-pass `scope-keyboard-open` passed for Enter and Space. Scanner still finds one `div role=button` on every desktop route: `.scope-pick`.

**Why it matters:** Native `<button>` semantics give focus, disabled, click, key, and accessibility behavior for free. Custom `div role=button` needs more edge-case maintenance.

**Minimum fix:** Convert `.scope-pick` to `<button type="button">` while keeping the same visual class and `aria-haspopup="listbox"`.

**Better fix:** Use a proper combobox/listbox pattern: trigger button, `aria-expanded`, `aria-controls`, listbox options with selected state, Escape/outside-click close, and focus return.

**QA proof:** Scope opens with click, Enter, and Space; closes with Escape; screen-reader name says current scope and action; selected BU is announced; no visual regression in the topbar.

### FD-004 - Disabled / Readonly Controls

**Related rows:** QC-006, QC-080, QC-082

**What the user may feel:** Some chips look like filters, but clicking them does nothing because they are disabled. The browser prevents click, but the UI does not always explain the reason or retain focus in a helpful place.

**Evidence:** `button.is-readonly` in Docs has `disabled: true`, `cursor: not-allowed`, and title copy, but no `aria-disabled` and focus falls to `BODY` after attempted interaction.

**Why it matters:** Disabled controls are honest only if the user can tell why they are disabled and what they can do instead.

**Minimum fix:** If a chip is purely informational, render it as a non-button `<span class="chip is-readonly">`. If it must remain a button, keep `disabled`, add a nearby explanation, and avoid styling it like the primary active filter.

**Better fix:** Split chip primitives into three classes: `filter-chip` for real filters, `status-chip` for readonly state, and `choice-chip` for segmented choices.

**QA proof:** Disabled/read-only chips are not in the tab order unless there is an accessible explanation pattern. Tooltips or helper text explain why the chip is fixed.

### FD-005 - Sort Header State

**Related rows:** QC-072, QC-081

**What the user may feel:** The All Tasks table visually changes from `TASK` to `TASK ↑`, but assistive tech and automated command systems cannot know which column is sorted.

**Evidence:** Fourth-pass `all-sort-header-state` changed visible text to `TASK ↑`; `ariaSort` and `ariaPressed` stayed `null`. Scanner reports `10` sort headers missing `aria-sort` across desktop/app-pane.

**Why it matters:** Sort is a data-operation affordance. The active sort must be visible, programmatic, and reversible.

**Minimum fix:** Put `aria-sort="ascending|descending|none"` on the owning `<th>` for each sortable column and update it when the user changes sort.

**Better fix:** Keep the button label stable (`Task`) and expose current state through `aria-sort`, a visually hidden `Sorted ascending` suffix, and a visible arrow with consistent spacing.

**QA proof:** Click Task, Due, Status headers. Visual arrow updates, only one column owns active `aria-sort`, and the row order changes or stays clearly explained if data is unchanged.

### FD-006 - Button Type Hygiene

**Related rows:** QC-082

**What the user may feel:** Usually no visible issue, but inside forms/modals an untyped button can submit unexpectedly or interfere with Enter-key workflows.

**Evidence:** Fourth pass found `59` visible buttons without explicit `type`, including topbar refresh/notifications, Calendar controls, Planner Settings CTAs, Calendar New event, and Weekly Focus Open queue.

**Why it matters:** V0.6 has modals and route-level forms. A missing `type="button"` is a small bug seed that becomes expensive once forms grow.

**Minimum fix:** Add `type="button"` to every non-submit button. Keep `type="submit"` only for actual form submit controls.

**Better fix:** Add a small helper for button HTML generation that always emits a type unless intentionally omitted with a review comment.

**QA proof:** Static scan for `button` without `type` returns zero for visible app controls, or a documented allowlist.

### FD-007 - Cursor / Hover / Target Consistency

**Related rows:** QC-043, QC-044, QC-056, QC-083, QC-084, QC-088, QC-091

**What the user may feel:** Some buttons look clickable but keep the default cursor, some tiny targets are hard to hit, and some state segments do not give enough hover/focus feedback.

**Evidence:** Fourth pass found `771` small target hits and `91` cursor-default buttons. High-volume examples include All Tasks `Mark done` `14x14`, OKR `Open KR detail`, app-pane/mobile topbar controls `32x32`, status-strip focus items `18px` high, Settings visibility buttons, Planner/OKR segments, Calendar prev/next, and Settings `18px` mode segments.

**Why it matters:** Desktop is the team priority, but the product is still operational software. Repeated tiny targets make the app feel brittle even if screenshots look close to prototype density.

**Minimum fix:** Preserve visual size but add invisible hit padding via pseudo-element or wrapper so effective target size reaches at least `32px` desktop and `40-44px` touch surfaces.

**Better fix:** Define design-system hit-area tokens: compact desktop, dense table, touch, and status/help. Then every `btn`, `iconbtn`, `filter-chip`, `segment`, and `task-check-button` can share predictable hover/focus/active states.

**QA proof:** Hover/focus screenshots for topbar, routebar, Settings segments, Calendar controls, All Tasks checkboxes, OKR detail buttons, and mobile More route rows.

### FD-008 - Contextual Action Names

**Related rows:** QC-065, QC-066, QC-067, QC-068

**What the user may feel:** Visual users can infer context from the row, but keyboard/screen-reader users hear repeated generic actions such as `Mark done`, `Manage`, `Visible`, `Open KR detail`, or `Open Settings`.

**Evidence:** Fourth pass reports generic duplicates: `Mark done:120`, `Open KR detail:30`, `Manage:4`, `Visible:9`, and `Open Settings:2`.

**Why it matters:** Repeated generic names make it hard to operate a dense command layer safely. The app handles Trello execution and Review Queue governance, so wrong-row actions are more costly than normal UI annoyance.

**Minimum fix:** Keep visual labels short but add target-specific `aria-label` and `title`, for example `Mark done: Weekly Sprint Review`, `Manage Trello connection`, `Set OKR board visible`, and `Open KR detail: KR1.1`.

**Better fix:** Add contextual action helpers such as `actionLabel(action, target)` and use them in task rows, settings rows, KR rows, and source cards.

**QA proof:** Duplicate accessible-name scan should have no repeated generic commands except intentionally repeated navigation items with distinct route context.

### FD-009 - Text Clipping Policy

**Related rows:** QC-029, QC-041, QC-050, QC-051, QC-052, QC-059, QC-071, QC-074, QC-085, QC-086

**What the user may feel:** The app is dense and clean, but important words disappear: board names, OKR objective text, Docs run IDs, agent names, next action text, and Calendar event titles.

**Evidence:** Fourth pass found `455` clipped candidates. All Tasks is the most severe with `139` desktop clips and `160` mobile-small clips, led by board tags, `task-next-action`, and OKR-derived titles. Calendar consistently shows `20` clipped candidates. Docs still clips run/agent identity in table layouts.

**Why it matters:** Prototype fixtures are shorter than production Thai/English data. UI V2 full fidelity should preserve the component shape while adapting to real live titles.

**Minimum fix:** Define where ellipsis is allowed. Metadata chips may ellipsize with title tooltip. Decision-critical content gets two-line clamp or detail expansion.

**Better fix:** Add shared primitives: `decision-title`, `meta-chip-truncated`, `copyable-run-id`, and `audit-row-mobile`. Each primitive specifies line clamp, tooltip, copy behavior, and mobile stacking.

**QA proof:** Use longest live cards and Thai/English objective titles in Today, All Tasks, Planner, OKR, Calendar, Weekly Focus, and Docs. Verify no vertical-letter wrapping and no clipped decision-critical text without a reveal path.

### FD-010 - Docs / AI Trace Mobile Audit Layout

**Related rows:** QC-029, QC-041, QC-059, QC-071

**What the user may feel:** Docs / AI Trace works on desktop, but mobile feels like a squeezed table rather than an audit review surface.

**Evidence:** Prior passes found mobile filterbar overlap. Fourth pass still records Docs clipping on desktop/app-pane/mobile and the summary shows trace identity is still constrained.

**Why it matters:** Docs / AI Trace is a governance route. Run ID, source, status, and audit timeline are not decorative; they are decision evidence.

**Minimum fix:** Mobile trace rows should become stacked audit cards: run capsule, title/session, agent/env, received time, status, and Copy action.

**Better fix:** Use the same card structure for app-pane when table columns compress below an agreed width. Keep desktop table only when run/agent/time/status remain readable.

**QA proof:** Mobile-small `375x667` first viewport shows readable run capsule and at least one full trace card without table overlap.

### FD-011 - Calendar Event Readability And Action Honesty

**Related rows:** QC-021, QC-042, QC-047, QC-086

**What the user may feel:** Calendar controls work, but event titles in month cells can become unreadable, and `New event` can imply a live Google Calendar write before the product scope supports it.

**Evidence:** Fourth pass shows `20` clipped Calendar candidates on every checked viewport. Previous rows already flagged Calendar mobile month-grid event chips and `New event` action scope.

**Why it matters:** Calendar is both a planning view and a connector surface. If titles are unreadable or write affordances are unclear, users may distrust what is connected versus draft-only.

**Minimum fix:** On mobile/app-pane, show agenda/list first or allow event chips to expand below the month cell. Make `New event` say `Draft event` or `New event draft` unless live writes are explicitly in scope.

**Better fix:** Use a split mode: Month overview for date scanning, agenda pane for actual event reading, and connector state banner for write availability.

**QA proof:** Calendar `375x667` and `747x910` show readable event names; New event opens a session-only draft surface or is disabled with owner/action copy.

### FD-012 - Page Heading Semantics

**Related rows:** QC-070

**What the user may feel:** Visual route titles are clear, but assistive tech may announce the same app-level heading on every route, making route changes harder to understand.

**Evidence:** Third/fourth pass route identity confirms global `h1` remains `Trisilar Task Hub · v2`; route names are first `h2`.

**Why it matters:** The app is a command/review layer with many routes. The current route should be the primary document heading or clearly connected to the main landmark.

**Minimum fix:** Give `main` `aria-labelledby` pointing to the route title and ensure route title changes are announced.

**Better fix:** Use app brand as non-heading text in sidebar/topbar and make route title the route-level `h1`.

**QA proof:** On route navigation, accessibility tree exposes `Today`, `Review Queue`, `All Tasks`, etc. as the main page title.

### FD-013 - Status Strip Help Model

**Related rows:** QC-004, QC-061, QC-088

**What the user may feel:** Hover descriptions are useful, but keyboard users must tab through every telemetry item before reaching real work controls.

**Evidence:** Third pass logged 8 statusbar focus stops before shell/search/topbar controls. Fourth pass also counted statusbar help spans as small `18px` focus targets across every desktop route.

**Why it matters:** Status telemetry should be inspectable without slowing down the default keyboard route into task work.

**Minimum fix:** Keep hover tooltips, but remove individual status items from the normal tab order and add one focusable `Status details` control.

**Better fix:** Use roving tabindex inside the status strip only after the grouped `Status details` control is activated.

**QA proof:** First Tab should reach the app search or first command, not eight telemetry atoms. Status details remains keyboard-accessible.

### FD-014 - QC Tooling Accuracy

**Related rows:** QC-057, QC-060, QC-075, QC-077, QC-089, QC-092

**What the team may feel:** QC catches more issues, but broad numbers can look worse than the actual UX if not categorized.

**Evidence:** Fourth pass found many useful signals, but also includes intentional hidden responsive controls and absolute-positioned elements such as the mobile route bar. R166/R167/R168 add classifiers for hidden focusables, absolute/fixed elements, and third-pass contrast/focus heuristics so raw totals are not treated as equal blockers.

**Why it matters:** PM/UX needs high signal. If every heuristic is treated as a blocker, the team will either ignore the ledger or spend time fixing non-problems.

**Minimum fix:** Future QC summary should classify each finding as `Confirmed`, `Needs manual review`, `Likely false positive`, or `Tooling only`.

**Better fix:** Add a component allowlist and expected hidden-state rules per primitive. The scanner can then fail on unexpected hidden focusable controls while ignoring intentionally unmounted responsive elements.

**QA proof:** A rerun produces a concise top-risk list plus full raw JSON for traceability. Current classifier artifacts live beside the whole-system QC pack: `hidden-focusable-classification.md`, `absolute-element-classification.md`, and `contrast-focus-heuristic-classification.md`.

## Recommended Fix Order

1. P1 accessibility/interaction hazards: hidden modal/global controls, focus return, and body focus dumps.
2. Dense command safety: contextual action names, button types, All Tasks sort semantics, and row action hit areas.
3. Decision readability: All Tasks, Docs, Calendar, Planner, OKR, and Weekly Focus clipping policy.
4. Design-system polish: cursor/hover/focus matrix, status strip help model, segmented control target sizing.
5. Tooling refinement: categorize false positives and add component-aware allowlists.

## Boundary

This appendix does not authorize runtime/API/schema, Cloudflare, secrets, Paperclip live behavior, AI harness, Trello/Calendar/Google Tasks side effects, Team OS product scope, or Full Rewrite work. It is a UI V2 frontend/UX backlog explanation artifact only.
