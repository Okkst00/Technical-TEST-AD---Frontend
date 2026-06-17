"use client";

import { useEffect, useState } from "react";
import { Package, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8080";

type Category = "Herbal" | "Otomotif" | "Fashion" | "Pet" | "Lainnya";

type Product = {
  id: number;
  nama_produk: string;
  kategori: Category;
  harga_modal: number;
  stok: number;
  status: boolean;
};

export default function ProductPage() {
  const [showForm, setShowForm] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState({
    nama_produk: "",
    kategori: "Herbal" as Category,
    harga_modal: "",
    stok: "",
    status: true,
  });

  function getToken() {
    return localStorage.getItem("token");
  }

  async function fetchProducts() {
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Gagal mengambil data");
        return;
      }

      setProducts(json.data || []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function addProduct() {
    const token = getToken();

    if (!token) {
      alert("Token tidak ditemukan");
      return;
    }

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        nama_produk: form.nama_produk,
        kategori: form.kategori,
        harga_modal: Number(form.harga_modal),
        stok: Number(form.stok),
        status: form.status,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Gagal membuat produk");

      return;
    }

    await fetchProducts();

    setForm({
      nama_produk: "",
      kategori: "Herbal",
      harga_modal: "",
      stok: "",
      status: true,
    });

    setShowForm(false);
  }

  async function toggleStatus(product: Product) {
    const token = getToken();

    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        nama_produk: product.nama_produk,

        kategori: product.kategori,

        harga_modal: product.harga_modal,

        stok: product.stok,

        status: !product.status,
      }),
    });

    if (!res.ok) {
      const data = await res.json();

      alert(data.message || "Gagal update");

      return;
    }

    await fetchProducts();
  }

  async function deleteProduct(id: number) {
    const token = getToken();

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();

      alert(data.message || "Gagal hapus");

      return;
    }

    await fetchProducts();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-3xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
              <Package />
            </div>

            <div>
              <h1 className="text-xl font-bold">Product Management</h1>

              <p className="text-sm text-slate-400">Manage all products</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-md"
          >
            <Plus size={18} />
            Create Product
          </button>
        </div>

        {showForm && (
          <div className="mt-6 bg-white shadow-md rounded-3xl p-6 space-y-4">
            <h2 className="font-bold text-lg">Create Product</h2>

            <input
              name="nama_produk"
              value={form.nama_produk}
              onChange={handleChange}
              placeholder="Nama Produk"
              className="w-full p-3 rounded-2xl bg-slate-50"
            />

            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl bg-slate-50"
            >
              <option>Herbal</option>
              <option>Otomotif</option>
              <option>Fashion</option>
              <option>Pet</option>
              <option>Lainnya</option>
            </select>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="harga_modal"
                type="number"
                value={form.harga_modal}
                onChange={handleChange}
                placeholder="Harga Modal"
                className="p-3 rounded-2xl bg-slate-50"
              />

              <input
                name="stok"
                type="number"
                value={form.stok}
                onChange={handleChange}
                placeholder="Stok"
                className="p-3 rounded-2xl bg-slate-50"
              />
            </div>

            <button
              onClick={addProduct}
              className="w-full py-3 bg-emerald-500 text-white rounded-2xl"
            >
              Simpan Produk
            </button>
          </div>
        )}

        <div className="mt-6 bg-white shadow-md rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-4">Nama</th>

                <th>Kategori</th>

                <th>Harga</th>

                <th>Stok</th>

                <th>Status</th>

                <th className="text-right pr-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-medium">{p.nama_produk}</td>

                  <td>{p.kategori}</td>

                  <td>Rp {p.harga_modal.toLocaleString("id-ID")}</td>

                  <td>{p.stok}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        p.status
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {p.status ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  <td className="text-right pr-4 flex justify-end gap-3">
                    <button
                      onClick={() => toggleStatus(p)}
                      className="text-emerald-600"
                    >
                      {p.status ? <ToggleRight /> : <ToggleLeft />}
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
