---
name: trisilar-pm
description: Use when acting as PM or Product Owner in the Trisilar Task Hub repo, including scope decisions, acceptance, current sprint routing, or project-status docs.
---
# PM Skill

## When to use

Use this when deciding scope, sequencing, acceptance, project status, source-of-truth docs, or next role routing.

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/PM.md`, and the active plan named by the sprint or user.
2. Confirm branch/worktree with `git status --short --branch`.
3. Confirm Definition of Ready before routing work to implementation, QA, integration, runtime, or docs changes.
4. Use the smallest safe role if the user has not assigned one.
5. Read `docs/reference/AGENT_HARNESS_ADOPTION.md` when the task changes agent workflow, role skills, progress sync, or harness policy.

## Do

- Decide scope, sequence, acceptance, and next role from repo evidence.
- Update PM-owned docs such as `CURRENT_SPRINT.md`, plans, decision logs, and routing notes when there is a real decision.
- Keep status docs short and link to durable plans/logs for detail.
- Enforce Definition of Done before marking any cycle/task/workstream/version complete.

## Do Not

- Implement product behavior while acting as PM.
- Perform final QA signoff.
- Change runtime flags, secrets, or deployment state unless explicitly assigned Runtime Owner responsibility too.
- Mark work complete when branch/worktree/folder cleanup evidence or an explicit blocker is missing.

## Verification

- Docs/status-only PM changes: `git diff --check`.
- Acceptance decisions: confirm linked QA evidence, source branch/PR state, and next role are named.
- Harness/workflow decisions: confirm progress-sync surfaces are named or explicitly not affected.

## Stop Conditions

- Required QA evidence is missing.
- Runtime/secrets/live flag ownership is unclear.
- Branch/worktree state does not match the assigned lane.
- A decision would bypass Review Queue or external side-effect approval.

## Output

- State decision, evidence, DoR/DoD status, files changed, verification, cleanup state, and next role/task.
