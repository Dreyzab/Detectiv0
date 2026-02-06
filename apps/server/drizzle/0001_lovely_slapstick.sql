CREATE TABLE "event_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"actions" jsonb NOT NULL,
	"active" boolean DEFAULT true,
	"description" text
);
