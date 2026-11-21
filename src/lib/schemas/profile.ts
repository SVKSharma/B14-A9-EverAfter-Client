import { z } from "zod";

/**
 * Mirrors the server whitelist in `src/modules/users/user.service.js`.
 * Only name, image and businessName are editable; anything else is rejected
 * server-side even if a client sends it.
 */
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Name is too long."),
  businessName: z
    .string()
    .trim()
    .max(80, "Business name is too long.")
    .optional(),
  image: z.string().trim().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
