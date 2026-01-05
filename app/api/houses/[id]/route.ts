import { NextRequest, NextResponse } from "next/server";

import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary-server";
import { auth } from "@/lib/auth"; // your auth helper
import { headers } from "next/headers";
import { HouseService } from "@/server/services/house.service";
import { houseUpdateSchema } from "@/lib/validation/zod-schemas";
import z from "zod";

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

    const parsed = houseUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(`Error: ${z.treeifyError(parsed.error)}`);
    }

    const { id: houseId } = await params;
    const user = { id: session.user.id, roles: session.user.roles };

    await HouseService.updateHouse(houseId, user, body);

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

    const { id: houseId } = await params;
    const user = { id: session.user.id, roles: session.user.roles };

    await HouseService.deleteHouse(houseId, user);

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
