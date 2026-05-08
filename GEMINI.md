# Project-Specific Mandates (GEMINI.md) - Trisilar Task Hub

**Doc Role:** Gemini-specific agent operating rules
**Status:** Active
**Last Updated:** 2026-05-08 · **Updated by:** Codex PM

This file defines the foundational rules for the `trisilar-task-hub` project, aligning with `CLAUDE.md`.

## 1. Role Isolation (1 Role per Session)
- **Project-State Flow:** Dev -> QA -> PM -> Dev is the default for behavior-changing work. It is not an instruction to rotate agents every session.
- **Role Awareness:** Adhere to the role specified by the user ("คุณ Dev", "คุณ QA", "คุณ PM").
  - **Dev:** Write/edit code, verify, commit + push.
  - **QA:** Read code, report bugs per AC (Evidence + Conclude PASS/FAIL).
  - **PM:** Update `CURRENT_SPRINT.md` (current snapshot / active tasks / Next Action), `docs/logs/QA_LOG.md` (QA/completed work history), and `DEVELOPMENT_PLAN.md` only when syncing the roadmap tracker.
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
- `docs/plans/V0_2_WORKSTREAM_PLAN.md`: Read for V0.2 branch/workstream context.
- `docs/logs/QA_LOG.md`: Read only when QA/completed work history is needed.
- `docs/logs/DECISION_LOG.md`: Read only for PM decision/phase context.
- `DEVELOPMENT_PLAN.md`: Do not read unless PM syncing tracker.

## 3. Commit Convention
- **Format:** `Phase X — [task ID] brief description` OR `V0.1-PhX: brief description` for Version 0.1 work.
- **Content:** Describe **what changed and why**.
- **Staging:** Stage specific files only (`git add <file>`). **Never** use `git add .`.

## 3.1 Encoding Rule
- For Markdown files that contain Thai, emoji, or typographic punctuation, read
  and write UTF-8 explicitly. Do not use broad rewrites through PowerShell
  default encoding or ANSI/Windows-1252 paths.
- After editing UTF-8-heavy Markdown, verify no mojibake markers remain
  (for example UTF-8 bytes rendered as Windows-1252 text).

## 4. AI Work Attribution
This project is worked on by multiple AI agents: Gemini, Claude, and Codex. Every
agent must make ownership clear in the documents that matter for handoff.

Rule update added by: Codex (2026-05-07).

Required rule:
- When Gemini creates, changes, verifies, reviews, or plans work that is recorded
  in project documentation, add an attribution such as `Agent: Gemini`,
  `Implemented by: Gemini`, `Reviewed by: Gemini`, or `Updated by: Gemini`.
- Add attribution in every necessary tracking or handoff document, including
  `CURRENT_SPRINT.md`, `docs/logs/QA_LOG.md`, `DEVELOPMENT_PLAN.md`, release notes, task
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

## 6. Engineering Standards (Agile Execution Mode)
- **Velocity Priority:** Focus on rapid delivery (5-10 min per session). Aim for 90% functional completeness.
- **Task-Centric:** Execute only what is explicitly requested. Do not add proactive fixes or extra defensive code.
- **Consultative Risk Handling:** If a high-risk area or potential error is found, **notify the user first** instead of fixing it immediately.
- **Efficient Research:** Skip deep dependency searches unless critical. Rely on iterative fixes for minor misses.
- **Consolidated Documentation:** Keep `CURRENT_SPRINT.md` short. Put QA/completed work history in `docs/logs/QA_LOG.md`; update `DEVELOPMENT_PLAN.md` only for roadmap tracker changes.
- **Minimal Validation:** Run smoke tests once per task completion, not after every surgical edit.
- **Direct Action:** Prefer `write_file` for complete updates over multiple complex `replace` calls.
- **Language:** Stick to **CommonJS JavaScript**. No TypeScript unless requested.
- **API Keys:** Never modify or log `.env`. Use `dotenv`.
- **Logic Location:**
  - `server.js`: Express routes & core API.
  - `trello.js`: Trello integration.
  - `public/`: Frontend assets (`app.js`, `style.css`).
  - `review-store.js`: Review session persistence.
