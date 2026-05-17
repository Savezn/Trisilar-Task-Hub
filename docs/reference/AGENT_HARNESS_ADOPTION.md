# Agent Harness Adoption - Trisilar Task Hub

**Doc Role:** Reference policy for adopting external agent-harness practices
**Status:** Active
**Owner:** PM / Documentation Workflow Owner
**Created:** 2026-05-17
**Updated by:** Codex Documentation Workflow Owner
**Related Docs:** `AI_AGENT_GOVERNANCE.md`, `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `BRANCH_ENVIRONMENT_WORKFLOW.md`, `../testing/TEST_STRATEGY.md`, `../../.ai-instructions.md`

---

## Purpose

This document defines how Trisilar Task Hub may reuse useful agent-harness patterns without importing a separate framework, bypassing repo roles, or expanding agent authority.

The accepted model is lightweight:

- use the existing repo roles
- declare the current role
- use the smallest safe role for the current task
- preserve branch/worktree isolation
- record visible progress and verification evidence
- route to the next owner when the task crosses a boundary

---

## Adoption Boundary

Agent-harness practices are reference patterns only. They do not replace `.ai-instructions.md`, `CONTRIBUTING.md`, role guides, role `SKILL.md` files, Review Queue safety, branch/worktree rules, or runtime/secret ownership.

Adopt:

- role-specific entrypoints that point to the right repo docs
- progress-sync expectations across PRs, sprint docs, plans, QA logs, and handoff notes
- local/file-backed observability using explicit commands and evidence summaries
- hook-inspired checklists that agents run intentionally and report
- deterministic verification commands that do not require hidden automation or secrets

Do not adopt:

- a broad role matrix beyond existing repo roles
- combined roles that grant extra permission
- autonomous loops that bypass PM, QA, Runtime, Integration, or Review Queue gates
- Claude-specific or tool-specific hook graphs as required infrastructure
- hosted telemetry or external agent logs as the source of truth
- any workflow that weakens secret, runtime flag, or production data boundaries

---

## Role Routing Compatibility

Harness adoption must use the existing PM routing template:

```text
Primary role:
Next role:
Optional support role:
Boundary:
Route if:
```

`Primary role` controls the current authority. `Optional support role` is consultation only and does not grant extra permission. If a harness checklist suggests work owned by another role, stop at the current boundary and route the next role instead of broadening scope.

---

## Progress Sync Contract

Agents should keep progress visible in the smallest durable place that matches the task.

| Surface | Use when | Rule |
|---|---|---|
| Pull request | Branch work is ready for review | Include role, branch, worktree, files changed, verification, risk, and next role |
| `CURRENT_SPRINT.md` | PM owns active routing or current-state updates | Keep it short; point to deeper plans/logs instead of duplicating them |
| `docs/plans/` | Version, workstream, or multi-session scope changes | Update the owning plan only when scope, gates, or sequencing changes |
| `docs/logs/QA_LOG.md` | QA evidence or completion evidence is produced | Record findings, commands, evidence, verdict, and next role |
| `docs/logs/DECISION_LOG.md` | PM/process/release decision changes durable workflow | Add one decision row with date, decision, rationale, and owner |
| Worktree or handoff notes | Temporary branch context is needed | Keep notes scoped to that branch and remove or archive them during cleanup |

Avoid status sprawl. Do not update every document just because a checklist exists.

---

## Local Observability

Use explicit local commands as the repo's observability layer. Report the command and result in the handoff.

Common checks:

```powershell
git status --short --branch
git worktree list
git branch -vv
git diff --check -- <owned-files>
rg -n "^<{7}|^={7}|^>{7}" <owned-files>
```

For behavior changes, use the verification commands in `../testing/TEST_STRATEGY.md`. For docs-only harness policy changes, runtime checks may be skipped when `git diff --check` and conflict-marker scans pass.

---

## Hook-Inspired Checks

This repo may use hook-inspired checks as manual or scripted gates, but they must remain visible and role-owned.

| Check type | Owner | Expected behavior |
|---|---|---|
| Before edit | Current role | Confirm role, branch, worktree, dirty state, owned files, and stop conditions |
| Before commit | Current role | Stage specific files only, run applicable verification, scan for conflict markers |
| Before PR | Current role | Summarize scope, verification, risks, runtime impact, rollback notes, and next role |
| Before merge | QA / PM / Integration Owner | Confirm acceptance, target branch, conflicts, and integration risk |
| Before cleanup | Integration Owner or assigned owner | Confirm merged/held state, remove completed worktrees/branches, prune stale metadata |

Hidden hooks are optional convenience only. A task is accepted by visible evidence, not by an unseen local automation pass.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-17 | Recreated lightweight agent-harness adoption policy from latest `origin/dev` without reviving the stale PR branch; consolidated with existing role-routing rules | Codex Documentation Workflow Owner |
