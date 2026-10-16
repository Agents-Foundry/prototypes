# Sprint 02 — Governed workflows and denied-state contract

All transitions below are **design contracts**, not implemented enforcement or production integrations.

## Tenant provisioning · PLT-005–007
Draft → Validation → Review → Pending Approval (if policy requires) → Provisioning → Ready for Admin Setup → Active (after tenant readiness). Validation Failed, Rejected, Provisioning Failed, Cancelled and Retry Pending are distinct non-Active outcomes. Approval request is never activation. Retry must be idempotent, scoped and audited.

## Support access · PLT-017–018
Case Open → Tenant Authorized (normal) / Exceptional Independent Approval (restricted critical incident) → Scoped Session Active → Expired or Revoked → Post-Incident Review. Missing tenant approval fails closed outside narrowly governed emergency paths. Operator never gains standing access to conversations, secrets or unrestricted exports. Active sessions show scope, countdown and revoke.

## Tenant lifecycle · PLT-004, 022
Active → Suspension Requested → Reviewed → Suspended (new work denied; in-flight work handled safely) → Reactivation Review → Active. Subscription cancellation → Deactivated / Retention Window, not immediate data deletion. Deletion Requested → Eligibility/Legal Hold Check → Dual Approval → Deletion Pending → Verified Deletion / Deletion Failure, with documented recovery only while possible.

## Billing · PLT-008–010
Plan Change Draft → Impact Preview → Approval if privileged → Scheduled/Effective → Reconciled. Past Due → Grace / Restricted (policy) → Suspended only after appropriate control; no silent data deletion. Hard quota blocks new billable runs with safe in-flight handling.

## Blueprint & policy rollout · PLT-011–012, 019
Versioned Draft → Validation / Security Review → Approved → Pilot → Staged Rollout → Published, with Paused, Rejected, Rolled Back, Deprecated. Manifest digests and effective-policy previews must remain visible. Conflict or unsupported tenant capability fails closed.

## Cross-cutting UI requirements
For every privileged or destructive action show initiator, tenant and exact scope, policy basis, potential impact, reviewer, approval expiry, request status, effective status and immutable audit reference. Keyboard focus, screen reader notices and error recovery are required; none are independently verified yet.
