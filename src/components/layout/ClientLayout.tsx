"use client";

import Navbar from "@/components/navbar/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>

    </>
  );
}
