import { HouseRepository } from "../repositories/house.repository";
import {
  houseCreateSchema,
  houseUpdateSchema,
} from "@/lib/validation/zod-schemas";
import { UploadedImagesRepository } from "../repositories/uploadedImages.repository";
import z from "zod";
import { HouseCreateInput, HouseUpdateInput } from "@/types";
import { db } from "../db/drizzle";
import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary-server";
import { collectSegmentData } from "next/dist/server/app-render/collect-segment-data";

export const HouseService = {
  async createHouse(data: HouseCreateInput, ownerId: string) {
    try {
      const { images, ...house } = data;
      if (!images || images.length === 0) {
        console.log("A house must have at least one image");
        throw new Error("A house must have at least one image");
      }

      const parsed = houseCreateSchema.safeParse(house);
      if (!parsed.success) {
        console.log(`Error: ${z.treeifyError(parsed.error)}`);
        throw new Error(parsed.error.message);
      }

      const houseInput = { ...parsed.data, agentId: ownerId };

      const houseresult = await HouseRepository.create(houseInput);
      await UploadedImagesRepository.create(houseresult[0].id, images);
      return houseresult;
    } catch (error) {
      console.log(`Error: ${error}`);
      const err = error as Error;

      throw new Error(err.message);
    }
  },

  async getHouses(conditions: any, limit: number, skip: number) {
    const result = await HouseRepository.findMany(conditions, limit, skip);
    const housesResult = result.map((item) => {
      const images =
        typeof item.images === "string" ? JSON.parse(item.images) : item.images;
      return {
        id: item.id,
        location: item.location,
        price: item.price,
        title: item.title,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        hasFence: item.hasFence,
        hasWell: item.hasWell,
        hasInternalToilet: item.hasInternalToilet,
        imageUrl: (images as Array<{ id: string; url: string }>)[0]?.url,
      };
    });
    console.log(housesResult);
    return housesResult;
  },

  async getHouseCount(conditions: any) {
    return HouseRepository.countWithConditions(conditions);
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

  async updateHouse(houseId: string, ownerId: string, data: any) {
    const parsed = houseUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Error: ${z.treeifyError(parsed.error)}`);
    }

    console.log(data.imagesToDelete);

    data.imagesToDelete.map(async (img: string) => {
      const result = deleteFromCloudinary(img);
      console.log(result);
    });

    if (data.imagesToDelete.length > 0) {
      const result = UploadedImagesRepository.delete(data.imagesToDelete);
      console.log(result);
    }

    if (data.newImages.length > 0) {
      const result = UploadedImagesRepository.create(houseId, data.newImages);
      console.log(result);
    }

    const updated = await HouseRepository.update(houseId, ownerId, data);

    if (updated.length === 0) {
      throw new Error("Unauthorized or house not found");
    }

    return updated[0];
  },

  async deleteHouse(houseId: string, ownerId: string) {
    try {
      const house = await HouseRepository.findByIdWithImages(houseId);

      if (!house || house.agentId !== ownerId) {
        throw new Error("Unauthorized");
      }

      HouseRepository.delete(houseId, ownerId);

      house.images.map(async (img) => {
        const result = deleteFromCloudinary(img.publicId);
        console.log(result);
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      const err = error as Error;

      throw new Error(err.message);
    }
  },
};
