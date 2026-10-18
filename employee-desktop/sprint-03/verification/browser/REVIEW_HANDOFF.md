# Sprint 03 — review evidence handoff (design-first)

This handoff describes **automated simulated prototype evidence**, not approval or production readiness. The Playwright runs exercise local design prototypes; they do not prove live integrations, independent review, or real-world operational safety.

## Evidence provenance and retrieval

1. Open the latest successful **Sprint 03 review evidence** GitHub Actions run for the exact candidate commit (or PR merge commit as appropriate). Record the workflow run URL, commit SHA, execution date, and artifact retention expiry in the review record.
2. Download the `sprint-03-review-evidence` artifact before its **14-day retention** expires. Preserve the original ZIP and record its checksum and storage location in the review record.
3. Inspect `test-results/review-index/index.json` and `index.html`, Playwright reports, screenshots, and per-scenario JSON. The index expects 48 theme/width/state combinations; confirm the summary counts, `expectedSourceSha`, `observedSourceShas`, and `evidenceType`.
4. The SHA in the reports is the workflow's `GITHUB_SHA` (for pull requests this can identify GitHub's test merge commit, rather than the branch head). Record **both** the PR head SHA and the workflow-tested SHA. A green run for an older SHA is not evidence for a later change.
5. Confirm that the **design asset integrity**, **design browser interaction review**, and **review evidence** workflows all succeeded on the intended candidate. Review workflow logs for skipped tests, artifact upload problems, and failed index generation. Missing, invalid, or failed evidence blocks automated completion.
6. Keep the artifact and review record separate from independent approval records. A passing automated index is not permission to label manual accessibility, real browser zoom, security/privacy, or visual QA as completed.

## Independent review gates — all remain open until separately evidenced

| Gate | Minimum review record | Current status |
| --- | --- | --- |
| Security and privacy | Named independent reviewer, threat/privacy scope, findings, remediation and recheck links | PENDING |
| Manual accessibility | Named reviewer, assistive technology/browser/OS matrix, keyboard/focus/announcements, defects and retests | NOT TESTED |
| Actual browser zoom | Browser and OS, **actual zoom setting** (not just CSS viewport), viewport, screenshots, reflow and interaction observations | NOT TESTED |
| Visual QA | Named independent reviewer, target baselines, light/dark and responsive comparisons, defects and retests | PENDING |
| Product-owner acceptance | Explicit decision against agreed Sprint 03 acceptance criteria and unresolved risks | PENDING |
| Final design freeze | All prerequisite evidence reviewed and explicit authorized freeze decision | BLOCKED |

## Review record template

- Candidate PR / branch / head SHA:
- Workflow-tested SHA and GitHub Actions URLs:
- Evidence artifact URL, retrieval date, retention deadline, checksum and archive location:
- Automated index counts: expected / captured / pass / fail / missing-or-invalid:
- Reviewer name, independence, review date and scope:
- Browser / OS / assistive technology / actual zoom configuration (when applicable):
- Findings, severity, issue links, remediation commit and re-test evidence:
- Explicit disposition: pending / accepted by authorized reviewer / rejected:
- Product-owner decision reference (only if actually given):
- Freeze decision reference (only if actually authorized):

**No automatic workflow or this document grants independent approval or final design freeze.**
