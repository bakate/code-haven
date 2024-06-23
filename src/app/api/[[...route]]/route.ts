import { authHandler, initAuthConfig, type AuthConfig } from "@hono/auth-js";
import { Context, Hono } from "hono";
import { handle } from "hono/vercel";

import Google from "@auth/core/providers/google";
import user from "./user";

export const runtime = "edge";

const app = new Hono().basePath("/api");
app.use("*", initAuthConfig(getAuthConfig));
app.use("/auth/*", authHandler());

const routes = app.route("/users", user);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
  };
}

export type AppType = typeof routes;
// export default app; // to challenge since I have this warning:
// Detected default export in '/home/bakate/bloomflow/dojos/code-haven/src/app/api/[[...route]]/route.ts'.
// Export a named export for each HTTP method instead
