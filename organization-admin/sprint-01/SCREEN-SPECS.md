# Organization Admin screen behavior contract — Sprint 01 (draft)

These are **review specifications**, not implementation instructions. 1440×900 SVGs are visual compositions, not clickable prototypes. No screenshot is approved by default.

| Screen | Primary action | Important states & reviews |
|---|---|---|
| ORG-001 Sign-in | Authenticate | invalid credentials, MFA, SSO redirect, lockout, reset, blocked tenant |
| ORG-002 Welcome | Start setup | returning admin, partially complete onboarding, invite expired |
| ORG-003 Organization details | Save and continue | validation, timezone, existing slug, abandon/resume |
| ORG-004 Dashboard | Navigate to task/employee | empty org, loading, stale metrics, tenant-scoped data |
| ORG-005 Departments & teams | Add/edit hierarchy | circular reporting prevention, permissions, archive rules |
| ORG-006 Roles | Create/edit role | human vs AI role distinctions, edit conflict, assigned-role impact |
| ORG-007 AI employees | Hire, inspect, filter | inactive, onboarding, errors, no results, insufficient rights |
| ORG-008 Blueprint selection | Choose approved template | unavailable/deprecated blueprints, required capabilities |
| ORG-009 Configure employee | Set identity, owner and provider | mandatory manager, unsupported provider, missing BYOK |
| ORG-010 Capabilities | Grant allowed tools | required vs optional, disabled-by-policy, risk summary |
| ORG-011 Integrations | Connect/verify approved systems | revoked, pending, missing scopes, secret masking, connection failure |
| ORG-012 Review | Request activation | readiness checks, pending human approval, deny, budget cap |
| ORG-013 Activation result | Open employee | asynchronous provisioning, failed activation, rollback and audit |

## Cross-screen acceptance review
- Navigation orientation and keyboard focus; responsive 1280 / 1440 / 1920 widths.
- Semantic accessible controls, error messages and keyboard interaction.
- No secret/token/password rendered in mockups; use placeholder data only.
- Activation requires **server-enforced** authorization and policy decisions; visual checkmarks are illustrative.
- Distinguish draft, awaiting approval, active, suspended and failed lifecycle states.
- Screens are visual proposals until reviewed, annotated, and frozen.
