# V0.3-RUX-06 Release Checklist for dev -> main

**Doc Role:** Scoped PM handoff for the next V0.3 Product Reliability + UX Stabilization task
**Status:** PM accepted - V0.3 complete on dev/dev-demo; dev -> main not yet approved
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

## Draft Release Checklist Artifact

Use this checklist when PM is ready to decide whether accepted V0.3 work can move toward `dev -> main`. This checklist is an evidence gate only. It does not merge, deploy, enable live Paperclip, or change runtime secrets.

### 1. Release Boundary

| Check | Required state | Evidence |
|---|---|---|
| Source branch | `feature/v0.3-product-reliability-ux-stabilization` | `git status --short --branch` shows the expected branch and no unrelated dirty files. |
| Worktree | `trisilar-task-hub-v03-product-reliability-ux` | Work is isolated from W3 and main runtime worktrees. |
| Stacked base | `feature/project-operating-model-agent-structure@96826f7` | Operating-model branch must be accepted and integrated before this V0.3 branch is integrated. |
| W3 boundary | No W3 sibling branch merged into V0.3; no V0.3 branch merged into W3 | Integration Owner confirms with branch history when preparing the release candidate. |
| Release action | No direct `main` merge from this phase | PM acceptance and Integration Owner action are separate later steps. |

### 2. Accepted V0.3 Evidence

| Phase | Required evidence | Status |
|---|---|---|
| `V0.3-RUX-01` | Intake model, route inventory, baseline checklist, and findings log exist | Baseline complete |
| `V0.3-RUX-02A` | Trello connection-state and failure-copy clarity accepted at `516b33e` | PM Accepted |
| `V0.3-RUX-03` | Review Queue / Docs AI trace clarity accepted at `b2425a4` | PM Accepted |
| `V0.3-RUX-04` | Today + Tasks decision-flow clarity accepted at `d72f979` | PM Accepted |
| `V0.3-RUX-05` | Browser regression + responsive QA gate accepted at `0af9417` | PM Accepted |
| `V0.3-RUX-06` | This release checklist is completed and PM accepted at `df29307` | PM Accepted |

### 3. Integration Order

| Step | Owner | Required result |
|---|---|---|
| 1 | Integration Owner | Confirm operating-model branch is accepted and merged into `dev` before V0.3 integration. |
| 2 | Integration Owner | Integrate accepted V0.3 branch into `dev` without merging W3 branches into V0.3 or V0.3 branches into W3. |
| 3 | QA / Release Owner | Run repo, product, Paperclip/Review Queue, browser, and runtime evidence checks on the integrated `dev` candidate. |
| 4 | Runtime / Access Owner | Confirm runtime flags, access boundaries, and rollback readiness without exposing secrets. |
| 5 | PM | Decide `Accept`, `Hold`, or `Reject` for `dev -> main`. |

### 4. Verification Commands

Run from the integrated release candidate unless PM explicitly marks a command not applicable.

```powershell
node server.js
npm.cmd run check:all
npm.cmd run verify:rux-trello
npm.cmd run verify:rux-ai-trace
npm.cmd run verify:rux-decision-flow
npm.cmd run verify:rux-browser-regression
npm.cmd run verify:paperclip-contract
npm.cmd run verify:paperclip-mock
npm.cmd run verify:paperclip-docs
```

When W3 live connector behavior is part of the candidate, also run:

```powershell
npm.cmd run verify:paperclip-connection
npm.cmd run verify:paperclip-webhook
```

Do not run live interop with real service credentials unless Runtime / Access Owner explicitly assigns that check. If live interop is run, record only redacted request ids, HTTP status, Review Queue session id, pending task status, and the fact that no Trello/Google side effect occurred.

### 5. Browser Route Matrix

`verify:rux-browser-regression` must cover:

| Route | Required evidence |
|---|---|
| `/today` | Loads on desktop/mobile, Trello disconnected copy is product-facing, decision cues remain visible. |
| `/review` | Loads on desktop/mobile, Review Queue remains human-gated. |
| `/all` | Loads on desktop/mobile, task source/context/next action remain visible. |
| `/boards` | Loads on desktop/mobile, board state does not show false Trello connected state. |
| `/calendar` | Loads on desktop/mobile without page errors. |
| `/planner` | Loads on desktop/mobile without page errors. |
| `/okr` | Loads on desktop/mobile, Trello failure copy stays product-facing when disconnected. |
| `/focus` | Loads on desktop/mobile, Trello failure copy stays product-facing when disconnected. |
| `/settings` | Loads on desktop/mobile, connection state does not falsely report ready after auth failure. |
| `/docs` | Loads on desktop/mobile, Docs/Paperclip trace labels remain readable. |

For every route, record console/page errors and horizontal overflow result.

### 6. Paperclip / Review Queue Gate

| Check | Required result |
|---|---|
| Contract | Valid Paperclip payloads pass contract checks; invalid payloads return field-level errors. |
| Mock route | Mock intake creates Review Queue work without live Paperclip dependency. |
| Docs trace | Linked docs show source, type/status, run/agent metadata, and missing local review-task state clearly. |
| Human approval | AI-originated work remains pending until a human approves it. |
| Side effects | No Trello, Google Tasks, or Calendar write happens before human approval. |
| Auditability | Request id, source, agent/run metadata, Review Queue session, and decision history remain traceable. |

### 7. Runtime / Access Gate

| Check | Required result |
|---|---|
| Runtime flag | `PAPERCLIP_WEBHOOK_ENABLED=false` remains default unless PM explicitly accepts a controlled live enablement policy. |
| Secrets | No API token, OAuth secret, Cloudflare Access Client Secret, HMAC signing secret, auth header, or private credentialed URL appears in git, docs, browser JavaScript, or chat handoff. |
| Access | Runtime / Access Owner verifies hosted dev/demo access gate when release candidate includes runtime evidence. |
| Persistence | `APP_DATA_DIR` persistence is confirmed for hosted candidate when runtime is in scope. |
| Server-only env | Trello/Google/Paperclip credentials stay server-side only. |
| Live Paperclip | Standing live enablement remains out of scope unless PM creates and accepts a separate Runtime / AI Integration task. |

### 8. Rollback / Hold Plan

If any gate fails before `main` promotion:

- Hold the release candidate.
- Do not merge to `main`.
- Record the blocker in `docs/logs/QA_LOG.md` and `docs/logs/DECISION_LOG.md`.
- Route the blocker to the owning role: PM, QA, Dev, Integration, Runtime, UX, or AI Integration.
- Fix on a scoped branch/worktree, then rerun the failed gate plus relevant regressions.

If a later `main` promotion has already happened and a release blocker is found:

- PM decides whether to hotfix or revert.
- Integration Owner reverts the merge commit or applies a scoped hotfix branch from `main`.
- Backport the accepted fix to `dev`.
- QA reruns the failed gate and the release smoke matrix.

### 9. PM Release Decision Block

Use this block for the future PM release decision:

```text
Decision: Accept / Hold / Reject
Date:
Candidate branch / commit:
Accepted source commits:
Integrated dev commit:
Verified by:
Verification commands:
Browser route matrix:
Paperclip / Review Queue gate:
Runtime / access gate:
Secret handling:
Rollback readiness:
Reason:
Next owner:
```

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

## Completion Result

`V0.3-RUX-06` produced the release checklist artifact above and PM accepted it at `df29307`. After the operating-model prerequisite merged, V0.3 RUX was integrated through PR #18, merged to `origin/dev@02fe7cf`, deployed to the dev/demo runtime, and accepted complete after runtime QA. No production deploy, `main` merge, runtime flag change, new live Paperclip enablement, secret exposure, or W3/V0.3 cross-merge was performed.

Verification:

```powershell
git diff --check
git merge-base --is-ancestor 96826f7 origin/dev
```

Runtime checks after dev/demo deployment:

```text
dev/demo source: dev@02fe7cf
taskhub-dashboard.service: active
local /healthz: 200
local /api/config: 200
local /api/reviews: 200
anonymous public /healthz: Cloudflare Access 302
Paperclip operations mode: read_only
Paperclip connection: connected, hasSecret=true, secretPreview=configured
Review Queue counts: 6 sessions / 6 tasks, 0 pending, 0 approved, 6 rejected, 6 cleaned, 0 Trello-linked
Warnings: standing_dev_demo_enabled only
```

Integration prerequisite check:

```text
origin/dev contains operating-model base 96826f7 after merge commit ed9fae0
origin/dev contains accepted V0.3 RUX after merge commit 02fe7cf
```

This means V0.3 is complete on `dev` and dev/demo. A `dev -> main` promotion still requires a separate PM release decision using this checklist.

---

## PM Acceptance

```text
Status: Accepted
Accepted by: Codex PM
Date: 2026-05-14
Accepted commit: df29307

Acceptance confirmed:
- One release checklist artifact is sufficient for a future PM dev -> main decision.
- Accepted V0.3 evidence, branch/stacking dependency, W3 boundary, verification commands, browser matrix, Paperclip/Review Queue gate, runtime/access gate, rollback notes, and PM decision format are covered.
- This phase performed no merge, deploy, runtime flag change, live Paperclip enablement, secret exposure, or W3/V0.3 cross-merge.

Integration closeout:
- origin/dev contains operating-model base 96826f7 after merge commit ed9fae0.
- V0.3 RUX is integrated through PR #18 and merged at `origin/dev@02fe7cf`.
- Dev/demo runtime is deployed from `dev@02fe7cf` and runtime QA passed.
- `dev -> main` remains unapproved until PM opens a separate release decision.
```

---

## Next Recommended Session

```text
Role: PM
Task: Decide the next project route after V0.3 completion.

Read:
- docs/plans/VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md
- docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md
- docs/testing/TEST_STRATEGY.md
- docs/logs/QA_LOG.md
- docs/logs/DECISION_LOG.md
- docs/reference/AI_AGENT_GOVERNANCE.md
- docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md
- docs/plans/PROJECT_LADDER.md

Completed:
- Accepted operating-model branch is integrated into `dev`.
- V0.3 remained isolated from W3 sibling branches.
- Accepted V0.3 RUX is integrated into `dev@02fe7cf`.
- RUX-06 checklist was run against the integrated candidate and dev/demo runtime.
- Dev/demo runtime QA passed.

Decision options:
- Hold on dev and continue routine read-only monitoring.
- Open a separate PM release decision for `dev -> main`.
- Route V0.4 Live AI Operations or a focused post-V0.3 hardening item.

Rules:
- Do not merge `dev` to `main` without PM release decision.
- Do not deploy production, expose secrets, or enable additional live Paperclip behavior from this closeout.

If held:
- List exact integration blocker, branch contamination risk, conflict, missing operating-model acceptance evidence, or release checklist gap.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Routed `V0.3-RUX-06` after PM accepting `V0.3-RUX-05` at `0af9417` | Codex PM |
| 2026-05-14 | Drafted release checklist artifact, runtime/Paperclip gates, rollback notes, and PM decision block for `V0.3-RUX-06` | Codex PM / QA / Integration / Runtime |
| 2026-05-14 | PM accepted `V0.3-RUX-06` at `df29307`, routed to Integration Owner, and later closed on dev/dev-demo at `origin/dev@02fe7cf` | Codex PM |
| 2026-05-14 | Integrated V0.3 through PR #18, deployed `dev@02fe7cf` to dev/demo, passed runtime QA, and closed V0.3 complete on dev/dev-demo | Codex PM / Runtime Owner / QA |
