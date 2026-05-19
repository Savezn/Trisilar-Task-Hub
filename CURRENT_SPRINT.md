# Current Sprint - Trisilar Task Hub

**Phase:** V0.5 Foundation Hardening Accepted / V0.6 UI V2 Accepted With Logged Deferrals
**Status:** V0.4 production Paperclip permanent enablement complete; V0.5 foundation accepted after hosted dev/demo SQLite canary short monitor passed; V0.6 UI V2 source-led component sweep, RUX visible-copy follow-up, global shell/sidebar/Today hero primitive recovery, desktop Scope/affordance recovery, whole-app hardcode/control audit, route-header false-affordance follow-up, status-strip hover descriptions, Settings button/chip primitive normalization, topbar dropdown/action UX recovery, whole-system UI/UX micro-QC ledger, second-pass micro-QC, third-pass micro-QC, fourth-pass micro-detail fix appendix, user-friendly improvement opportunity ledger, PM Dev task backlog, first desktop blocker accessibility/semantics batch, Edit Card modal UX polish follow-up, Settings accessibility/credential-copy polish, state/action feedback standardization, Calendar readability/action-honesty follow-up, Docs / AI Trace mobile readability follow-up, UI V2 interaction-matrix evidence expansion, PM/UX review decision packet routing, global interaction-affordance token pass, sidebar footer connection-summary recovery, Docs detail reader panel, Docs reader panel polish, and R185 main-readiness hardening are complete; PM/UX accepted the batch with logged visual deferrals and release work now routes to a draft PR against `dev`
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-19 - **Updated by:** Codex PM / Dev / QA

> Use this file to start each Dev / QA / PM session. Historical logs and full plans live in linked docs below.

---

## Current Snapshot

| Area | Status | Source |
|---|---|---|
| V0.1 Release Acceptance | Pass | `docs/logs/QA_LOG.md` R34 |
| P9 open bugs | None currently open | `docs/logs/QA_LOG.md` |
| V0.2 W0 Branch / Environment / CI Setup | QA Pass `9dbb47b` | Implemented by Codex Dev; Reviewed by Codex QA |
| V0.2 W1 hosted dev/demo runtime | QA Pass / PM Accepted for dev/demo | DigitalOcean + Cloudflare Access; Task Hub persistent `APP_DATA_DIR`; service-auth topology accepted |
| V0.2 W2 Full UI Redesign | Complete on integrated `dev` | `V0.2-W2-06` PM accepted on `origin/dev@523c948` |
| V0.2 W3 Paperclip mock/docs/settings/live connector | PM Accepted through `V0.2-W3-05`; merged/deployed on `dev@2c302dc` | Contract, mock route, Docs, Settings gate, live webhook, live interop, cleanup, cleanup audit retention, and read-only operations status accepted |
| V0.2 W3 runtime cleanup | Complete | Runtime deployed from `dev@7ea4650`; Paperclip test/canary sessions cleaned from 6 pending to 0 pending / 6 rejected / 0 Trello-linked |
| V0.2 W3 standing dev/demo observation | Active with read-only monitor automation | `PAPERCLIP_WEBHOOK_ENABLED=true` on dev/demo; active signed canary only on PM/QA request or after runtime/sender changes |
| V0.2 branch/worktree residue | Cleaned after release/integration QA | Stale W1/W2/W3 worktrees, folders, local branches, and remote workstream branches removed after QA passed on `origin/dev@8027324` |
| Latest W3 dev closeout | `origin/dev@ff20e48` | `V0.2-W3-05` operations status and settings copy polish merged/deployed at `dev@2c302dc`; W3 foundation closeout status is on latest `dev` |
| V0.3 operating model and agent structure | PM Accepted / merged to `dev@ed9fae0` | Reference docs define Task Hub/Trello/Review Queue operating model, AI governance, Codex parallel development, and long-term role ownership under `docs/agents/`. Repo-contained role skills are allowed under `docs/agent-skills/`; installed reusable Codex skill extraction remains deferred. |
| V0.3 Product Reliability + UX Stabilization | Complete / post-sync release QA pass | RUX-02A through RUX-06 are accepted, integrated, deployed to dev/demo, runtime QA passed, release-candidate verification passed on `codex/v03-dev-to-main-release-candidate@5eb23ef`, and `origin/dev` / `origin/main` are synced at `631d3b2`. Production deploy remains a separate runtime decision. |
| V0.4 Paperclip production readiness | Complete; production permanent enablement active on `taskhub-prod` | Production private runtime, Cloudflare Access route, production service token, Paperclip Settings connection, staged canary, 24-hour monitoring, rollback proof, and permanent mode verification passed. Review Queue remains the human gate; no auto-approval or Trello/Calendar/Google Tasks side effect occurred |
| V0.5 Foundation Hardening | PM Accepted after hosted dev/demo SQLite canary and short monitor passed on `taskhub-dashboard.service` | Deterministic `npm test`, app-owned contracts, SQLite migration/import/export, fail-loud rollback export, env-flagged SQLite runtime reader, Paperclip safety checks, post-merge QA, hosted canary verification, rollback proof, and two short monitor checkpoints passed without production/runtime side effects |
| Agent role skill entrypoints | Merged to `origin/dev@de3a6bc` via PR #23 | Added basic repo-contained `SKILL.md` files for Codex, Claude, Gemini, and future agents; no local Codex skill install and no product-version scope |
| Operations/security docs baseline | Merged to `origin/dev@681be25` via PR #25 | Adds runtime operations runbook, data backup/retention policy, security/access policy, onboarding guide, troubleshooting guide, and environment matrix after DoR/DoD baseline merge; branch/worktree cleanup completed |
| UI Web Design V2 handoff | QA pass / PM/UX visual re-review pending | `UI_V2_CODEX_PARITY_HANDOFF.md` remains the first-read contract. Prototype source inventory, visual parity review, route/component audits, deviation log, screenshot evidence, `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`, `UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md`, and `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` are recorded under `docs/design/ui-design-v2/` and `docs/logs/`; `docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` is now the PM-owned repo backlog for turning those rows into Dev-ready task candidates before any Trello card is created. Latest correction repairs sidebar first-paint primitives, sidebar label-pill/Scope dot rhythm, topbar scope-picker chevron and Scope reset behavior, desktop Scope filtering, first-paint emoji/icon artifacts, non-wired desktop filter affordances, whole-app hardcoded fallback / non-interactive control affordances, Today Next Up eyebrow time order, app-pane/mobile shell drift, Today/topbar task-row drift, All Tasks topbar/footer checks, Weekly Focus lane primitive/density, and RUX visible-copy drift in Review Queue, All Tasks, Calendar, Planner, and Docs / AI Trace after PM/UX reopened final review. The first PM backlog Dev batch is also QA-passed for `UIV2-FIX-001`, `UIV2-FIX-002`, and `UIV2-FIX-003`: hidden/legacy surfaces now use inert handling, topbar Scope is a native button, popover/modal close paths return focus, buttons declare `type="button"`, and All Tasks sort exposes `aria-sort`. Latest `/all` follow-up tightens the Edit Card modal close icon, labels, checklist density, contextual checklist accessible names, and footer behavior with screenshot evidence. Latest Settings follow-up implements `UIV2-FIX-008`: repeated action names are contextual, visible fields/checks are programmatically labelled, and credential copy now explains session-only draft boundaries without implying runtime changes. Latest state/action feedback follow-up implements `UIV2-FIX-009`: read-only `aria-disabled` controls expose product-safe toast feedback, Calendar mode switches confirm active state, Docs filter `Show bar` explains the route-only filter model, and All Tasks route actions give honest command-layer feedback. Latest Calendar follow-up implements `UIV2-FIX-007`: `New event draft`, route/modal write-boundary copy, real agenda action buttons, and readable/keyboard-accessible event chips clarify Calendar behavior without adding runtime/API scope. Latest Docs / AI Trace follow-up implements `UIV2-FIX-006`: mobile/app-pane filterbar now reserves normal flow, trace rows become stacked audit cards, run IDs expose copy affordances, and readonly source chips are static status notes. Latest QA evidence expansion implements `UIV2-QA-001`: desktop interaction-matrix screenshots now cover default, hover, focus, open, clicked, and readonly-feedback states for priority controls, with state fixture proof linked back to the full-route audit. Latest interaction-affordance pass implements `UIV2-FIX-004A`: grouped status details, shared pointer/focus/active tokens, first hit-area tokens, Calendar Week active-state proof, and Settings integration pressed-state proof. Latest Today follow-up closes `QC-011` with visible row `Open` affordances, focus-within row feedback, and live Edit Card proof. Latest R172 follow-up implements `UIV2-FIX-005`: shared decision-text and metadata reveal primitives now cover Today, All Tasks, Calendar, Planner, and OKR with targeted screenshot evidence. The micro-QC ledger now records 93 PM/UX triage rows, the opportunity ledger records 60 non-blocking ways to make the app more user friendly, and the PM backlog now separates PM/UX Review Pending, Decision Needed, Opportunity Backlog, and Hold rows; no Ready-for-Dev row should be opened without PM/UX selection. V0.6 UI work remains frontend/design-system only with no runtime config, Cloudflare, Paperclip live behavior, production, Team OS, or full rewrite scope |

---

## Plain-Language PM Summary

Paperclip can now send work into Task Hub through the protected live webhook path. Task Hub verifies Cloudflare Access, HMAC signature, source/environment, request id, agent run id, timestamp, and payload contract before creating a Review Queue session.

The important safety rule is still intact: Paperclip-created tasks enter Review Queue as pending work only. They do not create Trello cards, Calendar events, or Google Tasks until a human approves them.

The test/canary items created during live validation have been cleaned safely. They were rejected/archived with audit retained, not deleted and not approved. Runtime count after cleanup is 0 pending / 0 approved / 6 rejected / 0 Trello-linked.

W3-05 adds that operational hardening: PM/QA/Runtime Owner can now inspect live flag status, connection state, source/environment, Review Queue counts, cleanup state, audit categories, and warnings without sending a new canary. It is merged and deployed at `dev@2c302dc`; W3 foundation closeout status is recorded on `origin/dev@ff20e48`.

V0.3 RUX is complete on the integrated `dev` line and the dev/demo runtime. The accepted V0.3 work adds Trello connection-state/failure-copy clarity, Review Queue and AI trace clarity, Today/Tasks decision-flow polish, browser regression coverage, and a `dev -> main` release checklist. Runtime QA confirmed Task Hub on `dev@02fe7cf`, local health/config/reviews `200`, Cloudflare Access anonymous block `302`, and Paperclip operations read-only with 0 pending / 6 rejected / 0 Trello-linked.

PM accepted the V0.3 `dev -> main` release candidate in PR #20 after merging `origin/dev@e05eb66` over `origin/main@88dfa09` into release-candidate commit `5eb23ef`. Verification passed `npm ci`, `check:all`, RUX checks, browser regression, Paperclip contract/mock/docs/operations/cleanup/connection/webhook checks, conflict-marker scan, and `git diff --check`. No production deploy, runtime flag change, secret exposure, live canary, Trello/Calendar/Google Tasks side effect, or W3/V0.3 cross-merge was performed.

On 2026-05-15, PM/Integration synced `origin/dev` and `origin/main` at `631d3b2`, confirmed V0.2 delivery/cleanup is complete, normalized Codex/Claude branch/worktree rules in project docs, and ran post-sync V0.3 release/integration QA from `codex/v03-branch-workflow-release-qa`. Verification passed `npm ci`, `git diff --check`, conflict-marker scan, `check:all` with isolated local server, all RUX checks, and Paperclip contract/mock/docs/operations/cleanup/connection/webhook checks. No production deploy, runtime flag change, live canary, secret exposure, or Trello/Calendar/Google Tasks side effect was performed.

V0.4 Paperclip production readiness is complete. The production runtime runs as Docker container `taskhub-prod` on the DigitalOcean host, binds privately to `127.0.0.1:3301`, uses separate `APP_DATA_DIR=/home/trisilar/taskhub-prod-data`, and is routed through Cloudflare Access at `https://taskhub-prod.trisila.online`; anonymous access returns Cloudflare Access `302`. Production Paperclip Settings is connected with a runtime-only signing secret, production service-token reachability passed, staged production canary passed, 24-hour monitoring passed, rollback proof passed, and production is now in `PAPERCLIP_LIVE_MODE=permanent` with `PAPERCLIP_WEBHOOK_ENABLED=true`.

PM rebaselined the post-V0.4 roadmap so the team does not wait idle during V0.4 waiting/monitoring windows. V0.5 Foundation Hardening now comes before UI V2 production implementation and Team Operating System product work. V0.5 covers ADR-backed persistence, real `npm test`, app-owned data contracts, and SQLite migration; it must not touch production runtime, secrets, Cloudflare policy, live Paperclip flags, or webhook auth behavior. PR #28 merged the roadmap rebaseline to `dev@aaf8f58`; PR #30 later integrated FND-02/03/04/05 to `dev@e3380ac`.

V0.5-FND-02 through FND-05 are implemented, merged through PR #30, and integrated to `dev@e3380ac`. Post-merge QA passed `npm test` 25/25, `check:all` with controlled local server, and a local SQLite canary rehearsal that imported JSON state, ran the server with `TASKHUB_STATE_BACKEND=sqlite`, verified `/healthz`, `/api/config`, and `/api/reviews`, then exported rollback JSON. PM selected the hosted dev/demo SQLite canary path. On 2026-05-16, Runtime Owner/QA used `trisilar@157.230.251.209`, fast-forwarded `/home/trisilar/dashboard/app` to `dev@4ddca3c`, backed up `/home/trisilar/dashboard-data`, migrated app-owned JSON state to SQLite, restarted `taskhub-dashboard.service` with `TASKHUB_STATE_BACKEND=sqlite`, verified health/config/reviews/Paperclip operations with `verify:sqlite-canary`, exported rollback JSON, and verified rollback through a temporary JSON-backed local server. A short monitor then passed at `2026-05-16T12:44:25Z` and `2026-05-16T12:45:35Z` with service active and `verify:sqlite-canary` clean. PM accepts V0.5 foundation; production remains separate and was not touched by the V0.5 canary.

V0.6 UI V2 moved from slice completion to source-led full-fidelity recovery after PM/UX preview showed selector/no-overflow evidence was not enough. `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` is now the operating contract: name prototype source, log a gap row, patch narrowly, regenerate evidence, and treat generated PASS as automated evidence rather than PM/UX acceptance. The current handoff corrected the Review Queue contradiction where `mobile approve/reject` was reported FAIL inside a PASS row, repaired the live empty `/review` StateCard, repaired Settings / Mobile More source-led gaps, closed the PM/UX P1/P2 rows for Today mobile, Boards mobile, OKR / Portfolio desktop, shared mobile shell title stack, sidebar/icon primitive parity, sidebar label-pill/Scope dot parity, topbar scope-picker chevron/reset behavior, desktop Scope interaction/filtering, first-paint emoji/icon artifact removal, honest disabled states for non-wired desktop filters, Today Next Up eyebrow time-order parity, app-pane/mobile shell drift, Today desktop routebar/task-row drift, All Tasks topbar/footer drift, and Weekly Focus lane primitive/density drift, tightened the Mobile More P2 density row, and restored RUX visible-copy contracts for Review Queue, All Tasks, Calendar, Planner, and Docs / AI Trace. The latest component sweep and follow-up are QA-passed; PM/UX re-review is pending before final visual acceptance is restored.

The latest V0.6 UI V2 follow-up closed the route-header false-affordance gap found after the whole-app hardcode/control audit. Review Filter now drives a visible status/risk filterbar, Review Intake policy routes to Settings / Paperclip without changing runtime behavior, Docs Export downloads a safe visible-row CSV, and Today Filter highlights the visible work filter surface with explanatory feedback for disabled future filters. Browser evidence and automated checks are passing; PM/UX visual review remains the final acceptance gate.

Status-strip hover descriptions are also implemented as a read-only UI V2 shell improvement. The black telemetry strip now explains env, build, workspace, Trello, Google Calendar, Paperclip, Google Tasks, and last sync on hover/focus without exposing runtime-only values or changing connector behavior.

Settings button/chip normalization is now applied for Integrations, Board Visibility, BU groups, Monitor labels, and related manage-modal controls. The change is styling/markup only; existing Settings persistence and connector behavior are unchanged.

Topbar dropdown/action UX recovery is now applied for Scope, Docs Filter, and notification popovers. Scope opens a BU listbox instead of acting like static text, Docs Filter opens a compact filter dialog instead of only focusing search, and topbar popovers dismiss each other cleanly. The change is frontend interaction only; production data flow and runtime behavior are unchanged.

The latest UI V2 whole-system QC pass created a micro-ledger instead of making more product-code changes. It covered 10 routes across desktop, laptop, tablet, app-pane, mobile, and mobile-small viewports on `http://127.0.0.1:3032`; found no navigation errors, console/page errors, horizontal overflow, or emoji fallback glyphs; and logged 40 remaining UX/control/state/copy/evidence suspects for PM/UX triage in `docs/design/ui-design-v2/UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`.

The follow-up second-pass micro-QC added 20 more rows, bringing the ledger to 60 rows. It caught smaller UX issues missed by the broad sweep: Docs mobile filterbar collapse/trace-table overlap, Docs mobile trace ID/agent clipping, Calendar mobile unreadable month-grid event chips, All Tasks tiny sort/header/checkbox hit targets, 24px interactive chips on touch surfaces, missing Scope focus ring, Docs Filter focus-return gap, Calendar `New event` action-honesty risk, Weekly Focus mobile lane priority, and an empty mobile toast shell near the bottom nav. No code/runtime fix was made in that QC pass.

The third-pass micro-QC added QC-061 through QC-075, bringing the ledger to 75 rows. It used the in-app Browser for the current `/docs` route and a Playwright batch for 10 routes across desktop, app-pane, and mobile-small. No console/page errors or horizontal overflow over `2px` were found, but the pass captured subtler UX risks: the status strip consumes the first 8 keyboard tab stops, route search inputs lack reliable programmatic labels/focus rings, hidden legacy modal shells remain mounted with opacity `0` but without `aria-hidden`/`inert`, All Tasks has no obvious Edit Card trigger in the dense table, repeated `Mark done` / `Manage` / `Visible` / `Open KR detail` / `Open Settings` actions need contextual names, muted tiny labels have weak contrast, repeated route `h1` semantics may be unclear, and long live-data titles still need a shared clipping/tooltip policy. No code/runtime fix was made in this QC pass.

The fourth-pass micro-detail QC added QC-076 through QC-092, bringing the ledger to 92 rows and adding `UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md` for fix-level explanations. It reclassified broad hidden/focusable findings so the team does not chase false positives: `display:none` candidates are mostly tooling noise, while zero-size visible-tree controls, opacity-zero surfaces, and modal children are real accessibility/focus risks. New rows cover hidden zero-size global controls, All Tasks responsive hidden row controls, notification Escape focus return, Scope picker native semantics, readonly chip behavior, All Tasks sort `aria-sort`, missing button `type`, cursor/hit-area consistency, All Tasks/Calendar clipping, status-strip target model, body focus dumps, and future hover/focus evidence. No code/runtime fix was made in this QC pass.

PM/UX also opened a separate user-friendly improvement track so the team does not only log defects. `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` records 60 optional opportunities across global shell, route workflows, data readability, responsive ergonomics, Settings/integrations, and QA process. These are not acceptance blockers and do not authorize Dev work by themselves; PM must choose whether each row is `Do soon`, `Next iteration`, `Later`, or `Decline`.

PM created the repo-first V0.6 UI V2 Dev task backlog in `docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md`. It converts the 92 QC rows, fourth-pass fix-detail appendix, and 60 improvement opportunities into blocker-first task candidates: `UIV2-FIX-*` for Dev-ready or decision-gated fixes, `UIV2-DEC-*` for PM/UX policy choices, `UIV2-QA-*` for evidence expansion, and `UIV2-UF-*` for non-blocking opportunity bundles. No Trello card, runtime/API/schema change, external side effect, or product-code fix was created by this PM backlog pass.

R171 implements `UIV2-DEC-001` / `QC-001`: app-pane `747px` now behaves as compact desktop, with status strip/sidebar visible, mobile bottom nav hidden, and topbar route actions reachable on Today, Review Queue, All Tasks, Calendar, and Docs / AI Trace. PM/UX visual re-review remains required before acceptance.

R172 implements `UIV2-FIX-005` / `QC-074` with the conservative shared text reveal policy: decision-critical text gets two-line clamp plus native reveal, metadata keeps one-line density plus native reveal, and Today, All Tasks, Calendar, Planner, and OKR targeted evidence has overflow `0` and missing reveal count `0`. Calendar true-mobile agenda-first behavior remains a separate `UIV2-DEC-004` decision. PM/UX visual re-review remains required before acceptance.

R173 implements Settings copy-tone rows `QC-008`, `QC-032`, and `QC-053`: visible Settings copy now uses private-value/session-only wording, integration private fields are labelled `Private connection value A/B`, and Paperclip intake mode explicitly says live mode is unchanged. Browser QA found unsafe visible-copy hits `0`, overflow `0`, and console/page errors `0`. PM/UX visual re-review remains required before acceptance.

R174 implements `QC-069` muted small-label contrast as a conservative UI V2 design-system token polish. Production now defines the missing prototype typography token aliases, applies scoped `--muted-label` to small operational labels, and guards readable Docs / All Tasks / Settings small-label contrast in `verify:uiv2-full-fidelity`. Browser QA on `/docs` found trace headers at `6.82:1`, selected-trace eyebrow at `5.78:1`, overflow `0`, and console/page errors `0`; PM/UX visual re-review remains required before acceptance.

R175 adds the desktop PM/UX re-review pack. A first sweep found two disabled controls without explanatory help, then patched Review Queue `Clear` and Settings `Request` with product-safe title/aria copy. The rerun passed all 10 desktop routes at `1440x900`: shell present, route title correct, overflow `0`, unnamed buttons `0`, disabled controls without help `0`, empty toast shell `0`, emoji fallback glyphs `0`, and console/page errors `0`. Evidence is in `docs/design/ui-design-v2/UI_V2_DESKTOP_PM_UX_REREVIEW_2026_05_19.md` and `docs/logs/screenshots/v06-uiv2-full-fidelity/desktop-rereview-results-2026-05-19.json`. PM/UX decision is now required: accept, iterate, or hold the desktop batch.

R176 applies the PM/UX sidebar Scope iterate. Prototype Scope is a BU quick-filter surface, not a workspace label; workspace context already lives in the black status strip. Production now hides workspace-placeholder groups such as `Trisilar` from the sidebar/topbar BU filter model, shows `Configure BUs` when no meaningful BU groups exist, and reports the meaningful BU group count in Boards Monitor without changing runtime/API/schema or Trello behavior.

R177 applies the Settings BU group action-label iterate. The `Visible boards / BU groups` panel action no longer says `Edit groups` while creating a new group; it now says `Add BU group`, explains that existing BU names/colors/board assignments are edited inline, and keeps the action frontend-only with no runtime/API/schema change.

R178 applies the PM/UX Scope source iterate. Sidebar/topbar Scope now derives from Boards Monitor Team mode labels (`monitorTeams`) and filters visible work by matching Trello labels, instead of deriving from board-based BU groups. BU groups remain a separate Settings organization surface for board assignment, while Scope is now a cross-board label/team filter. Browser QA on `/boards` confirmed selecting `Marketing` updates the topbar scope, active sidebar Scope row, toolbar `label:Marketing`, board card metadata, visible board count, and keeps horizontal overflow `0`.

R179 applies the Scope clear interaction iterate. Sidebar Scope items now toggle off when the active label is clicked again, returning the shell to `All BUs`; the active item exposes `aria-pressed=true` and a `Clear <label> scope filter` title while selected. Browser QA on `/all` confirmed selecting and then clicking `Marketing` again clears the scope with horizontal overflow `0`.

R180 applies the PM/UX desktop interaction iterate for route-local segment controls and OKR context. All Tasks `Table / List / Group by board / Group by owner` is now a real view-mode switch with active state, grouped rows, and a scannable list layout; Today `All / Mine / Risky` now filters the visible work window instead of acting as disabled prototype chrome; OKR / Portfolio no longer uses the old hardcoded hero title and now separates the page into `Objective Scorecard` and `Quarter Execution Plan`, with per-objective cycle labels derived from objective names before falling back to the current quarter. In-app Browser QA on `3035/all`, `3035/today`, and `3035/okr` confirmed active-state changes, section rendering, horizontal overflow `0`, and console warnings/errors `0`.

R181 applies the All Tasks filter/sort context iterate (`UF-034` / `QC-030` / `QC-081`) as a desktop-first UI-only polish. The route now shows a compact context strip after the filterbar with current view, sort, scope, local filters, visible row count, `Clear filters`, and `Reset view`. Browser QA on `3035/all` confirmed the strip updates after selecting `List` and searching `revenue`, `Clear filters` removes local filters while preserving view and global Scope, `Reset view` returns to `Table` plus Due ascending sort, horizontal overflow stays `0`, and console warnings/errors stay `0`.

R182 was reviewed by PM/UX and rolled back as unnecessary UI. The proposed Today selected-scope summary duplicated existing topbar/sidebar Scope surfaces and added visual noise before the work grid. Scope remains controlled through the topbar and sidebar using the Team mode label model from R178; no separate Today scope-summary row should be restored unless PM/UX explicitly reopens the pattern.

R183 applies the Weekly Focus Review AI explainer iterate (`UF-049`) as a desktop-first UI-only polish. The Review AI lane now includes a compact human-gate explainer that clarifies the lane is for planning AI-originated Review Queue proposals only, while approve/reject/hold/edit decisions remain in Review Queue before Trello execution. The full-fidelity verifier now checks that this explainer exists and includes the Review Queue approval workflow language.

R184 applies a low-noise route action feedback iterate (`UF-004`). Global topbar refresh now exposes a temporary `Refreshing <route>` button state, refreshes the status strip last-sync timestamp, and shows route/scope-specific completion feedback such as `All Tasks refreshed · Scope: All BUs · last sync 14:48`, without adding another persistent context strip.

R185 performs the time-boxed main-readiness hardening pass for V0.6 UI V2. The core gates pass again on port `3035`: `npm.cmd test` (28/28), `$env:PORT='3035'; npm.cmd run check:all`, `$env:PORT='3035'; npm.cmd run verify:rux-browser-regression`, `$env:UIV2_APP_BASE_URL='http://127.0.0.1:3035'; $env:PORT='3035'; npm.cmd run verify:uiv2-full-fidelity`, and `$env:PORT='3035'; npm.cmd run verify:uiv2-state-fixtures`. The interaction matrix was refreshed and repaired to match the current All Tasks filter-chip selector; it now reports 19 controls, missing 0, console/page errors 0, overflow 0, missing button type 0, enabled default-cursor issues 0, and 74 screenshots. Remaining gate before main is PM/UX final accept/explicit deferral of review-pending visual items, plus commit/PR/merge hygiene.

R186 records PM/UX accept-with-deferrals for V0.6 UI V2 and routes release work to a draft PR against `dev`. Optional UI improvements are frozen until after release unless PM/UX identifies a blocker. Do not merge this large UI V2 branch directly into stale `main`; first merge/verify on `dev`, then promote `dev` to `main`.

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | Dev/demo runtime and Paperclip service-auth topology accepted | PM complete |
| W2 | Full UI Redesign | Complete on integrated `dev` | PM complete / hold |
| W3-03 | Controlled Paperclip live enablement | Standing dev/demo observation active; read-only monitor automation active | QA Owner / Runtime Owner monitor |
| W3-04 | Paperclip Review Queue Cleanup | PM Accepted; merged to `dev@7ea4650`; runtime cleanup complete | PM complete |
| W3-05 | Paperclip Live Operations Hardening | QA Pass / PM Accepted; merged and deployed on `dev@2c302dc`; closeout on `origin/dev@ff20e48` | PM complete / Runtime monitor |
| V0.3 Operating Model | Project operating model and long-term agent team structure | PM Accepted / merged to `dev@ed9fae0` | PM complete |
| V0.3 RUX Integration | Product Reliability + UX Stabilization accepted branch integration | Complete on `origin/dev@02fe7cf`; dev/demo runtime QA pass | PM complete |
| V0.3 Main Release | Product Reliability + UX Stabilization `dev -> main` release candidate | PM accepted PR #20; dev/main synced at `631d3b2`; post-sync QA passed; production deploy not performed | PM complete / Runtime hold |
| Branch Workflow Alignment | Codex/Claude branch/worktree naming and cleanup model | Docs updated on `codex/v03-branch-workflow-release-qa`; QA passed | PM complete / Integration ready |
| V0.4-PROD-01 | Paperclip production repo readiness | Integrated to `dev@7e069b5` | PM complete |
| V0.4-PROD-02 | Separate production runtime setup | Pass for runtime setup: private runtime + Cloudflare Access route + production service token + Paperclip Settings connection prepared | Runtime complete |
| V0.4-PROD-03 | Staged production canary window | Pass; runtime returned to disabled | QA / Runtime complete |
| V0.4-PROD-04 | 24-hour read-only monitoring | Pass; final checkpoint 2026-05-16T08:03:14Z confirmed disabled/read_only, no danger warnings, and no external side effects | PM / Integration closeout |
| V0.4-PROD-05 | Permanent enablement acceptance | Complete; production `taskhub-prod` is permanent-enabled with Review Queue human gate intact | PM / Runtime Owner complete |
| V0.5-FND-01 | Foundation ADRs + planning acceptance | Accepted / merged to `dev@aaf8f58` via PR #28 | PM complete |
| V0.5-FND-02/03/04/05 | Foundation tests, contracts, SQLite migration, local integration QA, hosted dev/demo SQLite canary, and short monitor | PM Accepted; dev/demo remains `TASKHUB_STATE_BACKEND=sqlite` as a dev/demo canary, production unchanged | PM complete / V0.6 route ready |
| Agent Role Skills | Basic repo-contained role `SKILL.md` entrypoints for Codex/Claude/Gemini | Merged to `origin/dev@de3a6bc` via PR #23 | PM complete |
| Operations Docs Baseline | Runtime operations, backup/retention, security/access, onboarding, troubleshooting, and environment matrix docs | Merged to `origin/dev@681be25`; cleanup complete | PM complete |
| UIV2-01 | UI V2 source-led full-fidelity parity | Component parity recovery and PM/UX P1/P2 recovery are implemented on `codex/v06-uiv2-full-fidelity`; `UI_V2_CODEX_PARITY_HANDOFF.md` is the first-read contract; route/component audits and screenshot evidence are regenerated; latest source-led sweep repairs sidebar first-paint primitives, sidebar label-pill/Scope dot rhythm, topbar scope-picker chevron/reset behavior, desktop Scope filtering, first-paint emoji/icon artifacts, non-wired desktop filter affordances, whole-app hardcoded fallback / non-interactive control affordances, Today Next Up eyebrow time order, app-pane/mobile shell drift, Today/topbar task-row drift, All Tasks topbar/footer checks, Weekly Focus lane primitive/density, and RUX visible-copy drift in Review Queue, All Tasks, Calendar, Planner, and Docs / AI Trace after PM/UX reopened final review. Whole-system micro-QC ledger now records 93 UX/control/state/copy/evidence suspects after fourth-pass micro-detail QC, with `UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md` explaining how to fix the smallest interaction/accessibility/design-system issues. `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` records 60 optional improvements for future PM selection. `VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` now converts those rows into blocker-first Dev task candidates and PM decision rows; first desktop batch `UIV2-FIX-001/002/003`, the `/all` Edit Card modal UX polish follow-up, `UIV2-FIX-004A` global interaction-affordance token pass, `UIV2-FIX-005` shared text reveal policy, `UIV2-FIX-006` Docs / AI Trace mobile readability follow-up, `UIV2-FIX-007` Calendar readability/action-honesty follow-up, `UIV2-FIX-008` Settings accessibility/copy polish including R173 copy-tone/session-boundary polish, R174 `QC-069` muted small-label contrast polish, `UIV2-FIX-009` state/action feedback standardization, and `UIV2-QA-001` interaction-matrix evidence expansion are implemented and QA-passed with PM/UX review pending. `UI_V2_PM_UX_REVIEW_DECISION_PACKET.md` is now the current routing artifact for accept candidates. | PM/UX visual re-review pending |

---

## Documentation Routing

| Need | Read |
|---|---|
| Current task and next action | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Full V0.2 branch/workstream plan | `docs/plans/VERSION_0_2_PLAN.md` |
| W3 Paperclip contract/live plan | `docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md` |
| Durable W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| QA history and completed work archive | `docs/logs/QA_LOG.md` |
| PM decisions and phase context | `docs/logs/DECISION_LOG.md` |
| File/function lookup hints | `docs/reference/KEY_FILE_MAP.md` |
| Long-term organization operating model | `docs/reference/ORGANIZATION_OPERATING_MODEL.md` |
| AI agent governance and role boundaries | `docs/reference/AI_AGENT_GOVERNANCE.md` |
| Parallel Codex branch/worktree model | `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` |
| Role-specific agent handoffs | `docs/agents/` |
| Role-specific agent skill entrypoints | `docs/agent-skills/` |
| V0.3 Product Reliability + UX Stabilization plan | `docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md` |
| V0.3 RUX findings and baseline | `docs/logs/V0_3_RUX_FINDINGS.md` |
| V0.3 RUX release checklist | `docs/plans/VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md` |
| V0.4 Paperclip production plan | `docs/plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md` |
| V0.5 Foundation Hardening plan | `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` |
| Foundation-before-UI/Team OS ADR | `docs/adr/ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md` |
| V0.5 persistence/tests/contracts ADR | `docs/adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md` |
| V0.5 SQLite canary Runtime Owner checklist | `docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md` |
| Runtime operations runbook | `docs/deployment/RUNTIME_OPERATIONS_RUNBOOK.md` |
| Environment matrix | `docs/deployment/ENVIRONMENT_MATRIX.md` |
| Troubleshooting guide | `docs/deployment/TROUBLESHOOTING.md` |
| Security/access policy | `docs/reference/SECURITY_ACCESS_POLICY.md` |
| Data backup/retention policy | `docs/reference/DATA_BACKUP_RETENTION_POLICY.md` |
| Team onboarding guide | `docs/operations/TEAM_ONBOARDING_GUIDE.md` |
| UI V2 Claude Design handoff plan | `docs/plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md` |
| UI V2 Claude Design guideline | `docs/design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md` |
| UI V2 PM closeout / handoff | `docs/design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md` |
| UI V2 Codex parity handoff | `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` |
| UI V2 prototype source inventory | `docs/design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md` |
| UI V2 visual parity review | `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md` |
| UI V2 whole-system UX QC ledger | `docs/design/ui-design-v2/UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md` |
| UI V2 user-friendly improvement opportunities | `docs/design/ui-design-v2/UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` |
| UI V2 PM Dev task backlog | `docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` |
| UI V2 PM/UX review decision packet | `docs/design/ui-design-v2/UI_V2_PM_UX_REVIEW_DECISION_PACKET.md` |
| UI V2 V0.6 planning artifacts | `docs/design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md` |
| V0.6 UI V2 planning scope | `docs/plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md` |
| V0.6 UI V2 first-slice implementation plan | `docs/plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md` |
| UI V2 full-route fidelity audit | `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` |

---

## Project Completion Gate

Completion requires accepted work, verification, role-owned docs/logs, clear PR/merge state, and branch/worktree/folder cleanup or an explicit blocker. Use Definition of Ready before starting work and Definition of Done before marking any task, cycle, workstream, or version complete.

---

## Parallel Workstream Write Ownership

| File / Area | Write Owner | Rule |
|---|---|---|
| `CURRENT_SPRINT.md` | PM only | Dev/QA may read but must not update this file during W1/W2/W3 parallel work. |
| `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` | PM only | Preserve prompts for all workstreams; do not delete other workstream prompts. |
| W1 plan/files | W1 Dev / QA | Keep W1 updates inside W1-owned docs/branches until PM checkpoint. |
| W2 plan/files | W2 Dev / QA | Keep W2 updates inside W2-owned docs/branches until PM checkpoint. |
| W3 plan/files | W3 Dev / QA | Keep W3 updates inside W3-owned docs/branches until PM checkpoint. |
| V0.4 runtime/production files | Runtime Owner / Paperclip Owner / QA | Do not mix with V0.5 code/docs work; no secret values or live flag changes from non-runtime branches. |
| V0.5 foundation plan/ADR/test-contract work | PM / Architecture / Dev / QA | Use dedicated V0.5 branches/worktrees from `dev`; do not touch production runtime or dirty UI V2 artifacts. |
| UI V2 design artifacts | UX Owner / Claude Design | Accepted as V0.6 baseline; preserve as design source, not product runtime code. |
| V0.6 UI V2 route implementation | Frontend Dev / UX Owner / QA | Source-led full-fidelity recovery is QA-passed on `codex/v06-uiv2-full-fidelity`, with PM/UX re-review still required after reopened visual gaps. Use `UI_V2_CODEX_PARITY_HANDOFF.md` before any future patch and `VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` before opening Dev work from QC/opportunity rows. Route/component audits are evidence only; PM/UX visual review remains the acceptance gate for new gaps. |
| Team OS pilot docs | PM / Operations | Docs-only assumptions may proceed; product implementation waits for V0.6 shell/workflow stability. |

Completed V0.3 integration branch/worktree:

- Branch: `codex/integrate-v03-rux-into-dev`
- Worktree: `trisilar-task-hub-operating-model-integration`

Current Codex/Claude branch-worktree rule:

- Codex task branches use `codex/<version-or-short-scope>` unless PM assigns an existing `feature/*` branch.
- Claude task branches use `claude/<version-or-short-scope>` unless PM assigns an existing `feature/*` branch.
- Backup branches such as `codex/backup-*` are local safety refs, not active PR branches.
- New non-trivial work uses a dedicated sibling worktree, for example `trisilar-task-hub-v03-release-qa`.

Historical W3 branch/worktree:

- Branch: `feature/w3-paperclip-integration` (deleted after merge/QA cleanup)
- Worktree: `trisilar-task-hub-w3-paperclip` (deleted after merge/QA cleanup)

Parallel rule:

- W1/W2/W3 Dev agents must not share one feature branch.
- W1/W2/W3 Dev agents must not run in the same working directory.
- Before editing, each agent must run `git status --short --branch` and confirm the folder/branch match the assigned workstream.
- QA agents report evidence in the workstream handoff/doc, not `CURRENT_SPRINT.md`.
- PM updates `CURRENT_SPRINT.md` after QA pass, PM decision, or integration checkpoint.

---

## Next Actions - V0.6 UI V2 Re-review Handoff

```text
Role: Frontend Dev / UX Owner / QA / PM
Task: PM/UX decide on the completed desktop review-pending batch using `docs/design/ui-design-v2/UI_V2_DESKTOP_PM_UX_REREVIEW_2026_05_19.md` and `docs/design/ui-design-v2/UI_V2_PM_UX_REVIEW_DECISION_PACKET.md`. Choose accept, iterate, or hold for desktop V0.6 UI V2. Hold broad Dev work; continue only if PM/UX selects a specific `UIV2-FIX-*`, `UIV2-DEC-*`, `UIV2-QA-*`, or promoted `UIV2-UF-*` row, without broad restyling or a full rewrite.

Current release state:
- V0.4 production Paperclip intake is no longer blocking follow-on work.
- V0.4-PROD-04 passed the 24-hour read-only monitoring gate at 2026-05-16T08:03:14Z.
- Production Paperclip permanent enablement is complete with Review Queue as the mandatory human gate.
- V0.5 foundation is PM Accepted after deterministic tests, app-owned contracts, SQLite migration/import/export, hosted dev/demo SQLite canary, rollback proof, and short monitor checkpoints passed.
- Dev/demo `taskhub-dashboard.service` remains on `TASKHUB_STATE_BACKEND=sqlite` as a dev/demo canary with rollback proof available; production storage remains a separate Runtime Owner decision.

V0.6 baseline:
- Start from `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md`.
- Start from `docs/design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md`.
- Use `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md` for active gap rows and severity.
- Use `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` and `docs/design/ui-design-v2/UI_V2_COMPONENT_PARITY_AUDIT.md` as generated evidence only, not final PM/UX acceptance.
- Use `docs/logs/screenshots/v06-uiv2-full-fidelity/SCREENSHOT_MANIFEST.md` to route PM/UX review across baseline screenshots, targeted desktop evidence, forced state fixtures, interaction matrix captures, and whole-system QC outputs.
- Use `docs/design/ui-design-v2/UI_V2_PM_UX_REVIEW_DECISION_PACKET.md` for the current accept-candidate list, including the implemented `UIV2-FIX-004A` review packet.
- Start from `docs/plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md`.
- Start from `docs/design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md`.
- Use `docs/design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md` for PM/UX closeout, accepted paths, evidence, and hold boundaries that were satisfied by V0.5 acceptance.
- Use `docs/design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md` for route slice map, token migration map, component build sequence, responsive QA matrix, and Review Queue safety spec.
- Use `docs/plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` for the PM-owned repo backlog that maps QC/opportunity rows to Ready for Dev, Decision Needed, Opportunity Backlog, and Hold task candidates.
- Use `docs/plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md` for the original planning gate and implementation-ready conditions.
- Use `docs/plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md` for first-slice write ownership, route order, regression targets, and rollback boundary.
- S0-S10 route implementation evidence exists, and the latest source-led recovery closed Today mobile, Boards mobile, OKR / Portfolio desktop, Mobile More density, shared mobile shell title-stack, sidebar/icon primitive blockers, whole-app hardcode/control affordances, and Review / Docs / Today route-header false affordances. `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md` now lists 93 micro-QC rows for PM/UX triage, with `UIV2-FIX-005` implemented in R172 and true-mobile Calendar layout still tracked under `UIV2-DEC-004`; `UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md` explains the fix families, `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` separately lists 60 optional improvements, and `VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` maps them into blocker-first PM/Dev tasks. Automated QA passes, but PM/UX re-review is still the acceptance gate. If PM/UX selects a backlog row, open one source-led gap/opportunity row, patch one route/component slice, and regenerate evidence.
- Preserve Review Queue behavior and all public API/data contracts guarded by V0.5.
- Keep the current static app workflow unless a new ADR explicitly approves a build-system change.

Expected output for any future reopened slice:
- Prototype source contract referenced from prototype CSS/JS.
- Gap row added before code when a visual mismatch is fixed.
- Source-led slice implementation summary with changed files and route/component coverage.
- Updated `UI_V2_VISUAL_PARITY_REVIEW.md`, route audit, component audit, and affected screenshots.
- Browser regression evidence on desktop/mobile for the affected route or shared primitive.
- Confirmation that generated PASS is automated evidence only and PM/UX visual review remains final acceptance for the reopened gap.
- Confirmation that runtime, Cloudflare, secrets, live Paperclip flags, webhook auth, external integrations, Team OS, and Full Rewrite scope were not touched.

Rules:
- Do not touch production runtime for V0.6 UI work.
- Do not change Cloudflare policy, secrets, production Paperclip live flags, or webhook auth.
- Do not create Trello, Calendar, Google Tasks, or live Paperclip side effects.
- Do not implement Team OS product features inside V0.6 UI slices.
- Do not start a full rewrite; keep Full Rewrite as V0.8+ decision memo only.
```

## V0.4 Production Live

```text
Role: PM / Runtime Owner
Task: Keep production Paperclip intake live and Review Queue gated.

Current state:
- Production Task Hub remains on the separate taskhub-prod runtime at https://taskhub-prod.trisila.online.
- PAPERCLIP_WEBHOOK_ENABLED=true and PAPERCLIP_LIVE_MODE=permanent are the expected production state.
- Review Queue remains mandatory before Trello, Calendar, or Google Tasks writes.
- Rollback proof passed by restoring disabled mode, verifying disabled webhook 403, then re-enabling permanent mode.
- V0.5, UI V2, and Team OS work must not change production Paperclip runtime flags unless PM opens a separate runtime change.
```

**Attribution:** W3-04 cleanup implemented by Codex Dev, QA passed, PM accepted, merged to `dev@7ea4650`, and runtime cleanup executed by Runtime Owner / QA. W3-05 implemented by Codex Dev, reviewed by Codex QA, accepted by Codex PM, merged/deployed at `dev@2c302dc`, and closed out on `origin/dev@ff20e48`; standing dev/demo monitoring remains read-only. V0.3 RUX work was implemented and accepted in the dedicated V0.3 branch/worktree, integrated through PR #18, merged to `origin/dev@02fe7cf`, deployed to dev/demo, accepted complete after runtime QA, and PM accepted for main promotion through PR #20 after release-candidate verification. On 2026-05-15, Codex PM / Integration Owner aligned Codex/Claude branch-workflow docs and ran post-sync V0.3 release/integration QA from `codex/v03-branch-workflow-release-qa`. V0.4 Paperclip production repo readiness was implemented and locally verified by Codex Dev / QA on `codex/v04-paperclip-prod-integration`, integrated by Codex Integration Owner to `dev@7e069b5`, prepared as a separate production private runtime by Codex Runtime Owner, connected to production Paperclip Settings with a runtime-only signing secret, assigned a production Cloudflare Access service token, passed staged production canary, passed 24-hour read-only monitoring with production disabled and no side effects, then completed permanent enablement on `taskhub-prod` with rollback proof and no external side effects. V0.5 Foundation Hardening roadmap/FND-01 was routed by Codex PM, merged through PR #28 at `dev@aaf8f58`, implemented by Codex Dev / QA through PR #30 at `dev@e3380ac`, locally verified, hosted dev/demo SQLite canary passed on `taskhub-dashboard.service`, and PM accepted after short monitor checkpoints stayed clean; full rewrite work remains deferred.
