// lib/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function createToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
