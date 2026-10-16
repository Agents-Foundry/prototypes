# Platform Owner — batch 01 interaction design and acceptance notes

## PLT-002 Dashboard
- Show cross-tenant aggregate counts and delayed-data indicators; never infer authorization to reveal conversations or secrets.
- Each alert links to authorized remediation workflow, with read-only failure views and precise action history.

## PLT-003 Organizations
- Search by tenant metadata, explicit filters, pagination, loading/empty/error, status labels and tenant-scoped authorization.
- Selecting an organization does **not** imply impersonation or access to its protected data.

## PLT-005 / PLT-006 Provisioning
- Draft → Validate → Review → Policy Approval (when required) → Provisioning → Ready for tenant-admin setup / Active only after authoritative checks.
- Explicit errors, region confirmation, initial admin invitation, cancel/resume and idempotent retries; no fake instant activation.
- High-cost or privileged changes require approved decisions; operator cannot approve their own high-risk request if separation of duties is mandated.

## PLT-008 Billing
- Clearly label estimate vs reconciled charge, organization vs employee BYOK, capped allocation and pending plan upgrades.

## PLT-011 Catalog
- Signed immutable blueprint versions, allowlist rollout, pause/rollback states, organization opt-in and tenant-controlled restrictions.

## PLT-013 Security
- Operator privilege and organization tenant privilege separated. Scoped customer authorization for support operations, with expiry, logs, redaction and deny-by-default views.

## Acceptance dependencies
- PLT-DEC-01 through PLT-DEC-10 remain UNAPPROVED pending individual reviews.
- Mockup visual parity alone is not accessibility, security, or implementation approval.
- Required next evidence: viewport captures at 375/768/1024/1440; actual browser navigation, screen-reader keyboard testing, threat-model review and named signatures.
