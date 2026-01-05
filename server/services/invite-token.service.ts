import { InviteTokenRepository } from "../repositories/invite-token.repository";
import { UserRepository } from "../repositories/user.repository";
import { RoleRepository } from "../repositories/role.repository";
import { generateInviteToken } from "@/app/(shared-layout)/dashboard/lib/generate-token";
import { UserRoleRepository } from "../repositories/user-role.repository";
import { CreateProfile } from "@/types";
import { ProfessionalProfileRepository } from "../repositories/professional-profile.repository";

export const InviteTokenService = {
  async getAgentTokens(user: { id: string; roles: string[] }) {
    const allowedRoles: string[] = ["admin", "agent"];

    const authorized = user.roles.some((item) => allowedRoles.includes(item));

    if (!authorized) {
      throw new Error("Forbidden: Your account type cannot create listings.");
    }

    const result = await InviteTokenRepository.findManyByAgentId(user.id);

    const token = result.map((item) => {
      return {
        id: item.id,
        token: item.token,
        expiresAt: item.expiresAt.toISOString(),
        invitedEmail: item.invitedEmail,
        used: item.used,
      };
    });

    return token;
  },

  async createAgentToken(
    user: { id: string; roles: string[] },
    invitedEmail: string,
    roleName: string
  ) {
    const allowedRoles = ["admin", "agent"];

    const authorized = user.roles.some((role) => allowedRoles.includes(role));

    if (!authorized) {
      throw new Error("Forbidden: Your account type cannot create listings.");
    }
    console.log(invitedEmail);
    // 1️⃣ Check user exists
    const userResult = UserRepository.findByEmail(invitedEmail);

    if (!userResult) {
      throw new Error("User with this email does not exist");
    }
    console.log(invitedEmail);
    // 2️⃣ Resolve role safely
    const role = await RoleRepository.findByName(roleName);
    console.log(role);

    if (!role) {
      throw new Error("Invalid role");
    }

    const activeInvite = await InviteTokenRepository.findActiveByEmailAndRole(
      invitedEmail,
      role.id
    );

    if (activeInvite) {
      throw new Error("An active invite already exists for this email");
    }

    // 3️⃣ Generate unique token (retry-safe)
    let token: string;
    while (true) {
      token = generateInviteToken();
      const existing = await InviteTokenRepository.findByToken(token);
      if (!existing) break;
    }

    // 4️⃣ Expiration (2 days)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);

    const result = InviteTokenRepository.create({
      token,
      invitedEmail,
      roleId: role.id,
      creatorId: user.id,
      expiresAt,
    });

    return result;
  },

  async verify(
    token: string,
    user: { id: string; email: string; roles: string[] }
  ) {
    const allowedRoles = ["basic"];

    const authorized = user.roles.some((role) => allowedRoles.includes(role));

    if (!authorized) {
      throw new Error("Forbidden: Your account type cannot create listings.");
    }

    const invite = await InviteTokenRepository.findByToken(token);

    if (!invite) {
      throw new Error("Invalid invite token");
    }

    if (invite.used) {
      throw new Error("This invite token has already been used");
    }

    if (invite.invitedEmail !== user.email) {
      throw new Error("This invite token was not issued for your email");
    }

    if (invite.expiresAt < new Date()) {
      throw new Error("This invite token has expired");
    }

    return {
      inviteId: invite.id,
      roleId: invite.roleId,
      expiresAt: invite.expiresAt,
    };
  },

  async redeem({
    userId,
    email,
    data,
  }: {
    userId: string;
    email: string;
    data: any;
  }) {
    const roleResult = await RoleRepository.findByName("basic");
    const invite = await InviteTokenRepository.findById(data.inviteId);
    console.log(data);
    console.log(invite);
    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.used) {
      await UserRoleRepository.assignRole(userId, invite.roleId);
      return;
    }

    if (invite.invitedEmail !== email) {
      throw new Error("Invite email mismatch");
    }

    if (invite.expiresAt < new Date()) {
      throw new Error("Invite expired");
    }
    console.log(invite);
    // 2️⃣ Assign role (idempotent)
    await UserRoleRepository.assignRole(userId, invite.roleId);

    await ProfessionalProfileRepository.createProfile(userId, data);

    // 3️⃣ Mark invite as used
    await InviteTokenRepository.markUsed(invite.id);
    console.log(roleResult);
    if (roleResult) {
      await UserRoleRepository.delete(userId, roleResult?.id);
    }
  },

  async deleteAgentToken(
    tokenId: string,
    user: { id: string; roles: string[] }
  ) {
    const allowedRoles = ["admin", "agent"];

    const authorized = user.roles.some((role) => allowedRoles.includes(role));

    if (!authorized) {
      throw new Error("Forbidden: Your account type cannot create listings.");
    }

    return InviteTokenRepository.delete(tokenId, user.id);
  },
};
