# Sprint 01 — Consolidated product-owner policy approval

**Decision date:** 2026-10-15  
**Decision authority:** Product owner (confirmed individually in design review conversation)  
**Scope:** Product design policy direction only — **not** an architecture, security, accessibility, visual QA, or final design-freeze approval.

| Decision | Selected option | Approved product rule |
|---|---|---|
| DEC-01 | A | One department and one owning team required before activation; hiring drafts allowed earlier |
| DEC-02 | B | One accountable owning team, with explicit scoped and revocable cross-team access |
| DEC-03 | B | Organization-owned model credentials plus policy-permitted personal BYOK, vault protection and separate cost attribution |
| DEC-04 | B | Organization provider/model allowlist and agent-level model selection with explicitly authorized fallbacks |
| DEC-05 | B | Risk-tiered action approval, binding to exact action/scope, authorized reviewers, expiry, fail-closed behavior and audit |
| DEC-06 | B | Tenant-selected SSO or password + MFA, mandatory privileged-admin MFA, session/recovery governance and machine credentials |
| DEC-07 | B | Owning-team accountability, consuming-team cost attribution, hierarchical budgets, BYOK accounting, alerts and auditable overrides |
| DEC-08 | B | Governed AI employee readiness, conditional approval, provisioning, activation, suspension, reactivation, versioning and retirement |

## Approval outcome

**Product-owner policy decisions: 8 of 8 approved.** The authoritative detailed wording is in [PRODUCT-POLICY-DECISIONS.md](PRODUCT-POLICY-DECISIONS.md).

## Remaining independent gates

- **Security/governance review:** Pending. Must validate permission inheritance, protected credential flows, policies and fail-closed semantics.
- **Accessibility verification:** Pending. Actual keyboard/assistive-technology/contrast/zoom audit evidence required.
- **Visual QA:** Pending. Actual browser-rendered viewport/theme testing and review of draft state frames required.
- **Design-owner sign-off:** Pending.
- **Sprint 01 baseline freeze:** BLOCKED until outstanding independent gates are closed. Merge of PR #7 does not imply sign-off.

## Design coverage implications

The approved policies establish additional Admin Console designs to inventory and review: Organization Model Vault, Personal BYOK settings, Model Catalog, Model Fallback/Routing, Approval Inbox/Detail, Tenant SSO/MFA, Session Controls/Recovery, Budget Dashboard/Alerts/Overrides, AI Employee Lifecycle/Version/Suspension/Retirement views. Existing 13 base screens should not be mistaken for comprehensive coverage of these policies.

## Change control

Any adjustment to DEC-01–DEC-08 should be presented as a new explicit product-owner decision and committed in a reviewable PR, with security review as applicable.
