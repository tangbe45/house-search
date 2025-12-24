import { db } from "@/server/db/drizzle";
import { subdivisions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const divisionId = url.searchParams.get("divisionId")!;
  console.log(divisionId);
  const result = await db.query.subdivisions.findMany({
    where: eq(subdivisions.divisionId, divisionId),
  });
  return new Response(JSON.stringify(result));
}
