import { db } from "@/db/drizzle";

export async function GET(req: Request) {
  try {
    const regions = await db.query.regions.findMany();
    return new Response(JSON.stringify(regions));
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, name: error.name, cause: error.cause };
    }
    return new Error("Failed to fetch regions");
  }
}
