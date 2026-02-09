import type { VNContentPack } from '../../../../../model/types';

export const CASE1_QR_SCAN_BANK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'qr_gate': {
            text: 'A gendarme rope line seals the bank entrance. A brass placard on the post reads: "Investigative access by encoded gate only."\n\nClerks, witnesses, and opportunists all queue under watchful eyes. If you enter, everyone will know exactly when.',
            choices: {
                'qr_scan_now': 'Scan the gate marker now.',
                'qr_manual_code': 'Use the manual fallback code.',
                'qr_skip_legacy': 'Force legacy bypass (unstable route).'
            }
        },
        'qr_manual_entry': {
            text: 'The guard station clerk slides a coded ledger toward you. "No camera, no problem. Manual credential accepted if the checksum is correct."\n\nYour fingers hover over the entry key. One wrong digit, and the line doubles behind you.',
            choices: {
                'qr_manual_confirm': 'Submit BANK05 and sign the register.',
                'qr_manual_retry': 'Abort manual input and retry camera scan.'
            }
        },
        'qr_skip_result': {
            text: 'You lean on old authority and bypass the gate protocol. The guard does not stop you, but he writes your name down anyway.\n\nIf this goes wrong, the bypass becomes part of the report.'
        },
        'qr_success': {
            text: 'Access confirmed. The chain drops. A corridor opens from public marble into controlled evidence space.\n\nBank investigation is now live.'
        }
    }
};

export default CASE1_QR_SCAN_BANK_EN;
