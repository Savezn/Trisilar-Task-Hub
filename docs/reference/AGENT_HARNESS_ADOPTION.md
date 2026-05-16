# Agent Harness Adoption - Trisilar Task Hub

**Doc Role:** Reference policy for adopting external agent-harness patterns into Trisilar Task Hub
**Status:** Active
**Owner:** PM / Documentation Workflow Owner
**Created:** 2026-05-16
**Updated by:** Codex Documentation Workflow Owner
**Related Docs:** `AI_AGENT_GOVERNANCE.md`, `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../testing/TEST_STRATEGY.md`, `../../CODEX.md`, `../plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md`

---

## Purpose

This document records how Trisilar Task Hub may reuse patterns from external agent-harness projects such as Everything Claude Code without importing the whole harness, installing broad rule packs, or weakening the repo's existing PM/QA/runtime gates.

Treat external harnesses as reference architecture. Distill the workflow patterns that make Task Hub safer, then express them through this repo's docs, role skills, tests, and verification scripts.

---

## Reference Inputs

Primary external references reviewed for this adoption pass:

- Everything Claude Code repo: `https://github.com/affaan-m/everything-claude-code`
- Codex guidance: `https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.codex/AGENTS.md`
- Hooks overview: `https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/hooks/README.md`
- Progress sync contract: `https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/docs/architecture/progress-sync-contract.md`
- Observability readiness: `https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/docs/architecture/observability-readiness.md`

These links are references, not dependencies. Task Hub remains governed by its own repo docs and runtime policies.

---

## Adoption Decision

Task Hub should not install the full Everything Claude Code pack or copy its Claude-specific surfaces directly into this repo.

Adopt:

- Role-specific agent entrypoints with clear `When to use`, `Start`, `Do`, `Do not`, `Verification`, `Stop Conditions`, and `Output` sections.
- Progress-sync contracts that keep GitHub PRs, current sprint docs, roadmap docs, QA evidence, and branch/worktree cleanup state aligned.
- Local/file-backed observability for branch, worktree, role, verification, blocker, and next-action state.
- Hook-inspired checklists and scripts that reinforce existing repo gates without adding hidden side effects.
- Deterministic `npm test` coverage as the first V0.5 foundation gate before UI V2 implementation or Team OS product work.

Do not adopt:

- Broad domain agents, language rules, or command packs that do not match Task Hub.
- Claude hook graphs that auto-run behavior outside the repo's accepted Codex workflow.
- Autonomous loops or multi-agent automation that bypass PM scope, QA evidence, Runtime Owner approval, or Review Queue.
- Hosted telemetry or external status sync unless PM explicitly approves a future integration.

---

## Progress Sync Contract

Every significant repo or runtime lane must keep these sources aligned before a handoff claims the lane is current:

| Surface | Role | Minimum evidence |
|---|---|---|
| GitHub PRs / branches | Review and merge state | Source branch, target branch, PR or blocker, latest relevant commit, merge/hold status |
| `CURRENT_SPRINT.md` | Current routing | Active status, next role, next exact task, runtime blockers when relevant |
| `docs/plans/PROJECT_LADDER.md` | Roadmap sequencing | Version gate, dependency state, no stale "next version" language |
| `docs/logs/QA_LOG.md` | QA evidence | PASS/FAIL, command/browser evidence, skipped checks, residual risk |
| Worktree plan / handoff docs | Local execution state | Folder, branch, owner role, blocker, cleanup state |
| `docs/testing/TEST_STRATEGY.md` | Verification policy | Current command gate and any changed deterministic coverage |

Before PM acceptance, integration, or release promotion, verify that the handoff names:

- role
- branch
- worktree
- owned files
- verification commands and result
- blocked or skipped checks
- next role or next action
- branch/worktree cleanup state or explicit hold

---

## Local Observability

Task Hub's default observability is local and file-backed. Do not create hosted telemetry as part of harness adoption.

For each active lane, the operator should be able to reconstruct:

- which folder/worktree owns the work
- which branch is active
- which role owns the next action
- which docs or code areas are in scope
- which checks passed or failed
- whether runtime/secrets/live flags were touched
- whether branch/worktree cleanup is done, held, or blocked

Use existing commands first:

```powershell
git status --short --branch
git worktree list
git branch -vv
npm.cmd test
npm.cmd run check:all
```

Use `git diff --check` for docs-only work. Use Paperclip, SQLite, RUX, or browser regression scripts only when the changed surface requires them.

---

## Hook-Inspired Checks

Task Hub can borrow hook ideas as explicit checks before installing any hook runtime.

Use these as manual or script-backed gates:

| Check | Trigger | Expected action |
|---|---|---|
| Dangerous command review | Before destructive Git/filesystem commands | Stop unless the user explicitly asked for that exact destructive action |
| Secret exposure scan | Before commit/PR touching runtime, config, docs, fixtures, or screenshots | Confirm no raw tokens, signing secrets, Cloudflare secrets, OAuth secrets, or production data exports |
| Branch/worktree hygiene | Before implementation and final handoff | Confirm folder, branch, dirty files, write scope, and cleanup/hold state |
| Verification loop | Before completion claims | Run the command that proves the claim and report command plus result |
| Progress sync | After merge, QA pass, blocker, or PM decision | Update the source-of-truth docs that own the status, not only chat |

These checks are visible and auditable. Do not add hidden auto-formatting, auto-commit, auto-push, remote publication, or external resource mutation from this adoption work.

---

## V0.5 Foundation Link

V0.5 Foundation Hardening is the first implementation target for this adoption policy.

Required V0.5 posture:

- `npm test` must remain a meaningful deterministic gate.
- Tests must not require live Trello, Google, Cloudflare, Paperclip, or production secrets.
- `APP_DATA_DIR` remains the runtime data boundary.
- SQLite migration remains an internal persistence change unless an ADR approves public API changes.
- Review Queue remains the human gate before Trello, Calendar, Google Tasks, or Paperclip side effects.
- UI V2 production implementation and Team OS product work wait for V0.5 acceptance.

If a future harness pattern conflicts with these rules, keep the Task Hub rule and record the conflict for PM review.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-16 | Created external agent-harness adoption policy and progress-sync contract | Codex Documentation Workflow Owner |
