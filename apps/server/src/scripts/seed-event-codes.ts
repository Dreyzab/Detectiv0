import { db } from '../db';
import { eventCodes } from '../db/schema';
import type { MapAction } from '@repo/shared';

interface EventCodeSeed {
    code: string;
    description: string;
    actions: MapAction[];
}

const EVENT_CODE_SEEDS: EventCodeSeed[] = [
    {
        code: 'GW4_GATE_FR_HBF',
        description: 'Gateway QR: Freiburg HBF',
        actions: [
            { type: 'set_region', regionId: 'FREIBURG_1905' },
            { type: 'set_active_case', caseId: 'case_01_bank' },
            { type: 'start_vn', scenarioId: 'detective_case1_hbf_arrival' }
        ]
    },
    {
        code: 'GW4_GATE_KA_HBF',
        description: 'Gateway QR: Karlsruhe HBF',
        actions: [
            { type: 'set_region', regionId: 'karlsruhe_default' },
            { type: 'set_active_case', caseId: 'sandbox_karlsruhe' },
            { type: 'start_vn', scenarioId: 'sandbox_intro' }
        ]
    }
];

const seedEventCodes = async (): Promise<void> => {
    console.log('Seeding event codes...');

    for (const row of EVENT_CODE_SEEDS) {
        await db.insert(eventCodes).values({
            code: row.code,
            description: row.description,
            actions: row.actions,
            active: true
        }).onConflictDoUpdate({
            target: eventCodes.code,
            set: {
                description: row.description,
                actions: row.actions,
                active: true
            }
        });

        console.log(`Upserted event code: ${row.code}`);
    }

    console.log(`Seed complete. Upserted ${EVENT_CODE_SEEDS.length} event codes.`);
};

if (import.meta.main) {
    seedEventCodes()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Event codes seed failed:', error);
            process.exit(1);
        });
}
