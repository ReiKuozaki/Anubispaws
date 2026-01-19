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
    return decoded.email === ADMIN_EMAIL && decoded.role === "admin"
      ? decoded
      : null;
  } catch {
    return null;
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ params is a Promise
) {
  console.log("🗑️ Admin Products DELETE called");

  const admin = verifyAdmin(req);
  if (!admin) {
    console.log("❌ Unauthorized delete attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;  // ✅ Await params first
    const productId = Number(id);
    console.log("🗑️ Deleting product ID:", productId);

    const [result] = await pool.execute(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );

    const affected = (result as any).affectedRows;

    if (affected === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ Product deleted:", productId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Failed to delete product:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}