# Version 0.6 UI V2 First-Slice Implementation Plan

**Doc Role:** PM/UX scoped implementation plan for the first V0.6 UI V2 slice
**Status:** PM/UX accepted S0 execution boundary; ready for Frontend Dev / UX / QA
**Owner:** PM / UX Owner / Frontend Dev / QA
**Created:** 2026-05-16
**Updated by:** Codex PM / UX Owner
**Related Docs:** `VERSION_0_6_UI_V2_PLANNING_SCOPE.md`, `../design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md`, `../design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md`, `../design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `../design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md`, `../logs/V0_3_RUX_FINDINGS.md`

---

## Decision

V0.6 may proceed because V0.5 Foundation Hardening is PM accepted on current `origin/dev`.

The first implementation slice is **V0.6-S0: shell, navigation, token layer, and route-state foundation**. S0 must establish the UI V2 frame without changing product behavior, runtime behavior, external integrations, or Review Queue approval semantics.

This plan opens the first scoped V0.6 UI implementation task. Frontend Dev / UX / QA may execute S0 inside the ownership and verification boundaries below.

---

## Scope

V0.6-S0 may include:

- UI V2 token aliases and shared style primitives in the current static app.
- App shell, sidebar/topbar/bottom-nav, route title, and status-strip visual foundation.
- Shared route-state primitives for disconnected, empty, loading, warning, and error states.
- Minimal route metadata or shell hooks needed to keep route headings/status consistent.
- Browser and responsive evidence that existing routes remain reachable.

V0.6-S0 must not include:

- Full Rewrite, framework migration, build-system migration, or app architecture rewrite.
- Runtime setup, Cloudflare policy, service deployment, secrets, webhook auth, or live Paperclip flag changes.
- Trello, Calendar, Google Tasks, or live Paperclip side effects.
- Team OS product features.
- Route-specific layout rewrites beyond what is necessary to attach shell/state primitives safely.
- Review Queue approval behavior changes, auto-approval, or reduced side-effect disclosure.

Preserved operating model:

```text
Trello = execution surface
Task Hub = command/review layer
Review Queue = human approval gate
Paperclip / AI = controlled intake sources
```

---

## Write Ownership

| File / area | Owner | Allowed in S0 | Not allowed in S0 |
|---|---|---|---|
| `public/style.css` | Frontend Dev / UX | Token aliases, shell/nav/topbar/status strip/mobile nav, state primitives, responsive layout fixes | Route-specific visual rewrites that change workflow meaning |
| `public/index.html` | Frontend Dev | Minimal shell/status/mobile-nav structure if required by the S0 frame | New product flows, runtime config, secret text |
| `public/js/router.js` | Frontend Dev | Route metadata or shell-state hook only if needed | Route behavior rewrites or API/data contract changes |
| `public/app.js` | Frontend Dev | Shell initialization primitives only if needed | Planner/data behavior rewrites, integration behavior changes |
| `public/js/utils.js` | Frontend Dev | Shared UI helper only if needed for route states | API calls, persistence, external side effects |
| `public/js/pages/*` | Route owner / Frontend Dev | Only narrow adoption of shared state wrapper if required by S0 smoke evidence | Route layout migration; approval/trello/calendar/google-task behavior changes |
| `docs/plans/*`, `CURRENT_SPRINT.md`, `TODO.md`, `docs/logs/*` | PM / QA | Status, handoff, QA evidence, and decision updates | Runtime secrets or operational values |

Forbidden write areas for S0:

- `src/`
- `server.js`
- `trello.js`
- `review-store.js`
- `task-diff.js`
- `docs/deployment/`
- `docs/reference/SECURITY_ACCESS_POLICY.md`
- runtime config files and environment files

---

## Route Order

| Order | Slice | Surface | Implementation intent |
|---:|---|---|---|
| 1 | S0 | App shell, route bar, status strip, shared route states | Establish UI V2 foundation without behavior changes |
| 2 | S1 | Today | Daily command center and Review Queue pressure |
| 3 | S2 | All Tasks | Dense task inbox with source/owner/due/status clarity |
| 4 | S3 | Review Queue | Human gate, risk, target, side-effect disclosure |
| 5 | S4 | Docs / AI Trace | Evidence, trace chips, missing-link states |
| 6 | S5 | Settings | Integration status and safe owner/action states |
| 7 | S6 | Boards Monitor | Board health and convention warnings |
| 8 | S7 | Calendar | Source-separated schedule context |
| 9 | S8 | Planner | Google Tasks/Trello planning states |
| 10 | S9 | OKR / Portfolio | Objective progress and stale-status clarity |
| 11 | S10 | Weekly Focus | Weekly lanes and Review Queue handoff |

First implementation task: **S0 only**.

S0 may smoke-check every route, but it should not attempt S1-S10 route polish in the same commit.

---

## Acceptance Criteria

V0.6-S0 passes when:

- Existing routes remain reachable: `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, `/docs`.
- Shell/navigation works on desktop and mobile with no page-level horizontal overflow.
- Route title/subtitle/status context remains visible where currently available.
- Review Queue entry points and badge/pressure indicators remain visible and do not imply auto-approval.
- No runtime/API/data contract changes are introduced.
- No secrets, service-token values, signing material, or private runtime values appear in UI text, screenshots, docs, or logs.
- Existing browser regression passes or any failure is triaged as unrelated before PM review.
- S0 can be reverted cleanly without database migration, runtime rollback, or external cleanup.

Minimum screenshot evidence after code work:

- Desktop `1440x900`: Today and Review Queue.
- Mobile `390x844`: Today and Review Queue.
- Optional: All Tasks desktop/mobile if shell navigation changes are broad.

---

## Verification Plan

Frontend Dev / QA should run after S0 implementation:

```powershell
npm test
npm run check:all
npm run verify:rux-browser-regression
git diff --check
```

Scope-safety checks:

```powershell
git diff --name-only -- src server.js trello.js review-store.js task-diff.js package.json package-lock.json .env.example railway.toml render.yaml docs/deployment docs/reference/SECURITY_ACCESS_POLICY.md
rg -n "<<<<<<<|=======|>>>>>>>" CURRENT_SPRINT.md TODO.md docs
```

Expected safety result: no forbidden runtime/security/source files are touched by the S0 UI slice.

If UI code changes, QA should also capture browser screenshots or a screenshot pack for the required desktop/mobile evidence.

---

## Rollback Boundary

S0 must be revertable as one scoped UI commit affecting only:

- `public/index.html`
- `public/style.css`
- `public/js/router.js`
- `public/app.js`
- `public/js/utils.js`
- narrowly necessary `public/js/pages/*` state-wrapper adoption
- planning/status/QA docs

Rollback must not require:

- database migration or data cleanup
- runtime restart
- Cloudflare update
- Paperclip Settings change
- Trello, Calendar, or Google Tasks cleanup
- production storage or environment changes

---

## First Dev Handoff

```text
Role: Frontend Dev / UX Owner / QA
Task: Implement V0.6-S0 shell/navigation/token/state foundation only.

Inputs:
- docs/plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md
- docs/plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md
- docs/design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md
- docs/design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md
- docs/logs/V0_3_RUX_FINDINGS.md

Branch/worktree:
- Branch: codex/v06-ui-v2-implementation
- Worktree: trisilar-task-hub-v06-ui-v2
- Base: latest origin/dev after PR #44 merge

Rules:
- S0 only: shell, navigation, token layer, shared route states.
- No Full Rewrite.
- No runtime, Cloudflare, secrets, Paperclip live behavior, webhook auth, or external side effects.
- Preserve Trello as execution surface, Task Hub as command/review layer, Review Queue as human gate.
- Keep route behavior and public API/data contracts unchanged.

Expected output:
- S0 implementation summary.
- Route/component coverage.
- Browser/responsive evidence.
- Regression results.
- Gaps for S1-S10.
- Confirmation that no forbidden runtime/security/source files were touched.
```
