// Cancel an order
import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";
import { parseToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a promise
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = parseToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params; // <-- must await
  const orderId = Number(id);
  if (isNaN(orderId))
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

    const { status } = await req.json();
    if (status !== "cancelled") return NextResponse.json({ error: "Only cancellation allowed" }, { status: 400 });

    // Fetch order
    const [orders]: any = await pool.execute("SELECT * FROM orders WHERE id=? AND user_id=?", [orderId, decoded.id]);
    if (!orders.length) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = orders[0];

    if (order.status !== "pending") return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });

    // Reverse pets
    const pets = order.pets ? JSON.parse(order.pets) : [];
    for (const pet of pets) {
      await pool.execute("UPDATE pets SET status='available', owner_id=NULL WHERE id=?", [pet.id]);
    }

    // Reverse products
    const products = order.products ? JSON.parse(order.products) : [];
    for (const product of products) {
      await pool.execute("UPDATE products SET stock=stock+? WHERE id=?", [product.quantity, product.id]);
    }

    // Cancel order
    await pool.execute("UPDATE orders SET status='cancelled' WHERE id=?", [orderId]);

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
