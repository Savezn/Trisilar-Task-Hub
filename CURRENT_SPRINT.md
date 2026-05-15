# Current Sprint - Trisilar Task Hub

**Phase:** V0.4 Live AI Operations / Paperclip Production Permanent Integration
**Status:** V0.4 staged production canary passed; runtime gate closed; read-only monitoring active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-15 - **Updated by:** Codex PM / Dev

> Use this file to start each Dev / QA / PM session. Historical logs and full plans live in linked docs below.

---

## Current Snapshot

| Area | Status | Source |
|---|---|---|
| V0.1 Release Acceptance | Pass | `docs/logs/QA_LOG.md` R34 |
| P9 open bugs | None currently open | `docs/logs/QA_LOG.md` |
| V0.2 W0 Branch / Environment / CI Setup | QA Pass `9dbb47b` | Implemented by Codex Dev; Reviewed by Codex QA |
| V0.2 W1 hosted dev/demo runtime | QA Pass / PM Accepted for dev/demo | DigitalOcean + Cloudflare Access; Task Hub persistent `APP_DATA_DIR`; service-auth topology accepted |
| V0.2 W2 Full UI Redesign | Complete on integrated `dev` | `V0.2-W2-06` PM accepted on `origin/dev@523c948` |
| V0.2 W3 Paperclip mock/docs/settings/live connector | PM Accepted through `V0.2-W3-05`; merged/deployed on `dev@2c302dc` | Contract, mock route, Docs, Settings gate, live webhook, live interop, cleanup, cleanup audit retention, and read-only operations status accepted |
| V0.2 W3 runtime cleanup | Complete | Runtime deployed from `dev@7ea4650`; Paperclip test/canary sessions cleaned from 6 pending to 0 pending / 6 rejected / 0 Trello-linked |
| V0.2 W3 standing dev/demo observation | Active with read-only monitor automation | `PAPERCLIP_WEBHOOK_ENABLED=true` on dev/demo; active signed canary only on PM/QA request or after runtime/sender changes |
| V0.2 branch/worktree residue | Cleaned after release/integration QA | Stale W1/W2/W3 worktrees, folders, local branches, and remote workstream branches removed after QA passed on `origin/dev@8027324` |
| Latest W3 dev closeout | `origin/dev@ff20e48` | `V0.2-W3-05` operations status and settings copy polish merged/deployed at `dev@2c302dc`; W3 foundation closeout status is on latest `dev` |
| V0.3 operating model and agent structure | PM Accepted / merged to `dev@ed9fae0` | Reference docs define Task Hub/Trello/Review Queue operating model, AI governance, Codex parallel development, and long-term role ownership under `docs/agents/`. Repo-contained role skills are allowed under `docs/agent-skills/`; installed reusable Codex skill extraction remains deferred. |
| V0.3 Product Reliability + UX Stabilization | Complete / post-sync release QA pass | RUX-02A through RUX-06 are accepted, integrated, deployed to dev/demo, runtime QA passed, release-candidate verification passed on `codex/v03-dev-to-main-release-candidate@5eb23ef`, and `origin/dev` / `origin/main` are synced at `631d3b2`. Production deploy remains a separate runtime decision. |
| V0.4 Paperclip production readiness | Repo readiness integrated to `dev@7e069b5`; production runtime prepared from `dev@e8a211b` | Adds production runtime profile/live mode/status warnings and `verify:paperclip-production-readiness`; production private runtime, Cloudflare tunnel route, DNS, Access app, production service token, and production Paperclip Settings connection are prepared; staged canary passed and runtime gate was closed; no secret exposure or external side effect performed |
| Agent role skill entrypoints | Merged to `origin/dev@de3a6bc` via PR #23 | Added basic repo-contained `SKILL.md` files for Codex, Claude, Gemini, and future agents; no local Codex skill install and no product-version scope |
| Operations/security docs baseline | Merged to `origin/dev@681be25` via PR #25 | Adds runtime operations runbook, data backup/retention policy, security/access policy, onboarding guide, troubleshooting guide, and environment matrix after DoR/DoD baseline merge; branch/worktree cleanup completed |
| UI Web Design V2 Claude Design experiment | PM-routed sidecar docs-only experiment | Adds a research allocation plan and Claude-ready UI/UX guideline under `docs/design/ui-design-v2/`; no product code, runtime config, Cloudflare, Paperclip, or V0.4 branch changes |

---

## Plain-Language PM Summary

Paperclip can now send work into Task Hub through the protected live webhook path. Task Hub verifies Cloudflare Access, HMAC signature, source/environment, request id, agent run id, timestamp, and payload contract before creating a Review Queue session.

The important safety rule is still intact: Paperclip-created tasks enter Review Queue as pending work only. They do not create Trello cards, Calendar events, or Google Tasks until a human approves them.

The test/canary items created during live validation have been cleaned safely. They were rejected/archived with audit retained, not deleted and not approved. Runtime count after cleanup is 0 pending / 0 approved / 6 rejected / 0 Trello-linked.

W3-05 adds that operational hardening: PM/QA/Runtime Owner can now inspect live flag status, connection state, source/environment, Review Queue counts, cleanup state, audit categories, and warnings without sending a new canary. It is merged and deployed at `dev@2c302dc`; W3 foundation closeout status is recorded on `origin/dev@ff20e48`.

V0.3 RUX is complete on the integrated `dev` line and the dev/demo runtime. The accepted V0.3 work adds Trello connection-state/failure-copy clarity, Review Queue and AI trace clarity, Today/Tasks decision-flow polish, browser regression coverage, and a `dev -> main` release checklist. Runtime QA confirmed Task Hub on `dev@02fe7cf`, local health/config/reviews `200`, Cloudflare Access anonymous block `302`, and Paperclip operations read-only with 0 pending / 6 rejected / 0 Trello-linked.

PM accepted the V0.3 `dev -> main` release candidate in PR #20 after merging `origin/dev@e05eb66` over `origin/main@88dfa09` into release-candidate commit `5eb23ef`. Verification passed `npm ci`, `check:all`, RUX checks, browser regression, Paperclip contract/mock/docs/operations/cleanup/connection/webhook checks, conflict-marker scan, and `git diff --check`. No production deploy, runtime flag change, secret exposure, live canary, Trello/Calendar/Google Tasks side effect, or W3/V0.3 cross-merge was performed.

On 2026-05-15, PM/Integration synced `origin/dev` and `origin/main` at `631d3b2`, confirmed V0.2 delivery/cleanup is complete, normalized Codex/Claude branch/worktree rules in project docs, and ran post-sync V0.3 release/integration QA from `codex/v03-branch-workflow-release-qa`. Verification passed `npm ci`, `git diff --check`, conflict-marker scan, `check:all` with isolated local server, all RUX checks, and Paperclip contract/mock/docs/operations/cleanup/connection/webhook checks. No production deploy, runtime flag change, live canary, secret exposure, or Trello/Calendar/Google Tasks side effect was performed.

V0.4 Paperclip production readiness is integrated to `dev@7e069b5`, and the private production runtime is prepared from `dev@e8a211b`. The production runtime runs as Docker container `taskhub-prod` on the DigitalOcean host, binds privately to `127.0.0.1:3301`, uses separate `APP_DATA_DIR=/home/trisilar/taskhub-prod-data`, and reports production profile / disabled live mode through read-only operations status. Cloudflare tunnel routing, DNS, and a production Access app are configured for `https://taskhub-prod.trisila.online`; anonymous access returns Cloudflare Access `302`. Production Paperclip Settings is connected with a runtime-only signing secret, production service-token reachability passed, staged production canary passed, and the runtime gate was closed afterward.

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | Dev/demo runtime and Paperclip service-auth topology accepted | PM complete |
| W2 | Full UI Redesign | Complete on integrated `dev` | PM complete / hold |
| W3-03 | Controlled Paperclip live enablement | Standing dev/demo observation active; read-only monitor automation active | QA Owner / Runtime Owner monitor |
| W3-04 | Paperclip Review Queue Cleanup | PM Accepted; merged to `dev@7ea4650`; runtime cleanup complete | PM complete |
| W3-05 | Paperclip Live Operations Hardening | QA Pass / PM Accepted; merged and deployed on `dev@2c302dc`; closeout on `origin/dev@ff20e48` | PM complete / Runtime monitor |
| V0.3 Operating Model | Project operating model and long-term agent team structure | PM Accepted / merged to `dev@ed9fae0` | PM complete |
| V0.3 RUX Integration | Product Reliability + UX Stabilization accepted branch integration | Complete on `origin/dev@02fe7cf`; dev/demo runtime QA pass | PM complete |
| V0.3 Main Release | Product Reliability + UX Stabilization `dev -> main` release candidate | PM accepted PR #20; dev/main synced at `631d3b2`; post-sync QA passed; production deploy not performed | PM complete / Runtime hold |
| Branch Workflow Alignment | Codex/Claude branch/worktree naming and cleanup model | Docs updated on `codex/v03-branch-workflow-release-qa`; QA passed | PM complete / Integration ready |
| V0.4-PROD-01 | Paperclip production repo readiness | Integrated to `dev@7e069b5` | PM complete |
| V0.4-PROD-02 | Separate production runtime setup | Pass for runtime setup: private runtime + Cloudflare Access route + production service token + Paperclip Settings connection prepared | Runtime complete |
| V0.4-PROD-03 | Staged production canary window | Pass; runtime returned to disabled | QA / Runtime complete |
| V0.4-PROD-04 | 24-hour read-only monitoring | Active; first checkpoint pass; automation `v0-4-paperclip-prod-read-only-monitor` runs every 6 hours | QA / Runtime monitor |
| Agent Role Skills | Basic repo-contained role `SKILL.md` entrypoints for Codex/Claude/Gemini | Merged to `origin/dev@de3a6bc` via PR #23 | PM complete |
| Operations Docs Baseline | Runtime operations, backup/retention, security/access, onboarding, troubleshooting, and environment matrix docs | Merged to `origin/dev@681be25`; cleanup complete | PM complete |
| UIV2-01 | Claude Design UI V2 research handoff | PM-routed docs-only sidecar experiment; guideline prepared for Claude Design review | PM / UX Owner / Claude Design |

---

## Documentation Routing

| Need | Read |
|---|---|
| Current task and next action | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Full V0.2 branch/workstream plan | `docs/plans/VERSION_0_2_PLAN.md` |
| W3 Paperclip contract/live plan | `docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md` |
| Durable W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| QA history and completed work archive | `docs/logs/QA_LOG.md` |
| PM decisions and phase context | `docs/logs/DECISION_LOG.md` |
| File/function lookup hints | `docs/reference/KEY_FILE_MAP.md` |
| Long-term organization operating model | `docs/reference/ORGANIZATION_OPERATING_MODEL.md` |
| AI agent governance and role boundaries | `docs/reference/AI_AGENT_GOVERNANCE.md` |
| Parallel Codex branch/worktree model | `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` |
| Role-specific agent handoffs | `docs/agents/` |
| Role-specific agent skill entrypoints | `docs/agent-skills/` |
| V0.3 Product Reliability + UX Stabilization plan | `docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md` |
| V0.3 RUX findings and baseline | `docs/logs/V0_3_RUX_FINDINGS.md` |
| V0.3 RUX release checklist | `docs/plans/VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md` |
| V0.4 Paperclip production plan | `docs/plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md` |
| Runtime operations runbook | `docs/deployment/RUNTIME_OPERATIONS_RUNBOOK.md` |
| Environment matrix | `docs/deployment/ENVIRONMENT_MATRIX.md` |
| Troubleshooting guide | `docs/deployment/TROUBLESHOOTING.md` |
| Security/access policy | `docs/reference/SECURITY_ACCESS_POLICY.md` |
| Data backup/retention policy | `docs/reference/DATA_BACKUP_RETENTION_POLICY.md` |
| Team onboarding guide | `docs/operations/TEAM_ONBOARDING_GUIDE.md` |
| UI V2 Claude Design handoff plan | `docs/plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md` |
| UI V2 Claude Design guideline | `docs/design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md` |

---

## Project Completion Gate

Completion requires accepted work, verification, role-owned docs/logs, clear PR/merge state, and branch/worktree/folder cleanup or an explicit blocker. Use Definition of Ready before starting work and Definition of Done before marking any task, cycle, workstream, or version complete.

---

## Parallel Workstream Write Ownership

| File / Area | Write Owner | Rule |
|---|---|---|
| `CURRENT_SPRINT.md` | PM only | Dev/QA may read but must not update this file during W1/W2/W3 parallel work. |
| `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` | PM only | Preserve prompts for all workstreams; do not delete other workstream prompts. |
| W1 plan/files | W1 Dev / QA | Keep W1 updates inside W1-owned docs/branches until PM checkpoint. |
| W2 plan/files | W2 Dev / QA | Keep W2 updates inside W2-owned docs/branches until PM checkpoint. |
| W3 plan/files | W3 Dev / QA | Keep W3 updates inside W3-owned docs/branches until PM checkpoint. |

Completed V0.3 integration branch/worktree:

- Branch: `codex/integrate-v03-rux-into-dev`
- Worktree: `trisilar-task-hub-operating-model-integration`

Current Codex/Claude branch-worktree rule:

- Codex task branches use `codex/<version-or-short-scope>` unless PM assigns an existing `feature/*` branch.
- Claude task branches use `claude/<version-or-short-scope>` unless PM assigns an existing `feature/*` branch.
- Backup branches such as `codex/backup-*` are local safety refs, not active PR branches.
- New non-trivial work uses a dedicated sibling worktree, for example `trisilar-task-hub-v03-release-qa`.

Historical W3 branch/worktree:

- Branch: `feature/w3-paperclip-integration` (deleted after merge/QA cleanup)
- Worktree: `trisilar-task-hub-w3-paperclip` (deleted after merge/QA cleanup)

Parallel rule:

- W1/W2/W3 Dev agents must not share one feature branch.
- W1/W2/W3 Dev agents must not run in the same working directory.
- Before editing, each agent must run `git status --short --branch` and confirm the folder/branch match the assigned workstream.
- QA agents report evidence in the workstream handoff/doc, not `CURRENT_SPRINT.md`.
- PM updates `CURRENT_SPRINT.md` after QA pass, PM decision, or integration checkpoint.

---

## Next Action - V0.4 Read-Only Production Monitoring

```text
Role: QA Release Owner / Runtime Owner
Task: Monitor read-only production operations after staged canary and keep production webhook disabled unless PM accepts permanent enablement

Completed baseline:
origin/dev@e8a211b
origin/main@7fb82d5
V0.4 topic branch: codex/v04-paperclip-prod-integration@7e069b5
Post-main/dev validation worktree: codex/v04-paperclip-prod-integration includes origin/dev@622c7dd; V0.4 evidence commits fc5ed50 and 87bbe97
V0.4 repo readiness: integrated to dev
Production runtime: Docker container taskhub-prod on DigitalOcean, private bind 127.0.0.1:3301
Production hostname: https://taskhub-prod.trisila.online behind Cloudflare Access

V0.4 status:
Repo readiness is integrated and verified. The V0.4 worktree was refreshed from `origin/dev@eef107b`, Paperclip repo-side verifiers passed again, and the branch was then merged with latest `origin/dev`. Production private runtime, Cloudflare tunnel route, DNS, Access app, production service token, and production Paperclip Settings signing-secret connection are prepared. Staged production canary passed and runtime was returned to disabled mode.

Completed runtime evidence:
- Separate production service runs the accepted `dev@e8a211b` code.
- Production hostname is `https://taskhub-prod.trisila.online`.
- Cloudflare Access blocks anonymous public access with `302`.
- Production `APP_DATA_DIR` is separate from dev/demo.
- `PAPERCLIP_WEBHOOK_ENABLED=false` and `PAPERCLIP_LIVE_MODE=disabled`.
- Local production `/healthz`, `/api/config`, `/api/reviews`, and operations status return `200`.
- Disabled webhook probe returns `403`.

Completed before staged canary:
- Created and assigned production Cloudflare Access service token for Paperclip sender.
- Configured runtime-only production candidate env at `/home/trisilar/.paperclip/.env.taskhub-prod`.
- Verified production service-token reachability to `https://taskhub-prod.trisila.online/healthz` returned `200` without printing token values.

Runtime follow-up:
- Production Task Hub remains healthy on `taskhub-prod`, with local `/healthz`, `/api/config`, `/api/reviews`, and operations status returning `200`.
- Production webhook hard gate remains disabled and disabled webhook probe returns `403`.
- Production operations status now reports `connection.status=connected`, `hasSecret=true`, `mode=read_only`, and `liveWebhook.enabled=false`.
- Staged production canary created Review Queue session `57fdc85e-fe1e-4711-9269-c26d5ead3b07` with task status `pending`; duplicate same-payload replay returned `200`; changed replay returned `409`; invalid signature returned `401`; invalid source returned `403`; invalid environment returned `400`; Review Queue external side effects stayed at `trelloLinked=0`.
- Runtime rollback restored `PAPERCLIP_LIVE_MODE=disabled` and `PAPERCLIP_WEBHOOK_ENABLED=false`; disabled webhook probe returned `403`.
- First read-only monitoring checkpoint passed at 2026-05-15T05:24:25Z: container up, `/healthz` `200`, `/api/config` `200`, `/api/reviews` `200`, disabled probe `403`, `PAPERCLIP_LIVE_MODE=disabled`, `liveWebhook.enabled=false`, `mode=read_only`, `connection.status=connected`, `hasSecret=true`, queue pending=1 / approved=0 / rejected=0 / Trello-linked=0, warnings=none, dangerWarnings=none.
- Monitor automation `v0-4-paperclip-prod-read-only-monitor` is active every 6 hours during the 24-hour read-only observation window.

After runtime setup:
- QA / Runtime Owner monitor read-only operations status and the single pending canary Review Queue item.
- PM may accept `PAPERCLIP_LIVE_MODE=permanent` only after staged QA and read-only monitoring pass.
- V0.4 plan now includes the PM acceptance package, permanent enablement runbook, rollback runbook, and draft PR routing rules so the final decision can be made without inventing process after the 24-hour window.

Rules:
- Do not commit secrets.
- Do not reuse dev/demo `APP_DATA_DIR` for production.
- Do not set production `PAPERCLIP_WEBHOOK_ENABLED=true` outside an approved staged/permanent window.
- Do not send production Paperclip webhooks until Runtime Owner and QA approve the staged window.
- Do not add outbound Paperclip network calls.
- Do not expose secrets, Cloudflare tokens, signing headers, or raw auth values.
- Do not auto-approve Review Queue tasks.
- Do not create Trello cards, Calendar events, or Google Tasks.
- Use repo-contained role `SKILL.md` files under `docs/agent-skills/` when assigning Codex/Claude/Gemini roles.
- Keep installed reusable `trisilar-task-hub-workflow` Codex skill deferred.

Expected output:
- Read-only monitoring evidence for production operations status and Review Queue canary item, followed by PM staged-to-permanent acceptance or hold decision.
```

**Attribution:** W3-04 cleanup implemented by Codex Dev, QA passed, PM accepted, merged to `dev@7ea4650`, and runtime cleanup executed by Runtime Owner / QA. W3-05 implemented by Codex Dev, reviewed by Codex QA, accepted by Codex PM, merged/deployed at `dev@2c302dc`, and closed out on `origin/dev@ff20e48`; standing dev/demo monitoring remains read-only. V0.3 RUX work was implemented and accepted in the dedicated V0.3 branch/worktree, integrated through PR #18, merged to `origin/dev@02fe7cf`, deployed to dev/demo, accepted complete after runtime QA, and PM accepted for main promotion through PR #20 after release-candidate verification. On 2026-05-15, Codex PM / Integration Owner aligned Codex/Claude branch-workflow docs and ran post-sync V0.3 release/integration QA from `codex/v03-branch-workflow-release-qa`. V0.4 Paperclip production repo readiness was implemented and locally verified by Codex Dev / QA on `codex/v04-paperclip-prod-integration`, integrated by Codex Integration Owner to `dev@7e069b5`, prepared as a separate production private runtime by Codex Runtime Owner, connected to production Paperclip Settings with a runtime-only signing secret, assigned a production Cloudflare Access service token, and passed the staged production canary; runtime rollback restored disabled mode afterward.
