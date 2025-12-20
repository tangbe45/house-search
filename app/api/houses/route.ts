// app/api/houses/route.ts
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { houses, uploadedImages } from "@/db/schema";
import { houseCreateSchema } from "@/lib/validation/zod-schemas";
import { buildHouseConditions } from "@/lib/query-builder/build-house-conditions";
import { and, sql, eq } from "drizzle-orm";

export async function GET(req: Request) {
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
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  console.log(params);
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(100, Number(params.limit || 12));
  const skip = (page - 1) * limit;

  const conditions = buildHouseConditions(params);
  console.log(conditions);

  const [housesResult, total] = await Promise.all([
    db
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(skip)
      .orderBy(houses.createdAt)
      .leftJoin(uploadedImages, eq(uploadedImages.houseId, houses.id))
      .groupBy(houses.id),

    db.$count(houses, ...conditions),
  ]);

  const processedHouses = housesResult.map((item) => {
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

  return new Response(
    JSON.stringify({
      houses: processedHouses,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON
    const body = await req.json();
    console.log(body);

    // 2. Validate payload
    const parsed = houseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      title,
      price,
      location,
      bedrooms,
      bathrooms,
      purpose,
      houseTypeId,
      regionId,
      subdivisionId,
      divisionId,
      hasBalcony,
      hasFence,
      neighborhoodId,
      hasInternalToilet,
      hasWell,
      hasParking,
      description,
      images,
    } = parsed.data;

    // 3. Fake auth placeholder (replace later)
    const ownerId = "00000000-0000-0000-0000-000000000001";

    // 4. Create house (transaction recommended)
    const [house] = await db
      .insert(houses)
      .values({
        title,
        price,
        location,
        bedrooms,
        bathrooms,
        purpose,
        houseTypeId,
        regionId,
        subdivisionId,
        divisionId,
        hasBalcony,
        hasFence,
        neighborhoodId,
        hasInternalToilet,
        hasWell,
        hasParking,
        description,
      })
      .returning();

    if (images!.length > 0) {
      await db.insert(uploadedImages).values(
        images!.map((url) => ({
          houseId: house.id,
          url,
        }))
      );
    }

    // 6. Success response
    return NextResponse.json(
      { success: true, message: "House added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_HOUSE_ERROR:", error);
    const err = error as Error;

    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const houseType = searchParams.get("houseType");
//     const minPrice = searchParams.get("minPrice");
//     const maxPrice = searchParams.get("maxPrice");
//     const bedrooms = searchParams.get("bedrooms");
//     const bathrooms = searchParams.get("bathrooms");
//     const hasInternalToilet = searchParams.get("hasInternalToilet");
//     const hasWell = searchParams.get("hasWell");
//     const hasParking = searchParams.get("hasParking");
//     const hasFence = searchParams.get("hasFence");
//     const hasBalcony = searchParams.get("hasBalcony");
//     const region = searchParams.get("region");
//     const division = searchParams.get("division");
//     const subdivision = searchParams.get("subdivision");
//     const neighborhood = searchParams.get("neighborhood");
//     const page = searchParams.get("page");
//     const size = searchParams.get("size");

//     let where: Prisma.HouseWhereInput = {
//       ...(houseType && {
//         houseTypeId: { equals: houseType, mode: "insensitive" },
//       }),
//       ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
//       ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
//       ...(bedrooms && { bedrooms: { equals: parseInt(bedrooms) } }),
//       ...(bathrooms && { bathrooms: { equals: parseInt(bathrooms) } }),
//       ...(hasInternalToilet !== null && {
//         hasInternalToilet: Boolean(hasInternalToilet),
//       }),
//       ...(hasWell !== null && { hasWell: Boolean(hasWell) }),
//       ...(hasParking !== null && { hasParking: Boolean(hasParking) }),
//       ...(hasFence !== null && { hasFence: Boolean(hasFence) }),
//       ...(hasBalcony !== null && { hasBalcony: Boolean(hasBalcony) }),
//       ...(region && { regionId: region }),
//       ...(division && { divisionId: division }),
//       ...(subdivision && { subdivisionId: subdivision }),
//       ...(neighborhood && { neighborhoodId: neighborhood }),
//     };

//     const currentPage = Number(page) ?? 1;
//     const pageSize = Number(size) ?? 21;

//     const [count, houses] = await Promise.all([
//       db.house.count({ where: where }),
//       db.house.findMany({
//         where: where,
//         include: { images: true },
//         orderBy: {
//           createdAt: "desc",
//         },
//         skip: (currentPage - 1) * pageSize,
//         take: pageSize,
//       }),
//     ]);

//     let totalPages = Math.ceil(count / pageSize);

//     return NextResponse.json({ houses, totalPages });
//   } catch (err) {
//     console.error("Get houses error:", err);
//     const message = (err instanceof Error && err?.message) || "Server error";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }
