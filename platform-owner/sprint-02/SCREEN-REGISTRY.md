# Platform Owner Console — Screen Registry (draft)

| ID | Screen | Core job | Required states |
|---|---|---|---|
| PLT-001 | Operator login and MFA | Secure platform access | login, challenge, recovery, denied, locked |
| PLT-002 | Platform overview | Tenant health, usage, alerts | normal, stale metrics, partial outage, no permission |
| PLT-003 | Organizations directory | Find and filter tenants | loading, empty, results, error, suspended |
| PLT-004 | Organization profile | Lifecycle, admins, plan, support | active, onboarding, suspended, terminated, denied |
| PLT-005 | Provisioning wizard | Create tenant safely | draft, validation, pending review, provisioning, failed |
| PLT-006 | Provisioning review and approval | Confirm region, plan, identity | blocked, pending approval, approved, rejected |
| PLT-007 | Tenant invitation and handoff | Invite first tenant admin | pending, expired, accepted, resent, revoked |
| PLT-008 | Plans and entitlements | Offer and assign plans | trial, paid, past due, over limit, change pending |
| PLT-009 | Billing operations | Invoices and payment health | current, disputed, failed, restricted |
| PLT-010 | Usage and spending | Platform metrics and anomalies | live, delayed, estimated, reconciled |
| PLT-011 | Global blueprint catalog | Review blueprint versions | draft, published, deprecated, restricted |
| PLT-012 | Blueprint rollout management | Controlled tenant availability | staged, paused, failed, rollback |
| PLT-013 | Security posture | MFA, SSO, policy drift alerts | compliant, drift, blocked, incident |
| PLT-014 | Platform audit explorer | Immutable operator event search | results, redacted, retention expiry |
| PLT-015 | Provider/integration health | Model and external platform health | available, degraded, offline |
| PLT-016 | Incident center | Track operational incidents | open, investigating, resolved |
| PLT-017 | Support cases | Support workflow without default tenant access | open, escalated, closed, access requested |
| PLT-018 | Time-boxed support access | Request customer-authorized access | pending, active scoped session, expired, denied |
| PLT-019 | Policy template management | Versioned platform defaults | draft, review, published, rollback |
| PLT-020 | Platform staff and roles | Restrict internal permissions | invite, active, revoked, access review |
| PLT-021 | Operator settings | Notifications, audit, region defaults | default, invalid, saved |
| PLT-022 | Tenant suspension/termination review | High-risk lifecycle workflow | reason, approval, quarantine, completed, failed |

All IDs are proposed, not signed. Every detailed screen to have light/dark and breakpoint review, keyboard semantics, permission denial, loading/error/empty, and sensitivity/redaction behavior as applicable.

## Navigation grouping
Overview (PLT-002); Organizations (PLT-003–007, PLT-022); Commercial (PLT-008–010); Agent Catalog (PLT-011–012); Governance (PLT-013–014, PLT-019–020); Operations (PLT-015–018); Settings (PLT-021).

## Release gates
A mock screen alone is insufficient to approve an action workflow. Review both optimistic and failure cases; provisioning and suspension must show pending states before authoritative completion.
