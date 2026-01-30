
import type { MapPoint } from '@repo/shared';
import { cn } from '@/shared/lib/utils';
import { type ResolverOption, type MapPointBinding } from '@repo/shared';
import { VOICES, VOICE_GROUPS, type VoiceId } from '../../../features/detective/lib/parliament';

interface CaseCardProps {
    point: MapPoint;
    actions: ResolverOption[];
    onExecute: (binding: MapPointBinding) => void;
    onClose: () => void;
}

export const CaseCard = ({ point, actions, onExecute, onClose }: CaseCardProps) => {
    // Determine main action (e.g. Enter) logic
    const enterAction = actions.find(a => {
        const binding = a as unknown as MapPointBinding;
        // Allow ANY action to trigger the button. 
        // If it's a VN/Battle, we act normally. If it's just 'grant_evidence', we 'Investigate'.
        return binding.actions && binding.actions.length > 0;
    });

    // Parliament of Voices rendering
    const pointVoices = (point.data?.voices as Partial<Record<VoiceId, string>>) || {};
    const activeVoiceIds = Object.keys(pointVoices) as VoiceId[];

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
                        <div className="text-xs uppercase tracking-[0.2em] text-[#8c7b64] mt-1">{point.id}</div>
                    </div>

                    {/* Image / Visual */}
                    <div className="relative w-full h-40 bg-zinc-900 overflow-hidden shadow-inner border border-[#4a3b2a]/50">
                        <img
                            src={point.image || "/images/detective/location_placeholder.png"}
                            alt={point.title}
                            className="w-full h-full object-cover opacity-80 sepia hover:sepia-0 transition-all duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Parliament of Voices Section */}
                    <div className="flex flex-col gap-3 py-2">
                        {activeVoiceIds.map(vId => {
                            const voice = VOICES[vId];
                            const group = VOICE_GROUPS[voice.group];
                            const text = pointVoices[vId];

                            if (!text) return null;

                            return (
                                <div key={vId} className="flex gap-3 text-sm border-l-2 pl-3 italic" style={{ borderColor: group.color + '66' }}>
                                    <span className="font-bold uppercase not-italic text-[10px] tracking-tighter opacity-70" style={{ color: group.color }}>
                                        {voice.name}:
                                    </span>
                                    <span className="text-[#3d2b1f]">❝{text}❞</span>
                                </div>
                            );
                        })}

                        {/* Fallback description if no voices */}
                        {activeVoiceIds.length === 0 && (
                            <p className="text-sm italic text-[#5c4d3c]">{point.description}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-1 gap-2 pt-4 border-t border-[#4a3b2a]/30">
                        {enterAction ? (
                            <button
                                onClick={() => onExecute(enterAction as unknown as MapPointBinding)}
                                className="w-full py-3 bg-[#4a1a1a] text-[#f3e9d2] font-serif font-bold text-lg uppercase tracking-wider hover:bg-[#6b2a2a] transition-colors relative overflow-hidden group shadow-md"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <span>♠</span> {(enterAction as unknown as MapPointBinding).label || "Investigate"} <span>♠</span>
                                </span>
                            </button>
                        ) : (
                            <div className="text-center text-xs text-amber-900/50 py-2">No interaction available</div>
                        )}

                        <div className="flex gap-2">
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
