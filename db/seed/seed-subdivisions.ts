import fs from "fs";
import path from "path";
import "dotenv/config";
import { db } from ".";
import { division, subdivision } from "../schema";
import { eq } from "drizzle-orm";

type SubdivisionInput = {
  name: string;
  divisionId: string;
};

async function seedSubdivisions(divisionName: string) {
  const divisionResult = await db.query.division.findFirst({
    where: eq(division?.name, divisionName),
  });
  if (!divisionResult) {
    console.error(`❌ Division "${divisionName}" not found.`);
    process.exit(1);
  }

  const filePath = path.join(
    __dirname,
    "subdivisions",
    `${divisionName.toLowerCase()}.json`
  );
  const subdivisions: SubdivisionInput[] = await JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  for (const s of subdivisions) {
    const existing = await db.query.subdivision.findFirst({
      where: eq(subdivision.name, s.name),
    });
    if (existing) {
      await db
        .update(subdivision)
        .set({ name: s.name, divisionId: division.id })
        .where(eq(subdivision.id, existing.id));
    } else {
      await db.insert(subdivision).values({
        name: s.name,
        divisionId: divisionResult.id,
      });
      console.log(`Seeded subdivision: ${s.name}`);
    }
  }

  console.log(`✅ Subdivisions for ${divisionName} seeded successfully!`);
}

const divisionName = process.argv[2];
if (!divisionName) {
  console.error(
    "❌ Please provide a division name: ts-node seed-subdivisions.ts Mfoundi"
  );
  process.exit(1);
}

seedSubdivisions(divisionName)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
