import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { QuestTimelineEntry } from './utils';

interface TimelineStageChipProps {
    entry: QuestTimelineEntry;
    size?: 'journal' | 'log';
}

const chipSizeClass: Record<NonNullable<TimelineStageChipProps['size']>, string> = {
    journal: 'px-2.5 py-1 text-[11px]',
    log: 'px-2 py-0.5 text-[10px]'
};

export const TimelineStageChip = ({ entry, size = 'journal' }: TimelineStageChipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const hintLines = (entry.transitionHint ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    const hasHint = hintLines.length > 0;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const chipClass = cn(
        'rounded-full font-semibold whitespace-nowrap border',
        chipSizeClass[size],
        entry.status === 'completed' && 'border-green-500/30 bg-green-500/10 text-green-300',
        entry.status === 'current' && 'border-[#ca8a04]/50 bg-[#ca8a04]/15 text-[#fcd34d]',
        entry.status === 'upcoming' && 'border-[#78716c]/30 bg-[#292524]/60 text-[#a8a29e]',
        hasHint && 'cursor-help'
    );

    if (!hasHint) {
        return <span className={chipClass}>{entry.label}</span>;
    }

    return (
        <div
            ref={rootRef}
            className="relative inline-flex"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                type="button"
                className={chipClass}
                onClick={() => setIsOpen((prev) => !prev)}
                onFocus={() => setIsOpen(true)}
                onBlur={(event) => {
                    if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                        setIsOpen(false);
                    }
                }}
                aria-label={`Stage hint for ${entry.label}`}
                aria-expanded={isOpen}
            >
                {entry.label}
            </button>

            {isOpen && (
                <div
                    role="tooltip"
                    className="absolute left-1/2 top-full mt-2 z-60 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border border-[#ca8a04]/35 bg-[#0c0a09]/95 p-3 text-left shadow-xl backdrop-blur-md"
                >
                    <div className="space-y-1">
                        {hintLines.map((line, index) => (
                            <p key={`${entry.stage}-hint-${index}`} className="text-[11px] leading-snug text-[#e7dac0]">
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
