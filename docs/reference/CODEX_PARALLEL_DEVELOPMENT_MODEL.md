# Codex Parallel Development Model - Trisilar Task Hub

**Doc Role:** Branch/worktree and ownership model for parallel Codex development
**Status:** Draft for PM review
**Owner:** PM / Integration Owner
**Created:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect
**Related Docs:** `BRANCH_ENVIRONMENT_WORKFLOW.md`, `AI_AGENT_GOVERNANCE.md`, `../agents/INTEGRATION_OWNER.md`, `../../CONTRIBUTING.md`

---

## Purpose

This document defines when parallel Codex work is useful, when it is unsafe, and how agents must isolate branches, worktrees, roles, and write scopes.

---

## Core Rule

```text
One agent = one role = one branch = one worktree = one ownership scope.
```

Agents must start from `dev` unless PM explicitly assigns another base. Agents must not run in the same working directory. Agents must not merge sibling feature branches into each other.

---

## When Parallel Codex Work Helps

Parallel work is useful when:

- work slices are independent
- file ownership is mostly separate
- contracts/interfaces are agreed before implementation
- each branch can be verified independently
- integration QA will run after accepted branches merge into `dev`

Good examples:

- UX planning docs while backend work continues elsewhere
- frontend page polish separate from backend route work
- AI contract fixture work separate from unrelated UI work
- QA branch review while Dev works on a different branch
- docs governance separate from runtime config work

---

## When Parallel Work Should Be Avoided

Avoid parallel work when:

- multiple agents need to edit the same frontend shell or same large file
- data model or contract is still undecided
- one task depends on another unfinished branch
- runtime/secrets are involved
- PM has not defined a clear owner, branch, write scope, and acceptance criteria
- the work requires shared migration sequencing

If these conditions are present, PM should sequence the tasks or assign an Integration Owner before implementation starts.

---

## Required Parallel Work Rules

- One agent = one role = one branch = one worktree = one ownership scope.
- Agents must not share one feature branch unless explicitly assigned to integration/review.
- Agents must not run in the same working directory.
- Agents must start from `dev` unless PM says otherwise.
- Agents must not merge sibling feature branches into each other.
- Dev agents stage specific files only. Never use `git add .`.
- PM owns task decomposition and next-action routing.
- QA owns acceptance evidence and branch pass/fail.
- Integration Owner owns accepted-branch merges into `dev`.
- Runtime Owner owns runtime changes, environment variables, flags, access, and rollback.
- `CURRENT_SPRINT.md`, `PROJECT_LADDER.md`, and logs remain the single source of truth for status and decisions.
- Role docs and future skills should describe process, not current commit hashes or transient runtime state.

---

## Branch Naming

Use descriptive branch names under the existing branch model.

| Work type | Branch pattern |
|---|---|
| Product/frontend feature | `feature/<short-scope>` |
| Runtime/access work | `feature/w1-*` or `feature/runtime-*` when PM assigns it |
| UX/product docs | `feature/ux-*` or `feature/project-*` |
| AI/Paperclip integration | `feature/w3-*` or `feature/ai-*` when PM assigns it |
| Release hotfix | `hotfix/<short-scope>` from `main`, then backport to `dev` |

V0.2 W1/W2/W3 historical branch rules still apply to active V0.2 work. V0.3 may use role/scope names when PM assigns non-W1/W2/W3 work.

---

## Worktree Setup

Use a dedicated sibling worktree folder for each active branch. Example:

```powershell
git fetch origin
git worktree add ..\trisilar-task-hub-project-operating-model -b feature/project-operating-model-agent-structure origin/dev
git worktree list
```

If a branch already exists locally or remotely, attach the worktree to that branch instead of creating a duplicate branch.

Before editing:

```powershell
git status --short --branch
git log --oneline --decorate --max-count=20
```

Confirm:

- folder matches the assigned worktree
- branch matches the assigned branch
- dirty files are either yours or explicitly accepted by PM
- base branch is `dev` unless PM assigned another base

---

## Branch Contamination Rule

Sibling workstream contamination is a real risk. Prevent cases like W2 UI commits entering W3 branches or W3 integration commits entering W2 branches.

Use this check when a known sibling contamination risk exists:

```powershell
git status --short --branch
git log --oneline --decorate --max-count=20
git merge-base --is-ancestor <sibling-head> <current-branch>
```

Interpretation:

- Exit code `0`: `<sibling-head>` is already reachable from the current branch. Investigate whether that merge was intentional.
- Exit code `1`: `<sibling-head>` is not an ancestor. This usually means the sibling branch did not contaminate the current branch.
- Other exit codes: command or revision error. Stop and inspect the branch names/commits.

Only use exact sibling commit checks when there is a known risk. Do not turn every session into broad branch archaeology.

---

## Staging And Commit Rules

Use specific staging:

```powershell
git add docs\reference\AI_AGENT_GOVERNANCE.md docs\agents\QA_RELEASE.md
git status --short
git commit -m "V0.3: define operating model and agent roles"
```

Do not use:

```powershell
git add .
```

If unrelated dirty files exist, leave them alone and stage only owned paths.

---

## Integration Flow

```text
feature branch
-> role verification
-> QA / PM acceptance
-> Integration Owner merges accepted branch into dev
-> integration QA
-> PM decides dev -> main release path
```

Feature agents do not merge sibling branches into each other. Integration Owner may merge accepted branches into `dev` after PM/QA acceptance and must record the evidence.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created parallel Codex development model for V0.3 PM review | Codex PM / Documentation Architect |
