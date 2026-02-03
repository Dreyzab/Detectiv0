import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useInventoryStore } from '../entities/inventory/model/store';
import { useDossierStore } from '../features/detective/dossier/store';
import { useQuestStore } from '../features/quests/store';
import { useVNStore } from '../entities/visual-novel/model/store';
import { Button } from '../shared/ui/Button';
import { OnboardingModal } from '../features/detective/onboarding/OnboardingModal';
import { getScenarioById } from '../entities/visual-novel/scenarios/registry';
import { preloadManager, extractScenarioAssets, toPreloadQueue } from '../shared/lib/preload';
import { Archive, Play, RefreshCw, Settings, QrCode, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage = () => {
    const navigate = useNavigate();
    const setGameMode = useInventoryStore(state => state.setGameMode);
    const setPlayerName = useInventoryStore(state => state.setPlayerName);
    const [telegramDismissed, setTelegramDismissed] = useState(false);
    const [showDevTools, setShowDevTools] = useState(false);

    // active session
    const activeScenarioId = useVNStore(state => state.activeScenarioId);
    const locale = useVNStore(state => state.locale);

    // Preload VN assets
    useEffect(() => {
        const targetId = activeScenarioId || 'detective_case1_briefing';
        const scenario = getScenarioById(targetId, locale);
        if (scenario) {
            const assets = extractScenarioAssets(scenario);
            const queue = toPreloadQueue(assets);
            preloadManager.preloadScenario(targetId, queue, { priority: 1 });
        }
    }, [activeScenarioId, locale]);

    const startDetectiveMode = () => {
        if (activeScenarioId) {
            if (activeScenarioId.includes('briefing') || activeScenarioId.includes('finale')) {
                navigate(`/vn/${activeScenarioId}`);
                return;
            }
        }
        setGameMode('detective');
        navigate('/map');
    };

    const flags = useDossierStore(state => state.flags);
    const showTelegram = Boolean(
        flags['char_creation_complete'] &&
        !flags['met_anna_intro'] &&
        !telegramDismissed
    );

    const handleNewGame = () => {
        if (confirm("Are you sure you want to start a new game? All progress will be lost.")) {
            useInventoryStore.getState().resetAll();
            useDossierStore.getState().resetDossier();
            useQuestStore.getState().resetQuests();
            useVNStore.getState().endScenario();
            useVNStore.getState().startScenario('intro_char_creation');
            navigate('/vn/intro_char_creation');
        }
    };

    const handleTelegramComplete = (name: string) => {
        setPlayerName(name);
        useVNStore.getState().startScenario('intro_journalist');
        setGameMode('detective');
        setTelegramDismissed(true);
        navigate('/vn/intro_journalist');
    };

    return (
        <div className="min-h-[100dvh] bg-stone-950 text-stone-200 flex flex-col relative overflow-x-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            {/* Main Content Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-24 md:pb-10 pt-20">

                {showTelegram && (
                    <OnboardingModal
                        onComplete={handleTelegramComplete}
                        onCancel={() => setTelegramDismissed(true)}
                    />
                )}

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-2 mt-4"
                >
                    <h1 className="text-4xl md:text-6xl font-heading text-amber-500 tracking-tighter drop-shadow-md">
                        Grezwanderer<span className="text-stone-600 ml-2">4</span>
                    </h1>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent mx-auto" />
                    <p className="text-stone-500 font-serif italic text-sm md:text-base">
                        Shadows of the Black Forest
                    </p>
                </motion.div>

                {/* Primary Action Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-md relative group"
                >
                    {/* Card Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-b from-amber-600/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative bg-stone-900/80 backdrop-blur-sm border border-stone-800 p-1 shadow-2xl rounded-xl overflow-hidden">

                        {/* Inner Bezel */}
                        <div className="border border-stone-800/50 rounded-lg p-6 flex flex-col gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800/50 via-stone-900 to-stone-950">

                            {/* Card Header */}
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-950/30 border border-amber-900/50 text-amber-600 mb-2">
                                    <Archive size={24} />
                                </div>
                                <h2 className="text-2xl font-heading text-stone-200">
                                    Archiv: Freiburg 1905
                                </h2>
                                <p className="text-stone-500 font-serif text-sm leading-relaxed px-4">
                                    The city holds secrets that time cannot erase. Resume your investigation.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    onClick={startDetectiveMode}
                                    className="w-full h-14 bg-amber-700 hover:bg-amber-600 text-stone-100 font-serif font-bold text-lg border border-amber-600 shadow-lg shadow-amber-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                >
                                    <Play size={20} fill="currentColor" />
                                    Continue
                                </Button>

                                <Button
                                    onClick={handleNewGame}
                                    className="w-full h-12 bg-transparent hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-serif font-medium border border-stone-800 text-base flex items-center justify-center gap-3 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                    New Game
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Controls */}
                <div className="flex gap-6 text-stone-600 mt-auto md:mt-0">
                    <button onClick={() => navigate('/scanner')} className="flex flex-col items-center gap-1 hover:text-amber-500 transition-colors p-2">
                        <QrCode size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Scanner</span>
                    </button>
                    <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 hover:text-amber-500 transition-colors p-2">
                        <Settings size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Config</span>
                    </button>
                    <button onClick={() => setShowDevTools(!showDevTools)} className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors p-2">
                        <Terminal size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Debug</span>
                    </button>
                </div>

                {/* Collapsible Dev Tools */}
                {showDevTools && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="w-full max-w-md bg-red-950/10 border border-red-900/30 rounded-lg p-4"
                    >
                        <h3 className="text-xs text-red-500 font-mono font-bold uppercase mb-3">Developer Override</h3>
                        <Button
                            onClick={() => {
                                useInventoryStore.getState().resetAll();
                                useDossierStore.getState().resetDossier();
                                useQuestStore.getState().resetQuests();
                                useVNStore.getState().endScenario();
                                setPlayerName("Schimanski");
                                setGameMode('detective');
                                useQuestStore.getState().startQuest('case01_act1');
                                useDossierStore.getState().setPointState('munsterplatz_bank', 'discovered');
                                navigate('/map');
                            }}
                            className="w-full h-10 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-mono text-xs border border-red-900/40 flex items-center justify-center gap-2"
                        >
                            <Terminal size={14} />
                            JUMP TO BANK CASE
                        </Button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};
