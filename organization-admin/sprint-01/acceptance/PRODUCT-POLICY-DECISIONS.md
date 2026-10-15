# Product policy options — explicit owner approval required

These are proposed defaults unless individually approved below. Product-owner approval does not substitute for security review.

| ID | Topic | Recommended default | Tradeoff |
|---|---|---|---|
| DEC-01 | Department/team before first AI hire | Require at least one department and one owning team | Clear accountability vs longer onboarding |
| DEC-02 | AI employee team membership | One owning team; scoped cross-team assignments by explicit grant | Simple budgets/audit vs flexibility |
| DEC-03 | BYOK | Organization-owned keys at activation; employee BYOK allowed only by explicit policy, keys never visible to admin | Enterprise control vs user flexibility |
| DEC-04 | Model controls | Organization approved-provider allowlist, with agent-specific selection inside allowlist | Governance vs experimentation |
| DEC-05 | Approval routing | Risk-tiered: production writes, credential changes and privileged actions require approval; fail closed | More operational friction, safer automation |
| DEC-06 | SSO and MFA | MFA on privileged admin access; support SSO for enterprise tenants | More identity setup vs safer admin access |
| DEC-07 | Budget owner | Cost attributed to owning department/team, organization admin defines caps | Accountability vs multi-team cost sharing |
| DEC-08 | Activation lifecycle | Draft → Review → Pending approval (when required) → Provisioning → Active; reject/failed states separate | Correct visibility with more states |

## Recorded individual decisions

| ID | Product-owner decision | Date | Security review |
|---|---|---|---|
| DEC-01 | **APPROVED — Option A:** At least one department and owning team must exist before AI employee **activation**. Hiring may begin as a draft; guided setup can create the required entities during hiring. | 2026-10-15 | Pending |
| DEC-02 | **APPROVED — Option B:** One primary owning team controls employee accountability, budget and governance. Other teams may receive explicitly granted, scoped, revocable access, without automatically inheriting the owner's permissions. | 2026-10-15 | Pending |
| DEC-03 | **APPROVED — Option B:** Organization-managed provider credentials plus employee-owned BYOK only when organization policy permits. Employee secrets stay private from admins; raw keys remain in a protected vault and never appear in chat/logs/design mockups. Provider/model allowlists apply regardless of key owner. Revocation blocks new authorized use and surfaces connection health. Personal and organization usage/cost attribution remain separate. | 2026-10-15 | Pending |
| DEC-04 | **APPROVED — Option B:** Organization administrators maintain approved provider/model allowlists; each AI employee selects a default model within those limits, with explicitly authorized fallback models and optional policy-controlled task routing. Credential ownership follows DEC-03. Budget, data residency, retention and tool-use controls apply regardless of model choice. If no permitted model or fallback is available, execution pauses with a clear blocked-state explanation. | 2026-10-15 | Pending |
| DEC-05 | **APPROVED — Option B:** Risk-tiered, policy-controlled approvals. Low-risk policy-permitted actions can proceed; medium-risk actions follow tenant rules; high-risk protected actions require authorized human approval; prohibited actions always deny. Approval must bind to exact proposed action/scope, be time-limited and auditable. Execution pauses pending decision and fails closed on rejection, expiration, or missing authorization. | 2026-10-15 | Pending |
| DEC-06 | **APPROVED — Option B:** Organization-controlled SSO or password + MFA; MFA mandatory for privileged platform and organization administrators; tenants may enforce SSO-only. Support standards-based OIDC initially and SAML as an enterprise path, with controlled invitation/JIT provisioning, session timeout/revocation, suspension, auditable restricted recovery, and recent reauthentication for sensitive actions. AI employees use authorized machine credentials rather than shared human passwords. | 2026-10-15 | Pending |
| DEC-07 | **APPROVED — Option B:** One accountable owning team per AI employee with usage attribution to consuming team, AI employee, model, task, and credential owner when identifiable. Admins manage organization/department/team/employee spending limits. Employee-owned BYOK and organization-paid usage are separately attributed. Default budget alerts at 50%, 80%, 100%; reaching a hard limit blocks new billable executions except authorized audited exceptions, with safe treatment of in-progress external actions. Budget changes/overrides are authorized and audited. Estimated costs are distinguished from reconciled provider charges. | 2026-10-15 | Pending |
| DEC-08 | **APPROVED — Option B:** Governed AI employee lifecycle: Draft → Ready for Review → Pending Approval (when policy requires) → Approved → Provisioning → Active, with explicit Rejected, Provisioning Failed, Suspended, Deactivated and Retired paths. No execution before Active. Activation readiness validates ownership, model, credentials, integrations, permissions, approvals and budget. Suspension safely prevents new work and handles running work; reactivation reevaluates changed policies and prerequisites. Material revisions trigger reassessment/reapproval; retirement revokes future execution authority and preserves audit evidence under retention rules. Failures require visible recovery and never silently become Active. | 2026-10-15 | Pending |

## Overall approval form
Product owner: **APPROVED DEC-01 through DEC-08 (product-policy decisions only)** · Security reviewer: **PENDING** · Date: 2026-10-15

Record decisions separately with reviewer/role, accepted/rejected option and rationale. Do not treat merger of this document as consent to policy defaults.
