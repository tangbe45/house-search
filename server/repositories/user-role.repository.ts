import { and, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { userRoles } from "../db/schema";

export const UserRoleRepository = {
  async hasRole(userId: string, role: string) {
    const [existing] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    return !!existing;
  },

  async assignRole(userId: string, roleId: string) {
    const existing = await db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)),
    });

    if (existing) return;

    await db.insert(userRoles).values({
      userId,
      roleId,
    });
  },

  async delete(userId: string, roleId: string) {
    db.delete(userRoles).where(
      and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId))
    );
  },
};
