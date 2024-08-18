import { muxData } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectMuxDataType = createSelectSchema(muxData);
export type SelectMuxDataType = z.infer<typeof selectMuxDataType>;
