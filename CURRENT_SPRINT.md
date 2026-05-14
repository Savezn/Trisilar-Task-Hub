# Current Sprint - Trisilar Task Hub

**Phase:** V0.3 Product Reliability + UX Stabilization Integration Candidate
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
| V0.2 W1 hosted dev/demo runtime | QA Pass / PM Accepted for dev/demo | DigitalOcean + Cloudflare Access; Task Hub persistent `APP_DATA_DIR`; service-auth topology accepted |
| V0.2 W2 Full UI Redesign | Complete on integrated `dev` | `V0.2-W2-06` PM accepted on `origin/dev@523c948` |
| V0.2 W3 Paperclip mock/docs/settings/live connector | PM Accepted through `V0.2-W3-05`; merged/deployed on `dev@2c302dc` | Contract, mock route, Docs, Settings gate, live webhook, live interop, cleanup, cleanup audit retention, and read-only operations status accepted |
| V0.2 W3 runtime cleanup | Complete | Runtime deployed from `dev@7ea4650`; Paperclip test/canary sessions cleaned from 6 pending to 0 pending / 6 rejected / 0 Trello-linked |
| V0.2 W3 standing dev/demo observation | Active with read-only monitor automation | `PAPERCLIP_WEBHOOK_ENABLED=true` on dev/demo; active signed canary only on PM/QA request or after runtime/sender changes |
| Latest W3 dev closeout | `origin/dev@ff20e48` | `V0.2-W3-05` operations status and settings copy polish merged/deployed at `dev@2c302dc`; W3 foundation closeout status is on latest `dev` |
| V0.3 operating model and agent structure | PM Accepted / merged to `dev@ed9fae0` | Reference docs define Task Hub/Trello/Review Queue operating model, AI governance, Codex parallel development, and long-term role ownership under `docs/agents/`. Reusable Codex skill is deferred until the docs prove useful in real sessions. |
| V0.3 Product Reliability + UX Stabilization | PM Accepted through `V0.3-RUX-06`; integration candidate in progress | RUX-02A through RUX-06 are accepted on the V0.3 branch. Current route is integrated candidate QA before any `dev -> main` decision. |

---

## Plain-Language PM Summary

Paperclip can now send work into Task Hub through the protected live webhook path. Task Hub verifies Cloudflare Access, HMAC signature, source/environment, request id, agent run id, timestamp, and payload contract before creating a Review Queue session.

The important safety rule is still intact: Paperclip-created tasks enter Review Queue as pending work only. They do not create Trello cards, Calendar events, or Google Tasks until a human approves them.

The test/canary items created during live validation have been cleaned safely. They were rejected/archived with audit retained, not deleted and not approved. Runtime count after cleanup is 0 pending / 0 approved / 6 rejected / 0 Trello-linked.

W3-05 adds that operational hardening: PM/QA/Runtime Owner can now inspect live flag status, connection state, source/environment, Review Queue counts, cleanup state, audit categories, and warnings without sending a new canary. It is merged and deployed at `dev@2c302dc`; W3 foundation closeout status is recorded on `origin/dev@ff20e48`.

V0.3 RUX is now the active integration candidate. The accepted V0.3 branch adds Trello connection-state/failure-copy clarity, Review Queue and AI trace clarity, Today/Tasks decision-flow polish, browser regression coverage, and a future `dev -> main` release checklist. Integration must preserve W3 live operations behavior and the W3/V0.3 branch boundary.

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
| V0.3 RUX Integration | Product Reliability + UX Stabilization accepted branch integration | Integration candidate in progress | Dev / QA integration |

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
| V0.3 Product Reliability + UX Stabilization plan | `docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md` |
| V0.3 RUX findings and baseline | `docs/logs/V0_3_RUX_FINDINGS.md` |
| V0.3 RUX release checklist | `docs/plans/VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md` |

---

## Parallel Workstream Write Ownership

| File / Area | Write Owner | Rule |
|---|---|---|
| `CURRENT_SPRINT.md` | PM only | Dev/QA may read but must not update this file during W1/W2/W3 parallel work. |
| `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` | PM only | Preserve prompts for all workstreams; do not delete other workstream prompts. |
| W1 plan/files | W1 Dev / QA | Keep W1 updates inside W1-owned docs/branches until PM checkpoint. |
| W2 plan/files | W2 Dev / QA | Keep W2 updates inside W2-owned docs/branches until PM checkpoint. |
| W3 plan/files | W3 Dev / QA | Keep W3 updates inside W3-owned docs/branches until PM checkpoint. |

Required active V0.3 integration branch/worktree:

- Branch: `codex/integrate-v03-rux-into-dev`
- Worktree: `trisilar-task-hub-operating-model-integration`

Required W3 branch/worktree for W3-only work:

- Branch: `feature/w3-paperclip-integration`
- Worktree: `trisilar-task-hub-w3-paperclip`

Parallel rule:

- W1/W2/W3 Dev agents must not share one feature branch.
- W1/W2/W3 Dev agents must not run in the same working directory.
- Before editing, each agent must run `git status --short --branch` and confirm the folder/branch match the assigned workstream.
- QA agents report evidence in the workstream handoff/doc, not `CURRENT_SPRINT.md`.
- PM updates `CURRENT_SPRINT.md` after QA pass, PM decision, or integration checkpoint.

---

## Next Action - Verify V0.3 RUX Integrated Candidate

```text
Role: Dev / QA / Integration
Task: Finish and verify V0.3 Product Reliability + UX Stabilization integration candidate

Branch:
codex/integrate-v03-rux-into-dev

Accepted commit:
5a90cc7 Accept V0.3-RUX-06 and route integration prerequisite

Goal:
Integrate accepted V0.3 RUX work onto latest dev after the operating-model prerequisite has merged, while preserving latest W3 live operations behavior.

Preflight:
- Merge candidate targets dev only, not main.
- Do not deploy production.
- Do not commit secrets.
- Do not merge W3 sibling branches into V0.3 branches or V0.3 branches into W3 branches.
- Preserve `PAPERCLIP_WEBHOOK_ENABLED=true` only for the existing dev/demo observation policy.

Rules:
- Do not send Paperclip webhooks.
- Do not create canary tasks.
- Do not add outbound Paperclip network calls.
- Do not expose secrets, Cloudflare tokens, signing headers, or raw auth values.
- Do not auto-approve Review Queue tasks.
- Do not create Trello cards, Calendar events, or Google Tasks.
- Preserve W1 deployment/access, W2 UI behavior, and W3 Paperclip operations/cleanup/live webhook surfaces.
- Keep reusable `trisilar-task-hub-workflow` Codex skill deferred.

Verification:
- rg conflict-marker check
- git diff --check
- node --check public/js/pages/review.js
- npm.cmd run verify:rux-trello
- npm.cmd run verify:rux-ai-trace
- npm.cmd run verify:rux-decision-flow
- npm.cmd run verify:rux-browser-regression
- npm.cmd run verify:paperclip-operations
- npm.cmd run verify:paperclip-cleanup
- npm.cmd run verify:paperclip-webhook
- npm.cmd run verify
- npm.cmd run check:all with local server running for smoke test

Expected output:
- integration branch commit hash and PR.
- Verification evidence.
- PM/Integration Owner decision on whether to merge candidate into dev.
```

**Attribution:** W3-04 cleanup implemented by Codex Dev, QA passed, PM accepted, merged to `dev@7ea4650`, and runtime cleanup executed by Runtime Owner / QA. W3-05 implemented by Codex Dev, reviewed by Codex QA, accepted by Codex PM, merged/deployed at `dev@2c302dc`, and closed out on `origin/dev@ff20e48`; standing dev/demo monitoring remains read-only. V0.3 RUX work was implemented and accepted in the dedicated V0.3 branch/worktree, with integration currently owned by Dev / QA / Integration.
