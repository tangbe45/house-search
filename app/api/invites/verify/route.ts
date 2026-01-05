import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { InviteTokenService } from "@/server/services/invite-token.service";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = {
      id: session.user.id,
      roles: session.user.roles,
      email: session.user.email,
    };
    const { token } = await req.json();

    console.log(user.email);

    const result = await InviteTokenService.verify(token, user);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
