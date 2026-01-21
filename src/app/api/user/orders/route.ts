import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";
import { parseToken } from "@/lib/auth";

// Safe JSON parse utility
function safeJsonParse(value: any, defaultValue: any = []) {
  try {
    if (!value) return defaultValue;
    if (typeof value !== "string") return defaultValue;
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = parseToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Get all orders for user
    const [orders]: any = await pool.execute(
      "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
      [decoded.id]
    );

    // Enrich orders with pet & product details
    const detailedOrders = await Promise.all(
      orders.map(async (order: any) => {
        const petItems = safeJsonParse(order.pets, []);
        const productItems = safeJsonParse(order.products, []);

        let pets: any[] = [];
        let products: any[] = [];

        // Pets: get full details
        if (petItems.length > 0) {
          const ids = petItems.map((p: any) => Number(p.id));
          const [rows]: any = await pool.execute(
            `SELECT id, name, species, breed, age, gender, status, price, image_url
             FROM pets WHERE id IN (${ids.map(() => "?").join(",")})`,
            ids
          );
          pets = rows.map((p: any) => ({
            id: Number(p.id),
            name: p.name,
            species: p.species,
            breed: p.breed,
            age: p.age,
            gender: p.gender,
            status: p.status,
            price: Number(p.price),
            image_url: p.image_url,
          }));
        }

        // Products: get full details + quantity
        if (productItems.length > 0) {
          const ids = productItems.map((p: any) => Number(p.id));
          const [rows]: any = await pool.execute(
            `SELECT id, name, price
             FROM products WHERE id IN (${ids.map(() => "?").join(",")})`,
            ids
          );

          products = rows.map((p: any) => {
            const prod = productItems.find(
              (i: any) => Number(i.id) === Number(p.id),
            );
            return {
              id: Number(p.id), // ✅ ADD THIS
              name: p.name,
              price: Number(p.price),
              quantity: Number(prod?.quantity ?? 1),
              imageurl: p.image_url
            };
          });
        }

        return {
          ...order,
          pets,
          products,
        };
      })
    );

    return NextResponse.json({ orders: detailedOrders });
  } catch (err) {
    console.error("GET orders error:", err);
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
    const petsPayload: any[] = [];
    const productsPayload: any[] = [];

    // Pets
    for (const pet of pets) {
      const [rows]: any = await pool.execute(
        "SELECT price, status FROM pets WHERE id=?",
        [pet.id]
      );

      if (!rows.length) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
      if (rows[0].status !== "available")
        return NextResponse.json({ error: "Pet not available" }, { status: 400 });

      totalAmount += Number(rows[0].price);

      await pool.execute(
        "UPDATE pets SET status='pending', owner_id=? WHERE id=?",
        [decoded.id, pet.id]
      );

      petsPayload.push({ id: pet.id });
    }

    // Products
    for (const product of products) {
      const [rows]: any = await pool.execute(
        "SELECT price, stock FROM products WHERE id=?",
        [product.id]
      );

      if (!rows.length) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      if (rows[0].stock < product.quantity)
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });

      totalAmount += Number(rows[0].price) * product.quantity;

      await pool.execute("UPDATE products SET stock=stock-? WHERE id=?", [product.quantity, product.id]);

      productsPayload.push({ id: product.id, quantity: product.quantity });
    }

    // Store order
    const [result]: any = await pool.execute(
      `INSERT INTO orders 
       (user_id, pets, products, total_amount, status, shipping_address, payment_method)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [
        decoded.id,
        JSON.stringify(petsPayload),
        JSON.stringify(productsPayload),
        totalAmount,
        shipping_address || null,
        payment_method || null,
      ]
    );

    return NextResponse.json({ message: "Order created", orderId: result.insertId });
  } catch (err) {
    console.error("POST order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const [orders]: any = await pool.execute(
      "SELECT * FROM orders WHERE id=? AND user_id=?",
      [orderId, decoded.id]
    );
    if (!orders.length)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = orders[0];

    const { status } = await req.json();
    if (status === "cancelled" && order.status !== "pending")
      return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });

    await pool.execute("UPDATE orders SET status=? WHERE id=?", [status, orderId]);

    if (status === "cancelled") {
      await pool.execute(
        "UPDATE pets SET status='available', owner_id=NULL WHERE owner_id=? AND status='pending'",
        [decoded.id]
      );

      // Optional: restore product stock
      // If you want exact quantity, you can read order.products and update stock accordingly
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("PATCH order error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
