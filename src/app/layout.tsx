// src/app/layout.tsx
import "./globals.css";
import React, { ReactNode } from "react";
import Footer from "../components/footer/footer";

export const metadata = {
  title: "AnubisPaws",
  description: "Pet Care, Veterinary & Adoption Management System",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 overflow-x-hidden" suppressHydrationWarning>
        <main className="relative z-10 container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
