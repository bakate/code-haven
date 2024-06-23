import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db/drizzle";
import Google from "@auth/core/providers/google";
import { AuthConfig } from "@hono/auth-js";
import Resend from "next-auth/providers/resend";

export function getAuthConfig(): AuthConfig {
  return {
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    providers: [
      Google,
      Resend({
        from: process.env.RESEND_FROM_EMAIL,
      }),
    ],
  };
}
