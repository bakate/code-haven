import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

const languageEnum = ["en-us", "fr", "es", "de", "it"] as const;

// Course Schemas
export const course = pgTable("course", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  isPublished: boolean("is_published").default(false).notNull(),
  price: integer("price"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  categoryId: text("category_id").references(() => category.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Define relations for course
export const courseRelations = relations(course, ({ one }) => ({
  user: one(users, {
    fields: [course.userId],
    references: [users.id],
  }),
  category: one(category, {
    fields: [course.categoryId],
    references: [category.id],
  }),
}));

// Define the course translation table
export const courseTranslation = pgTable("course_translation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade", onUpdate: "cascade" }),
  lang: text("lang", { enum: languageEnum }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

// Define the category table
export const category = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Define the category translation table
export const categoryTranslation = pgTable(
  "category_translation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    lang: text("lang", { enum: languageEnum }).notNull(),
    name: text("name").notNull(),
  },
  (table) => ({
    nameLangUnique: uniqueIndex("name_lang_unique").on(table.name, table.lang),
  })
);

// Define relations for category
export const categoryRelations = relations(category, ({ many }) => ({
  courses: many(course),
}));

// Create insert schema for course
export const insertCourseTranslation = createInsertSchema(courseTranslation);
export const insertCourseSchema = createInsertSchema(course).merge(
  insertCourseTranslation.pick({
    lang: true,
    title: true,
    description: true,
  })
);

export const selectTranslatedCourseSchema =
  createSelectSchema(course) &&
  insertCourseTranslation.pick({
    title: true,
  });
