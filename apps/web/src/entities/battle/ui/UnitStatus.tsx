import React from 'react';
import { type BattleEntity } from '@repo/shared';
import { Shield, Skull, Activity } from 'lucide-react';

interface UnitStatusProps {
    entity: BattleEntity;
    isOpponent?: boolean;
    intention?: string | null;
}

export const UnitStatus: React.FC<UnitStatusProps> = ({ entity, isOpponent = false, intention }) => {
    const resolvePercent = (entity.currentResolve / entity.maxResolve) * 100;

    return (
        <div className={`flex items-center gap-4 ${isOpponent ? 'flex-row-reverse text-right' : 'flex-row'}`}>

            {/* Avatar */}
            <div className="relative">
                <div className={`w-24 h-24 rounded-full border-4 overflow-hidden bg-slate-800 ${isOpponent ? 'border-red-500/50' : 'border-blue-500/50'}`}>
                    {entity.avatar ? (
                        <img src={entity.avatar} alt={entity.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Skull size={40} />
                        </div>
                    )}
                </div>
                {/* Block Badge */}
                {entity.block > 0 && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-800 border-2 border-cyan-400 rounded-full flex items-center justify-center text-cyan-400 font-bold z-10 shadow-lg animate-pulse">
                        <Shield size={16} className="absolute opacity-20" />
                        {entity.block}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={`flex flex-col ${isOpponent ? 'items-end' : 'items-start'}`}>
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest">{entity.name}</h2>

                {/* Planning indicator */}
                {intention && isOpponent && (
                    <div className="flex items-center gap-1 text-yellow-500 animate-pulse bg-yellow-500/10 px-2 py-0.5 rounded text-sm">
                        <Activity size={14} />
                        <span>Planning Action</span>
                    </div>
                )}

                {/* Resolve Bar */}
                <div className="mt-2 w-64 h-6 bg-slate-900 rounded-full border border-slate-700 relative overflow-hidden">
                    <div
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${isOpponent ? 'bg-red-600' : 'bg-blue-500'}`}
                        style={{ width: `${resolvePercent}%` }}
                    />
                    {/* Gloss Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />

                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md z-10">
                        {entity.currentResolve} / {entity.maxResolve} RESOLVE
                    </div>
                </div>
            </div>
        </div>
    );
};
