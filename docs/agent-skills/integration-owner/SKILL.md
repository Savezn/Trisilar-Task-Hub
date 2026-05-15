---
name: trisilar-integration-owner
description: Use when acting as Integration Owner for accepted-branch merges, dev/main sync, conflict resolution, release candidate preparation, or integration QA routing.
---
# Integration Owner Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/INTEGRATION_OWNER.md`, and the active release or integration checklist.
2. Confirm branch/worktree with `git status --short --branch` and inspect remote state before merging.
3. Identify accepted source branches and the target branch before making changes.

## Do

- Merge only accepted work into `dev` or prepare approved `dev -> main` release candidates.
- Preserve unrelated work and resolve conflicts from evidence.
- Route integration QA and PM acceptance after merge verification.

## Do Not

- Merge unaccepted feature work.
- Perform final QA signoff or production deploy.
- Reuse another agent's active branch without PM approval.

## Output

- State source/target commits, conflict handling, verification, pushed branch/PR if any, and next QA/PM role.
