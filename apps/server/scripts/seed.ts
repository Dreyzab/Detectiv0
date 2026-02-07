import { db } from "../src/db";
import { cases, caseObjectives } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("🌱 Seeding DB...");

    const caseId = "case_01_bank";

    // 1. Ensure Case Exists
    try {
        const existingCase = await db.query.cases.findFirst({
            where: eq(cases.id, caseId)
        });

        if (!existingCase) {
            console.log(`Creating case: ${caseId}`);
            await db.insert(cases).values({
                id: caseId,
                title: "Bank Heist",
                description: "Investigate the bank robbery.",
                active: true,
                data: {}
            });
        } else {
            console.log(`Case ${caseId} already exists.`);
        }

        // 2. Ensure Objectives Exist
        const objectives = [
            {
                id: 'obj_find_clara',
                caseId: caseId,
                title: 'Find Clara',
                description: null,
                sortOrder: 1,
                locationId: 'p_bank',
                data: { style: 'investigation' }
            },
            {
                id: 'obj_search_bank_cell',
                caseId: caseId,
                title: 'Search Clara Cell',
                description: null,
                sortOrder: 2,
                locationId: 'p_bank',
                data: { style: 'contradiction' }
            }
        ];

        for (const obj of objectives) {
            await db.insert(caseObjectives).values(obj).onConflictDoNothing();
            console.log(`Ensured objective: ${obj.id}`);
        }

    } catch (e: any) {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    }

    console.log("✅ Seeding complete.");
    process.exit(0);
}

main();
