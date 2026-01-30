import { motion } from 'framer-motion';
import { soundManager } from '@/shared/lib/audio/SoundManager';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';

export type TokenType = 'text' | 'note' | 'clue';

export interface TextToken {
    type: TokenType;
    text: string;     // The visible text
    payload?: string; // clue_id for clues, or same as text for notes
    original: string; // The original substring (e.g. [[Note]])
    start: number;
    end: number;
}

interface TypedTextProps {
    text: string;
    speed?: number; // ms per char (default: 10, was 30)
    onInteract?: (token: TextToken) => void;
    onComplete?: () => void;
    /** Called when typing state changes */
    onTypingChange?: (isTyping: boolean) => void;
}

// Default speed: 10ms (3x faster than original 30ms)
const DEFAULT_SPEED = 10;

export const TypedText = ({ text, speed = DEFAULT_SPEED, onInteract, onComplete, onTypingChange }: TypedTextProps) => {
    const [visibleChars, setVisibleChars] = useState(0);
    const requestRef = useRef<number>(null);
    const lastTimeRef = useRef<number>(0);
    const isTypingRef = useRef(true);
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

            // Regular text: collect until next [[ or end
            let nextBracket = text.indexOf('[[', currentPos);
            if (nextBracket === -1) nextBracket = text.length;

            const sub = text.substring(currentPos, nextBracket);
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
            currentPos = nextBracket;
        }

        return { tokens: result, fullTextLength: totalLength };
    }, [text]);

    useEffect(() => {
        onTypingChangeRef.current = onTypingChange;
        onCompleteRef.current = onComplete;
    }, [onTypingChange, onComplete]);

    useEffect(() => {
        const isTyping = visibleChars < fullTextLength;
        if (prevIsTypingRef.current === null || prevIsTypingRef.current !== isTyping) {
            prevIsTypingRef.current = isTyping;
            onTypingChangeRef.current?.(isTyping);
            if (!isTyping) {
                onCompleteRef.current?.();
                if (shouldLog) {
                    // Debug logging removed
                }
            }
        }
    }, [visibleChars, fullTextLength, shouldLog]);

    // Skip function: instantly complete typing
    const skipTyping = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
        setVisibleChars(fullTextLength);
        if (isTypingRef.current) {
            isTypingRef.current = false;
            if (shouldLog) {
                // Debug logging removed
            }
        }
    }, [fullTextLength, shouldLog]);

    // 2. Typewriter Loop
    useEffect(() => {
        if (shouldLog) {
            // Debug logging removed
        }
        // eslint-disable-next-line
        setVisibleChars(0);
        lastTimeRef.current = performance.now();
        isTypingRef.current = true;

        const animate = (time: number) => {
            const delta = time - lastTimeRef.current;
            if (delta >= speed) {
                setVisibleChars((prev) => {
                    const next = prev + 1;
                    soundManager.playTypewriterClick(); // Play click on every char
                    if (next >= fullTextLength) {
                        if (isTypingRef.current) {
                            soundManager.playTypewriterClick(); // Final click
                            isTypingRef.current = false;
                            if (shouldLog) {
                                // Debug logging removed
                            }
                        }
                        return fullTextLength; // Stop
                    }
                    lastTimeRef.current = time;
                    return next;
                });
            }
            if (isTypingRef.current) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (shouldLog) {
                // Debug logging removed
            }
        };
    }, [tokens, fullTextLength, speed, shouldLog]);

    // 3. Rendering Logic
    // We need to render tokens up to `visibleChars` count.
    // If a token is partially visible, we slice its text.


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

        return (
            <motion.span
                key={`${index}-${token.text}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFullyVisible && onInteract) {
                        soundManager.playClueFound();
                        onInteract(token);
                    }
                }}
                className={`
                            inline-block font-semibold transition-colors px-1 rounded-sm
                            ${isFullyVisible ? 'cursor-pointer' : ''}
                            ${isClue
                        ? 'text-accent hover:bg-accent/10 border-b border-accent/30 hover:border-accent'
                        : 'text-primary font-bold hover:bg-primary/10 border-b border-primary/30 hover:border-primary'}
                        `}
                title={isClue ? "Evidence" : "Note"}
            >
                {slice}
            </motion.span>
        );
    });

    const isTyping = visibleChars < fullTextLength;

    return (
        <span
            className="typed-text-container leading-relaxed"
            onClick={(e) => {
                // Tap to skip: if still typing, complete instantly
                if (isTyping) {
                    e.stopPropagation();
                    skipTyping();
                }
            }}
        >
            {renderedTokens}
            {isTyping && (
                <span className="animate-pulse inline-block w-2 h-4 bg-primary ml-1 align-middle" />
            )}
        </span>
    );
};
