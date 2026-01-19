import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE stock > 0 ORDER BY created_at DESC"
    );
    return NextResponse.json({ products: rows });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}