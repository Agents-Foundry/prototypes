#!/usr/bin/env python3
"""Read-only repository inventory for safe product-first migration."""
from __future__ import annotations
import argparse
import json
import re
import subprocess
from pathlib import Path

SURFACES = ("platform-owner", "organization-admin", "employee-desktop", "agent-studio")
SPRINT = re.compile(r"(?:^|[/_-])sprint[ _-]?0*[0-9]+(?:[/_-]|$)", re.I)
TEXT_SUFFIXES = {".md", ".mdx", ".json", ".jsonl", ".yml", ".yaml", ".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".py", ".txt", ".svg"}

def tracked_files():
    return sorted(subprocess.check_output(["git", "ls-files", "-z"]).decode().rstrip("\0").split("\0"))

def classify(path):
    parts = Path(path).parts
    if path.startswith(".github/workflows/"):
        return "workflow"
    if path.startswith("prototype-gallery/"):
        return "gallery"
    if any("evidence" in x.lower() or "archive" in x.lower() for x in parts):
        return "evidence"
    if any(x.lower().startswith(("test", "spec")) for x in parts):
        return "test"
    if Path(path).suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf", ".zip"}:
        return "binary-or-generated"
    return "design-or-documentation"

def suggest(path):
    matches = [s for s in SURFACES if s in path.lower()]
    if len(matches) == 1:
        return matches[0] + "/" + Path(path).name
    return None

def inventory(root):
    paths = [p for p in tracked_files() if p]
    rows = []
    for path in paths:
        source = root / path
        references = []
        if source.is_file() and source.suffix.lower() in TEXT_SUFFIXES and source.stat().st_size <= 2_000_000:
            try:
                content = source.read_text(encoding="utf-8")
                references = sorted({p for p in paths if p != path and p in content})
            except (UnicodeError, OSError):
                pass
        rows.append({
            "source": path,
            "sprint_path": bool(SPRINT.search(path)),
            "category": classify(path),
            "suggested_destination": suggest(path) if SPRINT.search(path) else None,
            "destination_status": "candidate-only" if SPRINT.search(path) else "unchanged",
            "references_to_tracked_paths": references,
        })
    inbound = {p: [] for p in paths}
    for row in rows:
        for target in row["references_to_tracked_paths"]:
            inbound[target].append(row["source"])
    for row in rows:
        row["referenced_by"] = sorted(inbound[row["source"]])
        if row["sprint_path"] and row["category"] in ("evidence", "workflow", "test"):
            row["suggested_destination"] = None
            row["destination_status"] = "requires-specialist-review"
    return rows

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="repository-inventory.json")
    args = parser.parse_args()
    root = Path(subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip())
    rows = inventory(root)
    output = Path(args.output)
    output.write_text(json.dumps({
        "source_commit": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
        "tracked_files": len(rows),
        "sprint_paths": sum(x["sprint_path"] for x in rows),
        "note": "Suggestions are not approved moves. Review relative links, imports, workflows, manifests and evidence before changing paths.",
        "files": rows,
    }, indent=2) + "\n")
    print(f"Inventory: {len(rows)} tracked files, {sum(x['sprint_path'] for x in rows)} sprint paths -> {output}")

if __name__ == "__main__":
    main()
