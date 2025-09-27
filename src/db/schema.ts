import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password"),
  google_id: text("google_id").unique(),
  isVerified: boolean("is_verified").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

