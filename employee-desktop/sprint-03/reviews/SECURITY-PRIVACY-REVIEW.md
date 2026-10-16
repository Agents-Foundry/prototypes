# Sprint 03 — independent security and privacy design review package

**Status:** READY FOR INDEPENDENT REVIEW — NOT APPROVED. **Scope:** design-only employee desktop QA critical-flow prototype, simulated actions; no production runtime or enforcement claims. **Baseline:** pin exact reviewed commit SHA and attach evidence before any sign-off.

## Trust boundaries and assets

Assets: tenant-scoped conversations, Jira stories/test cases/defects, browser evidence and screenshots, repository context, credentials/API tokens, model prompts, approval grants, run checkpoints and audit records.

Boundaries to challenge: employee desktop ↔ SaaS control plane; organization ↔ employee BYOK; tenant A ↔ tenant B; agent ↔ model provider; agent ↔ approved MCP/connector; agent ↔ browser environment (dev/playground/prod); local offline cache ↔ central synchronization; human approver ↔ privileged action. The current HTML prototype is a *simulation*, not evidence that these boundaries are enforced.

## Threat scenarios and required design evidence

| ID | Threat / misuse scenario | Required fail-closed design behavior | Reviewer evidence / acceptance question |
|---|---|---|---|
| SEC-01 | Cross-tenant conversation, artifact, Jira or repository leakage via search, sync, cache or connector | Explicit tenant binding at every lookup, action and artifact; no cross-tenant fallback | Show denied cross-tenant read/write and account-switch transitions; who owns tenant binding? |
| SEC-02 | Prompt injection in Jira story, repository README, browser page or MCP result | Untrusted content cannot authorize tools, elevate scope or alter policy; clear source attribution | Trace hostile content through proposed decision points; distinguish content from instructions |
| SEC-03 | Credential/token exposure in chat, screenshot, logs, model prompt or synced file | Secrets masked/redacted; minimal scoped access; never store plaintext in artifacts | Inventory every secret-bearing surface, redaction exceptions, rotation and deletion |
| SEC-04 | Employee BYOK vs organization key confused-deputy billing/data boundary | Explicit provider/key ownership, tenant-scoped selection, revocation and no silent fallback | Show key-switch, expired key, offline and cross-device cases |
| SEC-05 | Expired/revoked approval or changed Jira target/environment | Reauthorize at execution time against exact action, actor, target, environment and payload | Show approval expiry and modified-target denial; no reuse of stale grants |
| SEC-06 | Duplicate Jira issue, test attachment or external write after retry/crash | Idempotency key and external outcome reconciliation before retry; unknown outcome never auto-replays | Demonstrate crash between remote success and local checkpoint |
| SEC-07 | Offline cached request replays a privileged action on reconnect | Read-only/degraded offline mode, visible pending state, fresh authorization and conflict review | Show reconnect on another device with changed policy/tenant |
| SEC-08 | Malicious or swapped MCP/connector tool, schema, host or capability | Approved registry, pinned identity/capability, fail-closed mismatch, no discovery-as-permission | Demonstrate unapproved tool and capability drift denial |
| SEC-09 | Browser session crosses dev/playground/prod or leaks cookies/screenshot PII | Environment-labelled isolated sessions, no credential reuse or implicit prod elevation | Show environment switch and evidence retention/redaction |
| SEC-10 | Cancellation races external side effect; audit trail falsely says cancelled | Distinguish requested cancellation, in-flight outcome and reconciled final state | Show cancellation after dispatch and before acknowledgement |
| SEC-11 | Shared workstation/device theft exposes cached conversation or evidence | Encrypted local storage, lock/revocation, minimum retention and safe logout design | Show logout, remote revoke, recovery and device replacement |
| SEC-12 | Cross-device concurrent edits overwrite approval, checkpoints or evidence | Versioned conflicts, provenance, bounded replay and explicit reconciliation | Show conflicting updates and deterministic conflict resolution |
| SEC-13 | Model output or tool response fabricates evidence / successful action | Label simulated vs verified results; retain source and execution provenance | Show unknown, denied and failed outcomes distinctly |
| SEC-14 | Overbroad retention/export or subject deletion misses replicas | Tenant retention rules, data classification, export/delete lifecycle and auditable propagation | Identify cache, backup, screenshot, model-provider and connector retention owners |

## EMP-DEC-01–10 traceability method

Reviewers must map **each** of EMP-DEC-01 through EMP-DEC-10 to its authoritative approved decision text, applicable SEC scenario IDs, design screen/state IDs, and concrete evidence. Do **not** infer a decision's contents from its number. Use this ledger:

| Decision | Authoritative decision link | SEC IDs | Screens / states | Evidence link | Reviewer disposition |
|---|---|---|---|---|---|
| EMP-DEC-01 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-02 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-03 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-04 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-05 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-06 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-07 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-08 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-09 | TBD | TBD | TBD | TBD | PENDING |
| EMP-DEC-10 | TBD | TBD | TBD | TBD | PENDING |

## Independent review execution

1. Pin reviewed commit SHA, artifact versions, date, named independent reviewer and scope; confirm prototype-only limitations.
2. Walk all fourteen SEC scenarios through normal, denial, expiry, offline, reconnect, cancel and unknown-outcome states; capture screen/state references and reproducible steps.
3. For every finding record ID, severity, impacted tenant/data/action, exploit preconditions, evidence URL, mitigation proposal, owner, due date, and retest proof. Severity must be reviewer-assigned, not automatically inferred.
4. Verify privacy inventory: classification, processing purpose, data recipients/model providers, key ownership, retention, deletion, export and data residency questions. Escalate unresolved legal/compliance obligations to qualified owners.
5. Explicitly record disposition per scenario: PASS / FAIL / NOT TESTED / NOT APPLICABLE with rationale; do not mark PASS merely because the prototype depicts a denial.
6. Independent reviewer signs only their own assessment against the pinned SHA; product owner separately decides risk acceptance. Any changed design requires targeted retest.

## Open questions for product owner / reviewers

- Who is authorized to approve high-impact production Jira/browser actions, and how is approver identity refreshed?
- What is the default evidence retention period, and which tenant data may leave the organization for model processing?
- Which offline operations, if any, are permitted beyond read-only viewing?
- What is the cross-device conflict and remote-wipe UX policy?
- Who owns connector allowlisting, key revocation, incident response and data-subject deletion?
- What is the acceptable residual-risk threshold before final design freeze?

## Gate policy

This document is **review preparation**, not a completed penetration test, privacy assessment, authorization proof or independent sign-off. Security/privacy, manual accessibility, visual QA and final design freeze remain **PENDING/BLOCKED**. No production application code or real network actions are authorized by this document.
