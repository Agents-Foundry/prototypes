# Sprint 03 — product-owner decisions to review individually

**No decisions approved in this document.** Options and recommendations are proposals only.

| ID | Decision | Recommended policy direction | Status |
|---|---|---|---|
| EMP-DEC-01 | Window architecture | Native-looking cross-platform desktop shell; separate execution kernel and safe view | Pending |
| EMP-DEC-02 | Conversation and context persistence | Tenant-isolated central sync with controlled local encrypted cache | Pending |
| EMP-DEC-03 | Credential and token handling | OS keychain/approved secret broker, never plaintext in conversation | Pending |
| EMP-DEC-04 | Environment and production permissions | Explicit environment selection; higher-risk prod requires step-up and approval | Pending |
| EMP-DEC-05 | Agent run autonomy | Safe read actions by policy, high-risk writes/deployments require explicit human approval | Pending |
| EMP-DEC-06 | Workspace repository access | Scoped per-project workspaces, least-privilege Git and file access | Pending |
| EMP-DEC-07 | Browser automation and test evidence | Isolated per-tenant sessions, approved credentials, replayable evidence | Pending |
| EMP-DEC-08 | Jira/Bitbucket integrations | Organization-admin-authorized connectors and permission-scoped writes | Pending |
| EMP-DEC-09 | Artifacts, retention and sync | Versioned audited files with tenant policy, residency and redaction | Pending |
| EMP-DEC-10 | Offline, failure and recovery | Fail-closed for remote privileged actions; deterministic resume and clear status | Pending |

Each decision requires its own review, alternatives, scope, affected EMP screens and recorded approval. Product-owner policy approval is not independent security or visual acceptance.
