import React, { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { getVoiceColor, VOICES } from '../lib/parliament';
import type { VoiceOrbProps } from './types';

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
    voiceId,
    size = 'md',
    state = 'speaking',
    className
}) => {
    const color = useMemo(() => getVoiceColor(voiceId), [voiceId]);
    const voiceDef = VOICES[voiceId];

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    // Animation variants
    const variants = {
        idle: {
            scale: [1, 1.05, 1],
            opacity: 0.7,
            transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        },
        speaking: {
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: 1,
            filter: [
                `drop-shadow(0 0 5px ${color})`,
                `drop-shadow(0 0 15px ${color})`,
                `drop-shadow(0 0 5px ${color})`
            ],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }
    } satisfies Variants;

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.div
                className={`rounded-full bg-linear-to-br from-white/20 to-transparent backdrop-blur-sm border border-white/30 ${sizeClasses[size]}`}
                style={{
                    backgroundColor: `${color}40`, // 25% opacity
                    boxShadow: `0 0 20px ${color}60`
                }}
                variants={variants}
                animate={state}
                initial="idle"
            >
                {/* Inner Core */}
                <div
                    className="absolute inset-2 rounded-full opacity-80"
                    style={{ backgroundColor: color }}
                />
            </motion.div>

            {/* Label (Optional, for debugging or explicit UI) */}
            {size === 'lg' && (
                <div className="absolute -bottom-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-shadow" style={{ color: color }}>
                    {voiceDef.name}
                </div>
            )}
        </div>
    );
};
