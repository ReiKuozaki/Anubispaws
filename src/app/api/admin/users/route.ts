import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/db/db";

const ADMIN_EMAIL = "prajwalbasnet1943@gmail.com";

function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.email === ADMIN_EMAIL && decoded.role === "admin" ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  console.log("📍 Admin Users GET called");
  
  const admin = verifyAdmin(req);
  if (!admin) {
    console.log("❌ Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, isVerified, created_at FROM users ORDER BY created_at DESC"
    );
    console.log("✅ Fetched users:", rows);
    return NextResponse.json({ users: rows });
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}