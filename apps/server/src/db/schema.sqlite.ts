import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const scenarios = sqliteTable("scenarios", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content"), // JSON content
    authorId: text("author_id").references(() => users.id),
});

export const items = sqliteTable("items", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    data: text("data"), // JSON specific data
});

export const mapPoints = sqliteTable("map_points", {
    id: text("id").primaryKey(),
    packId: text("packId").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    category: text("category").notNull(), // CRIME_SCENE|NPC|QUEST|EVENT|ACTIVITY|INTEREST|TRAVEL
    image: text("image"),                 // /images/detective/loc_xxx.png
    qrCode: text("qr_code"),
    bindings: text("bindings").notNull(), // JSON, validated schema
    data: text("data"),                   // Other JSON fields (voices, etc.)
    schemaVersion: integer("schema_version").default(1),
});

export const userMapPointStates = sqliteTable("user_map_point_user_states", {
    userId: text("user_id").references(() => users.id).notNull(),
    pointId: text("point_id").references(() => mapPoints.id).notNull(),
    state: text("state").notNull(), // 'locked', 'discovered', 'visited', 'completed'
    data: text("data"), // JSON for specific flags/counters for this point
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.pointId] })
}));


// --- QUESTS SYSTEM (v2) ---
export const quests = sqliteTable("quests", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    // Structure: [{ id, text, condition: { type: "flag", flag: "X" } }]
    objectives: text("objectives").notNull(),
    // DSL: { type: "AND", conditions: [...] }
    completionCondition: text("completion_condition"),
    // Rewards: { xp: 100, traits: ["detective"] }
    rewards: text("rewards")
});

export const userQuests = sqliteTable("user_quests", {
    userId: text("user_id").notNull(),
    questId: text("quest_id").notNull(),
    status: text("status").notNull(), // active | completed
    completedAt: integer("completed_at"),
    rewardsClaimed: integer("rewards_claimed", { mode: 'boolean' }).default(false),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.questId] }),
}));

// --- VN / DETECTIVE PERSISTENCE ---
export const detectiveSaves = sqliteTable("detective_saves", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    slotId: integer("slot_id").notNull(), // 0=Auto, 1-9=Manual
    data: text("data").notNull(), // JSON blob of creating Store state
    timestamp: integer("timestamp").notNull(),
}, (t) => ({
    // Composite unique index to ensure one save per slot per user
    unq: primaryKey({ columns: [t.userId, t.slotId] }),
}));
