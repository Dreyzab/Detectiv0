import { DEDUCTION_REGISTRY, type DeductionRecipe, type DeductionResult } from '../apps/web/src/features/detective/lib/deductions';
import { EVIDENCE_REGISTRY } from '../apps/web/src/features/detective/registries';
import * as ParliamentData from '../packages/shared/data/parliament.ts';

export type IssueSeverity = 'error' | 'warning';

export interface ValidationIssue {
    severity: IssueSeverity;
    code: string;
    message: string;
}

export interface ValidationReport {
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
}

export interface ValidationInput {
    recipes: Record<string, DeductionRecipe>;
    evidenceRegistry: Record<string, { id: string }>;
    knownVoiceIds: Set<string>;
}

const EXIT_RESULT_TYPES = new Set<DeductionResult['type']>(['add_flag', 'unlock_point']);

const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const reset = '\x1b[0m';

const normalizePairKey = (inputs: [string, string]): string => [...inputs].sort((left, right) => left.localeCompare(right)).join('::');

const getRecipeResults = (recipe: DeductionRecipe): DeductionResult[] => {
    const results: DeductionResult[] = [];
    if (recipe.result) {
        results.push(recipe.result);
    }
    recipe.results?.forEach((entry) => {
        results.push(entry.result);
    });
    return results;
};

const getProducedEvidenceIds = (recipe: DeductionRecipe): string[] => {
    const produced: string[] = [];
    getRecipeResults(recipe).forEach((result) => {
        if (result.grantsEvidence?.id) {
            produced.push(result.grantsEvidence.id);
            return;
        }
        if (result.type === 'new_evidence' || result.type === 'upgrade_evidence') {
            produced.push(result.id);
        }
    });
    return produced;
};

const getRecipeTier = (recipe: DeductionRecipe): number => {
    const tiers = getRecipeResults(recipe)
        .map((result) => result.tier)
        .filter((tier): tier is number => typeof tier === 'number');
    if (tiers.length === 0) {
        return 0;
    }
    return Math.max(...tiers);
};

const getRelevantVoiceIds = (recipe: DeductionRecipe): string[] => {
    const voices = new Set<string>();
    if (recipe.requiredVoice) {
        voices.add(recipe.requiredVoice.voiceId);
    }
    recipe.voiceReactions?.forEach((reaction) => {
        voices.add(reaction.voiceId);
    });
    recipe.results?.forEach((entry) => {
        if (typeof entry.condition !== 'string') {
            voices.add(entry.condition.voiceId);
        }
    });
    return Array.from(voices);
};

const stronglyConnectedComponents = (graph: Record<string, string[]>): string[][] => {
    let index = 0;
    const stack: string[] = [];
    const onStack = new Set<string>();
    const indices = new Map<string, number>();
    const lowLinks = new Map<string, number>();
    const components: string[][] = [];

    const visit = (node: string) => {
        indices.set(node, index);
        lowLinks.set(node, index);
        index += 1;
        stack.push(node);
        onStack.add(node);

        const neighbors = graph[node] ?? [];
        neighbors.forEach((neighbor) => {
            if (!indices.has(neighbor)) {
                visit(neighbor);
                lowLinks.set(node, Math.min(lowLinks.get(node) ?? 0, lowLinks.get(neighbor) ?? 0));
            } else if (onStack.has(neighbor)) {
                lowLinks.set(node, Math.min(lowLinks.get(node) ?? 0, indices.get(neighbor) ?? 0));
            }
        });

        if ((lowLinks.get(node) ?? -1) === (indices.get(node) ?? -2)) {
            const component: string[] = [];
            while (stack.length > 0) {
                const top = stack.pop() as string;
                onStack.delete(top);
                component.push(top);
                if (top === node) {
                    break;
                }
            }
            components.push(component);
        }
    };

    Object.keys(graph).forEach((node) => {
        if (!indices.has(node)) {
            visit(node);
        }
    });

    return components;
};

export const validateDeductions = (input: ValidationInput): ValidationReport => {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const recipes = Object.values(input.recipes);
    const evidenceIds = new Set(Object.keys(input.evidenceRegistry));

    const producedEvidence = new Set<string>();
    recipes.forEach((recipe) => {
        getProducedEvidenceIds(recipe).forEach((evidenceId) => producedEvidence.add(evidenceId));
    });

    const knownEvidence = new Set<string>([...evidenceIds, ...producedEvidence]);

    const recipeByPair = new Map<string, string[]>();
    recipes.forEach((recipe) => {
        const key = normalizePairKey(recipe.inputs);
        const existing = recipeByPair.get(key) ?? [];
        existing.push(recipe.id);
        recipeByPair.set(key, existing);
    });
    recipeByPair.forEach((recipeIds, pair) => {
        if (recipeIds.length > 1) {
            errors.push({
                severity: 'error',
                code: 'duplicate_inputs',
                message: `Input pair "${pair}" is used by multiple recipes: ${recipeIds.join(', ')}`
            });
        }
    });

    recipes.forEach((recipe) => {
        recipe.inputs.forEach((inputEvidenceId) => {
            if (!knownEvidence.has(inputEvidenceId)) {
                errors.push({
                    severity: 'error',
                    code: 'missing_evidence',
                    message: `Recipe "${recipe.id}" references unknown evidence "${inputEvidenceId}".`
                });
            }
        });
    });

    recipes.forEach((recipe) => {
        getRelevantVoiceIds(recipe).forEach((voiceId) => {
            if (!input.knownVoiceIds.has(voiceId)) {
                errors.push({
                    severity: 'error',
                    code: 'missing_voice',
                    message: `Recipe "${recipe.id}" references unknown voice "${voiceId}".`
                });
            }
        });
    });

    recipes.forEach((recipe) => {
        getRecipeResults(recipe).forEach((result) => {
            if (result.type === 'hypothesis' && typeof result.baseConfidence !== 'number') {
                errors.push({
                    severity: 'error',
                    code: 'missing_confidence',
                    message: `Hypothesis result "${result.id}" in recipe "${recipe.id}" has no baseConfidence.`
                });
            }
        });
    });

    const reachableEvidence = new Set<string>(evidenceIds);
    let changed = true;
    while (changed) {
        changed = false;
        recipes.forEach((recipe) => {
            if (recipe.inputs.every((inputId) => reachableEvidence.has(inputId))) {
                getProducedEvidenceIds(recipe).forEach((producedId) => {
                    if (!reachableEvidence.has(producedId)) {
                        reachableEvidence.add(producedId);
                        changed = true;
                    }
                });
            }
        });
    }

    recipes.forEach((recipe) => {
        const tier = getRecipeTier(recipe);
        if (tier >= 2) {
            const unreachableInput = recipe.inputs.find((inputId) => !reachableEvidence.has(inputId));
            if (unreachableInput) {
                errors.push({
                    severity: 'error',
                    code: 'unreachable_tier',
                    message: `Tier-${tier} recipe "${recipe.id}" is unreachable because "${unreachableInput}" cannot be reached.`
                });
            }
        }
    });

    const producedByRecipe = new Map<string, string[]>();
    recipes.forEach((recipe) => {
        producedByRecipe.set(recipe.id, getProducedEvidenceIds(recipe));
    });

    const graph: Record<string, string[]> = {};
    recipes.forEach((recipe) => {
        const produced = producedByRecipe.get(recipe.id) ?? [];
        const neighbors: string[] = [];
        recipes.forEach((candidate) => {
            if (candidate.id === recipe.id) {
                return;
            }
            if (candidate.inputs.some((inputId) => produced.includes(inputId))) {
                neighbors.push(candidate.id);
            }
        });
        graph[recipe.id] = neighbors;
    });

    const scc = stronglyConnectedComponents(graph);
    scc.forEach((component) => {
        const hasSelfCycle = component.length === 1 && (graph[component[0]] ?? []).includes(component[0]);
        const isCycle = component.length > 1 || hasSelfCycle;
        if (!isCycle) {
            return;
        }

        const hasExit = component.some((recipeId) => {
            const recipe = input.recipes[recipeId];
            return getRecipeResults(recipe).some((result) => EXIT_RESULT_TYPES.has(result.type));
        });

        if (!hasExit) {
            errors.push({
                severity: 'error',
                code: 'cycle_without_exit',
                message: `Cycle without exit detected: ${component.join(' -> ')}`
            });
        }
    });

    const usedInputEvidence = new Set<string>();
    recipes.forEach((recipe) => {
        recipe.inputs.forEach((inputId) => usedInputEvidence.add(inputId));
    });

    evidenceIds.forEach((evidenceId) => {
        if (!usedInputEvidence.has(evidenceId)) {
            warnings.push({
                severity: 'warning',
                code: 'orphan_evidence',
                message: `Evidence "${evidenceId}" is not used as an input by any recipe.`
            });
        }
    });

    return { errors, warnings };
};

export const validateCurrentDeductions = (): ValidationReport =>
    validateDeductions({
        recipes: DEDUCTION_REGISTRY,
        evidenceRegistry: EVIDENCE_REGISTRY,
        knownVoiceIds: (() => {
            const moduleData = ParliamentData as {
                VOICES?: Record<string, unknown>;
                default?: { VOICES?: Record<string, unknown> };
            };
            const voices = moduleData.VOICES ?? moduleData.default?.VOICES ?? {};
            return new Set(Object.keys(voices));
        })()
    });

const printIssue = (issue: ValidationIssue) => {
    const color = issue.severity === 'error' ? red : yellow;
    const label = issue.severity === 'error' ? 'ERROR' : 'WARN';
    console.log(`${color}[${label}]${reset} ${issue.code}: ${issue.message}`);
};

const isDirectExecution = Boolean(process.argv[1]) && /validate-deductions\.(t|j)s$/.test(process.argv[1]);

if (import.meta.main || isDirectExecution) {
    const report = validateCurrentDeductions();
    console.log(`${cyan}Deduction validation report${reset}`);
    report.errors.forEach(printIssue);
    report.warnings.forEach(printIssue);

    if (report.errors.length > 0) {
        console.log(`${red}Validation failed with ${report.errors.length} error(s).${reset}`);
        process.exit(1);
    }

    console.log(`${green}Validation passed with ${report.warnings.length} warning(s).${reset}`);
}
