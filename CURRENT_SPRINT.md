# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W1 Manual Teammate Demo Handoff
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
| V0.2 W2 Full UI Redesign | `V0.2-W2-01` accepted (`W2a`, `b5f67fb`); `V0.2-W2-02` accepted (`W2b`, `d33d8f7`) / `V0.2-W2-03`-`V0.2-W2-06` planned | `V0.2-W2-02` implemented by Codex Dev, reviewed by Codex QA/Recheck, accepted by Codex PM; full redesign still open through `V0.2-W2-06` |
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
| W2 | Full UI Redesign | `V0.2-W2-01` and `V0.2-W2-02` accepted; `V0.2-W2-03`-`V0.2-W2-06` planned; full redesign not complete | Dev |
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
- W2: `feature/w2-*` phase branches; next default `feature/w2-02-review-redesign`
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

## Next Action - V0.2-W1-05 Teammate Demo Handoff

`V0.2-W1-05` passed QA and is accepted by PM as a random ngrok URL manual demo path only. This is not a stable Paperclip automation endpoint and does not satisfy the future `V0.2-W1-06` Cloudflare Access / stable hostname gate. The current URL and temporary Basic Auth credentials stay local-only in `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt`; do not paste the password in chat, docs, commits, PRs, or issue trackers.

```text
Role: PM / User
Task: V0.2-W1-05 - Run Manual Teammate Demo With Random ngrok URL
Alias: W1.4

Context:
QA passed W1.4 no-domain ngrok temporary demo verification. PM accepted the random ngrok URL path for short manual teammate demo only. Paperclip stable endpoint remains deferred until a stable hostname is available.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Goal:
Run a short teammate demo through the currently running ngrok URL without exposing secrets or treating the URL as a stable integration endpoint.

Steps:
1. Open `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt` locally.
2. Share the current URL, username, and password to the teammate out of band.
3. Keep the launcher window open while the teammate previews the app.
4. Ask teammate to verify login prompt, app load, and basic non-destructive navigation.
5. Do not ask teammate or Paperclip to store this URL as a permanent endpoint.
6. Stop the demo by pressing Enter in the launcher window after the demo.
7. Record feedback in the next PM update without including the password.

Rules:
- Do not deploy production.
- Do not use paid Render/Railway.
- Do not expose the ngrok password in chat or repo.
- Do not commit secrets.
- Do not treat random ngrok URL as Paperclip automation or stable service integration.
- Keep Basic Auth enabled.
- Include attribution: Accepted by Codex PM.
```

**Attribution:** `V0.2-W1-05` runtime setup by Codex Dev, reviewed by Codex QA, and accepted as demo-only by Codex PM. `V0.2-W2-02` implemented by Codex Dev, reviewed by Codex QA/Recheck, and accepted by Codex PM at `d33d8f7`; W2 full UI redesign remains open through `V0.2-W2-06`.
