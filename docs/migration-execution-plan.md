# Migration execution plan

## Current blocker

The GitHub connector in this session does not expose a recursive repository tree, arbitrary Actions workflow dispatch, or a list of workflow runs. The inventory workflow exists, but a successful run and complete JSON artifact have not been verified. Do not claim that design files were migrated.

## Migration batches after inventory

| Batch | Classification | Destination | Rule |
| --- | --- | --- | --- |
| A | Current Platform Owner screens and journey specifications | `platform-owner/<journey>/` | Preserve screen IDs; update references |
| B | Current Organization Admin screens and journey specifications | `organization-admin/<journey>/` | Preserve screen IDs; update references |
| C | Current Employee Desktop screens and journey specifications | `employee-desktop/<journey>/` | Preserve EMP-DEC decision links |
| D | Current Agent Studio screens and journey specifications | `agent-studio/<journey>/` | Preserve version/publishing references |
| E | Shared interaction contracts and screen registries | `docs/<topic>/` | No duplicate canonical source |
| F | Historical evidence, reports and approvals | Historical archive or retained original path | No rewriting immutable evidence |

## Before each batch

- Confirm the exact source path exists in inventory and identify all consumers.
- Verify destination is unique and preserves intended journey context.
- Find all path references, including relative Markdown links, workflow glob patterns, scripts, imports and generated manifests.
- Do not alter signed/hash-verified evidence or claim independent review.
- Run existing CI checks on the exact migration commit and inspect gallery links.
- Record source path, destination, reason, SHA and validation status in the PR.

## Running inventory

Open [Repository Migration Inventory](https://github.com/Agents-Foundry/prototypes/actions/workflows/repository-migration-inventory.yml) and use **Run workflow** on `main` once this workflow update is merged. It will also run automatically on future changes to its configured paths on `main`. Download the `repository-migration-inventory` artifact from the run.

No existing design or historical sprint assets are relocated in this PR.
