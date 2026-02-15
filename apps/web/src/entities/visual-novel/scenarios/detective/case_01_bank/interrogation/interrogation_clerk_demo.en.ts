import type { VNContentPack } from '../../../../model/types';

/**
 * Clerk Interrogation Demo — English content.
 * Dialogue text for the Ernst Vogel (clerk) interrogation.
 */
export const INTERROGATION_CLERK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'intro': {
            text: 'The bank\'s back office is dimly lit. Stacks of ledgers surround a small desk where Ernst Vogel, the junior clerk, sits wringing his hands. He was on duty the night of the robbery.\n\nTime to find out what he knows.',
        },
        'clerk_greeting': {
            text: 'Vogel looks up with reddened eyes. "H-Herr Detective? They said someone would come. I\'ve already told the Schutzmann everything I know. Which... isn\'t much."\n\nHe fidgets with a pen, avoiding your gaze.',
            choices: {
                'choice_direct_accusation': '"Cut the act, Vogel. You were the only one here that night."',
                'choice_sympathetic': '"Take your time, Ernst. I\'m just here to understand what happened."',
                'choice_small_talk': '"Nice office. You\'ve been working here long?"',
            }
        },
        'beat_accusation': {
            text: 'Vogel flinches as if struck. The pen clatters to the floor.\n\n"I—I didn\'t—you can\'t possibly think—" He swallows hard, his Adam\'s apple bobbing. "I was at my desk the whole time! The guard will confirm it!"',
            choices: {
                'choice_press_harder': '"The guard was found unconscious. Try again."',
                'choice_back_off': '"Relax. Just covering all angles."',
            }
        },
        'beat_sympathy': {
            text: 'The tension in Vogel\'s shoulders drops a fraction. He manages a weak smile.\n\n"Thank you, Herr Detective. It\'s been... a difficult morning. Everyone is looking at me like—" He pauses, swallowing. "Like I did it."',
            choices: {
                'choice_ask_about_night': '"Walk me through that night. Step by step."',
                'choice_show_evidence': '"I found something at the vault. Perhaps you can help me understand it."',
            }
        },
        'beat_small_talk': {
            text: '"Three years this May." A flicker of pride crosses his face before being smothered by anxiety. "Herr Krebs gave me the night shift because... well, nobody else wanted it. I was happy for the extra pay."',
            choices: {
                'choice_mention_family': '"Family to support?"',
                'choice_shift_topic': '"So you were alone that night?"',
            }
        },
        'beat_pressed': {
            text: 'Vogel\'s face goes white. His hands tremble.\n\n"The g-guard... unconscious?" He looks genuinely shocked. "I thought he just... Heinrich always falls asleep during the night shift. Everyone knows that. But unconscious—"\n\nHe looks at the door as if considering running.',
            choices: {
                'choice_threaten': '"One more lie and I\'m handing you to the Schutzmann. They\'re less patient than I am."',
                'choice_calm_down': '"Heinrich — that\'s the guard? Tell me about him."',
            }
        },
        'beat_recovery': {
            text: 'Vogel exhales shakily. "I\'m sorry. I\'m not... I\'m not used to this."\n\nHe straightens his collar and sits up a little. The panic gives way to something more resigned.\n\n"What do you want to know?"',
            choices: {
                'choice_gentle_probe': '"Did you hear anything unusual? Any noises, voices?"',
                'choice_wait_silent': 'Say nothing. Let the silence fill the room.',
            }
        },
        'beat_night_details': {
            text: '"I was finishing the quarterly accounts. Around eleven, I heard... something. A scraping sound, from below."\n\nVogel\'s eyes go distant. "I thought it was rats. The old building is full of them. But then there was a smell. Sharp, chemical. Like the apothecary on Salzstraße."\n\nHe rubs his temple. "After that, everything went... foggy."',
            choices: {
                'choice_push_details': '"The smell. Describe it precisely."',
                'choice_reassure': '"You did well to remember that much. Go on."',
            }
        },
        'beat_evidence_shown': {
            text: 'Vogel stares at the evidence, his pupils dilating. "Where did you... that was in the vault?"\n\nHe leans forward despite himself, professional curiosity overriding his fear for a moment. "That\'s not a standard tool. That\'s... specialized. Whoever used this knew exactly what they were doing."',
            choices: {
                'choice_confront_with_evidence': '"And you have no idea who that might be?"',
                'choice_let_him_explain': '"Go on. What can you tell me about this?"',
            }
        },
        'beat_sympathetic_reveal': {
            text: 'Vogel lowers his voice, glancing at the closed door.\n\n"There is one thing. The night before the robbery, I saw Herr Krebs himself in the vault. At midnight. He said he was \'checking inventory,\' but... he never does that. And he was carrying a leather case I\'d never seen before."\n\nHe meets your eyes for the first time. "I didn\'t tell the Schutzmann because Herr Krebs... he signs my wages."',
        },
        'beat_lockout_result': {
            text: 'Vogel slams his palms on the desk and stands, chair scraping against the floor.\n\n"I have nothing more to say to you! I want a lawyer! I want—"\n\nHe storms to the door and throws it open. A uniformed guard appears instantly. Vogel pushes past him, shouting about his rights.\n\nThe interrogation is over. For now.',
        },
        'beat_conclusion': {
            text: 'You close your notebook and stand. The back office feels smaller than when you arrived.\n\nThe pieces are starting to form a picture — Krebs at midnight, a chemical smell, a specialized tool. But is Vogel a witness, an accomplice, or just a frightened clerk in over his head?\n\nOnly the evidence will tell.',
        }
    }
};

export default INTERROGATION_CLERK_EN;
