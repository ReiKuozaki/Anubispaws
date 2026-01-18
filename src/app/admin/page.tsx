"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "pets" | "products" | "appointments">("users");

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth?tab=login");
        return;
      }

      try {
        const res = await fetch("/api/user/verify-admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          alert("Access denied: Admins only");
          router.push("/");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white text-2xl">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your pet care platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: "users", label: "Users", icon: "👥" },
            { id: "pets", label: "Pet Adoptions", icon: "🐾" },
            { id: "products", label: "Products", icon: "🛍️" },
            { id: "appointments", label: "Appointments", icon: "📅" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-purple-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          {activeTab === "users" && <UsersManager />}
          {activeTab === "pets" && <PetsManager />}
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "appointments" && <AppointmentsManager />}
        </div>
      </div>
    </div>
  );
}

// ==================== USERS MANAGER ====================
function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="text-white text-center">Loading users...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Users Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-purple-500/30 rounded text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.isVerified ? "✅" : "❌"}
                </td>
                <td className="px-4 py-3">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== PETS MANAGER ====================
function PetsManager() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPets(data.pets || []);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pet listing?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/pets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Pet listing deleted successfully");
        fetchPets();
      } else {
        alert("Failed to delete pet listing");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="text-white text-center">Loading pets...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Pet Adoptions Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Species</th>
              <th className="px-4 py-3 text-left">Breed</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{pet.id}</td>
                <td className="px-4 py-3">{pet.name}</td>
                <td className="px-4 py-3">{pet.species}</td>
                <td className="px-4 py-3">{pet.breed}</td>
                <td className="px-4 py-3">{pet.age}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      pet.status === "available"
                        ? "bg-green-500/30"
                        : "bg-yellow-500/30"
                    }`}
                  >
                    {pet.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deletePet(pet.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== PRODUCTS MANAGER ====================
function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="text-white text-center">Loading products...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Products Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{product.id}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">${product.price}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== APPOINTMENTS MANAGER ====================
function AppointmentsManager() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Appointment deleted successfully");
        fetchAppointments();
      } else {
        alert("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("Appointment status updated");
        fetchAppointments();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <div className="text-white text-center">Loading appointments...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Appointments Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Pet Owner</th>
              <th className="px-4 py-3 text-left">Pet Name</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{apt.id}</td>
                <td className="px-4 py-3">{apt.owner_name}</td>
                <td className="px-4 py-3">{apt.pet_name}</td>
                <td className="px-4 py-3">
                  {new Date(apt.appointment_date).toLocaleString()}
                </td>
                <td className="px-4 py-3">{apt.reason}</td>
                <td className="px-4 py-3">
                  <select
                    value={apt.status}
                    onChange={(e) => updateStatus(apt.id, e.target.value)}
                    className="bg-white/10 px-2 py-1 rounded border border-white/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteAppointment(apt.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}