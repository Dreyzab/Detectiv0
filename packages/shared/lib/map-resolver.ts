
import type { MapPointBinding, MapCondition, TriggerType, PointStateEnum } from './detective_map_types';

export interface ResolutionContext {
    flags: Record<string, boolean>;
    inventory: Record<string, number>;
    pointStates: Record<string, PointStateEnum>;
}

// --- Condition Resolver ---

export const checkCondition = (condition: MapCondition, ctx: ResolutionContext): boolean => {
    switch (condition.type) {
        case 'flag_is':
            return (ctx.flags[condition.flagId] ?? false) === condition.value;
        case 'item_count':
            return (ctx.inventory[condition.itemId] ?? 0) >= condition.min;
        case 'point_state':
            // Provide default 'locked' if state is missing
            return (ctx.pointStates[condition.pointId] ?? 'locked') === condition.state;
        case 'logic_and':
            return condition.conditions.every((c: MapCondition) => checkCondition(c, ctx));
        case 'logic_or':
            return condition.conditions.some((c: MapCondition) => checkCondition(c, ctx));
        case 'not':
            return !checkCondition(condition.condition, ctx); // Standard 'not'
        case 'logic_not':
            // Handling legacy 'logic_not' if it sneaks in.
            // If schema defined logic_not as array, we might need a change.
            // But strict schema says 'not' with singular 'condition'.
            // Keeping fall-through or error if types don't match.
            // For now, let's assume valid data passes schema.
            // If the schema allowed 'logic_not' with 'conditions' array (as mistakenly written in previous step comment but fixed in actual schema union?),
            // let's stick to the cleanest implementation.
            // My Zod schema has: z.object({ type: z.literal('not'), condition: MapConditionSchema })
            // So we implement 'not'.
            return false;
        default:
            console.warn(`Unknown condition type: ${(condition as any).type}`);
            return false;
    }
};

export const checkConditions = (conditions: MapCondition[] | undefined, ctx: ResolutionContext): boolean => {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every(c => checkCondition(c, ctx));
};

// --- Binding Resolver ---

export interface ResolverOption {
    binding: MapPointBinding;
    enabled: boolean; // conditions met
    disabledReason?: string; // why disabled (optional)
}

/**
 * Returns ALL bindings that match the trigger, sorted by priority.
 * Useful for building the interaction menu.
 */
export const resolveAvailableInteractions = (
    bindings: MapPointBinding[] | string | undefined,
    trigger: TriggerType,
    ctx: ResolutionContext
): ResolverOption[] => {
    // Handle bindings as JSON string (from DB) or array
    let parsed: MapPointBinding[];
    if (!bindings) {
        return [];
    }
    if (typeof bindings === 'string') {
        try {
            parsed = JSON.parse(bindings);
        } catch {
            console.warn('Failed to parse bindings JSON');
            return [];
        }
    } else if (Array.isArray(bindings)) {
        parsed = bindings;
    } else {
        console.warn('Invalid bindings type:', typeof bindings);
        return [];
    }

    return parsed
        .filter(b => b.trigger === trigger)
        .map(b => ({
            binding: b,
            enabled: checkConditions(b.conditions, ctx)
        }))
        .sort((a, b) => (b.binding.priority || 0) - (a.binding.priority || 0));
};

/**
 * Returns the single BEST action to execute immediately (if any).
 * Useful for "auto-trigger" logic (e.g. arrive -> auto-play dialog).
 */
export const resolveAutoInteraction = (
    bindings: MapPointBinding[] | string | undefined,
    trigger: TriggerType,
    ctx: ResolutionContext
): MapPointBinding | null => {
    const interactions = resolveAvailableInteractions(bindings, trigger, ctx);
    // Return the first available high-priority interaction
    const best = interactions.find(i => i.enabled);
    return best ? best.binding : null;
};
