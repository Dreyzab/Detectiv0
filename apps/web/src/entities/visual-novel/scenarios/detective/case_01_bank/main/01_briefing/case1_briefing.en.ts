import type { VNContentPack } from '../../../../../model/types';

/**
 * Case 1 Briefing — English Content
 * 
 * Scenes cover:
 * - Station arrival and Müller introduction
 * - Mayor Path: Office meeting, Victoria introduction
 * - Bank Path: Chaos, Mayor arrives with Victoria
 */

export const CASE1_BRIEFING_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        // ═══════════════════════════════════════════════════════════════
        // ARRIVAL AT STATION
        // ═══════════════════════════════════════════════════════════════
        'arrival_station': {
            text: 'The steam clears as the train hisses to a halt. [[Freiburg Hauptbahnhof]]. The air is thick with coal smoke and the scent of rain on cobblestones. A fresh start... or the beginning of something darker.',
            choices: {
                'look_around': 'Step onto the platform'
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // MÜLLER HUB
        // ═══════════════════════════════════════════════════════════════
        'meet_rookie': {
            text: 'A stiff figure in a pressed uniform salutes you. "Schutzmann Müller, Polizeidirektion Freiburg! Welcome, mein Herr." He lowers his voice. "The Mayor is... impatient. And the Bank situation is... complicated."',
            choices: {
                'ask_bank': '"Complicated? That is one word for a robbery, Müller."',
                'ask_mayor': '"Why is Mayor Thoma involved personally?"',
                'observe_muller': '[Observation] Study the policeman\'s demeanor.',
                'proceed_mayor': '"Take me to the Rathaus. The Mayor first."',
                'proceed_bank': '"I have no time for politics. To the Bank at once."'
            }
        },
        'muller_lore_bank': {
            text: '"It is chaos, Herr Vance. Socialists shouting slogans, reporters with their flash-powder, curious onlookers pressing against the police line." He adjusts his Pickelhaube nervously. "The Bank Manager, Herr Galdermann, is threatening to have us all dismissed if we cannot control the crowd."'
        },
        'muller_lore_mayor': {
            text: '"His Excellency has been pacing since dawn, screaming at the telephone operators. He calls this robbery a \'political assassination\' of his career." Müller hesitates. "Between us... he seems more frightened than angry."'
        },
        'muller_observe_self': {
            text: 'River clay caked on his boots—not street dust. A slight tremor in his hand as he adjusts his helmet. The posture of a soldier, not a beat cop. This man has seen worse than angry bankers.\n\n"You served in the 113th, didn\'t you, Müller? Baden Infantry."'
        },

        // ═══════════════════════════════════════════════════════════════
        // PATH A: MAYOR OFFICE
        // ═══════════════════════════════════════════════════════════════
        'mayor_office_1': {
            text: 'The Rathaus corridor is silent save for the ticking of an ancient grandfather clock. A secretary waves you through with nervous hands. Inside, Mayor Thoma stands by the window, fingers drumming on the sill.\n\n"Vance. Finally." He does not turn around. "Do you know what they are calling this? A \'bold socialist action.\' The newspapers are already writing my political obituary."'
        },
        'mayor_office_2': {
            text: 'He turns. His face is drawn, eyes shadowed by sleepless nights. "This is not merely a robbery. Someone is sending a message. To me." He moves to his desk, shuffling papers.\n\n"I need someone who can see what others cannot. Someone... outside the usual channels." He gestures toward a side door. "Which is why I have arranged for you to have assistance."'
        },
        'mayor_introduces_victoria': {
            text: 'The side door opens. A woman enters—tall, severe, dressed in practical gray wool. Her hands are stained with chemicals, and she carries a heavy leather satchel like a soldier carries a rifle.\n\n"This is Fräulein Victoria Sterling. She studied chemistry at our University—one of the first women permitted to do so." The Mayor\'s tone carries a note of forced enthusiasm. "She will be your... scientific consultant."'
        },
        'victoria_first_impression': {
            text: 'Victoria\'s gaze meets yours. Cold. Measuring. The gaze of someone who has learned to armor herself against a world that expects her to fail.\n\n"Herr Vance." Her voice is clipped, professional. "I have read your case files from Vienna. Competent work. Though your methods are... unconventional."',
            choices: {
                'react_respectful': '"The honor is mine, Fräulein Sterling. Chemistry at Freiburg is no small achievement."',
                'react_skeptical': '"A laboratory scientist at a crime scene. The Mayor has unusual ideas about investigation."',
                'react_flirtatious': '"They did not mention you would be beautiful as well as brilliant."',
                'observe_victoria': '[Observation] Study her more closely before responding.'
            }
        },
        'victoria_react_respect': {
            text: 'Something shifts in her expression—not warmth, but a momentary easing of her guard. "You are... not what I expected." A pause. "Most detectives dismiss me before I speak a single word."\n\nThe Mayor clears his throat. "Yes, yes. Very good. You two will work well together."'
        },
        'victoria_react_skeptic': {
            text: 'Her eyes narrow. The temperature in the room drops several degrees. "A laboratory scientist. Yes. One who can identify poisons by their crystalline structure, trace fibers to their mill of origin, and detect blood stains invisible to the naked eye." She does not blink. "Can your \'conventional\' methods do the same, Herr Vance?"'
        },
        'victoria_react_flirt': {
            text: 'Her expression freezes. When she speaks, each word is a chip of ice. "I am here because of my expertise in forensic chemistry, not my appearance. If you cannot distinguish between the two, perhaps the Mayor has made an error in judgment."\n\nThe silence that follows is glacial.'
        },
        'victoria_observe_result': {
            text: 'Ink stains on her fingers—not just any ink, but the distinctive purple of laboratory logbooks. The slight reddening around her eyes: late nights, or tears forcibly suppressed. A small locket at her throat, clutched unconsciously when she thinks no one is watching.\n\nShe is here for more than professional ambition. She is hunting something.'
        },
        'mayor_directive': {
            text: '"I need this resolved before Sunday\'s sermon." The Mayor spreads his hands. "The Archbishop will be speaking about \'moral decay in civic institutions.\' I do not wish to be his example."\n\nHe hands you a brass key. "Full access to the Bank. Fräulein Sterling has already examined the vault. She can brief you on the way."',
            choices: {
                'accept_partnership': '"Then we should not waste any more time. Fräulein Sterling—shall we?"'
            }
        },
        'mayor_path_exit': {
            text: 'Victoria nods curtly and moves toward the door. The Mayor watches you both leave, his expression unreadable.\n\nOutside, a black carriage waits. Victoria climbs in without waiting for assistance. "The Bank," she tells the driver. "And quickly."'
        },

        // ═══════════════════════════════════════════════════════════════
        // PATH B: BANK SHORTCUT
        // ═══════════════════════════════════════════════════════════════
        'bank_path_1': {
            text: 'The crowd swells against the police cordon. Reporters shout questions into the void. A woman in a worn shawl wails about her savings. Socialist pamphlets flutter in the wind like wounded birds.\n\nBankhaus Krebs stands at the center of the chaos—its marble facade untouched, but its reputation cracked beyond repair.'
        },
        'bank_path_2': {
            text: 'No official guide. No protocol. Just you and the chaos. The police eye you with suspicion as you flash your credentials.\n\n"Another detective?" A sergeant spits on the cobblestones. "Good luck. The Bank Manager is screaming, the vault is empty, and we have found nothing but chalk marks and riddles."\n\nChalk marks. Interesting.'
        },
        'mayor_arrives_bank': {
            text: 'A black carriage cuts through the crowd. The police scramble to clear a path. Mayor Thoma descends, his face a mask of controlled fury.\n\n"Vance! I see you could not be bothered to wait." He adjusts his coat. "No matter. I have brought someone who will ensure this investigation is conducted... properly."'
        },
        'mayor_introduces_victoria_bank': {
            text: 'A woman emerges from the carriage—tall, severe, carrying a heavy leather satchel. Her gray wool dress is practical, her gaze sharper than any scalpel.\n\n"This is Fräulein Victoria Sterling. Scientific consultant. She will be working with you." The Mayor\'s tone makes clear this is not a request. "Try not to... impede her work."'
        },
        'victoria_bank_intro': {
            text: 'Victoria surveys the scene with clinical detachment. When her eyes finally meet yours, there is no warmth—only assessment.\n\n"Herr Vance. I have already examined the vault. There are... irregularities." A pause. "I trust you will not dismiss my findings as \'women\'s intuition.\'"',
            choices: {
                'react_respectful_bank': '"I dismiss nothing without evidence. What did you find?"',
                'react_annoyed_bank': '"I work alone, Fräulein. The Mayor\'s games are his own affair."'
            }
        },
        'victoria_react_respect_bank': {
            text: '"Chalk markings. Geometric patterns. They are not random—someone took time to draw them." Her eyes narrow. "And there is a chemical residue I cannot immediately identify. Bitter almond scent, but not cyanide. Something... unusual."\n\nShe gestures toward the Bank entrance. "Shall we?"'
        },
        'victoria_react_annoyed_bank': {
            text: '"You work alone." She repeats it without inflection, but something hardens in her gaze. "How fortunate for you. I, however, have orders from the Mayor. And unlike some, I do not have the luxury of ignoring powerful men."\n\nShe walks toward the Bank without waiting for a response. "Come. Or stay. The evidence does not care about your preferences."'
        },
        'bank_path_exit': {
            text: 'The Bank doors loom ahead. Beyond them: answers, or more questions. Victoria walks beside you—a reluctant ally, perhaps, but an ally nonetheless.\n\nThe investigation begins now.'
        }
    }
};

export default CASE1_BRIEFING_EN;
