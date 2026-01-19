// app/api/user/orders/route.ts
import { NextResponse } from "next/server";
import pool from "@/db/db";
import { parseToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = parseToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // Fetch orders for this user
    const [ordersRows]: any = await pool.execute(
      "SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    const orders = [];

    for (const order of ordersRows) {
      // Fetch pets in this order
      const [petRows]: any = await pool.execute(
        `SELECT p.id, p.name, p.species, oi.price, oi.status
         FROM order_items oi
         JOIN pets p ON oi.item_type = 'pet' AND oi.item_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      // Fetch products in this order
      const [productRows]: any = await pool.execute(
        `SELECT pr.id, pr.name, oi.quantity, oi.price
         FROM order_items oi
         JOIN products pr ON oi.item_type = 'product' AND oi.item_id = pr.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      orders.push({
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        pets: petRows,
        products: productRows,
      });
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
