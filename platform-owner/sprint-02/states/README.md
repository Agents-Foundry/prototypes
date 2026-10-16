# Sprint 02 — Critical-state visual frames

This folder contains **12 sensitive workflow scenarios**, each in light and dark SVG form (24 frames total).

| Screen | State | UX rule |
|---|---|---|
| PLT-005 | validation-error | Block duplicate/invalid provisioning |
| PLT-006 | approval-pending | Request never means active |
| PLT-006 | provisioning-failed | Explicit retry/rollback without silent activation |
| PLT-018 | support-denied | Fail closed without tenant authorization |
| PLT-018 | break-glass-review | Independent authorization and expiry |
| PLT-022 | suspended | Stop new work; safe treatment of in-flight work |
| PLT-022 | deletion-legal-hold | Legal/retention hold blocks deletion |
| PLT-012 | rollout-paused | Pause/rollback only signed compatible version |
| PLT-019 | policy-conflict | Effective-policy conflict denies execution |
| PLT-001 | step-up-required | Sensitive action needs fresh MFA |
| PLT-010 | telemetry-redacted | No tenant-private content in operator metrics |
| PLT-009 | payment-restricted | No automatic data deletion on past due |

**Illustrative visual references, not complete interactive implementation or verified enforcement.** Manual a11y/visual/security review pending.
