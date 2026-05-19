# UI Design V2

**Status:** V0.6 source-led full-route parity QA pass; main-readiness hardening pass complete; PM/UX accepted with logged visual deferrals for draft PR to `dev`
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex UX Owner / Frontend Design

This folder contains the UI Web Design Version 2 handoff, source inventory, recovery ledgers, and V0.6 prototype-fidelity evidence. The original Claude Design output has already been received; current V0.6 work uses the prototype source, parity handoff, screenshot matrix, screenshot manifest, whole-system UX micro-ledger, PM/UX decision packet, and main-readiness packet as the fidelity and release gate.

Latest recovery closed the PM/UX P1 screenshot-pack blockers for Today mobile, Boards mobile, OKR / Portfolio desktop, shared mobile shell title stack, sidebar/icon primitive parity, sidebar label-pill/Scope dot rhythm, topbar scope-picker chevron, Today Next Up eyebrow time order, app-pane/mobile shell drift, Today desktop routebar/task-row drift, All Tasks topbar/footer drift, and Weekly Focus lane primitive/density drift, plus the Mobile More P2 density row. The follow-up restored RUX visible-copy contracts for Review Queue, All Tasks, Calendar, Planner, and Docs / AI Trace while preserving prototype layout and existing production data flow. The latest source-led component sweep, PM/UX iterate batch, and R185 main-readiness hardening pass are QA-passed. `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md` records 93 route/section/control/state-level UX suspects, `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` records 60 non-blocking improvement opportunities, and `../../plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` maps those rows into PM-owned blocker-first Dev task candidates. Interaction screenshots live under `../../logs/screenshots/v06-uiv2-interaction-matrix/`. `UI_V2_PM_UX_REVIEW_DECISION_PACKET.md` records accept-with-deferrals, while `../../plans/VERSION_0_6_UI_V2_MAIN_READINESS_PACKET.md` records the current readiness estimate, passed gates, hold conditions, and `dev`-first release route. Automated PASS remains supporting evidence, not a replacement for PM/UX acceptance.

**Active Codex rule:** new UI V2 parity work must read `UI_V2_CODEX_PARITY_HANDOFF.md` first. Do not start from screenshot guessing; name the prototype source contract, log the gap, patch one route/component slice, then regenerate evidence.

Use the artifacts in this order:

1. `UI_V2_CODEX_PARITY_HANDOFF.md` for the active Codex implementation contract, source-led work loop, ECC boundary, and acceptance rules.
2. `UI_V2_PROTOTYPE_SOURCE_INVENTORY.md` for exact tokens, shell geometry, component primitives, route composition, mobile surfaces, states, and safety rules.
3. `prototype/Trisilar Task Hub UI V2.html` and the prototype CSS/JS source for the received UI V2 design canvas.
4. `UI_V2_VISUAL_PARITY_REVIEW.md` for PM/UX-facing gap rows, severity, and source-led recovery status.
5. `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md` for micro-QC rows by route, section, control, viewport, state, severity, evidence, expected/actual behavior, recommended fix, and PM decision need.
6. `UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md` for implementation-level explanations of the smallest UX issues and the proof expected for each fix family.
7. `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md` for non-blocking PM/UX opportunities that could make the app easier, faster, and more forgiving to use.
8. `../../plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md` for the PM-owned repo backlog that maps QC rows, fix-detail cards, and improvement opportunities into Ready for Dev, PM/UX Review Pending, Decision Needed, Opportunity Backlog, and Hold task candidates.
9. `UI_V2_PM_UX_REVIEW_DECISION_PACKET.md` for accept candidates, recommended decision choices, and the next decision-gated Dev slice.
10. `../../plans/VERSION_0_6_UI_V2_MAIN_READINESS_PACKET.md` for the current progress estimate, passed gates, hold conditions, and merge-readiness next action.
11. `UI_V2_PROTOTYPE_DEVIATION_LOG.md` for accepted prototype differences during V0.6 implementation.
12. `UI_V2_COMPONENT_PARITY_AUDIT.md` for generated component presence checks. This is a structural gate, not final visual acceptance.
13. `../../logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` for the V0.6 full-route prototype/production screenshot matrix and recovery status.
14. `../../logs/screenshots/v06-uiv2-full-fidelity/SCREENSHOT_MANIFEST.md` for the screenshot evidence routing map across baseline comparisons, targeted desktop fixes, forced states, interaction captures, and whole-system QC.
15. `../../logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-summary.md` for the desktop control state screenshot matrix and state fixture proof index.
16. `UI_V2_PM_CLOSEOUT_HANDOFF.md` for historical PM/UX planning closeout, paths, decision, evidence, hold condition, and next priority.
17. `UI_V2_V0_6_PLANNING_ARTIFACTS.md` for the route slice map, token migration map, component build sequence, responsive QA matrix, and Review Queue safety spec.
18. `../../plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md` for the PM/UX planning scope and V0.5 acceptance context.
19. `../../plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md` for the V0.6-S0 shell/navigation/token/state implementation boundary.
20. `UI_V2_DESIGN_SYSTEM_HANDOFF.md` for route concepts, tokens, component inventory, responsive notes, and future implementation handoff.
21. `UI_V2_ROUTE_SCREEN_SPECS.md` for route-by-route screen/state coverage.
22. `UI_V2_CLAUDE_OUTPUT_REVIEW.md` and `CLAUDE_DESIGN_UI_V2_GUIDELINES.md` for historical Claude output review and product/UX guardrails.
23. `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md` as historical/reference prompt material only; the Claude output has already been received.

These files do not change runtime, production, Cloudflare, Paperclip live behavior, Team OS product scope, or Full Rewrite boundaries. V0.6 UI implementation proceeds as frontend/design-system fidelity only: production data still comes from existing APIs/stores, while prototype fixtures remain layout reference.

Related docs:

- `UI_V2_CLAUDE_OUTPUT_REVIEW.md`
- `UI_V2_PM_CLOSEOUT_HANDOFF.md`
- `UI_V2_CODEX_PARITY_HANDOFF.md`
- `UI_V2_PROTOTYPE_SOURCE_INVENTORY.md`
- `UI_V2_VISUAL_PARITY_REVIEW.md`
- `UI_V2_WHOLE_SYSTEM_UX_QC_LEDGER.md`
- `UI_V2_WHOLE_SYSTEM_UX_QC_FIX_DETAIL_APPENDIX.md`
- `UI_V2_USER_FRIENDLY_IMPROVEMENT_OPPORTUNITY_LEDGER.md`
- `../../plans/VERSION_0_6_UI_V2_PM_DEV_TASK_BACKLOG.md`
- `../../plans/VERSION_0_6_UI_V2_MAIN_READINESS_PACKET.md`
- `UI_V2_PM_UX_REVIEW_DECISION_PACKET.md`
- `prototype/Trisilar Task Hub UI V2.html`
- `UI_V2_V0_6_PLANNING_ARTIFACTS.md`
- `../../plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md`
- `../../plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`
- `CLAUDE_DESIGN_UI_V2_PROMPT_PACKET.md`
- `UI_V2_ROUTE_SCREEN_SPECS.md`
- `UI_V2_DESIGN_SYSTEM_HANDOFF.md`
- `UI_V2_PROTOTYPE_DEVIATION_LOG.md`
- `UI_V2_COMPONENT_PARITY_AUDIT.md`
- `../../logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`
- `../../logs/screenshots/v06-uiv2-full-fidelity/SCREENSHOT_MANIFEST.md`
- `../../logs/screenshots/v06-uiv2-interaction-matrix/interaction-matrix-summary.md`
- `../../logs/QA_V0_6_UI_V2_FULL_FIDELITY_ALIGNMENT.md`
- `../../plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md`
- `../ui-design-v1-0/README.md`
- `../../plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`
- `../../logs/V0_3_RUX_FINDINGS.md`
