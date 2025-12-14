import { z } from "zod";

export const ProfileDetailsSchema = z.object({
  username: z.string().min(6),
  fullname: z.string().min(6),
  about: z.string().max(150).optional(),
  avatar : z.string().optional(),
  social: z.object({
    instagram: z.url().optional().or(z.literal("")),
    twitter: z.url().optional().or(z.literal("")),
  }),

  professional: z.object({
    linkedin: z.url().optional().or(z.literal("")),
    portfolio: z.url().optional().or(z.literal("")),
  }),

  creative: z.object({
    behance: z.url().optional().or(z.literal("")),
    dribbble: z.url().optional().or(z.literal("")),
  }),

  messaging: z.object({
    whatsapp: z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Invalid WhatsApp number")
  .optional()
  .or(z.literal("")),

    telegram: z.url().optional().or(z.literal("")),
  }),

  storefront: z.object({
    shopify: z.url().optional().or(z.literal("")),
    etsy: z.url().optional().or(z.literal("")),
  }),

  miscellaneous: z.object({
    custom: z.url().optional().or(z.literal("")),
  }),
});

export type ProfileDetailsType = z.infer<typeof ProfileDetailsSchema>;


