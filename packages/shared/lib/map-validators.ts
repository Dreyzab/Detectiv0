import { z } from 'zod';

export const PointStateSchema = z.enum(['locked', 'discovered', 'visited', 'completed']);

export const TriggerTypeSchema = z.enum(['marker_click', 'qr_scan', 'arrive']);

// --- Condition DSL Schema ---

// Recursive schema definition needs lazy evaluation
export const MapConditionSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        z.object({ type: z.literal('flag_is'), flagId: z.string(), value: z.boolean() }),
        z.object({ type: z.literal('item_count'), itemId: z.string(), min: z.number() }),
        z.object({ type: z.literal('point_state'), pointId: z.string(), state: PointStateSchema }),
        z.object({ type: z.literal('logic_and'), conditions: z.array(MapConditionSchema) }),
        z.object({ type: z.literal('logic_or'), conditions: z.array(MapConditionSchema) }),
        z.object({ type: z.literal('logic_not'), conditions: z.array(MapConditionSchema) }), // Keeping logic_not array for consistency with logic_and/or, though single condition is often better. Let's stick to array or update type. Wait, previous type had `condition: MapCondition`. Let's support both or fix.
        // Fixing to match previous logic_not structure:
        z.object({ type: z.literal('not'), condition: MapConditionSchema })
    ])
);

// --- Action DSL Schema ---

export const MapActionSchema = z.union([
    z.object({ type: z.literal('start_vn'), scenarioId: z.string() }),
    z.object({ type: z.literal('unlock_point'), pointId: z.string(), silent: z.boolean().optional() }),
    z.object({ type: z.literal('grant_evidence'), evidenceId: z.string() }),
    z.object({ type: z.literal('add_flags'), flags: z.array(z.string()) }),
    z.object({ type: z.literal('start_battle'), battleId: z.string() }),
    z.object({ type: z.literal('unlock_entry'), entryId: z.string() }),
    z.object({ type: z.literal('set_active_case'), caseId: z.string() }),
    z.object({ type: z.literal('show_toast'), message: z.string(), variant: z.enum(['info', 'success', 'warning']).optional() }),
    // Legacy support
    // Legacy / Extra
    z.object({ type: z.literal('set_flag'), flagId: z.string(), value: z.boolean() }),
    z.object({ type: z.literal('teleport'), targetPointId: z.string() }),
    z.object({ type: z.literal('open_trade'), shopId: z.string() })
]);

// --- Binding Schema ---

export const MapPointBindingSchema = z.object({
    id: z.string(),
    trigger: TriggerTypeSchema,
    label: z.string().optional(),
    priority: z.number().default(0),
    conditions: z.array(MapConditionSchema).optional(), // Implicit AND
    actions: z.array(MapActionSchema)
});

// --- MapPoint Schema ---

export const MapPointCategorySchema = z.enum([
    'CRIME_SCENE', 'NPC', 'QUEST', 'EVENT', 'ACTIVITY', 'INTEREST', 'TRAVEL'
]);

export const MapPointSchema = z.object({
    id: z.string(),
    title: z.string(),
    category: MapPointCategorySchema,
    lat: z.number(),
    lng: z.number(),
    description: z.string().optional(),
    image: z.string().optional(),

    packId: z.string(),
    caseId: z.string().optional(),
    bindings: z.array(MapPointBindingSchema),

    iconOverride: z.string().optional(),
    isHiddenInitially: z.boolean().optional(),
    data: z.record(z.string(), z.any()).optional()
});

// --- Inferred Types ---

export type PointStateEnum = z.infer<typeof PointStateSchema>;
export type TriggerType = z.infer<typeof TriggerTypeSchema>;
export type MapCondition = z.infer<typeof MapConditionSchema>;
export type MapAction = z.infer<typeof MapActionSchema>;
export type MapPointBinding = z.infer<typeof MapPointBindingSchema>;
export type MapPointCategory = z.infer<typeof MapPointCategorySchema>;
export type MapPoint = z.infer<typeof MapPointSchema>;
