#!/usr/bin/env python3
"""Self-contained contract checks for the Sprint 03 evidence index builder."""
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT = Path(__file__).with_name('build_review_index.py')

def run_case(mismatch=False, missing_screenshot=False, axe_violation=False, horizontal_overflow=False):
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        evidence = root / 'evidence'
        output = root / 'output'
        evidence.mkdir()
        for theme in ('light', 'dark'):
            for width in (480, 960, 1440):
                for state in ('initial', 'permission', 'denied', 'expired', 'revoked', 'offline', 'reconnected', 'unknown'):
                    key = f'{theme}-{width}-{state}'
                    sha = 'wrong-sha' if mismatch and key == 'light-480-initial' else 'candidate-sha'
                    violations = [{'id': 'fixture-violation'}] if axe_violation and key == 'light-480-initial' else []
                    document_width = width + 1 if horizontal_overflow and key == 'light-480-initial' else width
                    (evidence / (key + '.json')).write_text(json.dumps({
                        'id': key, 'simulated': True, 'gitSha': sha,
                        'axeViolations': violations, 'dimensions': {'viewportWidth': width, 'documentWidth': document_width}
                    }))
                    if not (missing_screenshot and key == 'light-480-initial'):
                        (evidence / (key + '.png')).write_bytes(b'fixture')
        env = dict(os.environ, GITHUB_SHA='candidate-sha')
        result = subprocess.run([sys.executable, str(SCRIPT), '--evidence', str(evidence),
                                 '--output', str(output)], env=env, capture_output=True, text=True)
        index = json.loads((output / 'index.json').read_text())
        assert index['summary']['expectedSourceSha'] == 'candidate-sha'
        assert index['summary']['evidenceType'] == 'SIMULATED_AUTOMATED_BROWSER_ONLY'
        if mismatch or missing_screenshot or axe_violation or horizontal_overflow:
            assert result.returncode != 0, result.stdout
            if axe_violation or horizontal_overflow:
                assert index['summary']['automatedFailures'] >= 1
            else:
                assert index['summary']['missingOrInvalid'] >= 1
        else:
            assert result.returncode == 0, result.stderr + result.stdout
            assert index['summary']['automatedPass'] == 48

if __name__ == '__main__':
    run_case(False)
    run_case(True)
    run_case(missing_screenshot=True)
    run_case(axe_violation=True)
    run_case(horizontal_overflow=True)
    print('Evidence-index SHA contract checks passed')
