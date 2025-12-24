import fs from "node:fs/promises";
import path from "node:path";

import { db } from ".";
import { roles } from "../schema";
import { eq } from "drizzle-orm";

type RoleInput = {
  name: string;
};

async function seedRoles() {
  console.log("🌍 Seeding regions...");

  const filePath = path.join(__dirname, "roles", "roles.json");
  const file = await fs.readFile(filePath, "utf-8");

  const data: RoleInput[] = JSON.parse(file);

  for (const item of data) {
    const existing = await db.query.roles.findFirst({
      where: eq(roles.name, item.name),
    });

    if (existing) {
      console.log(`⚠️  Skipped: ${roles.name}`);
      continue;
    }

    await db.insert(roles).values({
      name: item.name,
    });

    console.log(`✅ Inserted: ${roles.name}`);
  }

  console.log("🎉 Roles seeding complete");
}

seedRoles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
