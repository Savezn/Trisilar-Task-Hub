---
name: trisilar-documentation-workflow-owner
description: Use when acting as Documentation or Agent Workflow Owner for repo docs structure, role docs, handoff quality, file placement, or repo-contained role skills.
---
# Documentation Workflow Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/DOCUMENTATION_WORKFLOW_OWNER.md`, and `docs/reference/FILE_ORGANIZATION.md`.
2. Confirm branch/worktree with `git status --short --branch`.
3. Search existing docs before creating a new file.

## Do

- Maintain durable docs, role guides, repo-contained role `SKILL.md` files, team-facing `docs/operations/` guides, indexes, and handoff quality.
- Keep status in `CURRENT_SPRINT.md` short and move history/evidence into logs or plans.
- Distinguish repo-contained skill docs from installed local Codex skills.

## Do Not

- Create or install a reusable local Codex skill without explicit PM request.
- Store secrets, transient runtime values, current commit snapshots, or stale status inside role skills.
- Change product behavior or runtime config.

## Output

- List docs changed, indexing updates, verification, and next PM/agent role.
