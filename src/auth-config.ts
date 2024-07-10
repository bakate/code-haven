import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

import { db } from "@/db/drizzle";
import Google from "@auth/core/providers/google";
import Resend from "next-auth/providers/resend";

const providers: Provider[] = [
  Google,
  Resend({
    from: process.env.RESEND_FROM_EMAIL,
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const nextAuthConfiguration = {
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  providers,
  pages: {
    // we override the default pages
    signIn: "/sign-in", // /api/auth/signin ==> /sign-in
    // signOut: "/sign-out", // /api/auth/signout ==> /sign-out
  },
} satisfies NextAuthConfig;
