import { db } from "@/server/db/drizzle";
import { houses, uploadedImages, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const HouseRepository = {
  findMany(filters: any) {
    return db.query.houses.findMany({
      where: filters,
    });
  },

  findById(id: string) {
    return db.query.houses.findFirst({
      where: eq(houses.id, id),
    });
  },

  findByIdWithImages(id: string) {
    return db.query.houses.findFirst({
      where: eq(houses.id, id),
      with: {
        images: true,
        agent: true,
        region: true,
        division: true,
        subdivision: true,
        neighborhood: true,
        houseType: true,
      },
    });
  },
};
