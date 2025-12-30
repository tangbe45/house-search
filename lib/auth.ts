import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { db } from "@/server/db/drizzle";
import { count, eq } from "drizzle-orm";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/emails/reset-password";
import VerifyEmail from "@/emails/verify-email";
import { roles, schema, user } from "@/server/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, request) => {
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          userName: user.name,
          userEmail: user.email,
          resetLink: url,
        }),
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      resend.emails.send({
        from: "onbording@resend.dev",
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmail({
          userName: user.name,
          verifyUrl: url,
        }),
      });
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    // 1. IMPORTANT: Tell Better Auth this field exists on the User model
    additionalFields: {
      roleId: {
        type: "string",
        required: false, // Ensuring Better Auth expects this field
        defaultValue: null, // Allow temporary null before the hook sets it
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const [userCount] = await db.select({ value: count() }).from(user);
          const isFirstUser = userCount.value === 0;

          const targetRoleName = isFirstUser ? "admin" : "basic-user";

          const [role] = await db
            .select()
            .from(roles)
            .where(eq(roles.name, targetRoleName))
            .limit(1);

          if (!role) {
            throw new Error(`Role '${targetRoleName}' not found in database.`);
          }
          console.log(role.id);
          return {
            data: {
              ...newUser,
              roleId: role.id,
            },
          };
        },
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    customSession(async ({ user: sessionUser, session }) => {
      const userRolesData = await db
        .select({ roleName: roles.name })
        .from(user)
        .innerJoin(roles, eq(user.roleId, roles.id))
        .where(eq(user.id, sessionUser.id));

      const roleNames = userRolesData.map((r) => r.roleName);

      return {
        user: {
          ...sessionUser,
          role: roleNames[0],
        },
        session,
      };
    }),
    nextCookies(),
  ],
});
