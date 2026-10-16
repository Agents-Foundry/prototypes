# PR #32 — critical interaction-state simulation coverage

**Status:** design-only prototype branches and regression assertions committed; GitHub Actions CI validation pending. No production authorization, encrypted cache, tenant isolation or connector enforcement is implemented.

| Scenario | Prototype trigger | Safe design outcome | Verification |
|---|---|---|---|
| SEC-05 target drift | Request write permission → Simulate changed Jira target | Approval invalidated; fresh approval required | `critical-states.spec.cjs` |
| SEC-05 policy drift | Request write permission → Simulate policy change | Old approval unusable | `critical-states.spec.cjs` |
| SEC-12 checkpoint conflict | Request write permission → Simulate cross-device conflict | Read-only conflict review, no replay | `critical-states.spec.cjs` |
| SEC-07 offline expiry | Browser testing → Go offline → Simulate offline authorization expiry | Cached access denied, fresh online authorization required | `critical-states.spec.cjs` |
| SEC-11 corrupt cache | Browser testing → Go offline → Simulate unreadable encrypted cache | Access denied, no write | `critical-states.spec.cjs` |
| SEC-10 cancellation | Browser testing → Request cancellation | Pending/unknown vs confirmed pre-dispatch cancellation differentiated | `critical-states.spec.cjs` |
| SEC-09 environment switch | Browser testing → Simulate environment switch | Previous authorization invalidated | `critical-states.spec.cjs` |
| SEC-03 evidence minimization | Review evidence → Inspect redacted evidence | Redaction message, simulated only | `critical-states.spec.cjs` |
| SEC-08 connector registry | Review evidence → Simulate unapproved connector | Denied, no external tool action | `critical-states.spec.cjs` |

**Limitations:** a button selecting a branch is not proof of the underlying security property. Offline 24-hour maximum is represented by an explicit *expiry scenario*, not a running clock or cryptographic entitlement verification. Redaction is explanatory copy, not a redaction engine. Reviewer must record unsupported design paths as NOT TESTED, not PASS.

**Retest:** run full `npm test`, design asset integrity, and 48-case review evidence CI on the PR head. Check light/dark at 480/960/1440 widths and verify screen-reader/real browser zoom separately. Independent gates and final design freeze remain blocked.
