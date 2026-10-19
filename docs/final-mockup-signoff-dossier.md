# Final mockup sign-off dossier — candidate, not approved

**Scope:** Agents Foundry four-product interactive gallery (32 screens).  
**Status:** **SIGN-OFF PENDING**. This document is a review and evidence framework; it is not an approval certificate.

## Acceptance criteria and evidence

| Gate | Acceptance criterion | Evidence | Status |
| --- | --- | --- | --- |
| Product-specific journeys | All 32 screens expose an interactive, labeled sample input and validation/result feedback | `prototype-gallery/interactive-flows.js`; Playwright 32-screen traversal | Implemented; CI passed on 2026-10-18 |
| State behavior | Normal, loading, offline, denied, empty, error, unknown outcome | Gallery scenario selector; Playwright coverage | Implemented; CI passed on 2026-10-18 |
| Safe operations | No real tenant, member, secret, Jira, agent, publishing or policy mutation | Client-only JavaScript; read-only confirmation text | Source review pending |
| Browser QA | Desktop and mobile Chromium tests pass | [GitHub Actions run 39159170715](https://github.com/Agents-Foundry/prototypes/actions/runs/39159170715), `gallery-browser-qa` artifact | Automated CI passed (10/10); artifact not independently inspected |
| Accessibility | No serious/critical WCAG-tagged axe findings in automated scan; keyboard smoke test passes | axe + keyboard Playwright tests in [run 39159170715](https://github.com/Agents-Foundry/prototypes/actions/runs/39159170715) | Automated checks passed; independent/manual accessibility and zoom/reflow testing outstanding |
| Visual QA | Desktop/mobile layout and all screen states reviewed against design baseline | Screenshots and visual reviewer notes | Pending |
| Product owner | Named reviewer approves scope, UX and outstanding exceptions | Recorded approval with date and PR SHA | Pending |
| Independent security | Tenant isolation, privileged action, secrets, policy and audit design review | Signed review evidence | Pending |
| Independent accessibility | Manual keyboard, screen reader and focus-order verification | Signed review evidence | Pending |
| Final design freeze | All blocking findings closed; owner authorizes freeze | Signed release/design decision | Pending |

## Automated evidence provenance (not independent sign-off)

- **Verified source:** `main` commit [`03cc8339033b1b80946451f5699d748e9292cb2c`](https://github.com/Agents-Foundry/prototypes/commit/03cc8339033b1b80946451f5699d748e9292cb2c), workflow run [39159170715](https://github.com/Agents-Foundry/prototypes/actions/runs/39159170715), executed 2026-10-18 UTC. The browser job log reports **10/10 Playwright tests passed** across desktop and mobile Chromium, including screen traversal, example validation, scenario transitions, automated axe serious/critical checks, and keyboard-focus smoke tests.
- **Other green CI runs on that commit:** [Gallery Coverage](https://github.com/Agents-Foundry/prototypes/actions/runs/39159170884), [Mockup Coverage Reconciliation](https://github.com/Agents-Foundry/prototypes/actions/runs/39159170701), and [Prototype Gallery Pages](https://github.com/Agents-Foundry/prototypes/actions/runs/39159170747). These are workflow conclusions, not proof of independent manual acceptance.
- **Artifact provenance:** `gallery-browser-qa` uploaded 2026-10-18 19:32 UTC; GitHub reports expiration 2026-11-01 19:32 UTC. The artifact was **not downloaded, visually inspected, or independently attested** for this record. Preserve required evidence before expiration.
- **Explicit limits:** No independent security/privacy review, manual assistive-technology testing, actual browser zoom/reflow measurement, full visual baseline comparison, product-owner approval, or final design freeze is established by these checks. The seven selector scenarios and 32 screen examples are illustrative mockups, not production workflows.

## Primary reviewer assessment

**Current recommendation: CONDITIONAL REVIEW CANDIDATE.** The gallery now provides interactive sample validation for each screen, but this does **not** equal full implementation of every domain-specific product workflow. Validation is illustrative and client-side only. Do not describe this as production-ready, externally audited, or formally signed off.

## Review instructions

1. Open the [gallery](https://agents-foundry.github.io/prototypes/) after deployment has been confirmed.
2. Traverse all 32 screens in light and dark themes, and select each of seven scenarios.
3. Exercise per-screen input validation, clear-result, preview, previous/next and reset controls.
4. Inspect GitHub Actions **Gallery Browser and Accessibility QA** and its HTML report and trace artifacts.
5. Record issues with application, screen, scenario, viewport, reproduction, expected/actual, severity, owner and resolution commit.
6. Have product owner, security, accessibility and visual QA reviewers each record a separate decision.

## Approval record — fill only after evidence review

| Review role | Reviewer | Decision | Date | Evidence URL |
| --- | --- | --- | --- | --- |
| Primary design reviewer | Pending | Pending | — | — |
| Product owner | Pending | Pending | — | — |
| Security | Pending | Pending | — | — |
| Accessibility | Pending | Pending | — | — |
| Visual QA | Pending | Pending | — | — |
| Final freeze authority | Pending | Pending | — | — |

**Sign-off rule:** A merged PR or green automated check alone never constitutes final mockup sign-off. Approval must be explicit, attributable and tied to a reviewed commit.
