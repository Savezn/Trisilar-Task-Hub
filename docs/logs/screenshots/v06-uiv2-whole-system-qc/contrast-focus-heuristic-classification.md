# UI V2 Contrast / Focus Heuristic Classification

Generated: 2026-05-18T15:04:21.534Z
Source: `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-third-pass-results.json`

This classifier keeps the third-pass scanner useful without treating every contrast, focus, or target-size heuristic as an automatic product defect. It is evidence only; PM/UX visual review and current verifier evidence remain authoritative.

## Contrast Category Totals

| Category | Count | Meaning |
|---|---:|---|
| needs_review_alpha_background_compositing | 5 | Computed contrast is unreliable because the sampled background is transparent/alpha; review against the actual painted card background before escalating. |
| needs_review_dense_table_header_token | 24 | Dense table header or sortable header text uses muted tokens; review against UI V2 hierarchy and readability. |
| needs_review_mobile_section_label_token | 2 | Mobile Settings section label uses a muted token; review for readability on compact surfaces. |
| needs_review_eyebrow_muted_token | 48 | Eyebrow/support label uses muted token below normal text contrast; usually a design-token review, not an immediate blocker. |
| likely_low_risk_muted_supporting_text | 0 | Supporting text above 3:1; keep human-reviewed rather than auto-failing. |
| needs_review_unclassified_low_contrast | 0 | Low contrast signal without a known component category. |
| total lowContrast signals | 79 | Raw third-pass low-contrast candidate count. |

## Focus / Target Category Totals

| Category | Count | Meaning |
|---|---:|---|
| superseded_status_strip_compact_signal | 80 | Third-pass status-strip target signal superseded by later grouped Status details evidence. |
| needs_review_dense_table_or_sort_target | 10 | Dense table or sortable header target. Review against effective hit-area evidence. |
| needs_review_segment_or_chip_hit_area | 171 | Segment/chip target may be compact; review with density policy. |
| needs_review_sidebar_scope_hit_area | 10 | Sidebar Scope workspace row is compact; review against sidebar navigation density and click target comfort. |
| needs_review_compact_search_input_target | 17 | Search field/control is compact; review focus ring and effective target size. |
| needs_review_compact_icon_button_target | 2 | Icon/button target may need hover/focus/hit-area proof. |
| needs_review_dense_row_action_target | 76 | Dense row action target; check row-action evidence before escalating. |
| likely_false_positive_static_text_or_layout | 0 | Static layout/text picked up by target scanner; generally not actionable. |
| likely_false_positive_disabled_control | 0 | Disabled control signal; usually not an active hit-area issue. |
| needs_review_unclassified_focus_target | 112 | Small/focus target that needs component-level interpretation. |
| total smallTarget signals | 478 | Raw third-pass small-target candidate count. |

## Generic Control Category Totals

| Category | Count | Meaning |
|---|---:|---|
| superseded_status_strip_role_note | 0 | Status strip role signal superseded by later grouped Status details model. |
| needs_review_route_filter_action_help | 3 | Route Filter button needs visible help/state proof; later interaction evidence may supersede it. |
| superseded_planner_contextual_settings_cta | 6 | Planner repeated Settings CTA signal superseded by later contextual CTA labels. |
| superseded_okr_contextual_kr_detail_labels | 90 | OKR repeated KR detail action signal superseded by later contextual labels. |
| superseded_settings_contextual_action_labels | 28 | Settings repeated Manage/Visible/Policy signal superseded by later contextual action labels. |
| needs_review_custom_role_button | 0 | Non-button element with role=button; confirm native semantics or keyboard support. |
| needs_review_unclassified_generic_control | 0 | Generic control signal that still needs human interpretation. |
| total genericControl signals | 127 | Raw third-pass generic-control candidate count. |

## Route Breakdown

| Route | Viewport | Low contrast | Small targets | Generic controls | Duplicate names | Screenshot |
|---|---|---:|---:|---:|---:|---|
| today | desktop-1440x900 | 6 | 10 | 1 | 0 | `qc3-today-desktop-1440x900.png` |
| review-queue | desktop-1440x900 | 1 | 16 | 1 | 0 | `qc3-review-queue-desktop-1440x900.png` |
| all-tasks | desktop-1440x900 | 12 | 80 | 0 | 1 | `qc3-all-tasks-desktop-1440x900.png` |
| boards-monitor | desktop-1440x900 | 0 | 10 | 0 | 0 | `qc3-boards-monitor-desktop-1440x900.png` |
| calendar | desktop-1440x900 | 0 | 13 | 0 | 0 | `qc3-calendar-desktop-1440x900.png` |
| planner | desktop-1440x900 | 0 | 13 | 2 | 1 | `qc3-planner-desktop-1440x900.png` |
| okr-portfolio | desktop-1440x900 | 0 | 56 | 30 | 1 | `qc3-okr-portfolio-desktop-1440x900.png` |
| weekly-focus | desktop-1440x900 | 0 | 13 | 0 | 0 | `qc3-weekly-focus-desktop-1440x900.png` |
| docs-ai-trace | desktop-1440x900 | 6 | 12 | 1 | 0 | `qc3-docs-ai-trace-desktop-1440x900.png` |
| settings | desktop-1440x900 | 10 | 69 | 14 | 2 | `qc3-settings-desktop-1440x900.png` |
| today | app-pane-747x910 | 6 | 0 | 0 | 0 | `qc3-today-app-pane-747x910.png` |
| review-queue | app-pane-747x910 | 1 | 0 | 0 | 0 | `qc3-review-queue-app-pane-747x910.png` |
| all-tasks | app-pane-747x910 | 12 | 6 | 0 | 0 | `qc3-all-tasks-app-pane-747x910.png` |
| boards-monitor | app-pane-747x910 | 0 | 4 | 0 | 1 | `qc3-boards-monitor-app-pane-747x910.png` |
| calendar | app-pane-747x910 | 0 | 0 | 0 | 0 | `qc3-calendar-app-pane-747x910.png` |
| planner | app-pane-747x910 | 0 | 3 | 2 | 1 | `qc3-planner-app-pane-747x910.png` |
| okr-portfolio | app-pane-747x910 | 0 | 46 | 30 | 1 | `qc3-okr-portfolio-app-pane-747x910.png` |
| weekly-focus | app-pane-747x910 | 0 | 8 | 0 | 0 | `qc3-weekly-focus-app-pane-747x910.png` |
| docs-ai-trace | app-pane-747x910 | 6 | 1 | 0 | 0 | `qc3-docs-ai-trace-app-pane-747x910.png` |
| settings | app-pane-747x910 | 10 | 59 | 14 | 2 | `qc3-settings-app-pane-747x910.png` |
| today | mobile-small-375x667 | 1 | 0 | 0 | 0 | `qc3-today-mobile-small-375x667.png` |
| review-queue | mobile-small-375x667 | 1 | 0 | 0 | 0 | `qc3-review-queue-mobile-small-375x667.png` |
| all-tasks | mobile-small-375x667 | 0 | 1 | 0 | 0 | `qc3-all-tasks-mobile-small-375x667.png` |
| boards-monitor | mobile-small-375x667 | 0 | 0 | 0 | 0 | `qc3-boards-monitor-mobile-small-375x667.png` |
| calendar | mobile-small-375x667 | 0 | 0 | 0 | 0 | `qc3-calendar-mobile-small-375x667.png` |
| planner | mobile-small-375x667 | 0 | 3 | 2 | 1 | `qc3-planner-mobile-small-375x667.png` |
| okr-portfolio | mobile-small-375x667 | 0 | 46 | 30 | 1 | `qc3-okr-portfolio-mobile-small-375x667.png` |
| weekly-focus | mobile-small-375x667 | 0 | 8 | 0 | 0 | `qc3-weekly-focus-mobile-small-375x667.png` |
| docs-ai-trace | mobile-small-375x667 | 5 | 1 | 0 | 0 | `qc3-docs-ai-trace-mobile-small-375x667.png` |
| settings | mobile-small-375x667 | 2 | 0 | 0 | 0 | `qc3-settings-mobile-small-375x667.png` |

## Example Signals

### needs_review_alpha_background_compositing

- today / desktop-1440x900 / `button.btn` ratio 1 - Mark done (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `button.btn` ratio 1 - Reschedule (`qc3-today-desktop-1440x900.png`)
- today / app-pane-747x910 / `button.btn` ratio 1 - Mark done (`qc3-today-app-pane-747x910.png`)
- today / app-pane-747x910 / `button.btn` ratio 1 - Reschedule (`qc3-today-app-pane-747x910.png`)
- today / mobile-small-375x667 / `button.btn` ratio 1 - Done (`qc3-today-mobile-small-375x667.png`)

### needs_review_dense_table_header_token

- all-tasks / desktop-1440x900 / `th` ratio 3.12 - TASK (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` ratio 3.12 - TASK (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `th` ratio 3.12 - BOARD · LIST (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` ratio 3.12 - BOARD · LIST (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `th` ratio 3.12 - OWNER (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` ratio 3.12 - OWNER (`qc3-all-tasks-desktop-1440x900.png`)

### needs_review_mobile_section_label_token

- settings / mobile-small-375x667 / `div.settings-mobile-section-label.eyebrow` ratio 2.99 - INTEGRATIONS (`qc3-settings-mobile-small-375x667.png`)
- settings / mobile-small-375x667 / `div.settings-mobile-section-label.eyebrow` ratio 2.99 - STATUS (`qc3-settings-mobile-small-375x667.png`)

### needs_review_eyebrow_muted_token

- today / desktop-1440x900 / `span.eyebrow` ratio 3.21 - 8 ITEMS (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `div.eyebrow` ratio 3.21 - AI REVIEW QUEUE (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `span.eyebrow` ratio 3.21 - 0 EVENTS (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `div.eyebrow` ratio 3.21 - CROSS-BOARD SIGNALS (`qc3-today-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `span.eyebrow` ratio 3.21 - EMPTY STATE · REVIEW QUEUE (`qc3-review-queue-desktop-1440x900.png`)
- docs-ai-trace / desktop-1440x900 / `span.eyebrow` ratio 3.12 - RUN ID (`qc3-docs-ai-trace-desktop-1440x900.png`)

### superseded_status_strip_compact_signal

- today / desktop-1440x900 / `span.statusbar-group.has-status-help` - env dev. Current app environment label for this preview. It is display-only and does not expose  (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `span.statusbar-group.has-status-help` - build ui-v2. UI V2 shell and component system is active in this preview build. (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `span.statusbar-group.has-status-help` - workspace trisilar. Current workspace context. Production data still comes from the existing app (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `span.statusbar-group.has-status-help` - trello · ok. Trello is verified. Trello remains the execution surface while Task Hub stays the c (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `span.statusbar-group.has-status-help` - gcal · ok. Google Calendar is connected. Calendar context can be shown, while writes stay behind (`qc3-today-desktop-1440x900.png`)
- today / desktop-1440x900 / `span.statusbar-group.has-status-help` - paperclip staged. Paperclip intake is staged and gated. Proposed work must pass Review Queue bef (`qc3-today-desktop-1440x900.png`)

### needs_review_dense_table_or_sort_target

- all-tasks / desktop-1440x900 / `button.sortable-header` - TASK (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` - BOARD · LIST (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` - OWNER (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` - DUE ↑ (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.sortable-header` - STATUS (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / app-pane-747x910 / `button.sortable-header` - TASK (`qc3-all-tasks-app-pane-747x910.png`)

### needs_review_segment_or_chip_hit_area

- review-queue / desktop-1440x900 / `button.filter-chip.on` - status: any (`qc3-review-queue-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `button.filter-chip` - status: pending (`qc3-review-queue-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `button.filter-chip` - status: approved (`qc3-review-queue-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `button.filter-chip` - status: rejected (`qc3-review-queue-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `button.filter-chip` - risk: blocked (`qc3-review-queue-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `button.filter-chip` - risk: ready (`qc3-review-queue-desktop-1440x900.png`)

### needs_review_sidebar_scope_hit_area

- today / desktop-1440x900 / `button.nav-item.scope-item` - Filter workspace to Trisilar (`qc3-today-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `button.nav-item.scope-item` - Filter workspace to Trisilar (`qc3-review-queue-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.nav-item.scope-item` - Filter workspace to Trisilar (`qc3-all-tasks-desktop-1440x900.png`)
- boards-monitor / desktop-1440x900 / `button.nav-item.scope-item` - Filter workspace to Trisilar (`qc3-boards-monitor-desktop-1440x900.png`)
- calendar / desktop-1440x900 / `button.nav-item.scope-item` - Filter workspace to Trisilar (`qc3-calendar-desktop-1440x900.png`)
- planner / desktop-1440x900 / `button.nav-item.scope-item` - Filter workspace to Trisilar (`qc3-planner-desktop-1440x900.png`)

### needs_review_compact_search_input_target

- all-tasks / desktop-1440x900 / `#tasks-search-input` - Search tasks... (`qc3-all-tasks-desktop-1440x900.png`)
- docs-ai-trace / desktop-1440x900 / `#docs-search-input` (`qc3-docs-ai-trace-desktop-1440x900.png`)
- settings / desktop-1440x900 / `input.ws-check` - Games Studio (`qc3-settings-desktop-1440x900.png`)
- settings / desktop-1440x900 / `input.ws-check` - Sprouting Tech TH (`qc3-settings-desktop-1440x900.png`)
- settings / desktop-1440x900 / `input.ws-check` - Trisilar (`qc3-settings-desktop-1440x900.png`)
- settings / desktop-1440x900 / `input.group-color-picker` - Group color (`qc3-settings-desktop-1440x900.png`)

### needs_review_compact_icon_button_target

- settings / desktop-1440x900 / `button.sl` - Notifications (`qc3-settings-desktop-1440x900.png`)
- settings / app-pane-747x910 / `button.sl` - Notifications (`qc3-settings-app-pane-747x910.png`)

### needs_review_dense_row_action_target

- today / desktop-1440x900 / `div.scope-pick` - Scope filter All BUs. Open scope menu. (`qc3-today-desktop-1440x900.png`)
- review-queue / desktop-1440x900 / `div.scope-pick` - Scope filter All BUs. Open scope menu. (`qc3-review-queue-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `div.scope-pick` - Scope filter All BUs. Open scope menu. (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.task-check-button.tck` - Mark done (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.task-check-button.tck` - Mark done (`qc3-all-tasks-desktop-1440x900.png`)
- all-tasks / desktop-1440x900 / `button.task-check-button.tck` - Mark done (`qc3-all-tasks-desktop-1440x900.png`)

### needs_review_unclassified_focus_target

- calendar / desktop-1440x900 / `button` - Day (`qc3-calendar-desktop-1440x900.png`)
- calendar / desktop-1440x900 / `button` - Week (`qc3-calendar-desktop-1440x900.png`)
- calendar / desktop-1440x900 / `button.on` - Month (`qc3-calendar-desktop-1440x900.png`)
- planner / desktop-1440x900 / `button.on` - Today (`qc3-planner-desktop-1440x900.png`)
- planner / desktop-1440x900 / `button` - Tomorrow (`qc3-planner-desktop-1440x900.png`)
- planner / desktop-1440x900 / `button` - This week (`qc3-planner-desktop-1440x900.png`)

## QC Interpretation

- Do not escalate transparent/alpha-background contrast signals until a screenshot or paint-aware check confirms the actual rendered contrast.
- Treat eyebrow and dense-header contrast as design-token review items: they may be acceptable for hierarchy, but PM/UX should decide whether muted labels feel too faint.
- Treat compact target signals as evidence prompts. Current R165 interaction-matrix and later verifier evidence may already supersede third-pass focus/target warnings for many controls.
- If this classifier reports unclassified low-contrast or focus-target signals in future runs, inspect the component source and add a category before opening a broad Dev task.
