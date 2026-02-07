
import { db } from "../db";
import { quests } from "../db/schema";

// --- Case 01 Configuration ---
const CASE01_QUEST = {
    id: "case01",
    title: "Case 01: Shadows at the Bank - Act 1",
    description: "A mysterious robbery at Bankhaus J.A. Krebs. No witnesses, strange traces. Investigate the crime scene.",
    objectives: [
        {
            id: "inspect_safe",
            text: "Inspect the Vault",
            condition: { type: "flag", flag: "EVIDENCE_SAFE_CRACKED" }
        },
        {
            id: "interrogate_clerk",
            text: "Talk to the Teller",
            condition: { type: "flag", flag: "INTERROGATION_CLERK_DONE" }
        }
    ],
    completionCondition: {
        type: "logic_and",
        conditions: [
            { type: "flag", flag: "EVIDENCE_SAFE_CRACKED" },
            { type: "flag", flag: "INTERROGATION_CLERK_DONE" }
        ]
    },
    rewards: {
        xp: 150,
        traits: ["observant"]
    }
};

async function main() {
    console.log("📜 Seeding Quests...");

    // 1. Upsert Case 01
    await db.insert(quests).values(CASE01_QUEST)
        .onConflictDoUpdate({
            target: quests.id,
            set: CASE01_QUEST
        });

    console.log("✅ Quests seeded!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
