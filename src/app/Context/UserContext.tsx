"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role?: string;  // ✅ ADD THIS
  image?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    console.log("🔄 Refreshing user...");
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token);
    
    if (!token) {
      console.log("❌ No token found");
      setUser(null);
      return;
    }

    try {
      const res = await fetch("/api/user/session", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📡 Session response status:", res.status);
      
      if (!res.ok) {
        console.log("❌ Invalid token, clearing...");
        localStorage.removeItem("token");
        setUser(null);
        return;
      }
      
      const data = await res.json();
      console.log("📦 Session data:", data);
      console.log("📦 data.user:", data.user);
      
      if (data.user) {
        console.log("✅ Setting user:", data.user);
        setUser(data.user);
      } else {
        console.log("❌ No user in response");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error fetching session:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    console.log("🚀 UserProvider mounted");
    refreshUser();
  }, []);

  console.log("👤 Current user state:", user);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}