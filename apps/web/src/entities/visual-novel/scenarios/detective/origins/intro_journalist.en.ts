import type { VNContentPack } from '../../../model/types';

export const introJournalistEn: VNContentPack = {
    locale: 'en',
    scenes: {
        'start': {
            text: `A cloud of expensive cigarette smoke drifts between you and Anna. She taps a pencil against the marble tabletop of Cafe Riegler. "Since you traded your pen for a magnifying glass, Arthur, you've become even more cryptic. You look like a man who knows where the bodies are buried but is too lazy to dig."`,
            choices: {
                'shivers_check': `[Shivers] Close your eyes and feel the vibration of the floor.`,
                'selective_excavation': `"A detective only digs when the client pays for the shovel, Anna. I prefer to stay clean."`
            }
        },
        'shivers_realization': {
            text: `The cup of cold coffee on your table trembles. Far below the coffee-scented air of the Altstadt, the massive ротационные machines of the *Freiburger Zeitung* are rhythmic, but today... the beat is stuttering. High pressure. High stakes. "Do you feel it? The printing rhythm is off. The Dreisam flows faster today. The city is nervous, Anna."`,
            choices: {
                'continue': `She looks at you like you've grown a second head.`
            }
        },
        'key_secret': {
            text: `"You and your 'feelings'. The only thing I feel is the deadline for the morning edition," Anna sighs, but then she leans in, her voice dropping to a sharp whisper. "Müller whispered to me that the bank vault wasn't even forced. It was opened with a key. But there's not a word of it in the report. What do you have, Arthur?"`,
            choices: {
                'continue': `A messenger boy in a tattered blue cap skids to a halt by your table.`
            }
        },
        'messenger_arrival': {
            text: `"Telegram for Herr Vance! Arrived this morning from the Rathaus!" The boy drops a envelope with a heavy purple wax seal on the table. "They said you just got in from Stuttgart. Welcome back to the circus, mein Herr." Anna's eyes widen as she recognizes the Mayor's personal crest.`,
            choices: {
                'show_seal': `Show her the seal. "It seems an exclusive awaits us. But keep your mouth shut."`,
                'hide_seal': `Pocket the telegram without a word.`
            }
        },
        'show_telegram': {
            text: `You hold the envelope just long enough for her to see the Rathaus seal. "It seems an exclusive awaits us. But keep your mouth shut, Anna. If this leaks before I'm in, our sources will dry up like the Bächle in August."`,
            choices: {
                'continue': `Anna's smirk softens into a look of genuine intrigue.`
            }
        },
        'anna_tip': {
            text: `"The Mayor himself? God, Vance... you really are the city's favorite stray. Take this — my source at the Precinct says the 'key' wasn't a duplicate. It was the master. Only three people have it. Galdermann, the Mayor, and the Chief of Police."`,
            choices: {
                'continue': `You drain the last of your cold coffee and stand up.`
            }
        },
        'exit_scene': {
            text: `You finish your coffee in one bitter gulp and stand up, adjusting your fedora. "Work doesn't wait. Farewell, Anna." She watches you go, already reaching for her notebook. "Dry as a bone, Vance. Don't come crawling to me when you need a front-page favor!"`,
            choices: {}
        }
    }
};

export default introJournalistEn;
