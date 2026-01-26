
import type { ResolverOption } from '@repo/shared';
import { Button } from '@/shared/ui/Button';

interface InteractionWindowProps {
    options: ResolverOption[];
    onSelect: (option: ResolverOption) => void;
    onClose: () => void;
    title?: string;
}

export const InteractionWindow = ({ options, onSelect, onClose, title }: InteractionWindowProps) => {
    if (options.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#1a1612] border-2 border-[#d4c5a3] rounded-lg shadow-2xl w-full max-w-md flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="bg-[#2a241e] p-3 border-b border-[#d4c5a3]/30 flex justify-between items-center">
                    <h3 className="text-[#d4c5a3] font-serif font-bold text-lg">
                        {title || 'Available Actions'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#8c7b6c] hover:text-[#d4c5a3] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex flex-col">
                            <Button
                                disabled={!opt.enabled}
                                onClick={() => onSelect(opt)}
                                className={`
                                    w-full justify-start text-left font-serif p-3
                                    ${opt.enabled
                                        ? 'bg-[#2a241e] hover:bg-[#3d342b] border-[#d4c5a3]/20'
                                        : 'bg-[#15120f] border-transparent text-gray-600 cursor-not-allowed opacity-50'
                                    }
                                `}
                            >
                                <span className={opt.enabled ? 'text-[#d4c5a3]' : 'text-gray-500'}>
                                    {opt.binding.label || 'Unknown Action'}
                                </span>
                            </Button>
                            {!opt.enabled && opt.disabledReason && (
                                <span className="text-xs text-red-900/70 ml-2 mt-1 italic">
                                    🔒 {opt.disabledReason}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
