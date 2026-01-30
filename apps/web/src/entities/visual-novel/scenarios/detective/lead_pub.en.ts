import type { VNContentPack } from '../../model/types';

export const LEAD_PUB_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entrance': {
            text: 'The [[Gasthaus "Zum Schlappen"]] reeks of tobacco and cheap beer. In the corner, a [[wizened old man]] in filthy work clothes nurses a drink. The [[barkeep]] polishes glasses with practiced disinterest.',
            choices: {
                'approach_gustav': 'Approach the old man',
                'ask_barkeep': 'Talk to the barkeep',
                'eavesdrop': 'Listen to the workers\' conversation'
            }
        },

        // GUSTAV
        'gustav_intro': {
            text: 'The old man looks up with rheumy eyes. His hands are cracked from decades of working in cold water.'
        },
        'gustav_suspicious': {
            text: '"You ain\'t from here. What do you want with old Gustav?"',
            choices: {
                'charisma_buy_drink': '[Charisma] "Let me buy you a drink, friend."',
                'authority_badge': '[Authority] "Police. I need information."',
                'leave_gustav': 'Nevermind, old timer.'
            }
        },
        'gustav_charisma_success': {
            text: 'His eyes light up at the prospect of free schnapps. "Well now, you seem like a decent sort..."'
        },
        'gustav_charisma_fail': {
            text: '"I don\'t take charity from strangers." He turns back to his drink.'
        },
        'gustav_authority_success': {
            text: 'He pales slightly. "Police? I don\'t want no trouble. I\'ll tell you what I saw."'
        },
        'gustav_clams_up': {
            text: '"Police?" He spits. "I ain\'t seen nothing. I ain\'t heard nothing. Now leave me be."'
        },
        'gustav_reveals': {
            text: '"That night... the night of the robbery... I was cleaning the [[Fischerau]] channel. I saw someone on the [[scaffolding]] at the bank. A figure in dark clothes. Theatrical-like."'
        },
        'gustav_description': {
            text: '"Moved like a dancer, they did. Climbed down, walked toward [[Stühlinger]]. That\'s all I know, I swear."'
        },

        // BARKEEP
        'barkeep_intro': {
            text: 'The barkeep eyes you warily. "What\'ll it be?"',
            choices: {
                'barkeep_ask_gustav': '"Who\'s the old man in the corner?"',
                'barkeep_ask_rumors': '"Heard anything interesting lately?"'
            }
        },
        'barkeep_points_gustav': {
            text: '"That\'s [[Old Gustav]]. The [[Bächleputzer]]. Cleans the water channels every dawn. Sees more than he should, that one."'
        },
        'barkeep_rumors': {
            text: '"Interesting? Only thing interesting is people asking too many questions. You want a drink or not?"'
        },

        // EAVESDROP
        'eavesdrop': {
            text: 'You pretend to study your drink while listening to the nearby conversation.'
        },
        'eavesdrop_content': {
            text: '"...they say the night watchman at [[Haus Kapferer]] was paid to look the other way. Easy money, easy access through the scaffolding..."'
        }
    }
};
