"use client";

import { CreditCard, Wallet, Landmark, QrCode } from "lucide-react";

import { useState } from "react";

type PaymentMethod = "bank" | "ewallet" | "card" | "qris";

export default function PaymentCard() {
  const [method, setMethod] = useState<PaymentMethod>("bank");

  const [loading, setLoading] = useState(false);

  const payments = [
    {
      id: "bank",
      title: "Bank Transfer",
      icon: <Landmark size={22} />,
    },
    {
      id: "ewallet",
      title: "E-Wallet",
      icon: <Wallet size={22} />,
    },
    {
      id: "card",
      title: "Credit Card",
      icon: <CreditCard size={22} />,
    },
    {
      id: "qris",
      title: "QRIS",
      icon: <QrCode size={22} />,
    },
  ];

  function pay() {
    setLoading(true);

    setTimeout(() => {
      const success = Math.random() < 0.8;

      if (success) {
        alert("Payment Success (Webhook Received)");
      } else {
        alert("Payment Failed");
      }

      setLoading(false);
    }, 1500);
  }

  return (
    <div
      className="
max-w-md
bg-white
rounded-3xl
shadow-xl
border
p-6
"
    >
      <h1
        className="
text-xl
font-bold
"
      >
        Payment Gateway
      </h1>

      <p
        className="
text-sm
text-gray-400
mt-1
"
      >
        Powered by Mock Midtrans
      </p>

      <div
        className="
bg-gray-50
rounded-2xl
p-5
mt-6
"
      >
        <p
          className="
text-sm
text-gray-500
"
        >
          Amount
        </p>

        <h2
          className="
text-3xl
font-bold
"
        >
          Rp 150.000
        </h2>
      </div>

      <h3
        className="
font-semibold
mt-6
mb-3
"
      >
        Choose Payment Method
      </h3>

      <div
        className="
space-y-3
"
      >
        {payments.map((item) => (
          <button
            key={item.id}
            onClick={() => setMethod(item.id as PaymentMethod)}
            className={`
w-full
flex
items-center
gap-3
p-4
rounded-xl
border
transition

${method === item.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}

`}
          >
            {item.icon}

            <span>{item.title}</span>
          </button>
        ))}
      </div>

      <button
        onClick={pay}
        disabled={loading}
        className="
mt-6
w-full
bg-indigo-600
text-white
py-4
rounded-xl
font-semibold
hover:bg-indigo-700
disabled:bg-gray-400
"
      >
        {loading ? "Processing Payment..." : "Bayar Sekarang"}
      </button>

      <p
        className="
text-xs
text-center
text-gray-400
mt-4
"
      >
        Simulation: 80% Success 20% Failed
      </p>
    </div>
  );
}
