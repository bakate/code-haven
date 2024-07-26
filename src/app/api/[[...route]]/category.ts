import { db } from "@/db/drizzle";
import { category, categoryTranslation } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().use("*", verifyAuth()).get("/", async (c) => {
  const categories = await db
    .select({
      id: category.id,
      names: sql<Array<{ lang: string; name: string }>>`
      json_agg(json_build_object('name', ${categoryTranslation.name}, 'lang', ${categoryTranslation.lang}))
      `,
    })
    .from(category)
    .innerJoin(
      categoryTranslation,
      eq(category.id, categoryTranslation.categoryId)
    )
    .groupBy(category.id);

  return c.json({
    data: categories,
  } as const);
});

export default app;
