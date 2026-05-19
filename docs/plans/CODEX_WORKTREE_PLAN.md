# Codex Worktree Plan - Dev Handoff

**Codex Project:** TaskHub Dev Handoff
**Folder:** sync from `origin/dev` in the relevant dedicated worktree
**Branch:** `dev` baseline or a new `codex/<scope>` topic branch
**Role:** PM / Integration / Runtime routing
**Status:** V0.6 UI V2 QA pass / PM-UX re-review pending after sidebar/icon correction

---

## This Worktree Owns

- Current branch/worktree routing for agents.
- Explicit boundaries between V0.4 production Paperclip runtime and V0.5 hosted dev/demo foundation work.
- The short version of what can proceed without waiting for V0.4.
- UI V2 source-led parity handoff routing when this worktree is used for `codex/v06-uiv2-full-fidelity`.

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
| V0.5 hosted dev/demo SQLite canary | Complete / PM accepted | Dev/demo SQLite canary, rollback proof, and short monitor passed; production remains separate |
| V0.6 UI V2 production implementation | QA pass / PM-UX re-review pending | Use `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` first for any reopened visual gap; latest sidebar/icon correction is QA-passed and awaits PM/UX re-review |
| V0.7 Team OS product pilot | Future | May be planned after V0.6 merge review and shell/workflow stability decision |
| V0.8+ Full Rewrite execution | No | Blocked until V0.5/V0.6 evidence and accepted PM decision memo |

---

## Next Action

Use this order only if this V0.6 UI V2 worktree is reopened for another PM/UX mismatch:

1. Read `docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md`.
2. Read `docs/design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md`.
3. Read `docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md` and `docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`.
4. If PM/UX identifies a mismatch, add one source-led gap row before editing.
5. Patch one route/component slice, then regenerate route/component/screenshot evidence.
6. Keep production Paperclip permanent flags unchanged unless PM opens a separate runtime-change task.

Do not change V0.4 production permanent flags, V0.5 persistence contracts, runtime/secrets, Cloudflare, live Paperclip behavior, Team OS, or rewrite scope from V0.6 UI V2 parity work.
