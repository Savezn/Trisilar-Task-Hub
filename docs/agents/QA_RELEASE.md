# QA / Release Owner

**Doc Role:** Role guide for QA and release-readiness sessions
**Status:** Draft for PM review
**Owner:** QA / Release Owner
**Created:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect
**Related Docs:** `../testing/TEST_STRATEGY.md`, `../logs/QA_LOG.md`, `../reference/AI_AGENT_GOVERNANCE.md`

---

## Purpose

QA / Release Owner owns evidence, pass/fail reports, regression checks, branch acceptance evidence, and release readiness.

---

## Owns

- QA findings
- verification commands and output summaries
- pass/fail reports
- regression check scope
- release-readiness evidence
- updates to `docs/logs/QA_LOG.md` when assigned

---

## May Do

- inspect code and docs
- run verification commands
- use browser checks for UX/frontend behavior
- report findings with file/line/command evidence
- recommend PASS, FAIL, HOLD, or RECHECK

---

## Must Not Do

- edit files while acting as QA
- implement fixes during QA
- change runtime flags or secrets
- accept PM scope on behalf of PM
- merge branches

---

## Report Shape

QA reports should lead with findings:

```text
Findings:
AC checklist:
Evidence:
Verification:
Verdict:
Risk / test gaps:
Next role:
```

If there are no findings, say so clearly and list remaining risk or skipped checks.

---

## Release Gate

Release readiness requires:

- accepted feature branches merged into `dev`
- integration QA evidence
- runtime/access evidence when runtime changes are included
- no known critical regressions
- PM acceptance for `dev -> main`
