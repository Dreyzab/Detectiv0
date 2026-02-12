import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_INVESTIGATE_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        estate_entry: {
            text: 'Das Anwesen knarzt im Winterwind. Clara klappt ihr Notizbuch auf: "Erst Beweise sammeln, dann beschuldigen."',
            choices: {
                inspect_cold_hall: 'Den eiskalten Flur untersuchen',
                inspect_fireplace: 'Die Kaminwand pruefen',
                question_servant: 'Die Dienerin befragen',
                inspect_residue: 'Leuchtende Rueckstaende untersuchen',
                summarize_findings: 'Erkenntnisse zusammenfassen',
                leave_estate: 'Anwesen vorerst verlassen'
            }
        },
        cold_draft_clue: {
            text: 'Ein messerscharfer Luftzug schneidet durch den versiegelten Gang. Kein Fenster, kein Schacht, keine einfache Erklaerung.'
        },
        hidden_passage_clue: {
            text: 'Hinter einer Kaminplatte liegt ein schmaler Geheimgang mit frischem Schlamm auf den Stufen.'
        },
        servant_testimony_clue: {
            text: '"Jede Nacht bebt die Kellertuer", sagt die Dienerin. "Und jemand geht den Flur entlang, ohne Schritte."'
        },
        ectoplasm_clue: {
            text: 'Der gruene Rueckstand leuchtet selbst im Dunkeln schwach auf und bleibt eisig auf der Haut.'
        },
        estate_outro: {
            text: 'Sie haben genug Material fuer eine saubere Deduktion. Die Gilde kann Ihren Fall nun bewerten.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_GHOST_INVESTIGATE_DE;
