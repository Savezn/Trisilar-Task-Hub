# Version 0.2 Workstream Plan - Trisilar Task Hub

**Doc Role:** Active version plan
**Status:** Draft - W0 is next
**Version:** V0.2
**Planning Stage:** Pre-workstream setup
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `../../MVP_PRD.md`, `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../logs/DECISION_LOG.md`
**Theme:** Enable parallel agents safely by establishing branch/environment workflow before company access, UI redesign, and Paperclip integration work.

---

## How to Use This Document

- Use as the main V0.2 planning file.
- Start each session from `../../CURRENT_SPRINT.md`; read this file when the task is part of W0/W1/W2/W3.
- Use `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` as the durable prompt registry for W1/W2/W3.
- Update this file when PM changes V0.2 workstream scope, sequencing, or branch/environment rules.
- Keep detailed QA history in `../logs/QA_LOG.md`, not in this plan.
- Use `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md` for branch, environment, PR, and verification rules.

---

## Planning Summary

V0.1 Release Acceptance passed. V0.2 will be managed as parallel workstreams after W0 establishes branch and environment rules.

Goals:

1. Make Trisilar Task Hub accessible to company teammates.
2. Redesign the full web app UI while preserving existing workflows.
3. Connect Trisilar Task Hub to the Paperclip multi-agent system.
4. Establish a `dev` integration environment and PR flow into production.

---

## Scope / Non-Goals

In scope:

- Branch and environment workflow for `main`, `dev`, and `feature/*`.
- Internal company access and deployment planning.
- Full UI redesign planning and implementation path.
- Paperclip multi-agent integration planning and implementation path.
- PR/QA rules for parallel workstreams.

Not in scope for W0:

- Implementing company access/deployment.
- Implementing the UI redesign.
- Implementing Paperclip live integration.
- Replacing the current Trello/Google integrations.

---

## Dependency / Workflow Model

### Branch Model

| Branch | Role | Rule |
|---|---|---|
| `main` | Production | Protected, no direct feature work |
| `dev` | Integration/dev environment | Feature PRs merge here first |
| `feature/w0-*` | Branch/environment setup | Starts from `main` until `dev` exists |
| `feature/w1-*` | Company access/deployment | Starts from `dev` |
| `feature/w2-*` | UI redesign | Starts from `dev` |
| `feature/w3-*` | Paperclip integration | Starts from `dev` |
| `hotfix/*` | Emergency production fix | Starts from `main`, then merges back to `dev` |

Flow:

```text
feature/* -> dev -> QA/integration -> main -> production
```

Dependency rule:

```text
W0 first -> W1/W2/W3 parallel -> integration QA on dev -> release to main
```

---

## Workstream / Phase Map

| ID | Workstream | Owner Role | Status | Scope |
|---|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Dev / PM | Next | Create `dev`, define env/deploy/PR rules, add verification gate |
| W1 | Company Access + Deployment | Platform Dev | Pending W0 | Internal access, deployment target, env/secrets, teammate onboarding |
| W2 | Full UI Redesign | Frontend Dev | Pending W0 | Design system, shell/nav, page-by-page redesign, responsive QA |
| W3 | Paperclip Multi-Agent Integration | Integration Dev | Pending W0 | Contract-first API/webhook bridge, mock adapter, real connector, attribution sync |

---

## Workstream / Phase Details

### W0 - Branch / Environment / CI Setup

**Priority:** P0
**Owner Role:** Dev / PM
**Status:** Next

**Why:**
- Parallel agent work needs a stable integration branch.
- Company access, UI redesign, and Paperclip integration should not merge directly to production.
- PR/QA rules must be explicit before W1/W2/W3 begin.

**Tasks:**
- Verify current branch and remote status.
- Create `dev` from current `main` if it does not exist.
- Push `dev` to origin.
- Document branch model and environment expectations.
- Document PR flow: `feature/* -> dev -> main`.
- Confirm verification command: `npm.cmd run check:all`.

**AC:**
- [ ] `dev` branch exists and is pushed to remote.
- [ ] Branch model is documented in README/docs.
- [ ] PR flow is documented: `feature/* -> dev -> main`.
- [ ] Dev/prod environment expectations are documented.
- [ ] Required check command is documented: `npm.cmd run check:all`.
- [ ] Next actions for W1, W2, and W3 are clear enough to open parallel Dev sessions.

### W1 - Company Access + Deployment

**Priority:** P0 after W0
**Owner Role:** Platform Dev
**Status:** Pending W0

**Scope:**
- Internal access method.
- Deployment target.
- Environment variables and secrets.
- Teammate onboarding path.
- Dev/prod access boundary.

### W2 - Full UI Redesign

**Priority:** P1 after W0
**Owner Role:** Frontend Dev
**Status:** Pending W0

**Scope:**
- Design system.
- App shell and navigation.
- Page-by-page redesign.
- Desktop/mobile visual QA.
- No server/API refactor unless explicitly required.

### W3 - Paperclip Multi-Agent Integration

**Priority:** P1 after W0
**Owner Role:** Integration Dev
**Status:** Pending W0

**Scope:**
- Integration contract.
- Mock adapter before live connector.
- Task/agent attribution sync.
- Error handling and audit trail.

---

## Delivery Rules

- No direct push to `main` for feature work.
- Every workstream branch must state owner agent in docs and PR notes.
- Every PR into `dev` must include QA evidence.
- Any production-ish behavior or critical API change requires QA Recheck before PM signoff.
- UI redesign PRs must include desktop/mobile visual evidence and console error check.
- Paperclip integration PRs must include contract/mock verification before live connector work.
- Keep `CURRENT_SPRINT.md` short; put history in logs and multi-session plans in `docs/plans/`.
- During parallel W1/W2/W3 work, only PM updates `CURRENT_SPRINT.md`; Dev/QA agents keep updates in their owned workstream docs/branches.
- Durable W1/W2/W3 prompts live in `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` and must not be overwritten by a single workstream update.
- W1/W2/W3 must use separate feature branches: `feature/w1-company-access-deployment`, `feature/w2-ui-redesign`, and `feature/w3-paperclip-integration`.
- W1/W2/W3 must run in separate Git worktree folders; do not run parallel agents in the same `trisilar-task-hub` working directory.

---

## Session Estimate

| Workstream | Expected Sessions | Notes |
|---|---|---|
| W0 | 1-2 | Branch, environment docs, PR workflow |
| W1 | 2-4 | Depends on auth/deployment choice |
| W2 | 4-8 | Depends on redesign depth and page count |
| W3 | 3-6 | Contract/mock first, live connector second |

---

## Next Recommended Session

```text
Role: Dev
Task: V0.2 W0 - Branch / Environment / CI Setup

Context:
V0.1 Release Acceptance passed. PM split logs/plans out of CURRENT_SPRINT.md and created docs/plans/VERSION_0_2_PLAN.md. Before W1/W2/W3 can run in parallel, establish the dev branch and environment/PR workflow.

Steps:
1. Verify current branch and remote status.
2. Create `dev` branch from current `main` if it does not already exist.
3. Push `dev` to origin.
4. Add targeted docs for branch/environment workflow if missing.
5. Run `npm.cmd run check:all` if any repo behavior/config files are changed.
6. Commit and push any doc/config updates.

Rules:
- Dev role only.
- Do not start W1/W2/W3 implementation yet.
- Preserve existing app behavior.
- Include attribution: Implemented by Dev agent name.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created V0.2 workstream plan after V0.1 Release Acceptance | Codex PM |
| 2026-05-08 | Standardized plan document format with V0.1 archive plan | Codex PM |
| 2026-05-08 | Added PM-owned Current Sprint rule for parallel workstreams | Codex PM |
| 2026-05-08 | Added per-workstream Git worktree requirement | Codex PM |
