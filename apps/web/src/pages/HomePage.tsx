import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useInventoryStore } from '../entities/inventory/model/store';
import { useDossierStore } from '../features/detective/dossier/store';
import { useQuestStore } from '../features/quests/store';
import { useVNStore } from '../entities/visual-novel/model/store';
import { Button } from '../shared/ui/Button';
import { OnboardingModal } from '../features/detective/onboarding/OnboardingModal';
import { useState } from 'react';
import { getScenarioById } from '../entities/visual-novel/scenarios/registry';
import { preloadManager, extractScenarioAssets, toPreloadQueue } from '../shared/lib/preload';


export const HomePage = () => {
    const navigate = useNavigate();
    const setGameMode = useInventoryStore(state => state.setGameMode);
    const setPlayerName = useInventoryStore(state => state.setPlayerName);
    const [showTelegram, setShowTelegram] = useState(false);

    // Check for active session
    const activeScenarioId = useVNStore(state => state.activeScenarioId);
    const locale = useVNStore(state => state.locale);

    // Preload VN assets in background
    useEffect(() => {
        const targetId = activeScenarioId || 'detective_case1_briefing';
        const scenario = getScenarioById(targetId, locale);
        if (scenario) {
            const assets = extractScenarioAssets(scenario);
            const queue = toPreloadQueue(assets);
            preloadManager.preloadScenario(targetId, queue, { priority: 1 });
        }
    }, [activeScenarioId, locale]);

    // We need to know if it is fullscreen. But `getScenarioById` might be expensive or circular?
    // We can rely on the fact that `detective_case1_briefing` is known fullscreen. 
    // Ideally useVNStore would expose 'isFullScreen'. 
    // For now, let's just default to Map. If VisualNovelPage is needed, the Map could redirect? 
    // Better: Check activeScenarioId.

    // NOTE: We need to import getScenarioById to check mode, or store it.
    // Let's import it at the top of the file if not present.
    // Actually, let's just navigate to /map. If the user is in a fullscreen scenario, 
    // the previous 'trap' was convenient. Now we need to be smart.
    // If we go to /map, the VisualNovelOverlay (global) encounters a fullscreen scenario.
    // It renders NULL. So the user sees the Map, but cannot interact with the VN?
    // Correct.

    // So 'Continue' MUST determine if we should go to /map or /vn/:id.

    const startDetectiveMode = () => {
        if (activeScenarioId) {
            // We could import getScenarioById here, or just try to navigate to VN if it looks like one.
            // But simpler: just go to map. If we are in a "briefing", we probably shouldn't be on the map.
            // Let's do a quick check.
            if (activeScenarioId.includes('briefing') || activeScenarioId.includes('finale')) {
                navigate(`/vn/${activeScenarioId}`);
                return;
            }
        }
        setGameMode('detective');
        navigate('/map');
    };

    const handleNewGame = () => {
        if (confirm("Are you sure you want to start a new game? All progress will be lost.")) {
            setShowTelegram(true);
        }
    };

    const handleTelegramComplete = (name: string) => {
        // 1. Reset All Stores
        useInventoryStore.getState().resetAll();
        useDossierStore.getState().resetDossier();
        useQuestStore.getState().resetQuests();
        useVNStore.getState().endScenario();

        // 2. Set Player Details
        setPlayerName(name);

        // 3. Start Intro Scenario
        // The ID 'detective_case1_briefing' must exist in your registry/content packs
        useVNStore.getState().startScenario('detective_case1_briefing');

        // Start the Quest immediately for testing
        useQuestStore.getState().startQuest('case01_act1');

        // 4. Navigate
        // Seed the history with /map so when the VN ends (navigate(-1)), we land on the map
        setGameMode('detective');
        setShowTelegram(false);
        navigate('/map');
        setTimeout(() => {
            navigate('/vn/detective_case1_briefing');
        }, 0);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 gap-8">
            {showTelegram && (
                <OnboardingModal
                    onComplete={handleTelegramComplete}
                    onCancel={() => setShowTelegram(false)}
                />
            )}
            <h1 className="text-4xl font-bold mb-8 text-[#d4c5a3] font-serif">Grezwanderer 4</h1>

            <div className="max-w-2xl w-full">
                {/* Detective Mode Card */}
                <div className="bg-[#1a1612] p-8 rounded-xl border border-[#d4c5a3] shadow-2xl hover:border-amber-500 transition-all flex flex-col items-center gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <h2 className="text-3xl font-serif font-bold text-[#d4c5a3]">Archiv: Freiburg 1905</h2>
                    <p className="text-center text-[#8c7b6c] font-serif italic text-lg">Investigate the cold cases of the past. Logic is your weapon.</p>
                    <Button
                        onClick={startDetectiveMode}
                        className="w-full h-14 bg-[#8c7b6c] hover:bg-[#a69584] text-[#1a1612] font-serif font-bold border border-[#d4c5a3] text-xl"
                    >
                        Continue Investigation
                    </Button>
                    <Button
                        onClick={handleNewGame}
                        className="w-full h-14 bg-transparent hover:bg-[#8c7b6c]/10 text-[#8c7b6c] font-serif font-bold border border-[#8c7b6c] text-xl"
                    >
                        New Game
                    </Button>

                    {/* Debug Jump Button (Hidden in Prod ideally, but visible for now) */}
                    <div className="pt-4 w-full flex flex-col gap-2">
                        <div className="text-xs text-gray-500 uppercase font-bold text-center spacing-widest">Dev Tools</div>
                        <Button
                            onClick={() => {
                                // 1. Reset
                                useInventoryStore.getState().resetAll();
                                useDossierStore.getState().resetDossier();
                                useQuestStore.getState().resetQuests();
                                useVNStore.getState().endScenario();

                                // 2. Set Defaults
                                setPlayerName("Schimanski");
                                setGameMode('detective');

                                // 3. Simulate Post-Intro State (Option A: Bank First)
                                useQuestStore.getState().startQuest('case01_act1');

                                // Unlock the Bank point so it's visible
                                useDossierStore.getState().setPointState('munsterplatz_bank', 'discovered');

                                // Navigate to Map
                                navigate('/map');
                            }}
                            className="w-full h-10 bg-red-900/20 hover:bg-red-900/40 text-red-500 font-mono text-sm border border-red-900/50"
                        >
                            [DEBUG] Jump to Active Map (Bank Case)
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex gap-4 text-sm text-slate-500">
                <button onClick={() => navigate('/scanner')} className="hover:text-blue-400">QR Scanner</button>
                <span>•</span>
                <button onClick={() => navigate('/settings')} className="hover:text-blue-400">Settings</button>
            </div>
        </div>
    );
};
