import { attachment } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertAttachmentSchema = createInsertSchema(attachment);
export const selectAttachmentSchema = createSelectSchema(attachment);
