import type { LocationAvailability, MapPoint, WorldClockState } from '@repo/shared';
import { cn } from '@/shared/lib/utils';
import { type ResolverOption, type MapPointBinding } from '@repo/shared';
import { VOICES, VOICE_GROUPS, type VoiceId } from '../../../features/detective/lib/parliament';
import { getMerchantAccessResult, getMerchantDefinition } from '@repo/shared/data/items';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useWorldEngineStore } from '@/features/detective/engine/store';
import { useMemo } from 'react';

type AlternativeApproach = 'lockpick' | 'bribe' | 'warrant';

interface CaseCardProps {
    point: MapPoint;
    actions: ResolverOption[];
    onExecute: (binding: MapPointBinding) => void | Promise<void>;
    onClose: () => void;
    worldClock?: WorldClockState;
    currentLocationId?: string | null;
    locationAvailability?: LocationAvailability;
    isBusy?: boolean;
    onAlternativeApproach?: (approach: AlternativeApproach) => void | Promise<void>;
}

export const CaseCard = ({
    point,
    actions,
    onExecute,
    onClose,
    worldClock,
    currentLocationId,
    locationAvailability,
    isBusy = false,
    onAlternativeApproach
}: CaseCardProps) => {
    const flags = useDossierStore((state) => state.flags);
    const factions = useWorldEngineStore((state) => state.factions);
    const factionReputation = useMemo<Record<string, number>>(
        () => Object.fromEntries(factions.map((entry) => [entry.factionId, entry.reputation])),
        [factions]
    );

    const mainOption = actions.find((opt) =>
        opt.enabled &&
        opt.binding.actions &&
        opt.binding.actions.length > 0 &&
        opt.binding.actions.some((action) => action.type !== 'open_trade')
    );
    const enterAction = mainOption ? mainOption.binding : null;
    const isClosed = Boolean(locationAvailability && !locationAvailability.open);
    const canExecute = Boolean(enterAction) && !isClosed && !isBusy;
    const tradeOptions = actions
        .map((option) => {
            const onlyTradeActions = option.binding.actions.every((action) => action.type === 'open_trade');
            if (!onlyTradeActions) {
                return null;
            }

            const tradeAction = option.binding.actions.find((action) => action.type === 'open_trade');
            if (!tradeAction || tradeAction.type !== 'open_trade') {
                return null;
            }

            const merchant = getMerchantDefinition(tradeAction.shopId);
            const access = getMerchantAccessResult(merchant, { flags, factionReputation });
            const isAvailable = option.enabled && access.unlocked && !isClosed && !isBusy;

            let reason: string | undefined;
            if (!option.enabled) {
                reason = 'Interaction conditions are not met yet.';
            } else if (isClosed) {
                reason = locationAvailability?.reason ?? 'Location is currently closed.';
            } else if (isBusy) {
                reason = 'Finish current travel sequence first.';
            } else if (!access.unlocked) {
                reason = access.reason;
            }

            return {
                option,
                merchant,
                isAvailable,
                reason
            };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const pointVoices = (point.data?.voices as Partial<Record<VoiceId, string>>) || {};
    const activeVoiceIds = Object.keys(pointVoices) as VoiceId[];
    const availableApproaches = (locationAvailability?.alternatives ?? []).filter(
        (approach): approach is AlternativeApproach =>
            approach === 'lockpick' || approach === 'bribe' || approach === 'warrant'
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="relative max-w-md w-full bg-[#f3e9d2] text-[#2c1810] shadow-2xl p-1 rounded-sm overflow-hidden"
                onClick={(event) => event.stopPropagation()}
                style={{
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                    backgroundImage: 'url("/images/paper-texture.png")'
                }}
            >
                <div className="border-[3px] border-double border-[#4a3b2a] h-full p-4 flex flex-col gap-4">
                    <div className="text-center border-b border-[#4a3b2a]/30 pb-2">
                        <h2
                            className={cn("text-3xl font-bold tracking-wide text-[#4a1a1a] font-serif")}
                            style={{ fontFamily: '"Arnold Bocklin", "UnifrakturMaguntia", serif' }}
                        >
                            {point.title}
                        </h2>
                        <div className="text-xs uppercase tracking-[0.2em] text-[#8c7b64] mt-1">{point.id}</div>
                        {worldClock && (
                            <div className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#6d5b48] font-mono">
                                {worldClock.phase} / tick {worldClock.tick}
                                {currentLocationId && ` / from ${currentLocationId}`}
                            </div>
                        )}
                    </div>

                    <div className="relative w-full h-40 bg-zinc-900 overflow-hidden shadow-inner border border-[#4a3b2a]/50">
                        <img
                            src={point.image || "/images/detective/location_placeholder.webp"}
                            alt={point.title}
                            className="w-full h-full object-cover opacity-80 sepia hover:sepia-0 transition-all duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex flex-col gap-3 py-2">
                        {activeVoiceIds.map((voiceId) => {
                            const voice = VOICES[voiceId];
                            const group = VOICE_GROUPS[voice.group];
                            const text = pointVoices[voiceId];
                            if (!text) return null;

                            return (
                                <div key={voiceId} className="flex gap-3 text-sm border-l-2 pl-3 italic" style={{ borderColor: `${group.color}66` }}>
                                    <span className="font-bold uppercase not-italic text-[10px] tracking-tighter opacity-70" style={{ color: group.color }}>
                                        {voice.name}:
                                    </span>
                                    <span className="text-[#3d2b1f]">"{text}"</span>
                                </div>
                            );
                        })}

                        {activeVoiceIds.length === 0 && (
                            <p className="text-sm italic text-[#5c4d3c]">{point.description}</p>
                        )}
                    </div>

                    <div className="mt-auto grid grid-cols-1 gap-2 pt-4 border-t border-[#4a3b2a]/30">
                        {enterAction ? (
                            <button
                                onClick={() => void onExecute(enterAction)}
                                disabled={!canExecute}
                                className={cn(
                                    "w-full py-3 font-serif font-bold text-lg uppercase tracking-wider transition-colors relative overflow-hidden group shadow-md",
                                    canExecute
                                        ? "bg-[#4a1a1a] text-[#f3e9d2] hover:bg-[#6b2a2a]"
                                        : "bg-[#7d6d5f] text-[#f3e9d2]/70 cursor-not-allowed"
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <span>*</span>
                                    {isBusy ? 'Traveling...' : (isClosed ? 'Location Closed' : (enterAction.label || 'Investigate'))}
                                    <span>*</span>
                                </span>
                            </button>
                        ) : (
                            <div className="text-center text-xs text-amber-900/50 py-2">No primary interaction available</div>
                        )}

                        {tradeOptions.length > 0 && (
                            <div className="grid grid-cols-1 gap-2">
                                {tradeOptions.map((trade) => (
                                    <div key={trade.option.binding.id} className="space-y-1">
                                        <button
                                            onClick={() => void onExecute(trade.option.binding)}
                                            disabled={!trade.isAvailable}
                                            className={cn(
                                                "w-full py-2 font-serif font-bold text-xs uppercase tracking-wider transition-colors border",
                                                trade.isAvailable
                                                    ? "bg-[#2e3f28] text-[#f3e9d2] border-[#5d7d50] hover:bg-[#3e5635]"
                                                    : "bg-[#6f655a] text-[#f3e9d2]/70 border-[#8d8376] cursor-not-allowed"
                                            )}
                                        >
                                            <span className="flex items-center justify-between gap-2 px-3">
                                                <span>{trade.option.binding.label ?? `Trade: ${trade.merchant.name}`}</span>
                                                <span
                                                    className={cn(
                                                        "rounded px-2 py-0.5 text-[10px]",
                                                        trade.isAvailable
                                                            ? "bg-emerald-900/50 text-emerald-100"
                                                            : "bg-red-900/50 text-red-100"
                                                    )}
                                                >
                                                    {trade.isAvailable ? 'Available' : 'Locked'}
                                                </span>
                                            </span>
                                        </button>
                                        {!trade.isAvailable && trade.reason && (
                                            <div className="px-2 text-[10px] text-[#6c1b1b] bg-[#f6e3d8] border border-[#8b2f2f]/30">
                                                {trade.reason}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {isClosed && locationAvailability && (
                            <div className="text-xs border border-[#8b2f2f]/40 bg-[#f6e3d8] text-[#6c1b1b] px-3 py-2 leading-relaxed">
                                <div className="font-bold uppercase tracking-wider">Unavailable</div>
                                <div>{locationAvailability.reason ?? 'This location is currently closed.'}</div>
                                {availableApproaches.length > 0 && (
                                    <div className="mt-2">
                                        <div className="mb-1 uppercase tracking-wider">Alternative entry:</div>
                                        <div className="grid grid-cols-3 gap-1">
                                            {availableApproaches.map((approach) => (
                                                <button
                                                    key={approach}
                                                    onClick={() => void onAlternativeApproach?.(approach)}
                                                    disabled={!onAlternativeApproach || isBusy}
                                                    className={cn(
                                                        "px-2 py-1 border uppercase tracking-wide",
                                                        onAlternativeApproach && !isBusy
                                                            ? "border-[#6c1b1b]/40 bg-[#fbe9df] hover:bg-[#f7d8ca]"
                                                            : "border-[#6c1b1b]/20 bg-[#f8eade] opacity-60 cursor-not-allowed"
                                                    )}
                                                >
                                                    {approach}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
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
