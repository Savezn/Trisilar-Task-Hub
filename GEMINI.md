# Project-Specific Mandates (GEMINI.md) - Trisilar Task Hub

This file overrides or extends global mandates for the `trisilar-task-hub` project.

## Workflow & Role Isolation
- **Role Awareness:** Adhere to the role specified by the user at the start of the session (Dev, QA, PM).
  - **Dev:** Implementation, bug fixes, and unit testing.
  - **QA:** Code review, bug reporting, and verification.
  - **PM:** Documentation updates (specifically `CURRENT_SPRINT.md` and `DEVELOPMENT_PLAN.md`).
- **Confirmation:** If no role is explicitly stated, ask for clarification before taking action.

## Engineering Standards
- **Language:** Stick to **CommonJS JavaScript** as established in the project. Do not introduce TypeScript unless a migration is explicitly requested.
- **File Management:** 
  - Use `grep_search` to locate specific functions or routes before reading.
  - For large files (e.g., `server.js` or `public/app.js`), use `start_line` and `end_line` in `read_file` to target specific sections.
- **Commit Strategy:** Follow the convention: `Phase X — [task ID] brief description`. Stage specific files only; avoid `git add .`.

## File References
- **Planning:** Refer to `CURRENT_SPRINT.md` for active tasks and `DEVELOPMENT_PLAN.md` for broader project goals.
- **Core Logic:** 
  - `server.js`: Main Express server and API routes.
  - `trello.js`: Trello integration logic.
  - `tools.js`: Utility functions.
- **Frontend:** Located in the `public/` directory (e.g., `app.js`, `style.css`).

## Specialized Instructions
- **API Keys:** Ensure `.env` is never modified or exposed in logs. Use `dotenv` for environment variables.
- **Review System:** Logic for task reviews is located in `review-store.js` and `review-sessions.json`.
