# Current Sprint - Trisilar Task Hub

**Phase:** V0.4 Live AI Operations / V0.5 Foundation Hardening
**Status:** V0.4 24-hour production read-only monitoring passed; production webhook remains disabled pending permanent-enable runtime decision; V0.5 foundation integrated via PR #30; hosted dev/demo SQLite canary preflight passed on `dev@3159a21` and remains blocked on Runtime Owner host access
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-16 - **Updated by:** Codex PM / Dev / QA

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
| V0.4 Paperclip production readiness | Repo readiness integrated to `dev@7e069b5`; production runtime prepared from `dev@e8a211b`; 24-hour production read-only monitoring passed on 2026-05-16 | Adds production runtime profile/live mode/status warnings and `verify:paperclip-production-readiness`; production private runtime, Cloudflare tunnel route, DNS, Access app, production service token, and production Paperclip Settings connection are prepared; staged canary passed, runtime gate was closed, and 24-hour monitoring showed no danger warning or external side effect |
| V0.5 Foundation Hardening | Integrated via PR #30; PM selected hosted dev/demo SQLite canary; latest repo-side preflight passed on `dev@3159a21`, blocked on host access | Deterministic `npm test`, app-owned contracts, SQLite migration/import/export, fail-loud rollback export, env-flagged SQLite runtime reader, Paperclip safety checks, post-merge QA, and local dev/demo-style SQLite canary rehearsal passed without production/runtime side effects |
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

PM rebaselined the post-V0.4 roadmap so the team does not wait idle during V0.4 waiting/monitoring windows. V0.5 Foundation Hardening now comes before UI V2 production implementation and Team Operating System product work. V0.5 covers ADR-backed persistence, real `npm test`, app-owned data contracts, and SQLite migration; it must not touch production runtime, secrets, Cloudflare policy, live Paperclip flags, or webhook auth behavior. PR #28 merged the roadmap rebaseline to `dev@aaf8f58`; PR #30 later integrated FND-02/03/04/05 to `dev@e3380ac`.

V0.5-FND-02 through FND-05 are implemented, merged through PR #30, and integrated to `dev@e3380ac`. Post-merge QA passed `npm test` 25/25, `check:all` with controlled local server, and a local SQLite canary rehearsal that imported JSON state, ran the server with `TASKHUB_STATE_BACKEND=sqlite`, verified `/healthz`, `/api/config`, and `/api/reviews`, then exported rollback JSON. PM selected the hosted dev/demo SQLite canary path. On 2026-05-16, the dedicated V0.5 worktree was synced to `origin/dev@3159a21`; `npm.cmd ci`, `npm test` 25/25, and `npm.cmd run verify:persistence-canary-cycle` passed, but SSH to `root@157.230.251.209` still returned `Permission denied (publickey)`, so no hosted runtime change was performed. Production remains JSON default.

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
| V0.4-PROD-04 | 24-hour read-only monitoring | Pass; final checkpoint 2026-05-16T08:03:14Z confirmed disabled/read_only, no danger warnings, and no external side effects | PM / Integration closeout |
| V0.4-PROD-05 | Permanent enablement acceptance | Hold / optional separate PM runtime decision; production webhook remains disabled until explicit permanent-enable runtime change | PM / Runtime Owner |
| V0.5-FND-01 | Foundation ADRs + planning acceptance | Accepted / merged to `dev@aaf8f58` via PR #28 | PM complete |
| V0.5-FND-02/03/04/05 | Foundation tests, contracts, SQLite migration, and local integration QA | Integrated via PR #30; hosted dev/demo SQLite canary selected but blocked on Runtime Owner host access | Runtime Owner |
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
| V0.5 Foundation Hardening plan | `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` |
| Foundation-before-UI/Team OS ADR | `docs/adr/ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md` |
| V0.5 persistence/tests/contracts ADR | `docs/adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md` |
| V0.5 SQLite canary Runtime Owner checklist | `docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md` |
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
| V0.4 runtime/production files | Runtime Owner / Paperclip Owner / QA | Do not mix with V0.5 code/docs work; no secret values or live flag changes from non-runtime branches. |
| V0.5 foundation plan/ADR/test-contract work | PM / Architecture / Dev / QA | Use dedicated V0.5 branches/worktrees from `dev`; do not touch production runtime or dirty UI V2 artifacts. |
| UI V2 design artifacts | UX Owner / Claude Design | Design-only until V0.6; do not treat as product implementation or V0.5 blocker. |
| Team OS pilot docs | PM / Operations | Docs-only assumptions may proceed; product implementation waits for V0.6 shell/workflow stability. |

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

## Next Actions - V0.5 Foundation Handoff

```text
Role: Runtime Owner / QA
Task: Run the hosted dev/demo SQLite canary for V0.5 foundation hardening.

Current release state:
- V0.4 production Paperclip intake is no longer blocking follow-on work.
- V0.4-PROD-04 passed the 24-hour read-only monitoring gate at 2026-05-16T08:03:14Z.
- PR #27 merged V0.4 closeout to dev at c866a7d.
- Production Paperclip webhook remains disabled; permanent enablement is a separate PM / Runtime Owner runtime switch, not a prerequisite for V0.5 hosted dev/demo canary work.

V0.5 baseline:
- V0.5 roadmap/FND-01 is accepted through PR #28.
- FND-02/03/04/05 are integrated through PR #30 at dev@e3380ac.
- V0.5 SQLite canary runtime checklist is integrated through PR #36 at dev@c866a7d.
- npm test, contract checks, SQLite migration/rollback tests, Paperclip safety checks, post-merge check:all, local SQLite canary rehearsal, verify:sqlite-canary, verify:json-rollback, and verify:persistence-canary-cycle passed in prior V0.5 QA.
- Latest repo-side preflight on 2026-05-16 passed from `origin/dev@3159a21`: `npm.cmd ci`, `npm test` 25/25, and `npm.cmd run verify:persistence-canary-cycle`.
- Hosted execution remains blocked because SSH to `root@157.230.251.209` returns `Permission denied (publickey)`.

Next V0.5 output:
- Sync the dedicated V0.5 foundation worktree from origin/dev.
- On hosted dev/demo only, follow docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md.
- Optionally run npm.cmd run verify:persistence-canary-cycle as temp-data preflight.
- Run npm.cmd run migrate:sqlite, set TASKHUB_STATE_BACKEND=sqlite, restart/reload hosted dev/demo, run npm.cmd run verify:sqlite-canary, run npm.cmd run migrate:sqlite:export, and if rolling back remove the flag/restart then run npm.cmd run verify:json-rollback.

Rules:
- Do not touch production for V0.5 hosted dev/demo SQLite canary.
- Do not change Cloudflare policy, secrets, production Paperclip live flags, or webhook auth.
- Do not create Trello, Calendar, Google Tasks, or live Paperclip side effects.
- If hosted canary fails, remove TASKHUB_STATE_BACKEND, restart dev/demo, run npm.cmd run verify:json-rollback, and route QA/PM.
```

## V0.4 Runtime Hold

```text
Role: PM / Runtime Owner
Task: Decide later whether to execute permanent production Paperclip enablement.

Current state:
- Production Task Hub remains on the separate taskhub-prod runtime at https://taskhub-prod.trisila.online.
- PAPERCLIP_WEBHOOK_ENABLED=false and PAPERCLIP_LIVE_MODE=disabled remain the expected state.
- Permanent enablement uses the V0.4 runbook and must record a new PM decision plus rollback evidence.
- Do not treat V0.5, UI V2, or Team OS work as approval to flip production Paperclip permanent mode.
```

**Attribution:** W3-04 cleanup implemented by Codex Dev, QA passed, PM accepted, merged to `dev@7ea4650`, and runtime cleanup executed by Runtime Owner / QA. W3-05 implemented by Codex Dev, reviewed by Codex QA, accepted by Codex PM, merged/deployed at `dev@2c302dc`, and closed out on `origin/dev@ff20e48`; standing dev/demo monitoring remains read-only. V0.3 RUX work was implemented and accepted in the dedicated V0.3 branch/worktree, integrated through PR #18, merged to `origin/dev@02fe7cf`, deployed to dev/demo, accepted complete after runtime QA, and PM accepted for main promotion through PR #20 after release-candidate verification. On 2026-05-15, Codex PM / Integration Owner aligned Codex/Claude branch-workflow docs and ran post-sync V0.3 release/integration QA from `codex/v03-branch-workflow-release-qa`. V0.4 Paperclip production repo readiness was implemented and locally verified by Codex Dev / QA on `codex/v04-paperclip-prod-integration`, integrated by Codex Integration Owner to `dev@7e069b5`, prepared as a separate production private runtime by Codex Runtime Owner, connected to production Paperclip Settings with a runtime-only signing secret, assigned a production Cloudflare Access service token, passed staged production canary, and passed 24-hour read-only monitoring with production disabled and no side effects. V0.5 Foundation Hardening roadmap/FND-01 was routed by Codex PM, merged through PR #28 at `dev@aaf8f58`, implemented by Codex Dev / QA through PR #30 at `dev@e3380ac`, and post-merge verified locally with hosted canary blocked only by Runtime Owner host access; full rewrite work remains deferred.
