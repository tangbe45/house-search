import fs from "fs";
import path from "path";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from ".";
import { houseType } from "../schema";

async function main() {
  console.log("Start seeding house types...");

  const houseTypesPath = path.join(__dirname, "house-types", "types.json");
  const houseTypes = JSON.parse(fs.readFileSync(houseTypesPath, "utf-8"));

  for (const type of houseTypes) {
    const existing = await db.query.houseType.findFirst({
      where: eq(houseType.name, type.name),
    });

    if (!existing) {
      await db.insert(houseType).values({
        name: type.name,
        description: type.description,
      });

      console.log(`Seeded house type: ${type.name}`);
    }
  }
  console.log("✅ All house types seeded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
