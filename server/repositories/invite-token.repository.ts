import { CreateInvitToken, InviteToken } from "@/types";
import { db } from "../db/drizzle";
import { and, eq, gt } from "drizzle-orm";
import { roleInviteTokens } from "../db/schema";

export const InviteTokenRepository = {
  //Query Token
  async findManyByAgentId(creatorId: string): Promise<InviteToken[]> {
    return db.query.roleInviteTokens.findMany({
      where: eq(roleInviteTokens.creatorId, creatorId),
    });
  },

  async findById(id: string) {
    return db.query.roleInviteTokens.findFirst({
      where: eq(roleInviteTokens.id, id),
    });
  },

  async findByToken(token: string) {
    return db.query.roleInviteTokens.findFirst({
      where: eq(roleInviteTokens.token, token),
    });
  },

  async findActiveByEmailAndRole(invitedEmail: string, roleId: string) {
    return db.query.roleInviteTokens.findFirst({
      where: and(
        eq(roleInviteTokens.invitedEmail, invitedEmail),
        eq(roleInviteTokens.roleId, roleId),
        eq(roleInviteTokens.used, false),
        gt(roleInviteTokens.expiresAt, new Date())
      ),
    });
  },

  // Create Token
  async create(data: {
    token: string;
    invitedEmail: string;
    roleId: string;
    creatorId: string;
    expiresAt: Date;
  }) {
    return db
      .insert(roleInviteTokens)
      .values({ ...data })
      .returning();
  },

  // Update Token
  async update(tokenId: string) {
    db.update(roleInviteTokens)
      .set({ used: true })
      .where(eq(roleInviteTokens.id, tokenId));
  },

  async markUsed(tokenId: string) {
    return db
      .update(roleInviteTokens)
      .set({
        used: true,
        redeemedAt: new Date(),
      })
      .where(eq(roleInviteTokens.id, tokenId));
  },

  async findValidToken(token: string) {
    return (
      db.query.roleInviteTokens.findFirst({
        where: and(
          eq(roleInviteTokens.token, token),
          eq(roleInviteTokens.used, false),
          gt(roleInviteTokens.expiresAt, new Date())
        ),
      }) || null
    );
  },

  // Delete Token
  async delete(tokenId: string, creatorId: string) {
    return db
      .delete(roleInviteTokens)
      .where(
        and(
          eq(roleInviteTokens.id, tokenId),
          eq(roleInviteTokens.creatorId, creatorId),
          eq(roleInviteTokens.used, false)
        )
      );
  },
};
