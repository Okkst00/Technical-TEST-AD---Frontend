"use client";

import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const API_URL = "http://localhost:8080";

type OrderStatus = "pending" | "paid" | "failed";

type Order = {
  id: string;
  order_code: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
  items?: any[];
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/orders/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        setOrders(json.data || []);
      } catch (err) {
        console.log("error fetch orders", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading orders...</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <Clock size={18} />
        Order History
      </h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            href={`/orders/${order.id}`}
            key={order.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Package size={18} />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  {order.order_code}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(order.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="font-semibold text-slate-800">
                Rp {order.total_amount?.toLocaleString("id-ID")}
              </p>

              <StatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = {
    paid: {
      label: "Paid",
      icon: <CheckCircle size={14} />,
      style: "bg-emerald-100 text-emerald-700",
    },
    pending: {
      label: "Pending",
      icon: <Clock size={14} />,
      style: "bg-yellow-100 text-yellow-700",
    },
    failed: {
      label: "Failed",
      icon: <XCircle size={14} />,
      style: "bg-red-100 text-red-700",
    },
  };

  const s = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.style}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
}
