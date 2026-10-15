# UX verification protocol

## Wizard state review
1. From AI Employees, choose a blueprint and visit Configure.
2. Fill sample data, click Next and Back; previously entered values should be restored in that browser session.
3. Click Save draft; find Resume draft on AI Employees, then resume at the last saved step.
4. Click Cancel and reject confirmation: wizard remains. Confirm cancellation: return to directory and discard draft in demo state.
5. Review activation, request approval and confirm. Result must be Pending approval, not Active.
6. Try theme toggle, preview-state selector and navigation at representative viewport widths.

## Technical / design qualifications
The prototype stores drafts only in in-memory JavaScript state, so browser refresh loses them. Real persistence and request lifecycle are not implemented. Prototype interactions are design simulations, not QA evidence of production behavior. Input validation, focus return, form semantics, screen reader announcements and contrast all require independent verification.

## Required visual acceptance evidence
- Render and inspect 375 / 768 / 1024 / 1280 / 1440 / 1920 px widths.
- Keyboard-only test including modal focus management.
- Test 200% zoom and WCAG 2.2 AA contrast.
- Record reviewer, date, screenshots and defects for each priority journey.

No browser test run, screenshots, automated a11y report or approval is claimed as part of this document.
