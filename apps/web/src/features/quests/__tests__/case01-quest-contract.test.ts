import { describe, expect, it } from 'vitest';
import { CASE_01_ACT_1_LOGIC } from '../case01_act1.logic';

const findTransition = (from: string, to: string) =>
    CASE_01_ACT_1_LOGIC.stageTransitions?.find((transition) =>
        transition.from === from && transition.to === to
    );

const findObjective = (id: string) =>
    CASE_01_ACT_1_LOGIC.objectives.find((objective) => objective.id === id);

describe('Case01 quest contract', () => {
    it('keeps stage chain up to finale and resolved', () => {
        expect(findTransition('leads_done', 'finale')).toBeTruthy();
        expect(findTransition('finale', 'resolved')).toBeTruthy();
    });

    it('uses runtime-compatible flags for bank objectives', () => {
        expect(findObjective('find_clue_safe')?.condition).toEqual({
            type: 'flag',
            flag: 'vault_inspected'
        });
        expect(findObjective('interrogate_clerk')?.condition).toEqual({
            type: 'flag',
            flag: 'clerk_interviewed'
        });
    });

    it('completes by case_resolved and avoids transition side-effect actions', () => {
        expect(CASE_01_ACT_1_LOGIC.completionCondition).toEqual({
            type: 'flag',
            flag: 'case_resolved'
        });

        const sideEffectTransitions = (CASE_01_ACT_1_LOGIC.stageTransitions ?? [])
            .filter((transition) => Boolean(transition.triggerActions && transition.triggerActions.length > 0))
            .map((transition) => `${transition.from}->${transition.to}`);

        expect(sideEffectTransitions).toEqual([]);
    });
});

