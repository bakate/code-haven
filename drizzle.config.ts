import { config } from "dotenv";
import { defineConfig, type Config } from "drizzle-kit";

config({
  path: ".env.local",
});

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,
  },
}) satisfies Config;
