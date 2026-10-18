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
            report.write_text(json.dumps({'id': key, 'simulated': True, 'gitSha': 'a'*40, 'axeViolations': [], 'dimensions': {'viewportWidth': int(key.split('-')[1]), 'documentWidth': int(key.split('-')[1])}}))
            screenshot.write_bytes(b'synthetic screenshot ' + key.encode())
            entries.append({'id': key, 'automatedStatus': 'PASS',
                            'sourceSha': 'a'*40, 'reportExists': True, 'screenshotExists': True, 'violations': 0,
                            'reportSha256': hashlib.sha256(report.read_bytes()).hexdigest(),
                            'screenshotSha256': hashlib.sha256(screenshot.read_bytes()).hexdigest()})
        index_path = root / 'index.json'
        def save(entries):
            index_path.write_text(json.dumps({'summary': {'evidenceType': 'SIMULATED_AUTOMATED_BROWSER_ONLY',
                                                         'expectedSourceSha': 'a'*40, 'observedSourceShas': ['a'*40],
                                                         'expected': 48, 'captured': 48, 'automatedPass': 48,
                                                         'automatedFailures': 0, 'missingOrInvalid': 0},
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


        entries[0]['reportSha256'] = hashlib.sha256((evidence / f"{entries[0]['id']}.json").read_bytes()).hexdigest()
        entries[0]['sourceSha'] = 'b'*40
        save(entries)
        assert any('index source SHA mismatch' in e for e in verify(index_path, evidence))
        entries[0]['sourceSha'] = 'a'*40
        save(entries)
        data = json.loads(index_path.read_text())
        data['summary']['expectedSourceSha'] = 'invalid'
        index_path.write_text(json.dumps(data))
        assert any('malformed expected source SHA' in e for e in verify(index_path, evidence))
        save(entries)
        report = evidence / f"{entries[0]['id']}.json"
        payload = json.loads(report.read_text())
        payload['gitSha'] = 'b'*40
        report.write_text(json.dumps(payload))
        entries[0]['reportSha256'] = hashlib.sha256(report.read_bytes()).hexdigest()
        save(entries)
        assert any('report source SHA mismatch' in e for e in verify(index_path, evidence))

if __name__ == '__main__':
    check()
    print('Archived evidence verifier contract checks passed')
