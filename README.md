# Trisilar Task Hub

**Status:** V0.1 release acceptance passed
**Primary docs:** `.ai-instructions.md`, `CURRENT_SPRINT.md`, `TODO.md`, `docs/plans/VERSION_0_2_PLAN.md`, `docs/reference/PROJECT_CONTEXT.md`, `docs/reference/ARCHITECTURE.md`
**Agent rules:** `.ai-instructions.md`, `CODEX.md`, `CLAUDE.md`, `GEMINI.md`
**Updated by:** Codex PM

Trisilar Task Hub is a local-first team command center for Trello, Google Calendar, Google Tasks, Review Queue, OKR/Portfolio views, and weekly focus planning.

---

## Quick Start

```powershell
npm.cmd install
node server.js
```

In a separate terminal, run:

```powershell
npm.cmd run check:all
```

Open the app at `http://localhost:3000`.

---

## Documentation Map

| File | Purpose |
|---|---|
| `CURRENT_SPRINT.md` | Short active-state file for current work and next action |
| `.ai-instructions.md` | Universal first-read rules for every AI agent |
| `CONTRIBUTING.md` | Branch, worktree, commit, PR, and verification workflow |
| `TODO.md` | High-level project roadmap index |
| `docs/archive/DEVELOPMENT_HISTORY.md` | Archived roadmap and historical progress tracker |
| `MVP_PRD.md` | Product requirements and UX/product scope |
| `CODEX.md` | Codex-specific project workflow rules |
| `CLAUDE.md` | Claude-specific project workflow rules |
| `GEMINI.md` | Gemini-specific project workflow rules |
| `docs/README.md` | Reference, archive, and design artifact index |
| `docs/plans/VERSION_0_2_PLAN.md` | Main V0.2 branch/workstream plan |
| `docs/reference/PROJECT_CONTEXT.md` | Stable product and operating context |
| `docs/reference/ARCHITECTURE.md` | Current technical architecture reference |
| `docs/deployment/README.md` | Deployment documentation index |
| `docs/deployment/DEPLOYMENT_SETUP.md` | W1b deploy-readiness setup for Render/Railway, access gate, env vars, and persistent state |
| `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` | W1c hosted dev environment setup handoff for Render default, Railway alternate, Cloudflare Access, and blockers |
| `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md` | Branch, environment, PR, and verification workflow |
| `docs/testing/TEST_STRATEGY.md` | Automated/manual verification policy and test-suite roadmap |
| `docs/adr/README.md` | Architecture Decision Records index and process |
| `docs/logs/QA_LOG.md` | QA rounds, completed work archive, bug fixes, deferred items |
| `docs/logs/DECISION_LOG.md` | PM decisions and phase context |

---

## Workspace Structure

| Path | Purpose |
|---|---|
| `public/` | Frontend app, styles, plain script modules |
| `src/` | Backend route/model/helper modules |
| `scripts/` | Smoke, syntax, load-order, and verification scripts |
| `scripts/legacy/` | Archived utilities not used by the web app runtime |
| `docs/adr/` | Architecture Decision Records |
| `docs/deployment/` | Deployment and hosted environment docs |
| `docs/plans/` | Active and future planning documents |
| `docs/testing/` | Test strategy and verification policy |
| `docs/logs/` | Append-only QA and decision logs |
| `docs/reference/` | Architecture/reference materials |
| `docs/archive/` | Historical plans no longer used as active prompts |
| `docs/design/` | UI design prototypes and handoff artifacts |
| `render.yaml` | Render dev service blueprint for W1c |
| `railway.toml` | Railway alternate dev service config for W1c |

---

## Documentation Rules

- Keep active operating docs in the project root.
- Keep reserved filenames unchanged: `README.md`, `.ai-instructions.md`, `CONTRIBUTING.md`, `TODO.md`, `CURRENT_SPRINT.md`, `MVP_PRD.md`, `CODEX.md`, `CLAUDE.md`, `GEMINI.md`.
- Use `UPPER_SNAKE_CASE.md` for reference/archive planning documents.
- Use `ADR_0000_SHORT_TITLE.md` for Architecture Decision Records.
- Use `lower-kebab-case` for design artifact folders and generated/static design files.
- Move historical/reference docs under `docs/`.
- Keep `CURRENT_SPRINT.md` short: current snapshot, active tasks, routing, next action only.
- Keep `.ai-instructions.md` as the first-read AI rule file and update agent-specific files only for agent-specific differences.
- Keep `TODO.md` as a roadmap index; do not duplicate QA logs or full version plans there.
- Put QA history, completed work, bug fixes, and deferred items in `docs/logs/QA_LOG.md`.
- Put major PM decisions and phase context in `docs/logs/DECISION_LOG.md`.
- Put architecture/process decisions in `docs/adr/`.
- Put verification policy in `docs/testing/TEST_STRATEGY.md`.
- Put multi-session plans in `docs/plans/`.
- Edit Thai/emoji-heavy markdown with targeted UTF-8-safe patches.
- Every Dev/QA/PM update must include agent attribution in the relevant doc.
- `CURRENT_SPRINT.md` owns the next actionable prompt.
