# Agent Studio

**Audience:** Blueprint authors and independent publishing reviewers.

Designing, testing, evaluating, reviewing, publishing and retiring reusable agent blueprints.

[Open the full clickable prototype](app/index.html) · [Interactive gallery (concept)](../prototype-gallery/index.html) · [Repository guide](../docs/README.md) · [Screen registry](../screen-registry/SCREENS.md)

> **Status: proposal.** 20 screens in a design-only prototype. Nothing here is reviewed, approved or frozen, and the prototype enforces no real policy. Sample data is fictional.

## Run it

```bash
python -m http.server 8000
# then open http://localhost:8000/agent-studio/app/
```

Use the **Scenario** menu (loading, empty, error, permission denied, offline, outcome unknown, stale), **Screen spec** (goal, states, security and accessibility notes), **Jump** (Ctrl+K) and the theme toggle.

## Screens

**Access**: STD-001 Sign in & workspace selection

**Blueprints**: STD-002 Blueprint catalog · STD-003 Create blueprint · STD-004 QA Engineer · overview

**Build**: STD-005 Instructions & persona · STD-006 Tools & skills · STD-007 Knowledge & memory · STD-008 Model & policies · STD-009 Autonomy & approvals matrix

**Validate**: STD-010 Test playground · STD-011 Evaluation suites · STD-012 Evaluation run detail · STD-013 Version history & diff

**Release**: STD-014 Review queue · STD-015 Review & decision · STD-016 Publish & rollout · STD-017 Rollback & deprecation

**Insight & admin**: STD-018 Usage & feedback · STD-019 Custom skills · STD-020 Studio settings & access

## How to review

1. Pick a persona goal and follow it across screens, not one screen at a time.
2. In each screen, switch scenarios and confirm denial, offline and unknown-outcome states fail closed and never imply success.
3. Open **Screen spec** and compare against the decision records and acceptance criteria. Missing detail is a gap to log, not an approval.
4. Record findings with the screen ID, scenario, expected versus observed behavior and severity.

## History

Legacy sprint folders (`sprint-0N/`) remain unchanged as historical evidence. Legacy screen IDs are preserved and now point to the redesigned screens in `app/`. Automated checks (`scripts/check_apps.py`, `design-system/tests/`) cover structure, rendering and a subset of accessibility rules only; independent security, accessibility, visual and product-owner reviews are still outstanding.
