import { config } from "dotenv";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({
  path: ".env.local",
});

const sql = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle(sql);

(async () => {
  try {
    console.log("Migrating database");
    await migrate(db, { migrationsFolder: "drizzle" });
    process.exit(0);
  } catch (error) {
    console.log("Error while resetting database", error);
    process.exit(1);
  }
})();
