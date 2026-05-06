# Project-Specific Mandates (GEMINI.md) - Trisilar Task Hub

This file defines the foundational rules for the `trisilar-task-hub` project, aligning with `CLAUDE.md`.

## 1. Role Isolation (1 Role per Session)
- **Handoff Chain:** Dev → QA → PM → Dev... Never skip a role.
- **Role Awareness:** Adhere to the role specified by the user ("คุณ Dev", "คุณ QA", "คุณ PM").
  - **Dev:** Write/edit code, verify, commit + push.
  - **QA:** Read code, report bugs per AC (Evidence + Conclude PASS/FAIL).
  - **PM:** Update `CURRENT_SPRINT.md` (Completed, QA Log, Next Action) and `DEVELOPMENT_PLAN.md` (Progress tracker).
- **Confirmation:** If no role is explicitly stated, ask for clarification before proceeding.

## 2. File Reading Rules (Grep First)
**Never** read a full large file without checking size. Use targeted reads (±20 lines around target).
- `public/app.js`: Max 80 lines.
- `public/style.css`: Max 60 lines.
- `server.js`, `CURRENT_SPRINT.md`, `review-store.js`, `task-diff.js`: Read in full (ok).
- `DEVELOPMENT_PLAN.md`: Do not read unless PM syncing tracker.

## 3. Commit Convention
- **Format:** `Phase X — [task ID] brief description` OR `V0.1-PhX: brief description` for Version 0.1 work.
- **Content:** Describe **what changed and why**.
- **Staging:** Stage specific files only (`git add <file>`). **Never** use `git add .`.

## 4. End-of-Session Structure
Every session MUST end with a "Next session" block in this exact format:

```
**Next session:**

**Role:** [Dev / QA / PM]
**Task:** [task name]

[self-contained copy-paste prompt starting with "คุณ Role"]
```

## 5. Engineering Standards
- **Language:** Stick to **CommonJS JavaScript**. No TypeScript unless requested.
- **API Keys:** Never modify or log `.env`. Use `dotenv`.
- **Logic Location:**
  - `server.js`: Express routes & core API.
  - `trello.js`: Trello integration.
  - `public/`: Frontend assets (`app.js`, `style.css`).
  - `review-store.js`: Review session persistence.
