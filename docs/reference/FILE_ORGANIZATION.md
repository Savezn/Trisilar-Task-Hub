# File Organization - Trisilar Task Hub

**Doc Role:** File placement policy for future files
**Status:** Active
**Owner:** PM / Dev
**Last Updated:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect

Use this document before adding, moving, or renaming project files. The goal is to keep the repo navigable for humans and AI agents.

---

## Root Directory

Keep the root directory small. Root files should be entrypoints, package/config files, or active operating docs.

| Root file type | Allowed examples | Rule |
|---|---|---|
| App/package entrypoints | `server.js`, `package.json`, `package-lock.json` | Keep here unless an ADR approves a runtime restructure. |
| Active operating docs | `README.md`, `.ai-instructions.md`, `CONTRIBUTING.md`, `TODO.md`, `CURRENT_SPRINT.md`, `MVP_PRD.md`, `CODEX.md`, `CLAUDE.md`, `GEMINI.md` | Keep short and link to deeper docs. |
| Runtime config baseline | `.env.example`, `bu-config.json` | Do not commit secrets. Keep generated local data ignored. |
| Deployment config | `render.yaml`, `railway.toml` | Keep provider root config here unless provider docs require otherwise. |
| Legacy or helper scripts | none | Put under `scripts/` or `scripts/legacy/`. |

Do not add new long-form planning, QA, architecture, or deployment docs to root.

---

## Production Code

| Path | Use for | Do not put here |
|---|---|---|
| `server.js` | Current Express app entrypoint | New large helper logic; prefer `src/`. |
| `trello.js`, `review-store.js`, `task-diff.js` | Current root backend modules retained for compatibility | New backend domains unless they extend these modules directly. |
| `src/routes/` | Express route modules | Frontend code or docs. |
| `src/models/` | Data normalization/model helpers | Route wiring. |
| `src/integrations/` | External integration boundaries and contracts | UI-only code. |
| `src/utils/` | Backend utility helpers | Page-specific rendering. |
| `public/` | Production static frontend only | Design prototypes, screenshots, docs, or throwaway assets. |
| `public/js/pages/` | Production page modules | Shared backend logic. |

If a root backend module grows significantly, create a focused Dev task and ADR before moving it into `src/`.

---

## Scripts

| Path | Use for |
|---|---|
| `scripts/` | Verification scripts, local dev helpers, one-command utilities used by the project |
| `scripts/legacy/` | Archived utilities that are not part of the web app runtime |

Rules:

- New smoke/verification scripts go in `scripts/`.
- Old utilities that are kept only for reference go in `scripts/legacy/<utility-name>/` with a `README.md`.
- Do not place runnable helper scripts in root unless they are required by package manager or platform tooling.

---

## Documentation

| Path | Use for |
|---|---|
| `docs/README.md` | Documentation index |
| `docs/agents/` | Durable role guides for PM, UX, Dev, QA, Runtime, Integration, AI Integration, and Documentation Workflow owners |
| `docs/agent-skills/` | Repo-contained role `SKILL.md` entrypoints used by Codex, Claude, Gemini, and future agents |
| `docs/adr/` | Architecture Decision Records |
| `docs/archive/` | Historical docs no longer used as active prompts |
| `docs/deployment/` | Deployment and hosted environment setup docs |
| `docs/design/` | Design prototypes, screenshots, visual handoff assets |
| `docs/logs/` | QA logs, decision logs, completed-work history |
| `docs/operations/` | Team-facing operator, onboarding, and routine-use guides |
| `docs/plans/` | Active version/workstream plans and durable prompts |
| `docs/reference/` | Durable product, architecture, workflow, and file maps |
| `docs/testing/` | Test strategy and verification policy |

Rules:

- Active sprint state belongs in `CURRENT_SPRINT.md`.
- Roadmap index belongs in `TODO.md`.
- Historical roadmap detail belongs in `docs/archive/DEVELOPMENT_HISTORY.md`.
- Current architecture belongs in `docs/reference/ARCHITECTURE.md`.
- Older analysis belongs in `docs/archive/`.
- Deployment setup belongs in `docs/deployment/`.
- New design artifacts must live under `docs/design/<artifact-name>/`.
- New durable role guides must live under `docs/agents/`.
- New repo-contained role skills must live under `docs/agent-skills/<role>/SKILL.md`.
- New team-facing onboarding or routine-use guides must live under `docs/operations/`.
- New operating or workflow references must live under `docs/reference/`.

---

## Runtime Data and Secrets

| File type | Placement |
|---|---|
| Secret values | Local `.env` or platform dashboard only |
| Secret placeholders | `.env.example` |
| Local runtime JSON | `APP_DATA_DIR` when configured; otherwise root fallback for current runtime |
| Ignored generated files | `review-sessions.json`, `card-events.json`, `.data/` |
| Tracked baseline config | `bu-config.json` |

Do not commit `.env`, API tokens, OAuth secrets, or production data exports.

---

## Naming Rules

| File type | Format | Example |
|---|---|---|
| Active version plans | `VERSION_0_2_PLAN.md` | `VERSION_0_2_PLAN.md` |
| Workstream plans | `VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md` | `VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md` |
| Agent role docs | `UPPER_SNAKE_CASE.md` | `QA_RELEASE.md` |
| Agent role skill folders | `lower-kebab-case/SKILL.md` | `qa-release/SKILL.md` |
| ADRs | `ADR_0001_SHORT_TITLE.md` | `ADR_0001_PROJECT_CONVENTIONS_AND_AI_WORKFLOW.md` |
| Logs | `UPPER_SNAKE_CASE.md` | `QA_LOG.md` |
| Team/operator guides | `UPPER_SNAKE_CASE.md` | `TEAM_ONBOARDING_GUIDE.md` |
| Design artifact folders | `lower-kebab-case` | `ui-design-v1-0/` |
| Legacy utilities | `lower-kebab-case` | `trello-gemini-cli/` |
| Active V0.2 task IDs | `V0.2-W<workstream>-<NN>` | `V0.2-W2-02` |

Use descriptive names. Avoid generic names such as `notes.md`, `new.md`, `test2.js`, or `final-final.md`.

## Task and Phase ID Rules

Active task IDs must use the canonical version/workstream/sequence format:

```text
V0.2-W1-05
V0.2-W2-02
V0.2-W3-01
```

Rules:

- Use two digits for the sequence number so sorting stays stable.
- Keep old labels such as `W1.4`, `W2b`, or `W3 sequence 1` as aliases only.
- Do not introduce new active `P0`, `P1`, `P7`, or `P8` task IDs for V0.2 work. Use `Priority: P0/P1/P2` for priority instead.
- Historical archived plans and QA logs keep their original IDs.
- New workstream plan sections should show both fields when aliases are useful: `Canonical ID` and `Alias`.

---

## Checklist for New Files

Before adding a file:

1. Check whether an existing folder already owns that type of artifact.
2. If it is documentation, add or update an index link in `docs/README.md` or the relevant folder `README.md`.
3. If it changes architecture/process, add or update an ADR.
4. If it is generated/runtime data, keep it ignored unless PM explicitly approves tracking it.
5. If it is a script, put it in `scripts/` and document when to run it.
6. If it is a design artifact, keep it under `docs/design/`.
7. If it is a durable role guide, place it in `docs/agents/` and link it from `docs/README.md`.
8. If it is a repo-contained role skill, place it under `docs/agent-skills/<role>/SKILL.md`, link it from `docs/README.md`, and update `.ai-instructions.md` or agent rules when the load order changes.
9. If it is a team-facing onboarding or routine-use guide, place it under `docs/operations/` and link it from `docs/README.md`.
10. If no existing category fits, ask PM before creating a new top-level folder.
