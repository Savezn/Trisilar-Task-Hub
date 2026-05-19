# UI V2 Prototype Source Inventory

**Status:** Source-led implementation reference for V0.6 UI V2 full-fidelity recovery.

**Required companion:** `UI_V2_CODEX_PARITY_HANDOFF.md` is the operating contract for using this inventory. This file describes the prototype target; the handoff defines the work loop for turning a target into a narrow production patch with evidence.

**Authoritative prototype source:**
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\css\tokens.css`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\css\shell.css`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\css\screens.css`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\js\components.jsx`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\js\screens-1.jsx`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\js\screens-2.jsx`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\js\screens-3.jsx`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\js\screens-mobile.jsx`
- `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v06-s0-ui-foundation\docs\design\ui-design-v2\prototype\js\screens-aux.jsx`

## How Codex Must Use This Inventory

1. Select one route, mobile tab, state, or shared primitive.
2. Cite the exact prototype source file and component/section in the gap row before editing.
3. Patch the matching production route/component narrowly.
4. Regenerate `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`, `UI_V2_COMPONENT_PARITY_AUDIT.md`, and screenshots when the slice affects visible UI.
5. Treat generated PASS as an automated gate only. PM/UX visual acceptance remains separate.

Do not use this inventory to copy fixture data into production. Prototype fixtures are layout reference only; production data remains from the existing APIs/stores.

## Design Tokens

| Category | Prototype Requirements |
| --- | --- |
| Surfaces | `--bg #f6f7f9`, `--surface #fff`, `--surface-2 #fbfcfd`, `--surface-3 #eef0f4`, `--surface-sunk #e9ecf1`, `--hover #f1f3f7`, `--selected #e6ecf8` |
| Ink | `--ink #0b0d12`, `--ink-2 #2b2f38`, `--ink-3 #555b67`, `--ink-4 #8a909c`, `--ink-5 #b8bdc8`, `--ink-6 #d6dae2` |
| Action color | Cobalt brand: `--brand #1e58e6`, `--brand-2 #3b6df7`, `--brand-soft #e6edfd`, `--brand-mid #b8c8f7`, `--brand-ink #0a3290`, `--brand-tint #f3f6fe` |
| Agent color | Violet AI/Paperclip/review: `--ai #7c3aed`, `--ai-soft #f3eefe`, `--ai-mid #d6c5fb`, `--ai-ink #4c1d95`, `--ai-tint #faf7fe` |
| Status color | Overdue red, warning amber, connected green, schedule/info blue. Every status must pair color with text/glyph. |
| Geometry | Radius is compact: `3px`, `4px`, `6px`, `8px`, `12px`. Default cards/panels should not exceed 8px unless prototype does. |
| Spacing | 4pt scale from `4px` to `56px`; dense operational rows use 8-12px vertical rhythm. |
| Type | Onest for UI text. JetBrains Mono for run IDs, env/build/status strip, telemetry, audit IDs, table counts. |
| Shell | Sidebar `220px`, topbar `48px`, black status strip `24px`. |

## Element Specs

| Element | Prototype Shape |
| --- | --- |
| `btn` | 30px height, 6px radius, 1px line, Onest 13/500, icon+label. Primary is cobalt. AI action is violet. Danger is overdue red. |
| `iconbtn` | 30x30 square, transparent by default, restrained hover, no emoji glyphs. |
| `chip` | Small uppercase pill, squared 3px radius, semantic tone classes: muted, brand, ai, ok, warn, over, info. Small chip height 16px. |
| `due` | Inline date marker with 4px vertical color bar and tabular text; over/warn/upcoming/none/done states. |
| `board-tag` | 8px colored square plus board name, never a large badge. |
| `avatar-stack` | 18px small circles, overlapping by 6px, ghost state for unassigned. |
| `kv` | Mono key plus sans value; env/source/run metadata remains compact and scannable. |
| `diff` | Explicit glyph plus label: Create new, Update existing, Possible duplicate, Missing context. |
| `risk` | Five segment meter plus LOW/MED/HIGH label. |
| `confidence` | Horizontal bar plus percent. |
| `state-card` | Icon block, title, description, actions; plain-language safe copy only. |

## Component Specs

| Component | Prototype Shape |
| --- | --- |
| `StatusStrip` | Black top strip with env, build, workspace, trello, gcal, paperclip, gtasks, last sync. Uses JetBrains Mono and small status dots. |
| `Sidebar` | 220px rail, logo/title, search, Workspace nav, Scope section, connector footer. Active route has soft fill and cobalt rail. |
| `Topbar` | 48px bar with route crumb, route title, scope picker, refresh, bell, actions. |
| `RouteBar` | In-content page header; display title, supporting metadata row, optional actions. |
| `Panel` | Flat work surface with border, optional head/body/foot. No nested decorative cards. |
| `StatStrip` | Four horizontal cells, compact labels, tabular values, restrained border. |
| `TaskRow` | Dense row: checkbox, title, board/list/checklist/source metadata, labels, owners, due. |
| `TaskTable` | Dense table with sticky-like head treatment, selection column, Task, Board/List, Owner, Due, Status, Source, Progress. |
| `IntegrationRow` | 24px square icon, name/meta, status chip, primary action. |
| `BulkBar` | Dark Review Queue selection bar with selected count and Approve/Reject/Hold actions. |
| `InspectionDrawer` | Right rail/drawer with source trace, diff, evidence, side effects, audit timeline, and final actions. |
| `MobileShell` | Phone status row, mobile topbar, scrolling content, fixed five-tab bottom nav. |

## Route Composition Specs

| Route | Prototype Sections |
| --- | --- |
| Today | RouteBar, 4-cell stat strip, dark Next Up hero, Today's Work panel, AI Review Queue handoff, Today on Calendar, Cross-board Signals. |
| Review Queue | RouteBar with source/env/auth metadata, dark BulkBar, session/proposal list, right InspectionDrawer. Diff/risk/confidence/source/side effects visible before approval. |
| All Tasks | RouteBar, segmented table/list/group modes, filterbar, dense table with 8 columns, footer count/export. |
| Boards Monitor | RouteBar, segmented modes, stat strip, filterbar, 3-column board health cards with warnings and sparkline. |
| Calendar | RouteBar for month, source legend, month grid, Google/Trello/AI/overdue visual separation. |
| Planner | RouteBar, Google Tasks disconnected notice, two source columns, Trello deadline list, add controls only when connected. |
| OKR / Portfolio | RouteBar, stat strip, objective rows, progress bars, KR rows with board links. |
| Weekly Focus | RouteBar, four lanes: Do Now, Review AI, Waiting/Blocked, Schedule. Titles must wrap normally, never vertical letter stacking. |
| Docs / AI Trace | RouteBar, filterbar, trace table, inspecting evidence card, audit timeline, orphan/missing-link state. |
| Settings | RouteBar, two-column settings grid, soft side section nav, Integrations panel, Paperclip/AI intake panel, Workspace/BU groups panel. |

## Mobile Specs

| Mobile Surface | Prototype Requirements |
| --- | --- |
| Bottom nav | Exactly five tabs: Today, Review, Tasks, Boards, More. |
| Today | Next Up card first, 2-up stat cards, Review Queue handoff, Today's work list. |
| Review | Session card first, then proposal cards with diff/risk/confidence and Reject/Approve visible in first meaningful viewport. |
| Tasks | Search, horizontal filter chips, task cards with board/list/due/owner metadata. |
| Boards | 2-up stats, board cards with health counts and warnings. |
| More | Route list for Calendar, Planner, OKR / Portfolio, Weekly Focus, Docs / AI Trace, Settings; integrations; status block. More must not be Settings-only. |

## Safety And UX Rules

- Trello remains execution surface.
- Task Hub remains command/review layer.
- Review Queue gates AI-originated external side effects.
- No automatic Trello, Calendar, or Google Tasks writes without approval.
- Secrets, tokens, signing material, raw OAuth errors, headers, and `.env` wording must never be displayed.
- Disconnected states name the integration and owner/action in plain language.
- Any deviation from prototype must be logged with rationale and evidence before it is accepted.
