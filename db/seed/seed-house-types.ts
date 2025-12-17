import fs from "fs";
import path from "path";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from ".";
import { houseTypes } from "../schema";

async function main() {
  console.log("Start seeding house types...");

  const houseTypesPath = path.join(__dirname, "house-types", "types.json");
  const data = JSON.parse(fs.readFileSync(houseTypesPath, "utf-8"));

  for (const type of data) {
    const existing = await db.query.houseTypes.findFirst({
      where: eq(houseTypes.name, type.name),
    });

    if (!existing) {
      await db.insert(houseTypes).values({
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
