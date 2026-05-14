# Branch and Environment Workflow

**Doc Role:** Branch/environment operating reference
**Status:** Active for V0.2 and V0.3 branch/worktree governance
**Owner:** Dev / PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-15 - **Updated by:** Codex PM / Integration Owner
**Related Docs:** `../../CURRENT_SPRINT.md`, `../plans/VERSION_0_2_PLAN.md`, `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `AI_AGENT_GOVERNANCE.md`, `../../README.md`

---

## Purpose

This document defines the branch, environment, PR, and verification workflow for feature work. For the long-term V0.3 Codex parallel development model, use this file together with `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`.

---

## Branch Model

| Branch | Environment Role | Rule |
|---|---|---|
| `main` | Production-ready baseline | No direct feature work. Merge only after QA/PM signoff. |
| `dev` | Integration/dev baseline | Feature branches merge here first for combined QA. |
| `codex/*` | Codex-scoped work | Starts from `dev` unless PM assigns `main`; use for Codex docs, implementation, QA, integration, backup, and release-prep branches. |
| `claude/*` | Claude-scoped work | Starts from `dev` unless PM assigns `main`; use when Claude owns a scoped implementation/docs branch. |
| `feature/w0-*` | Branch/environment setup | Starts from `main` until `dev` exists. |
| `feature/w1-*` | Company access/deployment | Starts from `dev`. |
| `feature/w2-*` | UI redesign | Starts from `dev`. |
| `feature/w3-*` | Paperclip integration | Starts from `dev`. |
| `feature/project-*`, `feature/ux-*`, `feature/ai-*`, `feature/runtime-*` | V0.3 role/scope branches when PM assigns them | Starts from `dev` unless PM says otherwise. |
| `hotfix/*` | Emergency production fix | Starts from `main`; merge or cherry-pick back to `dev` after release. |

Branch namespace rules:

- `feature/*` remains valid for PM-assigned product/workstream branches and historical W1/W2/W3 branches.
- `codex/*` is the default namespace for Codex-created task branches in this repo.
- `claude/*` is the default namespace for Claude-created task branches when Claude is operating directly in the repo.
- If an agent cannot create a slash-namespaced branch because of local ref permissions, use a flat fallback such as `codex-v03-release-qa` or `claude-review-queue-polish` and record the fallback in the handoff.
- `codex/backup-*` and `claude/backup-*` are safety refs. Keep them local unless PM explicitly asks to push or promote them.

Recommended V0.2 workstream branches:

| Workstream | Required Branch | Owner Scope |
|---|---|---|
| W1 Company Access + Deployment | `feature/w1-company-access-deployment` | Deployment/access plan, deploy readiness, secrets boundary docs |
| W2 Full UI Redesign | `feature/w2-*` phase branches | UI design discovery, design system, app shell/page redesign files |
| W3 Paperclip Multi-Agent Integration | `feature/w3-paperclip-integration` | Integration contract, mock adapter, attribution/audit plan |

Branch ownership rules:

- W1/W2/W3 must not share one feature branch.
- Each workstream branch starts from latest `dev`.
- Parallel W1/W2/W3 agents must not run in the same working directory.
- Each parallel workstream must use its own Git worktree folder checked out to its required feature branch.
- A workstream agent may only commit files owned by its workstream unless PM explicitly approves a cross-workstream change.
- If a task needs files owned by another workstream, stop and hand off to PM instead of editing across branches.
- PM/integration work merges completed workstream branches into `dev`; agents do not merge sibling workstream branches into each other.

Recommended local worktree folders:

| Workstream | Worktree folder | Branch |
|---|---|---|
| PM / Integration | `trisilar-task-hub` | `dev` |
| W1 Company Access + Deployment | `trisilar-task-hub-w1-company-access` | `feature/w1-company-access-deployment` |
| W2 Full UI Redesign | `trisilar-task-hub-w2-ui-redesign` | active `feature/w2-*` phase branch |
| W3 Paperclip Multi-Agent Integration | `trisilar-task-hub-w3-paperclip` | `feature/w3-paperclip-integration` |

V0.3 role/scope branches should use dedicated sibling worktrees with descriptive names. Example:

```powershell
git fetch origin
git worktree add ..\trisilar-task-hub-project-operating-model -b codex/project-operating-model-agent-structure origin/dev
git worktree add ..\trisilar-task-hub-v03-release-qa -b codex/v03-branch-workflow-release-qa origin/dev
git worktree list
```

Create or attach worktrees from the main repo folder:

```powershell
git worktree add ..\trisilar-task-hub-w1-company-access feature/w1-company-access-deployment
git worktree add ..\trisilar-task-hub-w2-ui-redesign feature/w2b-review-redesign
git worktree add ..\trisilar-task-hub-w3-paperclip feature/w3-paperclip-integration
git worktree list
```

Before starting any agent, run:

```powershell
git status --short --branch
```

Confirm the folder and branch match the assigned workstream. If they do not match, stop and switch to the correct worktree folder before editing.

Flow:

```text
topic branch -> dev -> QA/integration -> main -> production
```

In this flow, `topic branch` means `feature/*`, `codex/*`, `claude/*`, or `hotfix/*` as assigned by PM. `main` promotion normally uses a PR. A direct fast-forward push to `main` is allowed only for PM/Integration housekeeping when all of these are true:

- `origin/main` is an ancestor of `origin/dev`.
- release/integration QA has passed on the candidate commit.
- PM has explicitly accepted the promotion.
- a safety backup ref is created before moving `main`.
- no production deploy or runtime flag change is bundled into the Git promotion.

---

## Long-Term Parallel Role Model

V0.3 uses the durable role model documented in `AI_AGENT_GOVERNANCE.md` and `../agents/`.

Required rule:

```text
One agent = one role = one branch = one worktree = one ownership scope.
```

Agents must not run in the same working directory, share feature branches, or merge sibling feature branches into each other. Integration Owner owns accepted-branch merges into `dev`.

Codex and Claude agents should include this branch/worktree block in handoffs:

```text
Role:
Branch:
Worktree:
Base:
Owned files:
Verification:
Commit:
Pushed:
Next role:
```

When known sibling contamination risk exists, use the verification pattern in `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`:

```powershell
git status --short --branch
git log --oneline --decorate --max-count=20
git merge-base --is-ancestor <sibling-head> <current-branch>
```

---

## Environment Expectations

| Environment | Source Branch | Purpose | Deployment Notes |
|---|---|---|---|
| Local dev | Any active branch | Agent implementation and verification | Use local `.env`; do not commit secrets. |
| Dev / integration | `dev` | Combined W1/W2/W3 preview and QA | Intended for teammate/internal preview after deployment target is selected. |
| Production | `main` | Stable app for real users | Release only after integration QA and PM signoff. |

Environment files:

- Keep secrets in local/runtime environment configuration only.
- Do not commit `.env` or production secrets.
- If environment requirements change, update docs before handing off to QA/PM.

---

## PR and QA Rules

- Feature work starts from `dev` after W0.
- Open PRs into `dev` for W1/W2/W3 workstreams.
- Merge `dev` into `main` only after integration QA passes and PM approves.
- Codex/Claude topic branches may open PRs into `dev` or, for release candidates, into `main` when PM assigns that path.
- During parallel W1/W2/W3 work, Dev and QA agents must not edit `CURRENT_SPRINT.md` directly.
- Each workstream writes only to its owned plan/files/branch until PM checkpoint.
- Each workstream must use its required feature branch; do not run W1/W2/W3 in the same branch.
- PM is the only role that updates `CURRENT_SPRINT.md` after QA pass, PM decision, or integration checkpoint.
- Durable workstream prompts live in `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`; preserve prompts for other workstreams.
- Every PR must state:
  - owner agent
  - branch and worktree
  - files changed
  - verification command/output summary
  - behavior risk
- Production-ish behavior, auth/access, deployment, critical API, or integration contract changes require QA Recheck before PM signoff.

---

## Required Verification

Use this command as the baseline verification gate:

```powershell
node server.js
npm.cmd run check:all
```

Run `node server.js` in a separate terminal first because `check:all` includes smoke checks against local HTTP endpoints. Run the gate before PR/merge when code, config, route, integration, or behavior files change. Documentation-only changes can skip runtime checks if no behavior/config files changed, but the owner must state that explicitly.

---

## W0 Completion Criteria

- `dev` exists locally or remotely and is pushed to `origin`.
- `main` remains the production-ready baseline.
- Branch/environment workflow is documented in README/docs.
- V0.2 W1/W2/W3 can start from `dev` without changing the release model.
- Implemented by Codex Dev.
