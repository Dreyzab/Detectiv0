
import type { VNContentPack } from '../../../../model/types';

export const questInspectorViennaEn: VNContentPack = {
    locale: 'en',
    scenes: {
        arrival: {
            text: `The office is dark, lit only by the embers of a dying fire. Richter sits at his desk, a glass of schnapps in one hand and a crumpled letter in the other. He stares at the paper as if it were a death warrant.`,
            choices: {
                approach: `Clear your throat.`
            }
        },
        intro_dialogue: {
            text: `He doesn't look up. "Go home. The city can rot without us for one night." His voice is thick, but not from alcohol. It's grief.`,
            choices: {
                ask_letter: `"Bad news from Vienna, Herr Inspektor?"`,
                offer_drink: `Pour yourself a glass and sit in silence.`
            }
        },
        letter_deflection: {
            text: `His hand violently crumples the paper. "None of your damn business. A man is entitled to his secrets, isn't he? Even in this godforsaken panopticon."`,
            choices: {
                press_authority: `[Authority] "We are partners. If something compromises you, it compromises the investigation. Speak."`,
                back_off: `Respect his privacy and leave.`
            }
        },
        drink_shared: {
            text: `You drink. The clock ticks. Richter sighs, the fight draining out of him. "She writes to me every year. My daughter. She thinks I'm a hero. A Knight of the Empire." He laughs, a bitter, jagged sound.`,
            choices: {
                ask_softly: `[Empathy] "It's hard to live up to the image. But you can try."`
            }
        },
        letter_revealed: {
            text: `[[empathy|Empathy Success]]: He smooths out the letter. "She's getting married. She wants me to walk her down the aisle. Me. A man who breaks fingers for a living." He looks at you, eyes wet. "Maybe... maybe I can go. Just for a week." He folds the letter carefully and places it in his breast pocket. Close to his heart.`,
            choices: {
                leave_respect: `"You should go, Hans. The city will wait."`
            }
        },
        letter_burned: {
            text: `[[empathy|Empathy Failure]]: He stares at the fire. "Lies. All lies. I'm not that man anymore." He tosses the letter into the embers. It curls, blackens, and turns to ash. "The past is dead. And so are we."`,
            choices: {
                leave_silent: `Leave him to his darkness.`
            }
        },
        end_success: {
            text: `Richter nods, a silent bond formed. He won't forget this.`,
            choices: {}
        },
        end_fail: {
            text: `You close the door. Behind you, the bottle clinks against the glass. Again. And again.`,
            choices: {}
        }
    }
};

export default questInspectorViennaEn;
