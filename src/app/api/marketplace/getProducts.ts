import { NextResponse } from "next/server";
import { pool } from "@/db/db";

export async function GET() {
  const [products] = await pool.query("SELECT * FROM products");
  return NextResponse.json({ products });
}
