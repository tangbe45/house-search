import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { InviteTokenService } from "@/server/services/invite-token.service";
import { createProfileSchema } from "@/lib/validation/zod-schemas";
import z from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProfileSchema.safeParse(body);
    if (!parsed.success) {
      console.log(`Error: ${z.treeifyError(parsed.error)}`);
      throw new Error(parsed.error.message);
    }

    console.log(body);

    await InviteTokenService.redeem({
      userId: session.user.id,
      email: session.user.email,
      data: body,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
