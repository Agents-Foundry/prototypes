# Screen change plan — architecture review of the 99 screens

**Status: proposal for review. No screen has been changed by this document.** It records what the six Agents Foundry repositories actually implement, where the current prototype screens contradict or omit that, and the changes proposed per module. Every statement about the platform cites a file I read; items I did not read are listed in section 10.

## 1. What I reviewed

| Repository | Visibility | Commit reviewed | What it is |
| --- | --- | --- | --- |
| `employee-agent-platform` | public | `46bfce6bb1` (2026-10-07) | Product implementation: control-plane API, Angular admin console, Angular + Tauri employee workspace, agent runtime, execution runtime, shared packages, 39 ADRs |
| `employee-agent-platform-docs` | public | `32e6bbb0b4` | Technical knowledge base; the implementation-status table is the most reliable summary |
| `employee-agent-website` | public | `2235b80c43` | Public site: 55-role workforce catalog, editions and indicative pricing (no checkout) |
| `af-pilot-infra` | private | `7e13022181` | Terraform + host scripts for a three-host pilot (control, data, execution) on GCP |
| `af-smoke-target` | private | `67c3dc86c7` | Small checkout demo app with Playwright tests; ADR 0039 says the guarded pilot smoke test needs disposable targets (I listed its files but did not read its README) |
| `prototypes` (this repo) | public | `0d4c1ad` | The design prototypes under review |

## 2. The architecture in one page

Four concerns stay separate (`docs/architecture-v2.md`): the **control plane** decides identity, scope, approvals, secrets and evidence; the **agent runtime** reasons and calls tools; the **execution runtime** runs dangerous work under signed, single-use grants; **role packages** are declarative catalog data.

```
Blueprint version (global, digest-pinned, immutable)
  → Organization installation (INSTALLATION-scoped answers)
    → Agent instance for one employee (AGENT-scoped answers) → signed Manifest v2
Conversation → Thread → Run → Step → Event (append-only)
Run ─ governed Action ─ Policy v2 (platform ∧ manifest ∧ org override ∧ resource scope)
        ALLOW | REQUIRE_APPROVAL | DENY → payload-bound, expiring approval → single-use execution
```

Facts the screens must respect (all from files I read):

- **Run states:** `QUEUED, RUNNING, WAITING_FOR_APPROVAL, COMPLETED, FAILED, CANCELLED`. There is no user pause or resume; the owner can **cancel** (`run-lifecycle.ts`, employee `app.html`).
- **Step kinds:** `PLAN, MODEL, TOOL, ACTION, MESSAGE`; step states add `PENDING, SKIPPED`.
- **Governed actions and defaults:** `repository.read/write, jira.read, qa.plan` = ALLOW (LOW); `workspace.command, workspace.dependencies.install` = ALLOW (MEDIUM); `qa.execute_playwright, jira.issue.create` = REQUIRE_APPROVAL (MEDIUM); `repository.pull_request.create` = REQUIRE_APPROVAL (HIGH); `production.deploy` and unknown = DENY (CRITICAL) (`policy-and-approvals.md`). There is **no "attach to Jira" action**.
- **Approvals today:** decided by an **organization admin**, never the requester; payload-bound; TTL by risk (LOW/MEDIUM 24 h, HIGH 8 h, CRITICAL 1 h); expired pending approvals cancel the run; single use; re-checked before execution.
- **Organization overrides can only tighten** (`REQUIRE_APPROVAL` or `DENY`), never loosen.
- **Unknown outcome of an external write:** the write is blocked from repeating until an **admin** records **Applied** or **Not applied** once, with no retry control (`failure-handling.md`, ADR 0039).
- **Recovery:** checkpoints are durable; another runtime continues an abandoned run after its lease expires (up to 10 minutes) (ADR 0032).
- **Models:** the live adapter is Anthropic; `ORGANIZATION_MANAGED` credentials only; employee BYOK is refused (`README.md`, status table).
- **Connectors:** Jira (read, create issue) and GitHub (draft pull request); Bitbucket and GitHub for repository checkout. No MCP, no executable skill runtime (`implementation-status.md`).
- **Identity:** password and Google Workspace sign-in; no built-in MFA; per-organization SSO pending; invitations and recovery are manually delivered.
- **Operator work** is a CLI (`create-customer.ts`, `recover-member.ts`) plus runbooks. A separately authenticated platform UI is a planned phase.
- **Gaps with API but no screen:** artifact download, model credentials, source-control connections, generic-run console, audit viewer (`architecture-gaps.md`, `diy-organization-platform.md`).

## 3. Decisions you gave me

| # | Question | Your decision | Implication |
| --- | --- | --- | --- |
| D1 | Design scope | Pilot reality + labelled roadmap | Real capabilities are the primary flows; planned ones are drawn but marked |
| D2 | Who approves | **Employee approves their own agent** | New rule, contradicts today's admin-only approval; needs an ADR |
| D3 | Approver tiers | Employee for LOW/MEDIUM; HIGH needs an admin | Playwright run and Jira issue creation employee-approvable; draft PR and above admin |
| D4 | Extra guards | Payload-bound, expiring, single-use only | Keep today's guarantees; no re-auth, no admin notification, no org kill-switch added |
| D5 | Agent Studio | Full authoring and promotion UI | Drawn as roadmap: the platform has no authoring or promotion workflow |
| D6 | Platform Owner | Both staff-run managed service and self-host operator; billing marked future | Fleet and runtime operations first; commercial screens labelled roadmap |
| D7 | Offline / BYOK | Roadmap-labelled; server-side recovery is the real flow | Sprint 03 offline cache and device BYOK become planned screens |
| D8 | Breadth | Design breadth fully (providers, connectors, SSO, SCIM) | Interactive designs for unbuilt items |

### Tensions I need you to confirm

1. **D1 vs D8.** "Labelled roadmap" and "design breadth fully" can conflict. I will resolve it with a **status badge on every screen and every unbuilt option** (Implemented / Partial / Planned / Proposed rule), so breadth is interactive but nothing implies it exists. Confirm.
2. **D2/D3 tighten-only.** The platform rule says organization overrides may only tighten. I propose that an organization can move any action from "employee may approve" up to "admin approves", never the reverse. You did not choose a kill-switch (D4), but this is the existing tighten-only principle, not a new guard. Confirm.
3. **D2 two-person property.** Today an admin who is not the requester decides. With D2 the person who asked the agent to act also approves, so MEDIUM actions lose independent review. The payload binding, expiry and audit trail remain. I will draw the screens as decided and flag this in the ADR text; I am not able to judge your risk appetite.

## 4. Review findings: where the 99 screens contradict the platform

Severity: **High** = shows behavior the platform does not have or contradicts a security invariant; **Medium** = wrong model or vocabulary; **Low** = omission.

| # | Screens | Prototype shows | Platform reality | Sev |
| --- | --- | --- | --- | --- |
| F1 | EMP-005, 012, 020, 022 | Employee approves with a 10-minute single-use window | Admin approves; TTL by risk 24/8/1 h | High (resolved by D2/D3, but TTLs must follow risk) |
| F2 | EMP-004 | Pause and resume a run | No pause; run states above; cancel only | High |
| F3 | EMP-007, 020 | "Attach test cases to Jira" | Not a governed action; Jira write is `jira.issue.create` only | High |
| F4 | EMP-016, 020 | Employee checks a receipt and retries | Admin reconciles Applied/Not applied once; no retry | High |
| F5 | ORG (none) | No "Writes to reconcile" screen | Implemented admin screen, central safety control | High |
| F6 | ORG-018, STD-008 | OpenAI, BYOK options, key rotation by second admin | Anthropic only; BYOK refused; keys are `secret://` refs | High |
| F7 | ORG-015, 016 | Custom roles matrix; SSO/SCIM/MFA | Only ADMIN and EMPLOYEE security roles; SSO/SCIM/MFA not built | High (becomes Planned under D8) |
| F8 | STD-009 | Auto / Ask / Blocked per environment matrix | Blueprint lists allowed actions; outcome always comes from the policy engine; catalog cannot grant itself permission | High |
| F9 | STD-013, 016, 017 | Publish, restore, roll back versions | Versions are immutable and digest-pinned; publication workflow is pending; rollback means pinning to an older version, never mutating | Medium (Planned under D5) |
| F10 | ORG-019 | Policies like "data stays in India", "offline ≤ 24 h" | Policy is a governed-actions table with tighten-only overrides and resource scope | Medium |
| F11 | ORG-003, PLT-023 | Per-tenant data region | Not a tenant setting in the docs and contracts I read (the profile has locale and timezone); the pilot is a three-host topology | Medium |
| F12 | ORG-008–013 | "Hire from blueprint" wizard | Install a blueprint version, answer INSTALLATION questions, then create agents per employee with AGENT answers, issue a signed manifest; employees can also request an agent | Medium |
| F13 | ORG-005, 006 | Teams; roles & positions | 10 unit types, dated memberships, head position; job families/disciplines/roles/levels/positions; job roles grant no privileges | Medium |
| F14 | ORG-023, 026, 027; PLT-008, 009, 017, 018, 020, 022, 027, 028 | Access reviews, billing, emergency pause-all, staff roles, support access, suspension, compliance, status page | Not built; some are planned phases (suspension, platform auth) | Medium (Planned under D6/D8) |
| F15 | EMP-014 | Production elevation by step-up sign-in | `production.deploy` is DENY; no elevation flow | Medium |
| F16 | EMP-023 | Agent memory with review/forget | Memory provider is planned, not implemented | Medium |
| F17 | all | Invented counts and example orgs | Fine as sample data, but no screen cites a source | Low |
| F18 | EMP-009, ORG | Download, retention, legal hold | Artifacts have retention class, SHA-256, 60-second retrieval; download is API-only today; legal hold not implemented | Medium |
| F19 | EMP-003 | Chat with any agent | A conversation stays bound to the agent that created it; story key and QA target are task inputs | Low |
| F20 | none | No audit viewer, model credentials, source-control connections, model spending, alert webhooks, model quality | Several exist in the admin console; audit viewer and credential screens are listed gaps | High (omission) |

## 5. Cross-cutting changes (shared design system)

1. **Implementation-status badge** on screens and on unbuilt options: Implemented, Partial, Planned, Proposed rule (for employee approval until an ADR is accepted). Shown in the page header and in the spec drawer.
2. **Source references** in the spec drawer: contract/ADR/API route each screen is derived from.
3. **Real vocabulary only** in state chips: run, step and approval states exactly as in the contracts. No invented states.
4. **Reason-code explainer** component: maps gateway codes (`ACTION_RECONCILIATION_REQUIRED`, `APPROVAL_EXPIRED`, `CHANGE_SET_CHANGED`, `CONNECTOR_OUTCOME_UNKNOWN`, `POLICY_UNAVAILABLE` and the rest in `action-gateway.md`) to plain language and next step.
5. **Correlation breadcrumb** (organization → employee → agent → thread → run → step → action) available on every run-scoped screen.
6. **Approver-class chip** (Employee / Admin) wherever an approval appears, derived from risk and the organization's tighten-only override.
7. **Scenario list aligned to real failure modes:** add `Run queued`, `Lease expired, run being recovered`, `Approval expired`, `Reconciliation required`, `Secret unresolved`, `Policy unavailable (fail closed)`. Keep offline only where D7 labels it roadmap.
8. **Sample data from the real catalog:** five roles, seven versions, QA workflows (`validate-story`, `sanity-test`, `regression-test`, `post-release-validation`).

## 6. Module plans

Rules: legacy IDs stay (CLAUDE.md rule 4), so a screen that is wrong is **repurposed in place** or relabelled Planned, not deleted. New screens get the next contiguous ID.

### 6.1 Employee Desktop (EMP) — 24 existing, 8 proposed new

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| EMP-001 | Modify | Password and Google sign-in, single-use activation link, membership switch, private account-link preview; remove MFA claim; SSO as Planned | `/api/auth/*`, `diy-organization-platform.md` |
| EMP-002 | Modify | Threads bound to an agent; real run statuses; "waiting for approval" split by approver class | `execution.ts` |
| EMP-003 | Modify | Composer with story key and QA target; run card inline; Cancel run; manifest-verified chip; conversation bound to its agent | employee `app.html` |
| EMP-004 | **Rewrite** | Real state machine, step kinds, paged events by sequence, lease-recovery banner, budget meter; remove pause/resume; keep cancel | `run-lifecycle.ts`, ADR 0032 |
| EMP-005 | **Rewrite** | Exact-payload approval card; employee-approvable for LOW/MEDIUM, HIGH routed to admin; server-written redacted summary; TTL by risk; digest-bound; single-use; expired cancels the run; "Proposed rule" badge | ADR 0005/0013, `policy-and-approvals.md`, D2/D3 |
| EMP-006 | Modify | Rename "Connections your agent uses": read-only view of org connections and checkout; no employee-held secrets; BYOK shown as Planned | ADR 0031, 0034 |
| EMP-007 | Modify | `jira.read` and `jira.issue.create` only; remove attach-to-Jira | `actions.ts` |
| EMP-008 | Modify | `playwright.run` results `SUCCEEDED/FAILED/TIMED_OUT/DENIED`; evidence types; egress allow-list note; failed check is evidence, not a failed run | `execution.ts`, ADR 0037 |
| EMP-009 | Modify | ArtifactSummary fields, retention class, integrity, short-lived retrieval; mark in-app download as Partial | ADR 0033 |
| EMP-010 | Modify | Thread workspace, allowed repositories, change set; private checkout is invisible to the employee | ADR 0015, 0031 |
| EMP-011 | Modify | "What this agent can do": manifest tools, skills, workflows pinned by digest; governed actions with default outcomes; MCP as Planned | `catalog.ts`, manifest-v2 |
| EMP-012 | Modify | Approvals inbox: employee-approvable queue, plus "waiting on admin" | D3 |
| EMP-013 | Modify | Threads and runs; retention classes; checkpoints deleted at run end | ADR 0032, 0033 |
| EMP-014 | Modify | QA targets per agent; `production.deploy` DENY; remove elevation workflow, keep as Planned | policy table |
| EMP-015 | Modify | Appearance and notifications; privacy copy limited to what is true (telemetry carries identifiers only) | ADR 0035 |
| EMP-016 | **Rewrite** | Server-side recovery: checkpoint, lease takeover ≤ 10 min; unknown outcome → "ask an admin to reconcile", no retry; offline cache moves to EMP-031 | ADR 0032, 0036 |
| EMP-017 | Modify | Accurate first-run copy (approval, evidence, limits) | — |
| EMP-018 | Modify | Assigned agents, signature verification, link to request flow | employee `app.html` |
| EMP-019 | Modify | Workflow picker from the role's catalog workflows; inputs from `TaskSpec` | `workflows.ts` |
| EMP-020 | Modify | Defect draft → payload-bound `jira.issue.create`; `CONNECTOR_OUTCOME_UNKNOWN` path | `actions.ts` |
| EMP-021 | Modify | Terminal states; run vs evidence outcome; confirmed vs unconfirmed external writes | — |
| EMP-022 | Modify | Draft PR is HIGH → admin approval; change-set digest; `CHANGE_SET_CHANGED` refusal | ADR 0015 |
| EMP-023 | Relabel | Memory as Planned; keep screen with Planned badge | `implementation-status.md` |
| EMP-024 | Modify | Support: honest diagnostics (connectivity, session, policy sync); operator validation is separate | ADR 0039 |
| **EMP-025** | New | Agent manifest and signature: key id, owner, digest, version, `Signature verified` | `verify-manifest.ts` |
| **EMP-026** | New | Request an agent: blueprint questionnaire, status, admin decision | provisioning routes |
| **EMP-027** | New | Run actions log: decision, outcome, error code, credentialed checkout (never parameters) | `RunActionSummary` |
| **EMP-028** | New | Model usage and budget for my runs | ADR 0021 |
| **EMP-029** | New | Role task forms for Frontend, Backend, Code Reviewer, Test Automation | catalog blueprints |
| **EMP-030** | New (Planned) | Device-local employee BYOK | ADR 0034 |
| **EMP-031** | New (Planned) | Encrypted offline read-only cache (carried from Sprint 03 decisions) | D7 |
| **EMP-032** | New | Cancel run: what stops, what is unknown, reconcile hand-off | `run.cancel` |

### 6.2 Organization Admin (ORG) — 27 existing, 11 proposed new

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| ORG-001 | Modify | Password/Google; activation link (48 h, single use, 15–256 character password); membership switch | `customer-onboarding.md` |
| ORG-002 | Modify | Live setup progress derived from records (profile, structure, positions, people, assignments, access, domain); not a persisted wizard; persisted wizard as Planned | `setup-progress.ts` |
| ORG-003 | Modify | Profile with optimistic version; domains with DNS TXT verification and primary domain; remove "region" | `tenancy-routes.ts` |
| ORG-004 | Modify | Real metrics: active agents, pending approvals, open reconciliations, budget, alerts | `app.html` |
| ORG-005 | Rewrite | Organization structure: 10 unit types, nested, dated memberships, one primary unit, head position, archive blocked by dependants, cycle rejection | `diy-organization-platform.md` |
| ORG-006 | Rewrite | Job architecture: families, disciplines, roles, levels, positions; "job roles grant no privileges" | same |
| ORG-007 | Modify | Agent directory: installation, blueprint version and digest, manifest version, owner, status | `agent-admin.ts` |
| ORG-008 | Rewrite | Choose a catalog blueprint version (five roles, seven versions) with digest | `catalog.ts` |
| ORG-009 | Rewrite | Installation answers (INSTALLATION scope: issue tracker, source control, testing) | `agent-catalog.md` |
| ORG-010 | Rewrite | Preview of the role's actions and resulting outcomes; catalog cannot grant permission | same |
| ORG-011 | Rewrite | Required connections and readiness (Jira, GitHub, checkout, model credential) | `actions.ts` |
| ORG-012 | Rewrite | Create agents for employees in a batch with AGENT answers; idempotent; Manifest v2 flag state | `agent-admin.ts` |
| ORG-013 | Rewrite | Result: signed manifest, key id, digest; replay of completed request | same |
| ORG-014 | Modify | People: employees without logins, manual invitation link (shown once), recovery link, membership suspend, position history | `organization-routes.ts` |
| ORG-015 | Modify | Access roles: real ADMIN/EMPLOYEE; custom roles Planned; "explain" follows the real policy pipeline and denial reasons | `policy-and-approvals.md` |
| ORG-016 | Modify | Identity: Google Workspace (one domain) and password real; per-org SSO, SCIM, MFA drawn as Planned (D8) | status table |
| ORG-017 | Modify | Connections: Jira and GitHub with `secret://` ref, allowed projects/repositories, ACTIVE/DISABLED, optimistic version; Linear, Azure DevOps, GitLab, MCP as Planned | `actions.ts` |
| ORG-018 | Modify | Model credentials by secret reference (Anthropic); OpenAI and others Planned; BYOK Planned; never show keys | ADR 0034 |
| ORG-019 | Rewrite | Governed actions: default outcome, risk, executor, override (tighten-only) with reason; approver class (Employee or Admin) per D3 | `actions.ts` |
| ORG-020 | Modify | Admin approvals: HIGH-risk requests, target, summary, expiry, status incl. EXPIRED; no self-approval; employee-decided items visible read-only | `app.html` |
| ORG-021 | Modify | Agent detail: manifest, digest, installation, runs, budget, retire (final) | `agent-installations.ts` |
| ORG-022 | Rewrite | Model spending: token and cost budgets, usage, explicit prices, alerts; billing seats Planned | ADR 0021–0023 |
| ORG-023 | Relabel | Access review as Planned | not in platform |
| ORG-024 | Rewrite | Audit viewer over `audit_events` and immutable `organization_change_events` | listed gap |
| ORG-025 | Modify | Artifact and checkpoint retention; legal hold Planned | ADR 0032, 0033 |
| ORG-026 | Relabel | Plan and seats Planned; notifications limited to real alerts | website editions |
| ORG-027 | Rewrite | Real levers: disable membership (revokes sessions), disable a connection, cancel runs, retire installation; "pause all agents" Planned | status table |
| **ORG-028** | New | **Writes to reconcile**: open first; action, target, run, reason; Applied / Not applied once after a confirmation; no retry | ADR 0036, 0039 |
| **ORG-029** | New | Run detail for admins: steps, actions, approvals, artifacts, events | `AgentRunDetail` |
| **ORG-030** | New | Artifact retrieval: retention class, hash check, 60-second permission | ADR 0033, 0037 |
| **ORG-031** | New | Model quality: scores per model, role, task over time | ADR 0026 |
| **ORG-032** | New | Alert webhooks: signed, test delivery, enable flag | ADR 0024 |
| **ORG-033** | New | Lifecycle and provisioning audit trail | `app.html` |
| **ORG-034** | New | Employee agent requests: review answers, approve or reject with reason | provisioning routes |
| **ORG-035** | New | Source-control and checkout connections (GitHub, Bitbucket), lease behavior | ADR 0031 |
| **ORG-036** | New | Installation edit and retire (API-only today) | `agent-catalog.md` |
| **ORG-037** | New | Account linking: private invitation preview and confirmation | auth routes |
| **ORG-038** | New | Evaluation and governance status for the installed role version | ADR 0019 |

### 6.3 Platform Owner (PLT) — 28 existing, 10 proposed new

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| PLT-001 | Relabel | Separately authenticated platform login is a planned phase | `diy-organization-platform.md` |
| PLT-002 | Modify | Fleet overview: tenants, queue depth, leases expired, reconciliations open, budget alerts, readiness GREEN/AMBER/RED | ADR 0038, 0039 |
| PLT-003 | Modify | Tenant directory (platform path, no tenant content) | ADR 0018 |
| PLT-004 | Modify | Tenant profile: domains, status, admins; suspension controls Planned | same |
| PLT-005 | Rewrite | Provision a customer (replaces `create-customer.ts`): organization and first admin; shows activation URL once; only hash stored | `customer-onboarding.md` |
| PLT-006 | Relabel | Two-person provisioning approval Proposed (not in platform) | — |
| PLT-007 | Modify | Activation link lifecycle (48 h, single use), reissue, operator recovery (`recover-member`) | same |
| PLT-008 | Relabel | Plans and entitlements Planned: editions Community, Developer $29, Team $299, Organization $999, Enterprise are indicative only | website `commerce-pages.mjs` |
| PLT-009 | Relabel | Billing operations Planned: no checkout, no seat enforcement | same, status table |
| PLT-010 | Modify | Aggregate model usage from the platform path | ADR 0021 |
| PLT-011 | Rewrite | Catalog of record: versions, digest, bundle schema, immutable; `CATALOG_VERSION_MUTATED`, `BLUEPRINT_VERSION_UNSUPPORTED` | ADR 0010, 0030 |
| PLT-012 | Relabel | Rollouts: promotion workflow is Planned; real behavior is new versions only | `agent-catalog.md` |
| PLT-013 | Rewrite | Security posture: manifest signing key and trust, grant verification keys, validation findings; key rotation as an open gap | `architecture-gaps.md` |
| PLT-014 | Modify | Cross-tenant audit through the platform role, content redacted | ADR 0018 |
| PLT-015 | Modify | Provider and connector health from metrics; Anthropic is the only live adapter | status table |
| PLT-016 | Modify | Incidents from the rendered Prometheus alerts, each linked to its runbook section | ADR 0039 |
| PLT-017 | Relabel | Support cases Planned | — |
| PLT-018 | Relabel | Support access Planned; docs say platform access must never be inferred from admin status | `diy-organization-platform.md` |
| PLT-019 | Modify | Platform policy defaults (`foundation-v2`) read-mostly | `policy-and-approvals.md` |
| PLT-020 | Relabel | Staff and roles Planned (platform-admin authentication) | same |
| PLT-021 | Modify | Operator settings limited to real options | — |
| PLT-022 | Relabel | Tenant suspension and termination Planned (Phase 3) | same |
| PLT-023 | Rewrite | Deployment topology: control, data and execution hosts, validation per scope | `af-pilot-infra` |
| PLT-024 | Rewrite | Deployment flags: `AGENT_MANIFEST_V2_ISSUANCE_ENABLED`, `GENERIC_AGENT_RUNTIME_ENABLED`, `QA_GENERIC_RUNTIME_ENABLED`, `ALERT_WEBHOOKS_ENABLED`; today these are configuration, not a UI | `README.md` |
| PLT-025 | Modify | Connector registry: Jira, GitHub real; others Planned | `actions.ts` |
| PLT-026 | Modify | Model providers: Anthropic live; scripted provider experimental; others Planned | status table |
| PLT-027 | Relabel | Compliance and legal hold Planned | — |
| PLT-028 | Relabel | Status page Planned | — |
| **PLT-029** | New | Runtime workload identities: register Ed25519 identity, authorize for organizations and profiles | ADR 0011 |
| **PLT-030** | New | Signing keys and trust: key id, pinned verification keys, rotation procedure (gap) | `manifest-signing.ts` |
| **PLT-031** | New | Pilot readiness: capability GREEN/AMBER/RED, live proofs, recorded limitations | ADR 0038 |
| **PLT-032** | New | Validation and smoke reports: per-host `pilot:validate`, guarded `pilot:smoke` | ADR 0039 |
| **PLT-033** | New | Observability: rendered dashboards and alerts, metrics, traces | ADR 0035 |
| **PLT-034** | New | Failure drills: what each component stop proves | ADR 0036 |
| **PLT-035** | New | Runtime fleet: agent and execution runtimes, heartbeats, leases | ADR 0032 |
| **PLT-036** | New | Model-quality import (`db:import-quality`) and history | ADR 0026 |
| **PLT-037** | New | Customer recovery tooling (`recover-member`) with confirmation | `customer-onboarding.md` |
| **PLT-038** | New (Planned) | Edition and entitlement mapping | website pricing |

### 6.4 Agent Studio (STD) — 20 existing, 8 proposed new (decision D5: full authoring and promotion, as roadmap)

Real today: read-only catalog, digests, pinned tools/skills/workflows, governance evaluation suites, model-quality tasks and trends. Authoring and promotion are Planned (Milestone 6).

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| STD-001 | Modify | Sign-in for authors; audience (vendor staff or customers) is an open question | §10 Q4 |
| STD-002 | Modify (Implemented read) | Catalog of five roles and seven versions with digest | `catalog.ts` |
| STD-003 | Relabel | Create blueprint Planned (roles are code today) | `agent-catalog.md` |
| STD-004 | Modify | Version overview: digest, bundle schema, pinned skills/tools/workflows | ADR 0010 |
| STD-005 | Modify | Persona and instructions as blueprint fields; Planned for editing | `catalog.ts` |
| STD-006 | Rewrite | Tool definition: id, version, risk, executionLocation, sideEffects, governedActions, timeoutMs; skill `requires` and `activatesWhen` | `catalog.ts` |
| STD-007 | Relabel | Knowledge and memory declared but not executed: Planned | status table |
| STD-008 | Rewrite | Model profile and credential mode; Anthropic live; cost and token budgets are tenant settings, not blueprint | status table |
| STD-009 | **Rewrite** | Action allow-list: the blueprint names actions; outcomes come read-only from the policy engine; a blueprint cannot grant itself permission | `agent-catalog.md` |
| STD-010 | Modify | Run a scenario in the simulated evaluation world | ADR 0019 |
| STD-011 | Rewrite | Two suite types: governance (deterministic, every commit) and model-quality (checks, rubric, `passThreshold`, budgets) | ADR 0019, 0020 |
| STD-012 | Modify | Evaluation run detail: expected vs actual tool results, approvals, final status | same |
| STD-013 | Rewrite | Versions are immutable; diff of bundles by digest; no restore that mutates | ADR 0010 |
| STD-014 | Relabel | Review queue Planned (promotion workflow) | `agent-catalog.md` |
| STD-015 | Relabel | Independent review and decision Planned | same |
| STD-016 | Relabel | Immutable publication and signing Planned | `architecture-gaps.md` |
| STD-017 | Rewrite | Rollback and deprecation: new installations pin an earlier version; existing agents never change | ADR 0010 |
| STD-018 | Modify | Quality trend per model, role and task (import-based) | ADR 0026 |
| STD-019 | Relabel | Custom skills Planned: skills are guidance, not executable | status table |
| STD-020 | Modify | Studio access: audience and roles open question | §10 Q4 |
| **STD-021** | New | Catalog validation: the whole catalog fails on any broken reference (list of rules) | `agent-catalog.md` |
| **STD-022** | New | Questionnaire builder with INSTALLATION vs AGENT scope and connector mapping | same |
| **STD-023** | New | Workflow builder: steps of skill and action | same |
| **STD-024** | New | Evaluation scenario builder | ADR 0019 |
| **STD-025** | New (Planned) | Import a role package from an external repository | `architecture-gaps.md` |
| **STD-026** | New (Planned) | MCP server definitions, filtered by manifest and policy | `architecture-v2.md` |
| **STD-027** | New | Bundle compatibility: `BLUEPRINT_VERSION_UNSUPPORTED` handling | ADR 0030 |
| **STD-028** | New | Role expansion backlog: 55-role catalog marked current vs expansion | website `catalog.json` |

**Totals if approved:** 99 existing screens modified, rewritten or relabelled; **37 new** (EMP 8, ORG 11, PLT 10, STD 8) → 136 screens. Counts of "Planned" screens are shown by badge, not hidden.

## 7. Traceability (examples, to be completed per screen)

| Screen | Primary API / contract |
| --- | --- |
| EMP-004 | `GET /api/execution/v1/runs/:id`, `/runs/:id/events`, `POST /runs/:id/cancel` |
| EMP-005, ORG-020 | `POST /api/approvals/:id/decision`, `RunApprovalSummary` (new employee-decision path needs an ADR) |
| EMP-027 | `GET /api/execution/v1/runs/:id/actions` |
| ORG-017 | `GET/POST /connector-connections`, `POST /:id/disable` |
| ORG-019 | `GET/PUT/DELETE /api/organization/action-policies/:action` |
| ORG-022 | `/model-budget`, `/model-usage`, `/model-prices`, `/model-alerts` |
| ORG-028 | `GET /api/organization/action-reconciliations`, `POST …/:requestId/resolution` |
| ORG-030, EMP-009 | `POST /artifacts/:id/retrievals`, `GET /artifact-content/:token` |
| STD-002, 004 | `GET /api/catalog/v1/blueprints`, `…/versions/:version` |
| STD-018, ORG-031 | `GET /api/catalog/v1/quality` |

## 8. Sequencing (each a reviewable PR)

0. **Decisions:** you confirm §3 tensions; an ADR for employee approval (D2/D3) is drafted for the platform repo. No screen work depends on it being accepted, but the badge stays "Proposed rule" until then.
1. **Shared:** status badge, source references, reason-code explainer, correlation breadcrumb, real scenarios, approver-class chip.
2. **EMP core:** EMP-004, 005, 012, 016, 020, 022 plus EMP-025, 027, 032 (the approval, run and recovery model).
3. **ORG core:** ORG-019, 020, 028, 029, 024, 017, 018, 022 plus the install-and-create flow ORG-008–013 and ORG-034, 036.
4. **ORG structure and identity:** ORG-001–007, 014–016, 003 domains, 037.
5. **PLT operations:** PLT-002, 005, 007, 029–037, then relabels.
6. **STD:** read-only real screens first (002, 004, 006, 009, 011–013, 018, 021, 027), then Planned authoring and promotion.
7. **Remaining relabels and Planned screens;** regenerate the registry; update the redesign overview.

## 9. Acceptance criteria

- Every state chip uses a contract-defined value; a script compares prototype state names with `run-lifecycle.ts` and the action list.
- No screen shows an action the platform lacks unless badged Planned or Proposed.
- Every screen lists its source in the spec drawer; the checker fails if a screen has no `source` or `status`.
- Employee-approval screens show approver class, TTL by risk and the payload summary, and route HIGH to an admin.
- `check_apps.py`, the registry check and the Playwright smoke/axe suite pass; new screens meet the same axe rules. These remain simulated-environment checks, not approval.
- No independent review, product-owner acceptance or freeze is claimed.

## 10. Open questions and what I did not read

**Questions still open (I will not assume):**

1. Confirm the three tensions in §3.
2. D2 changes a security invariant. Who owns the decision and the ADR in the platform repository?
3. Is the employee's approval recorded as `requestedBy` = agent and `decidedBy` = employee? I did not read the approval service, so I do not know how the current self-approval check identifies the requester.
4. **Studio audience:** are blueprints authored only by Agents Foundry staff (the catalog is global and shipped in code today), or can customers author organization-specific blueprints (the website mentions external role packages as planned)?
5. **Platform authentication:** should the operator console use a separate identity system from tenant sign-in (the docs say separately authenticated)?
6. **Data region:** the platform code I read has no per-tenant region. Do you want it designed as a future setting, or removed?
7. **Earlier Sprint 03 decisions** (EMP-DEC-01–10, PLT-DEC, DEC-01–08): I have not re-traced them against the platform. D7 retires two of them as roadmap; should the rest be revalidated screen by screen?
8. **Commerce:** the website lists indicative plans only. Should billing screens model those editions, or stay generic?
9. **Which "55-role" roles** matter for screens beyond the five engineering roles (the website separates current from expansion roles)?

**Not read (so not used for claims):** `manifest-v2.md` and `agent-runtime.md` details, ADRs 0005, 0013, 0032, 0033, 0034 in full, the `docs/api/*` reference, runtime and execution-runtime source, the `web-auth` package, `pilot-readiness/assessment.json`, the Terraform and shell scripts beyond resource names, and the `af-smoke-target` app. Where a screen change depends on one of these, the plan marks it as needing confirmation.
