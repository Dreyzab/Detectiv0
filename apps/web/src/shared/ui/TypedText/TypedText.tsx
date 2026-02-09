import { motion } from 'framer-motion';
import { soundManager } from '@/shared/lib/audio/SoundManager';
import { useEffect, useState, useMemo, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

export type TokenType = 'text' | 'note' | 'clue';

export interface TextToken {
    type: TokenType;
    text: string;     // The visible text
    payload?: string; // clue_id for clues, or same as text for notes
    original: string; // The original substring (e.g. [[Note]])
    start: number;
    end: number;
}

export interface TypedTextHandle {
    finish: () => void;
    isTyping: boolean;
    setSpeedOverride: (speedOverride: number | null) => void;
}

interface TypedTextProps {
    text: string;
    speed?: number; // ms per char (default: 10, was 30)
    onInteract?: (token: TextToken, element?: HTMLElement) => void;
    onComplete?: () => void;
    /** Called when typing state changes */
    onTypingChange?: (isTyping: boolean) => void;
    highlightedTerms?: string[];
}

// Default speed: 10ms (3x faster than original 30ms)
const DEFAULT_SPEED = 10;
const LEGACY_SPAN_CLOSE_TAG = '</span>';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAttributeValue = (tag: string, attrName: string): string | null => {
    const escapedName = escapeRegex(attrName);
    const match = tag.match(new RegExp(`${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
    if (!match) {
        return null;
    }
    return (match[1] ?? match[2] ?? match[3] ?? '').trim();
};

interface LegacyInteractiveSpan {
    type: TokenType;
    text: string;
    payload?: string;
    original: string;
    nextPos: number;
}

const parseLegacyInteractiveSpan = (source: string, start: number): LegacyInteractiveSpan | null => {
    if (!source.startsWith('<span', start)) {
        return null;
    }

    const openTagEnd = source.indexOf('>', start + 5);
    if (openTagEnd === -1) {
        return null;
    }

    const closeTagStart = source.indexOf(LEGACY_SPAN_CLOSE_TAG, openTagEnd + 1);
    if (closeTagStart === -1) {
        return null;
    }

    const openTag = source.slice(start, openTagEnd + 1);
    const hasInteractiveRole = /\brole\s*=\s*["']button["']/i.test(openTag);
    const hasInteractiveMarker = /\bdata-vn-interactive(?:\s*=\s*(?:"true"|'true'|true))?\b/i.test(openTag);

    if (!hasInteractiveRole && !hasInteractiveMarker) {
        return null;
    }

    const innerRaw = source.slice(openTagEnd + 1, closeTagStart);
    const visibleText = innerRaw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!visibleText) {
        return null;
    }

    const title = (getAttributeValue(openTag, 'title') ?? '').toLowerCase();
    const className = (getAttributeValue(openTag, 'class') ?? '').toLowerCase();
    const payload = getAttributeValue(openTag, 'data-vn-payload')
        ?? getAttributeValue(openTag, 'data-vn-id')
        ?? getAttributeValue(openTag, 'data-vn-token')
        ?? getAttributeValue(openTag, 'data-vn-evidence-id')
        ?? undefined;

    const isClue = title === 'evidence' || className.includes('text-accent') || className.includes('border-accent');
    const type: TokenType = isClue ? 'clue' : 'note';

    const nextPos = closeTagStart + LEGACY_SPAN_CLOSE_TAG.length;
    return {
        type,
        text: visibleText,
        payload: payload ?? (type === 'note' ? visibleText : undefined),
        original: source.slice(start, nextPos),
        nextPos
    };
};

export const TypedText = forwardRef<TypedTextHandle, TypedTextProps>(({ text, speed = DEFAULT_SPEED, onInteract, onComplete, onTypingChange, highlightedTerms = [] }, ref) => {
    const [visibleChars, setVisibleChars] = useState(0);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const isTypingRef = useRef(true);
    const speedRef = useRef(speed);
    const speedOverrideRef = useRef<number | null>(null);
    const onTypingChangeRef = useRef<TypedTextProps['onTypingChange']>(undefined);
    const onCompleteRef = useRef<TypedTextProps['onComplete']>(undefined);
    const prevIsTypingRef = useRef<boolean | null>(null);
    const shouldLog = import.meta.env.DEV;

    // 1. Parsing: Memoize tokens to avoid re-parsing on every frame
    // 1. Robust Tokenizer: Character-loop for safer bracket parsing
    const { tokens, fullTextLength } = useMemo(() => {
        const result: TextToken[] = [];
        let totalLength = 0;
        let currentPos = 0;

        while (currentPos < text.length) {
            // Check for opening [[
            if (text.startsWith('[[', currentPos)) {
                const closingIndex = text.indexOf(']]', currentPos + 2);

                if (closingIndex !== -1) {
                    const content = text.substring(currentPos + 2, closingIndex);
                    const pieces = content.split('|');

                    if (pieces.length === 2) {
                        // [[clue_id|text]]
                        const [id, visibleText] = pieces;
                        const original = text.substring(currentPos, closingIndex + 2);
                        result.push({
                            type: 'clue',
                            text: visibleText,
                            payload: id,
                            original,
                            start: totalLength,
                            end: totalLength + visibleText.length
                        });
                        totalLength += visibleText.length;
                    } else {
                        // [[note_text]]
                        const visibleText = pieces[0];
                        const original = text.substring(currentPos, closingIndex + 2);
                        result.push({
                            type: 'note',
                            text: visibleText,
                            payload: visibleText,
                            original,
                            start: totalLength,
                            end: totalLength + visibleText.length
                        });
                        totalLength += visibleText.length;
                    }

                    currentPos = closingIndex + 2;
                    continue;
                }
            }

            if (text.startsWith('<span', currentPos)) {
                const legacySpan = parseLegacyInteractiveSpan(text, currentPos);
                if (legacySpan) {
                    result.push({
                        type: legacySpan.type,
                        text: legacySpan.text,
                        payload: legacySpan.payload,
                        original: legacySpan.original,
                        start: totalLength,
                        end: totalLength + legacySpan.text.length
                    });
                    totalLength += legacySpan.text.length;
                    currentPos = legacySpan.nextPos;
                    continue;
                }
            }

            // Regular text: collect until next [[ or legacy <span ...> token
            const nextBracket = text.indexOf('[[', currentPos);
            const nextLegacySpan = text.indexOf('<span', currentPos);
            const nextCandidates = [nextBracket, nextLegacySpan].filter((index) => index !== -1);
            let nextTokenStart = nextCandidates.length > 0 ? Math.min(...nextCandidates) : text.length;

            // Prevent stalling on malformed markup that starts at currentPos
            if (nextTokenStart === currentPos) {
                nextTokenStart = currentPos + 1;
            }

            const sub = text.substring(currentPos, nextTokenStart);
            if (sub.length > 0) {
                result.push({
                    type: 'text',
                    text: sub,
                    original: sub,
                    start: totalLength,
                    end: totalLength + sub.length
                });
                totalLength += sub.length;
            }
            currentPos = nextTokenStart;
        }

        return { tokens: result, fullTextLength: totalLength };
    }, [text]);

    useEffect(() => {
        onTypingChangeRef.current = onTypingChange;
        onCompleteRef.current = onComplete;
    }, [onTypingChange, onComplete]);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        const isTyping = visibleChars < fullTextLength;
        if (prevIsTypingRef.current === null || prevIsTypingRef.current !== isTyping) {
            prevIsTypingRef.current = isTyping;
            onTypingChangeRef.current?.(isTyping);
            if (!isTyping) {
                onCompleteRef.current?.();
            }
        }
    }, [visibleChars, fullTextLength, shouldLog]);

    // Skip function: instantly complete typing
    const skipTyping = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
        speedOverrideRef.current = null;
        setVisibleChars(fullTextLength);
        if (isTypingRef.current) {
            isTypingRef.current = false;
        }
    }, [fullTextLength]);

    const setSpeedOverride = useCallback((speedOverride: number | null) => {
        speedOverrideRef.current = speedOverride;
    }, []);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        finish: skipTyping,
        isTyping: isTypingRef.current,
        setSpeedOverride
    }));

    // 2. Typewriter Loop
    useEffect(() => {
        // eslint-disable-next-line
        setVisibleChars(0);
        lastTimeRef.current = performance.now();
        isTypingRef.current = true;

        const initialSpeed = speedOverrideRef.current ?? speedRef.current;
        if (initialSpeed <= 0) {
            setVisibleChars(fullTextLength);
            isTypingRef.current = false;
            return;
        }

        const animate = (time: number) => {
            const effectiveSpeed = speedOverrideRef.current ?? speedRef.current;
            if (effectiveSpeed <= 0) {
                setVisibleChars(fullTextLength);
                if (isTypingRef.current) {
                    soundManager.playTypewriterClick();
                    isTypingRef.current = false;
                }
                return;
            }

            const delta = time - lastTimeRef.current;
            if (delta >= effectiveSpeed) {
                const steps = Math.floor(delta / effectiveSpeed);
                setVisibleChars((prev) => {
                    const next = Math.min(prev + steps, fullTextLength);
                    soundManager.playTypewriterClick(); // Play click on each frame
                    if (next >= fullTextLength) {
                        if (isTypingRef.current) {
                            soundManager.playTypewriterClick(); // Final click
                            isTypingRef.current = false;
                        }
                    }
                    return next;
                });
                lastTimeRef.current = time - (delta % effectiveSpeed);
            }
            if (isTypingRef.current) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [tokens, fullTextLength]); // Removed speed changes to avoid restarting typing mid-line

    // 3. Rendering Logic
    const renderedTokens = tokens.map((token, index) => {
        // Logic based on pre-calculated start/end
        if (visibleChars <= token.start) return null; // Fully hidden

        const isFullyVisible = visibleChars >= token.end;
        const slice = isFullyVisible
            ? token.text
            : token.text.substring(0, visibleChars - token.start);

        if (token.type === 'text') {
            return <span key={`${index}-${token.text}`}>{slice}</span>;
        }

        const isClue = token.type === 'clue';
        const isHighlightedHighlighted = highlightedTerms.some(term => term.toLowerCase() === token.text.toLowerCase());

        return (
            <motion.span
                key={`${index}-${token.text}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                role={isFullyVisible ? 'button' : undefined}
                tabIndex={isFullyVisible ? 0 : undefined}
                data-vn-interactive={isFullyVisible ? 'true' : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFullyVisible && onInteract) {
                        soundManager.playClueFound();
                        onInteract(token, e.currentTarget);
                    }
                }}
                onKeyDown={(e) => {
                    if (!isFullyVisible) return;
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    e.stopPropagation();
                    if (onInteract) {
                        soundManager.playClueFound();
                        onInteract(token, e.currentTarget);
                    }
                }}
                className={`
                            inline-block font-semibold transition-colors px-1 rounded-sm
                            ${isFullyVisible ? 'cursor-pointer' : ''}
                            ${isClue
                        ? 'text-accent hover:bg-accent/10 border-b border-accent/30 hover:border-accent'
                        : isHighlightedHighlighted
                            ? 'text-amber-400 font-bold hover:bg-amber-400/10 border-b border-amber-400/30 hover:border-amber-400'
                            : 'text-primary font-bold hover:bg-primary/10 border-b border-primary/30 hover:border-primary'}
                        `}
                title={isClue ? "Evidence" : isHighlightedHighlighted ? "Interactive Info" : "Note"}
            >
                {slice}
            </motion.span>
        );
    });

    const isTyping = visibleChars < fullTextLength;

    return (
        <span
            className="typed-text-container leading-relaxed pointer-events-auto"
        >
            {renderedTokens}
            {isTyping && (
                <span className="animate-pulse inline-block w-2 h-4 bg-primary ml-1 align-middle" />
            )}
        </span>
    );
});

TypedText.displayName = 'TypedText';
