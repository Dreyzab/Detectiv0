import type { VNContentPack } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'beat1_atmosphere': {
            text: 'The train stops with a piercing screech of brakes. Steam fills the platform, obscuring the outline of the station. The air smells of coal smoke and damp stone.\n\nYou step out of the carriage, feeling the morning chill through your coat. A crowd of passengers rushes toward the exit — hats, suitcases, umbrellas. No one pays attention to you.\n\nSomewhere ahead is Freiburg. And the case that brought you here.'
        },
        'beat1_spot_fritz': {
            text: 'The steam clears slightly. Through the shifting crowd, you notice a figure standing unnaturally still — a man in a dark Schutzmann uniform with a distinctive spiked helmet.\n\nHis eyes methodically scan the passengers. When his gaze meets yours, he gives a curt nod.',
            choices: {
                'choice_approach_fritz': 'Walk directly to the officer.',
                'choice_investigate_station': 'Look around the station first.'
            }
        },

        'beat2_paperboy': {
            text: 'A young newspaper boy is shouting headlines near the pillar, but his eyes dart nervously around the hall.',
            choices: {
                'beat2_buy_newspaper': 'Buy the paper (1 Mark).',
                'beat2_glance_headline': 'Just glance at the headline.'
            }
        },
        'beat2_buy_result': {
            text: 'You toss a coin to the boy. "Keep the change. Buy yourself something warm."\n\nHe catches it with a surprised blink, then smirks, pulling his cap lower. "Don\'t think a Mark buys you a friend, suit. But thanks."\n\nA shadow falls over you both.\n\n"Selling lies today, Hans?" Fritz Muller looms behind you, his thumb hooked in his belt.\n\nThe boy pales and scampers off, dropping the paper in your hand. Fritz chuckles, watching him run.\n\n"The press writes what people fear, not what is true. We have the truth, Detective."'
        },
        'beat_paperboy_theft': {
            text: 'You lean in to read the headline without paying. The boy, noticing your stinginess, suddenly stumbles into you.\n\nHis hand—quick as a magician\'s—dives for your pocket. But your reflexes are faster. You catch his thin wrist an inch from your watch.\n\n"Let go! I didn\'t do anything!"\n\nThe crowd parts. A shadow in a spiked helmet falls over you. Officer Fritz Muller stands there, hands behind his back.'
        },

        'choice_paperboy_fate': {
            text: '"Problem, Herr Detective? Is this sparrow pecking where he shouldn\'t?"\n\nThe boy trembles in your grip, glaring sullenly.',
            choices: {
                'choice_paperboy_mercy': '"Run. And don\'t get caught again." (Release him)',
                'choice_paperboy_report': '"Your client, Officer." (Hand him over)'
            }
        },

        'beat3_square': {
            text: 'Outside the station, trams ring their bells and carriages cut through wet cobblestones. Freiburg is already in motion.\n\nThe officer who nodded to you earlier stands near the fountain, speaking in low voices with a colleague. One mentions a name you file away: Galdermann.'
        },

        'beat_fritz_intro_direct': {
            text: 'You push through the crowd, heading straight for the uniform. The officer watches your approach, his hand resting casually on his belt buckle. As you get closer, he steps away from the station pillar to meet you halfway.\n\nHe is older than he looked from a distance, with a thick mustache and tired eyes. He offers a curt nod.\n\n"Herr Detective? Schutzmann Fritz Muller. Good to put a face to the telegram. Taking the direct approach, I see. Most people avoid us."'
        },
        'beat_fritz_intro_indirect': {
            text: 'You keep your distance, observing the station first. When you finally approach the fountain, the officers stop talking immediately.\n\nThe one with the spiked helmet—Fritz—recognizes you. He gives a sharp, impatient nod to his colleague. "Moment, bitte, Hans."\n\nThe younger officer salutes and hurries away. Fritz turns to you, a dry smile on his lips.\n\n"You take your time, Detective. Observing the terrain? Or just avoiding the uniform?"'
        },
        'beat_fritz_mission': {
            text: 'Muller lowers his voice, though the fountain drowns out most of the conversation. His expression hardens.\n\n"Let\'s get to it. Bankhaus Krebs was hit last night. Clean job, no alarms. But Mayor Thoma is breathing down our necks, demanding answers yesterday."\n\nHe pauses, gauging you.\n\n"We are stretched thin. I can hold the perimeter at the Bank, or manage the politics at the Rathaus. But I can\'t do both. Where do you want to start?"',
            choices: {
                'priority_bank_first': '"Secure the Crime Scene. I need to see the vault." (Bank)',
                'priority_mayor_first': '"Politics first. The Mayor needs to be managed." (Rathaus)'
            }
        },

        'hbf_finalize': {
            text: 'Arrival complete. Freiburg map is open: Bankhaus Krebs and Rathaus are now available.'
        }
    }
};

export default CASE1_HBF_ARRIVAL_EN;
