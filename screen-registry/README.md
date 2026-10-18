# Screen registry

Stable prefix conventions: `PLT` Platform Owner, `ORG` Organization Admin, `EMP` AI Employee Desktop, `STD` Agent Studio.

- **Current inventory (generated):** [SCREENS.md](SCREENS.md) and [screens.csv](screens.csv) list every screen in the four prototype apps, with surface, title, group, source file and whether the ID is a redesign of a legacy ID or new. Regenerate with `python scripts/build_screen_registry.py`; CI runs it with `--check`.
- **Every screen is a proposal.** Being listed is inventory, not review, acceptance or design freeze.
- **Legacy registries** (historical evidence, unchanged): [Org Admin Sprint 01](../organization-admin/sprint-01/screen-registry.csv), [Platform Sprint 02](../platform-owner/sprint-02/SCREEN-REGISTRY.md), [Employee Sprint 03](../employee-desktop/sprint-03/SCREEN-REGISTRY.md). Legacy IDs (PLT-001–022, ORG-001–013, EMP-001–016) are preserved and now point to redesigned screens.
- Each screen's spec drawer (button "Screen spec" in the app) shows its goal, states, security and accessibility notes.
