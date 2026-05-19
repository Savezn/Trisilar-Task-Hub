---
name: trisilar-dev-frontend
description: Use when implementing frontend UI, route behavior, browser regressions, responsive layout, or production static assets in Trisilar Task Hub.
---
# Frontend Dev Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/DEV_FRONTEND.md`, and the relevant UX or implementation plan.
2. Run the Agent Status Refresh Protocol from `.ai-instructions.md`, then confirm branch/worktree freshness and dirty state.
3. Search targeted frontend files before reading large modules.

## Do

- Implement scoped UI, route, copy, layout, and browser behavior changes.
- Preserve existing frontend patterns and avoid unrelated visual rewrites.
- Verify with the relevant npm checks and browser route evidence when UI behavior changes.

## Do Not

- Perform final QA/PM acceptance.
- Change backend contracts, runtime flags, deployment config, or secrets unless explicitly assigned.
- Use `git add .`; stage only owned files.

## Output

- List changed UI files, checks run, browser evidence, commit/branch if applicable, and next QA or PM role.
