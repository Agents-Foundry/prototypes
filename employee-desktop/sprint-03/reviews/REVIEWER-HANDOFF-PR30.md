# Sprint 03 — independent acceptance reviewer handoff

## Review baseline

- Design mainline after PR #29: `6176287251074d1b3335467a89dfc8d42d477940`.
- Automated prototype run: https://github.com/Agents-Foundry/prototypes/actions/runs/38938278637 at `76d5addafc1b9685e6e82d351276db8e10ec8901`, 48/48 passed. This is a different SHA from the merge baseline: independently confirm the revision being reviewed.
- Download `sprint-03-review-evidence` from the run's Artifacts section; inspect the index and per-state screenshots/JSON. Do not infer manual visual approval from the automated index.

## Execution order

1. **Assign independent assessors** for security/privacy, accessibility/assistive technology, real browser zoom and visual QA. Enter names and reviewed SHA in `INDEPENDENT-FINDINGS-REMEDIATION.md`.
2. **Security assessor** executes the fourteen SEC scenarios and assesses offline encrypted cache / 24-hour expiry and revocation exposure. Record design gaps, affected assets, mitigation, severity and evidence.
3. **Accessibility assessor** executes A11Y-01–10 with real screen reader and keyboard, actual 200%/400% browser zoom, forced colors and both themes. Record device/browser/AT versions and objective evidence.
4. **Visual reviewer** evaluates all 32 screen concepts and 72 critical-state SVG variants; document per-asset outcome, compare screenshots to source design and identify unsupported states.
5. **Triage findings**: assign owners, prioritize blockers, create design-only remediation PRs linked to finding IDs. Independently retest at new commit SHA.
6. **Sign off separately** after evidence and disposition are complete; final product-owner freeze is last and requires explicit authorization.

## Reviewer evidence submission contract

Every submission should include: track and test/scenario ID; reviewer identity and independence; reviewed commit SHA; exact screen/state/theme/width; OS/browser/AT/zoom; expected and observed behavior; reproduction steps; screenshot/video/transcript or threat-model evidence URI; severity and rationale; remediation owner; fix reference and retest evidence; explicit reviewer decision.

**Do not collect real employee secrets or production tenant data in test evidence.** Use synthetic test content and redact screenshots/logs. Avoid granting actual Jira or connector permissions during prototype review.

## Initial disposition

**No independent execution or sign-off is claimed.** This PR establishes the traceable intake and remediation workflow, not the outcome of independent acceptance. The product owner must identify/authorize independent reviewers before the relevant sign-off gates can close.
