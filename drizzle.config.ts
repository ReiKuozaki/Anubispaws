// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",       // path to your schema.ts
  out: "./src/db/migrations",        // where migrations are stored
  dialect: "postgresql",              // <- this replaces `driver: "pg"`
  dbCredentials: {
    url: "postgresql://rei:rei@localhost:5432/pet_care", // connection string
  },
});
