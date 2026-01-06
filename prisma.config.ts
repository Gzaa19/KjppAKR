// Prisma Configuration for KJPP AKR
// Supports Supabase Transaction Pooler

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses connection pooler)
    // DATABASE_URL with pgbouncer doesn't support migrations
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
