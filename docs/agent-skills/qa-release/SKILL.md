---
name: trisilar-qa-release
description: Use when acting as QA or Release Owner for read-only verification, regression checks, PASS/FAIL evidence, or release readiness.
---
# QA Release Skill

## When to use

Use this for read-only verification, regression checks, release readiness, PASS/FAIL evidence, and rechecks after Dev fixes.

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/QA_RELEASE.md`, and the acceptance criteria for the task.
2. Confirm branch/worktree with `git status --short --branch`.
3. Keep the run read-only unless the user explicitly changes your role.
4. For integration/release QA, check Definition of Done evidence, including cleanup state or explicit blocker.
5. Read `docs/reference/AGENT_HARNESS_ADOPTION.md` when verifying agent workflow, progress sync, or local observability claims.

## Do

- Verify behavior with concrete commands, browser evidence, route responses, logs, or screenshots as appropriate.
- Lead with findings by severity and mark PASS/FAIL against criteria.
- Record what was not tested and why.
- Report missing DoD cleanup evidence as HOLD for integration/release readiness.

## Do Not

- Edit files, stage, commit, or patch code while acting as QA.
- Perform PM acceptance.
- Hide uncertainty or treat skipped checks as passing.

## Verification

- Lead with findings, then AC checklist, then evidence.
- Use `npm.cmd test` for deterministic foundation test-gate claims.
- Use `node server.js` plus `npm.cmd run check:all` for runtime route/config/frontend smoke when behavior changes.
- Use targeted Paperclip, SQLite, RUX, or browser commands only when the changed surface requires them.
- For docs-only QA, use `git diff --check` and state runtime checks were skipped.

## Stop Conditions

- A required runtime secret, host credential, or live flag is unavailable.
- The run would require editing files while still acting as QA.
- The evidence would create Trello, Calendar, Google Tasks, or live Paperclip side effects without approval.
- The branch/worktree cleanup state is missing for release/integration readiness.

## Output

- Findings first, then evidence, commands run, DoD evidence, verdict, residual risk, and next Dev/PM/Runtime role.
