# V0.2 Workstream Plan - Trisilar Task Hub

**Doc Role:** Main V0.2 planning file
**Status:** Draft for PM approval, W0 is next
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM

V0.1 Release Acceptance passed. V0.2 will be managed as parallel workstreams after W0 establishes branch and environment rules.

---

## Goals

1. Make Trisilar Task Hub accessible to company teammates.
2. Redesign the full web app UI while preserving existing workflows.
3. Connect Trisilar Task Hub to the Paperclip multi-agent system.
4. Establish a `dev` integration environment and PR flow into production.

---

## Branch Model

| Branch | Role | Rule |
|---|---|---|
| `main` | Production | Protected, no direct feature work |
| `dev` | Integration/dev environment | Feature PRs merge here first |
| `feature/w0-*` | Branch/environment setup | Starts from `main` until `dev` exists |
| `feature/w1-*` | Company access/deployment | Starts from `dev` |
| `feature/w2-*` | UI redesign | Starts from `dev` |
| `feature/w3-*` | Paperclip integration | Starts from `dev` |
| `hotfix/*` | Emergency production fix | Starts from `main`, then merges back to `dev` |

Flow:

```text
feature/* -> dev -> QA/integration -> main -> production
```

---

## Workstreams

| ID | Workstream | Owner Role | Status | Scope |
|---|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Dev / PM | Next | Create `dev`, define env/deploy/PR rules, add verification gate |
| W1 | Company Access + Deployment | Platform Dev | Pending | Internal access, deployment target, env/secrets, teammate onboarding |
| W2 | Full UI Redesign | Frontend Dev | Pending | Design system, shell/nav, page-by-page redesign, responsive QA |
| W3 | Paperclip Multi-Agent Integration | Integration Dev | Pending | Contract-first API/webhook bridge, mock adapter, real connector, attribution sync |

---

## W0 Acceptance Criteria

1. `dev` branch exists and is pushed to remote.
2. Branch model is documented in README/docs.
3. PR flow is documented: `feature/* -> dev -> main`.
4. Dev/prod environment expectations are documented.
5. Required check command is documented: `npm.cmd run check:all`.
6. Next actions for W1, W2, and W3 are clear enough to open parallel Dev sessions.

---

## PR / QA Rules

- No direct push to `main` for feature work.
- Every workstream branch must state owner agent in docs and PR notes.
- Every PR into `dev` must include QA evidence.
- Any production-ish behavior or critical API change requires QA Recheck before PM signoff.
- UI redesign PRs must include desktop/mobile visual evidence and console error check.
- Paperclip integration PRs must include contract/mock verification before live connector work.

---

## Next Recommended Session

```text
Role: Dev
Task: V0.2 W0 - Branch / Environment / CI Setup

Context:
V0.1 Release Acceptance passed. PM split logs/plans out of CURRENT_SPRINT.md and created docs/plans/V0_2_WORKSTREAM_PLAN.md. Before W1/W2/W3 can run in parallel, establish the dev branch and environment/PR workflow.

Steps:
1. Verify current branch and remote status.
2. Create `dev` branch from current `main` if it does not already exist.
3. Push `dev` to origin.
4. Add targeted docs for branch/environment workflow if missing.
5. Run `npm.cmd run check:all` if any repo behavior/config files are changed.
6. Commit and push any doc/config updates.

Rules:
- Dev role only.
- Do not start W1/W2/W3 implementation yet.
- Preserve existing app behavior.
- Include attribution: Implemented by Dev agent name.
```
