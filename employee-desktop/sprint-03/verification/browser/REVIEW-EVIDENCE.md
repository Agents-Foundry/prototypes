# Sprint 03 automated review evidence

Run from `employee-desktop/sprint-03/verification/browser`:

```sh
npm ci
npx playwright install chromium
npx playwright test review-evidence.spec.cjs
```

The test captures **48** scenario/theme/width combinations (8 simulated states × 2 themes × 3 CSS widths) as PNG and JSON under `test-results/review-evidence/`. JSON includes axe WCAG 2.1 A/AA violations, CSS overflow, simulated state, commit identity (when `GITHUB_SHA` is set), and explicit flags marking **actual browser zoom, screen-reader validation and independent visual QA as not completed**.

These are **prototype-only automated artifacts**; neither browser zoom nor OS scaling is changed. This test cannot validate the 24-hour offline authorization expiry because that control is a policy design requirement, not a working prototype implementation. Missing states and failed assertions must be reported, not treated as passes.

For human review, follow `../../reviews/ACCESSIBILITY-VISUAL-QA-REVIEW.md` and `../../reviews/SECURITY-PRIVACY-REVIEW.md`. Record named reviewer, real browser/OS zoom, assistive technology, device, evidence links and findings against a pinned SHA. Do not merge or freeze based on automated reports alone.
