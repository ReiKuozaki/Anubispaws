// app/api/user/orders/route.ts
import { NextResponse } from "next/server";
import pool from "@/db/db";
import { parseToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = parseToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = decoded.id;
    const body = await req.json();
    const { items, shipping_address, payment_method } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Calculate total
    const total_amount = items.reduce((sum: number, i: any) => sum + i.price * (i.quantity || 1), 0);

    // Insert order
    const [orderResult]: any = await pool.execute(
      "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, 'pending', ?, ?)",
      [userId, total_amount, shipping_address, payment_method]
    );

    const orderId = (orderResult as any).insertId;

    // Insert items
    for (const item of items) {
      await pool.execute(
        "INSERT INTO order_items (order_id, item_type, item_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [
          orderId,
          item.type,
          item.id,
          item.quantity || 1,
          item.price,
        ]
      );
    }

    return NextResponse.json({ message: "Order created", orderId });
  } catch (err) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
