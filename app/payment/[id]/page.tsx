"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Check, Clock, Package, CreditCard } from "lucide-react";
import CryptoJS from "crypto-js";

const API_URL = "http://localhost:8080";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = params.id as string;

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [order, setOrder] = useState<any>(null);

  const payment = {
    method: "BCA Virtual Account",
    va: "88081234567890",
  };

  // ==========================
  // LOAD ORDER
  // ==========================

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        setOrder(data);
      } catch (error) {
        console.error("Load order error", error);
      } finally {
        setLoadingOrder(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  function copyVA() {
    navigator.clipboard.writeText(payment.va);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function confirmPayment() {
    try {
      setLoading(true);

      const body = {
        order_id: Number(orderId),
        status: "paid",
      };

      const secret = process.env.NEXT_PUBLIC_PAYMENT_SECRET;

      if (!secret) {
        throw new Error("Payment secret is not defined");
      }

      const signature = CryptoJS.HmacSHA256(
        JSON.stringify(body),
        secret,
      ).toString(CryptoJS.enc.Hex);

      const res = await fetch(`${API_URL}/payments/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature": signature,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      alert(data.message);

      router.push(`/orders/${orderId}`);
    } catch (error) {
      console.error("Payment error", error);
    } finally {
      setLoading(false);
    }
  }

  if (loadingOrder || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading payment...
      </div>
    );
  }

  const item = order.items?.[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
        {/* HEADER */}

        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CreditCard size={32} />
          </div>

          <h1 className="text-2xl font-bold mt-4">Payment Instruction</h1>

          <p className="text-sm text-slate-400">Order {order.order_code}</p>
        </div>

        {/* VA */}

        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <p className="text-sm text-emerald-700">{payment.method}</p>

          <div className="flex justify-between items-center mt-2">
            <h2 className="text-2xl font-bold tracking-wider">{payment.va}</h2>

            <button
              onClick={copyVA}
              className="p-2 rounded-xl bg-white text-emerald-600"
            >
              {copied ? <Check /> : <Copy />}
            </button>
          </div>
        </div>

        {/* EXPIRY */}
        <div className="mt-5 bg-slate-50 rounded-2xl p-4 flex gap-3 items-center">
          <Clock className="text-emerald-600" />

          <div>
            <p className="text-xs text-slate-400">Bayar sebelum</p>

            <p className="font-semibold">24 Juni 2026 23:59</p>
          </div>
        </div>

        {/* ORDER */}

        <div className="mt-6 border border-slate-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <Package />
            </div>

            <div>
              <p className="font-semibold">{item?.nama_produk}</p>

              <p className="text-sm text-slate-500">Qty {item?.qty}</p>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>

            <span className="text-emerald-600">
              Rp {order.total_amount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* BUTTON */}

        <button
          onClick={confirmPayment}
          disabled={loading}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Saya Sudah Bayar"}
        </button>
      </div>
    </main>
  );
}
