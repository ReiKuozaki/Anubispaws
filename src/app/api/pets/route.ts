import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM pets WHERE status = 'available' ORDER BY created_at DESC"
    );
    return NextResponse.json({ pets: rows });
  } catch (err) {
    console.error("Failed to fetch pets:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}