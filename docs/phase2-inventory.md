# Phase 2 — Inventory before migrating sprint folders

This phase introduces a **read-only, deterministic inventory** of tracked files. It is the prerequisite for moving historical Sprint 01/02/03 content safely.

## Run

From a local clone of this repository:

```bash
python3 scripts/inventory_prototypes.py --output repository-inventory.json
```

The generated JSON includes the current Git commit, every tracked path, sprint-folder candidates, coarse content categories, potential destination suggestions, exact-path text references, and inbound reference lists.

**Limitations:** The script does not resolve relative imports, wildcard/glob references, symlinks, or dynamic references. It must not be used as an automatic mover. A filename-only destination is a *candidate*, not a guaranteed unique or semantically correct path. Check for collisions and approval/evidence integrity.

## Next migration PR

1. Review the generated manifest against the repository tree and workflow definitions.
2. Group current screen/specification files by application and journey.
3. Preserve historical evidence and SHA-based provenance; use a history index for archived sprint records.
4. Migrate a small non-evidence group and update every affected reference.
5. Verify existing checks and published gallery before and after; keep independent review gates open.

No sprint assets are moved in this PR.
