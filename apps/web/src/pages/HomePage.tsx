import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { OnboardingModal } from '../features/detective/onboarding/OnboardingModal';
import { ConfirmationModal } from '../shared/ui/ConfirmationModal';
import { useInventoryStore } from '../entities/inventory/model/store';
import { useDossierStore } from '../features/detective/dossier/store';
import { useQuestStore } from '../features/quests/store';
import { useVNStore } from '../entities/visual-novel/model/store';
import { Button } from '../shared/ui/Button';
import { getScenarioById } from '../entities/visual-novel/scenarios/registry';
import { preloadManager, extractScenarioAssets, toPreloadQueue } from '../shared/lib/preload';
import { Archive, Building2, MapPinned, Play, QrCode, RefreshCw, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { isOneShotScenarioComplete } from '../entities/visual-novel/lib/oneShotScenarios';
import { getPackMeta } from '@repo/shared/data/pack-meta';
import { getRegionMeta, type RegionId } from '@repo/shared/data/regions';
import { useRegionStore } from '../features/region/model/store';

const getRegionMapRoute = (regionId: RegionId, kaOnboardingComplete: boolean): string => {
    const region = getRegionMeta(regionId);
    const packMeta = getPackMeta(region.packId);

    if (packMeta.packId === 'ka1905' && !kaOnboardingComplete) {
        return '/entry/ka1905';
    }

    return `/city/${packMeta.packId}/map`;
};

export const HomePage = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();
    const setGameMode = useInventoryStore((state) => state.setGameMode);
    const setPlayerName = useInventoryStore((state) => state.setPlayerName);
    const activeRegionId = useRegionStore((state) => state.activeRegionId);
    const setActiveRegion = useRegionStore((state) => state.setActiveRegion);
    const setActiveCase = useDossierStore((state) => state.setActiveCase);

    const showDevTools = false;

    const activeScenarioId = useVNStore((state) => state.activeScenarioId);
    const endScenario = useVNStore((state) => state.endScenario);
    const locale = useVNStore((state) => state.locale);
    const flags = useDossierStore((state) => state.flags);
    const kaOnboardingComplete = Boolean(flags.ka_onboarding_complete);

    const [showTelegram, setShowTelegram] = useState(false);
    const playerName = useInventoryStore((state) => state.playerName);

    const handleTelegramComplete = (name: string) => {
        setPlayerName(name);
        setShowTelegram(false);
        useVNStore.getState().startScenario('detective_case1_hbf_arrival');
        navigate('/vn/detective_case1_hbf_arrival');
    };

    const fallbackScenarioId = useMemo(
        () => (activeRegionId === 'karlsruhe_default' ? 'sandbox_intro' : 'detective_case1_hbf_arrival'),
        [activeRegionId]
    );

    useEffect(() => {
        const targetId = activeScenarioId || fallbackScenarioId;
        const scenario = getScenarioById(targetId, locale);
        if (scenario) {
            const assets = extractScenarioAssets(scenario);
            const queue = toPreloadQueue(assets);
            preloadManager.preloadScenario(targetId, queue, { priority: 1 });
        }
    }, [activeScenarioId, fallbackScenarioId, locale]);

    const startDetectiveMode = () => {
        if (!activeRegionId) {
            navigate('/');
            return;
        }

        const regionRoute = getRegionMapRoute(activeRegionId, kaOnboardingComplete);
        if (activeScenarioId) {
            if (isOneShotScenarioComplete(activeScenarioId, flags)) {
                endScenario();
                setGameMode('detective');
                navigate(regionRoute);
                return;
            }

            const activeScenario = getScenarioById(activeScenarioId, locale);
            if (activeScenario?.mode === 'fullscreen') {
                if (activeScenario.packId) {
                    navigate(`/city/${activeScenario.packId}/vn/${activeScenarioId}`);
                } else {
                    navigate(`/vn/${activeScenarioId}`);
                }
                return;
            }
        }

        setGameMode('detective');
        navigate(regionRoute);
    };

    const selectRegion = (regionId: RegionId) => {
        const region = getRegionMeta(regionId);
        const packMeta = getPackMeta(region.packId);
        setActiveRegion(regionId, 'manual');
        setActiveCase(packMeta.defaultCaseId);
        navigate(getRegionMapRoute(regionId, kaOnboardingComplete));
    };

    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const handleNewGame = () => {
        // If no player name set (new player), skip confirmation
        if (!playerName) {
            startNewGame();
            return;
        }
        setShowConfirmReset(true);
    };

    const startNewGame = () => {
        useInventoryStore.getState().resetAll();
        useDossierStore.getState().resetDossier();
        useQuestStore.getState().resetQuests();
        useVNStore.getState().endScenario();

        if (activeRegionId === 'karlsruhe_default') {
            navigate('/entry/ka1905');
        } else {
            // Show Telegram on Home instead of navigating to intro_char_creation
            setShowTelegram(true);
        }
        setShowConfirmReset(false);
    };

    const regionCardTitle = activeRegionId ? t(`regions.${activeRegionId}.cardTitle`) : '';
    const regionLocation = activeRegionId ? t(`regions.${activeRegionId}.location`) : '';
    const activeRegionTheme = activeRegionId === 'karlsruhe_default'
        ? 'from-sky-800/20 to-stone-900/10'
        : 'from-amber-700/30 to-amber-900/10';

    return (
        <div className="min-h-[100dvh] bg-stone-950 text-stone-200 flex flex-col relative overflow-hidden font-body">
            {showTelegram && (
                <OnboardingModal
                    onComplete={handleTelegramComplete}
                    onCancel={() => setShowTelegram(false)}
                />
            )}
            {showConfirmReset && (
                <ConfirmationModal
                    title={t('modal.resetTitle') || "Start New Investigation?"}
                    message={t('modal.resetConfirm') || "Current progress will be lost. This cannot be undone."}
                    confirmLabel={t('btn.newGame') || "Start New Game"}
                    onConfirm={startNewGame}
                    onCancel={() => setShowConfirmReset(false)}
                    isDestructive
                />
            )}
            <div className="fixed inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950/80 pointer-events-none" />

            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-10 pb-24 relative z-10">
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

                {!activeRegionId && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full max-w-lg bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <MapPinned className="text-amber-500" size={20} />
                            <h2 className="text-2xl font-heading text-amber-500/90">{t('regionSelector.title')}</h2>
                        </div>
                        <p className="text-stone-400 text-sm mb-6">{t('regionSelector.subtitle')}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <Button
                                onClick={() => selectRegion('FREIBURG_1905')}
                                className="h-12 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 flex items-center justify-center gap-2 rounded-lg"
                            >
                                <Building2 size={16} />
                                {t('regionSelector.freiburg')}
                            </Button>
                            <Button
                                onClick={() => selectRegion('karlsruhe_default')}
                                className="h-12 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 flex items-center justify-center gap-2 rounded-lg"
                            >
                                <Building2 size={16} />
                                {t('regionSelector.karlsruhe')}
                            </Button>
                        </div>

                        <Button
                            onClick={() => navigate('/scanner')}
                            className="w-full h-11 bg-amber-700 hover:bg-amber-600 text-stone-100 font-bold flex items-center justify-center gap-2 rounded-lg"
                        >
                            <QrCode size={16} />
                            {t('regionSelector.scan')}
                        </Button>
                    </motion.div>
                )}

                {activeRegionId && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full max-w-sm relative group"
                    >
                        <div className={`absolute -inset-0.5 bg-gradient-to-b ${activeRegionTheme} blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700`} />

                        <div className="relative bg-stone-900 border border-stone-800 p-1 shadow-2xl rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                            <div className="border border-stone-800/50 rounded-xl p-6 flex flex-col gap-6 bg-gradient-to-b from-stone-800/40 to-stone-950/90 backdrop-blur-sm">
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-950 border border-amber-900/30 text-amber-600 shadow-inner">
                                        <Archive size={26} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-heading text-amber-500/90">
                                            {regionCardTitle}
                                        </h2>
                                        <p className="text-stone-500 text-xs uppercase tracking-widest mt-1 font-bold">
                                            {regionLocation}
                                        </p>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-stone-800/80" />

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleNewGame}
                                        className="w-full h-14 bg-amber-700 hover:bg-amber-600 text-stone-100 font-heading text-xl tracking-wide border-t border-amber-500/20 shadow-lg shadow-amber-900/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] rounded-lg group/btn"
                                    >
                                        <RefreshCw size={22} className="group-hover/btn:rotate-180 transition-transform duration-500 opacity-80" />
                                        {t('btn.newGame')}
                                    </Button>

                                    <Button
                                        onClick={startDetectiveMode}
                                        className="w-full h-12 bg-stone-950/50 hover:bg-stone-900 text-stone-400 hover:text-stone-200 font-serif border border-stone-800 flex items-center justify-center gap-2 transition-colors rounded-lg"
                                    >
                                        <Play size={16} fill="currentColor" />
                                        {t('btn.continue')}
                                    </Button>

                                    <button
                                        onClick={() => {
                                            const nextRegionId = activeRegionId === 'FREIBURG_1905' ? 'karlsruhe_default' : 'FREIBURG_1905';
                                            const region = getRegionMeta(nextRegionId);
                                            const packMeta = getPackMeta(region.packId);
                                            setActiveRegion(nextRegionId, 'manual');
                                            setActiveCase(packMeta.defaultCaseId);
                                        }}
                                        className="w-full text-xs text-stone-600 hover:text-amber-500 transition-colors py-2 uppercase tracking-widest font-bold"
                                    >
                                        {t('btn.changeRegion') || 'Change City'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

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
                                setPlayerName('Schimanski');
                                setGameMode('detective');
                                useRegionStore.getState().setActiveRegion('FREIBURG_1905', 'manual');
                                useDossierStore.getState().setActiveCase('case_01_bank');
                                useQuestStore.getState().startQuest('case01');
                                useDossierStore.getState().setPointState('loc_freiburg_bank', 'discovered');
                                navigate('/city/fbg1905/map');
                            }}
                            className="w-full h-10 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-mono text-xs border border-red-900/40 flex items-center justify-center gap-2"
                        >
                            {t('debug.jumpBank')}
                        </Button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};
