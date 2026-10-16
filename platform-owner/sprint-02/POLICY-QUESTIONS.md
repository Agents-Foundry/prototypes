# Sprint 02 — Product-policy decisions awaiting individual review

**No policy below is automatically approved by inclusion in the repository.** Product-owner review, independent security governance and final visual sign-off are distinct.

| ID | Decision | Proposed design default | Status |
|---|---|---|---|
| PLT-DEC-01 | Platform vs tenant admin privilege boundary | No default access to tenant conversations/secrets; scoped support sessions require customer authorization | Pending |
| PLT-DEC-02 | Tenant creation authority | Platform-only tenant creation, four-eyes review for high-risk settings and billable resources | Pending |
| PLT-DEC-03 | Region and residency | Region selected at provisioning, clear immutability/migration safeguards | Pending |
| PLT-DEC-04 | Plans and billing | Central plan entitlements with audited trial upgrades and hard limits | Pending |
| PLT-DEC-05 | Support break-glass | Exceptional time-boxed approval, separation of duties, customer notification and full audit | Pending |
| PLT-DEC-06 | Suspension/termination | Reversible suspension, explicit deletion/retention workflow with dual authorization | Pending |
| PLT-DEC-07 | Blueprint catalog distribution | Versioned signed catalog, gated org rollout, rollback and tenant policy controls | Pending |
| PLT-DEC-08 | Global policy templates | Versioned platform defaults; stronger tenant policies prevail; no silent weakening | Pending |
| PLT-DEC-09 | Platform operator MFA/SSO | Enforced MFA and privileged step-up, tenant-independent staff roles | Pending |
| PLT-DEC-10 | Telemetry and privacy | Tenant-minimized aggregate statistics, redaction and bounded retention | Pending |

Decision record format: option, approved wording, authorizing role, date, reviewer concern, affected screen IDs, security review result.
