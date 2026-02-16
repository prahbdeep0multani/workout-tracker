import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("Seeding database...\n");

  const seedPath = join(__dirname, "../supabase/seed.sql");

  if (!existsSync(seedPath)) {
    console.error("supabase/seed.sql not found. Make sure the file exists.");
    process.exit(1);
  }

  const sql = readFileSync(seedPath, "utf-8");

  // Remove SQL comments and split into individual statements
  const statements = sql
    .replace(/--.*$/gm, "")
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.\n`);

  let success = 0;
  let skipped = 0;

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement + ";");
      success++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // Skip "already exists" or "duplicate key" errors for idempotent re-runs
      if (msg.includes("already exists") || msg.includes("duplicate key")) {
        skipped++;
      } else {
        console.error(
          `\nFailed:\n${statement.substring(0, 120)}...\n`,
          msg
        );
        throw e;
      }
    }
  }

  console.log(`\nSeed complete: ${success} executed, ${skipped} skipped (duplicates).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
