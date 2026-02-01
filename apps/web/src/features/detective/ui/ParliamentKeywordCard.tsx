import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDossierStore } from '@/features/detective/dossier/store';
import { getTooltipContent } from '@/features/detective/lib/tooltipRegistry';
import { VOICES as PARLIAMENT_VOICES, getVoiceColor, getVoiceGroup } from '@repo/shared/data/parliament';
import type { VoiceGroup } from '@repo/shared/data/parliament';
import { cn } from '@/shared/lib/utils';
// import { X as CloseIcon } from 'lucide-react'; // Unused

interface ParliamentKeywordCardProps {
    keyword: string;
    anchorRect?: DOMRect;
    onClose: () => void;
}

const GROUP_ICONS: Record<VoiceGroup, string> = {
    intellect: '/images/voice-groups/intellect.png',
    psyche: '/images/voice-groups/psyche.png',
    social: '/images/voice-groups/social.png',
    physical: '/images/voice-groups/physical.png',
    shadow: '/images/voice-groups/shadow.png',
    spirit: '/images/voice-groups/spirit.png'
};

export const ParliamentKeywordCard = ({ keyword, anchorRect, onClose }: ParliamentKeywordCardProps) => {
    const { voiceStats } = useDossierStore();
    const content = getTooltipContent(keyword);
    const containerRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});

    // Calculate position
    useEffect(() => {
        if (!anchorRect) return;

        // Paradox Strategy: Try Top, Fallback Bottom
        // Centered horizontally relative to the keyword
        const cardWidth = 320; // Assume max-w-sm logic approx
        const gap = 12;

        const viewportWidth = window.innerWidth;
        // const viewportHeight = window.innerHeight; // Unused

        let left = anchorRect.left + (anchorRect.width / 2) - (cardWidth / 2);
        // Clamp Horizontal
        if (left < 10) left = 10;
        if (left + cardWidth > viewportWidth - 10) left = viewportWidth - cardWidth - 10;

        let top = anchorRect.top - gap;
        let originY = 1; // Animation origin (bottom)

        // Check if there is space above (need ~300px)
        // If not, put below
        if (anchorRect.top < 300) {
            top = anchorRect.bottom + gap;
            originY = 0; // Animation origin (top)
        } else {
            // Position above: we need to translate Y by -100% in CSS to push it up
        }

        // Wrap in timeout to avoid synchronous setState warning
        setTimeout(() => {
            setStyle({
                position: 'fixed',
                left: left,
                top: top,
                transformOrigin: `50% ${originY * 100}%`,
                zIndex: 300 // Ensure it's above everything
            });
        }, 0);

    }, [anchorRect]);

    // Close on ANY click outside immediately
    useEffect(() => {
        // We use a timeout to avoid closing immediately on the trigger click
        const timeoutId = setTimeout(() => {
            const handleClickAnywhere = () => {
                // If clicking inside the card, do NOT close (typical tooltip behavior allow selection)
                // BUT user said "click anywhere closes". However, scrolling/selecting inside might be needed.
                // "при нажатии на любое место закрывало бы попап" usually implies dismissing it.
                // Let's allow interaction inside, but close outside. OR just close on everything?
                // Paradox games: usually click map to close, or click X.
                // Let's try: Click ANYWHERE closes it, unless it's a link/interactive inside (not present yet).
                // Actually, Paradox tooltips often stick until you move mouse away (hover) or click (lock).
                // The request says "click anywhere closes it".

                // If I click inside, I might want to copy text?
                // Let's stick to: Click strictly OUTSIDE closes it.
                // If user wants "anywhere", they can click the tooltip itself to close too?
                // "на любое место" -> literally any place.

                // Let's make it close on click anywhere, EXCEPT if selecting text?
                // Simpler: Click anywhere closes it.

                // WAIT: If I click inside, I close it.
                onClose();
            };
            window.addEventListener('click', handleClickAnywhere);
            return () => window.removeEventListener('click', handleClickAnywhere);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [onClose]);

    if (!content) return null;

    // Filter unlocked voices
    const unlockedVoices = content.voices.filter(v => {
        const currentStat = voiceStats[v.voiceId] || 0;
        return currentStat >= v.threshold;
    });

    // Check if we positioned "above" -> need translateY(-100%)
    const isAbove = style.transformOrigin === '50% 100%';

    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                style={style}
                initial={{ opacity: 0, scale: 0.95, y: isAbove ? 10 : -10, translateY: isAbove ? "-100%" : "0%" }}
                animate={{ opacity: 1, scale: 1, y: 0, translateY: isAbove ? "-100%" : "0%" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={cn(
                    "w-80 bg-[#fdfaf5] rounded shadow-2xl overflow-hidden pointer-events-auto", // Solid paper color, no var() variable risk
                    "border border-[var(--color-secondary)]/40 ring-1 ring-black/10"
                )}
            >
                {/* Header: Compact Paradox Style */}
                <div className="bg-[#f0eadd] px-4 py-3 border-b border-[var(--color-secondary)]/20 relative">
                    <h2 className="font-heading text-xl text-stone-900 uppercase tracking-wide inline-block border-b border-[var(--color-primary)]/50 pb-0.5">
                        {content.title}
                    </h2>
                    {/* Optional Close X if useful, but 'click anywhere' makes it redundant */}
                    {/*
                    <button onClick={onClose} className="absolute top-2 right-2 text-stone-500 hover:text-red-500">
                        <CloseIcon size={16} />
                    </button>
                    */}
                </div>

                <div className="px-4 py-3 bg-[var(--color-paper)]">
                    <div className="font-body text-sm leading-relaxed text-[var(--color-surface)]/90 italic">
                        {content.fact}
                    </div>
                </div>

                {/* Voices Feed - Compact */}
                <div className="bg-[#1a1917] flex flex-col max-h-[200px] overflow-y-auto custom-scrollbar">
                    {unlockedVoices.map((v, idx) => {
                        const voiceDef = PARLIAMENT_VOICES[v.voiceId];
                        if (!voiceDef) return null;

                        const color = getVoiceColor(v.voiceId);
                        const group = getVoiceGroup(v.voiceId);
                        // Use group icon for smaller scale
                        const iconSrc = GROUP_ICONS[group];

                        return (
                            <div
                                key={v.voiceId + idx}
                                className="relative border-l-2 p-3 bg-[#121110] border-b border-white/5 last:border-0"
                                style={{ borderColor: color }}
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={iconSrc}
                                        alt={group}
                                        className="w-8 h-8 object-contain opacity-80"
                                    />
                                    <div>
                                        <div
                                            className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1"
                                            style={{ color: color }}
                                        >
                                            {voiceDef.name} [{v.threshold}]
                                        </div>
                                        <p className="font-body text-sm text-stone-300 leading-snug">
                                            “{v.text}”
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
