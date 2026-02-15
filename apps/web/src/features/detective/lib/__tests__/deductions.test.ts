/* @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useDossierStore } from '../../dossier/store';
import { DEDUCTION_REGISTRY, type DeductionRecipe } from '../deductions';
import { EVIDENCE_REGISTRY } from '../../registries';

const BASE_REGISTRY = { ...DEDUCTION_REGISTRY };

const restoreRegistry = () => {
    Object.keys(DEDUCTION_REGISTRY).forEach((recipeId) => {
        delete DEDUCTION_REGISTRY[recipeId];
    });
    Object.assign(DEDUCTION_REGISTRY, BASE_REGISTRY);
};

const resetStore = () => {
    const state = useDossierStore.getState();
    state.resetDossier();
    useDossierStore.setState({
        isServerHydrated: false,
        isSyncing: false,
        syncError: null,
        thoughtPoints: 3
    });
};

const addEvidence = (id: string, name = id) => {
    useDossierStore.getState().addEvidence({
        id,
        name,
        description: `${name} description`,
        packId: 'test'
    });
};

describe('combineEvidence', () => {
    beforeEach(() => {
        restoreRegistry();
        resetStore();
    });

    afterEach(() => {
        restoreRegistry();
        resetStore();
    });

    it('returns simple result for backward-compatible recipes', () => {
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_cold_draft);
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_ectoplasm_residue);

        const result = useDossierStore.getState().combineEvidence('ev_cold_draft', 'ev_ectoplasm_residue');

        expect(result).toBeTruthy();
        expect(result && !result.blocked ? result.id : null).toBe('GHOST_TRUE_DEDUCTION');
    });

    it('blocks voice-gated recipes at low level and succeeds when threshold is met', () => {
        const recipe: DeductionRecipe = {
            id: 'voice_gate_recipe',
            inputs: ['ev_gate_a', 'ev_gate_b'],
            requiredVoice: { voiceId: 'logic', minLevel: 3 },
            result: {
                type: 'add_flag',
                id: 'FLAG_GATE_SUCCESS',
                label: 'Voice Gate Passed',
                description: 'Unlocked after logic gate.'
            },
            voiceReactions: [
                {
                    voiceId: 'logic',
                    trigger: 'on_locked',
                    text: 'Need stronger logic.'
                }
            ]
        };
        DEDUCTION_REGISTRY[recipe.id] = recipe;

        addEvidence('ev_gate_a');
        addEvidence('ev_gate_b');

        const blocked = useDossierStore.getState().combineEvidence('ev_gate_a', 'ev_gate_b');
        expect(blocked?.blocked).toBe(true);

        useDossierStore.getState().setVoiceLevel('logic', 3);
        const success = useDossierStore.getState().combineEvidence('ev_gate_a', 'ev_gate_b');
        expect(success && !success.blocked ? success.id : null).toBe('FLAG_GATE_SUCCESS');
    });

    it('chooses competing hypothesis result based on voiceStats', () => {
        const recipe: DeductionRecipe = {
            id: 'competing_hypothesis',
            inputs: ['ev_comp_a', 'ev_comp_b'],
            results: [
                {
                    condition: { voiceId: 'logic', minLevel: 4 },
                    result: {
                        type: 'hypothesis',
                        id: 'hyp_logic',
                        label: 'Logical theory',
                        description: 'Selected by logic gate.',
                        baseConfidence: 70,
                        tier: 1
                    }
                },
                {
                    condition: 'default',
                    result: {
                        type: 'hypothesis',
                        id: 'hyp_default',
                        label: 'Default theory',
                        description: 'Fallback hypothesis.',
                        baseConfidence: 55,
                        tier: 1
                    }
                }
            ]
        };
        DEDUCTION_REGISTRY[recipe.id] = recipe;

        addEvidence('ev_comp_a');
        addEvidence('ev_comp_b');

        let result = useDossierStore.getState().combineEvidence('ev_comp_a', 'ev_comp_b');
        expect(result && !result.blocked ? result.id : null).toBe('hyp_default');

        resetStore();
        addEvidence('ev_comp_a');
        addEvidence('ev_comp_b');
        useDossierStore.getState().setVoiceLevel('logic', 4);

        result = useDossierStore.getState().combineEvidence('ev_comp_a', 'ev_comp_b');
        expect(result && !result.blocked ? result.id : null).toBe('hyp_logic');
    });

    it('applies evidence mutation for upgrade_evidence', () => {
        const recipe: DeductionRecipe = {
            id: 'upgrade_recipe',
            inputs: ['ev_old', 'ev_upgrade_key'],
            result: {
                type: 'upgrade_evidence',
                id: 'ev_new',
                label: 'Upgrade complete',
                description: 'Old clue transformed.',
                removesEvidence: ['ev_old'],
                grantsEvidence: {
                    id: 'ev_new',
                    name: 'Upgraded clue',
                    description: 'Fresh evidence',
                    packId: 'test'
                },
                tier: 1
            }
        };
        DEDUCTION_REGISTRY[recipe.id] = recipe;

        addEvidence('ev_old', 'Old clue');
        addEvidence('ev_upgrade_key', 'Upgrade key');

        const result = useDossierStore.getState().combineEvidence('ev_old', 'ev_upgrade_key');
        expect(result && !result.blocked ? result.type : null).toBe('upgrade_evidence');

        const state = useDossierStore.getState();
        expect(state.evidence.some((entry) => entry.id === 'ev_old')).toBe(false);
        expect(state.evidence.some((entry) => entry.id === 'ev_new')).toBe(true);
        expect(state.evidenceHistory.some((entry) => entry.type === 'upgraded' && entry.evidenceId === 'ev_new')).toBe(true);
    });

    it('calculates initial confidence with voice bonuses', () => {
        const recipe: DeductionRecipe = {
            id: 'confidence_recipe',
            inputs: ['ev_conf_a', 'ev_conf_b'],
            result: {
                type: 'hypothesis',
                id: 'hyp_confidence',
                label: 'Confidence test',
                description: 'Validate formula.',
                baseConfidence: 50,
                tier: 1
            },
            voiceReactions: [
                {
                    voiceId: 'logic',
                    trigger: 'on_success',
                    threshold: 1,
                    text: 'Logic adds confidence.'
                }
            ]
        };
        DEDUCTION_REGISTRY[recipe.id] = recipe;

        useDossierStore.getState().setVoiceLevel('logic', 4);
        addEvidence('ev_conf_a');
        addEvidence('ev_conf_b');

        const result = useDossierStore.getState().combineEvidence('ev_conf_a', 'ev_conf_b');
        expect(result && !result.blocked ? result.confidence : null).toBe(68);

        const hypothesis = useDossierStore.getState().hypotheses.hyp_confidence;
        expect(hypothesis?.confidence).toBe(68);
    });

    it('marks red herring hypotheses in store', () => {
        const recipe: DeductionRecipe = {
            id: 'red_herring_recipe',
            inputs: ['ev_red_a', 'ev_red_b'],
            isRedHerring: true,
            result: {
                type: 'hypothesis',
                id: 'hyp_red',
                label: 'False lead',
                description: 'Likely wrong theory.',
                baseConfidence: 45,
                tier: 1
            }
        };
        DEDUCTION_REGISTRY[recipe.id] = recipe;

        addEvidence('ev_red_a');
        addEvidence('ev_red_b');

        const result = useDossierStore.getState().combineEvidence('ev_red_a', 'ev_red_b');
        expect(result && !result.blocked ? result.isRedHerring : false).toBe(true);
        expect(useDossierStore.getState().hypotheses.hyp_red?.isRedHerring).toBe(true);
    });

    it('unlocks Karlsruhe bakery point from dog route synthesis', () => {
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_dog_vendor_tip);
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_dog_butcher_note);

        const result = useDossierStore.getState().combineEvidence('ev_dog_vendor_tip', 'ev_dog_butcher_note');

        expect(result && !result.blocked ? result.type : null).toBe('unlock_point');
        expect(result && !result.blocked ? result.id : null).toBe('loc_ka_bakery');
        expect(useDossierStore.getState().pointStates.loc_ka_bakery).toBe('discovered');
    });

    it('applies conflict pressure between false and true dog hypotheses', () => {
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_dog_vendor_tip);
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_dog_hay_fur);
        useDossierStore.getState().addEvidence(EVIDENCE_REGISTRY.ev_dog_flour_trail);

        const falseLead = useDossierStore.getState().combineEvidence('ev_dog_vendor_tip', 'ev_dog_hay_fur');
        expect(falseLead && !falseLead.blocked ? falseLead.id : null).toBe('hyp_dog_stables_hideout');

        const trueLead = useDossierStore.getState().combineEvidence('ev_dog_vendor_tip', 'ev_dog_flour_trail');
        expect(trueLead && !trueLead.blocked ? trueLead.id : null).toBe('hyp_dog_park_hideout');

        const state = useDossierStore.getState();
        const falseHypothesis = state.hypotheses.hyp_dog_stables_hideout;
        const trueHypothesis = state.hypotheses.hyp_dog_park_hideout;

        expect(falseHypothesis).toBeTruthy();
        expect(trueHypothesis).toBeTruthy();
        expect(falseHypothesis && trueHypothesis ? falseHypothesis.confidence < trueHypothesis.confidence : false).toBe(true);
    });
});
