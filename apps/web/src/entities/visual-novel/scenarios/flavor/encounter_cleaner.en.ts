
import type { VNContentPack } from '../../model/types';

export const encounterCleanerEn: VNContentPack = {
    locale: 'en',
    scenes: {
        start: {
            text: `You step carefully along the cobblestones. The morning air is crisp. A **Bächleputzer** (stream cleaner) is working ahead, damming the small canal with a wooden sluice to clear the debris. The water swirls around his rubber boots.`,
            choices: {
                observe: `[Perception] Watch his technique. Maybe there's something in the silt.`,
                greet: `[Charisma] "Good morning, my good man. Hard work?"`,
                ignore: `Step over the stream and continue.`
            }
        },
        observe_success: {
            text: `[[perception|Perception Success]]: You watch the water recede. Amidst the mud and twigs, a glint of metal catches your eye. Not a coin, but a peculiar button from a formal uniform. Military? Or perhaps a hotel porter's? You pocket it. It's a small piece of the city's puzzle.`,
            choices: {
                leave: `Continue.`
            }
        },
        observe_fail: {
            text: `[[perception|Perception Failure]]: You stare at the mud. It's just mud. The cleaner looks at you suspiciously, and you realize you've been standing there awkwardly for too long.`,
            choices: {
                leave: `Move on.`
            }
        },
        chat_success: {
            text: `[[charisma|Charisma Success]]: The man leans on his shovel and wipes his brow. "Hard work, ja. But you hear things. The water carries whispers. They say the **Zähringen Lodge** had a private party last night. Very loud. Glass breaking. Not the usual gentlemen's gathering." He winks.`,
            choices: {
                leave: `Thank him and leave.`
            }
        },
        chat_fail: {
            text: `[[charisma|Charisma Failure]]: He grunts and splashes water in your direction, intentionally or not. "Busy, sir. Mind the boots." Clearly, he's not in the mood for idle chatter with a suit like you.`,
            choices: {
                leave: `Leave him be.`
            }
        },
        end_ignore: {
            text: `You step over the Bächle with a practiced stride. The city waits for no one, and neither do you. The sound of running water fades behind you.`,
            choices: {} // Auto-advance to end via logic nextSceneId
        },
        end: {
            text: `You adjust your coat and move on. The city is awake.`,
            choices: {}
        }
    }
};

export default encounterCleanerEn;
