import fs from "fs";
import path from "path";
import "dotenv/config";
import { db } from ".";
import { and, eq } from "drizzle-orm";
import { neighborhoods } from "../schema";

type NeighborhoodInput = {
  name: string;
};

async function seedNeighborhoods(subdivisionName: string) {
  const subdivisionResult = await db.query.subdivisions.findFirst({
    where: eq(neighborhoods.name, subdivisionName),
  });
  if (!subdivisionResult) {
    console.error(`❌ Subdivision "${subdivisionName}" not found.`);
    process.exit(1);
  }

  const filePath = path.join(
    __dirname,
    "neighborhoods",
    `${subdivisionName.toLowerCase()}.json`
  );
  const data: NeighborhoodInput[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  for (const n of data) {
    // find existing neighborhood by name and subdivision
    const existing = await db.query.neighborhoods.findFirst({
      where: and(
        eq(neighborhoods.name, n.name),
        eq(neighborhoods.subdivisionId, subdivisionResult.id)
      ),
    });

    if (existing) {
      // update by unique id
      await db
        .update(neighborhoods)
        .set({
          name: n.name,
          subdivisionId: subdivisionResult.id,
        })
        .where(eq(neighborhoods.id, existing.subdivisionId));
    } else {
      // create new record
      await db.insert(neighborhoods).values({
        name: n.name,
        subdivisionId: subdivisionResult.id,
      });
      console.log(`Seeded neighborhood: ${n.name}`);
    }
  }

  console.log(`✅ Neighborhoods for ${subdivisionName} seeded successfully!`);
}

const subdivisionName = process.argv[2];
if (!subdivisionName) {
  console.error(
    "❌ Please provide a subdivision name: ts-node seed-neighborhoods.ts 'Yaoundé I'"
  );
  process.exit(1);
}

seedNeighborhoods(subdivisionName)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
