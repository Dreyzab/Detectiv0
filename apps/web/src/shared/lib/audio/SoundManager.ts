/**
 * SoundManager
 * Singleton service for handling application audio.
 * - Procedural "Typewriter" SFX using Web Audio API (no assets needed).
 * - Ambient Music / SFX tracks.
 * - Global volume control.
 */

class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private ambientTrack: HTMLAudioElement | null = null;
    private currentAmbientUrl: string | null = null;

    private _sfxVolume = 0.5;
    private _musicVolume = 0.3;

    constructor() {
        // Lazy init on first user interaction to handle autoplay policies
    }

    private init() {
        if (this.ctx) return;

        try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);

            // Resume if suspended (browser policy)
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    /**
     * Call this on first user interaction (e.g. Start Game click)
     */
    public ensureAudioContext() {
        this.init();
        if (this.ctx?.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * PRODECURAL SFX: Typewriter Keypress
     * Synthesizes a mechanical click sound using filtered noise + oscillator.
     */
    public playTypewriterClick() {
        if (!this.ctx || !this.masterGain) return;

        const t = this.ctx.currentTime;
        const gain = this.ctx.createGain();
        gain.connect(this.masterGain);
        gain.gain.value = this._sfxVolume;

        // 1. "Thud" - Low frequency impact (Mechanical body)
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(10, t + 0.05);
        osc.connect(gain);

        osc.start(t);
        osc.stop(t + 0.05);

        // 2. "Click" - High frequency noise burst (Hammer hit)
        // Creating noise buffer
        const bufferSize = this.ctx.sampleRate * 0.05; // 50ms
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Filter the noise to sound closer to metal/plastic
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, t);

        noise.connect(filter);
        filter.connect(gain);

        // Envelope for impact
        gain.gain.setValueAtTime(this._sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        noise.start(t);
    }

    /**
     * PROCEDURAL SFX: Soft notification chime for clues
     */
    public playClueFound() {
        if (!this.ctx || !this.masterGain) return;
        const t = this.ctx.currentTime;
        const gain = this.ctx.createGain();
        gain.connect(this.masterGain);
        gain.gain.value = this._sfxVolume * 0.8;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        // E5 -> B5 arpeggio
        osc.frequency.setValueAtTime(659.25, t); // E5
        osc.frequency.setValueAtTime(987.77, t + 0.1); // B5

        osc.connect(gain);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(1, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

        osc.start(t);
        osc.stop(t + 0.6);
    }

    /**
     * Play ambient music/soundscape from URL.
     * Handles cross-fading if track changes.
     */
    public playAmbient(url: string) {
        if (this.currentAmbientUrl === url) return;

        // Fade out existing
        if (this.ambientTrack) {
            const oldTrack = this.ambientTrack;
            this.fadeOut(oldTrack, () => {
                oldTrack.pause();
                oldTrack.remove();
            });
        }

        if (!url) {
            this.currentAmbientUrl = null;
            this.ambientTrack = null;
            return;
        }

        this.currentAmbientUrl = url;
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0; // Start silent for fade in
        audio.play().then(() => {
            this.fadeIn(audio);
        }).catch(e => {
            console.warn('Auto-play blocked or source missing:', e);
        });

        this.ambientTrack = audio;
    }

    private fadeOut(audio: HTMLAudioElement, onComplete: () => void) {
        let vol = audio.volume;
        const fade = setInterval(() => {
            vol = Math.max(0, vol - 0.05);
            audio.volume = vol;
            if (vol <= 0) {
                clearInterval(fade);
                onComplete();
            }
        }, 100);
    }

    private fadeIn(audio: HTMLAudioElement) {
        let vol = 0;
        const target = this._musicVolume;
        const fade = setInterval(() => {
            vol = Math.min(target, vol + 0.05);
            audio.volume = vol;
            if (vol >= target) {
                clearInterval(fade);
            }
        }, 100);
    }
}

export const soundManager = new SoundManager();
