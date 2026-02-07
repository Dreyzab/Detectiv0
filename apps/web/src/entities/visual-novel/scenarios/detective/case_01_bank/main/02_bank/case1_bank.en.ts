import type { VNContentPack } from '../../../../../model/types';

export const CASE1_BANK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'arrival': {
            text: 'Bankhaus J.A. Krebs. The crime scene. Morning air, locked faces, too much silence.',
            choices: {
                'enter_solo': 'I will take the first pass alone.',
                'enter_duo': 'Victoria, with me.'
            }
        },
        'scene_solo_entry': {
            text: 'You push through the brass doors. The hall feels staged, as if everyone rehearsed this calm.'
        },
        'scene_duo_entry': {
            text: 'You enter with Victoria. She scans exits first, people second.'
        },
        'victoria_interrupts': {
            text: '"Inspector! Wait. Do not start without me."'
        },
        'victoria_intro_dialogue': {
            text: '"Victoria Sterling. The Mayor asked me to support your investigation."',
            choices: {
                'react_mockery': 'This is police work, not society theater.',
                'react_surprise': 'Unexpected assignment for the Mayor\'s family.',
                'react_interest': 'Then show me what you have noticed.'
            }
        },
        'react_mockery_res': {
            text: '"Noted. I still know this city better than you."'
        },
        'react_surprise_res': {
            text: '"Surprise is useful when people hide things."'
        },
        'react_interest_res': {
            text: '"Good. Then let us work."'
        },

        'bank_hub': {
            text: 'Main hall overview: [[Galdermann]] near his office, [[Vogel]] at the counter, [[vault door]] open.',
            choices: {
                'speak_manager': 'Speak with Galdermann',
                'speak_clerk': 'Question Vogel',
                'inspect_vault': 'Inspect the vault',
                'conclude_investigation': 'Conclude on-site phase'
            }
        },

        'manager_intro': {
            text: 'Galdermann greets you with polished courtesy and careful distance.',
            choices: {
                'manager_confront_seed': 'Your name surfaced before I reached this bank.',
                'manager_open_case': 'Start with the timeline.'
            }
        },
        'manager_seed_reaction': {
            text: 'A flicker crosses his face. "I am known in Freiburg. That proves nothing."'
        },
        'manager_about_robbery': {
            text: '"No forced entry. Vault opened cleanly. Most likely internal negligence."',
            choices: {
                'manager_press_hartmann': 'Hartmann appears in multiple traces. Explain.',
                'manager_request_statements': 'I want raw statements, not summaries.'
            }
        },
        'manager_hartmann_reaction': {
            text: '"[[Hartmann]] is a routine clerk. Gossip inflates ordinary names."'
        },
        'manager_dismissive': {
            text: '"My clients require confidence. You have enough to continue, Inspector."'
        },

        'clerk_intro': {
            text: 'Ernst Vogel looks exhausted. Ink on his fingers, fear in his posture.'
        },
        'clerk_nervous': {
            text: '"I locked the vault myself. In the morning it was open. No damage, no noise."',
            choices: {
                'ask_about_hartmann': 'Who exactly is Hartmann in this operation?',
                'ask_about_box_217': 'What was in vault box 217?',
                'read_clerk_empathy': '[Empathy] Read his fear.',
                'press_clerk': 'That sounds rehearsed. Try again.',
                'leave_clerk': 'Enough for now.'
            }
        },
        'clerk_hartmann_response': {
            text: '"Ledger access. Trusted. Lately [[Hartmann]] got sealed letters almost daily."'
        },
        'clerk_box217_response': {
            text: '"Private box policy is strict... but [[box 217]] was marked sensitive by management."'
        },
        'clerk_empathy_success': {
            text: 'This is not guilt. It is fear of retaliation. He saw movement connected to the robbery.'
        },
        'clerk_empathy_fail': {
            text: 'Fear is obvious, source unclear.'
        },
        'clerk_revelation': {
            text: '"Ask Gustav, the Bächleputzer. Dawn shift. He saw a shadow near the bank."'
        },
        'clerk_closes_up': {
            text: 'He withdraws behind procedure and refuses to elaborate.'
        },
        'clerk_press': {
            text: '"I checked the lock three times. I am not lying."'
        },
        'clerk_done': {
            text: 'You have extracted what Vogel will give today.'
        },

        'vault_inspection': {
            text: 'Open vault. Intact mechanism. Empty boxes. Traces remain if you read them correctly.',
            choices: {
                'examine_lock_logic': '[Logic] Analyze lock operation.',
                'sense_atmosphere_intuition': '[Intuition] Read the room for irregularities.',
                'compare_chemical_sender': '[Logic] Compare residue with the chemical-works sender clue.',
                'return_to_hub': 'Return to hall.'
            }
        },
        'vault_logic_success': {
            text: 'No brute force. Controlled access. You also recover a torn red velvet fiber.'
        },
        'vault_logic_fail': {
            text: 'The mechanism yields no immediate explanation.'
        },
        'vault_intuition_success': {
            text: 'Bitter almond note in the air. Industrial powder residue on the floor grid.'
        },
        'vault_intuition_fail': {
            text: 'You sense interference, but cannot isolate it.'
        },
        'vault_sender_match_success': {
            text: 'Sender clue and residue profile align. This points to [[Breisgau Chemical Works]] access, not random burglary.'
        },
        'vault_sender_match_fail': {
            text: 'Plausible connection, insufficient confidence. Needs corroboration.'
        },

        'vault_occult_discovery': {
            text: 'Under the residue you spot chalk geometry: deliberate symbols, not accidental marks.'
        },
        'vault_occult_victoria': {
            text: 'Victoria kneels near the symbols. "Patterned, structured, and deliberate. Someone left this on purpose."',
            choices: {
                'occult_shivers_check': '[Occultism] Listen to what the pattern implies.',
                'dismiss_occult': 'Ignore theatrics. Stay with hard evidence.',
                'ask_victoria_occult': 'Give me your technical reading.'
            }
        },
        'vault_shivers_success': {
            text: 'The symbols feel intentional in a way that exceeds intimidation. Signature, warning, or ritual marker.'
        },
        'vault_shivers_fail': {
            text: 'Nothing resolves beyond chalk and conjecture.'
        },
        'vault_dismiss_theatrics': {
            text: 'You reject the symbolic layer and refocus on procedural evidence.'
        },
        'vault_victoria_analysis': {
            text: 'Victoria maps several alchemical references and records an unknown formula for later decoding.'
        },

        'vault_continue': {
            text: 'The vault still has open questions.',
            choices: {
                'examine_lock_logic': '[Logic] Re-check lock details.',
                'sense_atmosphere_intuition': '[Intuition] Re-check atmospheric trace.',
                'compare_chemical_sender': '[Logic] Re-test sender to residue link.',
                'return_to_hub': 'Leave vault.'
            }
        },
        'vault_leave': {
            text: 'You step back into the hall with a tighter evidence chain than before.'
        },

        'bank_conclusion': {
            text: 'On-site phase complete. Lead package is ready.'
        },
        'bank_conclusion_summary': {
            text: 'Lead A: red velvet -> tailor network. Lead B: chemical residue -> apothecary analysis. Lead C: Bächleputzer sighting -> pub inquiry. [[Hartmann]] and [[Galdermann]] remain active watch names.'
        }
    }
};

export default CASE1_BANK_EN;

