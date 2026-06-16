"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const API_URL = "http://localhost:8080";

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();

  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/products/${params.id}`);
        const json = await res.json();

        if (json.success) {
          setProduct(json.data);
        } else {
          setProduct(null);
          console.log("API Error:", json.error);
        }
      } catch (err) {
        console.log("error fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) fetchProduct();
  }, [params?.id]);

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  }

  function buyNow() {
    router.push(`/checkout/${product.id}?qty=${qty}`);
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">Product not found</div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100 p-6 grid md:grid-cols-2 gap-8">
        {/* IMAGE */}
        <div className="h-96 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-8xl">
          📦
        </div>

        {/* DETAIL */}
        <div className="flex flex-col">
          <p className="text-sm text-emerald-600 font-medium">
            {product.kategori}
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            {product.nama_produk}
          </h1>

          <p className="text-3xl font-bold text-emerald-600 mt-5">
            {formatRupiah(product.harga_modal)}
          </p>

          <p className="text-slate-500 mt-5 leading-relaxed">
            {product.deskripsi || "-"}
          </p>

          {/* QTY */}
          <div className="mt-8">
            <p className="font-semibold mb-3">Quantity</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => qty > 1 && setQty(qty - 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <Minus size={18} />
              </button>

              <div className="w-14 text-center font-bold text-xl">{qty}</div>

              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-6 bg-slate-50 rounded-2xl p-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">
                {formatRupiah(product.harga_modal * qty)}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={buyNow}
            className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold"
          >
            <ShoppingBag size={20} />
            Beli Sekarang
          </button>
        </div>
      </div>
    </main>
  );
}
