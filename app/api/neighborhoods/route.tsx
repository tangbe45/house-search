import { db } from "@/server/db/drizzle";
import { neighborhoods } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subdivisionId = url.searchParams.get("subdivisionId")!;
  const result = await db.query.neighborhoods.findMany({
    where: eq(neighborhoods.subdivisionId, subdivisionId),
  });
  return new Response(JSON.stringify(result));
}
