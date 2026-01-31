import { NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const refId = searchParams.get("refId");
  const pid = searchParams.get("pid");

  if (!refId || !pid) {
    return NextResponse.redirect("/payment/failed");
  }

  const conn = await pool.getConnection();

  try {
    // 🔎 Verify with eSewa
    const verifyUrl =
      `https://uat.esewa.com.np/epay/transrec` +
      `?amt=&rid=${refId}&pid=${pid}&scd=${process.env.ESEWA_MERCHANT_CODE}`;

    const esewaRes = await fetch(verifyUrl);
    const text = await esewaRes.text();

    if (!text.includes("Success")) {
      throw new Error("eSewa verification failed");
    }

    // 1️⃣ Update payment
    await conn.query(
      `
      UPDATE payments
      SET payment_status='COMPLETED',
          esewa_ref_id=?
      WHERE id=?
      `,
      [refId, pid]
    );

    // 2️⃣ Update order → processing
    await conn.query(
      `
      UPDATE orders
      SET status='processing'
      WHERE id=(SELECT order_id FROM payments WHERE id=?)
      `,
      [pid]
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`
    );
  } catch (err) {
    console.error("eSewa verify error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`
    );
  } finally {
    conn.release();
  }
}
