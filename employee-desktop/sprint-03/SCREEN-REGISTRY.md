# Sprint 03 — Employee Desktop Agent Experience screen registry (proposal)

Design-first Windows/macOS/Linux desktop agent window. This is **not** an implementation or authorization to build product code. Direction C: Balanced Premium AI Enterprise.

| ID | Screen | User goal | Required review states |
|---|---|---|---|
| EMP-001 | Sign-in and organization selection | Authenticate into correct tenant | SSO/MFA, invited, expired, offline, denied |
| EMP-002 | Workspace home | Resume tasks, see assigned agents | first run, ready, disconnected, no agents |
| EMP-003 | Agent conversation | Work with AI employee | idle, streaming, stopped, error, redacted |
| EMP-004 | Agent run plan and progress | Inspect steps and execution | queued, executing, paused, failed, completed |
| EMP-005 | Tool permission request | Explicitly approve risky actions | requested, allowed once, denied, expired |
| EMP-006 | Credentials and vault access | Connect accounts without exposing secrets | connected, locked, renewal, revoked |
| EMP-007 | Jira work and attachments | Read story and publish reviewed artifacts | draft, conflict, submitted, failed |
| EMP-008 | Browser/test execution | Test approved environments | environment selection, live, timeout, fail |
| EMP-009 | Artifacts and evidence | Inspect screenshots, test cases, logs | generating, ready, restricted, deleted |
| EMP-010 | Git/repository context | Inspect scoped code workspace | available, indexing, denied, stale |
| EMP-011 | Skills/tools/connector directory | Discover authorized capabilities | installed, request approval, unavailable |
| EMP-012 | Notifications and approvals | Respond to blocked runs | pending, decided, revoked, expired |
| EMP-013 | History, search and retention | Find conversations and runs | loading, results, redacted, expired |
| EMP-014 | Environment manager | Select dev, staging or production target | ready, offline, disallowed, elevated |
| EMP-015 | Settings and privacy | Manage experience and data visibility | saved, invalid, policy locked |
| EMP-016 | Recovery and offline workspace | Safe resume after interruptions | offline, recoverable, stale, unrecoverable |

## Required UI design evidence
Each screen: light/dark desktop frame, 1280 and 1440 widths, narrow/resizable window, typography and contrast, keyboard/focus semantics, explicit error/denied/loading/empty states and tenant identity banner. Sensitive credentials never appear in the transcript. Automatic production execution, deletion, deployment and privileged tool access must never be implied.

## Relationship to prior sprints
Sprint 01 tenant governance defines organization-owned restrictions; Sprint 02 governs platform-wide baselines. Neither predecessor's **pending independent sign-offs** may be treated as approved merely by reuse here.
