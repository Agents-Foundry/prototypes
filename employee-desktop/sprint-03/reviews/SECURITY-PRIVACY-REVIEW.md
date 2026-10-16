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

## Product-owner direction: offline access — Option A (approved for design)

**Decision (2026-10-16):** Read-only offline access to previously authorized cached Jira stories, conversations and evidence, using encrypted local storage. No privileged actions may be executed, queued, retried or silently replayed while offline. This is **product-owner design direction**, not a claim of implemented controls or independent security approval.

- **Entry:** Show conspicuous offline/degraded status, cached-data timestamp, tenant and device context, and a clear distinction between locally cached material and fresh authoritative data. Never suggest live Jira/connector availability.
- **Authorization:** Permit only content previously synchronized under a valid tenant/user/device entitlement; bind cache to tenant, account and managed device. A missing, expired or unprovable local entitlement must deny access rather than fall back to another account. **Product-owner-selected maximum offline authorization lifetime: 24 hours** from the last successful online entitlement verification; use the earlier expiry of the underlying entitlement and this 24-hour limit. On expiry deny cached access until online reauthentication. Use monotonic elapsed-time safeguards and fail closed on untrustworthy clock/time state. Offline revocation cannot be detected instantly; the exposure window is bounded but remains a residual risk requiring independent review.
- **Encryption and secrets:** Encrypt cache at rest using OS-backed key protection where supported, require device/session unlock, avoid persisting provider keys in evidence, and redact sensitive screenshots/logs. Device loss, account switch, logout and key revocation need explicit local invalidation/remote-wipe limitations.
- **Read-only means read-only:** No Jira writes, test attachments, defect filing, browser automation, approvals, external tool calls, connector mutations, or deferred privileged command queue. Drafting/editing offline is out of scope for Option A; do not disguise queued actions as reads.
- **Reconnect:** Reauthenticate, re-evaluate current tenant membership and policy, invalidate stale/revoked cached content, reconcile provenance/version timestamps, and require fresh authorization for any new privileged action. Unknown external outcomes must never be replayed automatically.
- **Privacy:** Enforce minimization, TTL, local storage quotas, tenant retention/deletion policy, safe sign-out, and visible disclosure of what is available offline. Document the limits of remote revocation until the device reconnects.
- **Design acceptance scenarios:** normal cached read; never-cached story denied; cache TTL expiry; device lock; account/tenant switch; revoked user while offline (bounded residual exposure); lost device; reconnect after policy change; attempt to submit Jira defect offline denied; no-network browser action denied; corrupt/unreadable encrypted cache denied; screenshot containing secrets redacted.
- **Open parameters for independent review:** independent validation of the selected 24-hour upper bound (organizations may set a stricter limit), which content classes may be cached, managed-device requirements, key lifecycle, revocation exposure window, and evidence retention/deletion guarantees.

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
- Option A permits only read-only cached access; independent reviewers must assess the selected 24-hour maximum, stricter organization limits and cache classification.
- What is the cross-device conflict and remote-wipe UX policy?
- Who owns connector allowlisting, key revocation, incident response and data-subject deletion?
- What is the acceptable residual-risk threshold before final design freeze?

## Gate policy

This document is **review preparation**, not a completed penetration test, privacy assessment, authorization proof or independent sign-off. Security/privacy, manual accessibility, visual QA and final design freeze remain **PENDING/BLOCKED**. No production application code or real network actions are authorized by this document.
