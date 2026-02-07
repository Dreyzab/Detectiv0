import { db } from "../src/db";
import { users, cases, caseObjectives, userCaseProgress } from "../src/db/schema";
import { eq, and } from "drizzle-orm";
import { ensureUserExists } from "../src/db/user-utils";

async function main() {
    console.log("🔍 Starting DB Debug...");
    // Use a fixed user ID or creates one
    const userId = "debug_user_001";
    const caseId = "case_01_bank";

    try {
        console.log("1. Testing DB Connection & User Creation...");
        await ensureUserExists(userId);
        console.log("✅ User created/ensured:", userId);
    } catch (e: any) {
        console.error("❌ User creation failed:", e);
        // If this fails, we can't proceed much, but let's try to query cases anyway
    }

    try {
        console.log(`2. Checking for Case ID: ${caseId}...`);
        const caseRow = await db.query.cases.findFirst({
            where: eq(cases.id, caseId)
        });
        if (caseRow) {
            console.log("✅ Case found:", caseRow);
        } else {
            console.error("❌ Case NOT found in DB:", caseId);
        }
    } catch (e: any) {
        console.error("❌ Case query failed:", e);
    }

    try {
        console.log(`3. Checking Objectives for Case: ${caseId}...`);
        const objectives = await db.select().from(caseObjectives).where(eq(caseObjectives.caseId, caseId));
        console.log(`✅ Found ${objectives.length} objectives.`);
        if (objectives.length === 0) {
            console.warn("⚠️ No objectives found! This will cause the scenario to look empty.");
        } else {
            console.log(objectives.map(o => ({ id: o.id, title: o.title })));
        }
    } catch (e: any) {
        console.error("❌ Objectives query failed:", e);
    }

    try {
        console.log("4. Checking User Case Progress...");
        // This effectively tests getCaseProgress
        const progress = await db.query.userCaseProgress.findFirst({
            where: and(eq(userCaseProgress.userId, userId), eq(userCaseProgress.caseId, caseId))
        });
        console.log("✅ User Case Progress query successful. Result:", progress ?? "None");
    } catch (e: any) {
        console.error("❌ User Case Progress query failed:", e);
    }

    process.exit(0);
}

main();
