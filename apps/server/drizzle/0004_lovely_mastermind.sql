CREATE TABLE "user_inventory_snapshots" (
	"user_id" text PRIMARY KEY NOT NULL,
	"money" integer DEFAULT 0 NOT NULL,
	"items" jsonb NOT NULL,
	"updated_at" timestamp NOT NULL
);
ALTER TABLE "user_inventory_snapshots" ADD CONSTRAINT "user_inventory_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
