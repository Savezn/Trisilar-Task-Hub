# V0.2 W2 UI Redesign Discovery and Implementation Plan

**Doc Role:** W2-owned discovery, scope, rollout, and QA plan
**Status:** PM updated - phased full UI redesign plan
**Workstream:** V0.2 W2 - Full UI Redesign
**Branch Baseline:** `dev` after W0 QA pass at `9dbb47b`
**Created:** 2026-05-08
**Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../../MVP_PRD.md`, `../design/ui-design-v1-0/README.md`

---

## Boundary

This W2 discovery pass does not implement W1 deployment/access work and does not implement W3 Paperclip integration. It preserves the existing Trello, Google Calendar, Google Tasks, Review Queue, Boards Monitor, OKR, and Weekly Focus workflows.

`CURRENT_SPRINT.md` remains PM-owned during parallel workstreams, so this document is the W2 handoff artifact.

PM clarification after `V0.2-W2-01` acceptance:

- The accepted `b5f67fb` work is `V0.2-W2-01` (alias W2a): shell foundation, mobile navigation baseline, and Today redesign.
- `V0.2-W2-01` does not complete the full UI redesign promised by the original W2 title.
- Full W2 acceptance now requires the remaining phased work below, with visual QA against `docs/design/ui-design-v1-0/` and production workflow regression evidence.
- Do not mark W2 Full UI Redesign complete until all W2 phases are accepted by PM.

---

## Sources Audited

- Production shell and static app: `public/index.html`, `public/style.css`, `public/app.js`, `public/js/router.js`, `public/js/state.js`, `public/js/api.js`.
- Production page modules: `public/js/pages/today.js`, `review.js`, `all-tasks.js`, `boards.js`, `calendar.js`, `settings.js`, `okr.js`.
- Existing UI design prototype: `docs/design/ui-design-v1-0/`.
- Product/UX context: `MVP_PRD.md`.
- Branch and QA rules: `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`.

Local verification during discovery:

- `npm.cmd run check:all` passed.
- Chrome headless visual audit was run for desktop and mobile Today, desktop Review Queue, and the standalone design prototype.
- Playwright is not installed in this repo/runtime, so Chrome headless was used for screenshots instead of adding a dependency during this planning-only pass.

---

## Current App Shell Audit

The current production app is a static HTML/CSS/JS application served by Express. It already has route-level modules and should be redesigned incrementally inside the current architecture unless PM explicitly approves a framework migration.

Current shell:

- Persistent dark left sidebar with product mark, primary nav, Settings, and integration status.
- Topbar with route title, subtitle, refresh, and context actions.
- Single content outlet at `#board-content`.
- Global modals for card create/edit, group/workspace management, Calendar event edit, and transcript upload.
- URL routing for `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, and `/settings`.

Core workflow surfaces to preserve:

- Today: daily command center with overdue, due today, upcoming, pending review, calendar events, and quick add.
- Review Queue: create review session, inspect extracted tasks, edit target board/list, approve/reject, bulk approve.
- Tasks: cross-board inbox with search, status filters, labels, owners, grouping, CSV export, and edit access.
- Boards: board/team monitor, metadata health, label filters, team board layout, and existing board open behavior.
- Calendar: month view, board filters, Google Calendar status, event create/edit/delete, and Trello deadline distinction.
- Planner: Google Tasks today list, Trello due today/tomorrow, add/complete Google Tasks.
- Settings: integrations, workspace visibility, hidden boards, monitor teams, BU groups.
- OKR / Weekly Focus: post-MVP command-center layers that exist in production and must not disappear during redesign.

Key implementation constraints:

- `public/app.js` still owns bootstrap, sidebar rendering, card modal behavior, Planner helpers, and shared legacy flows.
- Many pages render with `innerHTML`, so the redesign should first stabilize tokens/components/classes before deep DOM refactors.
- Current route naming uses `all` for Tasks in production while the prototype uses `tasks`; routing compatibility must be preserved.

---

## Existing Design Artifact Audit

`docs/design/ui-design-v1-0/` is a standalone, non-production prototype. It is useful as a visual and interaction reference, not as drop-in production code.

Strong references to carry forward:

- Cleaner app shell with restrained light surfaces, Inter typography, compact chrome, and SVG-style action icons.
- Tokenized visual system for accent color, density, dark mode, radii, surfaces, borders, and shadows.
- Reusable task row, due chip, board tag, label, avatar stack, sidebar, topbar, detail drawer, settings card, and review task patterns.
- Drawer-based task detail flow that keeps context better than full-page replacement.
- Review Queue design that shows diff status, confidence, reasoning, sync toggles, and approve/reject actions in one scan.

Gaps before production use:

- Prototype uses mock data and React/Babel CDN scripts; production uses static JS modules and live API calls.
- Prototype does not cover the production Weekly Focus route.
- Prototype Planner and OKR are placeholders, while production has working Planner and OKR/Weekly Focus surfaces.
- Prototype responsive coverage is incomplete; it has broad desktop/tablet grid collapses but no full mobile shell/navigation pattern.
- Prototype cannot be treated as QA evidence for live Trello/Calendar/Tasks behavior.

---

## Visual Direction

W2 should redesign Trisilar Task Hub as an internal operations command center, not a marketing site.

Target direction:

- Calm, dense, work-focused interface with high scanability and low visual noise.
- Light neutral workspace as the default, with dark sidebar or a compact rail if it improves orientation.
- Use semantic status color sparingly: overdue, today, upcoming, review, done, warning, integration connected/disconnected.
- Prefer tables, rows, panels, drawers, segmented controls, filters, and compact list layouts over decorative cards.
- Replace emoji/text glyph action icons with consistent SVG icon components or an equivalent local icon pattern.
- Keep primary actions obvious and secondary actions quiet.
- Use drawers/modals for edit/detail flows so users do not lose context.
- Design empty, loading, error, and disconnected states as first-class surfaces.

Out of scope for W2 unless separately approved:

- Full React/Vite rewrite.
- W1 deployment/access changes.
- W3 Paperclip connector or live multi-agent calls.
- Removing existing production pages because the prototype omits them.

---

## W2 Phased Full UI Redesign Plan

W2 is now managed as a sequence of implementation phases. Each phase should keep the current static JS architecture, preserve route behavior and live APIs, and include attribution such as `Implemented by Codex Dev`.

| Canonical ID | Alias | Name | Status | Production surfaces | Design baseline | PM acceptance gate |
|---|---|---|---|---|---|---|
| `V0.2-W2-01` | `W2a` | Shell Foundation + Today Redesign | Accepted at `b5f67fb` / merged to `dev` | Shell, mobile nav, Today | `pages-shell.jsx`, shared tokens, Today command center | Accepted as foundation only, not full redesign |
| `V0.2-W2-02` | `W2b` | Review Queue + Shared Task Drawer | Planned | `/review`, shared review task cards, task detail/edit drawer if feasible | `pages-review-cal-settings.jsx`, `TaskDrawer`, review task patterns | Review create/edit/approve/reject/bulk workflows pass with desktop/mobile evidence |
| `V0.2-W2-03` | `W2c` | Tasks Inbox + Cross-board Rows | Planned | `/all`, task filters, grouping, CSV export, card open/edit | `pages-tasks-boards.jsx`, reusable `TaskRow`, filters, board tags | Tasks page visually matches prototype direction and preserves all task workflows |
| `V0.2-W2-04` | `W2d` | Boards Monitor + Team Board Views | Planned | `/boards`, board/team modes, health/convention surfaces, board open behavior | `pages-tasks-boards.jsx`, board/team cards and dense monitor layouts | Boards monitor is redesigned without losing metadata health and label/team workflows |
| `V0.2-W2-05` | `W2e` | Calendar + Planner | Planned | `/calendar`, `/planner`, Google Calendar status/events, Google Tasks add/complete, Trello due lists | `pages-review-cal-settings.jsx`, calendar/planner surface direction | Calendar and Planner distinguish event/task sources and pass mobile responsive checks |
| `V0.2-W2-06` | `W2f` | Settings + OKR + Weekly Focus Polish | Planned | `/settings`, `/okr`, `/focus`, integration controls, BU groups, workspace visibility | `pages-review-cal-settings.jsx`, settings cards, page system tokens | Remaining pages inherit the same shell/tokens and no longer look like legacy screens |

Project phase-ladder alignment:

- Use canonical IDs such as `V0.2-W2-02` first. Keep `W2a`, `W2b`, ... as aliases only.
- Treat each W2 subphase like prior project phases: dependency, scoped task list, acceptance criteria, Dev -> QA -> PM flow, and explicit next handoff.
- W2 implementation branches must remain under the existing `feature/w2-*` branch family. Default branch for the next phase is `feature/w2b-review-redesign`; if PM chooses to reuse `feature/w2-ui-redesign`, Dev must first verify it is reset to latest `dev` and contains no stale accepted work.
- Do not merge W2 phase work to `main` directly. Each phase goes `feature/w2-* -> dev -> QA -> PM`.

Phase rules:

- `V0.2-W2-01` remains accepted and should not be reopened unless a regression is found.
- `V0.2-W2-02` should be the next Dev implementation phase because Review Queue is the highest-risk automation workflow after Today. Alias: `W2b`.
- Every phase must include screenshots for desktop and mobile, plus at least one populated state and one empty/error/disconnected state where applicable.
- QA must compare changed pages against `docs/design/ui-design-v1-0/` and state any accepted visual deviations.
- PM must update `CURRENT_SPRINT.md`, this plan, and decision logs after each phase acceptance.

### V0.2-W2-02 - Review Queue + Shared Task Drawer

**Alias:** W2b
**Depends on:** `V0.2-W2-01` accepted; W3 mock routes preserved.

**Tasks:**

- Redesign Review Queue list/session/task cards using the prototype's review patterns.
- Preserve create session, edit task target fields, approve/reject, dismiss, and bulk approve/reject.
- Add shared task-row/detail-drawer primitives only where needed by Review and future W2 phases.
- Keep Review workflows usable with controlled local data when live Trello credentials are unavailable.

**AC:**

- [ ] Review create/edit/approve/reject/bulk workflows pass.
- [ ] Duplicate or processed task guard behavior is not weakened.
- [ ] Desktop and mobile Review screenshots show populated and empty/error states.
- [ ] `V0.2-W2-01` Today smoke passes.
- [ ] W3 Paperclip mock contract smoke passes if touched or if shared review code is changed.

### V0.2-W2-03 - Tasks Inbox + Cross-board Rows

**Alias:** W2c
**Depends on:** `V0.2-W2-02` accepted or shared row/drawer primitives stable.

**Tasks:**

- Redesign `/all` as a dense cross-board task inbox.
- Preserve search, status filters, labels, owner/member filters, grouping, CSV export, and card open/edit flow.
- Reuse `V0.2-W2-02` shared task row/drawer patterns instead of inventing a second task surface.

**AC:**

- [ ] Search/filter/group/export behavior matches current production behavior.
- [ ] Long titles, labels, board names, and owner chips do not cause mobile overflow.
- [ ] Desktop and mobile Tasks screenshots include populated, filtered, and empty states.

### V0.2-W2-04 - Boards Monitor + Team Board Views

**Alias:** W2d
**Depends on:** `V0.2-W2-03` accepted.

**Tasks:**

- Redesign `/boards` monitor and team board layouts using the same page shell, filter, and row/card primitives.
- Preserve board/team modes, label filtering, metadata health, convention warnings, and board/card open actions.

**AC:**

- [ ] Board monitor and team board views preserve current navigation and open-card behavior.
- [ ] Metadata health and convention warning states remain visible and scannable.
- [ ] Desktop and mobile Boards screenshots cover board mode, team mode, and empty/error states.

### V0.2-W2-05 - Calendar + Planner

**Alias:** W2e
**Depends on:** `V0.2-W2-04` accepted, unless PM explicitly splits Calendar and Planner for risk.

**Tasks:**

- Redesign `/calendar` to distinguish Google Calendar events from Trello deadlines.
- Redesign `/planner` while preserving Google Tasks add/complete and Trello due today/tomorrow lists.
- Keep disconnected/credential states explicit and non-blocking.

**AC:**

- [ ] Calendar event create/edit/delete paths still work where credentials are available or controlled responses are used.
- [ ] Planner Google Tasks add/complete and Trello due list rendering are not regressed.
- [ ] Mobile Calendar and Planner have no page-level horizontal overflow.

### V0.2-W2-06 - Settings + OKR + Weekly Focus Polish

**Alias:** W2f
**Depends on:** `V0.2-W2-05` accepted.

**Tasks:**

- Redesign Settings as the operational control center for integrations, workspace visibility, hidden boards, monitor teams, and BU groups.
- Normalize OKR and Weekly Focus to the W2 page system without expanding strategy scope.
- Preserve all existing settings save paths and OKR/Focus route behavior.

**AC:**

- [ ] Settings save flows and integration status surfaces still work.
- [ ] OKR and Weekly Focus remain accessible and visually consistent with the redesigned shell.
- [ ] Final W2 visual QA covers every production route: `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, and `/settings`.
- [ ] PM may mark W2 Full UI Redesign complete only after `V0.2-W2-06` QA/PM pass.

---

## Phase Execution and Handoff Gates

Recommended next implementation PR:

1. Start from `dev` after accepted W2/W3 integration and current W1 runtime setup changes.
2. Create a W2 phase branch under the existing branch family, default `feature/w2b-review-redesign`.
3. Preserve `V0.2-W2-01` shell/Today behavior and W3 Paperclip mock behavior.
4. Implement `V0.2-W2-02` Review Queue redesign first, including shared task-row/drawer primitives only where needed by Review and later pages. Alias: W2b.
5. Keep the existing static JS architecture; do not rewrite to React/Vite unless PM explicitly approves a separate migration workstream.
6. Capture desktop/mobile screenshots and run `npm.cmd run check:all` before QA.

Phase handoff requirements:

- Dev handoff must list changed files, preserved APIs, screenshots, and verification commands.
- QA must validate changed-page workflows and smoke `V0.2-W2-01` Today plus W3 Paperclip routes when relevant.
- PM acceptance must name the canonical phase accepted, not generic W2 completion, until `V0.2-W2-06` is complete.

---

## Responsive and Desktop QA Requirements

Minimum viewport matrix:

- Desktop large: `1440x900` or wider.
- Desktop common laptop: `1366x768`.
- Tablet: `1024x768`.
- Mobile tall: `390x844`.
- Mobile small: `375x667`.

Every redesigned page must pass:

- No horizontal page overflow at mobile or desktop widths.
- No clipped primary actions, truncated critical task names without a deliberate fallback, or hidden controls.
- Mobile has a usable navigation path; hiding the sidebar without replacement is not acceptable.
- Topbar title/actions wrap or collapse predictably.
- Filter bars and segmented controls remain tappable and do not force the page wider than the viewport.
- Tables/lists collapse into readable rows or horizontal regions only when the horizontal scroll is intentional and contained.
- Modals and drawers fit mobile height, keep save/cancel actions reachable, and preserve typed data when dismissed unless intentionally reset.
- Loading, empty, error, disconnected, and long-data states are visually checked.
- Browser console has no uncaught route/render errors.
- Core actions still work: quick add, open/edit card, approve/reject review task, Calendar event edit, Planner add/complete, Settings save.

Required visual evidence for W2 implementation PRs:

- Desktop and mobile screenshots for every page changed in the PR.
- At least one populated-data state and one empty/error/disconnected state when the page supports them.
- A short QA note comparing screenshots against `docs/design/ui-design-v1-0/` where that prototype is relevant.
- `npm.cmd run check:all` output summary.

Initial visual risks observed during discovery:

- Mobile Today currently clips task row content and can expose horizontal overflow around long board names/date controls.
- Mobile hides the sidebar without a replacement navigation pattern.
- Current production icons are mixed emoji/text glyphs; the prototype has a more consistent icon language.
- The prototype itself needs mobile shell work before it can be treated as the final responsive reference.

---

## Open Questions for PM / Design

- Should W2 make the light prototype direction the production default, or keep the current dark sidebar as a stronger brand/navigation anchor?
- Should OKR and Weekly Focus be visually refreshed in W2, or only preserved and normalized after core MVP pages are redesigned?
- Should dark mode and density controls ship in V0.2 or remain prototype-only?
- Should the task detail drawer become the shared edit surface for Today, Tasks, Boards, Review, Planner, and Calendar-linked tasks?

---

## Handoff

Recommended next Dev task:

```text
Role: Dev
Task: V0.2-W2-02 - Review Queue Redesign + Shared Task Drawer Foundation

Start from `dev` after accepted `V0.2-W2-01`/W3 integration and current W1 runtime setup changes. Implement `V0.2-W2-02` only. Alias: W2b.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md
- docs/design/ui-design-v1-0/README.md
- docs/design/ui-design-v1-0/pages-review-cal-settings.jsx
- docs/design/ui-design-v1-0/app.jsx
- public/style.css
- public/app.js
- public/js/router.js
- public/js/pages/review.js

Goal:
Redesign Review Queue to match the `ui-design-v1-0` direction while preserving current review APIs and workflows. Introduce shared task row/detail drawer primitives only as needed for Review and future W2 phases.

Rules:
- Do not implement W1 deployment/access.
- Do not implement new W3 Paperclip behavior.
- Do not rewrite to React/Vite.
- Preserve route behavior and existing APIs.
- Preserve accepted `V0.2-W2-01` shell/Today behavior.
- Include attribution: Implemented by Codex Dev.

Verify:
- `npm.cmd run check:all`
- Review create/edit/approve/reject/bulk workflows with controlled or live data.
- `V0.2-W2-01` Today smoke.
- Desktop/mobile visual QA evidence for Review and any shared drawer primitives.
```
