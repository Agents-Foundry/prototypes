# Sprint 03 — Independent accessibility and visual QA review protocol

**Status:** REVIEW PACKAGE ONLY — NOT SIGNED OFF. **Baseline:** reviewer must record immutable Git commit SHA, browser build, OS version, display settings, assistive technology version, theme and artifact URLs. This is a simulated design prototype, not production behavior.

## Scope and inventory

- Employee desktop Sprint 03 QA story → test cases → browser evidence → defect draft interaction prototype.
- EMP-001–016 light/dark screen concepts (32 SVG references) and critical-state variants (18 IDs × 2 widths × 2 themes = 72 SVGs) as recorded in `REVIEW-GATES.md`.
- Normal, denied, expired authorization, offline/read-only, reconnect, unknown external outcome, cancellation, error and recovery branches where present. Note missing variants as findings rather than claiming coverage.
- Automated axe/Chromium checks from PR #24 are supporting evidence only. CSS viewport proxies are **not** proof of actual browser zoom or screen-reader usability.

## Manual accessibility matrix

| ID | Test | Procedure | Expected design outcome | Evidence |
|---|---|---|---|---|
| A11Y-01 | Keyboard-only journey | Unplug mouse; Tab/Shift+Tab/Enter/Space/Escape through every flow and modal | Every interactive element reachable and operable, logical focus order, no traps | Screen recording + focus-order notes |
| A11Y-02 | Focus after transitions | Trigger deny, expiry, reset, offline, reconnect, cancel and errors | Focus lands at meaningful heading/status/action; no focus loss to removed element | Recording + DOM/focus notes |
| A11Y-03 | Screen-reader semantics | NVDA + Firefox/Chrome on Windows; VoiceOver + Safari on macOS where available | Names, roles, values, state changes and landmarks are intelligible | Spoken output transcript + recording |
| A11Y-04 | Live announcements | Trigger async-style status, denial and recovery messages | Correctly announced without duplicate chatter; critical changes not color-only | AT transcript |
| A11Y-05 | Contrast and non-color cues | Review both themes and disabled/error/focus states | WCAG 2.2 AA applicable contrast criteria; labels/icons supplement color | Measured ratios + annotated screenshots |
| A11Y-06 | Text resize and reflow | Real browser 200% and 400% zoom where applicable; 320 CSS-px effective viewport | No lost information/functionality or two-dimensional scrolling except permitted content | Browser zoom indicator + viewport and screenshots |
| A11Y-07 | High contrast/forced colors | Windows forced-colors/high contrast and reduced motion | Essential borders, selection, focus and status survive; no motion dependency | OS setting screenshot + recording |
| A11Y-08 | Language and comprehension | Review labels, error remediation, approval/denial and recovery copy | Plain language; actionable next step; clear simulated vs live boundary | Copy annotations |
| A11Y-09 | Touch/pointer targets | Check at 320/400/480 CSS px and desktop widths | Adequate target size and spacing, no accidental privileged action | Measurements + screenshots |
| A11Y-10 | Offline read-only expiry | Simulate 24-hour entitlement expiry, revoked/unknown local authorization, reconnect | Clear offline indicator; no actionable write; deny on expiry; accessible status | Scenario recording; mark missing simulation NOT TESTED |

**Do not claim full WCAG conformance from these checks alone.** Record criterion-level results and independent specialist identity.

## Actual zoom and device matrix

Capture **actual browser zoom**, not only Playwright viewport emulation. Minimum review combinations:
- Windows 11, Chrome and Edge, 100% / 200% browser zoom; OS display scaling 100% and 200% where feasible.
- Windows 11, NVDA with Chrome or Firefox for spoken navigation; record exact versions.
- macOS, Safari + VoiceOver where available; if unavailable mark NOT TESTED with follow-up owner.
- Browser viewport at 960, 1280 and 1440 CSS px before zoom; verify effective 320/400/480 widths with real browser settings as appropriate.
- Light and dark theme at each representative width and every critical state.

For every capture record device/OS, physical resolution, OS scaling, browser/AT versions, browser zoom %, viewport CSS px, theme, state ID, git SHA, evidence URI, and any exception.

## Visual QA acceptance checklist

For **every** EMP screen/state/theme/width combination, independently inspect:
- Layout alignment, spacing, hierarchy, typography, truncation, responsive reflow and contrast.
- Loading/pending, denied, failed, stale, expired, unknown outcome, offline, reconnect and recovery states as applicable.
- Action labels, confirmation copy, environment/tenant badges, destructive-action distinction and visible safety boundary.
- Focus, hover, disabled, keyboard and forced-color appearances.
- Screenshot parity against pinned design asset and absence of secrets/PII in evidence.
- Legibility at actual 200% zoom; record any unsupported state as missing coverage, not a pass.

## Reproducible evidence register

| Finding ID | Screen/state | Theme/width | Device/browser/AT/zoom | Expected vs observed | WCAG criterion or visual rule | Severity | Evidence URL | Owner | Retest SHA | Disposition |
|---|---|---|---|---|---|---|---|---|---|---|
| TEMPLATE-001 | TBD | TBD | TBD | TBD | TBD | Reviewer-assigned | TBD | TBD | TBD | NOT TESTED |

Allowed dispositions: **PASS / FAIL / NOT TESTED / NOT APPLICABLE** (with justification). No blank evidence can be interpreted as PASS. Severity and acceptance are assigned by independent reviewers, not by automation.

## Reviewer handoff and sign-off

1. Pin the exact reviewed SHA and enumerate inventory of 32 concept and 72 critical-state SVGs, prototype routes and evidence artifacts; document omissions.
2. Independently execute A11Y-01–10 and the actual zoom matrix. Attach raw evidence, transcripts and criterion-level findings.
3. Perform screen-by-screen visual QA and record each combination in the evidence register; identify any unreviewed variants.
4. Triage blockers, assign owners, amend designs, rerun relevant checks, and independently retest against new SHA.
5. Obtain **separate named sign-offs** for accessibility specialist, visual QA/design owner and security/privacy reviewer. Product-owner approval does not substitute for specialist sign-off.
6. Keep **final design freeze BLOCKED** until all mandatory gates are independently accepted and the product owner explicitly authorizes freeze.

### Sign-off record (blank intentionally)

| Gate | Reviewer | Reviewed SHA | Evidence index | Date | Decision |
|---|---|---|---|---|---|
| Manual accessibility / assistive technology | TBD | TBD | TBD | TBD | PENDING |
| Actual browser/OS zoom | TBD | TBD | TBD | TBD | PENDING |
| Visual QA / design owner | TBD | TBD | TBD | TBD | PENDING |
| Independent security/privacy (PR #25 review package) | TBD | TBD | TBD | TBD | PENDING |
| Product-owner final design freeze | TBD | TBD | TBD | TBD | BLOCKED |

**Non-goals:** no production app code, real credentials, real Jira/browser side effects, CI-as-independent-sign-off or automatic design freeze.
