/**
 * TensionHUD — Container component for all interrogation UI.
 * Mounts when an interrogation is active. Contains TensionBar + Progress ring.
 * Positioned at the top of the VN overlay.
 */
import { motion } from 'framer-motion';
import { useTensionStore } from '../tensionStore';
import { useDossierStore } from '../../dossier/store';
import { computeEffectiveSweetSpot, getSweetSpotVisibility } from '../tensionEngine';
import { TensionBar } from './TensionBar';
import { InterrogationProgress } from './InterrogationProgress';
import { CHARACTERS } from '@repo/shared/data/characters';
import type { VoiceId } from '@repo/shared/data/parliament';

export const TensionHUD = () => {
    const {
        targetCharacterId,
        tension,
        progress,
        lockedOut,
        completed,
        influencePoints,
        getInterrogationProfile,
    } = useTensionStore();

    const voiceStats = useDossierStore((s) => s.voiceStats);

    if (!targetCharacterId) return null;

    const profile = getInterrogationProfile();
    if (!profile) return null;

    const character = CHARACTERS[targetCharacterId];
    const perception = (voiceStats as Partial<Record<VoiceId, number>>)['perception'] ?? 0;

    const sweetSpot = computeEffectiveSweetSpot(
        profile,
        voiceStats as Partial<Record<VoiceId, number>>
    );
    const visibility = getSweetSpotVisibility(perception);

    // Portrait vignette color
    const vignetteColor = lockedOut ? 'rgba(220, 38, 38, 0.4)'
        : tension >= sweetSpot.min && tension <= sweetSpot.max ? 'rgba(217, 119, 6, 0.3)'
            : tension > sweetSpot.max ? 'rgba(220, 38, 38, 0.25)'
                : 'rgba(59, 130, 246, 0.2)';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed top-4 left-4 right-4 z-300 pointer-events-none"
        >
            <div className="max-w-2xl mx-auto pointer-events-auto">
                <div className="relative bg-stone-950/70 backdrop-blur-lg border border-stone-700/30 rounded-lg p-4 shadow-2xl">
                    {/* Decorative top line */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

                    <div className="flex items-center gap-4">
                        {/* NPC Portrait + Vignette */}
                        {character && (
                            <div className="relative flex-shrink-0 transition-all duration-500">
                                <div
                                    className="w-12 h-12 rounded-full bg-stone-800 border-2 overflow-hidden flex items-center justify-center"
                                    style={{
                                        borderColor: vignetteColor,
                                        boxShadow: `0 0 12px ${vignetteColor}, inset 0 0 8px ${vignetteColor}`,
                                    }}
                                >
                                    <span className="text-stone-400 text-lg font-serif font-bold">
                                        {character.name.charAt(0)}
                                    </span>
                                </div>

                                {/* Lockout X overlay */}
                                {lockedOut && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-red-500 text-2xl font-bold opacity-80">✕</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bar + Progress */}
                        <div className="flex-1 min-w-0">
                            <TensionBar
                                tension={tension}
                                sweetSpot={sweetSpot}
                                visibility={visibility}
                                lockedOut={lockedOut}
                            />

                            {/* Lockout message */}
                            {lockedOut && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[9px] font-mono text-red-400 mt-1 tracking-wider"
                                >
                                    NPC REFUSES TO TALK ON THIS TOPIC
                                </motion.p>
                            )}
                        </div>

                        {/* Progress Ring */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <InterrogationProgress
                                current={progress}
                                required={profile.progressRequired}
                                completed={completed}
                            />

                            {/* IP Counter */}
                            {influencePoints > 0 && (
                                <div className="flex items-center gap-1 text-amber-400">
                                    <span className="text-[10px] font-mono font-bold">{influencePoints}</span>
                                    <span className="text-[8px] font-mono tracking-wider opacity-60">IP</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
