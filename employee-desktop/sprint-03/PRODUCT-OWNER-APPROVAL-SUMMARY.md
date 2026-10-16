# Sprint 03 — Employee Desktop Agent Experience product-owner policy approvals

**Date:** 2026-10-16  
**Status:** **10/10 individually approved product-policy directions**  
**Scope:** Design-policy decisions, not independently verified security implementation, visual quality, accessibility, application readiness or a signed/frozen baseline.
**Authoritative detailed record:** [POLICY-QUESTIONS.md](POLICY-QUESTIONS.md).

## Individual approvals

| ID | Option | Approved direction | Principal design surfaces |
|---|---|---|---|
| EMP-DEC-01 | B | Cross-platform native-feeling desktop shell with separate least-privilege execution kernel and protected credentials | EMP-001–006, 011, 015–016 |
| EMP-DEC-02 | B | Tenant-isolated central conversation synchronization with encrypted bounded local cache, memory provenance and safe revocation | EMP-002–004, 009, 013, 015–016 |
| EMP-DEC-03 | B | OS-native credential storage, organization vault and scoped credential broker with redaction, lifecycle and approval boundaries | EMP-001, 005–006, 008, 011, 014–015 |
| EMP-DEC-04 | B | Environment-specific access and credentials, read-only production defaults, privileged step-up and fail-closed execution | EMP-004–006, 008, 012, 014, 016 |
| EMP-DEC-05 | B | Risk-based autonomous reads, scoped human approval for writes, safe pause/resume, revocation and audit | EMP-003–005, 007–008, 012, 016 |
| EMP-DEC-06 | B | Approved repo and branch scopes, isolated execution workspaces, brokered Git credentials and controlled commands/changes | EMP-004–005, 007, 009–011, 016 |
| EMP-DEC-07 | B | Isolated policy-controlled browser sessions, approved targets, brokered auth, safe testing and redacted evidence | EMP-004–006, 008–009, 012, 014, 016 |
| EMP-DEC-08 | B | Organization-admin-approved versioned connectors, delegated identities, effective permission intersections and governed writes | EMP-005–007, 010–012, 015 |
| EMP-DEC-09 | B | Encrypted tenant-scoped versioned artifacts, immutable provenance, safe sync, retained legal holds and governed sharing/deletion | EMP-003–004, 007–009, 012–013, 016 |
| EMP-DEC-10 | B | Durable checkpoints, explicit offline modes, fail-closed privileged actions, idempotent outcome reconciliation and validated resume | EMP-002–005, 008–009, 012–013, 016 |

## Acceptance register

| Gate | Status | Evidence needed |
|---|---|---|
| Individual product-policy direction | **APPROVED — 10/10** | Explicit approvals recorded in POLICY-QUESTIONS.md |
| Complete EMP-001–016 detailed design coverage | **INCOMPLETE** | Light/dark screens, critical states and behavior specifications |
| Manual visual and responsive QA | **PENDING** | Reproducible screenshots, defects and reviewer decision |
| Independent security/privacy review | **PENDING** | Isolation, approvals, secret custody, data residency, connector and recovery threat-model results |
| Manual accessibility review | **PENDING** | Keyboard, screen-reader, zoom, error state and contrast review |
| End-to-end product UX/design-owner approval | **PENDING** | Named acceptance of exact design revision |
| Final design baseline freeze | **BLOCKED** | All prerequisite reviews completed and explicit freeze authorization |

## Design follow-through

Each approved direction must be reflected in the applicable screens, particularly permission request/expiry, environment selection, credential connection/revocation, Jira and Git writes, browser evidence, artifacts, offline conflicts and reconciliation of uncertain external outcomes. Ensure fail-closed denials and pending states do not imply successful side effects.

No production app/runtime/backend code should be added to this repository. Merging the policy PR does not close independent acceptance gates.
