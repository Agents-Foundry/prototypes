# PR #21 — Design validation evidence and review register

## Evidence reproducible from repository
1. Inspect `critical-states/` and verify **18 unique state IDs and four PNG-free SVG variants each**, two widths (960, 1440) and two visual themes.
2. Open `prototypes/qa-critical-flow.html` locally in a browser. It is **standalone and offline-only**, with simulated state changes. No actual Jira, browser automation, credential broker, storage or backend is integrated.
3. Exercise linear QA workflow and the branch states: grant / deny / expire authorization, revoke connection, browser timeout, offline, unknown external outcome and reconciliation.
4. Inspect SVG labels for tenant/environment and confirm the copy never claims successful third-party writes before an externally verified response.
5. Review the policy ledger `POLICY-QUESTIONS.md` for ten individual approvals; validate UX text against those approved boundaries.

## Evidence presently available
| Check | Status | Evidence / limitation |
|---|---|---|
| 18 unique critical scenario IDs | CREATED, counts to verify in PR | Files by prefix in critical-states |
| 960 and 1440 visual variants, both themes | CREATED, unreviewed | SVG design assets |
| Locally interactive review-only scenario | CREATED, untested in browser | prototypes/qa-critical-flow.html |
| Explicit denial, expiry and revoked branches | DESIGNED | Static states and local prototype |
| Unknown remote outcome and recovery | DESIGNED | Static states and local prototype |
| No production source code introduced | SCOPE ASSERTION, requires PR diff review | Assets are SVG, HTML and Markdown prototypes |
| Layout rendered at 960 and 1440 | **NOT VISUALLY VERIFIED** | Browser screenshots and reviewer needed |
| Keyboard and screen reader manual accessibility | **NOT TESTED** | Named independent review needed |
| Contrast, 200% zoom, focus behavior | **NOT TESTED** | Capture and assess using automated/manual tests |
| Threat-model / privacy / data residency | **PENDING** | Security/privacy reviewer needed |
| E2E usability and product design-owner sign-off | **PENDING** | Reviewer/test scenarios and signed disposition needed |
| Sprint 03 design freeze | **BLOCKED** | Cannot approve while above gates open |

## Manual acceptance protocol
- Confirm light/dark parity and visual legibility at 960 and 1440; capture screenshots with viewport dimensions and git SHA.
- Run automated accessibility evaluation, plus keyboard Tab/Enter/Escape walkthrough; check visible focus, live region, semantic headings and contrast.
- Test simulated flow: no approval → deny → retry blocked; approve once → expire/revoke; offline → reconnect → reconcile uncertain response without duplicate publish.
- Independently review what information could reach the model, local cache, Jira, screenshots and logs.
- Report each issue with asset path, state ID, viewport/theme, reproduction steps, severity and fix proof.

**No unperformed verification is marked passed.** Product policy approval and a merged design PR do not satisfy independent acceptance.
