import { db } from "@/db/drizzle";
import { category } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category);

  return c.json({
    data: categories,
  } as const);
});

export default app;
