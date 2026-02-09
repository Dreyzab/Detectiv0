import type { VNContentPack } from '../../../../../model/types';

export const CASE1_QR_SCAN_BANK_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'qr_gate': {
            text: 'Vor dem Haupteingang spannt die Gendarmerie eine Kette. Ein Messingschild am Pfosten warnt: "Ermittlungszugang nur uber codiertes Gate."\n\nAngestellte, Zeugen und Neugierige stehen in getrennten Reihen. Wenn Sie jetzt eintreten, wird der Zeitpunkt aktenkundig.',
            choices: {
                'qr_scan_now': 'Gate-Marker jetzt scannen.',
                'qr_manual_code': 'Manuellen Ersatzcode verwenden.',
                'qr_skip_legacy': 'Legacy-Bypass erzwingen (instabiler Pfad).'
            }
        },
        'qr_manual_entry': {
            text: 'Der Schalterbeamte schiebt ein codiertes Register heruber. "Kein Kamerabild? Dann nur mit Handcode und Prufsumme."\n\nIhre Hand bleibt uber der Eingabe stehen. Ein falsches Zeichen, und die Warteschlange hinter Ihnen verdoppelt sich.',
            choices: {
                'qr_manual_confirm': 'BANK05 eintragen und gegenzeichnen.',
                'qr_manual_retry': 'Abbrechen und den Scan neu versuchen.'
            }
        },
        'qr_skip_result': {
            text: 'Sie drucken den Zugang uber alte Autoritat durch. Der Wachposten halt Sie nicht auf, notiert aber Ihren Namen in voller Lange.\n\nWenn etwas kippt, taucht dieser Bypass im Bericht auf.'
        },
        'qr_success': {
            text: 'Freigabe bestatigt. Die Kette wird geoffnet. Ein schmaler Korridor fuhrt aus dem Publikumsbereich direkt in den gesicherten Tatortsektor.\n\nDie Bank-Ermittlung vor Ort beginnt jetzt.'
        }
    }
};

export default CASE1_QR_SCAN_BANK_DE;
