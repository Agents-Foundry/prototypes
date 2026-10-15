# Decisions and blockers — design review

## Critical journey
Admin sign-in → onboarding → organization details → hierarchy/roles → workforce → blueprint → configure → capabilities → integrations → readiness/approval → result.

## Activation rules to approve
1. Only an authorized admin can submit a hire or activation request.
2. Tool permissions default-deny. Policy restrictions override selected UI toggles.
3. Provider configuration, credential readiness and connector health checks are separate gates.
4. If a human approval is required, show **Pending Approval**. Do not show “Active”.
5. If activation fails, show retry/remediation; do not imply provisioning success.
6. Clear organization ownership, team assignment and budget responsibility before activation.

## Open product decisions
- Whether departmental setup is mandatory before first hire.
- Whether an AI employee can have multiple team assignments.
- Whether employee-managed BYOK is allowed at hiring or only after assignment.
- Required approval levels by risk classification.
- Whether model selection is organization-mandated or overridable per employee.
- Whether account sign-in requires SSO or supports password/MFA per tenant.

Do not freeze until decisions are documented and verified.
