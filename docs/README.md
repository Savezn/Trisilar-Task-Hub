# Trisilar Task Hub Docs

**Status:** Documentation index
**Owner:** PM
**Updated by:** Codex PM

This folder contains logs, plans, references, archives, and design artifacts. The project root keeps only short active operating docs and reserved agent rule files.

---

## Folder Map

| Folder | Purpose |
|---|---|
| `agents/` | Durable role guides for PM, UX, Dev, QA, Runtime, Integration, AI Integration, and Documentation Workflow owners |
| `reference/` | Architecture analysis and durable technical references |
| `adr/` | Architecture Decision Records and process decisions |
| `archive/` | Historical plans retained for traceability |
| `deployment/` | Deployment and hosted environment setup docs |
| `design/` | UI redesign prototypes, static HTML, and design handoff files |
| `logs/` | QA logs, completed work archive, bug fixes, and PM decisions |
| `plans/` | Active and future multi-session planning documents |
| `testing/` | Test strategy, verification policy, and automated test-suite roadmap |

---

## Naming Standard

| Document type | Format | Example |
|---|---|---|
| Reserved root docs | Keep established filename | `CURRENT_SPRINT.md` |
| Agent rules | Keep established filename | `CODEX.md` |
| Universal AI rules | Keep established filename | `.ai-instructions.md` |
| Roadmap index | Keep established filename | `TODO.md` |
| ADRs | `ADR_0000_SHORT_TITLE.md` | `ADR_0001_PROJECT_CONVENTIONS_AND_AI_WORKFLOW.md` |
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
| `../.ai-instructions.md` | Universal first-read AI/project rules |
| `../CONTRIBUTING.md` | Contribution, branch, worktree, commit, PR, and verification workflow |
| `../TODO.md` | High-level roadmap index |
| `../MVP_PRD.md` | MVP product requirements |
| `../CODEX.md` | Codex agent rules |
| `../CLAUDE.md` | Claude agent rules |
| `../GEMINI.md` | Gemini agent rules |

---

## Document Index

| File | Purpose |
|---|---|
| `reference/ARCHITECTURE.md` | Current technical architecture reference |
| `reference/ORGANIZATION_OPERATING_MODEL.md` | Long-term operating model for Trello, Task Hub, Review Queue, AI intake, runtime governance, and Codex agents |
| `reference/AI_AGENT_GOVERNANCE.md` | AI-originated work rules, role boundaries, Review Queue safety, and attribution |
| `reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` | Parallel Codex branch/worktree ownership and contamination-prevention model |
| `reference/BRANCH_ENVIRONMENT_WORKFLOW.md` | Branch, environment, PR, and verification workflow |
| `reference/FILE_ORGANIZATION.md` | File placement policy for future files |
| `reference/KEY_FILE_MAP.md` | Common grep/read targets for agents |
| `reference/PROJECT_CONTEXT.md` | Stable product context and operating model |
| `deployment/README.md` | Deployment docs index |
| `deployment/DEPLOYMENT_SETUP.md` | V0.2-W1-02 deploy-readiness setup for company access, temporary ngrok demo, and stable Cloudflare Access gate; legacy label W1b |
| `deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` | V0.2-W1-03 dev deployment config, V0.2-W1-05 no-domain ngrok demo handoff, and V0.2-W1-06 Cloudflare Access blockers |
| `testing/TEST_STRATEGY.md` | Verification policy and automated test-suite roadmap |
| `adr/README.md` | ADR index and process |
| `adr/ADR_0001_PROJECT_CONVENTIONS_AND_AI_WORKFLOW.md` | Project conventions and AI workflow decision |
| `adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md` | Paperclip-to-Task-Hub service-auth topology decision |
| `archive/VERSION_0_1_PLAN.md` | Historical V0.1 modularization plan |
| `archive/DEVELOPMENT_HISTORY.md` | Archived roadmap and completed phase tracker |
| `archive/ARCHITECTURE_ANALYSIS_V0_1.md` | Archived V0.1 architecture analysis |
| `design/ui-design-v1-0/` | UI redesign prototype artifact |
| `logs/QA_LOG.md` | QA rounds, completed work archive, bug fixes, deferred items |
| `logs/V0_3_RUX_FINDINGS.md` | V0.3 Product Reliability + UX findings log |
| `logs/DECISION_LOG.md` | PM decisions and phase context |
| `plans/PROJECT_LADDER.md` | Project-wide roadmap ladder and release gates |
| `plans/VERSION_0_2_PLAN.md` | V0.2 branch/workstream plan |
| `plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md` | V0.2 W1 company access, no-domain ngrok demo, stable Cloudflare Access, and no-cost preview phase ladder |
| `plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md` | V0.3 Product Reliability + UX Stabilization phase plan |
| `plans/VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md` | V0.3-RUX-01 issue intake model, route inventory, owner map, and baseline checklist |
| `plans/VERSION_0_3_RUX_02A_TRELLO_CONNECTION_STATE_FAILURE_COPY.md` | V0.3-RUX-02A scoped handoff for Trello connection-state and route failure-copy clarity |
| `plans/VERSION_0_3_RUX_03_REVIEW_QUEUE_AI_TRACE_CLARITY.md` | V0.3-RUX-03 scoped handoff for Review Queue and Paperclip/AI trace clarity |
| `agents/PM.md` | PM / Product Owner role guide |
| `agents/UX_OWNER.md` | UX / Product Experience Owner role guide |
| `agents/DEV_FRONTEND.md` | Frontend Product Dev role guide |
| `agents/DEV_CORE.md` | Core Workflow / Backend Dev role guide |
| `agents/AI_INTEGRATION.md` | AI Integration Owner role guide |
| `agents/RUNTIME_OWNER.md` | Runtime / Access Owner role guide |
| `agents/QA_RELEASE.md` | QA / Release Owner role guide |
| `agents/INTEGRATION_OWNER.md` | Integration Owner role guide |
| `agents/DOCUMENTATION_WORKFLOW_OWNER.md` | Documentation / Agent Workflow Owner role guide |
