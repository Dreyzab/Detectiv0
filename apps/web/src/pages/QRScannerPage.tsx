import { useState } from 'react';
// import { resolveHardlink } from '../features/detective/hardlinks'; // REMOVED
import { api } from '@/shared/api/client';
import { useDossierStore } from '../features/detective/dossier/store';
import { useQuestStore } from '../features/quests/store';
import { Button } from '../shared/ui/Button';
import { useVNStore } from '../entities/visual-novel/model/store';
import { getScenarioById } from '../entities/visual-novel/scenarios/registry';
import { EVIDENCE_REGISTRY } from '../features/detective/registries';

// Localization
import { SCANNER_UI } from '../features/scanner/locales';
import { asLocale } from '../features/quests/utils';

// Types
import type { MapAction } from '@repo/shared/lib/detective_map_types';

export const QRScannerPage = () => {
    const { setPointState, addEvidence, setFlag } = useDossierStore();
    const setQuestStage = useQuestStore((state) => state.setQuestStage);

    const [manualInput, setManualInput] = useState('');
    const [lastResult, setLastResult] = useState<string>('');

    const { locale } = useVNStore();
    const ui = SCANNER_UI[asLocale(locale)];

    const handleScan = async (code: string) => {
        // Eden Treaty Call
        const { data, error } = await api.map['resolve-code']({ code }).get();

        if (error || !data?.success || !data.actions) {
            setLastResult(`${ui.result_unknown} ${code} (${error?.status || 'Active'})`);
            return;
        }

        // Cast strictly to shared type, as API returns JSONB/Any currently
        const actions = data.actions as MapAction[];
        let summary = '';

        actions.forEach((action) => {
            switch (action.type) {
                case 'start_vn': {
                    // Pass scenario ID, not scenario object
                    useVNStore.getState().startScenario(action.scenarioId);
                    const scenario = getScenarioById(action.scenarioId);
                    summary += scenario ? `${ui.result_scenario} ${scenario.title}\n` : `${ui.result_scenario} ${action.scenarioId}\n`;
                    break;
                }
                case 'grant_evidence': {
                    const evidence = EVIDENCE_REGISTRY[action.evidenceId];
                    if (evidence) {
                        addEvidence(evidence);
                        summary += `${ui.result_evidence} ${evidence.name}\n`;
                    } else {
                        summary += `${ui.result_evidence} [ID: ${action.evidenceId}] (?)\n`;
                    }
                    break;
                }
                case 'unlock_point':
                    setPointState(action.pointId, 'discovered');
                    summary += `${ui.result_map} ${action.pointId}\n`;
                    break;
                case 'add_flags':
                    action.flags.forEach(f => setFlag(f, true));
                    summary += `${ui.result_flags}\n`;
                    break;
                case 'set_quest_stage':
                    setQuestStage(action.questId, action.stage);
                    summary += `Quest stage: ${action.questId} -> ${action.stage}\n`;
                    break;
            }
        });

        setLastResult(`${ui.result_success}\n${summary}`);
    };

    return (
        <div className="p-4 flex flex-col items-center gap-4 max-w-md mx-auto h-screen bg-[#1a1612] text-[#d4c5a3] font-serif">
            <h1 className="text-2xl font-bold">{ui.title}</h1>

            <div className="w-full bg-[#2a241e] p-4 rounded-lg border border-[#d4c5a3]/30 shadow-inner">
                {/* Mock Camera View */}
                <div className="aspect-square bg-[#0f0d0b] rounded-lg flex items-center justify-center text-[#8c7b6c] mb-4 border border-[#d4c5a3]/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
                    {ui.camera_placeholder}
                </div>

                {/* Manual Input (Simulation) */}
                <div className="flex flex-col gap-3">
                    <input
                        value={manualInput}
                        onChange={e => setManualInput(e.target.value)}
                        placeholder={ui.input_placeholder}
                        className="w-full border border-[#d4c5a3]/50 p-3 rounded bg-[#1a1612] text-[#d4c5a3] placeholder-[#8c7b6c] outline-none focus:border-amber-500 transition-colors"
                    />
                    <Button
                        onClick={() => handleScan(manualInput)}
                        className="w-full bg-[#8c7b6c] hover:bg-[#a69584] text-[#1a1612] font-bold border border-[#d4c5a3]"
                    >
                        {ui.btn_scan}
                    </Button>
                </div>
            </div>

            {lastResult && (
                <div className="w-full mt-4">
                    <p className="text-xs font-bold mb-1 text-[#8c7b6c]">{ui.label_last_result}</p>
                    <pre className="w-full text-xs bg-[#2a241e] p-3 rounded border border-[#d4c5a3]/30 overflow-x-auto whitespace-pre-wrap text-amber-200">
                        {lastResult}
                    </pre>
                </div>
            )}

            {/* Quick Actions for Testing */}
            <div className="w-full text-sm mt-auto pb-4">
                <p className="font-bold mb-2 text-[#8c7b6c]">{ui.label_quick_test}</p>
                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="text-xs border-[#d4c5a3]/30" onClick={() => handleScan('CASE01_BRIEFING_01')}>Briefing</Button>
                    <Button variant="secondary" className="text-xs border-[#d4c5a3]/30" onClick={() => handleScan('CASE01_BANK_02')}>Bank</Button>
                    <Button variant="secondary" className="text-xs border-[#d4c5a3]/30" onClick={() => handleScan('CASE01_PUB_03')}>Pub</Button>
                </div>
            </div>
        </div>
    );
};

