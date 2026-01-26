"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/Context/UserContext";

interface Pet {
  price: any;
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  status: string;
  image_url?: string;
}

export default function AdoptPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useUser();

  // ✅ REQUIRED in Next.js 16
  const { id: petId } = React.use(params);

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
 const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [formData, setFormData] = useState({
    contact_phone: "",
    address: "",
    shipping_address: "",
    reason: "",
    experience: "",
  });

  // Wait for user context
  useEffect(() => {
    const t = setTimeout(() => setCheckingAuth(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Auth + fetch
  useEffect(() => {
    if (checkingAuth) return;

    if (!user) {
      alert("Please login to adopt a pet");
      router.push("/auth?tab=login");
      return;
    }

    fetchPet();
  }, [checkingAuth, user, petId]);

  const fetchPet = async () => {
    try {
      const res = await fetch(`/api/pets/${petId}`);

      if (!res.ok) throw new Error("Pet not found");

      const data = await res.json();
      setPet(data.pet);
    } catch (err) {
      console.error("Failed to fetch pet:", err);
      alert("Pet not found");
      router.push("/adoption");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch("/api/user/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pets: [{ id: petId }],
        products: [], // nothing here for pets
        customer_name: customerName,
        customer_email: customerEmail,
        contact_phone: formData.contact_phone,
      shipping_address: formData.shipping_address,
        payment_method: "Cash on Delivery", // or from user input
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create order");

    alert("Adoption request submitted!");
    router.push("/dashboard"); // redirect to dashboard to see the order
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Failed to submit request");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-32 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Adopt {pet.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pet Card */}
          <div className="bg-white/10 rounded-xl overflow-hidden">
            <div className="h-72 flex items-center justify-center bg-purple-600">
              {pet.image_url ? (
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">🐾</span>
              )}
            </div>

            <div className="p-6 text-white space-y-2">
              <p><b>Breed:</b> {pet.breed}</p>
              <p><b>Age:</b> {pet.age}</p>
              <p><b>Gender:</b> {pet.gender}</p>
              <p className="text-gray-300 mt-2">{pet.description}</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 rounded-xl p-6 space-y-4"
          >
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
              required
            />

            <input
              type="email"
              placeholder="Your email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
              required
            />
          </div>

            <input
              required
              placeholder="Phone"
              className="w-full p-3 bg-white/10 text-white rounded"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
            />

            <textarea
              required
              placeholder="Address"
              className="w-full p-3 bg-white/10 text-white rounded"
              value={formData.shipping_address}
              onChange={(e) =>
                setFormData({ ...formData, shipping_address: e.target.value })
              }
            />

            <textarea
              required
              placeholder="Why adopt?"
              className="w-full p-3 bg-white/10 text-white rounded"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />

            <button
              disabled={submitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
            >
              {submitting ? "Submitting..." : `Submit Adoption Request (Price: ${pet.price} NPR)`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
