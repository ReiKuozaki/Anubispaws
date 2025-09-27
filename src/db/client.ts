// src/db/client.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from your .env.local
});

export const db = drizzle(pool);
