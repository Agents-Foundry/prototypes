# Sprint 04 — implementation roadmap (proposal, no production code)

**Planning status: PROPOSED.** This backlog is not a design-freeze decision, implementation authorization, or proof that integrations work. Implementation starts only after Sprint 03 acceptance and authorized design freeze.

## Goal and scope

Implement the approved employee-agent desktop experience and its safe control-plane integrations using existing Agents Foundry Architecture V2 contracts. Keep generic runtime/execution-plane behavior reusable; avoid role-specific runtime forks. Target Engineering → QA Engineer as the first demonstrable workflow, without treating a prototype as production.

## Prioritized backlog and estimates

| ID | Workstream | Deliverable / acceptance criteria | Rough effort |
| --- | --- | --- | --- |
| S04-01 | Baseline and architecture | Freeze-referenced design-to-contract map, API compatibility plan, tenant boundaries, threat model and ADRs | 2–4 engineer-days |
| S04-02 | Desktop shell and navigation | Rust-based desktop app shell, authentication state, light/dark accessible layouts, recoverable navigation; unit and UI tests | 5–8 engineer-days |
| S04-03 | Identity, policy and secrets | Organization context, BYOK/provider settings, secure OS-backed secret handling, fresh authorization, fail-closed privileged actions; negative-path tests | 7–12 engineer-days |
| S04-04 | Conversation and agent runs | Thread/AgentRun/RunStep/AgentEvent contracts, resumable stream, cancellation and auditable action states; integration tests | 8–13 engineer-days |
| S04-05 | Offline and recovery | Durable checkpoints, idempotency, reconciliation, replay boundaries, cross-device sync conflict handling; fault-injection tests | 8–14 engineer-days |
| S04-06 | QA pilot integrations | Jira story/test/bug flows, Bitbucket repository context and Playwright environment execution through approved connector registry and policy gateway | 10–16 engineer-days |
| S04-07 | Release assurance | CI, dependency/SBOM and secret scanning, accessibility regression, tenant-isolation and security test suites, packaging and pilot runbook | 6–10 engineer-days |

These are **engineering effort**, not elapsed calendar time; dependencies, staffing, existing implementation maturity and integration access can materially change estimates. Parallelism requires separate owners and interface contracts.

## Delivery waves

- **Wave A — foundation:** S04-01, S04-02 and initial S04-03; secure desktop sign-in and design parity.
- **Wave B — execution:** S04-04 and S04-05; reliable runs, approvals, cancellation and recovery.
- **Wave C — QA pilot:** S04-06 and S04-07; policy-mediated integrations, repeatable pre/post-release sanity evidence and pilot packaging.

## Non-negotiable engineering gates

- Control plane owns organization policy, approvals, tenant boundaries and connector allowlists; runtime and execution plane enforce the approved contracts.
- Privileged actions require fresh authorization and fail closed offline; do not replay non-idempotent actions without outcome reconciliation.
- Secrets never enter conversation logs, screenshots, or repository fixtures. Environment credentials require encrypted storage and scoped access.
- Agent tools, MCP connectors, browser automation and external environments operate only with explicit authorization, audit trails and environment separation.
- Automated testing does not substitute for manual accessibility, security/privacy review, actual zoom or independent visual QA.
- No production coding under this PR.

## Dependencies and decisions needed

1. Explicit Sprint 03 review and freeze approval.
2. Confirm implementation repository(s), existing reusable modules and Architecture V2 API versions; avoid duplicating the current platform.
3. Assign owners and capacity for desktop, platform, security and QA integration work.
4. Confirm pilot Jira/Bitbucket/Playwright environments, least-privilege test credentials and approved secret store; no credentials in docs.
5. Agree pilot success metrics: scenario completion, policy-denial correctness, recovery safety, accessibility defects, latency and cost.
6. Approve Sprint 04 scope and prioritization separately from the design freeze.

## Definition of done (future)

Feature behavior traceable to accepted designs; reviewed implementation PRs; passing CI, integration and security checks; auditable policy decisions; reproducible pilot evidence; and explicit pilot release authorization. None of these conditions are claimed as met by this roadmap.
