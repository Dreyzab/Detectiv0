/**
 * Procedural sound synthesis for battle effects
 * Uses Web Audio API - no external audio files needed
 */

type SoundType = 'damage' | 'block' | 'heal' | 'buff';

export const playSynthSound = (type: SoundType) => {
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
        // "The Impact" - A low, dull thud like a heavy book slamming shut
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
        // "The Deflect" - A sharp mechanical click like a typewriter key
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
        // "Composure" - A warm, subtle swell. Calm and jazzy
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        osc.frequency.setValueAtTime(146.83, now); // D3

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);

        osc.start(now);
        osc.stop(now + 1.0);

    } else if (type === 'buff') {
        // "The Clue" - A mysterious high shimmer
        osc.type = 'triangle';
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, now);

        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.linearRampToValueAtTime(1760, now + 0.2); // A6

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.5);
    }
};
