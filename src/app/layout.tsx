import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import { UserProvider } from "@/app/Context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AnubisPaws",
  description: "Your pet marketplace and adoption platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white`}>
        <UserProvider>
          <ClientLayout>{children}</ClientLayout>
        </UserProvider>
      </body>
    </html>
  );
}