import { CHARACTERS, type CharacterId, type MajorCharacter } from '@repo/shared/data/characters';
import { getQuestStageSequence } from '@repo/shared/data/quests';

export interface PsycheProfileInput {
    flags: Record<string, boolean>;
    factions: Array<{ factionId: string; reputation: number }>;
    checkStates: Record<string, 'passed' | 'failed' | 'locked'>;
    traits: string[];
    questStages: Record<string, string>;
    relationships: Record<string, number>;
}

type SecretCategory = 'network' | 'case' | 'personal';
type AlignmentTier = 'unaligned' | 'civic_order' | 'underworld' | 'financial' | 'contested';

interface SecretDefinition {
    id: string;
    category: SecretCategory;
    title: string;
    description: string;
    hint: string;
    unlock: (ctx: PsycheProfileInput) => boolean;
}

export interface PsycheSecretState {
    id: string;
    category: SecretCategory;
    title: string;
    description: string;
    hint: string;
    unlocked: boolean;
}

export interface PsycheFactionSignal {
    factionId: string;
    label: string;
    reputation: number;
    color: string;
    intensity: number;
}

export interface PsycheAlignmentSummary {
    tier: AlignmentTier;
    label: string;
    description: string;
    theme: {
        from: string;
        via: string;
        to: string;
        glow: string;
    };
}

export interface PsycheEvolutionTrack {
    id: string;
    title: string;
    stage: string;
    progressPercent: number;
    notes: string;
}

export interface PsycheChecksSummary {
    passed: number;
    failed: number;
    locked: number;
    confidencePercent: number;
}

export interface PsycheProfileData {
    alignment: PsycheAlignmentSummary;
    factionSignals: PsycheFactionSignal[];
    secrets: PsycheSecretState[];
    evolutionTracks: PsycheEvolutionTrack[];
    checks: PsycheChecksSummary;
}

const FACTION_META: Record<string, { label: string; color: string }> = {
    fct_police: { label: 'Institutional Order', color: '#60a5fa' },
    fct_underworld: { label: 'Tunnel Syndicate', color: '#f97316' },
    fct_bankers: { label: 'Banking Circle', color: '#facc15' }
};

const SECRET_DEFINITIONS: SecretDefinition[] = [
    {
        id: 'knowledge_tunnel_network',
        category: 'network',
        title: 'Tunnel Network Contact',
        description: 'You have an operational line into Freiburg\'s smuggling arteries.',
        hint: 'Earn underworld trust or establish a direct contact.',
        unlock: (ctx) => Boolean(ctx.flags.underworld_contact) || getFactionReputation(ctx, 'fct_underworld') >= 2
    },
    {
        id: 'knowledge_ledger_gap',
        category: 'case',
        title: 'Ledger Discrepancy',
        description: 'Financial records around the robbery do not match official testimony.',
        hint: 'Inspect the vault and cross-check witness statements.',
        unlock: (ctx) => Boolean(ctx.flags.vault_inspected) && Boolean(ctx.flags.clerk_interviewed)
    },
    {
        id: 'knowledge_press_channel',
        category: 'network',
        title: 'Press Backchannel',
        description: 'A journalist channel can leak or sanitize sensitive details.',
        hint: 'Build trust with press-facing characters and keep intel flowing.',
        unlock: (ctx) => Boolean(ctx.flags.anna_knows_secret) || Boolean(ctx.flags.met_anna_intro)
    },
    {
        id: 'knowledge_university_trace',
        category: 'case',
        title: 'University Trace',
        description: 'The case intersects with academic labs and restricted expertise.',
        hint: 'Follow residue analysis and chemistry leads.',
        unlock: (ctx) => Boolean(ctx.flags.found_residue) || Boolean(ctx.flags.knows_university_connection)
    },
    {
        id: 'knowledge_shadow_testimony',
        category: 'personal',
        title: 'Shadow Testimony',
        description: 'A witness statement implies actors beyond the official suspect frame.',
        hint: 'Push deeper during clerk interrogation.',
        unlock: (ctx) => Boolean(ctx.flags.clerk_revealed_shadow)
    },
    {
        id: 'knowledge_wire_intel',
        category: 'network',
        title: 'Wire Intelligence Access',
        description: 'You now have selective access to communication relays and routed intel.',
        hint: 'Complete operator-linked investigative beats.',
        unlock: (ctx) => Boolean(ctx.flags.intel_network_access)
    }
];

const ALIGNMENT_META: Record<AlignmentTier, PsycheAlignmentSummary> = {
    unaligned: {
        tier: 'unaligned',
        label: 'Unaligned Observer',
        description: 'You keep channels open and avoid firm ideological capture.',
        theme: {
            from: '#0c0a09',
            via: '#1c1917',
            to: '#111827',
            glow: 'rgba(120, 113, 108, 0.28)'
        }
    },
    civic_order: {
        tier: 'civic_order',
        label: 'Civic Order',
        description: 'Procedure and institutions shape your current investigative posture.',
        theme: {
            from: '#0b1220',
            via: '#10233f',
            to: '#0f172a',
            glow: 'rgba(96, 165, 250, 0.33)'
        }
    },
    underworld: {
        tier: 'underworld',
        label: 'Underworld Sympathizer',
        description: 'Street channels and tunnel actors now anchor your field operations.',
        theme: {
            from: '#1a1209',
            via: '#2b1a0f',
            to: '#171717',
            glow: 'rgba(249, 115, 22, 0.35)'
        }
    },
    financial: {
        tier: 'financial',
        label: 'Financial Compact',
        description: 'Banking influence and elite structure are steering your momentum.',
        theme: {
            from: '#14110a',
            via: '#2d2412',
            to: '#171717',
            glow: 'rgba(250, 204, 21, 0.30)'
        }
    },
    contested: {
        tier: 'contested',
        label: 'Contested Alignment',
        description: 'Competing factions are in near parity. Your position is volatile.',
        theme: {
            from: '#1b1022',
            via: '#1e293b',
            to: '#171717',
            glow: 'rgba(168, 85, 247, 0.30)'
        }
    }
};

const slugToLabel = (value: string): string =>
    value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');

const getFactionReputation = (ctx: PsycheProfileInput, factionId: string): number =>
    ctx.factions.find((entry) => entry.factionId === factionId)?.reputation ?? 0;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const resolveAlignment = (signals: PsycheFactionSignal[]): PsycheAlignmentSummary => {
    const ranked = [...signals].sort((a, b) => b.reputation - a.reputation);
    const leader = ranked[0];
    const runnerUp = ranked[1];

    if (!leader || leader.reputation < 2) {
        return ALIGNMENT_META.unaligned;
    }

    if (runnerUp && Math.abs(leader.reputation - runnerUp.reputation) <= 1) {
        return ALIGNMENT_META.contested;
    }

    if (leader.factionId === 'fct_police') {
        return ALIGNMENT_META.civic_order;
    }
    if (leader.factionId === 'fct_underworld') {
        return ALIGNMENT_META.underworld;
    }
    if (leader.factionId === 'fct_bankers') {
        return ALIGNMENT_META.financial;
    }

    return ALIGNMENT_META.unaligned;
};

const resolveCaseTrack = (ctx: PsycheProfileInput): PsycheEvolutionTrack => {
    const case01Stages = getQuestStageSequence('case01') ?? [];
    const currentStage = ctx.questStages.case01 ?? 'not_started';
    const index = case01Stages.indexOf(currentStage);
    const safeIndex = index >= 0 ? index : 0;
    const denominator = Math.max(1, case01Stages.length - 1);
    const progressPercent = Math.round((safeIndex / denominator) * 100);

    return {
        id: 'track_case01_method',
        title: 'Case 01 Investigative Arc',
        stage: slugToLabel(currentStage),
        progressPercent,
        notes: progressPercent >= 75
            ? 'Endgame pressure: your procedural choices now define the city response.'
            : 'Mid-case: resolve leads to reveal doctrine-level consequences.'
    };
};

const getEvolutionCharacters = (): MajorCharacter[] =>
    Object.values(CHARACTERS).filter(
        (character): character is MajorCharacter => character.tier === 'major' && Boolean(character.evolution)
    );

const resolveCharacterEvolutionTrack = (
    character: MajorCharacter,
    ctx: PsycheProfileInput
): PsycheEvolutionTrack => {
    const stages = character.evolution?.possibleStages ?? [];
    if (stages.length === 0) {
        return {
            id: `track_${character.id}`,
            title: `${character.name} Arc`,
            stage: 'N/A',
            progressPercent: 0,
            notes: 'No staged evolution metadata.'
        };
    }

    const relationship = ctx.relationships[character.id] ?? 0;
    let stageIndex = 0;

    if (relationship >= 45) {
        stageIndex = Math.min(2, stages.length - 1);
    } else if (relationship >= 20) {
        stageIndex = Math.min(1, stages.length - 1);
    }

    if (character.id === 'assistant' && ctx.flags.victoria_quest_complete) {
        stageIndex = stages.length - 1;
    }
    if (character.id === 'clara_altenburg' && ctx.flags.clara_respect_earned && stageIndex < 1) {
        stageIndex = Math.min(1, stages.length - 1);
    }

    const denominator = Math.max(1, stages.length - 1);
    const progressPercent = Math.round((stageIndex / denominator) * 100);

    return {
        id: `track_${character.id}`,
        title: `${character.name} Evolution`,
        stage: slugToLabel(stages[stageIndex] ?? character.evolution?.stage ?? 'unknown'),
        progressPercent,
        notes: relationship >= 0
            ? `Relationship pressure: ${relationship >= 0 ? '+' : ''}${relationship}`
            : `Relationship pressure: ${relationship}`
    };
};

const resolveChecksSummary = (ctx: PsycheProfileInput): PsycheChecksSummary => {
    const values = Object.values(ctx.checkStates);
    const passed = values.filter((value) => value === 'passed').length;
    const failed = values.filter((value) => value === 'failed').length;
    const locked = values.filter((value) => value === 'locked').length;
    const resolved = passed + failed;
    const confidencePercent = resolved === 0 ? 0 : Math.round((passed / resolved) * 100);

    return {
        passed,
        failed,
        locked,
        confidencePercent
    };
};

export const buildPsycheProfile = (ctx: PsycheProfileInput): PsycheProfileData => {
    const factionSignals: PsycheFactionSignal[] = Object.entries(FACTION_META).map(([factionId, meta]) => {
        const reputation = getFactionReputation(ctx, factionId);
        return {
            factionId,
            label: meta.label,
            reputation,
            color: meta.color,
            intensity: clamp((reputation + 5) / 10, 0, 1)
        };
    });

    const secrets = SECRET_DEFINITIONS
        .map<PsycheSecretState>((definition) => ({
            id: definition.id,
            category: definition.category,
            title: definition.title,
            description: definition.description,
            hint: definition.hint,
            unlocked: definition.unlock(ctx)
        }))
        .sort((left, right) => Number(right.unlocked) - Number(left.unlocked));

    const characterTracks = getEvolutionCharacters().map((character) => resolveCharacterEvolutionTrack(character, ctx));
    const evolutionTracks: PsycheEvolutionTrack[] = [resolveCaseTrack(ctx), ...characterTracks];

    return {
        alignment: resolveAlignment(factionSignals),
        factionSignals,
        secrets,
        evolutionTracks,
        checks: resolveChecksSummary(ctx)
    };
};

export const isCharacterId = (value: string): value is CharacterId => value in CHARACTERS;
