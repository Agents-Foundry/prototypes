# Sprint 01 Automated QA execution record

## Run 1 — failures identified
- [GitHub Actions run 38777102639](https://github.com/Agents-Foundry/prototypes/actions/runs/38777102639): **FAILED**.
- 15 tests passed, 3 failed: 375px horizontal overflow, 768px horizontal overflow and narrow-width 200%-zoom approximation overflow.
- Root category: insufficient narrow viewport constraints for grid/navigation.
- Failure artifacts preserved in GitHub Actions.

## Corrective design-prototype change
- Commit `3cb903b229d2cce23617478517ce428930e89052` adds layout constraints, scrollable navigation strip and narrow-width wrapping to the review-only HTML prototype.

## Run 2 — automated gate passed
- [GitHub Actions run 38777557582](https://github.com/Agents-Foundry/prototypes/actions/runs/38777557582): **PASSED**.
- Playwright test suite: **18 passed** (6 target viewport checks, wizard/activation behavior scenarios and axe-based critical-screen checks).
- Chromimum headless in GitHub Actions. This is evidence for the automated tests as written; no claim is made for other browsers, full manual visual comparison or comprehensive WCAG 2.2 AA compliance.

## Acceptance distinction
- **Automated Chromium/axe smoke gate:** Passed on the recorded commit.
- **Independent visual review:** Pending screenshot inspection/approval.
- **Manual accessibility:** Pending keyboard + assistive technology + real 200% zoom and color contrast review.
- **Security design approval:** Pending independent security/governance signature.
- **Design owner signature:** Pending.
- **Final baseline v1.0 freeze:** BLOCKED.

No production application source was changed.
