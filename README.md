# Agents Foundry — Product Prototypes

> **Design-first workspace, not a production application.** This repository is where the team explores, specifies, challenges, and validates the intended Agents Foundry product experience before implementation. A working prototype or passing automated check is **not** evidence of product-owner acceptance, independent security/privacy approval, accessibility approval, or design freeze.

## Explore by application

**Start with the product, not the sprint.** Choose a surface below, then follow its journeys, specifications and evidence.

| Application | Team guide | Clickable concept |
| --- | --- | --- |
| Platform Owner | [Open guide](platform-owner/README.md) | [Full prototype (28 screens)](platform-owner/app/index.html) |
| Organization Admin | [Open guide](organization-admin/README.md) | [Full prototype (27 screens)](organization-admin/app/index.html) |
| Employee Desktop | [Open guide](employee-desktop/README.md) | [Full prototype (24 screens)](employee-desktop/app/index.html) |
| Agent Studio | [Open guide](agent-studio/README.md) | [Full prototype (20 screens)](agent-studio/app/index.html) |

The [concept gallery](prototype-gallery/index.html) remains a lightweight overview. The four full prototypes share one [design system](design-system/README.md), run with no build step (`python -m http.server`), and list every screen in the [screen registry](screen-registry/SCREENS.md). **All 99 screens are proposals**; see the [redesign overview](docs/redesign-overview.md) for scope, how to review and what is still open.

[Documentation index](docs/README.md) · [Canonical folder organization and safe migration plan](docs/repository-organization.md)

**Cleanup status:** Product-first landing pages are in place on this branch. Legacy sprint directories have not been moved or deleted; a complete dependency inventory is required first.

## Start here

| You are… | Start with | Your goal |
| --- | --- | --- |
| New team member | [Product map](#product-map) → [How to explore](#how-to-explore-a-prototype) | Understand the four surfaces and how they connect |
| Product owner | [Decisions and approval](#decisions-review-and-approval) | Identify proposed behavior, decisions, and outstanding gates |
| Designer | [Screen and state checklist](#screen-and-state-checklist) | Review flows, variants, and design consistency |
| Frontend/backend developer | [Implementation handoff](#implementation-handoff) | Translate approved behavior into a separate implementation repository |
| QA engineer | [Validation and evidence](#validation-and-evidence) | Derive test scenarios and distinguish simulated from observed evidence |
| Security/privacy reviewer | [Trust boundaries](#trust-boundaries-to-review) | Examine authorization, tenant isolation, secrets, recovery, and auditability |
| Accessibility reviewer | [Accessibility review](#accessibility-review) | Assess keyboard, focus, assistive technology, and actual zoom behavior |

## What belongs in this repository

- Product mockups, interactive design prototypes, screen and state registries, journey maps, interaction specifications, decision records, review checklists, automated design tests, and traceable evidence.
- **Not** production frontend/backend code, production credentials, real customer data, deployment configuration, or claims of independent review that did not happen.
- Screens are proposals until their review and approval status is explicitly recorded. Do not treat a merged PR alone as acceptance or final design freeze.

## Product map

| Surface | Directory | Primary audience | Questions to explore |
| --- | --- | --- | --- |
| Platform Owner | [`platform-owner/`](platform-owner/) | Agents Foundry SaaS operator | How is the service operated and governed across organizations? |
| Organization Admin | [`organization-admin/`](organization-admin/) | Customer organization administrators | How does an organization onboard, structure teams, provision agents, and enforce governance? |
| Employee Desktop | [`employee-desktop/`](employee-desktop/) | Human employees working with agents | How does an employee converse, delegate, approve, inspect, recover, and resume work? |
| Agent Studio | [`agent-studio/`](agent-studio/) | Agent creators and administrators | How are reusable blueprints designed, reviewed, versioned, and published? |

**End-to-end mental model:** A platform operator manages the service; an organization admin configures its workforce and policies; an agent creator defines approved agent capabilities; an employee uses the desktop experience within those boundaries. Cross-surface behavior must remain consistent, but a prototype does not prove a production integration exists.

## How to explore a prototype

1. **Choose a persona and objective.** Example: an employee wants to resume a paused task, or an admin wants to restrict a privileged action.
2. **Locate the surface.** Open the corresponding directory above, then inspect its README, registry, specifications, and prototype assets **where present**. Do not assume every surface has a runnable UI.
3. **Find the journey and screen ID.** Record the stable screen identifier, variant/state, associated decision record, and source file. If a mapping is missing, log a documentation gap rather than guessing.
4. **Read the entire state model.** Examine initial, loading, empty, success, failure, permission-denied, offline, interrupted, recovery, cancellation, and stale-data states as applicable.
5. **Follow the interaction.** For each control ask: what triggers it, who may perform it, what confirmation is required, what changes, what is logged, and what happens if the operation fails or is retried?
6. **Inspect linked evidence.** Check whether an assertion comes from a written design, automated test, simulated screenshot, real browser observation, or independent review. These are different kinds of evidence.
7. **Record questions.** Link the exact screen/state, expected versus observed behavior, relevant decision, evidence, and proposed resolution in an issue or PR.

### Reading a screen specification

| Field | Meaning |
| --- | --- |
| Screen ID and surface | Stable reference to the proposed experience |
| Persona and goal | Who uses it and why |
| Preconditions | Permissions, policy, connection, and workflow state |
| Trigger/action | User or system event |
| Visible feedback | What the person sees, including progress and errors |
| State transitions | How the UI changes, including interruption and retry |
| Data and security | Sensitive content, authorization, isolation, and audit requirements |
| Accessibility | Keyboard, focus, semantics, announcements, contrast, and zoom expectations |
| Acceptance criteria | Testable behavior; **not** evidence that it has passed |
| Evidence and status | Artifact links, test results, reviewers, outstanding questions, and approval state |

A missing field is a gap to resolve, not an implicit approval.

## Sprint 03: design-first validation

Sprint 03 focuses on strengthening interaction specifications and review evidence without introducing production application code. Read the relevant merged PRs and their changed files in sequence, starting with [PR #40](https://github.com/Agents-Foundry/prototypes/pull/40) and continuing through the [repository pull requests](https://github.com/Agents-Foundry/prototypes/pulls?q=is%3Apr+is%3Amerged). [PR #65](https://github.com/Agents-Foundry/prototypes/pull/65) is a useful review-evidence milestone, but **do not assume it is the latest milestone**; verify the current PR history and Actions runs.

For each milestone, answer:

1. Which user journey, screen, state, or review contract changed?
2. Which product decision or risk does it address?
3. Which automated checks ran on the **exact commit**?
4. Which evidence artifacts can be inspected and independently reproduced?
5. Which manual and independent reviews are still outstanding?
6. What remains a proposal versus an approved design?

The [Actions tab](https://github.com/Agents-Foundry/prototypes/actions) is the source for current CI runs. Read workflow logs and artifact provenance before reporting success. A successful PR workflow is **not** proof that a post-merge `main` workflow ran.

## Screen and state checklist

Use this checklist for each meaningful interaction, adapting it to the feature:

- **Happy path:** entry point, action, progress, result, and next step.
- **Empty/loading:** useful instructions, skeleton/progress states, and timeouts.
- **Failure:** understandable error, safe retry, support/debug information without secret exposure.
- **Authorization:** denied, expired, revoked, changed role/policy, and privileged action requiring fresh authorization.
- **Connectivity:** offline, reconnect, uncertain outcome, cross-device sync, and stale state.
- **Safety:** idempotency, cancellation, reconciliation, replay boundaries, and irreversible action confirmation.
- **Accessibility:** keyboard-only operation, visible focus, labels, reading order, contrast, screen reader feedback, reduced motion, and actual zoom/reflow.
- **Traceability:** screen ID, acceptance criteria, linked decision, test case, artifact, and reviewer disposition.

## Trust boundaries to review

Design proposals should explicitly show where **tenant isolation**, role and policy enforcement, privileged actions, approvals, secret handling, audit trails, and recovery safeguards affect the UI. In particular, a visible button is not proof of authorization; a simulated denial is not proof of fail-closed production enforcement; and an illustrative audit record is not evidence that a backend recorded an event.

When reviewing an employee workflow, ask whether an interrupted or retried action can cause duplicate side effects, whether uncertain outcomes are reconciled before retry, and whether policy is rechecked before privileged continuation. These are design requirements to validate in the appropriate implementation and security review—not claims that a prototype enforces them.

## Validation and evidence

| Evidence type | What it supports | What it does **not** establish |
| --- | --- | --- |
| Written specification | Intended behavior and acceptance criteria | Actual implementation or user acceptance |
| Automated prototype test | Behavior exercised by the test at a particular commit | Full accessibility, security, or manual UX coverage |
| Simulated screenshot/report | Deterministic representation of a modeled state | A real browser/manual observation |
| Artifact hash/provenance verification | Integrity and consistency of the checked artifact | Correctness of the underlying design |
| Real browser session | Behavior observed in the recorded environment and viewport | Other browsers, devices, or zoom levels |
| Independent specialist review | Findings within the recorded review scope | Unreviewed areas or final product approval |
| Product-owner sign-off | Explicitly accepted scope and decision | Independent security/accessibility sign-off |

### Reproducing checks

1. Identify the exact branch and commit SHA.
2. Inspect the applicable workflow files under [`.github/workflows/`](.github/workflows/) and the local package/tool instructions **in the relevant directory**.
3. Install dependencies and run the documented commands for that checked-out revision. Do not assume a root-level `npm test` command exists.
4. Save the command, environment, commit SHA, exit code, and artifact identifiers.
5. Inspect failing assertions and logs; never report a skipped, unrun, or blocked test as passed.
6. If evidence is generated, preserve its provenance and distinguish synthetic outputs from observed browser captures.

CI may be green while independent review gates remain open.

## Accessibility review

Document intended keyboard navigation, focus order and restoration, semantics and accessible names, announcements, contrast, target sizes, reduced-motion behavior, and error recovery. Actual browser zoom/reflow, screen reader use, and visual QA require **recorded manual execution** with browser/device/version, zoom setting, date, reviewer, observed result, and artifact reference. Do not infer those outcomes from static images or viewport dimensions.

## Decisions, review, and approval

Use the relevant decision records and PR discussions as the source for specific product-owner choices. The Sprint 03 EMP-DEC series should be traced to its exact recorded decision and implementation-facing acceptance criteria; do not reconstruct an approval from a summary or a green CI badge.

**Separate gates:**
- Design proposed / documented
- Automated evidence produced and verified
- Independent security/privacy review completed
- Independent accessibility and visual/browser review completed
- Product-owner acceptance explicitly recorded
- Final design freeze explicitly authorized

Each gate needs its own evidence and authorized reviewer. **Do not self-approve independent reviews, grant product-owner acceptance, or declare design freeze.**

## Implementation handoff

A development team should receive an approved, versioned specification containing: stable screen IDs; complete states and transitions; roles and authorization constraints; data contracts and failure semantics; accessibility requirements; linked decisions; acceptance tests; and outstanding risks. Implement production code in the appropriate application repository—not here. If design and implementation diverge, raise a reviewable change rather than silently altering an approved prototype.

## Contributing

1. Create a narrowly scoped branch from the current default branch.
2. Keep changes design-first: prototypes, specifications, registries, evidence tooling, tests, or documentation.
3. Preserve stable screen IDs and explain any intentional migration.
4. In the PR, include **purpose, affected surfaces/screens, decision links, before/after behavior, states covered, test commands/results, artifact provenance, risks, and outstanding review gates**.
5. Do not attach real credentials or sensitive customer data.
6. Request appropriate reviewers; passing CI alone is insufficient for independent sign-off.
7. Do not merge without explicit authorization under the applicable repository governance.

## Glossary

- **Prototype:** A design artifact used to communicate or test intended behavior, not a deployed feature.
- **Journey:** A user's end-to-end objective across screens and states.
- **Screen registry:** A mapping of stable screen IDs to specifications/assets.
- **Decision record:** A traceable statement of an agreed product choice and its rationale.
- **Evidence artifact:** A report, log, image, or recording with provenance and scope.
- **Fail-closed:** An unsafe or unauthorized operation is denied when required authorization cannot be established.
- **Idempotency:** Repeating an operation does not unintentionally duplicate its effects.
- **Reconciliation:** Determining the actual outcome of an uncertain operation before deciding what to do next.
- **Design freeze:** An explicitly authorized milestone; it does not follow automatically from a merged PR.

## Useful links

- [Repository](https://github.com/Agents-Foundry/prototypes)
- [Merged PR history](https://github.com/Agents-Foundry/prototypes/pulls?q=is%3Apr+is%3Amerged)
- [Open PRs](https://github.com/Agents-Foundry/prototypes/pulls)
- [Issues](https://github.com/Agents-Foundry/prototypes/issues)
- [GitHub Actions](https://github.com/Agents-Foundry/prototypes/actions)

**New joiner exercise:** Choose one employee journey, trace its screen IDs and states, identify the decision record, inspect one CI run and artifact, and write down which assertions are simulated versus independently observed. If you cannot find the evidence, report the gap rather than filling it with an assumption.
