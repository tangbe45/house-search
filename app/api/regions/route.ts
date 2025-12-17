import { db } from "@/db/drizzle";

export async function GET(req: Request) {
  try {
    const regions = await db.query.regions.findMany();
    return new Response(JSON.stringify(regions));
  } catch (error) {
    const e = error as Error;
    return new Response(
      JSON.stringify({ message: e.message || "Failed to fetch regions" })
    );
  }
}
