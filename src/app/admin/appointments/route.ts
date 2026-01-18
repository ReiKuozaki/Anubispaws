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
    return decoded.email === ADMIN_EMAIL ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Adjust this query based on your actual appointments table structure
    const [rows] = await pool.execute(
      `SELECT 
        a.*,
        u.name as owner_name
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date DESC`
    );
    return NextResponse.json({ appointments: rows });
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}