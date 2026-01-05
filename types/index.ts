import {
  createInviteTokenSchema,
  createProfileSchema,
  houseCreateSchema,
  houseFilterSchema,
  houseUpdateSchema,
  selectInviteSchema,
  updateInviteTokenSchema,
} from "@/lib/validation/zod-schemas";
import z from "zod";

export type HouseStatus = "AVAILABLE" | "RENTED" | "SOLD";

export type LoadSchema = { id: string; name: string };

export type HouseCreateInput = z.infer<typeof houseCreateSchema>;

export type HouseFilterInput = z.infer<typeof houseFilterSchema>;
export type HouseUpdateInput = z.infer<typeof houseUpdateSchema>;
export type Region = { id: string | ""; name: string };
export type Division = { id: string | ""; name: string };
export type Subdivision = { id: string | ""; name: string };
export type Neighborhood = { id: string | ""; name: string };
export type HouseType = {
  name: string;
  id: string;
};

export type HouseFilter = {
  houseType?: string;
  minPrice?: string;
  maxPrice?: string;
  hasInternalToilet?: boolean;
  hasWell?: boolean;
  hasParking?: boolean;
  hasFence?: boolean;
  hasBalcony?: boolean;
  purpose?: string;
  region?: string;
  division?: string;
  subdivision?: string;
  neighborhood?: string;
};

export type LocationData = {
  regions: Region[] | "";
  divisions: Division[] | "";
  subdivisions: Subdivision[] | "";
  neighborhoods: Neighborhood[] | "";
};

/* ---------- INVITE TOKEN ---------- */
export type InviteToken = z.infer<typeof selectInviteSchema>;
export type CreateInvitToken = z.infer<typeof createInviteTokenSchema>;
export type UpdateInviteToken = z.infer<typeof updateInviteTokenSchema>;

export type CreateProfile = z.infer<typeof createProfileSchema>;
