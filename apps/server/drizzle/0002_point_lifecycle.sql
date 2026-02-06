ALTER TABLE "map_points" ADD COLUMN "scope" text DEFAULT 'case' NOT NULL;--> statement-breakpoint
ALTER TABLE "map_points" ADD COLUMN "case_id" text;--> statement-breakpoint
ALTER TABLE "map_points" ADD COLUMN "retention_policy" text DEFAULT 'temporary' NOT NULL;--> statement-breakpoint
ALTER TABLE "map_points" ADD COLUMN "default_state" text DEFAULT 'locked' NOT NULL;--> statement-breakpoint
ALTER TABLE "map_points" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_map_point_user_states" ADD COLUMN "persistent_unlock" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_map_point_user_states" ADD COLUMN "unlocked_by_case_id" text;--> statement-breakpoint
ALTER TABLE "user_map_point_user_states" ADD COLUMN "meta" jsonb;