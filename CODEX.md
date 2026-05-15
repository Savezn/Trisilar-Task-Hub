# Trisilar Task Hub - Codex Rules

**Doc Role:** Codex-specific agent extensions
**Status:** Active
**Universal Rules:** Read `.ai-instructions.md` first.
**Last Updated:** 2026-05-15
**Updated by:** Codex PM / Integration Owner

This file intentionally avoids duplicating the shared project workflow. Shared rules live in `.ai-instructions.md`, `CONTRIBUTING.md`, `docs/reference/PROJECT_CONTEXT.md`, and `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`.

---

## Codex Operating Rules

- Use `rg` first when available. If `rg` is unavailable or blocked, use targeted PowerShell search.
- For large files such as `public/app.js` and `public/style.css`, search first and read only nearby ranges.
- Use `apply_patch` for manual edits.
- Use Python splice only when the user explicitly requests UTF-8-safe block movement or large mechanical extraction.
- Stage specific files only. Never use `git add .`.
- Use `codex/<version-or-short-scope>` for Codex task branches unless PM assigns an existing `feature/*` branch.
- Use a dedicated sibling worktree for non-trivial branch work. Do not reuse the main `trisilar-task-hub` folder for parallel work.
- Treat `codex/backup-*` branches as local safety refs, not active work branches.
- Do not revert unrelated user/agent changes.
- For docs-only changes, run `git diff --check` and state that runtime checks were skipped.
- For code/config/route/integration changes, run `node server.js` in one terminal and `npm.cmd run check:all` in another.
- After `.ai-instructions.md`, load the matching repo-contained role skill under `docs/agent-skills/<role>/SKILL.md` before deeper role docs.
- Repo-contained role skills complement Codex platform skills. Use relevant Codex/system skills when available, but do not skip this repo's role `SKILL.md`.
- For role/parallel work, use `docs/reference/AI_AGENT_GOVERNANCE.md`, `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, and the relevant file under `docs/agents/`.

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
- `docs/reference/ORGANIZATION_OPERATING_MODEL.md`
- `docs/reference/AI_AGENT_GOVERNANCE.md`
- `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`
- `docs/agent-skills/`
- `docs/reference/ARCHITECTURE.md`
- `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`
- `docs/reference/FILE_ORGANIZATION.md`
- `docs/testing/TEST_STRATEGY.md`
- `docs/adr/README.md`
