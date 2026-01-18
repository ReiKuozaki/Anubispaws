import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const parseToken = (token: string | undefined) => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
};
