
import type { VNContentPack } from '../../model/types';

export const encounterStudentEn: VNContentPack = {
    locale: 'en',
    scenes: {
        start: {
            text: `Near the University library, a young man stumbles out of a tavern, his face wrapped in fresh bandages. He reeks of cheap brandy and iodine. He bumps into you, then straightens up with exaggerated, wobbly dignity. "You! You're staring at my *Schmiss*, aren't you? Jealous of a badge of honor?"`,
            choices: {
                authority: `[Authority] "Stand down, boy. You're drunk and bleeding. Go home before I arrest you for public disorder."`,
                volition: `[Volition] Step aside calmly. He's just a child playing soldier.`,
                engage: `Ask him about the duel.`
            }
        },
        auth_success: {
            text: `[[authority|Authority Success]]: Your voice cracks like a whip. The student blinks, his bravado evaporating instantly. He recognizes the tone of a superior officer or a stern father. "J-jawohl, mein Herr. Just... celebrating via the Mensur. Apologies." He salutes clumsily and hurries away.`,
            choices: {
                leave: `Watch him go.`
            }
        },
        auth_fail: {
            text: `[[authority|Authority Failure]]: "Arrest me? Hah! My father is a judge! Who are you, some beat cop?" He shoves your chest. The crowd around you starts to whisper. You've only escalated the situation.`,
            choices: {
                escalate: `Check his aggression.`,
                leave: `Walk away before it gets ugly.`
            }
        },
        comp_success: {
            text: `[[volition|Volition Success]]: You look through him as if he were made of glass. You step smoothly to the side, checking your pocket watch. The utter lack of reaction deflates him. "Bah. Philistine," he mutters, but lets you pass without incident.`,
            choices: {
                leave: `Continue.`
            }
        },
        comp_fail: {
            text: `[[volition|Volition Failure]]: You try to step aside, but he blocks your path, reading your silence as cowardice. "Running away? Insulting the honor of Rhenania?" He spits near your boot. Your hand twitches towards your baton.`,
            choices: {
                confront: `This demands a response.`,
                leave_shame: `Swallow the insult and leave.`
            }
        },
        engage_dialogue: {
            text: `"Badge of honor, you say? Looks painful." The student squares his shoulders. "Pain is temporary. Honor is forever. It was a *Pro-Patria-Suite*. 30 rounds. I didn't flinch once."`,
            choices: {
                ask_scar: `"And your opponent?"`,
                leave: `"Impressive. Good day."`
            }
        },
        ask_scar_scene: {
            text: `"He... well, he has a matching one now. We are brothers in blood." He touches the bandage tenderly. You realize this ritual violence binds the city's elite together closer than any law could.`,
            choices: {
                leave: `Store this information.`
            }
        },
        duel_threat: {
            text: `"Satisfaction! I demand satisfaction!" He clumsily tries to draw a nonexistent sword, then realizes he's unarmed. "Name your seconds!"`,
            choices: {
                accept: `Mockingly accept.`,
                decline: `Leave him to his drunken delusions.`
            }
        },
        end_duel: {
            text: `You make a mock bow. "My seconds will call on you." The crowd laughs. He turns beet red. You've won the crowd, but you've made an enemy.`,
            choices: {}
        },
        end: {
            text: `You leave the student behind. Another scar on the face of the city.`,
            choices: {}
        }
    }
};

export default encounterStudentEn;

