# DRAFT ADR: Approver class for governed actions (employee-approvable LOW and MEDIUM)

**Status: Draft for the product owner to author in `Agents-Foundry/employee-agent-platform` (`docs/adr/0040-…`).** This text is a proposal prepared from the prototypes repository. Nothing here has been reviewed, accepted or implemented. Facts about today's behavior were verified in the platform source at commit `46bfce6bb1` (2026-10-07).

- Proposed date: _(to be set by the author)_
- Supersedes in part: ADR 0005 and ADR 0012 (approval decision), `agent-runtime.md` ("no self-approval"), `docs/security.md` (foundation invariants)

## Context

Today only an organization administrator who is not the requester can decide an approval:

- `POST /api/approvals/:id/decision` returns `403 ADMIN_ROLE_REQUIRED` unless `actor.role === 'ADMIN'` (`apps/control-plane-api/src/app.ts:405-409`).
- `decideApproval` throws `SELF_APPROVAL_FORBIDDEN` when `approval.requestedBy === actorId` (`database.ts:1979`). The Action Gateway records `requested_by` as the run's **employee** (`actions/action-gateway.ts:186`), so an employee can never decide an approval for their own agent's action.
- The policy engine (`packages/policy-engine/src/index.ts`) has no approver concept: `ActionPolicyContext` carries the agent's `employeeId` only, and conditions are `APPROVAL_TTL_SECONDS` and `BIND_TO_INPUT_DIGEST`.
- Public copy says approvals "pause work for a separate human decision", and `docs/agent-runtime.md` says "Approvals are requested for the employee, who cannot approve their own."

Product decision (D2, D3, D9, D23, D26): an employee should be able to approve LOW and MEDIUM governed actions requested by their own agent; HIGH needs an administrator; an organization may only tighten.

## Decision

1. **Approver class.** Add an `approverClass` of `EMPLOYEE` or `ADMIN` to the policy decision, as a new condition `APPROVER_CLASS` beside `APPROVAL_TTL_SECONDS` and `BIND_TO_INPUT_DIGEST`.
2. **Platform default by risk.** `LOW` and `MEDIUM` default to `EMPLOYEE`; `HIGH` and `CRITICAL` default to `ADMIN` (CRITICAL remains `DENY` for `production.deploy`). Unknown actions stay `DENY`.
3. **Tighten-only override.** An organization override (`organization_action_policies`) may raise an action from `EMPLOYEE` to `ADMIN`, never lower it. The signed manifest cannot lower it either. When sources disagree **the stricter approver wins**.
4. **Decision route.** `POST /api/approvals/:id/decision` accepts an `ADMIN`, or the approval's own employee when the approval's class is `EMPLOYEE`. The self-approval check is replaced by a class check: the **agent** can never approve (already true), an employee cannot decide an `ADMIN`-class approval, and an employee can decide only approvals for runs they own.
5. **Unchanged guarantees.** Approvals stay payload-bound (`inputDigest`), single use, expiring by risk (LOW/MEDIUM 24 h, HIGH 8 h, CRITICAL 1 h), re-checked at execution, and audited with the deciding actor and class.
6. **Agent provisioning requests stay admin-approved** (`database.ts:1466` is unchanged).
7. **Threads (D20, D21).** A thread may hold more than one active run. Runs that need the thread's workspace queue for it; the run shows a "waiting for workspace" reason until the workspace is free. This replaces the one-active-run rule (`THREAD_HAS_ACTIVE_RUN`) and builds on `WORKSPACE_BUSY`. _(A sibling ADR may be cleaner: confirm with the author.)_

## Consequences

- **Independent review is lost for MEDIUM actions.** The person who asked the agent to act also approves it (Playwright runs, Jira issue creation). Payload binding, expiry, single use and the audit trail remain. This is accepted deliberately (D26). Organizations that want independent review move those actions to `ADMIN`.
- **Admin visibility** is recommended but not required by this draft: admins see employee-approved actions in the audit log; a read-only feed is a possible later addition.
- **Documentation and copy must change together:** `docs/security.md`, `docs/agent-runtime.md`, `docs/action-gateway.md`, `docs/adr/0005`, `0012`, the docs site, the website security and product pages and `tests/policy-contract.json`.
- **Code and tests:** policy engine (condition and context), approval route and `decideApproval`, `agent_action_requests`/`approvals` (class recorded), admin console approvals panel, employee workspace approval card, web and API tests (for example `rejects approval decisions from non-admin actors` in `app.spec.ts` and the self-approval tests in `provisioning.spec.ts` must be reviewed), and the pilot-readiness assessment ("policy and approval controls").
- **Telemetry:** add an approver-class label to `af_approvals_total` if the metric catalog allows it (labels are a closed list in ADR 0035).
- **Risk:** a compromised employee session can approve its own MEDIUM actions. Mitigations available without new guards: tighten the action in the organization override, shorter TTL for MEDIUM, the existing reconciliation block for unknown writes.

## Open items for the author

1. Whether thread concurrency (D20/D21) belongs in this ADR or a sibling.
2. Whether a read-only admin feed of employee-approved actions is in scope now.
3. The exact wording of the user-facing approval card ("You are approving an action your agent requested").
4. How existing in-flight approvals are treated at rollout (recommended: all existing approvals stay `ADMIN`-class).
