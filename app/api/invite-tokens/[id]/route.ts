import { auth } from "@/lib/auth";
import { InviteTokenService } from "@/server/services/invite-token.service";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: tokenId } = await params;
    const user = { id: session.user.id, roles: session.user.roles };

    const result = await InviteTokenService.deleteAgentToken(tokenId, user);
    console.log(result);

    return NextResponse.json(
      { success: true, message: "Property successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete house" },
      { status: 500 }
    );
  }
}
