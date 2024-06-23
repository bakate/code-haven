import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db/drizzle";
import Google from "@auth/core/providers/google";
import { AuthConfig } from "@hono/auth-js";

export function getAuthConfig(): AuthConfig {
  return {
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
  };
}
