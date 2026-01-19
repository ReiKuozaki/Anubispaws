"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/Context/UserContext";

interface PetOrder {
  id: number;
  name: string;
  species: string;
  price: number;
  status: string;
}

interface ProductOrder {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  pets: PetOrder[];
  products: ProductOrder[];
  total_amount: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, setUser } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  useEffect(() => {
    if (!user) return;
    fetchUserOrders();
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };
//profile update
const handleProfileUpdate = async (name: string, image: string) => {
  try {
    const token = localStorage.getItem("token");

    // Use existing image if no new one provided
    const updatedImage = image || user?.image || "";
    
    if (!user) throw new Error("No user logged in");

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, image: updatedImage }),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    // Make sure email is always a string
    const updatedUser = {
      ...user,
      name,
      image: updatedImage,
      email: user.email || "", // ✅ guarantee string
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated!");
  } catch (err) {
    console.error(err);
    alert("Error updating profile");
  }
};


  if (!user)
    return (
      <div className="text-white text-center mt-32">
        Please login to view your dashboard
      </div>
    );

  if (loading)
    return (
      <div className="text-white text-center mt-32">Loading orders...</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-32 px-4">
      <div className="max-w-5xl mx-auto">

        {/* User Profile Card */}
        <UserProfile user={user} onSave={handleProfileUpdate} />

        {/* Orders Section */}
        <h2 className="text-2xl text-white font-semibold mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-300">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 rounded-xl p-4 mb-6 overflow-x-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-white font-semibold">
                  Order #{order.id}
                </h3>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    order.status === "pending"
                      ? "bg-yellow-500/30"
                      : "bg-green-500/30"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <table className="w-full text-white text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-3 py-2 text-left">Item</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Quantity/Status</th>
                    <th className="px-3 py-2 text-left">Price (NPR)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.pets.map((pet) => (
                    <tr key={`pet-${pet.id}`} className="border-b border-white/10">
                      <td className="px-3 py-2">{pet.name}</td>
                      <td className="px-3 py-2">Pet</td>
                      <td className="px-3 py-2">{pet.status}</td>
                      <td className="px-3 py-2">{pet.price}</td>
                    </tr>
                  ))}
                  {order.products.map((prod) => (
                    <tr key={`prod-${prod.id}`} className="border-b border-white/10">
                      <td className="px-3 py-2">{prod.name}</td>
                      <td className="px-3 py-2">Product</td>
                      <td className="px-3 py-2">{prod.quantity}</td>
                      <td className="px-3 py-2">{prod.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-4 text-white font-semibold text-lg">
                Total: NPR {order.total_amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------- User Profile Component ----------------
function UserProfile({ user, onSave }: { user: any; onSave: (name: string, image: string) => void }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");

  return (
    <div className="bg-white/10 rounded-xl p-6 flex items-center gap-6 mb-8">
      <img
        src={image || "/images/default-avatar.png"}
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        {!editMode ? (
          <>
            <h1 className="text-2xl text-white font-semibold">{name || user.email}</h1>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded text-black"
              placeholder="Name"
            />
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="p-2 rounded text-black"
              placeholder="Profile Image URL"
            />
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                onClick={() => {
                  onSave(name, image);
                  setEditMode(false);
                }}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
