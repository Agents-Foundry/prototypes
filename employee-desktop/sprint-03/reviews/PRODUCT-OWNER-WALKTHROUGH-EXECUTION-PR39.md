# Sprint 03 — product-owner walkthrough execution record (PR #39)

**Status:** EXECUTION KIT PREPARED; MANUAL WALKTHROUGH NOT PERFORMED. **Baseline:** PR #38 merge `120de9f3dd29dba9214f7f84b635247b0233ee9b`. **Reviewer:** product owner (identity/attendance not recorded). **Exact browser-tested SHA:** PENDING. **Final design freeze:** BLOCKED.

This is an executable manual review worksheet, not a record that a person used a browser. It extends [PR #38 readiness](PRODUCT-OWNER-ACCEPTANCE-READINESS-PR38.md). The author has not impersonated a reviewer, invented screenshots, or performed screen-reader/real zoom/security tests.

## Setup and evidence capture

1. Check out the **exact SHA to be reviewed**, record it below, and open `employee-desktop/sprint-03/prototypes/qa-critical-flow.html` locally in Chromium/Chrome or Edge. This is a **simulation**: no real Jira/connector writes, keys or backend authorization.
2. Record OS, browser version, device scale, date/time and reviewer. For every PO case, capture a screenshot or recording and link it to an immutable repository/issue or review artifact; redact user data and never upload credentials.
3. Run each scenario from a **fresh reload** unless explicitly testing persistence. Verify both the visible status and the **absence** of unsafe progression. For any failure, record reproduction steps, expected vs actual, severity and a finding ID.
4. Use `PASS`, `FAIL`, `NOT TESTED`, or `NOT APPLICABLE` only. A case is PASS only after manual observation with evidence; CI cannot fill this column.
5. For actual zoom, use browser zoom UI at **200% and 400%**, not just a smaller Playwright viewport. For assistive technology, use NVDA or VoiceOver and capture AT/browser/OS versions and announcements. Owner self-review is not independent specialist sign-off.

| Session field | Actual value |
|---|---|
| Reviewer / role | NOT RECORDED |
| Session date/time and timezone | NOT RECORDED |
| Reviewed commit SHA | NOT RECORDED |
| Browser and version | NOT RECORDED |
| OS and version | NOT RECORDED |
| Device scale / zoom settings | NOT RECORDED |
| Evidence folder / issue / artifact links | NOT RECORDED |
| Product-owner decision | UNSIGNED |

## Walkthrough script and results

| ID | Steps to perform manually | Expected outcome / pass criterion | Actual result | Evidence | Finding |
|---|---|---|---|---|---|
| PO-01 | Reload; inspect Jira story; click **Continue simulated review** to generated tests | Story and test draft distinguish simulated data; no publish action | NOT TESTED | PENDING | — |
| PO-02 | Advance to Request write permission; click **Approve exact action** | Receipt visible *before* advancement with action, QA-184 target, single-use exact-action scope, simulated 10-minute expiry | NOT TESTED | PENDING | — |
| PO-03 | From receipt click **Cancel approval** | Remains at permission step; no attachment or progression | NOT TESTED | PENDING | — |
| PO-04 | Open receipt again; click **Continue with approved action** | Enters browser testing once; no persistent reusable approval displayed | NOT TESTED | PENDING | — |
| PO-05 | Reload per case; exercise **Deny**, **Expire approval**, **Request fresh approval**, **Revoke credential** and policy/target/environment drift | Stale or denied permission cannot authorize write; recovery requires fresh authorization | NOT TESTED | PENDING | — |
| PO-06 | Advance through browser testing, evidence review and defect draft; approve defect action | Separate one-time defect receipt with correct action/target; no automatic write | NOT TESTED | PENDING | — |
| PO-07 | Exercise **Go offline**, **Reconnect and reauthorize**, expired and corrupt cache branches | Privileged actions fail closed offline; reconnect does not silently replay | NOT TESTED | PENDING | — |
| PO-08 | Exercise **Browser timeout**, cancellation request/confirmation and conflict branches | Unknown is not success; no unsafe retry; cancellation request differs from confirmed cancellation | NOT TESTED | PENDING | — |
| PO-09 | Inspect redacted evidence and unapproved connector denial | Mock labels are clear; no live enforcement claimed | NOT TESTED | PENDING | — |
| PO-10 | Review light/dark; keyboard-only Tab/Shift+Tab/Enter/Escape; widths 320/400/480/960/1440 | Focus remains visible, no clipped controls or ambiguous state, keyboard path works | NOT TESTED | PENDING | — |
| PO-11 | Repeat critical flow at actual 200%/400% browser zoom with screen reader enabled | Usable reflow and correct heading/status/receipt announcements; exact versions recorded | NOT TESTED | PENDING | — |

**Note:** The step names above are review prompts; if a control differs in the current prototype, record the actual control and an issue rather than assuming it exists.

## Evidence manifest — fill after real observation

| Case ID | Evidence URL | Exact SHA | Reviewer | Browser/OS/AT/zoom | Timestamp | Observed behavior | Result |
|---|---|---|---|---|---|---|---|
| PO-01–11 | PENDING | PENDING | PENDING | PENDING | PENDING | NOT OBSERVED | NOT TESTED |

Evidence integrity rule: no invented URL, screenshot, assessor, test run or PASS. CI screenshots may be linked as **automated reference material only**, never labeled owner observations.

## Finding triage and retest protocol

For an actual issue, create a unique `PO39-XX` identifier and record: case, exact SHA, reproduction, expected/actual, severity, screenshot/recording link, fix owner, fix PR, retest SHA, and disposition. Add it to [independent findings/remediation](INDEPENDENT-FINDINGS-REMEDIATION.md) with track `PO SELF-REVIEW` so it is not confused with an independent assessment. If no cases were executed, do not invent findings.

| Finding ID | Case | Observed defect and reproduction | Severity | Evidence | Fix PR | Retest SHA | Disposition |
|---|---|---|---|---|---|---|---|
| NONE RECORDED | — | No manual walkthrough has been recorded | — | — | — | — | NOT TESTED |

## Design and governance boundaries

- **PO35-02 Option A:** implemented in [PR #37](https://github.com/Agents-Foundry/prototypes/pull/37); manual acceptance remains NOT TESTED.
- **PO35-03:** authoritative EMP-DEC-01–10 approval links and specific SEC mappings remain INCOMPLETE; see [security evidence ledger](SECURITY-EVIDENCE-LEDGER-PR34.md).
- **PO35-04:** independent security/privacy, accessibility/screen-reader/real zoom and visual QA remain PENDING. Owner self-review is not independent review.
- Product-owner acceptance, final design freeze, and authorization to implement production application code are **NOT GRANTED** by creating or merging this PR.

## Formal product-owner disposition — leave unsigned until actual review

Choose exactly one **after** recording results: **ACCEPT DESIGN DIRECTION FOR FURTHER REVIEW ONLY / REQUEST DESIGN CHANGES / DEFER**.

| Required sign-off | Value |
|---|---|
| Owner name, date, reviewed SHA | PENDING |
| PO-01–11 outcomes and evidence | NOT TESTED |
| Actual findings disposition | PENDING |
| Decision and rationale | NOT SELECTED |
| Independent review exceptions or approved governance changes | NONE RECORDED |
| Final design freeze | BLOCKED |
