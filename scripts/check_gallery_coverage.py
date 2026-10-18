#!/usr/bin/env python3
"""Static gallery coverage assertions; no browser or accessibility claims."""
from pathlib import Path
import re

source = Path("prototype-gallery/index.html").read_text(encoding="utf-8")
steps = {
    "platform": ["Overview", "Organizations directory", "Organization details", "Tenant provisioning", "Subscription and usage", "Platform health", "Governance review", "Audit and incidents"],
    "admin": ["Organization overview", "Departments and teams", "Members and invitations", "Roles and permissions", "Agent assignment", "Model and key settings", "Access review", "Organization audit"],
    "employee": ["Workspace", "Agent catalog", "New task", "Agent run", "Tools and artifacts", "Approval checkpoint", "Offline recovery", "History and settings"],
    "studio": ["Blueprint catalog", "Create blueprint", "Blueprint editor", "Tools and skills", "Model and policies", "Evaluation runs", "Version comparison", "Publish review"],
}
assert source.count("const detailed={") == 1, "Missing detailed screen catalog"
assert "function detailedBody(s,step)" in source, "Detailed screen renderer missing"
assert "state.mode==='normal'?detailedBody(s,step)" in source, "Detailed renderer not wired to normal mode"
for slug, screens in steps.items():
    assert f"id:'{slug}'" in source, f"Missing surface: {slug}"
    assert len(screens) == 8
    for screen in screens:
        assert f"'{screen}':{{intro:" in source, f"Missing detailed content: {slug} / {screen}"
        assert re.search(r"['\"]" + re.escape(screen) + r"['\"]", source), screen
assert source.count("intro:") == 32, "Expected 32 distinct detailed entries"
assert "No external write, secret access, policy evaluation, approval or publication occurs." in source
print("PASS: 32 screen-specific concept entries across 4 surfaces (static checks only)")
