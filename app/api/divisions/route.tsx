import { db } from "@/db/drizzle";
import { divisions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const regionId = url.searchParams.get("regionId")!;

  const result = await db.query.divisions.findMany({
    where: eq(divisions.regionId, regionId),
  });

  return new Response(JSON.stringify(result));
}
