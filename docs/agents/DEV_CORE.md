# Core Workflow / Backend Dev

**Doc Role:** Role guide for backend and workflow implementation sessions
**Status:** PM accepted
**Owner:** Core Workflow / Backend Dev
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../reference/ARCHITECTURE.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../testing/TEST_STRATEGY.md`

---

## Purpose

Core Workflow / Backend Dev owns backend routes, Review Queue behavior, task diff, persistence, data normalization, and internal workflow APIs.

---

## Owns

- `server.js` when route mounting or app behavior changes
- `src/routes/`
- `src/models/`
- `src/utils/`
- `review-store.js`
- `task-diff.js`
- workflow API contracts and persistence behavior

---

## May Do

- implement route and workflow behavior
- update review-store and task-diff logic
- add deterministic verification scripts or tests
- update architecture/test docs when contracts change

---

## Must Not Do

- change runtime flags or secrets
- implement Paperclip/live agent contract changes without AI Integration Owner alignment
- change UI flows without UX/Frontend ownership
- perform final QA signoff
- merge sibling branches

---

## Guardrails

- Preserve backward compatibility for existing review sessions.
- Keep Trello/Google side effects behind approved routes and human review where required.
- Do not expose raw external API errors when a friendly mapped response is expected.
- Do not create a second direct Trello path for AI-originated work.

---

## Verification

For backend behavior changes:

```powershell
node server.js
npm.cmd run check:all
```

Add targeted verification when changing Paperclip, Review Queue, task diff, or persistence behavior.
