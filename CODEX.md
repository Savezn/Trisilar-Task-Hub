# Trisilar Task Hub - Project Rules for Codex

This file is the Codex-specific companion to `CLAUDE.md`. It preserves the
project workflow rules, while adapting the execution details to how Codex works
in this workspace.

## 1. Role Isolation

Each session has exactly one role. Do not switch roles mid-session.

| Role | What to do | What not to do |
|---|---|---|
| **Dev** | Write/edit code, verify, commit, push | Run a separate QA pass, update PM trackers |
| **QA** | Read code, trace behavior, report bugs | Fix code, update PM trackers |
| **PM** | Update sprint/planning docs | Write code, run product QA |

How to know the role:
- The user's opening message should say `Dev`, `QA`, or `PM`.
- If no role is stated, ask before proceeding on Dev, QA, or PM work.
- For small repository-maintenance requests that are clearly outside the
  Dev/QA/PM handoff chain, complete the request and state what was changed.

## 2. File Reading Rules

Use grep first, then targeted reads. Do not read full large files when a narrow
lookup is enough.

Required pattern for code edits:

```text
1. Search with rg for the function, route, selector, or section name.
2. Read only the nearby range around the match.
3. Edit only the targeted section.
4. Re-search to verify references and call sites.
```

Project file guidance:

| File | Rule |
|---|---|
| `public/app.js` | Large file. Search first; read small ranges only. |
| `public/style.css` | Large file. Search first; read small ranges only. |
| `server.js` | Small enough to read fully when useful. |
| `DEVELOPMENT_PLAN.md` | Avoid unless PM syncing phase history or tracker. |
| `CURRENT_SPRINT.md` | OK to read fully. |
| `review-store.js` | OK to read fully. |
| `task-diff.js` | OK to read fully. |

Preferred commands:

```powershell
rg -n "functionName" public/app.js
Get-Content public/app.js | Select-Object -Skip <offset> -First <limit>

rg -n "\.class-name" public/style.css
Get-Content public/style.css | Select-Object -Skip <offset> -First <limit>

rg -n "router\.(get|post|put|delete)|app\.(get|post|put|delete)" server.js src
```

## 3. Editing Rules

- Prefer existing project patterns over new abstractions.
- Keep edits scoped to the requested feature or bug.
- Use `apply_patch` for manual file edits.
- Use Python splice only when the user explicitly asks for UTF-8 safe block moves
  or large mechanical extraction.
- For Markdown files that contain Thai, emoji, or typographic punctuation, read
  and write UTF-8 explicitly. Do not use broad rewrites through PowerShell
  default encoding or ANSI/Windows-1252 paths.
- After editing UTF-8-heavy Markdown, verify no mojibake markers remain
  (for example UTF-8 bytes rendered as Windows-1252 text).
- Never revert unrelated user changes.
- Never use `git add .`; stage specific files only.

## 4. Verification

Match verification depth to risk.

Common checks:

```powershell
node --check public/app.js
node --check public/js/pages/<page>.js
node server.js
```

Smoke-test stable endpoints when the server is involved:

```text
GET /
GET /api/config
GET /api/calendar/status
GET /api/reviews
```

For frontend changes, verify the page in a browser when possible. If the in-app
browser viewport or local browser availability blocks a full visual check, record
that limitation clearly and provide the checks that did run.

## 5. Commit Convention

Dev sessions normally end with a commit and push when the user asked for a task
implementation.

```powershell
git add <specific files only>
git commit -m "V0.1-PhX: brief description of what changed"
git push
```

Commit messages should describe what changed and why. For Version 0.1 work, use:

```text
V0.1-PhX: <task ID or concise task> <brief description>
```

## 6. AI Work Attribution

This project is worked on by multiple AI agents: Codex, Claude, and Gemini.
Every agent must make ownership clear in the documents that matter for handoff.

Rule update added by: Codex (2026-05-07).

Required rule:

- When Codex creates, changes, verifies, reviews, or plans work that is recorded
  in project documentation, add an attribution such as `Agent: Codex`,
  `Implemented by: Codex`, `Reviewed by: Codex`, or `Updated by: Codex`.
- Add attribution in every necessary tracking or handoff document, including
  `CURRENT_SPRINT.md`, `DEVELOPMENT_PLAN.md`, QA logs, release notes, task
  briefs, next-action prompts, and any newly created project rule documents.
- If a table already has an owner/agent column, fill that column. If not, add a
  short note in the relevant row or section.
- Do not claim work done by another agent. If continuing another agent's work,
  say so explicitly, for example: `Continues Claude implementation` or
  `QA follow-up after Gemini review`.
- Handoff prompts should name the prior agent and commit hash when available.

## 7. Session Flow

Role flow is a project-state workflow, not an agent-rotation rule. Stay with the
same AI agent when possible. Switch agents only when needed, such as rate limits,
tool availability, or context limits. When switching agents, keep the same role
unless the project state has changed, and read the latest handoff, git status,
latest commit, and attribution notes before continuing.

Use the workflow that matches task risk:

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
- If QA finds a bug, PM should wait until QA Recheck passes or explicitly records
  accepted risk.
- Agent handoff can happen at any point without changing the role, for example
  `Codex Dev -> Claude Dev continuation -> QA`.

### Dev

1. Confirm the requested task and constraints.
2. Search first, then read targeted ranges.
3. Inspect cross-file dependencies before extraction/refactor work.
4. Edit one focused area at a time.
5. Verify with syntax, smoke, and browser checks as appropriate.
6. Stage specific files, commit, and push when requested.
7. Report what changed, what was verified, and any limitations.

### QA

1. Read only the files and ranges needed to evaluate acceptance criteria.
2. Trace behavior through routes, frontend handlers, and data flow.
3. Lead with findings ordered by severity.
4. For each acceptance criterion, give evidence and a PASS/FAIL conclusion.
5. Do not patch code unless the user explicitly changes the role to Dev.

### PM

1. Read current sprint context first.
2. Update only the requested tracker/planning sections.
3. Keep the next action self-contained.
4. Do not make code changes.

## 8. Handoff Format

When the user asks for a next-session prompt, end with:

```text
**Next session:**

**Role:** [Dev / QA / PM]
**Task:** [task name]

[Self-contained copy-paste prompt]
```

The prompt should include the role, task steps, constraints, verification
expectations, and commit message if a Dev task is next.

### Next Action Rules

Every structured Dev, QA, or PM session should leave a clear next action unless
the user explicitly says no handoff is needed.

Default project-state flow:

```text
Dev -> QA -> PM -> Dev
```

This is not an instruction to rotate agents every session. It describes the
normal movement of work through roles.

Next action requirements:

- State the next role.
- State the next task.
- Include a copy-paste prompt that can start cold.
- Include constraints from the current task, especially grep-first reading,
  targeted edits, verification, commit message, and push expectations.
- Do not combine roles in one next action.
- Do not skip QA after behavior-changing Dev work unless the user explicitly asks
  to bypass it or PM records accepted risk.

Use this exact block shape:

```text
**Next action:**

**Role:** [Dev / QA / PM]
**Task:** [task name]

[Self-contained prompt for the next session]
```

## 9. Codex Operating Notes

- Keep user updates short and useful while working.
- Parallelize independent reads/searches when it saves time.
- Be explicit about sandbox or browser limitations.
- Protect unrelated worktree changes.
- Prefer finishing the requested task end to end over stopping at a proposal.
