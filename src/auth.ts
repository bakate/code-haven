import NextAuth from "next-auth";

import { nextAuthConfiguration } from "./auth-config";

export const { handlers, signIn, signOut, auth } = NextAuth(
  nextAuthConfiguration
);
