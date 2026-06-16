"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Landmark,
  Mail,
  Phone,
  QrCode,
  User,
  Wallet,
} from "lucide-react";

const API_URL = "http://localhost:8080";

type PaymentMethod = "bank_transfer" | "ewallet" | "qris";

interface Product {
  id: number;
  nama_produk: string;
  harga_modal: number;
}

interface CalculateResult {
  diskon_hpp_percent: number;
  diskon_hpp_amount: number;
  total_modal: number;
  total_jual: number;
  fee_transaksi: number;
  profit_member: number;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const paymentMethods = [
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Virtual Account",
    icon: <Landmark size={22} />,
    channels: [
      "BCA Virtual Account",
      "Mandiri Virtual Account",
      "BNI Virtual Account",
    ],
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    description: "Digital Wallet",
    icon: <Wallet size={22} />,
    channels: ["GoPay", "DANA", "OVO"],
  },
  {
    id: "qris",
    name: "QRIS",
    description: "Scan QR Payment",
    icon: <QrCode size={22} />,
    channels: ["QRIS"],
  },
];

const paymentMethodMap = {
  bank_transfer: 1,
  ewallet: 2,
  qris: 3,
};

const paymentOptionMap: any = {
  "BCA Virtual Account": 1,
  "Mandiri Virtual Account": 2,
  "BNI Virtual Account": 3,
  GoPay: 4,
  DANA: 5,
  OVO: 6,
  QRIS: 7,
};

export default function CheckoutPage() {
  const router = useRouter();

  const params = useParams();

  const searchParams = useSearchParams();

  const productId = params.id;

  const qty = Number(searchParams.get("qty") || 1);

  const [product, setProduct] = useState<Product | null>(null);

  const [hargaJual, setHargaJual] = useState<number>(0);

  const [calculate, setCalculate] = useState<CalculateResult>({
    diskon_hpp_percent: 0,
    diskon_hpp_amount: 0,
    total_modal: 0,
    total_jual: 0,
    fee_transaksi: 0,
    profit_member: 0,
  });

  const [member, setMember] = useState({
    id: 0,
    name: "",
    level: "basic",
  });

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [selectedPayment, setSelectedPayment] = useState({
    method: "bank_transfer" as PaymentMethod,
    channel: "BCA Virtual Account",
  });

  const [openMethod, setOpenMethod] = useState<PaymentMethod | null>(
    "bank_transfer",
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`${API_URL}/products/${productId}`);
      const json = await response.json();

      if (json.success) {
        setProduct(json.data);
      } else {
        setProduct(null);
        console.log("API Error:", json.error);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const data = JSON.parse(user);

      setMember({
        id: data.id,
        name: data.name,
        level: data.membership_name || "basic",
      });
    }
  }, []);

  async function calculateCheckout() {
    if (!product) {
      return;
    }

    // reset ketika harga jual kosong / 0
    if (hargaJual <= 0) {
      setCalculate({
        diskon_hpp_percent: 0,
        diskon_hpp_amount: 0,
        total_modal: 0,
        total_jual: 0,
        fee_transaksi: 0,
        profit_member: 0,
      });

      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      user_id: user.id,

      items: [
        {
          product_id: product.id,
          qty,
          harga_jual: hargaJual,
        },
      ],
    };

    const res = await fetch(`${API_URL}/checkout/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setCalculate({
        diskon_hpp_percent: data.diskon_hpp_percent || 0,

        diskon_hpp_amount: data.diskon_hpp_amount || 0,

        total_modal: data.total_modal || 0,

        total_jual: data.total_jual || 0,

        fee_transaksi: data.fee_transaksi || 0,

        profit_member: data.profit_member || 0,
      });
    }
  }

  useEffect(() => {
    calculateCheckout();
  }, [product, hargaJual, qty]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  }

  async function checkout() {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        order: {
          user_id: user.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          shipping_address: customer.address,

          payment_method_id: paymentMethodMap[selectedPayment.method],

          payment_option_id: paymentOptionMap[selectedPayment.channel],

          status: "pending",
        },

        items: [
          {
            product_id: product!.id,
            qty: qty,
            harga_jual: hargaJual,
          },
        ],
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal membuat order");
        return;
      }

      router.push(`/payment/${data.order_id}`);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-slate-500">Loading product...</div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* MEMBER */}
        <div className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-4 mb-6">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
            <User />
          </div>

          <div>
            <p className="text-xs text-slate-400">Order By Member</p>

            <h2 className="font-bold text-lg">{member.name}</h2>

            <p className="text-sm text-emerald-600">Level {member.level}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* CUSTOMER */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="font-bold text-lg mb-5">Customer Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  icon={<User size={18} />}
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                />

                <Input
                  icon={<Phone size={18} />}
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                />

                <Input
                  icon={<Mail size={18} />}
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                />

                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  placeholder="Alamat pengiriman"
                  className="
                  md:col-span-2
                  w-full
                  h-28
                  p-4
                  rounded-2xl
                  bg-slate-50
                "
                />
              </div>
            </div>

            {/* PRODUCT */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="font-bold text-lg mb-4">Product</h2>

              <div className="bg-white rounded-3xl shadow-md p-5">
                <div className="flex items-center gap-5">
                  {/* IMAGE */}
                  <div className="w-26 h-26 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-5xl shrink-0">
                    📦
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800">
                      {product.nama_produk}
                    </h3>

                    <div className="mt-3 inline-flex px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium">
                      Qty : {qty}
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="w-52 space-y-4">
                    {/* HARGA MODAL */}
                    <div>
                      <p className="text-xs text-slate-400">Harga Modal</p>

                      <p className="font-bold text-slate-700">
                        Rp {product.harga_modal.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* HARGA JUAL */}
                    <div>
                      <p className="text-xs text-slate-400">Harga Jual</p>

                      <input
                        type="number"
                        value={hargaJual}
                        onChange={(e) => setHargaJual(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal Modal Normal</span>

                <span>
                  Rp {(product.harga_modal * qty).toLocaleString("id-ID")}
                </span>
              </div>

              {calculate.diskon_hpp_amount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>
                    Diskon HPP Member ({calculate.diskon_hpp_percent}%)
                  </span>

                  <span>
                    - Rp {calculate.diskon_hpp_amount.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-semibold">
                <span>Harga Modal Member</span>

                <span>Rp {calculate.total_modal.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span>Harga Penjualan</span>

                <span>Rp {calculate.total_jual.toLocaleString("id-ID")}</span>
              </div>

              {calculate.fee_transaksi > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Fee Transaksi</span>

                  <span>
                    Rp {calculate.fee_transaksi.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Profit Member</span>

                <span className="text-emerald-600">
                  Rp {calculate.profit_member.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl shadow-md p-6 h-fit">
            <h2 className="font-bold text-lg mb-5">Payment Method</h2>

            <div className="space-y-3">
              {paymentMethods.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenMethod(
                        openMethod === item.id
                          ? null
                          : (item.id as PaymentMethod),
                      )
                    }
                    className="
                    w-full
                    flex
                    justify-between
                    p-4
                  "
                  >
                    <div className="flex gap-3 items-center">
                      {item.icon}

                      <div>
                        <p className="font-semibold">{item.name}</p>

                        <p className="text-xs text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronDown />
                  </button>

                  {openMethod === item.id && (
                    <div className="p-3 space-y-2">
                      {item.channels.map((channel) => (
                        <button
                          key={channel}
                          onClick={() =>
                            setSelectedPayment({
                              method: item.id as PaymentMethod,
                              channel,
                            })
                          }
                          className="
                              w-full
                              flex
                              justify-between
                              p-3
                              rounded-xl
                              bg-slate-50
                            "
                        >
                          {channel}

                          {selectedPayment.channel === channel && (
                            <Check size={16} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={checkout}
              disabled={loading}
              className="
              mt-6
              w-full
              py-4
              rounded-2xl
              bg-emerald-600
              text-white
              font-semibold
            "
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Input({ icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-emerald-600">{icon}</div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50"
      />
    </div>
  );
}
