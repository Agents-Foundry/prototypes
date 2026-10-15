# Interaction contract (design-only)

## Onboarding
Unconfigured → organization details draft → organization established → department/team setup → ready for hiring. Invalid inputs preserve entered data; navigations prompt on unsaved changes. Failure must not imply successful setup.

## Hiring wizard
- 008 Blueprint → 009 Configure → 010 Capabilities → 011 Integrations → 012 Review.
- Back preserves previous step inputs, Next validates the active step, Cancel asks to discard or save as draft, Resume returns to last completed step.
- Capabilities restricted by policy appear disabled with the reason and contact path; a user cannot simply override this in the UI.
- Connector states: Not connected, Connecting, Connected/Verified, Degraded, Expired, Permission insufficient. Secret values must remain masked.
- Review includes owner, model/provider, budget, requested privileges, effective privileges, connector health and required approvals.

## Activation states
Draft → Ready for review → Approval requested → Pending approval → Approved → Provisioning → Active. Alternate paths: Rejected, Checks failed, Provisioning failed, Suspended, Deactivated. A request submission is never itself Active. Show approval owner, timestamp and resolution steps for pending and failure.

## High-risk interactions
Protected Jira writes and production browser activity require policy evaluation and potentially designated reviewer approval. Screens only communicate that requirement; backend policy enforcement must never be inferred from a checkmark in a mockup.
