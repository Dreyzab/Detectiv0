import type { VNContentPack } from '../../../../../model/types';

export const LEAD_APOTHECARY_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entrance': {
            text: 'The [[Löwen-Apotheke]] is a temple of medicine and mystery. Shelves of colored bottles stretch to the ceiling. The air smells of camphor, mint, and something sharper beneath.'
        },
        'apothecary_greets': {
            text: 'An elderly man in a white coat emerges from the back room. "Welcome. I am [[Adalbert Weiss]]. How may I assist you?"',
            choices: {
                'show_residue': 'Show the strange powder from the vault',
                'ask_poisons': '"What do you know about poisons?"',
                'ask_chemicals': '"I need information about industrial chemicals."',
                'leave_shop': 'Leave'
            }
        },

        // SHOW RESIDUE
        'show_residue_scene': {
            text: 'I carefully unwrap the sample. "Can you identify this substance? It was found at a crime scene."'
        },
        'apothecary_examines': {
            text: 'Weiss puts on a pair of spectacles and examines the powder. He sniffs it cautiously, then places a pinch in a glass dish.'
        },
        'apothecary_tests': {
            text: 'He adds a few drops of acid. The mixture fizzes, releasing a pungent gas. "Interesting. Very interesting."'
        },
        'apothecary_result': {
            text: '"This is [[ammonium nitrate]] mixed with [[charcoal]]. A crude explosive — less powerful than dynamite, but easier to make. And no licensed supplier would sell this mixture."',
            choices: {
                'forensics_check': '[Forensics] Analyze the specific composition',
                'ask_source': '"Where would someone obtain this?"',
                'thank_leave': 'Thank him and leave'
            }
        },
        'forensics_success': {
            text: 'The ratio is precise. Too precise for random mixing. Someone followed a formula — likely from a chemistry textbook or research paper.'
        },
        'forensics_fail': {
            text: 'The analysis confirms it\'s an explosive mixture, but the specific source remains unclear.'
        },
        'apothecary_source': {
            text: '"The components can be bought separately — fertilizer from farmers, charcoal from any smithy. But this mixture... it would take knowledge of chemistry to combine them safely."'
        },
        'apothecary_university': {
            text: '"In fact... this ratio. It looks familiar." He pulls a journal from his shelf. "Last year, Professor [[Kiliani]] at the university published a paper on controlled combustion. This is very similar to his work."'
        },

        // ALTERNATIVES
        'ask_poisons': {
            text: '"Poisons? I am a licensed pharmacist, mein Herr. I deal in medicines. Though... certain substances can cure or kill, depending on the dose."'
        },
        'ask_chemicals': {
            text: '"Industrial chemicals? I stock pharmaceuticals, not factory supplies. But I may know someone who deals in such things. For the right consideration."'
        }
    }
};

export default LEAD_APOTHECARY_EN;
