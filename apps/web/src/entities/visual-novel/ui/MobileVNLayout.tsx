import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypedText, type TextToken } from './TypedText';
import { SpeakerBadge } from './SpeakerBadge';
import type { VNScene, VNChoice, VNCharacter, DialogueEntry } from '../model/types';
import { getVoiceColor } from '@repo/shared/data/parliament';
import { useGyroParallax } from '@/shared/lib/hooks/useGyroParallax';
import { Smartphone, SmartphoneNfc } from 'lucide-react';


interface MobileVNLayoutProps {
    scene: VNScene;
    character: VNCharacter | null;
    background?: string;
    dialogueHistory: DialogueEntry[];
    onInteract: (token: TextToken, element?: HTMLElement) => void;
    onChoice: (choice: VNChoice) => void;
    onTapAdvance: () => void;
    highlightedTerms?: string[];
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
    onTapAdvance,
    highlightedTerms = []
}: MobileVNLayoutProps) {
    const [isTyping, setIsTyping] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasChoices = scene.choices && scene.choices.length > 0;
    const renderCountRef = useRef(0);
    const shouldLog = import.meta.env.DEV;

    const [isRevealMode, setIsRevealMode] = useState(false);
    const lastBackgroundRef = useRef(background);

    // Gyro Parallax
    const [isGyroEnabled, setIsGyroEnabled] = useState(false);
    const { x: gyroX, requestPermission: requestGyro } = useGyroParallax({
        enabled: isGyroEnabled,
        sensitivity: 0.8,
        maxTilt: 15
    });

    const handleGyroToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isGyroEnabled) {
            const granted = await requestGyro();
            if (granted) setIsGyroEnabled(true);
        } else {
            setIsGyroEnabled(false);
        }
    };



    // Trigger reveal mode on background change
    useEffect(() => {
        if (background !== lastBackgroundRef.current) {
            lastBackgroundRef.current = background;
            setTimeout(() => setIsRevealMode(true), 0);
        }
    }, [background]);

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
        if (isRevealMode) {
            setIsRevealMode(false);
            return;
        }
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
                    className="absolute inset-x-0 top-0 bottom-0 overflow-hidden"
                >
                    {background && (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out will-change-transform"
                            style={{
                                backgroundImage: `url(${background})`,
                                filter: 'sepia(0.2) contrast(1.05) brightness(0.6)',
                                transform: `scale(1.15) translateX(${gyroX}%)`
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* === GYRO TOGGLE (Top Right) === */}
            <button
                onClick={handleGyroToggle}
                className={`absolute top-4 right-4 z-[250] p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isGyroEnabled
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-black/30 border-white/10 text-stone-500 hover:bg-black/50'
                    }`}
                aria-label="Toggle Gyroscope Parallax"
            >
                {isGyroEnabled ? <SmartphoneNfc size={20} /> : <Smartphone size={20} />}
            </button>

            {/* === TAP ZONE (over background) === */}
            <div
                className="absolute inset-x-0 top-0 h-[62%] cursor-pointer"
                onClick={handleTapZone}
                role="button"
                aria-label="Tap to continue"
            />

            {/* === CINEMATIC REVEAL TRIGGER (Full Screen) === */}
            {isRevealMode && (
                <div
                    className="absolute inset-0 z-[300] cursor-pointer"
                    onClick={() => setIsRevealMode(false)}
                    role="button"
                    aria-label="Tap to reveal interface"
                />
            )}

            {/* === DIALOGUE PANEL (Bottom 38%) === */}
            <div
                className={`absolute inset-x-0 bottom-0 h-[38%] flex flex-col shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.8)] border-t border-white/10 transition-all duration-700 ${isRevealMode ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}
            >
                {/* Art Deco border */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-600/80 to-transparent flex-shrink-0" />

                {/* Scene Context Header */}
                <div className="absolute top-[-2rem] right-0 flex items-center gap-3 text-[10px] font-mono tracking-widest text-stone-400 opacity-80 z-20">
                    <span className="uppercase">{scene.id.split('_').slice(1).join(' ')}</span>
                    <span>//</span>
                    <span>14:00</span>
                </div>

                {/* Speaker Badge - Connected Floating Label */}
                {character && (
                    <div className="absolute left-0 -top-5 z-20 flex items-end group">
                        {/* Decorative Connection Line */}
                        <div className="absolute left-8 top-full h-4 w-[2px] bg-amber-500/40" />

                        <div className="relative px-6 py-2 bg-stone-950 border-l-[3px] border-amber-500 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform -skew-x-12 origin-bottom-left transition-transform duration-300 group-hover:-skew-x-6">
                            <div className="transform skew-x-12">
                                <SpeakerBadge character={character} className="!gap-2" />
                            </div>
                            {/* Corner Accent */}
                            <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-amber-500/60" />
                        </div>
                    </div>
                )}

                {/* Scrollable Dialogue Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 bg-gradient-to-b from-stone-950/20 to-black/50 backdrop-blur-md overflow-y-auto px-6 py-6 relative
                               border-t-0 border-r-0 border-b-0 border-l-[1px] border-l-white/5
                               rounded-tr-[2rem]" // Asymmetrical corner
                >
                    {/* Paper texture overlay with better blending */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-stone-950/40 pointer-events-none" />
                    <div className="fixed inset-0 bg-[url('/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

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
                            <div className="font-body text-base leading-relaxed text-stone-400">
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
                    <div className="font-body text-lg leading-relaxed text-stone-200">
                        <TypedText
                            key={scene.id}
                            text={scene.text}
                            onInteract={onInteract}
                            onTypingChange={handleTypingChange}
                            highlightedTerms={highlightedTerms}
                        />
                    </div>
                </div>

                {/* === CHOICES (Embedded List Style) === */}
                <AnimatePresence>
                    {!isTyping && hasChoices && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-shrink-0 bg-stone-950/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-1 max-h-[45%] overflow-y-auto shadow-inner"
                        >
                            {/* "What will you say?" Header/Context could go here */}
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
    const listIndex = index + 1;

    return (
        <motion.button
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.04, duration: 0.2 }}
            onClick={onClick}
            className="w-full min-h-[40px] px-4 py-3 
                       hover:bg-white/5 active:scale-[0.99]
                       transition-all duration-200 text-left flex items-start gap-3 group cursor-pointer border-l-2 border-transparent hover:border-amber-500/50"
        >
            {/* List Index / Bullet */}
            <span className="font-mono text-stone-500 text-sm mt-0.5 group-hover:text-amber-500 transition-colors">
                {listIndex}.
            </span>

            <div className="flex-1 flex flex-col gap-1">
                {hasSkillCheck && (
                    <span
                        className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2 self-start px-1.5 py-0.5 rounded-sm"
                        style={{
                            backgroundColor: `${getVoiceColor(choice.skillCheck!.voiceId)}15`,
                            color: getVoiceColor(choice.skillCheck!.voiceId),
                            border: `1px solid ${getVoiceColor(choice.skillCheck!.voiceId)}30`
                        }}
                    >
                        {choice.skillCheck!.voiceId} {choice.skillCheck!.difficulty}
                    </span>
                )}

                <span className="font-body text-lg text-stone-300 group-hover:text-amber-50 leading-snug transition-colors">
                    <span className="text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity mr-1">—</span>
                    {choice.text}
                </span>
            </div>
        </motion.button>
    );
}
