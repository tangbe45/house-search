import fs from "node:fs/promises";
import path from "node:path";

import { db } from ".";
import { region } from "../schema";
import { eq } from "drizzle-orm";

type RegionInput = {
  name: string;
};

async function seedRegions() {
  console.log("🌍 Seeding regions...");

  const filePath = path.join(__dirname, "regions", "regions.json");
  const file = await fs.readFile(filePath, "utf-8");

  const data: RegionInput[] = JSON.parse(file);

  for (const item of data) {
    const existing = await db.query.region.findFirst({
      where: eq(region.name, item.name),
    });

    if (existing) {
      console.log(`⚠️  Skipped: ${region.name}`);
      continue;
    }

    await db.insert(region).values({
      name: item.name,
    });

    console.log(`✅ Inserted: ${region.name}`);
  }

  console.log("🎉 Region seeding complete");
}

seedRegions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
