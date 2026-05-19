# QA V0.6 - UI V2 Prototype Full-Fidelity Alignment

**Date:** 2026-05-17
**Branch:** `codex/v06-uiv2-full-fidelity`
**Branch base:** `98bfa7e`
**Latest upstream observed:** `origin/dev@02fd032` after `git fetch --all --prune`
**Scope:** Frontend UI V2 fidelity alignment only
**Current correction:** Superseded by source-led component parity recovery. `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` is now the first-read operating contract for future UI V2 parity work. Latest recovery verification passes component parity and route coverage, the Review Queue audit contradiction was corrected so `mobile approve/reject` must pass before the route can pass, the Settings / Mobile More / MobileShell source-led gap was repaired from `screens-mobile.jsx`, `screens-3.jsx`, and `components.jsx`, the PM/UX P1 screenshot-pack blockers for Today mobile, Boards mobile, OKR / Portfolio desktop, shared mobile shell title-stack, sidebar/icon primitive parity, sidebar label-pill/Scope dot rhythm, topbar scope-picker chevron, Today Next Up eyebrow time order, app-pane/mobile shell drift, Today desktop task-row/topbar drift, All Tasks topbar/footer drift, and Weekly Focus lane primitive/density drift were repaired from prototype source. The follow-up RUX visible-copy recovery restored Review Queue, All Tasks, Calendar, Planner, and Docs route contract text without changing runtime/API behavior. The latest source-led component sweep is QA-passed; PM/UX re-review is pending before final visual acceptance is restored.

## Summary

QA pass for the UI V2 alignment pass. PM/UX preview later showed that this evidence verified route coverage, no-overflow behavior, and selected alignment work, but did not prove full component-by-component fidelity against the accepted UI V2 prototype.

The active recovery artifacts are `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md`, `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md`, and `docs/design/ui-design-v2/UI_V2_COMPONENT_PARITY_AUDIT.md`. New acceptance requires source-led gap rows, route coverage/no-overflow, component parity, and regenerated screenshot evidence. The latest `npm.cmd run verify:uiv2-full-fidelity` pass regenerated both the route audit and component audit with PASS rows for all required desktop routes and mobile tabs.

The handoff update also corrected the process issue that PM/UX identified: generated PASS rows are automated evidence only, not final PM/UX acceptance. Future Codex work must name the prototype source contract before patching and must not claim full fidelity from selector checks alone.

PM/UX visual review of the previous screenshot pack produced an `iterate required` decision. The previously-open P1 visual-parity gaps are now repaired and tracked in `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md`: Today mobile follows `screens-mobile.jsx` `MToday`, Boards mobile follows `screens-mobile.jsx` `MBoards`, OKR / Portfolio desktop follows `screens-3.jsx` `ScreenOKR`, the shared mobile shell title/subtitle stack follows `screens-mobile.jsx` `MTopbar`, and the desktop sidebar now follows `components.jsx` `Ic.*`, `NAV`, `Sidebar`, plus `shell.css` `.side-foot`. PM/UX re-review remains pending for the latest reopened sidebar/icon gap.

The latest upstream refresh showed `origin/dev@02fd032` for the agent status refresh protocol. That upstream doc/harness lane was not merged into this branch because the requested scope is UI V2 frontend/design-system fidelity and explicitly excludes AI harness work.

No runtime setup, Cloudflare policy, secrets, webhook auth, live Paperclip behavior, Trello/Calendar/Google Tasks write behavior, AI harness work, Team OS product scope, or Full Rewrite work was performed.

## Coverage

| Surface | Result | Notes |
|---|---|---|
| Shell / tokens | Pass | Prototype-style status strip, 220px sidebar, topbar crumb/scope controls, mobile phone status row, mobile 5-tab route bar, Onest / JetBrains Mono fonts |
| Sidebar icons / connector footer | QA pass / PM-UX re-review pending | Workspace nav now uses prototype route icon paths and `1.6px` stroke, Settings appears before Scope, emoji fallbacks are removed from sidebar nav markup, prototype DOM aliases are present, shell icons render before API bootstrap, sidebar labels use the prototype 14px uppercase gray label-bar rhythm, Scope dots use 6px bullets, and footer rows are connector-only: `trello`, `gcal`, `paperclip`, `gtasks` |
| Topbar scope picker | Pass / PM-UX re-review pending | Scope picker now includes prototype dot, `All BUs` label, and 11px down chevron from `Topbar` / `Ic.Down`; behavior remains display-only and existing scope handling is unchanged |
| Today Next Up eyebrow | Pass / PM-UX re-review pending | Desktop and mobile Today hero eyebrow now follows prototype time order (`Next up · 18:00 today`) while table/card due labels keep production row wording |
| Route labels | Pass | Production URLs preserved; labels align to Today, Review Queue, All Tasks, Boards Monitor, Calendar, Planner, OKR / Portfolio, Weekly Focus, Docs / AI Trace, Settings |
| Review Queue desktop | Pass | Dense proposal rows, selected proposal inspection rail, trace/risk/confidence/side-effect context |
| Review Queue mobile | Pass | Proposal card and Reject/Approve controls are visible in the first meaningful viewport at 390x844 and 375x667 |
| Review Queue empty state | Pass | Live empty `/review` now follows the prototype StateCard contract and keeps product-safe copy with no secret/runtime wording |
| Settings desktop | Pass | Operational-control rows now match the prototype first viewport; Paperclip runtime controls are collapsed behind `Load controls` by default and no secret values are displayed |
| Boards Monitor desktop | Pass | Compact board-health grid restored; extra label-filter rail is not ahead of prototype card grid |
| Today mobile | Pass / PM accepted | Source-led recovery now puts the prototype `Next up` hero first, followed by two stat cards, AI review handoff, and today's work; source target is `screens-mobile.jsx` `MToday` |
| Boards Monitor mobile | Pass / PM accepted | Source-led recovery now puts the prototype metric cards and board-health cards before desktop controls; board card meta uses BU group and first available live-card owner; source target is `screens-mobile.jsx` `MBoards` |
| OKR / Portfolio desktop | Pass / PM accepted | Source-led recovery now uses `screens-3.jsx` `ScreenOKR` cycle routebar, segmented status, four-cell stat strip, objective progress blocks, and KR rows |
| Weekly Focus | Pass | Prototype-style `ScreenWeeklyFocus` lane primitives are the first major desktop surface; visible lane-card count is capped to prototype rhythm with `+N more` overflow; Review AI task title no longer wraps into vertical letters |
| Docs / AI Trace desktop | Pass | Trace-table-first rhythm restored with selected evidence/metadata inspection below |
| Mobile More | Pass / PM accepted | Mobile tab remains `More` and exposes Calendar, Planner, OKR / Portfolio, Weekly Focus, Docs / AI Trace, Settings, integration status, and status card; row density and integration naming were tightened from `screens-mobile.jsx` `MSettings` and `data.jsx` `INTEGRATIONS`; desktop Settings grid is hidden on the mobile More surface |
| Shared mobile shell | Pass / PM accepted | Mobile phone status row, hamburger, route title/subtitle stack, and refresh action follow `screens-mobile.jsx` `MShell` / `MTopbar`; title/subtitle geometry was checked live on `3032/settings` with overflow `0` |
| Full-route audit matrix | Pass / PM-UX re-review pending | `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` covers all 10 desktop routes, 5 mobile tabs, state coverage, deviations, actions, and evidence links. Automated evidence now includes sidebar icon-path, Settings placement, and footer connector checks; PM/UX re-review is pending for the reopened sidebar/icon correction. |
| Safety states | Pass | Disconnected/error copy remains product-safe and does not expose `.env`, raw OAuth errors, secrets, or developer-only wording |

## Verification

| Check | Result |
|---|---|
| `npm.cmd ci` | Pass, 0 vulnerabilities |
| `node --check public/app.js` | Pass |
| `node --check public/js/router.js` | Pass |
| `node --check public/js/utils.js` | Pass |
| `node --check public/js/pages/*.js` | Pass |
| `node --check scripts/verify-uiv2-full-fidelity.js` | Pass |
| `npm.cmd test` | Pass, 28/28 |
| `$env:PORT='3030'; npm.cmd run check:all` | Pass |
| `$env:PORT='3030'; npm.cmd run verify:rux-browser-regression` | Pass, including restored visible copy for Review Queue, All Tasks, Calendar, Planner, and Docs / AI Trace |
| `$env:PORT='3030'; npm.cmd run verify:uiv2-full-fidelity` | Pass, 10 desktop routes and 5 mobile tabs, including sidebar icon-path, primitive-class, label-pill, Scope dot, Settings placement, footer connector, desktop topbar scope chevron, Today Next Up time order, Today task-row, All Tasks topbar/footer, and Weekly Focus lane primitive checks |
| Live Browser `3032/today?uiv2_firstpaint=1` sidebar check | Pass: first-paint shell has 10 prototype route icons, search icon, refresh/bell SVGs, Planner `off` badge, and no sidebar icon blank while route content loads |
| Live Browser `3032/today` sidebar label/scope picker check | Pass: sidebar labels render as 14px uppercase gray label bars, Scope dots are 6px inside 16px icon slots, topbar scope picker has dot plus 11px chevron, and horizontal overflow is `0` |
| Live Browser `3032/today` Today hero eyebrow check | Pass: Next Up eyebrow rendered `Next up · 18:00 today`, old `Today 18:00` order was absent, table due labels stayed unchanged, and horizontal overflow was `0` |
| Live Browser `3032/focus` lane check | Pass: four `lane` columns, lane body primitives, visible card cap `[3,3,2,0]`, title-risk `false`, overflow `0`, no console warnings/errors |
| Live Browser `3032/today` rendered preview | Pass: Today content rendered after live data bootstrap, sidebar icons present, overflow `0`, no console warnings/errors |
| Live Browser `3032/planner` visible-copy preview | Pass: `Daily Planner`, `Google Tasks is disconnected`, Trello deadline panel, overflow `0`, no console warnings/errors |
| Live Browser `3032/docs` visible-copy preview | Pass: `Agent Documents`, trace table first viewport, overflow `0`, no console warnings/errors |
| Live Browser `3032/calendar` connected-state preview | Pass: calendar grid rendered after live Trello/Calendar data finished loading, overflow `0`, no console warnings/errors |
| `git diff --check` | Pass, line-ending warnings only |
| `rg -n '^(<<<<<<<|=======|>>>>>>>)' public docs scripts package.json` | Pass, no conflict markers |
| Visual QA matrix | Pass, no horizontal overflow beyond <=2px tolerance |

## Visual Evidence

Screenshot pack:

- `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/prototype-today-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/prototype-review-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/prototype-m-review-mobile-390x844.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/prototype-focus-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/production-today-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/production-review-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/production-review-mobile-390x844.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/production-review-mobile-small-375x667.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/production-focus-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-today-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-m-today-mobile-390x844.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-m-boards-mobile-390x844.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-okr-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-review-desktop-1440x900.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-m-review-mobile-390x844.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-m-more-mobile-390x844.png`
- `docs/logs/screenshots/v06-uiv2-full-fidelity/compare-focus-desktop-1440x900.png`

Measured visual QA highlights:

- `/review` mobile 390x844: horizontal overflow `0`, first proposal card visible, 4 approval/action buttons visible in viewport.
- `/review` mobile-small 375x667: horizontal overflow `0`, first proposal card visible, 4 approval/action buttons visible in viewport; Reject/Approve top at about `340px`.
- `/review` live empty state on `3032` 390x844: horizontal overflow `0`, `Review queue is empty`, `No proposals to review`, `Open audit log`, and `Manual upload` visible.
- `/boards` desktop 1440x900: horizontal overflow `0`, compact board-health cards visible in the first viewport.
- `/focus` desktop 1440x900: horizontal overflow `0`, four prototype-style lanes visible as the primary surface, Review AI task title is normal horizontal text.
- `/docs` desktop 1440x900: horizontal overflow `0`, table-first trace surface and selected metadata/evidence inspection are visible.
- `/settings` mobile 390x844: horizontal overflow `0`, More route list exposes Calendar, Planner, OKR / Portfolio, Weekly Focus, Docs / AI Trace, and Settings in the first viewport; Trello, Google Calendar, Google Tasks, Paperclip, Cloudflare Access, and the Status card are visible with no secret values.
- `/settings` live mobile on `3032` 390x844: horizontal overflow `0`, no console warnings/errors, mobile phone status row visible, refresh action visible, compact transparent hamburger visible, and desktop Operational control grid hidden from the mobile More first viewport.
- `/settings` live browser final review: page identity `Trisilar Task Hub`, route title `Settings`, route subtitle stacked below the title, horizontal overflow `0`, More routes include Calendar, Planner, OKR / Portfolio, Weekly Focus, Docs / AI Trace, and Settings, integrations include Trello, Google Calendar, Google Tasks, Paperclip, and Cloudflare Access, with no console warnings/errors.
- `/settings` desktop 1440x900: horizontal overflow `0`, Workspace section enters the first viewport and Paperclip runtime controls stay collapsed until requested.
- `/today` desktop 1440x900: sidebar Workspace/Scope labels use compact uppercase gray bars, Scope dots are 6px, topbar scope picker includes the prototype down chevron, Next Up eyebrow uses prototype time order, and horizontal overflow is `0`.
- `/today` mobile 390x844: horizontal overflow `0`, next-up card is first meaningful content after the shell topbar, then two stat cards, AI review handoff, and today's work.
- `/boards` mobile 390x844: horizontal overflow `0`, two metric cards and board-health cards are ahead of desktop controls; cards show BU group and live-data owner where available.
- `/okr` desktop 1440x900: horizontal overflow `0`, objective-progress blocks and KR rows are the primary first-viewport surface.

## Remaining Risk

The Browser plugin was attempted first earlier in this pass, but viewport-controlled screenshot comparison needed Playwright fallback. The fallback used controlled local API responses and no production credentials.

PM/UX final visual review is not yet accepted after the reopened global-component feedback. Remaining risk is visual-review risk: production data can differ from controlled visual fixtures, and PM/UX may identify additional component/section mismatches that automated gates do not yet encode. Calendar/Planner connected-state visuals can be rechecked later if credentials are intentionally provided. No active runtime or backend task is required from this UI V2 alignment pass.
