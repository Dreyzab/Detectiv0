
import { cn } from '@/shared/lib/utils';
import { type ResolverOption, type MapPointBinding, type MapPoint } from '@repo/shared';
// Legacy imports for Parliament of Voices - we kept the data structure
import { VOICES, VOICE_GROUPS, type VoiceId } from '@/features/detective/lib/parliament';

interface MapPointCardProps {
    point: MapPoint;
    actions: ResolverOption[];
    onExecute: (binding: MapPointBinding) => void;
    onClose: () => void;
}

export const MapPointCard = ({ point, actions, onExecute, onClose }: MapPointCardProps) => {

    // Extract voices if present (Legacy support via data field)
    const pointVoices = (point.data?.voices || {}) as Partial<Record<VoiceId, string>>;
    const activeVoiceIds = Object.keys(pointVoices) as VoiceId[];

    // Filter enabled actions
    const enabledActions = actions.filter(a => a.enabled);
    const disabledActions = actions.filter(a => !a.enabled);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="relative max-w-md w-full bg-[#f3e9d2] text-[#2c1810] shadow-2xl p-1 rounded-sm overflow-hidden"
                onClick={e => e.stopPropagation()}
                style={{
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                    backgroundImage: 'url("/images/paper-texture.png")'
                }}
            >
                {/* Vintage Border Frame */}
                <div className="border-[3px] border-double border-[#4a3b2a] h-full p-4 flex flex-col gap-4">

                    {/* Header */}
                    <div className="text-center border-b border-[#4a3b2a]/30 pb-2">
                        <h2 className={cn(
                            "text-3xl font-bold tracking-wide text-[#4a1a1a] font-serif"
                        )} style={{ fontFamily: '"Arnold Böcklin", "UnifrakturMaguntia", serif' }}>
                            {point.title}
                        </h2>
                        {/* Show category as subtle subtitle */}
                        <div className="text-xs uppercase tracking-[0.2em] text-[#8c7b64] mt-1">{point.category} :: {point.id}</div>
                    </div>

                    {/* Image / Visual */}
                    <div className="relative w-full h-40 bg-zinc-900 overflow-hidden shadow-inner border border-[#4a3b2a]/50">
                        <img
                            src={(point.data?.image as string) || (point as { image?: string }).image || "/images/detective/location_placeholder.webp"} // Fallback to root image if legacy
                            alt={point.title}
                            className="w-full h-full object-cover opacity-80 sepia hover:sepia-0 transition-all duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Parliament of Voices Section */}
                    {activeVoiceIds.length > 0 ? (
                        <div className="flex flex-col gap-3 py-2">
                            {activeVoiceIds.map(vId => {
                                const voice = VOICES[vId];
                                const group = VOICE_GROUPS[voice?.group];
                                const text = pointVoices[vId];

                                if (!text || !voice || !group) return null;

                                return (
                                    <div key={vId} className="flex gap-3 text-sm border-l-2 pl-3 italic" style={{ borderColor: group.color + '66' }}>
                                        <span className="font-bold uppercase not-italic text-[10px] tracking-tighter opacity-70" style={{ color: group.color }}>
                                            {voice.name}:
                                        </span>
                                        <span className="text-[#3d2b1f]">❝{text}❞</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Description if no voices
                        point.description ? (
                            <div className="py-2">
                                <p className="text-sm italic text-[#5c4d3c]">{point.description}</p>
                            </div>
                        ) : null
                    )}

                    {/* Actions List */}
                    <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-[#4a3b2a]/30">
                        {enabledActions.length > 0 ? (
                            enabledActions.map((opt, idx) => (
                                <button
                                    key={opt.binding.id || idx}
                                    onClick={() => onExecute(opt.binding)}
                                    className="w-full py-3 bg-[#4a1a1a] text-[#f3e9d2] font-serif font-bold text-lg uppercase tracking-wider hover:bg-[#6b2a2a] transition-colors relative overflow-hidden group shadow-md"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <span>♠</span> {opt.binding.label || "Interact"} <span>♠</span>
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="text-center text-xs text-amber-900/50 py-2">No actions available</div>
                        )}

                        {/* Debug/Disabled Actions */}
                        {disabledActions.length > 0 && (
                            <div className="text-[10px] text-center opacity-50">
                                {disabledActions.length} locked options
                            </div>
                        )}

                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 py-1 text-xs border border-[#4a3b2a]/30 hover:bg-[#4a3b2a]/5 font-mono uppercase">
                                Scan (AR)
                            </button>
                            <button className="flex-1 py-1 text-xs border border-[#4a3b2a]/30 hover:bg-[#4a3b2a]/5 font-mono uppercase opacity-50 cursor-not-allowed" title="Protocol Trinity Required">
                                Hack
                            </button>
                        </div>
                    </div>
                </div>

                {/* Close Button X */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#4a3b2a] hover:text-red-700 text-xl leading-none"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};
