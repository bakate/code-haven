import { relations } from "drizzle-orm";

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { course } from "./course.schema";

// Define the category table
export const category = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Define relations for category
export const categoryRelations = relations(category, ({ many }) => ({
  courses: many(course),
}));
