# Product-first repository organization

## Intended structure

```text
/
├── README.md
├── prototype-gallery/             # Single static interactive entry point
│   ├── index.html
│   └── README.md
├── platform-owner/                # Operator-facing journeys and screens
├── organization-admin/            # Tenant admin journeys and screens
├── employee-desktop/              # Employee-facing journeys and screens
├── agent-studio/                  # Blueprint and publishing journeys
├── docs/                          # Cross-surface documentation and conventions
│   ├── README.md
│   └── repository-organization.md
├── .github/workflows/             # Automated validation and gallery deployment
└── [legacy sprint paths]          # Historical sources, pending audited migration
```

## Rules

- **Product surface first.** New screen assets, registries and journey specifications should live under their owning application directory.
- **Journey next.** Within a surface, group related screens by the user goal; do not create new `sprint-N` folders for current work.
- **Stable identity.** Screen IDs, decision IDs, artifact hashes and exact Git SHAs must not change just because a file moves.
- **Cross-surface material.** Keep shared conventions and indexes in `docs/`. Keep workflow files in `.github/workflows/`.
- **Gallery is a viewer.** `prototype-gallery/` contains an illustrative static interactive experience; it is not the authoritative source of approved interaction contracts.
- **History remains auditable.** Sprint numbers belong in change history, decision provenance, and evidence metadata—not the primary navigation hierarchy.

## Safe migration protocol

**Do not blindly move or delete existing sprint folders.** They may be referenced by scripts, CI workflows, relative links, evidence manifests, and historical approval records.

1. Inventory the complete repository tree, including hidden files and all historical sprint paths.
2. Produce a manifest: original path → canonical destination → referenced screen/decision IDs → consumers → migration status.
3. Classify files as current design, historical evidence, generated output, workflow/test dependency, or duplicate.
4. Move current design files to product/journey destinations using Git history-preserving renames where possible.
5. Keep immutable evidence archives and provenance intact; create redirect/index pointers rather than rewriting signed evidence.
6. Update imports, relative Markdown links, workflow paths, gallery links, manifests and test fixtures.
7. Run all relevant automated checks on the exact PR commit; verify links and gallery deployment.
8. Remove obsolete paths only after verifying all references and obtaining review approval.

## Status

This navigation improvement is **Phase 1**. The current GitHub connector supports individual file operations but does not expose a reliable complete recursive tree listing in this session. Existing sprint directories have **not** been moved or deleted. Phase 2 requires a complete inventory before any destructive migration.
