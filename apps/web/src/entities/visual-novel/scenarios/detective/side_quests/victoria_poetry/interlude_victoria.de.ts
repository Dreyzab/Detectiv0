import type { VNContentPack } from '../../../../model/types';

export const INTERLUDE_VICTORIA_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'street_encounter': {
            text: 'Sie gehen mit Victoria die Kaiser-Joseph-Strasse entlang. Plotzlich spuckt ein [[Bettler]] vor ihre Fusse. "Hure! Parasitin! Tochter eines Diebs!"'
        },
        'victoria_reaction': {
            text: 'Victoria erstarrt. Ihr Gesicht wird erst blass, dann rot. Sie umklammert den Sonnenschirm, bis die Knochel weiss werden. Der Bettler verschwindet in der Menge.'
        },
        'victoria_confession': {
            text: '"Fruher haben sie den Hut gezogen", flustert sie mit bebender Stimme. "Jetzt sehen sie mich an, als hatte ich sie personlich ausgehungert. Bin ich das, Inspektor? Nur... die Tochter meines Vaters?"',
            choices: {
                'comfort_empathy': '[Empathie] "Sie sind ein eigener Mensch, Victoria. Nicht die Sunden Ihres Vaters."',
                'challenge_authority': '[Autoritat] "Ignorieren Sie sie. Wolfe bellen nach dem, was sie nicht erreichen konnen."',
                'ignore': 'Nichts sagen.'
            }
        },
        'comfort_success': {
            text: 'Sie sieht Sie uberrascht an. "Ein eigener Mensch... ich versuche es. Aber diese Stadt... sie erinnert sich an Namen." Sie atmet tief ein. "Danke. Das musste ich horen."'
        },
        'comfort_fail': {
            text: '"Leicht gesagt. Sie tragen nicht den Namen von Krebs." Sie blickt weg, fern.'
        },
        'challenge_success': {
            text: 'Sie richtet den Rucken auf und uberdeckt den Schmerz mit Stolz. "Sie haben recht. Ich sollte den Pobel nicht an mich heranlassen. Ich bin schliesslich eine Krebs."'
        },
        'challenge_fail': {
            text: '"Das sind keine Wolfe, Inspektor. Das sind hungrige Menschen. Und mein Vater..." Sie bricht ab und geht voran.'
        },
        'ignore_res': {
            text: 'Die Stille zieht sich zwischen Ihnen. Victoria seufzt und fasst sich, doch die Distanz bleibt.'
        }
    }
};

export default INTERLUDE_VICTORIA_DE;
