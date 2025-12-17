import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";

export async function GET() {
  // replace with prisma.houseType.findMany()
  const response = await db.query.houseTypes.findMany();
  return NextResponse.json(response);
}
