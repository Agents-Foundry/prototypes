# Reproducible manual design validation protocol

**Run against** `organization-admin/sprint-01/prototype/index.html` (file from exact reviewed commit). Export browser viewport screenshots and attach paths/PR links for every test.

| Case | Width | Checks | Result |
|---|---|---|---|
| R-01 | 375px | nav visible/scrollable; no horizontal overflow; forms usable | Not run |
| R-02 | 768px | wizard steps and dialog within viewport | Not run |
| R-03 | 1024px | content grid, hierarchy and lists unclipped | Not run |
| R-04 | 1280px | menu and cards; no control overlap | Not run |
| R-05 | 1440px | desktop reference vs approved SVGs | Not run |
| R-06 | 1920px | max width, typography and empty space | Not run |
| R-07 | 375/1440px dark | contrast and legibility | Not run |
| A-01 | keyboard | Tab, Shift-Tab, Enter/Space, Escape; modal focus return | Not run |
| A-02 | 200% zoom | control visibility, no information loss | Not run |
| A-03 | screen reader | headings, labels, announced errors and status | Not run |
| A-04 | WCAG 2.2 AA | automated axe audit + manual color contrast | Not run |
| F-01 | wizard | back → save → resume → cancel, preservation semantics | Not run |
| F-02 | activation | request → pending; no instant Active | Not run |

## Evidence format
For each: `test-id | commit-sha | browser+version | operating system | viewport | result | screenshot/path | findings | reviewer/date`. Accept no bare 'passed' without execution evidence.
