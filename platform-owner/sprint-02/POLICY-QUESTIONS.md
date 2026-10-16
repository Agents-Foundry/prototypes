# Sprint 02 — Product-policy decisions awaiting individual review

**No policy below is automatically approved by inclusion in the repository.** Product-owner review, independent security governance and final visual sign-off are distinct.

| ID | Decision | Proposed design default | Status |
|---|---|---|---|
| PLT-DEC-01 | Platform vs tenant admin privilege boundary | **APPROVED — Option B:** Strict cross-tenant isolation and deny-by-default platform operator access to tenant conversations, credentials, secrets and internal content. Operators may manage tenant metadata, lifecycle, subscriptions and platform operations. Exceptional support access requires customer authorization, explicit scope, time limits, stronger approval/independent oversight, immutable audit and immediate revocation; routine operator views remain redacted. | Product owner approved 2026-10-16; independent security review pending |
| PLT-DEC-02 | Tenant creation authority | **APPROVED — Option B:** Tenant creation restricted to authorized platform staff; validation of uniqueness, domain ownership where applicable, region, plan, quotas, and security defaults. Standard requests follow risk-based policy; high-risk, costly, or privileged provisioning requires four-eyes approval without self-approval. Lifecycle: Draft → Review → Pending Approval (if required) → Provisioning → Ready for Admin Setup/Active only after authoritative success. Provisioning must be idempotent, audited, safely retryable/rollback-capable; failed or partial operations do not claim activation. Initial admin account issued only after identity/provisioning checks. Trial/sandbox tenants retain isolation and resource limits. | Product owner approved 2026-10-16; independent security review pending |
| PLT-DEC-03 | Region and residency | **APPROVED — Option B:** Tenant selects an actually supported deployment region during provisioning. Residency scope explicitly covers databases, files, conversations, logs, backups, runtime workspaces, telemetry and recovery copies; storage location alone does not guarantee processing residency. Model providers/routing and connectors must comply with tenant regional transfer controls. No silent relocation. Region changes require an authorized migration request, impact assessment, appropriate customer approval, validation, backup/rollback/recovery planning, audit trail and authoritative completion verification; unsupported capabilities must be disclosed. | Product owner approved 2026-10-16; independent security review pending |
| PLT-DEC-04 | Plans and billing | Central plan entitlements with audited trial upgrades and hard limits | Pending |
| PLT-DEC-05 | Support break-glass | Exceptional time-boxed approval, separation of duties, customer notification and full audit | Pending |
| PLT-DEC-06 | Suspension/termination | Reversible suspension, explicit deletion/retention workflow with dual authorization | Pending |
| PLT-DEC-07 | Blueprint catalog distribution | Versioned signed catalog, gated org rollout, rollback and tenant policy controls | Pending |
| PLT-DEC-08 | Global policy templates | Versioned platform defaults; stronger tenant policies prevail; no silent weakening | Pending |
| PLT-DEC-09 | Platform operator MFA/SSO | Enforced MFA and privileged step-up, tenant-independent staff roles | Pending |
| PLT-DEC-10 | Telemetry and privacy | Tenant-minimized aggregate statistics, redaction and bounded retention | Pending |

Decision record format: option, approved wording, authorizing role, date, reviewer concern, affected screen IDs, security review result.

## Recorded individual product-owner approvals

| ID | Approved choice | Authority | Date | Affected screens | Independent security | Design freeze |
|---|---|---|---|---|---|---|
| PLT-DEC-01 | **Option B — strict tenant isolation with authorized, scoped and auditable support access** | Product owner (explicit individual approval in design conversation) | 2026-10-16 | PLT-003, PLT-004, PLT-013, PLT-014, PLT-017, PLT-018, PLT-020 | **Pending** | **Not approved** |
| PLT-DEC-02 | **Option B — role-controlled risk-based tenant provisioning and four-eyes approval for high-risk requests** | Product owner (explicit individual approval in design conversation) | 2026-10-16 | PLT-005, PLT-006, PLT-007, PLT-022 | **Pending** | **Not approved** |
| PLT-DEC-03 | **Option B — tenant-selected region with explicit residency scope and authorized, validated migration** | Product owner (explicit individual approval in design conversation) | 2026-10-16 | PLT-004, PLT-005, PLT-006, migration and recovery states (to be designed) | **Pending** | **Not approved** |

**Approval count: 3/10.** Approval of policy direction does not authorize exceptional access, waive customer consent, or sign off implementation/security controls.
