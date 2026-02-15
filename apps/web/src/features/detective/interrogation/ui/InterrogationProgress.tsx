/**
 * InterrogationProgress — Circular radial progress ring.
 * Fills as interrogation ticks accumulate. Gold burst on completion.
 */
import { motion, AnimatePresence } from 'framer-motion';

interface InterrogationProgressProps {
    current: number;
    required: number;
    completed: boolean;
}

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const InterrogationProgress = ({ current, required, completed }: InterrogationProgressProps) => {
    const progress = Math.min(current / required, 1);
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    return (
        <div className="relative flex items-center gap-2">
            {/* Ring */}
            <div className="relative w-10 h-10">
                <svg
                    viewBox="0 0 40 40"
                    className="w-full h-full -rotate-90"
                    aria-label={`Progress: ${current}/${required}`}
                >
                    {/* Track */}
                    <circle
                        cx="20" cy="20" r={RADIUS}
                        fill="none"
                        stroke="rgba(120, 113, 108, 0.2)"
                        strokeWidth="3"
                    />

                    {/* Progress Arc */}
                    <motion.circle
                        cx="20" cy="20" r={RADIUS}
                        fill="none"
                        stroke={completed ? '#fbbf24' : '#d97706'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        animate={{ strokeDashoffset }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                </svg>

                {/* Counter Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold tabular-nums text-stone-300">
                        {current}
                    </span>
                </div>

                {/* Completion Burst */}
                <AnimatePresence>
                    {completed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full border-2 border-amber-400"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* IP Badge */}
            <AnimatePresence>
                {completed && (
                    <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-mono font-bold text-amber-400 tracking-wider"
                    >
                        +1 IP
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};
