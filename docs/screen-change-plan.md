# Screen change plan — architecture review of the 99 screens

**Status: proposal for review. No screen has been changed by this document.** It records what the six Agents Foundry repositories actually implement, where the current prototype screens contradict or omit that, and the changes proposed per module. Every statement about the platform cites a file I read; section 10 lists what I read and what I still have not read. Revision 2 added the approval-check code, runtime and execution docs, the ADRs on checkpoints, artifacts, credentials, spending, webhooks and drills, the operator material and the blueprint questionnaires.

## 1. What I reviewed

| Repository | Visibility | Commit reviewed | What it is |
| --- | --- | --- | --- |
| `employee-agent-platform` | public | `46bfce6bb1` (2026-10-07) | Product implementation: control-plane API, Angular admin console, Angular + Tauri employee workspace, agent runtime, execution runtime, shared packages, 39 ADRs |
| `employee-agent-platform-docs` | public | `32e6bbb0b4` | Technical knowledge base; the implementation-status table is the most reliable summary |
| `employee-agent-website` | public | `2235b80c43` | Public site: 55-role workforce catalog, editions and indicative pricing (no checkout) |
| `af-pilot-infra` | private | `7e13022181` | Terraform + host scripts for a three-host pilot (control, data, execution) on GCP |
| `af-smoke-target` | private | `67c3dc86c7` | Disposable target for the guarded pilot smoke test (ADR 0039). It deliberately mis-applies a `SAVE10` discount so the QA agent has a real defect to report as a draft; it is not a product |
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
- **Approvals today (verified in code):** `POST /api/approvals/:id/decision` returns `403 ADMIN_ROLE_REQUIRED` unless the actor's role is `ADMIN` (`app.ts:405-409`), and `decideApproval` throws `SELF_APPROVAL_FORBIDDEN` when `approval.requestedBy === actorId` (`database.ts:1979`). The Action Gateway records `requested_by` as the **run's employee** (`action-gateway.ts:186`), so an employee can never decide an approval for their own agent's action. `agent-runtime.md` states the same: "Approvals are requested for the employee, who cannot approve their own." Approvals are payload-bound; TTL by risk (LOW/MEDIUM 24 h, HIGH 8 h, CRITICAL 1 h); expired pending approvals cancel the run; single use; re-checked before execution.
- **Organization overrides can only tighten** (`REQUIRE_APPROVAL` or `DENY`), never loosen.
- **Unknown outcome of an external write:** the write is blocked from repeating until an **admin** records **Applied** or **Not applied** once, with no retry control (`failure-handling.md`, ADR 0039).
- **Recovery (ADR 0032):** runtimes heartbeat every 30 s; an expired lease (10 min) makes a `RUNNING` run with a durable checkpoint reclaimable (`run.recover`), otherwise it is cancelled `RUNTIME_LOST`; a run handed on three times is cancelled `RUNTIME_RECOVERY_EXHAUSTED`; an abandoned run is cancelled after 24 h; `MANIFEST_INVALID` cancels a run whose manifest no longer matches. Checkpoints (latest two) hold conversation content, are never returned to a browser and are deleted when the run ends. A tool call whose result was not checkpointed is never re-run (`TOOL_OUTCOME_UNKNOWN`); an expired grant fails with `GRANT_EXPIRED`.
- **Artifacts (ADR 0033, 0037):** retention classes `EPHEMERAL` (1 day), `STANDARD_30D`, `EXTENDED_365D`, `LEGAL_HOLD` (no expiry); lifecycle `PENDING → STORED → REGISTERED → DELETED`; `UNMANAGED` references cannot be retrieved; retrieval is a 60-second permission for the signed-in owner or an admin, audited, with a hash check (`artifact.integrity_failed`); limits 16 MiB per artifact, 200 per run, 512 MiB per run, browser evidence at most 160 MiB per run (trace 48 MiB × 4, screenshot 4 MiB × 20, video 24 MiB × 2). Deleting a person's or organization's artifacts on request is **not implemented**; only retention deletes.
- **Model spending (ADR 0021–0023):** budgets are per organization: monthly and per-run **token** limits plus optional **cost** limits from an append-only, organization-supplied price book (integers in millionths of a currency unit). Every call is reserved then settled; denial is `MODEL_BUDGET_EXCEEDED` (or `MODEL_BUDGET_UNAVAILABLE` when it cannot be checked). Up to five alert thresholds (1–99 %, default 80); a 100 % alert is always raised; per-run limits raise no alert; an alert is acknowledged once and never deleted.
- **Alert webhooks (ADR 0024):** up to ten per organization; HTTPS on the default port to a public host name (IP literals, `localhost`, internal names refused); the URL is never editable and endpoints are disabled, never deleted; the console shows only the origin and the last four characters; deliveries are signed with the control plane's Ed25519 key (receivers pin the public key shown in the console); `webhook.test` can be queued.
- **Model credentials:** `GET/PUT /api/organization/model-credentials[/:provider]` and `/:provider/disable` exist (set, replace, disable a `secret://` reference). `MODEL_CREDENTIAL_UNAVAILABLE` also covers BYOK.
- **Credential leases and source-control connections:** admins can list and revoke credential leases (`/api/organization/credential-leases`) and create or disable GitHub/Bitbucket source-control connections; a lease lasts 5 minutes, one use.
- **All `/api/organization/*` admin routes are "password-mode organization admin"** (`governance-and-connections.md`): a Google-mode administrator does not get these panels.
- **Authentication behavior (`session.ts`, `auth-panel.html`):** the employee and admin apps are separate and each requires its role; a membership of the other role shows "Open the admin/employee application"; activation and password-reset links are single-use fragment tokens; password 15–256 characters; `429` shows "Too many sign-in attempts"; "Forgot password?" says to contact an administrator (self-service reset is not available); Google sign-in is unavailable in the Tauri shell ("native system-browser sign-in is not connected yet").
- **Execution operations (`execution-runtime.md`):** `git.checkout`, `git.status`, `file.read` (≤ 256 KiB), `file.write` (≤ 128 KiB, `repository.write`, tool `code-editor`), `command` (only `npm run <script>` from the agent's configured `projectScripts`, container provider only, network none), `dependencies.install` (`npm ci --ignore-scripts` from the configured `packageRegistryUrl` only), `playwright.run`. Refusals include `ISOLATION_UNAVAILABLE`, `EGRESS_CONTROL_UNAVAILABLE`, `WORKSPACE_LOST`, `OPERATION_INTERRUPTED`.
- **Models:** the live adapter is Anthropic; `ORGANIZATION_MANAGED` credentials only; employee BYOK is refused (`README.md`, status table).
- **Connectors:** Jira (read, create issue) and GitHub (draft pull request); Bitbucket and GitHub for repository checkout. No MCP, no executable skill runtime (`implementation-status.md`).
- **Identity:** password and Google Workspace sign-in; no built-in MFA; per-organization SSO pending; invitations and recovery are manually delivered.
- **Operator work** is a CLI (`create-customer.ts`, `recover-member.ts`, `db:import-quality`, `pilot:validate`, `pilot:smoke`) plus the pilot runbook (12 sections: validating a deployment, starting/stopping runtimes, reading dashboards, handling writes to reconcile, Vault failures, artifact failures, database failures, rotating credentials, cancelling a run, recovering a stuck run, collecting incident evidence, rolling back the pilot). The pilot runs on three hosts (`af-control`: Caddy, API, agent runtime, OTLP collector, Prometheus, Grafana; `af-data`: PostgreSQL 16, Vault, pilot CA; `af-exec`: execution runtime and Docker sandboxes) on GCP; operator scripts issue server certificates, release an exact commit SHA and create an organization (the activation link goes to a root-only file). Runtime workload identities are Ed25519 public keys registered in a file with the organizations and runtime profiles each may serve. A separately authenticated platform UI is a planned phase. There are 25 rendered alert rules (for example `lease-expired`, `reconciliation-required`, `secret-store-unavailable`, `object-store-failures`, `artifact-integrity`, `checkpoint-corrupt` are critical) each linking to a runbook section.
- **Readiness (ADR 0038):** 11 assessed capabilities (tenant isolation, manifest integrity, policy and approval, model budget, credential isolation, private repositories, execution sandboxing, recovery, artifacts, observability, evaluation health) with status GREEN/AMBER/RED computed from test results, six live proofs (`vault-live`, `private-scm-live`, `sandbox-live`, `object-store-live`, `telemetry-live`, `real-model-live`) and 12 recorded limitations (10 accepted, 2 informational).
- **Role workflows and questionnaires (verified in `packages/catalog`):** QA Engineer `validate-story`, `sanity-test`, `regression-test`, `post-release-validation` (agent fields `projectName`, `repositoryUrl`, `qaUrl`); Frontend Engineer `implement-ui-change` (`projectName`, `repositoryUrl`, `projectScripts`, `packageRegistryUrl`); Backend Engineer `implement-api-change` (same four); Code Reviewer `review-change` (same four); Test Automation Engineer `automate-regression-tests` (`projectName`, `repositoryUrl`, `qaUrl`, `packageRegistryUrl`). Every role has installation-scoped `issueTracker` and `sourceControl`; QA also has `testingTechnologies`.
- **Gaps with API but no screen:** artifact download, model credentials, source-control connections, credential leases (list and revoke), generic-run console, audit viewer (`architecture-gaps.md`, `diy-organization-platform.md`, `governance-and-connections.md`). The admin console today is one scrolling page of panels (setup progress, organization, tenant, structure, jobs, people, installations, governed actions, writes to reconcile, model spending, alert webhooks, model quality, agent admin, approvals, provisioning audit) with a left anchor list and no router (`app.html`, `app.routes.ts` is empty). The employee app is a single QA-focused conversation view.
- **Existing visual identity:** the sign-in panel uses the hexagon brand mark, "Agents Foundry · Your agent workspace" and "Human ambition. Agent execution." The prototype design system is a proposal and has not been compared with the shipped styles beyond this.

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
4. **D2 changes two coded checks, not one.** Verified: the decision route requires role `ADMIN` (`app.ts:405-409`) **and** `decideApproval` rejects `requestedBy === actorId` where `requestedBy` is the run's employee (`database.ts:1979`, `action-gateway.ts:186`). Employee approval for LOW/MEDIUM therefore needs both changed, a new approver-class field in the policy, and updated tests. The agent runtime doc (`agent-runtime.md`) states the opposite invariant and would need rewriting. I will mark every employee-approval screen "Proposed rule" until that ADR exists.
5. **Does D2 also cover agent provisioning requests?** An employee requesting an agent is a separate flow with its own `SELF_APPROVAL_FORBIDDEN` check (`database.ts:1466`). I will leave provisioning approval with the admin unless you say otherwise.

## 4. Review findings: where the 99 screens contradict the platform

Severity: **High** = shows behavior the platform does not have or contradicts a security invariant; **Medium** = wrong model or vocabulary; **Low** = omission.

| # | Screens | Prototype shows | Platform reality | Sev |
| --- | --- | --- | --- | --- |
| F1 | EMP-005, 012, 020, 022 | Employee approves with a 10-minute single-use window | Admin-only route plus `SELF_APPROVAL_FORBIDDEN`; TTL by risk 24/8/1 h; execution grants live at most 10 minutes and never beyond the approval's expiry | High (D2/D3 chosen, but TTLs must follow risk and the grant lifetime is separate) |
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
| F18 | EMP-009, ORG-025 | Download, retention, legal hold toggle | Retention classes include `LEGAL_HOLD` (no expiry); SHA-256 verified three times; 60-second retrieval; download is API-only today; deletion on request is **not** implemented; how a hold is placed is not documented in what I read | Medium |
| F21 | all admin screens | Always available | `/api/organization/*` routes are password-mode admin only; a Google-mode admin gets none | Medium |
| F22 | EMP-001, ORG-001 | Generic sign-in with MFA and SSO | Separate admin and employee apps each require their role; single-use activation and reset links; 15–256 character password; rate-limit message; no self-service reset; no Google sign-in in the Tauri shell | Medium |
| F23 | ORG-022, 018 | Single dollar budget and invented providers | Token and cost limits (monthly and per run), append-only price book, thresholds up to five, 100 % always, acknowledge-once alerts, ≤10 signed webhooks | Medium |
| F24 | ORG-017, 035 | Connectors as one list | Two distinct admin APIs: connector connections (Jira, GitHub; allowed projects/repositories) and source-control connections (GitHub, Bitbucket) plus 5-minute single-use credential leases that admins can list and revoke | Medium |
| F25 | PLT-023 | "Regions" with capacity bars | The pilot is three named hosts (control, data, execution) on GCP asia-south1; there is no multi-region capacity model in what I read | Medium |
| F19 | EMP-003 | Chat with any agent | A conversation stays bound to the agent that created it; story key and QA target are task inputs | Low |
| F20 | none | No audit viewer, model credentials, source-control connections, model spending, alert webhooks, model quality | Several exist in the admin console; audit viewer and credential screens are listed gaps | High (omission) |

## 5. Cross-cutting changes (shared design system)

1. **Implementation-status badge** on screens and on unbuilt options: Implemented, Partial, Planned, Proposed rule (for employee approval until an ADR is accepted). Shown in the page header and in the spec drawer.
2. **Source references** in the spec drawer: contract/ADR/API route each screen is derived from.
3. **Real vocabulary only** in state chips: run, step and approval states exactly as in the contracts. No invented states.
4. **Reason-code explainer** component: maps gateway codes (`ACTION_RECONCILIATION_REQUIRED`, `APPROVAL_EXPIRED`, `CHANGE_SET_CHANGED`, `CONNECTOR_OUTCOME_UNKNOWN`, `POLICY_UNAVAILABLE` and the rest in `action-gateway.md`) to plain language and next step.
5. **Correlation breadcrumb** (organization → employee → agent → thread → run → step → action) available on every run-scoped screen.
6. **Approver-class chip** (Employee / Admin) wherever an approval appears, derived from risk and the organization's tighten-only override.
7. **Scenario list aligned to real failure modes:** add `Run queued`, `Lease expired, run being recovered`, `Recovery exhausted (RUNTIME_RECOVERY_EXHAUSTED)`, `Approval expired`, `Reconciliation required`, `Secret unresolved`, `Policy unavailable (fail closed)`, `Model budget exceeded`, `Grant expired`, `Google-mode organization (admin panels unavailable)`, `Wrong application for this role`. Keep offline only where D7 labels it roadmap.
8. **Sample data from the real catalog:** five roles, seven versions, QA workflows (`validate-story`, `sanity-test`, `regression-test`, `post-release-validation`).

## 6. Module plans

Rules: legacy IDs stay (CLAUDE.md rule 4), so a screen that is wrong is **repurposed in place** or relabelled Planned, not deleted. New screens get the next contiguous ID.

### 6.1 Employee Desktop (EMP) — 24 existing, 8 proposed new

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| EMP-001 | Modify | Email + application password (15–256), Google (browser only; not in the Tauri shell), single-use activation and reset fragment links, `429` rate-limit message, "contact your administrator" for reset, "open the other application" role mismatch, membership switch, private account-link preview and confirm; remove MFA claim; SSO as Planned | `session.ts`, `auth-panel.html` |
| EMP-002 | Modify | Threads bound to an agent; real run statuses; "waiting for approval" split by approver class | `execution.ts` |
| EMP-003 | Modify | Composer with story key and QA target; run card inline; Cancel run; manifest-verified chip; conversation bound to its agent | employee `app.html` |
| EMP-004 | **Rewrite** | Real state machine, step kinds, paged events by sequence (the shipped app refreshes a followed run every 2 s until it is terminal), lease-recovery banner, budget meter; remove pause/resume; keep "Cancel run" (`cancelOwnRun`) | `run-lifecycle.ts`, ADR 0032, employee `app.ts` |
| EMP-005 | **Rewrite** | Exact-payload approval card; employee-approvable for LOW/MEDIUM, HIGH routed to admin; server-written redacted summary; TTL by risk; digest-bound; single-use; expired cancels the run; "Proposed rule" badge | ADR 0005/0013, `policy-and-approvals.md`, D2/D3 |
| EMP-006 | Modify | Rename "Connections your agent uses": read-only view of org connections and checkout; no employee-held secrets; BYOK shown as Planned | ADR 0031, 0034 |
| EMP-007 | Modify | `jira.read` and `jira.issue.create` only; remove attach-to-Jira | `actions.ts` |
| EMP-008 | Modify | `playwright.run` against the agent's configured QA origin; results `SUCCEEDED/FAILED/TIMED_OUT/DENIED`; evidence kinds (trace per failed test, screenshots, videos, console, network log) with counts and "N files not kept" when over limits; failed check is evidence, not a failed run; refusals `ISOLATION_UNAVAILABLE`, `EGRESS_CONTROL_UNAVAILABLE` | `execution.ts`, ADR 0016, 0037 |
| EMP-009 | Modify | ArtifactSummary fields, retention class chip (Ephemeral 1 d / 30 d / 365 d / Legal hold), `UNMANAGED` and `DELETED` states, integrity result, "Request download" → 60-second personal permission; mark in-app download Partial | ADR 0033 |
| EMP-010 | Modify | Thread workspace, configured repository only, `git.status`, `file.read`/`file.write` limits, allowed `npm run` scripts from `projectScripts`, `dependencies.install` from the configured registry, change set for a draft PR; `WORKSPACE_LOST` is never silently recreated; private checkout credentials are invisible | ADR 0015, 0017, 0031 |
| EMP-011 | Modify | "What this agent can do": manifest tools, skills, workflows pinned by digest; governed actions with default outcomes; MCP as Planned | `catalog.ts`, manifest-v2 |
| EMP-012 | Modify | Approvals inbox: employee-approvable queue (Proposed rule), plus "waiting on admin"; today an employee can already list their own approvals (`GET /api/approvals` is filtered to `requestedBy`) and sees "Waiting for approval … in the Admin control plane" | D3, `database.ts:1952` |
| EMP-013 | Modify | Threads and runs; retention classes; checkpoints deleted at run end | ADR 0032, 0033 |
| EMP-014 | Modify | QA targets per agent; `production.deploy` DENY; remove elevation workflow, keep as Planned | policy table |
| EMP-015 | Modify | Appearance and notifications; privacy copy limited to what is true (telemetry carries identifiers only) | ADR 0035 |
| EMP-016 | **Rewrite** | Server-side recovery states from the ADR 0032 table: live lease; expired lease with checkpoint (`run.recover`, ≤ 10 min); no checkpoint (`RUNTIME_LOST`); three recoveries (`RUNTIME_RECOVERY_EXHAUSTED`); 24 h abandoned; model turn repeated (tokens spent twice); `TOOL_OUTCOME_UNKNOWN`; `GRANT_EXPIRED`; unknown external write → "ask an admin to reconcile", no retry; offline cache moves to EMP-031 | ADR 0032, 0036 |
| EMP-017 | Modify | Accurate first-run copy (approval, evidence, limits) | — |
| EMP-018 | Modify | Assigned agents, signature verification, link to request flow | employee `app.html` |
| EMP-019 | Modify | Workflow picker limited to the manifest's workflows (`WORKFLOW_NOT_IN_MANIFEST` otherwise); inputs from `TaskSpec` (objective, workItem, inputs); errors `GENERIC_RUNTIME_DISABLED`, `RUNTIME_MANIFEST_V2_REQUIRED`, `CONVERSATION_AGENT_MISMATCH`; run starts `QUEUED` (HTTP 202) | `execution-routes.ts`, `workflows.ts` |
| EMP-020 | Modify | Defect draft → payload-bound `jira.issue.create`; `CONNECTOR_OUTCOME_UNKNOWN` path | `actions.ts` |
| EMP-021 | Modify | Terminal states; run vs evidence outcome; confirmed vs unconfirmed external writes | — |
| EMP-022 | Modify | Draft PR is HIGH → admin approval; change-set digest; `CHANGE_SET_CHANGED` refusal | ADR 0015 |
| EMP-023 | Relabel | Memory as Planned; keep screen with Planned badge | `implementation-status.md` |
| EMP-024 | Modify | Support: honest diagnostics (connectivity, session, policy sync); operator validation is separate | ADR 0039 |
| **EMP-025** | New | Agent manifest and signature: key id, owner, digest, version, `Signature verified` | `verify-manifest.ts` |
| **EMP-026** | New | Request an agent: blueprint questionnaire, status, admin decision | provisioning routes |
| **EMP-027** | New | Run actions log: decision, outcome, error code, credentialed checkout (never parameters) | `RunActionSummary` |
| **EMP-028** | New | Model usage and budget for my runs | ADR 0021 |
| **EMP-029** | New | Role task forms: Frontend `implement-ui-change`, Backend `implement-api-change`, Code Reviewer `review-change`, Test Automation `automate-regression-tests` | catalog blueprints |
| **EMP-030** | New (Planned) | Device-local employee BYOK | ADR 0034 |
| **EMP-031** | New (Planned) | Encrypted offline read-only cache (carried from Sprint 03 decisions) | D7 |
| **EMP-032** | New | Cancel run: what stops, what is unknown, reconcile hand-off | `run.cancel` |

### 6.2 Organization Admin (ORG) — 27 existing, 12 proposed new

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| ORG-001 | Modify | Password/Google; activation link (48 h, single use, 15–256 character password); membership switch; "this application requires the admin role" state; admin panels only in password mode (Google-mode shows the scenario) | `customer-onboarding.md`, `session.ts`, `governance-and-connections.md` |
| ORG-002 | Modify | Live setup progress derived from records (profile, structure, positions, people, assignments, access, domain); not a persisted wizard; persisted wizard as Planned | `setup-progress.ts` |
| ORG-003 | Modify | Profile with optimistic version; domains with DNS TXT verification and primary domain; remove "region" | `tenancy-routes.ts` |
| ORG-004 | Modify | Real metrics: active agents, pending approvals, open reconciliations, budget, alerts | `app.html` |
| ORG-005 | Rewrite | Organization structure: 10 unit types, nested, dated memberships, one primary unit, head position, archive blocked by dependants, cycle rejection | `diy-organization-platform.md` |
| ORG-006 | Rewrite | Job architecture: families, disciplines, roles, levels, positions; "job roles grant no privileges" | same |
| ORG-007 | Modify | Agent directory: installation, blueprint version and digest, manifest version, owner, status | `agent-admin.ts` |
| ORG-008 | Rewrite | Choose a catalog blueprint version ("(latest)" marker; five roles, seven versions) showing mission, skills, workflows and digest | `catalog.ts`, `agent-installations.ts` |
| ORG-009 | Rewrite | Installation answers (INSTALLATION scope: `issueTracker`, `sourceControl`; QA adds `testingTechnologies`); active names unique per organization; applies only to agents created afterwards | `agent-catalog.md`, `packages/catalog` |
| ORG-010 | Rewrite | Preview of the role's actions and resulting outcomes; catalog cannot grant permission | same |
| ORG-011 | Rewrite | Required connections and readiness (Jira, GitHub, checkout, model credential) | `actions.ts` |
| ORG-012 | Rewrite | Create agents as the shipped panel does: role and version, agent name, "Start from installation" or "None (answer every setting)", assign to up to 25 active employees (a separate private instance each), role-specific AGENT answers (`projectName`, `repositoryUrl`, plus `qaUrl`, `projectScripts`, `packageRegistryUrl` by role), model provider and identifier (free text today), credential preference, "Review enforced permissions"; idempotent; Manifest v2 flag state. The shipped form still offers `EMPLOYEE_BYOK`; the redesign marks it Planned and refused | `agent-admin.ts`, `packages/catalog` |
| ORG-013 | Rewrite | Result: signed manifest, key id, digest; replay of completed request | same |
| ORG-014 | Modify | People: employees without logins (employment type employee/contractor/external, status active/inactive), manual invitation link (shown once), recovery link, membership status `pending/active/suspended`, disable member (revokes sessions; cannot disable self or another admin), position history | `organization-routes.ts`, `schema.md` |
| ORG-015 | Modify | Access roles: real ADMIN/EMPLOYEE; custom roles Planned; "explain" follows the real policy pipeline and denial reasons | `policy-and-approvals.md` |
| ORG-016 | Modify | Identity: Google Workspace (one domain) and password real; per-org SSO, SCIM, MFA drawn as Planned (D8) | status table |
| ORG-017 | Modify | Connector connections: Jira and GitHub with `secret://` ref, `authEmail`, allowed projects and repositories, ACTIVE/DISABLED, optimistic `version`, one active per provider, disable never delete; Linear, Azure DevOps, GitLab, MCP as Planned | `actions.ts`, `governance-and-connections.md` |
| ORG-018 | Modify | Model credentials: per provider set, replace, disable a `secret://` reference (Anthropic live); OpenAI and others Planned; BYOK Planned (`MODEL_CREDENTIAL_UNAVAILABLE`); never show keys | ADR 0034, `models-and-alerts.md` |
| ORG-019 | Rewrite | Governed actions: default outcome, risk, executor, override (tighten-only) with reason; approver class (Employee or Admin) per D3 | `actions.ts` |
| ORG-020 | Modify | Admin approvals: HIGH-risk requests, target, summary, expiry, status incl. EXPIRED; no self-approval; employee-decided items visible read-only | `app.html` |
| ORG-021 | Modify | Agent detail: manifest, digest, installation, runs, budget, retire (final) | `agent-installations.ts` |
| ORG-022 | Rewrite | Model spending: monthly and per-run token limits, optional cost limits, usage, append-only price book (optimistic `expectedPriceId`), up to five alert thresholds, acknowledge-once alerts, `unpricedCalls`; billing seats Planned | ADR 0021–0023 |
| ORG-023 | Relabel | Access review as Planned | not in platform |
| ORG-024 | Rewrite | Audit viewer over `audit_events` and immutable `organization_change_events` | listed gap |
| ORG-025 | Modify | Retention classes and what each deletes; checkpoints deleted at run end; `LEGAL_HOLD` class shown (how a hold is placed is unconfirmed); deletion on request marked Not implemented | ADR 0032, 0033 |
| ORG-026 | Relabel | Plan and seats Planned; notifications limited to real alerts | website editions |
| ORG-027 | Rewrite | Real levers: disable membership (revokes sessions), disable a connection, cancel runs, retire installation; "pause all agents" Planned | status table |
| **ORG-028** | New | **Writes to reconcile**: open first, then resolved; action, target, redacted summary, run and conversation, time, reason (`CONNECTOR_OUTCOME_UNKNOWN` or `DISPATCH_INTERRUPTED`) with the real explanations; "Verified applied…" / "Verified not applied…" → confirmation with optional 500-character note and the checkbox "I checked the external system myself"; irreversible; no retry; after Not applied the agent may ask again under normal policy and approval; open-count badge | `action-reconciliations.ts`, ADR 0036, 0039 |
| **ORG-029** | New | Run detail for admins: steps, actions log, approvals, artifacts, events | `AgentRunDetail` |
| **ORG-030** | New | Artifact retrieval: retention class, lifecycle, hash check, 60-second permission, `artifact.integrity_failed` state, size and count limits | ADR 0033, 0037 |
| **ORG-031** | New | Model quality: scores per model, grader, role version and task over time, regressions first; data is operator-imported, not live | ADR 0026 |
| **ORG-032** | New | Alert webhooks: up to ten, HTTPS public host rules, masked `displayUrl`, enable/disable (never delete), pinned public signing key, `webhook.test`, delivery state | ADR 0024 |
| **ORG-033** | New | Lifecycle and provisioning audit trail | `app.html` |
| **ORG-034** | New | Employee agent requests: review answers, approve or reject with reason | provisioning routes |
| **ORG-035** | New | Source-control connections (GitHub, Bitbucket): git host, credential mode, secret reference, allowed repositories, disable | ADR 0031 |
| **ORG-039** | New | Credential leases: list and revoke the 5-minute single-use repository leases; states and refusal reasons | `credential-routes.ts`, ADR 0031 |
| **ORG-036** | New | Installation edit and retire (API-only today) | `agent-catalog.md` |
| **ORG-037** | New | Account linking: private invitation preview and confirmation | auth routes |
| **ORG-038** | New | Evaluation and governance status for the installed role version | ADR 0019 |

### 6.3 Platform Owner (PLT) — 28 existing, 11 proposed new

| ID | Action | Change | Source |
| --- | --- | --- | --- |
| PLT-001 | Relabel | Separately authenticated platform login is a planned phase | `diy-organization-platform.md` |
| PLT-002 | Modify | Fleet overview: tenants, queue depth, leases expired, reconciliations open, budget alerts, readiness GREEN/AMBER/RED | ADR 0038, 0039 |
| PLT-003 | Modify | Tenant directory (platform path, no tenant content) | ADR 0018 |
| PLT-004 | Modify | Tenant profile: domains, administrators; organization `status` is `active`, `suspended` or `disabled` in the schema (operators change it directly in the database today; a suspended organization's domain stops resolving on every instance within the cache window, ADR 0027); suspension controls in the UI Planned | `schema.md`, ADR 0027 |
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
| PLT-016 | Modify | Incidents from the 25 rendered alert rules (severity warning/critical/info), each linked to its runbook section; real names such as `lease-expired`, `reconciliation-required`, `secret-store-unavailable`, `artifact-integrity`, `checkpoint-corrupt` | `operations/operations.json`, ADR 0039 |
| PLT-017 | Relabel | Support cases Planned | — |
| PLT-018 | Relabel | Support access Planned; docs say platform access must never be inferred from admin status | `diy-organization-platform.md` |
| PLT-019 | Modify | Platform policy defaults (`foundation-v2`) read-mostly | `policy-and-approvals.md` |
| PLT-020 | Relabel | Staff and roles Planned (platform-admin authentication) | same |
| PLT-021 | Modify | Operator settings limited to real options | — |
| PLT-022 | Relabel | Tenant suspension is a real database state today with no UI (Phase 3 plans controls); termination and quarantine are not in what I read: Planned | same, ADR 0027 |
| PLT-023 | Rewrite | Deployment topology: `af-control` (Caddy, API, agent runtime, collector, Prometheus, Grafana), `af-data` (PostgreSQL 16, Vault, pilot CA), `af-exec` (execution runtime, Docker sandboxes); network paths between them; per-scope `pilot:validate`; no multi-region model | `af-pilot-infra`, `terraform/main.tf` |
| PLT-024 | Rewrite | Deployment flags: `AGENT_MANIFEST_V2_ISSUANCE_ENABLED`, `GENERIC_AGENT_RUNTIME_ENABLED`, `QA_GENERIC_RUNTIME_ENABLED`, `ALERT_WEBHOOKS_ENABLED`; today these are configuration, not a UI | `README.md` |
| PLT-025 | Modify | Connector registry: Jira, GitHub real; others Planned | `actions.ts` |
| PLT-026 | Modify | Model providers: Anthropic live; scripted provider experimental; others Planned | status table |
| PLT-027 | Relabel | Compliance and legal hold Planned | — |
| PLT-028 | Relabel | Status page Planned | — |
| **PLT-029** | New | Runtime workload identities: public key (SPKI), role (agent or execution), organizations (or `*`), runtime profiles; clock-skew and nonce rules; today a file, not a UI | ADR 0011, `agent-runtime.md` |
| **PLT-030** | New | Signing keys and trust: manifest key id (SHA-256 of SPKI), pinned verification keys on runtimes, grant key; rotation is an open gap | `manifest-signing.ts`, `architecture-gaps.md` |
| **PLT-031** | New | Pilot readiness: 11 capabilities GREEN/AMBER/RED, six live proofs, 12 limitations (10 accepted, 2 informational) with the required before-pilot action; code readiness and operational readiness shown separately | ADR 0038, `assessment.json` |
| **PLT-032** | New | Validation and smoke reports: per-host `pilot:validate` checks and scrubbed JSON report; guarded `pilot:smoke` that needs opt-in, disposable targets and a separate approving administrator | ADR 0039 |
| **PLT-033** | New | Observability: rendered dashboards and alerts, `/metrics` token-protected, one trace per run across three processes; telemetry names are a closed list | ADR 0035 |
| **PLT-034** | New | Failure drills: the five named outcomes (safe retry, recovery, idempotent reuse, fail closed, manual reconciliation) and which drill proves each | ADR 0036 |
| **PLT-035** | New | Runtime fleet: agent and execution runtimes, 30 s heartbeats, lease state, recoveries per run, abandoned runs | ADR 0032 |
| **PLT-036** | New | Model-quality import (`db:import-quality`) and history | ADR 0026 |
| **PLT-037** | New | Customer recovery tooling (`recover-member`) with confirmation | `customer-onboarding.md` |
| **PLT-038** | New (Planned) | Edition and entitlement mapping | website pricing |
| **PLT-039** | New | Runbook procedures as guided screens: validate a deployment, start/stop runtimes, rotate credentials, cancel a run, recover a stuck run, collect incident evidence, roll back the pilot | `pilot-runbook.md` |

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

**Totals if approved:** 99 existing screens modified, rewritten or relabelled; **39 new** (EMP 8, ORG 12, PLT 11, STD 8) → 138 screens. Counts of "Planned" screens are shown by badge, not hidden.

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
| ORG-030, EMP-009 | `POST /api/execution/v1/artifacts/:id/retrievals`, `GET /api/execution/v1/artifact-content/:token` |
| ORG-018 | `GET/PUT /api/organization/model-credentials[/:provider]`, `POST …/:provider/disable` |
| ORG-035, ORG-039 | `…/source-control-connections`, `…/credential-leases`, `POST …/credential-leases/:id/revoke` |
| ORG-032 | `GET/POST /api/organization/alert-webhooks`, `PUT …/:webhookId`, `POST …/:webhookId/test` |
| EMP-019 | `POST /api/execution/v1/runs` (202; flag `GENERIC_AGENT_RUNTIME_ENABLED`) |
| STD-002, 004 | `GET /api/catalog/v1/blueprints`, `…/versions/:version` |
| STD-018, ORG-031 | `GET /api/catalog/v1/quality` |

## 8. Sequencing (each a reviewable PR)

0. **Decisions:** you confirm §3 tensions; an ADR for employee approval (D2/D3) is drafted for the platform repo. No screen work depends on it being accepted, but the badge stays "Proposed rule" until then.
1. **Shared:** status badge, source references, reason-code explainer, correlation breadcrumb, real scenarios, approver-class chip.
2. **EMP core:** EMP-004, 005, 012, 016, 020, 022 plus EMP-025, 027, 032 (the approval, run and recovery model).
3. **ORG core:** ORG-019, 020, 028, 029, 024, 017, 018, 022, 035, 039 plus the install-and-create flow ORG-008–013 and ORG-034, 036.
4. **ORG structure and identity:** ORG-001–007, 014–016, 003 domains, 037.
5. **PLT operations:** PLT-002, 005, 007, 029–037, 039, then relabels.
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

1. Confirm the five tensions in §3 (including whether D2 also covers agent provisioning requests).
2. D2 changes a security invariant enforced in two places (route role check and the self-approval check). Who owns the decision and the ADR in the platform repository, and should the approver class be a new policy field or derived from risk only?
3. *(Resolved by reading the code: `requested_by` is the run's employee, so the current check blocks the employee. No question remains here.)*
4. **Studio audience:** are blueprints authored only by Agents Foundry staff (the catalog is global and shipped in code today), or can customers author organization-specific blueprints (the website mentions external role packages as planned)?
5. **Platform authentication:** should the operator console use a separate identity system from tenant sign-in (the docs say separately authenticated)?
6. **Data region:** the platform code I read has no per-tenant region. Do you want it designed as a future setting, or removed?
7. **Earlier Sprint 03 decisions** (EMP-DEC-01–10, PLT-DEC, DEC-01–08): I have not re-traced them against the platform. D7 retires two of them as roadmap; should the rest be revalidated screen by screen?
8. **Commerce:** the website lists indicative plans only. Should billing screens model those editions, or stay generic?
9. **Which "55-role" roles** matter for screens beyond the five engineering roles (the website separates current from expansion roles)?
10. **Legal hold:** `LEGAL_HOLD` exists as a retention class. I did not find how a hold is placed or lifted. Who places it, and should the screens design that?
11. **Admin panels in Google mode:** admin routes are password-mode only. Should the prototypes design a Google-mode admin experience, or keep showing it as unavailable?
12. **Design language:** the shipped apps have their own look (hexagon mark, "Human ambition. Agent execution."). Should the prototypes adopt the shipped styles or continue with the Direction C proposal?

**Read for this revision (and used for claims):** the platform README, `architecture-v2.md`, `architecture-v2-gap-analysis.md`, `security.md`, `roadmap.md`, `agent-catalog.md`, `agent-manifest-v2.md`, `agent-runtime.md`, `execution-runtime.md`, `action-gateway.md`, `failure-handling.md`, `diy-organization-platform.md`; ADRs 0005, 0011 (head), 0013, 0021–0024, 0026, 0031 (head), 0032, 0033, 0034, 0036 (head), 0037 (head), 0038 (head), 0039; contracts `actions.ts`, `execution.ts`, `run-lifecycle.ts`; the approval route and `decideApproval`, the Action Gateway approval insert, the admin and employee `app.html`, `action-reconciliations.ts`, `web-auth` `session.ts` and `auth-panel.html`, the five blueprint questionnaires; from the docs repo the implementation status, policies and approvals, employee workspace, architecture gaps, model spending, customer onboarding, setup, authorization and QA use case pages, and the execution, governance and models API references; the website README, catalog and policy contract; `pilot-readiness/assessment.json`, `operations/operations.json`, the runbook and observability headings, the Terraform resource list and the head of each host script; the smoke target README and package.

**Also read in the second pass (headings and decisions, not every line):** ADRs 0001–0004, 0006–0010, 0012, 0014–0020, 0025, 0027–0030, 0035; the route tables of `api/authentication.md`, `organization.md`, `agents-and-conversations.md`, `catalog.md`, `runtime.md`; the organization, membership and employee tables in `data-model/schema.md`; the admin components `model-spending.ts`, `action-governance.ts`, `agent-installations.ts`, `agent-admin.ts`, and the first 260 lines of the employee `app.ts`.

**Still not read (so not used for claims):** the remainder of those ADRs beyond their decision sections; `api/request-schemas.md`, `contracts.md`, `runtime-protocol.md` in full; the rest of `schema.md` (run, approval, artifact, audit tables); the agent-runtime, execution-runtime and control-plane source beyond the approval, gateway and session lines cited; the other admin components (`people-admin`, `structure-admin`, `job-admin`, `tenant-admin`, `alert-webhooks`, `model-quality`, `setup-progress`) and the rest of the employee `app.ts` and `app.html` styling; the full Terraform and shell scripts; website pages other than the README, catalog and pricing source; and all tests. A screen that depends on one of these is marked "to confirm" and I will read it before drawing that screen.
