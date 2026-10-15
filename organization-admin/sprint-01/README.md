# Design Sprint 01 — Organization Admin Console

**Status:** Draft / awaiting design review. **Scope:** screen design, navigation, product behavior and clickable prototype planning only. **Implementation:** out of scope.

## Journeys
1. Admin activation → organization setup → onboarding readiness.
2. Dashboard → departments / teams / roles → organizational hierarchy.
3. AI employees directory → blueprint selection → role and model configuration → capabilities → integrations → review and activation.

## Navigation concept
Dashboard, Organization, People, AI Employees, Integrations, Policies, Approvals, Analytics, Settings. In the hiring wizard, use focused contextual step navigation rather than changing global navigation.

## Visuals
The first generated multi-screen contact sheet exists in the ChatGPT design discussion; it has **not** yet been committed to this repository. Create separate per-screen editable mockups and exports before design freeze. Two initial editable SVG wireframe mockups are tracked in `screens/`.

## Approval gate
Require review of each screen, page states, hierarchy semantics, employee vs blueprint distinction, provider BYOK UX, connection health states, approval policies and activation safety gates.


## Refinement review package — PR #3

- [Interactive HTML prototype](prototype/index.html): open locally in a browser to navigate 13 screen concepts, preview states, toggle light/dark mode and exercise selected safe confirmation flows. GitHub does not execute HTML in its source viewer; download/open the file, or host as a reviewed static design preview.
- [State matrix](interaction-states/STATE-MATRIX.md): required normal, empty, loading, error, access-restricted and approval states for each screen.
- [Responsive and accessibility guidelines](design-system/RESPONSIVE-ACCESSIBILITY.md).
- [User-flow decisions](USER-FLOW-DECISIONS.md): open product questions and activation gate semantics.

**Design maturity:** Interaction exploration delivered. Final frame-by-frame state visuals, tested responsive screenshots, Figma master file, formal accessibility validation and stakeholder sign-off are NOT complete and must not be represented as approved.

## PR #4 QA gate

See [QA audit and sign-off](qa/README.md) and [15 state previews](qa/visual-states/README.md). All artifacts remain draft until explicit review and outstanding P0/P1 items are resolved. Merge does not constitute design freeze.
