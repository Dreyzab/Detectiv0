import type { DetectivePoint } from '@/features/detective/points';
import { cn } from '@/shared/lib/utils';
import { useMemo } from 'react';

interface DetectiveMapPinProps {
    point: DetectivePoint;
    state: 'hidden' | 'discovered' | 'unlocked' | 'investigated' | 'locked';
    onClick: () => void;
}

const ASSET_BASE = '/images/detective';

export const DetectiveMapPin = ({ point, state, onClick }: DetectiveMapPinProps) => {

    const visual = useMemo(() => {
        // Priority: specific location image > type-based generic icon
        if (point.image) {
            return {
                src: point.image,
                isPhoto: true, // Flag to apply different styling for photos vs icons
                aura: 'shadow-[0_0_15px_rgba(212,197,163,0.6)]', // Gold/Beige glow
                animate: 'hover:scale-110 duration-300'
            };
        }

        switch (point.type) {
            case 'crime':
                return {
                    src: `${ASSET_BASE}/marker_wax_seal.png`,
                    isPhoto: false,
                    aura: 'shadow-[0_0_15px_rgba(220,38,38,0.6)]', // Red
                    animate: 'animate-pulse' // Heartbeat
                };
            case 'support':
                return {
                    src: `${ASSET_BASE}/marker_mosaic_anvil.png`,
                    isPhoto: false,
                    aura: 'shadow-[0_0_15px_rgba(22,163,74,0.5)]', // Green
                    animate: ''
                };
            case 'interest':
            case 'bureau':
            default:
                return {
                    src: `${ASSET_BASE}/marker_inkblot.png`,
                    isPhoto: false,
                    aura: 'shadow-[0_0_15px_rgba(37,99,235,0.5)]', // Blue
                    animate: 'hover:scale-110 duration-300'
                };
        }
    }, [point.type, point.image]);

    // Handle states
    if (state === 'hidden' || state === 'locked') {
        if (state === 'hidden') return null;
    }

    const isInvestigated = state === 'investigated';
    const isUnlocked = state === 'unlocked' || state === 'investigated';

    return (
        <div
            className="relative group cursor-pointer flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* Aura / Glow */}
            <div className={cn(
                "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500",
                isUnlocked && "opacity-100",
                visual.aura
            )} />

            {/* Marker Container */}
            <div className={cn(
                "relative z-10 transition-all duration-500",
                visual.animate,
                // Shared styles
                !isUnlocked && "grayscale opacity-80 brightness-75 sepia",
                isUnlocked && "grayscale-0 opacity-100",
                isInvestigated && "opacity-60 grayscale-[0.5]",

                // Photo-specific container style (Round Marker)
                visual.isPhoto && "w-14 h-14 rounded-full border-2 border-[#f4ebd0] bg-[#1a1612] shadow-md overflow-hidden p-0.5",

                // Icon-specific style (No container, just image)
                !visual.isPhoto && "w-12 h-12"
            )}>
                <img
                    src={visual.src}
                    alt={point.title}
                    className={cn(
                        "w-full h-full object-cover",
                        visual.isPhoto && "rounded-full" // Ensure photo is clipped
                    )}
                />
            </div>

            {/* Investigated Stamp overlay */}
            {isInvestigated && (
                <img
                    src={`${ASSET_BASE}/stamp_erledigt.png`}
                    alt="Erledigt"
                    className="absolute z-20 w-16 h-8 -rotate-12 opacity-90 animate-in zoom-in duration-300"
                    style={{ top: '20%' }}
                />
            )}

            {/* Tooltip Title (State: Active/In Range) */}
            <div className={cn(
                "absolute -top-10 px-3 py-1 bg-[#1a1612]/90 text-[#f4ebd0] text-xs font-serif tracking-widest border border-[#d4c5a3]/30 rounded shadow-md whitespace-nowrap opacity-0 transition-opacity pointer-events-none z-30",
                "group-hover:opacity-100"
            )}>
                {point.title}
            </div>
        </div>
    );
};
