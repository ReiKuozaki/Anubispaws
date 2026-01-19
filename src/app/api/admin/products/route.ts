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
  console.log("📍 Admin Products GET called");
  
  const admin = verifyAdmin(req);
  if (!admin) {
    console.log("❌ Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    console.log("✅ Fetched", (rows as any[]).length, "products");
    return NextResponse.json({ products: rows });
  } catch (err: any) {
    console.error("❌ Failed to fetch products:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log("📍 Admin Products POST called");
  
  const admin = verifyAdmin(req);
  if (!admin) {
    console.log("❌ Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("📦 Received product data:", body);
    
    const { name, description, price, category, stock, image_url } = body;

    // Ensure image_url is either string or null
    const image = image_url && image_url.trim() !== "" ? image_url : null;

    const [result] = await pool.execute(
      "INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, category, stock, image]
    );

    console.log("✅ Product added successfully, ID:", (result as any).insertId);
    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (err: any) {
    console.error("❌ Failed to add product:", err);
    console.error("❌ Error message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}