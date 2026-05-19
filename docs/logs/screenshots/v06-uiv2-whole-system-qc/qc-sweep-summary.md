# UI V2 Whole-System QC Sweep Summary

- Base URL: http://127.0.0.1:3032
- Generated: 2026-05-18T01:49:19.907Z
- Results: 60
- Tallies: {"navigationErrors":0,"consoleOrPageErrors":0,"overflow":0,"unnamedControls":7,"clipped":2,"emojiLike":0,"secretHits":4,"disabledMismatch":11}

## Targeted interactions
- PASS /docs :: Topbar Docs Filter opens dialog, applies status, clears, closes Escape :: {"routePath":"/docs","actionName":"Topbar Docs Filter opens dialog, applies status, clears, closes Escape","ok":true,"dialogVisible":false,"activeText":""}
- PASS /today :: Scope picker opens listbox and Escape closes :: {"routePath":"/today","actionName":"Scope picker opens listbox and Escape closes","ok":true,"listboxVisible":true,"optionCount":2,"closesOnEscape":true}
- PASS /settings :: Settings connection/manage controls expose labels :: {"routePath":"/settings","actionName":"Settings connection/manage controls expose labels","ok":true,"manageCount":20,"sample":[{"text":"Manage groups and visibility","disabled":false,"cls":"icon-btn"},{"text":"Access & policy","disabled":false,"cls":"sl"},{"text":"Manage","disabled":false,"cls":"btn sm "},{"text":"Manage","disabled":false,"cls":"btn sm "},{"text":"Manage","disabled":false,"cls":"btn sm "},{"text":"Manage","disabled":false,"cls":"btn sm ai"},{"text":"Policy","disabled":false,"cls":"btn sm "},{"text":"Save draft","disabled":false,"cls":"btn primary sm"},{"text":"Visible","disabled":false,"cls":"vis-toggle"},{"text":"Visible","disabled":false,"cls":"vis-toggle"},{"text":"Visible","disabled":false,"cls":"vis-toggle"},{"text":"Visible","disabled":false,"cls":"vis-toggle"}]}

Correction: the broad sweep's first `/docs` locator was too loose and clicked the topbar Scope-style filter before the route-local Docs Filter. A direct follow-up check on `#docs-topbar-filter` passed with a visible `role="dialog"` popover and captured `qc-docs-filter-dialog-desktop-1440x900.png`.

## Routes with machine-visible suspects
- All Tasks desktop 1440x900: overflow=0; console=0; pageErrors=0; unnamed=1; clipped=0; emoji=0; secretHits=; disabledMismatch=0; screenshot=docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-all-tasks-desktop-1440x900.png
- OKR / Portfolio desktop 1440x900: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- Settings desktop 1440x900: overflow=0; console=0; pageErrors=0; unnamed=8; clipped=0; emoji=0; secretHits=secret,token; disabledMismatch=1; screenshot=docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-settings-desktop-1440x900.png
- All Tasks laptop 1366x768: overflow=0; console=0; pageErrors=0; unnamed=1; clipped=0; emoji=0; secretHits=; disabledMismatch=0; screenshot=
- OKR / Portfolio laptop 1366x768: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- Settings laptop 1366x768: overflow=0; console=0; pageErrors=0; unnamed=8; clipped=0; emoji=0; secretHits=secret,token; disabledMismatch=1; screenshot=
- All Tasks tablet 1024x768: overflow=0; console=0; pageErrors=0; unnamed=1; clipped=0; emoji=0; secretHits=; disabledMismatch=0; screenshot=
- OKR / Portfolio tablet 1024x768: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- Settings tablet 1024x768: overflow=0; console=0; pageErrors=0; unnamed=8; clipped=0; emoji=0; secretHits=secret,token; disabledMismatch=1; screenshot=
- Boards Monitor app-pane 747x910: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- OKR / Portfolio app-pane 747x910: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- Settings app-pane 747x910: overflow=0; console=0; pageErrors=0; unnamed=8; clipped=0; emoji=0; secretHits=secret,token; disabledMismatch=1; screenshot=docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-settings-app-pane-747x910.png
- OKR / Portfolio mobile 390x844: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- Docs / AI Trace mobile 390x844: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=2; emoji=0; secretHits=; disabledMismatch=0; screenshot=
- OKR / Portfolio mobile-small 375x667: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=0; emoji=0; secretHits=; disabledMismatch=1; screenshot=
- Docs / AI Trace mobile-small 375x667: overflow=0; console=0; pageErrors=0; unnamed=0; clipped=2; emoji=0; secretHits=; disabledMismatch=0; screenshot=docs/logs/screenshots/v06-uiv2-whole-system-qc/qc-docs-ai-trace-mobile-small-375x667.png
