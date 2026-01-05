import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { professionalProfiles, user } from "../db/schema";

export const UserRepository = {
  async findByEmail(email: string) {
    return db.query.user.findFirst({ where: eq(user.email, email) });
  },

  async findById(id: string) {
    return db.query.user.findFirst({
      where: eq(user.id, id),
      with: { profile: true },
    });
  },
};
