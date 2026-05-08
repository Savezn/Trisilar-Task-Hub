# Version 0.2 Parallel Workstream Prompts - Trisilar Task Hub

**Doc Role:** Durable prompt registry for V0.2 parallel workstreams
**Status:** Active
**Version:** V0.2
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`

---

## How to Use This Document

- Keep reusable W1/W2/W3 prompts here so they do not disappear when `CURRENT_SPRINT.md` changes its single Next Action.
- `CURRENT_SPRINT.md` should point to the current immediate next action only.
- Start every V0.2 workstream from `dev` unless the workflow doc explicitly says otherwise.
- W1/W2/W3 Dev agents must not edit `CURRENT_SPRINT.md`; PM updates it after QA/decision checkpoints.
- QA agents report evidence in their workstream handoff/doc; PM decides what enters `CURRENT_SPRINT.md`.

---

## Parallel Write Ownership

| Workstream | Dev/QA Write Scope | PM Write Scope |
|---|---|---|
| W1 | W1 plan/docs/branch only | Sprint snapshot and cross-workstream status |
| W2 | W2 plan/docs/branch only | Sprint snapshot and cross-workstream status |
| W3 | W3 plan/docs/branch only | Sprint snapshot and cross-workstream status |

Do not replace this registry with a single workstream's next action. Update one prompt at a time and preserve the rest.

## Branch Ownership

| Workstream | Required Branch | Rule |
|---|---|---|
| W1 | `feature/w1-company-access-deployment` | Do not commit W2/W3 work here. |
| W2 | `feature/w2-ui-redesign` | Do not commit W1/W3 work here. |
| W3 | `feature/w3-paperclip-integration` | Do not commit W1/W2 work here. |

All three branches start from latest `dev`. Do not run multiple workstreams in one feature branch. PM/integration merges finished workstream branches into `dev`.

---

## Prompt A - W1 Company Access + Deployment

```text
Role: Dev
Task: V0.2 W1 - Company Access + Deployment Plan

Context:
V0.2 W0 Branch / Environment / CI Setup passed QA at commit `9dbb47b`. The `dev` branch exists and is the integration baseline. Start W1 from `dev`.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- README.md

Goals:
1. Evaluate practical deployment/access options for Trisilar teammates.
2. Recommend dev/prod deployment target and access model.
3. Document environment variables/secrets boundary.
4. Produce a concrete implementation plan before changing production-ish behavior.

Rules:
- Start from `dev`.
- Do not implement W2 UI redesign or W3 Paperclip integration.
- Do not commit secrets.
- Preserve existing app behavior unless explicitly required.
- Include attribution: Implemented by Dev agent name.
```

---

## Prompt B - W2 Full UI Redesign

```text
Role: Dev
Task: V0.2 W2 - Full UI Redesign Discovery and Implementation Plan

Context:
V0.2 W0 Branch / Environment / CI Setup passed QA at commit `9dbb47b`. The `dev` branch exists and is the integration baseline. Create or switch to `feature/w2-ui-redesign` from latest `dev` before starting W2.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- MVP_PRD.md
- docs/design/ui-design-v1-0/README.md

Goals:
1. Audit current app shell/pages and existing design artifacts.
2. Propose redesign scope, visual direction, and page rollout order.
3. Identify responsive/desktop QA requirements.
4. Make only targeted preparatory docs or prototype updates unless implementation scope is clear.

Rules:
- Start from `dev`.
- Work only on `feature/w2-ui-redesign`.
- Do not implement W1 deployment/access or W3 Paperclip integration.
- Preserve core workflows.
- Include desktop/mobile visual QA expectations.
- Include attribution: Implemented by Dev agent name.
```

---

## Prompt C - W3 Paperclip Multi-Agent Integration

```text
Role: Dev
Task: V0.2 W3 - Paperclip Multi-Agent Integration Discovery and Contract Plan

Context:
V0.2 W0 Branch / Environment / CI Setup passed QA at commit `9dbb47b`. The `dev` branch exists and is the integration baseline. Create or switch to `feature/w3-paperclip-integration` from latest `dev` before starting W3.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- MVP_PRD.md

Goals:
1. Identify required Paperclip integration touchpoints.
2. Draft a contract-first API/webhook or adapter plan.
3. Define mock adapter verification before live connector work.
4. Define attribution/audit trail requirements so multi-agent work stays traceable.

Rules:
- Start from `dev`.
- Work only on `feature/w3-paperclip-integration`.
- Do not implement W1 deployment/access or W2 UI redesign.
- Do not add live external calls before contract/mock verification.
- Preserve existing app behavior.
- Include attribution: Implemented by Dev agent name.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created durable W1/W2/W3 prompt registry and PM-owned Current Sprint rule | Codex PM |
