// lib/middleware.ts
import { verifyToken } from "./auth";

export function requireAuth(token: string | null) {
  if (!token) throw new Error("Unauthorized");
  return verifyToken(token);
}
