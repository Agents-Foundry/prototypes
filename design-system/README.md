# Agents Foundry design system — Direction C

Balanced premium AI enterprise: calm light content surface, dark navigation rail, restrained indigo–violet accent, legible density, subtle agent execution highlights. Supports light and dark themes, keyboard navigation, WCAG-AA-targeted contrast, responsive layouts and reduced motion.

> **Status: proposal.** Tokens and components are drafts for review. Nothing here is a frozen baseline, and automated checks do not establish accessibility conformance.

## What is here

| File | Purpose |
| --- | --- |
| [`af.css`](af.css) | Tokens (CSS variables, light and dark) and components: shell, cards, tables, forms, tabs, steps, timeline, badges, drawers, modals |
| [`af.js`](af.js) | Prototype shell: hash routing, scenario switcher, per-screen spec drawer, command palette (Ctrl+K), simulated-action modals, UI helpers |
| [`tests/`](tests/) | Playwright smoke, keyboard and automated axe checks for all four apps |

No external fonts, scripts, analytics or network calls. System font stack only.

## Tokens (proposals)

- Canvas `#F7F9FC`, surface `#FFFFFF`, navigation `#101827`
- Primary `#5148E5`, accent `#7C5CFA`; success `#0A7A55`, warning `#8A4B05`, danger `#B42318`, info `#0B5C99` (darkened from the first draft so text meets 4.5:1 on tinted backgrounds)
- Text `#172033`, muted `#5B6B82`, border `#E2E8F0`
- Radius 10 / 14 / 18 px; spacing on a 4 px scale; dark theme via `data-theme="dark"`

## How a screen is defined

```js
S['ORG-005'] = {
  title: 'Teams & departments', group: 'Workforce', navId: 'ORG-005', permission: 'org.teams.view',
  lead: 'One sentence on the job this screen does.',
  state: { sel: 'qa' },                      // per-screen state, reset by "Reset demo"
  emptyText: '…', emptyAction: '…',          // shown in the "Empty" scenario
  spec: { goal, states, security, a11y },    // shown in the "Screen spec" drawer
  actions: ctx => '…',                       // header buttons
  render: ctx => '…html…'                    // returns HTML using AF.ui helpers
};
```

Declarative interaction attributes: `data-go="ID"`, `data-set="key=value"` (use `$a.b` for state shared across screens), `data-bind` (inputs), `data-toggle`, `data-act="name:args"` (calls the screen's `act`), `data-sim="message"` (confirmation modal; add `data-risk` and `data-confirm` for typed confirmation), `data-write` (disabled automatically when offline or the outcome is unknown, so writes fail closed).

## Scenarios

Every screen can be viewed as: Normal, Loading, Empty, Request error, Permission denied, Offline, Outcome unknown, Stale data. These are simulated; they demonstrate intended behavior and are not evidence of real enforcement.

## Rules for screens

- Show tenant context and who is accountable.
- Show pending states before success; never imply an external action succeeded before it is confirmed.
- Risky actions need a scoped approval or typed confirmation; irreversible actions say so.
- No secrets in the UI. Keys and tokens are always masked or absent.
- Label every simulation. Do not add claims of review, approval or freeze.

## Running locally

```bash
python -m http.server 8000
# open http://localhost:8000/platform-owner/app/  (also organization-admin, employee-desktop, agent-studio)
```

Tests: `cd design-system/tests && npm install && npx playwright install chromium && npm test`.
