# Interactive Prototype Gallery

Open [index.html](index.html) in a browser to explore a **static, self-contained clickable concept demo** for Platform Owner, Organization Admin, Employee Desktop, and Agent Studio.

After this branch is merged and GitHub Pages is configured to deploy from **GitHub Actions**, the intended public URL is:

https://agents-foundry.github.io/prototypes/

This URL is **not verified live** until deployment succeeds. Check [Actions](https://github.com/Agents-Foundry/prototypes/actions/workflows/prototype-gallery-pages.yml) for deployment status.

## What works

- Four clickable surface entries, three example screens per surface
- Forward/back navigation and journey restart
- Normal, loading, offline, and permission-denied **simulated** states
- Simulated confirmation checkpoint
- Light/dark toggle, responsive layout, keyboard-accessible native controls
- No dependencies, secrets, backend, analytics, or network calls from the demo

## Limits

This is a **new illustrative gallery**, not a faithful reproduction of every existing screen or an approved end-to-end design. Labels, counts, organizations and flows are examples. It does not prove tenant isolation, authorization, security, accessibility, browser zoom, or independent visual QA. Existing screen registries and decision records remain the authoritative source for proposed detailed behavior; mapping individual approved screens into the gallery is follow-up work.

## Preview

From the repository root, open `prototype-gallery/index.html` directly or serve the directory with a local static server (for example `python -m http.server 8000` and visit `http://localhost:8000/prototype-gallery/`). No build is required.

## Publishing

1. Review and merge the gallery PR only with authorization.
2. In repository **Settings → Pages**, choose **GitHub Actions** as the build/deployment source (requires repository admin).
3. Run the **Prototype Gallery Pages** workflow, or push a change to `prototype-gallery/` on `main`.
4. Verify the published URL, navigation, mobile layout, keyboard focus, and links in a real browser. Record those results; do not infer them from CI success.

The deployment uses the official GitHub Pages Actions and only uploads the static `prototype-gallery/` directory.
