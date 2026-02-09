"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // ✅ Correct import for app directory
import { useUser } from "@/app/Context/UserContext";
import { Spotlight } from "@/components/ui/spolight-new";
import BlurryBlob from "@/components/background/blurry-blob";


interface Pet {
  price: ReactNode;
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  status: string;
  image_url?: string;
  created_at: string;
}

export default function AdoptionPage() {
  const router = useRouter();  // ✅ This is correct for "use client"
  const { user } = useUser();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("/api/pets");
      const data = await res.json();
      setPets(data.pets || []);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const species = ["all", "dog", "cat", "bird", "rabbit", "hamster", "other"];

  const filteredPets = selectedSpecies === "all"
    ? pets.filter(p => p.status === "available")
    : pets.filter(p => p.species === selectedSpecies && p.status === "available");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">  
              <div className="absolute -top-30 left-1/2 -translate-x-1/2 z-0">
                      <BlurryBlob
                        className="animate-pop-blob"
                        firstBlobColor="bg-red-400"
                        secondBlobColor="bg-purple-400"
                      />
                    </div>
        <div className="text-white text-2xl">Loading pets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-gray-900 via-purple-900 to-gray-900 pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold text-white mb-4">Find Your New Best Friend</h2>
          <p className="text-xl text-gray-300">Give a loving pet a forever home</p>
        </div>

        {/* Species Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto justify-center">
          {species.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecies(spec)}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap capitalize ${
                selectedSpecies === spec
                  ? "bg-white text-purple-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center text-white text-sm">
            No pets available for adoption yet. Check back soon! 🐾
          </div>
        ) : (
          <div className="grid grid-cols-1 -mt-10 scale-70 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:transform hover:scale-105 transition duration-300"
              >
                {/* Pet Image */}
                <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  {pet.image_url ? (
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🐾</span>
                  )}
                </div>

                {/* Pet Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white">{pet.name}</h3>
                    <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm text-white capitalize">
                      {pet.species}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">
                    <span className="font-semibold">Breed:</span> {pet.breed}<br />
                    <span className="font-semibold">Age:</span> {pet.age} {pet.age === 1 ? 'year' : 'years'}<br />
                    <span className="font-semibold">Gender:</span> {pet.gender} <br/>
                    <span className="font-semibold">Price:</span> {pet.price} NPR
                  </p>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {pet.description || "A wonderful companion looking for a loving home!"}
                  </p>

                  <button
                    onClick={() => router.push(`/adopt/${pet.id}`)}  // ✅ Fixed: use () not ``
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Add to orders
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