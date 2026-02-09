import type { VNContentPack } from '../../model/types';

export const encounterStudentDe: VNContentPack = {
    locale: 'de',
    scenes: {
        start: {
            text: 'Nahe der Universitatsbibliothek taumelt ein junger Mann aus einer Schenke, das Gesicht frisch verbunden. Er riecht nach billigem Branntwein und Iod. Er stost gegen Sie, richtet sich dann mit schwankender Wurde auf. "Sie! Sie starren auf meinen *Schmiss*, oder? Neidisch auf ein Ehrenzeichen?"',
            choices: {
                authority: '[Autoritat] "Ruhig, Junge. Sie sind betrunken und bluten. Nach Hause, bevor ich Sie wegen Ruhestorung festnehme."',
                volition: '[Willenskraft] Ruhig zur Seite treten. Ein Kind, das Soldat spielt.',
                engage: 'Nach dem Duell fragen.'
            }
        },
        auth_success: {
            text: '[[authority|Autoritat Erfolg]]: Ihre Stimme knallt wie eine Peitsche. Der Student blinzelt, seine Fassade fallt sofort. Er erkennt den Ton eines Vorgesetzten oder strengen Vaters. "J-jawohl, mein Herr. Nur... Mensur gefeiert. Verzeihung." Er salutiert schief und eilt davon.',
            choices: {
                leave: 'Ihm nachsehen.'
            }
        },
        auth_fail: {
            text: '[[authority|Autoritat Fehlschlag]]: "Mich verhaften? Ha! Mein Vater ist Richter! Wer sind Sie, irgendein Strassenpolizist?" Er stosst gegen Ihre Brust. Umstehende beginnen zu tuscheln. Sie haben die Lage nur verscharft.',
            choices: {
                escalate: 'Seine Aggression bremsen.',
                leave: 'Gehen, bevor es haesslich wird.'
            }
        },
        comp_success: {
            text: '[[volition|Willenskraft Erfolg]]: Sie blicken durch ihn hindurch, als bestunde er aus Glas. Ruhig treten Sie zur Seite und sehen auf die Uhr. Das vollige Ausbleiben einer Reaktion nimmt ihm den Wind. "Bah. Philister", murmelt er, lasst Sie aber passieren.',
            choices: {
                leave: 'Weiter.'
            }
        },
        comp_fail: {
            text: '[[volition|Willenskraft Fehlschlag]]: Sie wollen ausweichen, doch er stellt sich in den Weg und deutet Ihr Schweigen als Feigheit. "Flucht? Beleidigt die Ehre der Rhenania?" Er spuckt nahe Ihren Stiefel. Ihre Hand zuckt zum Schlagstock.',
            choices: {
                confront: 'Das verlangt eine Antwort.',
                leave_shame: 'Die Beleidigung schlucken und gehen.'
            }
        },
        engage_dialogue: {
            text: '"Ehrenzeichen, sagen Sie? Sieht schmerzhaft aus." Der Student strafft die Schultern. "Schmerz vergeht. Ehre bleibt. Es war eine *Pro-Patria-Suite*. 30 Gange. Ich habe kein Mal gezuckt."',
            choices: {
                ask_scar: '"Und Ihr Gegner?"',
                leave: '"Beeindruckend. Guten Tag."'
            }
        },
        ask_scar_scene: {
            text: '"Er... nun, er hat jetzt dieselbe Narbe. Wir sind Blutbruder." Er beruhrt den Verband zartlich. Ihnen wird klar: Diese ritualisierte Gewalt bindet die Elite der Stadt enger als jedes Gesetz.',
            choices: {
                leave: 'Information sichern.'
            }
        },
        duel_threat: {
            text: '"Genugtuung! Ich verlange Genugtuung!" Er versucht ungelenk ein nicht vorhandenes Schwert zu ziehen und merkt erst dann, dass er unbewaffnet ist. "Nennen Sie Ihre Sekundanten!"',
            choices: {
                accept: 'Spottend annehmen.',
                decline: 'Ihn in seinem Suff zurucklassen.'
            }
        },
        end_duel: {
            text: 'Sie verbeugen sich spottisch. "Meine Sekundanten melden sich." Die Menge lacht. Er wird tiefrot. Die Menge ist auf Ihrer Seite, aber Sie haben sich einen Feind gemacht.',
            choices: {}
        },
        end: {
            text: 'Sie lassen den Studenten zuruck. Eine weitere Narbe im Gesicht dieser Stadt.',
            choices: {}
        }
    }
};

export default encounterStudentDe;
