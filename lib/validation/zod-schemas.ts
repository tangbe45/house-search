import z from "zod";

/* ---------- CREATE ---------- */
export const houseCreateSchema = z.object({
  title: z
    .string()
    .min(
      3,
      "Invalid input: Title is required and must be more than 3 characters"
    ),
  description: z.string().optional(),
  purpose: z.enum(["FOR_RENT", "FOR_SALE", "SHORT_STAY"]),
  houseTypeId: z.uuid("Invalid input: Invalid type"),
  location: z.string().min(1, "Invalid input: Specific location is required"),
  bedrooms: z.coerce.number().nonnegative(),
  bathrooms: z.coerce.number().nonnegative(),
  price: z.coerce
    .number("Invalid input: Requires a positive number")
    .positive(),
  hasInternalToilet: z.coerce.boolean().optional(),
  hasParking: z.coerce.boolean().optional(),
  hasWell: z.coerce.boolean().optional(),
  hasFence: z.coerce.boolean().optional(),
  hasBalcony: z.coerce.boolean().optional(),
  regionId: z.uuid("Invalid input: Invalid type"),
  divisionId: z.uuid("Invalid input: Invalid type"),
  subdivisionId: z.uuid("Invalid input: Invalid type"),
  neighborhoodId: z.uuid("Invalid input: Invalid type"),
});

/* ---------- UPDATE ---------- */
export const houseUpdateSchema = houseCreateSchema.partial().extend({
  id: z.cuid(),
});

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
