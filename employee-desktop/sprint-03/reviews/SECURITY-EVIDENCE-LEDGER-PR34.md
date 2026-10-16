# PR #34 — security and privacy evidence ledger

**Baseline:** PR #33 merged as `8666be52dd255c4f51748bc9f22a498cc6df971a`. **Review status: SELF-AUDIT PREPARATION ONLY — NO INDEPENDENT APPROVAL.**

This ledger links the existing SEC-01–14 threat-review protocol to actual mock interactions and identifies untested enforcement. The HTML is local-only; it cannot prove server-side controls.

## Security scenario traceability

| Threat ID | Existing prototype / evidence | Enforcement / specialist disposition |
|---|---|---|
| SEC-01 | No dedicated interactive branch; threat-review protocol only | NOT TESTED — independent review pending |
| SEC-02 | No dedicated interactive branch; threat-review protocol only | NOT TESTED — independent review pending |
| SEC-03 | PR #32 redacted-evidence mock; no redaction engine | NOT TESTED — independent review pending |
| SEC-04 | No dedicated interactive branch; threat-review protocol only | NOT TESTED — independent review pending |
| SEC-05 | PRs #31/#32 approval reset, changed target, policy change, environment switch | NOT TESTED — independent review pending |
| SEC-06 | PR #31 unknown outcome and simulated receipt branch; no idempotency implementation | NOT TESTED — independent review pending |
| SEC-07 | PRs #31/#32 offline/reconnect, expiry and cache-corrupt branches; no actual encrypted cache | NOT TESTED — independent review pending |
| SEC-08 | PR #32 unapproved connector denial mock; no live registry enforcement | NOT TESTED — independent review pending |
| SEC-09 | PR #32 environment switch branch; no isolated browser sessions | NOT TESTED — independent review pending |
| SEC-10 | PR #32 cancellation requested/unknown/pre-dispatch confirmed mock | NOT TESTED — independent review pending |
| SEC-11 | PR #32 unreadable cache denial mock; no OS-backed key validation | NOT TESTED — independent review pending |
| SEC-12 | PR #32 cross-device conflict mock; no synchronization backend | NOT TESTED — independent review pending |
| SEC-13 | PR #31 simulated receipt/unknown outcome labeling; no provenance validation | NOT TESTED — independent review pending |
| SEC-14 | No dedicated interactive branch; threat-review protocol only | NOT TESTED — independent review pending |

## Approved design-direction traceability

EMP-DEC-01 through EMP-DEC-10 are product-owner-approved **design direction**, not independently validated or production-implemented controls. Do not infer decision content from its numeric identifier. Locate and link each authoritative approved decision record before assigning a specific SEC mapping.

| Decision | Authoritative approval record | Specific threat mapping | Validation |
|---|---|---|---|
| EMP-DEC-01 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-02 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-03 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-04 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-05 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-06 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-07 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-08 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-09 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |
| EMP-DEC-10 | Source link to be pinned by reviewer | PENDING source verification | NOT TESTED |

## Known explicit product-owner direction

- Offline **Option A**: previously authorized encrypted read-only cache of Jira stories, conversations and evidence; no privileged offline actions or queued writes.
- Offline authorization maximum **24 hours** since last verified entitlement or earlier underlying entitlement expiry; untrustworthy clocks fail closed. The prototype shows expiry as a selectable simulation, **not a running TTL**.
- Fresh authorization after reconnect, environment/target/policy drift; unknown external outcome reconciled before any replay; cancellation distinguishes request from confirmed result; conflicts do not silently overwrite.
- No independent security, privacy, accessibility or visual QA acceptance has been recorded. Solo product-owner review is self-review only.

## Unresolved evidence and risks

1. Tenant boundary and prompt injection: no live tenant-binding/policy evaluation or hostile-input execution evidence (SEC-01/02).
2. BYOK versus organization key provenance, key rotation and model-provider processing boundaries: no implementation evidence (SEC-04).
3. Cryptographic cache protections, device binding, remote revocation, logout and 24-hour time integrity: design direction only (SEC-07/11).
4. Idempotency, durable checkpoint replay, remote receipt authenticity, connector registry pinning, cross-device sync: prototype state labels only (SEC-06/08/12/13).
5. Data minimization, retention/export/deletion and replica/provider responsibilities: owner and concrete lifecycle proof still missing (SEC-03/14).
6. Independent assessor availability and exact reviewed SHA remain unassigned. Never convert automated tests or a merged PR into specialist sign-off.

## Evidence collection protocol

Pin the final PR SHA, exact GitHub Actions URLs, relevant browser screenshots, Playwright JSON reports, manual observation steps, tested environment and reviewer identity. Use **PASS/FAIL/NOT TESTED/NOT APPLICABLE** only with a written rationale. Report actual findings in `INDEPENDENT-FINDINGS-REMEDIATION.md` with a unique ID, severity, evidence, owner and retest SHA. Do not mark security requirements PASS based on a simulated button.

**Exit gate:** CI success and completed traceability prepare a handoff, but independent security/privacy, real screen-reader and zoom, independent visual QA and final design freeze remain PENDING/BLOCKED.
