import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypedText, type TextToken, type TypedTextHandle } from '@/shared/ui/TypedText/TypedText';
import { SpeakerBadge } from '@/entities/character/ui/SpeakerBadge';
import type { VNScene, VNChoice, VNCharacter, DialogueEntry } from '@/entities/visual-novel/model/types';
import { useGyroParallax } from '@/shared/lib/hooks/useGyroParallax';
import { Smartphone, SmartphoneNfc, MapPin } from 'lucide-react';
import ChoiceButton from './ChoiceButton';
import { MindPalaceOverlay } from '@/features/detective/mind-palace/MindPalaceOverlay';


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
    const typedTextRef = useRef<TypedTextHandle>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasChoices = scene.choices && scene.choices.length > 0;
    const renderCountRef = useRef(0);
    const shouldLog = import.meta.env.DEV;

    const [isRevealMode, setIsRevealMode] = useState(false);
    const [visitedChoices, setVisitedChoices] = useState<Set<string>>(new Set());
    const lastBackgroundRef = useRef(background);

    // Gyro Parallax
    const [isGyroEnabled, setIsGyroEnabled] = useState(false);
    const { x: gyroX, requestPermission: requestGyro } = useGyroParallax({
        enabled: isGyroEnabled,
        sensitivity: 0.8,
        maxTilt: 15
    });

    // Cinematic Camera & Panning Logic
    const [panClass, setPanClass] = useState('');

    const cameraPosition = useMemo(() => {
        if (!background) return '50% 50%';

        // Logic: specific backgrounds can have fixed camera positions based on speaker
        const isCoupe = background.includes('coupe4p');
        if (isCoupe && character) {
            // Example: Fritz (Player) on Left, Others on Right
            const isPlayer = character.name.includes('Fritz');
            return isPlayer ? '20% 50%' : '80% 50%';
        }

        return '50% 50%';
    }, [background, character]);

    const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const ratio = img.naturalWidth / img.naturalHeight;

        if (ratio < 1.5) setPanClass('vn-bg-pan-narrow');
        else if (ratio < 2) setPanClass('vn-bg-pan-normal');
        else if (ratio < 2.5) setPanClass('vn-bg-pan-wide');
        else setPanClass('vn-bg-pan-ultrawide');
    }, []);

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
    }, [shouldLog]);

    const handleTapZone = () => {
        if (isRevealMode) {
            setIsRevealMode(false);
            return;
        }

        // 1. If typing -> Finish instantly
        if (isTyping) {
            typedTextRef.current?.finish();
            return;
        }

        // 2. If finished & no choices -> Advance
        if (!hasChoices) {
            onTapAdvance();
        }
    };

    const handleTapAnywhere = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) {
            handleTapZone();
            return;
        }

        // Don't treat taps on interactive elements as "advance"
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], [data-vn-interactive="true"]');
        if (interactive) return;

        handleTapZone();
    };

    return (
        <div
            className="fixed inset-0 z-[200] overflow-hidden bg-black select-none"
            style={{ height: '100dvh' }}
            onClick={handleTapAnywhere}
        >
            {/* Mind Palace Overlay - z-[125] to sit between BG/Header (z-100) and Dialogue (z-150) */}
            <div className="absolute inset-0 pointer-events-none z-[125]">
                <MindPalaceOverlay />
            </div>

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
                        <motion.div
                            className="w-full h-full bg-black"
                            style={{ transform: `scale(1.15) translateX(${gyroX}%)` }}
                        >
                            <motion.img
                                src={background}
                                onLoad={handleImageLoad}
                                initial={{ objectPosition: '50% 50%' }}
                                animate={{ objectPosition: cameraPosition }}
                                transition={{ objectPosition: { duration: 0.8, ease: 'easeInOut' } }}
                                className={`w-full h-full object-cover brightness-[0.6] sepia-[0.2] contrast-[1.05] ${cameraPosition === '50% 50%' ? panClass : ''}`}
                                alt="Scene Background"
                            />
                        </motion.div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
                    {/* === GLOBAL ATMOSPHERE === */}
                    <div className="absolute inset-0 z-[10] pointer-events-none mix-blend-overlay opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')] brightness-100 contrast-150" />
                </motion.div>
            </AnimatePresence >

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

            {/* === CINEMATIC REVEAL TRIGGER (Full Screen) === */}
            {
                isRevealMode && (
                    <div
                        className="absolute inset-0 z-[300] cursor-pointer"
                        onClick={() => setIsRevealMode(false)}
                        role="button"
                        aria-label="Tap to reveal interface"
                    />
                )
            }

            {/* === CINEMATIC HEADER (Top) === */}
            <div className="absolute top-0 inset-x-0 p-6 pt-12 flex justify-between items-start z-[100] bg-gradient-to-b from-black/90 via-black/40 to-transparent pb-32 pointer-events-none">
                <div className="flex flex-col gap-2 transform translate-y-0 transition-transform duration-700">
                    <div className="flex items-center gap-2 text-amber-500/90 uppercase tracking-[0.2em] text-[10px] font-bold">
                        <MapPin size={12} className="text-amber-500" />
                        <span>Current Location</span>
                    </div>
                    <h1 className="text-3xl font-display text-white font-bold tracking-tight drop-shadow-2xl opacity-90">
                        {scene.id.split('_').slice(1).join(' ')}
                    </h1>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-amber-500/50 to-transparent mt-1" />
                </div>
            </div>

            {/* === DIALOGUE PANEL (Bottom - Flexible) === */}
            <div
                className={`absolute inset-x-0 bottom-0 z-[150] min-h-[35%] max-h-[65%] flex flex-col shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.8)] border-t border-white/10 transition-all duration-700 ${isRevealMode ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}
            >
                {/* Art Deco border */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-600/80 to-transparent flex-shrink-0" />

                {/* === ATMOSPHERIC LAYERS === */}




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
                    className={`flex-1 bg-gradient-to-b from-stone-950/20 to-black/50 backdrop-blur-md overflow-y-auto px-6 relative
                               border-t-0 border-r-0 border-b-0 border-l-[1px] border-l-white/5
                               rounded-tr-[2rem]
                               ${character ? 'pt-12' : 'py-6'}`}
                >
                    {/* Paper texture overlay with better blending */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-stone-950/40 pointer-events-none" />
                    <div className="fixed inset-0 bg-[url('/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

                    {/* History entries (dimmed) */}
                    {dialogueHistory.map((entry) => (
                        <div key={entry.id} className="mb-4 opacity-50">
                            {entry.characterName && (
                                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#8b8b8b' }}>
                                    {entry.characterName}
                                </div>
                            )}
                            <div className="font-body text-base sm:text-lg leading-relaxed text-stone-200">
                                {entry.text}
                            </div>
                            {entry.choiceMade && (
                                <div className="mt-2 text-sm text-amber-600/60 italic pl-4 border-l-2 border-amber-600/30">
                                    ► {entry.choiceMade}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Current text (bright) */}
                    <div className="font-body text-base sm:text-lg leading-relaxed text-stone-200">
                        <TypedText
                            ref={typedTextRef}
                            key={scene.id}
                            text={scene.text}
                            onInteract={onInteract}
                            onTypingChange={handleTypingChange}
                            highlightedTerms={highlightedTerms}
                        />
                    </div>
                </div>

                {/* === CHOICES (Embedded List Style) === */}
                <AnimatePresence mode="popLayout">
                    {!isTyping && hasChoices && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1,
                                        delayChildren: 0.1
                                    }
                                },
                                hidden: {
                                    opacity: 0
                                }
                            }}
                            className="flex-shrink-0 bg-stone-950/90 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-2 sm:py-3 space-y-1 max-h-[50vh] overflow-y-auto shadow-inner"
                        >
                            {/* "What will you say?" Header/Context could go here */}
                            {scene.choices!.map((choice, index) => (
                                <ChoiceButton
                                    key={choice.id}
                                    choice={choice}
                                    index={index}
                                    isVisited={visitedChoices.has(choice.id)}
                                    onClick={() => {
                                        setVisitedChoices(prev => new Set(prev).add(choice.id));
                                        onChoice(choice);
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

// ChoiceButton component moved to ./ChoiceButton.tsx
