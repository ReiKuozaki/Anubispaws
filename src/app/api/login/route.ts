import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/db/db";

export async function POST(req: NextRequest) {
  console.log("🔐 Login API called");
  console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
  console.log("🔑 JWT_SECRET length:", process.env.JWT_SECRET?.length);

  try {
    
    const body = await req.json();
    const { email, password } = body;

    console.log("📧 Login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined in environment variables!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("🔍 Querying database...");
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = (rows as any[])[0];
    console.log("✅ Fetched user:", user ? { id: user.id, email: user.email, name: user.name } : null);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("🔐 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("🎫 Creating JWT token...");
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: user.role, // ✅ ADD THIS LINE
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    console.log("✅ User from database:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // ✅ ADD THIS LINE
    });

    return NextResponse.json({
      token,
      user: { name: user.name, email: user.email, role: user.role }, // ✅ ADD role here too
    });
  } catch (err: any) {
    console.error("❌ Login error:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    return NextResponse.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}