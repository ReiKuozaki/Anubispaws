import type { NextApiRequest, NextApiResponse } from "next";
import  pool  from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const [rows] = await pool.execute("SELECT * FROM pets");
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { name, type, age } = req.body;
    await pool.execute(
      "INSERT INTO pets (name, type, age, created_at) VALUES (?, ?, ?, NOW())",
      [name, type, age]
    );
    return res.status(201).json({ message: "Pet added" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
