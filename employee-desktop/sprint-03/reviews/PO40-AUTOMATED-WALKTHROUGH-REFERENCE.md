# PR #40 — automated product-owner walkthrough reference coverage

**Scope:** design-only, local HTML prototype and Playwright regression tests. **Baseline:** PR #39 merged as `c7f7b32886dd04e251c8d7858e941489ee71e0a5`.

The [PR #39 walkthrough worksheet](PRODUCT-OWNER-WALKTHROUGH-EXECUTION-PR39.md) is still **NOT TESTED** by the product owner. These new automated browser tests are **reference regression coverage**, not fabricated human observations or signed acceptance.

## New browser regression scenarios

| Automated test | PO walkthrough reference | Assertions |
|---|---|---|
| Story → draft → receipt → cancel/continue | PO-01–04 | Explicit mock banner; receipt fields; no auto-advance; cancel and one-time continue |
| Denial and target drift | PO-05 | Invalidated approval cannot advance; fresh approval prompt |
| Offline expiry/reconnect | PO-07 | No privileged offline action; cache expiry denial; fresh authorization |
| Unknown timeout | PO-08 | Unknown not completion; no automatic retry |
| Redaction, connector denial and defect receipt | PO-06/09 | Explicit mock labels; separate defect receipt |

Run using the repository's existing Playwright browser interaction workflow. Check the PR head CI before treating these tests as passing.

## What this PR does **not** establish

- No owner-performed PO-01–11 manual walkthrough, screenshots or owner sign-off.
- No real 200%/400% browser zoom, NVDA/VoiceOver, keyboard or independent visual assessment (PO-10/11).
- No actual security controls, backend authorization, cryptographic cache or external Jira write.
- No authoritative EMP-DEC-01–10 approval source crosswalk or SEC-01–14 independent disposition.
- No design freeze or production application authorization.

If any new test fails, correct the **test or design** on this PR branch, then rerun CI. Record genuine manual observations in the PR #39 worksheet separately.
