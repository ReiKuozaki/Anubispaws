import { NextResponse } from "next/server";
import pool from "@/db/db"; // your MySQL pool

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params is a Promise in App Router
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    console.log("🛒 Fetching product id:", id);

    const [rows]: any = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: rows[0] });
  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
