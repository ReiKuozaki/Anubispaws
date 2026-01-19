import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  console.log("=== USER SESSION API START ===");
  
  try {
    const authHeader = req.headers.get("authorization");
    
    console.log("📍 Auth header present:", !!authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid auth header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not defined!");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    const token = authHeader.split(" ")[1];
    console.log("📍 Verifying token...");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    console.log("📍 Token verified! User:", decoded.name, "Role:", decoded.role);

    const response = {
      user: {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,  // ✅ ADD THIS
      },
    };

    console.log("✅ Sending response:", response);
    return NextResponse.json(response);
    
  } catch (err: any) {
    console.error("❌ Session error:", err.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}