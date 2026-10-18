#!/usr/bin/env python3
"""Contract tests for archived evidence verification (synthetic files only)."""
import hashlib
import json
import tempfile
from pathlib import Path
from verify_archived_evidence import verify, EXPECTED

def check():
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        evidence = root / 'review-evidence'
        evidence.mkdir()
        entries = []
        for key in sorted(EXPECTED):
            report = evidence / f'{key}.json'
            screenshot = evidence / f'{key}.png'
            report.write_text(json.dumps({'id': key, 'simulated': True}))
            screenshot.write_bytes(b'synthetic screenshot ' + key.encode())
            entries.append({'id': key, 'automatedStatus': 'PASS',
                            'reportSha256': hashlib.sha256(report.read_bytes()).hexdigest(),
                            'screenshotSha256': hashlib.sha256(screenshot.read_bytes()).hexdigest()})
        index_path = root / 'index.json'
        def save(entries):
            index_path.write_text(json.dumps({'summary': {'evidenceType': 'SIMULATED_AUTOMATED_BROWSER_ONLY',
                                                         'expected': 48, 'automatedPass': 48},
                                              'entries': entries}))
        save(entries)
        assert verify(index_path, evidence) == []
        target = evidence / f'{sorted(EXPECTED)[0]}.png'
        target.write_bytes(b'tampered')
        assert any('mismatch' in e for e in verify(index_path, evidence))
        target.unlink()
        assert any('missing' in e for e in verify(index_path, evidence))
        target.write_bytes(b'synthetic screenshot ' + sorted(EXPECTED)[0].encode())
        save(entries[:-1])
        assert any('coverage' in e for e in verify(index_path, evidence))
        save(entries + [entries[0]])
        assert any('coverage' in e for e in verify(index_path, evidence))
        entries[0]['reportSha256'] = 'invalid'
        save(entries)
        assert any('malformed' in e for e in verify(index_path, evidence))

if __name__ == '__main__':
    check()
    print('Archived evidence verifier contract checks passed')
