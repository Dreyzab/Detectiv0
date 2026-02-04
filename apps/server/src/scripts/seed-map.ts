
import { db } from '../db';
import { mapPoints, userMapPointStates } from '../db/schema';
import { DETECTIVE_POINTS, type DetectivePoint } from '@repo/shared/data/points';
import type { MapPoint, MapPointCategory, MapPointBinding, MapCondition } from '@repo/shared';

import { CASE_01_POINTS } from './data/case_01_points';

const mapCategory = (type: string): MapPointCategory => {
    switch (type) {
        case 'crime': return 'CRIME_SCENE';
        // 'support' usually means an NPC or location giving help/resources
        case 'support': return 'NPC';
        case 'bureau': return 'QUEST';
        case 'interest': return 'INTEREST';
        default: return 'INTEREST';
    }
};

const mapBinding = (b: any): MapPointBinding => {
    // Handle singular condition legacy field
    const conditions: MapCondition[] = b.conditions || (b.condition ? [b.condition] : []);

    return {
        id: b.id,
        trigger: b.trigger,
        label: b.label,
        priority: b.priority || 0,
        conditions: conditions.length > 0 ? conditions : undefined,
        actions: b.actions
    };
};

const main = async () => {
    console.log('🌱 Seeding Map Points...');

    // Tables are now handled by Drizzle migrations.
    // Ensure you've run migrations before seeding.

    // 1. Clear existing map points
    // Note: We might want to keep user states if we are just updating content, 
    // but the user said "reseed everything", so we'll clear points. 
    // Foreign key constraints might block deletion if we don't clear states first.
    // However, usually ON DELETE CASCADE isn't set up unless specified.
    // Let's clear states too for a fresh start or risk errors.
    // Actually, preserving user progress is nice, but for dev "reseed everything" usually means data reset.
    // Let's try to delete points. If foreign key fails, we delete states first.

    try {
        await db.delete(userMapPointStates); // Reset user progress for safety in this dev script
        await db.delete(mapPoints);
    } catch (e) {
        console.warn("Could not clear tables, maybe they don't exist yet?", e);
    }

    const points = Object.values(CASE_01_POINTS);
    let count = 0;

    for (const p of points) {
        const category = mapCategory(p.type);

        // Prepare data field (voices only, image is now a direct field)
        const additionalData: Record<string, any> = {};
        if (p.voices) additionalData.voices = p.voices;

        const bindings = p.bindings.map(mapBinding);

        await db.insert(mapPoints).values({
            id: p.id,
            packId: p.packId,
            title: p.title,
            description: p.description,
            lat: p.lat,
            lng: p.lng,
            category: category,
            image: p.image, // Direct field!
            bindings: JSON.stringify(bindings) as any,
            data: Object.keys(additionalData).length > 0 ? JSON.stringify(additionalData) as any : null,
            schemaVersion: 1
        });

        count++;
        console.log(`+ Added ${p.title} (${category})`);
    }

    console.log(`✅ Seeded ${count} map points.`);
};

if (import.meta.main) {
    main().catch(console.error);
}
