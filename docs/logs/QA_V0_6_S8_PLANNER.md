# QA V0.6-S8 - Planner

**Date:** 2026-05-17  
**Owner:** Codex Frontend Dev / UX / QA  
**Branch:** `codex/v06-s8-planner`  
**Worktree:** `trisilar-task-hub-v06-s8-planner`  
**Scope:** V0.6-S8 route-only UI V2 promotion for `/planner`

## Summary

V0.6-S8 promotes Planner into the UI V2 planning pattern. The route now separates Google Tasks personal planning work from Trello deadline work, keeps Review Queue as the human gate boundary, and uses safe disconnected-state copy without exposing raw credential, OAuth, or environment wording.

## Route And Component Coverage

| Area | Coverage |
|---|---|
| `/planner` command panel | Planning title, current date, Google Tasks count, due-today count, and due-tomorrow count |
| Source summary | Google Tasks state, Trello deadline state, and Review gate boundary card |
| Google Tasks list | Source-labeled task rows, compact task row pattern, add control, and complete feedback |
| Trello deadlines | Today/tomorrow due-work rows with Trello source chips and board/list context |
| Disconnected state | Google Tasks owner/action copy routes to Settings and keeps Trello context visible |
| Review Queue safety | Review Queue remains a boundary note only; Planner does not approve, sync, or mutate review proposals |
| Responsive | Desktop and mobile keep source summary, add control, task rows, deadline rows, and disconnected state without horizontal overflow |

## Evidence

| Check | Result |
|---|---|
| `npm.cmd ci` | Pass; 130 packages installed, 0 vulnerabilities |
| `node --check public/app.js` | Pass |
| `npm.cmd test` | Pass; 28/28 tests |
| `PORT=3024 APP_DATA_DIR=.tmp-v06-s8-data npm.cmd run check:all` | Pass |
| `npm.cmd run verify:rux-browser-regression` | Pass across `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, `/docs` on desktop/mobile controlled fixtures |
| Browser disconnected-state proof | Pass; in-app Browser verified `/planner`, owner/action copy visible, Review gate visible, no raw OAuth/env/credential wording, no horizontal overflow, and no console errors |
| Controlled `/planner` rendered checks | Pass; connected fixtures showed Google Tasks source count, Trello due count, Review gate boundary, Google/Trello source chips, hidden-board exclusion, add task UI, and complete feedback |
| Disconnected-state rendered check | Pass; Google Tasks disconnected copy showed owner/action guidance without raw `invalid_client`, OAuth, `.env`, or credential wording |
| Responsive screenshot QA | Pass; desktop `1440x900` and mobile `390x844` had no horizontal overflow |
| Console/page errors | Pass; no console errors or page errors during controlled rendered checks |
| `git diff --check` | Pass |

## Screenshots

| View | Path |
|---|---|
| Desktop connected 1440x900 | `docs/logs/screenshots/v06-s8-planner/planner-desktop-1440x900.png` |
| Mobile connected 390x844 | `docs/logs/screenshots/v06-s8-planner/planner-mobile-390x844.png` |
| Mobile disconnected 390x844 | `docs/logs/screenshots/v06-s8-planner/planner-disconnected-mobile-390x844.png` |

## Boundaries

- No runtime setup or production runtime change.
- No Cloudflare policy change.
- No secret storage, webhook auth, or API contract change.
- No Trello write, Calendar write, Google Tasks live write, or live Paperclip side effect.
- No AI harness work.
- No Team OS product work.
- No Full Rewrite work.

## QA Decision

QA pass for V0.6-S8 Planner. Route next to PM merge review, then continue V0.6 route-by-route with S9 OKR or the next PM-selected route after merge acceptance.
