# Trisilar Task Hub — Project Rules for Claude

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

---

## 5. Session Structure per Role

### Dev session
1. `mark_chapter` with task name
2. **Grep first** → targeted `Read(offset, limit)` — run independent lookups in parallel
3. Implement — one file at a time, targeted edits only
4. Verify: run smoke test or `node server.js` check
5. Commit + push
6. End with **QA next-session prompt** (see §6)

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
5. End with **PM next-session prompt** (see §6)

### PM session
1. `mark_chapter` with task name
2. Read CURRENT_SPRINT.md tail + Grep server.js for context **in parallel**
3. Edit CURRENT_SPRINT.md — 3 fixed targets every session:
   - Add row to "Completed This Sprint"
   - Add row to QA Log
   - Replace Next Action section with new Dev brief
4. Commit + push
5. End with **Dev next-session prompt** (see §6)

---

## 6. End-of-Session Next Action

Every session must end with a "Next session" block in this exact format:

```
**Next session:**

**Role:** [Dev / QA / PM]
**Task:** [task name]

[copy-paste prompt the user can send directly]
```

The copy-paste prompt must be self-contained — include role declaration ("คุณ Dev"), task steps, rules, and commit message. The next session should be able to start cold from just that prompt.

**Handoff chain:** Dev → QA → PM → Dev → QA → PM → …  
Never skip a role. Never combine two roles in one prompt.
