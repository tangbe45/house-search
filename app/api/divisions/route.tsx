import { db } from "@/server/db/drizzle";
import { divisions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const regionId = url.searchParams.get("regionId")!;

  const result = await db.query.divisions.findMany({
    where: eq(divisions.regionId, regionId),
  });

  console.log(result);

  return new Response(JSON.stringify(result));
}
