
import type { VNContentPack } from '../../model/types';

export const questLotteWiresEn: VNContentPack = {
    locale: 'en',
    scenes: {
        arrival: {
            text: `The Central Telegraph Office hums with the clicking of a hundred machines. Lotte stands near a decommissioned terminal in the corner, her hands trembling slightly. "It's back," she whispers. "The Ghost Frequency. 744 Hz. They claim it's dead, but I hear it."`,
            choices: {
                ask_problem: `"Show me. What are you hearing?"`
            }
        },
        explain_problem: {
            text: `She plugs a headset into the dusty console. "Listen. In the static. It's not random. Dot-dot-dash... It's a cipher I haven't heard since the war. Someone is using the dead lines to broadcast within the city. And it's coming from... the Police Presidium."`,
            choices: {
                investigate_console: `[Logic] Analyze the signal pattern. Keep an open mind.`,
                dismiss_paranoia: `[Authority] "Lotte, you're tired. It's just interference. Let's go."`
            }
        },
        lotte_upset: {
            text: `Lotte recoils as if slapped. "I thought you were different. You're just like them. Blind." She unplugs the headset and storms out.`,
            choices: {
                leave: `Watch her go.`
            }
        },
        console_check: {
            text: `You put on the headset. The static is deafening, but... yes. There's a rhythm. A mechanical heartbeat buried under the noise. You try to isolate the frequency.`,
            choices: {
                attempt_decode: `Focus on the pattern.`
            }
        },
        decode_success: {
            text: `[[logic|Logic Success]]: It's a Vigenère cipher, but the key is simple: 'ECHO'. You scribble down the decoded fragments: "...shipment confirmed... midnight... warehouse 4..." It's not a ghost. It's a smuggling ring using the police maintenance channel. Lotte was right.`,
            choices: {
                comfort_lotte: `"You're not crazy, Lotte. You just found their back door."`
            }
        },
        decode_fail: {
            text: `[[logic|Logic Failure]]: It's just noise. Random electrical discharges. You fumble with the dials, trying to find a pattern, but only succeed in creating a loud feedback loop that draws stares from the other clerks.`,
            choices: {
                force_break: `Smash the console in frustration.`
            }
        },
        end_success: {
            text: `Lotte smiles, a rare, genuine smile. "I knew it. We have them now." She pockets the transcript. "Thank you for listening."`,
            choices: {}
        },
        end_fail: {
            text: `You stand alone in the telegraph office. The machines keep clicking, indifferent to your failure.`,
            choices: {}
        },
        end_broke: {
            text: `The supervisor rushes over. "What is the meaning of this?!" You're escorted out. Lotte pretends not to know you.`,
            choices: {}
        }
    }
};
