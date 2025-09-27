import { NextRequest, NextResponse } from "next/server";
import { db, users } from "../../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email)) // ✅ Use eq imported from drizzle-orm
    .limit(1);

  if (!user[0]) return NextResponse.json({ error: "User not found" });

  const match = await bcrypt.compare(password, user[0].password as string);
  if (!match) return NextResponse.json({ error: "Invalid password" });

  const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  return NextResponse.json({ token });
}
