DROP TABLE "course_progression";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_chapter_unique_idx" ON "lesson_progression" USING btree ("user_id","chapter_id");