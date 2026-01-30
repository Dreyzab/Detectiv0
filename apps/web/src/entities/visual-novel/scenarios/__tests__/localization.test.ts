import { describe, it, expect, vi } from 'vitest';
import { mergeScenario } from '../../lib/localization';
import type { VNScenarioLogic, VNContentPack } from '../../model/types';

describe('Localization Merge Utility', () => {
    const mockLogic: VNScenarioLogic = {
        id: 'test_scenario',
        title: 'Test Title',
        defaultBackgroundUrl: 'bg.jpg',
        initialSceneId: 'start',
        scenes: {
            'start': {
                id: 'start',
                choices: [
                    { id: 'choice_1', nextSceneId: 'end' }
                ]
            }
        }
    };

    const mockContentEN: VNContentPack = {
        locale: 'en',
        scenes: {
            'start': {
                text: 'Hello English',
                choices: {
                    'choice_1': 'Next'
                }
            }
        }
    };

    const mockContentRU: VNContentPack = {
        locale: 'ru',
        scenes: {
            'start': {
                text: 'Привет Русский',
                choices: {
                    'choice_1': 'Далее'
                }
            }
        }
    };

    it('should merge logic and content correctly for a given locale', () => {
        const merged = mergeScenario(mockLogic, mockContentRU);
        expect(merged.id).toBe('test_scenario');
        expect(merged.scenes['start'].text).toBe('Привет Русский');
        expect(merged.scenes['start'].choices?.[0].text).toBe('Далее');
    });

    it('should fallback to fallbackContent if primary content is missing text', () => {
        const missingContent: VNContentPack = {
            locale: 'de',
            scenes: {
                'start': {
                    text: '', // Empty text
                    choices: {}
                }
            }
        };

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const merged = mergeScenario(mockLogic, missingContent, mockContentEN);

        expect(merged.scenes['start'].text).toBe('Hello English');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Missing body for scene 'start'"));
        consoleSpy.mockRestore();
    });

    it('should fallback for missing choices', () => {
        const missingChoices: VNContentPack = {
            locale: 'de',
            scenes: {
                'start': {
                    text: 'Hallo',
                    choices: {} // Missing choice_1
                }
            }
        };

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const merged = mergeScenario(mockLogic, missingChoices, mockContentEN);

        expect(merged.scenes['start'].choices?.[0].text).toBe('Next');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Missing choice 'choice_1'"));
        consoleSpy.mockRestore();
    });

    it('should return [MISSING] string if no fallback is available', () => {
        const emptyContent: VNContentPack = {
            locale: 'de',
            scenes: {}
        };

        const merged = mergeScenario(mockLogic, emptyContent);
        expect(merged.scenes['start'].text).toContain('MISSING TEXT');
        expect(merged.scenes['start'].choices?.[0].text).toContain('MISSING CHOICE');
    });
});
