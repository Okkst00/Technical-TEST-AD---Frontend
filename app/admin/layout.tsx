"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, DoorClosed, LayoutDashboard, ShoppingBag } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  async function handleLogout() {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      router.push("/auth/sign-in");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm p-5 sticky top-6">
            <div className="mb-6">
              <p className="text-xs text-slate-400">Member Area</p>
              <h2 className="text-lg font-bold text-slate-800">Dashboard</h2>
            </div>

            <nav className="space-y-2">
              {/* DASHBOARD */}
              <Link href="/admin/dashboard">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition cursor-pointer
                  ${
                    isActive("/admin/dashboard")
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </div>
              </Link>

              {/* ORDERS */}
              <Link href="/admin/orders">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition cursor-pointer
                  ${
                    isActive("/admin/orders")
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <ShoppingBag size={18} />
                  Order History
                </div>
              </Link>

              <Link href="/admin/products">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition cursor-pointer
                  ${
                    isActive("/admin/products")
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Box size={18} />
                  Products
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                  mt-5
                  bg-slate-50
                  text-slate-700
                  hover:bg-slate-100
                "
              >
                <DoorClosed size={18} />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="lg:col-span-3">{children}</section>
      </div>
    </main>
  );
}
