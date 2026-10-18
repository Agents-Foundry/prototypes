# Sprint 03 — final validation execution plan

**Status: PREPARATION ONLY — NOT APPROVED OR FROZEN.** Candidate baseline: PR #63 merge commit `9083316503abd7955a707ae76c2604c53e8513a7`; re-confirm current `main` and actual tested SHA before relying on this baseline.

## Automated evidence verification

1. Identify the **latest successful** design asset integrity, browser interaction review and Sprint 03 review-evidence workflow runs for the exact candidate commit. PR test merge SHAs may differ from merge-to-main SHAs. **Do not equate an empty workflow-run query with passing CI.**
2. Record workflow URLs, event, conclusion, timestamp, tested SHA, and relevant skipped or cancelled jobs. A PR run is not a post-merge main run.
3. Download the 14-day review-evidence artifact and record its source, SHA-256, retrieval date and retention expiry. Preserve the original archive.
4. Extract the artifact and run `python3 employee-desktop/sprint-03/verification/browser/verify_archived_evidence.py --index <extracted>/test-results/review-index/index.json --evidence <extracted>/test-results/review-evidence`; attach stdout and exit status.
5. Reconcile all 48 scenario IDs (light/dark × 480/960/1440 × 8 states), report hashes, screenshot hashes, source SHA, simulated marker, axe summaries, and overflow measurements. Reject missing or inconsistent evidence.
6. Cross-reference EMP-DEC-01–10 with authoritative decision records and candidate interaction prototypes. Flag missing source references as **UNVERIFIED**.

## Independent reviewer work orders

| Gate | Required human execution and evidence | Default disposition |
| --- | --- | --- |
| Security/privacy | Independent reviewer; scope includes privileged actions, offline recovery, fresh authorization, tenant boundary, secret exposure, sync and replay risks; issue/retest links | PENDING |
| Manual accessibility | Named reviewer; keyboard/focus, screen reader announcements, errors, disabled controls and assistive-tech/OS/browser matrix | NOT TESTED |
| Actual browser zoom | Browser zoom settings (not simulated viewport resize), reflow at 200%/400% where applicable, focus and interaction; screenshots and defects | NOT TESTED |
| Independent visual QA | Named reviewer; light/dark × responsive widths × critical states; reference baseline, screenshots, discrepancies and retests | PENDING |
| Product-owner acceptance | Explicit review of evidence, decisions, open findings and accepted risk | PENDING |
| Final design freeze | Authorized explicit decision referencing reviewed candidate and evidence | BLOCKED |

## Exit criteria

All required workflows pass for a documented candidate, archive hashes validate, traceability is complete, independent reviews are recorded and blocking findings are resolved or explicitly dispositioned by authorized owners. Only then request product-owner acceptance and separately request design freeze. No automated result can grant those decisions.

## Evidence ledger template

| Evidence type | Candidate/tested SHA | URL / archive | Reviewer | Status / findings |
| --- | --- | --- | --- | --- |
| CI workflows | UNVERIFIED | — | Engineering | NOT VERIFIED |
| 48-scenario archive | UNVERIFIED | — | Engineering | NOT RETRIEVED |
| Security/privacy | — | — | Unassigned | PENDING |
| Accessibility | — | — | Unassigned | NOT TESTED |
| Actual zoom | — | — | Unassigned | NOT TESTED |
| Visual QA | — | — | Unassigned | PENDING |
| Product owner | — | — | Unassigned | PENDING |
| Design freeze | — | — | Authorized owner | BLOCKED |
