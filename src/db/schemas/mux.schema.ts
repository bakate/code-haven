import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, decimal } from "drizzle-orm/pg-core";
import { chapter } from "./chapter.schema";

export const muxData = pgTable("mux_data", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  assetId: text("asset_id").notNull(),
  playbackId: text("playback_id"),
  chapterId: text("chapter_id")
    .references(() => chapter.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  status: text("status", { enum: ["ready", "processing", "failed"] })
    .default("processing")
    .notNull(),
  duration: decimal("duration"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const muxDataRelations = relations(muxData, ({ one }) => ({
  chapter: one(chapter, {
    fields: [muxData.chapterId],
    references: [chapter.id],
  }),
}));
