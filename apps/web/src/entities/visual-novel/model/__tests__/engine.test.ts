import { describe, it, expect } from 'bun:test';
import { mergeScenario } from '../../lib/localization';
import { filterAvailableChoices } from '../../lib/runtime';
import type { VNScenarioLogic, VNContentPack, VNChoice, VNConditionContext } from '../types';

describe('VN Engine', () => {
    describe('condition context', () => {
        const makeContext = (stage: string): VNConditionContext => {
            const ordered = ['not_started', 'briefing', 'bank_investigation', 'leads_open', 'leads_done', 'finale', 'resolved'];
            return {
                evidenceIds: new Set<string>(),
                hasEvidence: () => false,
                questStages: { case01: stage },
                isQuestAtStage: (questId, targetStage) => questId === 'case01' && stage === targetStage,
                isQuestPastStage: (questId, targetStage) => {
                    if (questId !== 'case01') return false;
                    return ordered.indexOf(stage) >= ordered.indexOf(targetStage);
                }
            };
        };

        it('evaluates isQuestAtStage in choice conditions', () => {
            const choices: VNChoice[] = [
                {
                    id: 'allowed_at_briefing',
                    text: 'Allowed at briefing',
                    nextSceneId: 'next',
                    condition: (_flags, context) => context?.isQuestAtStage('case01', 'briefing') ?? false
                },
                {
                    id: 'blocked_at_briefing',
                    text: 'Blocked at briefing',
                    nextSceneId: 'next',
                    condition: (_flags, context) => context?.isQuestAtStage('case01', 'finale') ?? false
                }
            ];

            const filtered = filterAvailableChoices(choices, {}, makeContext('briefing')) ?? [];
            expect(filtered.map(choice => choice.id)).toEqual(['allowed_at_briefing']);
        });

        it('evaluates isQuestPastStage in choice conditions', () => {
            const choices: VNChoice[] = [
                {
                    id: 'past_briefing',
                    text: 'Past briefing',
                    nextSceneId: 'next',
                    condition: (_flags, context) => context?.isQuestPastStage('case01', 'briefing') ?? false
                },
                {
                    id: 'past_finale',
                    text: 'Past finale',
                    nextSceneId: 'next',
                    condition: (_flags, context) => context?.isQuestPastStage('case01', 'finale') ?? false
                }
            ];

            const filtered = filterAvailableChoices(choices, {}, makeContext('bank_investigation')) ?? [];
            expect(filtered.map(choice => choice.id)).toEqual(['past_briefing']);
        });
    });

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
                    preconditions: [
                        (flags: Record<string, boolean>) => flags['test_flag']
                    ],
                    passiveChecks: [
                        {
                            id: 'chk_test_passive',
                            voiceId: 'logic',
                            difficulty: 10,
                            isPassive: true,
                            passiveText: 'It clicks.',
                            passiveFailText: 'Nothing yet.'
                        }
                    ],
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
        } as unknown as VNScenarioLogic; // Partial mock

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
            expect(result.scenes['scene_1']?.text).toBe('Localized Text');
            expect(result.scenes['scene_2']?.text).toBe('Localized Text 2');

            const choices = result.scenes['scene_1']?.choices;
            expect(choices).toBeDefined();
            expect(choices?.[0]?.text).toBe('Localized Choice 1');
            expect(choices?.[1]?.text).toBe('Localized Choice 2');
            expect(result.scenes['scene_1']?.preconditions?.length).toBe(1);
            expect(result.scenes['scene_1']?.passiveChecks?.[0]?.passiveFailText).toBe('Nothing yet.');
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    'scene_2': { text: undefined } as any
                }
            };

            const fallbackContent: VNContentPack = mockContent;

            const result = mergeScenario(mockLogic, partialContent, fallbackContent);

            expect(result.scenes['scene_1']?.text).toBe('German Text');
            // Falling back to EN choices
            expect(result.scenes['scene_1']?.choices?.[0]?.text).toBe('Localized Choice 1');

            // Falling back to EN text for scene 2
            expect(result.scenes['scene_2']?.text).toBe('Localized Text 2');
        });

        it('should output missing keys logic if no fallback provided', () => {
            const emptyContent: VNContentPack = {
                locale: 'fr',
                scenes: {}
            };

            const result = mergeScenario(mockLogic, emptyContent);

            expect(result.scenes['scene_1']?.text).toContain('[MISSING TEXT: scene_1]');
        });
    });
});
