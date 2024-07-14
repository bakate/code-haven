import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      "Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character",
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export type LoginValues = z.infer<typeof LoginSchema>;

export const MagicLinkSchema = z.object({
  email: z.string().email(),
});

export type MagicLinkValues = z.infer<typeof MagicLinkSchema>;
