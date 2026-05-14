# Current Sprint - Trisilar Task Hub

**Phase:** V0.2-W3-03 Standing Paperclip Dev/Demo Enablement Policy Planning
**Status:** Active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM

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
| V0.2 W2 Full UI Redesign | `V0.2-W2-06` integrated on `origin/dev@523c948` / PM Accepted | Settings, OKR, and Weekly Focus polish passed feature QA, Dev Integration, and Integration QA on `origin/dev@523c948`; W2 full UI redesign is complete on the integrated `dev` line |
| V0.2 W3 Paperclip Mock Integration | PM Accepted `1d1f638` / merged to `dev` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| V0.2 W3 live Paperclip connector | Code + live interop PM Accepted / merged to `dev` / external sender window QA Pass / standing policy planning / runtime gate closed | `c1e4df2` added the signed inbound webhook. QA passed local verification, live sender interop returned HTTP `201` for request `pc_live_interop_20260514115714`, and W3 merged to `dev` at `a89c26a`. `V0.2-W3-03` limited runtime-local signed canary and true external sender window passed replay/negative checks. Runtime is back to `PAPERCLIP_WEBHOOK_ENABLED=false`. Secret values remain excluded. |
| V0.2 Integration Merge | PM Accepted on `dev` at `dde7ab0` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| Latest runtime fix | `e1b4801` | P9-6 Trello-backed preview regression |
| Latest docs policy | Documentation/file consolidation QA Pass `af822c6`; file organization policy `ba7311b` added | Reviewed by Codex QA; Updated by Codex PM |

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06`/`V0.2-W1-08` accepted as Cloudflare-protected DigitalOcean dev/demo runtime; `V0.2-W1-07` QA Pass / PM Accepted; Paperclip runtime inputs now confirmed for W3 planning | PM complete |
| W2 | Full UI Redesign | `V0.2-W2-06` integrated and PM accepted on `origin/dev@523c948`; W2 full UI redesign complete on `dev` | PM complete / hold |
| W3 | Paperclip Multi-Agent Integration | Mock path done `1d1f638` / QA Pass / PM Accepted / merged to `dev`; live connector code `c1e4df2` and live sender interop PM Accepted; W3 merged to `dev` at `a89c26a`; `V0.2-W3-03` controlled policy accepted; limited and true external sender windows passed; standing dev/demo policy planning started; runtime gate remains disabled | PM / Runtime Owner / QA / Paperclip Owner |
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
- W2: `feature/w2-*` phase branches; `feature/w2-06-settings-okr-focus-redesign` integrated into `origin/dev@523c948` and PM accepted
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

## Next Action - Standing Dev/Demo Enablement Policy

Project ladder now lives in `docs/plans/PROJECT_LADDER.md`. `V0.2-W2-06` Settings + OKR + Weekly Focus Polish is integrated and PM accepted, so W2 is complete on `dev`. `V0.2-W1-06`, `V0.2-W1-08`, and `V0.2-W1-07` remain accepted for dev/demo runtime and service-auth planning.

Runtime evidence on 2026-05-14: Paperclip is running as `paperclip.service` on local runtime port `3100`; `https://paperclip.trisila.online` is the hosted Paperclip base URL; `/healthz` is the confirmed Paperclip health path; allowed non-secret identifiers are `paperclip-do-dev` and `dev`; the Task Hub Cloudflare Access service-token check from the Paperclip server returned `/healthz` status `200`. The W3 live connector code at `c1e4df2` and live signed interop test are PM accepted. W3 was merged into `dev` at `a89c26a`. Cloudflare Client ID/Secret and HMAC signing secret must not be exposed in chat, docs, logs, browser JavaScript, or git.

Runtime gate status:

- Task Hub dev/demo runtime is deployed from `dev@a89c26a` after W3 merge.
- Paperclip Settings connection is configured and secret-backed under `APP_DATA_DIR`.
- `PAPERCLIP_WEBHOOK_ENABLED=false` after the live interop test, limited window, and true external sender window.
- Do not enable standing live webhook traffic until PM explicitly accepts the standing dev/demo policy and names owners.

PM accepted `V0.2-W3-03` controlled live enablement policy and ran a limited runtime-local signed canary window. The canary created Review Queue session `7dd7d2a3-377c-4336-ba75-ba1c312635d2` with task status `pending`, duplicate same-payload replay returned idempotent success, duplicate changed payload returned `409`, invalid signature returned `401`, invalid source returned `403`, invalid environment returned `400`, and the runtime returned to `PAPERCLIP_WEBHOOK_ENABLED=false`. This window did not re-run the external Cloudflare service-token sender path; that path remains covered by the earlier live-sender interop evidence.

PM decision: start standing dev/demo enablement policy planning, but keep `PAPERCLIP_WEBHOOK_ENABLED=false` by default.

True external sender window result on 2026-05-14:

- Window: `V0.2-W3-03 true external Paperclip sender window 2026-05-14`.
- Runtime Owner opened and closed `PAPERCLIP_WEBHOOK_ENABLED`; rollback returned it to `false`.
- Paperclip runtime host/env sent through the public Cloudflare-protected Task Hub URL with service-token headers and HMAC signing.
- Request `pc_true_external_20260514064709`; agent run `run_true_external_20260514064709`.
- Created Review Queue session `0e8f8b2e-d767-44ef-854c-538481c124c8` and task `ef72316d-148d-4c4a-b600-fc5bb14da928`.
- Created task status stayed `pending`; Review Queue human gate remained intact.
- QA checks passed: create `201`, same-payload replay `200`, changed-payload replay `409`, invalid signature `401`, invalid source `403`, invalid environment `400`.
- Final `/healthz` returned `200`; final disabled probe returned `403`; final runtime flag is `PAPERCLIP_WEBHOOK_ENABLED=false`.

```text
Role: Runtime Owner / QA / Paperclip Owner
Task: Review and accept V0.2-W3-03 Standing Dev/Demo Enablement Policy

Required owners:
- PM Owner: Codex PM / project PM.
- Monitor Owner: QA Owner.
- Rollback Owner: Runtime Owner.
- Paperclip Owner: Paperclip runtime sender owner.

Accepted evidence:
- Code: `c1e4df2 V0.2 W3: add live Paperclip webhook connector`.
- Merge: `a89c26a Merge W3 Paperclip integration into dev`.
- QA local verification passed for webhook, contract, mock route, connection settings, docs, frontend, and smoke.
- Live interop returned HTTP `201` for request `pc_live_interop_20260514115714`.
- Created Review Queue session `5c5ad00e-d7b8-4c34-91d2-b17a1ca1566a`.
- Created task stayed `pending`; human approval gate remained intact.
- Limited window runtime-local canary returned HTTP `201` for request `pc_w3_03_window_20260514062346`.
- Limited window Review Queue session `7dd7d2a3-377c-4336-ba75-ba1c312635d2` stayed `pending`.
- Replay and negative checks passed.
- Runtime gate was closed after test: `PAPERCLIP_WEBHOOK_ENABLED=false`.

Window rules:
- Do not deploy production.
- Do not merge to main.
- Do not commit or print secrets.
- Keep `PAPERCLIP_WEBHOOK_ENABLED=false` unless PM explicitly accepts standing dev/demo enablement or names another limited window.
- Preserve Review Queue human gate and existing mock/local Docs behavior.
- Keep Cloudflare Client ID/Secret and HMAC signing secret out of git, docs, logs, browser JavaScript, and chat.

Expected output:
- PM acceptance or hold for standing dev/demo enablement policy.
- Confirm Monitor Owner and Rollback Owner.
- If accepted, hand off to Runtime Owner / QA / Paperclip Owner for a named standing dev/demo start window.
- If held, list exact missing owner or monitoring requirement.
```

**Attribution:** Paperclip runtime inputs confirmed by PM / Runtime; W3-02 implemented by Codex Dev; QA and live interop accepted by Codex PM; W3-03 policy planned and accepted by Codex PM; limited window executed by Codex Runtime Owner / QA; true external sender window executed by Codex Runtime Owner / Paperclip Owner / QA.
