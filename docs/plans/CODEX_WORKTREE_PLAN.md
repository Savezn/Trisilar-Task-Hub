# Codex Worktree Plan - Dev Handoff

**Codex Project:** TaskHub Dev Handoff
**Folder:** sync from `origin/dev` in the relevant dedicated worktree
**Branch:** `dev` baseline or a new `codex/<scope>` topic branch
**Role:** PM / Integration / Runtime routing
**Status:** V0.4 monitoring closed; V0.5 hosted dev/demo SQLite canary is the next runtime task

---

## This Worktree Owns

- Current branch/worktree routing for agents.
- Explicit boundaries between V0.4 production Paperclip runtime and V0.5 hosted dev/demo foundation work.
- The short version of what can proceed without waiting for V0.4.

This file is not an approval to change production runtime, Cloudflare, secrets, live Paperclip flags, webhook auth behavior, or production storage.

Use the dedicated worktree for the version you are assigned. Do not point two Codex projects at the same folder.

---

## Runtime Gate Matrix

| Phase / Work | Current state | Gate / Blocker |
|---|---:|---|
| V0.4-PROD-04 read-only monitoring | Passed | Final checkpoint `2026-05-16T08:03:14Z`; no longer blocks other versions |
| V0.4-PROD-05 permanent enablement | Complete | Production `taskhub-prod` is permanent-enabled with Review Queue human gate and rollback proof |
| V0.5-FND-01 planning / ADR acceptance | Complete | Merged via PR #28 |
| V0.5-FND-02/03/04/05 foundation work | Integrated | Merged via PR #30 |
| V0.5 hosted dev/demo SQLite canary | Next runtime task | Requires Runtime Owner host access; use `docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md`; do not touch production |
| V0.6 UI V2 production implementation | Future | Wait for V0.5 hosted dev/demo canary evidence and PM route |
| V0.7 Team OS product pilot | Future | Wait for V0.6 shell/workflow stability and PM route |
| V0.8+ Full Rewrite execution | No | Blocked until V0.5/V0.6 evidence and accepted PM decision memo |

---

## Next Action

Use this order:

1. Sync the dedicated V0.5 foundation worktree from `origin/dev`.
2. Run hosted dev/demo SQLite canary using `docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md`.
3. Record canary evidence or blocker in `docs/logs/QA_LOG.md` and `CURRENT_SPRINT.md`.
4. Keep production Paperclip permanent flags unchanged unless PM opens a separate runtime-change task.

Do not change V0.4 production permanent flags from V0.5, UI V2, Team OS, or rewrite work.
