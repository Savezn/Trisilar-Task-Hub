# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W1c Dev Runtime Setup
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
| V0.2 W1b Deploy Readiness | Merged to `dev` via PR #1 / `615eb6e` | `docs/reference/DEPLOYMENT_SETUP.md` |
| V0.2 W1c Dev Environment Deployment Setup | Merged to `dev` via PR #2 / `84c01cf` | `docs/reference/DEV_ENVIRONMENT_DEPLOYMENT.md` |
| V0.2 W2 Shell + Today Redesign | PM Accepted `b5f67fb` / merged to `dev` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
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
| W2 | Full UI Redesign | Done `b5f67fb` / QA Pass / PM Accepted / merged to `dev` | PM complete |
| W3 | Paperclip Multi-Agent Integration | Done `1d1f638` / QA Pass / PM Accepted / merged to `dev` | PM complete |
| Integration | Accepted W2/W3 into `dev` | QA Pass / PM Accepted at `dde7ab0` | PM complete |

---

## Documentation Routing

| Need | Read |
|---|---|
| Current task and next action | `CURRENT_SPRINT.md` |
| Full V0.2 branch/workstream plan | `docs/plans/VERSION_0_2_PLAN.md` |
| Durable W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| W1 deploy-readiness setup | `docs/reference/DEPLOYMENT_SETUP.md` |
| W1 dev environment runtime setup | `docs/reference/DEV_ENVIRONMENT_DEPLOYMENT.md` |
| QA history and completed work archive | `docs/logs/QA_LOG.md` |
| PM decisions and phase context | `docs/logs/DECISION_LOG.md` |
| Product/UX scope | `MVP_PRD.md` |
| Roadmap/progress tracker | `DEVELOPMENT_PLAN.md` |
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
- W2: `feature/w2-ui-redesign`
- W3: `feature/w3-paperclip-integration`

Required worktrees:

- PM / Integration: `trisilar-task-hub` on `dev`
- W1c: runtime setup uses hosted platform dashboards and no repo branch unless a fix is discovered
- W2: `trisilar-task-hub-w2-ui-redesign` on `feature/w2-ui-redesign`
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

## Next Action - W1c Hosted Dev Runtime Setup

Accepted W2 (`b5f67fb`) and W3 (`1d1f638`) are integrated and PM accepted on `dev` at `dde7ab0`. The next planned role returns to W1c hosted dev runtime setup. This is runtime/platform setup only; do not implement new W2/W3 scope and do not deploy production.

```text
Role: Dev
Task: V0.2 W1c - Hosted Dev Runtime Setup and Verification

Context:
V0.2 W2/W3 integration was accepted on `dev` at `dde7ab0`. W1c dev environment deployment setup was merged to `dev` through PR #2 at `84c01cf`. The next W1 step is hosted dev runtime setup and verification only.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/DEPLOYMENT_SETUP.md
- docs/reference/DEV_ENVIRONMENT_DEPLOYMENT.md

Goal:
Complete hosted dev runtime setup and verification only. Do not deploy production.

Steps:
1. Confirm Trisilar Render account/workspace access, or explicitly choose Railway.
2. Connect the hosted dev service from branch `dev`.
3. Configure dev-only platform secret values in the platform dashboard; do not commit secret values.
4. Configure persistent disk/volume and set `APP_DATA_DIR` for `review-sessions.json`, `card-events.json`, and `bu-config.json`.
5. Configure the hosted dev `APP_BASE_URL` and matching `GOOGLE_REDIRECT_URI`.
6. Configure dev DNS.
7. Put the dev URL behind Cloudflare Access email allowlist before teammate preview.
8. Verify hosted `GET /healthz`, anonymous access blocked by Cloudflare Access, approved teammate access, and basic non-destructive app loading.
9. Record any remaining user/runtime blockers clearly.

Rules:
- Do not implement W2 UI redesign or W3 Paperclip integration.
- Do not deploy production.
- Do not commit secrets.
- Do not merge to `main`.
- Use platform dashboards for secrets; repo changes are only allowed if a setup defect is found and must go through PR.
- Preserve accepted W2/W3 behavior on `dev`.
- Include attribution: Runtime setup by Codex Dev.
```

**Attribution:** V0.2 W2/W3 integration accepted by Codex PM after Codex QA pass at `dde7ab0`. W1b/W1c implemented by Codex Dev, reviewed by Codex QA/PM, and merged by Codex PM. W2 and W3 implemented by Codex Dev, reviewed by Codex QA, and accepted by Codex PM.
