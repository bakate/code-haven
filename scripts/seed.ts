import { config } from "dotenv";

import { category, categoryTranslation } from "@/db/schema";
import {
  remainingLocales,
  translateText,
} from "@/features/dashboard/utils/translation";
import { Locale } from "@/i18n-config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

config({
  path: ".env.local",
});

const sql = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle(sql);

// seed categoryTranslations
const main = async () => {
  try {
    // remove all the existing categories
    await db.delete(category);
    const categoryTitles = [
      {
        lang: "en",
        title: "Learn JavaScript",
      },
      {
        lang: "en",
        title: "Learn React.js",
      },
      {
        lang: "en",
        title: "Learn CSS Grid",
      },
      {
        lang: "en",
        title: "Learn flexbox",
      },
      {
        lang: "en",
        title: "Learn typeScript",
      },
    ];

    const categoryWithTranslations = await Promise.all(
      categoryTitles.map(async ({ lang, title }) => {
        const [{ id: categoryId }] = await db
          .insert(category)
          .values({})
          .returning({ id: category.id });

        const [titleTranslation] = (await translateText({
          from: lang,
          texts: [title],
          to: remainingLocales(lang),
        })) ?? [{ translations: [] }];

        const translations = titleTranslation.translations.map(
          ({ to, text }) => ({
            lang: to,
            name: text,
          })
        );
        return {
          categoryId,
          translations,
        };
      })
    );

    // Insert translations into the database

    for await (const { categoryId, translations } of categoryWithTranslations) {
      await db.insert(categoryTranslation).values(
        translations.map(({ lang, name }) => ({
          categoryId,
          lang: lang === "en" ? "en-us" : (lang as Locale),
          name,
        }))
      );
    }

    console.log("Categories and categories translations inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding category translations", error);
    process.exit(1);
  }
};

main();
