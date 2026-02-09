import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useInventoryStore } from '../entities/inventory/model/store';
import { useDossierStore } from '../features/detective/dossier/store';
import { useQuestStore } from '../features/quests/store';
import { useVNStore } from '../entities/visual-novel/model/store';
import { Button } from '../shared/ui/Button';
import { getScenarioById } from '../entities/visual-novel/scenarios/registry';
import { preloadManager, extractScenarioAssets, toPreloadQueue } from '../shared/lib/preload';
import { Archive, Play, RefreshCw, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const isOneShotScenarioComplete = (scenarioId: string, flags: Record<string, boolean>): boolean => {
    if (scenarioId === 'intro_char_creation') {
        return Boolean(flags['char_creation_complete']);
    }
    if (scenarioId === 'detective_case1_hbf_arrival') {
        return Boolean(flags['arrived_at_hbf']);
    }
    if (scenarioId === 'detective_case1_map_first_exploration') {
        return Boolean(flags['case01_map_exploration_intro_done']);
    }
    return false;
};

export const HomePage = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();
    const setGameMode = useInventoryStore(state => state.setGameMode);
    const setPlayerName = useInventoryStore(state => state.setPlayerName); // Used by debug jump action.
    // const [showDevTools, setShowDevTools] = useState(false); // Removed as toggle is gone
    const showDevTools = false; // Hardcode to false for now or remove logic completely later. 
    // Actually, let's keep the logic but strictly false unless we add a trigger.
    // Or better, remove the unused state to fix lint.

    // active session
    const activeScenarioId = useVNStore(state => state.activeScenarioId);
    const endScenario = useVNStore(state => state.endScenario);
    const locale = useVNStore(state => state.locale);
    const flags = useDossierStore(state => state.flags);

    // Preload VN assets
    useEffect(() => {
        const targetId = activeScenarioId || 'detective_case1_hbf_arrival';
        const scenario = getScenarioById(targetId, locale);
        if (scenario) {
            const assets = extractScenarioAssets(scenario);
            const queue = toPreloadQueue(assets);
            preloadManager.preloadScenario(targetId, queue, { priority: 1 });
        }
    }, [activeScenarioId, locale]);

    const startDetectiveMode = () => {
        if (activeScenarioId) {
            if (isOneShotScenarioComplete(activeScenarioId, flags)) {
                endScenario();
                setGameMode('detective');
                navigate('/map');
                return;
            }
            const activeScenario = getScenarioById(activeScenarioId, locale);
            if (activeScenario?.mode === 'fullscreen') {
                navigate(`/vn/${activeScenarioId}`);
                return;
            }
        }
        setGameMode('detective');
        navigate('/map');
    };

    const handleNewGame = () => {
        if (confirm(`${t('modal.resetTitle')}\n${t('modal.resetConfirm')}`)) {
            useInventoryStore.getState().resetAll();
            useDossierStore.getState().resetDossier();
            useQuestStore.getState().resetQuests();
            useVNStore.getState().endScenario();
            useVNStore.getState().startScenario('intro_char_creation');
            navigate('/vn/intro_char_creation');
        }
    };

    return (
        <div className="min-h-[100dvh] bg-stone-950 text-stone-200 flex flex-col relative overflow-hidden font-body">
            {/* Background Texture */}
            <div className="fixed inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

            {/* Ambient Gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950/80 pointer-events-none" />

            {/* Main Content Container - centered vertically */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-10 pb-24 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-3"
                >
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-7xl font-heading text-amber-600 tracking-tighter drop-shadow-lg relative z-10">
                            {t('titleMain')}
                        </h1>
                        <div className="absolute -inset-4 bg-amber-600/10 blur-3xl rounded-full -z-10" />
                    </div>

                    <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-amber-800 to-transparent mx-auto opacity-70" />

                    <p className="text-stone-500 font-serif italic text-base md:text-lg tracking-wide">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* Primary Action Card - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-sm relative group"
                >
                    {/* Card Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-amber-700/30 to-amber-900/10 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative bg-stone-900 border border-stone-800 p-1 shadow-2xl rounded-2xl overflow-hidden">

                        {/* Paper texture overlay on card */}
                        <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                        {/* Inner Content */}
                        <div className="border border-stone-800/50 rounded-xl p-6 flex flex-col gap-6 bg-gradient-to-b from-stone-800/40 to-stone-950/90 backdrop-blur-sm">

                            {/* Card Header */}
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-950 border border-amber-900/30 text-amber-600 shadow-inner">
                                    <Archive size={26} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-heading text-amber-500/90">
                                        {t('card.title')}
                                    </h2>
                                    <p className="text-stone-500 text-xs uppercase tracking-widest mt-1 font-bold">
                                        {t('card.location')}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px w-full bg-stone-800/80" />

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    onClick={startDetectiveMode}
                                    className="w-full h-14 bg-amber-700 hover:bg-amber-600 text-stone-100 font-heading text-xl tracking-wide border-t border-amber-500/20 shadow-lg shadow-amber-900/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] rounded-lg"
                                >
                                    <Play size={22} fill="currentColor" className="opacity-80" />
                                    {t('btn.continue')}
                                </Button>

                                <Button
                                    onClick={handleNewGame}
                                    className="w-full h-12 bg-stone-950/50 hover:bg-stone-900 text-stone-400 hover:text-stone-200 font-serif border border-stone-800 flex items-center justify-center gap-2 transition-colors rounded-lg group/btn"
                                >
                                    <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                                    {t('btn.newGame')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dev Tools Toggle (Hidden/Subtle) */}
                {showDevTools && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="w-full max-w-sm bg-red-950/20 border border-red-900/30 rounded-lg p-4 backdrop-blur-sm"
                    >
                        <h3 className="text-xs text-red-500 font-mono font-bold uppercase mb-3 flex items-center gap-2">
                            <Terminal size={12} />
                            {t('debug.title')}
                        </h3>
                        <Button
                            onClick={() => {
                                useInventoryStore.getState().resetAll();
                                useDossierStore.getState().resetDossier();
                                useQuestStore.getState().resetQuests();
                                useVNStore.getState().endScenario();
                                setPlayerName("Schimanski");
                                setGameMode('detective');
                                useQuestStore.getState().startQuest('case01');
                                useDossierStore.getState().setPointState('loc_freiburg_bank', 'discovered');
                                navigate('/map');
                            }}
                            className="w-full h-10 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-mono text-xs border border-red-900/40 flex items-center justify-center gap-2"
                        >
                            {t('debug.jumpBank')}
                        </Button>
                    </motion.div>
                )}

                {/* Note: Global navigation is now handled by the Navbar widget */}
            </main>
        </div>
    );
};

