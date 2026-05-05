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
