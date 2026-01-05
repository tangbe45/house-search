import { eq, inArray } from "drizzle-orm";
import { db } from "../db/drizzle";
import { uploadedImages } from "../db/schema";

type Tx = typeof db extends { transaction(cb: (tx: infer T) => any): any }
  ? T
  : typeof db;

export const UploadedImagesRepository = {
  async create(houseId: string, images: any[], tx?: Tx) {
    const executor: any = tx ?? db;
    const result = executor
      .insert(uploadedImages)
      .values(
        images!.map((obj) => ({
          houseId: houseId,
          publicId: obj.publicId,
          url: obj.url,
        }))
      )
      .returning();
    return result;
  },

  async delete(images: any[], tx?: Tx) {
    const executor: any = tx ?? db;
    console.log(images);

    const result = await executor
      .delete(uploadedImages)
      .where(inArray(uploadedImages.publicId, images));

    console.log(result);

    return { success: true };
  },
};
