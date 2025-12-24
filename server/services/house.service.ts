import { create } from "domain";
import { HouseRepository } from "../repositories/house.repository";
import { houses, regions } from "../db/schema";

export const HouseService = {
  async getHouses(filters: any) {
    return await HouseRepository.findMany(filters);
  },

  async getHouseDetails(houseId: string) {
    const house = await HouseRepository.findByIdWithImages(houseId);
    if (!house) throw new Error("House not found");

    return {
      id: house.id,
      title: house.title,
      location: house.location,
      purpose: house.purpose,
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      hasInternalToilet: house.hasInternalToilet,
      hasWell: house.hasWell,
      hasParking: house.hasParking,
      description: house.description,
      createdAt: house.createdAt.toISOString(),
      agent: house.agent,
      price: house.price,
      images: (house.images as Array<{ id: string; url: string }>).map(
        (img) => img.url
      ),
    };
  },

  async getHouseForEdit(houseId: string, userId: string) {
    try {
      const house = await HouseRepository.findByIdWithImages(houseId);

      if (!house || house.agentId !== userId) {
        throw new Error("Unauthorized");
      }

      const processedHouse = {
        ...house,
        agentId: undefined,
        agent: null,
        region: { id: house.region.id, name: house.region.name },
        houseType: { id: house.houseType.id, name: house.houseType.name },
        division: { id: house.division.id, name: house.division.name },
        subdivision: { id: house.subdivision.id, name: house.subdivision.name },
        neighborhood: {
          id: house.neighborhood.id,
          name: house.neighborhood.name,
        },
        images: house.images.map((img) => ({ ...img, markedForDelete: false })),
      };

      return processedHouse; // raw enough for form defaultValues
    } catch (error) {
      return {
        error: (error as Error).message,
      };
    }
  },
};
