# Codex Parallel Development Model - Trisilar Task Hub

**Doc Role:** Branch/worktree and ownership model for parallel Codex development
**Status:** PM accepted
**Owner:** PM / Integration Owner
**Created:** 2026-05-14
**Last Updated:** 2026-05-16
**Updated by:** Codex Documentation Workflow Owner
**Related Docs:** `BRANCH_ENVIRONMENT_WORKFLOW.md`, `AI_AGENT_GOVERNANCE.md`, `AGENT_HARNESS_ADOPTION.md`, `../agents/INTEGRATION_OWNER.md`, `../../CONTRIBUTING.md`

---

## Purpose

This document defines when parallel Codex work is useful, when it is unsafe, and how agents must isolate branches, worktrees, roles, and write scopes.

---

## PM Acceptance - 2026-05-14

PM accepts this model as the long-term Codex parallel development rule set.

Accepted decisions:

- One agent = one role = one branch = one worktree = one ownership scope.
- Agents start from `dev` unless PM assigns another base.
- Feature agents must not merge sibling feature branches into each other.
- Dev agents stage specific files only and must not use `git add .`.
- Integration Owner owns accepted-branch merges into `dev`.
- Branch contamination checks should be used when a known sibling risk exists.

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
| Codex-scoped docs / implementation / QA / release-prep | `codex/<version-or-short-scope>` |
| Claude-scoped docs / implementation | `claude/<version-or-short-scope>` |
| Product/frontend feature | `feature/<short-scope>` |
| Runtime/access work | `feature/w1-*` or `feature/runtime-*` when PM assigns it |
| UX/product docs | `feature/ux-*` or `feature/project-*` |
| AI/Paperclip integration | `feature/w3-*` or `feature/ai-*` when PM assigns it |
| Release hotfix | `hotfix/<short-scope>` from `main`, then backport to `dev` |
| Local safety backup | `codex/backup-*` or `claude/backup-*`; do not use as PR source unless PM asks |

V0.2 W1/W2/W3 historical branch rules still apply to active V0.2 work. V0.3 may use role/scope names when PM assigns non-W1/W2/W3 work.

Branch names should be short, role-readable, and phase-specific. Prefer examples like:

- `codex/v03-branch-workflow-release-qa`
- `codex/v03-dev-to-main-release-candidate`
- `codex/integrate-v03-rux-into-dev`
- `claude/review-queue-polish`

If local Git cannot create slash-namespaced refs because of permissions or lock-file issues, use a flat fallback and record it in the handoff.

---

## Worktree Setup

Use a dedicated sibling worktree folder for each active branch. Example:

```powershell
git fetch origin
git worktree add ..\trisilar-task-hub-project-operating-model -b codex/project-operating-model-agent-structure origin/dev
git worktree add ..\trisilar-task-hub-v03-release-qa -b codex/v03-branch-workflow-release-qa origin/dev
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

## Definition of Ready

Parallel Codex/Claude work is ready only when:

- role, branch, base, worktree, target branch, and ownership scope are named
- goal, non-goals, acceptance criteria, verification commands, and stop conditions are clear
- dependencies and runtime/secret boundaries are identified before implementation
- `git status --short --branch` confirms the starting state
- unrelated dirty files have an explicit preserve/ignore/backup/route decision

PM should not start implementation if these inputs are missing.

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
topic branch
-> role verification
-> QA / PM acceptance
-> Integration Owner merges accepted branch into dev
-> integration QA
-> PM decides dev -> main release path
```

Feature agents do not merge sibling branches into each other. Integration Owner may merge accepted branches into `dev` after PM/QA acceptance and must record the evidence.

## Progress Sync

After a merge, QA pass, blocker, PM decision, or explicit hold, the owner must keep the status surfaces aligned:

- `CURRENT_SPRINT.md` for current route and next action.
- `PROJECT_LADDER.md` for version gate and sequencing changes.
- `QA_LOG.md` for QA evidence and skipped checks.
- worktree plan or handoff docs for folder, branch, owner, blocker, and cleanup state.
- GitHub PR/branch state for source, target, merge, or hold evidence.

Use `AGENT_HARNESS_ADOPTION.md` for the detailed progress-sync contract. Do not claim a lane is current from chat memory alone.

## Definition of Done

Parallel work is not complete until the accepted branch is integrated or explicitly held and the branch/worktree cleanup gate is resolved.

Completion requires:

- accepted scope complete with no unapproved scope creep
- role verification, QA evidence, and PM acceptance when required
- target branch merge or explicit hold state with owner and next action
- no unresolved conflicts or sibling-branch contamination
- completed temporary worktrees removed
- merged local topic branches deleted unless PM keeps them
- merged remote topic branches deleted unless PM keeps them
- stale `.git/worktrees/*` metadata pruned
- stale physical folders removed unless locked by Windows or another process
- final checks from `git worktree list`, `git branch -vv`, and `git status --short --branch`

Backup branches may remain as safety refs until PM approves deletion. Locked folders may remain only if Git no longer registers them as worktrees and the blocker is recorded in the handoff.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created parallel Codex development model for V0.3 PM review | Codex PM / Documentation Architect |
| 2026-05-14 | PM accepted the long-term parallel Codex branch/worktree model | Codex PM |
| 2026-05-15 | Added Codex/Claude branch namespaces, backup branch rules, worktree examples, and cleanup expectations | Codex PM / Integration Owner |
| 2026-05-16 | Added progress-sync contract pointer for external harness adoption | Codex Documentation Workflow Owner |
