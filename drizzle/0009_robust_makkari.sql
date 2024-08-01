ALTER TABLE "chapter" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "mux_data" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "mux_data" DROP COLUMN IF EXISTS "updated_期的at";