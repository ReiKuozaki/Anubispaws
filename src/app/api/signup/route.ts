import { NextResponse } from "next/server";
import  pool  from "@/db/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { nickname, email, password } = await req.json();

  const [existing]: any = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, password, role, isVerified)
     VALUES (?, ?, ?, 'pet_owner', true)`,
    [nickname, email, hashed]
  );

  return NextResponse.json({ success: true });
}
