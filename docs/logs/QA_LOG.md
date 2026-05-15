# QA Log - Trisilar Task Hub

**Doc Role:** Append-only QA and completion history
**Status:** Active log
**Last Updated:** 2026-05-15 - **Updated by:** Codex PM / Dev / QA

This file preserves historical QA rounds, completed sprint work, bug fixes, and deferred items moved from `CURRENT_SPRINT.md` to keep the active sprint file short.

---

## Completed This Sprint
*(PM check ✅ เมื่อ QA pass แล้ว)*

| Task | Status | Commit |
|---|---|---|
| V0.3-RUX-02A - Trello Connection State + Failure Copy | QA Pass / PM Accepted | `516b33e` |
| V0.3-RUX-03 - Review Queue + AI Trace Clarity | QA Pass / PM Accepted | `b2425a4` |
| V0.3-RUX-04 - Today + Tasks Decision Flow | QA Pass / PM Accepted | `d72f979` |
| V0.3-RUX-05 - Browser Regression + Responsive QA Gate | QA Pass / PM Accepted | `0af9417` |
| V0.3-RUX-06 - Release Checklist for dev -> main | QA Pass / PM Accepted | `df29307`, `5a90cc7` |
| V0.3 RUX Integrated Dev/Demo Closeout | Runtime QA Pass / PM Accepted complete | `origin/dev@02fe7cf` |
| V0.3 RUX Main Release Candidate | Release QA Pass / PM Accepted | PR #20 / `5eb23ef` |
| V0.3 Post-Sync Release / Integration QA + Branch Workflow Docs | QA Pass / PM Accepted docs update | `codex/v03-branch-workflow-release-qa` |
| V0.4-PROD-01 - Paperclip Production Repo Readiness | Integrated to `dev@7e069b5` / production deploy pending | `7e069b5` |
| B10 — Tasks label group scroll | ✅ QA Pass | `ac48125` |
| B11 — Pending Review badge ซ้ำ | ✅ QA Pass | `8c73b7d` |
| B12 — OKR page clip (overview + detail) | ✅ QA Pass | `ac48125`, `f5b3773` |
| B13 — Google Tasks "Connected" label | ✅ QA Pass | `f5b3773` |
| B14 — Trello API cache (60s / 5min) | ✅ QA Pass | `5ab0f76` |
| B15 — move card ไม่ invalidate cache | ✅ QA Pass | `f5b3773` |
| B16 — topbarRefresh bypass server TTL | ✅ QA Pass | `c6a09fd` |
| B17 — approve review task invalidate cache | ✅ QA Pass | `c6a09fd` |
| P9-4 — Boards Monitor Label Filter | ✅ QA Pass | `7926b80` |
| P9-5 — Tasks View: Group by Type (OKR / Project) | ✅ QA Pass | `b328c8f` |
| B19 — Cold start Trello rate limit (batch fetch) | ✅ QA Pass | `5b35bc2`, `632fab4` |
| B20 — Due date UTC+7 + dd/mm/yyyy format | ✅ QA Pass | `d8114bd` |
| B21 — All Tasks sorting logic wired to render | ✅ QA Pass | `e79ff3b` |
| P10-1 — Boards Monitor: Dynamic Team Grouping (Label-based) | ✅ QA Pass | `2a4c426` |
| P10-2 — Team Monitor: Unified Board View (Kanban) | ✅ QA Pass | `4625180`, `314d176` |
| B22 — Team Monitor Board view: dynamic columns | ✅ QA Pass | `5384ab8` |
| V0.1-Ph1 — Foundation Scripts & Smoke Test | ✅ QA Pass | `5c7ad14` |
| V0.1-Ph2 Ph2-1 — Extract config routes | ✅ QA Pass | `ac699f1` |
| V0.1-Ph2 Ph2-2 — Extract review routes | ✅ QA Pass | `bdfbadb` |
| V0.1-Ph2 Ph2-3 — Extract calendar routes | ✅ QA Pass | `0f14d6f` |
| V0.1-Ph2 Ph2-4 — Extract google-tasks routes | ✅ QA Pass | `6a6e2ac` |
| V0.1-Ph2 Ph2-5 — Extract trello routes | ✅ QA Pass | `25a31b7` |
| V0.1-Ph3 Ph3-1 — Extract core helpers and models | ✅ QA Pass | `e3320d5` |
| V0.1-Ph3 Ph3-2 — Extract google helpers | ✅ QA Pass | `d06d388` |
| V0.1-Ph4 Ph4-1 — Server core hardening | ✅ QA Pass | `f6b5ab6` |
| V0.1-Ph4 Ph4-2 — Frontend Core Split (api/state/router/utils) | ✅ QA Pass | `50ffc72` |
| V0.1-Ph5 Ph5-1 — Extract Today page module | ✅ QA Pass | `296b48a` |
| V0.1-Ph5 Ph5-2 — Extract Review Queue page module | ✅ QA Pass | `fe450ed` |
| V0.1-Ph5 Ph5-3 — Extract All Tasks page module | ✅ QA Pass | `9c8c7bd` |
| V0.1-Ph5 Ph5-4 - Extract Boards/Kanban page module | ✅ QA Pass | `de9cd79` |
| V0.1-Ph5 Ph5-5 - Extract Calendar page module | ✅ QA Pass | `59e6d31` |
| V0.1-Ph5 Ph5-6 — Extract OKR page module | ✅ QA Pass | `1042113` |
| V0.1-Ph5 Ph5-7 - Extract Settings page module | QA Pass | `94ec023` |
| V0.1-Ph6 Ph6-1 - Frontend Error Boundaries & Global Error Handler | QA Recheck Pass | `8f34ba8`, `9219381` |
| V0.1-Ph6 Ph6-2 - Frontend module hardening review | QA Pass | `e85e384` |
| V0.1-Ph6 Ph6-3 - Frontend module load-order and dependency audit | QA Pass | `0b00854` |
| Router-1 - URL path sync for page navigation | QA Pass | `124c24b` |
| P7-1 - Trello Metadata Ingestion | QA Pass | `980b5f0` |
| P7-2 - Portfolio filters | QA Pass | `387d43b` |
| P7-3 - OKR Progress View | QA Pass | `422b91b` |
| P7-4 - Project Board Convention Validator | QA Pass | `b345e65` |
| P7-5 - Weekly Focus View | QA Pass | `5be2ea6` |
| P9-6 - Trello-backed preview regression | QA Recheck Pass | `e1b4801` |
| V0.1 Release Acceptance Test | QA Pass | QA only |
| V0.2 W3 - Paperclip Mock Integration | QA Pass / PM Accepted | `1d1f638` |
| V0.2 Integration - Accepted W2/W3 on dev | QA Pass / PM Accepted | `dde7ab0` |
| V0.2-W2-02 - Review Queue Redesign + Shared Task Drawer Foundation | QA Recheck Pass / PM Accepted | `d33d8f7` |
| V0.2-W1-05 - Random ngrok URL Manual Demo Path | QA Pass / PM Accepted demo-only | Runtime-only |
| V0.2-W2-03 - Tasks Inbox + Cross-board Rows | QA Recheck Pass / PM Accepted | `ea807fd` |
| V0.2-W2-04 - Boards Monitor + Team Board Views Integration | Integration QA Pass / PM Accepted | `dev@0b77aed` |
| V0.2-W2-05 - Calendar + Planner Integration | Integration QA Pass / PM Accepted | `dev@3fca059` |
| V0.2-W2-06 - Settings + OKR + Weekly Focus Polish | Integration QA Pass / PM Accepted | `origin/dev@523c948` |
| V0.2-W3-03 - Limited Paperclip Live Enablement Window | Runtime QA Pass / gate closed | `dev@a89c26a` |
| V0.2-W3-03 - True External Paperclip Sender Window | Runtime QA Pass / gate closed | `dev@a89c26a` |
| V0.2-W3-03 - Standing Dev/Demo Observation Window | Runtime QA Pass / gate open for named dev/demo window | `dev@a89c26a` |
| V0.2-W3-03 - Standing Dev/Demo Daily Monitor 2026-05-14 | Runtime QA Pass / no stop condition | `dev@a89c26a` |
| V0.2-W3-03 - Standing Dev/Demo Daily Monitor Follow-up 2026-05-14 | Runtime QA Pass / no stop condition | `dev@a89c26a` |
| V0.2-W3-03 - Standing Dev/Demo Read-only Monitor 2026-05-14 | Runtime QA Pass / no stop condition | `dev@a89c26a` |
| V0.2-W3-03 - Standing Dev/Demo Read-only Monitor Follow-up 2026-05-14 | Runtime QA Pass / no stop condition | `dev@a89c26a` |
| V0.2-W3-03 - Standing Dev/Demo Read-only Monitor Second Follow-up 2026-05-14 | Runtime QA Pass / no stop condition | `dev@a89c26a` |
| V0.2-W3-04 - Paperclip Review Queue Cleanup | QA Pass / PM Accepted | `1af8273` |
| V0.2-W3-04a - Paperclip Cleanup Audit Retention | QA Pass / PM Accepted / merged to dev | `dev@7ea4650` |
| V0.2-W3-05 - Paperclip Live Operations Hardening | QA Pass / PM Accepted / merged and deployed | `dev@2c302dc`, `ff20e48` |
| V0.2 Release / Integration Cleanup QA | QA Pass / branch cleanup complete | `origin/dev@8027324` |

---

## QA Log
*(PM บันทึกผล QA แต่ละรอบ)*

| Date | Round | Result | Notes |
|---|---|---|---|
| 2026-05-15 | V0.4 Paperclip production readiness integration QA | Pass | Fast-forwarded `codex/v04-paperclip-prod-integration` into `dev@7e069b5` after rerunning `npm ci`, `check:all` with local server, `verify:paperclip-contract`, `verify:paperclip-mock`, `verify:paperclip-docs`, `verify:paperclip-connection`, `verify:paperclip-operations`, `verify:paperclip-cleanup`, `verify:paperclip-webhook`, `verify:paperclip-production-readiness`, and `git diff --check`. No production deploy, Cloudflare production route change, runtime flag change, production live canary, secret exposure, or Trello/Calendar/Google Tasks side effect was performed. |
| 2026-05-15 | V0.4 Paperclip production repo readiness QA | Pass | Branch `codex/v04-paperclip-prod-integration` adds production runtime profile/live mode/status warnings, non-secret env examples, V0.4 plan/tracker docs, and `verify:paperclip-production-readiness`. Verification passed: `npm ci`, `check:all` with isolated local server, `verify:paperclip-contract`, `verify:paperclip-mock`, `verify:paperclip-docs`, `verify:paperclip-connection`, `verify:paperclip-operations`, `verify:paperclip-cleanup`, `verify:paperclip-webhook`, `verify:paperclip-production-readiness`, `git diff --check`, and conflict-marker scan. No production deploy, Cloudflare production route change, runtime flag change, production live canary, secret exposure, or Trello/Calendar/Google Tasks side effect was performed. |
| 2026-05-15 | V0.3 post-main-sync release/integration QA and branch workflow docs | Pass | Clean worktree `codex/v03-branch-workflow-release-qa` from `origin/dev@631d3b2` after `origin/dev` and `origin/main` were synced. Updated branch/worktree docs to document `codex/*` and `claude/*` topic branches, backup refs, worktree naming, and cleanup rules. Verification passed: `npm ci`, `git diff --check`, conflict-marker scan, `check:all` with isolated local server, `verify:rux-trello`, `verify:rux-ai-trace`, `verify:rux-decision-flow`, `verify:rux-browser-regression`, `verify:paperclip-contract`, `verify:paperclip-mock`, `verify:paperclip-docs`, `verify:paperclip-operations`, `verify:paperclip-cleanup`, `verify:paperclip-connection`, and `verify:paperclip-webhook`. No production deploy, runtime flag change, live canary, secret exposure, or Trello/Calendar/Google Tasks side effect was performed. |
| 2026-05-14 | V0.2 release/integration cleanup QA | Pass | Clean QA worktree `codex/v02-release-integration-qa` from `origin/dev@8027324`; `npm ci`, `check:all` with isolated server, Paperclip contract/mock/webhook/cleanup/docs/operations/connection checks, RUX browser regression, AI trace clarity, Today/Tasks decision flow, and Trello connection UX checks passed. Stale W1/W2/W3 worktree metadata, folders, local branches, and remote workstream branches were removed after verification. |
| 2026-05-06 | R1 | ✅ Pass | B10–B15 pass ทุกข้อ |
| 2026-05-06 | R2 | ✅ Pass | B16, B17 pass; B18 found & fixed ใน P9-4 session |
| 2026-05-06 | R3 | ✅ Pass | P9-4 (Boards Monitor Label Filter) pass ทุกข้อ |
| 2026-05-06 | R4 | ✅ Pass | P9-5 (Tasks Group by Type) pass ทุก 6 AC |
| 2026-05-06 | R5 | ✅ Pass | Phase 10 (B19/B20/B21/P10-1/P10-2) pass — B22 found (P10-2 hardcoded columns) |
| 2026-05-06 | R6 | ✅ Pass | B22 (Team Monitor dynamic columns) pass ทุก 3 AC |
| 2026-05-06 | R7 | ✅ Pass | V0.1-Ph1 (Foundation Scripts & Smoke Test) pass ทุก 3 AC |
| 2026-05-06 | R8 | ✅ Pass | V0.1-Ph2 Ph2-1 (config routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R9 | ✅ Pass | V0.1-Ph2 Ph2-2 (review routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R10 | ✅ Pass | V0.1-Ph2 Ph2-3 (calendar routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R11 | ✅ Pass | V0.1-Ph2 Ph2-4 (google-tasks routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R12 | ✅ Pass | V0.1-Ph2 Ph2-5 (trello routes extraction) pass ทุก 3 AC |
| 2026-05-06 | R13 | ✅ Pass | V0.1-Ph3 Ph3-1 (core helpers extraction) pass ทุก 3 AC |
| 2026-05-06 | R14 | ✅ Pass | V0.1-Ph3 Ph3-2 (google helpers extraction) pass ทุก 3 AC |
| 2026-05-06 | R15 | ✅ Pass | V0.1-Ph4 Ph4-1 (server hardening) pass — Bug B23 found (autoDelete missing) |
| 2026-05-06 | R16 | ✅ Pass | B23 (missing autoDeleteFromGCal import in server.js) pass ทุก 2 AC |
| 2026-05-07 | R17 | ✅ Pass | V0.1-Ph4 Ph4-2 (Frontend Core Split) pass ทุก 4 AC |
| 2026-05-07 | R18 | ✅ Pass | V0.1-Ph5 Ph5-1 (Extract Today page module) pass ทุก 5 AC |
| 2026-05-07 | R19 | ✅ Pass | V0.1-Ph5 Ph5-2 (Extract Review Queue page module) pass ทุก 5 AC |
| 2026-05-07 | R20 | ✅ Pass | V0.1-Ph5 Ph5-3 (Extract All Tasks page module) pass ทุก 5 AC |
| 2026-05-07 | R21 | ✅ Pass | V0.1-Ph5 Ph5-4 (Boards/Kanban page module extraction) pass; Reviewed by Codex QA |
| 2026-05-07 | R22 | ✅ Pass | V0.1-Ph5 Ph5-5 Calendar page module extraction pass; Reviewed by Codex QA |
| 2026-05-07 | R23 | ✅ Pass | V0.1-Ph5 Ph5-6 (Extract OKR page module) pass ทุก 7 AC; Reviewed by Gemini QA |
| 2026-05-07 | R24 | Pass | V0.1-Ph6 Ph6-1 frontend error hardening QA Recheck pass after Dev Fix `9219381`; smoke runner exits 0; Reviewed by Codex QA |
| 2026-05-07 | R25 | Pass | V0.1-Ph6 Ph6-2 frontend module hardening review pass; Calendar render path awaits and renders fallback UI; smoke exits 0; Reviewed by Codex QA |
| 2026-05-07 | R26 | Pass | V0.1-Ph6 Ph6-3 frontend module load-order audit pass; script order contract verified; smoke exits 0; Reviewed by Codex QA |
| 2026-05-07 | R27 | Pass | V0.1-Ph5 Ph5-7 Settings page module extraction pass; browser desktop check limited by in-app mobile viewport/sidebar hidden state; Reviewed by Codex QA |
| 2026-05-07 | R28 | Pass | P7-1 Trello metadata ingestion pass; labels, members, checklistProgress, customFields normalized; check:all passed with temporary server; Reviewed by Codex QA |
| 2026-05-07 | R29 | Pass | P7-2 Portfolio filters pass; OKR overview filters by label/member, toggle clears filters, empty filtered state explicit; check:all passed with temporary server; Reviewed by Codex QA |
| 2026-05-07 | R30 | Pass | P7-3 OKR Progress View pass; overview summary, KR progress metadata, linked project task detail, filters, and empty states verified; check:all passed with temporary server; Reviewed by Codex QA; Updated by Codex PM |
| 2026-05-08 | R31 | Pass | P7-4 Project Board Convention Validator pass; list group aliases, metadata hygiene counts, combined convention badge, board/card open paths verified; check:all passed with temporary server; Reviewed by Codex QA; Updated by Codex PM |
| 2026-05-08 | R32 | Pass | P7-5 Weekly Focus View pass; action lanes, priority/due-soon queue, Review AI path, edit modal path, and check:all verified with temporary server; Reviewed by Codex QA; Updated by Codex PM |
| 2026-05-08 | R33 | Pass | P9-6 Trello-backed preview regression QA Recheck pass; Trello endpoints return 200 in normal runtime, 429 mapping verified, boards/workspaces cache verified, desktop preview renders Today/All/Boards/OKR/Weekly Focus/Settings with 0 console errors; Reviewed by Codex QA; Updated by Codex PM |
| 2026-05-08 | R34 | Pass | V0.1 Release Acceptance Test pass; check:all passed, direct routes/sidebar navigation/back-forward verified, Phase 7 surfaces rendered, console errors 0, no white-screen observed; Reviewed by Codex QA; Updated by Codex PM |
| 2026-05-08 | R35 | Pass | V0.2 W3 Paperclip mock integration pass at `1d1f638`; contract/mock verification, duplicate requestId, invalid payload field errors, audit persistence, no live Paperclip call, no Trello/Calendar side effect before approval, and W2 smoke passed. Local Trello 401 during task-diff was missing `.env` noise, not a W3 regression; Reviewed by Codex QA; Accepted by Codex PM |
| 2026-05-08 | R36 | Pass | V0.2 Integration QA pass on `dev` at `dde7ab0`; accepted W2 shell/Today and W3 Paperclip mock integration remained stable, check:all passed, Paperclip contract/mock verification passed, controlled desktop/mobile Today QA passed with no overflow/clipped rows and console errors 0. Controlled API responses were used for populated visual/workflow QA due local credential sensitivity; Reviewed by Codex QA; Accepted by Codex PM |
| 2026-05-08 | R37 | Pass | Documentation/file consolidation pass at `af822c6`; W2 plan rename, deployment docs consolidation, archive moves, design asset relocation, legacy CLI move, agent docs deduplication, package entrypoint, path references, diff check, legacy syntax checks, and check:all verified; Reviewed by Codex QA; Updated by Codex PM |
| 2026-05-08 | R38 | Pass | `V0.2-W2-02` Review Queue redesign QA Recheck pass at `d33d8f7`; drawer opens, title edit persists, header/footer Close works, backdrop click closes, Escape closes, approve/reject/bulk workflows pass, processed rows are read-only, mobile Review overflow is 0, Today controlled smoke passes, W3 Paperclip contract/mock verification passes. Local Trello `401 invalid key` is credential/env noise, not a W2 regression; Reviewed by Codex QA; Accepted by Codex PM |
| 2026-05-09 | R39 | Pass | `V0.2-W1-05` random ngrok URL manual demo path pass; no-auth `/healthz` through ngrok returned 401, authenticated `/healthz` and app load returned 200, `redirectUri` matched the current ngrok callback, `APP_DATA_DIR` was local-only, git status was clean, and no production deploy/paid host/W2/W3 changes were observed; Reviewed by Codex QA; Accepted by Codex PM as demo-only |
| 2026-05-09 | R40 | Pass | `V0.2-W2-03` Tasks Inbox + Cross-board Rows QA Recheck pass at `ea807fd`; `check:all`, Paperclip contract/mock verification, Tasks populated/search/filter/label/owner/group/export/open-edit/inline rename/mark done workflows, mobile Tasks overflow 0, unclipped rows, mobile nav, Today smoke, Review drawer smoke, and console checks passed. Controlled API responses were used for populated visual/workflow QA to avoid local Trello credential dependency; Reviewed by Codex QA Recheck; Accepted by Codex PM |
| 2026-05-09 | R41 | Pass | `V0.2-W2-04` Boards Monitor + Team Board Views integration QA pass on `dev@0b77aed`; accepted Boards redesign/drawer regression plus Today, Review, Tasks, and W3 Paperclip contract/mock regression remained stable; Reviewed by Codex Integration QA; Accepted by Codex PM |
| 2026-05-09 | R42 | Pass | `V0.2-W2-05` Calendar + Planner integration QA pass on `dev@3fca059`; `check:all`, Paperclip contract/mock verification, Calendar create/edit/delete controlled API paths, Planner Google Tasks add/complete, Trello due list rendering, disconnected states, Today/Review/Tasks/Boards regression smoke, mobile overflow 0 for Calendar, Planner, Today, Review, Tasks, and Boards, and console/page error checks passed. Controlled API responses were used for populated Calendar/Planner workflow QA to avoid local credential sensitivity; Reviewed by Codex Integration QA; Accepted by Codex PM |
| 2026-05-13 | R43 | PM checkpoint / QA pending | `V0.2-W1-06`/`V0.2-W1-08` runtime checkpoint: Task Hub runs on DigitalOcean from `dev@b9961fa`, `taskhub-dashboard.service` is active/enabled, private bind is `127.0.0.1:3000`, raw public `157.230.251.209:3000` is unreachable, anonymous `https://taskhub.trisila.online/healthz` returns Cloudflare Access `302`, local `/healthz`, `/api/boards`, and `/api/all-cards` return `200`, and `GOOGLE_REDIRECT_URI` is `https://taskhub.trisila.online/auth/callback`. This is not a QA pass; approved-user browser access, app load after Trello env setup, and `APP_DATA_DIR` restart persistence remain routed to QA. Reviewed by Codex PM |
| 2026-05-13 | R44 | Pass / PM Accepted | `V0.2-W1-06`/`V0.2-W1-08` hosted dev/demo runtime QA pass: PR #9 merged to `dev` at `91ee327`; `taskhub-dashboard.service` active/enabled; private bind `127.0.0.1:3000`; raw public `157.230.251.209:3000` unreachable; Cloudflare Access anonymous block verified; approved-user browser path loaded Task Hub without the earlier `/api/boards` or `/api/all-cards` `401`; local `/healthz`, `/api/boards`, and `/api/all-cards` returned `200`; hosted callback and `APP_DATA_DIR` persistence verified; no production deploy, main merge, W2 UI redesign, new W3 Paperclip behavior, or committed secrets observed. Reviewed by Codex QA; Accepted by Codex PM |
| 2026-05-13 | R45 | Pass / PM Accepted | `V0.2-W1-07` service-auth planning QA/PM pass: PR #11 merged to `dev` at `fa87ac4`; diff was docs-only; topology selected Paperclip -> Task Hub webhook first; human Cloudflare Access login was separated from machine/API auth; machine auth documented as Cloudflare Access service token plus signed webhook headers; env var names were placeholders only; replay/idempotency requirements and Paperclip owner inputs were recorded; no live W3 webhook, production deploy, main merge, W2 UI redesign, or secrets observed. Reviewed by Codex QA / PM; Accepted by Codex PM |
| 2026-05-14 | R46 | PM runtime checkpoint / W3 routed | Paperclip runtime inputs recorded for W3 planning: base URL `https://paperclip.trisila.online`, health path `/healthz`, allowed source id `paperclip-do-dev`, environment `dev`, local runtime port `3100`, service `paperclip.service`, and Task Hub service-token `/healthz` check from the Paperclip server returned `200`. This is not a W3 implementation QA pass; Cloudflare Client ID/Secret and HMAC signing secret remain excluded. Routed next to `V0.2-W3-02` live Paperclip -> Task Hub webhook connector. Recorded by Codex PM / Runtime |
| 2026-05-14 | R47 | QA/PM PASS - V0.2-W3-02 live webhook connector + interop | `c1e4df2` passed local QA for `verify:paperclip-webhook`, `verify:paperclip-contract`, `verify:paperclip-mock`, `verify:paperclip-connection`, `verify:paperclip-docs`, `verify`, and `check:all` with a temporary server. Live interop used Cloudflare Access service-token headers plus signed webhook headers and returned HTTP `201` for request `pc_live_interop_20260514115714`. Review Queue session `5c5ad00e-d7b8-4c34-91d2-b17a1ca1566a` was created with task status `pending`, preserving the human gate and no Trello/Google side effects. Runtime gate was closed afterward with `PAPERCLIP_WEBHOOK_ENABLED=false`. |
| 2026-05-14 | R48 | Runtime QA PASS - V0.2-W3-03 limited live enablement window | Task Hub runtime `dev@a89c26a` temporarily loaded `PAPERCLIP_WEBHOOK_ENABLED=true` for a named limited window, then returned to `false`. Runtime-local signed canary returned HTTP `201` for request `pc_w3_03_window_20260514062346`, created Review Queue session `7dd7d2a3-377c-4336-ba75-ba1c312635d2`, and kept the task `pending`. Same-payload replay returned idempotent success, changed replay returned `409`, invalid signature returned `401`, invalid source returned `403`, invalid environment returned `400`, final `/healthz` returned `200`, and final disabled probe returned `403`. External Cloudflare service-token sender was not re-run in this window; earlier live interop remains the evidence for that path. |
| 2026-05-14 | R49 | Runtime QA PASS - V0.2-W3-03 true external Paperclip sender window | Task Hub runtime `dev@a89c26a` temporarily loaded `PAPERCLIP_WEBHOOK_ENABLED=true`, then returned to `false`. Paperclip runtime host/env sent through public Cloudflare Access service-token and HMAC headers. Request `pc_true_external_20260514064709` returned HTTP `201`, created Review Queue session `0e8f8b2e-d767-44ef-854c-538481c124c8`, created task `ef72316d-148d-4c4a-b600-fc5bb14da928`, and kept the task `pending`. Same-payload replay returned `200`, changed replay returned `409`, invalid signature returned `401`, invalid source returned `403`, invalid environment returned `400`, final `/healthz` returned `200`, and final disabled probe returned `403`. Runtime gate remains closed with `PAPERCLIP_WEBHOOK_ENABLED=false`. |
| 2026-05-14 | R50 | Runtime QA PASS - V0.2-W3-03 standing dev/demo observation start | Task Hub runtime `dev@a89c26a` loaded `PAPERCLIP_WEBHOOK_ENABLED=true` for the named standing dev/demo observation window after preflight confirmed `false`. Paperclip runtime host/env canary request `pc_standing_observation_20260514092342` returned HTTP `201`, created Review Queue session `884fec91-26e9-40e9-91af-6a11f91f317f`, created task `025630e8-d52b-4ef3-b7ac-0cb858342497`, and kept the task `pending`. Same-payload replay returned `200`, changed replay returned `409`, invalid signature returned `401`, invalid source returned `403`, invalid environment returned `400`, and post-start `/healthz` returned `200`. Runtime remains `PAPERCLIP_WEBHOOK_ENABLED=true` for the named dev/demo observation window. |
| 2026-05-14 | R51 | Runtime QA PASS - V0.2-W3-03 standing dev/demo daily monitor | Runtime flag remained `PAPERCLIP_WEBHOOK_ENABLED=true`; Task Hub local `/healthz` and public Cloudflare-protected `/healthz` both returned `200`; Paperclip Settings remained connected with `hasSecret=true` and did not return the signing secret. Daily monitor request `pc_daily_monitor_20260514093549` returned `201`, created pending session `16a813e7-c077-4f14-9f24-74c0bf738512`, and created task `1dbf72ec-0c17-44db-a644-0ced753bf2ee`. Same-payload replay returned `200`, changed-payload replay returned `409`, invalid signature returned `401`, invalid source returned `403`, and invalid environment returned `400`. Paperclip counts moved from 4 pending / 0 approved / 0 rejected / 0 Trello-linked to 5 pending / 0 approved / 0 rejected / 0 Trello-linked. No stop condition observed and no rollback was triggered. |
| 2026-05-14 | R52 | Runtime QA PASS - V0.2-W3-03 standing dev/demo daily monitor follow-up | Runtime flag remained `PAPERCLIP_WEBHOOK_ENABLED=true`; Task Hub local `/healthz` and public Cloudflare-protected `/healthz` both returned `200`; Paperclip Settings remained connected with `hasSecret=true` and did not return the signing secret. Daily monitor request `pc_daily_monitor_20260514095453` returned `201`, created pending session `7d2e82aa-c35d-4463-a5a1-513e85adb12d`, and created task `5f0bcdd6-9057-4623-9b0d-bf041d3ec059`. Same-payload replay returned `200`, changed-payload replay returned `409`, invalid signature returned `401`, invalid source returned `403`, and invalid environment returned `400`. Paperclip counts moved from 5 pending / 0 approved / 0 rejected / 0 Trello-linked to 6 pending / 0 approved / 0 rejected / 0 Trello-linked. No stop condition observed and no rollback was triggered. |
| 2026-05-14 | R53 | Runtime QA PASS - V0.2-W3-03 standing dev/demo read-only monitor | Read-only monitor created no canary task and sent no signed webhook. Runtime flag remained `PAPERCLIP_WEBHOOK_ENABLED=true`; Task Hub `/healthz` returned `200`; `taskhub-dashboard.service` and `paperclip.service` were both `active`; Paperclip Settings API returned `connected` with `hasSecret=true` and did not return the signing secret. Paperclip Review Queue counts stayed at 6 sessions / 6 tasks: 6 pending, 0 approved, 0 rejected, 0 Trello-linked side effects, and 0 processed tasks missing approval/rejection audit. Audit counts were consistent with prior canary/replay tests: 6 payload received, 6 review session created, 6 task diff resolved, 5 duplicate ignored, and 5 duplicate rejected events. No abnormal webhook/audit pattern was found and no rollback was triggered. |
| 2026-05-14 | R54 | Runtime QA PASS - V0.2-W3-03 standing dev/demo read-only monitor follow-up | Read-only monitor created no canary task and sent no signed webhook. Runtime flag remained `PAPERCLIP_WEBHOOK_ENABLED=true`; Task Hub `/healthz` returned `200`; `taskhub-dashboard.service` and `paperclip.service` were both `active`; Paperclip Settings API returned `connected` with `hasSecret=true` and did not return the signing secret. Paperclip Review Queue counts stayed at 6 sessions / 6 tasks: 6 pending, 0 approved, 0 rejected, 0 Trello-linked side effects, and 0 processed tasks missing approval/rejection audit. Audit counts remained consistent with prior canary/replay tests: 6 payload received, 6 review session created, 6 task diff resolved, 5 duplicate ignored, and 5 duplicate rejected events. No abnormal webhook/audit pattern was found and no rollback was triggered. |
| 2026-05-14 | R55 | Runtime QA PASS - V0.2-W3-03 standing dev/demo read-only monitor second follow-up | Read-only monitor created no canary task and sent no signed webhook. Runtime flag remained `PAPERCLIP_WEBHOOK_ENABLED=true`; Task Hub `/healthz` returned `200`; `taskhub-dashboard.service` and `paperclip.service` were both `active`; Paperclip Settings API returned `connected` with `hasSecret=true` and did not return the signing secret. Paperclip Review Queue counts stayed at 6 sessions / 6 tasks: 6 pending, 0 approved, 0 rejected, 0 Trello-linked side effects, and 0 processed tasks missing approval/rejection audit. Audit counts remained consistent with prior canary/replay tests: 6 payload received, 6 review session created, 6 task diff resolved, 5 duplicate ignored, and 5 duplicate rejected events. No abnormal webhook/audit pattern was found and no rollback was triggered. |
| 2026-05-14 | R56 | QA PASS - V0.2-W3-04 Paperclip Review Queue Cleanup | `1af8273` passed cleanup review. Paperclip live/canary/test sessions are identified from source/requestId/audit metadata; cleanup is human-triggered; cleanup rejects/archives test tasks without approval; requestId, agentRunId, sessionId, taskId, source environment, and audit trail remain preserved; real Paperclip work is not eligible for test/canary cleanup; no live webhook, canary, Trello, Calendar, Google Tasks, W1, or W2 scope was added. Verification passed for cleanup, contract, mock, connection, docs, webhook, verify, and check:all. |
| 2026-05-14 | R57 | Runtime QA PASS - V0.2-W3-04a cleanup audit retention and runtime cleanup | `19ae16c` retained Paperclip cleanup audit and blocked dismissal/deletion of cleaned Paperclip sessions; `7ea4650` merged W3 cleanup into `dev`. Runtime deployed from `dev@7ea4650`; cleanup changed Paperclip Review Queue counts from 6 pending / 0 approved / 0 rejected / 0 Trello-linked to 0 pending / 0 approved / 6 rejected / 0 Trello-linked. Delete guard for cleaned Paperclip sessions returned `409`; read-only monitor after cleanup confirmed Task Hub `/healthz` `200`, `taskhub-dashboard.service` active, `paperclip.service` active, Settings connected with `hasSecret=true`, and no abnormal webhook/log pattern. No canary was sent and no external side effect occurred. |
| 2026-05-14 | R58 | QA PASS - V0.2-W3-05 Paperclip Live Operations Hardening | `b0d70ff` passed QA. `GET /api/integrations/paperclip/operations/status` is read-only; Settings Paperclip panel shows live flag, connection, source/environment, Review Queue counts, cleanup state, audit categories, and warnings; secret values are not returned or rendered; no canary task is created; no outbound Paperclip network call, auto-approval, Trello, Calendar, Google Tasks, W1, or W2 scope was added. Verification passed for operations, cleanup, webhook, connection, contract, mock, docs, frontend verify, and `check:all` with local server running. |
| 2026-05-14 | R59 | Runtime QA PASS - V0.2-W3-05 integration/deploy closeout | `0776908` polished Paperclip Settings operations copy and `2c302dc` merged W3-05 into `dev`. Runtime deployed from `dev@2c302dc`; Task Hub `/healthz` returned `200`; `taskhub-dashboard.service` and `paperclip.service` were active; operations status returned `200`; Paperclip Settings remained connected with `hasSecret=true` and did not return the signing secret. Paperclip Review Queue counts were 0 pending / 0 approved / 6 rejected / 0 Trello-linked, expected warning `standing_dev_demo_enabled` was present, no danger warnings were present, no canary was sent, and no external side effect occurred. |
| 2026-05-14 | R60 | Runtime QA PASS - W3 standing dev/demo read-only monitor after closeout | Read-only monitor sent no webhook and created no canary. Runtime remained on `dev@2c302dc`; `taskhub-dashboard.service` and `paperclip.service` were active; Task Hub `/healthz` returned `200`; operations status mode was `read_only`; Paperclip Settings remained connected with `hasSecret=true`; Paperclip Review Queue counts were 6 sessions / 6 tasks with 0 pending / 0 approved / 6 rejected / 6 cleaned / 0 Trello-linked; expected warning `standing_dev_demo_enabled` was present, no danger warnings were present, and no stop condition was found. |
| 2026-05-14 | R61 | QA PASS / PM Accepted - V0.3-RUX-02A Trello connection-state and failure-copy clarity | `516b33e` added scoped Trello connection-state and route failure-copy clarity. Verification covered configured/unconfigured/disconnected/error copy without adding Dev/UI scope beyond the accepted RUX-02A boundary. |
| 2026-05-14 | R62 | QA PASS / PM Accepted - V0.3-RUX-03 Review Queue and AI trace clarity | `b2425a4` added Review Queue linked-doc clarity and Paperclip/AI trace readability. Verification covered visible source/context/audit affordances while preserving the Review Queue human gate. |
| 2026-05-14 | R63 | QA PASS / PM Accepted - V0.3-RUX-04 Today and Tasks decision flow | `d72f979` added source/context/next-action clarity for Today and Tasks. Verification covered route decision-flow copy without adding Trello, Calendar, Google Tasks, or Paperclip side effects. |
| 2026-05-14 | R64 | QA PASS / PM Accepted - V0.3-RUX-05 browser regression and responsive QA gate | `0af9417` added the repeatable RUX browser regression gate for core desktop/mobile routes. Verification covered responsive route smoke and no page-level horizontal overflow under controlled data. |
| 2026-05-14 | R65 | QA PASS / PM Accepted - V0.3-RUX-06 release checklist for dev -> main | `df29307` and `5a90cc7` accepted the release checklist artifact and routed integration only after the operating-model prerequisite merged. That integrated candidate gate was later completed at R66; main promotion was later accepted at R67. |
| 2026-05-14 | R66 | Runtime QA PASS / PM Accepted - V0.3 RUX integrated dev/demo closeout | PR #18 merged V0.3 RUX to `origin/dev@02fe7cf`. Dev/demo runtime was fast-forwarded to `dev@02fe7cf`, dependencies refreshed with `npm ci`, and `taskhub-dashboard.service` was restarted from the deployed tree. Runtime evidence: service active, local `/healthz`, `/api/config`, and `/api/reviews` returned `200`; anonymous public `/healthz` returned Cloudflare Access `302`; Paperclip operations status returned `read_only`, connected with `hasSecret=true` without exposing the secret, live flag remained enabled for the accepted dev/demo observation window, Review Queue counts were 6 sessions / 6 tasks with 0 pending / 0 approved / 6 rejected / 6 cleaned / 0 Trello-linked, and only expected warning `standing_dev_demo_enabled` appeared. No webhook, canary, Trello, Calendar, Google Tasks, production deploy, or `main` merge was performed. |
| 2026-05-14 | R67 | Release QA PASS / PM Accepted - V0.3 RUX dev -> main candidate | PR #20 candidate `5eb23ef` merged `origin/dev@e05eb66` over `origin/main@88dfa09` without conflicts and preserved main-only archive cleanup. Verification passed `npm ci`, `check:all` with local server running, `verify:rux-trello`, `verify:rux-ai-trace`, `verify:rux-decision-flow`, `verify:rux-browser-regression` across `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, and `/docs` on desktop/mobile, plus Paperclip contract/mock/docs/operations/cleanup/connection/webhook checks. Conflict-marker scan and `git diff --check` passed. No production deploy, dev/demo runtime change, secret exposure, live canary, Trello/Calendar/Google Tasks side effect, or W3/V0.3 cross-merge was performed. |
| 2026-05-13 | R46 | Pass / PM Accepted | `V0.2-W2-06` Settings + OKR + Weekly Focus Polish QA Recheck pass at `bd3e441`; branch/commit verified; `check:all`, Paperclip contract/mock verification, Settings config save paths, OKR drilldown/back, Weekly Focus Review navigation, W2 route smoke, desktop/mobile/mobile-small overflow 0, unexpected console errors 0, and page errors 0 passed. Local Trello 401s were credential/env noise. Reviewed by Codex QA Recheck; Accepted by Codex PM |
| 2026-05-13 | R47 | Pass / PM Accepted | `V0.2-W2-06` Integration QA pass on `origin/dev@523c948`; clean detached worktree verified; `npm.cmd run check:all` passed; controlled W2 browser smoke passed for `/settings`, `/okr`, `/focus`, `/today`, `/review`, `/all`, `/boards`, `/calendar`, and `/planner` across desktop/mobile/mobile-small; max horizontal overflow 0; console/page errors 0; Settings save paths, OKR drilldown/back, Weekly Focus owner filter, and Weekly Focus to Review navigation passed. W1 deployment/access and W3 Paperclip behavior were intentionally not tested in this W2-only pass. Reviewed by Codex Integration QA; Accepted by Codex PM |

---

## Bug Fixes This Sprint
*(PM เพิ่มที่นี่เมื่อ QA พบ bug ใน code ที่ implement แล้ว)*

| ID | Bug | File:Line | Status |
|---|---|---|---|
| B10 | Tasks page: label group list ไม่ scroll ได้ | `style.css:1047` | ✅ Fixed `ac48125` |
| B11 | Sidebar: Pending Review badge แสดงซ้ำ 2 nav items | `app.js:982` | ✅ Fixed `8c73b7d` |
| B12 | OKR page: task container clip (overview + detail) | `style.css:1187,1303` | ✅ Fixed `ac48125`,`f5b3773` |
| B13 | Google Tasks แสดง "Connected" แต่ API ไม่ทำงาน | `app.js:1257` | ✅ Fixed `f5b3773` |
| B14 | Trello Rate Limit จาก nav switching | `server.js:40-50,326,349` | ✅ Fixed `5ab0f76` |
| B15 | move card ไม่ invalidate cache | `server.js:308` | ✅ Fixed `f5b3773` |
| B16 | topbarRefresh ไม่ bypass server TTL | `server.js`,`app.js` | ✅ Fixed `c6a09fd` |
| B17 | approve task ไม่ invalidate cache | `server.js:556` | ✅ Fixed `c6a09fd` |
| B18 | bm-label-filter-note แสดง "0 cards" บน boards ไม่มี label นั้น | `app.js:2088` | ✅ Fixed `7926b80` |
| B19 | Cold start rate limit — ⚠ Trello rate limit ทุกครั้งที่ server restart | `server.js`, `trello.js` | ✅ Fixed `5b35bc2`,`632fab4` |
| B20 | Due date display: UTC+7 and dd/mm/yyyy format | `app.js` | ✅ Fixed `d8114bd` |
| B21 | All Tasks sorting logic not called in render | `app.js` | ✅ Fixed `e79ff3b` |
| B22 | Team Monitor Board view: hardcoded columns — cards ใน lists อื่นหายไป | `app.js:2118` | ✅ Fixed `5384ab8` |
| B23 | GCal autoDelete missing after trello routes extraction | `server.js:14-21` | ✅ Fixed `c70c681` |
| B24 | Trello-backed preview regression: rate-limit/runtime errors surfaced as 500 and blocked preview QA | `src/routes/trello.routes.js` | ✅ Fixed `e1b4801` |

---

## Deferred (ยังไม่ทำ)

| Task | เหตุผลที่ defer |
|---|---|
| P9-2 · Virtual Scroll | cards < 200 ยังไม่จำเป็น — รอ threshold ก่อน |
| P9-3 · UX Polish (OKR UI) | รอ user ส่ง screenshot / คำอธิบายก่อน ถึงจะ scope ได้ |

---

## 🎉 Phase 8 Complete

Phase 8 เสร็จสมบูรณ์ (2026-05-06) — Post-MVP Enhancements ทุกข้อผ่าน QA:

| Task | Completed |
|---|---|
| B7 — Server restart (health route) | ✅ 2026-05-06 |
| B8 — Calendar graceful degradation | ✅ 2026-05-06 |
| B9 — dblclick/click modal conflict | ✅ 2026-05-06 |
| P8-1 Notification & Alert System | ✅ 2026-05-06 |
| P8-2 Card Quick-Edit Inline | ✅ 2026-05-06 |
| P8-3 Export / Report CSV | ✅ 2026-05-06 |
| P8-4 Virtual Scroll | ➡ Deferred (cards < 200 threshold) |
| P8-5 OKR Board Setup Guide | ✅ 2026-05-06 |

---
