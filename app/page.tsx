"use client";

import { Search, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        const json = await res.json();

        if (json.success) {
          setProducts(json.data || []);
        } else {
          setProducts([]);
          console.log("API Error:", json.error);
        }
      } catch (err) {
        console.log("Gagal ambil produk:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-5">
          {/* Logo */}
          <div className="text-2xl font-bold text-emerald-600">
            ShipCommerce
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search product..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>
          </div>

          {/* Profile */}
          <Link
            href="/member/dashboard"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition"
          >
            <User size={20} />
            <span className="text-sm font-medium">My Profile</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 text-white shadow-lg">
          <h1 className="text-4xl font-bold">Find Your Favorite Product</h1>

          <p className="mt-3 text-white/80 max-w-xl">
            Discover quality products with fast and reliable shipping through
            ShipCommerce.
          </p>

          <button className="mt-6 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition">
            Explore Product
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Featured Products
        </h2>

        {loading ? (
          <p className="text-slate-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-5xl">
                  📦
                </div>

                <div className="p-5">
                  <p className="text-xs text-emerald-600 font-medium">
                    {product.kategori || product.category}
                  </p>

                  <h3 className="font-semibold text-slate-900 mt-2">
                    {product.nama_produk || product.name}
                  </h3>

                  <p className="text-xl font-bold mt-3">
                    Rp{" "}
                    {(product.harga_modal || product.price).toLocaleString(
                      "id-ID",
                    )}
                  </p>

                  <Link
                    href={`/product/${product.id}`}
                    className="mt-4 block w-full text-center py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold">ShipCommerce</h3>
            <p className="text-slate-400 text-sm mt-3">
              Simple commerce platform for modern business.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <p className="text-slate-400 text-sm">About Us</p>
            <p className="text-slate-400 text-sm">Contact</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <p className="text-slate-400 text-sm">Help Center</p>
            <p className="text-slate-400 text-sm">Shipping Information</p>
          </div>
        </div>

        <div className="border-t border-slate-800 text-center py-5 text-sm text-slate-500">
          © 2026 ShipCommerce. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
