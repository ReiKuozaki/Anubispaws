"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/Context/UserContext";

interface PetOrder {
  id: number;
  name: string;
  species: string;
  price: number;
  status: string;
  image_url?: string;
  breed?: string;
  age?: number;
  gender?: string;
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
  shipping_address?: string;
  payment_method?: string;
}

export default function DashboardPage() {
  const { user, setUser } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.log(data.orders);

    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
    

  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (res.ok) {
        alert("Order cancelled successfully");
        fetchUserOrders();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Error cancelling order");
    }
  };

  const handleProfileUpdate = async (name: string, image: string) => {
    try {
      const token = localStorage.getItem("token");
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

      const updatedUser = {
        ...user,
        name,
        image: updatedImage,
        email: user.email || "",
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
        <UserProfile user={user} onSave={handleProfileUpdate} />

        <h2 className="text-2xl text-white font-semibold mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-300">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white/10 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl text-white font-semibold">
                    Order #{order.id}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-500/30 text-yellow-200"
                        : order.status === "processing"
                          ? "bg-blue-500/30 text-blue-200"
                          : order.status === "completed"
                            ? "bg-green-500/30 text-green-200"
                            : "bg-red-500/30 text-red-200"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {/* Pets */}
                {order.pets && order.pets.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span>🐾</span> Pet Adoptions
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      {order.pets.map((pet) => (
                        <div
                          key={pet.id}
                          className="flex justify-between items-center text-gray-200 gap-4"
                        >
                          <div className="flex items-center gap-4">
                            {pet.image_url && (
                              <img
                                src={pet.image_url}
                                alt={pet.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{pet.name}</p>
                              <p className="text-sm text-gray-400">
                                {pet.species} • {pet.breed} • Age: {pet.age} •
                                Gender: {pet.gender}
                              </p>
                              <p className="text-sm text-gray-400">
                                Status: {pet.status}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">NPR {pet.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {order.products && order.products.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span>🛍️</span> Products
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-gray-200"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-400">
                              Quantity: {product.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">NPR {product.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t border-white/20">
                {order.shipping_address && (
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-semibold">Shipping:</span>{" "}
                    {order.shipping_address}
                  </p>
                )}
                {order.payment_method && (
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-semibold">Payment:</span>{" "}
                    {order.payment_method}
                  </p>
                )}
                <div className="flex justify-end mt-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-white font-bold text-2xl">
                      NPR {order.total_amount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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