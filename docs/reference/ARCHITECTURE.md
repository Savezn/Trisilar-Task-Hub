# Architecture - Trisilar Task Hub

**Doc Role:** Current architecture reference
**Status:** Active
**Owner:** Dev / PM
**Last Updated:** 2026-05-08
**Updated by:** Codex PM

This document describes the current runtime architecture. Use ADRs for decisions that intentionally change this architecture.

---

## Runtime Shape

```text
Browser
  -> static frontend in public/
  -> Express server in server.js
  -> route modules in src/routes/
  -> model/normalization modules in src/models/
  -> Trello, Google, AI review, and local JSON/file-backed state
```

The app is currently a Node/Express application serving static frontend files and JSON APIs from the same process.

---

## Backend Map

| Path | Role |
|---|---|
| `server.js` | Express app, static serving, API mounting, frontend path fallback |
| `trello.js` | Trello API client and board/card fetch helpers |
| `src/routes/` | API route modules |
| `src/contracts/` | App-owned contract validators for route/model response shapes |
| `src/persistence/` | Staged persistence and migration helpers for app-owned runtime state |
| `src/models/trello.model.js` | Trello card normalization and metadata mapping |
| `review-store.js` | Review Queue persistence |
| `task-diff.js` | Task diff/review support logic |
| `scripts/` | Verification and smoke-test scripts |

API routes should return normalized data to the frontend whenever possible. Raw external API shapes should be contained in client/model modules.

Contract validators under `src/contracts/` are non-runtime guards for V0.5 tests and migration work. They lock app-owned shapes without changing public API responses unless an ADR explicitly approves a contract change.

SQLite helpers under `src/persistence/` are staged V0.5 utilities. They import app-owned JSON files from `APP_DATA_DIR` into `taskhub-state.sqlite`, create side-by-side JSON backups and manifests, and can export SQLite state back to JSON for rollback. Runtime state still defaults to JSON files. Setting `TASKHUB_STATE_BACKEND=sqlite` opts the runtime into SQLite-backed reads/writes for app-owned state, with JSON fallback before the first SQLite write, so PM/Runtime can canary and roll back without changing public API response shapes.

---

## Frontend Map

| Path | Role |
|---|---|
| `public/index.html` | Static shell and script load order |
| `public/style.css` | Global app styling |
| `public/app.js` | App bootstrap, shared helpers, remaining shared page behavior |
| `public/js/utils.js` | Shared utilities and global error fallback |
| `public/js/api.js` | Frontend API wrapper helpers |
| `public/js/state.js` | Shared frontend state |
| `public/js/router.js` | Page navigation and URL path sync |
| `public/js/pages/` | Page modules extracted from `app.js` |

The frontend uses plain script tags and globals. Script order is an architecture constraint until a future build system is adopted.

---

## Current Frontend Script Order

The intended order is:

```text
js/utils.js
js/api.js
js/state.js
js/router.js
js/pages/today.js
js/pages/review.js
js/pages/all-tasks.js
js/pages/boards.js
js/pages/calendar.js
js/pages/okr.js
js/pages/settings.js
app.js
```

Page modules may reference shared helpers loaded later only inside functions that run after `app.js` has loaded. Avoid top-level execution that depends on later scripts.

---

## Data Flow

```text
Trello API
  -> trello.js
  -> src/models/trello.model.js
  -> src/routes/trello.routes.js
  -> frontend API helpers
  -> page renderers
```

Review and local state flows through route modules and runtime-state helpers. Keep persistence behavior explicit when preparing deployment, and treat `TASKHUB_STATE_BACKEND=sqlite` as an environment-scoped canary flag until PM/Runtime accepts a broader storage switch.

---

## Error Handling Expectations

- Backend external API failures should map to useful HTTP status codes and friendly messages.
- Trello rate-limit responses should not become generic 500 responses.
- Frontend route/page failures should render fallback UI or show toast, not a white screen.
- Smoke checks should exit with code 0 only when all required checks pass.

---

## Architecture Change Rules

Create or update an ADR when changing:

- branch/environment workflow
- deployment/runtime architecture
- persistence model
- frontend build system or module system
- API data contracts
- Paperclip integration contract
- auth/access/security model
- test gate policy

Update this file when the current architecture changes.
