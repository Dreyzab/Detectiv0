import { useState } from 'react';
// import { resolveHardlink } from '../features/detective/hardlinks'; // REMOVED
import { api } from '@/shared/api/client';
import { Button } from '../shared/ui/Button';
import { getScenarioById } from '../entities/visual-novel/scenarios/registry';
import { useTranslation } from 'react-i18next';
import { useMapActionHandler } from '../features/detective/lib/map-action-handler';
import { getPackMeta } from '@repo/shared/data/pack-meta';
import { resolveRegionMeta } from '@repo/shared/data/regions';

// Types
import type { MapAction } from '@repo/shared/lib/detective_map_types';

export const QRScannerPage = () => {
    const { executeAction } = useMapActionHandler();

    const [manualInput, setManualInput] = useState('');
    const [lastResult, setLastResult] = useState<string>('');

    const { t } = useTranslation('scanner');

    const handleScan = async (code: string) => {
        const normalizedCode = code.trim();
        if (!normalizedCode) {
            setLastResult(`${t('result.unknown')} ${code} (400)`);
            return;
        }

        // Contract-driven POST call
        const { data, error } = await api.map['resolve-code'].post({
            body: { code: normalizedCode }
        });

        if (error || !data?.success || !data.actions) {
            setLastResult(`${t('result.unknown')} ${normalizedCode} (${error?.status || 'Active'})`);
            return;
        }

        const actions = data.actions as MapAction[];
        const summaryLines: string[] = [];

        for (const action of actions) {
            executeAction(action);
            switch (action.type) {
                case 'start_vn': {
                    const scenario = getScenarioById(action.scenarioId);
                    summaryLines.push(scenario ? `${t('result.scenario')} ${scenario.title}` : `${t('result.scenario')} ${action.scenarioId}`);
                    break;
                }
                case 'grant_evidence':
                    summaryLines.push(`${t('result.evidence')} ${action.evidenceId}`);
                    break;
                case 'unlock_point':
                    summaryLines.push(`${t('result.map')} ${action.pointId}`);
                    break;
                case 'unlock_group':
                    summaryLines.push(`${t('result.map')} group:${action.groupId}`);
                    break;
                case 'add_flags':
                    summaryLines.push(`${t('result.flags')} (${action.flags.join(', ')})`);
                    break;
                case 'set_quest_stage':
                    summaryLines.push(`Quest stage: ${action.questId} -> ${action.stage}`);
                    break;
                case 'set_region': {
                    const region = resolveRegionMeta(action.regionId);
                    if (!region) {
                        summaryLines.push(`Region: ${action.regionId}`);
                        break;
                    }
                    const packMeta = getPackMeta(region.packId);
                    summaryLines.push(`Region: ${region.name} (${packMeta.packId})`);
                    break;
                }
                case 'set_active_case':
                    summaryLines.push(`Case: ${action.caseId}`);
                    break;
                default:
                    summaryLines.push(`Action: ${action.type}`);
                    break;
            }
        }

        setLastResult(`${t('result.success')}\n${summaryLines.join('\n')}`);
    };

    return (
        <div className="p-4 flex flex-col items-center gap-4 max-w-md mx-auto h-screen bg-[#1a1612] text-[#d4c5a3] font-serif">
            <h1 className="text-2xl font-bold">{t('title')}</h1>

            <div className="w-full bg-[#2a241e] p-4 rounded-lg border border-[#d4c5a3]/30 shadow-inner">
                {/* Mock Camera View */}
                <div className="aspect-square bg-[#0f0d0b] rounded-lg flex items-center justify-center text-[#8c7b6c] mb-4 border border-[#d4c5a3]/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
                    {t('cameraPlaceholder')}
                </div>

                {/* Manual Input (Simulation) */}
                <div className="flex flex-col gap-3">
                    <input
                        value={manualInput}
                        onChange={e => setManualInput(e.target.value)}
                        placeholder={t('inputPlaceholder')}
                        className="w-full border border-[#d4c5a3]/50 p-3 rounded bg-[#1a1612] text-[#d4c5a3] placeholder-[#8c7b6c] outline-none focus:border-amber-500 transition-colors"
                    />
                    <Button
                        onClick={() => handleScan(manualInput)}
                        className="w-full bg-[#8c7b6c] hover:bg-[#a69584] text-[#1a1612] font-bold border border-[#d4c5a3]"
                    >
                        {t('btnScan')}
                    </Button>
                </div>
            </div>

            {lastResult && (
                <div className="w-full mt-4">
                    <p className="text-xs font-bold mb-1 text-[#8c7b6c]">{t('label.lastResult')}</p>
                    <pre className="w-full text-xs bg-[#2a241e] p-3 rounded border border-[#d4c5a3]/30 overflow-x-auto whitespace-pre-wrap text-amber-200">
                        {lastResult}
                    </pre>
                </div>
            )}

            {/* Quick Actions for Testing */}
            <div className="w-full text-sm mt-auto pb-4">
                <p className="font-bold mb-2 text-[#8c7b6c]">{t('label.quickTest')}</p>
                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="text-xs border-[#d4c5a3]/30" onClick={() => handleScan('GW4_GATE_FR_HBF')}>FR Gateway</Button>
                    <Button variant="secondary" className="text-xs border-[#d4c5a3]/30" onClick={() => handleScan('GW4_GATE_KA_HBF')}>KA Gateway</Button>
                    <Button variant="secondary" className="text-xs border-[#d4c5a3]/30" onClick={() => handleScan('CASE01_BANK_02')}>Legacy Bank</Button>
                </div>
            </div>
        </div>
    );
};

