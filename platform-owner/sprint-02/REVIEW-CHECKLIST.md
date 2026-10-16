# Sprint 02 initial design review checklist

## Visual and UX
- [ ] Organization directory scan density, filters, actions and data hierarchy reviewed.
- [ ] Provisioning workflow displays draft → review → pending → provisioning → confirmed or failed, never instant activation.
- [ ] Platform owner identity, scoped tenant authority and security warnings legible.
- [ ] Light/dark parity, 375/768/1024/1440 widths and 200% zoom checked.
- [ ] All actions have cancel paths, disabled and policy-denied states; no dead-end navigation.

## Accessibility
- [ ] Keyboard navigation/focus rings, semantic names and dialogs audited.
- [ ] Contrasts, error announcement, status meaning and screen reader reviewed.
- [ ] Reduced motion and responsive reflow checked.

## Security & data scope
- [ ] Redaction by default for tenant-level secrets and conversations.
- [ ] Break-glass and tenant support access authorized/time-boxed/audited.
- [ ] Suspensions/billing actions use explicit approval and pending confirmation.
- [ ] Region/budget/plan settings cannot silently violate policy.

## Evidence and signatures
Product policy: Pending; visual reviewer: Pending; a11y reviewer: Pending; security reviewer: Pending. **Nothing in this initial design PR grants freeze approval.**
