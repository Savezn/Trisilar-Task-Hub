# Team Onboarding Guide - Trisilar Task Hub

**Doc Role:** Non-developer onboarding guide for routine Task Hub use
**Status:** Active
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex PM / UX Owner
**Related Docs:** `../reference/PROJECT_CONTEXT.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`, `../deployment/TROUBLESHOOTING.md`, `../../CURRENT_SPRINT.md`

---

## Purpose

This guide helps teammates use Task Hub without needing repo, branch, or deployment knowledge.

Task Hub is a command center and review/control layer. Trello remains the execution surface.

```text
Trello = where work is executed
Task Hub = where work is reviewed, prioritized, and understood
Review Queue = human approval gate for AI-originated work
```

---

## First Session

1. Open the approved Task Hub URL from PM or Runtime Owner.
2. Sign in through Cloudflare Access if prompted.
3. Open Today first to understand current focus.
4. Use All Tasks or Boards Monitor when you need broader context.
5. Use Review Queue for AI/Paperclip-created proposed work.
6. Report connection or missing-data issues with the page name, time, and visible error state.

Do not share screenshots that reveal private task data or tokens outside the approved team channel.

---

## Core Surfaces

| Surface | Use when |
|---|---|
| Today | You need current priority and next actions |
| All Tasks | You need to search/filter across board work |
| Boards Monitor | You need project/list/board health |
| Calendar | You need schedule context |
| Planner | You need Google Tasks/Trello due-work context |
| OKR / Portfolio | You need objective/portfolio progress |
| Weekly Focus | You need current-week planning lanes |
| Settings | You need connection/config status |
| Review Queue | You need to approve, reject, or inspect AI-originated work |

---

## Review Queue Rule

AI and Paperclip may prepare work. Humans approve side effects.

Before approving Review Queue work:

- confirm source and context
- read proposed change
- check linked evidence or trace when available
- approve only if the task should be pushed to the external system
- reject or hold unclear/test/canary work

Paperclip-created work should remain pending until a human decides. If a task appears to have created an external side effect before approval, stop and report it as a production safety issue.

---

## What To Report

Report these to PM or Runtime Owner:

- Cloudflare login loop
- page does not load
- Today or All Tasks looks empty when Trello has work
- Trello/Calendar/Google Tasks disconnected unexpectedly
- Review Queue item lacks source/context
- Paperclip test/canary item appears in routine work
- approval creates unexpected side effects
- any token, secret, or auth header is visible

Include:

```text
Page:
Time:
What you expected:
What happened:
Screenshot: yes/no
Sensitive data visible: yes/no
```

---

## Team Rhythm

Recommended lightweight rhythm:

- Start day: check Today and Weekly Focus.
- During work: use Trello for execution updates.
- Before approvals: inspect Review Queue source/context.
- Weekly: review Boards Monitor and OKR / Portfolio.
- When confused: report the specific route and state instead of changing settings blindly.

---

## Safety Boundaries

- Do not paste secrets into Task Hub, Trello cards, docs, or chat.
- Do not approve AI-originated work if the source/context is unclear.
- Do not treat Task Hub as the source of truth for execution; Trello remains the project board source.
- Do not bypass Cloudflare Access.
- Do not ask Paperclip to send production work until PM/Runtime/QA approve the staged or permanent window.
