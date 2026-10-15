# Product policy options — explicit owner approval required

These are **recommended defaults, not previously approved decisions**. The product owner and security reviewer must accept or revise them.

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

## Approval form
Product owner: **PENDING** · Security reviewer: **PENDING** · Date: —

Record decisions separately with reviewer/role, accepted/rejected option and rationale. Do not treat merger of this document as consent to policy defaults.
