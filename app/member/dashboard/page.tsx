"use client";

import { Package, ShoppingBag, Wallet, TrendingUp, Clock } from "lucide-react";

type OrderStatus = "paid" | "pending" | "failed";

type Order = {
  id: string;
  total: number;
  status: OrderStatus;
};

export default function DashboardHome() {
  // dummy data (nanti dari API GO)
  const stats = {
    totalOrders: 24,
    totalSales: 5200000,
    totalProfit: 1450000,
    pendingOrders: 3,
    tier: "PRO",
  };

  const recentOrders: Order[] = [
    { id: "ORD-10021", total: 250000, status: "paid" },
    { id: "ORD-10022", total: 120000, status: "pending" },
    { id: "ORD-10023", total: 340000, status: "failed" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <p className="text-sm text-slate-500">Welcome back 👋</p>
        <h1 className="text-2xl font-bold text-slate-800">Member Dashboard</h1>

        <div className="mt-2 inline-flex items-center gap-2 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
          Tier: {stats.tier}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Package size={18} />}
        />

        <StatCard
          title="Total Sales"
          value={`Rp ${stats.totalSales.toLocaleString("id-ID")}`}
          icon={<ShoppingBag size={18} />}
        />

        <StatCard
          title="Total Profit"
          value={`Rp ${stats.totalProfit.toLocaleString("id-ID")}`}
          icon={<TrendingUp size={18} />}
        />

        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Clock size={18} />}
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Wallet size={18} />
          Recent Orders
        </h2>

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-800">{order.id}</p>
                <p className="text-xs text-slate-500">{order.status}</p>
              </div>

              <p className="font-semibold text-slate-800">
                Rp {order.total.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD COMPONENT
========================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
