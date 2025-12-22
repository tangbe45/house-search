"use server";

import { db } from "@/db/drizzle";
import { houses, subdivisions, uploadedImages } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { format } from "date-fns";

export async function getHouses() {
  const {
    id,
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    hasFence,
    hasInternalToilet,
  } = houses;

  const result = await db
    .select({
      id,
      title,
      price,
      location,
      bedrooms,
      bathrooms,
      hasFence,
      hasInternalToilet,

      images: sql`
      COALESCE(
        json_agg(
          json_build_object(
            'id', ${uploadedImages.id},
            'url', ${uploadedImages.url}
          )
        ) FILTER (WHERE ${uploadedImages.id} IS NOT NULL),
        '[]'
      )
    `.as("images"),
    })
    .from(houses)
    .leftJoin(uploadedImages, eq(uploadedImages.houseId, houses.id))
    .groupBy(houses.id);

  const processedHouses = result.map((item) => {
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
      hasInternalToilet: item.hasInternalToilet,
      imageUrl: (images as Array<{ id: string; url: string }>)[0]?.url,
    };
  });

  return processedHouses;
}

export async function getHouseById(id: string, tag?: string) {
  if (tag) {
    const house = await db
      .select()
      .from(houses)
      .leftJoin(uploadedImages, eq(uploadedImages.houseId, houses.id))
      .where(eq(houses.id, id));

    console.log(house);
    return house;
  }

  const {
    id: houseId,
    title,
    description,
    location,
    price,
    bedrooms,
    bathrooms,
    hasInternalToilet,
    hasWell,
    hasParking,
    hasFence,
    hasBalcony,
    createdAt,
  } = houses;

  const result = await db
    .select({
      id: houseId,
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      hasInternalToilet,
      hasWell,
      hasParking,
      hasFence,
      hasBalcony,
      createdAt,
      images: sql`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${uploadedImages.id},
              'url', ${uploadedImages.url}
            )
          ) FILTER (WHERE ${uploadedImages.id} IS NOT NULL),
          '[]'
        )
      `.as("images"),
    })
    .from(houses)
    .where(eq(houses.id, id))
    .leftJoin(uploadedImages, eq(uploadedImages.houseId, houses.id))
    .leftJoin(subdivisions, eq(subdivisions.id, houses.subdivisionId))
    .groupBy(houses.id);
  if (!result.length) {
    return null;
  }

  const houseData = result[0];
  const images =
    typeof houseData.images === "string"
      ? JSON.parse(houseData.images)
      : houseData.images;

  const house = {
    id: houseData.id,
    title: houseData.title,
    description: houseData.description || undefined,
    location: houseData.location,
    price: houseData.price,
    bedrooms: houseData.bedrooms,
    bathrooms: houseData.bathrooms,
    hasInternalToilet: houseData.hasInternalToilet ?? undefined,
    hasWell: houseData.hasWell ?? undefined,
    hasParking: houseData.hasParking ?? undefined,
    hasFence: houseData.hasFence ?? undefined,
    hasBalcony: houseData.hasBalcony ?? undefined,
    images: (images as Array<{ id: string; url: string }>).map(
      (image) => image.url
    ),
    createdAt: format(houseData.createdAt, "dd/MM/yyyy"),
  };

  return house;
}
