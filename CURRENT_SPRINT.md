# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W1 Access Foundation - DigitalOcean/Cloudflare Runtime
**Status:** Active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-12 - **Updated by:** Codex PM

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
| V0.2 W1 runtime rebaseline | Pending PM/DevOps setup | Paperclip is now hosted on DigitalOcean behind Cloudflare by the Paperclip owner; remaining W1 runtime path is Task Hub hosted dev/demo behind Cloudflare plus service-auth verification |
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
| W1 | Company Access + Deployment | `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06`/`V0.2-W1-08` pending for Cloudflare-protected DigitalOcean hosted dev/demo for Task Hub; hosted Paperclip endpoint must be recorded for service-auth | DevOps / Dev |
| W2 | Full UI Redesign | `V0.2-W2-01`-`V0.2-W2-05` accepted and integrated on `dev`; `V0.2-W2-06` remains the final planned W2 phase; full redesign not complete | Dev |
| W3 | Paperclip Multi-Agent Integration | Mock path done `1d1f638` / QA Pass / PM Accepted / merged to `dev`; live path blocked until Task Hub has a stable DigitalOcean/Cloudflare runtime and service auth with hosted Paperclip is confirmed | PM / Paperclip owner |
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
| W1 deploy-readiness setup (`V0.2-W1-02`) and DigitalOcean/Cloudflare hosted dev path | `docs/deployment/DEPLOYMENT_SETUP.md` |
| W1 dev deployment config / ngrok demo handoff / DigitalOcean runtime notes (`V0.2-W1-03` to `V0.2-W1-08`) | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` |
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
- `V0.2-W1-05`: ngrok temporary demo runtime uses local runtime tools; repo branch only if a docs/setup defect is discovered
- `V0.2-W1-08`: DigitalOcean hosted dev/demo setup uses latest `dev`, server-only secrets, and Cloudflare front door for Task Hub; repo changes only if setup defects are found
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

## Next Action - V0.2-W1-08 DigitalOcean Hosted Dev/Demo Runtime Setup

Project ladder now lives in `docs/plans/PROJECT_LADDER.md`. `V0.2-W1-05` (`W1.4`) remains accepted as demo-only random ngrok access. PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. The next W1 runtime step is Task Hub hosted dev/demo on DigitalOcean behind Cloudflare. This does not replace production deployment, does not implement W3 live Paperclip behavior, and does not merge to `main`.

W3 live connector work remains blocked until the hosted Task Hub URL, hosted Paperclip URL, health/readiness path, and service-auth path are verified together.

```text
Role: DevOps / Dev
Task: V0.2-W1-08 - DigitalOcean Hosted Dev/Demo Runtime Setup
Alias: W1.7

Context:
`V0.2-W1-05` passed teammate demo and remains accepted as manual demo-only access. PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. The remaining W1 runtime work is to put Task Hub on DigitalOcean behind Cloudflare and verify service-auth readiness against the hosted Paperclip endpoint.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Goal:
Set up or prepare hosted dev/demo runtime on DigitalOcean behind Cloudflare for Task Hub without deploying production.

Steps:
1. Confirm Cloudflare domain and Task Hub hostname, default `taskhub-dev.<domain>`, plus the already-hosted Paperclip hostname from the Paperclip owner.
2. Prepare the Cloudflare Access application and email allowlist for the Task Hub hostname before any public teammate preview.
3. Confirm DigitalOcean account access and create/select one dev-only Droplet or approved DO runtime layout for Task Hub.
4. Pull the latest Task Hub `dev` branch on the Droplet and run it on a private/local bind only.
5. Configure server-only dev secrets and `APP_DATA_DIR`; do not put values in chat or git.
6. Configure `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` for the Task Hub Cloudflare hostname.
7. Connect the Task Hub hostname through Cloudflare routing with Tunnel preferred, or proxied DNS + reverse proxy if selected.
8. Verify Cloudflare Access blocks anonymous access before sharing any URL.
9. Verify Task Hub `/healthz`, approved teammate access, non-destructive app load, and runtime file persistence through the Cloudflare hostname.
10. Record the hosted Paperclip URL/health evidence supplied by the Paperclip owner and route W1.6 service-auth planning next.

Rules:
- Do not deploy production.
- Do not merge to main.
- Do not commit secrets.
- Do not implement W2 UI redesign.
- Do not implement new W3 Paperclip behavior.
- Repo changes only if a setup defect is found and must go through PR.
- Include attribution: Runtime setup by Codex DevOps/Dev.
```

**Attribution:** W1 runtime rebaseline recorded by Codex PM. W1.4 demo confirmed by teammate and accepted by Codex PM. Paperclip-on-DigitalOcean status confirmed by PM and recorded by Codex PM.
