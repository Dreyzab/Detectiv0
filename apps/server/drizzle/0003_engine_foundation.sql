CREATE TABLE "world_clocks" (
	"user_id" text PRIMARY KEY NOT NULL,
	"tick" integer DEFAULT 0 NOT NULL,
	"phase" text DEFAULT 'morning' NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city_routes" (
	"id" text PRIMARY KEY NOT NULL,
	"from_location_id" text NOT NULL,
	"to_location_id" text NOT NULL,
	"mode" text DEFAULT 'walk' NOT NULL,
	"eta_ticks" integer DEFAULT 1 NOT NULL,
	"risk_level" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "travel_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"from_location_id" text NOT NULL,
	"to_location_id" text NOT NULL,
	"route_id" text,
	"mode" text DEFAULT 'walk' NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"started_tick" integer NOT NULL,
	"eta_ticks" integer NOT NULL,
	"arrival_tick" integer,
	"beat_type" text DEFAULT 'none',
	"beat_payload" jsonb,
	"meta" jsonb,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "case_objectives" (
	"id" text PRIMARY KEY NOT NULL,
	"case_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"location_id" text,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_case_progress" (
	"user_id" text NOT NULL,
	"case_id" text NOT NULL,
	"current_objective_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_advanced_tick" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_case_progress_user_id_case_id_pk" PRIMARY KEY("user_id","case_id")
);
--> statement-breakpoint
CREATE TABLE "player_progression" (
	"user_id" text PRIMARY KEY NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"trait_points" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_progression" (
	"user_id" text NOT NULL,
	"voice_id" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "voice_progression_user_id_voice_id_pk" PRIMARY KEY("user_id","voice_id")
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_faction_reputation" (
	"user_id" text NOT NULL,
	"faction_id" text NOT NULL,
	"reputation" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_faction_reputation_user_id_faction_id_pk" PRIMARY KEY("user_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "user_character_relations" (
	"user_id" text NOT NULL,
	"character_id" text NOT NULL,
	"trust" integer DEFAULT 0 NOT NULL,
	"last_interaction_tick" integer,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_character_relations_user_id_character_id_pk" PRIMARY KEY("user_id","character_id")
);
--> statement-breakpoint
CREATE TABLE "evidence_catalog" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"contradicts_id" text,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_evidence" (
	"user_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	"source_scene_id" text,
	"source_event_id" text,
	"discovered_tick" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_evidence_user_id_evidence_id_pk" PRIMARY KEY("user_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "domain_event_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tick" integer NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "world_clocks" ADD CONSTRAINT "world_clocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "travel_sessions" ADD CONSTRAINT "travel_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "case_objectives" ADD CONSTRAINT "case_objectives_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_case_progress" ADD CONSTRAINT "user_case_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_case_progress" ADD CONSTRAINT "user_case_progress_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "player_progression" ADD CONSTRAINT "player_progression_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "voice_progression" ADD CONSTRAINT "voice_progression_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_faction_reputation" ADD CONSTRAINT "user_faction_reputation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_faction_reputation" ADD CONSTRAINT "user_faction_reputation_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_character_relations" ADD CONSTRAINT "user_character_relations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_evidence" ADD CONSTRAINT "user_evidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_evidence" ADD CONSTRAINT "user_evidence_evidence_id_evidence_catalog_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence_catalog"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "domain_event_log" ADD CONSTRAINT "domain_event_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

