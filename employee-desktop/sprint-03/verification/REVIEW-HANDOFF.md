# Sprint 03 — automated review preparation and handoff

PR #22 adds deterministic **structural** design checks, not a full UX or security certification.

## Machine-verifiable acceptance
- EMP-001 through EMP-016 have a 1440px SVG in each theme.
- All eighteen PR #21 critical-state IDs have 960px and 1440px SVGs in each theme.
- Every inspected SVG is valid XML, declares dimensions, a viewBox and a basic alternative description.
- The standalone prototype declares important simulated branch markers and is not meant to fetch network data.

Run locally: `python employee-desktop/sprint-03/verification/check_assets.py`.

## Unfinished human validation
The validator **does not measure contrast**, detect overflow, establish responsive usability, prove keyboard/screen-reader accessibility, provide security review, or test production policy enforcement. Assign named independent specialists for these checks and record findings referencing an exact SHA. Avoid claiming sign-off until evidence exists.

## Product-owner end-of-day review queue
1. Review PR #21 design interaction decisions; merged status is not acceptance of each state.
2. Review PR #22 automated design-integrity gate and its CI run.
3. Confirm priorities for outstanding screens at narrower windows/200% zoom.
4. Name independent security/privacy and accessibility reviewers.
5. Only when evidence is complete, consider explicit Sprint 02/Sprint 03 design freeze.

Do not create or edit production code in `Agents-Foundry/prototypes`.
