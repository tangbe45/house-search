// app/api/houses/route.ts
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db/drizzle";
import { houses, roles, uploadedImages, userRoles } from "@/server/db/schema";
import { houseCreateSchema } from "@/lib/validation/zod-schemas";
import { buildHouseConditions } from "@/lib/query-builder/build-house-conditions";
import { and, sql, eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import "dotenv/config";
import { headers } from "next/headers";
import z from "zod";
import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary-server";

/* ──────────────────────────────────────────────── */
/* 1. GET                                          */
/* ──────────────────────────────────────────────── */

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
    hasWell,
  } = houses;
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(100, Number(params.limit || 12));
  const skip = (page - 1) * limit;

  const conditions = buildHouseConditions(params);

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
        hasWell,

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
      .orderBy(desc(houses.createdAt))
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
      hasWell: item.hasWell,
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

/* ──────────────────────────────────────────────── */
/* 2. POST                                          */
/* ──────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    console.log(body);
    // 0. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      body.images.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const rolesResult = await db
      .select({ name: roles.name })
      .from(userRoles)
      .where(eq(userRoles.userId, session.user.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId));

    const isAuthorized = rolesResult.some(
      (role) => role.name === "agent" || role.name === "admin"
    );

    if (isAuthorized === false) {
      body.images.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const ownerId = session.user.id;

    // 2. Validate payload
    const parsed = houseCreateSchema.safeParse(body);
    if (!parsed.success) {
      body.images.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          issues: z.treeifyError(parsed.error),
        },
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
        agentId: ownerId,
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
        images!.map((obj) => ({
          houseId: house.id,
          publicId: obj.publicId,
          url: obj.url,
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
