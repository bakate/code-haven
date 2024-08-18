import { config } from "dotenv";

import { category } from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

config({
  path: ".env.local",
});

const sql = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    // remove all the existing categories
    await db.delete(category);
    const categories = [
      {
        name: "React.js",
      },
      {
        name: "Next.js",
      },
      {
        name: "Tailwind CSS",
      },
      {
        name: "Node.js",
      },
      {
        name: "MongoDB",
      },
      {
        name: "MySQL",
      },

      {
        name: "Prisma",
      },
      {
        name: "Drizzle",
      },
      {
        name: "Hono",
      },
      {
        name: "Jest",
      },
      {
        name: "React Testing Library",
      },
      {
        name: "TanStack Query (React Query)",
      },
      {
        name: "Angular",
      },
    ];

    // insert categories
    await db.insert(category).values(categories);

    console.log("Categories  inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding category", error);
    process.exit(1);
  }
};

main();
