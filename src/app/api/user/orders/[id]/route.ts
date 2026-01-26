import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";
import { parseToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /* ───────── Auth ───────── */
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = parseToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const orderId = Number(id);
    if (isNaN(orderId))
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

    const { status } = await req.json();
    if (status !== "cancelled")
      return NextResponse.json({ error: "Only cancellation allowed" }, { status: 400 });

    /* ───────── Fetch order ───────── */
    const [rows]: any = await pool.execute(
      "SELECT * FROM orders WHERE id=? AND user_id=?",
      [orderId, decoded.id]
    );

    if (!rows.length)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = rows[0];

    if (order.status !== "pending")
      return NextResponse.json(
        { error: "Only pending orders can be cancelled" },
        { status: 400 }
      );

/* ───────── Reverse pets ───────── */
let pets: any[] = [];

if (order.order_pets) {
  pets =
    typeof order.order_pets === "string"
      ? JSON.parse(order.order_pets)
      : order.order_pets;
}

for (const pet of pets) {
  await pool.execute(
    "UPDATE pets SET status='available', owner_id=NULL WHERE id=?",
    [pet.id]
  );
}


/* ───────── Reverse products ───────── */
let products: any[] = [];

if (order.order_products) {
  products =
    typeof order.order_products === "string"
      ? JSON.parse(order.order_products)
      : order.order_products;
}

for (const item of products) {
  const productId = Number(item.id);
  const qty = Number(item.quantity);

  if (isNaN(productId) || isNaN(qty)) continue;

  await pool.execute(
    `
    UPDATE products
    SET stock = stock + ?, total_sold = GREATEST(total_sold - ?, 0)
    WHERE id = ?
    `,
    [qty, qty, productId]
  );
}


    /* ───────── Cancel order ───────── */
    await pool.execute(
      "UPDATE orders SET status='cancelled' WHERE id=?",
      [orderId]
    );

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel order error:", err);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
