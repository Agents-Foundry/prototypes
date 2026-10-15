# State matrix — Sprint 01, rev 1.1 (review proposal)

| Screen | Empty | Loading | Error / blocked | Permission denied | Confirmation / pending |
|---|---|---|---|---|---|
| ORG-001 Sign in | N/A | Verifying | Invalid password / expired invitation | Tenant suspended | MFA challenge |
| ORG-002 Welcome | New tenant | Loading checklist | Stale onboarding session | Not owner | Resume onboarding |
| ORG-003 Organization details | Fields blank | Saving | Invalid region/name | No org.edit | Unsaved changes |
| ORG-004 Dashboard | No workforce yet | Skeleton cards | Partial metrics unavailable | Limited data | Pending approvals |
| ORG-005 Hierarchy | No departments | Loading tree | Cycle / archive dependencies | Org write denied | Delete/archive confirm |
| ORG-006 Roles | No roles | Loading | Assigned-role conflict | Role write denied | Edit impact confirm |
| ORG-007 Directory | No employees / no matches | Loading rows | Fetch error | Workforce view denied | Suspend confirm |
| ORG-008 Blueprint | Catalog empty | Loading cards | Deprecated blueprint | Not allowed to hire | Select confirm |
| ORG-009 Configure | New form | Checking provider | Missing provider/BYOK | Restricted model | Leave wizard confirm |
| ORG-010 Capabilities | No optional skills | Checking policies | Capability blocked | Risky tool denied | Scope summary |
| ORG-011 Integrations | No connectors | Connection testing | Revoked/insufficient scope | Connector config denied | OAuth consent / confirm |
| ORG-012 Review | No candidate | Running checks | Readiness blocked | No activation role | Human approval pending |
| ORG-013 Result | N/A | Provisioning | Provision failure | Can't inspect agent | Active / awaiting approval |

**Notes:** The prototype exposes a state switcher for conceptual exploration. This is not equivalent to individually approved visual state mockups. A successful design review must evaluate and refine the detailed screen-state combinations.
