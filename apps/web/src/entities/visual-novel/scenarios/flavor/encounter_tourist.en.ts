
import type { VNContentPack } from '../../model/types';

export const encounterTouristEn: VNContentPack = {
    locale: 'en',
    scenes: {
        start: {
            text: `A red-faced gentleman in a tweed suit is wrestling with a large map that seems to be fighting back against the wind. He spots you. "I say! Entschuldigen Sie! I seem to have... misplaced the mountains. Searching for the **Höllental**. Is it... up?" He points vaguely at the cathedral spire.`,
            choices: {
                directions: `[Encyclopedia] Give him precise directions to the station for the Höllentalbahn.`,
                pub: `[Composure] Suggest he sits down for a beer before trekking into 'Hell Valley'.`,
                ignore: `Pretend you don't speak English (or German).`
            }
        },
        guide_success: {
            text: `[[encyclopedia|Encyclopedia Success]]: "Ah, the Valley of Hell. You need the train, not your feet. Platform 4, look for the locomotive with the cogwheel drive. It's steep." The tourist beams. "Cogwheel! Brilliant! German engineering, eh?" He presses a crisp banknote into your hand. "For your trouble, mein Herr."`,
            choices: {
                leave: `Accept the tip and nod.`
            }
        },
        guide_fail: {
            text: `[[encyclopedia|Encyclopedia Failure]]: You point confidently south. "Just follow the river. You can't miss it." He looks doubtful. "The river? But the map says... oh, never mind. Danke." He walks off in completely the wrong direction. He'll be in France by dinner.`,
            choices: {
                leave: `Watch him fade into the distance.`
            }
        },
        pub_success: {
            text: `[[composure|Composure Success]]: "Sir, look at the clouds. Storm coming. The valley isn't going anywhere. But the **Feierling** brewery is just around the corner." He looks at the sky, then at you. "By Jove, you're right. A pint first. Capital idea!" He tips his hat.`,
            choices: {
                leave: `A life saved from rain.`
            }
        },
        pub_fail: {
            text: `[[composure|Composure Failure]]: "Just go drink beer." You say it too bluntly. He draws himself up. "I am here for the sublimity of nature, sir, not for inebriation! Good day!" He marches off, offended by your assumption that all Englishmen are alcoholics.`,
            choices: {
                leave: `Shrug.`
            }
        },
        end_ignore: {
            text: `You mutter something in unintelligible dialect and hurry past. "Foreigners," you hear him sigh.`,
            choices: {}
        },
        end: {
            text: `The encounter passes. The city flows around you.`,
            choices: {}
        }
    }
};
