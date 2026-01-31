"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentMethod } from "@/lib/types";

function PaymentContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>(PaymentMethod.ESEWA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setOrderId(searchParams.get("orderId"));
    setAmount(searchParams.get("amount"));
  }, [searchParams]);

  if (!orderId || !amount) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-3 text-gray-900">Error</h1>
          <p className="text-sm text-gray-600 mb-5">Missing order information</p>
          <p>Please go back and try again.</p>
        </div>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount,
          method: selectedMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment initiation failed");
      }

      const paymentData = await response.json();

      if (selectedMethod === PaymentMethod.ESEWA) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const esewaPayload = {
          amount: paymentData.esewaConfig.amount,
          tax_amount: paymentData.esewaConfig.tax_amount,
          total_amount: paymentData.esewaConfig.total_amount,
          transaction_uuid: paymentData.esewaConfig.transaction_uuid,
          product_code: paymentData.esewaConfig.product_code,
          product_service_charge: paymentData.esewaConfig.product_service_charge,
          product_delivery_charge: paymentData.esewaConfig.product_delivery_charge,
          success_url: paymentData.esewaConfig.success_url,
          failure_url: paymentData.esewaConfig.failure_url,
          signed_field_names: paymentData.esewaConfig.signed_field_names,
          signature: paymentData.esewaConfig.signature,
        };

        Object.entries(esewaPayload).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (selectedMethod === PaymentMethod.KHALTI) {
        if (!paymentData.khaltiPaymentUrl) {
          throw new Error("Khalti payment URL not received");
        }
        window.location.href = paymentData.khaltiPaymentUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-3 text-gray-900">Complete Payment</h1>
        <p className="text-sm text-gray-600 mb-6">
          Order #{orderId} - NPR {parseFloat(amount).toFixed(2)}
        </p>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Select Payment Method
            </label>

            <div className="space-y-3">
              <label className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.ESEWA}
                  checked={selectedMethod === PaymentMethod.ESEWA}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">eSewa</div>
                  <div className="text-sm text-gray-600">
                    Pay with eSewa digital wallet
                  </div>
                </div>
              </label>

              <label className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.KHALTI}
                  checked={selectedMethod === PaymentMethod.KHALTI}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Khalti</div>
                  <div className="text-sm text-gray-600">
                    Pay with Khalti digital wallet
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2 text-blue-900">Test Credentials:</h4>
            {selectedMethod === PaymentMethod.ESEWA ? (
              <div className="text-sm text-blue-800 space-y-1">
                <p>eSewa ID: 9806800001/2/3/4/5</p>
                <p>Password: Nepal@123</p>
                <p>MPIN: 1122</p>
                <p>Token: 123456</p>
              </div>
            ) : (
              <div className="text-sm text-blue-800 space-y-1">
                <p>Khalti ID: 9800000000-9800000005</p>
                <p>MPIN: 1111</p>
                <p>OTP: 987654</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium transition"
          >
            {isLoading ? "Processing..." : `Pay NPR ${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}