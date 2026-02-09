import { describe, expect, it } from 'vitest';
import { buildNotebookEntryId, resolveTooltipKeyword } from '../interactiveToken';

describe('interactiveToken helpers', () => {
    it('builds stable notebook ids for umlaut and sharp-s', () => {
        const id = buildNotebookEntryId('scenario_a', 'scene_1', 'große Halle');
        expect(id).toBe('scenario_a_scene_1_grosse_halle');
    });

    it('falls back to generic entry token when text is empty punctuation', () => {
        const id = buildNotebookEntryId('scenario_a', 'scene_1', ' ... ');
        expect(id).toBe('scenario_a_scene_1_entry');
    });

    it('prefers text keyword when tooltip exists', () => {
        const token = { text: 'Bankhaus J.A. Krebs', payload: 'logic' };
        const resolved = resolveTooltipKeyword(token, (key) => key === 'Bankhaus J.A. Krebs');
        expect(resolved).toBe('Bankhaus J.A. Krebs');
    });

    it('falls back to payload keyword when text has no tooltip', () => {
        const token = { text: 'Logic Success', payload: 'Insiderwissen' };
        const resolved = resolveTooltipKeyword(token, (key) => key === 'Insiderwissen');
        expect(resolved).toBe('Insiderwissen');
    });

    it('returns null when no tooltip key matches', () => {
        const token = { text: 'Unknown', payload: 'also_unknown' };
        const resolved = resolveTooltipKeyword(token, () => null);
        expect(resolved).toBeNull();
    });
});

