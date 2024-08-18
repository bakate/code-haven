DROP TABLE "category_translation";--> statement-breakpoint
ALTER TABLE "mux_data" ALTER COLUMN "chapter_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "name" text NOT NULL;