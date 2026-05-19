# UI V2 Full-Route Fidelity Audit Matrix

Generated: 2026-05-19T08:27:35.071Z
Production base: http://127.0.0.1:3035
Prototype base: http://127.0.0.1:55525

Scope: frontend/design-system visual QA only. API responses were controlled in-browser fixtures; no runtime, Cloudflare, secrets, live Paperclip behavior, webhook auth, or AI harness behavior was changed.

Coverage / no-overflow is measured separately from component parity. A route only qualifies for full-fidelity acceptance when both are PASS or an approved deviation is logged.

| Route | Prototype artboard | Production route | Coverage / no-overflow | Component parity | State coverage | Deviation | Action / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Today | d-today | /today | PASS - first viewport priority PASS | PASS | populated; calendar disconnected; review handoff populated | None | [compare](screenshots/v06-uiv2-full-fidelity/compare-today-desktop-1440x900.png) |
| Review Queue | d-review | /review | PASS - mobile approve/reject PASS | PASS | populated; missing-owner safety proposal; side-effect disclosure | Logged: safety controls retained beyond prototype density. | [compare](screenshots/v06-uiv2-full-fidelity/compare-review-desktop-1440x900.png) |
| All Tasks | d-tasks | /all | PASS | PASS | populated; hidden-board filtering; overdue/today metadata | Logged: hidden-board disclosure can appear above mobile task rows when workspace visibility excludes a board. | [compare](screenshots/v06-uiv2-full-fidelity/compare-all-desktop-1440x900.png) |
| Boards Monitor | d-boards | /boards | PASS | PASS | populated; board warnings; hidden-board count | None | [compare](screenshots/v06-uiv2-full-fidelity/compare-boards-desktop-1440x900.png) |
| Calendar | d-cal | /calendar | PASS | PASS | disconnected Calendar plus Trello/review-derived schedule | Logged: controlled QA can show disconnected Calendar state instead of populated prototype fixture. | [compare](screenshots/v06-uiv2-full-fidelity/compare-calendar-desktop-1440x900.png) |
| Planner | d-planner | /planner | PASS | PASS | Google Tasks disconnected; Trello deadlines remain visible | Logged: controlled QA can show disconnected Google Tasks state instead of populated prototype fixture. | [compare](screenshots/v06-uiv2-full-fidelity/compare-planner-desktop-1440x900.png) |
| OKR / Portfolio | d-okr | /okr | PASS | PASS | populated objective/KR rows from Trello metadata | None | [compare](screenshots/v06-uiv2-full-fidelity/compare-okr-desktop-1440x900.png) |
| Weekly Focus | d-focus | /focus | PASS - no vertical wrap PASS | PASS | four lanes; Review AI lane; blocked lane; schedule lane | None | [compare](screenshots/v06-uiv2-full-fidelity/compare-focus-desktop-1440x900.png) |
| Docs / AI Trace | d-trace | /docs | PASS | PASS | linked and orphan evidence docs; audit timeline | None | [compare](screenshots/v06-uiv2-full-fidelity/compare-docs-desktop-1440x900.png) |
| Settings | d-settings | /settings | PASS - mobile More PASS | PASS | integration controls; no-secret display; workspace controls | Logged: Paperclip runtime controls stay collapsed by default for no-secret operational safety. | [compare](screenshots/v06-uiv2-full-fidelity/compare-settings-desktop-1440x900.png) |

## Responsive Viewports

- Desktop route pairs: 1440x900.
- Production responsive screenshots: 1366x768, 1024x768, app-pane 747x910, 390x844, and 375x667.
- Mobile tab pairs: Today, Review, Tasks, Boards, More at 390x844.
- Horizontal overflow tolerance: <= 2px.
- Console/page errors: zero required unless explicitly recorded in the row action.
