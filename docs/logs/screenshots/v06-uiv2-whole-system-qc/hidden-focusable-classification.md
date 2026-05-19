# UI V2 Hidden Focusable Classification

Generated: 2026-05-18T14:57:26.117Z
Source: `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-fourth-pass-results.json`

This classifier keeps the fourth-pass raw scanner useful without turning every hidden/focusable signal into the same severity. It is evidence only; PM/UX acceptance still depends on route review.

## Category Totals

| Category | Count | Meaning |
|---|---:|---|
| confirmed_risk_zero_rect_visible_tree | 369 | Focusable, enabled, visible-tree control with a zero-size rect. Review as a real keyboard/hit-test risk. |
| confirmed_risk_opacity_zero_visible_tree | 0 | Focusable, enabled control hidden by opacity. Review as a real invisible-control risk. |
| needs_review_modal_or_drawer_surface | 988 | Likely closed modal/drawer or modal child. Confirm the surface is inert/aria-hidden when closed. |
| needs_review_legacy_shell_or_superseded_status | 250 | Legacy shell/statusbar signal from fourth-pass evidence. Fresh verifier or DOM proof may already supersede it. |
| needs_review_responsive_hidden_control | 131 | Likely responsive row/mobile/desktop control. Confirm the hidden breakpoint state is inert. |
| needs_review_uncategorized_focusable | 0 | Focusable signal that needs human classification. |
| likely_false_positive_disabled_or_inert | 6 | Disabled, inert, pointer-disabled, or removed from tab sequence. Usually not a blocker. |
| tooling_only_hidden_state | 136 | Hidden/display-none/aria-hidden state. Keep in raw evidence, but do not treat as a blocker by itself. |
| total raw hiddenFocusable | 1880 | Raw fourth-pass scanner count before PM/UX interpretation. |

## Route Breakdown

| Route | Viewport | Total | Confirmed | Needs review | Likely false/tooling | Screenshot |
|---|---|---:|---:|---:|---:|---|
| today | desktop-1440x900 | 57 | 10 | 43 | 4 | `qc4-today-desktop-1440x900.png` |
| review-queue | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-review-queue-desktop-1440x900.png` |
| all-tasks | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-all-tasks-desktop-1440x900.png` |
| boards-monitor | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-boards-monitor-desktop-1440x900.png` |
| calendar | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-calendar-desktop-1440x900.png` |
| planner | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-planner-desktop-1440x900.png` |
| okr-portfolio | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-okr-portfolio-desktop-1440x900.png` |
| weekly-focus | desktop-1440x900 | 57 | 13 | 40 | 4 | `qc4-weekly-focus-desktop-1440x900.png` |
| docs-ai-trace | desktop-1440x900 | 49 | 5 | 40 | 4 | `qc4-docs-ai-trace-desktop-1440x900.png` |
| settings | desktop-1440x900 | 63 | 5 | 51 | 7 | `qc4-settings-desktop-1440x900.png` |
| today | app-pane-747x910 | 70 | 14 | 51 | 5 | `qc4-today-app-pane-747x910.png` |
| review-queue | app-pane-747x910 | 70 | 17 | 48 | 5 | `qc4-review-queue-app-pane-747x910.png` |
| all-tasks | app-pane-747x910 | 80 | 6 | 69 | 5 | `qc4-all-tasks-app-pane-747x910.png` |
| boards-monitor | app-pane-747x910 | 65 | 7 | 53 | 5 | `qc4-boards-monitor-app-pane-747x910.png` |
| calendar | app-pane-747x910 | 64 | 10 | 49 | 5 | `qc4-calendar-app-pane-747x910.png` |
| planner | app-pane-747x910 | 60 | 7 | 48 | 5 | `qc4-planner-app-pane-747x910.png` |
| okr-portfolio | app-pane-747x910 | 60 | 7 | 48 | 5 | `qc4-okr-portfolio-app-pane-747x910.png` |
| weekly-focus | app-pane-747x910 | 63 | 10 | 48 | 5 | `qc4-weekly-focus-app-pane-747x910.png` |
| docs-ai-trace | app-pane-747x910 | 62 | 9 | 48 | 5 | `qc4-docs-ai-trace-app-pane-747x910.png` |
| settings | app-pane-747x910 | 74 | 7 | 59 | 8 | `qc4-settings-app-pane-747x910.png` |
| today | mobile-small-375x667 | 73 | 18 | 50 | 5 | `qc4-today-mobile-small-375x667.png` |
| review-queue | mobile-small-375x667 | 70 | 17 | 48 | 5 | `qc4-review-queue-mobile-small-375x667.png` |
| all-tasks | mobile-small-375x667 | 80 | 11 | 64 | 5 | `qc4-all-tasks-mobile-small-375x667.png` |
| boards-monitor | mobile-small-375x667 | 80 | 66 | 11 | 3 | `qc4-boards-monitor-mobile-small-375x667.png` |
| calendar | mobile-small-375x667 | 64 | 10 | 49 | 5 | `qc4-calendar-mobile-small-375x667.png` |
| planner | mobile-small-375x667 | 60 | 7 | 48 | 5 | `qc4-planner-mobile-small-375x667.png` |
| okr-portfolio | mobile-small-375x667 | 60 | 7 | 48 | 5 | `qc4-okr-portfolio-mobile-small-375x667.png` |
| weekly-focus | mobile-small-375x667 | 63 | 10 | 48 | 5 | `qc4-weekly-focus-mobile-small-375x667.png` |
| docs-ai-trace | mobile-small-375x667 | 62 | 9 | 48 | 5 | `qc4-docs-ai-trace-mobile-small-375x667.png` |
| settings | mobile-small-375x667 | 80 | 57 | 20 | 3 | `qc4-settings-mobile-small-375x667.png` |

## Top Confirmed-Risk Examples

### today / desktop-1440x900

- `button.btn.primary` - Open (0x0)
- `button.btn` - Done (0x0)
- `button.btn.primary.sm` - Add (0x0)

### review-queue / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### all-tasks / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### boards-monitor / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### calendar / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### planner / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### okr-portfolio / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### weekly-focus / desktop-1440x900

- `button.filter-chip.focus-filter-chip.active` - All sources (0x0)
- `button.filter-chip.focus-filter-chip` - Trello (0x0)
- `button.filter-chip.focus-filter-chip` - AI / agent (0x0)

### docs-ai-trace / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### settings / desktop-1440x900

- `#save-btn` - Save (0x0)
- `a` - console.cloud.google.com (0x0)
- `#setup-client-id` - xxxx.apps.googleusercontent.com (0x0)

### today / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#today-topbar-filter` - Filter (0x0)

### review-queue / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#review-topbar-refresh` - Refresh (0x0)

### all-tasks / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#tasks-topbar-open` - Open in Trello (0x0)

### boards-monitor / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#save-btn` - Save (0x0)

### calendar / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `button` - Day (0x0)

### planner / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#save-btn` - Save (0x0)

### okr-portfolio / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#save-btn` - Save (0x0)

### weekly-focus / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `button` - Last week (0x0)

### docs-ai-trace / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#docs-topbar-filter` - Filter (0x0)

### settings / app-pane-747x910

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#save-btn` - Save (0x0)

### today / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#today-topbar-filter` - Filter (0x0)

### review-queue / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#review-topbar-refresh` - Refresh (0x0)

### all-tasks / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#tasks-topbar-open` - Open in Trello (0x0)

### boards-monitor / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `button.on` - Board mode (0x0)

### calendar / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `button` - Day (0x0)

### planner / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#save-btn` - Save (0x0)

### okr-portfolio / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#save-btn` - Save (0x0)

### weekly-focus / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `button` - Last week (0x0)

### docs-ai-trace / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `#docs-topbar-filter` - Filter (0x0)

### settings / mobile-small-375x667

- `input` - Search tasks, boards, runs (0x0)
- `button.nav-item.scope-item` - Filter workspace to Trisilar (0x0)
- `button.btn` - Operations runbook (0x0)

## QC Interpretation

- Treat confirmed-risk rows as candidates for direct Dev fixes or fresh DOM verification.
- Treat modal/drawer and responsive rows as review queues: they may be acceptable after shared inert/aria-hidden rules are verified.
- Treat tooling-only hidden states as evidence retention, not blockers.
- If a future scanner reports only raw totals, regenerate this classifier before escalating the issue.
