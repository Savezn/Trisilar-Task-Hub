# Trisilar Task Hub - Codex Rules

**Doc Role:** Codex-specific agent extensions
**Status:** Active
**Universal Rules:** Read `.ai-instructions.md` first.
**Last Updated:** 2026-05-08
**Updated by:** Codex PM

This file intentionally avoids duplicating the shared project workflow. Shared rules live in `.ai-instructions.md`, `CONTRIBUTING.md`, `docs/reference/PROJECT_CONTEXT.md`, and `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`.

---

## Codex Operating Rules

- Use `rg` first when available. If `rg` is unavailable or blocked, use targeted PowerShell search.
- For large files such as `public/app.js` and `public/style.css`, search first and read only nearby ranges.
- Use `apply_patch` for manual edits.
- Use Python splice only when the user explicitly requests UTF-8-safe block movement or large mechanical extraction.
- Stage specific files only. Never use `git add .`.
- Do not revert unrelated user/agent changes.
- For docs-only changes, run `git diff --check` and state that runtime checks were skipped.
- For code/config/route/integration changes, run `node server.js` in one terminal and `npm.cmd run check:all` in another.

---

## Codex Handoff Format

Every final handoff for repository work should include:

- files changed
- verification run
- commit hash, if committed
- branch pushed, if pushed
- remaining dirty files, if any
- next role or next action

---

## Current Canonical Docs

- `.ai-instructions.md`
- `CONTRIBUTING.md`
- `TODO.md`
- `CURRENT_SPRINT.md`
- `docs/plans/VERSION_0_2_PLAN.md`
- `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`
- `docs/reference/PROJECT_CONTEXT.md`
- `docs/reference/ARCHITECTURE.md`
- `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`
- `docs/testing/TEST_STRATEGY.md`
- `docs/adr/README.md`
