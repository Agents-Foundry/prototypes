# Sprint 03 — Interaction and guarded-flow specifications

**Design contract only. No production behavior is implemented.**

## Conversation to agent run (EMP-002,003,004)
Employee selects the tenant and assigned agent. Agent displays intent, consulted context (with provenance), plan, target environment, tools and run state. Local thinking/drafting can proceed only under scoped policy. Status transitions: proposed → validated → queued → executing → paused/approval-required → completed, failed or stopped. Never display an unconfirmed remote effect as complete.

## Permission decision (EMP-005,012)
Display employee, tenant, agent, requested tool/operation, target resource and environment, exact parameter digest, duration, risk, potential data impact, and policy authority. Approval once/denial/expiry/cancellation are distinct. Changed scope, reconnected identity or resumed stale request invalidates approval and forces reevaluation. AI cannot self-approve.

## Credential and connector management (EMP-006,011,015)
Show provider name, actor scope, tenant owner, connection status, scopes, renewal and revocation. Never render token values. OAuth/PKCE through an approved broker and OS keychain or enterprise vault as appropriate. Installation and access must satisfy platform + tenant + employee + agent + resource intersection. Permission expansion requires renewed consent and review.

## Jira QA flow (EMP-007)
Select authorized project and story → read freshness/acceptance criteria → draft test cases / defects → display exact diff and target issue → request external-write authorization → submit once → reconcile confirmed Jira result → attach sanitized artifacts. Distinguish 409 conflicts, revoked rights, timeout/unknown result and confirmed success. Never auto-create duplicate bug after uncertain timeout.

## Browser environment testing (EMP-008,014)
Explicit tenant, approved environment, target origins, credential profile, browser isolation, test run plan and authorization. Production read-only by default; destructive actions blocked without suitable policy and approval. Show step evidence, redacted traces and stop controls; mark interrupted or uncertain run rather than misleading pass.

## Artifact integrity (EMP-009)
Show run ID, environment, content hash, immutable original, sanitized derivative, scan state, retention, residency and permitted sharing. A pending upload/scan is not a publishable artifact. Scope downloads and Jira attachments to approved destinations.

## Repository workflow (EMP-010)
Show repo, branch, read-only state, workspace scope, source freshness. Any writes require scoped review of diff, destination and authorization, and must not inherit arbitrary local filesystem/shell permissions.

## Offline recovery (EMP-013,016)
Explicit offline/local-only indicator; checkpointed local drafts may continue within policy but new privileged remote operations fail closed. On reconnect, reconcile external outcomes using stable operation IDs, revalidate identity/consent/policy, request new approvals if needed, then resume only verified safe steps. Unknown effects are neither success nor replayable failure.

## Screen semantics
Each screen requires accessible headings, keyboard focus, live status announcement for state transitions, visible errors, loading/empty/denied states, 200% reflow, theme contrast and alternate text where necessary. **Not manually verified.**
