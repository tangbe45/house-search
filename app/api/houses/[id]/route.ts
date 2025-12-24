import { NextRequest, NextResponse } from "next/server";

import { houses, roles, uploadedImages, userRoles } from "@/server/db/schema";
import { and, eq, exists, inArray, notInArray } from "drizzle-orm";
import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary-server";
import { auth } from "@/lib/auth"; // your auth helper
import { headers } from "next/headers";
import { db } from "@/server/db/drizzle";
import { houseUpdateSchema } from "@/lib/validation/zod-schemas";
import z from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  try {
    /* ──────────────────────────────────────────────── */
    /* 1. AUTHORIZATION                                 */
    /* ──────────────────────────────────────────────── */
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

    const rolesResult = await db
      .select({ name: roles.name })
      .from(userRoles)
      .where(eq(userRoles.userId, session.user.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId));

    const isAuthorized = rolesResult.some(
      (role) => role.name === "agent" || role.name === "admin"
    );

    if (isAuthorized === false) {
      body.newImages.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id: houseId } = await params;

    /* ──────────────────────────────────────────────── */
    /* 2. CHECKING FOR OWNER                            */
    /* ──────────────────────────────────────────────── */
    const ownerCheck = await db
      .select()
      .from(houses)
      .where(and(eq(houses.id, houseId), eq(houses.agentId, session.user.id)));
    if (ownerCheck.length === 0) {
      body.newImages.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    /* ──────────────────────────────────────────────── */
    /* 3. PARSE BODY                                    */
    /* ──────────────────────────────────────────────── */
    const parsed = houseUpdateSchema.safeParse(body);
    if (!parsed.success) {
      body.newImages.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
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
    } = parsed.data;
    /* ──────────────────────────────────────────────── */
    /* 4. DELETE IMAGES FROM CLOUDINARY                 */
    /* ──────────────────────────────────────────────── */

    await Promise.all(
      body.imagesToDelete.map((img: string) => {
        deleteFromCloudinary(img);
      })
    );

    /* ──────────────────────────────────────────────── */
    /* 5. DELETE IMAGE RECORDS FROM DB                  */
    /* ──────────────────────────────────────────────── */

    if (body.imagesToDelete.length > 0) {
      await db
        .delete(uploadedImages)
        .where(inArray(uploadedImages.publicId, body.imagesToDelete));
    }
    /* ──────────────────────────────────────────────── */
    /* 6. Check the existence of house                  */
    /* ──────────────────────────────────────────────── */
    const houseExist = await db
      .select()
      .from(houses)
      .where(exists(db.select().from(houses).where(eq(houses.id, houseId))));

    if (!houseExist) {
      body.newImages.map((img: { url: string; publicId: string }) => {
        deleteFromCloudinary(img.publicId);
      });

      return NextResponse.json(
        { success: false, message: "House does not exist" },
        { status: 404 }
      );
    }
    /* ──────────────────────────────────────────────── */
    /* 7. INSERT NEW IMAGE RECORDS                      */
    /* ──────────────────────────────────────────────── */
    if (body.newImages.length > 0) {
      await db.insert(uploadedImages).values(
        body.newImages.map((img: { url: string; publicId: string }) => ({
          houseId,
          url: img.url,
          publicId: img.publicId,
        }))
      );
    }

    /* ──────────────────────────────────────────────── */
    /* 8. UPDATE HOUSE FIELDS                           */
    /* ──────────────────────────────────────────────── */
    await db
      .update(houses)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(houses.id, houseId));

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
