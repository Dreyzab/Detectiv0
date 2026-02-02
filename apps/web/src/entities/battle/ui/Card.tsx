import React from 'react';
import { type CardDefinition, type CardEffect, ATTRIBUTE_GROUP_COLORS } from '@repo/shared';
import { Zap, Shield, Heart, Layers, ArrowRight } from 'lucide-react';

interface CardProps {
    card: CardDefinition;
    onClick?: () => void;
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
    disabled?: boolean;
    isPlayable?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const EffectIcon: React.FC<{ effect: CardEffect }> = ({ effect }) => {
    switch (effect.type) {
        case 'damage': return <Zap size={14} className="mr-1" />;
        case 'block': return <Shield size={14} className="mr-1" />;
        case 'heal': return <Heart size={14} className="mr-1" />;
        case 'draw': return <Layers size={14} className="mr-1" />;
        default: return <ArrowRight size={14} className="mr-1" />;
    }
};

export const Card: React.FC<CardProps> = ({
    card,
    onClick,
    onPointerDown,
    disabled,
    isPlayable = true,
    style,
    className = ''
}) => {
    const groupColor = ATTRIBUTE_GROUP_COLORS[card.group];
    const groupColorBg = `${groupColor}20`;

    return (
        <div
            onPointerDown={!disabled && isPlayable ? onPointerDown : undefined}
            onClick={!disabled && isPlayable ? onClick : undefined}
            style={{
                ...style,
                borderColor: groupColor,
                color: groupColor
            }}
            className={`
                relative w-40 h-56 rounded-xl border-2 transition-all duration-200
                flex flex-col select-none touch-none
                ${!disabled && isPlayable ? 'cursor-grab active:cursor-grabbing bg-slate-900' : 'opacity-50 cursor-not-allowed bg-slate-950 grayscale'}
                ${disabled ? 'opacity-40' : ''}
                ${!disabled && isPlayable && !style?.position ? 'hover:-translate-y-4 hover:shadow-lg hover:z-10' : ''}
                ${className}
            `}
        >
            {/* Header */}
            <div
                className="h-8 w-full rounded-t-lg flex items-center justify-between px-2 border-b"
                style={{ backgroundColor: groupColorBg, borderColor: groupColor }}
            >
                <span className="text-[10px] uppercase font-bold tracking-wider">{card.group}</span>
                <div
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border text-sm font-bold"
                    style={{ borderColor: groupColor }}
                >
                    {card.cost}
                </div>
            </div>

            {/* Image Placeholder */}
            <div className="h-24 w-full bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
                <div className="w-full h-full opacity-30" style={{ backgroundColor: groupColorBg }} />
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col items-center text-center">
                <h3 className="font-bold text-sm leading-tight mb-2 text-white">{card.name}</h3>
                <p className="text-xs text-slate-400 leading-snug">
                    {card.description}
                </p>
            </div>

            {/* Footer Tags */}
            <div className="p-2 flex justify-center gap-1 border-t border-slate-800">
                {card.effects.map((ef, i) => (
                    <div key={i} className="flex items-center text-xs opacity-70" title={ef.type}>
                        <EffectIcon effect={ef} />
                        {ef.value > 0 && <span>{ef.value}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};
