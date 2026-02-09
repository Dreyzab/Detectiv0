import type { VNContentPack } from '../../model/types';

export const encounterTouristDe: VNContentPack = {
    locale: 'de',
    scenes: {
        start: {
            text: 'Ein rotgesichtiger Herr im Tweedanzug ringt mit einer grossen Karte, die sich im Wind gegen ihn zu wehren scheint. Er entdeckt Sie. "Ich sage! Entschuldigen Sie! Ich habe die Berge... verlegt. Ich suche das **Hollental**. Ist es... dort oben?" Er zeigt vage auf den Munsterturm.',
            choices: {
                directions: '[Enzyklopadie] Ihm den Weg zum Bahnhof fur die Hollentalbahn prazise erklaren.',
                pub: '[Willenskraft] Empfehlen, vor "Hollental" erst ein Bier zu trinken.',
                ignore: 'So tun, als wurden Sie weder Englisch noch Deutsch verstehen.'
            }
        },
        guide_success: {
            text: '[[encyclopedia|Enzyklopadie Erfolg]]: "Ins Hollental geht man mit der Bahn, nicht zu Fuss. Gleis 4, Lok mit Zahnradantrieb. Es wird steil." Der Tourist strahlt. "Zahnrad! Grandios! Deutsche Ingenieurskunst, was?" Er druckt Ihnen einen frischen Geldschein in die Hand. "Fur Ihre Muhe, mein Herr."',
            choices: {
                leave: 'Trinkgeld annehmen und nicken.'
            }
        },
        guide_fail: {
            text: '[[encyclopedia|Enzyklopadie Fehlschlag]]: Sie zeigen selbstsicher nach Suden. "Einfach dem Fluss folgen. Nicht zu verfehlen." Er sieht unsicher aus. "Dem Fluss? Aber die Karte sagt... ach, schon gut. Danke." Er geht in die falsche Richtung. Zum Abendessen ist er vermutlich in Frankreich.',
            choices: {
                leave: 'Ihm nachsehen, bis er verschwindet.'
            }
        },
        pub_success: {
            text: '[[volition|Willenskraft Erfolg]]: "Schauen Sie den Himmel an. Sturm im Anzug. Das Tal lauft nicht weg. Aber die **Feierling**-Brauerei ist gleich um die Ecke." Er blickt hoch, dann zu Ihnen. "Bei Gott, Sie haben recht. Erst ein Pint. Vorzugliche Idee!" Er lupft den Hut.',
            choices: {
                leave: 'Ein Leben vor Regen gerettet.'
            }
        },
        pub_fail: {
            text: '[[volition|Willenskraft Fehlschlag]]: "Gehen Sie halt Bier trinken." Zu direkt. Er richtet sich steif auf. "Ich bin wegen der Erhabenheit der Natur hier, Sir, nicht wegen Trunkenheit! Guten Tag!" Er marschiert beleidigt davon.',
            choices: {
                leave: 'Mit den Schultern zucken.'
            }
        },
        end_ignore: {
            text: 'Sie murmeln etwas in unverstandlichem Dialekt und eilen vorbei. "Auslander...", horen Sie ihn seufzen.',
            choices: {}
        },
        end: {
            text: 'Die Begegnung verrauscht. Die Stadt fliesst um Sie herum weiter.',
            choices: {}
        }
    }
};

export default encounterTouristDe;
