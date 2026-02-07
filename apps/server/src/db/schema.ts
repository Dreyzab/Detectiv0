import { pgTable, text, timestamp, doublePrecision, primaryKey, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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

export const userInventorySnapshots = pgTable("user_inventory_snapshots", {
    userId: text("user_id").references(() => users.id).notNull().primaryKey(),
    money: integer("money").notNull().default(0),
    items: jsonb("items").notNull(),
    updatedAt: timestamp("updated_at").notNull()
});

export const userDossierSnapshots = pgTable("user_dossier_snapshots", {
    userId: text("user_id").references(() => users.id).notNull().primaryKey(),
    data: jsonb("data").notNull(),
    updatedAt: timestamp("updated_at").notNull()
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
    stage: text("stage").notNull().default('not_started'),
    completedObjectiveIds: jsonb("completed_objective_ids").notNull().default(sql`'[]'::jsonb`),
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

// --- DETECTIVE ENGINE: GLOBAL PROGRESSION / WORLD SIMULATION ---

export const worldClocks = pgTable("world_clocks", {
    userId: text("user_id").references(() => users.id).notNull().primaryKey(),
    tick: integer("tick").notNull().default(0),
    phase: text("phase").notNull().default('morning'),
    updatedAt: timestamp("updated_at").notNull()
});

export const cityRoutes = pgTable("city_routes", {
    id: text("id").primaryKey(),
    fromLocationId: text("from_location_id").notNull(),
    toLocationId: text("to_location_id").notNull(),
    mode: text("mode").notNull().default('walk'),
    etaTicks: integer("eta_ticks").notNull().default(1),
    riskLevel: integer("risk_level").notNull().default(0),
    active: boolean("active").notNull().default(true),
    data: jsonb("data")
});

export const travelSessions = pgTable("travel_sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    fromLocationId: text("from_location_id").notNull(),
    toLocationId: text("to_location_id").notNull(),
    routeId: text("route_id"),
    mode: text("mode").notNull().default('walk'),
    status: text("status").notNull().default('in_progress'),
    startedTick: integer("started_tick").notNull(),
    etaTicks: integer("eta_ticks").notNull(),
    arrivalTick: integer("arrival_tick"),
    beatType: text("beat_type").default('none'),
    beatPayload: jsonb("beat_payload"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at").notNull()
});

export const cases = pgTable("cases", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    active: boolean("active").notNull().default(true),
    data: jsonb("data")
});

export const caseObjectives = pgTable("case_objectives", {
    id: text("id").primaryKey(),
    caseId: text("case_id").references(() => cases.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    locationId: text("location_id"),
    data: jsonb("data")
});

export const userCaseProgress = pgTable("user_case_progress", {
    userId: text("user_id").references(() => users.id).notNull(),
    caseId: text("case_id").references(() => cases.id).notNull(),
    currentObjectiveId: text("current_objective_id").notNull(),
    status: text("status").notNull().default('active'),
    updatedAt: timestamp("updated_at").notNull(),
    lastAdvancedTick: integer("last_advanced_tick").notNull().default(0)
}, (t) => [
    primaryKey({ columns: [t.userId, t.caseId] })
]);

export const playerProgression = pgTable("player_progression", {
    userId: text("user_id").references(() => users.id).notNull().primaryKey(),
    xp: integer("xp").notNull().default(0),
    level: integer("level").notNull().default(1),
    traitPoints: integer("trait_points").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull()
});

export const voiceProgression = pgTable("voice_progression", {
    userId: text("user_id").references(() => users.id).notNull(),
    voiceId: text("voice_id").notNull(),
    xp: integer("xp").notNull().default(0),
    level: integer("level").notNull().default(1),
    updatedAt: timestamp("updated_at").notNull()
}, (t) => [
    primaryKey({ columns: [t.userId, t.voiceId] })
]);

export const factions = pgTable("factions", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    data: jsonb("data")
});

export const userFactionReputation = pgTable("user_faction_reputation", {
    userId: text("user_id").references(() => users.id).notNull(),
    factionId: text("faction_id").references(() => factions.id).notNull(),
    reputation: integer("reputation").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull()
}, (t) => [
    primaryKey({ columns: [t.userId, t.factionId] })
]);

export const userCharacterRelations = pgTable("user_character_relations", {
    userId: text("user_id").references(() => users.id).notNull(),
    characterId: text("character_id").notNull(),
    trust: integer("trust").notNull().default(0),
    lastInteractionTick: integer("last_interaction_tick"),
    updatedAt: timestamp("updated_at").notNull()
}, (t) => [
    primaryKey({ columns: [t.userId, t.characterId] })
]);

export const evidenceCatalog = pgTable("evidence_catalog", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    contradictsId: text("contradicts_id"),
    data: jsonb("data")
});

export const userEvidence = pgTable("user_evidence", {
    userId: text("user_id").references(() => users.id).notNull(),
    evidenceId: text("evidence_id").references(() => evidenceCatalog.id).notNull(),
    sourceSceneId: text("source_scene_id"),
    sourceEventId: text("source_event_id"),
    discoveredTick: integer("discovered_tick").notNull().default(0)
}, (t) => [
    primaryKey({ columns: [t.userId, t.evidenceId] })
]);

export const domainEventLog = pgTable("domain_event_log", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    tick: integer("tick").notNull(),
    type: text("type").notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at").notNull()
});
