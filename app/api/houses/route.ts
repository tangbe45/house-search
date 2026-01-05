// app/api/houses/route.ts
import { NextRequest, NextResponse } from "next/server";

import { buildHouseConditions } from "@/lib/query-builder/build-house-conditions";
import { auth } from "@/lib/auth";
import "dotenv/config";
import { headers } from "next/headers";
import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary-server";
import { HouseService } from "@/server/services/house.service";
import { houseCreateSchema } from "@/lib/validation/zod-schemas";
import z from "zod";

/* ──────────────────────────────────────────────── */
/* 1. GET                                          */
/* ──────────────────────────────────────────────── */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(100, Number(params.limit || 12));
  const skip = (page - 1) * limit;

  const conditions = buildHouseConditions(params);

  const [houseResult, total] = await Promise.all([
    HouseService.getHouses(conditions, limit, skip),
    HouseService.getHouseCount(conditions),
  ]);

  return new Response(
    JSON.stringify({
      houses: houseResult,
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

    const parsed = houseCreateSchema.safeParse(body);
    if (!parsed.success) {
      console.log(`Error: ${z.treeifyError(parsed.error)}`);
      throw new Error(parsed.error.message);
    }

    const user = { id: session.user.id, roles: session.user.roles };

    await HouseService.createHouse(user, parsed.data);

    // 6. Success response
    return NextResponse.json(
      { success: true, message: "House added successfully" },
      { status: 201 }
    );
  } catch (error) {
    body.images.map((img: { url: string; publicId: string }) => {
      deleteFromCloudinary(img.publicId);
    });

    console.error("CREATE_HOUSE_ERROR:", error);
    const err = error as Error;

    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
