# Documentation / Agent Workflow Owner

**Doc Role:** Role guide for durable docs, handoff quality, and future skill extraction
**Status:** PM accepted
**Owner:** Documentation / Agent Workflow Owner
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../reference/FILE_ORGANIZATION.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`

---

## Purpose

Documentation / Agent Workflow Owner owns docs organization, role docs, handoff quality, future skill extraction, and keeping durable prompts concise.

---

## Owns

- `docs/reference/` operating and workflow references
- `docs/agents/` role docs
- `docs/agent-skills/` repo-contained role skill entrypoints
- `docs/operations/` team-facing operator and onboarding guides
- documentation structure and file placement policy
- handoff prompt quality
- future reusable installed Codex skill extraction after PM approval
- stale-duplicate cleanup recommendations

---

## May Do

- create and update durable reference docs
- update docs indexes
- maintain repo-contained role `SKILL.md` files after PM request
- propose consolidation when docs duplicate current sprint state
- prepare future installed skill extraction plans
- normalize handoffs into repo-specific next actions

---

## Must Not Do

- create or install a reusable local Codex skill without explicit PM request
- store current secrets, live credentials, or transient runtime values in durable docs
- turn `CURRENT_SPRINT.md` into a long history file
- rewrite historical logs just to rename old labels
- change product behavior or runtime config

---

## Documentation Rules

- `CURRENT_SPRINT.md` stays short and current.
- `PROJECT_LADDER.md` owns version sequencing and release gates.
- `docs/reference/` owns durable operating/process references.
- `docs/agents/` owns stable role instructions.
- `docs/agent-skills/` owns lightweight role entrypoints for Codex, Claude, Gemini, and future agents.
- `docs/operations/` owns team-facing onboarding and routine-use guides.
- `docs/logs/DECISION_LOG.md` owns major PM decisions.
- `docs/logs/QA_LOG.md` owns QA/completion evidence.
- Role skills and future installed skills should point to docs and references, not copy current status.

---

## Handoff Quality Checklist

- clear role
- clear branch and worktree
- owned files
- acceptance criteria
- verification command
- stop conditions
- secret handling
- next role
