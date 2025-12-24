import fs from "fs";
import path from "path";
import "dotenv/config";
import { db } from ".";
import { and, eq } from "drizzle-orm";
import { divisions, regions } from "../schema";

type DivisionInput = {
  name: string;
};

async function seedDivisions(regionName: string) {
  console.log("🌍 Seeding regions...");

  const regResult = await db.query.regions.findFirst({
    where: eq(regions.name, regionName),
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
  const data: DivisionInput[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const d of data) {
    // check if a division with this name already exists in this region
    const existing = await db.query.divisions.findFirst({
      where: and(
        eq(divisions.name, d.name),
        eq(divisions.regionId, regResult.id)
      ),
    });

    if (!existing) {
      await db.insert(divisions).values({
        name: d.name,
        regionId: regResult.id,
      });
      console.log(`Seeded division: ${d.name}`);
    } else if (existing.regionId !== regResult.id) {
      // ensure the division is associated with the correct region
      await db
        .update(divisions)
        .set({
          regionId: regResult.id,
        })
        .where(eq(divisions.id, existing.id));
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
