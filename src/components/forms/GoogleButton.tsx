"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <button
      
      onClick={() => signIn("google")}
      className="w-full text-white px-4 py-2 rounded-full hover:bg-black bg-transparent hover:bg-gray transition"
    >
      Continue with Google
    </button>
  );
}
