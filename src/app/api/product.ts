import type { NextApiRequest, NextApiResponse } from "next";
import pool  from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const [rows] = await pool.execute("SELECT * FROM products");
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { name, price, stock } = req.body;
    await pool.execute(
      "INSERT INTO products (name, price, stock, created_at) VALUES (?, ?, ?, NOW())",
      [name, price, stock || 0]
    );
    return res.status(201).json({ message: "Product added" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
