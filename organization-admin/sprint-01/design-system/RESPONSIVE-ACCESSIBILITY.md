# UX design refinement guidelines

## Responsive layouts
- **≥1440px:** 244px sidebar, 72px top bar, max-width 1160px content, two-to-four-column cards.
- **1024–1439px:** narrower content; two-column cards; scrollable horizontal wizard steps.
- **768–1023px:** compact sidebar or collapsible nav; single/two-column content.
- **<768px:** stacked navigation, one-column cards/forms, scrollable tabs. Desktop-centric primary UX; small-screen usability is an exploration, not a mobile product commitment.

## Themes
Light: canvas #F7F9FC, card #FFF, nav #101827, primary #5148E5, text #172033.
Dark: canvas #0C1220, card #182235, nav #080C16, primary #AFA5FF, text #EDF2FA.

## Components
Navigation links, contextual breadcrumb, tenant switcher placeholder, dashboard metric card, empty state, list row, search, wizard steps, form field, connector status, readiness checklist, confirmation dialog, toast/alert, primary and secondary action.

## Accessibility acceptance targets
- All workflow actions operable by keyboard and clearly focused.
- Screen reader headings and landmarks; form labels and announced error messages.
- 44×44px recommended touch targets where practical; no color-only semantics.
- Respect reduced motion. Test WCAG 2.2 AA contrast and zoom up to 200% before approval.
- Destructive changes need explicit, uniquely worded confirmation; never expose secrets.

## Reality check
The standalone prototype is an **interaction exploration** for design reviewers, not a WCAG-certified or pixel-perfect final product. Formal audits, device previews and user validation remain pending.
