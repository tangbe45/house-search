import { auth } from "@/lib/auth";
import { createInviteTokenSchema } from "@/lib/validation/zod-schemas";
import { InviteTokenService } from "@/server/services/invite-token.service";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = { id: session.user.id, role: session.user.role };

    const tokens = await InviteTokenService.getAgentTokens(user);

    return NextResponse.json(tokens);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const parsed = createInviteTokenSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(`Error: ${z.treeifyError(parsed.error)}`);
    }

    const user = { id: session.user.id, role: session.user.role };

    const token = await InviteTokenService.createAgentToken(user, parsed.data);

    console.log(token);

    return NextResponse.json(
      { success: true, message: "House added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_TOKEN_ERROR:", error);
    const err = error as Error;

    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
