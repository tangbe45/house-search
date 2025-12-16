import fs from "fs";
import path from "path";
import "dotenv/config";
import { db } from ".";
import { and, eq } from "drizzle-orm";
import { division, region } from "../schema";

async function seedDivisions(regionName: string) {
  console.log("🌍 Seeding regions...");

  const regResult = await db.query.region.findFirst({
    where: eq(region.name, regionName),
  });
  if (!regResult) {
    console.error(`❌ Region "${regionName}" not found.`);
    process.exit(1);
  }

  const filePath = path.join(
    __dirname,
    "divisions",
    `${regionName.toLowerCase()}.json`
  );
  const divisions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const d of divisions) {
    // check if a division with this name already exists in this region
    const existing = await db.query.division.findFirst({
      where: and(
        eq(division.name, d.name),
        eq(division.regionId, regResult.id)
      ),
    });

    if (!existing) {
      await db.insert(division).values({
        name: d.name,
        regionId: regResult.id,
      });
      console.log(`Seeded division: ${d.name}`);
    } else if (existing.regionId !== regResult.id) {
      // ensure the division is associated with the correct region
      await db
        .update(division)
        .set({
          regionId: regResult.id,
        })
        .where(eq(division.id, existing.id));
    }
  }

  console.log(`✅ Divisions for ${regionName} seeded successfully!`);
}

const regionName = process.argv[2]; // e.g. Centre
if (!regionName) {
  console.error(
    "❌ Please provide a region name: ts-node seed-divisions.ts Centre"
  );
  process.exit(1);
}

seedDivisions(regionName)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
