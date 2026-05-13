# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W1 Access Foundation - DigitalOcean/Cloudflare Runtime
**Status:** Active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM

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
| V0.2 W1 hosted dev/demo runtime | QA Pass / PM Accepted for dev/demo | Task Hub runs on the existing DigitalOcean Droplet from `dev@b9961fa`, binds `127.0.0.1:3000`, uses `APP_DATA_DIR=/home/trisilar/dashboard-data`, is routed at `https://taskhub.trisila.online` behind Cloudflare Access, and has Trello env configured server-side only. `V0.2-W1-06` and `V0.2-W1-08` are accepted as dev/demo runtime complete, not production/release-grade. |
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
| W1 | Company Access + Deployment | `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06`/`V0.2-W1-08` accepted as Cloudflare-protected DigitalOcean dev/demo runtime; `V0.2-W1-07` service-auth topology planned and needs QA/PM acceptance | QA |
| W2 | Full UI Redesign | `V0.2-W2-01`-`V0.2-W2-05` accepted and integrated on `dev`; `V0.2-W2-06` remains the final planned W2 phase; full redesign not complete | Dev |
| W3 | Paperclip Multi-Agent Integration | Mock path done `1d1f638` / QA Pass / PM Accepted / merged to `dev`; live path blocked until W1-07 service-auth topology passes QA/PM and Paperclip owner inputs are confirmed | PM / Paperclip owner |
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

## Next Action - V0.2-W1-07 QA Review for Paperclip Service-Auth Planning

Project ladder now lives in `docs/plans/PROJECT_LADDER.md`. `V0.2-W1-05` (`W1.4`) remains accepted as demo-only random ngrok access. `V0.2-W1-06` and `V0.2-W1-08` are accepted as Cloudflare-protected DigitalOcean dev/demo runtime complete after QA pass and PR #9 merge to `dev` at `91ee327`. This does not replace production deployment, does not implement W3 live Paperclip behavior, and does not merge to `main`.

QA evidence on 2026-05-13: `taskhub-dashboard.service` is active/enabled; Task Hub binds `127.0.0.1:3000`; raw public `157.230.251.209:3000` is unreachable; anonymous `https://taskhub.trisila.online/healthz` returns Cloudflare Access `302`; approved-user browser access loaded the app without `/api/boards` or `/api/all-cards` 401 errors; local `/healthz`, `/api/boards`, and `/api/all-cards` return `200`; `GOOGLE_REDIRECT_URI` is `https://taskhub.trisila.online/auth/callback`; `APP_DATA_DIR` persistence survived restart; secrets are present only as server-side env keys and were not recorded in docs/chat.

W1 is not fully complete yet because `V0.2-W1-07` service-auth planning needs QA/PM acceptance before W3 live connector work.

```text
Role: QA / PM
Task: V0.2-W1-07 - Review Paperclip Service-Auth Planning for Hosted Task Hub
Alias: W1.6

Context:
`V0.2-W1-05` passed teammate demo and remains accepted as manual demo-only access. `V0.2-W1-06` and `V0.2-W1-08` are accepted as dev/demo runtime complete after QA pass. Task Hub is hosted at `https://taskhub.trisila.online` behind Cloudflare Access. Paperclip is hosted at `https://paperclip.trisila.online` behind Cloudflare by the Paperclip owner. W1-07 planning selects Paperclip -> Task Hub webhook as the first live direction, using Cloudflare Access service token plus signed webhook headers. W1-07 does not implement live W3 behavior.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Goal:
Review whether W1-07 service-auth planning is sufficient to unblock W3 live connector planning after Paperclip owner inputs are confirmed.

Steps:
1. Confirm W1-07 planning is docs-only and does not implement live W3 behavior.
2. Confirm first live direction is Paperclip calls Task Hub webhook, not Task Hub polling Paperclip.
3. Confirm human Cloudflare Access login and machine/API auth are separated.
4. Confirm service-auth pattern is Cloudflare Access service token plus signed webhook headers.
5. Confirm env var names are documented without secret values.
6. Confirm replay/idempotency requirements are clear for W3.
7. Confirm remaining Paperclip owner inputs are explicitly listed.
8. Confirm W3 live connector remains blocked until QA/PM acceptance and owner inputs.
9. If pass, recommend PM accept `V0.2-W1-07` and route W3 live connector planning.

Rules:
- QA only: do not patch code.
- Do not deploy production.
- Do not merge to main.
- Do not expose secrets, Cloudflare tokens, or Trello/Google credential values.
- Do not implement W2 UI redesign or new W3 Paperclip behavior.
- Preserve W1.4 demo-only status.
- Include attribution: Planned by Codex PM / Dev; reviewed by Codex QA.
```

**Attribution:** W1 runtime rebaseline recorded by Codex PM. W1.4 demo confirmed by teammate and accepted by Codex PM. Paperclip-on-DigitalOcean status confirmed by PM and recorded by Codex PM. W1.5/W1.7 runtime checkpoint recorded by Codex PM; reviewed by Codex QA; accepted by Codex PM. W1.6 service-auth topology planned by Codex PM / Dev.
