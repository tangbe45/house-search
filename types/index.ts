import {
  houseCreateSchema,
  houseFilterSchema,
  houseUpdateSchema,
} from "@/lib/validation/zod-schemas";
import z from "zod";

export type LoadSchema = { id: string; name: string };

export type HouseCreateInput = z.infer<typeof houseCreateSchema>;

export type HouseFilterInput = z.infer<typeof houseFilterSchema>;
export type HouseUpdateInput = z.infer<typeof houseUpdateSchema>;
