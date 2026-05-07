# Project-Specific Mandates (GEMINI.md) - Trisilar Task Hub

This file defines the foundational rules for the `trisilar-task-hub` project, aligning with `CLAUDE.md`.

## 1. Role Isolation (1 Role per Session)
- **Project-State Flow:** Dev -> QA -> PM -> Dev is the default for behavior-changing work. It is not an instruction to rotate agents every session.
- **Role Awareness:** Adhere to the role specified by the user ("คุณ Dev", "คุณ QA", "คุณ PM").
  - **Dev:** Write/edit code, verify, commit + push.
  - **QA:** Read code, report bugs per AC (Evidence + Conclude PASS/FAIL).
  - **PM:** Update `CURRENT_SPRINT.md` (Completed, QA Log, Next Action) and `DEVELOPMENT_PLAN.md` (Progress tracker).
- **Confirmation:** If no role is explicitly stated, ask for clarification before proceeding.
- **Agent Continuity:** Stay with the same AI agent when possible. Switch agents only when needed, such as rate limits, tool availability, or context limits. When switching agents, keep the same role unless the project state has changed.

### Workflow by task risk
| Task type | Role workflow |
|---|---|
| Tiny docs, typo, rename, no behavior risk | Dev -> PM |
| Refactor, extraction, route, data flow | Dev -> QA -> PM |
| Bug found by QA | QA -> Dev Fix -> QA Recheck -> PM |
| Planning only | PM -> Dev |
| Production-ish behavior or critical API | Dev -> QA -> Dev Fix -> QA Recheck -> PM |

Rules:
- If no code behavior changed, QA is optional.
- If behavior changed, QA is required.
- If QA finds a bug, PM should wait until QA Recheck passes or explicitly records accepted risk.
- Agent handoff can happen at any point without changing the role, for example `Codex Dev -> Claude Dev continuation -> QA`.

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

## 4. AI Work Attribution
This project is worked on by multiple AI agents: Gemini, Claude, and Codex. Every
agent must make ownership clear in the documents that matter for handoff.

Rule update added by: Codex (2026-05-07).

Required rule:
- When Gemini creates, changes, verifies, reviews, or plans work that is recorded
  in project documentation, add an attribution such as `Agent: Gemini`,
  `Implemented by: Gemini`, `Reviewed by: Gemini`, or `Updated by: Gemini`.
- Add attribution in every necessary tracking or handoff document, including
  `CURRENT_SPRINT.md`, `DEVELOPMENT_PLAN.md`, QA logs, release notes, task
  briefs, next-session prompts, and any newly created project rule documents.
- If a table already has an owner/agent column, fill that column. If not, add a
  short note in the relevant row or section.
- Do not claim work done by another agent. If continuing another agent's work,
  say so explicitly, for example: `Continues Codex implementation` or
  `QA follow-up after Claude review`.
- Handoff prompts should name the prior agent and commit hash when available.

## 5. End-of-Session Structure
Every session MUST end with a "Next session" block in this exact format:

```
**Next session:**

**Role:** [Dev / QA / PM]
**Task:** [task name]

[self-contained copy-paste prompt starting with "คุณ Role"]
```

## 6. Engineering Standards
- **Language:** Stick to **CommonJS JavaScript**. No TypeScript unless requested.
- **API Keys:** Never modify or log `.env`. Use `dotenv`.
- **Logic Location:**
  - `server.js`: Express routes & core API.
  - `trello.js`: Trello integration.
  - `public/`: Frontend assets (`app.js`, `style.css`).
  - `review-store.js`: Review session persistence.
