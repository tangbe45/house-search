"use server";

import { db } from "@/server/db/drizzle";
import { roles, user, userRoles } from "@/server/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/dist/server/api-utils";

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "An unknown error occurred",
    };
  }
};

export const signUp = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const token = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    console.log(token.user);
    const more_than_0 = await db.$count(user);
    console.log(more_than_0);

    let role;

    if (more_than_0 !== 1) {
      role = await db.query.roles.findFirst({
        where: eq(roles.name, "basic-user"),
      });
    } else {
      role = await db.query.roles.findFirst({
        where: eq(roles.name, "admin"),
      });
    }
    console.log(role);
    const result = await db
      .insert(userRoles)
      .values({
        userId: token.user.id,
        roleId: role!.id,
      })
      .returning();

    console.log(result);

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "An unknown error occurred",
    };
  }
};
