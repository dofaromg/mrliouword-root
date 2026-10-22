"""MRL / MrLiouWord: prevent proposal promotion and source/identity drift."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('mapping', ROOT / 'tools/MRL_validate_UNR001_mapping.py')
mapping = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mapping)

class MappingEvidenceTest(unittest.TestCase):
    def setUp(self):
        self.p = json.loads(mapping.PROPOSAL.read_text())

    def test_source_consistency(self):
        self.assertTrue(mapping.audit(self.p)['ok'])

    def test_layer_number_cannot_promote_to_equivalence(self):
        self.p['relations'][0]['equivalent'] = True
        self.assertFalse(mapping.audit(self.p)['ok'])

    def test_source_hash_tampering_rejected(self):
        self.p['sources'][0]['sha256'] = '0' * 64
        self.assertFalse(mapping.audit(self.p)['ok'])

    def test_inventory_cannot_rename_or_remap_particle(self):
        self.p['particle_inventory'][0]['layer_scheme'] = 'blueprint_v1.0'
        self.assertFalse(mapping.audit(self.p)['ok'])

    def test_unreviewed_resolution_rejected(self):
        self.p['unresolved_status'] = 'RESOLVED'
        self.assertFalse(mapping.audit(self.p)['ok'])

    def test_dangling_mapping_rejected(self):
        self.p['relations'][0]['to'] = 'MRL-PC-9999'
        self.assertFalse(mapping.audit(self.p)['ok'])

    def test_source_selector_label_drift_rejected(self):
        self.p['scheme_nodes'][0]['label'] = 'Seed'
        self.assertFalse(mapping.audit(self.p)['ok'])

if __name__ == '__main__':
    unittest.main(verbosity=2)
