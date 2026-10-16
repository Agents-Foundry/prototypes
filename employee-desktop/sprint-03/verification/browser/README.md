# Sprint 03 interactive prototype browser evidence

Design verification only. Tests run a local, simulated HTML prototype and cannot prove external policy enforcement.

Run: `npm install && npx playwright install chromium && npm test`

Scenarios: denial, expiration, credential revocation, offline/reconnect, uncertain browser outcome; screenshot captures at 960/1440 in both themes. Screenshots are collected as GitHub Actions artifacts.

**Not covered:** actual Jira operations, vault isolation, safe browser automation, security threat model, manual assistive-tech behavior, product design acceptance or design freeze.
