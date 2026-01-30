import type { VNContentPack } from '../../model/types';

export const QUEST_VICTORIA_POETRY_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'arrival': {
            text: 'Victoria pulls her scarf tighter. The Red Cog (Das Rote Zahnrad) hums with low conversation and tobacco smoke. "It looks... alive. Are you sure they won\'t recognize me in these clothes?"'
        },
        'bouncer_interaction': {
            text: 'A burly man in a butcher\'s apron blocks the door. "Members only tonight. Who are you?"',
            choices: {
                'bribe_bouncer': '[5 Marks] "We are patrons of the arts. And thirsty ones."',
                'charm_bouncer': '[Charisma] "My cousin here is a poet from Berlin. She insists on hearing the local talent before she dies of boredom."',
                'authority_bouncer': '[Authority] "Inspection. Move aside or I close this rat-hole down."'
            }
        },
        'entry_fail': {
            text: 'The bouncer crosses his arms. "Not a chance. Beat it." Victoria looks disappointed as you retreat into the cold night.'
        },
        'entry_success': {
            text: 'The bouncer steps aside with a grunt. Inside, the air is thick with smoke and revolutionary zeal. Workers huddle over cheap beer, arguing philosophy.'
        },
        'poetry_performance': {
            text: 'The lights dim. A young man with coal-stained hands stands on a crate. He clears his throat.'
        },
        'poetry_round_1': {
            text: '"The Iron Mother eats her young,\n  With teeth of steam and lungs of dung.\n  We feed her coal, we feed her bone,\n  And sleep upon her bed of stone."',
            choices: {
                'analyze_structure': '[Logic] Analyze the industrial imagery.',
                'feel_rhythm': '[Poetics] Feel the mechanical rhythm of the verse.'
            }
        },
        'poetry_round_2': {
            text: '"The Silken Lord in tower high,\n  Drinks the red from the evening sky.\n  He does not see the hands that bleed,\n  To plant the flower, to sow the seed."',
            choices: {
                'analyze_metaphor': '[Encyclopedia] Identify the reference to the "Silken Lord".',
                'sense_anger': '[Empathy] Connect with the raw anger beneath the words.'
            }
        },
        'poetry_round_3': {
            text: '"But gears will grind and bolts will shearing,\n  The time of silence is disappearing.\n  When the cog halts and the piston breaks,\n  The Iron Mother finally wakes!"',
            choices: {
                'connect_politics': '[Authority] Deconstruct the call to strike action.',
                'absorb_impact': '[Composure] Brace yourself against the revolutionary fervor.'
            }
        },
        'victoria_moved': {
            text: 'The room erupts in low, table-thumping applause. Victoria is transfixed, her eyes wide. "I never knew... words could feel like weapons." tears well in her eyes.',
            choices: {
                'share_insight': 'Explain the deeper meaning you unraveled.',
                'leave_quietly': 'Whisper: "We should go before we draw attention."',
                'applaud': 'Applaud the performance openly.'
            }
        },
        'discuss_meaning': {
            text: 'You lean in. "It\'s not just anger. It\'s a schematic for a new world. The \'Cog\' isn\'t the machine, it\'s the worker who realizes they can stop it." Victoria nods, a spark of understanding igniting in her gaze. "It\'s beautiful," she whispers.',
            choices: {}
        },
        'success_quiet': {
            text: 'You slip out into the cool night air. Victoria is silent for a long time. "Thank you," she finally says. "My father... he thinks they are just animals. But they have souls of fire."'
        },
        'success_loud': {
            text: 'You clap. A few heads turn, eyeing your clothes suspiciously. A hush falls over the nearby tables. Victoria grabs your arm, exhilarated but terrified. "We should run," she laughs, pulling you out the door.'
        }
    }
};
