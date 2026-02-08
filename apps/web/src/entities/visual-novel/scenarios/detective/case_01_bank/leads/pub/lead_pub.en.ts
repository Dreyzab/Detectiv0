import type { VNContentPack } from '../../../../../model/types';

export const LEAD_PUB_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entrance': {
            text: 'Gasthaus "Zum Schlappen" is loud, smoky, and watchful. Old Gustav sits in the corner while the barkeep tracks every stranger.',
            choices: {
                'follow_night_guard_rumor': 'Follow Clara\'s night-guard rumor lead.',
                'approach_gustav': 'Approach Gustav directly.',
                'ask_barkeep': 'Question the barkeep first.',
                'eavesdrop': 'Listen to workers at the next table.'
            }
        },
        'pub_night_guard_path': {
            text: 'The barkeep taps his chin toward Gustav. "If you want dawn-shift eyes, start with him."'
        },

        'gustav_intro': {
            text: 'Gustav looks up slowly. Canal water has aged his hands before his years.'
        },
        'gustav_suspicious': {
            text: '"You are not local. Why are you asking old Gustav questions?"',
            choices: {
                'mention_hartmann_payments': '"Heard Hartmann moved cash through intermediaries. Ring a bell?"',
                'charisma_buy_drink': '[Charisma] "Let me buy the next drink."',
                'authority_badge': '[Authority] "Police inquiry. Cooperate."',
                'leave_gustav': 'Back off for now.'
            }
        },
        'gustav_hartmann_reply': {
            text: 'Gustav squints. "Name was whispered with runner boys near dawn. Money moved quiet, not honest."'
        },
        'gustav_charisma_success': {
            text: 'He softens at the offer. "Fine. I will tell you what I saw."'
        },
        'gustav_charisma_fail': {
            text: '"I do not drink with strangers." He turns away.'
        },
        'gustav_authority_success': {
            text: 'He stiffens. "No trouble, Inspector. I will talk."'
        },
        'gustav_clams_up': {
            text: '"Police? Then I saw nothing."'
        },
        'gustav_reveals': {
            text: '"Night of the robbery, I was cleaning Fischerau. Saw a dark figure on bank scaffolding. Moved like stage folk."'
        },
        'gustav_description': {
            text: '"Then headed toward Stuhlinger. Fast, practiced, no hesitation."'
        },

        'barkeep_intro': {
            text: 'The barkeep wipes a glass without looking away from you.',
            choices: {
                'barkeep_ask_gustav': '"Who is the old man?"',
                'barkeep_ask_rumors': '"What rumors are circulating?"',
                'ask_previous_investigator': '"A prior investigator disappeared. Did he come through here?"'
            }
        },
        'barkeep_points_gustav': {
            text: '"That is Gustav, the Bachleputzer. Dawn shifts, sharp eyes, loose tongue after schnapps."'
        },
        'barkeep_rumors': {
            text: '"Everyone has rumors. Few survive contact with facts."'
        },
        'barkeep_previous_investigator': {
            text: 'He lowers his voice. "Yes. Asked about bank scaffolds, then vanished from this route."'
        },

        'eavesdrop': {
            text: 'You stay quiet and let the room speak around you.'
        },
        'eavesdrop_content': {
            text: '"...night watch was bought off... scaffold entry looked clean..."'
        }
    }
};

export default LEAD_PUB_EN;
