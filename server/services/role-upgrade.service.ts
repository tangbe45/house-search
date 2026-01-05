type UpgradeInput = {
  token: string;
  userId: string;
  userEmail: string;

  profile: {
    phone: string;
    whatsapp: string;
    businessName?: string;
    address?: string;
  };

  agent?: {
    licenseNumber?: string;
  };

  provider?: {
    providerType: "MOVING" | "CLEANING" | "OTHER";
  };
};

// export const RoleUpgradeService = {
//   async upgrade({
//     token,
//     userId,
//     userEmail,
//     profile,
//     roleExtension,
//   }: {
//     token: string;
//     userId: string;
//     userEmail: string;
//     profile: {
//       phone: string;
//       whatsapp: string;
//       businessName?: string;
//     };
//     roleExtension?: {
//       providerType?: "MOVING" | "CLEANING";
//       licenseNumber?: string;
//     };
//   }) {
//     // 1️⃣ Validate token
//     const invite = await InviteTokenRepository.findValidToken(token);

//     if (!invite) {
//       throw new Error("Invalid or expired invite");
//     }

//     if (invite.invitedEmail !== userEmail) {
//       throw new Error("Invite not valid for this account");
//     }

//     // 2️⃣ Assign role (idempotent)
//     await UserRoleRepository.assignRole(userId, invite.roleId);

//     // 3️⃣ Ensure professional profile
//     const profileRecord = await ProfessionalProfileRepository.createProfile({
//       userId,
//       ...profile,
//     });

//     // 5️⃣ Mark token used (optimistic concurrency guard)
//     await InviteTokenRepository.markUsed(invite.id);
//   },
// };
