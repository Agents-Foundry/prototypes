# Sprint 01 stabilization — decisions and open questions

**Version:** 1.2 draft · **Status:** awaiting product owner sign-off.

## Agreed design semantics proposed for approval
- Navigation destinations not represented by a Sprint 01 screen appear as **Soon / disabled**, never redirect to unrelated screens.
- 'Request activation' submits a request and produces **Pending approval** by default. Request is not activation.
- Rejected, failed and active are separate visual outcomes, with active only after positive approval and successful provisioning in a real system.
- All sample provider and connector statuses are illustrative. The prototype never connects to real systems.
- Changes to permissions, connector availability, selected models or estimated cost invalidate prior readiness review and require re-evaluation.

## Unresolved product decisions — sign-off owners required
1. Mandatory department/team setup before hiring (Product owner).
2. Single vs multiple team assignment for an AI employee (Product owner).
3. Employee-owned BYOK timing and per-user restrictions (Product/security).
4. Approval policy per environment and action risk (Security).
5. Model override hierarchy and budget ownership (Product/finance).
6. SSO and MFA options by tenant (Identity/security).

No decision is accepted merely because this document appears on main.
