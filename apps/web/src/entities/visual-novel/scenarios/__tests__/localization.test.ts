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

        // Suppress warning for test
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const merged = mergeScenario(mockLogic, emptyContent);
        consoleSpy.mockRestore();

        expect(merged.scenes['start'].text).toContain('MISSING TEXT');
        expect(merged.scenes['start'].choices?.[0].text).toContain('MISSING CHOICE');
    });

    it('should merge localized passive checks correctly', () => {
        const logicWithPassive: VNScenarioLogic = {
            ...mockLogic,
            scenes: {
                'start': {
                    id: 'start',
                    passiveChecks: [
                        {
                            id: 'chk_test',
                            passiveText: 'Original English Passive',
                            passiveFailText: 'Original English Fail',
                            difficulty: 10,
                            voiceId: 'logic',
                            isPassive: true
                        }
                    ],
                    choices: []
                }
            }
        };

        const contentWithPassiveRU: VNContentPack = {
            locale: 'ru',
            scenes: {
                'start': {
                    text: 'Текст сцены',
                    passiveChecks: {
                        'chk_test': {
                            passiveText: 'Пассивный Текст',
                            passiveFailText: 'Пассивный Провал'
                        }
                    }
                }
            }
        };

        const merged = mergeScenario(logicWithPassive, contentWithPassiveRU);

        expect(merged.scenes['start'].passiveChecks?.[0].passiveText).toBe('Пассивный Текст');
        expect(merged.scenes['start'].passiveChecks?.[0].passiveFailText).toBe('Пассивный Провал');
    });

    it('should fallback for missing passive check translations', () => {
        const logicWithPassive: VNScenarioLogic = {
            ...mockLogic,
            scenes: {
                'start': {
                    id: 'start',
                    passiveChecks: [
                        {
                            id: 'chk_test',
                            passiveText: 'Original English Passive',
                            passiveFailText: 'Original English Fail',
                            difficulty: 10,
                            voiceId: 'logic',
                            isPassive: true
                        }
                    ],
                    choices: []
                }
            }
        };

        const contentPartialRU: VNContentPack = {
            locale: 'ru',
            scenes: {
                'start': {
                    text: 'Текст сцены',
                    // No passiveChecks defined
                }
            }
        };

        // Mock fallback content
        const fallbackContent: VNContentPack = {
            locale: 'en',
            scenes: {
                'start': {
                    text: 'Scene Text',
                    passiveChecks: {
                        'chk_test': {
                            passiveText: 'Fallback Passive',
                            passiveFailText: 'Fallback Fail'
                        }
                    }
                }
            }
        };

        const merged = mergeScenario(logicWithPassive, contentPartialRU, fallbackContent);

        expect(merged.scenes['start'].passiveChecks?.[0].passiveText).toBe('Fallback Passive');
    });
});
