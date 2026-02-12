import { db } from '../db';
import { mapPoints, userMapPointStates } from '../db/schema';
import type { MapPointCategory, MapPointBinding, MapCondition } from '@repo/shared';
import { CASE_01_POINTS } from './data/case_01_points';
import { resolvePointLifecycle } from './data/point_lifecycle';
import { SANDBOX_KA_POINTS } from './data/sandbox_ka_points';
import { resolveSandboxPointLifecycle } from './data/sandbox_ka_lifecycle';

const mapCategory = (type: string): MapPointCategory => {
    switch (type) {
        case 'crime': return 'CRIME_SCENE';
        case 'npc': return 'NPC';
        case 'support': return 'NPC';
        case 'bureau': return 'QUEST';
        case 'interest': return 'INTEREST';
        default: return 'INTEREST';
    }
};

const mapBinding = (binding: Record<string, unknown>): MapPointBinding => {
    const condition = binding.condition as MapCondition | undefined;
    const conditions = binding.conditions as MapCondition[] | undefined;
    const rawConditions: MapCondition[] = conditions || (condition ? [condition] : []);

    return {
        id: String(binding.id),
        trigger: binding.trigger as MapPointBinding['trigger'],
        label: typeof binding.label === 'string' ? binding.label : undefined,
        priority: typeof binding.priority === 'number' ? binding.priority : 0,
        conditions: rawConditions.length > 0 ? rawConditions : undefined,
        actions: (binding.actions as MapPointBinding['actions']) ?? []
    };
};

const main = async () => {
    console.log('Seeding map points...');
    const hardReset = process.env.SEED_HARD_RESET === '1';

    if (hardReset) {
        try {
            await db.delete(userMapPointStates);
            await db.delete(mapPoints);
            console.log('Hard reset enabled: cleared map_points and user_map_point_user_states');
        } catch (error) {
            console.warn('Could not clear tables before seeding:', error);
        }
    }

    const points = [
        ...Object.values(CASE_01_POINTS),
        ...Object.values(SANDBOX_KA_POINTS)
    ];
    let upsertedCount = 0;

    for (const point of points) {
        const category = mapCategory(point.type);
        const lifecycle = point.packId === 'ka1905'
            ? resolveSandboxPointLifecycle(point.id)
            : resolvePointLifecycle(point.id);

        const additionalData: Record<string, unknown> = {};
        if (point.voices) {
            additionalData.voices = point.voices;
        }
        if (typeof point.iconOverride === 'string' && point.iconOverride.trim().length > 0) {
            additionalData.iconOverride = point.iconOverride;
        }
        if (typeof point.isHiddenInitially === 'boolean') {
            additionalData.isHiddenInitially = point.isHiddenInitially;
        }
        if (typeof point.unlockGroup === 'string' && point.unlockGroup.trim().length > 0) {
            additionalData.unlockGroup = point.unlockGroup;
        }

        const bindings = point.bindings.map((binding) => mapBinding(binding as Record<string, unknown>));
        const dataPayload = Object.keys(additionalData).length > 0 ? additionalData : null;

        await db.insert(mapPoints).values({
            id: point.id,
            packId: point.packId,
            scope: lifecycle.scope,
            caseId: lifecycle.caseId,
            retentionPolicy: lifecycle.retentionPolicy,
            defaultState: lifecycle.defaultState,
            active: lifecycle.active,
            title: point.title,
            description: point.description,
            lat: point.lat,
            lng: point.lng,
            category,
            image: point.image,
            bindings,
            data: dataPayload,
            schemaVersion: 1
        }).onConflictDoUpdate({
            target: [mapPoints.id],
            set: {
                packId: point.packId,
                scope: lifecycle.scope,
                caseId: lifecycle.caseId,
                retentionPolicy: lifecycle.retentionPolicy,
                defaultState: lifecycle.defaultState,
                active: lifecycle.active,
                title: point.title,
                description: point.description,
                lat: point.lat,
                lng: point.lng,
                category,
                image: point.image,
                bindings,
                data: dataPayload,
                schemaVersion: 1
            }
        });

        upsertedCount++;
        console.log(`Upserted ${point.title} (${category}) [scope=${lifecycle.scope}, retention=${lifecycle.retentionPolicy}]`);
    }

    console.log(`Seed complete. Upserted ${upsertedCount} map points.`);
    process.exit(0);
};

if (import.meta.main) {
    main().catch((error) => {
        console.error('Map seed failed:', error);
        process.exit(1);
    });
}
