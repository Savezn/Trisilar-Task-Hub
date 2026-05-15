# Trisilar Task Hub - Claude Rules

**Doc Role:** Claude-specific agent extensions
**Status:** Active
**Universal Rules:** Read `.ai-instructions.md` first.
**Last Updated:** 2026-05-15
**Updated by:** Codex PM / Integration Owner

This file is intentionally small. Shared project workflow, role rules, branch/worktree rules, documentation ownership, and verification policy live in `.ai-instructions.md` and `CONTRIBUTING.md`.

---

## Claude Operating Rules

- Follow the role stated by the user: Dev, Dev Fix, QA, QA Recheck, or PM.
- After `.ai-instructions.md`, load the matching repo-contained role skill under `docs/agent-skills/<role>/SKILL.md` before deeper role docs.
- Use search/grep first, then targeted reads around the relevant section.
- Do not read or rewrite large files wholesale unless the task explicitly requires it.
- Do not edit files during QA.
- Do not update `CURRENT_SPRINT.md` unless acting as PM.
- Use the required worktree and branch for W1/W2/W3, V0.3, or PM-assigned work.
- Use `claude/<version-or-short-scope>` for Claude-owned branches unless PM assigns an existing `feature/*` branch. If slash branch creation is blocked locally, use a flat `claude-<short-scope>` fallback and record it in the handoff.
- Do not reuse Codex-owned branches for Claude work unless PM explicitly assigns shared integration ownership.
- Preserve other agents' uncommitted changes.
- Keep Thai/emoji-heavy Markdown edits targeted and UTF-8 safe.

---

## Required Read Order

1. `.ai-instructions.md`
2. this file
3. matching `docs/agent-skills/<role>/SKILL.md`
4. `docs/reference/PROJECT_CONTEXT.md`
5. `CURRENT_SPRINT.md`
6. active version/workstream plan
