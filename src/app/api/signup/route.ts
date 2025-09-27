// src/pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { db } from "../../../db/client";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { nickname, email, password } = req.body;

  // 1️⃣ Check if email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) return res.status(400).json({ error: "Email already exists" });

  // 2️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3️⃣ Insert into database
  await db.insert(users).values({
    name: nickname,
    email,
    password: hashedPassword,
  });

  // 4️⃣ You can also send verification email here

  return res.status(200).json({ success: true });
}
