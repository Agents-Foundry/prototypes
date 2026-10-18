# Sprint 03 — PR47 Validation Automation Gap Analysis and Review Execution Support

**Status: automation gap inventory, not a validation pass.** Baseline: PR46 merged as `da7fbee59333c753e45f08dc413488fee2ad1426`. Cross-reference PO41 automated regression notes, PO43 scenario worksheet, PO44 CI evidence, PO45 closure gates and PO46 reviewer handoff.

## Coverage-to-evidence matrix

| Risk / scenario | Existing automation evidence to inspect | Gap and required follow-up | Human gate |
| --- | --- | --- | --- |
| Approval-receipt heading focus | PR41 focus regression | Verify exact test name and current CI execution; cover repeated open/close and focus restoration if absent | Keyboard + actual screen reader |
| Stale policy / authorization | PR41 automated assertions | Add deny-path and authorization refresh negative tests only if absent; do not infer security proof from UI tests | Independent security |
| Offline cache and recovery | PR41 regression coverage | Verify reconciliation and no stale privileged action; test disconnected/reconnected state | Independent security/privacy |
| Cancellation and replay/idempotency | PR41 regressions | Confirm repeated cancellation, duplicate outcome and safe replay boundaries are asserted | Independent security |
| Cross-device conflicts | PR41 regression coverage | Verify conflict state and explicit resolution visibility | Independent security/UX |
| Dark / forced colors | PR41 automation, PR44 asset integrity | Screenshot and contrast checks where feasible; assets existing does not establish visual QA | Independent visual QA |
| Narrow viewport and 200/400% zoom | PR41 responsive assertions | Automated viewport coverage is **not** actual browser zoom; record exact zoom observations separately | Real browser zoom + accessibility |
| Error, loading and recovery copy | PO43 scenarios | Inspect automated assertion gaps; add stable regression cases if implementation supports them | Independent UX/visual |
| SVG/screen inventory | PR44 integrity job: 72 SVGs / 32 screen concepts on historical head | Re-run on candidate SHA and record actual outputs | Visual review |
| CI maintenance warnings | PO44 observations | Identify action/runtime/dependency owners before any safe upgrade | No fabricated blocking status |

## Review execution support
1. Reviewer receives exact candidate SHA, read-only prototype URL, test matrix and safe test accounts via approved secret channel.
2. Run CI on that exact SHA; record workflow URL, job conclusion, artifact URL and test counts. Historical counts do not prove the current candidate.
3. Use PO46 evidence form for each scenario. Keep NOT RUN until reviewer actually executes it.
4. Attach redacted screenshots/video and reproducible steps. Open defects for failures, linking SHA, environment, severity, owner and retest.
5. Escalate unverified security/privacy, assistive technology, browser zoom and visual QA gates. Never mark them passed from automation.
6. Request explicit product-owner disposition and separate freeze authorization only after independent evidence is complete.

## Proposed automation implementation order (subsequent PRs, subject to repository inspection)
- **P0:** inventory current test paths, runner commands and scenario IDs; ensure CI executes intended suites.
- **P1:** fill a demonstrable negative-path gap for focus recovery or privileged action denial in prototype test fixtures.
- **P2:** improve accessible error/recovery and responsive test assertions where genuinely missing.
- **P3:** add deterministic evidence reporting with tested SHA and environment metadata, without claiming manual testing.

## PR47 acceptance criteria
- Traceable risk-to-test-to-human-gate matrix is committed.
- No test result is invented and no independent approval is inferred.
- Follow-on automation tasks are specific enough to implement after inspecting current test files.
- Production application code, PO acceptance and final design freeze remain out of scope.

**Unresolved:** independent accessibility, actual browser zoom, security/privacy and visual QA reviews, named reviewers, evidence links, product-owner acceptance and final design freeze.
