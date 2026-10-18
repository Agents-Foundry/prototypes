# Platform Owner

**Audience:** Agents Foundry SaaS operators.

Organization lifecycle, commercial operations, agent catalog, governance and operations across tenants without access to tenant content.

[Open the full clickable prototype](app/index.html) · [Interactive gallery (concept)](../prototype-gallery/index.html) · [Repository guide](../docs/README.md) · [Screen registry](../screen-registry/SCREENS.md)

> **Status: proposal.** 28 screens in a design-only prototype. Nothing here is reviewed, approved or frozen, and the prototype enforces no real policy. Sample data is fictional.

## Run it

```bash
python -m http.server 8000
# then open http://localhost:8000/platform-owner/app/
```

Use the **Scenario** menu (loading, empty, error, permission denied, offline, outcome unknown, stale), **Screen spec** (goal, states, security and accessibility notes), **Jump** (Ctrl+K) and the theme toggle.

## Screens

**Access**: PLT-001 Operator sign-in

**Overview**: PLT-002 Platform overview · PLT-016 Incident center · PLT-028 Status & maintenance

**Organizations**: PLT-003 Organizations · PLT-004 Organization profile · PLT-005 Provision a tenant · PLT-006 Provisioning review & approval · PLT-007 Tenant invitation & handoff · PLT-022 Tenant suspension & termination review

**Commercial**: PLT-008 Plans & entitlements · PLT-009 Billing operations · PLT-010 Usage & spending

**Agent catalog**: PLT-011 Global blueprint catalog · PLT-012 Blueprint rollout management · PLT-025 Connector vetting · PLT-026 Model providers

**Governance**: PLT-013 Security posture · PLT-014 Platform audit explorer · PLT-019 Policy template management · PLT-020 Platform staff & roles · PLT-027 Compliance & data requests

**Operations**: PLT-015 Provider & integration health · PLT-017 Support cases · PLT-018 Time-boxed support access · PLT-023 Regions & data residency · PLT-024 Feature flags & release trains

**Settings**: PLT-021 Operator settings

## How to review

1. Pick a persona goal and follow it across screens, not one screen at a time.
2. In each screen, switch scenarios and confirm denial, offline and unknown-outcome states fail closed and never imply success.
3. Open **Screen spec** and compare against the decision records and acceptance criteria. Missing detail is a gap to log, not an approval.
4. Record findings with the screen ID, scenario, expected versus observed behavior and severity.

## History

Legacy sprint folders (`sprint-0N/`) remain unchanged as historical evidence. Legacy screen IDs are preserved and now point to the redesigned screens in `app/`. Automated checks (`scripts/check_apps.py`, `design-system/tests/`) cover structure, rendering and a subset of accessibility rules only; independent security, accessibility, visual and product-owner reviews are still outstanding.
