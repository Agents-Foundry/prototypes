#!/usr/bin/env python3
"""Design asset integrity checks; no production app dependencies."""
from pathlib import Path
from collections import Counter
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
STATES = ROOT / "critical-states"
MOCKUPS = ROOT / "mockups"
EXPECTED = ("QA-01","QA-02","QA-03","QA-04","QA-05","QA-06","QA-07","QA-08",
            "SEC-01","SEC-02","SEC-03","SEC-04","RUN-01","RUN-02","RUN-03",
            "REC-01","REC-02","REC-03")
THEMES = ("light", "dark")
errors = []

def check_svg(path, expected_width):
    try:
        root = ET.parse(path).getroot()
        if not root.tag.endswith("svg"): errors.append(f"{path}: not SVG root")
        if root.attrib.get("width") != str(expected_width):
            errors.append(f"{path}: incorrect width {root.attrib.get('width')}")
        if not root.attrib.get("role") == "img" or not root.attrib.get("aria-label"):
            errors.append(f"{path}: missing accessible description")
        if not root.attrib.get("viewBox"):
            errors.append(f"{path}: missing viewBox")
    except ET.ParseError as exc:
        errors.append(f"{path}: malformed SVG {exc}")

expected_state = set()
for id in EXPECTED:
    for width in (960, 1440):
        for theme in THEMES:
            filename = f"{id}-{width}-{theme}.svg"
            expected_state.add(filename)
            path = STATES / filename
            if not path.exists(): errors.append(f"Missing {path}")
            else: check_svg(path, width)
actual_state = {p.name for p in STATES.glob("*.svg")}
for name in sorted(actual_state - expected_state):
    errors.append(f"Unexpected critical SVG {name}")

for index in range(1,17):
    id = f"EMP-{index:03d}"
    for theme in THEMES:
        p = MOCKUPS / f"{id}-{theme}.svg"
        if not p.exists(): errors.append(f"Missing desktop design {p}")
        else: check_svg(p, 1440)

prototype = ROOT / "prototypes" / "qa-critical-flow.html"
if not prototype.exists():
    errors.append("Missing local-only HTML prototype")
else:
    html = prototype.read_text(encoding="utf-8")
    for marker in ('role="status"', 'aria-live="polite"', "mode=\"denied\"",
                   "mode=\"expired\"","mode=\"revoked\"","mode=\"unknown\"",
                   "mode=\"offline\""):
        if marker not in html: errors.append(f"Missing prototype state marker: {marker}")
    if re.search(r"<script[^>]+src=|https?://|fetch\s*\(|XMLHttpRequest|WebSocket", html):
        errors.append("Prototype contains a possible external dependency")
print(f"Verified {len(expected_state)} critical-state SVGs and 32 screen concepts")
if errors:
    for error in errors: print("FAIL:", error)
    raise SystemExit(1)
print("PASS: Design asset structure, coverage and static local prototype markers")
