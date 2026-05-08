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
| V0.2 planning | Ready for hosted dev runtime setup / W2-W3 continuation | `docs/plans/VERSION_0_2_PLAN.md` |
| Latest runtime fix | `e1b4801` | P9-6 Trello-backed preview regression |
| Latest docs policy | Logs/plans split from Current Sprint; branch workflow documented | Updated by Codex PM |

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | W1c setup merged / runtime setup next | Dev |
| W2 | Full UI Redesign | Next | Dev |
| W3 | Paperclip Multi-Agent Integration | Next | Dev |

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
| `CURRENT_SPRINT.md` | PM only | Dev/QA may read but must not update this file during W1/W2/W3 parallel work. |
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
- PM is the only role that updates `CURRENT_SPRINT.md` after QA/decision checkpoints.
- If a Dev/QA task needs a status change, leave a PM handoff note instead of editing the sprint snapshot.

---

## Next Action - W1c Hosted Dev Runtime Setup

W1c dev environment setup was implemented by Codex Dev, reviewed by Codex QA, and merged to `dev` through PR #2 at merge commit `84c01cf`. The next W1 step is hosted dev runtime setup and verification only.

> Durable W1/W2/W3 prompts are preserved in `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`. Do not overwrite that prompt registry when updating this single Next Action section.

### Prompt A - W1c Hosted Dev Runtime Setup

```text
Role: Dev
Task: V0.2 W1c - Hosted Dev Runtime Setup and Verification

Context:
W1c dev environment deployment setup was merged to `dev` through PR #2 at merge commit `84c01cf`.

Relevant setup docs:
- docs/reference/DEPLOYMENT_SETUP.md
- docs/reference/DEV_ENVIRONMENT_DEPLOYMENT.md

Goal:
Complete hosted dev runtime setup and verification only. Do not deploy production.

Read first:
- CURRENT_SPRINT.md
- docs/reference/DEPLOYMENT_SETUP.md
- docs/reference/DEV_ENVIRONMENT_DEPLOYMENT.md

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
- Preserve existing app behavior.
- Include attribution: Runtime setup by Dev agent name.
```

### Prompt B - W2 Full UI Redesign

```text
Role: Dev
Task: V0.2 W2 - Full UI Redesign Discovery and Implementation Plan

Context:
V0.2 W0 Branch / Environment / CI Setup passed QA at commit `9dbb47b`. The `dev` branch exists and is the integration baseline. Start W2 from `dev`.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- MVP_PRD.md
- docs/design/ui-design-v1-0/README.md

Goals:
1. Audit current app shell/pages and existing design artifacts.
2. Propose redesign scope, visual direction, and page rollout order.
3. Identify responsive/desktop QA requirements.
4. Make only targeted preparatory docs or prototype updates unless implementation scope is clear.

Rules:
- Start from `dev`.
- Do not implement W1 deployment/access or W3 Paperclip integration.
- Preserve core workflows.
- Include desktop/mobile visual QA expectations.
- Include attribution: Implemented by Dev agent name.
```

### Prompt C - W3 Paperclip Multi-Agent Integration

```text
Role: Dev
Task: V0.2 W3 - Paperclip Multi-Agent Integration Discovery and Contract Plan

Context:
V0.2 W0 Branch / Environment / CI Setup passed QA at commit `9dbb47b`. The `dev` branch exists and is the integration baseline. Start W3 from `dev`.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- MVP_PRD.md

Goals:
1. Identify required Paperclip integration touchpoints.
2. Draft a contract-first API/webhook or adapter plan.
3. Define mock adapter verification before live connector work.
4. Define attribution/audit trail requirements so multi-agent work stays traceable.

Rules:
- Start from `dev`.
- Do not implement W1 deployment/access or W2 UI redesign.
- Do not add live external calls before contract/mock verification.
- Preserve existing app behavior.
- Include attribution: Implemented by Dev agent name.
```

**PM Attribution:** W1b implemented by Codex Dev, reviewed by Codex QA/PM, merged by Codex PM, and routed to W1c by Codex PM.
