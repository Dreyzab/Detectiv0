/**
 * TensionBar — Horizontal bar showing current tension level.
 * Gradient: blue (cold) → amber (sweet spot) → red (danger).
 * Sweet-spot zone highlighted with a glowing band based on player perception.
 */
import { motion, AnimatePresence } from 'framer-motion';
import type { EffectiveSweetSpot, SweetSpotVisibility } from '../tensionEngine';

interface TensionBarProps {
    tension: number;
    sweetSpot: EffectiveSweetSpot;
    visibility: SweetSpotVisibility;
    lockedOut: boolean;
}

export const TensionBar = ({ tension, sweetSpot, visibility, lockedOut }: TensionBarProps) => {
    const needlePos = `${tension}%`;

    const sweetSpotOpacity = visibility === 'full' ? 0.5
        : visibility === 'partial' ? 0.2
            : 0;

    const barColor = tension >= 80 ? '#dc2626'
        : tension >= 50 ? '#d97706'
            : '#3b82f6';

    return (
        <div className="relative w-full" role="meter" aria-label="Tension" aria-valuenow={tension} aria-valuemin={0} aria-valuemax={100}>
            {/* Label */}
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-stone-500">
                    Tension
                </span>
                <span className="text-[9px] font-mono text-stone-400 tabular-nums">{tension}</span>
            </div>

            {/* Bar Track */}
            <div className="relative h-2 bg-stone-900/80 rounded-full border border-stone-700/50 overflow-hidden">
                {/* Gradient Fill */}
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        background: `linear-gradient(90deg, #1e3a5f 0%, #3b82f6 20%, #d97706 50%, #dc2626 80%, #7f1d1d 100%)`,
                    }}
                    animate={{ width: `${tension}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />

                {/* Sweet Spot Zone */}
                {visibility !== 'hidden' && (
                    <div
                        className="absolute inset-y-0 border-y transition-opacity duration-500"
                        style={{
                            left: `${sweetSpot.min}%`,
                            width: `${sweetSpot.max - sweetSpot.min}%`,
                            opacity: sweetSpotOpacity,
                            borderColor: 'rgba(217, 119, 6, 0.6)',
                            background: visibility === 'full'
                                ? 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(217, 119, 6, 0.15) 3px, rgba(217, 119, 6, 0.15) 6px)'
                                : 'rgba(217, 119, 6, 0.08)',
                            boxShadow: '0 0 8px rgba(217, 119, 6, 0.3)',
                        }}
                    />
                )}
            </div>

            {/* Needle */}
            <motion.div
                className="absolute h-4 w-0.5 -top-0.5 rounded-full"
                style={{
                    background: barColor,
                    boxShadow: `0 0 6px ${barColor}`,
                }}
                animate={{ left: needlePos }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />

            {/* Lockout Flash */}
            <AnimatePresence>
                {lockedOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 rounded-full bg-red-600/30 border border-red-500/50"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
