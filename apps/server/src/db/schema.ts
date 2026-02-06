import { pgTable, text, timestamp, doublePrecision, primaryKey, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email"),
    createdAt: timestamp("created_at").notNull(),
});

export const scenarios = pgTable("scenarios", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: jsonb("content"), // JSON content
    authorId: text("author_id").references(() => users.id),
});

export const items = pgTable("items", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    data: jsonb("data"), // JSON specific data
});

export const mapPoints = pgTable("map_points", {
    id: text("id").primaryKey(),
    packId: text("packId").notNull(),
    scope: text("scope").notNull().default('case'), // global | case | progression
    caseId: text("case_id"),
    retentionPolicy: text("retention_policy").notNull().default('temporary'), // temporary | persistent_on_unlock | permanent
    defaultState: text("default_state").notNull().default('locked'),
    active: boolean("active").notNull().default(true),
    title: text("title").notNull(),
    description: text("description"),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    category: text("category").notNull(), // CRIME_SCENE|NPC|QUEST|EVENT|ACTIVITY|INTEREST|TRAVEL
    image: text("image"),                 // /images/detective/loc_xxx.png
    qrCode: text("qr_code"),
    bindings: jsonb("bindings").notNull(), // JSON, validated schema
    data: jsonb("data"),                   // Other JSON fields (voices, etc.)
    schemaVersion: integer("schema_version").default(1),
});

export const userMapPointStates = pgTable("user_map_point_user_states", {
    userId: text("user_id").references(() => users.id).notNull(),
    pointId: text("point_id").references(() => mapPoints.id).notNull(),
    state: text("state").notNull(), // 'locked', 'discovered', 'visited', 'completed'
    persistentUnlock: boolean("persistent_unlock").notNull().default(false),
    unlockedByCaseId: text("unlocked_by_case_id"),
    data: jsonb("data"), // JSON for specific flags/counters for this point
    meta: jsonb("meta"),
}, (table) => [
    primaryKey({ columns: [table.userId, table.pointId] })
]);


// --- QUESTS SYSTEM (v2) ---
export const quests = pgTable("quests", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    // Structure: [{ id, text, condition: { type: "flag", flag: "X" } }]
    objectives: jsonb("objectives").notNull(),
    // DSL: { type: "AND", conditions: [...] }
    completionCondition: jsonb("completion_condition"),
    // Rewards: { xp: 100, traits: ["detective"] }
    rewards: jsonb("rewards")
});

export const userQuests = pgTable("user_quests", {
    userId: text("user_id").notNull(),
    questId: text("quest_id").notNull(),
    status: text("status").notNull(), // active | completed
    completedAt: timestamp("completed_at"),
    rewardsClaimed: boolean("rewards_claimed").default(false),
}, (t) => [
    primaryKey({ columns: [t.userId, t.questId] }),
]);

// --- VN / DETECTIVE PERSISTENCE ---
export const detectiveSaves = pgTable("detective_saves", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    slotId: integer("slot_id").notNull(), // 0=Auto, 1-9=Manual
    data: jsonb("data").notNull(), // JSON blob of creating Store state
    timestamp: timestamp("timestamp").notNull(),
}, (t) => [
    primaryKey({ columns: [t.userId, t.slotId] }),
]);

// --- EVENT CODES (QR / MANUAL) ---
export const eventCodes = pgTable("event_codes", {
    code: text("code").primaryKey(), // The scanner code (CASE01_BRIEFING_01)
    actions: jsonb("actions").notNull(), // List of actions to execute
    active: boolean("active").default(true),
    description: text("description"), // For admin/logging
});
