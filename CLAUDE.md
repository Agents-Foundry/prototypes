# CLAUDE.md

Guidance for Claude Code working in `Agents-Foundry/prototypes`.

## What this repo is

A **design-first workspace** for Agents Foundry (multi-tenant SaaS where AI agents act as employees). It holds mockups, interactive prototypes, specs, screen registries, decision records, and review evidence. It is **not** a production app.

- Never add production frontend/backend code, service config, real credentials, or real customer data. Implementation belongs in a separate repo after an authorized design freeze.
- Four product surfaces: `platform-owner/` (SaaS operator), `organization-admin/` (tenant admins), `employee-desktop/` (employees working with agents), `agent-studio/` (blueprint authors/publishers). Chain: operator → org admin → agent creator → employee.

## Layout

- **Current design source: `<surface>/app/`.** Four linked, stateful HTML prototypes (no build step) on one shared design system: `platform-owner/app` (PLT-001–028), `organization-admin/app` (ORG-001–027), `employee-desktop/app` (EMP-001–024), `agent-studio/app` (STD-001–020). Each has `index.html`, `main.js` (nav + mount), `data.js` (fictional sample data, where present) and `screens-*.js` (one `S['ID']={…}` entry per screen). All 99 screens are **proposals**. Shell and components live in `design-system/af.css` and `af.js` (read `design-system/README.md` before editing). Registry is generated: `screen-registry/SCREENS.md` and `screens.csv`.
- **Legacy sprint folders are historical evidence** (unchanged by the redesign):
  - `organization-admin/sprint-01/` (ORG-001–013, SVG mockups, `screen-registry.csv`, Playwright in `verification/`)
  - `platform-owner/sprint-02/` (PLT-001–022, mockups, states, Playwright in `verification/`)
  - `employee-desktop/sprint-03/` (EMP-001–016, 32 mockup SVGs, 72 critical-state SVGs, `reviews/`, `verification/`, `prototypes/qa-critical-flow.html`, EMP-DEC-01–10 in `POLICY-QUESTIONS.md`)
  - `employee-desktop/sprint-04/` is a proposed roadmap only.
- `prototype-gallery/index.html`: single self-contained static page (no build, no deps, no network). 32 illustrative screens, 8 per surface. Deployed to GitHub Pages. It is a viewer, **not** the source of truth for approved behavior.
- `screen-registry/`, `design-system/` (Direction C tokens, draft), `docs/` (org plan, coverage, migration plan, reviews), `scripts/` (Python, stdlib only).
- IDs: `PLT` / `ORG` / `EMP` / `STD`. Naming: `<ID>-<slug>-v<maj>.<min>-<state>.<ext>`, states `draft|in-review|approved|deprecated`.

## Commands (no root package.json or `npm test`)

Run from repo root with Python 3.12:

```bash
python scripts/check_apps.py                                   # static checks on the 4 apps: IDs, links, legacy IDs kept, no network/eval
python scripts/build_screen_registry.py [--check]              # regenerate (or verify) screen-registry/SCREENS.md + screens.csv
python scripts/check_gallery_coverage.py                       # asserts exactly 32 gallery entries; string checks on index.html
python employee-desktop/sprint-03/verification/check_assets.py # 72 critical-state SVGs + 32 concepts
python scripts/inventory_prototypes.py --output repository-inventory.json
python scripts/reconcile_mockup_coverage.py --inventory repository-inventory.json --output-dir coverage-output
```

Browser suites (Node 22 + Playwright Chromium); `cd` into the folder, then `npm install --no-audit --no-fund && npx playwright install chromium`:

- `design-system/tests` → `npm test` (all 4 apps: every screen in 8 scenarios, keyboard smoke, axe A/AA rules in light and dark; set `AF_CHROMIUM` to use a local browser). Run after any change to `af.css`, `af.js` or an app. These are simulated-environment checks, not accessibility sign-off.
- Legacy suites:

- `organization-admin/sprint-01/verification` → `npm run test:visual`
- `platform-owner/sprint-02/verification` → `npm test`
- `employee-desktop/sprint-03/verification/browser` → `npm test`; the evidence workflow also runs `test_review_index_contract.py`, `test_archived_evidence_verifier.py`, `build_review_index.py`, `verify_archived_evidence.py`

Preview: `python -m http.server 8000` from the repo root, then open `/<surface>/app/` or `/prototype-gallery/` (apps load shared assets by relative path, so a static server is more reliable than `file://`). CI is in `.github/workflows/` (path-filtered per area).

## Hard rules

1. **Never self-approve.** Do not mark anything approved, product-owner accepted, security/accessibility/visual reviewed, or design-frozen. Gates are separate: proposed → automated evidence → independent security/privacy → independent a11y/visual → product-owner acceptance → freeze. Blank sign-off records stay blank.
2. **Evidence honesty.** Distinguish written spec / automated test / simulated screenshot / real browser / independent review. Green CI and merged PRs are not approval. Say "unverified" or "not run" rather than "passed". Cite the exact commit SHA and run URL. Automated checks here are static or simulated (CSS proxies, not real zoom or screen readers).
3. **Unknown stays unknown.** The count of *approved* screens is unknown (none are approved). The registry counts proposals only; don't infer approval from the 99 listed screens, filenames or the 32-screen gallery.
4. **Stable identity.** Don't rename or renumber screen IDs, EMP-DEC/PLT-DEC/DEC IDs, hashes, or SHAs. Don't edit hash-verified or historical evidence (sprint `reviews/`, `acceptance/`, `freeze/`, `verification/*EVIDENCE*`); add new records instead.
5. **No moving or deleting sprint folders.** Workflows, scripts, relative links and evidence manifests depend on those paths (see `docs/migration-execution-plan.md`, batches A–F). Migration requires a verified complete inventory first, one batch per PR, with paths and links updated and CI run on the exact commit. New work goes under `<surface>/app/`, grouped by journey, not in new `sprint-N` folders. Adding or renaming a screen: keep IDs contiguous (the checker enforces it), keep legacy IDs, then run `build_screen_registry.py` and `check_apps.py`. In app code use the shell's data attributes (`data-go`, `data-set`, `data-sim`, `data-write`) and mark every state-changing control `data-write` so offline/unknown scenarios disable it (fail closed). No `fetch`, `eval`, external URLs or storage of real data.
6. **Simulations are labeled.** Prototype denials, approvals, audit records and counts are illustrative; keep the "No external write, secret access, policy evaluation, approval or publication occurs." language in the gallery.
7. **Gallery edits:** keep `scripts/check_gallery_coverage.py` in sync (surface ids `platform`/`admin`/`employee`/`studio`, 8 titled screens each, `intro:` count of 32). No external scripts, fonts, analytics or network calls.
8. **Design must show:** tenant identity, fail-closed denial, pending-before-complete states, idempotent retry/reconciliation of uncertain outcomes, and a11y states (keyboard, focus, reduced motion, light/dark, 1280/1440 + narrow).

## PR conventions

Narrow branch (`design/…`, `feat/…`, `docs/…`, `ci/…`) from `main`. PR body: purpose, affected surfaces/screens, decision links, before/after, states covered, test commands and results, artifact provenance, risks, outstanding review gates. Don't merge without explicit authorization. No post-merge CI success claims unless a run on that SHA was inspected.
