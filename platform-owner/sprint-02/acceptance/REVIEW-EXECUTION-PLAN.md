# Sprint 02 — independent acceptance execution plan

## Phase 1: Establish evidence set
1. Pin candidate SHA `2468610e0db57f29613ad0a0a002cfb791b8378b` and enumerate 22 PLT screen visuals (44 frames), 12 critical scenarios (24 state frames), interactive prototype and approved DEC-01–10.
2. Retrieve and archive the Chromium artifacts for run 38886048215, noting that automated coverage is targeted, not exhaustive.
3. Create an evidence index per screen/state; record gaps instead of calling inventory completion full acceptance.

## Phase 2: Parallel independent reviews
**Visual:** Compare both themes, mobile/tablet/desktop, real 200% zoom, all core routes, destructive-action confirmation, loading/errors and permission denials.
**Accessibility:** Keyboard-only, focus management, NVDA/VoiceOver, semantics, error announcements, 200–400% reflow, contrast and reduced motion.
**Security/privacy:** Independently challenge PLT-DEC-01–10 boundaries: tenant isolation, consent, break glass, regional data flow, race conditions, signing, policy precedence, staff SSO, trace redaction and irreversible deletion.
**Product-owner journey:** Approve or reject UX behavior end to end; existing individual policy-choice decisions are not substitutes.

## Phase 3: Defect closure and freeze decision
Assign, fix and retest each finding; refresh candidate SHA after changes. Collect named gate decisions and link evidence. Only then request explicit freeze authorization and create a baseline release/tag from the approved SHA. Never tag or claim frozen while independent gates are pending.

## Current checkpoint
**Automated smoke:** Passed in prior run. **Independent visual:** pending. **Manual accessibility:** pending. **Independent security/privacy:** pending. **Design owner:** pending. **End-to-end product owner UX:** pending. **Freeze:** blocked.
