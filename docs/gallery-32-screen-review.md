# Primary review — complete 32-screen concept gallery

**Review stage:** internal primary-review preparation, not final approval.

| Surface | Navigable concepts | Screen-specific content |
| --- | ---: | ---: |
| Platform Owner | 8 | 8 |
| Organization Admin | 8 | 8 |
| Employee Desktop | 8 | 8 |
| Agent Studio | 8 | 8 |
| **Total** | **32** | **32** |

## Primary reviewer checklist

- [x] Each of the 32 gallery concepts has a distinct title and illustrative, screen-specific content.
- [x] Conceptual governance and tenant separation language is represented.
- [x] Sensitive actions are explicitly labeled as simulations, not real authorization.
- [x] Static coverage assertions added; execution in GitHub CI is pending.
- [ ] Complete realistic layouts, input validation, empty/error states and end-to-end transitions for every journey.
- [ ] Reconcile authoritative Sprint 01–03 screen registry to identify screens beyond these 32 topics.
- [ ] Conduct actual keyboard/screen-reader, responsive visual and browser interaction reviews.
- [ ] Obtain independent security/accessibility reviews and product-owner approval.

## Team review instructions

Open the [gallery](https://agents-foundry.github.io/prototypes/) after the relevant PR merges and deployment is verified. Navigate all eight screens of each product, exercise normal/loading/offline/permission denied modes, and record findings as: application, screen title, scenario, expected behavior, actual observation, severity and suggested change.

**Review decision:** Suitable for *concept and scope review* when deployed. **Not approved for final mockup sign-off.** The exact remaining detailed mockup count cannot be derived from gallery navigation alone.
