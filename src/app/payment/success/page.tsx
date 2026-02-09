"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BlurryBlob from "@/components/background/blurry-blob"; 

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pidx = params.get("pidx");

    if (!pidx) {
      alert("Payment ID missing");
      return;
    }

    fetch("/api/payments/khalti/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pidx }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          router.replace("/dashboard");
        } else {
          alert("Payment verification failed");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Verification error");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-32">
            <div className="absolute -top-30 left-1/2 -translate-x-1/2 z-0">
                    <BlurryBlob
                      className="animate-pop-blob"
                      firstBlobColor="bg-red-400"
                      secondBlobColor="bg-purple-400"
                    />
                  </div>
            <div className="text-white text-2xl">Verifying your payment! Please wait...</div>
          </div>
  );
}
