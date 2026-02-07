import { describe, expect, it } from 'bun:test';
import { buildPsycheProfile, type PsycheProfileInput } from './psycheProfile';

const baseInput = (): PsycheProfileInput => ({
    flags: {},
    factions: [],
    checkStates: {},
    traits: [],
    questStages: {},
    relationships: {}
});

describe('buildPsycheProfile', () => {
    it('unlocks tunnel-network knowledge by underworld contact flag', () => {
        const profile = buildPsycheProfile({
            ...baseInput(),
            flags: { underworld_contact: true }
        });

        const entry = profile.secrets.find((secret) => secret.id === 'knowledge_tunnel_network');
        expect(entry?.unlocked).toBe(true);
    });

    it('resolves civic-order alignment when police reputation dominates', () => {
        const profile = buildPsycheProfile({
            ...baseInput(),
            factions: [
                { factionId: 'fct_police', reputation: 4 },
                { factionId: 'fct_underworld', reputation: 0 },
                { factionId: 'fct_bankers', reputation: 1 }
            ]
        });

        expect(profile.alignment.tier).toBe('civic_order');
    });

    it('advances companion evolution by relationship thresholds and flags', () => {
        const profile = buildPsycheProfile({
            ...baseInput(),
            flags: { victoria_quest_complete: true },
            relationships: { assistant: 52 }
        });

        const track = profile.evolutionTracks.find((item) => item.id === 'track_assistant');
        expect(track?.stage).toBe('Vigilante');
        expect(track?.progressPercent).toBe(100);
    });
});
