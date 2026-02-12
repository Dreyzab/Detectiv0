import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_CASINO_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        casino_arrival: {
            text: 'Gruenes Tuch, klappernde Chips, Friedrich am Haupttisch. Er spricht erst nach einem Duell.',
            choices: {
                start_duel: 'Das Duell annehmen',
                step_back: 'Vorlaeufig zurueckziehen'
            }
        },
        launch_duel: {
            text: 'Sie nehmen Platz. Der Tisch verstummt, waehrend die ersten Karten verteilt werden.'
        },
        casino_fallout: {
            text: 'Das Duell ist beendet. Friedrich bestaetigt die Schuldenkette und die nachtraeglichen Buchkorrekturen seines Vaters.',
            choices: {
                expose_publicly: 'Die Wahrheit oeffentlich machen',
                settle_privately: 'Die Sache intern regeln'
            }
        },
        resolution_public: {
            text: 'Sie legen alles offen. Die Stadt erfaehrt die Wahrheit, doch die Familie zerbricht daran.'
        },
        resolution_private: {
            text: 'Sie halten den Skandal hinter verschlossenen Tueren. Die Familie bleibt angeschlagen, aber nicht oeffentlich vernichtet.'
        },
        case_closed: {
            text: 'Der Banker-Vertrag ist abgeschlossen. Auf der Stadtkarte warten neue Schritte.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_BANKER_CASINO_DE;
