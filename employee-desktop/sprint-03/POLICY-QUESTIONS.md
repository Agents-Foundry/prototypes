# Sprint 03 — product-owner decisions to review individually

**Approval count: 1/10.** Decisions are reviewed individually. Product-policy approval does not approve security, accessibility, visuals, implementation, or design freeze.

| ID | Decision | Recommended policy direction | Status |
|---|---|---|---|
| EMP-DEC-01 | Window architecture | **APPROVED — Option B:** Secure cross-platform native desktop shell for Windows, macOS and Linux; present a native-feeling agent window while isolating untrusted UI rendering from the separate agent execution kernel, tool execution, filesystem operations and privileged OS integrations. Enforce tenant-scoped identity and least-privilege tool capabilities with explicit authorization for sensitive actions. Secrets must remain behind OS keychain / approved broker boundaries and never flow into ordinary UI state, logs or conversations. Apply safe IPC contracts, narrow process permissions, failure isolation, audit and revocation. Design screens, permissions, states and interaction flows before any application implementation. | Product owner approved 2026-10-16; independent reviews pending |
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

## Recorded individual product-owner approvals

| Decision | Approved choice | Authority | Date | Affected screens | Independent security | Design freeze |
|---|---|---|---|---|---|---|
| EMP-DEC-01 | **Option B — isolated cross-platform native desktop shell with least-privilege execution and protected secrets** | Product owner (explicit individual approval in design conversation) | 2026-10-16 | EMP-001, EMP-002, EMP-003, EMP-004, EMP-005, EMP-006, EMP-011, EMP-015, EMP-016 | **Pending** | **Not approved** |
