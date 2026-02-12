import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_CONCLUDE_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        conclusion_intro: {
            text: 'Sie tragen Ihre Schlussanklage im Gutshaus vor. Alle verhaerten, waehrend jeder Hinweis laut genannt wird.',
            choices: {
                accuse_supernatural: 'Uebernatuerliche Ursache anklagen',
                accuse_contraband: 'Schmuggelnetz anklagen',
                push_weak_accusation: 'Schwache Anklage trotzdem durchdruecken',
                review_evidence: 'Beweise zuerst ordnen'
            }
        },
        evidence_recap: {
            text: 'Clara ordnet die Fakten: Zugluft plus Rueckstand stuetzen die Geisterspur; Geheimgang plus Zeugenaussage stuetzen Schmuggel. Mit vollstaendigem Paar ist beides belastbar.'
        },
        weak_accusation: {
            text: 'Der Saal geht auf Distanz. Clara faengt den Moment ab und fordert: entweder belastbare Linie waehlen oder den Vorwurf zurueckziehen.',
            choices: {
                reconsider_supernatural: 'Neu ansetzen: Geisterspur',
                reconsider_contraband: 'Neu ansetzen: Schmuggelspur',
                withdraw_and_return_map: 'Rueckzug und zur Karte'
            }
        },
        verdict_supernatural: {
            text: 'Sie bauen die Geisterthese ueber kalte Zugluft und Rueckstand sauber auf. Das Gut akzeptiert das Urteil und fordert rituelle Sicherung.'
        },
        verdict_contraband: {
            text: 'Sie verbinden Geheimgang und Zeugenaussage zu einer Schmuggeloperation. Das Gut laesst den Keller sichern und meldet die Route.'
        },
        conclusion_outro: {
            text: 'Der Gutshaus-Fall ist abgeschlossen und im Karlsruher Journal vermerkt.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_GHOST_CONCLUDE_DE;
