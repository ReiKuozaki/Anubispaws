"use client";

import Navbar from "@/components/navbar/Navbar";
import HomePageContent from "@/components/homepage/HomePageContent";



export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <HomePageContent />
        <h1>User Dashboard</h1>
      </div>
    </>
  );
}
