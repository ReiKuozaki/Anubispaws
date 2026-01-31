import { NextResponse } from "next/server";
import { createPaymentFromOrder } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const { paymentId, order } = await createPaymentFromOrder(
      Number(orderId),
      "ESEWA"
    );

    const params = {
      amt: order.total_amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: order.total_amount,
      pid: paymentId,
      scd: process.env.ESEWA_MERCHANT_CODE!,
      su: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/esewa/verify`,
      fu: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`,
    };

    return NextResponse.json({
      url: "https://uat.esewa.com.np/epay/main",
      params,
    });
  } catch (err: any) {
    console.error("eSewa POST error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
