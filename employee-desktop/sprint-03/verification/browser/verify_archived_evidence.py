#!/usr/bin/env python3
"""Verify archived Sprint 03 simulated evidence against the review index.

Integrity check only; not independent review, authenticity or approval.
"""
import argparse
import hashlib
import json
import math
import re
from pathlib import Path

SHA256 = re.compile(r'[0-9a-f]{64}\Z')
GIT_SHA = re.compile(r'[0-9a-fA-F]{40}\\Z')
STATES = ('initial', 'permission', 'denied', 'expired', 'revoked', 'offline', 'reconnected', 'unknown')
EXPECTED = {f'{theme}-{width}-{state}' for theme in ('light', 'dark')
            for width in (480, 960, 1440) for state in STATES}

def verify(index_path: Path, evidence_dir: Path) -> list[str]:
    errors = []
    try:
        index = json.loads(index_path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as exc:
        return [f'Unable to read index: {exc}']
    if not isinstance(index, dict) or not isinstance(index.get('entries'), list):
        return ['Invalid index structure']
    summary = index.get('summary')
    if not isinstance(summary, dict) or summary.get('evidenceType') != 'SIMULATED_AUTOMATED_BROWSER_ONLY':
        errors.append('Unexpected or missing evidence type')
    source_sha = summary.get('expectedSourceSha') if isinstance(summary, dict) else None
    if not isinstance(source_sha, str) or not GIT_SHA.fullmatch(source_sha):
        errors.append('Missing or malformed expected source SHA')
    if isinstance(summary, dict):
        if summary.get('observedSourceShas') != [source_sha]:
            errors.append('Observed source SHAs do not match expected source SHA')
        if any(summary.get(field) != value for field, value in
               (('captured', 48), ('automatedFailures', 0), ('missingOrInvalid', 0))):
            errors.append('Index summary contains incomplete or failing evidence')
    entries = index['entries']
    ids = [entry.get('id') if isinstance(entry, dict) else None for entry in entries]
    if len(ids) != len(EXPECTED) or set(ids) != EXPECTED or len(set(ids)) != len(ids):
        errors.append('Index scenario coverage is incomplete, duplicated or unexpected')
    if isinstance(summary, dict) and (summary.get('expected') != 48 or summary.get('automatedPass') != 48):
        errors.append('Index does not report all 48 automated scenarios passing')
    for entry in entries:
        if not isinstance(entry, dict) or entry.get('id') not in EXPECTED:
            continue
        key = entry['id']
        if entry.get('automatedStatus') != 'PASS':
            errors.append(f'{key}: automated status is not PASS')
        if entry.get('sourceSha') != source_sha:
            errors.append(f'{key}: index source SHA mismatch')
        if entry.get('reportExists') is not True or entry.get('screenshotExists') is not True:
            errors.append(f'{key}: index reports missing files')
        if entry.get('violations') != 0:
            errors.append(f'{key}: indexed accessibility violations are not zero')
        for extension, field in (('json', 'reportSha256'), ('png', 'screenshotSha256')):
            expected_hash = entry.get(field)
            if not isinstance(expected_hash, str) or not SHA256.fullmatch(expected_hash):
                errors.append(f'{key}: missing or malformed {field}')
                continue
            path = evidence_dir / f'{key}.{extension}'
            try:
                actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
            except OSError:
                errors.append(f'{key}: missing or unreadable {extension}')
                continue
            if actual_hash != expected_hash:
                errors.append(f'{key}: {extension} SHA-256 mismatch')
        try:
            report = json.loads((evidence_dir / f'{key}.json').read_text(encoding='utf-8'))
        except (OSError, ValueError, UnicodeError) as exc:
            errors.append(f'{key}: invalid report JSON: {exc}')
            continue
        if not isinstance(report, dict) or report.get('id') != key or report.get('simulated') is not True:
            errors.append(f'{key}: report identity or simulated marker mismatch')
            continue
        if report.get('gitSha') != source_sha:
            errors.append(f'{key}: report source SHA mismatch')
        if report.get('axeViolations') != []:
            errors.append(f'{key}: report axe violations missing or nonzero')
        dimensions = report.get('dimensions')
        width = int(key.split('-')[1])
        viewport = dimensions.get('viewportWidth') if isinstance(dimensions, dict) else None
        document = dimensions.get('documentWidth') if isinstance(dimensions, dict) else None
        if not (all(type(v) in (int, float) and math.isfinite(v) and v > 0
                    for v in (viewport, document)) and viewport == width and document <= viewport):
            errors.append(f'{key}: invalid report viewport dimensions or overflow')
    return errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--index', type=Path, default=Path('test-results/review-index/index.json'))
    parser.add_argument('--evidence', type=Path, default=Path('test-results/review-evidence'))
    args = parser.parse_args()
    errors = verify(args.index, args.evidence)
    if errors:
        for error in errors:
            print('FAIL:', error)
        raise SystemExit(1)
    print('PASS: 48 simulated evidence scenarios match indexed SHA-256 digests; independent review remains pending.')

if __name__ == '__main__':
    main()
