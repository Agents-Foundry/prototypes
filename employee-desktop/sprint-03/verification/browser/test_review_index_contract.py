#!/usr/bin/env python3
"""Fail-closed contract checks for the Sprint 03 simulated evidence index."""
import json
import hashlib
import os
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT = Path(__file__).with_name('build_review_index.py')
TARGET = 'light-480-initial'

def run_case(case='valid'):
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        evidence = root / 'evidence'
        output = root / 'output'
        evidence.mkdir()
        for theme in ('light', 'dark'):
            for width in (480, 960, 1440):
                for state in ('initial', 'permission', 'denied', 'expired', 'revoked', 'offline', 'reconnected', 'unknown'):
                    key = f'{theme}-{width}-{state}'
                    data = {
                        'id': key, 'simulated': True, 'gitSha': 'candidate-sha',
                        'axeViolations': [],
                        'dimensions': {'viewportWidth': width, 'documentWidth': width},
                    }
                    if key == TARGET:
                        if case == 'sha-mismatch':
                            data['gitSha'] = 'wrong-sha'
                        elif case == 'axe-violation':
                            data['axeViolations'] = [{'id': 'fixture-violation'}]
                        elif case == 'overflow':
                            data['dimensions']['documentWidth'] = width + 1
                        elif case == 'missing-dimensions':
                            del data['dimensions']
                        elif case == 'string-dimension':
                            data['dimensions']['documentWidth'] = 'not-a-number'
                        elif case == 'zero-dimension':
                            data['dimensions']['viewportWidth'] = 0
                        elif case == 'boolean-dimension':
                            data['dimensions']['documentWidth'] = True
                        elif case == 'nonfinite-dimension':
                            data['dimensions']['documentWidth'] = float('inf')
                    (evidence / (key + '.json')).write_text(json.dumps(data))
                    if not (case == 'missing-screenshot' and key == TARGET):
                        (evidence / (key + '.png')).write_bytes(b'fixture')
        env = dict(os.environ, GITHUB_SHA='candidate-sha')
        result = subprocess.run(
            [sys.executable, str(SCRIPT), '--evidence', str(evidence), '--output', str(output)],
            env=env, capture_output=True, text=True,
        )
        index_path = output / 'index.json'
        assert index_path.is_file(), f'{case}: index not written: {result.stderr}'
        index = json.loads(index_path.read_text())
        summary = index['summary']
        assert summary['expectedSourceSha'] == 'candidate-sha'
        assert summary['evidenceType'] == 'SIMULATED_AUTOMATED_BROWSER_ONLY'
        entry = next(e for e in index['entries'] if e['id'] == TARGET)
        target_report = evidence / (TARGET + '.json')
        target_screenshot = evidence / (TARGET + '.png')
        assert entry['reportSha256'] == hashlib.sha256(target_report.read_bytes()).hexdigest()
        assert entry['screenshotSha256'] == (hashlib.sha256(target_screenshot.read_bytes()).hexdigest() if target_screenshot.is_file() else None)
        if case == 'valid':
            assert result.returncode == 0, result.stderr + result.stdout
            assert summary['automatedPass'] == 48
            assert entry['automatedStatus'] == 'PASS'
        else:
            assert result.returncode != 0, f'{case}: expected failure'
            expected_status = 'FAIL' if case in ('axe-violation', 'overflow') else 'MISSING' if case == 'missing-screenshot' else 'INVALID'
            assert entry['automatedStatus'] == expected_status, f'{case}: {entry}'
            assert summary['automatedPass'] == 47, f'{case}: {summary}'

if __name__ == '__main__':
    for case in (
        'valid', 'sha-mismatch', 'missing-screenshot', 'axe-violation', 'overflow',
        'missing-dimensions', 'string-dimension', 'zero-dimension',
        'boolean-dimension', 'nonfinite-dimension',
    ):
        run_case(case)
    print('Evidence index fail-closed contract checks passed')
