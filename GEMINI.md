# Trisilar Task Hub - Gemini Rules

**Doc Role:** Gemini-specific agent extensions
**Status:** Active
**Universal Rules:** Read `.ai-instructions.md` first.
**Last Updated:** 2026-05-08
**Updated by:** Codex PM

This file is intentionally small. Shared project workflow, role rules, branch/worktree rules, documentation ownership, and verification policy live in `.ai-instructions.md` and `CONTRIBUTING.md`.

---

## Gemini Operating Rules

- Follow the role stated by the user: Dev, Dev Fix, QA, QA Recheck, or PM.
- Use search first, then targeted reads around relevant code or docs.
- Avoid broad rewrites of Markdown files that contain Thai text.
- Do not edit files during QA.
- Do not update `CURRENT_SPRINT.md` unless acting as PM.
- Do not run multiple workstreams from the same working directory.
- Stage specific files only and preserve other agents' work.

---

## Required Read Order

1. `.ai-instructions.md`
2. `docs/reference/PROJECT_CONTEXT.md`
3. `CURRENT_SPRINT.md`
4. active version/workstream plan
5. this file
