# Trisilar Task Hub

**Status:** V0.1 release acceptance passed
**Primary docs:** `CURRENT_SPRINT.md`, `DEVELOPMENT_PLAN.md`, `MVP_PRD.md`
**Agent rules:** `CODEX.md`, `CLAUDE.md`, `GEMINI.md`
**Updated by:** Codex PM

Trisilar Task Hub is a local-first team command center for Trello, Google Calendar, Google Tasks, Review Queue, OKR/Portfolio views, and weekly focus planning.

---

## Quick Start

```powershell
npm.cmd install
npm.cmd run check:all
node server.js
```

Open the app at `http://localhost:3000`.

---

## Documentation Map

| File | Purpose |
|---|---|
| `CURRENT_SPRINT.md` | Active source of truth for current work, QA log, and next action prompts |
| `DEVELOPMENT_PLAN.md` | Roadmap and historical progress tracker |
| `MVP_PRD.md` | Product requirements and UX/product scope |
| `CODEX.md` | Codex-specific project workflow rules |
| `CLAUDE.md` | Claude-specific project workflow rules |
| `GEMINI.md` | Gemini-specific project workflow rules |
| `docs/README.md` | Reference, archive, and design artifact index |

---

## Workspace Structure

| Path | Purpose |
|---|---|
| `public/` | Frontend app, styles, plain script modules |
| `src/` | Backend route/model/helper modules |
| `scripts/` | Smoke, syntax, load-order, and verification scripts |
| `docs/reference/` | Architecture/reference materials |
| `docs/archive/` | Historical plans no longer used as active prompts |
| `docs/design/` | UI design prototypes and handoff artifacts |

---

## Documentation Rules

- Keep active operating docs in the project root.
- Keep reserved filenames unchanged: `README.md`, `CURRENT_SPRINT.md`, `DEVELOPMENT_PLAN.md`, `MVP_PRD.md`, `CODEX.md`, `CLAUDE.md`, `GEMINI.md`.
- Use `UPPER_SNAKE_CASE.md` for reference/archive planning documents.
- Use `lower-kebab-case` for design artifact folders and generated/static design files.
- Move historical/reference docs under `docs/`.
- Edit Thai/emoji-heavy markdown with targeted UTF-8-safe patches.
- Every Dev/QA/PM update must include agent attribution in the relevant doc.
- `CURRENT_SPRINT.md` owns the next actionable prompt.
