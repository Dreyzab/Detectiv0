import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_QR_SCAN_BANK_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_qr_scan_bank',
    title: 'Case 1 - QR Bank Gate',
    defaultBackgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
    initialSceneId: 'qr_gate',
    mode: 'fullscreen',
    scenes: {
        'qr_gate': {
            id: 'qr_gate',
            characterId: 'inspector',
            choices: [
                {
                    id: 'qr_scan_now',
                    nextSceneId: 'qr_success'
                },
                {
                    id: 'qr_manual_code',
                    nextSceneId: 'qr_manual_entry'
                },
                {
                    id: 'qr_skip_legacy',
                    nextSceneId: 'qr_skip_result',
                    actions: [{ type: 'add_flag', payload: { 'qr_bypassed_bank': true } }]
                }
            ]
        },
        'qr_manual_entry': {
            id: 'qr_manual_entry',
            characterId: 'inspector',
            choices: [
                {
                    id: 'qr_manual_confirm',
                    nextSceneId: 'qr_success'
                },
                {
                    id: 'qr_manual_retry',
                    nextSceneId: 'qr_gate'
                }
            ]
        },
        'qr_skip_result': {
            id: 'qr_skip_result',
            characterId: 'inspector',
            nextSceneId: 'qr_success'
        },
        'qr_success': {
            id: 'qr_success',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'case01', stage: 'bank_investigation' } },
                { type: 'unlock_point', payload: 'loc_freiburg_bank' },
                {
                    type: 'add_flag', payload: {
                        'near_bank': false,
                        'qr_scanned_bank': true,
                        'bank_location_entered': true
                    }
                }
            ]
        }
    }
};

export default CASE1_QR_SCAN_BANK_LOGIC;
