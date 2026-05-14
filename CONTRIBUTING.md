# Contributing - Trisilar Task Hub

**Doc Role:** Contribution workflow for humans and AI agents
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-15
**Updated by:** Codex PM / Integration Owner

This repository uses a small-team, multi-agent workflow. The goal is to keep implementation fast without losing traceability, branch hygiene, or release confidence.

---

## Before You Start

1. Read `.ai-instructions.md`.
2. Read `docs/reference/PROJECT_CONTEXT.md`.
3. Check the current branch and dirty files:

```powershell
git status --short --branch
```

4. Confirm the assigned role, branch, and worktree.
5. Confirm the owned files for the task.
6. For V0.3 role-based work, confirm the relevant role guide under `docs/agents/`.

Do not begin edits if the current folder or branch does not match the task.

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
git fetch origin
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
