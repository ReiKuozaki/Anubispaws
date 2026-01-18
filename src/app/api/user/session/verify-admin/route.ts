import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "prajwalbasnet1943@gmail.com";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;
    console.log("Decoded JWT:", decoded);
    if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Access denied: Admins only" }, { status: 403 });
    }

    return NextResponse.json({ success: true, isAdmin: true });
  } catch (err) {
    console.error("Admin verification error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}