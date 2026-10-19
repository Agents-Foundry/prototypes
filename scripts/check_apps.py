#!/usr/bin/env python3
"""Static integrity checks for the four prototype apps. No browser, no accessibility claims.

Verifies structure only: files exist, screen IDs are unique and contiguous, internal links
resolve, legacy IDs are preserved, and no network or dynamic-code APIs are used.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPS = {
    "PLT": ("platform-owner/app", 22),
    "ORG": ("organization-admin/app", 13),
    "EMP": ("employee-desktop/app", 16),
    "STD": ("agent-studio/app", 0),
}
ENTRY = re.compile(r"S\d?\['([A-Z]{3}-\d{3})'\]=\{")
LINK = re.compile(r"""(?:data-go="|href="#/|\.go\(')([A-Z]{3}-\d{3})""")
NAV = re.compile(r"\['([A-Z]{3}-\d{3})',")
HOME = re.compile(r"home:'([A-Z]{3}-\d{3})'")
FORBIDDEN = [r"\bfetch\(", r"XMLHttpRequest", r"WebSocket", r"\beval\(", r"new Function", r"sendBeacon",
             r"https?://", r"importScripts"]
errors: list[str] = []


def err(msg):
    errors.append(msg)


def check_app(prefix, folder, legacy_max):
    base = ROOT / folder
    index = base / "index.html"
    if not index.exists():
        return err(f"{folder}: missing index.html")
    html = index.read_text(encoding="utf-8")
    for ref in re.findall(r'(?:src|href)="([^"#]+)"', html):
        if ref.startswith(("http:", "https:", "//")):
            err(f"{folder}/index.html: external reference {ref}")
        elif not (base / ref).resolve().exists():
            err(f"{folder}/index.html: missing file {ref}")
    ids, links, files = [], set(), sorted(base.glob("*.js"))
    for f in files:
        text = f.read_text(encoding="utf-8")
        for pat in FORBIDDEN:
            if re.search(pat, text):
                err(f"{f.relative_to(ROOT)}: forbidden pattern /{pat}/")
        if f.name.startswith("screens-"):
            ids += ENTRY.findall(text)
        links.update(LINK.findall(text))
    main = (base / "main.js").read_text(encoding="utf-8")
    nav = set(NAV.findall(main))
    home = HOME.findall(main)
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        err(f"{folder}: duplicate screen IDs {sorted(dup)}")
    wrong = [i for i in ids if not i.startswith(prefix + "-")]
    if wrong:
        err(f"{folder}: IDs with wrong prefix {wrong}")
    nums = sorted(int(i.split("-")[1]) for i in set(ids))
    if nums != list(range(1, len(nums) + 1)):
        err(f"{folder}: screen numbers are not contiguous from 001: {nums}")
    if len(nums) < legacy_max:
        err(f"{folder}: legacy IDs 001-{legacy_max:03d} must be preserved")
    known = set(ids)
    quoted = set(re.findall(r"'(" + prefix + r"-\d{3})'", "".join(f.read_text(encoding="utf-8") for f in files if f.name.startswith("screens-"))))
    for target in sorted(quoted - known):
        err(f"{folder}: string reference {target} has no screen")
    for target in sorted(links | nav | set(home)):
        if target.startswith(prefix + "-") and target not in known:
            err(f"{folder}: link/nav target {target} has no screen")
    if not home:
        err(f"{folder}: main.js has no home screen")
    sources = "".join(f.read_text(encoding="utf-8") for f in files if f.name.startswith("screens-"))
    for sid in sorted(known):
        bare = re.search(re.escape(f"['{sid}']") + r"=\{[^}]{0,120}bare:true", sources)
        referenced = sources.count(f"'{sid}'") > 1  # defined once, so >1 means another screen refers to it
        if sid not in nav and sid not in links and not referenced and not bare:
            err(f"{folder}: {sid} is not reachable from nav, a link or the sign-in flow")
    return len(known)


def main():
    total = 0
    for prefix, (folder, legacy) in APPS.items():
        total += check_app(prefix, folder, legacy) or 0
    shell = (ROOT / "design-system/af.js").read_text(encoding="utf-8")
    for needle in ("Design prototype", "Simulation only"):
        if needle not in shell:
            err(f"design-system/af.js: missing required disclaimer text '{needle}'")
    for needle in ("no network or real actions", "not approved designs"):
        if needle not in shell:
            err(f"design-system/af.js: missing banner phrase '{needle}'")
    if errors:
        print("FAIL")
        for e in errors:
            print(" -", e)
        return 1
    print(f"PASS: {total} screens across 4 apps (static structure checks only)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
