# Design governance

## Naming
`<SCREEN-ID>-<slug>-v<major>.<minor>-<state>.<ext>` (for example `ORG-006-hire-ai-employee-v1.0-draft.svg`). Use lowercase kebab-case for slug; IDs remain stable between revisions. States: `draft`, `in-review`, `approved`, `deprecated`. Never call a mockup approved before a review decision.

## Artifact set
Each screen should have an editable source (Figma link or SVG), an exported PNG, `spec.md` with interaction and authorization states, and a review record. The registry points to the current revision; preserve history.

## Workflow
1. Design on a `design/sprint-NN-topic` branch.
2. Include navigation, primary screen, overlays, loading, empty, errors, and accessibility.
3. Open draft PR; gather visual and product approval.
4. Mark approved only when accepted, and merge through PR.
5. Any later design change needs a new revision and PR.

No application source code, service configuration, API keys or real customer credentials.
