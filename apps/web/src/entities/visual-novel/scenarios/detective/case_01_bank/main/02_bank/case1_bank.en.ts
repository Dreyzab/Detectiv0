import type { VNContentPack } from '../../../../../model/types';

export const CASE1_BANK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'arrival': {
            text: 'Bankhaus Krebs stands behind rope lines and controlled entry. The hall is awake, but the witnesses still look half-dreaming.',
            choices: {
                'enter_solo': 'I will make the first pass alone.',
                'enter_duo': 'Clara, with me.'
            }
        },
        'scene_solo_entry': {
            text: 'You step into the marble hall. Silence hangs like a held breath.'
        },
        'scene_duo_entry': {
            text: 'You enter with Clara. Staff and officers adjust immediately to the shift in attention.'
        },
        'victoria_interrupts': {
            text: '"Inspector. Do not start without me."'
        },
        'victoria_intro_dialogue': {
            text: '"Clara von Altenburg. We do this quickly and cleanly. Everyone here wants the wrong story to win."',
            choices: {
                'react_mockery': 'This is police work, not salon theater.',
                'react_surprise': 'Unexpected field assignment for the Mayor family.',
                'react_interest': 'Then show me what you already see.'
            }
        },
        'react_mockery_res': { text: '"You can mock later. For now, keep up."' },
        'react_surprise_res': { text: '"Surprise is useful. It breaks rehearsed lies."' },
        'react_interest_res': { text: '"Good. We start where the story bends."' },

        'bank_hub': {
            text: 'Hall status: [[Galdermann]] near his office, shaken witnesses under guard, vault corridor open. You can triage, run forensics, or reconstruct sequence.',
            choices: {
                'speak_manager': 'Speak with Galdermann.',
                'triage_witnesses': 'Triage witnesses and symptoms.',
                'inspect_vault_forensics': 'Inspect vault forensics.',
                'run_reconstruction': 'Run reconstruction pass.',
                'conclude_investigation': 'Conclude on-site phase.'
            }
        },

        'manager_intro': {
            text: 'Galdermann greets you with precise courtesy. Too precise for a man with an emptied vault.',
            choices: {
                'manager_confront_seed': 'Your name surfaced before I arrived at the bank.',
                'manager_open_case': 'Start with the full incident timeline.'
            }
        },
        'manager_seed_reaction': {
            text: 'A brief flicker crosses his face. "Freiburg talks. That is not evidence."'
        },
        'manager_casefile': {
            text: '"Staff collapsed. Vault breached. Currency missing. We need stability, not theater."',
            choices: {
                'manager_press_hartmann': 'Hartmann appears in multiple traces. Explain.',
                'manager_press_relics': 'Why are municipal collateral shelves empty, not just cash racks?',
                'manager_request_statements': 'I want raw statements, not filtered summaries.'
            }
        },
        'manager_hartmann_reaction': {
            text: '"Hartmann is a clerk. You are building a myth from paperwork."'
        },
        'manager_relic_reaction': {
            text: 'He pauses half a beat. "Inventory panic. Nothing more." You mark a [[clue_relic_gap|municipal relic gap]] in his answer.'
        },
        'manager_dismissive': {
            text: '"You have enough to proceed, Inspector. Leave policy to me."'
        },

        'triage_intro': {
            text: 'Orderlies move through rows of groggy staff. Breath, pupils, tremor. Someone induced a synchronized collapse. You notice [[clue_sleep_agent|sweet sleep agent residue]] near a vent grille and file it under [[Sleep Wave Residue]].'
        },
        'triage_clerk_intro': {
            text: 'Ernst Vogel sits wrapped in a blanket, ink still under his nails. His voice is steady, his hands are not.'
        },
        'triage_clerk': {
            text: '"I locked the vault. Next thing I remember is waking on the floor with everyone else."',
            choices: {
                'ask_about_hartmann': 'Where does Hartmann sit in your internal chain?',
                'ask_about_box_217': 'What was tied to vault box 217?',
                'read_clerk_empathy': '[Empathy] Read what fear he is hiding.',
                'ask_medical_chain': 'Walk me through symptoms and response order.',
                'press_clerk': 'That answer sounds rehearsed. Try again.',
                'leave_triage': 'Return to central hall.'
            }
        },
        'triage_clerk_hartmann_response': {
            text: '"Ledger access and sealed correspondence. Hartmann received urgent envelopes almost daily."'
        },
        'triage_clerk_box217_response': {
            text: '"Policy blocks details, but box 217 was flagged sensitive by management."'
        },
        'triage_clerk_empathy_success': {
            text: 'His fear is not guilt. It is retaliation. He expects someone to come back and finish loose ends.'
        },
        'triage_clerk_empathy_fail': {
            text: 'Fear is obvious, source still uncertain.'
        },
        'triage_clerk_press': {
            text: '"I checked that lock three times. I am not lying."'
        },
        'triage_medic_intro': {
            text: 'A police medic reports synchronized drowsiness, short blackout windows, and delayed panic response.',
            choices: {
                'check_sleep_wave': '[Logic] Classify the sedation pattern.',
                'ask_who_moved_first': 'Who moved first after the blackout broke?',
                'return_to_hub': 'Return to hall.'
            }
        },
        'triage_medic_logic_success': {
            text: 'You map dosage-to-collapse timing. This was controlled spread, not random exposure.'
        },
        'triage_medic_logic_fail': {
            text: 'The symptom window is narrow, but confidence is low without lab confirmation.'
        },
        'triage_medic_timeline': {
            text: 'One witness woke early near a service wall and saw movement vanish into a maintenance recess. Possible hidden egress.'
        },
        'triage_done': {
            text: 'Triage complete. You have enough witness structure to keep moving.'
        },

        'vault_entry': {
            text: 'The vault door is open and deformed. Not smashed - sheared. A [[clue_lock_signature|heat-sheared lock ring]] sits under soot bloom. You label the pattern [[Lock Signature]].'
        },
        'vault_actions': {
            text: 'Vault forensics: lock fracture, residue traces, selective empty cradles, chalk geometry under dust.',
            choices: {
                'examine_lock_logic': '[Logic] Analyze lock breach mechanics.',
                'sense_atmosphere_intuition': '[Intuition] Read residual atmosphere.',
                'compare_chemical_sender': '[Logic] Compare residue with chemical sender clue.',
                'inspect_relic_cradles': '[Imagination] Reconstruct relic extraction pattern.',
                'occult_shivers_check': '[Occultism] Probe the chalk geometry layer.',
                'return_to_hub': 'Return to hall.'
            }
        },
        'vault_logic_success': {
            text: 'No brute pry marks. Controlled heating plus cooling discipline. You also recover torn red velvet near a hinge.'
        },
        'vault_logic_fail': {
            text: 'The mechanism gives partial answers, not certainty.'
        },
        'vault_intuition_success': {
            text: 'Sweet-metal afterscent over industrial dust. The room reads staged, not chaotic.'
        },
        'vault_intuition_fail': {
            text: 'Interference is real, pattern still blurred.'
        },
        'vault_sender_match_success': {
            text: 'Sender clue and residue profile align. Breisgau chain access is likely.'
        },
        'vault_sender_match_fail': {
            text: 'Plausible linkage, weak confidence. Needs corroboration.'
        },
        'vault_relic_success': {
            text: 'Cradles were emptied by category, not speed. You mark [[clue_relic_gap|relic shelf gaps]] as the true targeting signal.'
        },
        'vault_relic_fail': {
            text: 'Removal pattern is visible, motive hierarchy remains uncertain.'
        },
        'vault_occult_success': {
            text: 'The chalk geometry reads like scene control - a signature meant for someone specific.'
        },
        'vault_occult_fail': {
            text: 'Chalk and conjecture. No stable conclusion yet.'
        },
        'vault_leave': {
            text: 'You step back into the hall with tighter forensic anchors.'
        },

        'reconstruction_intro': {
            text: 'You sketch movement lanes on a clerk slate: entry, sedation spread, vault breach, extraction, exit.'
        },
        'reconstruction_table': {
            text: 'Reconstruction pass can now test the weak links in the official narrative.',
            choices: {
                'rebuild_entry_vector': '[Imagination] Rebuild likely entry vector.',
                'stress_test_timeline': '[Logic] Stress-test official timeline.',
                'check_witness_overlap': '[Empathy] Compare witness distortions.',
                'return_to_hub': 'Return to hall.'
            }
        },
        'reconstruction_entry_success': {
            text: 'You isolate a service recess behind inspection paneling: likely [[clue_hidden_slot|hidden transfer slot]].'
        },
        'reconstruction_entry_fail': {
            text: 'Too many plausible routes, not enough hard anchors.'
        },
        'reconstruction_timeline_success': {
            text: 'Official timeline collapses under sequence pressure. Theft window was shorter than reported.'
        },
        'reconstruction_timeline_fail': {
            text: 'Timeline still holds at coarse resolution.'
        },
        'reconstruction_overlap_success': {
            text: 'Witness language converges around one sensation: sweet drowsy onset before blackout.'
        },
        'reconstruction_overlap_fail': {
            text: 'Witness noise remains high. You keep only broad correlation.'
        },
        'reconstruction_done': {
            text: 'Reconstruction notes filed. You can now pressure downstream leads with cleaner hypotheses.'
        },

        'bank_conclusion': {
            text: 'On-site package complete. You are ready to open field leads.'
        },
        'bank_conclusion_summary': {
            text: 'Lead A: velvet and lock signature -> tailor network. Lead B: sleep-agent residue -> apothecary chain. Lead C: witness logistics -> pub inquiry. Cash loss is cover; targeted relic extraction is the real signal.'
        }
    }
};

export default CASE1_BANK_EN;
