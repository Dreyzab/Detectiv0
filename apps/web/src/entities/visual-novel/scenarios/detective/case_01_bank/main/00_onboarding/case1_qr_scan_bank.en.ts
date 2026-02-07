import type { VNContentPack } from '../../../../../model/types';

export const CASE1_QR_SCAN_BANK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'qr_gate': {
            text: 'You stand before Bankhaus Krebs. Entry requires the location QR gate.',
            choices: {
                'qr_scan_now': 'Scan QR now.',
                'qr_manual_code': 'Use manual fallback code.',
                'qr_skip_legacy': 'Continue without scan (legacy path).'
            }
        },
        'qr_manual_entry': {
            text: 'Manual code input ready. Use BANK05 to confirm location access.',
            choices: {
                'qr_manual_confirm': 'Submit BANK05.',
                'qr_manual_retry': 'Cancel and retry camera scan.'
            }
        },
        'qr_skip_result': {
            text: 'Legacy override accepted for this build.'
        },
        'qr_success': {
            text: 'Gate validated. Transitioning to on-site bank investigation.'
        }
    }
};

export default CASE1_QR_SCAN_BANK_EN;
