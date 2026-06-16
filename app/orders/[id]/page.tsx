"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Phone, User, CreditCard } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const API_URL = "http://localhost:8080";

type OrderStatus = "pending" | "paid" | "failed";

export default function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ FIX NEXT 15: params harus di-unpack
  const { id: orderId } = use(params);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        setOrder(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">Loading order...</div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-500">Order tidak ditemukan</div>
    );
  }

  const subtotal =
    order.items?.reduce(
      (total: number, item: any) => total + item.price * item.qty,
      0,
    ) || 0;

  const shipping = order.shipping ?? 0;
  const grandTotal = subtotal + shipping;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-xs text-white/70">Order ID</p>
              <h1 className="text-2xl font-bold">#{order.id}</h1>

              <p className="text-sm text-white/80 mt-1 mb-5">
                Order by{" "}
                <span className="font-semibold">{order.customer_name}</span>
              </p>

              <Link href="/member/orders">Lihat Pesanan</Link>
            </div>

            <StatusBadge status={order.status as OrderStatus} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* CUSTOMER */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-5">
                Customer Information
              </h2>

              <div className="space-y-3">
                <CustomerItem
                  icon={<User size={18} />}
                  title="Nama"
                  value={order.customer_name}
                />
                <CustomerItem
                  icon={<Phone size={18} />}
                  title="Nomor HP"
                  value={order.customer_phone}
                />
                <CustomerItem
                  icon={<MapPin size={18} />}
                  title="Alamat"
                  value={order.shipping_address}
                />
              </div>
            </div>

            {/* ITEMS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-5">Product List</h2>

              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-slate-50 rounded-2xl p-4"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Package size={20} />
                      </div>

                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-xs text-slate-500">Qty {item.qty}</p>
                      </div>
                    </div>

                    <div className="text-right font-semibold">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="font-semibold text-lg mb-5">Payment Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping.toLocaleString("id-ID")}</span>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-600">
                  {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {order.status === "pending" && (
              <Link
                href={`/payment/${order.id}`}
                className="mt-6 flex justify-center items-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold"
              >
                <CreditCard size={18} />
                Bayar Sekarang
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* COMPONENT */
function CustomerItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 items-center bg-slate-50 rounded-xl p-3">
      <div className="text-emerald-600">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
