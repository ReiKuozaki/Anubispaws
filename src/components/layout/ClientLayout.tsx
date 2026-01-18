"use client";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
