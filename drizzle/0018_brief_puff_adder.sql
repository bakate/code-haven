CREATE TABLE IF NOT EXISTS "course_progression" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"progress_percentage" double precision DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"total_chapters" integer DEFAULT 0 NOT NULL,
	"completed_chapters" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_progression" ADD CONSTRAINT "course_progression_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_progression" ADD CONSTRAINT "course_progression_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_course_unique_idx" ON "course_progression" USING btree ("user_id","course_id");