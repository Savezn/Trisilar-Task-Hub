# Trisilar Task Hub — Project Rules for Claude

**Doc Role:** Claude-specific agent operating rules
**Status:** Active
**Last Updated:** 2026-05-08 · **Updated by:** Codex PM

## 1. Role Isolation (1 Role per Session)

Each session has exactly ONE role. Do not switch roles mid-session.

| Role | What to do | What NOT to do |
|---|---|---|
| **Dev** | Write/edit code, commit | Run QA, update plans |
| **QA** | Read code, report bugs | Fix code, update plans |
| **PM** | Update CURRENT_SPRINT.md | Write code, run tests |

**How to know your role:** The user's opening message will say "คุณ Dev", "คุณ QA", or "คุณ PM".  
If no role is stated, ask before proceeding.

---

## 2. File Reading Rules (Grep First, Then offset/limit)

**Never** read a full large file without checking size first.

### Required pattern for any file edit:
```
Step 1: Grep for the function/section name → get line number
Step 2: Read with offset + limit (±20 lines around target)
Step 3: Edit only the targeted section
```

### File size reference:
| File | Lines | Max read at once |
|---|---|---|
| `public/app.js` | ~2858 | 80 lines |
| `public/style.css` | ~2159 | 60 lines |
| `server.js` | ~603 | read in full (ok) |
| `DEVELOPMENT_PLAN.md` | ~870 | **do not read** unless PM syncing tracker |
| `CURRENT_SPRINT.md` | ~100 | read in full (ok) |
| `review-store.js` | ~143 | read in full (ok) |
| `task-diff.js` | ~98 | read in full (ok) |

### Quick Grep patterns for this project:
```bash
# Find a function in app.js
Grep("functionName", "public/app.js") → note line number → Read(offset=N-5, limit=60)

# Find a CSS class
Grep("\.class-name", "public/style.css") → Read(offset=N-2, limit=30)

# Find an Express route
Grep("app\.(get|post|put|delete).*route", "server.js")
```

---

## 3. Planning Reference

- **Active work:** read `CURRENT_SPRINT.md` (always ok, ~100 lines)
- **Phase history / full AC:** read `DEVELOPMENT_PLAN.md` only when necessary
- **PM only:** update `DEVELOPMENT_PLAN.md` progress tracker when a full Phase completes

---

## 4. Commit Convention

Every Dev session ends with a commit:
```
git add <specific files only — never git add .>
git commit -m "Phase X — [task ID] brief description"
git push
```

Commit message must describe **what changed and why**, not just filenames.

For Version 0.1 work use prefix `V0.1-PhX:` instead of `Phase X —`:
```
git commit -m "V0.1-Ph2: extract config routes to src/routes/config.routes.js"
```

Encoding rule:
- For Markdown files that contain Thai, emoji, or typographic punctuation, read
  and write UTF-8 explicitly. Do not use broad rewrites through PowerShell
  default encoding or ANSI/Windows-1252 paths.
- After editing UTF-8-heavy Markdown, verify no mojibake markers remain
  (for example UTF-8 bytes rendered as Windows-1252 text).

---

## 5. AI Work Attribution

This project is worked on by multiple AI agents: Claude, Codex, and Gemini.
Every agent must make ownership clear in the documents that matter for handoff.

Rule update added by: Codex (2026-05-07).

Required rule:
- When Claude creates, changes, verifies, reviews, or plans work that is recorded
  in project documentation, add an attribution such as `Agent: Claude`,
  `Implemented by: Claude`, `Reviewed by: Claude`, or `Updated by: Claude`.
- Add attribution in every necessary tracking or handoff document, including
  `CURRENT_SPRINT.md`, `DEVELOPMENT_PLAN.md`, QA logs, release notes, task
  briefs, next-session prompts, and any newly created project rule documents.
- If a table already has an owner/agent column, fill that column. If not, add a
  short note in the relevant row or section.
- Do not claim work done by another agent. If continuing another agent's work,
  say so explicitly, for example: `Continues Codex implementation` or
  `QA follow-up after Gemini review`.
- Handoff prompts should name the prior agent and commit hash when available.

---

## 6. Session Structure per Role

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

### Dev session
1. `mark_chapter` with task name
2. **Grep first** → targeted `Read(offset, limit)` — run independent lookups in parallel
3. Implement — one file at a time, targeted edits only
4. Verify: run smoke test or `node server.js` check
5. Commit + push
6. End with **QA next-session prompt** (see §7)

### QA session
1. `mark_chapter` with task name
2. Read route/feature file + Grep server.js **in parallel**
3. Report per AC — use this format:
   - Bullet evidence for each check (file:line, grep result, logic trace)
   - Conclude each AC with `**→ PASS**` or `**→ FAIL**`
4. Summary table:
   ```
   | AC | Result |
   |---|---|
   | 1. description | ✅ PASS |
   ```
5. End with **PM next-session prompt** (see §7)

### PM session
1. `mark_chapter` with task name
2. Read CURRENT_SPRINT.md tail + Grep server.js for context **in parallel**
3. Edit CURRENT_SPRINT.md — 3 fixed targets every session:
   - Add row to "Completed This Sprint"
   - Add row to QA Log
   - Replace Next Action section with new Dev brief
4. Commit + push
5. End with **Dev next-session prompt** (see §7)

---

## 7. End-of-Session Next Action

Every session must end with a "Next session" block in this exact format:

```
**Next session:**

**Role:** [Dev / QA / PM]
**Task:** [task name]

[copy-paste prompt the user can send directly]
```

The copy-paste prompt must be self-contained — include role declaration ("คุณ Dev"), task steps, rules, and commit message. The next session should be able to start cold from just that prompt.

**Project-state flow:** Dev -> QA -> PM -> Dev is the default for
behavior-changing work. It is not an instruction to rotate agents every session.
Never combine two roles in one prompt. Do not skip QA after behavior-changing Dev
work unless the user explicitly asks to bypass it or PM records accepted risk.
