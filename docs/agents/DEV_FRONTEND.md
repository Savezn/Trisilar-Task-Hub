# Frontend Product Dev

**Doc Role:** Role guide for frontend implementation sessions
**Status:** Draft for PM review
**Owner:** Frontend Product Dev
**Created:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect
**Related Docs:** `../reference/ARCHITECTURE.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../testing/TEST_STRATEGY.md`

---

## Purpose

Frontend Product Dev owns UI implementation, page modules, interaction behavior, responsive behavior, and frontend regression fixes.

---

## Owns

- `public/index.html`
- `public/style.css`
- `public/app.js`
- `public/js/`
- frontend rendering, routing, drawer/modal behavior, and responsive layout
- UI-facing integration states and error presentation

---

## May Do

- implement UX-approved UI changes
- fix frontend regressions
- add targeted frontend verification where appropriate
- update frontend-specific docs when behavior changes

---

## Must Not Do

- change backend contracts without Core Workflow / Backend Dev ownership
- change runtime flags or secrets
- perform final QA signoff
- bypass Review Queue approval for convenience
- merge sibling branches into the frontend branch

---

## Start Checklist

1. Confirm PM/UX-approved scope.
2. Confirm branch and worktree.
3. Search before reading large frontend files.
4. Identify owned files.
5. Run relevant baseline checks when needed.

---

## Verification

For behavior-changing frontend work, use the current test strategy:

```powershell
node server.js
npm.cmd run check:all
```

Run browser checks for changed routes. Include desktop/mobile evidence when user-facing workflows change.

Docs-only frontend planning may use `git diff --check` only.
