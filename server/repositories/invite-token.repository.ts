import { CreateInvitToken, InviteToken } from "@/types";
import { db } from "../db/drizzle";
import { and, eq } from "drizzle-orm";
import { roleInviteTokens } from "../db/schema";

export const InviteTokenRepository = {
  //Query Token
  async findManyById(creatorId: string): Promise<InviteToken[]> {
    return db.query.roleInviteTokens.findMany({
      where: and(eq(roleInviteTokens.createdBy, creatorId)),
    });
  },

  // Create Token
  async create(creatorId: string, data: CreateInvitToken) {
    return db
      .insert(roleInviteTokens)
      .values({ ...data, createdBy: creatorId })
      .returning();
  },

  // Update Token

  // Delete Token
  async delete(tokenId: string, creatorId: string) {
    return db
      .delete(roleInviteTokens)
      .where(
        and(
          eq(roleInviteTokens.id, tokenId),
          eq(roleInviteTokens.createdBy, creatorId),
          eq(roleInviteTokens.used, false)
        )
      );
  },
};
