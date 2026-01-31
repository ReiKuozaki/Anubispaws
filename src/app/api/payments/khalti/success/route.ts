import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function POST(req: NextRequest) {
  try {
    const { pidx, transaction_id } = await req.json();

    if (!pidx || !transaction_id) {
      return NextResponse.json({ error: "Missing pidx or transaction_id" }, { status: 400 });
    }

    // 1️⃣ Find payment record
    const [payments]: any = await db.query(
      "SELECT * FROM payments WHERE khalti_pidx = ?",
      [pidx]
    );

    if (!payments.length) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const payment = payments[0];

    // 2️⃣ Check if this pidx was already used in another payment
    const [existing]: any = await db.query(
      "SELECT * FROM payments WHERE khalti_pidx = ? AND id != ?",
      [pidx, payment.id]
    );

    if (existing.length) {
      console.error("FRAUD ALERT: Reused pidx detected", pidx);
      return NextResponse.json({ error: "Payment verification failed: pidx already used" }, { status: 400 });
    }

    // 3️⃣ Update payments table to COMPLETED
    await db.query(
      "UPDATE payments SET payment_status = 'COMPLETED', khalti_transaction_id = ? WHERE id = ?",
      [transaction_id, payment.id]
    );

    // 4️⃣ Update orders table to PROCESSING
    await db.query(
      "UPDATE orders SET status = 'PROCESSING' WHERE id = ?",
      [payment.order_id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Khalti success POST error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
