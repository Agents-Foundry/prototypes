# Sprint 01 security design assurance — review required

**Assessment type:** Design threat-model and control traceability; no penetration test or independent security approval was performed.

| Area | Approved policy | Design expectation | Reviewer evidence needed |
|---|---|---|---|
| Tenant isolation | All | Tenant-scoped ownership, identity, credential references and audit events | Threat-model walkthrough of every cross-tenant lookup/selection |
| Hierarchy and access | DEC-01, DEC-02 | Owning-team required; explicit scoped grants, deny on missing grant | Access matrix with cross-team negative cases |
| Credential handling | DEC-03 | Protected vault references, secret masking, revoke and session boundary | Secret lifecycle and UI redaction review |
| Models and failover | DEC-04 | Allowlist and budget/data rules apply to primary + fallback | Policy change/deny and fallback threat scenarios |
| Tool actions | DEC-05 | Risk tier, scoped approval tied to exact action, expiry, fail closed | Approval replay, cancellation and malicious tool-output scenarios |
| Authentication | DEC-06 | Admin MFA, tenant SSO controls, sessions, recovery | Privileged account-recovery/step-up walkthrough |
| Cost limits | DEC-07 | Hard caps, safe in-flight behavior, audited overrides | Budget threshold and race-condition review |
| Lifecycle | DEC-08 | No execution pre-active, pause on suspend, recheck reactivation | State-machine misuse and revoked-approval cases |

## Critical pending security decisions
- Define and sign effective permission inheritance and reviewer separation-of-duties.
- Confirm whether an employee-owned key can ever be delegated to shared workers and the precise scope of credential access.
- Confirm safe-in-flight behavior for suspended runs and hard budget caps.
- Define audit retention, PII handling, credential rotation and incident response UX.
- Approve negative cases for production environments and tool execution.

**Security gate: NOT APPROVED.** This document is not a security review sign-off.
