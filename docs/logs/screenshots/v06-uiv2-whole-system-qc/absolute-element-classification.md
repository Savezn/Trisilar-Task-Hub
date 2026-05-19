# UI V2 Absolute / Fixed Element Classification

Generated: 2026-05-18T14:57:26.110Z
Source: `docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-fourth-pass-results.json`

This classifier keeps the fourth-pass positioned-element scan from treating expected shell primitives as layout risks. It is evidence only; overlap, clipping, and z-index concerns still require screenshot review.

## Category Totals

| Category | Count | Meaning |
|---|---:|---|
| expected_sidebar_search_adornment | 20 | Sidebar search icon / keyboard hint positioned inside the search field. |
| expected_mobile_bottom_nav | 20 | Fixed mobile bottom navigation shell. |
| expected_settings_sticky_side_nav | 1 | Settings desktop sticky side navigation. |
| needs_review_high_z_fixed_surface | 0 | Fixed high z-index surface not in the expected shell allowlist. |
| needs_review_unclassified_positioned_surface | 0 | Absolute/fixed/sticky element not in the expected shell allowlist. |
| tooling_only_non_positioned | 0 | Scanner carryover with no positioned layout risk. |
| total positioned signals | 41 | Raw fourth-pass absolute/fixed/sticky candidate count. |

Expected shell primitives: 41
Needs review: 0

## Route Breakdown

| Route | Viewport | Total | Expected shell | Needs review | Screenshot |
|---|---|---:|---:|---:|---|
| today | desktop-1440x900 | 2 | 2 | 0 | `qc4-today-desktop-1440x900.png` |
| review-queue | desktop-1440x900 | 2 | 2 | 0 | `qc4-review-queue-desktop-1440x900.png` |
| all-tasks | desktop-1440x900 | 2 | 2 | 0 | `qc4-all-tasks-desktop-1440x900.png` |
| boards-monitor | desktop-1440x900 | 2 | 2 | 0 | `qc4-boards-monitor-desktop-1440x900.png` |
| calendar | desktop-1440x900 | 2 | 2 | 0 | `qc4-calendar-desktop-1440x900.png` |
| planner | desktop-1440x900 | 2 | 2 | 0 | `qc4-planner-desktop-1440x900.png` |
| okr-portfolio | desktop-1440x900 | 2 | 2 | 0 | `qc4-okr-portfolio-desktop-1440x900.png` |
| weekly-focus | desktop-1440x900 | 2 | 2 | 0 | `qc4-weekly-focus-desktop-1440x900.png` |
| docs-ai-trace | desktop-1440x900 | 2 | 2 | 0 | `qc4-docs-ai-trace-desktop-1440x900.png` |
| settings | desktop-1440x900 | 3 | 3 | 0 | `qc4-settings-desktop-1440x900.png` |
| today | app-pane-747x910 | 1 | 1 | 0 | `qc4-today-app-pane-747x910.png` |
| review-queue | app-pane-747x910 | 1 | 1 | 0 | `qc4-review-queue-app-pane-747x910.png` |
| all-tasks | app-pane-747x910 | 1 | 1 | 0 | `qc4-all-tasks-app-pane-747x910.png` |
| boards-monitor | app-pane-747x910 | 1 | 1 | 0 | `qc4-boards-monitor-app-pane-747x910.png` |
| calendar | app-pane-747x910 | 1 | 1 | 0 | `qc4-calendar-app-pane-747x910.png` |
| planner | app-pane-747x910 | 1 | 1 | 0 | `qc4-planner-app-pane-747x910.png` |
| okr-portfolio | app-pane-747x910 | 1 | 1 | 0 | `qc4-okr-portfolio-app-pane-747x910.png` |
| weekly-focus | app-pane-747x910 | 1 | 1 | 0 | `qc4-weekly-focus-app-pane-747x910.png` |
| docs-ai-trace | app-pane-747x910 | 1 | 1 | 0 | `qc4-docs-ai-trace-app-pane-747x910.png` |
| settings | app-pane-747x910 | 1 | 1 | 0 | `qc4-settings-app-pane-747x910.png` |
| today | mobile-small-375x667 | 1 | 1 | 0 | `qc4-today-mobile-small-375x667.png` |
| review-queue | mobile-small-375x667 | 1 | 1 | 0 | `qc4-review-queue-mobile-small-375x667.png` |
| all-tasks | mobile-small-375x667 | 1 | 1 | 0 | `qc4-all-tasks-mobile-small-375x667.png` |
| boards-monitor | mobile-small-375x667 | 1 | 1 | 0 | `qc4-boards-monitor-mobile-small-375x667.png` |
| calendar | mobile-small-375x667 | 1 | 1 | 0 | `qc4-calendar-mobile-small-375x667.png` |
| planner | mobile-small-375x667 | 1 | 1 | 0 | `qc4-planner-mobile-small-375x667.png` |
| okr-portfolio | mobile-small-375x667 | 1 | 1 | 0 | `qc4-okr-portfolio-mobile-small-375x667.png` |
| weekly-focus | mobile-small-375x667 | 1 | 1 | 0 | `qc4-weekly-focus-mobile-small-375x667.png` |
| docs-ai-trace | mobile-small-375x667 | 1 | 1 | 0 | `qc4-docs-ai-trace-mobile-small-375x667.png` |
| settings | mobile-small-375x667 | 1 | 1 | 0 | `qc4-settings-mobile-small-375x667.png` |

## Review Rule

- Do not escalate expected shell primitives unless they visibly overlap route content, clip important controls, or block pointer/focus access.
- Escalate any future unclassified fixed or high-z surface with a screenshot and route/viewport geometry.
- Keep this classifier paired with screenshot review; it does not replace PM/UX visual acceptance.
