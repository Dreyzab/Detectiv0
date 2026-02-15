import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVoiceColor, VOICES } from '../lib/parliament';
import type { ThoughtCloudProps } from './types';

export const ThoughtCloud: React.FC<ThoughtCloudProps> = ({
    text,
    voiceId,
    isVisible,
    subtitle = 'Passive Check: Success'
}) => {
    const color = getVoiceColor(voiceId);
    const voiceName = VOICES[voiceId].name;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50 pointer-events-none"
                >
                    <div
                        className="relative bg-black/80 backdrop-blur-md border border-l-4 p-4 rounded-r-lg shadow-2xl"
                        style={{ borderLeftColor: color, borderColor: `${color}40` }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1">
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                                {voiceName}
                            </span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">
                                {subtitle}
                            </span>
                        </div>

                        {/* Text */}
                        <p className="font-serif text-lg leading-relaxed text-slate-200 drop-shadow-md">
                            {text}
                        </p>

                        {/* Decorative Elements */}
                        <div className="absolute -left-[5px] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
