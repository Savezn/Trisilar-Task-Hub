---
name: trisilar-dev-frontend
description: Use when implementing frontend UI, route behavior, browser regressions, responsive layout, or production static assets in Trisilar Task Hub.
---
# Frontend Dev Skill

## When to use

Use this for production frontend UI, route behavior, responsive layout, browser regressions, static assets, and user-facing copy inside the app.

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/DEV_FRONTEND.md`, and the relevant UX or implementation plan.
2. Confirm branch/worktree with `git status --short --branch`.
3. Search targeted frontend files before reading large modules.
4. Read `docs/reference/AGENT_HARNESS_ADOPTION.md` when the work affects agent workflow, progress sync, or verification gates.

## Do

- Implement scoped UI, route, copy, layout, and browser behavior changes.
- Preserve existing frontend patterns and avoid unrelated visual rewrites.
- Verify with the relevant npm checks and browser route evidence when UI behavior changes.

## Do Not

- Perform final QA/PM acceptance.
- Change backend contracts, runtime flags, deployment config, or secrets unless explicitly assigned.
- Use `git add .`; stage only owned files.

## Verification

- Run `npm.cmd test` when frontend work depends on app-owned contracts or route behavior.
- Run `node server.js` plus `npm.cmd run check:all` for production frontend behavior changes.
- Use browser route evidence for navigation, responsive layout, Review Queue flows, or visual regressions.
- Use `git diff --check` before handoff.

## Stop Conditions

- The task is design-only and would require production `public/` or `src/` implementation.
- The change would require backend contract, runtime, secret, or live integration ownership.
- Browser evidence reveals console/page errors or mobile overflow that cannot be resolved within scope.

## Output

- List changed UI files, checks run, browser evidence, commit/branch if applicable, and next QA or PM role.
