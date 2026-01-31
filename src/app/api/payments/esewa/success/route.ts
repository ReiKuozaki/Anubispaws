import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const refId = searchParams.get("refId");
  const pid = searchParams.get("pid");

  if (!refId || !pid) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`
    );
  }

  // Redirect to verify route
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/esewa/verify?refId=${refId}&pid=${pid}`
  );
}
