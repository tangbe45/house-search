import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { professionalProfiles } from "../db/schema";

export const ProfessionalProfileRepository = {
  async findByUserId(userId: string) {
    return (
      db
        .select()
        .from(professionalProfiles)
        .where(eq(professionalProfiles.userId, userId)) || null
    );
  },

  async createProfile(
    userId: string,
    data: {
      phone: string;
      whatsapp?: string;
      address: string;
      email: string;
    }
  ) {
    const [profile] = await db
      .insert(professionalProfiles)
      .values({ ...data, userId })
      .returning();

    return profile;
  },
};
