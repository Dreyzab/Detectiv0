import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Eye, Lock, Check } from 'lucide-react';
import type { VNChoice } from '@/entities/visual-novel/model/types';
import { getVoiceColor } from '@repo/shared/data/parliament';

export interface ChoiceButtonProps {
    choice: VNChoice;
    index: number;
    isVisited?: boolean;
    isLocked?: boolean;
    onClick: () => void;
    /** Compact mode for mobile */
    compact?: boolean;
    disabled?: boolean;
}

/**
 * Shared Choice Button Component
 * 
 * Visual States:
 * - fresh: Full opacity, interactive
 * - visited: Dimmed (inquiry 30%, action/flavor 50%), checkmark on inquiry
 * - locked: Red lock icon, text hidden
 * 
 * Type Styling:
 * - action: Amber border + → icon, bold text
 * - inquiry: 💬 icon, neutral text
 * - flavor: 👁️ icon, blue italic text
 */
export function ChoiceButton({
    choice,
    index,
    isVisited = false,
    isLocked = false,
    onClick,
    compact = false,
    disabled = false
}: ChoiceButtonProps) {
    const hasSkillCheck = !!choice.skillCheck;
    const type = choice.type || 'action';
    const choiceTestId = `vn-choice-${choice.id}`;

    const isAction = type === 'action';
    const isInquiry = type === 'inquiry';
    const isFlavor = type === 'flavor';

    // Opacity based on visited state
    const visitedOpacity = isInquiry ? 'opacity-30' : 'opacity-50';
    const baseOpacity = isVisited ? visitedOpacity : 'opacity-100';

    // Locked state overrides everything
    if (isLocked && hasSkillCheck) {
        return (
            <motion.div
                data-testid={choiceTestId}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.04, duration: 0.2 }}
                className={`w-full ${compact ? 'min-h-[36px] px-3 py-2' : 'min-h-[40px] px-4 py-3'} 
                           flex items-center gap-4 border-l-2 border-red-900/50 bg-red-950/10 cursor-not-allowed`}
            >
                <Lock size={compact ? 16 : 18} className="text-red-500/70 flex-shrink-0" />
                <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
                    style={{
                        backgroundColor: `${getVoiceColor(choice.skillCheck!.voiceId)}15`,
                        color: getVoiceColor(choice.skillCheck!.voiceId),
                        border: `1px solid ${getVoiceColor(choice.skillCheck!.voiceId)}30`
                    }}
                >
                    {choice.skillCheck!.voiceId.toUpperCase()} {choice.skillCheck!.difficulty}
                </span>
                <span className="flex-1 text-stone-600 line-through">
                    {choice.text.slice(0, 20)}...
                </span>
            </motion.div>
        );
    }

    return (
        <motion.button
            data-testid={choiceTestId}
            layout
            variants={{
                hidden: { x: -20, opacity: 0 },
                visible: { x: 0, opacity: 1 }
            }}
            // Remove manual transition to let motion handle stagger
            // Remove manual transition to let motion handle stagger
            onClick={onClick}
            disabled={disabled}
            className={`w-full ${compact ? 'min-h-[36px] px-3 py-2' : 'min-h-[44px] px-3 py-2'} 
                       transition-all duration-200 text-left flex items-start gap-3 group border-l-2 
                       ${disabled ? 'opacity-50 cursor-not-allowed grayscale pointer-events-none' : 'cursor-pointer'} 
                       ${baseOpacity}
                       ${isAction
                    ? isVisited
                        ? 'border-amber-500/20 bg-amber-950/5 hover:bg-amber-900/10'
                        : 'border-amber-500/50 bg-amber-950/10 hover:bg-amber-900/20'
                    : 'border-transparent hover:border-stone-600 hover:bg-white/5'
                }`}
        >
            {/* Icon based on Type + State */}
            <div className="mt-1 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                {isAction && <ArrowRight size={compact ? 16 : 18} className="text-amber-500" />}
                {isInquiry && (
                    isVisited
                        ? <Check size={compact ? 16 : 18} className="text-stone-500" />
                        : <MessageCircle size={compact ? 16 : 18} className="text-stone-400" />
                )}
                {isFlavor && <Eye size={compact ? 16 : 18} className="text-blue-300/70" />}
            </div>

            <div className="flex-1 flex flex-col gap-1">
                {/* Skill Check Badge */}
                {hasSkillCheck && (
                    <span
                        className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2 self-start px-1.5 py-0.5 rounded-sm"
                        style={{
                            backgroundColor: `${getVoiceColor(choice.skillCheck!.voiceId)}15`,
                            color: getVoiceColor(choice.skillCheck!.voiceId),
                            border: `1px solid ${getVoiceColor(choice.skillCheck!.voiceId)}30`
                        }}
                    >
                        {choice.skillCheck!.voiceId.toUpperCase()} {choice.skillCheck!.difficulty}
                    </span>
                )}

                {/* Choice Text */}
                <span className={`${compact ? 'text-base' : 'text-base sm:text-lg'} leading-snug transition-colors
                    ${isAction
                        ? isVisited
                            ? 'text-stone-500 font-medium'
                            : 'text-amber-100 font-medium group-hover:text-amber-50 shadow-black drop-shadow-sm'
                        : ''
                    }
                    ${isInquiry
                        ? isVisited
                            ? 'text-stone-600'
                            : 'text-stone-300 group-hover:text-stone-100'
                        : ''
                    }
                    ${isFlavor
                        ? isVisited
                            ? 'text-blue-200/40 italic'
                            : 'text-blue-100/80 italic group-hover:text-blue-50'
                        : ''
                    }
                `}>
                    {choice.text}
                </span>
            </div>
        </motion.button>
    );
}

export default ChoiceButton;
