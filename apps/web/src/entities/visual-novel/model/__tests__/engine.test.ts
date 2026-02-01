import { describe, it, expect } from 'bun:test';
import { mergeScenario } from '../../lib/localization';
import type { VNScenarioLogic, VNContentPack } from '../types';

describe('VN Engine', () => {
    describe('mergeScenario', () => {
        const mockLogic: VNScenarioLogic = {
            id: 'test_scenario',
            title: 'Test Scenario',
            defaultBackgroundUrl: 'http://example.com/bg.jpg',
            initialSceneId: 'scene_1',
            scenes: {
                'scene_1': {
                    id: 'scene_1',
                    text: 'Logic Text (Should be overwritten)',
                    choices: [
                        { id: 'choice_1', nextSceneId: 'scene_2', text: 'Logic Choice 1' },
                        { id: 'choice_2', nextSceneId: 'scene_3', text: 'Logic Choice 2' }
                    ]
                },
                'scene_2': {
                    id: 'scene_2',
                    text: 'Logic Text 2'
                }
            }
        } as any; // Using any for partial mock of complex logic type if needed

        const mockContent: VNContentPack = {
            locale: 'en',
            scenes: {
                'scene_1': {
                    text: 'Localized Text',
                    choices: {
                        'choice_1': 'Localized Choice 1',
                        'choice_2': 'Localized Choice 2'
                    }
                },
                'scene_2': {
                    text: 'Localized Text 2'
                }
            }
        };

        it('should merge content into logic correctly', () => {
            const result = mergeScenario(mockLogic, mockContent);

            expect(result.id).toBe('test_scenario');
            expect(result.scenes['scene_1'].text).toBe('Localized Text');
            expect(result.scenes['scene_2'].text).toBe('Localized Text 2');

            const choices = result.scenes['scene_1'].choices;
            expect(choices).toBeDefined();
            expect(choices![0].text).toBe('Localized Choice 1');
            expect(choices![1].text).toBe('Localized Choice 2');
        });

        it('should handle missing content with fallbacks', () => {
            const partialContent: VNContentPack = {
                locale: 'de',
                scenes: {
                    'scene_1': {
                        text: 'German Text'
                        // Missing choices map
                    },
                    // Missing scene_2 entirely
                    'scene_2': { text: undefined } as any
                }
            };

            const fallbackContent: VNContentPack = mockContent;

            const result = mergeScenario(mockLogic, partialContent, fallbackContent);

            expect(result.scenes['scene_1'].text).toBe('German Text');
            // Falling back to EN choices
            expect(result.scenes['scene_1'].choices![0].text).toBe('Localized Choice 1');

            // Falling back to EN text for scene 2
            expect(result.scenes['scene_2'].text).toBe('Localized Text 2');
        });

        it('should output missing keys logic if no fallback provided', () => {
            const emptyContent: VNContentPack = {
                locale: 'fr',
                scenes: {}
            };

            const result = mergeScenario(mockLogic, emptyContent);

            expect(result.scenes['scene_1'].text).toContain('[MISSING TEXT: scene_1]');
        });
    });
});
