# Organization Admin

**Audience:** Administrators of customer organizations.

Onboarding, people and teams, hiring and governing AI employees, connectors, models, policy, audit and emergency controls.

[Open the full clickable prototype](app/index.html) · [Interactive gallery (concept)](../prototype-gallery/index.html) · [Repository guide](../docs/README.md) · [Screen registry](../screen-registry/SCREENS.md)

> **Status: proposal.** 27 screens in a design-only prototype. Nothing here is reviewed, approved or frozen, and the prototype enforces no real policy. Sample data is fictional.

## Run it

```bash
python -m http.server 8000
# then open http://localhost:8000/organization-admin/app/
```

Use the **Scenario** menu (loading, empty, error, permission denied, offline, outcome unknown, stale), **Screen spec** (goal, states, security and accessibility notes), **Jump** (Ctrl+K) and the theme toggle.

## Screens

**Access**: ORG-001 Admin sign-in

**Overview**: ORG-002 Setup guide · ORG-004 Dashboard · ORG-020 Approvals

**Organization**: ORG-003 Organization details · ORG-016 Identity & SSO · ORG-025 Data & privacy · ORG-026 Plan & settings · ORG-027 Emergency controls

**Workforce**: ORG-005 Teams & departments · ORG-006 Roles & positions · ORG-007 AI employees · ORG-014 People & invitations · ORG-021 AI employee · QA Engineer · Nova

**Hire AI employee**: ORG-008 Hire: choose a blueprint · ORG-009 Hire: configure · ORG-010 Hire: capabilities · ORG-011 Hire: integrations · ORG-012 Hire: review & activate · ORG-013 Hire: activation result

**Governance**: ORG-015 Permissions & effective access · ORG-017 Connectors · ORG-018 Models & keys · ORG-019 Governance policies · ORG-023 Access reviews

**Insight**: ORG-022 Usage & spend · ORG-024 Audit log

## How to review

1. Pick a persona goal and follow it across screens, not one screen at a time.
2. In each screen, switch scenarios and confirm denial, offline and unknown-outcome states fail closed and never imply success.
3. Open **Screen spec** and compare against the decision records and acceptance criteria. Missing detail is a gap to log, not an approval.
4. Record findings with the screen ID, scenario, expected versus observed behavior and severity.

## History

Legacy sprint folders (`sprint-0N/`) remain unchanged as historical evidence. Legacy screen IDs are preserved and now point to the redesigned screens in `app/`. Automated checks (`scripts/check_apps.py`, `design-system/tests/`) cover structure, rendering and a subset of accessibility rules only; independent security, accessibility, visual and product-owner reviews are still outstanding.
