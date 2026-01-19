import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/db/db";

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pet_id, contact_phone, address, reason, experience } = body;

    // Check if pet is still available
    const [petRows] = await pool.execute(
      "SELECT status FROM pets WHERE id = ?",
      [pet_id]
    );
    
    const pet = (petRows as any[])[0];
    
    if (!pet || pet.status !== "available") {
      return NextResponse.json(
        { error: "This pet is no longer available for adoption" },
        { status: 400 }
      );
    }

    // Create adoption request
    await pool.execute(
      `INSERT INTO pet_requests 
       (user_id, pet_id, contact_phone, address, reason, experience, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [user.id, pet_id, contact_phone, address, reason, experience || null]
    );

    // Update pet status to pending
    await pool.execute(
      "UPDATE pets SET status = 'pending' WHERE id = ?",
      [pet_id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to create adoption request:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}