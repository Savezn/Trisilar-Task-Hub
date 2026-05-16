---
name: trisilar-dev-core
description: Use when implementing backend routes, stores, models, workflow APIs, persistence, or server-side validation in Trisilar Task Hub.
---
# Core Dev Skill

## When to use

Use this for backend routes, stores, models, workflow APIs, persistence, contracts, server-side validation, and deterministic test coverage.

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/DEV_CORE.md`, and the relevant architecture, ADR, or plan.
2. Confirm branch/worktree with `git status --short --branch`.
3. Search targeted route/model/store files before editing.
4. Read `docs/reference/AGENT_HARNESS_ADOPTION.md` when work changes test gates, progress sync, role skills, or agent-harness behavior.

## Do

- Implement scoped backend workflow, validation, persistence, and route changes.
- Preserve existing contracts and add focused verification for changed behavior.
- Run `npm.cmd run check:all` for code/config changes unless a blocker is documented.

## Do Not

- Perform final QA/PM acceptance.
- Change Paperclip live policy, runtime flags, or production deployment state unless explicitly assigned.
- Store secrets or runtime data in git.

## Verification

- Add or update deterministic tests before behavior changes when practical.
- Run `npm.cmd test` for route/model/contract/persistence changes.
- Run `node server.js` plus `npm.cmd run check:all` for code/config/runtime route changes.
- Run targeted Paperclip or SQLite verification scripts when those boundaries change.
- Use `git diff --check` before handoff.

## Stop Conditions

- A change would alter public API shape without an ADR or explicit PM decision.
- A test would require live Trello, Google, Cloudflare, Paperclip, or production secrets.
- Work crosses into production runtime, Cloudflare policy, live flags, or deployment ownership.
- Required acceptance criteria or write scope is missing.

## Output

- Summarize behavior changed, files changed, checks run, residual risk, and next QA/Integration/PM role.
