# PO35-02 — approved one-time approval receipt design

**Product-owner decision:** Option A approved on 2026-10-16: show a one-time approval receipt with **action, target, scope and expiry before advancing**. This is product-design approval only.

## Design implementation

The local-only QA critical-flow HTML now shows a simulated approval receipt at the Jira attachment and defect creation approval steps. The receipt states the action, QA-184 target, exact-action single-use scope and simulated 10-minute expiry (not a live timer). The user can **Continue with approved action** or **Cancel approval**. Continue consumes the display receipt and advances; cancel returns to the permission step without advancing. Neither path performs any external action.

## Regression evidence

- New Playwright test `approval-receipt-po35-02.spec.cjs`: receipt fields, no automatic advance, explicit continue, cancellation and defect-approval receipt.
- Existing accessibility, critical-state and final-handoff tests updated to use the new explicit continue step.
- New PR-head CI, browser screenshots, axe scans and independent review are **PENDING** until executed and inspected.

## Known limitations and review gates

- Receipt is **mock data**; it does not prove authenticated actor identity, secure issuance, replay prevention, actual expiry, audit signing, or external write authorization.
- The 10-minute display text is not an elapsed-time countdown. Real expiry must be checked at execution by the future control plane/action gateway.
- EMP-DEC-01–10 remain product-owner-approved design direction; this decision supplements them and does not silently replace them.
- Independent security/privacy, real screen-reader and browser zoom testing, independent visual QA and final design freeze remain **PENDING/BLOCKED**.
