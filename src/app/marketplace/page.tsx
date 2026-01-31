"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/Context/UserContext";
import { Spotlight } from "@/components/ui/spolight-new";
import { useRouter } from "next/navigation";

// Inside component:


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  weight: number;
  stock: number;
  image_url?: string;
  created_at: string;
}

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", "food", "toys", "accessories",];

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex items-center justify-center pt-32">
        <div className="text-white text-2xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-gray-900 via-purple-900 to-gray-900 pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Pet Marketplace
          </h1>
          <p className="text-xl text-gray-300">
            Everything your pet needs in one place
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? "bg-white text-purple-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-white text-xl">
            No products available yet. Check back soon! 🛍️
          </div>
        ) : (
          <div className="grid grid-cols-1 -mt-10 scale-70 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:transform hover:scale-105 transition duration-300"
              >
                {/* Product Image */}
                <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🛍️</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white">
                      {product.name}
                    </h3>
                    <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm text-white capitalize">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {product.description || "No description available"}
                  </p>
                    <p className="text-gray-300 mb-4 line-clamp-2">Weight(kg):
                    {product.weight || "No description available"}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold text-white">
                      NPR{product.price}
                    </span>
                    <span className="text-gray-400">
                      Stock:{" "}
                      {product.stock > 0 ? product.stock : "Out of stock"}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/marketplace/buy-product/${product.id}`)
                    }
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Add to order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Spotlight />
    </div>
  );
}