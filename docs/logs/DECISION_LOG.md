# Decision Log - Trisilar Task Hub

**Doc Role:** Append-only PM decision log
**Status:** Active log
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM

Use this file for major PM decisions that affect planning, workflow, branch strategy, document structure, or multi-agent coordination.

---

## Decisions

| Date | Decision | Rationale | Updated by |
|---|---|---|---|
| 2026-05-06 | Use Task Hub as command center and Project Boards as execution surfaces | Reduces board-sync overhead while preserving Trello as source of truth | Codex PM |
| 2026-05-07 | Keep Dev -> QA -> PM as project-state workflow, not mandatory agent rotation | User switches agents mainly for rate limits/context limits | Codex PM |
| 2026-05-08 | Close V0.1 after Release Acceptance pass | `check:all`, direct routes, sidebar navigation, back/forward, Phase 7 surfaces, and console check passed | Codex PM |
| 2026-05-08 | Organize non-active docs under `docs/` | Keeps root focused on active docs and agent rules | Codex PM |
| 2026-05-08 | Preserve reserved root filenames and standardize other docs | Agent tooling expects `CODEX.md`, `CLAUDE.md`, `GEMINI.md`, and root operating docs | Codex PM |
| 2026-05-08 | Split logs/plans out of `CURRENT_SPRINT.md` | Reduces agent context cost and keeps current state readable | Codex PM |
| 2026-05-08 | Plan V0.2 as parallel workstreams gated by W0 branch/environment setup | Lets agents work in parallel without colliding on integration/release flow | Codex PM |
| 2026-05-08 | Accept V0.2 W3 Paperclip mock integration at `1d1f638` | QA passed contract/mock verification and confirmed no live Paperclip call or pre-approval Trello/Calendar side effect; local Trello 401 was environment-only | Codex PM |
| 2026-05-08 | Accept V0.2 W2/W3 integration on `dev` at `dde7ab0` | Integration QA passed accepted W2 shell/Today regression, W3 Paperclip contract/mock verification, `check:all`, mobile overflow checks, and console checks; populated visual QA used controlled API responses due local credential sensitivity | Codex PM |

---

## Phase Context (ย่อ)
| Phase | Status |
|---|---|
| P0 Bug Fixes | ✅ Done (2026-05-04) |
| P1 Review Queue Data | ✅ Done (2026-05-04) |
| P2 Review Queue UI | ✅ Done (2026-05-04) |
| P3 Task Diff Engine | ✅ Done (2026-05-04) |
| P4 Google Tasks Planner | ✅ Done (2026-05-05) |
| P5 Today Enhanced | ✅ Done (2026-05-05) |
| P6 Hardening & Polish | ✅ Done (2026-05-05) |
| P7 OKR / Portfolio Layer | ✅ Done (2026-05-08) |
| P8 Post-MVP Enhancements | ✅ Done (2026-05-06) |
| **P9 Maintenance & Iteration** | **⬜ Ongoing** |
| **V0.1 Modularization** | **✅ Done (Release Acceptance passed)** |

---

### V0.1 Modularization Progress
**Priority:** ✅ Done
**Goal:** แยก monolith `server.js` + `app.js` → module files โดยไม่ break functionality

| Phase | Task | Status |
|---|---|---|
| Ph1 | Foundation Scripts & Smoke Test | ✅ Done `5c7ad14` |
| Ph2-1 | Extract config routes | ✅ Done `ac699f1` |
| Ph2-2 | Extract review routes | ✅ Done `bdfbadb` |
| Ph2-3 | Extract calendar routes | ✅ Done `0f14d6f` |
| Ph2-4 | Extract google-tasks routes | ✅ Done `6a6e2ac` |
| Ph2-5 | Extract trello routes | ✅ Done `25a31b7` |
| Ph3-1 | Extract core helpers & models | ✅ Done `e3320d5` |
| Ph3-2 | Extract google helpers | ✅ Done `d06d388` |
| Ph4-1 | Server core hardening | ✅ Done `f6b5ab6` |
| Ph4-2 | Frontend Core Split (api/state/router/utils) | ✅ Done `50ffc72` |
| Ph5-1 | Extract Today page module | ✅ Done `296b48a` |
| Ph5-2 | Extract Review Queue page | ✅ Done `fe450ed` |
| Ph5-3 | Extract All Tasks page | ✅ Done `9c8c7bd` |
| Ph5-4 | Extract Boards/Kanban page | ✅ Done `de9cd79` |
| Ph5-5 | Extract Calendar page | ✅ Done `59e6d31` |
| Ph5-6 | Extract OKR page | ✅ Done `1042113` |
| Ph5-7 | Extract Settings page | Done `94ec023` |
| Ph6-1 | Frontend Error Boundaries & Global Error Handler | Done `8f34ba8`, fix `9219381` |
| Ph6-2 | Frontend module hardening review | Done `e85e384` |
| Ph6-3 | Frontend module load-order and dependency audit | Done `0b00854` |
| Ph6-4 | Frontend verification script consolidation | ✅ Done `903e137` |
| Release Acceptance | V0.1 Release Acceptance Test | ✅ Pass (QA only, 2026-05-08) |

---

---

### Phase 7: OKR / Portfolio Layer
| Task | Status |
|---|---|
| P7-1 | Trello Metadata Ingestion | Done `980b5f0` |
| P7-2 | Portfolio filters | Done `387d43b` |
| P7-3 | OKR Progress View | Done `422b91b` |
| P7-4 | Project Board Convention Validator | Done `b345e65` |
| P7-5 | Weekly Focus View | Done `5be2ea6` |

---

## V0.2 W2 Full UI Redesign Scope Clarification

| Date | Decision | Updated by |
|---|---|---|
| 2026-05-08 | Reclassified accepted `b5f67fb` work as W2a Shell Foundation + Today Redesign only. Full W2 UI Redesign remains open through W2b-W2f and must be accepted phase by phase against `docs/design/ui-design-v1-0/`. | Codex PM |

---

## Enterprise-Grade Hardening Roadmap Boundary

| Date | Decision | Updated by |
|---|---|---|
| 2026-05-08 | Track automated test-suite expansion, root backend module migration, hosted runtime setup, and historical mojibake repair as hardening backlog items. These are important quality upgrades, but they do not block the current W2b Review Queue redesign or W1 runtime setup unless a task specifically depends on them. | Codex PM |
