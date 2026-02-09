import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword } = await req.json();

  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (password !== confirmPassword || password.length < 6) {
    return NextResponse.json(
      { error: "Passwords do not match or too short" },
      { status: 400 }
    );
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [rows]: any = await db.query(
    `SELECT * FROM password_resets
     WHERE token_hash=? AND expires_at > NOW()`,
    [tokenHash]
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const reset = rows[0];
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "UPDATE users SET password=? WHERE id=?",
    [hashedPassword, reset.user_id]
  );

  await db.query(
    "DELETE FROM password_resets WHERE user_id=?",
    [reset.user_id]
  );

  return NextResponse.json({ success: true });
}
