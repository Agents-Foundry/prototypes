# Mockup coverage reconciliation

## Baseline

The interactive gallery contains **12 illustrative screens**: three each for Platform Owner, Organization Admin, Employee Desktop and Agent Studio. These are not equivalent to 12 approved design specifications.

**Approved screens and pending mockups: unknown** until screen registries, decision records and review status are reconciled.

## Automated evidence

The [Mockup Coverage Reconciliation workflow](https://github.com/Agents-Foundry/prototypes/actions/workflows/mockup-coverage.yml) produces:
- `mockup-coverage.csv`: 12 gallery examples, explicitly marked illustrative
- `design-candidates.json`: tracked source paths with likely screen/mockup/journey/registry names for manual review
- `summary.json`: counts and source commit, with unverified totals left null
- `repository-inventory.json`: source paths and reference hints

Run after merge on `main` using **Run workflow** or by changing covered paths.

## Manual review procedure

1. Review each candidate file and actual screen registry, not just its filename.
2. Deduplicate aliases, screenshots and alternate states of the same screen.
3. Assign a stable screen ID, owning application, journey, source path and design status.
4. Match the gallery interaction only when the actual design and screen ID correspond.
5. Record review evidence and whether it was simulated, automated, observed, or independently approved.
6. Define a scope baseline: required screens per journey. Only then compute pending = required distinct screens minus completed distinct screens.
7. Publish the signed-off matrix and remaining-count summary as a separate PR.

## Constraints

Do not infer product-owner acceptance, security/privacy sign-off, accessibility approval, final design freeze, or production implementation from a clickable sample or passing CI.
