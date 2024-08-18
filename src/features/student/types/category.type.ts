import { category } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectCategorySchema = createSelectSchema(category).pick({
  id: true,
  name: true,
});

export type Category = z.infer<typeof selectCategorySchema>;
