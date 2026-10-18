#!/usr/bin/env python3
"""Generate evidence-aware mockup coverage from the tracked-file inventory.

No speculative screen count is inferred from filenames. Unknown stays unknown.
"""
from __future__ import annotations
import argparse
import csv
import json
from pathlib import Path

SURFACES = {
    "platform-owner": "Platform Owner",
    "organization-admin": "Organization Admin",
    "employee-desktop": "Employee Desktop",
    "agent-studio": "Agent Studio",
}
GALLERY = {
    "platform-owner": ["Overview", "Organization details", "Governance review"],
    "organization-admin": ["Organization overview", "Team configuration", "Access review"],
    "employee-desktop": ["Workspace", "Agent run", "Approval checkpoint"],
    "agent-studio": ["Blueprint catalog", "Blueprint editor", "Publish review"],
}
FIELDS = ["application", "screen_id", "screen_or_journey", "source_path", "design_status", "clickable_status", "validation_status", "evidence", "notes"]

def reconcile(data):
    paths = [item["source"] for item in data["files"]]
    result = []
    for slug, label in SURFACES.items():
        for step in GALLERY[slug]:
            result.append(dict(application=label, screen_id="", screen_or_journey=step,
                source_path="prototype-gallery/index.html", design_status="illustrative-only",
                clickable_status="illustrative-clickable", validation_status="not-independently-verified",
                evidence="prototype-gallery/index.html",
                notes="Gallery concept screen; not evidence of approved design"))
    candidates = []
    for item in data["files"]:
        path = item["source"]
        if path.startswith(("prototype-gallery/", ".github/", "scripts/")):
            continue
        name = path.lower()
        if any(term in name for term in ("screen", "mockup", "wireframe", "journey", "prototype", "registry")):
            candidates.append({
                "source_path": path,
                "category": item.get("category", ""),
                "sprint_path": item.get("sprint_path", False),
                "referenced_by": item.get("referenced_by", []),
                "review_status": "requires-manual-classification",
            })
    return result, candidates

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", default="repository-inventory.json")
    parser.add_argument("--output-dir", default="coverage-output")
    args = parser.parse_args()
    data = json.loads(Path(args.inventory).read_text(encoding="utf-8"))
    rows, candidates = reconcile(data)
    dest = Path(args.output_dir)
    dest.mkdir(parents=True, exist_ok=True)
    with (dest / "mockup-coverage.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    (dest / "design-candidates.json").write_text(json.dumps({
        "inventory_commit": data["source_commit"],
        "note": "Candidate paths require human review; filename matches do not prove a distinct mockup.",
        "candidates": candidates,
    }, indent=2) + "\n", encoding="utf-8")
    (dest / "summary.json").write_text(json.dumps({
        "inventory_commit": data["source_commit"],
        "illustrative_gallery_screens": len(rows),
        "design_candidate_paths": len(candidates),
        "approved_screen_count": None,
        "pending_mockup_count": None,
        "reason": "Approval and completeness cannot be inferred from tracked filenames.",
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Coverage: {len(rows)} gallery examples, {len(candidates)} design candidates. Pending count unknown.")

if __name__ == "__main__":
    main()
