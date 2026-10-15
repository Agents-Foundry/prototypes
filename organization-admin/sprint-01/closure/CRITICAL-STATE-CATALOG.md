# Critical-state design coverage — Sprint 01

These are written design requirements requiring formal visual review. They do not replace screen-by-screen signed visual mockups.

| Screen | Scenario | UX requirement | Action |
|---|---|---|---|
| ORG-001 | MFA required / account locked | Distinct challenge and blocked states; no account enumeration | Retry/help |
| ORG-002 | Expired invitation | Show expiration and safe reissue instructions | Request invitation |
| ORG-003 | Duplicate organization or invalid timezone | Field-specific validation; preserve entered fields | Correct and retry |
| ORG-005 | Invalid hierarchy cycle | Preview affected reporting chain and block save | Edit parent |
| ORG-006 | Role in use | Explain impact before archiving | Review assignments |
| ORG-008 | Blueprint deprecated | Explain replacement path | Choose supported blueprint |
| ORG-009 | Missing approved model | Block next; show organization-admin remediation | Select permitted provider |
| ORG-010 | Denied privileged capability | Disabled toggle and policy explanation | Request policy change |
| ORG-011 | Revoked integration | Mask secrets; provide re-authorization | Reconnect |
| ORG-012 | Human approval required | Request approval, not instant activation | View request |
| ORG-012 | Denied approval | Show reviewer decision without disclosing restricted metadata | Revise request |
| ORG-013 | Provisioning in progress | Distinct pending/active states | Refresh status |
| ORG-013 | Provisioning failed | Show sanitized failure and retry eligibility | Troubleshoot |

Sample UI variants exist from PR #4 for organization validation, empty workforce, connector expiration, pending approval, and provisioning failure. Missing visual variants must be produced before full design freeze.
