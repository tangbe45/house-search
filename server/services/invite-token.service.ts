import { CreateInvitToken } from "@/types";
import { InviteTokenRepository } from "../repositories/invite-token.repository";

export const InviteTokenService = {
  async getAgentTokens(user: { id: string; role: string }) {
    const allowedRoles: string[] = ["admin", "agent", "partner", "provider"];

    if (!allowedRoles.includes(user.role)) {
      throw new Error("Forbidden: Your account type cannot create listings.");
    }

    const result = await InviteTokenRepository.findManyById(user.id);

    const token = result.map((item) => {
      return {
        id: item.id,
        token: item.token,
        expiresAt: item.expiresAt.toISOString(),
        targetEmail: item.targetEmail,
        used: item.used,
      };
    });

    return token;
  },

  async createAgentToken(
    user: { id: string; role: string },
    data: CreateInvitToken
  ) {
    try {
      const allowedRoles = ["admin", "agent", "partner", "provider"];

      if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden: Your account type cannot create listings.");
      }

      const result = InviteTokenRepository.create(user.id, data);

      return result;
    } catch (error) {
      console.log(`Error: ${error}`);
      const err = error as Error;
      throw new Error(err.message || "Failed to create token");
    }
  },
  async deleteAgentToken(tokenId: string, user: { id: string; role: string }) {
    try {
      const allowedRoles = ["admin", "agent", "partner", "provider"];

      if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden: Your account type cannot create listings.");
      }

      return InviteTokenRepository.delete(tokenId, user.id);
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || "Error: Failed to delete token");
    }
  },
};
