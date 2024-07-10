import { Hono } from "hono";
import { handle } from "hono/vercel";

import { nextAuthConfiguration } from "@/auth-config";
import { AuthConfig, authHandler, initAuthConfig } from "@hono/auth-js";
import user from "./user";

export const runtime = "edge";

const app = new Hono().basePath("/api");

export function getAuthConfig(): AuthConfig {
  return {
    ...nextAuthConfiguration,
  };
}

app.use("*", initAuthConfig(getAuthConfig));
app.use("/auth/*", authHandler());

const routes = app.route("/users", user);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
// export default app; // to challenge since I have this warning:
// Detected default export in '/home/bakate/bloomflow/dojos/code-haven/src/app/api/[[...route]]/route.ts'.
// Export a named export for each HTTP method instead
