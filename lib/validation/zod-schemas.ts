import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { roleInviteTokens } from "@/server/db/schema";

/* ---------- SELECT ---------- */
export const selectInviteSchema = createSelectSchema(roleInviteTokens);

/* ---------- CREATE ---------- */
export const houseCreateSchema = z.object({
  title: z
    .string()
    .min(
      3,
      "Invalid input: Title is required and must be more than 3 characters"
    ),
  price: z.coerce.number("Requires a positive number").positive().min(500),
  description: z.string().optional(),
  purpose: z.enum(["FOR_RENT", "FOR_SALE", "SHORT_STAY"]),
  houseTypeId: z.uuid("Invalid input"),
  location: z.string().min(1, "Specific location is required"),
  bedrooms: z.coerce.number().nonnegative(),
  bathrooms: z.coerce.number().nonnegative(),
  hasInternalToilet: z.coerce.boolean().optional(),
  hasParking: z.coerce.boolean().optional(),
  hasWell: z.coerce.boolean().optional(),
  hasFence: z.coerce.boolean().optional(),
  hasBalcony: z.coerce.boolean().optional(),
  regionId: z.uuid("Invalid input"),
  divisionId: z.uuid("Invalid input"),
  subdivisionId: z.uuid("Invalid input"),
  neighborhoodId: z.uuid("Invalid input"),
  images: z
    .array(z.object({ url: z.url(), publicId: z.string() }))
    .max(3)
    .optional(),
});

export const createInviteTokenSchema = z.object({
  invitedEmail: z.email(),
});

export const createProfileSchema = z.object({
  phone: z.string().min(9, "Phone number is required"),
  whatsapp: z.string().optional(),
  email: z.email(),
  address: z
    .string()
    .min(1, "Your address is required")
    .max(250, "Address can only contain 250 characters"),
});

/* ---------- UPDATE ---------- */
export const houseUpdateSchema = houseCreateSchema.partial().extend({
  id: z.uuid(),
});

export const updateInviteTokenSchema =
  createInsertSchema(roleInviteTokens).partial();

/* ---------- FILTER ---------- */
export const houseFilterSchema = z.object({
  purpose: z.enum(["FOR_RENT", "FOR_SALE"]).optional(),
  status: z.enum(["AVAILABLE", "PENDING", "SOLD", "RENTED"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  regionId: z.cuid().optional(),
  divisionId: z.cuid().optional(),
  subdivisionId: z.cuid().optional(),
  neighborhoodId: z.cuid().optional(),
  houseTypeId: z.cuid().optional(),
});
