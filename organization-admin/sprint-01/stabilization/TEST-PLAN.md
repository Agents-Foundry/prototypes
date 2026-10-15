# UX stabilization verification plan

## Manual smoke scenarios (required before sign-off)
1. Open `../prototype/index.html` locally and verify every enabled sidebar destination corresponds to its named screen; unavailable destinations show **Soon**, not a misleading route.
2. Follow dashboard → AI Employees → Choose blueprint → Configure → Capabilities → Integrations → Review → Request activation → Confirm.
3. Assert resulting view is **Approval pending** and states that employee cannot execute tasks, **not Active**.
4. Cancel activation request dialog. Confirm no status transition occurs.
5. On result screen, select Error / No permission / Approval pending in preview state control; verify simulated variants and return to default. These are illustrative only.
6. Toggle dark mode on each critical screen and inspect text contrast.
7. At 1440, 1280, 1024, 768, 375 CSS pixels, check navigation, wizard labels, form overflow and dialog focus.
8. Keyboard: Tab/Shift+Tab, Enter/Space, Escape dialog, label associations and visible focus.
9. Validate no input value is uploaded or persisted; demonstration has no backend requests.

## Evidence gaps
No automatic browser screenshots, visual regression snapshots, manual device/browser test results, or independent WCAG 2.2 AA validation are asserted in this PR. Record actual evidence before checking sign-off gates.
