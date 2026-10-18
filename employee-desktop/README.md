# Employee Desktop

**Audience:** Employees collaborating with AI agents.

Delegating work, approving risky actions, inspecting progress and evidence, and recovering safely from interruption.

[Open the full clickable prototype](app/index.html) · [Interactive gallery (concept)](../prototype-gallery/index.html) · [Repository guide](../docs/README.md) · [Screen registry](../screen-registry/SCREENS.md)

> **Status: proposal.** 24 screens in a design-only prototype. Nothing here is reviewed, approved or frozen, and the prototype enforces no real policy. Sample data is fictional.

## Run it

```bash
python -m http.server 8000
# then open http://localhost:8000/employee-desktop/app/
```

Use the **Scenario** menu (loading, empty, error, permission denied, offline, outcome unknown, stale), **Screen spec** (goal, states, security and accessibility notes), **Jump** (Ctrl+K) and the theme toggle.

## Screens

**Access**: EMP-001 Sign in & organization · EMP-017 Welcome

**Work**: EMP-002 Workspace · EMP-003 Conversation · Nova · EMP-004 Run plan & progress · EMP-005 Tool permission request · EMP-012 Notifications & approvals · EMP-019 New task

**Account**: EMP-006 Accounts & vault · EMP-014 Environment manager · EMP-015 Settings & privacy · EMP-016 Recovery & offline workspace · EMP-024 Support & diagnostics

**Evidence**: EMP-007 Jira work · QA-184 · EMP-008 Browser & test execution · EMP-009 Artifacts & evidence · EMP-010 Repository context · EMP-020 Defect draft & publish review · EMP-021 Run report · EMP-022 Code change review

**Agents**: EMP-011 Skills, tools & connectors · EMP-018 My agents · EMP-023 Memory

**Library**: EMP-013 History & search

## How to review

1. Pick a persona goal and follow it across screens, not one screen at a time.
2. In each screen, switch scenarios and confirm denial, offline and unknown-outcome states fail closed and never imply success.
3. Open **Screen spec** and compare against the decision records and acceptance criteria. Missing detail is a gap to log, not an approval.
4. Record findings with the screen ID, scenario, expected versus observed behavior and severity.

## History

Legacy sprint folders (`sprint-0N/`) remain unchanged as historical evidence. Legacy screen IDs are preserved and now point to the redesigned screens in `app/`. Automated checks (`scripts/check_apps.py`, `design-system/tests/`) cover structure, rendering and a subset of accessibility rules only; independent security, accessibility, visual and product-owner reviews are still outstanding.
