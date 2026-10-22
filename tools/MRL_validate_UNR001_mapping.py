"""MRL / origin_signature: MrLiouWord. Read-only proposal/source audit.

Uses existing codex validator and convergence; does not approve semantic mappings.
Notion hashes are capture hashes, not original exports or authorship proofs.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from mrl_pipeline.codex import load_essence_index, validate_codex
from mrl_pipeline.runners.converge import regenerate

PROPOSAL = ROOT / 'registry/proposals/MRL_UNR001_CROSS_LAYER_MAPPING_20261022_R01.json'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def pointer(doc, selector):
    for key in selector.split('/')[1:]:
        key = key.replace('~1', '/').replace('~0', '~')
        doc = doc[int(key)] if isinstance(doc, list) else doc[key]
    return doc

def audit(proposal=None):
    p = proposal if proposal is not None else json.loads(PROPOSAL.read_text())
    cpath = ROOT / 'registry/MRL_PARTICLE_CODEX.json'
    c = json.loads(cpath.read_text())
    errors = []
    def require(ok, message):
        if not ok:
            errors.append(message)
    raw = ROOT / 'ingest/2026-10-21/raw/PARTICLE_ESSENCE_INDEX_v2.json'
    essence = load_essence_index(str(raw))
    errors.extend(validate_codex(c, [e['◎'] for e in essence['essence']]))
    rebuilt = regenerate(str(ROOT))
    require(c['particles'] == rebuilt['particles'], 'particle regeneration drift')
    require(c['genesis']['sources'] == rebuilt['genesis']['sources'], 'genesis source metadata drift')
    require(len(c['particles']) == 31, 'baseline particle count changed')
    require(p['status'] == 'proposed' and p['canonical'] is False, 'proposal promoted')
    require(p['root_owner_approval'] is None, 'approval must be explicitly reviewed')
    require(p['unresolved_status'] == 'UNRESOLVED', 'UNR-001 closed without decision')
    require(p['canonical_authority'] == 'Mr.liou' and p['origin_signature'] == 'MrLiouWord', 'authority mismatch')
    require(p['codex_version'] == c['version'], 'version mismatch')
    require(len(p['particle_inventory']) == len(c['particles']), 'inventory count mismatch')
    for expected, row in zip(c['particles'], p['particle_inventory']):
        for key in ('id', 'name', 'layer', 'layer_scheme', 'status', 'definition', 'provenance', 'supersedes'):
            require(row.get(key) == expected.get(key), f"{expected['id']}: {key} changed")
        require(row.get('classification_evidence_level') == 'INFERENCE', 'classification overclaims')
        require(set(row['proposed_axes']) <= {a['id'] for a in p['axes']}, 'unknown axis')
    docs = {}
    for s in p['sources']:
        path = ROOT / s['path']
        require(path.is_file(), 'missing source: ' + s['path'])
        if not path.is_file():
            continue
        raw_bytes = path.read_bytes()
        require(digest(path) == s['sha256'], 'source hash mismatch: ' + s['path'])
        require(len(raw_bytes) == s['size_bytes'], 'source size mismatch: ' + s['path'])
        blob = hashlib.sha1(b'blob ' + str(len(raw_bytes)).encode() + b'\0' + raw_bytes).hexdigest()
        require(blob == s['git_blob_sha'], 'git blob mismatch: ' + s['path'])
        if path.suffix == '.json':
            docs[s['id']] = essence if path == raw else json.loads(raw_bytes)
    for s in p['notion_sources']:
        require(len(s['capture_sha256']) == 64 and s['capture_size_bytes'] > 0, 'missing Notion capture hash')
        require(s['original_export_sha256'] is None, 'Notion export hash overclaim')
        require(all(e['text'] for e in s['evidence_excerpts']), 'empty Notion excerpt')
    nodes = {n['id']: n for n in p['scheme_nodes']}
    require(len(nodes) == len(p['scheme_nodes']), 'duplicate node')
    notion = {s['id']: s for s in p['notion_sources']}
    for n in nodes.values():
        try:
            if n['selector_type'] == 'json_pointer':
                value = pointer(docs[n['source']], n['selector'])
                require(value == n['label'], 'node label/source mismatch: ' + n['id'])
            else:
                require(any(n['selector'] in e['text'] for e in notion[n['source']]['evidence_excerpts']), 'Notion node excerpt missing: ' + n['id'])
        except (KeyError, IndexError, ValueError, TypeError):
            errors.append('unresolvable node: ' + n['id'])
    relation_ids = set()
    for r in p['relations']:
        require(r['id'] not in relation_ids, 'duplicate relation')
        relation_ids.add(r['id'])
        require(r['from'] in nodes and r['to'] in nodes, 'dangling relation')
        require(r['evidence_nodes'] == [r['from'], r['to']], 'relation evidence mismatch')
        require(r['status'] == 'proposed' and r['equivalent'] is False and r['evidence_level'] == 'INFERENCE', 'relation overclaims')
    return {'ok': not errors, 'errors': errors, 'particles': len(c['particles']),
            'inventory_coverage': len(p['particle_inventory']) / len(c['particles']),
            'relations': len(p['relations']), 'source_files': len(p['sources']),
            'genesis_metadata_equal': c['genesis']['sources'] == rebuilt['genesis']['sources'],
            'unresolved_status': p['unresolved_status'],
            'semantic_approval': False, 'original_binary_archives_rehashed': False}

if __name__ == '__main__':
    result = audit()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0 if result['ok'] else 1)
