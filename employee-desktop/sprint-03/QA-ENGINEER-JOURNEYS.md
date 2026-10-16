# Sprint 03 — day-one QA Engineer agent journeys

## A. Work from a Jira story
1. Select tenant, workspace, assigned QA Agent and correct Jira project.
2. Agent reads **only** authorized story and attached context; shows source identifiers and freshness.
3. Suggest test cases; allow review and edit before publishing to Jira.
4. Request explicit confirmation for Jira write; show submitted/failed/conflict states and auditable link.

## B. Browser testing against dev / playground / production
1. Pick permitted environment from visible environment selector.
2. Inspect approved URL, isolation of browser profile and credential scope (never show plaintext).
3. Agent proposes steps and runs tests with live progress, pause and stop.
4. Production actions are treated as sensitive; do not automatically test destructive workflows.
5. Publish evidence: screenshots, redacted logs, reproducible steps, defect draft and test result.
6. Ask review before filing Jira bug or updating test status.

## C. Release pre/post-sanity
1. Select release ticket and approved environment, reveal a checklist of authorized tests.
2. Run pre-deploy sanity; preserve timestamp and environment snapshot.
3. Wait for human/CI confirmation of deployment, then execute post-deploy sanity only when permitted.
4. Compare results and submit a signed-off summary, without fabricating deployment status.

## D. Conversation and sensitive context
Central synchronization follows organization policies. A local offline cache, if approved, must be encrypted and bounded by policy. The visual transcript must never reveal stored passwords/tokens. Reconnect and stale-content conflicts are explicit.

## Open design questions
Panel layouts, agent personas, multi-agent handoff, destructive action confirmations, storage defaults, native-shell constraints and product policy decisions remain under review.
