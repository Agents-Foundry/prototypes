# Sprint 03 — CI evidence publishing and review handoff

The `Sprint 03 review evidence` GitHub Actions workflow runs on PRs affecting the Sprint 03 prototype and on manual dispatch. It runs the existing Playwright `review-evidence.spec.cjs` matrix, then executes `build_review_index.py` even if tests fail, and uploads screenshots, JSON reports, Playwright output and `review-index/index.html` / `index.json` for 14 days.

**Coverage contract:** 8 simulated states × 2 themes × 3 CSS widths = 48 entries. The index checks both PNG and JSON presence, JSON identity, axe violation count and CSS overflow; any missing, invalid or failing entry makes the index step fail. The CI job must not be considered successful if either Playwright or index generation fails.

**Manual reproduction:**

```sh
cd employee-desktop/sprint-03/verification/browser
npm install --no-audit --no-fund
npx playwright install chromium
npx playwright test review-evidence.spec.cjs
python3 build_review_index.py
```

**Reviewer instructions:** In the PR Checks tab open `Sprint 03 review evidence`, download the `sprint-03-review-evidence` artifact, inspect `test-results/review-index/index.html` and per-case PNG/JSON. Record the exact commit SHA and workflow run URL in the independent review register. A missing CI run is **NOT VERIFIED**, not PASS.

**Limitations:** The suite tests a static, simulated local prototype. It does not perform real browser/OS 200% zoom, screen-reader usability, real 24-hour offline entitlement expiry, tenant security enforcement or independent visual QA. Those gates remain pending in `../../reviews/ACCESSIBILITY-VISUAL-QA-REVIEW.md` and `../../reviews/SECURITY-PRIVACY-REVIEW.md`. CI artifacts are not approvals. Final design freeze remains blocked.
