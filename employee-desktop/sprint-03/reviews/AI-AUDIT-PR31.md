# PR #31 — AI-assisted prototype source audit and remediation

**Audit type:** source-level AI-assisted design/prototype review, **not** independent security assurance, screen-reader testing, real zoom testing or a live penetration test. Baseline: PR #30 merge `7babc86e2df2b7bfd5031f9d70b823f283c48f67`. Scope: `prototypes/qa-critical-flow.html`, browser evidence test, SEC-01–14 and A11Y-01–10 protocol.

## Confirmed prototype findings

| ID | Trace | Source observation | Impact on design evidence | Remediation | Status |
|---|---|---|---|---|---|
| AI31-01 | SEC-05 | `approved` was set true on an exact-action approval and retained when `next()` advanced to another stage; authorization label could imply stale approval still applied | Misleading approval scope/provenance in prototype | Invalidate approval on each stage transition | FIX COMMITTED; CI RETEST PENDING |
| AI31-02 | SEC-06, SEC-10, SEC-13 | In `unknown`/`reconcile`, “Verify external outcome” immediately changed state to `verified`, with no simulated receipt boundary | Misleading certainty about externally confirmed results | Explicit “Simulate confirmed remote receipt” vs “Outcome still unknown — do not retry” branches, with simulated-only status | FIX COMMITTED; CI RETEST PENDING |
| AI31-03 | SEC-05, SEC-07, SEC-12 | Reconnect action transitioned to reconcile without explicitly invalidating authorization or explaining fresh authorization | Recovery design obscured stale entitlement risk | Clear approval on reconnect; announce reauthorization and reconciliation | FIX COMMITTED; CI RETEST PENDING |

**Severity:** not assigned. These are reproducible source observations in a mock prototype, not production exploits. Human reviewer must assign severity and verify remediation.

## Protocol coverage disposition

- **SEC-01–14:** targeted source observations above for SEC-05/06/07/10/12/13. All remaining SEC cases **NOT TESTED**; source audit cannot prove tenant isolation, key management, connector policy or cache encryption.
- **A11Y-01–10:** existing 48-case automated axe/viewport proxy baseline passed at prior SHA; changed prototype requires CI rerun. Actual keyboard/AT, contrast measurement, OS forced-colors and 200%/400% browser zoom **NOT TESTED** in this PR.
- **Visual QA:** prior screenshots are available, but independent light/dark screenshot comparison and 32+72 asset acceptance **NOT TESTED**.
- **Offline 24-hour entitlement:** remains product-owner-approved design direction, **not implemented** in this static prototype; no claim of TTL validation.
- **Independent reviewer:** none available; product owner is sole contributor. AI assistance is not independent specialist sign-off.

## Retest contract

Run `Sprint 03 review evidence` on this PR and inspect 48 scenario reports, axe findings, screenshots and coverage index. Verify `unknown`, `offline`, `reconnected` states in both themes and all widths; manually confirm no misleading “verified” or stale approval claims. Capture run URL, head SHA, count, and any failures before changing status to VERIFIED. Do not sign independent gates or freeze design.
