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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ params is a Promise
) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;  // ✅ Await params first
    console.log("🗑️ Deleting pet ID:", id);
    
    await pool.execute("DELETE FROM pets WHERE id = ?", [id]);
    console.log("✅ Pet deleted, ID:", id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to delete pet:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}