import type { VNContentPack } from '../../../../../model/types';

export const LEAD_APOTHECARY_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entrance': {
            text: 'The Lowen-Apotheke is dense with glassware, herbs, and sharp medicinal smells.'
        },
        'apothecary_greets': {
            text: 'An elderly man in a white coat steps forward. "Adalbert Weiss. State your need."',
            choices: {
                'show_residue': 'Show powder recovered at the bank vault.',
                'ask_sender_manifest': '"Have you seen shipments from Breisgau Chemical Works?"',
                'ask_hartmann_procurement': '"Any chemical orders routed through a bank contact named Hartmann?"',
                'ask_sleep_agent_profile': '"Could this profile produce synchronized sleep without fatalities?"',
                'ask_relic_chain': '"Could chemical prep support targeted relic extraction?"',
                'ask_poisons': '"What poison traffic passes through this district?"',
                'ask_chemicals': '"Who supplies industrial reagents nearby?"',
                'leave_shop': 'Leave.'
            }
        },

        'show_residue_scene': {
            text: 'You unwrap the sample. "Identify this."'
        },
        'apothecary_examines': {
            text: 'Weiss inspects, smells, and measures the grains in silence.'
        },
        'apothecary_tests': {
            text: 'A reagent drop hits the powder. The mixture fizzes and releases a bitter note.'
        },
        'apothecary_result': {
            text: '"Ammonium nitrate with charcoal. Crude explosive blend. Not standard legal inventory."',
            choices: {
                'forensics_check': '[Senses] Analyze ratio and formulation.',
                'crosscheck_sender_chain': '"Cross-check this with the Breisgau sender trace."',
                'crosscheck_lock_signature': '"Would this chain also explain controlled lock cooling?"',
                'ask_source': '"Where would an operator source this mix?"',
                'thank_leave': 'Thank him and leave.'
            }
        },
        'apothecary_sender_manifest': {
            text: 'Weiss nods once. "Yes. Small sealed lots, irregular schedule, intermediary billing."'
        },
        'apothecary_hartmann_reply': {
            text: '"Hartmann appears in settlement slips, not direct orders. Clerk-level name, high-sensitivity routing."'
        },
        'apothecary_sleep_agent_reply': {
            text: 'Weiss taps the sample tray. "Yes. Sedative-adjacent compounds can be aerosolized in low mortality windows if dosage discipline is strict."'
        },
        'apothecary_relic_gap_reply': {
            text: '"If relic crates were handled, preservative wraps and anti-corrosion salts would be pre-positioned. That implies planning."' 
        },
        'forensics_success': {
            text: 'The ratio is disciplined and reproducible. This came from trained hands, not improvisation.'
        },
        'apothecary_sender_crosscheck': {
            text: 'Weiss aligns your sender clue with his records. "Then the chain points toward university-adjacent procurement."'
        },
        'apothecary_lock_signature_reply': {
            text: '"Possible. Cooling baths for metal control use compounds my regular clients do not buy in that volume."'
        },
        'forensics_fail': {
            text: 'Explosive confirmed. Source precision remains uncertain.'
        },
        'apothecary_source': {
            text: '"Inputs are common. Safe combination requires chemical competence and controlled access."'
        },
        'apothecary_university': {
            text: 'He opens a journal and taps a formula line. "Kiliani\'s combustion work. This profile is too close to ignore."'
        },

        'ask_poisons': {
            text: '"Dose defines poison. Most killers misuse ordinary compounds."'
        },
        'ask_chemicals': {
            text: '"Factories, labs, and smugglers all claim clean ledgers. Only one of those is usually true."'
        }
    }
};

export default LEAD_APOTHECARY_EN;
