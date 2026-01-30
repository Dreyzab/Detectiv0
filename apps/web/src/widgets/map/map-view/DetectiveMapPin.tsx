import { type MapPoint, logger } from '@repo/shared';
import { cn } from '@/shared/lib/utils';
import { useMemo, useEffect } from 'react';

interface DetectiveMapPinProps {
    point: MapPoint;
    state: 'hidden' | 'discovered' | 'unlocked' | 'investigated' | 'locked';
    onClick: () => void;
    isActive?: boolean;
}

const ASSET_BASE = '/images/detective';

export const DetectiveMapPin = ({ point, state, onClick, isActive }: DetectiveMapPinProps) => {

    useEffect(() => {
        // Detailed debug for the target bank point and any active point
        // ALSO Log mount to prove pins are rendering at all
        logger.debug(`[PIN RENDER] ${point.id}`);

        if (point.id === 'p_bank' || isActive) {
            logger.system(`[PIN DEBUG] ID: ${point.id} | Active: ${isActive} | State: ${state}`);
        }
    }, [isActive, point.id, point.title, state]);

    const visual = useMemo(() => {
        // Get image from point (DB stores it directly)
        const image = point.image || point.data?.image;
        const type = point.data?.type; // Look in data for legacy type if needed
        const category = point.category;

        // Visual mapping from canonical Category to visual type
        let visualType = 'interest';
        if (type) {
            visualType = type;
        } else if (category) {
            const map: Record<string, string> = {
                // Canonical categories (MapPointCategorySchema)
                'CRIME_SCENE': 'crime',
                'NPC': 'support',
                'QUEST': 'bureau',
                'EVENT': 'interest',
                'ACTIVITY': 'interest',
                'INTEREST': 'interest',
                'TRAVEL': 'interest',
                // Legacy fallbacks (for compatibility)
                'CRIME': 'crime',
                'SUPPORT': 'support',
                'POI': 'interest',
                'SECRET': 'interest',
                'MERCHANT': 'support',
            };
            visualType = map[category] || 'interest';
        }

        // Priority: specific location image > type-based generic icon
        if (image) {
            return {
                src: image,
                isPhoto: true, // Flag to apply different styling for photos vs icons
                aura: 'shadow-[0_0_15px_rgba(212,197,163,0.6)]', // Gold/Beige glow
                animate: 'hover:scale-110 duration-300'
            };
        }

        switch (visualType) {
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
    }, [point]); // visual depends on point object content

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
                isUnlocked && "opacity-100",
                visual.aura
            )} />

            {/* Active Quest Highlight (The Detective's Focus) */}
            {isActive && (
                <>
                    {/* 1. Backdrop Contrast */}
                    <div className="absolute -inset-2 bg-black/60 blur-sm rounded-full z-[var(--z-map-pin-backdrop)]" />

                    {/* 2. Focus Ring (Matte Brass, Rotating) */}
                    <div className="absolute -inset-2 pointer-events-none z-[var(--z-map-pin-ring)]">
                        <svg className="w-full h-full animate-spin-slow text-[#b5a642]" viewBox="0 0 100 100">
                            {/* Inner thin guide */}
                            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                            {/* Main irregularly dashed ring */}
                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6 2 6 8 4" />
                            {/* Outer dark edge for contrast */}
                            <circle cx="50" cy="50" r="47" fill="none" stroke="black" strokeWidth="0.5" opacity="0.4" />
                        </svg>
                    </div>

                    {/* 3. Floating Pointer (Chevron) */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-6 text-[#f4ebd0] animate-bounce-slight z-[var(--z-map-pin-pointer)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 18L5.5 9h13L12 18z" />
                        </svg>
                    </div>
                </>
            )}

            {/* Marker Container */}
            <div className={cn(
                "relative z-[var(--z-map-pin-marker)] transition-all duration-500",
                visual.animate,
                // Shared styles
                !isUnlocked && "grayscale opacity-80 brightness-75 sepia",
                isUnlocked && "grayscale-0 opacity-100",
                isInvestigated && "opacity-60 grayscale-[0.5]",

                // Photo-specific container style (Round Marker)
                visual.isPhoto && "w-14 h-14 rounded-full border-2 border-[#f4ebd0] bg-[#1a1612] shadow-md overflow-hidden",

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
                    className="absolute z-[var(--z-map-pin-stamp)] w-16 h-8 -rotate-12 opacity-90 animate-in zoom-in duration-300"
                    style={{ top: '20%' }}
                />
            )}

            {/* Tooltip Title (State: Active/In Range) */}
            <div className={cn(
                "absolute -top-10 px-3 py-1 bg-[#1a1612]/90 text-[#f4ebd0] text-xs font-serif tracking-widest border border-[#d4c5a3]/30 rounded shadow-md whitespace-nowrap opacity-0 transition-opacity pointer-events-none z-[var(--z-map-pin-tooltip)]",
                "group-hover:opacity-100"
            )}>
                {point.title}
            </div>
        </div>
    );
};
