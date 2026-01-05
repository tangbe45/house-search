import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { roles } from "../db/schema";

export const RoleRepository = {
  async findByName(name: string) {
    return await db.query.roles.findFirst({ where: eq(roles.name, name) });
  },
};
