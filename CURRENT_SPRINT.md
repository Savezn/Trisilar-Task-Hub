# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W2 Full UI Redesign Phase Planning
**Status:** Active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM

> Use this file to start each Dev / QA / PM session. Historical logs and full plans live in linked docs below.

---

## Current Snapshot

| Area | Status | Source |
|---|---|---|
| V0.1 Release Acceptance | Pass | `docs/logs/QA_LOG.md` R34 |
| P9 open bugs | None currently open | `docs/logs/QA_LOG.md` |
| V0.2 W0 Branch / Environment / CI Setup | QA Pass `9dbb47b` | Implemented by Codex Dev; Reviewed by Codex QA |
| V0.2 W1b Deploy Readiness | Merged to `dev` via PR #1 / `615eb6e` | `docs/deployment/DEPLOYMENT_SETUP.md` |
| V0.2 W1c Dev Environment Deployment Setup | Merged to `dev` via PR #2 / `84c01cf` | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` |
| V0.2 W2 Full UI Redesign | W2a PM Accepted `b5f67fb` / remaining W2b-W2f planned | W2a implemented by Codex Dev; reviewed by Codex QA; phased full redesign plan updated by Codex PM |
| V0.2 W3 Paperclip Mock Integration | PM Accepted `1d1f638` / merged to `dev` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| V0.2 Integration Merge | PM Accepted on `dev` at `dde7ab0` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| Latest runtime fix | `e1b4801` | P9-6 Trello-backed preview regression |
| Latest docs policy | Logs/plans split from Current Sprint; branch workflow documented | Updated by Codex PM |

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | W1c setup merged / hosted runtime setup next | Dev |
| W2 | Full UI Redesign | W2a accepted; W2b-W2f planned; full redesign not complete | Dev |
| W3 | Paperclip Multi-Agent Integration | Done `1d1f638` / QA Pass / PM Accepted / merged to `dev` | PM complete |
| Integration | Accepted W2/W3 into `dev` | QA Pass / PM Accepted at `dde7ab0` | PM complete |

---

## Documentation Routing

| Need | Read |
|---|---|
| Current task and next action | `CURRENT_SPRINT.md` |
| Full V0.2 branch/workstream plan | `docs/plans/VERSION_0_2_PLAN.md` |
| Durable W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| W2 full UI redesign phase plan | `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md` |
| W1 deploy-readiness setup | `docs/deployment/DEPLOYMENT_SETUP.md` |
| W1 dev environment runtime setup | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` |
| QA history and completed work archive | `docs/logs/QA_LOG.md` |
| PM decisions and phase context | `docs/logs/DECISION_LOG.md` |
| Product/UX scope | `MVP_PRD.md` |
| Historical roadmap/progress tracker | `docs/archive/DEVELOPMENT_HISTORY.md` |
| File/function lookup hints | `docs/reference/KEY_FILE_MAP.md` |

---

## Parallel Workstream Write Ownership

| File / Area | Write Owner | Rule |
|---|---|---|
| `CURRENT_SPRINT.md` | PM only | Dev/QA may read but must not update this file during W1/W2/W3 parallel work; integration conflict resolution may preserve accepted PM status. |
| `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` | PM only | Preserve prompts for all workstreams; do not delete other workstream prompts. |
| W1 plan/files | W1 Dev / QA | Keep W1 updates inside W1-owned docs/branches until PM checkpoint. |
| W2 plan/files | W2 Dev / QA | Keep W2 updates inside W2-owned docs/branches until PM checkpoint. |
| W3 plan/files | W3 Dev / QA | Keep W3 updates inside W3-owned docs/branches until PM checkpoint. |

Required branches:

- W1b: `feature/w1-deploy-readiness` merged to `dev` in PR #1
- W1c: `feature/w1c-dev-environment-deployment` merged to `dev` in PR #2
- W2: `feature/w2-*` phase branches; next default `feature/w2b-review-redesign`
- W3: `feature/w3-paperclip-integration`

Required worktrees:

- PM / Integration: `trisilar-task-hub` on `dev`
- W1c: runtime setup uses hosted platform dashboards and no repo branch unless a fix is discovered
- W2: `trisilar-task-hub-w2-ui-redesign` on the active `feature/w2-*` phase branch
- W3: `trisilar-task-hub-w3-paperclip` on `feature/w3-paperclip-integration`

Parallel rule:

- W1/W2/W3 Dev agents must not edit `CURRENT_SPRINT.md` directly.
- W1/W2/W3 Dev agents must not share one feature branch.
- W1/W2/W3 Dev agents must not run in the same working directory.
- Before editing, each agent must run `git status --short --branch` and confirm the folder/branch match the assigned workstream.
- QA agents report evidence in the workstream handoff/doc, not `CURRENT_SPRINT.md`.
- PM is the only role that updates `CURRENT_SPRINT.md` after QA pass, PM decision, or integration checkpoint.
- If a Dev/QA task needs a status change, leave a PM handoff note instead of editing the sprint snapshot.

---

## Next Action - W2b Review Queue Redesign

Accepted W2a (`b5f67fb`) is now treated as shell foundation and Today redesign only. Full W2 UI redesign remains open through W2b-W2f. The next planned role is W2b Dev to redesign Review Queue against `docs/design/ui-design-v1-0/` while preserving W2a/W3 behavior.

```text
Role: Dev
Task: V0.2 W2b - Review Queue Redesign + Shared Task Drawer Foundation

Context:
V0.2 W2a shell/Today redesign was accepted at `b5f67fb`, but PM has clarified this is not full W2 UI redesign completion. W2 is now phased as W2a-W2f in `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`. Implement W2b only.

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

Steps:
1. Confirm branch/worktree before editing.
2. Preserve accepted W2a shell/Today behavior and W3 Paperclip mock behavior.
3. Use a W2 phase branch under `feature/w2-*`, default `feature/w2b-review-redesign`.
4. Redesign `/review` using the prototype's review card, confidence, diff, target-field, sync-toggle, and bulk-action patterns where compatible with the static JS app.
5. Add or extend shared UI primitives only when they support W2b and later W2 pages.
6. Preserve review create/edit/approve/reject/bulk APIs and existing route behavior.
7. Capture desktop/mobile visual QA evidence for Review and any shared drawer primitives.
8. Run `npm.cmd run check:all`.

Rules:
- Do not implement W1 deployment/access.
- Do not implement new W3 Paperclip behavior.
- Do not rewrite to React/Vite unless PM explicitly approves.
- Preserve route behavior and existing APIs.
- Include attribution: Implemented by Codex Dev.
```

**Attribution:** V0.2 W2a/W3 integration accepted by Codex PM after Codex QA pass at `dde7ab0`. W2 full UI redesign phased plan updated by Codex PM. W1b/W1c implemented by Codex Dev, reviewed by Codex QA/PM, and merged by Codex PM. W2a and W3 implemented by Codex Dev, reviewed by Codex QA, and accepted by Codex PM.
