#!/usr/bin/env python3
"""Generate a non-approval evidence index from Playwright JSON files."""
import argparse
import hashlib
import html
import json
import math
import os
from pathlib import Path

STATES = ('initial', 'permission', 'denied', 'expired', 'revoked', 'offline', 'reconnected', 'unknown')
THEMES = ('light', 'dark')
WIDTHS = (480, 960, 1440)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--evidence', type=Path, default=Path('test-results/review-evidence'))
    parser.add_argument('--output', type=Path, default=Path('test-results/review-index'))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    entries = []
    for theme in THEMES:
        for width in WIDTHS:
            for state in STATES:
                key = f'{theme}-{width}-{state}'
                report = args.evidence / (key + '.json')
                screenshot = args.evidence / (key + '.png')
                entry = {'id': key, 'reportExists': report.is_file(), 'screenshotExists': screenshot.is_file(),
                         'automatedStatus': 'MISSING', 'violations': None, 'sourceSha': None,
                         'reportSha256': None, 'screenshotSha256': None}
                if report.is_file():
                    entry['reportSha256'] = hashlib.sha256(report.read_bytes()).hexdigest()
                if screenshot.is_file():
                    entry['screenshotSha256'] = hashlib.sha256(screenshot.read_bytes()).hexdigest()
                if report.is_file():
                    try:
                        data = json.loads(report.read_text(encoding='utf-8'))
                        if not isinstance(data, dict):
                            raise ValueError('Report must be a JSON object')
                        entry['sourceSha'] = data.get('gitSha') if isinstance(data.get('gitSha'), str) else None
                        if data.get('id') != key or data.get('simulated') is not True or not isinstance(data.get('gitSha'), str) or not data.get('gitSha').strip():
                            entry['automatedStatus'] = 'INVALID'
                        else:
                            violations = data.get('axeViolations')
                            dimensions = data.get('dimensions', {})
                            viewport = dimensions.get('viewportWidth') if isinstance(dimensions, dict) else None
                            document = dimensions.get('documentWidth') if isinstance(dimensions, dict) else None
                            valid_dimensions = all(type(value) in (int, float) and math.isfinite(value) and value > 0 for value in (viewport, document)) and viewport == width
                            if not isinstance(violations, list) or not valid_dimensions or viewport != width:
                                entry['automatedStatus'] = 'INVALID'
                            else:
                                entry['violations'] = len(violations)
                                overflow = document > viewport
                                entry['automatedStatus'] = 'FAIL' if violations or overflow else 'PASS'
                    except (ValueError, TypeError, OSError):
                        entry['automatedStatus'] = 'INVALID'
                if not screenshot.is_file() and entry['automatedStatus'] == 'PASS':
                    entry['automatedStatus'] = 'MISSING'
                entries.append(entry)
    source_shas = sorted({x['sourceSha'] for x in entries if x['sourceSha']})
    expected_sha = os.environ.get('GITHUB_SHA')
    if expected_sha and any(x['sourceSha'] != expected_sha for x in entries):
        for entry in entries:
            if entry['sourceSha'] != expected_sha:
                entry['automatedStatus'] = 'INVALID'
    summary = {'expectedSourceSha': expected_sha or 'local-unpinned', 'observedSourceShas': source_shas,
               'expected': len(entries), 'captured': sum(x['reportExists'] and x['screenshotExists'] for x in entries),
               'automatedPass': sum(x['automatedStatus'] == 'PASS' for x in entries),
               'automatedFailures': sum(x['automatedStatus'] == 'FAIL' for x in entries),
               'missingOrInvalid': sum(x['automatedStatus'] in ('MISSING', 'INVALID') for x in entries),
               'evidenceType': 'SIMULATED_AUTOMATED_BROWSER_ONLY',
               'independentSecurityPrivacy': 'PENDING', 'manualAccessibility': 'NOT TESTED',
               'actualBrowserZoom': 'NOT TESTED', 'independentVisualQa': 'PENDING',
               'finalDesignFreeze': 'BLOCKED'}
    (args.output / 'index.json').write_text(json.dumps({'summary': summary, 'entries': entries}, indent=2) + '\n', encoding='utf-8')
    rows = '\n'.join('<tr><td>' + html.escape(e['id']) + '</td><td>' +
                     html.escape(e['automatedStatus']) + '</td><td>' +
                     ('yes' if e['screenshotExists'] else 'no') + '</td></tr>' for e in entries)
    page = ('<!doctype html><html lang="en"><meta charset="utf-8"><title>Sprint 03 evidence index</title>'
            '<style>body{font:16px system-ui;max-width:1000px;margin:2rem auto;padding:1rem}'
            'td,th{padding:.5rem;border:1px solid #aaa;text-align:left}table{border-collapse:collapse}</style>'
            '<h1>Sprint 03 automated evidence index</h1><p><strong>Not an independent approval.</strong> '
            'Manual accessibility, actual zoom and visual QA remain pending; design freeze blocked.</p>'
            '<p>Expected: ' + str(summary['expected']) + '; captured: ' + str(summary['captured']) +
            '; automated pass: ' + str(summary['automatedPass']) + '; failures: ' +
            str(summary['automatedFailures']) + '; missing/invalid: ' + str(summary['missingOrInvalid']) +
            '</p><table><thead><tr><th>Scenario</th><th>Automated result</th><th>Screenshot</th>'
            '</tr></thead><tbody>' + rows + '</tbody></table></html>')
    (args.output / 'index.html').write_text(page, encoding='utf-8')
    print(json.dumps(summary, indent=2))
    if summary['automatedPass'] != summary['expected']:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
