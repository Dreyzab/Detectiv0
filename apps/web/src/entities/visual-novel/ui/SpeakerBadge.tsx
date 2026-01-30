import { motion } from 'framer-motion';
import type { VNCharacter } from '../model/types';

interface SpeakerBadgeProps {
    character: VNCharacter;
    className?: string;
}

/**
 * Speaker Badge with icon + name
 * Displays character avatar (or initials) and colored name
 */
export function SpeakerBadge({ character, className = '' }: SpeakerBadgeProps) {
    // Get initials from name for fallback avatar
    const initials = character.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-center gap-3 ${className}`}
        >
            {/* Avatar Circle */}
            <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                    borderColor: character.color || '#d4c5a3',
                    backgroundColor: `${character.color || '#d4c5a3'}15`
                }}
            >
                {character.avatarUrl ? (
                    <img
                        src={character.avatarUrl}
                        alt={character.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span
                        className="text-sm font-bold"
                        style={{ color: character.color || '#d4c5a3' }}
                    >
                        {initials}
                    </span>
                )}
            </div>

            {/* Name */}
            <span
                className="font-serif font-bold text-sm uppercase tracking-[0.15em]"
                style={{ color: character.color || '#d4c5a3' }}
            >
                {character.name}
            </span>
        </motion.div>
    );
}
