// app/dashboard/page.tsx
import { requireAuth } from "../../lib/middleware";

export default function DashboardPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  try {
    requireAuth(token);
  } catch {
    return <div>Please log in first</div>;
  }

  return <div>Welcome to dashboard!</div>;
}
