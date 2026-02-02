// Hardlink types and mock data
import type { DossierEntry, Evidence } from './dossier/store';

export type HardlinkAction =
    | { type: 'start_vn'; scenarioId: string }
    | { type: 'grant_evidence'; evidence: Evidence }
    | { type: 'unlock_point'; pointId: string }
    | { type: 'add_flags'; flags: Record<string, boolean> }
    | { type: 'start_battle'; scenarioId: string; deckType: string }
    | { type: 'unlock_entry'; entry: DossierEntry };

export interface HardlinkDefinition {
    id: string;
    packId: string;
    actions: HardlinkAction[];
}

export const HARDLINKS: Record<string, HardlinkAction[]> = {
    // Case 1: The Robbery
    'CASE01_BRIEFING_01': [
        { type: 'start_vn', scenarioId: 'detective_case1_briefing' },
        { type: 'unlock_point', pointId: 'hauptbahnhof' },
        { type: 'add_flags', flags: { 'case01_started': true } }
    ],
    'CASE01_BANK_02': [
        { type: 'start_vn', scenarioId: 'detective_case1_bank_scene' },
        { type: 'unlock_point', pointId: 'p_bank' },
        {
            type: 'grant_evidence',
            evidence: {
                id: 'ev_torn_fabric',
                name: 'Torn Fabric',
                description: 'A piece of expensive fabric found near the vault.',
                packId: 'fbg1905'
            }
        }
    ],
    'CASE01_PUB_03': [
        { type: 'start_vn', scenarioId: 'detective_case1_pub_rumors' },
        { type: 'unlock_point', pointId: 'ganter_brauerei' }
    ],
    'CASE01_ARCHIVE_04': [
        { type: 'start_vn', scenarioId: 'detective_case1_archive_search' },
        { type: 'unlock_point', pointId: 'rathaus_archiv' },
        { type: 'unlock_point', pointId: 'stuhlinger_warehouse' } // Leads to finale
    ],
    'CASE01_WAREHOUSE_05': [
        { type: 'start_vn', scenarioId: 'detective_case1_warehouse_finale' }
    ],

    // Map Point Bindings (Direct ID matches)
    'p_bank': [
        { type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }
    ],

    // Test/Debug
    'TEST_BATTLE_01': [
        { type: 'start_battle', scenarioId: 'detective_skirmish', deckType: 'detective' }
    ]
};

export const resolveHardlink = (fullId: string): HardlinkAction[] | null => {
    // Format: gw3:hardlink:{packId}:{hardlinkId}
    // Simplified for prototype: Just look up by the last part or exact match

    // Try direct match first (for manual entry)
    if (HARDLINKS[fullId]) return HARDLINKS[fullId];

    // Try parsing simple ID from specific format
    const parts = fullId.split(':');
    const id = parts[parts.length - 1]; // Take the last part

    return HARDLINKS[id] || null;
};
