# UI V2 Codex Parity Handoff

**Status:** Active implementation handoff for Codex UI parity work  
**Branch:** `codex/v06-uiv2-full-fidelity`  
**Owner:** PM / UX Owner + Codex Frontend  
**Last updated:** 2026-05-17

This document is the operating contract for any Codex session asked to make the UI development branch match the accepted UI V2 prototype. It exists because screenshot comparison alone has not been enough: Codex can see that two screens differ, but it needs a source-led contract that tells it which tokens, primitives, route sections, states, and verification gates must drive the fix.

## Current Applied Correction

The handoff has been applied to the active documentation set. Future Codex sessions should treat this file as the first-read contract before changing UI V2 code or parity docs.

Latest correction incorporated:

- Review Queue was reopened when `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` reported `mobile approve/reject FAIL` while the route still appeared as PASS.
- The verifier now includes `.review-mobile-actions` and fails the row if extra acceptance checks fail.
- Live empty `/review` now follows the prototype `screens-aux.jsx` StateCard contract: `No proposals to review`, `Review queue is empty`, `Open audit log`, and `Manual upload`.
- `UI_V2_VISUAL_PARITY_REVIEW.md` now records the Review Queue source-led recovery row and evidence.

## Core Rule

Do not start from "make the screenshot look the same." Start from the prototype source, decompose the difference into a concrete UI contract, make a narrow route/component change, then regenerate screenshot evidence.

Screenshot comparison is evidence, not the implementation spec. The authoritative spec is the prototype source plus the component and route contracts below.

## ECC Adoption Boundary

This handoff intentionally uses Everything Claude Code (ECC) as a workflow reference, not as a direct dependency. The right default for this UI V2 lane is approximately 80 percent concept adoption and 20 percent selective utility reuse.

Use ECC for:

- Workflow shape: source-led spec, narrow slice execution, browser evidence, review gate, and acceptance risk reporting.
- Role framing: frontend design direction, design-system audit, accessibility review, browser QA, E2E verification, TypeScript review, and build-fix escalation.
- Templates and checklists that can be rewritten into Trisilar-specific docs without carrying ECC runtime assumptions.

Only copy ECC code when all of these are true:

1. The code is a small self-contained helper, scaffold, or report generator.
2. It does not depend on Claude-specific paths, slash-command harnesses, agents, hooks, external model wrappers, or ECC install state.
3. It solves a real gap in this repo that is not already covered by `verify:uiv2-full-fidelity`, `verify:rux-browser-regression`, `UI_V2_COMPONENT_PARITY_AUDIT.md`, or the existing screenshot matrix.
4. It can be verified in this repo with the normal commands listed below.

Do not copy:

- ECC agent definitions as active project agents.
- ECC slash commands as-is.
- Hook graphs, autonomous loops, multi-model wrappers, or Claude/Gemini-specific command runners.
- Broad design-system or QA scripts that duplicate existing Trisilar-specific verifier behavior.

If code reuse still looks useful, first write a short gap note naming the missing capability and why existing Trisilar tooling is not enough. Prefer implementing a local Trisilar utility with narrow scope over importing an ECC surface wholesale.

## Authoritative Inputs

Read these before touching code:

1. `docs/design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md`
   - Source of truth for tokens, shell geometry, component primitives, route composition, mobile surfaces, and safety rules.
2. `docs/design/ui-design-v2/prototype/`
   - Interactive prototype and extracted CSS/JS source. If `UIV2_PROTOTYPE_DIR` is not set, the verifier currently resolves the prototype from the sibling `trisilar-task-hub-v06-s0-ui-foundation` worktree.
3. `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md`
   - PM/UX-facing route findings and acceptance rules.
4. `docs/design/ui-design-v2/UI_V2_COMPONENT_PARITY_AUDIT.md`
   - Generated component presence audit. Treat this as a structural gate, not human visual acceptance.
5. `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`
   - Generated route matrix, viewport coverage, screenshots, and deviation status.
6. `docs/design/ui-design-v2/UI_V2_PROTOTYPE_DEVIATION_LOG.md`
   - The only place to accept intentional prototype differences.

## Hard Scope

Allowed:

- Frontend shell, layout, style, route rendering, component primitives, mobile surfaces, and screenshot verification.
- Controlled fixture behavior used only for UI verification.
- Documentation that records parity gaps, accepted deviations, and verification evidence.

Not allowed:

- Runtime setup, production secrets, Cloudflare policy, webhook auth, live Paperclip behavior, live Trello/Calendar/Google Tasks writes, AI harness behavior, Team OS product scope, or Full Rewrite work.
- Displaying raw secrets, tokens, OAuth headers, `.env` wording, or signing material in UI copy.
- Calling a route "full fidelity" only because selector/no-overflow checks pass.
- Copying ECC agents, commands, hooks, or multi-model wrappers directly into this repo.

## Why Previous Attempts Drifted

Common failure modes to avoid:

| Failure mode | Better Codex behavior |
| --- | --- |
| Comparing screenshots and making broad CSS tweaks. | Identify the prototype primitive first, then patch the matching component or token. |
| Treating generated PASS rows as PM/UX acceptance. | PASS means the automated gate passed; PM/UX visual review can still require changes. |
| Matching desktop while mobile regresses. | Every route slice must check desktop plus the relevant mobile tab or responsive viewport. |
| Copying prototype fixture behavior into production data flows. | Use prototype fixtures only as layout reference; production data remains from existing APIs/stores. |
| Fixing one route by adding one-off styles. | Prefer shared UI V2 primitives unless the prototype has a route-specific exception. |
| Accepting safety-critical differences silently. | Log every intentional prototype difference in `UI_V2_PROTOTYPE_DEVIATION_LOG.md`. |

## Required Work Loop

Use this loop for every route or component slice:

1. **Select one slice**
   - One route, one mobile tab, or one shared primitive.
   - Do not repair all routes in one pass unless the change is a shared token/primitive.

2. **Name the source contract**
   - Cite the prototype files/classes and the doc rows being implemented.
   - Example: `screens-1.jsx ScreenReview`, `components.jsx BulkBar`, `tokens.css`, `screens-mobile.jsx`.

3. **Create a gap row before code**
   - Record the gap in `UI_V2_VISUAL_PARITY_REVIEW.md` or a route-specific note before patching.
   - Use `P0`, `P1`, `P2` severity from that file.

4. **Patch narrowly**
   - Shared primitives first: shell, tokens, `btn`, `chip`, `panel`, `route-bar`, `stat-strip`, `task-row`, `state-card`.
   - Route files next: `public/js/pages/*.js`.
   - CSS recovery layer last, and only when a component primitive cannot carry the change cleanly.

5. **Verify**
   - Run targeted syntax checks for touched JS.
   - Run the UI V2 verifier and compare regenerated screenshots.
   - Check mobile if the route has a mobile tab or responsive concern.

6. **Update evidence**
   - Update the visual parity review or deviation log.
   - Do not mark accepted unless the acceptance rules below are met.

## Route Slice Matrix

| Slice | Production route/file | Prototype target | Must preserve |
| --- | --- | --- | --- |
| Shell / global | `public/index.html`, `public/style.css`, `public/js/router.js`, `public/js/utils.js` | `tokens.css`, `shell.css`, shared `components.jsx` | 220px sidebar, 48px topbar, 24px status strip, Onest UI type, JetBrains Mono metadata, compact 3-8px radius system |
| Today | `public/js/pages/today.js` | `screens-1.jsx ScreenToday`, `TaskRow`, `RouteBar`, `StatStrip` | Next Up first-viewport priority, Review handoff, Calendar peek, disconnected states |
| Review Queue | `public/js/pages/review.js` | `screens-1.jsx ScreenReview`, `BulkBar`, `DiffBadge`, `Risk`, `Confidence`, `InspectionDrawer` | Human gate, diff/risk/confidence, side-effect disclosure, approve/reject/hold/edit controls |
| All Tasks | `public/js/pages/all-tasks.js` | `screens-1.jsx ScreenAllTasks`, `TaskTable` | Dense table/list parity, owner/source metadata, mobile task cards |
| Boards Monitor | `public/js/pages/boards.js` | `screens-2.jsx ScreenBoards`, board card primitives | Compact board health cards, warnings, sparkline rhythm |
| Calendar | `public/js/pages/calendar.js` | `screens-2.jsx ScreenCalendar` | Source legend, month grid, Trello/Google/review-derived schedule separation |
| Planner | `public/app.js` planner helpers | `screens-2.jsx ScreenPlanner` | Google Tasks disconnected notice, Trello due list, source columns |
| OKR / Portfolio | `public/js/pages/okr.js` | `screens-3.jsx ScreenOKR` | Objective rows, KR rows, progress and confidence/status treatments |
| Weekly Focus | `public/app.js` focus helpers | `screens-3.jsx ScreenFocus` | Four lanes, Review AI lane, blocked lane, no vertical title stacking |
| Docs / AI Trace | `public/js/pages/docs.js` | `screens-3.jsx ScreenDocsTrace` | Trace table, evidence card, audit timeline, orphan/missing-link state |
| Settings / More | `public/js/pages/settings.js` | `screens-3.jsx ScreenSettings`, `screens-mobile.jsx More`, `screens-aux.jsx IntegrationRow` | Settings grid, side nav, integration rows, More route list, no secret display |

## Acceptance Rules

A route can be called ready for PM/UX visual review only when all are true:

- `P0` issues are zero.
- `P1` issues are zero or explicitly logged in `UI_V2_PROTOTYPE_DEVIATION_LOG.md`.
- `npm.cmd run verify:uiv2-full-fidelity` passes for the route and required mobile tab.
- Screenshots are regenerated under `docs/logs/screenshots/v06-uiv2-full-fidelity/`.
- `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` and `UI_V2_COMPONENT_PARITY_AUDIT.md` reflect the latest run.
- The implementation does not weaken runtime safety, Review Queue approval gates, or secret handling.

Generated PASS is not final acceptance. Final acceptance remains PM/UX visual review.

## Verification Commands

Use PowerShell from this worktree:

```powershell
node --check public/js/router.js
node --check public/js/utils.js
node --check public/js/pages/today.js
node --check public/js/pages/review.js
node --check public/js/pages/all-tasks.js
node --check public/js/pages/boards.js
node --check public/js/pages/calendar.js
node --check public/js/pages/docs.js
node --check public/js/pages/okr.js
node --check public/js/pages/settings.js
node --check public/app.js
node --check scripts/verify-uiv2-full-fidelity.js
npm.cmd test
$env:PORT='3030'; npm.cmd run check:all
$env:PORT='3030'; npm.cmd run verify:rux-browser-regression
$env:PORT='3030'; npm.cmd run verify:uiv2-full-fidelity
git diff --check
rg "^(<<<<<<<|=======|>>>>>>>)"
```

When only one route changed, it is acceptable to run the relevant `node --check` subset first, but the full verification set is required before claiming the route is ready.

## Codex Prompt Template

Use this prompt when opening a new Codex session:

```text
You are working in Trisilar Task Hub UI V2 on branch codex/v06-uiv2-full-fidelity.

First read:
- docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md
- docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md
- docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md

Task:
Fix only [route/component/slice] to match the accepted UI V2 prototype.

Rules:
- Do not start from screenshot guessing.
- Identify the prototype source primitive first.
- Patch narrowly.
- Use ECC as workflow/reference only. Do not copy ECC agents, commands, hooks, or wrappers unless a small self-contained utility passes the ECC Adoption Boundary in the handoff.
- Keep production data/API/runtime behavior unchanged.
- Log any intentional difference in UI_V2_PROTOTYPE_DEVIATION_LOG.md.
- Regenerate verifier evidence before claiming done.

Deliver:
- Files changed
- Prototype source referenced
- Verification commands run
- Remaining PM/UX visual review risk
```

## Next Codex Task Recommendation

If PM/UX says "it still does not match," do not ask Codex to broadly restyle the app. Ask for one of these:

1. "Create a route-specific gap row for `[route]` with prototype source references, no code changes."
2. "Patch only the `[primitive]` mismatch used by `[routes]`, then rerun UI V2 verifier."
3. "Update the deviation log for `[difference]` if it is intentional and safety-driven."
4. "Regenerate screenshot evidence and summarize remaining visual risk for PM/UX."
