# QA V0.6-S7 - Calendar

**Date:** 2026-05-17  
**Owner:** Codex Frontend Dev / UX / QA  
**Branch:** `codex/v06-s7-calendar`  
**Worktree:** `trisilar-task-hub-v06-s7-calendar`  
**Scope:** V0.6-S7 route-only UI V2 promotion for `/calendar`

## Summary

V0.6-S7 promotes Calendar into the UI V2 planning pattern. The route now separates Google Calendar events, Trello deadlines, overdue work, and Review Queue due items while preserving safe disconnected-state copy and the Review Queue human gate.

## Route And Component Coverage

| Area | Coverage |
|---|---|
| `/calendar` command panel | Month title, source-aware summary counts, Google/Trello/Review/overdue separation |
| Source summary | Google Calendar connection context, Trello deadline board scope, hidden-board notice, Review Queue pending count |
| Calendar grid | Google events, Trello due/start chips, overdue styling, Review Queue pending/approved chips |
| Agenda panel | Source chip, date, title, source-specific metadata, and action label for Google, Trello, overdue, Review pending, and Review approved items |
| Disconnected state | Owner/action copy routes to Settings without raw OAuth, env, or exception text |
| Review Queue safety | Review-derived pending and approved items are informational; rejected items are excluded; approval still happens only in Review Queue |
| Responsive | Desktop and mobile keep source summary, board filters, agenda, and disconnected state without horizontal overflow |

## Evidence

| Check | Result |
|---|---|
| `npm.cmd ci` | Pass; 130 packages installed, 0 vulnerabilities |
| `node --check public/js/pages/calendar.js` | Pass |
| `npm.cmd test` | Pass; 28/28 tests |
| `PORT=3023 APP_DATA_DIR=.tmp-v06-s7-data npm.cmd run check:all` | Pass |
| `npm.cmd run verify:rux-browser-regression` | Pass across `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, `/docs` on desktop/mobile controlled fixtures |
| Browser disconnected-state proof | Pass; in-app Browser verified `/calendar`, no relevant console warnings/errors, disconnected owner/action copy visible, and no raw OAuth/env wording |
| Controlled `/calendar` rendered checks | Pass; connected fixtures showed Google events, Trello overdue/deadline items, Review Queue pending/approved due items, hidden-board scope, rejected Review item exclusion, and safe disconnected copy |
| Responsive screenshot QA | Pass; desktop `1440x900` and mobile `390x844` had no horizontal overflow |
| Console/page errors | Pass; no relevant console errors or page errors in Browser or controlled rendered checks |
| `git diff --check` | Pass |

## Screenshots

| View | Path |
|---|---|
| Desktop 1440x900 | `docs/logs/screenshots/v06-s7-calendar/calendar-desktop-1440x900.png` |
| Desktop agenda proof 1440x900 | `docs/logs/screenshots/v06-s7-calendar/calendar-review-agenda-desktop-1440x900.png` |
| Mobile connected 390x844 | `docs/logs/screenshots/v06-s7-calendar/calendar-mobile-390x844.png` |
| Mobile disconnected 390x844 | `docs/logs/screenshots/v06-s7-calendar/calendar-disconnected-mobile-390x844.png` |

## Boundaries

- No runtime setup or production runtime change.
- No Cloudflare policy change.
- No secret storage, webhook auth, or API contract change.
- No Trello write, Calendar write, Google Tasks write, or live Paperclip side effect.
- No AI harness work.
- No Team OS product work.
- No Full Rewrite work.

## QA Decision

QA pass for V0.6-S7 Calendar. Route next to PM merge review, then continue V0.6 route-by-route with S8 Planner or the next PM-selected route after merge acceptance.
