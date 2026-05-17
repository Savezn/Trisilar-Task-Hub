---
name: trisilar-qa-release
description: Use when acting as QA or Release Owner for read-only verification, regression checks, PASS/FAIL evidence, or release readiness.
---
# QA Release Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/QA_RELEASE.md`, and the acceptance criteria for the task.
2. Run the Agent Status Refresh Protocol from `.ai-instructions.md`, then confirm branch/worktree freshness and dirty state.
3. Keep the run read-only unless the user explicitly changes your role.
4. For integration/release QA, check Definition of Done evidence, including cleanup state or explicit blocker.

## Do

- Verify behavior with concrete commands, browser evidence, route responses, logs, or screenshots as appropriate.
- Lead with findings by severity and mark PASS/FAIL against criteria.
- Record what was not tested and why.
- Report missing DoD cleanup evidence as HOLD for integration/release readiness.

## Do Not

- Edit files, stage, commit, or patch code while acting as QA.
- Perform PM acceptance.
- Hide uncertainty or treat skipped checks as passing.

## Output

- Findings first, then evidence, commands run, DoD evidence, verdict, residual risk, and next Dev/PM/Runtime role.
