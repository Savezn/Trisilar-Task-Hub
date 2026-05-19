---
name: trisilar-integration-owner
description: Use when acting as Integration Owner for accepted-branch merges, dev/main sync, conflict resolution, release candidate preparation, or integration QA routing.
---
# Integration Owner Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/INTEGRATION_OWNER.md`, and the active release or integration checklist.
2. Run the Agent Status Refresh Protocol from `.ai-instructions.md` and inspect remote state before merging.
3. Identify accepted source branches and the target branch before making changes.
4. Confirm Definition of Ready and required acceptance evidence before integration.

## Do

- Merge only accepted work into `dev` or prepare approved `dev -> main` release candidates.
- Preserve unrelated work and resolve conflicts from evidence.
- Route integration QA and PM acceptance after merge verification.
- Verify Definition of Done cleanup state after completed branches are merged or explicitly held.

## Do Not

- Merge unaccepted feature work.
- Perform final QA signoff or production deploy.
- Reuse another agent's active branch without PM approval.
- Declare integration complete before branch/worktree/folder cleanup is done or a blocker is recorded.

## Output

- State source/target commits, conflict handling, verification, pushed branch/PR if any, cleanup evidence, and next QA/PM role.
