CREATE TABLE "detective_saves" (
	"id" text NOT NULL,
	"user_id" text NOT NULL,
	"slot_id" integer NOT NULL,
	"data" jsonb NOT NULL,
	"timestamp" timestamp NOT NULL,
	CONSTRAINT "detective_saves_user_id_slot_id_pk" PRIMARY KEY("user_id","slot_id")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "map_points" (
	"id" text PRIMARY KEY NOT NULL,
	"packId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"category" text NOT NULL,
	"image" text,
	"qr_code" text,
	"bindings" jsonb NOT NULL,
	"data" jsonb,
	"schema_version" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"objectives" jsonb NOT NULL,
	"completion_condition" jsonb,
	"rewards" jsonb
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" jsonb,
	"author_id" text
);
--> statement-breakpoint
CREATE TABLE "user_map_point_user_states" (
	"user_id" text NOT NULL,
	"point_id" text NOT NULL,
	"state" text NOT NULL,
	"data" jsonb,
	CONSTRAINT "user_map_point_user_states_user_id_point_id_pk" PRIMARY KEY("user_id","point_id")
);
--> statement-breakpoint
CREATE TABLE "user_quests" (
	"user_id" text NOT NULL,
	"quest_id" text NOT NULL,
	"status" text NOT NULL,
	"completed_at" timestamp,
	"rewards_claimed" boolean DEFAULT false,
	CONSTRAINT "user_quests_user_id_quest_id_pk" PRIMARY KEY("user_id","quest_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "detective_saves" ADD CONSTRAINT "detective_saves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_map_point_user_states" ADD CONSTRAINT "user_map_point_user_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_map_point_user_states" ADD CONSTRAINT "user_map_point_user_states_point_id_map_points_id_fk" FOREIGN KEY ("point_id") REFERENCES "public"."map_points"("id") ON DELETE no action ON UPDATE no action;