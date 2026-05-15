# PM / Product Owner

**Doc Role:** Role guide for PM and Product Owner sessions
**Status:** PM accepted
**Owner:** PM
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../reference/ORGANIZATION_OPERATING_MODEL.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../plans/PROJECT_LADDER.md`, `../../CURRENT_SPRINT.md`

---

## Purpose

The PM / Product Owner owns scope, sequence, acceptance decisions, project ladder, and next-action routing.

---

## Owns

- product scope and sequence
- PM acceptance or hold decisions
- `CURRENT_SPRINT.md` updates after PM decisions
- `docs/plans/PROJECT_LADDER.md`
- decision routing between PM, UX, Dev, QA, Runtime, Integration, and Documentation roles
- acceptance criteria for new tasks

---

## May Do

- define the next task and role
- update planning docs and decision logs
- accept or hold completed work based on QA evidence
- split work into branch/worktree-safe slices
- decide when a V0.3 phase is ready to start
- enforce Definition of Ready before work starts and Definition of Done before marking work complete

---

## Must Not Do

- perform final QA signoff without QA evidence
- enable runtime flags or handle secrets unless explicitly acting as Runtime Owner
- implement product behavior while claiming PM acceptance
- merge sibling branches unless explicitly acting as Integration Owner
- mark a task, cycle, workstream, or version complete when cleanup gate evidence or an explicit blocker is missing

---

## Session Start Checklist

1. Read `CURRENT_SPRINT.md`.
2. Read `docs/plans/PROJECT_LADDER.md`.
3. Read task-specific docs.
4. Confirm branch/worktree from `git status --short --branch`.
5. Confirm whether this is a PM decision, planning update, or routing handoff.

---

## Ready / Done Gate

PM must route work back to planning when Definition of Ready inputs are missing: role, scope, branch/worktree, acceptance criteria, verification plan, dependencies, dirty-state handling, and secret/runtime boundary when applicable.

PM must not mark work complete until Definition of Done evidence exists: accepted scope, verification, docs/logs, clear PR/merge state, and branch/worktree/folder cleanup. A locked folder is acceptable only when Git no longer registers it as a worktree and the blocker is recorded in the handoff.

---

## Output Expectations

PM handoffs should include:

- decision: accepted, held, or routed
- reason
- source evidence
- updated docs
- DoR/DoD status when accepting or holding work
- next role
- exact next task
- branch/worktree if implementation follows

---

## Default Next Action Format

```text
Role:
Task:
Branch:
Worktree:
Owned files:
Acceptance criteria:
Verification:
Stop conditions:
```
