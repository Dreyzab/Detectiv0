
import { type MapPoint, type MapPointBinding } from '@repo/shared';
import { useDossierStore } from '@/features/detective/dossier/store';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

interface InteractionWindowProps {
    point: MapPoint;
    availableActions: { binding: MapPointBinding; isAvailable: boolean; reason?: string }[];
    onClose: () => void;
    onExecuteAction: (binding: MapPointBinding) => void;
    onConfirmArrive?: () => void;
    canArrive?: boolean;
}

export const InteractionWindow = ({
    point,
    availableActions,
    onClose,
    onExecuteAction,
    onConfirmArrive,
    canArrive
}: InteractionWindowProps) => {
    const pointState = useDossierStore(state => state.pointStates[point.id] || 'locked');

    // Filter out hidden/system bindings that shouldn't appear in the menu
    const visibleActions = availableActions.filter(a => !!a.binding.label);

    return (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-auto md:top-4 md:w-80 bg-[#1a1612] border border-[#d4c5a3] text-[#d4c5a3] p-4 shadow-2xl z-50 font-serif">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-[#d4c5a3]/60 hover:text-[#d4c5a3]"
            >
                <X size={18} />
            </button>

            <div className="mb-4 pr-6">
                <h3 className="text-xl font-bold text-[#FFD700] uppercase tracking-wider">{point.title}</h3>
                <div className="text-xs text-[#d4c5a3]/60 mt-1 uppercase">{point.category.replace('_', ' ')} • {pointState}</div>
            </div>

            {point.description && (
                <div className="text-sm italic mb-4 border-l-2 border-[#d4c5a3]/30 pl-3 leading-relaxed opacity-90">
                    {point.description}
                </div>
            )}

            <div className="space-y-2">
                {canArrive && onConfirmArrive && (
                    <button
                        onClick={onConfirmArrive}
                        className="w-full py-2 px-3 bg-[#2a2520] hover:bg-[#3a3530] border border-[#FFD700]/30 text-[#FFD700] text-sm text-left transition-colors flex items-center justify-between group"
                    >
                        <span>📍 Arrive at location</span>
                    </button>
                )}

                {visibleActions.length === 0 && !canArrive && (
                    <div className="text-center py-4 text-[#d4c5a3]/40 text-sm">
                        No actions available.
                    </div>
                )}

                {visibleActions.map(({ binding, isAvailable, reason }) => (
                    <button
                        key={binding.id}
                        onClick={() => isAvailable && onExecuteAction(binding)}
                        disabled={!isAvailable}
                        className={cn(
                            "w-full py-2 px-3 border text-sm text-left transition-all flex items-center justify-between relative",
                            isAvailable
                                ? "bg-[#d4c5a3] text-[#1a1612] hover:bg-[#eaddc5] border-[#d4c5a3] font-bold shadow-md"
                                : "bg-transparent text-[#d4c5a3]/30 border-[#d4c5a3]/10 cursor-not-allowed"
                        )}
                    >
                        <span>{binding.label}</span>
                        {!isAvailable && reason && (
                            <span className="text-[10px] uppercase opacity-70 ml-2">Locked</span>
                        )}
                        {isAvailable && (
                            <span className="opacity-0 -ml-2 group-hover:opacity-100 transition-opacity">➤</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
