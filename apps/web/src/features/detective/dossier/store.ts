import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PointStateEnum } from '@repo/shared';
import {
    RPG_CONFIG,
    getXpToNextVoiceLevel
} from '@repo/shared/lib/rpg-config';
import type {
    DossierCheckState,
    DossierEntrySnapshot,
    DossierEvidenceSnapshot,
    DossierHypothesisSnapshot,
    DossierSnapshot
} from '@repo/contracts';
import { api } from '../../../shared/api/client';
import {
    DEDUCTION_REGISTRY,
    findRecipeByInputs,
    isGateSatisfied,
    resolveDeductionResult,
    type DeductionRecipe,
    type DeductionResult,
    type VoiceGate,
    type VoiceReaction
} from '../lib/deductions';
import { EVIDENCE_REGISTRY } from '../registries';
import type { VoiceId } from '../lib/parliament';

export type DossierEntry = DossierEntrySnapshot;
export type Evidence = DossierEvidenceSnapshot;

export interface HypothesisState {
    deductionId: string;
    resultId: string;
    label: string;
    description: string;
    confidence: number; // 0..100
    voiceModifiers: Record<string, number>; // voiceId -> delta confidence
    isRedHerring: boolean;
    tier: 0 | 1 | 2;
}

export interface EvidenceMutation {
    timestamp: number;
    type: 'added' | 'upgraded' | 'destroyed';
    evidenceId: string;
    fromDeductionId?: string;
}

export interface VoiceHint {
    evidenceId: string;
    recipeId: string;
    voiceId: VoiceId;
    text: string;
    cost: number;
}

export interface CombineEvidenceBlockedResult {
    blocked: true;
    deductionId: string;
    requiredVoice?: VoiceGate;
    matchedVoiceReactions: VoiceReaction[];
}

export interface CombineEvidenceSuccessResult extends DeductionResult {
    blocked?: false;
    deductionId: string;
    matchedVoiceReactions: VoiceReaction[];
    confidence?: number;
    hypothesisId?: string;
    isRedHerring?: boolean;
}

export type CombineEvidenceResult = CombineEvidenceBlockedResult | CombineEvidenceSuccessResult | null;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const clampConfidence = (value: number): number => clamp(Math.round(value), 0, 100);

const INITIAL_VOICE_STATS: Record<VoiceId, number> = {
    logic: 1,
    perception: 1,
    encyclopedia: 1,
    intuition: 1,
    empathy: 1,
    imagination: 1,
    authority: 1,
    charisma: 1,
    volition: 1,
    endurance: 1,
    agility: 1,
    senses: 1,
    stealth: 1,
    deception: 1,
    intrusion: 1,
    occultism: 1,
    tradition: 1,
    gambling: 1
};

const INITIAL_VOICE_XP: Record<VoiceId, number> = {
    logic: 0,
    perception: 0,
    encyclopedia: 0,
    intuition: 0,
    empathy: 0,
    imagination: 0,
    authority: 0,
    charisma: 0,
    volition: 0,
    endurance: 0,
    agility: 0,
    senses: 0,
    stealth: 0,
    deception: 0,
    intrusion: 0,
    occultism: 0,
    tradition: 0,
    gambling: 0
};

const createDefaultSnapshot = (): DossierSnapshot => ({
    entries: [],
    evidence: [],
    unlockedDeductions: [],
    pointStates: {},
    flags: {},
    activeCaseId: null,
    checkStates: {},
    xp: 0,
    level: 1,
    devPoints: 0,
    traits: [],
    voiceStats: { ...INITIAL_VOICE_STATS },
    voiceXp: { ...INITIAL_VOICE_XP },
    hypotheses: {},
    thoughtPoints: 0
});

const DOSSIER_ENTRY_TYPES = new Set<DossierEntry['type']>(['note', 'clue', 'fact', 'profile', 'document', 'intel']);
const CHECK_STATES = new Set<DossierCheckState>(['passed', 'failed', 'locked']);
const POINT_STATES = new Set<PointStateEnum>(['locked', 'discovered', 'visited', 'completed']);

const sanitizeStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    const unique = new Set<string>();
    value.forEach((entry) => {
        if (typeof entry !== 'string') return;
        const trimmed = entry.trim();
        if (trimmed.length === 0) return;
        unique.add(trimmed);
    });
    return Array.from(unique);
};

const sanitizeFlags = (value: unknown): Record<string, boolean> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }
    const result: Record<string, boolean> = {};
    Object.entries(value).forEach(([key, entry]) => {
        if (typeof entry === 'boolean') {
            result[key] = entry;
        }
    });
    return result;
};

const sanitizePointStates = (value: unknown): Record<string, PointStateEnum> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const result: Record<string, PointStateEnum> = {};
    Object.entries(value).forEach(([pointId, pointState]) => {
        if (typeof pointState !== 'string') return;
        if (!POINT_STATES.has(pointState as PointStateEnum)) return;
        result[pointId] = pointState as PointStateEnum;
    });
    return result;
};

const sanitizeCheckStates = (value: unknown): Record<string, DossierCheckState> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const result: Record<string, DossierCheckState> = {};
    Object.entries(value).forEach(([checkId, checkState]) => {
        if (typeof checkState !== 'string') return;
        if (!CHECK_STATES.has(checkState as DossierCheckState)) return;
        result[checkId] = checkState as DossierCheckState;
    });
    return result;
};

const sanitizeVoiceMap = (value: unknown, fallbackMap: Record<VoiceId, number>): Record<VoiceId, number> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { ...fallbackMap };
    }

    const source = value as Record<string, unknown>;
    const result = { ...fallbackMap };
    (Object.keys(fallbackMap) as VoiceId[]).forEach((voiceId) => {
        const current = source[voiceId];
        if (typeof current === 'number' && Number.isFinite(current)) {
            result[voiceId] = Math.max(0, Math.floor(current));
        }
    });
    return result;
};

const sanitizeVoiceModifiers = (value: unknown): Record<string, number> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const result: Record<string, number> = {};
    Object.entries(value).forEach(([voiceId, delta]) => {
        if (typeof delta !== 'number' || !Number.isFinite(delta)) {
            return;
        }
        result[voiceId] = Math.round(delta);
    });
    return result;
};

const sanitizeEntries = (value: unknown): DossierEntry[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): DossierEntry | null => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                return null;
            }

            const raw = entry as Record<string, unknown>;
            if (typeof raw.id !== 'string' || typeof raw.title !== 'string' || typeof raw.content !== 'string') {
                return null;
            }

            const type = typeof raw.type === 'string' && DOSSIER_ENTRY_TYPES.has(raw.type as DossierEntry['type'])
                ? raw.type as DossierEntry['type']
                : 'note';

            return {
                id: raw.id,
                type,
                title: raw.title,
                content: raw.content,
                isLocked: Boolean(raw.isLocked),
                packId: typeof raw.packId === 'string' ? raw.packId : '',
                timestamp: typeof raw.timestamp === 'number' && Number.isFinite(raw.timestamp)
                    ? Math.max(0, Math.floor(raw.timestamp))
                    : Date.now(),
                refId: typeof raw.refId === 'string' && raw.refId.trim().length > 0 ? raw.refId : undefined
            };
        })
        .filter((entry): entry is DossierEntry => entry !== null);
};

const sanitizeEvidence = (value: unknown): Evidence[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): Evidence | null => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                return null;
            }
            const raw = entry as Record<string, unknown>;
            if (typeof raw.id !== 'string' || typeof raw.name !== 'string' || typeof raw.description !== 'string') {
                return null;
            }

            return {
                id: raw.id,
                name: raw.name,
                description: raw.description,
                icon: typeof raw.icon === 'string' ? raw.icon : undefined,
                packId: typeof raw.packId === 'string' ? raw.packId : ''
            };
        })
        .filter((entry): entry is Evidence => entry !== null);
};

const sanitizeHypothesesSnapshot = (value: unknown): Record<string, DossierHypothesisSnapshot> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const result: Record<string, DossierHypothesisSnapshot> = {};
    Object.entries(value).forEach(([hypothesisId, rawValue]) => {
        if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
            return;
        }
        const raw = rawValue as Record<string, unknown>;
        if (typeof raw.deductionId !== 'string' || typeof raw.resultId !== 'string') {
            return;
        }

        const confidence = typeof raw.confidence === 'number' && Number.isFinite(raw.confidence)
            ? clampConfidence(raw.confidence)
            : 50;
        const tier = typeof raw.tier === 'number' && Number.isFinite(raw.tier)
            ? clamp(Math.floor(raw.tier), 0, 2)
            : 1;

        result[hypothesisId] = {
            deductionId: raw.deductionId,
            resultId: raw.resultId,
            confidence,
            voiceModifiers: sanitizeVoiceModifiers(raw.voiceModifiers),
            tier,
            isRedHerring: Boolean(raw.isRedHerring)
        };
    });

    return result;
};

const sanitizeThoughtPoints = (value: unknown): number => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return 0;
    }
    return Math.max(0, Math.floor(value));
};

const sanitizeEvidenceHistory = (value: unknown): EvidenceMutation[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): EvidenceMutation | null => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                return null;
            }
            const raw = entry as Record<string, unknown>;
            if (
                typeof raw.evidenceId !== 'string' ||
                typeof raw.type !== 'string' ||
                !['added', 'upgraded', 'destroyed'].includes(raw.type)
            ) {
                return null;
            }

            return {
                timestamp: typeof raw.timestamp === 'number' && Number.isFinite(raw.timestamp)
                    ? Math.max(0, Math.floor(raw.timestamp))
                    : Date.now(),
                type: raw.type as EvidenceMutation['type'],
                evidenceId: raw.evidenceId,
                fromDeductionId: typeof raw.fromDeductionId === 'string' ? raw.fromDeductionId : undefined
            };
        })
        .filter((entry): entry is EvidenceMutation => entry !== null);
};

const normalizeSnapshot = (snapshot: DossierSnapshot | undefined | null): DossierSnapshot => {
    const base = createDefaultSnapshot();
    if (!snapshot) {
        return base;
    }

    return {
        entries: sanitizeEntries(snapshot.entries),
        evidence: sanitizeEvidence(snapshot.evidence),
        unlockedDeductions: sanitizeStringArray(snapshot.unlockedDeductions),
        pointStates: sanitizePointStates(snapshot.pointStates),
        flags: sanitizeFlags(snapshot.flags),
        activeCaseId: typeof snapshot.activeCaseId === 'string' && snapshot.activeCaseId.trim().length > 0
            ? snapshot.activeCaseId
            : null,
        checkStates: sanitizeCheckStates(snapshot.checkStates),
        xp: typeof snapshot.xp === 'number' && Number.isFinite(snapshot.xp) ? Math.max(0, Math.floor(snapshot.xp)) : 0,
        level: typeof snapshot.level === 'number' && Number.isFinite(snapshot.level) ? Math.max(1, Math.floor(snapshot.level)) : 1,
        devPoints: typeof snapshot.devPoints === 'number' && Number.isFinite(snapshot.devPoints)
            ? Math.max(0, Math.floor(snapshot.devPoints))
            : 0,
        traits: sanitizeStringArray(snapshot.traits),
        voiceStats: sanitizeVoiceMap(snapshot.voiceStats, INITIAL_VOICE_STATS),
        voiceXp: sanitizeVoiceMap(snapshot.voiceXp, INITIAL_VOICE_XP),
        hypotheses: sanitizeHypothesesSnapshot(snapshot.hypotheses),
        thoughtPoints: sanitizeThoughtPoints(snapshot.thoughtPoints)
    };
};

const getReactionThreshold = (reaction: VoiceReaction): number => reaction.threshold ?? 0;

const getVoiceReactions = (
    reactions: VoiceReaction[] | undefined,
    trigger: VoiceReaction['trigger'],
    voiceStats: Partial<Record<VoiceId, number>>
): VoiceReaction[] => {
    if (!reactions || reactions.length === 0) {
        return [];
    }
    return reactions.filter((reaction) => {
        if (reaction.trigger !== trigger) {
            return false;
        }
        const level = voiceStats[reaction.voiceId] ?? 0;
        return level >= getReactionThreshold(reaction);
    });
};

const buildVoiceBonusMap = (
    reactions: VoiceReaction[] | undefined,
    voiceStats: Partial<Record<VoiceId, number>>
): Record<string, number> => {
    const result: Record<string, number> = {};
    if (!reactions || reactions.length === 0) {
        return result;
    }

    reactions.forEach((reaction) => {
        if (reaction.trigger !== 'on_success') {
            return;
        }

        const threshold = getReactionThreshold(reaction);
        const level = voiceStats[reaction.voiceId] ?? 0;
        if (level < threshold) {
            return;
        }

        const diff = Math.max(0, level - threshold);
        const bonus = clamp(5 + diff * 3, 5, 15);
        result[reaction.voiceId] = (result[reaction.voiceId] ?? 0) + bonus;
    });

    return result;
};

const sumModifiers = (modifiers: Record<string, number>): number =>
    Object.values(modifiers).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);

const resolveResultById = (recipe: DeductionRecipe | undefined, resultId: string): DeductionResult | null => {
    if (!recipe) {
        return null;
    }

    if (recipe.result?.id === resultId) {
        return recipe.result;
    }

    if (!recipe.results) {
        return null;
    }

    for (const candidate of recipe.results) {
        if (candidate.result.id === resultId) {
            return candidate.result;
        }
    }

    return null;
};

const computeHypothesisConfidence = (
    hypothesis: HypothesisState,
    evidence: Evidence[]
): number => {
    const recipe = DEDUCTION_REGISTRY[hypothesis.deductionId];
    const matchingResult = resolveResultById(recipe, hypothesis.resultId);
    const baseConfidence = typeof matchingResult?.baseConfidence === 'number' ? matchingResult.baseConfidence : 50;
    const evidenceIds = new Set(evidence.map((item) => item.id));

    let supportBonus = 0;
    if (recipe) {
        recipe.inputs.forEach((inputId) => {
            if (evidenceIds.has(inputId)) {
                supportBonus += 2;
            }
        });
    }

    return clampConfidence(baseConfidence + sumModifiers(hypothesis.voiceModifiers) + supportBonus);
};

const recalcHypotheses = (
    hypotheses: Record<string, HypothesisState>,
    evidence: Evidence[]
): Record<string, HypothesisState> => {
    const result: Record<string, HypothesisState> = {};
    Object.entries(hypotheses).forEach(([hypothesisId, hypothesis]) => {
        result[hypothesisId] = {
            ...hypothesis,
            confidence: computeHypothesisConfidence(hypothesis, evidence)
        };
    });
    return result;
};

const conflictsWithTarget = (
    sourceRecipe: DeductionRecipe | undefined,
    targetHypothesisId: string,
    targetHypothesis: HypothesisState
): boolean => {
    const conflicts = sourceRecipe?.conflictsWith;
    if (!conflicts || conflicts.length === 0) {
        return false;
    }
    return (
        conflicts.includes(targetHypothesisId) ||
        conflicts.includes(targetHypothesis.deductionId) ||
        conflicts.includes(targetHypothesis.resultId)
    );
};

const applyConflictModifier = (
    hypotheses: Record<string, HypothesisState>,
    sourceHypothesisId: string,
    delta: number
): Record<string, HypothesisState> => {
    if (delta === 0) {
        return hypotheses;
    }

    const source = hypotheses[sourceHypothesisId];
    if (!source) {
        return hypotheses;
    }

    const sourceRecipe = DEDUCTION_REGISTRY[source.deductionId];
    if (!sourceRecipe?.conflictsWith || sourceRecipe.conflictsWith.length === 0) {
        return hypotheses;
    }

    const impact = Math.max(1, Math.round(Math.abs(delta) / 2));
    const direction = delta > 0 ? -impact : impact;
    const conflictKey = `conflict:${sourceHypothesisId}`;

    const next: Record<string, HypothesisState> = { ...hypotheses };
    Object.entries(next).forEach(([targetId, target]) => {
        if (targetId === sourceHypothesisId) {
            return;
        }
        if (!conflictsWithTarget(sourceRecipe, targetId, target)) {
            return;
        }

        const nextModifiers = {
            ...target.voiceModifiers,
            [conflictKey]: (target.voiceModifiers[conflictKey] ?? 0) + direction
        };

        next[targetId] = {
            ...target,
            voiceModifiers: nextModifiers
        };
    });

    return next;
};

const resolveGrantedEvidence = (result: DeductionResult): Evidence | null => {
    if (result.grantsEvidence) {
        return result.grantsEvidence;
    }

    const fromRegistry = EVIDENCE_REGISTRY[result.id];
    if (fromRegistry) {
        return fromRegistry;
    }

    return null;
};

const toSnapshotHypotheses = (hypotheses: Record<string, HypothesisState>): Record<string, DossierHypothesisSnapshot> => {
    const result: Record<string, DossierHypothesisSnapshot> = {};
    Object.entries(hypotheses).forEach(([hypothesisId, hypothesis]) => {
        result[hypothesisId] = {
            deductionId: hypothesis.deductionId,
            resultId: hypothesis.resultId,
            confidence: clampConfidence(hypothesis.confidence),
            voiceModifiers: sanitizeVoiceModifiers(hypothesis.voiceModifiers),
            tier: hypothesis.tier,
            isRedHerring: hypothesis.isRedHerring
        };
    });
    return result;
};

const hydrateHypotheses = (
    snapshotHypotheses: Record<string, DossierHypothesisSnapshot>,
    evidence: Evidence[]
): Record<string, HypothesisState> => {
    const result: Record<string, HypothesisState> = {};

    Object.entries(snapshotHypotheses).forEach(([hypothesisId, hypothesis]) => {
        const recipe = DEDUCTION_REGISTRY[hypothesis.deductionId];
        const deductionResult = resolveResultById(recipe, hypothesis.resultId);

        result[hypothesisId] = {
            deductionId: hypothesis.deductionId,
            resultId: hypothesis.resultId,
            label: deductionResult?.label ?? hypothesis.resultId,
            description: deductionResult?.description ?? '',
            confidence: clampConfidence(hypothesis.confidence),
            voiceModifiers: sanitizeVoiceModifiers(hypothesis.voiceModifiers),
            isRedHerring: typeof hypothesis.isRedHerring === 'boolean'
                ? hypothesis.isRedHerring
                : Boolean(recipe?.isRedHerring),
            tier: clamp((deductionResult?.tier ?? hypothesis.tier ?? 1), 0, 2) as 0 | 1 | 2
        };
    });

    return recalcHypotheses(result, evidence);
};

const collectRelevantVoicesForHint = (recipe: DeductionRecipe): VoiceId[] => {
    const voices = new Set<VoiceId>();

    if (recipe.requiredVoice) {
        voices.add(recipe.requiredVoice.voiceId);
    }

    recipe.voiceReactions?.forEach((reaction) => {
        voices.add(reaction.voiceId);
    });

    recipe.results?.forEach((conditional) => {
        if (typeof conditional.condition !== 'string') {
            voices.add(conditional.condition.voiceId);
        }
    });

    if (voices.size === 0) {
        voices.add('logic');
    }

    return Array.from(voices);
};

const buildHintText = (
    recipe: DeductionRecipe,
    evidenceId: string,
    voiceId: VoiceId,
    voiceStats: Partial<Record<VoiceId, number>>,
    evidence: Evidence[]
): string => {
    const reactionCandidate = recipe.voiceReactions?.find((reaction) => {
        if (reaction.voiceId !== voiceId) {
            return false;
        }
        if (reaction.trigger !== 'on_attempt' && reaction.trigger !== 'on_success') {
            return false;
        }
        const threshold = getReactionThreshold(reaction);
        return (voiceStats[voiceId] ?? 0) >= threshold;
    });

    if (reactionCandidate) {
        return reactionCandidate.text;
    }

    const counterpart = recipe.inputs.find((inputId) => inputId !== evidenceId);
    if (!counterpart) {
        return 'This clue still lacks context. Pair it with something from a different scene.';
    }

    const counterpartName =
        evidence.find((item) => item.id === counterpart)?.name ||
        EVIDENCE_REGISTRY[counterpart]?.name ||
        counterpart;

    return `This clue resonates with ${counterpartName}. Link them and test the chain.`;
};

let dossierSyncTimer: ReturnType<typeof setTimeout> | null = null;

export interface DetectiveState {
    entries: DossierEntry[];
    evidence: Evidence[];
    unlockedDeductions: string[];

    pointStates: Record<string, PointStateEnum>;
    flags: Record<string, boolean>;
    activeCaseId: string | null;
    isDossierOpen: boolean;
    checkStates: Record<string, DossierCheckState>;

    xp: number;
    level: number;
    devPoints: number;
    traits: string[];

    voiceStats: Record<VoiceId, number>;
    voiceXp: Record<VoiceId, number>;

    hypotheses: Record<string, HypothesisState>;
    thoughtPoints: number;
    evidenceHistory: EvidenceMutation[];

    addEntry: (entry: Omit<DossierEntry, 'timestamp'>) => 'added' | 'duplicate';
    unlockEntry: (id: string) => void;
    addEvidence: (item: Evidence) => void;
    combineEvidence: (id1: string, id2: string) => CombineEvidenceResult;

    modifyConfidence: (hypothesisId: string, voiceId: VoiceId, delta: number) => void;
    requestHint: (evidenceId: string) => VoiceHint | null;
    getHintableEvidence: () => string[];

    grantXp: (amount: number) => void;
    gainVoiceXp: (id: VoiceId, amount: number) => void;
    spendDevPoint: (id: VoiceId) => void;
    addTrait: (trait: string) => void;

    setPointState: (pointId: string, state: PointStateEnum) => void;
    setFlag: (flag: string, value: boolean) => void;
    addFlags: (flags: Record<string, boolean>) => void;

    setVoiceLevel: (id: VoiceId, level: number) => void;
    recordCheckResult: (checkId: string, result: DossierCheckState) => void;

    setActiveCase: (caseId: string | null) => void;
    toggleDossier: (open?: boolean) => void;
    resetDossier: () => void;

    isServerHydrated: boolean;
    isSyncing: boolean;
    syncError: string | null;
    hydrateFromServer: () => Promise<void>;
    syncToServer: () => Promise<void>;
}

export const useDossierStore = create<DetectiveState>()(
    persist(
        (set, get) => {
            const queueSync = () => {
                const state = get();
                if (!state.isServerHydrated) {
                    return;
                }

                if (dossierSyncTimer) {
                    clearTimeout(dossierSyncTimer);
                }

                dossierSyncTimer = setTimeout(() => {
                    dossierSyncTimer = null;
                    if (get().isSyncing) {
                        queueSync();
                        return;
                    }
                    void get().syncToServer();
                }, 300);
            };

            const toSnapshot = (state: DetectiveState): DossierSnapshot => ({
                entries: state.entries,
                evidence: state.evidence,
                unlockedDeductions: state.unlockedDeductions,
                pointStates: state.pointStates,
                flags: state.flags,
                activeCaseId: state.activeCaseId,
                checkStates: state.checkStates,
                xp: state.xp,
                level: state.level,
                devPoints: state.devPoints,
                traits: state.traits,
                voiceStats: state.voiceStats,
                voiceXp: state.voiceXp,
                hypotheses: toSnapshotHypotheses(state.hypotheses),
                thoughtPoints: state.thoughtPoints
            });

            const hasLocalProgress = (state: DetectiveState): boolean => {
                if (state.entries.length > 0 || state.evidence.length > 0 || state.unlockedDeductions.length > 0) return true;
                if (Object.keys(state.pointStates).length > 0 || Object.keys(state.flags).length > 0 || Object.keys(state.checkStates).length > 0) return true;
                if (state.activeCaseId !== null) return true;
                if (state.xp > 0 || state.level > 1 || state.devPoints > 0 || state.traits.length > 0) return true;
                if (Object.keys(state.hypotheses).length > 0 || state.thoughtPoints > 0 || state.evidenceHistory.length > 0) return true;
                return (Object.keys(INITIAL_VOICE_STATS) as VoiceId[]).some((id) =>
                    state.voiceStats[id] !== INITIAL_VOICE_STATS[id] || state.voiceXp[id] !== INITIAL_VOICE_XP[id]
                );
            };

            return {
                entries: [],
                evidence: [],
                unlockedDeductions: [],
                pointStates: {},
                flags: {},
                activeCaseId: null,
                isDossierOpen: false,
                checkStates: {},

                xp: 0,
                level: 1,
                devPoints: 0,
                traits: [],

                voiceStats: { ...INITIAL_VOICE_STATS },
                voiceXp: { ...INITIAL_VOICE_XP },

                hypotheses: {},
                thoughtPoints: 0,
                evidenceHistory: [],

                isServerHydrated: false,
                isSyncing: false,
                syncError: null,

                addEntry: (entry) => {
                    const state = get();
                    if (state.entries.some((existingEntry) => existingEntry.id === entry.id)) {
                        return 'duplicate';
                    }

                    set((prevState) => ({
                        entries: [...prevState.entries, { ...entry, timestamp: Date.now() }]
                    }));
                    queueSync();
                    return 'added';
                },

                grantXp: (amount) => {
                    set((state) => {
                        const newXp = state.xp + amount;
                        const newLevel = 1 + Math.floor(newXp / 1000);

                        let devPointsGained = 0;
                        if (newLevel > state.level) {
                            const levelsGained = newLevel - state.level;
                            devPointsGained = levelsGained * RPG_CONFIG.DEV_POINTS_PER_LEVEL;
                        }
                        return {
                            xp: newXp,
                            level: newLevel,
                            devPoints: state.devPoints + devPointsGained
                        };
                    });
                    queueSync();
                },

                gainVoiceXp: (id, amount) => {
                    let changed = false;
                    set((state) => {
                        const currentLevel = state.voiceStats[id] || 0;
                        const currentXp = state.voiceXp[id] || 0;

                        if (currentLevel >= RPG_CONFIG.MAX_VOICE_LEVEL) {
                            return {};
                        }

                        let newXp = currentXp + amount;
                        let newLevel = currentLevel;

                        let needed = getXpToNextVoiceLevel(newLevel);
                        while (newXp >= needed && newLevel < RPG_CONFIG.MAX_VOICE_LEVEL) {
                            newXp -= needed;
                            newLevel += 1;
                            needed = getXpToNextVoiceLevel(newLevel);
                        }

                        changed = true;
                        return {
                            voiceStats: { ...state.voiceStats, [id]: newLevel },
                            voiceXp: { ...state.voiceXp, [id]: newXp }
                        };
                    });
                    if (changed) {
                        queueSync();
                    }
                },

                spendDevPoint: (id) => {
                    let changed = false;
                    set((state) => {
                        if (state.devPoints <= 0) return {};
                        const currentLevel = state.voiceStats[id] || 0;
                        if (currentLevel >= RPG_CONFIG.MAX_VOICE_LEVEL) return {};

                        changed = true;
                        return {
                            devPoints: state.devPoints - 1,
                            voiceStats: { ...state.voiceStats, [id]: currentLevel + 1 }
                        };
                    });

                    if (changed) {
                        queueSync();
                    }
                },

                addTrait: (trait) => {
                    let changed = false;
                    set((state) => {
                        if (state.traits.includes(trait)) return state;
                        changed = true;
                        return { traits: [...state.traits, trait] };
                    });
                    if (changed) {
                        queueSync();
                    }
                },

                unlockEntry: (id) => {
                    let changed = false;
                    set((state) => ({
                        entries: state.entries.map((entry) => {
                            if (entry.id === id && entry.isLocked) {
                                changed = true;
                                return { ...entry, isLocked: false };
                            }
                            return entry;
                        })
                    }));

                    if (changed) {
                        queueSync();
                    }
                },

                addEvidence: (item) => {
                    let changed = false;
                    set((state) => {
                        if (state.evidence.some((entry) => entry.id === item.id)) return {};

                        changed = true;
                        const nextEvidence = [...state.evidence, item];
                        const nextHypotheses = recalcHypotheses(state.hypotheses, nextEvidence);

                        return {
                            evidence: nextEvidence,
                            hypotheses: nextHypotheses,
                            evidenceHistory: [
                                ...state.evidenceHistory,
                                {
                                    timestamp: Date.now(),
                                    type: 'added' as const,
                                    evidenceId: item.id
                                }
                            ]
                        };
                    });
                    if (changed) {
                        queueSync();
                    }
                },

                combineEvidence: (id1, id2) => {
                    const state = get();
                    if (id1 === id2) {
                        return null;
                    }

                    const hasFirst = state.evidence.some((entry) => entry.id === id1);
                    const hasSecond = state.evidence.some((entry) => entry.id === id2);
                    if (!hasFirst || !hasSecond) {
                        return null;
                    }

                    const deduction = findRecipeByInputs(DEDUCTION_REGISTRY, id1, id2);
                    if (!deduction) return null;
                    if (state.unlockedDeductions.includes(deduction.id)) return null;

                    if (!isGateSatisfied(deduction.requiredVoice, state.voiceStats)) {
                        return {
                            blocked: true,
                            deductionId: deduction.id,
                            requiredVoice: deduction.requiredVoice,
                            matchedVoiceReactions: getVoiceReactions(deduction.voiceReactions, 'on_locked', state.voiceStats)
                        };
                    }

                    const selectedResult = resolveDeductionResult(deduction, state.voiceStats);
                    if (!selectedResult) {
                        const failReactions = getVoiceReactions(deduction.voiceReactions, 'on_fail', state.voiceStats);
                        if (failReactions.length > 0) {
                            return {
                                blocked: true,
                                deductionId: deduction.id,
                                matchedVoiceReactions: failReactions
                            };
                        }
                        return null;
                    }

                    const successReactions = getVoiceReactions(deduction.voiceReactions, 'on_success', state.voiceStats);
                    const successBonuses = buildVoiceBonusMap(deduction.voiceReactions, state.voiceStats);
                    const mutationTimestamp = Date.now();

                    let responseConfidence: number | undefined;
                    let responseHypothesisId: string | undefined;

                    set((prevState) => {
                        const updates: Partial<DetectiveState> = {
                            unlockedDeductions: [...prevState.unlockedDeductions, deduction.id]
                        };

                        let nextEvidence = [...prevState.evidence];
                        let nextFlags = prevState.flags;
                        let nextPointStates = prevState.pointStates;
                        let nextHypotheses = { ...prevState.hypotheses };
                        const nextHistory = [...prevState.evidenceHistory];

                        const appendHistory = (type: EvidenceMutation['type'], evidenceId: string) => {
                            nextHistory.push({
                                timestamp: mutationTimestamp,
                                type,
                                evidenceId,
                                fromDeductionId: deduction.id
                            });
                        };

                        const removeEvidenceIds = (ids: string[]) => {
                            if (ids.length === 0) {
                                return;
                            }
                            const idSet = new Set(ids);
                            nextEvidence = nextEvidence.filter((entry) => {
                                if (!idSet.has(entry.id)) {
                                    return true;
                                }
                                appendHistory('destroyed', entry.id);
                                return false;
                            });
                        };

                        switch (selectedResult.type) {
                            case 'add_flag': {
                                nextFlags = { ...prevState.flags, [selectedResult.id]: true };
                                break;
                            }

                            case 'unlock_point': {
                                nextPointStates = { ...prevState.pointStates, [selectedResult.id]: 'discovered' };
                                break;
                            }

                            case 'new_evidence': {
                                const grantedEvidence = resolveGrantedEvidence(selectedResult);
                                if (grantedEvidence && !nextEvidence.some((entry) => entry.id === grantedEvidence.id)) {
                                    nextEvidence.push(grantedEvidence);
                                    appendHistory('added', grantedEvidence.id);
                                }
                                break;
                            }

                            case 'upgrade_evidence': {
                                const removes = selectedResult.removesEvidence ?? [];
                                removeEvidenceIds(removes);

                                const grantedEvidence = resolveGrantedEvidence(selectedResult);
                                if (grantedEvidence) {
                                    nextEvidence = nextEvidence.filter((entry) => entry.id !== grantedEvidence.id);
                                    nextEvidence.push(grantedEvidence);
                                    appendHistory('upgraded', grantedEvidence.id);
                                }
                                break;
                            }

                            case 'destroy_evidence': {
                                removeEvidenceIds(selectedResult.removesEvidence ?? []);
                                break;
                            }

                            case 'hypothesis': {
                                const voiceModifiers = { ...successBonuses };
                                const tier = selectedResult.tier ?? 1;

                                nextHypotheses[selectedResult.id] = {
                                    deductionId: deduction.id,
                                    resultId: selectedResult.id,
                                    label: selectedResult.label,
                                    description: selectedResult.description,
                                    confidence: clampConfidence(selectedResult.baseConfidence ?? 50),
                                    voiceModifiers,
                                    isRedHerring: Boolean(deduction.isRedHerring),
                                    tier
                                };

                                nextHypotheses = applyConflictModifier(nextHypotheses, selectedResult.id, 10);
                                responseHypothesisId = selectedResult.id;
                                break;
                            }

                            default:
                                break;
                        }

                        nextHypotheses = recalcHypotheses(nextHypotheses, nextEvidence);

                        if (responseHypothesisId && nextHypotheses[responseHypothesisId]) {
                            responseConfidence = nextHypotheses[responseHypothesisId].confidence;
                        }

                        updates.flags = nextFlags;
                        updates.pointStates = nextPointStates;
                        updates.evidence = nextEvidence;
                        updates.hypotheses = nextHypotheses;

                        if (nextHistory.length !== prevState.evidenceHistory.length) {
                            updates.evidenceHistory = nextHistory;
                        }

                        return updates;
                    });

                    queueSync();

                    return {
                        ...selectedResult,
                        deductionId: deduction.id,
                        matchedVoiceReactions: successReactions,
                        confidence: responseConfidence,
                        hypothesisId: responseHypothesisId,
                        isRedHerring: Boolean(deduction.isRedHerring)
                    };
                },

                modifyConfidence: (hypothesisId, voiceId, delta) => {
                    if (!Number.isFinite(delta) || delta === 0) {
                        return;
                    }

                    let changed = false;
                    set((state) => {
                        const target = state.hypotheses[hypothesisId];
                        if (!target) {
                            return {};
                        }

                        changed = true;
                        const nextHypotheses: Record<string, HypothesisState> = {
                            ...state.hypotheses,
                            [hypothesisId]: {
                                ...target,
                                voiceModifiers: {
                                    ...target.voiceModifiers,
                                    [voiceId]: (target.voiceModifiers[voiceId] ?? 0) + Math.round(delta)
                                }
                            }
                        };

                        const conflictAdjusted = applyConflictModifier(nextHypotheses, hypothesisId, Math.round(delta));

                        return {
                            hypotheses: recalcHypotheses(conflictAdjusted, state.evidence)
                        };
                    });

                    if (changed) {
                        queueSync();
                    }
                },

                requestHint: (evidenceId) => {
                    const state = get();
                    if (state.thoughtPoints <= 0) {
                        return null;
                    }

                    if (!state.evidence.some((entry) => entry.id === evidenceId)) {
                        return null;
                    }

                    const pendingRecipes = Object.values(DEDUCTION_REGISTRY).filter((recipe) =>
                        !state.unlockedDeductions.includes(recipe.id) && recipe.inputs.includes(evidenceId)
                    );

                    if (pendingRecipes.length === 0) {
                        return null;
                    }

                    const recipe = pendingRecipes[0];
                    const relevantVoices = collectRelevantVoicesForHint(recipe);
                    const rankedVoices = relevantVoices.sort((left, right) =>
                        (state.voiceStats[right] ?? 0) - (state.voiceStats[left] ?? 0)
                    );
                    const chosenVoice = rankedVoices[0] ?? 'logic';
                    const text = buildHintText(recipe, evidenceId, chosenVoice, state.voiceStats, state.evidence);

                    set((prevState) => ({
                        thoughtPoints: Math.max(0, prevState.thoughtPoints - 1)
                    }));
                    queueSync();

                    return {
                        evidenceId,
                        recipeId: recipe.id,
                        voiceId: chosenVoice,
                        text,
                        cost: 1
                    };
                },

                getHintableEvidence: () => {
                    const state = get();
                    const collectedIds = new Set(state.evidence.map((entry) => entry.id));
                    const hintableIds = new Set<string>();

                    Object.values(DEDUCTION_REGISTRY).forEach((recipe) => {
                        if (state.unlockedDeductions.includes(recipe.id)) {
                            return;
                        }

                        recipe.inputs.forEach((inputId) => {
                            if (collectedIds.has(inputId)) {
                                hintableIds.add(inputId);
                            }
                        });
                    });

                    return Array.from(hintableIds);
                },

                setActiveCase: (caseId) => {
                    const current = get().activeCaseId;
                    if (current === caseId) {
                        return;
                    }
                    set({ activeCaseId: caseId });
                    queueSync();
                },

                toggleDossier: (open) => set((state) => ({
                    isDossierOpen: open !== undefined ? open : !state.isDossierOpen
                })),

                setPointState: (pointId, pointState) => {
                    const current = get().pointStates[pointId];
                    if (current === pointState) {
                        return;
                    }

                    set((state) => ({
                        pointStates: { ...state.pointStates, [pointId]: pointState }
                    }));
                    queueSync();
                },

                setFlag: (flag, value) => {
                    const current = get().flags[flag];
                    if (current === value) {
                        return;
                    }

                    set((state) => ({
                        flags: { ...state.flags, [flag]: value }
                    }));
                    queueSync();
                },

                addFlags: (newFlags) => {
                    if (Object.keys(newFlags).length === 0) {
                        return;
                    }
                    set((state) => ({
                        flags: { ...state.flags, ...newFlags }
                    }));
                    queueSync();
                },

                setVoiceLevel: (id, level) => {
                    const normalized = Math.max(0, Math.floor(level));
                    if (get().voiceStats[id] === normalized) {
                        return;
                    }

                    set((state) => ({
                        voiceStats: { ...state.voiceStats, [id]: normalized }
                    }));
                    queueSync();
                },

                recordCheckResult: (checkId, result) => {
                    if (get().checkStates[checkId] === result) {
                        return;
                    }

                    set((state) => ({
                        checkStates: { ...state.checkStates, [checkId]: result }
                    }));
                    queueSync();
                },

                resetDossier: () => {
                    set({
                        entries: [],
                        evidence: [],
                        unlockedDeductions: [],
                        pointStates: {},
                        flags: {},
                        checkStates: {},
                        xp: 0,
                        level: 1,
                        devPoints: 0,
                        traits: [],
                        voiceStats: { ...INITIAL_VOICE_STATS },
                        voiceXp: { ...INITIAL_VOICE_XP },
                        hypotheses: {},
                        thoughtPoints: 0,
                        evidenceHistory: [],
                        activeCaseId: null,
                        isDossierOpen: false
                    });
                    queueSync();
                },

                hydrateFromServer: async () => {
                    const current = get();
                    if (current.isServerHydrated || current.isSyncing) {
                        return;
                    }

                    set({ isSyncing: true, syncError: null });
                    const { data, error } = await api.dossier.snapshot.get();
                    if (error || !data?.success || !data.snapshot) {
                        set({
                            isSyncing: false,
                            isServerHydrated: true,
                            syncError: error?.message ?? data?.error ?? 'Failed to hydrate dossier from server'
                        });
                        return;
                    }

                    const serverSnapshot = normalizeSnapshot(data.snapshot);
                    const localState = get();
                    const useLocalAsSource =
                        serverSnapshot.entries.length === 0 &&
                        serverSnapshot.evidence.length === 0 &&
                        Object.keys(serverSnapshot.flags).length === 0 &&
                        Object.keys(serverSnapshot.pointStates).length === 0 &&
                        localState.isServerHydrated === false &&
                        hasLocalProgress(localState);

                    if (useLocalAsSource) {
                        set({
                            isSyncing: false,
                            isServerHydrated: true,
                            syncError: null
                        });
                        queueSync();
                        return;
                    }

                    set({
                        entries: serverSnapshot.entries,
                        evidence: serverSnapshot.evidence,
                        unlockedDeductions: serverSnapshot.unlockedDeductions,
                        pointStates: serverSnapshot.pointStates,
                        flags: serverSnapshot.flags,
                        activeCaseId: serverSnapshot.activeCaseId,
                        checkStates: serverSnapshot.checkStates,
                        xp: serverSnapshot.xp,
                        level: serverSnapshot.level,
                        devPoints: serverSnapshot.devPoints,
                        traits: serverSnapshot.traits,
                        voiceStats: sanitizeVoiceMap(serverSnapshot.voiceStats, INITIAL_VOICE_STATS),
                        voiceXp: sanitizeVoiceMap(serverSnapshot.voiceXp, INITIAL_VOICE_XP),
                        hypotheses: hydrateHypotheses(serverSnapshot.hypotheses, serverSnapshot.evidence),
                        thoughtPoints: serverSnapshot.thoughtPoints,
                        evidenceHistory: [],
                        isSyncing: false,
                        isServerHydrated: true,
                        syncError: null
                    });
                },

                syncToServer: async () => {
                    const state = get();
                    if (!state.isServerHydrated) {
                        return;
                    }

                    set({ isSyncing: true, syncError: null });
                    const { data, error } = await api.dossier.snapshot.post({
                        body: {
                            snapshot: normalizeSnapshot(toSnapshot(get()))
                        }
                    });

                    if (error || !data?.success || !data.snapshot) {
                        set({
                            isSyncing: false,
                            syncError: error?.message ?? data?.error ?? 'Failed to sync dossier to server'
                        });
                        return;
                    }

                    const synced = normalizeSnapshot(data.snapshot);
                    set({
                        entries: synced.entries,
                        evidence: synced.evidence,
                        unlockedDeductions: synced.unlockedDeductions,
                        pointStates: synced.pointStates,
                        flags: synced.flags,
                        activeCaseId: synced.activeCaseId,
                        checkStates: synced.checkStates,
                        xp: synced.xp,
                        level: synced.level,
                        devPoints: synced.devPoints,
                        traits: synced.traits,
                        voiceStats: sanitizeVoiceMap(synced.voiceStats, INITIAL_VOICE_STATS),
                        voiceXp: sanitizeVoiceMap(synced.voiceXp, INITIAL_VOICE_XP),
                        hypotheses: hydrateHypotheses(synced.hypotheses, synced.evidence),
                        thoughtPoints: synced.thoughtPoints,
                        evidenceHistory: state.evidenceHistory,
                        isSyncing: false,
                        syncError: null
                    });
                }
            };
        },
        {
            name: 'gw4-detective-dossier',
            version: 3,
            migrate: (persistedState, version) => {
                const cast = persistedState as Partial<DetectiveState> | undefined;
                const snapshot = normalizeSnapshot(cast ? {
                    entries: cast.entries,
                    evidence: cast.evidence,
                    unlockedDeductions: cast.unlockedDeductions,
                    pointStates: cast.pointStates,
                    flags: cast.flags,
                    activeCaseId: cast.activeCaseId,
                    checkStates: cast.checkStates,
                    xp: cast.xp,
                    level: cast.level,
                    devPoints: cast.devPoints,
                    traits: cast.traits,
                    voiceStats: cast.voiceStats,
                    voiceXp: cast.voiceXp,
                    hypotheses: cast.hypotheses ? toSnapshotHypotheses(cast.hypotheses as Record<string, HypothesisState>) : undefined,
                    thoughtPoints: cast.thoughtPoints
                } as DossierSnapshot : null);

                const migratedHistory = version >= 3
                    ? sanitizeEvidenceHistory(cast?.evidenceHistory)
                    : [];

                return {
                    ...cast,
                    ...snapshot,
                    hypotheses: hydrateHypotheses(snapshot.hypotheses, snapshot.evidence),
                    thoughtPoints: snapshot.thoughtPoints,
                    evidenceHistory: migratedHistory,
                    isServerHydrated: false,
                    isSyncing: false,
                    syncError: null
                };
            }
        }
    )
);
