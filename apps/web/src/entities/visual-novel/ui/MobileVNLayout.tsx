import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypedText, type TextToken } from './TypedText';
import { SpeakerBadge } from './SpeakerBadge';
import type { VNScene, VNChoice, VNCharacter, DialogueEntry } from '../model/types';
import { getVoiceColor } from '@repo/shared/data/parliament';

interface MobileVNLayoutProps {
    scene: VNScene;
    character: VNCharacter | null;
    background?: string;
    dialogueHistory: DialogueEntry[];
    onInteract: (token: TextToken) => void;
    onChoice: (choice: VNChoice) => void;
    onTapAdvance: () => void;
}

/**
 * Mobile-First Fullscreen Visual Novel Layout
 * Split View design with scrollable history (Rogue Trader style)
 * 
 * Layout:
 * ┌─────────────────────────────────┐
 * │       [BACKGROUND]              │ 50%
 * ├─────────────────────────────────┤
 * │ [Speaker Badge]                 │
 * ├─────────────────────────────────┤
 * │ [HISTORY - dimmed]              │ Scrollable
 * │ [CURRENT TEXT - bright]         │
 * ├─────────────────────────────────┤
 * │ [CHOICES - inline]              │ After typing
 * └─────────────────────────────────┘
 */
export function MobileVNLayout({
    scene,
    character,
    background,
    dialogueHistory,
    onInteract,
    onChoice,
    onTapAdvance
}: MobileVNLayoutProps) {
    const [isTyping, setIsTyping] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasChoices = scene.choices && scene.choices.length > 0;
    const renderCountRef = useRef(0);
    const shouldLog = import.meta.env.DEV;

    useEffect(() => {
        if (!shouldLog) return;
        renderCountRef.current += 1;
        if (renderCountRef.current <= 5) {
            // Debug logging removed
        }
    }, [shouldLog, scene.id, scene.text.length, isTyping, hasChoices, dialogueHistory.length]);

    // Auto-scroll to bottom (newest text) when content changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [scene.text, dialogueHistory.length]);

    const handleTypingChange = useCallback((typing: boolean) => {
        setIsTyping(typing);
        if (shouldLog) {
            if (shouldLog) {
                // Debug logging removed
            }
        }
    }, [scene.id, scene.text.length, shouldLog]);

    const handleTapZone = () => {
        if (!hasChoices && !isTyping) {
            onTapAdvance();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] overflow-hidden bg-black select-none"
            style={{ height: '100dvh' }}
        >
            {/* === SCENE BACKGROUND (50%) === */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={background}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-x-0 top-0 h-[50%]"
                >
                    {background && (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${background})`,
                                filter: 'sepia(0.2) contrast(1.05) brightness(0.6)'
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* === TAP ZONE (over background) === */}
            <div
                className="absolute inset-x-0 top-0 h-[50%] cursor-pointer"
                onClick={handleTapZone}
                role="button"
                aria-label="Tap to continue"
            />

            {/* === DIALOGUE PANEL (Bottom 50%) === */}
            <div className="absolute inset-x-0 bottom-0 h-[50%] flex flex-col">
                {/* Art Deco border */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-600/80 to-transparent flex-shrink-0" />

                {/* Speaker Badge */}
                {character && (
                    <div className="px-4 py-2 bg-stone-950/95 border-b border-amber-500/20 flex-shrink-0">
                        <SpeakerBadge character={character} />
                    </div>
                )}

                {/* Scrollable Dialogue Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 bg-stone-950/95 backdrop-blur-sm overflow-y-auto px-5 py-4"
                >
                    {/* Paper texture overlay */}
                    <div className="fixed inset-0 bg-[url('/paper-texture.png')] opacity-[0.03] pointer-events-none" />

                    {/* History entries (dimmed) */}
                    {dialogueHistory.map((entry) => (
                        <div
                            key={entry.id}
                            className="mb-4 opacity-50"
                        >
                            {/* Speaker name for history */}
                            {entry.characterName && (
                                <div
                                    className="text-xs uppercase tracking-widest mb-1"
                                    style={{ color: '#8b8b8b' }}
                                >
                                    {entry.characterName}
                                </div>
                            )}
                            <div className="font-serif text-base leading-relaxed text-stone-400">
                                {entry.text}
                            </div>
                            {/* Show choice made */}
                            {entry.choiceMade && (
                                <div className="mt-2 text-sm text-amber-600/60 italic pl-4 border-l-2 border-amber-600/30">
                                    ► {entry.choiceMade}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Current text (bright) */}
                    <div className="font-serif text-lg leading-relaxed text-stone-200">
                        <TypedText
                            key={scene.id}
                            text={scene.text}
                            onInteract={onInteract}
                            onTypingChange={handleTypingChange}
                        />
                    </div>
                </div>

                {/* === CHOICES (inline, after typing) === */}
                <AnimatePresence>
                    {!isTyping && hasChoices && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="flex-shrink-0 bg-stone-900/95 border-t border-amber-500/30 px-4 py-3 space-y-2 max-h-[40%] overflow-y-auto"
                        >
                            {scene.choices!.map((choice, index) => (
                                <ChoiceButton
                                    key={choice.id}
                                    choice={choice}
                                    index={index}
                                    onClick={() => onChoice(choice)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Continue indicator (when no choices and done typing) */}
                {!isTyping && !hasChoices && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-shrink-0 bg-stone-900/95 border-t border-amber-500/30 px-4 py-3 flex justify-center"
                        onClick={onTapAdvance}
                    >
                        <motion.div
                            className="flex items-center gap-2 text-amber-500/80 cursor-pointer"
                            animate={{ y: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                            <span className="text-sm uppercase tracking-widest">Continue</span>
                            <svg width="16" height="10" viewBox="0 0 20 12" fill="currentColor">
                                <path d="M10 12L0 2L2 0L10 8L18 0L20 2L10 12Z" />
                            </svg>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// === CHOICE BUTTON COMPONENT ===
interface ChoiceButtonProps {
    choice: VNChoice;
    index: number;
    onClick: () => void;
}

function ChoiceButton({ choice, index, onClick }: ChoiceButtonProps) {
    const hasSkillCheck = !!choice.skillCheck;

    return (
        <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 300 }}
            onClick={onClick}
            className="w-full min-h-[48px] px-4 py-3 bg-stone-800/90 border border-amber-500/30 
                       hover:bg-amber-500/20 hover:border-amber-500/60 active:scale-[0.98]
                       transition-all duration-150 text-left flex items-center gap-3 group cursor-pointer"
        >
            {hasSkillCheck && (
                <div
                    className="flex-shrink-0 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm"
                    style={{
                        backgroundColor: `${getVoiceColor(choice.skillCheck!.voiceId)}20`,
                        color: getVoiceColor(choice.skillCheck!.voiceId),
                        borderLeft: `3px solid ${getVoiceColor(choice.skillCheck!.voiceId)}`
                    }}
                >
                    {choice.skillCheck!.voiceId} {choice.skillCheck!.difficulty}
                </div>
            )}
            <span className="font-serif text-base text-stone-200 group-hover:text-amber-100">
                {choice.text}
            </span>
        </motion.button>
    );
}
