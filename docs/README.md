# Trisilar Task Hub Docs

**Status:** Documentation index
**Owner:** PM
**Updated by:** Codex PM

This folder contains logs, plans, references, archives, and design artifacts. The project root keeps only short active operating docs and reserved agent rule files.

---

## Folder Map

| Folder | Purpose |
|---|---|
| `reference/` | Architecture analysis and durable technical references |
| `archive/` | Historical plans retained for traceability |
| `design/` | UI redesign prototypes, static HTML, and design handoff files |
| `logs/` | QA logs, completed work archive, bug fixes, and PM decisions |
| `plans/` | Active and future multi-session planning documents |

---

## Naming Standard

| Document type | Format | Example |
|---|---|---|
| Reserved root docs | Keep established filename | `CURRENT_SPRINT.md` |
| Agent rules | Keep established filename | `CODEX.md` |
| Reference/archive markdown | `UPPER_SNAKE_CASE.md` | `VERSION_0_2_PLAN.md` |
| Design folders/files | `lower-kebab-case` | `ui-design-v1-0/` |
| Folder indexes | `README.md` | `docs/README.md` |

Do not rename reserved root docs unless all agent instructions and handoff prompts are updated in the same change.

---

## Plan Document Format

Version/workstream plans should use the same section order so agents can scan them consistently:

1. Metadata block: doc role, status, version, planning stage, owner, created date, updated date, related docs, theme.
2. `How to Use This Document`
3. `Planning Summary`
4. `Scope / Non-Goals`
5. `Dependency / Workflow Model`
6. `Workstream / Phase Map`
7. `Workstream / Phase Details`
8. `Delivery Rules`
9. `Session Estimate`
10. `Next Recommended Session`
11. `Change Attribution`

Keep active prompts in `../CURRENT_SPRINT.md`. Keep historical QA/completion rows in `logs/QA_LOG.md`.

---

## Active Root Documents

| File | Purpose |
|---|---|
| `../CURRENT_SPRINT.md` | Current snapshot, active tasks, routing, next action |
| `../DEVELOPMENT_PLAN.md` | Roadmap and completed phase tracker |
| `../MVP_PRD.md` | MVP product requirements |
| `../CODEX.md` | Codex agent rules |
| `../CLAUDE.md` | Claude agent rules |
| `../GEMINI.md` | Gemini agent rules |

---

## Document Index

| File | Purpose |
|---|---|
| `reference/ARCHITECTURE_ANALYSIS.md` | Architecture analysis and refactor rationale |
| `reference/BRANCH_ENVIRONMENT_WORKFLOW.md` | Branch, environment, PR, and verification workflow |
| `reference/KEY_FILE_MAP.md` | Common grep/read targets for agents |
| `archive/VERSION_0_1_PLAN.md` | Historical V0.1 modularization plan |
| `design/ui-design-v1-0/` | UI redesign prototype artifact |
| `logs/QA_LOG.md` | QA rounds, completed work archive, bug fixes, deferred items |
| `logs/DECISION_LOG.md` | PM decisions and phase context |
| `plans/VERSION_0_2_PLAN.md` | V0.2 branch/workstream plan |
