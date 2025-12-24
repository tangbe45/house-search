"use server";

// import cloudinary from "@/lib/cloudinary";
import { db } from "@/server/db/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { houses, uploadedImages } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { HouseService } from "@/server/services/house.service";

export async function getAgentHouses() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const { id, title, price, location, bedrooms, bathrooms, status, createdAt } =
    houses;

  const housesWithImages = await db
    .select({
      id,
      title,
      price,
      location,
      bedrooms,
      bathrooms,
      status,
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
    .leftJoin(uploadedImages, eq(uploadedImages.houseId, houses.id))
    .groupBy(houses.id);

  const processedHousesWithImages = housesWithImages.map((house) => ({
    id: house.id,
    title: house.title,
    price: house.price,
    location: house.location,
    status: house.status,
    createdAt: house.createdAt.toISOString(),
    image: (house.images as Array<{ id: string; url: string }>)[0]?.url ?? "",
  }));

  console.log(processedHousesWithImages);

  return processedHousesWithImages;
}

export async function fetchHouseForEditAction(houseId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Not authenticated");

  return HouseService.getHouseForEdit(houseId, session.user.id);
}

// export async function updateHouse(formData: FormData) {
//   const session = await auth.api.getSession();
//   if (!session?.user) throw new Error("Unauthorized");

//   const houseId = formData.get("houseId") as string;
//   const removedImageIds = formData.getAll("removedImageIds") as string[];
//   const newImages = formData.getAll("newImages") as File[];

//   const house = await db.houses.findUnique({
//     where: { id: houseId },
//     include: { images: true },
//   });

//   if (!house) throw new Error("House not found");
//   if (house.agentId !== session.user.id)
//     throw new Error("Forbidden");

//   // ---------- Upload new images FIRST ----------
//   const uploadedImages = [];

//   for (const file of newImages) {
//     const buffer = Buffer.from(await file.arrayBuffer());

//     const result = await new Promise<any>((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream({ folder: "houses" }, (err, res) =>
//           err ? reject(err) : resolve(res)
//         )
//         .end(buffer);
//     });

//     uploadedImages.push({
//       url: result.secure_url,
//       publicId: result.public_id,
//       houseId,
//     });
//   }

//   // ---------- Delete removed images ----------
//   for (const imageId of removedImageIds) {
//     const image = house.images.find((img) => img.id === imageId);
//     if (!image) continue;

//     await cloudinary.uploader.destroy(image.publicId);
//     await db.houseImage.delete({ where: { id: imageId } });
//   }

//   // ---------- Save new images ----------
//   if (uploadedImages.length) {
//     await db.houseImage.createMany({ data: uploadedImages });
//   }

//   // ---------- Update house ----------
//   await db.house.update({
//     where: { id: houseId },
//     data: {
//       title: formData.get("title") as string,
//       price: Number(formData.get("price")),
//       description: formData.get("description") as string,
//     },
//   });
// }
