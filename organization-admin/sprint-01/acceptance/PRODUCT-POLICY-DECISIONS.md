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
| DEC-02–DEC-08 | Pending individual review | — | Pending |

## Overall approval form
Product owner: **PARTIAL (DEC-01 only)** · Security reviewer: **PENDING** · Date: 2026-10-15

Record decisions separately with reviewer/role, accepted/rejected option and rationale. Do not treat merger of this document as consent to policy defaults.
