
import type { MapPointBinding, MapCondition, TriggerType, PointStateEnum } from '../data/map';

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
            return (ctx.pointStates[condition.pointId] ?? 'locked') === condition.state;
        case 'logic_and':
            return condition.conditions.every(c => checkCondition(c, ctx));
        case 'logic_or':
            return condition.conditions.some(c => checkCondition(c, ctx));
        case 'logic_not':
            return !checkCondition(condition.condition, ctx);
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

export interface AvailableInteraction {
    binding: MapPointBinding;
    isAvailable: boolean; // conditions met
    reason?: string; // why disabled (optional)
}

/**
 * Returns ALL bindings that match the trigger, sorted by priority.
 * Useful for building the interaction menu.
 */
export const resolveAvailableInteractions = (
    bindings: MapPointBinding[],
    trigger: TriggerType,
    ctx: ResolutionContext
): AvailableInteraction[] => {
    return bindings
        .filter(b => b.trigger === trigger)
        .map(b => ({
            binding: b,
            isAvailable: checkConditions(b.conditions, ctx)
        }))
        .sort((a, b) => (b.binding.priority || 0) - (a.binding.priority || 0));
};

/**
 * Returns the single BEST action to execute immediately (if any).
 * Useful for "auto-trigger" logic (e.g. arrive -> auto-play dialog).
 */
export const resolveAutoInteraction = (
    bindings: MapPointBinding[],
    trigger: TriggerType,
    ctx: ResolutionContext
): MapPointBinding | null => {
    const interactions = resolveAvailableInteractions(bindings, trigger, ctx);
    // Return the first available high-priority interaction
    const best = interactions.find(i => i.isAvailable);
    return best ? best.binding : null;
};
