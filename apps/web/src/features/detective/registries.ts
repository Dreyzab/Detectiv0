
import type { Evidence } from './dossier/store';

export const EVIDENCE_REGISTRY: Record<string, Evidence> = {
    'ev_torn_fabric': {
        id: 'ev_torn_fabric',
        name: 'Torn Fabric',
        description: 'A piece of expensive fabric found near the vault.',
        packId: 'fbg1905'
    },
    // Add more here as needed
};
