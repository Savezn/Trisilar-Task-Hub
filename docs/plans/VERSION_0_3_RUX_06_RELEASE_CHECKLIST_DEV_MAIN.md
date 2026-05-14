# V0.3-RUX-06 Release Checklist for dev -> main

**Doc Role:** Scoped PM handoff for the next V0.3 Product Reliability + UX Stabilization task
**Status:** Routed - ready for PM / QA / Integration / Runtime
**Owner:** PM / QA / Integration / Runtime
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM
**Related Docs:** `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `VERSION_0_3_RUX_05_BROWSER_REGRESSION_RESPONSIVE_QA_GATE.md`, `../../CURRENT_SPRINT.md`, `../logs/QA_LOG.md`, `../logs/DECISION_LOG.md`, `../testing/TEST_STRATEGY.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `PROJECT_LADDER.md`

---

## PM Triage Decision

PM accepts `V0.3-RUX-05` at `0af9417`. V0.3 now has:

- RUX issue intake and findings log.
- Trello connection-state and product failure-copy clarity.
- Review Queue / Docs AI trace clarity.
- Today / Tasks decision-flow cues.
- Repeatable browser regression gate.

The next step is not to merge yet. The next step is a release checklist artifact that lets PM decide whether and when accepted V0.3 work can move toward `dev -> main`, while preserving the known stacked-branch and W3 boundaries.

---

## Scope

### In Scope

- Draft a single release checklist for future `dev -> main` promotion.
- List accepted V0.3 commits and required source branches.
- Separate product QA, browser regression, Paperclip/Review Queue checks, and runtime gates.
- Record the stacked-branch dependency on the accepted operating-model branch.
- Confirm `PAPERCLIP_WEBHOOK_ENABLED=false` remains the default unless PM explicitly approves standing live enablement.
- Define rollback notes and PM release decision format.
- State exact commands and evidence expected before promotion.

### Out Of Scope

- Actually merging this branch into `dev` or `main`.
- Production deployment.
- Standing live Paperclip enablement.
- W3 webhook hardening or service-auth changes.
- Runtime secret changes or Cloudflare policy changes.
- Exposing secrets, tokens, auth headers, or private credentialed URLs.
- Replacing Trello as the execution surface.
- Creating the deferred reusable `trisilar-task-hub-workflow` Codex skill.

---

## Release Checklist Must Cover

| Area | Required content |
|---|---|
| Branch state | Current V0.3 branch, stacked base, latest accepted commits, and merge boundary |
| Product acceptance | RUX-01 through RUX-05 accepted status and evidence |
| Automated verification | `check:all`, RUX-specific verification scripts, browser regression gate |
| Browser route matrix | `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, `/docs` |
| Paperclip / Review Queue | Contract/mock/docs checks, human gate, no automatic Trello/Google side effects |
| Runtime gates | `PAPERCLIP_WEBHOOK_ENABLED=false` unless PM approves otherwise, secret handling, access boundary |
| Integration order | Operating-model branch must be accepted/merged before this V0.3 branch is integrated |
| Rollback | How to revert or hold the release candidate if QA or runtime checks fail |
| PM decision | Clear `Accept`, `Hold`, or `Reject` block with reasons and next owner |

---

## Acceptance Criteria

- A PM can decide future `dev -> main` promotion from one checklist artifact.
- Checklist references the accepted V0.3 evidence without copying secrets or private URLs.
- Checklist distinguishes repo/product QA from runtime/deployment evidence.
- Checklist preserves V0.3/W3 branch boundary and stacked operating-model dependency.
- Checklist includes exact verification commands:
  - `npm.cmd run check:all`
  - `npm.cmd run verify:rux-trello`
  - `npm.cmd run verify:rux-ai-trace`
  - `npm.cmd run verify:rux-decision-flow`
  - `npm.cmd run verify:rux-browser-regression`
  - Paperclip contract/mock/docs checks where relevant
- Checklist states that no merge or production deploy is performed by this phase.
- Docs-only verification passes with `git diff --check`.

---

## Verification Expectations

This phase is expected to be docs-only unless PM explicitly expands scope.

Minimum verification:

```powershell
git diff --check
```

If implementation changes code or package scripts, also run the relevant commands from the checklist before routing to PM acceptance.

---

## Next Recommended Session

```text
Role: PM / QA / Integration / Runtime
Task: Draft V0.3-RUX-06 Release Checklist for dev -> main.

Read:
- docs/plans/VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md
- docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md
- docs/testing/TEST_STRATEGY.md
- docs/logs/QA_LOG.md
- docs/logs/DECISION_LOG.md
- docs/reference/AI_AGENT_GOVERNANCE.md
- docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md

Guardrails:
- Do not merge this branch into dev or main.
- Do not merge W3 branches into V0.3 or V0.3 branches into W3.
- Do not deploy production.
- Do not expose secrets, tokens, auth headers, private credentialed URLs, or HMAC values.
- Do not enable live Paperclip.
- Keep reusable trisilar-task-hub-workflow Codex skill deferred.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Routed `V0.3-RUX-06` after PM accepting `V0.3-RUX-05` at `0af9417` | Codex PM |
