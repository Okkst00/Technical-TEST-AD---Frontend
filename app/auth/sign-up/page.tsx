"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8080";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitRegister() {
    setLoading(true);

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/auth/sign-in");
    } else {
      alert("Register gagal");
    }
  }

  return (
    <main
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-white
      to-emerald-50
      flex
      items-center
      justify-center
      p-6
    "
    >
      <div
        className="
        bg-white
        w-full
        max-w-md
        rounded-3xl
        shadow-md
        p-6
      "
      >
        <div className="text-center mb-6">
          <div
            className="
            mx-auto
            w-14
            h-14
            bg-emerald-100
            text-emerald-600
            rounded-2xl
            flex
            items-center
            justify-center
          "
          >
            <UserPlus />
          </div>

          <h1
            className="
            text-xl
            font-bold
            mt-4
          "
          >
            Create Account
          </h1>

          <p
            className="
            text-sm
            text-slate-400
          "
          >
            Register as member
          </p>
        </div>

        <div className="space-y-4">
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="
              w-full
              p-3
              rounded-2xl
              bg-slate-50
              outline-none
            "
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="
              w-full
              p-3
              rounded-2xl
              bg-slate-50
              outline-none
            "
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="
              w-full
              p-3
              rounded-2xl
              bg-slate-50
              outline-none
            "
          />

          <button
            onClick={submitRegister}
            disabled={loading}
            className="
              w-full
              py-3
              bg-emerald-500
              text-white
              rounded-2xl
              font-semibold
            "
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </div>

        <p
          className="
          text-center
          text-sm
          mt-5
          text-slate-500
        "
        >
          Already have account?
          <Link
            href="/login"
            className="
              text-emerald-600
              ml-1
              font-semibold
            "
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
