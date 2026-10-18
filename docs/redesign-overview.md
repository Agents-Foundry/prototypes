# Full-screen redesign overview

**Status: proposal for review.** This records what the redesign contains and what it does not claim.

## What changed

Before, only 13 Organization Admin screens and one Employee Desktop screen had real layouts; most other screens were one template with different text, Agent Studio had only 8 gallery concepts, and the four surfaces were not connected. The redesign replaces that with four linked, stateful prototypes on one shared design system:

| Surface | Screens | Legacy IDs redesigned | New IDs |
| --- | ---: | --- | --- |
| Platform Owner | 28 | PLT-001–022 | PLT-023–028 |
| Organization Admin | 27 | ORG-001–013 | ORG-014–027 |
| Employee Desktop | 24 | EMP-001–016 | EMP-017–024 |
| Agent Studio | 20 | none (first full design) | STD-001–020 |
| **Total** | **99** | | |

Full list: [screen registry](../screen-registry/SCREENS.md).

## Design decisions worth reviewing

- **Fail-closed everywhere.** Every screen can be viewed as loading, empty, error, permission denied, offline, outcome unknown or stale. Offline and unknown-outcome disable the controls marked as writes.
- **Approvals bind to one exact action.** Employee approvals are single-use, scoped and expire; target, policy or environment changes invalidate them. Typed confirmation guards destructive or irreversible actions.
- **Independent review.** Authors cannot approve their own blueprints, operators cannot approve their own tenant requests, admins cannot approve their own requests.
- **Operators have no default tenant access.** Support access is requested from the customer, scoped and time-boxed.
- **Cross-surface coherence.** The same QA Engineer blueprint, Codifyd tenant and QA-184 story appear across surfaces so journeys can be followed end to end: author and publish (STD), hire and govern (ORG), work and approve (EMP), operate and release (PLT).
- **Traceable specs.** Each screen carries a spec drawer (goal, states, security, accessibility) so reviewers can compare behavior with decisions.

## What is not claimed

- No product-owner, security/privacy, accessibility, visual or design-freeze approval has occurred. Every screen is a proposal.
- The prototypes simulate everything. Denials, approvals, audit records, counts and timelines are illustrative and do not show that any backend enforces them.
- Automated checks cover structure (`scripts/check_apps.py`), rendering of every screen in all eight scenarios, a keyboard smoke test and axe-core rules (WCAG 2.x A/AA tags, default state, light and dark). Axe finds only part of accessibility problems; real keyboard-only, screen-reader, zoom and reflow reviews remain to be done and recorded.
- Mobile and narrow-window layouts have had no manual review.
- Legacy sprint documents and SVG evidence are unchanged and remain the historical record. Some legacy decisions (EMP-DEC-01–10, PLT-DEC, ORG DEC) informed the redesign but have not been re-traced screen by screen.

## Suggested review order

1. Walk one journey per persona across surfaces (see the per-surface READMEs).
2. Use the scenario menu on each high-risk screen: EMP-005, EMP-016, ORG-012, ORG-027, PLT-018, PLT-022, STD-015, STD-016.
3. Compare each screen's spec drawer with the relevant decision record and log gaps.
4. Schedule the independent reviews listed in the [root README](../README.md#decisions-review-and-approval).

## Known gaps

- Responsive behavior below about 700 px is basic (navigation collapses to a menu).
- Data tables are not sortable or paginated; filters are simple.
- Content for rare states (for example partial outage per region) is described in screen specs but not drawn on every screen.
- The EMP QA flow in `employee-desktop/sprint-03/prototypes/` is retained as legacy evidence; the redesigned flow lives in `employee-desktop/app/`.
