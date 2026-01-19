import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ESEWA_TOKEN_URL = "https://uat.esewa.com.np/api/epay/oauth2/token";
const ESEWA_PAYMENT_URL = "https://uat.esewa.com.np/api/epay/main/v2/form";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { petId, amount } = await req.json();

    // Get eSewa access token
    const tokenRes = await fetch(ESEWA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.ESEWA_CLIENT_ID}:${process.env.ESEWA_CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Failed to get eSewa token" }, { status: 500 });
    }

    const tokenData = await tokenRes.json();

    // Payment payload (merchant code can be dynamic later)
    const paymentPayload = {
      amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: `pet-${petId}-${Date.now()}`,
      product_code: "TEST-MERCHANT", // placeholder, can update later
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    return NextResponse.json({
      paymentUrl: ESEWA_PAYMENT_URL,
      payload: paymentPayload,
      accessToken: tokenData.access_token,
    });
  } catch (err) {
    console.error("❌ eSewa create error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
