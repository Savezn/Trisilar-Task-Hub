# Codex Worktree Plan - PM Roadmap

**Codex Project:** TaskHub PM Roadmap
**Folder:** `C:\Users\User\Desktop\Shortcut\Programmer\Trisilar\trisilar-task-hub-v05-roadmap-rebaseline`
**Branch:** `codex/v05-roadmap-closeout`
**Role:** PM / Integration docs
**Status:** Roadmap rebaseline merged; closeout docs only

---

## This Worktree Owns

- V0.5 roadmap rebaseline source-of-truth docs.
- V0.5 Foundation Hardening plan and ADRs.
- Parallel Codex project handoff and folder mapping.
- PM routing language that says which tracks may run in parallel and which phases are blocked.

This worktree must not change production runtime, Cloudflare, secrets, live Paperclip flags, webhook auth behavior, or product code.

This worktree must not implement V0.5-FND-02 or later foundation work. That work belongs in the dedicated V0.5 foundation worktree after syncing from `origin/dev`.

---

## V0.4 24-Hour Gate Matrix

| Phase / Work | Can run before V0.4 24-hour monitor passes? | Gate / Blocker |
|---|---:|---|
| V0.4-PROD-04 read-only monitoring | Yes | Runtime/QA owns it; monitor automation must complete the 24-hour window |
| V0.4-PROD-05 permanent enablement | No | Blocked until V0.4-PROD-04 passes and PM accepts staged-to-permanent |
| V0.5-FND-01 planning / ADR acceptance | Yes | Not blocked by V0.4 if docs-only and no runtime/secret/live flag changes |
| V0.5-FND-02 deterministic `npm test` baseline | Yes | Not blocked by V0.4 if tests use fixtures and no live external side effects |
| V0.5-FND-03 contracts | Yes | Sequence-blocked by V0.5 planning/test baseline, not by V0.4 monitoring |
| V0.5-FND-04 SQLite migration | Yes | Sequence-blocked by V0.5 ADR/test baseline; must not use production data |
| V0.5-FND-05 foundation integration QA | Partly | Local/dev QA may run; production-runtime-sensitive acceptance waits for V0.4 permanent decision if it would touch runtime/live state |
| V0.6 UI V2 production implementation | No | Blocked until V0.5 foundation acceptance; runtime-sensitive operations surfaces also wait for V0.4 permanent decision |
| V0.7 Team OS product pilot | No | Blocked until V0.6 shell/workflow stability; runtime-sensitive pilot behavior waits for V0.4 permanent decision |
| V0.8+ Full Rewrite execution | No | Blocked until V0.5/V0.6 evidence and accepted PM decision memo |

---

## Next Action

Roadmap closeout status:

- PR #28 merged the V0.5 roadmap rebaseline to `dev@aaf8f58`.
- Remote branch `codex/v05-roadmap-rebaseline` was deleted after merge.
- This closeout branch records the final PM handoff only.

Next action outside this worktree:

- Sync the dedicated V0.5 foundation worktree from `origin/dev`.
- Start `V0.5-FND-02` deterministic `npm test` baseline there.

Do not mark V0.4 permanent accepted from this worktree unless Runtime/QA provides a completed 24-hour monitor pass and PM acceptance package.
