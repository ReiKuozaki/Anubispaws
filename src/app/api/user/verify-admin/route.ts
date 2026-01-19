import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "prajwalbasnet1943@gmail.com";

export async function GET(req: NextRequest) {
  console.log("=== VERIFY ADMIN API CALLED ===");
  
  try {
    const authHeader = req.headers.get("authorization");
    
    console.log("🔍 Auth header present:", !!authHeader);
    console.log("🔍 Auth header value:", authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid Bearer token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔍 Token extracted");
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    console.log("🔍 Decoded JWT:", decoded);
    console.log("🔍 User email:", decoded.email);
    console.log("🔍 User role:", decoded.role);
    console.log("🔍 Expected email:", ADMIN_EMAIL);
    console.log("🔍 Email match:", decoded.email === ADMIN_EMAIL);
    console.log("🔍 Role match:", decoded.role === "admin");

    // Check BOTH email AND role
    const isAdmin = decoded.email === ADMIN_EMAIL && decoded.role === "admin";
    
    console.log("🔍 Is admin?", isAdmin);

    if (!isAdmin) {
      console.log("❌ Access denied");
      return NextResponse.json(
        { error: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    console.log("✅ Admin verified successfully");
    return NextResponse.json({ success: true, isAdmin: true });
  } catch (err: any) {
    console.error("❌ Admin verification error:", err);
    console.error("❌ Error name:", err.name);
    console.error("❌ Error message:", err.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}