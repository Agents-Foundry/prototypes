# PR #21 — Critical interaction state coverage

**Design assets:** 18 state IDs × 960/1440 desktop widths × light/dark = **72 SVGs**. Each is a static simulated review frame. All tenant names, tickets and operations are fictitious review data; no live side effects.

| ID | Surface | State | Required guarded user behavior |
|---|---|---|---|
| QA-01 | EMP-007 | Jira intake | Verify authorized story and source freshness before creating drafts |
| QA-02 | EMP-007 | Test-case review | Draft only, preserve exact diff and targets |
| QA-03 | EMP-005 | Jira write approval | Scope action, expiry and target; no implicit approval |
| QA-04 | EMP-007 | Source conflict | Block publish, request refresh |
| QA-05 | EMP-008 | Browser execution | Isolated dev profile, observable run and evidence |
| QA-06 | EMP-008 | Browser timeout | Unknown status, not a passed result |
| QA-07 | EMP-009 | Evidence review | Require sanitization and sharing permission |
| QA-08 | EMP-007 | Defect publication review | Confirm actual Jira result before success |
| SEC-01 | EMP-005 | Denied | No remote side effects; request access separately |
| SEC-02 | EMP-012 | Approval expired | Pause, revalidate and reauthorize |
| SEC-03 | EMP-006 | Credential revoked | Halt dependent operations, no fallback key |
| SEC-04 | EMP-014 | Production safeguard | Read-only default, block writes absent elevated permission |
| RUN-01 | EMP-004 | Plan review | Identify steps, targets and permissions |
| RUN-02 | EMP-004 | Paused | Display blocked operation and decision state |
| RUN-03 | EMP-004 | Cancellation | Safely reconcile in-flight step, no false stop-success |
| REC-01 | EMP-016 | Offline checkpoint | Allow only policy-permitted local drafting |
| REC-02 | EMP-016 | Unknown remote outcome | Reconcile stable operation ID, no blind retry |
| REC-03 | EMP-016 | Reauthorization | Validate identity, tenant policy and approval anew |

Assets under `critical-states/<ID>-<960|1440>-<light|dark>.svg`.

## Boundaries and gaps
Static SVG controls are visual placeholders, **not working buttons**. Interactive local-only review scenario: `prototypes/qa-critical-flow.html`. Expanded state coverage does not mean all EMP screens now have each failure/empty/loading variant. Further state-by-state validation, WCAG evaluation and independent reviewer sign-off remain pending.
