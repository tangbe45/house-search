import { NextRequest, NextResponse } from "next/server";

import { houses, roles, uploadedImages, userRoles } from "@/server/db/schema";
import { and, eq, exists, inArray, notInArray } from "drizzle-orm";
import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary-server";
import { auth } from "@/lib/auth"; // your auth helper
import { headers } from "next/headers";
import { db } from "@/server/db/drizzle";
import { houseUpdateSchema } from "@/lib/validation/zod-schemas";
import z from "zod";
import { HouseService } from "@/server/services/house.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      body.newImages.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isAuthorized =
      session.user.roles.includes("agent") ||
      session.user.roles.includes("admin");

    if (isAuthorized === false) {
      body.images.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id: houseId } = await params;

    await HouseService.updateHouse(houseId, session.user.id, body);

    return NextResponse.json({
      success: true,
      message: "House updated successfully",
    });
  } catch (error) {
    console.error("UPDATE HOUSE ERROR:", error);

    body.newImages.map((img: { url: string; publicId: string }) => {
      deleteFromCloudinary(img.publicId);
    });

    return NextResponse.json(
      { success: false, message: "Failed to update house" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isAuthorized =
      session.user.roles.includes("agent") ||
      session.user.roles.includes("admin");

    if (isAuthorized === false) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id: houseId } = await params;

    await HouseService.deleteHouse(houseId, session.user.id);

    return NextResponse.json(
      { success: true, message: "Property successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete house" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
}
