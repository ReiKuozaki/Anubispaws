import { NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  try {
    const { id } = await params; // ✅ MUST await

    if (!id) {
      return NextResponse.json(
        { error: "Missing pet id" },
        { status: 400 }
      );
    }
    console.log("🐾 Fetching pet id:", id);

    const [rows]: any = await pool.execute(
      "SELECT * FROM pets WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pet: rows[0] });
  } catch (err) {
    console.error("❌ Failed to fetch pet:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
    
  }
}
