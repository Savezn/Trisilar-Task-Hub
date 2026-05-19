# UI V2 Control Help Audit

**Date:** 2026-05-18 / R161  
**QC row:** `QC-004`  
**Scope:** Desktop first viewport, visible controls only, `http://127.0.0.1:3032`  
**Boundary:** Evidence reconciliation only. No code, runtime, API/schema, secrets, Cloudflare, Paperclip live behavior, AI harness, Trello, Calendar, or Google Tasks side effects.

## Help Contract Checked

Visible controls that are icon-only, status-like, chip-like, compact, disabled/readonly, or route-action-like should expose at least one of:

- Clear visible text.
- `aria-label` when visible text is not enough.
- `title` for hover/help or readonly explanation.
- A documented custom help surface such as the grouped `Status details` control.

Status strip telemetry uses the grouped `Status details` keyboard target and per-status hover/focus descriptions. Route actions, icon-only controls, compact row actions, chips, and readonly controls should not appear silent to pointer or keyboard users.

## Browser Audit Result

The desktop DOM audit scanned visible `button`, `[role=button]`, `a[href]`, chip/status/segment primitives, and compact controls. A candidate counted as missing help only when it was visible and matched an icon/status/compact/control pattern while having no `title` and no `aria-label`.

| Route | Route title settled | Missing help candidates | Horizontal overflow |
|---|---:|---:|---:|
| `/today` | Yes | 0 | 0 |
| `/review` | Yes | 0 | 0 |
| `/all` | Yes | 0 | 0 |
| `/boards` | Yes | 0 | 0 |
| `/calendar` | Yes | 0 | 0 |
| `/planner` | Yes | 0 | 0 |
| `/okr` | Yes | 0 | 0 |
| `/focus` | Yes | 0 | 0 |
| `/docs` | Yes | 0 | 0 |
| `/settings` | Yes | 0 | 0 |

## Existing Visual Evidence

- `docs/logs/screenshots/v06-uiv2-interaction-matrix/statusbar-details-default.png`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/statusbar-details-hover.png`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/statusbar-details-focus.png`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/statusbar-details-open.png`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/topbar-scope-*.png`
- `docs/logs/screenshots/v06-uiv2-interaction-matrix/docs-filter-popover-*.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/settings-board-visibility-controls-2026-05-18.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/today-row-focus-open-action-2026-05-18.png`

## Remaining Risk

This audit does not prove every scrolled control in every long route has ideal explanatory copy. It confirms that the visible desktop first-viewport controls no longer have silent icon/status/compact affordances under the current UI V2 help contract. PM/UX can still request richer custom tooltip visuals later, but that would be polish beyond this row.
