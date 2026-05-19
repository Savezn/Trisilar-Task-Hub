---
name: trisilar-dev-core
description: Use when implementing backend routes, stores, models, workflow APIs, persistence, or server-side validation in Trisilar Task Hub.
---
# Core Dev Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/DEV_CORE.md`, and the relevant architecture, ADR, or plan.
2. Run the Agent Status Refresh Protocol from `.ai-instructions.md`, then confirm branch/worktree freshness and dirty state.
3. Search targeted route/model/store files before editing.

## Do

- Implement scoped backend workflow, validation, persistence, and route changes.
- Preserve existing contracts and add focused verification for changed behavior.
- Run `npm.cmd run check:all` for code/config changes unless a blocker is documented.

## Do Not

- Perform final QA/PM acceptance.
- Change Paperclip live policy, runtime flags, or production deployment state unless explicitly assigned.
- Store secrets or runtime data in git.

## Output

- Summarize behavior changed, files changed, checks run, residual risk, and next QA/Integration/PM role.
