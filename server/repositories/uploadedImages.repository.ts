import { eq, inArray } from "drizzle-orm";
import { db } from "../db/drizzle";
import { uploadedImages } from "../db/schema";

type Tx = typeof db extends { transaction(cb: (tx: infer T) => any): any }
  ? T
  : typeof db;

export const UploadedImagesRepository = {
  async create(houseId: string, images: any[], tx?: Tx) {
    try {
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
    } catch (error) {
      console.log(`Error: ${error}`);
      const err = error as Error;
      throw new Error(err.message || "Failed to create image");
    }
  },

  async delete(images: any[], tx?: Tx) {
    try {
      const executor: any = tx ?? db;
      console.log(images);

      const result = await executor
        .delete(uploadedImages)
        .where(inArray(uploadedImages.publicId, images));

      console.log(result);

      return { success: true };
    } catch (error) {
      console.log(`Error: ${error}`);
      const err = error as Error;
      throw new Error(err.message || "Failed to delete image(s)");
    }
  },
};
