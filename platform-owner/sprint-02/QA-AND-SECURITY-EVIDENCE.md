# Sprint 02 — Critical-state and independent review package

**Baseline disposition:** DRAFT — NOT SIGNED / NOT FROZEN. Product-owner policies PLT-DEC-01–10 are approved, not security-verified.

## New design state inventory
12 high-risk scenarios with light/dark SVGs (24 state frames) under `states/`: provisioning validation, pending approval, failed provisioning, denied support, emergency break-glass review, suspension, deletion legal hold, failed rollout/pause, effective-policy conflict, step-up MFA, redacted telemetry and payment restriction.

These are **proposed visuals**, not proof of implemented policy enforcement. The 44 earlier desktop mockups remain the primary screen inventory.

## Automated verification
GitHub Actions workflow `design-sprint-02-qa.yml` checks responsive Chromium rendering at 375/768/1024/1440/1920 for dashboard and organizations, navigation, simulated tenant provisioning and targeted axe WCAG-tagged rules. **CI execution evidence must be linked after the run.** A green job validates only the automated assertions, not the signed design baseline.

## Manual visual and accessibility gate
- [ ] Inspect screenshots for clipping, legibility, hierarchy and theme parity against SVG frames.
- [ ] Capture ALL critical states across 375/768/1024/1440 and actual 200% browser zoom.
- [ ] Complete keyboard-only navigation including tab order, focus restoration, validation and modals.
- [ ] NVDA or VoiceOver validation of error/approval state announcements and form names.
- [ ] Measure WCAG AA contrast; verify non-color-only statuses, motion and reflow.
- [ ] Record reviewer identity, reviewed SHA, evidence link, defects and approval decision.

## Security/governance threat review
| Policy | Mandatory reviewer scenario | Decision |
|---|---|---|
| DEC-01/05 | Cross-tenant denial, customer consent, break-glass separation/revoke/expiry and logging | Pending |
| DEC-02 | Duplicate provisioning, partial deployment/rollback, reviewer self-approval | Pending |
| DEC-03 | Backup/runtime/telemetry regional transfer and migration constraints | Pending |
| DEC-04 | Quota races, billing reconciliations, safe downgrade and overrides | Pending |
| DEC-06 | Suspension while writes execute; legal hold and irreversible deletion authorization | Pending |
| DEC-07 | Signed-manifest tampering, staged rollback, tenant adoption permissions | Pending |
| DEC-08 | Effective policy inheritance, conflict fail-closed, mandatory template boundaries | Pending |
| DEC-09 | MFA/session hijack/recovery, step-up and separation of duties | Pending |
| DEC-10 | Prompt leakage through trace/search/export; redaction and retention | Pending |

**No independent security review or design-owner signature is claimed.** All pending results must be recorded explicitly before design freeze.
