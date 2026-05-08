# V0.2 W2 UI Redesign Discovery and Implementation Plan

**Doc Role:** W2-owned discovery, scope, rollout, and QA plan  
**Status:** Draft for PM / QA review  
**Workstream:** V0.2 W2 - Full UI Redesign  
**Branch Baseline:** `dev` after W0 QA pass at `9dbb47b`  
**Created:** 2026-05-08  
**Implemented by:** Codex Dev  
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../../MVP_PRD.md`, `../design/ui-design-v1-0/README.md`

---

## Boundary

This W2 discovery pass does not implement W1 deployment/access work and does not implement W3 Paperclip integration. It preserves the existing Trello, Google Calendar, Google Tasks, Review Queue, Boards Monitor, OKR, and Weekly Focus workflows.

`CURRENT_SPRINT.md` remains PM-owned during parallel workstreams, so this document is the W2 handoff artifact.

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

## Recommended Rollout Order

1. **Design System and Shell Foundation**
   - Create shared production tokens and component classes in `public/style.css`.
   - Redesign sidebar/topbar, buttons, chips, forms, modals, drawers, loading/empty/error states.
   - Add mobile navigation/collapsed shell behavior before page redesigns depend on it.

2. **Today**
   - Highest daily-value surface and first screen.
   - Keep overdue, due today, upcoming, pending review, calendar events, and quick add.
   - Fix mobile overflow and make the first viewport answer "what needs attention today?"

3. **Review Queue**
   - Critical "review before automation" workflow.
   - Port prototype patterns for diff status, confidence, reasoning, editable target fields, sync toggles, and bulk actions.
   - Preserve current session create/approve/reject APIs.

4. **Tasks**
   - Redesign as a cross-board inbox optimized for scanning.
   - Preserve search, filters, grouping, label/owner filtering, CSV export, and edit flow.
   - Use the same task row and detail drawer patterns introduced by Today/Review.

5. **Boards**
   - Redesign Boards Monitor and board/team layouts after task row patterns stabilize.
   - Preserve board/team modes, label filtering, metadata health, convention warnings, and board open actions.

6. **Calendar and Planner**
   - Calendar should clearly distinguish Google events from Trello deadlines.
   - Planner should keep Google Tasks add/complete and Trello due today/tomorrow.
   - Reuse shell, filters, status chips, and empty/disconnected states.

7. **Settings, OKR, Weekly Focus**
   - Settings should become the control center for integrations, visibility, teams, BU groups, and future AI review controls.
   - OKR and Weekly Focus should inherit the same page system without expanding W2 into new strategy features.

---

## Preparatory Implementation Plan

Recommended first implementation PR after this discovery:

1. Add a production UI token section and component inventory comment in `public/style.css`.
2. Introduce a mobile shell/navigation pattern without changing route behavior.
3. Redesign shared shell primitives: sidebar, topbar, buttons, chips, panels, rows, forms, modal/drawer shell, empty/loading/error states.
4. Convert Today page markup to the new classes while preserving API calls and action handlers.
5. Capture desktop/mobile screenshots for Today before continuing to Review Queue.

Decision needed before deeper implementation:

- Confirm whether W2 should stay in the current static JS architecture for V0.2 or open a separate framework-migration workstream. The conservative recommendation is to stay static for V0.2 W2 and port the prototype's visual system, because W1/W3 can then integrate against the existing app without a moving framework boundary.

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
Implement W2 shell foundation and Today redesign on the current static JS architecture. Preserve route behavior and existing APIs. Include desktop/mobile screenshots, console check, and npm.cmd run check:all evidence before handing to QA.
```

