import type { VNContentPack } from '../../model/types';

export const CASE1_BANK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        // ─────────────────────────────────────────────────────────────
        // ARRIVAL
        // ─────────────────────────────────────────────────────────────
        'arrival': {
            text: 'Bankhaus J.A. Krebs. The crime scene. The morning air is cold.',
            choices: {
                'enter_solo': 'Time to get to work.',
                'enter_duo': 'Let\'s go inside, Victoria.'
            }
        },
        'scene_solo_entry': {
            text: 'I push open the heavy doors. The silence inside is heavy, oppressive. I prefer working alone at first.'
        },
        'scene_duo_entry': {
            text: 'We step inside together. Victoria looks around, unfazed by the grandeur or the tension.'
        },
        'victoria_interrupts': {
            text: 'Inspector! Wait! Don\'t start without me!'
        },
        'victoria_intro_dialogue': {
            text: 'I am [[Victoria Sterling]]. My uncle... the Mayor... insisted I assist you. I promise not to get in the way.',
            choices: {
                'react_mockery': 'This is an investigation, not a finishing school.',
                'react_surprise': 'I did not expect the Mayor\'s kin to do dirty work.',
                'react_interest': 'Let us see if you have the eyes for this work.'
            }
        },
        'react_mockery_res': { text: 'I have read all your case files, Inspector. Do not underestimate me.' },
        'react_surprise_res': { text: 'Surprises can be useful in our line of work, Inspector.' },
        'react_interest_res': { text: 'I will not disappoint you. I found something already, actually.' },

        // ─────────────────────────────────────────────────────────────
        // BANK HUB
        // ─────────────────────────────────────────────────────────────
        'bank_hub': {
            text: 'The [[grand hall]] of Bankhaus Krebs lacks its usual bustle. Herr [[Galdermann]] stands near his office. A [[nervous clerk]] fidgets by the counter. The [[heavy vault door]] is ajar.',
            choices: {
                'speak_manager': 'Speak with Herr Galdermann',
                'speak_clerk': 'Question the clerk',
                'inspect_vault': 'Examine the vault',
                'conclude_investigation': 'I have seen enough here.'
            }
        },

        // ─────────────────────────────────────────────────────────────
        // MANAGER DIALOGUE
        // ─────────────────────────────────────────────────────────────
        'manager_intro': {
            text: 'Herr Galdermann eyes you with the practiced warmth of a man who has smiled at debtors before foreclosing on them.'
        },
        'manager_about_robbery': {
            text: '"A regrettable incident, Inspector. The vault was opened without force. An inside job, surely. I suggest you question the staff."'
        },
        'manager_dismissive': {
            text: '"Now if you will excuse me, I have clients to reassure. The police have already taken all [[the statements]] they need."'
        },

        // ─────────────────────────────────────────────────────────────
        // CLERK INTERROGATION
        // ─────────────────────────────────────────────────────────────
        'clerk_intro': {
            text: 'The young clerk — [[Ernst Vogel]], according to his nameplate — looks like he hasn\'t slept in days. His hands tremble as he sorts papers.'
        },
        'clerk_nervous': {
            text: '"I... I was on night duty, Inspector. I swear I [[locked the vault]]! But this morning, it was just... open. Like magic."',
            choices: {
                'read_clerk_empathy': '[Empathy] He\'s hiding something. Read his fear.',
                'press_clerk': 'You expect me to believe magic opened that vault?',
                'leave_clerk': 'That will be all for now.'
            }
        },
        'clerk_empathy_success': {
            text: 'His eyes dart to the door. Not guilt — that\'s terror. He saw something that night. Someone. And he\'s afraid they\'ll come back.'
        },
        'clerk_empathy_fail': {
            text: 'You can\'t quite read him. The fear is real, but its source remains opaque.'
        },
        'clerk_revelation': {
            text: '"There\'s a man... Gustav. The [[Bächleputzer]]. He cleans the water channels at dawn. He told me... he said he saw a [[shadow]] near the bank that night. A figure in black."'
        },
        'clerk_closes_up': {
            text: 'Vogel clams up, shuffling his papers with renewed intensity. "I\'ve told you everything I know, Inspector."'
        },
        'clerk_press': {
            text: '"I... I don\'t know what you want me to say, sir! The lock wasn\'t forced! I checked it myself, three times!"'
        },
        'clerk_done': {
            text: 'The clerk has nothing more to offer. For now.'
        },

        // ─────────────────────────────────────────────────────────────
        // VAULT INSPECTION
        // ─────────────────────────────────────────────────────────────
        'vault_inspection': {
            text: 'The vault door hangs open, mocking. Inside, empty boxes tell the story. But the [[lock mechanism]] and the [[floor]] might tell you more.',
            choices: {
                'examine_lock_logic': '[Logic] Analyze the lock mechanism.',
                'sense_atmosphere_intuition': '[Intuition] Something about this room feels... off.',
                'return_to_hub': 'Return to the main hall.'
            }
        },
        'vault_logic_success': {
            text: 'No chemical residue on the tumblers. No pick marks. This lock was opened with the correct combination — or a perfect copy of the key. An [[insider]]? You notice a scrap of [[red velvet]] caught on the door hinge.'
        },
        'vault_logic_fail': {
            text: 'The mechanism is complex. You\'d need more time or expertise to understand how it was bypassed.'
        },
        'vault_intuition_success': {
            text: 'You breathe in slowly. There — beneath the dust and brass — a faint scent. [[Bitter almonds]]. Industrial chemicals. Whatever was used here, it wasn\'t crude dynamite. You find a fine [[powder residue]] on the floor.'
        },
        'vault_intuition_fail': {
            text: 'Something nags at the edge of your senses, but you can\'t quite grasp it. The room gives up no secrets.'
        },
        'vault_continue': {
            text: 'The vault still holds secrets. What else do you want to examine?',
            choices: {
                'examine_lock_logic': '[Logic] Analyze the lock mechanism.',
                'sense_atmosphere_intuition': '[Intuition] Focus on the atmosphere.',
                'return_to_hub': 'That\'s enough for now.'
            }
        },
        'vault_leave': {
            text: 'You step back from the vault. The evidence you\'ve gathered paints a disturbing picture.'
        },

        // ─────────────────────────────────────────────────────────────
        // CONCLUSION
        // ─────────────────────────────────────────────────────────────
        'bank_conclusion': {
            text: 'You\'ve gathered what you can from the bank itself. Three leads emerge from the chaos:'
        },
        'bank_conclusion_summary': {
            text: 'The [[red velvet]] points to a [[tailor or costumer]]. The [[chemical residue]] requires an [[apothecary\'s analysis]]. And the [[Bächleputzer]] drinks at the [[local pub]]. Time to hit the streets of Freiburg.'
        }
    }
};
