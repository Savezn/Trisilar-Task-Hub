# Decision Log - Trisilar Task Hub

**Doc Role:** Append-only PM decision log
**Status:** Active log
**Last Updated:** 2026-05-12 - **Updated by:** Codex PM

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
| 2026-05-08 | Use Cloudflare Tunnel + Cloudflare Access as W1 no-cost teammate preview path | The current team is two users, does not want paid deploy cost yet, and needs a cleaner future path for Paperclip agent/service-token access than ngrok; Render remains paid hosted default and Railway remains paid hosted alternate when always-on runtime is justified | Codex PM |
| 2026-05-08 | Use ngrok + temporary Basic Auth as the W1 no-domain demo path until a Trisilar domain/subdomain exists | No domain/subdomain is currently available for Cloudflare named tunnel + Access. `trycloudflare` was technically viable but random URLs are poor for repeat teammate/Paperclip handoff. ngrok is available locally, supports short demos now, and can later use a reserved/static domain for repeat Paperclip testing. This does not replace the stable Cloudflare Access release gate. | Codex PM |
| 2026-05-09 | Accept `V0.2-W1-05` random ngrok URL as manual teammate demo path only | QA verified Basic Auth, `/healthz`, app load, hosted callback, local-only `APP_DATA_DIR`, and clean git status. PM accepts this for short manual teammate demo only; Paperclip automation and stable service integration remain deferred until a stable hostname exists. | Codex PM |
| 2026-05-12 | Rebaseline W1 next runtime path to DigitalOcean hosted dev/demo behind Cloudflare | A Cloudflare-managed domain is available, random ngrok remains demo-only, and localhost runtime shuts down with the local machine. A DigitalOcean Droplet gives a low-cost always-on Node/Express host with persistent `APP_DATA_DIR`, while Cloudflare remains the DNS/security/access front door. Render remains a managed paid option and Railway remains the managed alternate if PM reselects them. | Codex PM |
| 2026-05-12 | Record Paperclip localhost on Noffy's machine as a W3 live-connector runtime blocker | Paperclip currently runs on localhost on another teammate's machine. This was recorded as the immediate blocker, then superseded by the PM decision to deploy Paperclip to DigitalOcean for the W3 live target. | Codex PM |
| 2026-05-12 | Deploy Paperclip to DigitalOcean for the W3 live target | PM selected DigitalOcean deployment for Paperclip instead of relying on Noffy's localhost or a teammate-machine tunnel. W3 live connector work remains blocked until hosted Task Hub, hosted Paperclip, Cloudflare routes, and service-auth are verified. | Codex PM |
| 2026-05-12 | Mark Paperclip hosted and narrow remaining W1 runtime work to Task Hub | PM confirmed the Paperclip owner has deployed Paperclip to DigitalOcean and connected it through Cloudflare. W1 no longer needs to plan Paperclip migration; the next runtime work is Task Hub on DigitalOcean behind Cloudflare, then W1.6 service-auth verification between hosted Paperclip and hosted Task Hub. | Codex PM |
| 2026-05-08 | Create project-wide ladder in `docs/plans/PROJECT_LADDER.md` | Separates release sequencing from `CURRENT_SPRINT.md` and keeps `TODO.md` as an index while clarifying V0.2 cannot release until access, full UI, and Paperclip gates are accepted | Codex PM |
| 2026-05-08 | Lead W2 phase planning with canonical IDs `V0.2-W2-01`-`V0.2-W2-06`; keep `W2a`-`W2f` as aliases only | Aligns W2 phase structure with the latest dev naming policy so Dev, QA, PM prompts, commits, and PR notes use stable canonical task IDs | Codex PM |
| 2026-05-08 | Accept `V0.2-W2-02` Review Queue redesign at `d33d8f7` | QA Recheck passed drawer click handling regression, Review create/edit/approve/reject/bulk workflows, processed read-only rows, mobile overflow 0, Today controlled smoke, and W3 Paperclip contract/mock regression; local Trello 401 was credential/env noise | Codex PM |
| 2026-05-09 | Accept `V0.2-W2-03` Tasks Inbox + Cross-board Rows at `ea807fd` | QA Recheck passed Tasks populated/filtered/empty states, search/filter/label/owner/group/export/open-edit/inline rename/mark done workflows, mobile overflow 0 and unclipped rows, mobile nav, Today smoke, Review drawer smoke, W3 Paperclip contract/mock regression, and console checks | Codex PM |

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
| 2026-05-08 | Reclassified accepted `b5f67fb` work as `V0.2-W2-01` (`W2a`) Shell Foundation + Today Redesign only. Full W2 UI Redesign remains open through `V0.2-W2-02`-`V0.2-W2-06` (`W2b`-`W2f`) and must be accepted phase by phase against `docs/design/ui-design-v1-0/`. | Codex PM |
| 2026-05-08 | Accepted `V0.2-W2-02` (`W2b`) Review Queue + Shared Task Drawer at `d33d8f7`. Full W2 UI Redesign remains open through `V0.2-W2-03`-`V0.2-W2-06` (`W2c`-`W2f`). | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-03` (`W2c`) Tasks Inbox + Cross-board Rows at `ea807fd`. Full W2 UI Redesign remains open through `V0.2-W2-04`-`V0.2-W2-06` (`W2d`-`W2f`). | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-04` (`W2d`) Boards Monitor + Team Board Views at `47ebd84` and accepted integration on `dev@0b77aed`. Full W2 UI Redesign remains open through `V0.2-W2-05`-`V0.2-W2-06` (`W2e`-`W2f`). | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-05` (`W2e`) Calendar + Planner at `4638df7` and accepted integration on `dev@3fca059`. Full W2 UI Redesign remains open until final phase `V0.2-W2-06` (`W2f`) Settings + OKR + Weekly Focus Polish passes QA/PM. | Codex PM |

---

## Enterprise-Grade Hardening Roadmap Boundary

| Date | Decision | Updated by |
|---|---|---|
| 2026-05-08 | Track automated test-suite expansion, root backend module migration, hosted runtime setup, and historical mojibake repair as hardening backlog items. These are important quality upgrades, but they do not block the current `V0.2-W2-02` Review Queue redesign or W1 runtime setup unless a task specifically depends on them. | Codex PM |
