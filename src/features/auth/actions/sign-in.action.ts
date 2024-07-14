"use server";

import { signIn } from "@/auth";

export const magicLinkAction = async (data: FormData) => {
  try {
    await signIn("resend", data);
  } catch (error) {
    // Signin can fail for a number of reasons, such as the user
    // not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error
  }
};
