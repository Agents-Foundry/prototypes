# Sprint 03 automated evidence — 2026-10-20

This dossier records **automated** CI evidence only. It is not independent security/privacy, accessibility, visual QA, product-owner acceptance, or design freeze.

## Provenance and verification

- [PR #40](https://github.com/Agents-Foundry/prototypes/pull/40) merged 2026-10-16 18:26:52 UTC; [PR #83](https://github.com/Agents-Foundry/prototypes/pull/83) merged 2026-10-20 01:05:56 UTC, producing `main` commit [`eadb0ddd`](https://github.com/Agents-Foundry/prototypes/commit/eadb0ddd9bfd7ca411fac0667d3c22f65d22cfad).
- [PR-head run 39320023582](https://github.com/Agents-Foundry/prototypes/actions/runs/39320023582): 12/12 Playwright tests passed and evidence [artifact 12219632768](https://github.com/Agents-Foundry/prototypes/actions/runs/39320023582/artifacts/12219632768) uploaded (257,122 bytes; expires 2026-11-02 20:33:51 UTC). This does not establish independent review.
- **Post-merge `main` run:** [Prototype apps 39351520679](https://github.com/Agents-Foundry/prototypes/actions/runs/39351520679) completed successfully on 2026-10-20. Browser job `118396535063` reported **12/12 Playwright tests passed**; static job `118396534759` reported **99 screens across four apps** and a current 99-screen registry (static checks only).
- **Post-merge artifact:** [prototype-apps-test-results, ID 12233590850](https://github.com/Agents-Foundry/prototypes/actions/runs/39351520679/artifacts/12233590850) uploaded successfully; 257,651 bytes; expires **2026-11-03 01:08:16 UTC**. Logs confirm upload and SHA-256 `3c8f38846136e47ba42d1862d8257cae9a230b033ff1aaf062a6f234186717fb`. This note does not claim manual inspection of report contents.
- [Gallery Pages run 39351520624](https://github.com/Agents-Foundry/prototypes/actions/runs/39351520624) completed successfully (deploy job `118396534437`).
- Non-failing maintenance warning: GitHub Actions reports Node.js 20 deprecation for checkout/setup/upload actions. Track action-version upgrades separately; do not conflate this with test failures.

## Scope and remaining gates

The automated checks do **not** establish independent security/privacy assessment, manual accessibility or screen-reader testing, actual browser zoom/reflow, manual visual QA, or product-owner acceptance. Reconcile the 32-screen gallery and 99-screen prototype-app inventory, including the 139-screen expansion *plan* from PR #82 (not implemented screen coverage). PR #82's proposed employee self-approval policy requires explicit governance review before adoption. Final design freeze remains pending.

All evidence links are time-limited; archive artifacts under approved retention controls before expiry if required. No production application code or independent approvals are implied by this document.
