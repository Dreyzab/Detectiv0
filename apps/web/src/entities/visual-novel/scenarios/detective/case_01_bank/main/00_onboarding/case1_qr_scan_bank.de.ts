import type { VNContentPack } from '../../../../../model/types';

export const CASE1_QR_SCAN_BANK_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'qr_gate': {
            text: 'Sie stehen vor dem Bankhaus Krebs. Der Zutritt erfordert die QR-Freigabe fur diesen Ort.',
            choices: {
                'qr_scan_now': 'QR jetzt scannen.',
                'qr_manual_code': 'Manuellen Ersatzcode verwenden.',
                'qr_skip_legacy': 'Ohne Scan fortfahren (Legacy-Pfad).'
            }
        },
        'qr_manual_entry': {
            text: 'Manuelle Codeeingabe bereit. Verwenden Sie BANK05, um den Ortszugang zu bestaetigen.',
            choices: {
                'qr_manual_confirm': 'BANK05 absenden.',
                'qr_manual_retry': 'Abbrechen und Kamerascan erneut versuchen.'
            }
        },
        'qr_skip_result': {
            text: 'Legacy-Override fur diesen Build akzeptiert.'
        },
        'qr_success': {
            text: 'Freigabe bestaetigt. Wechsel zur Bank-Ermittlung vor Ort.'
        }
    }
};

export default CASE1_QR_SCAN_BANK_DE;
