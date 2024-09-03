import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"] as const)
    .default("production"),
  AUTH_SECRET: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  AUTH_RESEND_KEY: z.string(),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  RESEND_FROM_EMAIL: z.string(),
  MICROSOFT_TRANSLATOR_KEY: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEON_DATABASE_URL: z.string(),
  MUX_TOKEN_ID: z.string(),
  MUX_TOKEN_SECRET: z.string(),
  MUX_WEBHOOK_SECRET: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string(),
});

const validEnv = schema.safeParse(process.env);

if (!validEnv.success) {
  throw new Error(validEnv.error.message);
}

export const ENV = validEnv.data;
