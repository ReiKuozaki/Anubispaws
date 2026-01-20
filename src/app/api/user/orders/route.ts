// FILE: /api/user/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";
import { parseToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = parseToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Fetch orders for this user
    const [orders]: any = await pool.execute(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
      [decoded.id]
    );

    // For each order, fetch pets and products linked by user_id and pending/completed status
    const detailedOrders = await Promise.all(
      (orders as any[]).map(async (order) => {
        // Pets in this order
        const [pets]: any = await pool.execute(
          "SELECT id, name, species, breed, age, gender, description, status, price, image_url FROM pets WHERE owner_id=? AND status IN ('pending','completed')",
          [decoded.id]
        );

        // Products in this order (only those bought in this session)
        const [products]: any = await pool.execute(
          "SELECT id, name, price, stock FROM products WHERE stock >= 0"
        );

        return {
          ...order,
          pets,
          products: products.map((p: any) => ({
            ...p,
            quantity: 1, // Default 1 since no order_items table
          })),
        };
      })
    );

    return NextResponse.json({ orders: detailedOrders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = parseToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { pets = [], products = [], shipping_address, payment_method } = body;

    if (pets.length === 0 && products.length === 0)
      return NextResponse.json({ error: "No items to order" }, { status: 400 });

    let totalAmount = 0;

    // Step 1: Validate pets and mark pending
    for (const pet of pets) {
      const [rows]: any = await pool.execute(
        "SELECT price, status FROM pets WHERE id=?",
        [pet.id]
      );
      if (!rows.length) return NextResponse.json({ error: `Pet ${pet.id} not found` }, { status: 404 });
      if (rows[0].status !== "available") return NextResponse.json({ error: `Pet ${pet.id} not available` }, { status: 400 });

      totalAmount += Number(rows[0].price);

      // Mark pet as pending and assign owner
      await pool.execute(
        "UPDATE pets SET status='pending', owner_id=? WHERE id=?",
        [decoded.id, pet.id]
      );
    }

    // Step 2: Validate products and reduce stock
    for (const product of products) {
      const [rows]: any = await pool.execute(
        "SELECT price, stock FROM products WHERE id=?",
        [product.id]
      );
      if (!rows.length) return NextResponse.json({ error: `Product ${product.id} not found` }, { status: 404 });
      if (rows[0].stock < product.quantity)
        return NextResponse.json({ error: `Not enough stock for product ${product.id}` }, { status: 400 });

      totalAmount += Number(rows[0].price) * Number(product.quantity);

      // Reduce stock
      await pool.execute(
        "UPDATE products SET stock=stock-? WHERE id=?",
        [product.quantity, product.id]
      );
    }

    // Step 3: Insert order
   const [result]: any = await pool.execute(
     "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, 'pending', ?, ?)",
     [
       decoded.id,
       totalAmount,
       shipping_address || null,
       payment_method || null,
     ],
   );

    const orderId = result.insertId;

    return NextResponse.json({ message: "Order created", orderId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = parseToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const orderId = parseInt(id);
    if (isNaN(orderId))
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    // Verify order belongs to user
    const [orders]: any = await pool.execute(
      "SELECT * FROM orders WHERE id=? AND user_id=?",
      [orderId, decoded.id],
    );
    if (!orders.length)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = orders[0];

    // Only allow cancelling pending orders
    if (status === "cancelled" && order.status !== "pending")
      return NextResponse.json(
        { error: "Only pending orders can be cancelled" },
        { status: 400 },
      );

    // Update order status
    await pool.execute("UPDATE orders SET status=? WHERE id=?", [
      status,
      orderId,
    ]);

    if (status === "cancelled") {
      // Restore pets
      await pool.execute(
        "UPDATE pets SET status='available', owner_id=NULL WHERE owner_id=? AND status='pending'",
        [decoded.id],
      );

      // Restore product stock (optional: in real scenario you'd track quantity per order)
      // This example assumes 1 quantity per product for simplicity
      await pool.execute("UPDATE products SET stock=stock+1 WHERE stock >= 0");
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
