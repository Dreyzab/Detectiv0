import type { VNContentPack } from '../../../../model/types';

export const QUEST_VICTORIA_POETRY_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'arrival': {
            text: 'Victoria zieht den Schal enger. Das Rote Zahnrad summt aus leisen Gesprachen und Tabakrauch. "Es wirkt... lebendig. Sind Sie sicher, dass man mich in diesen Kleidern nicht erkennt?"'
        },
        'bouncer_interaction': {
            text: 'Ein breitschultriger Mann in Metzgerschurze versperrt die Tur. "Heute nur fur Mitglieder. Wer seid ihr?"',
            choices: {
                'bribe_bouncer': '[5 Mark] "Wir sind Gonner der Kunst. Und durstig."',
                'charm_bouncer': '[Charisma] "Meine Cousine ist Poetin aus Berlin. Sie besteht darauf, zuerst das lokale Talent zu horen, bevor sie an Langeweile stirbt."',
                'authority_bouncer': '[Autoritat] "Inspektion. Zur Seite, sonst lasse ich dieses Loch schliessen."'
            }
        },
        'entry_fail': {
            text: 'Der Tursteher verschrankt die Arme. "Keine Chance. Verschwindet." Victoria wirkt enttauscht, als Sie sich in die kalte Nacht zuruckziehen.'
        },
        'entry_success': {
            text: 'Der Tursteher tritt grummelnd beiseite. Drinnen ist die Luft dick von Rauch und revolutionarem Eifer. Arbeiter hocken uber billigem Bier und streiten uber Philosophie.'
        },
        'poetry_performance': {
            text: 'Das Licht dimmt. Ein junger Mann mit kohlenverschmierten Handen steigt auf eine Kiste. Er raeuspert sich.'
        },
        'poetry_round_1': {
            text: '"Die Eiserne Mutter frisst ihr Kind,\n  mit Dampfzahn und mit Dungelunge im Wind.\n  Wir futtern sie mit Kohle, mit Knochen, mit Schrein,\n  und schlafen auf ihrem steinernen Bein."',
            choices: {
                'analyze_structure': '[Logik] Die industrielle Bildsprache analysieren.',
                'feel_rhythm': '[Glucksspiel] Den mechanischen Rhythmus der Verse spuren.'
            }
        },
        'poetry_round_2': {
            text: '"Der Seidenherr im Turme hoch,\n  trinkt Abendrot im goldnen Joch.\n  Er sieht die blutigen Hande nicht,\n  die Samen tragen ins Pflichtgesicht."',
            choices: {
                'analyze_metaphor': '[Enzyklopadie] Die Anspielung auf den "Seidenherrn" entschlusseln.',
                'sense_anger': '[Empathie] Den rohen Zorn unter den Worten erfassen.'
            }
        },
        'poetry_round_3': {
            text: '"Doch Zahnrader knirschen, Bolzen brechen,\n  die Zeit des Schweigens will zerstechen.\n  Wenn Kolben stockt und Welle bebt,\n  die Eiserne Mutter endlich lebt!"',
            choices: {
                'connect_politics': '[Autoritat] Den Aufruf zum Streik politisch zerlegen.',
                'absorb_impact': '[Willenskraft] Dem revolutionaren Furor standhalten.'
            }
        },
        'victoria_moved': {
            text: 'Der Raum bricht in dumpfes Tischklopfen und Beifall aus. Victoria ist wie gebannt, die Augen weit. "Ich wusste nicht... dass Worte sich wie Waffen anfuhlen konnen." Ihre Augen fullen sich mit Tranen.',
            choices: {
                'share_insight': 'Die tiefere Bedeutung erklaren, die Sie herausgelesen haben.',
                'leave_quietly': 'Flustern: "Wir sollten gehen, bevor wir Aufmerksamkeit ziehen."',
                'applaud': 'Offen mitklatschen.'
            }
        },
        'discuss_meaning': {
            text: 'Sie lehnen sich nah zu ihr. "Das ist nicht nur Zorn. Das ist ein Bauplan fur eine neue Welt. Das "Zahnrad" ist nicht die Maschine, sondern der Arbeiter, der erkennt, dass er sie anhalten kann." Victoria nickt, in ihrem Blick zuckt ein Funke Verstehen. "Es ist wunderschon", flustert sie.',
            choices: {}
        },
        'success_quiet': {
            text: 'Sie gleiten in die kuhle Nachtluft hinaus. Victoria schweigt lange. "Danke", sagt sie schliesslich. "Mein Vater... er glaubt, das seien nur Tiere. Aber sie tragen Feuerseelen in sich."'
        },
        'success_loud': {
            text: 'Sie klatschen. Einige Kopfe drehen sich, mustern Ihre Kleidung misstrauisch. An den Nachbartischen wird es still. Victoria packt Ihren Arm, elektrisiert und erschrocken zugleich. "Wir sollten rennen", lacht sie und zieht Sie zur Tur hinaus.'
        },
        'END_SUCCESS': {
            text: 'Die Nacht schliesst sich uber Freiburg, wahrend Victoria mit festerer Stimme und scharferem Blick weitergeht.'
        },
        'END_FAIL': {
            text: 'Die Turen bleiben heute geschlossen. Auf dem Ruckweg sagt Victoria wenig, aber sie denkt weiter.'
        }
    }
};

export default QUEST_VICTORIA_POETRY_DE;
