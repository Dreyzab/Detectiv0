import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Locale } from '@repo/shared/locales/types';
import { getPackMeta } from '@repo/shared/data/pack-meta';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { cn } from '@/shared/lib/utils';
import { useRegionStore } from '@/features/region/model/store';

interface KarlsruheEntryPageProps {
    packId: string;
}

type EntryStep = 1 | 2 | 3;

const LOCALES: Locale[] = ['en', 'de', 'ru'];

const ORIGINS = [
    {
        flag: 'ka_origin_scholar',
        titleKey: 'origin.scholar',
        descriptionKey: 'origin.scholarDesc'
    },
    {
        flag: 'ka_origin_journalist',
        titleKey: 'origin.journalist',
        descriptionKey: 'origin.journalistDesc'
    },
    {
        flag: 'ka_origin_doctor',
        titleKey: 'origin.doctor',
        descriptionKey: 'origin.doctorDesc'
    }
] as const;

type OriginFlag = (typeof ORIGINS)[number]['flag'];

const toLocale = (value: string): Locale => {
    if (value === 'de' || value === 'ru' || value === 'en') {
        return value;
    }
    return 'en';
};

export const KarlsruheEntryPage = ({ packId }: KarlsruheEntryPageProps) => {
    const { t } = useTranslation(['entry', 'common']);
    const navigate = useNavigate();

    const locale = useVNStore((state) => state.locale);
    const setLocale = useVNStore((state) => state.setLocale);

    const flags = useDossierStore((state) => state.flags);
    const setFlag = useDossierStore((state) => state.setFlag);
    const setActiveCase = useDossierStore((state) => state.setActiveCase);
    const isServerHydrated = useDossierStore((state) => state.isServerHydrated);
    const setActiveRegion = useRegionStore((state) => state.setActiveRegion);

    const [step, setStep] = useState<EntryStep>(1);
    const [selectedLocale, setSelectedLocale] = useState<Locale>(toLocale(locale));

    const initialOrigin = useMemo<OriginFlag | null>(() => {
        const active = ORIGINS.find((origin) => Boolean(flags[origin.flag]));
        return active ? active.flag : null;
    }, [flags]);
    const [selectedOrigin, setSelectedOrigin] = useState<OriginFlag | null>(initialOrigin);
    const effectiveSelectedOrigin = selectedOrigin ?? initialOrigin;

    if (!isServerHydrated) {
        return (
            <div className="min-h-[100dvh] bg-stone-950 text-stone-300 flex items-center justify-center p-6">
                <div className="text-sm uppercase tracking-[0.2em] font-mono">{t('common:state.loading')}</div>
            </div>
        );
    }

    if (flags.ka_onboarding_complete) {
        return <Navigate to={`/city/${packId}/map`} replace />;
    }

    const handleLanguageSelect = (next: Locale) => {
        setSelectedLocale(next);
        setLocale(next);
    };

    const handleStart = () => {
        if (!effectiveSelectedOrigin) {
            setStep(2);
            return;
        }

        ORIGINS.forEach((origin) => {
            setFlag(origin.flag, origin.flag === effectiveSelectedOrigin);
        });
        setFlag('ka_onboarding_complete', true);

        const packMeta = getPackMeta(packId);
        setActiveRegion(packMeta.regionId, 'manual');
        setActiveCase(packMeta.defaultCaseId);

        navigate(`/city/${packId}/map`, { replace: true });
    };

    const selectedOriginTitle = effectiveSelectedOrigin
        ? t(ORIGINS.find((origin) => origin.flag === effectiveSelectedOrigin)?.titleKey ?? 'origin.scholar')
        : '';

    return (
        <div className="min-h-[100dvh] bg-stone-950 text-stone-200 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/90 to-black pointer-events-none" />

            <div className="w-full max-w-3xl border border-stone-800 rounded-2xl bg-stone-900/80 backdrop-blur-sm shadow-2xl p-6 md:p-10 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-xs uppercase tracking-[0.2em] text-stone-400 font-mono">
                        {t('meta.step', { current: step, total: 3 })}
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((index) => (
                            <span
                                key={index}
                                className={cn(
                                    'h-1.5 w-8 rounded-full transition-colors',
                                    step >= index ? 'bg-amber-500' : 'bg-stone-700'
                                )}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step-language"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -18 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-heading text-amber-500">{t('language.title')}</h1>
                                <p className="text-stone-400">{t('language.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {LOCALES.map((entryLocale) => (
                                    <button
                                        key={entryLocale}
                                        onClick={() => handleLanguageSelect(entryLocale)}
                                        className={cn(
                                            'rounded-xl border px-4 py-4 text-left transition-colors',
                                            selectedLocale === entryLocale
                                                ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                                                : 'border-stone-700 bg-stone-900 hover:border-stone-500'
                                        )}
                                    >
                                        <div className="text-sm uppercase tracking-[0.18em] font-mono">{entryLocale}</div>
                                        <div className="text-lg mt-1">{t(`language.${entryLocale}`)}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    className="rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-100 font-bold px-5 py-3 transition-colors"
                                >
                                    {t('language.continue')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step-origin"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -18 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-heading text-amber-500">{t('origin.title')}</h2>
                                <p className="text-stone-400">{t('origin.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {ORIGINS.map((origin) => (
                                    <button
                                        key={origin.flag}
                                        onClick={() => setSelectedOrigin(origin.flag)}
                                        className={cn(
                                            'rounded-xl border p-4 text-left transition-colors min-h-[160px]',
                                            effectiveSelectedOrigin === origin.flag
                                                ? 'border-amber-500 bg-amber-500/10'
                                                : 'border-stone-700 bg-stone-900 hover:border-stone-500'
                                        )}
                                    >
                                        <div className="text-lg font-semibold text-stone-100">{t(origin.titleKey)}</div>
                                        <p className="mt-2 text-sm text-stone-400">{t(origin.descriptionKey)}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="rounded-lg border border-stone-700 bg-stone-900 hover:border-stone-500 px-5 py-3 transition-colors"
                                >
                                    {t('origin.back')}
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!effectiveSelectedOrigin}
                                    className={cn(
                                        'rounded-lg px-5 py-3 font-bold transition-colors',
                                        effectiveSelectedOrigin
                                            ? 'bg-amber-700 hover:bg-amber-600 text-stone-100'
                                            : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                                    )}
                                >
                                    {t('origin.continue')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step-start"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -18 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-heading text-amber-500">{t('start.title')}</h2>
                                <p className="text-stone-400">
                                    {t('start.subtitle', {
                                        origin: selectedOriginTitle
                                    })}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="rounded-lg border border-stone-700 bg-stone-900 hover:border-stone-500 px-5 py-3 transition-colors"
                                >
                                    {t('start.back')}
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={handleStart}
                                    className="rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-100 font-bold px-6 py-3 transition-colors"
                                >
                                    {t('start.enter')}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
