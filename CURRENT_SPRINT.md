# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W2 Full UI Redesign - W2-06 Next
**Status:** Active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-09 - **Updated by:** Codex PM

> Use this file to start each Dev / QA / PM session. Historical logs and full plans live in linked docs below.

---

## Current Snapshot

| Area | Status | Source |
|---|---|---|
| V0.1 Release Acceptance | Pass | `docs/logs/QA_LOG.md` R34 |
| P9 open bugs | None currently open | `docs/logs/QA_LOG.md` |
| V0.2 W0 Branch / Environment / CI Setup | QA Pass `9dbb47b` | Implemented by Codex Dev; Reviewed by Codex QA |
| V0.2-W1-02 Deploy Readiness | Merged to `dev` via PR #1 / `615eb6e` | `docs/deployment/DEPLOYMENT_SETUP.md`; legacy label W1b |
| V0.2-W1-03 Dev Deployment Config | Merged to `dev` via PR #2 / `84c01cf` | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md`; legacy label W1c |
| V0.2-W1-05 ngrok Random URL Demo | QA Pass / PM Accepted as demo-only path | Reviewed by Codex QA; Accepted by Codex PM; current URL/credentials remain local-only in Desktop handoff file |
| V0.2 W2 Full UI Redesign | `V0.2-W2-01` through `V0.2-W2-05` accepted and integrated through `dev@3fca059`; `V0.2-W2-06` planned next | `V0.2-W2-05` integration QA passed on `dev@3fca059` and is accepted by Codex PM; full redesign still open until `V0.2-W2-06` passes QA/PM |
| V0.2 W3 Paperclip Mock Integration | PM Accepted `1d1f638` / merged to `dev` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| V0.2 Integration Merge | PM Accepted on `dev` at `dde7ab0` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| Latest runtime fix | `e1b4801` | P9-6 Trello-backed preview regression |
| Latest docs policy | Documentation/file consolidation QA Pass `af822c6`; file organization policy `ba7311b` added | Reviewed by Codex QA; Updated by Codex PM |

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06` stable Cloudflare Access gate deferred until domain/subdomain exists | PM / User |
| W2 | Full UI Redesign | `V0.2-W2-01`-`V0.2-W2-05` accepted and integrated on `dev`; `V0.2-W2-06` remains the final planned W2 phase; full redesign not complete | Dev |
| W3 | Paperclip Multi-Agent Integration | Done `1d1f638` / QA Pass / PM Accepted / merged to `dev` | PM complete |
| Integration | Accepted W2/W3 into `dev` | QA Pass / PM Accepted at `dde7ab0` | PM complete |

---

## Documentation Routing

| Need | Read |
|---|---|
| Current task and next action | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Full V0.2 branch/workstream plan | `docs/plans/VERSION_0_2_PLAN.md` |
| Durable W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| W2 full UI redesign phase plan | `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md` |
| W1 deploy-readiness setup (`V0.2-W1-02`) | `docs/deployment/DEPLOYMENT_SETUP.md` |
| W1 dev deployment config / no-cost preview handoff (`V0.2-W1-03` to `V0.2-W1-05`) | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` |
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

- `V0.2-W1-02` / legacy W1b: `feature/w1-deploy-readiness` merged to `dev` in PR #1
- `V0.2-W1-03` / legacy W1c: `feature/w1c-dev-environment-deployment` merged to `dev` in PR #2
- W2: `feature/w2-*` phase branches; next implementation branch `feature/w2-06-settings-okr-focus-redesign`
- W3: `feature/w3-paperclip-integration`

Required worktrees:

- PM / Integration: `trisilar-task-hub` on `dev`
- `V0.2-W1-05`: ngrok temporary demo runtime uses the W1 worktree or local runtime tools; repo branch only if a docs/setup defect is discovered
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

## Next Action - V0.2-W2-06 Settings + OKR + Weekly Focus Polish

Project ladder now lives in `docs/plans/PROJECT_LADDER.md`. Accepted `V0.2-W2-01` (`W2a`, `b5f67fb`) is shell foundation and Today redesign only. Accepted `V0.2-W2-02` (`W2b`, `d33d8f7`) is Review Queue redesign and shared task drawer foundation only. Accepted `V0.2-W2-03` (`W2c`, `ea807fd`) is Tasks Inbox + Cross-board Rows only. Accepted `V0.2-W2-04` (`W2d`, `47ebd84`, integrated `dev@0b77aed`) is Boards Monitor + Team Board Views only. Accepted `V0.2-W2-05` (`W2e`, `4638df7`, integrated `dev@3fca059`) is Calendar + Planner only. Full W2 UI redesign remains open until `V0.2-W2-06` (`W2f`) passes QA/PM acceptance.

The next planned role is Dev to start `V0.2-W2-06` from updated `dev@3fca059` and create the next W2 phase branch.

```text
Role: Dev
Task: V0.2-W2-06 - Settings + OKR + Weekly Focus Polish

Context:
`V0.2-W2-01` through `V0.2-W2-05` are accepted and integrated on `dev` through `3fca059`. Start from updated `dev`, create `feature/w2-06-settings-okr-focus-redesign`, and implement only the final planned W2 UI redesign phase. This phase covers `/settings`, `/okr`, and `/focus`; it should normalize the remaining legacy surfaces to the accepted W2 shell/tokens without expanding strategy scope.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/design/ui-design-v1-0/README.md
- docs/design/ui-design-v1-0/pages-review-cal-settings.jsx
- public/index.html
- public/style.css
- public/app.js
- public/js/router.js
- public/js/pages/settings.js
- public/js/pages/okr.js

Goal:
Redesign Settings, OKR, and Weekly Focus to match the accepted W2 visual system while preserving existing routes, APIs, integration controls, BU groups, workspace visibility, hidden boards, OKR views, and Weekly Focus workflows.

Steps:
1. In the W2 worktree, update from `origin/dev` and confirm the branch starts from `dev@3fca059` or newer.
2. Create `feature/w2-06-settings-okr-focus-redesign` using the latest naming policy.
3. Redesign `/settings` as the operational control center for integrations, workspace visibility, hidden boards, monitor teams, and BU groups.
4. Normalize `/okr` and `/focus` to the W2 page system without adding new portfolio/strategy behavior.
5. Preserve accepted W2-01 through W2-05 behavior and W3 Paperclip mock behavior.
6. Capture desktop/mobile visual evidence for Settings, OKR, and Weekly Focus, including populated and empty/error/disconnected states where applicable.
7. Run `node server.js`, `npm.cmd run check:all`, `npm.cmd run verify:paperclip-contract`, and `npm.cmd run verify:paperclip-mock`.
8. Smoke Today, Review, Tasks, Boards, Calendar, Planner, and W3 regression after the changes.

Rules:
- Do not implement W1 deployment/access.
- Do not implement new W3 Paperclip behavior.
- Do not rewrite to React/Vite unless PM explicitly approves.
- Preserve route behavior and existing APIs.
- Keep W2-06 scoped to Settings, OKR, and Weekly Focus polish.
- Include attribution: Implemented by Codex Dev.
```

**Attribution:** `V0.2-W2-05` implemented by Codex Dev, reviewed by Codex QA Recheck, accepted by Codex PM at `4638df7`, integrated by Codex Dev, and integration-QA accepted by Codex PM on `dev@3fca059`. `V0.2-W2-04` implemented by Codex Dev, reviewed by Codex QA Recheck, accepted by Codex PM at `47ebd84`, and integrated on `dev@0b77aed`. Earlier W2 phases remain accepted as documented. W2 full UI redesign phased plan updated by Codex PM.
