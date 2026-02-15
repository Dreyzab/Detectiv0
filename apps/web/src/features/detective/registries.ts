import type { Evidence } from './dossier/store';

export const EVIDENCE_REGISTRY: Record<string, Evidence> = {
    // Core Case 01 compatibility IDs
    'shard_glass': {
        id: 'shard_glass',
        name: 'Glass Shard',
        description: 'A sharp shard retrieved near the break-in site.',
        packId: 'fbg1905'
    },
    'factory_sample': {
        id: 'factory_sample',
        name: 'Factory Glass Sample',
        description: 'Reference sample from a known factory production batch.',
        packId: 'fbg1905'
    },
    'ledger_page': {
        id: 'ledger_page',
        name: 'Ledger Page',
        description: 'A page of coded account entries from the bank ledgers.',
        packId: 'fbg1905'
    },
    'cipher_key': {
        id: 'cipher_key',
        name: 'Cipher Key',
        description: 'A handwritten key for decoding numeric substitutions.',
        packId: 'fbg1905'
    },
    'unknown_powder': {
        id: 'unknown_powder',
        name: 'Unknown Powder',
        description: 'A powder sample collected for laboratory analysis.',
        packId: 'fbg1905'
    },
    'reagent_kit': {
        id: 'reagent_kit',
        name: 'Reagent Kit',
        description: 'Portable reagent kit used for field chemical tests.',
        packId: 'fbg1905'
    },

    'ev_torn_fabric': {
        id: 'ev_torn_fabric',
        name: 'Torn Fabric',
        description: 'A piece of expensive fabric found near the vault.',
        packId: 'fbg1905'
    },

    // Karlsruhe Sandbox: Banker Case
    'ev_banker_debt_note': {
        id: 'ev_banker_debt_note',
        name: 'Debt Note',
        description: 'A torn debt note signed with the initial W and tied to urgent repayments.',
        packId: 'ka1905'
    },
    'ev_banker_pawn_receipt': {
        id: 'ev_banker_pawn_receipt',
        name: 'Pawnshop Receipt',
        description: 'Receipts proving Friedrich pawned family valuables before the reported losses.',
        packId: 'ka1905'
    },
    'ev_banker_tavern_testimony': {
        id: 'ev_banker_tavern_testimony',
        name: 'Tavern Testimony',
        description: 'A witness account linking Friedrich to escalating gambling debts.',
        packId: 'ka1905'
    },
    'ev_banker_croupier_ledger': {
        id: 'ev_banker_croupier_ledger',
        name: 'Croupier Ledger Fragment',
        description: 'A ledger scrap tying Friedrich to an intermediary marked with initial W.',
        packId: 'ka1905'
    },

    // Karlsruhe Sandbox: Dog Case
    'ev_dog_butcher_note': {
        id: 'ev_dog_butcher_note',
        name: 'Butcher Note',
        description: 'The butcher confirms Bruno visits daily and leaves toward the bakery lane.',
        packId: 'ka1905'
    },
    'ev_dog_vendor_tip': {
        id: 'ev_dog_vendor_tip',
        name: 'Vendor Tip',
        description: 'Market vendors report Bruno circling sausage stalls before darting into side lanes.',
        packId: 'ka1905'
    },
    'ev_dog_meat_wrapping': {
        id: 'ev_dog_meat_wrapping',
        name: 'Grease-Stained Wrapping',
        description: 'A butcher wrapping with bakery flour traces, likely carried by Bruno.',
        packId: 'ka1905'
    },
    'ev_dog_flour_trail': {
        id: 'ev_dog_flour_trail',
        name: 'Flour Paw Trail',
        description: 'Fresh paw marks coated with flour leading toward Schlossgarten.',
        packId: 'ka1905'
    },
    'ev_dog_mayor_tag': {
        id: 'ev_dog_mayor_tag',
        name: 'Mayor Seal Collar Tag',
        description: 'An official Rathaus collar seal proving Bruno belongs to the mayor.',
        packId: 'ka1905'
    },
    'ev_dog_hay_fur': {
        id: 'ev_dog_hay_fur',
        name: 'Hay-Soaked Fur',
        description: 'Coarse fur caught in hay bales at the old stables. Could be Bruno, could be another mastiff.',
        packId: 'ka1905'
    },
    'ev_dog_river_prints': {
        id: 'ev_dog_river_prints',
        name: 'Riverbank Paw Prints',
        description: 'Wide paw marks near the docks. The trail breaks abruptly by a fish cart.',
        packId: 'ka1905'
    },
    'ev_dog_laundry_thread': {
        id: 'ev_dog_laundry_thread',
        name: 'Laundry Service Thread',
        description: 'A coarse thread with flour residue from laundry sacks in a side service lane.',
        packId: 'ka1905'
    },

    // Karlsruhe Sandbox: Ghost Case
    'ev_cold_draft': {
        id: 'ev_cold_draft',
        name: 'Unnatural Draft',
        description: 'An impossibly cold draft in a sealed room. No windows or vents explain it.',
        packId: 'ka1905'
    },
    'ev_hidden_passage': {
        id: 'ev_hidden_passage',
        name: 'Hidden Passage',
        description: 'A concealed passage behind the fireplace with signs of recent use.',
        packId: 'ka1905'
    },
    'ev_servant_testimony': {
        id: 'ev_servant_testimony',
        name: "Servant's Testimony",
        description: 'The maid reports nightly sounds from the cellar and a figure in the corridor.',
        packId: 'ka1905'
    },
    'ev_ectoplasm_residue': {
        id: 'ev_ectoplasm_residue',
        name: 'Ectoplasm Residue',
        description: 'A luminescent residue on the walls that remains cold to the touch.',
        packId: 'ka1905'
    }
};
