# Contributing - Trisilar Task Hub

**Doc Role:** Contribution workflow for humans and AI agents
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-17
**Updated by:** Codex Documentation Workflow Owner

This repository uses a small-team, multi-agent workflow. The goal is to keep implementation fast without losing traceability, branch hygiene, or release confidence.

---

## Before You Start

1. Read `.ai-instructions.md`.
2. Read `docs/reference/PROJECT_CONTEXT.md`.
3. Run the Agent Status Refresh Protocol:

```powershell
git fetch origin --prune
git status --short --branch
git branch -vv
git worktree list
git log --oneline --decorate --max-count=10
```

4. Confirm and declare the current role, branch, and worktree.
5. Confirm the owned files for the task.
6. For V0.3 role-based work, confirm the relevant role guide under `docs/agents/`.

Do not begin edits if the current folder or branch does not match the task, the branch is stale against its upstream or target branch, or unrelated dirty/untracked files do not have an explicit preserve/ignore/backup/route decision.

---

## Definition of Ready

A task, cycle, workstream, or release is ready to start only when these inputs are clear:

- Role routing: `Primary role`, `Next role`, `Optional support role`, `Boundary`, and `Route if`. If no role is assigned, infer and declare the smallest safe existing role for the next action.
- Scope: goal, owned files/areas, non-goals, and stop conditions.
- Branch/worktree: branch name, base branch, worktree folder, and target branch.
- Acceptance criteria: expected behavior, docs output, or verification evidence.
- Verification plan: commands/checks to run and when runtime checks may be skipped.
- Dependencies: upstream branch, runtime flag, secret, service token, env var, or PM approval.
- Latest status: Agent Status Refresh Protocol has been run; current source-of-truth docs have been read or searched; upstream, base, and target branch freshness is known.
- Dirty state: `git status --short --branch` has been checked; unrelated dirty/untracked files are preserved, ignored, backed up, or routed explicitly.
- Secret/runtime boundary: required for deployment, auth, Paperclip, Cloudflare, env vars, or production work.

If the Definition of Ready is incomplete, PM should route the work back to planning or clarification instead of starting implementation.

---

## Branch Model

```text
topic branch -> dev -> main
```

| Branch | Purpose |
|---|---|
| `main` | Production-ready baseline |
| `dev` | Integration/dev baseline |
| `codex/*` | Codex-scoped docs, implementation, QA, integration, backup, or release-prep work |
| `claude/*` | Claude-scoped docs or implementation work |
| `feature/w1-*` | Company access/deployment work |
| `feature/w2-*` | UI redesign work |
| `feature/w3-*` | Paperclip integration work |
| `hotfix/*` | Urgent production fixes |

Parallel workstreams must use separate git worktree folders. Do not run W1/W2/W3 in the same working directory. For V0.3 role-based parallel Codex work, use `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`.

`feature/*` remains valid for PM-assigned product branches and historical workstreams. New Codex sessions should normally use `codex/<version-or-short-scope>`; new Claude sessions should normally use `claude/<version-or-short-scope>`.

---

## Worktree Setup

From the main repo folder:

```powershell
git fetch origin --prune
git checkout dev
git pull --ff-only origin dev
git worktree add ..\trisilar-task-hub-w1-company-access feature/w1-company-access-deployment
git worktree add ..\trisilar-task-hub-w2-ui-redesign feature/w2b-review-redesign
git worktree add ..\trisilar-task-hub-w3-paperclip feature/w3-paperclip-integration
git worktree add ..\trisilar-task-hub-v03-release-qa -b codex/v03-branch-workflow-release-qa origin/dev
git worktree list
```

If a branch already exists locally or remotely, attach the worktree to that branch instead of creating a duplicate branch.

---

## Change Scope

- Keep edits scoped to the assigned task.
- Preserve existing user and agent changes.
- Do not refactor unrelated UI, routes, or data contracts.
- Do not move documentation between files unless the task is documentation organization.
- Do not edit `CURRENT_SPRINT.md` unless acting as PM.
- Do not edit QA logs unless acting as QA/PM with a QA-related task.

---

## Commit Rules

Use specific staging:

```powershell
git add path\to\file1 path\to\file2
git status --short
git commit -m "Brief task-oriented message"
```

Do not use:

```powershell
git add .
```

Commit messages should state the work unit and outcome:

```text
V0.2 W1: prepare company access deployment plan
P7-4: implement project board convention validator
Update sprint after P7-4 QA pass
```

---

## Verification Gates

For code/config/route/integration behavior:

```powershell
node server.js
npm.cmd run check:all
```

For Windows PowerShell compatibility checks:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "npm run smoke"
```

For docs-only changes:

```powershell
git diff --check
```

State the verification result in the final handoff.

---

## Definition of Done

A task, cycle, workstream, or release is not complete until all applicable gates pass:

- Accepted scope is complete with no unapproved scope creep.
- Verification passes for the task type:
  - docs-only: `git diff --check`
  - code/config/route/integration: required npm/check/browser/runtime checks
  - release/integration: integration QA plus PM acceptance
- Docs/logs are updated by the correct role:
  - `CURRENT_SPRINT.md` for PM or integration checkpoints
  - `docs/logs/DECISION_LOG.md` for PM/process/release decisions
  - `docs/logs/QA_LOG.md` for QA/completion evidence
- PR/merge state is clear: merged into the correct target branch or explicitly held with owner/next action; no unresolved conflicts; local and remote target branch sync verified.
- Cleanup gate passes: completed temporary worktrees are removed, merged local/remote topic branches are deleted unless PM keeps them, stale `.git/worktrees/*` metadata is pruned, stale physical folders are removed when not locked, and the Agent Status Refresh Protocol checks are rerun.

Allowed exceptions:

- Backup branches may remain as safety refs until PM approves deletion.
- A Windows-locked folder may remain only if Git no longer registers it as a worktree and the blocker is recorded in the handoff.
- Held or unfinished work must keep its branch/worktree with an explicit owner and next action.

---

## QA Expectations

QA reports must include:

- findings first, if any
- AC checklist with PASS/FAIL
- file/line or command evidence
- verification commands and results
- final verdict
- attribution
- next role

QA must not edit files.

---

## Pull Request Expectations

Every PR into `dev` must include:

- workstream and branch
- worktree folder
- owner agent
- summary of changed files
- verification commands and result
- behavior risk
- deployment or environment impact
- rollback notes when relevant

Merge from `dev` into `main` only after integration QA and PM signoff.
