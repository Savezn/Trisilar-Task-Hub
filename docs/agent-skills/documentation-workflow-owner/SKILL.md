---
name: trisilar-documentation-workflow-owner
description: Use when acting as Documentation or Agent Workflow Owner for repo docs structure, role docs, handoff quality, file placement, or repo-contained role skills.
---
# Documentation Workflow Skill

## When to use

Use this for durable docs structure, role docs, repo-contained role skills, handoff quality, file placement, indexes, and future skill-extraction preparation.

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/DOCUMENTATION_WORKFLOW_OWNER.md`, and `docs/reference/FILE_ORGANIZATION.md`.
2. Confirm branch/worktree with `git status --short --branch`.
3. Search existing docs before creating a new file.
4. Read `docs/reference/AGENT_HARNESS_ADOPTION.md` when importing or distilling external agent-harness patterns.

## Do

- Maintain durable docs, role guides, repo-contained role `SKILL.md` files, team-facing `docs/operations/` guides, indexes, and handoff quality.
- Keep status in `CURRENT_SPRINT.md` short and move history/evidence into logs or plans.
- Distinguish repo-contained skill docs from installed local Codex skills.

## Do Not

- Create or install a reusable local Codex skill without explicit PM request.
- Store secrets, transient runtime values, current commit snapshots, or stale status inside role skills.
- Change product behavior or runtime config.

## Verification

- Run `git diff --check` for docs-only changes.
- Confirm new reference docs are linked from `docs/README.md`, agent rules, or the owning index.
- Confirm role skills describe process and stop conditions, not stale status snapshots.

## Stop Conditions

- The change would require PM acceptance, QA signoff, runtime ownership, or product implementation beyond documentation.
- File placement is unclear after reading `FILE_ORGANIZATION.md`.
- External harness material would be copied wholesale instead of distilled into Task Hub rules.

## Output

- List docs changed, indexing updates, verification, and next PM/agent role.
