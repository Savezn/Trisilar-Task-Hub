# UI V2 QC Selector Contract

Generated: 2026-05-18 / R169

This note closes the `QC-038` selector false-positive risk for current UI V2 evidence tooling. It is a QA contract for future sweeps, not a product implementation change.

## Rule

Ad hoc browser checks must prefer stable UI V2 ids, classes, or data attributes. Do not use broad visible-text regexes when the target route action has an exact selector.

## Stable Selectors

| Surface | Use | Avoid |
|---|---|---|
| Status strip help | `#statusbar-details` | Searching all text that mentions `status` |
| Topbar Scope | `.topbar .scope-pick`, `#topbar-scope-popover` | `/scope/i`, `/filter/i`, or `/menu/i` text matching |
| Topbar notifications | `#topbar-notifications-btn`, `#topbar-notification-popover` | Icon-only ordinal selectors |
| Today Filter | `#today-topbar-filter` | `/filter/i` from all topbar controls |
| Review Filter | `#review-topbar-filter`, `#review-filterbar` | The first visible `Filter` text on the page |
| Docs Filter | `#docs-topbar-filter`, `#docs-filter-menu` | Scope picker title text containing `menu` |
| All Tasks Due sort | `.sortable-header[data-sort='due']` | Header text regex without table scope |
| Mobile bottom nav | `.mobile-route-item .nav-label`, `.mobile-route-item.active` | Generic bottom fixed controls |
| Toast feedback | `#toast.show` | Any `[aria-live]` region |
| Mobile route bar | `.mobile-route-bar` | Generic fixed-position or bottom-position scans |

## Current Tooling References

- `scripts/verify-uiv2-full-fidelity.js` uses `.mobile-route-item .nav-label`, `.topbar .scope-pick`, `#topbar-scope-popover`, `#docs-topbar-filter`, and `#statusbar-details`.
- `scripts/capture-uiv2-interaction-matrix.js` uses stable ids/classes for Status details, Scope, Bell, Today, Review, Docs, All Tasks, Boards, Planner, Calendar, OKR, Weekly Focus, and Settings controls.
- `scripts/classify-uiv2-absolute-elements.js`, `scripts/classify-uiv2-hidden-focusables.js`, and `scripts/classify-uiv2-contrast-focus-heuristics.js` categorize raw scanner signals before escalation.

## QC Interpretation

- Treat older text-regex sweep misses as historical evidence only.
- If a future script uses broad text matching, it must record the reason and include a direct-selector follow-up before opening a product UI bug.
- A selector miss is a QA tooling issue unless a direct selector, screenshot, or DOM proof shows the actual UI control is absent or broken.
