# Branch and Environment Workflow

**Doc Role:** Branch/environment operating reference
**Status:** Active for V0.2 W0
**Owner:** Dev / PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex Dev
**Related Docs:** `../../CURRENT_SPRINT.md`, `../plans/VERSION_0_2_PLAN.md`, `../../README.md`

---

## Purpose

This document defines the branch, environment, PR, and verification workflow required before V0.2 W1/W2/W3 can run in parallel.

---

## Branch Model

| Branch | Environment Role | Rule |
|---|---|---|
| `main` | Production-ready baseline | No direct feature work. Merge only after QA/PM signoff. |
| `dev` | Integration/dev baseline | Feature branches merge here first for combined QA. |
| `feature/w0-*` | Branch/environment setup | Starts from `main` until `dev` exists. |
| `feature/w1-*` | Company access/deployment | Starts from `dev`. |
| `feature/w2-*` | UI redesign | Starts from `dev`. |
| `feature/w3-*` | Paperclip integration | Starts from `dev`. |
| `hotfix/*` | Emergency production fix | Starts from `main`; merge or cherry-pick back to `dev` after release. |

Flow:

```text
feature/* -> dev -> QA/integration -> main -> production
```

---

## Environment Expectations

| Environment | Source Branch | Purpose | Deployment Notes |
|---|---|---|---|
| Local dev | Any active branch | Agent implementation and verification | Use local `.env`; do not commit secrets. |
| Dev / integration | `dev` | Combined W1/W2/W3 preview and QA | Intended for teammate/internal preview after deployment target is selected. |
| Production | `main` | Stable app for real users | Release only after integration QA and PM signoff. |

Environment files:

- Keep secrets in local/runtime environment configuration only.
- Do not commit `.env` or production secrets.
- If environment requirements change, update docs before handing off to QA/PM.

---

## PR and QA Rules

- Feature work starts from `dev` after W0.
- Open PRs into `dev` for W1/W2/W3 workstreams.
- Merge `dev` into `main` only after integration QA passes and PM approves.
- Every PR must state:
  - owner agent
  - files changed
  - verification command/output summary
  - behavior risk
- Production-ish behavior, auth/access, deployment, critical API, or integration contract changes require QA Recheck before PM signoff.

---

## Required Verification

Use this command as the baseline verification gate:

```powershell
node server.js
npm.cmd run check:all
```

Run `node server.js` in a separate terminal first because `check:all` includes smoke checks against local HTTP endpoints. Run the gate before PR/merge when code, config, route, integration, or behavior files change. Documentation-only changes can skip runtime checks if no behavior/config files changed, but the owner must state that explicitly.

---

## W0 Completion Criteria

- `dev` exists locally or remotely and is pushed to `origin`.
- `main` remains the production-ready baseline.
- Branch/environment workflow is documented in README/docs.
- V0.2 W1/W2/W3 can start from `dev` without changing the release model.
- Implemented by Codex Dev.
