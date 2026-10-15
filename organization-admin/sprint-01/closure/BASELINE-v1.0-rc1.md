# Agents Foundry — Organization Admin Design Baseline v1.0-rc1

**Status:** Release candidate, **NOT APPROVED** or frozen.

## Scope
- ORG-001 through ORG-013 core SVG frames: `../screens/`.
- Review states: `../qa/visual-states/`.
- Interaction exploration: `../prototype/index.html`.
- State and UX contracts: `../interaction-states/STATE-MATRIX.md`, `../qa/INTERACTION-CONTRACT.md` and `CRITICAL-STATE-CATALOG.md`.
- Direction C: balanced premium AI enterprise.

## Design defaults proposed
- Organization admin can initiate onboarding and AI hiring only if authorized; system still evaluates policy at execution time.
- Approval request produces pending state; it is not activation.
- An AI employee is active only after approval (when needed), required checks and successful provisioning.
- Provider, connector and credential choices never expose secrets.
- One primary responsible team/manager per employee initially; cross-team scope is an unresolved product decision.

## Not approved yet
Security policy decisions, mandatory hierarchy ordering, BYOK behavior, enterprise SSO, multi-team assignments and budget ownership remain open. Accessibility verification, browser visual testing and complete per-state visuals also remain pending. Reviewers must sign in `../qa/SIGNOFF.md` or a versioned replacement with explicit revision IDs.

## Change control
Change any approved screen only through a new revision, updated screen registry pointer and reviewed PR. Do not modify an approved baseline silently.
