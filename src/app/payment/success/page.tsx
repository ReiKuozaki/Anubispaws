"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <div className="text-white text-center mt-32">
      Verifying your payment, please wait...
    </div>
  );
}
