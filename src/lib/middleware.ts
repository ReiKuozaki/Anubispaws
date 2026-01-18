// lib/middleware.ts
import { parseToken } from "./auth";

export function requireAuth(token: string | null) {
  if (!token) throw new Error("Unauthorized");
  return parseToken(token); // instead of verifyToken
}
