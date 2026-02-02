import React, { useEffect } from 'react';
import { type VisualEvent } from '@repo/shared';

// Inline sound synthesis to avoid import issues
const playSynthSound = (type: VisualEvent['type']) => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'damage') {
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'block') {
        osc.type = 'square';
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'heal') {
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(146.83, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);
        osc.start(now);
        osc.stop(now + 1.0);
    } else if (type === 'buff') {
        osc.type = 'triangle';
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, now);
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1760, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.5);
    }
};

interface FloatingTextProps {
    event: VisualEvent;
    onComplete: () => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ event, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1200);
        playSynthSound(event.type);
        return () => clearTimeout(timer);
    }, [event, onComplete]);

    let color = 'text-white';
    let icon = '';

    if (event.type === 'damage') { color = 'text-red-500'; icon = '-'; }
    if (event.type === 'heal') { color = 'text-green-400'; icon = '+'; }
    if (event.type === 'block') { color = 'text-blue-400'; icon = ''; }
    if (event.type === 'buff') { color = 'text-yellow-400'; icon = ''; }

    const isOpponent = event.target === 'opponent';

    const style: React.CSSProperties = isOpponent
        ? { top: '30%', right: '25%' }
        : { bottom: '35%', left: '25%' };

    return (
        <div
            className={`absolute z-50 pointer-events-none font-bold text-4xl drop-shadow-lg ${color} animate-float-up`}
            style={style}
        >
            {icon}{event.value}
        </div>
    );
};
