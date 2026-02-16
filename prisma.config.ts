import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local (Next.js convention), fall back to .env
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL!,
  },
});
