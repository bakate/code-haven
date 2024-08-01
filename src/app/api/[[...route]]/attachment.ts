import { db } from "@/db/drizzle";
import { attachment } from "@/db/schema";
import {
  insertAttachmentSchema,
  selectAttachmentSchema,
} from "@/features/dashboard/types/attachment.type";

import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { getTranslations } from "next-intl/server";

const app = new Hono()
  .use("*", verifyAuth())
  .post(
    "/",
    zValidator(
      "json",
      insertAttachmentSchema.pick({
        courseId: true,
        url: true,
        name: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const translations = await getTranslations("createOrEditCourseForm");
      const values = c.req.valid("json");
      if (!values.url || !values.name || !values.courseId) {
        throw c.json({ error: "Missing required fields" } as const, 422);
      }

      const [newAttachment] = await db
        .insert(attachment)
        .values(values)
        .returning();
      return c.json({
        message: translations("courseUpdatedSuccessfully"),
        data: newAttachment,
      } as const);
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      selectAttachmentSchema.pick({
        id: true,
      })
    ),
    zValidator(
      "json",
      selectAttachmentSchema.pick({
        courseId: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const translations = await getTranslations("createOrEditCourseForm");
      const { id: attachmentId } = c.req.valid("param");
      if (!attachmentId) {
        throw c.json({ error: "Missing required attachment ID" } as const, 422);
      }
      const { courseId } = c.req.valid("json");
      if (!courseId) {
        throw c.json({ error: "Missing required course ID" } as const, 422);
      }
      const [deletedAttachment] = await db
        .delete(attachment)
        .where(
          and(
            eq(attachment.id, attachmentId),
            eq(attachment.courseId, courseId)
          )
        )
        .returning();
      return c.json({
        message: translations("courseUpdatedSuccessfully"),
        data: deletedAttachment,
      } as const);
    }
  );

export default app;
