# Sprint 02 — Platform Owner Console (design only)

**Status:** DRAFT / product-owner review required. **Visual direction:** Balanced Premium AI Enterprise, consistent with Sprint 01: dark left rail, light enterprise work area, restrained indigo/violet accents, light/dark theme.

## Goal
Design the **Agents Foundry SaaS operator** experience, distinct from the tenant Organization Admin Console. Platform operators provision, supervise and support isolated organizations without implicitly acquiring tenant access to customer credentials, conversations, or data.

## Primary journeys
1. Platform owner signs in with enforced MFA, reviews service status and operational alerts.
2. Provision a tenant organization: organization identity → region and plan → admin invitation → policy defaults → review → provision → pending admin setup/active.
3. Review tenants, health, suspension, renewal and lifecycle; launch only authorized, audited support operations.
4. Manage plans, entitlements, billing status and usage anomalies without exposing employee secrets.
5. Review platform-wide **agent blueprint catalog** and rollout/version status (not direct access to tenant agent private content).
6. Inspect audit, security posture, policy-template versions, integrations/provider status, incidents and support cases.

## Starter design assets
- [Screen inventory](SCREEN-REGISTRY.md) with stable PLT identifiers and acceptance matrix.
- [Product decisions](POLICY-QUESTIONS.md) requiring individual sign-off.
- [Clickable HTML prototype](prototype/index.html) with Dashboard, Organizations, Provision Tenant, Security & Audit, Billing, Agent Catalog and Operations sections.
- [Acceptance plan](REVIEW-CHECKLIST.md).

## Guardrails
No production UI, API, backend, identity or provisioning infrastructure is included. Interactions are *simulations with sample values*. Tenant support is denied by default; no impersonation or unrestricted cross-tenant browsing. Status changes must never be portrayed as completed without an approved action and server acknowledgment in any later implementation. Sprint 01 v1.0-rc2 remains a review candidate pending its separate formal approvals.

## Sprint 02 staged acceptance
PR A (this): information architecture, primary flows and two visual reference screens/prototype. Next design PRs: full PLT inventory SVG frames, all lifecycle/error/permission states, responsive + accessibility test evidence, individual policy decisions, independent security/design sign-off.
