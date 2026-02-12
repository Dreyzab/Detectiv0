import type { Evidence } from './dossier/store';

export const EVIDENCE_REGISTRY: Record<string, Evidence> = {
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
