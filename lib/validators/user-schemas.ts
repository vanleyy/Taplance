import { z } from "zod";

// Reusable social-handle validator: letters, numbers, '_', '.', '-' with an
// optional leading '@'. Users enter just their username, not the full URL.
const usernameHandle = (maxLen = 30) =>
  z
    .string()
    .trim()
    .max(maxLen)
    .regex(/^@?[a-zA-Z0-9_.-]+$/, "Enter just your username, e.g. johndoe")
    .optional()
    .or(z.literal(""));

// Reusable safe-URL validator: valid URL, http/https only, length-capped
const safeUrl = (maxLen = 2048) =>
  z
    .string()
    .trim()
    .max(maxLen)
    .refine((val) => {
      if (val === "") return true;
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Must be a valid http/https URL")
    .optional()
    .or(z.literal(""));

export const ProfileDetailsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(6)
    .max(30)
    .regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed"),
  fullname: z
    .string()
    .trim()
    .min(6)
    .max(80)
    .regex(
      /^[\p{L}\p{M}' .-]+$/u,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  about: z.string().trim().max(150).optional(),
  // Not URL-validated on purpose: the preview is a temporary "blob:" URL, and
  // the real value is always the Supabase Storage URL built in onSubmit().
  avatar: z
    .string()
    .trim()
    .max(2048)
    .optional()
    .or(z.literal("")),
  // Every link group is optional — users can leave all of them empty. Each
  // group can also be undefined or null (partial/legacy "links" rows in the
  // DB), so use .nullish() instead of making them required objects.
  social: z
    .object({
      instagram: usernameHandle(),
      twitter: usernameHandle(),
    })
    .nullish(),
  professional: z
    .object({
      linkedin: usernameHandle(),
      portfolio: safeUrl(),
    })
    .nullish(),
  creative: z
    .object({
      behance: usernameHandle(),
      dribbble: usernameHandle(),
    })
    .nullish(),
  messaging: z
    .object({
      whatsapp: z
        .string()
        .trim()
        .regex(/^\+[1-9]\d{7,14}$/, "Invalid WhatsApp number")
        .optional()
        .or(z.literal("")),
      telegram: usernameHandle(),
    })
    .nullish(),
  storefront: z
    .object({
      shopify: usernameHandle(),
      etsy: usernameHandle(),
    })
    .nullish(),
  miscellaneous: z
    .object({
      custom: safeUrl(),
    })
    .nullish(),
});

export type ProfileDetailsType = z.infer<typeof ProfileDetailsSchema>;