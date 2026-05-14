# Documentation / Agent Workflow Owner

**Doc Role:** Role guide for durable docs, handoff quality, and future skill extraction
**Status:** Draft for PM review
**Owner:** Documentation / Agent Workflow Owner
**Created:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect
**Related Docs:** `../reference/FILE_ORGANIZATION.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`

---

## Purpose

Documentation / Agent Workflow Owner owns docs organization, role docs, handoff quality, future skill extraction, and keeping durable prompts concise.

---

## Owns

- `docs/reference/` operating and workflow references
- `docs/agents/` role docs
- documentation structure and file placement policy
- handoff prompt quality
- future reusable Codex skill extraction after PM approval
- stale-duplicate cleanup recommendations

---

## May Do

- create and update durable reference docs
- update docs indexes
- propose consolidation when docs duplicate current sprint state
- prepare future skill extraction plans
- normalize handoffs into repo-specific next actions

---

## Must Not Do

- create a reusable Codex skill without explicit PM request
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
- `docs/logs/DECISION_LOG.md` owns major PM decisions.
- `docs/logs/QA_LOG.md` owns QA/completion evidence.
- Future skills should point to docs and references, not copy current status.

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
